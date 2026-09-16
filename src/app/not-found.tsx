import Link from "next/link";

/**
 * 404 页面。
 * 此前 src/app 下没有 not-found.tsx，访问不存在的路径会落到 Next.js 的默认 404，
 * 与本站的视觉风格完全脱节，也没有回到对比页的入口。
 */
export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <p className="text-5xl mb-4">🚜</p>
      <h1 className="text-xl font-bold text-zinc-800 dark:text-zinc-200 mb-2">
        没有找到这个页面
      </h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
        链接可能已失效，或者该机型尚未收录。
      </p>
      <Link
        href="/compare"
        className="inline-block px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors"
      >
        去对比拖拉机
      </Link>
    </div>
  );
}
