"use client";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useThemeMode } from "./ThemeProvider";

interface RevenueChartProps {
  monthYear: string;
  rent: number;
  expense: number;
  maintenance: number;
}

// Custom tooltip that matches the theme
function CustomTooltip({ active, payload, label, isDark }: any) {
  if (!active || !payload || !payload.length) return null;
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
      <p style={{ color: isDark ? "#94A3B8" : "#64748B", marginBottom: "2px" }}>{label}</p>
      <p style={{ fontWeight: 700 }}>₹{Number(payload[0].value).toLocaleString("en-IN")}</p>
    </div>
  );
}

export default function RevenueChart({
  monthYear,
  rent,
  expense,
  maintenance,
}: RevenueChartProps) {
  const { theme } = useThemeMode();
  const isDark = theme === "dark";
  const profit = rent - (expense + maintenance);

  const data = [
    { name: "Rent", value: rent, fill: "#2563EB" },
    { name: "Expenses", value: expense, fill: "#EF4444" },
    { name: "Maint.", value: maintenance, fill: "#F59E0B" },
    { name: "Profit", value: profit > 0 ? profit : 0, fill: "#10B981" },
  ];

  const formatYAxis = (value: number) => {
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return String(value);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 lg:p-6 shadow-sm border border-gray-100 dark:border-slate-700 h-full">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base lg:text-lg font-bold text-gray-900 dark:text-white">
          Revenue Overview
        </h2>
        <span className="text-xs text-gray-500 dark:text-slate-400 bg-gray-100 dark:bg-slate-700 px-3 py-1.5 rounded-full font-medium">
          {monthYear}
        </span>
      </div>

      <div className="w-full h-64 lg:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -15, bottom: 5 }}
            barCategoryGap="20%"
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#334155"
              strokeOpacity={0.3}
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#94A3B8" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={formatYAxis}
              tick={{ fontSize: 11, fill: "#94A3B8" }}
            />
            <Tooltip
              content={<CustomTooltip isDark={isDark} />}
              cursor={{ fill: isDark ? "rgba(148,163,184,0.1)" : "rgba(100,116,139,0.08)" }}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4">
        {[
          { color: "bg-blue-600", label: "Rent" },
          { color: "bg-red-500", label: "Expenses" },
          { color: "bg-amber-500", label: "Maintenance" },
          { color: "bg-emerald-500", label: "Profit" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${item.color}`} />
            <span className="text-sm text-gray-600 dark:text-slate-400">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
