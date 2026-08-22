"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import dynamic from "next/dynamic";

const Barchart = dynamic(() => import("@/components/Barchart"), { ssr: false });

export default function Revenue() {
  const router = useRouter();
  const [userData, setuserData] = useState({
    user_id: "",
    name: "",
    email: "",
  });
  const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
  const date = new Date();
  const year = date.getFullYear();
  const selectyear = [year, year - 1];
  const [month, setmonth] = useState("JAN");
  const [years, setyears] = useState(`${year}`);
  const [M_Y, setM_Y] = useState(`JAN${year}`);
  const [yearReport, setYearReport] = useState({ rent: 0, electricity: 0, maintanence: 0, expense: 0 });
  const [monthlyReport, setMonthlyReport] = useState({ rent: 0, maintanence: 0, expense: 0 });
  const [yearlyButton, setYearlyButton] = useState(false);
  const [monthlyButton, setMonthlyButton] = useState(false);

  const getUserDetailsinFrontend = async () => {
    try {
      const res = await axios.get("/api/me");
      setuserData({
        user_id: res?.data?.user?._id!,
        name: res?.data?.user?.name!,
        email: res?.data?.user?.email!,
      });
    } catch (error) {
      router.push("/login");
    }
  };

  const handleMonthlyReport = async () => {
    setMonthlyButton(true);
    try {
      if (M_Y && userData.user_id !== "") {
        const monthIndex = months.indexOf(month) + 1;
        const result = await axios.post("/api/get-monthly-report", {
          user_id: userData.user_id,
          M_Y: `${month}${years}`,
          M: monthIndex,
          Y: years.slice(-2),
        });
        const rent = result.data.data[0].monthly_rents[0]?.total || 0;
        const maintanence = result.data.data[0].monthly_maintanence[0]?.total || 0;
        const expense = result.data.data[0].monthly_expenses[0]?.total || 0;
        setMonthlyReport({ rent, maintanence, expense });
      }
    } catch (error) {
      console.log("error in monthly report", error);
    }
    setMonthlyButton(false);
  };

  const handleYearlyReport = async () => {
    setYearlyButton(true);
    try {
      if (years && userData.user_id !== "") {
        const yearlyReport = await axios.post("/api/get-yearly-report", { user_id: userData.user_id, years });
        const rent = yearlyReport.data.data[0].yearlyRentTotal[0]?.totalAmount || 0;
        const electricity = yearlyReport.data.data[0].yearlyRentTotal[0]?.total_Elec_bill || 0;
        const maintanence = yearlyReport.data.data[0].yearly_maintanence_amount[0]?.totalMaintanence || 0;
        const expense = yearlyReport.data.data[0].yearly_expense_amount[0]?.total_expense_sum || 0;
        setYearReport({ rent, electricity, maintanence, expense });
      }
    } catch (error: any) {
      console.log("error in yearly report");
    }
    setYearlyButton(false);
  };

  useEffect(() => { getUserDetailsinFrontend(); }, []);
  useEffect(() => { setM_Y(`${month}${years}`); }, [month, years]);

  const selectClass =
    "px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <DashboardLayout userName={userData.name}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Revenue Reports</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">View monthly and yearly revenue breakdown</p>
        </div>

        {userData.user_id === "" ? (
          <div className="flex justify-center py-16">
            <Image src="/ZKZg.gif" width={40} height={40} alt="loading..." priority />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Monthly Report */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5 shadow-sm">
              <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">Monthly Report</h2>
              <div className="flex gap-2 mb-4 flex-wrap">
                <select className={selectClass} onChange={(e) => setmonth(e.target.value)}>
                  {months.map((m, i) => <option key={i} value={m}>{m}</option>)}
                </select>
                <select className={selectClass} onChange={(e) => setyears(e.target.value)}>
                  {selectyear.map((y, i) => <option key={i} value={y}>{y}</option>)}
                </select>
                <button
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${monthlyButton ? "bg-gray-300 dark:bg-slate-600 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
                  onClick={handleMonthlyReport}
                  disabled={monthlyButton}
                >
                  Search
                </button>
              </div>
              <Barchart
                prev_month={M_Y}
                prevMonthRevenue={monthlyReport.rent}
                prevMonthExpense={monthlyReport.expense}
                prevMonthMaintanence={monthlyReport.maintanence}
              />
            </div>

            {/* Yearly Report */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5 shadow-sm">
              <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">Yearly Report</h2>
              <div className="flex gap-2 mb-4 flex-wrap">
                <select className={selectClass} onChange={(e) => setyears(e.target.value)}>
                  {selectyear.map((y, i) => <option key={i} value={y}>{y}</option>)}
                </select>
                <button
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${yearlyButton ? "bg-gray-300 dark:bg-slate-600 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
                  onClick={handleYearlyReport}
                  disabled={yearlyButton}
                >
                  Search
                </button>
              </div>
              <Barchart
                prev_month={years}
                prevMonthRevenue={yearReport.rent}
                prevMonthExpense={yearReport.expense}
                prevMonthMaintanence={yearReport.maintanence}
              />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
