"use client";
import React, { useState, useRef, useEffect } from "react";

interface CustomSelectProps {
  options: { label: string; value: string | number }[];
  value?: string | number;
  placeholder?: string;
  onChange: (value: string) => void;
  label?: string;
}

export default function CustomSelect({
  options,
  value,
  placeholder = "Select",
  onChange,
  label,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(value ?? "");
  const ref = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Sync external value
  useEffect(() => {
    if (value !== undefined) setSelected(value);
  }, [value]);

  const selectedLabel =
    options.find((o) => String(o.value) === String(selected))?.label || placeholder;

  return (
    <div ref={ref} className="relative w-full">
      {label && (
        <label className="text-xs font-medium text-gray-500 dark:text-slate-400 mb-1 block">
          {label}
        </label>
      )}
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-left text-base font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all flex items-center justify-between"
      >
        <span className={selected === "" ? "text-gray-400 dark:text-slate-500" : ""}>
          {selectedLabel}
        </span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg shadow-gray-200/50 dark:shadow-black/30 max-h-52 overflow-y-auto scrollbar-thin">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                setSelected(option.value);
                onChange(String(option.value));
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2.5 text-left text-sm font-medium transition-colors first:rounded-t-xl last:rounded-b-xl
                ${
                  String(selected) === String(option.value)
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700"
                }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
