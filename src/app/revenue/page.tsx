"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import CustomSelect from "@/components/CustomSelect";
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
      const res = await fetch("/api/me");
      const json = await res.json();
      setuserData({
        user_id: json?.user?._id!,
        name: json?.user?.name!,
        email: json?.user?.email!,
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
        const res = await fetch("/api/get-monthly-report", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: userData.user_id,
            M_Y: `${month}${years}`,
            M: monthIndex,
            Y: years.slice(-2),
          }),
        });
        const result = await res.json();
        const rent = result.data[0].monthly_rents[0]?.total || 0;
        const maintanence = result.data[0].monthly_maintanence[0]?.total || 0;
        const expense = result.data[0].monthly_expenses[0]?.total || 0;
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
        const res = await fetch("/api/get-yearly-report", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userData.user_id, years }),
        });
        const yearlyReport = await res.json();
        const rent = yearlyReport.data[0].yearlyRentTotal[0]?.totalAmount || 0;
        const electricity = yearlyReport.data[0].yearlyRentTotal[0]?.total_Elec_bill || 0;
        const maintanence = yearlyReport.data[0].yearly_maintanence_amount[0]?.totalMaintanence || 0;
        const expense = yearlyReport.data[0].yearly_expense_amount[0]?.total_expense_sum || 0;
        setYearReport({ rent, electricity, maintanence, expense });
      }
    } catch (error: any) {
      console.log("error in yearly report");
    }
    setYearlyButton(false);
  };

  useEffect(() => { getUserDetailsinFrontend(); }, []);
  useEffect(() => { setM_Y(`${month}${years}`); }, [month, years]);

  const selectClass = "";

  return (
    <DashboardLayout userName={userData.name}>
      <div className="max-w-4xl mx-auto space-y-6">
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Revenue Reports</h1>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">View monthly and yearly revenue breakdown</p>
          </div>
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
                <div className="w-28">
                  <CustomSelect
                    options={months.map((m) => ({ label: m, value: m }))}
                    value={month}
                    onChange={(val) => setmonth(val)}
                  />
                </div>
                <div className="w-24">
                  <CustomSelect
                    options={selectyear.map((y) => ({ label: String(y), value: String(y) }))}
                    value={years}
                    onChange={(val) => setyears(val)}
                  />
                </div>
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
                <div className="w-24">
                  <CustomSelect
                    options={selectyear.map((y) => ({ label: String(y), value: String(y) }))}
                    value={years}
                    onChange={(val) => setyears(val)}
                  />
                </div>
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
