"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function LevelChart({ data }: { data: { level: string; avgStars: number }[] }) {
  if (data.every((d) => d.avgStars === 0)) {
    return <p className="text-sm text-kid-ink/40">Todavía no jugó ninguna actividad.</p>;
  }
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2E2A2614" />
          <XAxis dataKey="level" tick={{ fontSize: 11, fill: "#2E2A2699" }} interval={0} height={30} />
          <YAxis domain={[0, 3]} tick={{ fontSize: 11, fill: "#2E2A2699" }} allowDecimals={false} />
          <Tooltip formatter={(value) => [`${Number(value).toFixed(1)} ⭐`, "Promedio"]} />
          <Bar dataKey="avgStars" fill="#4ECDC4" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
