import { Suspense } from "react";
import type { Metadata } from "next";
import { tractors } from "@/data/tractors";
import CompareClient from "./CompareClient";

/**
 * 动态生成页面元数据 — 每个对比对都有独立的 title 和 description
 *
 * 这是当前产品最关键的 SEO 优化：
 * 目标搜索词如 "约翰迪尔 5075E 对比 久保田 M7060" 可以直接命中
 */
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ left?: string; right?: string }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const leftId = params.left;
  const rightId = params.right;

  const left = leftId ? tractors.find((t) => t.id === leftId) : null;
  const right = rightId ? tractors.find((t) => t.id === rightId) : null;

  if (left && right) {
    const title = `${left.brand} ${left.model} 对比 ${right.brand} ${right.model} — 拖拉机规格参数对比`;
    const description = `对比 ${left.brand} ${left.model} (${left.horsepower}HP) 和 ${right.brand} ${right.model} (${right.horsepower}HP) 的详细参数：马力、PTO、重量、液压流量、提升能力等。看看哪款更适合你的需求。`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "website",
        locale: "zh_CN",
      },
      // 告诉搜索引擎这是该对比的规范 URL
      alternates: {
        canonical: `/compare?left=${leftId}&right=${rightId}`,
      },
    };
  }

  return {
    title: "拖拉机规格对比 — TractorCompare",
    description:
      "选择两台拖拉机进行并排对比。支持 John Deere、Kubota、Massey Ferguson、Case IH、New Holland 五大品牌。雷达图 + 智能胜出算法帮你决策。",
    openGraph: {
      title: "拖拉机规格对比 — TractorCompare",
      description:
        "选择两台拖拉机进行并排对比。支持五大品牌、雷达图可视化和智能胜出算法。",
      type: "website",
      locale: "zh_CN",
    },
  };
}

/**
 * 对比页 — 服务器组件包装
 *
 * 使用 Suspense 包裹客户端组件是因为 useSearchParams() 需要 Suspense 边界。
 * 客户端组件 CompareClient 接收 searchParams 作为 props（服务器传入），
 * 避免客户端直接读取 URL 参数。
 */
export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ left?: string; right?: string }>;
}) {
  const params = await searchParams;

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full" />
        </div>
      }
    >
      <CompareClient initialLeft={params.left} initialRight={params.right} />
    </Suspense>
  );
}
