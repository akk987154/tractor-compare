"use client";

import { useState, useCallback } from "react";
import type { Tractor } from "@/data/tractors";

interface Props {
  left: Tractor;
  right: Tractor;
}

/**
 * 分享按钮 — 复制当前对比链接到剪贴板
 *
 * 产品逻辑：
 * - 农机购买是群体决策场景（农户之间互相推荐机型）
 * - 分享功能是开启口碑传播的关键触点
 * - 复制链接是最通用的分享方式（微信、短信、QQ 都支持）
 */
export default function ShareButton({ left, right }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    const url = `${window.location.origin}/compare?left=${left.id}&right=${right.id}`;
    const text = `🚜 ${left.brand} ${left.model} (${left.horsepower}HP) vs ${right.brand} ${right.model} (${right.horsepower}HP) — 拖拉机规格对比\n${url}`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 降级方案：创建临时 textarea
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // 复制失败，静默处理
      }
      document.body.removeChild(textarea);
    }
  }, [left, right]);

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
        copied
          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
      }`}
      aria-label="复制对比链接"
    >
      {copied ? (
        <>
          <span>✅</span>
          已复制链接
        </>
      ) : (
        <>
          <span>🔗</span>
          分享此对比
        </>
      )}
    </button>
  );
}
