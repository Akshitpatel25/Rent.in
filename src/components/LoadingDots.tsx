"use client";
import React from "react";

export default function LoadingDots() {
  return (
    <span className="inline-flex items-center gap-0.5 ml-1">
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-dot-pulse" />
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-dot-pulse-delay-1" />
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-dot-pulse-delay-2" />
    </span>
  );
}
