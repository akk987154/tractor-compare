import type { Tractor } from "@/data/tractors";
import { compareFields } from "@/data/tractors";

interface Props {
  left: Tractor;
  right: Tractor;
}

export default function SpecTable({ left, right }: Props) {
  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-700">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-zinc-50 dark:bg-zinc-800/50">
            <th className="text-left px-4 py-3 font-semibold text-zinc-600 dark:text-zinc-400 w-[30%]">
              参数
            </th>
            <th className="text-center px-4 py-3 font-semibold text-green-700 dark:text-green-400 w-[35%]">
              {left.brand} {left.model}
            </th>
            <th className="text-center px-4 py-3 font-semibold text-blue-700 dark:text-blue-400 w-[35%]">
              {right.brand} {right.model}
            </th>
          </tr>
        </thead>
        <tbody>
          {compareFields.map((field, i) => {
            const lVal = left[field.key];
            const rVal = right[field.key];
            const lNum = typeof lVal === "number" ? lVal : 0;
            const rNum = typeof rVal === "number" ? rVal : 0;
            const better = lNum > rNum ? "left" : rNum > lNum ? "right" : "tie";

            return (
              <tr
                key={field.key}
                className={`border-t border-zinc-100 dark:border-zinc-800 ${
                  i % 2 === 0 ? "bg-white dark:bg-zinc-900" : "bg-zinc-50/50 dark:bg-zinc-800/30"
                }`}
              >
                <td className="px-4 py-2.5 text-zinc-700 dark:text-zinc-300 font-medium">
                  {field.label}
                </td>
                <td
                  className={`text-center px-4 py-2.5 font-mono ${
                    better === "left" && typeof lVal === "number"
                      ? "text-green-600 dark:text-green-400 font-bold"
                      : "text-zinc-600 dark:text-zinc-400"
                  }`}
                >
                  {typeof lVal === "number" ? lVal.toLocaleString() : lVal}
                  <span className="text-xs text-zinc-400 ml-0.5">{field.unit}</span>
                </td>
                <td
                  className={`text-center px-4 py-2.5 font-mono ${
                    better === "right" && typeof rVal === "number"
                      ? "text-blue-600 dark:text-blue-400 font-bold"
                      : "text-zinc-600 dark:text-zinc-400"
                  }`}
                >
                  {typeof rVal === "number" ? rVal.toLocaleString() : rVal}
                  <span className="text-xs text-zinc-400 ml-0.5">{field.unit}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
