"use client";

import { useState, useEffect } from "react";
import { getHistory, resolveHistoryEntry, type HistoryEntry } from "@/lib/history";

interface Props {
  onSelect: (leftId: string, rightId: string) => void;
}

/**
 * 对比历史面板
 *
 * 产品逻辑：
 * - 用户购买决策周期通常为数周，期间会多次对比不同型号
 * - 保留最近 10 条对比记录，方便用户快速回到之前的对比
 * - 存储于 localStorage，无需账号系统
 */
export default function HistoryPanel({ onSelect }: Props) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  // 监听 storage 事件（跨标签页同步）
  useEffect(() => {
    const handler = () => setHistory(getHistory());
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  if (history.length === 0) return null;

  return (
    <div>
      <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-200 mb-4 text-center">
        🕐 最近对比
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
        {history.map((entry, i) => {
          const resolved = resolveHistoryEntry(entry);
          if (!resolved) return null;
          const { left, right } = resolved;
          const timeAgo = getTimeAgo(entry.timestamp);
          return (
            <button
              key={i}
              onClick={() => onSelect(entry.leftId, entry.rightId)}
              className="flex items-center gap-3 p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:shadow-sm hover:border-green-300 dark:hover:border-green-600 transition-all text-left"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                    {left.model}
                  </span>
                  <span className="text-xs text-zinc-300 dark:text-zinc-600 flex-shrink-0">
                    VS
                  </span>
                  <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                    {right.model}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {left.brand} · {right.brand}
                </p>
              </div>
              <span className="text-xs text-zinc-400 flex-shrink-0">{timeAgo}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** 相对时间格式化（中文） */
function getTimeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "刚刚";
  if (minutes < 60) return `${minutes}分钟前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}小时前`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}天前`;
  const weeks = Math.floor(days / 7);
  return `${weeks}周前`;
}
