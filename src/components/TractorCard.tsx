import Link from "next/link";
import type { Tractor } from "@/data/tractors";

const brandColors: Record<string, string> = {
  "John Deere": "border-l-green-600",
  Kubota: "border-l-orange-500",
  "Massey Ferguson": "border-l-red-600",
  "Case IH": "border-l-red-700",
  "New Holland": "border-l-blue-600",
};

export default function TractorCard({ tractor }: { tractor: Tractor }) {
  const accent = brandColors[tractor.brand] || "border-l-gray-400";

  return (
    <Link
      href={`/compare?left=${tractor.id}`}
      className={`block p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 border-l-4 ${accent} bg-white dark:bg-zinc-800 hover:shadow-md transition-all group`}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500">{tractor.brand}</span>
          <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 group-hover:text-green-600 transition-colors">
            {tractor.model}
          </h3>
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium">
          {tractor.horsepower} HP
        </span>
      </div>
      <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2">{tractor.series}</p>
      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-zinc-600 dark:text-zinc-400">
        <span>排量: {tractor.engineDisplacement}L</span>
        <span>PTO: {tractor.ptoHp} HP</span>
        <span>重量: {(tractor.weight / 1000).toFixed(1)}吨</span>
        <span>提升: {tractor.liftCapacity}kg</span>
      </div>
      <p className="mt-2 text-sm font-semibold text-green-700 dark:text-green-400">{tractor.priceRange}</p>
    </Link>
  );
}
