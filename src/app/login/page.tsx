"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useThemeMode } from "@/components/ThemeProvider";
import LoadingDots from "@/components/LoadingDots";

export default function Login() {
  const router = useRouter();
  const { theme, toggleTheme } = useThemeMode();

  const [error, setError] = useState("");
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [login, setLogin] = useState({ email: "", password: "" });

  const setupLogin = async () => {
    let cancelled = false;
    try {
      if (!login.email || !login.password) {
        setError("Email and password are required");
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(login.email)) {
        setError("Please enter a valid email address");
        return;
      }
      setLoadingLogin(true);
      setError("");
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(login),
      });
      const json = await res.json();
      if (!cancelled && res.ok) {
        setError("Login successful");
        router.push("/dashboard");
      } else if (!cancelled) {
        setError(json?.error || "An error occurred. Please try again.");
      }
    } catch (error: any) {
      if (!cancelled) {
        setError("An error occurred. Please try again.");
      }
    } finally {
      if (!cancelled) setLoadingLogin(false);
    }
  };

  const googleSigninHandler = async () => {
    setGoogleLoading(true);
    signIn("google", { redirectTo: "/dashboard" });
  };

  useEffect(() => {
    if (error) setTimeout(() => setError(""), 3000);
  }, [error]);

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
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Welcome back</h2>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Login to your account</p>
        </div>

        {error && (
          <p className={`text-sm font-medium text-center ${error === "Login successful" ? "text-green-500" : "text-red-500"}`}>
            {error}
          </p>
        )}

        <div className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            className={inputClass}
            value={login.email}
            onChange={(e) => setLogin({ ...login, email: e.target.value })}
            aria-label="Email"
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="Password"
            className={inputClass}
            value={login.password}
            onChange={(e) => setLogin({ ...login, password: e.target.value })}
            aria-label="Password"
            autoComplete="current-password"
          />
        </div>

        <div className="flex justify-end">
          <Link href="/forgetpass-email-verification" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
            Forgot Password?
          </Link>
        </div>

        <button
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 active:scale-[0.98] shadow-md shadow-blue-200 dark:shadow-blue-900/30 disabled:opacity-60"
          onClick={setupLogin}
          disabled={loadingLogin}
        >
          {loadingLogin ? (
            <>
              Logging in<LoadingDots />
            </>
          ) : (
            "Login"
          )}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200 dark:bg-slate-700" />
          <span className="text-xs text-gray-400 dark:text-slate-500">or</span>
          <div className="flex-1 h-px bg-gray-200 dark:bg-slate-700" />
        </div>

        {/* Google */}
        <button
          className="w-full py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl font-medium text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2.5 active:scale-[0.98]"
          onClick={googleSigninHandler}
          disabled={googleLoading}
        >
          {googleLoading ? (
            <span className="flex items-center">Loading<LoadingDots /></span>
          ) : (
            <>
              <Image src="/googleG.png" alt="Google" width={18} height={18} />
              Continue with Google
            </>
          )}
        </button>

        <p className="text-center text-sm text-gray-500 dark:text-slate-400">
          Don&apos;t have an account?{" "}
          <Link className="text-blue-600 dark:text-blue-400 font-medium hover:underline" href="/signup">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
