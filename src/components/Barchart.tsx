import React, { useEffect } from "react";
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





export default function Barchart({prev_month, prevMonthRevenue, prevMonthExpense, prevMonthMaintanence} : any) {
  // Helper to format numbers with commas
  const formatNumber = (num: number | string) => {
    const n = Number(num);
    if (isNaN(n)) return num;
    return n.toLocaleString("en-IN", { maximumFractionDigits: 2 });
  };

  const data = [
    {
      name: String(prev_month),
      Rent: Number(prevMonthRevenue),
      Expense: Number(prevMonthExpense),
      Maintanence: Number(prevMonthMaintanence),
      Profite: Number(prevMonthRevenue) - (Number(prevMonthExpense) + Number(prevMonthMaintanence)),
    },
  ];
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={(value: number) => formatNumber(value)} />
        <Legend />
        <Bar dataKey="Rent" fill="#344CB7" activeBar={<Rectangle fill="#344CB7" stroke="#344CB7" />} />
        <Bar dataKey="Expense" fill="#754E1A" activeBar={<Rectangle fill="#754E1A" stroke="#754E1A" />} />
        <Bar dataKey="Maintanence" fill="#8e44ad" activeBar={<Rectangle fill="#8e44ad" stroke="#8e44ad" />} />
        <Bar dataKey="Profite" fill="#097969" activeBar={<Rectangle fill="#097969" stroke="#097969" />} />
      </BarChart>
    </ResponsiveContainer>
  );
}
