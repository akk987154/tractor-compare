"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { tractors, compareFields } from "@/data/tractors";
import CompareSelect from "@/components/CompareSelect";
import SpecTable from "@/components/SpecTable";
import RadarChart from "@/components/RadarChart";
import WinnerPanel from "@/components/WinnerPanel";
import ShareButton from "@/components/ShareButton";
import HistoryPanel from "@/components/HistoryPanel";

interface Props {
  initialLeft?: string;
  initialRight?: string;
}

export default function CompareClient({ initialLeft, initialRight }: Props) {
  const router = useRouter();
  const [leftId, setLeftId] = useState<string | null>(null);
  const [rightId, setRightId] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  // 从 server props 初始化选中状态
  useEffect(() => {
    if (initialized) return;
    if (initialLeft && tractors.some((t) => t.id === initialLeft)) {
      setLeftId(initialLeft);
    }
    if (initialRight && tractors.some((t) => t.id === initialRight)) {
      setRightId(initialRight);
    }
    setInitialized(true);
  }, [initialLeft, initialRight, initialized]);

  // 同步 URL 参数
  const updateURL = useCallback(
    (left: string | null, right: string | null) => {
      const params = new URLSearchParams();
      if (left) params.set("left", left);
      if (right) params.set("right", right);
      const qs = params.toString();
      router.replace(qs ? `/compare?${qs}` : "/compare", { scroll: false });
    },
    [router]
  );

  const handleLeftSelect = useCallback(
    (id: string) => {
      setLeftId(id || null);
      updateURL(id || null, rightId);
    },
    [rightId, updateURL]
  );

  const handleRightSelect = useCallback(
    (id: string) => {
      setRightId(id || null);
      updateURL(leftId, id || null);
    },
    [leftId, updateURL]
  );

  const left = leftId ? tractors.find((t) => t.id === leftId) : null;
  const right = rightId ? tractors.find((t) => t.id === rightId) : null;
  const bothSelected = left && right;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 mb-2">
          拖拉机规格对比
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          选择两台拖拉机，查看详细参数对比、雷达图和智能胜出分析
        </p>
      </div>

      {/* Selectors */}
      <div className="flex flex-col lg:flex-row gap-6 mb-10">
        <CompareSelect
          side="left"
          selectedId={leftId}
          onSelect={handleLeftSelect}
          otherId={rightId}
        />
        <div className="flex items-center justify-center lg:pt-16">
          <span className="text-3xl font-black text-zinc-300 dark:text-zinc-600">VS</span>
        </div>
        <CompareSelect
          side="right"
          selectedId={rightId}
          onSelect={handleRightSelect}
          otherId={leftId}
        />
      </div>

      {/* Results — 两台都选中时展示 */}
      {bothSelected && (
        <div className="space-y-10 animate-in fade-in">
          {/* Action Bar — 分享 + 查看历史 */}
          <div className="flex items-center justify-end gap-3">
            <ShareButton left={left!} right={right!} />
          </div>

          {/* Quick Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              {
                label: "马力差距",
                leftVal: left!.horsepower,
                rightVal: right!.horsepower,
                unit: "HP",
              },
              {
                label: "重量差距",
                leftVal: left!.weight,
                rightVal: right!.weight,
                unit: "kg",
                format: (v: number) => (v / 1000).toFixed(1) + "吨",
              },
              {
                label: "提升能力差距",
                leftVal: left!.liftCapacity,
                rightVal: right!.liftCapacity,
                unit: "kg",
              },
              {
                label: "液压流量差距",
                leftVal: left!.hydraulicFlow,
                rightVal: right!.hydraulicFlow,
                unit: "L/min",
              },
            ].map((stat, i) => {
              const diff = stat.leftVal - stat.rightVal;
              const leftBetter = diff > 0;
              const rightBetter = diff < 0;
              return (
                <div
                  key={i}
                  className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-center"
                >
                  <p className="text-xs text-zinc-400 mb-1">{stat.label}</p>
                  <p
                    className={`text-2xl font-bold ${
                      leftBetter
                        ? "text-green-600 dark:text-green-400"
                        : rightBetter
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-zinc-500"
                    }`}
                  >
                    {leftBetter ? "+" : ""}
                    {stat.format
                      ? stat.format(Math.abs(diff))
                      : Math.abs(diff).toLocaleString() + stat.unit}
                  </p>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {leftBetter
                      ? `${left!.model} 更强`
                      : rightBetter
                        ? `${right!.model} 更强`
                        : "持平"}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Radar Chart */}
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-6">
            <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-200 mb-4">
              📊 雷达图对比
            </h2>
            <RadarChart left={left!} right={right!} />
          </div>

          {/* Spec Table */}
          <div>
            <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-200 mb-4">
              📋 详细参数对比
            </h2>
            <SpecTable left={left!} right={right!} />
          </div>

          {/* 🏆 场景加权胜出分析 — 替代原来的简单"优势统计" */}
          <WinnerPanel left={left!} right={right!} />

          {/* 传统优势统计（保留为辅助参考） */}
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-6">
            <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-200 mb-4">
              📊 单项参数优势
            </h2>
            <p className="text-xs text-zinc-400 mb-4">
              以下展示每台拖拉机在各项参数上的领先情况，仅供参考。
              更准确的推荐请查看上方"场景加权胜出分析"。
            </p>
            <div className="grid grid-cols-2 gap-6">
              {([left!, right!] as const).map((tractor, ti) => {
                const other = ti === 0 ? right! : left!;
                const wins = compareFields
                  .filter((f) => typeof tractor[f.key] === "number")
                  .filter(
                    (f) =>
                      (tractor[f.key] as number) > (other[f.key] as number)
                  );
                return (
                  <div key={ti}>
                    <p className="font-bold text-sm mb-2 text-zinc-600 dark:text-zinc-400">
                      {tractor.brand} {tractor.model}
                    </p>
                    <div className="space-y-1">
                      {wins.map((f) => (
                        <div
                          key={f.key}
                          className="flex justify-between text-sm py-0.5 px-2 rounded bg-green-50 dark:bg-green-900/20"
                        >
                          <span className="text-zinc-600 dark:text-zinc-400">
                            {f.label}
                          </span>
                          <span className="font-mono font-bold text-green-700 dark:text-green-400">
                            {typeof tractor[f.key] === "number"
                              ? (tractor[f.key] as number).toLocaleString()
                              : String(tractor[f.key])}
                            {f.unit}
                          </span>
                        </div>
                      ))}
                      {wins.length === 0 && (
                        <p className="text-xs text-zinc-400">无优势项</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 空状态 — 未选择两台时展示引导 + 热门对比 + 历史 */}
      {!bothSelected && (
        <div className="space-y-10">
          {/* 空状态引导 */}
          <div className="text-center py-12">
            {!leftId && !rightId ? (
              <>
                <p className="text-6xl mb-4">🚜</p>
                <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-2">
                  请分别选择两台拖拉机开始对比
                </p>
                <p className="text-sm text-zinc-400">
                  使用上方的搜索框或品牌过滤器来选择拖拉机
                </p>
              </>
            ) : (
              <>
                <p className="text-6xl mb-4">👆</p>
                <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-2">
                  已选择一台，请选择另一台完成对比
                </p>
                <p className="text-sm text-zinc-400">
                  在另一侧选择拖拉机即可查看完整对比结果
                </p>
              </>
            )}
          </div>

          {/* 热门对比 */}
          <div>
            <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-200 mb-4 text-center">
              🔥 热门对比推荐
            </h2>
            <PopularComparisons />
          </div>

          {/* 对比历史 */}
          <HistoryPanel
            onSelect={(lId, rId) => {
              setLeftId(lId);
              setRightId(rId);
              updateURL(lId, rId);
            }}
          />
        </div>
      )}
    </div>
  );
}

/**
 * 热门对比组合（内联组件，因为只在空状态时显示）
 */
function PopularComparisons() {
  const router = useRouter();

  const pairs = [
    ["jd-5075e", "mf-4708"],
    ["kubota-m7060", "case-farmall-75c"],
    ["jd-6110m", "nh-t5-100"],
    ["mf-6713s", "case-maxxum-125"],
    ["jd-6175m", "case-puma-185"],
    ["nh-t7-210", "mf-7720s"],
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {pairs.map(([leftId, rightId], i) => {
        const left = tractors.find((t) => t.id === leftId);
        const right = tractors.find((t) => t.id === rightId);
        if (!left || !right) return null;
        return (
          <button
            key={i}
            onClick={() =>
              router.push(`/compare?left=${leftId}&right=${rightId}`)
            }
            className="flex items-center gap-3 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:shadow-md hover:border-green-300 dark:hover:border-green-600 transition-all text-left"
          >
            <div className="flex-1 text-center">
              <p className="text-xs text-zinc-400">{left.brand}</p>
              <p className="font-bold text-zinc-900 dark:text-zinc-100">
                {left.model}
              </p>
              <p className="text-xs text-green-600">{left.horsepower} HP</p>
            </div>
            <span className="text-xl text-zinc-300 dark:text-zinc-600">VS</span>
            <div className="flex-1 text-center">
              <p className="text-xs text-zinc-400">{right.brand}</p>
              <p className="font-bold text-zinc-900 dark:text-zinc-100">
                {right.model}
              </p>
              <p className="text-xs text-blue-600">{right.horsepower} HP</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
