"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { tractors } from "@/data/tractors";
import CompareSelect from "@/components/CompareSelect";
import SpecTable from "@/components/SpecTable";
import RadarChart from "@/components/RadarChart";
import { compareFields } from "@/data/tractors";

function CompareContent() {
  const searchParams = useSearchParams();
  const [leftId, setLeftId] = useState<string | null>(null);
  const [rightId, setRightId] = useState<string | null>(null);

  useEffect(() => {
    const l = searchParams.get("left");
    const r = searchParams.get("right");
    if (l && tractors.some((t) => t.id === l)) setLeftId(l);
    if (r && tractors.some((t) => t.id === r)) setRightId(r);
  }, [searchParams]);

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
          选择两台拖拉机，查看详细参数对比和雷达图
        </p>
      </div>

      {/* Selectors */}
      <div className="flex flex-col lg:flex-row gap-6 mb-10">
        <CompareSelect side="left" selectedId={leftId} onSelect={setLeftId} otherId={rightId} />
        <div className="flex items-center justify-center lg:pt-16">
          <span className="text-3xl font-black text-zinc-300 dark:text-zinc-600">VS</span>
        </div>
        <CompareSelect side="right" selectedId={rightId} onSelect={setRightId} otherId={leftId} />
      </div>

      {/* Results */}
      {bothSelected && (
        <div className="space-y-10 animate-in fade-in">
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

          {/* Winner Summary */}
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-6">
            <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-200 mb-4">
              🏆 优势统计
            </h2>
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
                          <span className="text-zinc-600 dark:text-zinc-400">{f.label}</span>
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

      {!bothSelected && (
        <div className="text-center py-20 text-zinc-400">
          <p className="text-6xl mb-4">👆</p>
          <p className="text-lg">请分别选择两台拖拉机开始对比</p>
        </div>
      )}
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full" />
        </div>
      }
    >
      <CompareContent />
    </Suspense>
  );
}
