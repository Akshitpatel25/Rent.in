"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";

export default function RentsSummary() {
  type objData = {
    _id: string;
    rent_name: string;
    rent_person_name: string;
    monthly_rent_price: string;
    Rent_Paid_date: string;
  };

  const router = useRouter();
  const [userData, setuserData] = useState({
    user_id: "",
    name: "",
    email: "",
    isVerified: "",
  });

  const date = new Date();
  const year = date.getFullYear();
  const YEARS = [year, year - 1];
  const MONTHS = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
  const [monthName, setmonthName] = useState(`${MONTHS[0]}`);
  const [yearName, setyearName] = useState(`${YEARS[0]}`);

  const getUserDetailsinFrontend = async () => {
    try {
      const res = await axios.get("/api/me");
      setuserData({
        user_id: res?.data?.user?._id!,
        name: res?.data?.user?.name!,
        email: res?.data?.user?.email!,
        isVerified: res?.data?.user?.isVerified,
      });
    } catch (error) {
      router.push("/login");
    }
  };

  useEffect(() => {
    getUserDetailsinFrontend();
  }, []);

  const [obj, setObj] = useState<objData[]>([]);
  const [total_rent, settotal_rent] = useState(0);
  const [total_eBill, settotal_eBill] = useState(0);
  const handleMonthlyRentDetails = async () => {
    try {
      const res = await axios.post("/api/getting-properties-by-monthly-paid", {
        user_id: userData.user_id,
        M_Y: monthName + yearName,
      });
      setObj(res.data.data[0].monthly_rents);
      settotal_rent(res.data.data[0].total_rent);
      settotal_eBill(res.data.data[0].total_eBill);
    } catch (error: any) {
      console.log("error in handling monthly rent details");
    }
  };

  const [obj1, setObj1] = useState<objData[]>([]);
  const [total_rent1, settotal_rent1] = useState(0);
  const [total_eBill1, settotal_eBill1] = useState(0);
  const handleMonthlyRentDetails1 = async () => {
    try {
      const res = await axios.post("/api/getting-properties-by-monthly-notpaid", {
        user_id: userData.user_id,
        M_Y: monthName + yearName,
      });
      setObj1(res.data.data[0].monthly_rents);
      settotal_rent1(res.data.data[0].total_rent);
      settotal_eBill1(res.data.data[0].total_eBill);
    } catch (error: any) {
      console.log("error in handling not paid details");
    }
  };

  useEffect(() => {
    if (userData.user_id !== "") {
      handleMonthlyRentDetails();
      handleMonthlyRentDetails1();
    }
  }, [userData.user_id, monthName, yearName]);

  const selectClass =
    "px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <DashboardLayout userName={userData.name}>
      <div className="max-w-3xl mx-auto space-y-5">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Rents Summary</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
            View paid and unpaid rent details by month
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-4 shadow-sm flex items-center gap-3 flex-wrap">
          <select className={selectClass} onChange={(e) => setmonthName(e.target.value)}>
            {MONTHS.map((m, i) => <option key={i}>{m}</option>)}
          </select>
          <select className={selectClass} onChange={(e) => setyearName(e.target.value)}>
            {YEARS.map((y, i) => <option key={i}>{y}</option>)}
          </select>
          <span className="text-sm text-gray-500 dark:text-slate-400 ml-auto">
            {monthName} {yearName}
          </span>
        </div>

        {/* Paid Section */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Rent Paid
          </h2>

          {obj.length > 0 ? (
            <>
              {obj.map((data) => (
                <div key={data._id} className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-4 flex items-center shadow-sm">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{data.rent_name}</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">{data.rent_person_name.split(" ").slice(0, 2).join(" ")}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-green-600 dark:text-green-400">₹{Number(data.monthly_rent_price).toLocaleString("en-IN")}</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">{data.Rent_Paid_date}</p>
                  </div>
                </div>
              ))}
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3 flex justify-between text-sm">
                <span className="text-green-700 dark:text-green-300 font-medium">Total Rent: ₹{total_rent.toLocaleString("en-IN")}</span>
                <span className="text-green-700 dark:text-green-300 font-medium">E-Bill: ₹{total_eBill.toLocaleString("en-IN")}</span>
              </div>
            </>
          ) : (
            <div className="py-8 text-center bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700">
              <p className="text-gray-400 dark:text-slate-500 text-sm">No paid data for this period</p>
            </div>
          )}
        </div>

        {/* Not Paid Section */}
        {obj1.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-base font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Rent Not Paid
            </h2>
            <p className="text-xs text-gray-500 dark:text-slate-400">Future date rents will not be considered</p>

            {obj1.map((data: any) => (
              <div key={data._id} className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-4 flex items-center shadow-sm">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{data.rent_name}</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">{data.rent_person_name.split(" ").slice(0, 2).join(" ")}</p>
                </div>
                <p className="text-sm font-bold text-red-600 dark:text-red-400">₹{Number(data.monthly_rent_price).toLocaleString("en-IN")}</p>
              </div>
            ))}
            <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-3 flex justify-between text-sm">
              <span className="text-red-700 dark:text-red-300 font-medium">Remaining: ₹{total_rent1.toLocaleString("en-IN")}</span>
              <span className="text-red-700 dark:text-red-300 font-medium">E-Bill: ₹{total_eBill1.toLocaleString("en-IN")}</span>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
