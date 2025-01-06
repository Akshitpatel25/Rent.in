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

// type Props = [
//   {
//     name:string,
//     Rent:number,
//     Expense:number,
//     Maintanence:number
//   }
// ]

const data = [
  {
    name: 'December2024',
    Rent: 90000,
    Expense: 5400,
    Maintanence: 2400,
  },
];

export default function Barchart() {
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
          <Tooltip />
          <Legend />
          <Bar dataKey="Rent" fill="#344CB7" activeBar={<Rectangle fill="#344CB7" stroke="#344CB7" />} />
          <Bar dataKey="Expense" fill="#754E1A" activeBar={<Rectangle fill="#754E1A" stroke="#754E1A" />} />
          <Bar dataKey="Maintanence" fill="#727D73" activeBar={<Rectangle fill="#727D73" stroke="#727D73" />} />
        </BarChart>
      </ResponsiveContainer>
  );
}
