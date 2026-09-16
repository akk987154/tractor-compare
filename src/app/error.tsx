"use client";

import Link from "next/link";

/**
 * 路由级错误兜底。
 * 此前 src/app 下没有 error.tsx，RadarChart / WinnerPanel 里任何一次抛出
 * 都会让整页变成 React 默认错误界面，用户只能刷新。
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <p className="text-5xl mb-4">🚜</p>
      <h1 className="text-xl font-bold text-zinc-800 dark:text-zinc-200 mb-2">
        页面出错了
      </h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
        渲染对比结果时发生了意外错误，可以重试或返回首页。
      </p>
      {error.digest && (
        <p className="text-xs text-zinc-400 mb-6 font-mono">错误编号: {error.digest}</p>
      )}
      <div className="flex gap-3 justify-center">
        <button
          type="button"
          onClick={reset}
          className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors"
        >
          重试
        </button>
        <Link
          href="/"
          className="px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-sm font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
        >
          返回首页
        </Link>
      </div>
    </div>
  );
}
