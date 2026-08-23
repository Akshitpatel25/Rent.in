"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useTheme from "@/zustand/userDetails";
import useProperties from "@/zustand/userProperties";
import DashboardLayout from "@/components/DashboardLayout";

export default function CreateNewRent() {
  const router = useRouter();
  const { userDetails } = useTheme();
  const { fetchUserProperties } = useProperties();
  const [createRent, setcreateRent] = useState({
    user_email: "",
    rentName: "",
    rentPersonName: "",
    rentPersonNum: "",
    rentPersonAdhar: "",
    monthlyRentPrice: "",
    EleBillPrice: "",
    ElecUnitPrice: "",
    deposite: "set",
  });
  const [err, seterr] = useState("");
  const [loading, setloading] = useState(false);

  const handleSubmit = async () => {
    setloading(true);
    seterr("");
    let cancelled = false;
    try {
      if (userDetails?.name === "") {
        router.push("/dashboard");
      }
      createRent.user_email = userDetails?.email;
      const res = await fetch("/api/create-new-rent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createRent),
      });
      const json = await res.json();
      if (!cancelled && res.ok) {
        seterr("Successfully created");
        await fetchUserProperties(userDetails?.email);
        router.push("/all-properties");
      } else if (!cancelled) {
        seterr(json?.error || "Something went wrong");
      }
    } catch (error: any) {
      if (!cancelled) {
        seterr("Something went wrong");
      }
    } finally {
      if (!cancelled) setloading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => seterr(""), 2000);
  }, [err]);

  const inputClass =
    "w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm";

  return (
    <DashboardLayout userName={userDetails?.name || ""}>
      <div className="max-w-lg mx-auto space-y-5">
        {/* Back Button + Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/dashboard")}
            className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            aria-label="Go back"
          >
            <svg className="w-5 h-5 text-gray-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Create New Rent</h1>
            <p className="text-sm text-gray-500 dark:text-slate-400">Add a new rental property</p>
          </div>
        </div>

        {userDetails?.name?.length !== 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6 shadow-sm">
            {err && (
              <p className={`text-center text-sm mb-5 font-medium ${err === "Successfully created" ? "text-green-500" : "text-red-500"}`}>
                {err}
              </p>
            )}

            {/* Tenant Info Section */}
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Tenant Details
              </h2>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Property / Rent name"
                  className={inputClass}
                  onChange={(e) => setcreateRent({ ...createRent, rentName: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Tenant full name"
                  className={inputClass}
                  onChange={(e) => setcreateRent({ ...createRent, rentPersonName: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    placeholder="Phone number"
                    className={inputClass}
                    onChange={(e) => setcreateRent({ ...createRent, rentPersonNum: e.target.value })}
                  />
                  <input
                    type="number"
                    placeholder="Aadhaar number"
                    className={inputClass}
                    onChange={(e) => setcreateRent({ ...createRent, rentPersonAdhar: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Pricing
              </h2>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 dark:text-slate-500">₹</span>
                    <input
                      type="number"
                      placeholder="Monthly rent"
                      className={`${inputClass} pl-8`}
                      onChange={(e) => setcreateRent({ ...createRent, monthlyRentPrice: e.target.value })}
                    />
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 dark:text-slate-500">₹</span>
                    <input
                      type="number"
                      placeholder="Deposit"
                      className={`${inputClass} pl-8`}
                      onChange={(e) => setcreateRent({ ...createRent, deposite: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Electricity Section */}
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Electricity
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 dark:text-slate-500">₹</span>
                  <input
                    type="number"
                    placeholder="Default monthly bill"
                    className={`${inputClass} pl-8`}
                    onChange={(e) => setcreateRent({ ...createRent, EleBillPrice: e.target.value })}
                  />
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 dark:text-slate-500">₹</span>
                  <input
                    type="number"
                    placeholder="Unit price"
                    className={`${inputClass} pl-8`}
                    onChange={(e) => setcreateRent({ ...createRent, ElecUnitPrice: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 active:scale-[0.98] shadow-md shadow-blue-200 dark:shadow-blue-900/30 disabled:opacity-60"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <>
                  Creating...
                  <Image src="/ZKZg.gif" width={18} height={18} alt="loading..." priority />
                </>
              ) : (
                "Create Property"
              )}
            </button>
          </div>
        ) : (
          <div className="flex justify-center py-16">
            <Image src="/ZKZg.gif" width={40} height={40} alt="loading..." priority />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
