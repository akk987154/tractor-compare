"use client";

import type { Tractor } from "@/data/tractors";
import { tractors } from "@/data/tractors";

const STORAGE_KEY = "tractor-compare-history";
const MAX_HISTORY = 10;

export interface HistoryEntry {
  leftId: string;
  rightId: string;
  timestamp: number;
}

/**
 * 获取对比历史（从 localStorage）
 */
export function getHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // 既校验形状，也校验取值确实存在于数据集中。
    // localStorage 可以被用户或其它脚本改写，只校验 typeof 会放过任意字符串；
    // 虽然当前调用链（resolveHistoryEntry → HistoryPanel → updateURL）都有兜底，
    // 但在这里收口更稳妥，也避免以后新增消费方时忘记校验。
    return parsed.filter(
      (e) =>
        e &&
        typeof e.leftId === "string" &&
        typeof e.rightId === "string" &&
        typeof e.timestamp === "number" &&
        tractors.some((t) => t.id === e.leftId) &&
        tractors.some((t) => t.id === e.rightId)
    );
  } catch {
    return [];
  }
}

/**
 * 添加一条对比记录
 */
export function addHistory(leftId: string, rightId: string): void {
  if (typeof window === "undefined") return;
  const history = getHistory();
  // 去重：如果已存在相同配对，移除旧的
  const filtered = history.filter(
    (e) =>
      !(
        (e.leftId === leftId && e.rightId === rightId) ||
        (e.leftId === rightId && e.rightId === leftId)
      )
  );
  filtered.unshift({ leftId, rightId, timestamp: Date.now() });
  // 保留最近 N 条
  const trimmed = filtered.slice(0, MAX_HISTORY);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // localStorage 满或不可用，静默失败
  }
}

/**
 * 解析历史记录中的拖拉机对象
 */
export function resolveHistoryEntry(
  entry: HistoryEntry
): { left: Tractor; right: Tractor } | null {
  const left = tractors.find((t) => t.id === entry.leftId);
  const right = tractors.find((t) => t.id === entry.rightId);
  if (!left || !right) return null;
  return { left, right };
}
