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

interface RevenueChartProps {
  monthYear: string;
  rent: number;
  expense: number;
  maintenance: number;
}

export default function RevenueChart({
  monthYear,
  rent,
  expense,
  maintenance,
}: RevenueChartProps) {
  const profit = rent - (expense + maintenance);

  const data = [
    { name: "Rent", value: rent, fill: "#3B82F6" },
    { name: "Expenses", value: expense, fill: "#EF4444" },
    { name: "Maint.", value: maintenance, fill: "#F59E0B" },
    { name: "Profit", value: profit > 0 ? profit : 0, fill: "#10B981" },
  ];

  const formatYAxis = (value: number) => {
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return String(value);
  };

  const formatTooltip = (value: number) => {
    return `₹${value.toLocaleString("en-IN")}`;
  };

  return (
    <div className="bg-white rounded-2xl p-5 lg:p-6 shadow-sm border border-gray-100 h-full">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base lg:text-lg font-bold text-gray-900">
          Revenue Overview
        </h2>
        <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full font-medium">
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
              stroke="#F1F5F9"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#64748B" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={formatYAxis}
              tick={{ fontSize: 11, fill: "#64748B" }}
            />
            <Tooltip
              formatter={formatTooltip}
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                fontSize: "13px",
              }}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4">
        {[
          { color: "bg-blue-500", label: "Rent" },
          { color: "bg-red-500", label: "Expenses" },
          { color: "bg-amber-500", label: "Maintenance" },
          { color: "bg-emerald-500", label: "Profit" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${item.color}`} />
            <span className="text-sm text-gray-600">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
