"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { tractors, brands, categories } from "@/data/tractors";
import TractorCard from "@/components/TractorCard";
import BrandFilter from "@/components/BrandFilter";

export default function Home() {
  const router = useRouter();
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return tractors.filter((t) => {
      if (selectedBrands.length > 0 && !selectedBrands.includes(t.brand)) return false;
      if (selectedCategory && t.category !== selectedCategory) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          t.brand.toLowerCase().includes(q) ||
          t.model.toLowerCase().includes(q) ||
          t.series.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedBrands, selectedCategory, search]);

  const popularPairs = [
    ["jd-5075e", "mf-4708"],
    ["kubota-m7060", "case-farmall-75c"],
    ["jd-6110m", "nh-t5-100"],
    ["mf-6713s", "case-maxxum-125"],
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-b from-green-50 to-white dark:from-green-950/20 dark:to-zinc-950 px-4 py-20 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 mb-4">
          🚜 拖拉机规格对比工具
        </h1>
        <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto mb-8">
          并排对比 John Deere、Kubota、Massey Ferguson、Case IH、New Holland 等主流品牌的关键规格参数
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (filtered.length >= 2) {
              router.push(`/compare?left=${filtered[0].id}&right=${filtered[1].id}`);
            }
          }}
          className="flex items-center max-w-md mx-auto gap-2"
        >
          <input
            type="text"
            placeholder="搜索品牌、型号或系列..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors text-sm"
          >
            开始对比
          </button>
        </form>
      </section>

      {/* Main Content */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        {/* Filters */}
        <div className="mb-8 space-y-4">
          <BrandFilter selected={selectedBrands} onChange={setSelectedBrands} />
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory("")}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                !selectedCategory
                  ? "bg-green-600 text-white"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              }`}
            >
              全部类型
            </button>
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat.key
                    ? "bg-green-600 text-white"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tractor Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((t) => (
            <TractorCard key={t.id} tractor={t} />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-16 text-zinc-400">
              <p className="text-4xl mb-4">🔍</p>
              <p>没有找到匹配的拖拉机，尝试调整筛选条件</p>
            </div>
          )}
        </div>

        {/* Popular Comparisons */}
        <div className="mt-16">
          <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-200 mb-6">
            🔥 热门对比组合
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {popularPairs.map(([leftId, rightId], i) => {
              const left = tractors.find((t) => t.id === leftId);
              const right = tractors.find((t) => t.id === rightId);
              if (!left || !right) return null;
              return (
                <button
                  key={i}
                  onClick={() => router.push(`/compare?left=${leftId}&right=${rightId}`)}
                  className="flex items-center gap-3 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:shadow-md hover:border-green-300 dark:hover:border-green-600 transition-all text-left"
                >
                  <div className="flex-1 text-center">
                    <p className="text-xs text-zinc-400">{left.brand}</p>
                    <p className="font-bold text-zinc-900 dark:text-zinc-100">{left.model}</p>
                    <p className="text-xs text-green-600">{left.horsepower} HP</p>
                  </div>
                  <span className="text-xl text-zinc-300 dark:text-zinc-600">VS</span>
                  <div className="flex-1 text-center">
                    <p className="text-xs text-zinc-400">{right.brand}</p>
                    <p className="font-bold text-zinc-900 dark:text-zinc-100">{right.model}</p>
                    <p className="text-xs text-blue-600">{right.horsepower} HP</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
