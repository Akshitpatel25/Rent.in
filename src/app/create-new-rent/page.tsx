"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
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
    const source = axios.CancelToken.source();
    let didCancel = false;
    try {
      if (userDetails?.name === "") {
        router.push("/dashboard");
      }
      createRent.user_email = userDetails?.email;
      const response = await axios.post("/api/create-new-rent", createRent, {
        cancelToken: source.token,
      });
      if (!didCancel && response.status === 200) {
        seterr("Successfully created");
        await fetchUserProperties(userDetails?.email);
        router.push("/all-properties");
      }
    } catch (error: any) {
      if (axios.isCancel(error)) {
        seterr("Create rent request cancelled");
      } else {
        seterr(error.response?.data?.error || "Something went wrong");
      }
    } finally {
      if (!didCancel) setloading(false);
    }
    return () => {
      didCancel = true;
      source.cancel();
    };
  };

  useEffect(() => {
    setTimeout(() => {
      seterr("");
    }, 2000);
  }, [err]);

  const inputClass =
    "w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm";

  return (
    <DashboardLayout userName={userDetails?.name || ""}>
      <div className="max-w-lg mx-auto">
        {userDetails?.name?.length !== 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6 shadow-sm">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-6">
              Create New Rent
            </h1>

            {err && (
              <p className={`text-center text-sm mb-4 font-medium ${err === "Successfully created" ? "text-green-500" : "text-red-500"}`}>
                {err}
              </p>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5 block">
                  Rent Name
                </label>
                <input
                  type="text"
                  placeholder="Enter rent name"
                  className={inputClass}
                  onChange={(e) => setcreateRent({ ...createRent, rentName: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5 block">
                  Person Name
                </label>
                <input
                  type="text"
                  placeholder="Enter person name"
                  className={inputClass}
                  onChange={(e) => setcreateRent({ ...createRent, rentPersonName: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5 block">
                  Phone Number
                </label>
                <input
                  type="number"
                  placeholder="Enter phone number"
                  className={inputClass}
                  onChange={(e) => setcreateRent({ ...createRent, rentPersonNum: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5 block">
                  Aadhaar Number
                </label>
                <input
                  type="number"
                  placeholder="Enter Aadhaar number"
                  className={inputClass}
                  onChange={(e) => setcreateRent({ ...createRent, rentPersonAdhar: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5 block">
                  Monthly Rent
                </label>
                <input
                  type="number"
                  placeholder="Enter monthly rent"
                  className={inputClass}
                  onChange={(e) => setcreateRent({ ...createRent, monthlyRentPrice: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5 block">
                  Electricity Bill /month
                </label>
                <input
                  type="number"
                  placeholder="Enter standard electricity bill"
                  className={inputClass}
                  onChange={(e) => setcreateRent({ ...createRent, EleBillPrice: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5 block">
                  Electricity Unit Price
                </label>
                <input
                  type="number"
                  placeholder="Enter unit price"
                  className={inputClass}
                  onChange={(e) => setcreateRent({ ...createRent, ElecUnitPrice: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5 block">
                  Deposit
                </label>
                <input
                  type="number"
                  placeholder="Enter deposit amount"
                  className={inputClass}
                  onChange={(e) => setcreateRent({ ...createRent, deposite: e.target.value })}
                />
              </div>

              <button
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-base transition-colors flex items-center justify-center gap-2 mt-2 active:scale-[0.98] shadow-md shadow-blue-200 dark:shadow-blue-900/30"
                onClick={handleSubmit}
                disabled={loading}
              >
                Create
                {loading && (
                  <Image src="/ZKZg.gif" width={20} height={20} alt="loading..." priority />
                )}
              </button>
            </div>
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
