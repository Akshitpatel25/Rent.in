"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import DashboardLayout from "@/components/DashboardLayout";

export default function AddMonthlyRents({ params }: any) {
  const router = useRouter();
  const [userData, setuserData] = useState({ name: "", email: "" });
  const [rentData, setrentData] = useState({
    user_id: "",
    rent_id: "",
    rent_name: "",
    rent_person_name: "",
    rent_person_num: "",
    rent_person_adhar: "",
    monthly_rent_price: "",
    monthly_ele_bill_price: "",
    ele_unit_price: "",
  });
  const [err, seterr] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("JAN");
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState("");
  const [monthIndex, setMonthIndex] = useState(0);
  const years = [currentYear, currentYear - 1];
  const MonthByName = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
  const [isElecheck, setisElechecked] = useState(false);
  const [meterReading, setmeterReading] = useState("");
  const [isRentPaid, setisRentPaid] = useState(false);
  const paymentMethod = ["cash", "cheque", "upi", "net banking"];
  const [paymentMode, setpaymentMode] = useState("Select Payment Mode");
  const [note, setnote] = useState("All Clear");
  const [submitLoading, setsubmitLoading] = useState(false);
  const date = new Date();
  const day = date.getDate();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  const formattedDate = `${day}/${month}/${year}`;

  const getUserDetailsinFrontend = async () => {
    try {
      const res = await axios.get("/api/me");
      setuserData({ name: res?.data?.user?.name!, email: res?.data?.user?.email! });
    } catch (error) {
      router.push("/login");
    }
  };

  const getingParamCheck = async () => {
    try {
      const { id } = await params;
      const res = await axios.post(`/api/individual-rent/`, { id });
      if (res.status === 200) {
        setrentData({
          user_id: res.data.data.user_id,
          rent_id: res.data.data._id,
          rent_name: res.data.data.rent_name,
          rent_person_name: res.data.data.rent_person_name,
          rent_person_num: res.data.data.rent_person_num,
          rent_person_adhar: res.data.data.rent_person_adhar,
          monthly_rent_price: res.data.data.monthly_rent_price,
          monthly_ele_bill_price: res.data.data.monthly_ele_bill_price,
          ele_unit_price: res.data.data.ele_unit_price,
        });
      }
    } catch (error: any) {
      seterr("Failed to load rent data");
    }
  };

  const MonthHandleChange = (e: any) => {
    const idx = e.target.value;
    setMonthIndex(idx);
    setSelectedMonth(MonthByName[idx]);
  };

  const YearHandleChange = (e: any) => {
    setSelectedYear(e.target.value);
  };

  const handleCreateNewMonthRent = async () => {
    if (selectedMonth === "" || selectedYear === "") {
      return seterr("Select Month and Year");
    } else if (!isElecheck) {
      if (meterReading === "") return seterr("Enter Meter Reading");
    } else if (isRentPaid) {
      if (paymentMode === "Select Payment Mode") return seterr("Select Payment Mode");
    } else if (isElecheck && !isRentPaid) {
      return seterr("If you select Default Electric Price, then you have to select Rent paid");
    }
    setsubmitLoading(true);

    try {
      // Determine previous month for electricity calculation
      let prevMonth: string;
      let prevYear: string | number;
      if (selectedMonth === "JAN") {
        prevMonth = "DEC";
        prevYear = Number(selectedYear) - 1;
      } else {
        prevMonth = MonthByName[monthIndex - 1];
        prevYear = selectedYear;
      }
      const finalM_Y = prevMonth + prevYear;

      if (isElecheck && isRentPaid) {
        // Default electric price + rent paid
        const resp = await axios.post("/api/find-previous-month", { finalM_Y, rent_id: rentData.rent_id });
        const payload = {
          user_id: rentData.user_id,
          rent_id: rentData.rent_id,
          rent_name: rentData.rent_name,
          rent_person_name: rentData.rent_person_name,
          rent_person_adhar: rentData.rent_person_adhar,
          monthly_rent_price: rentData.monthly_rent_price,
          month_year: selectedMonth + selectedYear,
          meter_reading: resp.status === 200 ? resp.data.data.meter_reading : "0",
          electricity_bill: rentData.monthly_ele_bill_price,
          payment_mode: paymentMode,
          note: note,
          Rent_Paid_date: formattedDate,
        };
        const res = await axios.post("/api/create-new-monthly-rent", payload);
        if (res.status === 409) {
          seterr(`You have already stored data for ${selectedMonth + selectedYear}`);
        } else {
          router.push(`/individual-rent/${rentData.rent_id}`);
          return;
        }
      } else if (!isElecheck && !isRentPaid) {
        // Meter reading + not paid
        const resp = await axios.post("/api/find-previous-month", { finalM_Y, rent_id: rentData.rent_id });
        let elecBill: number;
        let mReading = meterReading;
        if (resp.status === 202) {
          elecBill = Number(meterReading) * Number(rentData.ele_unit_price);
        } else {
          elecBill = (Number(meterReading) - Number(resp.data.data.meter_reading)) * Number(rentData.ele_unit_price);
        }
        const payload = {
          user_id: rentData.user_id,
          rent_id: rentData.rent_id,
          rent_name: rentData.rent_name,
          rent_person_name: rentData.rent_person_name,
          rent_person_adhar: rentData.rent_person_adhar,
          monthly_rent_price: rentData.monthly_rent_price,
          month_year: selectedMonth + selectedYear,
          meter_reading: mReading,
          electricity_bill: elecBill.toString(),
          payment_mode: "Not Paid",
          note: note,
          Rent_Paid_date: formattedDate,
        };
        const res = await axios.post("/api/create-new-monthly-rent", payload);
        if (res.status === 409) {
          seterr(`You have already stored data for ${selectedMonth + selectedYear}`);
        } else {
          router.push(`/individual-rent/${rentData.rent_id}`);
          return;
        }
      } else if (!isElecheck && isRentPaid) {
        // Meter reading + rent paid
        const resp = await axios.post("/api/find-previous-month", { finalM_Y, rent_id: rentData.rent_id });
        let elecBill: number;
        if (resp.status === 202) {
          elecBill = Number(meterReading) * Number(rentData.ele_unit_price);
        } else {
          elecBill = (Number(meterReading) - Number(resp.data.data.meter_reading)) * Number(rentData.ele_unit_price);
        }
        const payload = {
          user_id: rentData.user_id,
          rent_id: rentData.rent_id,
          rent_name: rentData.rent_name,
          rent_person_name: rentData.rent_person_name,
          rent_person_adhar: rentData.rent_person_adhar,
          monthly_rent_price: rentData.monthly_rent_price,
          month_year: selectedMonth + selectedYear,
          meter_reading: meterReading,
          electricity_bill: elecBill.toString(),
          payment_mode: paymentMode,
          note: note,
          Rent_Paid_date: formattedDate,
        };
        const res = await axios.post("/api/create-new-monthly-rent", payload);
        if (res.status === 409) {
          seterr(`You have already stored data for ${selectedMonth + selectedYear}`);
        } else {
          router.push(`/individual-rent/${rentData.rent_id}`);
          return;
        }
      }
    } catch (error: any) {
      if (error.response?.status === 409) {
        seterr(`You have already stored data for ${selectedMonth + selectedYear}`);
      } else {
        seterr("Something went wrong");
      }
    }
    setsubmitLoading(false);
  };

  useEffect(() => {
    getingParamCheck();
    getUserDetailsinFrontend();
  }, []);

  useEffect(() => {
    if (err) setTimeout(() => seterr(""), 3000);
  }, [err]);

  const selectClass =
    "w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all";
  const inputClass = selectClass;

  return (
    <DashboardLayout userName={userData.name}>
      <div className="max-w-lg mx-auto space-y-5">
        {rentData.rent_id ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6 shadow-sm">
            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Add Monthly Rent
              </h1>
              <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                {rentData.rent_name} - {rentData.rent_person_name}
              </p>
            </div>

            {err && (
              <p className="text-sm font-medium text-red-500 text-center mb-4">{err}</p>
            )}

            <div className="space-y-4">
              {/* Month & Year Selection */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5 block">
                    Month
                  </label>
                  <select className={selectClass} onChange={MonthHandleChange}>
                    {MonthByName.map((m, index) => (
                      <option key={index} value={index}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5 block">
                    Year
                  </label>
                  <select className={selectClass} onChange={YearHandleChange}>
                    <option value="">Select year</option>
                    {years.map((y, index) => (
                      <option key={index} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Default Electric Price Toggle */}
              <label className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-gray-100 dark:border-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  onChange={(e) => setisElechecked(e.target.checked)}
                />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Use Default Electric Price</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">₹{rentData.monthly_ele_bill_price}/month</p>
                </div>
              </label>

              {/* Meter Reading (shown when not using default) */}
              {!isElecheck && (
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5 block">
                    Current Meter Reading
                  </label>
                  <input
                    type="number"
                    placeholder="Enter meter reading in units"
                    className={inputClass}
                    onChange={(e) => setmeterReading(e.target.value)}
                    value={meterReading}
                  />
                </div>
              )}

              {/* Rent Paid Toggle */}
              <label className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-gray-100 dark:border-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  onChange={(e) => setisRentPaid(e.target.checked)}
                />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Mark as Rent Paid</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">₹{rentData.monthly_rent_price}/month</p>
                </div>
              </label>

              {/* Payment Details (shown when rent paid) */}
              {isRentPaid && (
                <div className="space-y-3 p-4 rounded-xl border border-green-200 dark:border-green-800/50 bg-green-50/50 dark:bg-green-900/10">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5 block">
                      Payment Mode
                    </label>
                    <select
                      className={selectClass}
                      onChange={(e) => setpaymentMode(e.target.value)}
                    >
                      <option>Select Payment Mode</option>
                      {paymentMethod.map((mode, index) => (
                        <option key={index} value={mode}>{mode}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5 block">
                      Note
                    </label>
                    <textarea
                      className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                      rows={2}
                      onChange={(e) => setnote(e.target.value)}
                      placeholder="Any note about this rent"
                    />
                  </div>
                </div>
              )}

              {/* Submit */}
              <button
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-base transition-colors flex items-center justify-center gap-2 mt-2 active:scale-[0.98] shadow-md shadow-blue-200 dark:shadow-blue-900/30 disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={handleCreateNewMonthRent}
                disabled={submitLoading}
              >
                {submitLoading ? (
                  <>
                    Creating...
                    <Image src="/ZKZg.gif" width={20} height={20} alt="loading..." priority />
                  </>
                ) : (
                  "Create Monthly Rent"
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
