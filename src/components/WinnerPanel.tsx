"use client";

import { useState } from "react";
import type { Tractor } from "@/data/tractors";
import { tractors } from "@/data/tractors";
import { judgeWinner, type UseCase } from "@/lib/winner";
import { addHistory } from "@/lib/history";

interface Props {
  left: Tractor;
  right: Tractor;
}

const USE_CASE_TABS: { key: UseCase; label: string }[] = [
  { key: "fieldwork", label: "🌾 农田作业" },
  { key: "transport", label: "🚛 运输作业" },
  { key: "general", label: "🔄 综合作业" },
];

export default function WinnerPanel({ left, right }: Props) {
  const [activeTab, setActiveTab] = useState<UseCase>("fieldwork");

  // 执行场景加权判定
  const { results, overall } = judgeWinner(left, right, tractors);

  // 记录对比历史
  useState(() => {
    addHistory(left.id, right.id);
  });

  const current = results.find((r) => r.useCase === activeTab)!;

  const scoreMax = Math.max(current.leftScore, current.rightScore, 0.1);

  return (
    <div className="rounded-xl border-2 border-amber-200 dark:border-amber-800 bg-white dark:bg-zinc-800 overflow-hidden">
      {/* 总体结论横幅 */}
      <div className="bg-amber-50 dark:bg-amber-900/20 px-6 py-4 border-b border-amber-200 dark:border-amber-800">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏆</span>
          <div>
            <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">
              场景加权胜出分析
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-0.5">
              {overall.summary}
            </p>
          </div>
        </div>
      </div>

      {/* 场景 Tab 切换 */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-700">
        {USE_CASE_TABS.map((tab) => {
          const result = results.find((r) => r.useCase === tab.key)!;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-all relative ${
                isActive
                  ? "text-zinc-900 dark:text-zinc-100"
                  : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              }`}
            >
              {tab.label}
              {/* 小徽标：显示哪方胜出 */}
              <span
                className={`ml-1.5 inline-block w-2 h-2 rounded-full ${
                  result.winner === "left"
                    ? "bg-green-500"
                    : result.winner === "right"
                      ? "bg-blue-500"
                      : "bg-zinc-300 dark:bg-zinc-600"
                }`}
              />
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500" />
              )}
            </button>
          );
        })}
      </div>

      {/* 场景描述 */}
      <div className="px-6 py-3 bg-zinc-50 dark:bg-zinc-800/50">
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {current.description}
        </p>
      </div>

      {/* 得分对比 */}
      <div className="px-6 py-5 space-y-5">
        {/* 总分对比条 */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="font-semibold text-green-700 dark:text-green-400">
              {left.brand} {left.model}
            </span>
            <span className="text-xs text-zinc-400">综合得分</span>
            <span className="font-semibold text-blue-700 dark:text-blue-400">
              {right.brand} {right.model}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono font-bold text-green-600 dark:text-green-400 w-14 text-right">
              {current.leftScore}
            </span>
            <div className="flex-1 h-5 bg-zinc-100 dark:bg-zinc-700 rounded-full overflow-hidden flex">
              <div
                className="h-full bg-green-500 transition-all duration-500"
                style={{
                  width: `${(current.leftScore / (scoreMax * 2)) * 100}%`,
                }}
              />
              <div
                className="h-full bg-blue-500 transition-all duration-500"
                style={{
                  width: `${(current.rightScore / (scoreMax * 2)) * 100}%`,
                }}
              />
            </div>
            <span className="text-sm font-mono font-bold text-blue-600 dark:text-blue-400 w-14">
              {current.rightScore}
            </span>
          </div>
          {/* 胜出标记 */}
          <div className="text-center mt-1.5">
            {current.winner === "left" ? (
              <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-0.5 rounded-full">
                🏆 {left.model} 更适合此场景
              </span>
            ) : current.winner === "right" ? (
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-0.5 rounded-full">
                🏆 {right.model} 更适合此场景
              </span>
            ) : (
              <span className="text-xs font-semibold text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-3 py-0.5 rounded-full">
                🤝 此场景下难分伯仲
              </span>
            )}
          </div>
        </div>

        {/* 分项得分详情 */}
        <div>
          <p className="text-xs font-semibold text-zinc-400 mb-3">
            各参数加权得分（权重 × 归一化值）
          </p>
          <div className="space-y-2">
            {current.leftDetails.map((detail, i) => {
              const rDetail = current.rightDetails[i];
              const maxDetail = Math.max(detail.score, rDetail.score, 0.01);
              return (
                <div key={detail.field}>
                  <div className="flex justify-between text-xs mb-0.5">
                    <span className="text-zinc-500 dark:text-zinc-400">
                      {detail.label}
                      <span className="text-zinc-300 dark:text-zinc-600 ml-1">
                        (×{detail.weight})
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono text-green-600 dark:text-green-400 w-10 text-right">
                      {detail.score.toFixed(1)}
                    </span>
                    <div className="flex-1 flex gap-0.5">
                      <div
                        className="h-3 bg-green-400 rounded-sm transition-all"
                        style={{
                          width: `${(detail.score / maxDetail) * 50}%`,
                        }}
                      />
                      <div
                        className="h-3 bg-blue-400 rounded-sm transition-all"
                        style={{
                          width: `${(rDetail.score / maxDetail) * 50}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs font-mono text-blue-600 dark:text-blue-400 w-10">
                      {rDetail.score.toFixed(1)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 场景汇总 */}
      <div className="px-6 py-3 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-200 dark:border-zinc-700">
        <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center">
          {overall.leftWins} : {overall.rightWins} : {overall.ties}
          {" — "}
          {left.model} 胜 {overall.leftWins} 场景 · {right.model} 胜{" "}
          {overall.rightWins} 场景 · {overall.ties} 平局
        </p>
      </div>
    </div>
  );
}
