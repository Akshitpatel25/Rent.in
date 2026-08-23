"use client";
import React from "react";

interface StatsCardsProps {
  todaysEarning: string;
  totalProperties: number;
  thisMonthRent: number;
  totalExpenses: number;
}

export default function StatsCards({
  todaysEarning,
  totalProperties,
  thisMonthRent,
  totalExpenses,
}: StatsCardsProps) {
  const formatCurrency = (num: number | string) => {
    const n = Number(num);
    if (isNaN(n)) return "---";
    return n.toLocaleString("en-IN");
  };

  return (
    <div className="space-y-4">
      {/* Featured Card - Today's Earnings */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-900 rounded-2xl p-5 shadow-lg shadow-blue-200 dark:shadow-blue-900/40">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm font-medium">
              Est. Today&apos;s Earnings
            </p>
            <p className="text-white text-3xl lg:text-4xl font-bold mt-1">
              ₹{formatCurrency(todaysEarning)}
            </p>
            <p className="text-blue-200 text-xs mt-2">Updated just now</p>
          </div>
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
            <svg
              className="w-7 h-7 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Secondary Stats Grid */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        {/* Properties */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
              <svg
                className="w-5 h-5 text-orange-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">Properties</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">
            {totalProperties}
          </p>
        </div>

        {/* This Month's Rent */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <svg
                className="w-5 h-5 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">This Month&apos;s Rent</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">
            ₹{formatCurrency(thisMonthRent)}
          </p>
        </div>

        {/* Total Expenses */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-slate-700 col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
              <svg
                className="w-5 h-5 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                />
              </svg>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">Total Expenses</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">
            ₹{formatCurrency(totalExpenses)}
          </p>
        </div>
      </div>
    </div>
  );
}
