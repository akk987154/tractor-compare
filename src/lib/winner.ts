import type { Tractor } from "@/data/tractors";

/**
 * 使用场景类型
 *
 * 农田作业：犁地/播种/旋耕 → PTO 马力 + 提升力 + 液压流量
 * 运输：拉挂车/转场 → 马力 + 最高速度 + 重量
 * 综合作业：等权平均
 */
export type UseCase = "fieldwork" | "transport" | "general";

/**
 * 每个场景的加权配置
 *
 * 权重参考 README 中的胜出算法说明：
 * - 农田作业：PTO马力 3x + 提升力 2x + 液压流量 2x
 * - 运输：马力 2x + 最高速度 2x + 重量 1x
 * - 综合作业：等权平均
 *
 * 除了加权字段外，其他数值字段使用基础权重 0.5x，
 * 确保核心指标是决策的主要因素，但次要参数仍可作为参考。
 */

interface FieldWeight {
  key: keyof Tractor;
  weight: number;
}

const USE_CASE_WEIGHTS: Record<UseCase, FieldWeight[]> = {
  fieldwork: [
    { key: "ptoHp", weight: 3 },
    { key: "liftCapacity", weight: 2 },
    { key: "hydraulicFlow", weight: 2 },
    { key: "horsepower", weight: 1.5 },
    { key: "weight", weight: 1 },
    { key: "engineDisplacement", weight: 0.5 },
    { key: "fuelCapacity", weight: 0.5 },
  ],
  transport: [
    { key: "horsepower", weight: 2 },
    { key: "maxSpeed", weight: 2 },
    { key: "weight", weight: 1 },
    { key: "fuelCapacity", weight: 0.8 },
    { key: "ptoHp", weight: 0.5 },
    { key: "engineDisplacement", weight: 0.5 },
  ],
  general: [
    { key: "horsepower", weight: 1 },
    { key: "ptoHp", weight: 1 },
    { key: "liftCapacity", weight: 1 },
    { key: "hydraulicFlow", weight: 1 },
    { key: "weight", weight: 1 },
    { key: "maxSpeed", weight: 1 },
    { key: "engineDisplacement", weight: 0.7 },
    { key: "fuelCapacity", weight: 0.5 },
  ],
};

/** 数值字段归一化：值 / 最大可能值 */
function normalizeValue(value: number, max: number): number {
  return max > 0 ? value / max : 0;
}

export interface WinnerResult {
  /** 场景 */
  useCase: UseCase;
  /** 场景中文标签 */
  label: string;
  /** 场景描述 */
  description: string;
  /** 左侧拖拉机加权总分 */
  leftScore: number;
  /** 右侧拖拉机加权总分 */
  rightScore: number;
  /** 胜出方 */
  winner: "left" | "right" | "tie";
  /** 左侧在各加权项的得分详情 */
  leftDetails: { field: string; label: string; score: number; weight: number }[];
  /** 右侧在各加权项的得分详情 */
  rightDetails: { field: string; label: string; score: number; weight: number }[];
}

const USE_CASE_LABELS: Record<UseCase, { label: string; description: string }> = {
  fieldwork: {
    label: "🌾 农田作业",
    description:
      "适合犁地、播种、旋耕等农艺作业。PTO马力决定机具驱动能力，提升力决定能挂载的农机具大小，液压流量影响作业效率。",
  },
  transport: {
    label: "🚛 运输作业",
    description:
      "适合拉挂车转场、运输物料。马力决定负载能力，最高速度影响运输效率，重量反映牵引稳定性。",
  },
  general: {
    label: "🔄 综合作业",
    description: "等权评估所有关键参数，适合既需要农田作业也需要运输的多用途场景。",
  },
};

/** 字段 Key → 中文标签映射 */
const FIELD_LABELS: Partial<Record<keyof Tractor, string>> = {
  horsepower: "发动机马力",
  ptoHp: "PTO马力",
  engineDisplacement: "排量",
  weight: "重量",
  hydraulicFlow: "液压流量",
  liftCapacity: "提升能力",
  maxSpeed: "最高速度",
  fuelCapacity: "油箱容量",
};

/**
 * 获取所有拖拉机中某个数值字段的最大值（用于归一化）
 */
export function getFieldMax(field: keyof Tractor, tractors: Tractor[]): number {
  return Math.max(...tractors.map((t) => t[field] as number), 1);
}

/**
 * 单一场景的胜出判定
 *
 * 算法：
 * 1. 对每个加权字段，取两车中的最大值做归一化基准
 * 2. 每项得分 = (本车值 / 基准值) × 权重
 * 3. 总分 = 各项得分之和
 * 4. 总分高者胜出（差距 < 3% 视为平局）
 */
export function judgeSingleUseCase(
  left: Tractor,
  right: Tractor,
  useCase: UseCase,
  allTractors: Tractor[]
): WinnerResult {
  const weights = USE_CASE_WEIGHTS[useCase];

  let leftScore = 0;
  let rightScore = 0;
  const leftDetails: WinnerResult["leftDetails"] = [];
  const rightDetails: WinnerResult["rightDetails"] = [];

  for (const { key, weight } of weights) {
    const lVal = left[key] as number;
    const rVal = right[key] as number;
    const maxVal = getFieldMax(key, allTractors);

    const lNorm = normalizeValue(lVal, maxVal);
    const rNorm = normalizeValue(rVal, maxVal);

    const lWeighted = lNorm * weight;
    const rWeighted = rNorm * weight;

    leftScore += lWeighted;
    rightScore += rWeighted;

    leftDetails.push({
      field: key,
      label: FIELD_LABELS[key] || key,
      score: lWeighted,
      weight,
    });
    rightDetails.push({
      field: key,
      label: FIELD_LABELS[key] || key,
      score: rWeighted,
      weight,
    });
  }

  // 差距 < 3% 视为平局
  const maxScore = Math.max(leftScore, rightScore);
  const minScore = Math.min(leftScore, rightScore);
  const threshold = maxScore * 0.03;
  const diff = maxScore - minScore;

  let winner: "left" | "right" | "tie";
  if (diff <= threshold) {
    winner = "tie";
  } else {
    winner = leftScore > rightScore ? "left" : "right";
  }

  return {
    useCase,
    label: USE_CASE_LABELS[useCase].label,
    description: USE_CASE_LABELS[useCase].description,
    leftScore: Math.round(leftScore * 100) / 100,
    rightScore: Math.round(rightScore * 100) / 100,
    winner,
    leftDetails,
    rightDetails,
  };
}

/**
 * 综合胜出判定（三个场景汇总）
 *
 * 返回各场景的分项结果和总体推荐。
 * 总体推荐逻辑：三个场景中胜出更多的那个（平局不计入）。
 */
export function judgeWinner(
  left: Tractor,
  right: Tractor,
  allTractors: Tractor[]
): {
  /** 各场景的详细判定结果 */
  results: WinnerResult[];
  /** 三场景总体推荐 */
  overall: {
    winner: "left" | "right" | "tie";
    leftWins: number;
    rightWins: number;
    ties: number;
    summary: string;
  };
} {
  const useCases: UseCase[] = ["fieldwork", "transport", "general"];
  const results = useCases.map((uc) =>
    judgeSingleUseCase(left, right, uc, allTractors)
  );

  const leftWins = results.filter((r) => r.winner === "left").length;
  const rightWins = results.filter((r) => r.winner === "right").length;
  const ties = results.filter((r) => r.winner === "tie").length;

  let winner: "left" | "right" | "tie";
  let summary: string;

  if (leftWins > rightWins) {
    winner = "left";
    summary = `${left.brand} ${left.model} 在 ${leftWins} 个场景中表现更优，综合推荐选择此型号`;
  } else if (rightWins > leftWins) {
    winner = "right";
    summary = `${right.brand} ${right.model} 在 ${rightWins} 个场景中表现更优，综合推荐选择此型号`;
  } else {
    winner = "tie";
    summary = "两台拖拉机在不同场景各有优势，请根据您的实际使用需求选择";
  }

  return {
    results,
    overall: { winner, leftWins, rightWins, ties, summary },
  };
}
