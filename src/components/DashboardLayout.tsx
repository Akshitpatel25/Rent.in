"use client";
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Link from "next/link";

export default function DashboardLayout({
  children,
  userName,
}: {
  children: React.ReactNode;
  userName: string;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-8 shrink-0">
          {/* Left: Hamburger + Logo (mobile) */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2.5 -ml-1 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-colors"
              aria-label="Open menu"
            >
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-blue-600 lg:hidden">
              Rent.in
            </h1>
          </div>

          {/* Right: Notification + Profile */}
          <div className="flex items-center gap-2">
            {/* Notification Bell */}
            <button className="p-2.5 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-colors relative">
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              {/* Notification dot */}
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Profile Avatar */}
            <Link
              href="/user-profile"
              className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-base shadow-md shadow-blue-200"
            >
              {userName ? userName.charAt(0).toUpperCase() : "U"}
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 pb-8 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
