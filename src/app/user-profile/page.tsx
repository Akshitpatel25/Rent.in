"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { ProfileSkeleton } from "@/components/Skeleton";

export default function Userprofile() {
  const router = useRouter();
  const [userData, setuserData] = useState({
    user_id: "",
    name: "",
    email: "",
    isVerified: "",
  });
  const [loading, setLoading] = useState(true);

  const getUserDetailsinFrontend = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/me");
      const json = await res.json();
      setuserData({
        user_id: json?.user?._id!,
        name: json?.user?.name!,
        email: json?.user?.email!,
        isVerified: json?.user?.isVerified,
      });
    } catch (error: any) {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserDetailsinFrontend();
  }, []);

  return (
    <DashboardLayout userName={userData.name}>
      <div className="max-w-lg mx-auto space-y-5">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>

        {loading ? (
          <ProfileSkeleton />
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6 shadow-sm space-y-6">
            {/* Avatar */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-blue-200 dark:shadow-blue-900/30">
                {userData.name ? userData.name.charAt(0).toUpperCase() : "U"}
              </div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mt-3">
                {userData.name}
              </h2>
            </div>

            {/* Details */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                <div>
                  <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">Email</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">
                    {userData.email}
                  </p>
                </div>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    userData.isVerified
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                      : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                  }`}
                >
                  {userData.isVerified ? "Verified" : "Not Verified"}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                <div>
                  <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">Name</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">
                    {userData.name}
                  </p>
                </div>
              </div>
            </div>

            {/* Change Password */}
            <button
              onClick={() => router.push("/forgetpass-email-verification")}
              className="w-full py-3 rounded-xl border border-gray-200 dark:border-slate-600 text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            >
              Change Password
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
