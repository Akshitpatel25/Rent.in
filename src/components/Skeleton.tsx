"use client";
import React from "react";

// Base skeleton pulse block
function Bone({ className }: { className?: string }) {
  return (
    <div
      className={`bg-gray-200 dark:bg-slate-700 rounded-xl animate-pulse ${className || ""}`}
    />
  );
}

// Skeleton for list pages (expense, maintenance)
export function ListSkeleton() {
  return (
    <div className="space-y-4">
      {/* Input bar */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-4 shadow-sm">
        <div className="flex gap-2">
          <Bone className="flex-1 h-12" />
          <Bone className="w-28 h-12" />
          <Bone className="w-16 h-12" />
        </div>
      </div>
      {/* List items */}
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-4 flex items-center shadow-sm"
        >
          <div className="flex items-center gap-3 flex-1">
            <Bone className="w-9 h-9 rounded-full" />
            <div className="space-y-2 flex-1">
              <Bone className="h-4 w-3/4" />
              <Bone className="h-3 w-1/2" />
            </div>
          </div>
          <Bone className="w-16 h-5 ml-3" />
        </div>
      ))}
    </div>
  );
}

// Skeleton for rents-summary page
export function RentsSummarySkeleton() {
  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-4 shadow-sm flex gap-3">
        <Bone className="w-28 h-10" />
        <Bone className="w-24 h-10" />
        <Bone className="w-20 h-5 ml-auto self-center" />
      </div>
      {/* Section header */}
      <Bone className="h-5 w-32" />
      {/* Cards */}
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-4 flex items-center shadow-sm"
        >
          <div className="flex-1 space-y-2">
            <Bone className="h-4 w-1/3" />
            <Bone className="h-3 w-1/4" />
          </div>
          <div className="text-right space-y-2">
            <Bone className="h-4 w-16 ml-auto" />
            <Bone className="h-3 w-12 ml-auto" />
          </div>
        </div>
      ))}
      {/* Total bar */}
      <Bone className="h-12 w-full rounded-xl" />
    </div>
  );
}

// Skeleton for revenue/reports page
export function ReportsSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5 shadow-sm space-y-4"
        >
          <Bone className="h-5 w-36" />
          <div className="flex gap-2">
            <Bone className="w-28 h-10" />
            <Bone className="w-24 h-10" />
            <Bone className="w-20 h-10" />
          </div>
          {/* Chart placeholder */}
          <div className="flex items-end gap-3 h-48 pt-4">
            <Bone className="flex-1 h-3/4" />
            <Bone className="flex-1 h-1/2" />
            <Bone className="flex-1 h-1/3" />
            <Bone className="flex-1 h-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Skeleton for user profile page
export function ProfileSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6 shadow-sm space-y-6">
      {/* Avatar */}
      <div className="flex flex-col items-center">
        <Bone className="w-20 h-20 rounded-full" />
        <Bone className="h-5 w-32 mt-3" />
      </div>
      {/* Details */}
      <div className="space-y-4">
        <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl flex items-center justify-between">
          <div className="space-y-2">
            <Bone className="h-3 w-12" />
            <Bone className="h-4 w-48" />
          </div>
          <Bone className="h-6 w-16 rounded-full" />
        </div>
        <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
          <div className="space-y-2">
            <Bone className="h-3 w-12" />
            <Bone className="h-4 w-32" />
          </div>
        </div>
      </div>
      {/* Button */}
      <Bone className="h-12 w-full rounded-xl" />
    </div>
  );
}
