"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useThemeMode } from "@/components/ThemeProvider";

export default function Forgetpassword_email_verification() {
  const { theme, toggleTheme } = useThemeMode();
  const [email, setEmail] = useState("");
  const [res, setRes] = useState("");
  const [loading, setLoading] = useState(false);
  const [routeError, setrouteError] = useState("");

  const emailCheckingHandler = async () => {
    if (!email) {
      return setRes("Please enter your email");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return setRes("Invalid email format");
    }
    try {
      setLoading(true);
      const response = await fetch("/api/forgetpass-email-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = await response.json();
      if (response.ok) {
        setrouteError(json.data);
      } else {
        setrouteError(json?.error || "Something went wrong");
      }
    } catch (error: any) {
      setrouteError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (res || routeError) {
      setTimeout(() => { setRes(""); setrouteError(""); }, 5000);
    }
  }, [res, routeError]);

  const inputClass =
    "w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center px-4 py-8">
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-5 right-5 p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? (
          <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>

      {/* Logo */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">Rent.in</h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Manage your rentals</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-xl shadow-gray-200/50 dark:shadow-black/20 p-6 space-y-5">
        <div className="text-center">
          <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Reset Password</h2>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            Enter your email and we&apos;ll send you a reset link
          </p>
        </div>

        {(res || routeError) && (
          <p className={`text-sm font-medium text-center ${
            routeError?.includes("sent") || routeError?.includes("check")
              ? "text-green-500"
              : "text-red-500"
          }`}>
            {routeError || res}
          </p>
        )}

        <div>
          <input
            type="email"
            placeholder="Enter your email"
            className={inputClass}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Email"
            autoComplete="email"
          />
        </div>

        <button
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 active:scale-[0.98] shadow-md shadow-blue-200 dark:shadow-blue-900/30 disabled:opacity-60"
          onClick={emailCheckingHandler}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <p className="text-center text-sm text-gray-500 dark:text-slate-400">
          Remember your password?{" "}
          <Link className="text-blue-600 dark:text-blue-400 font-medium hover:underline" href="/login">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}
