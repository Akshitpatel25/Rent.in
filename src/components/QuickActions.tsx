"use client";
import React from "react";
import Link from "next/link";

const actions = [
  {
    name: "Create New Rent",
    href: "/create-new-rent",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    icon: CreateRentIcon,
  },
  {
    name: "Add Expense",
    href: "/add-expense",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    icon: AddExpenseIcon,
  },
  {
    name: "Add Maintenance",
    href: "/add-maintanence",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    icon: MaintenanceIcon,
  },
  {
    name: "View Reports",
    href: "/revenue",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    icon: ReportsIcon,
  },
];

export default function QuickActions() {
  return (
    <div className="bg-white rounded-2xl p-5 lg:p-6 shadow-sm border border-gray-100 h-full">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base lg:text-lg font-bold text-gray-900">
          Quick Actions
        </h2>
        <Link
          href="/all-properties"
          className="text-sm text-blue-600 font-medium hover:text-blue-700"
        >
          View All
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <Link
            key={action.name}
            href={action.href}
            className="flex flex-col items-center gap-3 p-4 rounded-2xl border border-gray-100
            hover:border-blue-200 hover:bg-blue-50/40 transition-all group active:scale-95"
          >
            <div
              className={`w-12 h-12 rounded-xl ${action.iconBg} flex items-center justify-center`}
            >
              <action.icon className={`w-6 h-6 ${action.iconColor}`} />
            </div>
            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 text-center leading-tight">
              {action.name}
            </span>
            <svg
              className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  );
}

function CreateRentIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function AddExpenseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"
      />
    </svg>
  );
}

function MaintenanceIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

function ReportsIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  );
}
