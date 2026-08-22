"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import Link from "next/link";
import useTheme from "@/zustand/userDetails";
import useProperties from "@/zustand/userProperties";
import DashboardLayout from "@/components/DashboardLayout";

export default function AllProperties() {
  const { userProperties, fetchUserProperties } = useProperties();
  const { userDetails } = useTheme();
  const [lastMonths, setLastMonths] = useState<Record<string, string>>({});

  useEffect(() => {
    if (userDetails?.email) {
      fetchUserProperties(userDetails.email);
    }
  }, [userDetails?.email]);

  // Fetch last rent month for each property
  useEffect(() => {
    const fetchLastMonths = async () => {
      if (!userProperties || userProperties.length === 0) return;
      const results: Record<string, string> = {};
      for (const prop of userProperties) {
        try {
          const res = await axios.post("/api/getting-monthly-rent", { id: prop._id });
          if (res.data.data && res.data.data.length > 0) {
            const last = res.data.data[res.data.data.length - 1];
            results[prop._id] = last.month_year;
          }
        } catch {}
      }
      setLastMonths(results);
    };
    fetchLastMonths();
  }, [userProperties]);

  const [deleteMsg, setdeleteMsg] = useState({
    rent_name: "",
    rent_id: "",
  });
  const [isAbsolute, setisAbsolute] = useState(false);
  const [yesLoading, setyesLoading] = useState(false);

  const deleteProperty = async (id: string) => {
    try {
      setyesLoading(true);
      await axios.post(`/api/delete-property`, { id });
    } catch (error: any) {
      alert("Unable to delete property, contact support team");
    } finally {
      setyesLoading(false);
      setisAbsolute(false);
      fetchUserProperties(userDetails?.email);
    }
  };

  const deletePropertyMsg = (rent_name: string, rent_id: string) => {
    setisAbsolute(true);
    setdeleteMsg({ rent_name, rent_id });
  };

  return (
    <DashboardLayout userName={userDetails?.name || ""}>
      <div className="max-w-4xl mx-auto space-y-5 relative z-10">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              All Properties
            </h1>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
              {userProperties?.length || 0} properties
            </p>
          </div>
          <Link
            href="/create-new-rent"
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm transition-colors active:scale-95 shadow-md shadow-blue-200 dark:shadow-blue-900/30"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add New
          </Link>
        </div>

        {/* Properties List */}
        <div className="space-y-3">
          {userProperties != null ? (
            <>
              {userProperties.length === 0 && (
                <div className="py-16 text-center bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-7 h-7 text-gray-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <p className="text-gray-500 dark:text-slate-400 font-medium">No properties yet</p>
                  <p className="text-gray-400 dark:text-slate-500 text-sm mt-1">Create your first rental property</p>
                </div>
              )}

              {userProperties.map((data: any) => (
                <div
                  key={data._id}
                  className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-gray-100 dark:border-slate-700 p-4 flex items-center shadow-sm"
                >
                  <Link
                    href={`/individual-rent/${data._id}`}
                    className="flex-1 min-w-0"
                  >
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                      {data.rent_name}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
                      {data.rent_person_name} · {data.rent_person_num}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-xs text-gray-400 dark:text-slate-500">
                        Aadhaar: {data.rent_person_adhar}
                      </span>
                      {lastMonths[data._id] && (
                        <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full">
                          {lastMonths[data._id]}
                        </span>
                      )}
                    </div>
                  </Link>

                  <button
                    onClick={() => deletePropertyMsg(data.rent_name, data._id)}
                    className="p-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors ml-3"
                    title="Delete"
                  >
                    <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </>
          ) : (
            <div className="flex justify-center py-16">
              <Image src="/ZKZg.gif" width={40} height={40} alt="loading..." priority />
            </div>
          )}
        </div>
      </div>

      {/* Background City Skyline */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 pointer-events-none z-0 opacity-40 dark:opacity-20 overflow-hidden w-screen h-[60vh] md:h-auto md:overflow-visible">
        <img
          src="/city-bg.png"
          alt=""
          className="absolute bottom-0 left-1/2 -translate-x-[65%] min-w-[220%] md:left-1/2 md:-translate-x-1/2 md:min-w-0 md:w-full md:max-w-[1200px] md:relative h-auto"
        />
      </div>

      {/* Delete Confirmation Modal */}
      {isAbsolute && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-xl border border-gray-100 dark:border-slate-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white text-center">
              Delete Property
            </h3>
            <p className="text-gray-500 dark:text-slate-400 text-center mt-2">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-900 dark:text-white">{deleteMsg.rent_name}</span>?
            </p>
            <div className="flex gap-3 mt-5">
              <button
                className="flex-1 py-2.5 rounded-xl bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 font-medium hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                onClick={() => setisAbsolute(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                onClick={() => deleteProperty(deleteMsg.rent_id)}
              >
                Delete
                {yesLoading && (
                  <Image src="/ZKZg.gif" width={15} height={15} alt="loading..." priority />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
