import Image from "next/image";
import Barchart from "./Barchart";
import Link from "next/link";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import useTheme from "@/zustand/userDetails";

export default function Main_Dashboard({ userData, todaysEarning }: any) {
  const { userDetails, fetchUserDetails } = useTheme();
  const date = new Date();
  const month = date.getMonth();
  const year = date.getFullYear();
  const monthByName = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];
  const [M_Y, setM_Y] = useState("");
  const [monthlyReport, setMonthlyReport] = useState({
    rent: 0,
    maintanence: 0,
    expense: 0,
  });

  useEffect(() => {
    fetchUserDetails();
  }, []);

  // useEffect(() => {
  //   if (month == 0) {
  //     setM_Y(`${monthByName[11]}${year - 1}`);
  //   } else {
  //     setM_Y(`${monthByName[month - 1]}${year}`);
  //   }
  // }, []);


  const handleMonthlyReport = async () => {
    // console.log("hii");
    try {
      let MY = `${monthByName[month - 1]}${year}`;
      if (month == 0) {
        MY = `${monthByName[11]}${year - 1}`;
      }
       if (userDetails._id != ""){
      const result = await axios.post("/api/get-previous-month-revenue", {
        user_id: userDetails?._id,
        M_Y: MY,
      });
      // console.log(result);
      const rent = result.data.data[0].monthly_rents[0]?.total || 0;
      const maintanence =
        result.data.data[0].monthly_maintanence[0]?.total || 0;
      const expense = result.data.data[0].monthly_expenses[0]?.total || 0;
      // console.log(rent, maintanence, expense);
      setMonthlyReport({
        rent: rent,
        maintanence: maintanence,
        expense: expense,
      });
      }
    } catch (error) {
      console.log("error in monthly report", error);
    }
  };


  useEffect(() => {
    if (userDetails?._id) {
      handleMonthlyReport();
    }
  }, [userDetails?._id]);


  return (
    <>
      <div
        // main container
        className="w-full h-fit p-3 pb-4
      flex flex-col gap-y-4 md:gap-y-6 lg:gap-y-8 xl:gap-y-10"
      >
        <div
          // welcome box
          className="w-full h-fit rounded-md flex flex-col
        gap-y-4 backdrop-blur-sm bg-white 
        text-2xl md:text-3xl lg:text-4xl xl:text-6xl
        p-5 md:p-6 lg:p-7
        md:gap-y-6 lg:gap-y-8 xl:gap-y-10"
        >
          <h1>
            Welcome Back! <span className="font-bold ">{userData?.name}</span>
          </h1>

          <div className="w-full h-fit">
            <h1>₹{todaysEarning}</h1>
            <p className="text-sm md:text-md lg:text-lg text-gray-700">
              Est Today&apos;s Earnings
            </p>
          </div>

          <div
            className="w-full h-fit flex justify-end
          -mt-20 xl:-mt-24"
          >
            <Image
              className="w-44 h-40 
            md:w-56 md:h-52 md:mr-8 md:-mt-12
            lg:w-64 lg:h-64 lg:mr-12 lg:-mt-12
            xl:w-80 xl:h-72 xl:mr-14 xl:-mt-12"
              src={"/dash-bg.png"}
              width={150}
              height={150}
              alt="dash-bg"
              priority
            ></Image>
          </div>
        </div>

        <Link
          href={"/create-new-rent"}
          className="w-full h-fit rounded-md flex
        justify-between items-center cursor-pointer
        gap-y-4 backdrop-blur-sm bg-white
        text-2xl md:text-3xl lg:text-4xl xl:text-5xl
        p-5 md:p-6 lg:p-7 hover:bg-opacity-60"
        >
          <h1>Create New Rent</h1>
          <span
            className="text-3xl md:text-4xl lg:text-5xl 
          px-2 text-white bg-blue-600 rounded-full"
          >
            +
          </span>
        </Link>

        <Link
          href={"/all-properties"}
          className="w-full h-fit rounded-md flex
        justify-between items-center cursor-pointer
        gap-y-4 backdrop-blur-sm bg-white 
        text-2xl md:text-3xl lg:text-4xl xl:text-5xl
        p-5 md:p-6 lg:p-7 hover:bg-opacity-60"
        >
          <h1>All Properties</h1>
          <span
            className="text-3xl md:text-4xl lg:text-5xl 
          px-2 text-white bg-blue-600 rounded-full"
          >
            +
          </span>
        </Link>

        <Link
          href={"/add-expense"}
          className="w-full h-fit rounded-md flex
        justify-between items-center cursor-pointer
        gap-y-4 backdrop-blur-sm bg-white 
        text-2xl md:text-3xl lg:text-4xl xl:text-5xl
        p-5 md:p-6 lg:p-7 hover:bg-opacity-60"
        >
          <h1>Add Expense</h1>
          <span
            className="text-3xl md:text-4xl lg:text-5xl 
          px-2 text-white bg-blue-600 rounded-full"
          >
            +
          </span>
        </Link>

        <Link
          href={"/add-maintanence"}
          className="w-full h-fit rounded-md flex
        justify-between items-center cursor-pointer
        gap-y-4 backdrop-blur-sm bg-white 
        text-2xl md:text-3xl lg:text-4xl xl:text-5xl
        p-5 md:p-6 lg:p-7 hover:bg-opacity-60"
        >
          <h1>Add Maintanence</h1>
          <span
            className="text-3xl md:text-4xl lg:text-5xl 
          px-2 text-white bg-blue-600 rounded-full"
          >
            +
          </span>
        </Link>

        <Link
          href={"/rents-summary"}
          className="w-full h-fit rounded-md flex
        justify-between items-center cursor-pointer
        gap-y-4 backdrop-blur-sm bg-white
        text-2xl md:text-3xl lg:text-4xl xl:text-5xl
        p-5 md:p-6 lg:p-7 hover:bg-opacity-60"
        >
          <h1>Rents Summary</h1>
          <span
            className="text-3xl md:text-4xl lg:text-5xl 
          px-2 text-white bg-blue-600 rounded-full"
          >
            +
          </span>
        </Link>

        <div
          className="w-full h-fit rounded-md flex flex-col p-5
        md:p-7 lg:pt-10 md:pl-36 md:pr-36 lg:pl-48 lg:pr-48
        xl:pr-64 xl:pl-64
        justify-between items-center cursor-pointer
        gap-y-4 backdrop-blur-sm bg-white "
        >
          <h1 className="w-full text-2xl md:text-3xl lg:text-4xl">
            <span className="font-bold">{monthByName[month-1] + year}</span> Revenue
          </h1>
          <Barchart
            prev_month={M_Y}
            prevMonthRevenue={monthlyReport.rent}
            prevMonthExpense={monthlyReport.expense}
            prevMonthMaintanence={monthlyReport.maintanence}
          />
        </div>
      </div>
    </>
  );
}
