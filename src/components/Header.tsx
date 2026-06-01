"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Header() {
  const pathname = usePathname();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-zinc-900/90 backdrop-blur border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-green-700 dark:text-green-400">
          🚜 TractorCompare
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link
            href="/"
            className={`hover:text-green-600 transition-colors ${pathname === "/" ? "text-green-600 font-semibold" : "text-zinc-600 dark:text-zinc-400"}`}
          >
            首页
          </Link>
          <Link
            href="/compare"
            className={`hover:text-green-600 transition-colors ${pathname === "/compare" ? "text-green-600 font-semibold" : "text-zinc-600 dark:text-zinc-400"}`}
          >
            对比
          </Link>
          <button
            onClick={toggleDark}
            className="ml-2 p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
            aria-label="切换深色模式"
          >
            {dark ? "☀️" : "🌙"}
          </button>
        </nav>
      </div>
    </header>
  );
}
