"use client";

import {
  Radar,
  RadarChart as RechartsRadar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { Tractor } from "@/data/tractors";
import { compareFields, tractors as tractorsAll } from "@/data/tractors";

interface Props {
  left: Tractor;
  right: Tractor;
}

function normalize(value: number, max: number): number {
  return max > 0 ? (value / max) * 100 : 0;
}

export default function RadarChart({ left, right }: Props) {
  const radarFields = compareFields.filter((f) => f.inRadar);

  const data = radarFields.map((field) => {
    const allValues = tractorsAll.map((t) => t[field.key] as number);
    const max = Math.max(...allValues, 1);
    return {
      field: field.label,
      [left.model]: normalize(left[field.key] as number, max),
      [right.model]: normalize(right[field.key] as number, max),
    };
  });

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadar data={data} cx="50%" cy="50%" outerRadius="75%">
          <PolarGrid stroke="#9ca3af" />
          <PolarAngleAxis dataKey="field" tick={{ fontSize: 12, fill: "#6b7280" }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
          <Radar
            name={left.model}
            dataKey={left.model}
            stroke="#16a34a"
            fill="#16a34a"
            fillOpacity={0.2}
            strokeWidth={2}
          />
          <Radar
            name={right.model}
            dataKey={right.model}
            stroke="#2563eb"
            fill="#2563eb"
            fillOpacity={0.2}
            strokeWidth={2}
          />
          <Legend />
        </RechartsRadar>
      </ResponsiveContainer>
    </div>
  );
}
