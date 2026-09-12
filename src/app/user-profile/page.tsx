"use client";
import React, { useEffect, useState } from "react";
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
    whatsapp_numbers: [] as string[],
  });
  const [loading, setLoading] = useState(true);
  const [whatsappNumbers, setWhatsappNumbers] = useState<string[]>([""]);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const getUserDetailsinFrontend = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/me");
      const json = await res.json();
      const numbers = json?.user?.whatsapp_numbers || [];
      setuserData({
        user_id: json?.user?._id!,
        name: json?.user?.name!,
        email: json?.user?.email!,
        isVerified: json?.user?.isVerified,
        whatsapp_numbers: numbers,
      });
      setWhatsappNumbers(numbers.length > 0 ? numbers : [""]);
    } catch (error: any) {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveWhatsapp = async () => {
    setSaving(true);
    setSaveMsg("");
    try {
      const filtered = whatsappNumbers.filter((n) => n.trim() !== "");
      const res = await fetch("/api/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userData.user_id,
          whatsapp_numbers: filtered,
        }),
      });
      const json = await res.json();
      if (res.ok) {
        setSaveMsg("Saved");
        setuserData({ ...userData, whatsapp_numbers: json.user.whatsapp_numbers });
      } else {
        setSaveMsg(json.error || "Failed to save");
      }
    } catch (error) {
      setSaveMsg("Failed to save");
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(""), 2000);
    }
  };

  const addNumberField = () => {
    if (whatsappNumbers.length < 3) {
      setWhatsappNumbers([...whatsappNumbers, ""]);
    }
  };

  const removeNumberField = (index: number) => {
    setWhatsappNumbers(whatsappNumbers.filter((_, i) => i !== index));
  };

  const updateNumber = (index: number, value: string) => {
    const updated = [...whatsappNumbers];
    updated[index] = value;
    setWhatsappNumbers(updated);
  };

  useEffect(() => {
    getUserDetailsinFrontend();
  }, []);

  const inputClass =
    "w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm";

  return (
    <DashboardLayout userName={userData.name}>
      <div className="max-w-lg mx-auto space-y-5">
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
        </div>

        {loading ? (
          <ProfileSkeleton />
        ) : (
          <>
            {/* Profile Card */}
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

                <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                  <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">Name</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">
                    {userData.name}
                  </p>
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

            {/* WhatsApp Numbers Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  WhatsApp Numbers
                </h2>
              </div>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                Add up to 3 numbers to receive monthly rent summaries. Tenants will receive bill notifications on their registered numbers.
              </p>

              <div className="space-y-3">
                {whatsappNumbers.map((num, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 dark:text-slate-500">+91</span>
                      <input
                        type="tel"
                        placeholder="10-digit number"
                        value={num}
                        onChange={(e) => updateNumber(index, e.target.value.replace(/\D/g, "").slice(0, 10))}
                        className={`${inputClass} pl-12`}
                        maxLength={10}
                      />
                    </div>
                    {whatsappNumbers.length > 1 && (
                      <button
                        onClick={() => removeNumberField(index)}
                        className="p-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}

                {whatsappNumbers.length < 3 && (
                  <button
                    onClick={addNumberField}
                    className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Add another number
                  </button>
                )}
              </div>

              {saveMsg && (
                <p className={`text-sm font-medium ${saveMsg === "Saved" ? "text-green-500" : "text-red-500"}`}>
                  {saveMsg}
                </p>
              )}

              <button
                onClick={handleSaveWhatsapp}
                disabled={saving}
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save WhatsApp Numbers"}
              </button>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
