"use client";
import React from "react";
import Link from "next/link";

interface ActivityItem {
  _id: string;
  type: "rent" | "expense" | "maintenance";
  title: string;
  date: string;
  amount: number;
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  const formatCurrency = (num: number) => {
    return `₹${num.toLocaleString("en-IN")}`;
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "rent":
        return { bg: "bg-green-100 dark:bg-green-900/30", color: "text-green-600 dark:text-green-400" };
      case "expense":
        return { bg: "bg-red-100 dark:bg-red-900/30", color: "text-red-600 dark:text-red-400" };
      case "maintenance":
        return { bg: "bg-purple-100 dark:bg-purple-900/30", color: "text-purple-600 dark:text-purple-400" };
      default:
        return { bg: "bg-gray-100 dark:bg-slate-700", color: "text-gray-600 dark:text-slate-400" };
    }
  };

  const getAmountColor = (type: string) => {
    switch (type) {
      case "rent":
        return "text-green-600 dark:text-green-400";
      case "expense":
        return "text-red-600 dark:text-red-400";
      case "maintenance":
        return "text-purple-600 dark:text-purple-400";
      default:
        return "text-gray-900 dark:text-white";
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 lg:p-6 shadow-sm border border-gray-100 dark:border-slate-700">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base lg:text-lg font-bold text-gray-900 dark:text-white">
          Recent Activity
        </h2>
        <Link
          href="/rents-summary"
          className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300"
        >
          View All
        </Link>
      </div>

      {activities.length === 0 ? (
        <div className="py-10 text-center">
          <div className="w-14 h-14 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg
              className="w-6 h-6 text-gray-400 dark:text-slate-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-gray-400 dark:text-slate-500 text-sm">No recent activity</p>
          <p className="text-gray-300 dark:text-slate-600 text-xs mt-1">
            Start by creating a rent to see activity here
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {activities.map((item) => {
            const iconStyle = getIcon(item.type);
            return (
              <div
                key={item._id}
                className="flex items-center gap-4 py-3.5 border-b border-gray-50 dark:border-slate-700/50 last:border-0"
              >
                {/* Icon */}
                <div
                  className={`w-11 h-11 rounded-full ${iconStyle.bg} flex items-center justify-center shrink-0`}
                >
                  <ActivityTypeIcon
                    type={item.type}
                    className={`w-5 h-5 ${iconStyle.color}`}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">{item.date}</p>
                </div>

                {/* Amount */}
                <span
                  className={`text-base font-bold ${getAmountColor(item.type)} shrink-0`}
                >
                  {formatCurrency(item.amount)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ActivityTypeIcon({
  type,
  className,
}: {
  type: string;
  className?: string;
}) {
  if (type === "rent") {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    );
  }
  if (type === "expense") {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
      </svg>
    );
  }
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}
