"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";

export default function AddExpense() {
  const router = useRouter();
  const [userData, setuserData] = useState({
    userId: "",
    name: "",
    email: "",
  });
  const date = new Date();
  const month = date.getMonth();
  const year = date.getFullYear();
  const monthByName = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [err, seterr] = useState("");
  const [loading, setloading] = useState(false);
  const [allExpense, setAllExpense] = useState([]);
  const [isdelmsg, setisdelmsg] = useState(false);
  const [yesloading, setyesloading] = useState(false);
  const [delExpenseData, setdelExpenseData] = useState({ id: "", name: "" });

  const getUserDetailsinFrontend = async () => {
    try {
      const res = await fetch("/api/me");
      const json = await res.json();
      setuserData({
        userId: json?.user?._id!,
        name: json?.user?.name!,
        email: json?.user?.email!,
      });
    } catch (error) {
      router.push("/login");
    }
  };

  const handleAddExpense = async () => {
    setloading(true);
    if (!userData.userId || !expenseName || !expenseAmount) {
      seterr("Please fill all the fields");
      setloading(false);
      return;
    }
    const expenseM_Y = monthByName[month] + year;
    try {
      const res = await fetch("/api/add-expense", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userID: userData.userId,
          expenseName,
          expenseAmount,
          expenseM_Y,
          expense_Day: date.getDate(),
        }),
      });
      const json = await res.json();
      if (res.ok) {
        seterr("Expense added");
        getAllExpenses();
      } else {
        seterr(json?.error || "Failed to add expense");
      }
    } catch (error: any) {
      seterr("Failed to add expense");
    }
    setloading(false);
    setExpenseName("");
    setExpenseAmount("");
  };

  const getAllExpenses = async () => {
    try {
      const res = await fetch("/api/add-expense", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userID: userData.userId,
          getAllExpense: true,
        }),
      });
      const json = await res.json();
      setAllExpense(json.data);
    } catch (error: any) {}
  };

  const handleDeleteExpenseMsg = (id: string, expenseName: string) => {
    setisdelmsg(true);
    setdelExpenseData({ id, name: expenseName });
  };

  const handleDeleteExpense = async () => {
    setyesloading(true);
    try {
      const res = await fetch("/api/add-expense", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: delExpenseData.id, deleteExpense: true }),
      });
      const json = await res.json();
      if (!res.ok) {
        seterr(json?.error || "Failed to delete expense");
      }
      getAllExpenses();
    } catch (error: any) {
      seterr("Failed to delete expense");
    }
    setyesloading(false);
    setisdelmsg(false);
  };

  useEffect(() => {
    getUserDetailsinFrontend();
    getAllExpenses();
  }, [userData.userId]);

  useEffect(() => {
    setTimeout(() => seterr(""), 4000);
  }, [err]);

  const inputClass =
    "flex-1 px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm";

  return (
    <DashboardLayout userName={userData.name}>
      <div className="max-w-2xl mx-auto space-y-5">
        {/* Header */}
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add Expense</h1>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
              {monthByName[month]} {year}
            </p>
          </div>
        </div>

        {err && (
          <p className={`text-sm font-medium ${err === "Expense added" ? "text-green-500" : "text-red-500"}`}>
            {err}
          </p>
        )}

        {userData.name === "" ? (
          <div className="flex justify-center py-16">
            <Image src="/ZKZg.gif" width={40} height={40} alt="loading..." priority />
          </div>
        ) : (
          <>
            {/* Add Form */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-4 shadow-sm">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Expense name"
                  value={expenseName}
                  onChange={(e) => setExpenseName(e.target.value)}
                  className={inputClass}
                />
                <input
                  type="number"
                  placeholder="Amount"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  className="w-28 px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                />
                <button
                  onClick={handleAddExpense}
                  disabled={loading}
                  className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm transition-colors active:scale-95 shrink-0"
                >
                  {loading ? "..." : "Add"}
                </button>
              </div>
            </div>

            {/* Expense List */}
            <div className="space-y-3">
              {allExpense.length > 0 ? (
                allExpense.slice().reverse().map((expense: any) => (
                  <div
                    key={expense._id}
                    className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-4 flex items-center shadow-sm"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                          <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {expense.expense_name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-slate-400">
                            {expense.expense_Day} - {expense.expense_M_Y}
                          </p>
                        </div>
                      </div>
                    </div>
                    <span className="text-base font-bold text-red-600 dark:text-red-400 mr-3">
                      ₹{Number(expense.expense_amount).toLocaleString("en-IN")}
                    </span>
                    <button
                      onClick={() => handleDeleteExpenseMsg(expense._id, expense.expense_name)}
                      className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700">
                  <p className="text-gray-400 dark:text-slate-500 text-sm">No expenses added yet</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Delete Modal */}
      {isdelmsg && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-xl border border-gray-100 dark:border-slate-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white text-center">Delete Expense</h3>
            <p className="text-gray-500 dark:text-slate-400 text-center mt-2">
              Delete <span className="font-semibold text-gray-900 dark:text-white">{delExpenseData.name}</span>?
            </p>
            <div className="flex gap-3 mt-5">
              <button
                className="flex-1 py-2.5 rounded-xl bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 font-medium hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                onClick={() => setisdelmsg(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                onClick={handleDeleteExpense}
              >
                Delete
                {yesloading && <Image src="/ZKZg.gif" width={15} height={15} alt="loading..." priority />}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
