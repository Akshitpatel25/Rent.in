"use client";
import React from "react";

export default function LoadingBar({ text }: { text?: string }) {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center gap-4 bg-slate-100 dark:bg-slate-950">
      <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Rent.in</h1>
      <div className="w-48 h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div className="h-full bg-blue-600 dark:bg-blue-400 rounded-full animate-loading-bar" />
      </div>
      {text && (
        <p className="text-sm text-gray-500 dark:text-slate-400">{text}</p>
      )}
    </div>
  );
}
