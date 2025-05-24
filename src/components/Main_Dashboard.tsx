import Image from "next/image";
import Barchart from "./Barchart";
import Link from "next/link";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import useTheme from "@/zustand/userDetails";

export default function Main_Dashboard({ userData, todaysEarning }: any) {
  const { userDetails, fetchUserDetails } = useTheme();

  useEffect(() => {
    fetchUserDetails();
  }, []);

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

        
      </div>
    </>
  );
}
