"use client";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Rectangle,
} from "recharts";
import { useThemeMode } from "./ThemeProvider";

// Custom themed tooltip
function CustomTooltip({ active, payload, label, isDark }: any) {
  if (!active || !payload || !payload.length) return null;
  const formatNumber = (num: number) =>
    Number(num).toLocaleString("en-IN", { maximumFractionDigits: 2 });
  return (
    <div
      style={{
        borderRadius: "12px",
        padding: "10px 14px",
        fontSize: "13px",
        backgroundColor: isDark ? "#0F172A" : "#FFFFFF",
        color: isDark ? "#F8FAFC" : "#0F172A",
        border: `1px solid ${isDark ? "#334155" : "#E2E8F0"}`,
        boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
      }}
    >
      <p style={{ color: isDark ? "#94A3B8" : "#64748B", marginBottom: "4px" }}>{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} style={{ color: entry.fill, fontWeight: 600 }}>
          {entry.name}: ₹{formatNumber(entry.value)}
        </p>
      ))}
    </div>
  );
}

export default function Barchart({
  prev_month,
  prevMonthRevenue,
  prevMonthExpense,
  prevMonthMaintanence,
}: any) {
  const { theme } = useThemeMode();
  const isDark = theme === "dark";

  const data = [
    {
      name: String(prev_month),
      Rent: Number(prevMonthRevenue),
      Expense: Number(prevMonthExpense),
      Maintanence: Number(prevMonthMaintanence),
      Profite:
        Number(prevMonthRevenue) -
        (Number(prevMonthExpense) + Number(prevMonthMaintanence)),
    },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#E2E8F0"} strokeOpacity={0.4} />
        <XAxis dataKey="name" tick={{ fill: isDark ? "#94A3B8" : "#64748B", fontSize: 12 }} />
        <YAxis tick={{ fill: isDark ? "#94A3B8" : "#64748B", fontSize: 11 }} />
        <Tooltip
          content={<CustomTooltip isDark={isDark} />}
          cursor={{ fill: isDark ? "rgba(148,163,184,0.1)" : "rgba(100,116,139,0.08)" }}
        />
        <Legend wrapperStyle={{ fontSize: "13px", color: isDark ? "#94A3B8" : "#64748B" }} />
        <Bar dataKey="Rent" fill="#2563EB" radius={[4, 4, 0, 0]} activeBar={<Rectangle fill="#2563EB" stroke="#2563EB" />} />
        <Bar dataKey="Expense" fill="#EF4444" radius={[4, 4, 0, 0]} activeBar={<Rectangle fill="#EF4444" stroke="#EF4444" />} />
        <Bar dataKey="Maintanence" fill="#F59E0B" radius={[4, 4, 0, 0]} activeBar={<Rectangle fill="#F59E0B" stroke="#F59E0B" />} />
        <Bar dataKey="Profite" fill="#10B981" radius={[4, 4, 0, 0]} activeBar={<Rectangle fill="#10B981" stroke="#10B981" />} />
      </BarChart>
    </ResponsiveContainer>
  );
}
