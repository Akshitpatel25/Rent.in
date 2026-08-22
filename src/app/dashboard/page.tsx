"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import DashboardLayout from "@/components/DashboardLayout";
import StatsCards from "@/components/StatsCards";
import QuickActions from "@/components/QuickActions";
import RecentActivity from "@/components/RecentActivity";
import LoadingBar from "@/components/LoadingBar";
import useTheme from "@/zustand/userDetails";
import useProperties from "@/zustand/userProperties";
import dynamic from "next/dynamic";

const RevenueChart = dynamic(() => import("@/components/RevenueChart"), {
  ssr: false,
});

interface todaysEarningDataInterface {
  monthly_rent_price: string;
}

const monthByName = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
];

export default function Dashboard() {
  const { fetchUserProperties, userProperties } = useProperties();
  const { userDetails, fetchUserDetails } = useTheme();
  const router = useRouter();
  const [TodaysEarningData, setTodaysEarningData] = useState<todaysEarningDataInterface[]>([]);
  const [TodaysEarning, setTodaysEarning] = useState("---");
  const [loading, setLoading] = useState(false);
  const [monthlyReport, setMonthlyReport] = useState({
    rent: 0,
    maintenance: 0,
    expense: 0,
  });
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const hasFetchedData = useRef(false);

  const date = new Date();
  const month = date.getMonth();
  const year = date.getFullYear();
  const displayMonthYear = `${monthByName[month]} ${year}`;

  // Step 1: Fetch user details on mount only if not already in store
  useEffect(() => {
    if (!userDetails?._id || userDetails._id === "") {
      fetchUserDetails();
    }
  }, []);

  // Step 2: Once user is ready, fetch dashboard data (only once)
  useEffect(() => {
    if (!userDetails?._id || userDetails._id === "") return;
    if (hasFetchedData.current) return;

    // If we already have properties in store, don't show loading
    const hasExistingData = userProperties && userProperties.length > 0;

    let cancelled = false;

    const loadDashboardData = async () => {
      if (!hasExistingData) setLoading(true);

      try {
        const MY = month === 0 ? `${monthByName[11]}${year - 1}` : `${monthByName[month - 1]}${year}`;

        // Fire all API calls in parallel
        const [earningRes, revenueRes] = await Promise.allSettled([
          fetch("/api/todays-earning", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: userDetails._id }),
            signal: AbortSignal.timeout(10000),
          }).then(r => r.json()),
          fetch("/api/get-previous-month-revenue", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: userDetails._id, M_Y: MY }),
            signal: AbortSignal.timeout(10000),
          }).then(r => r.json()),
        ]);

        if (cancelled) return;

        // Mark as fetched only after success
        hasFetchedData.current = true;

        // Process today's earnings
        if (earningRes.status === "fulfilled" && earningRes.value.data) {
          setTodaysEarningData(earningRes.value.data);
        }

        // Process monthly revenue
        if (revenueRes.status === "fulfilled" && revenueRes.value.data?.[0]) {
          const data = revenueRes.value.data[0];
          setMonthlyReport({
            rent: data?.monthly_rents[0]?.total || 0,
            maintenance: data?.monthly_maintanence[0]?.total || 0,
            expense: data?.monthly_expenses[0]?.total || 0,
          });
        }

        // Fetch properties only if not already loaded
        if (!userProperties || userProperties.length === 0) {
          fetchUserProperties(userDetails.email);
        }
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadDashboardData();

    return () => {
      cancelled = true;
    };
  }, [userDetails?._id]);

  // Step 3: Calculate today's earning from data
  useEffect(() => {
    if (TodaysEarningData.length === 0) return;
    let sum = 0;
    for (let i = 0; i < TodaysEarningData.length; i++) {
      sum += Number(TodaysEarningData[i].monthly_rent_price);
    }
    setTodaysEarning(String(Math.round(sum / 30)));
  }, [TodaysEarningData]);

  // Step 4: Build recent activity once properties are loaded
  useEffect(() => {
    if (userProperties && userProperties.length > 0) {
      const activities = userProperties.slice(0, 5).map((item: any) => ({
        _id: item._id,
        type: "rent" as const,
        title: `Rent from ${item.rent_name}`,
        date: `${monthByName[month]} ${year}`,
        amount: Number(item.monthly_rent_price) || 0,
      }));
      setRecentActivities(activities);
    }
  }, [userProperties]);

  // Redirect if no user after hydration
  useEffect(() => {
    if (userDetails === null) return; // still hydrating
    if (userDetails?._id === "") {
      router.push("/login");
    }
  }, [userDetails]);

  if (!userDetails?._id || userDetails._id === "") {
    // If userDetails is null (logged out), don't show loading - redirect will handle it
    if (userDetails === null) return null;
    return <LoadingBar text="Loading your dashboard..." />;
  }

  if (loading && (!userProperties || userProperties.length === 0)) {
    return <LoadingBar text="Fetching data..." />;
  }

  return (
    <DashboardLayout userName={userDetails?.name || ""}>
      <div className="max-w-7xl mx-auto space-y-5">
        {/* Welcome */}
        <div className="pb-1">
          <p className="text-sm text-gray-500 dark:text-slate-400">Welcome back,</p>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mt-0.5">
            {userDetails?.name ? userDetails.name.charAt(0).toUpperCase() + userDetails.name.slice(1) : ""}
          </h1>
        </div>

        {/* Stats Cards */}
        <StatsCards
          todaysEarning={TodaysEarning}
          totalProperties={userProperties?.length || 0}
          thisMonthRent={monthlyReport.rent}
          totalExpenses={monthlyReport.expense}
        />

        {/* Revenue Chart + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-6">
          <div className="lg:col-span-3 order-2 lg:order-1">
            <RevenueChart
              monthYear={displayMonthYear}
              rent={monthlyReport.rent}
              expense={monthlyReport.expense}
              maintenance={monthlyReport.maintenance}
            />
          </div>
          <div className="lg:col-span-2 order-1 lg:order-2">
            <QuickActions />
          </div>
        </div>

        {/* Recent Activity */}
        <RecentActivity activities={recentActivities} />
      </div>
    </DashboardLayout>
  );
}
