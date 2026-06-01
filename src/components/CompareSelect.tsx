"use client";

import { useState, useMemo } from "react";
import { tractors, brands, type Tractor } from "@/data/tractors";
import TractorCard from "./TractorCard";

interface Props {
  side: "left" | "right";
  selectedId: string | null;
  onSelect: (id: string) => void;
  otherId: string | null;
}

export default function CompareSelect({ side, selectedId, onSelect, otherId }: Props) {
  const [search, setSearch] = useState("");
  const [brandFilter, setBrandFilter] = useState<string>("");

  const filtered = useMemo(() => {
    return tractors.filter((t) => {
      if (otherId && t.id === otherId) return false;
      if (brandFilter && t.brand !== brandFilter) return false;
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
  }, [search, brandFilter, otherId]);

  const selected = selectedId ? tractors.find((t) => t.id === selectedId) : null;

  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-2">
        <span
          className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-white text-sm font-bold ${
            side === "left" ? "bg-green-600" : "bg-blue-600"
          }`}
        >
          {side === "left" ? "A" : "B"}
        </span>
        <h3 className="font-semibold text-zinc-800 dark:text-zinc-200">
          {side === "left" ? "拖拉机 A" : "拖拉机 B"}
        </h3>
      </div>

      {selected && (
        <div className="mb-3">
          <TractorCard tractor={selected} />
          <button
            onClick={() => onSelect("")}
            className="mt-1 text-xs text-zinc-400 hover:text-red-500 transition-colors"
          >
            清除选择
          </button>
        </div>
      )}

      <div className="flex gap-2 mb-3">
        <input
          type="text"
          placeholder="搜索品牌/型号..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <select
          value={brandFilter}
          onChange={(e) => setBrandFilter(e.target.value)}
          className="px-2 py-1.5 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">全部品牌</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[500px] overflow-y-auto pr-1">
        {filtered.map((t) => (
          <button
            key={t.id}
            onClick={() => onSelect(t.id)}
            className={`text-left transition-all ${
              selectedId === t.id
                ? "ring-2 ring-green-500 rounded-xl"
                : "opacity-70 hover:opacity-100"
            }`}
          >
            <TractorCard tractor={t} />
          </button>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-2 text-center text-sm text-zinc-400 py-4">没有找到匹配的拖拉机</p>
        )}
      </div>
    </div>
  );
}
