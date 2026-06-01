import { brands } from "@/data/tractors";

const brandInfo: Record<string, { emoji: string; color: string }> = {
  "John Deere": { emoji: "🟢", color: "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700" },
  Kubota: { emoji: "🟠", color: "bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-300 border-orange-300 dark:border-orange-700" },
  "Massey Ferguson": { emoji: "🔴", color: "bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300 border-red-300 dark:border-red-700" },
  "Case IH": { emoji: "♦️", color: "bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-700" },
  "New Holland": { emoji: "🔵", color: "bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700" },
};

interface Props {
  selected: string[];
  onChange: (brands: string[]) => void;
}

export default function BrandFilter({ selected, onChange }: Props) {
  const toggle = (brand: string) => {
    if (selected.includes(brand)) {
      onChange(selected.filter((b) => b !== brand));
    } else {
      onChange([...selected, brand]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {brands.map((brand) => {
        const info = brandInfo[brand] || { emoji: "🚜", color: "bg-gray-100 dark:bg-gray-800 text-gray-700" };
        const active = selected.length === 0 || selected.includes(brand);
        return (
          <button
            key={brand}
            onClick={() => toggle(brand)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium transition-all ${
              active ? info.color + " border-current" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 border-zinc-200 dark:border-zinc-700 opacity-50"
            }`}
          >
            <span>{info.emoji}</span>
            {brand}
          </button>
        );
      })}
    </div>
  );
}
