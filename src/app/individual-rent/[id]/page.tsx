"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import useProperties from "@/zustand/userProperties";
import useTheme from "@/zustand/userDetails";

export default function IndividualRent({ params }: any) {
  const router = useRouter();
  const { userDetails } = useTheme();
  const [rentData, setrentData] = useState({
    rent_id: "",
    rent_name: "",
    rent_person_name: "",
    rent_person_num: "",
    rent_person_adhar: "",
    monthly_rent_price: "",
    monthly_ele_bill_price: "",
    ele_unit_price: "",
    deposite: "",
  });
  const [err, seterr] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [allMonthData, setallMonthData] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [isRentPaidBtn, setisRentPaidBtn] = useState(false);
  const paymentMode = ["Not Paid", "cash", "cheque", "upi", "net banking"];
  const [addPaymentMode, setaddPaymentMode] = useState(paymentMode[0]);
  const date = new Date();
  const day = date.getDate();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  const formattedDate = `${day}/${month}/${year}`;
  const [updateNote, setupdateNote] = useState(false);
  const [monthlyRentNoteId, setmonthlyRentNoteId] = useState("");
  const [noteValue, setnoteValue] = useState("");
  const [delMonth, setdelMonth] = useState(false);
  const [delMsgName, setdelMsgName] = useState("");
  const [delMsgId, setdelMsgId] = useState("");
  const [updateRentAmount, setupdateRentAmount] = useState("");
  const [isupdateAmount, setisupdateAmount] = useState(false);
  const [updateAmountMonthId, setupdateAmountMonthId] = useState("");

  // Edit drawer state
  const [editData, setEditData] = useState({ ...rentData });
  const [copiedField, setCopiedField] = useState("");

  // Prev/Next navigation
  const { userProperties } = useProperties();
  const [currentId, setCurrentId] = useState("");
  const [prevId, setPrevId] = useState<string | null>(null);
  const [nextId, setNextId] = useState<string | null>(null);

  useEffect(() => {
    const resolveParams = async () => {
      const { id } = await params;
      if (id !== currentId) {
        setrentData({ rent_id: "", rent_name: "", rent_person_name: "", rent_person_num: "", rent_person_adhar: "", monthly_rent_price: "", monthly_ele_bill_price: "", ele_unit_price: "", deposite: "" });
        setallMonthData([]);
        setVisibleCount(5);
      }
      setCurrentId(id);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (userProperties && currentId) {
      const index = userProperties.findIndex((p: any) => p._id === currentId);
      setPrevId(index > 0 ? userProperties[index - 1]._id : null);
      setNextId(index < userProperties.length - 1 ? userProperties[index + 1]._id : null);
    }
  }, [userProperties, currentId]);

  const getingParamCheck = async () => {
    try {
      const { id } = await params;
      const res = await fetch("/api/individual-rent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        const json = await res.json();
        const d = json.data;
        setrentData({
          rent_id: d._id,
          rent_name: d.rent_name,
          rent_person_name: d.rent_person_name,
          rent_person_num: d.rent_person_num,
          rent_person_adhar: d.rent_person_adhar,
          monthly_rent_price: d.monthly_rent_price,
          monthly_ele_bill_price: d.monthly_ele_bill_price,
          ele_unit_price: d.ele_unit_price,
          deposite: d.deposite,
        });
      }
    } catch (error: any) {
      seterr("Failed to load rent details");
    }
  };

  const handleSaveEdit = async () => {
    try {
      await fetch("/api/edit-rent-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rentData: editData }),
      });
      setrentData(editData);
      setIsDrawerOpen(false);
    } catch (error: any) {
      seterr("Failed to save changes");
    }
  };

  const openEditDrawer = () => {
    setEditData({ ...rentData });
    setIsDrawerOpen(true);
  };

  const gettingAllMonthData = async () => {
    try {
      const { id } = await params;
      const res = await fetch("/api/getting-monthly-rent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        const json = await res.json();
        setallMonthData(json.data);
      }
    } catch (error: any) {
      console.log("error: ", error);
    }
  };

  const updateNoteHandle = async (id: string) => {
    if (noteValue === "" || id.length < 1) return;
    try {
      await fetch("/api/update-monthly-rent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, noteValue }),
      });
    } catch (error: any) {}
    gettingAllMonthData();
    setupdateNote(false);
  };

  const deleteMonthMsg = (id: string, monthName: string) => {
    setdelMonth(true);
    setdelMsgName(monthName);
    setdelMsgId(id);
  };

  const deleteMonthData = async (id: string) => {
    if (id.length < 1) return;
    try {
      await fetch("/api/update-monthly-rent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, delete: true }),
      });
      gettingAllMonthData();
    } catch (error: any) {}
    setdelMonth(false);
  };

  const updatepaymentMode = async (id: string) => {
    if (addPaymentMode === paymentMode[0] || id.length < 1) return;
    try {
      await fetch("/api/update-monthly-rent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, addPaymentMode, formattedDate }),
      });
    } catch (error: any) {}
    gettingAllMonthData();
    setisRentPaidBtn(false);
  };

  const handleRentAmountChange = async (id: string, amount: string) => {
    if (id.length < 1 || amount.length < 1) return;
    try {
      await fetch("/api/update-monthly-rent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, amount }),
      });
      gettingAllMonthData();
    } catch (error: any) {}
    setisupdateAmount(false);
    setupdateAmountMonthId("");
  };

  useEffect(() => {
    getingParamCheck();
    gettingAllMonthData();
  }, [currentId]);

  useEffect(() => {
    if (err) setTimeout(() => seterr(""), 3000);
  }, [err]);

  const fields = [
    { key: "rent_name", label: "Rent Name" },
    { key: "rent_person_name", label: "Person Name" },
    { key: "rent_person_num", label: "Phone" },
    { key: "rent_person_adhar", label: "Aadhaar" },
    { key: "monthly_rent_price", label: "Monthly Rent", prefix: "₹" },
    { key: "monthly_ele_bill_price", label: "Elec Bill /mo", prefix: "₹" },
    { key: "ele_unit_price", label: "Unit Price", prefix: "₹" },
    { key: "deposite", label: "Deposit", prefix: "₹" },
  ];

  const inputClass =
    "w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm";

  return (
    <DashboardLayout userName={userDetails?.name || ""}>
      <div className="max-w-3xl mx-auto space-y-5">
        {err && (
          <p className="text-sm font-medium text-red-500 text-center">{err}</p>
        )}

        {/* Property Header - Compact with dropdown + edit */}
        {rentData.rent_id ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
            {/* Main row - always visible */}
            <div className="flex items-center p-4">
              {/* Dropdown toggle */}
              <button
                onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                className="flex-1 flex items-center gap-3 text-left"
              >
                <div className="w-11 h-11 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white truncate">
                    {rentData.rent_name}
                  </h1>
                  <p className="text-base text-gray-500 dark:text-slate-400 truncate">
                    {rentData.rent_person_name.split(" ")[0]}
                  </p>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isDetailsOpen ? "rotate-180" : ""}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Edit button - icon only on mobile */}
              <button
                onClick={openEditDrawer}
                className="ml-3 p-2.5 md:px-4 md:py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors active:scale-95 shrink-0"
              >
                <svg className="w-4 h-4 md:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                <span className="hidden md:inline">Edit</span>
              </button>
            </div>

            {/* Dropdown details */}
            {isDetailsOpen && (
              <div className="border-t border-gray-100 dark:border-slate-700 px-5 py-3 space-y-2.5 bg-slate-50/50 dark:bg-slate-800/50">
                {fields.map((field) => {
                  const value = (rentData as any)[field.key];
                  const isCopyable = field.key === "rent_person_name" || field.key === "rent_person_num" || field.key === "rent_person_adhar";
                  return (
                    <div key={field.key} className="flex justify-between items-center py-1.5">
                      <span className="text-sm text-gray-500 dark:text-slate-400">{field.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-medium text-gray-900 dark:text-white">
                          {field.prefix || ""}{value}
                        </span>
                        {isCopyable && (
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(value);
                              setCopiedField(field.key);
                              setTimeout(() => setCopiedField(""), 500);
                            }}
                            className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                            title={`Copy ${field.label}`}
                          >
                            {copiedField === field.key ? (
                              <svg className="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gray-200 dark:bg-slate-700 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-1/3 bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse" />
                  <div className="h-4 w-1/2 bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse" />
                </div>
              </div>
            </div>
            {[1,2,3].map(i => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-4 shadow-sm space-y-3">
                <div className="h-6 w-20 bg-gray-200 dark:bg-slate-700 rounded-full animate-pulse" />
                <div className="space-y-2">
                  <div className="flex justify-between"><div className="h-4 w-16 bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse" /><div className="h-4 w-24 bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse" /></div>
                  <div className="flex justify-between"><div className="h-4 w-12 bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse" /><div className="h-4 w-20 bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse" /></div>
                  <div className="flex justify-between"><div className="h-4 w-20 bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse" /><div className="h-4 w-16 bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse" /></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back + Prev / Next Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push("/all-properties")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </button>
            {prevId && (
              <button
                onClick={() => router.push(`/individual-rent/${prevId}`)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors active:scale-95"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Prev
              </button>
            )}
          </div>
          {nextId && (
            <button
              onClick={() => router.push(`/individual-rent/${nextId}`)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors active:scale-95"
            >
              Next
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>

        {/* Monthly Rents Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Monthly Rents</h2>
          <Link
            href={`/add-monthly-rents/${rentData.rent_id}`}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm transition-colors active:scale-95 shadow-md shadow-blue-200 dark:shadow-blue-900/30"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Month
          </Link>
        </div>

        {/* Monthly Cards */}
        <div className="space-y-3">
          {allMonthData && allMonthData.length > 0 ? (
            <>
              {allMonthData.slice().reverse().slice(0, visibleCount).map((monthItem: any) => (
              <div
                key={monthItem._id}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-4 shadow-sm"
              >
                {/* Month Header */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-base font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
                    {monthItem.month_year}
                  </span>
                  <button
                    onClick={() => deleteMonthMsg(monthItem._id, monthItem.month_year)}
                    className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                {/* Month Details */}
                <div className="space-y-2.5 text-base">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-slate-400">Person</span>
                    <span className="font-medium text-gray-900 dark:text-white">{monthItem.rent_person_name}</span>
                  </div>

                  {/* Rent Amount */}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 dark:text-slate-400">Rent</span>
                    {updateAmountMonthId === monthItem._id && isupdateAmount ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={updateRentAmount}
                          onChange={(e) => setupdateRentAmount(e.target.value)}
                          className="w-24 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-sm text-right text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => handleRentAmountChange(updateAmountMonthId, updateRentAmount)}
                          className="p-1 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20"
                        >
                          <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 dark:text-white">₹{monthItem.monthly_rent_price}</span>
                        <button
                          onClick={() => {
                            setisupdateAmount(true);
                            setupdateAmountMonthId(monthItem._id);
                            setupdateRentAmount(monthItem.monthly_rent_price);
                          }}
                          className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
                        >
                          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-slate-400">Electricity</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      ₹{isNaN(parseFloat(monthItem.electricity_bill)) ? "0.00" : parseFloat(monthItem.electricity_bill).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-slate-400">Meter</span>
                    <span className="font-medium text-gray-900 dark:text-white">{monthItem.meter_reading} unit</span>
                  </div>

                  {/* Payment Status */}
                  <div className="flex justify-between items-center pt-2 border-t border-gray-50 dark:border-slate-700/50 mt-2">
                    <span className="text-gray-500 dark:text-slate-400">Payment</span>
                    {monthItem.payment_mode === "Not Paid" ? (
                      <div className="flex items-center gap-2">
                        {isRentPaidBtn ? (
                          <>
                            <select
                              className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-sm text-gray-900 dark:text-white focus:outline-none"
                              onChange={(e) => setaddPaymentMode(e.target.value)}
                            >
                              {paymentMode.map((item, i) => (
                                <option key={i} value={item}>{item}</option>
                              ))}
                            </select>
                            <button
                              onClick={() => updatepaymentMode(monthItem._id)}
                              className="p-1 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20"
                            >
                              <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                          </>
                        ) : (
                          <>
                            <span className="text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-full">
                              Not Paid
                            </span>
                            <button
                              onClick={() => setisRentPaidBtn(true)}
                              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
                            >
                              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="text-right">
                        <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">
                          {monthItem.payment_mode}
                        </span>
                        {monthItem.Rent_Paid_date && (
                          <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">{monthItem.Rent_Paid_date}</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Note */}
                  {monthItem.note && (
                    <div className="flex justify-between items-start pt-2 border-t border-gray-50 dark:border-slate-700/50 mt-2">
                      <div className="flex-1">
                        <span className="text-gray-500 dark:text-slate-400 text-xs">Note</span>
                        {updateNote && monthlyRentNoteId === monthItem._id ? (
                          <textarea
                            value={noteValue}
                            onChange={(e) => setnoteValue(e.target.value)}
                            className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            rows={2}
                          />
                        ) : (
                          <p className="text-sm text-gray-700 dark:text-slate-300 mt-0.5">{monthItem.note}</p>
                        )}
                      </div>
                      <button
                        className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 ml-2 shrink-0"
                        onClick={() => {
                          if (updateNote && monthlyRentNoteId === monthItem._id) {
                            updateNoteHandle(monthItem._id);
                          } else {
                            setupdateNote(true);
                            setmonthlyRentNoteId(monthItem._id);
                            setnoteValue(monthItem.note);
                          }
                        }}
                      >
                        {updateNote && monthlyRentNoteId === monthItem._id ? (
                          <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

              {/* Load more trigger */}
              {visibleCount < allMonthData.length && (
                <div className="flex justify-center pt-2 pb-4">
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 5)}
                    className="px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sm font-medium text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Load more ({allMonthData.length - visibleCount} remaining)
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="py-10 text-center bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700">
              <p className="text-gray-400 dark:text-slate-500 text-sm">No monthly rent data yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Drawer (slides from right) */}
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={() => setIsDrawerOpen(false)}
          />
          {/* Drawer */}
          <div className="fixed top-0 right-0 h-full w-full max-w-sm bg-white dark:bg-slate-900 z-50 shadow-2xl flex flex-col animate-slide-in">
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-slate-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Edit Details</h2>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {fields.map((field) => (
                <div key={field.key}>
                  <label className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5 block">
                    {field.label}
                  </label>
                  <input
                    type="text"
                    value={(editData as any)[field.key]}
                    onChange={(e) => setEditData({ ...editData, [field.key]: e.target.value })}
                    className={inputClass}
                  />
                </div>
              ))}
            </div>

            {/* Drawer Footer */}
            <div className="p-5 border-t border-gray-100 dark:border-slate-800 flex gap-3">
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 font-medium hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors active:scale-[0.98] shadow-md shadow-blue-200 dark:shadow-blue-900/30"
              >
                Save Changes
              </button>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {delMonth && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-xl border border-gray-100 dark:border-slate-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white text-center">Delete Month</h3>
            <p className="text-gray-500 dark:text-slate-400 text-center mt-2">
              Delete <span className="font-semibold text-gray-900 dark:text-white">{delMsgName}</span> record?
            </p>
            <div className="flex gap-3 mt-5">
              <button
                className="flex-1 py-2.5 rounded-xl bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 font-medium hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                onClick={() => setdelMonth(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
                onClick={() => deleteMonthData(delMsgId)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
