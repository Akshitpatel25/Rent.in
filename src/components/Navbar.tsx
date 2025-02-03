"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Navbar({userData}:any) {
  const [isopenHamb, setIsopenHamb] = useState(false);
  const [isopenUserProfile, setIsopenUserProfile] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isHamopen, setIsHamopen] = useState(false);
  const router = useRouter();

  

  // Ensure hydration before rendering
  useEffect(() => {
    setIsHydrated(true);
    if (isopenHamb) {
      setTimeout(() => {
        setIsHamopen(true);
      }, 400);
    } else {
      setIsHamopen(false);
    }
  }, [isopenHamb]);

  if (!isHydrated) return null;

  // Functions
  async function logout() {
    try {
      await axios.get("/api/logout");
      signOut();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

 
  return (
    <>
      {/* Navbar */}
      <div className="w-full h-full pl-2 pr-2 border border-opacity-15 border-black flex justify-between items-center">
        {/* Hamburger Bar */}
        <div
          className={`hamberger-bar p-2 cursor-pointer flex flex-col items-center transition-all duration-300 ${
            isopenHamb ? "gap-0" : "gap-2"
          }`}
          onClick={() => setIsopenHamb(!isopenHamb)}
        >
          <div className={`bar-1 w-8 lg:w-10 h-0.5 bg-black `}></div>
          <div className={`bar-2 w-8 lg:w-10 h-0.5 bg-black `}></div>
          <div className={`bar-3 w-8 lg:w-10 h-0.5 bg-black `}></div>
        </div>

        {/* Logo */}
        <h1 className="font-semibold text-3xl md:text-4xl">Rent.in</h1>

        {/* Profile Icon */}
        <div
          className="cursor-pointer w-10 h-10 md:w-14 md:h-14 rounded-full flex justify-center items-center"
          onClick={() => setIsopenUserProfile(!isopenUserProfile)}
        >
          <Image
            src="/userIcon1.png"
            alt="Google Sign-In"
            width={50}
            height={50}
          />
        </div>
      </div>

      {/* Left Navigation Bar */}
      <div
        className={`absolute top-0 left-0 bg-white bg-opacity-15 backdrop-blur-md h-full z-10 flex flex-col justify-start items-start border border-[#283618] border-opacity-20 transition-all duration-500 ${
          isopenHamb ? "p-3 w-72" : "p-0 w-0"
        }`}
      >
        <h1
          className="text-2xl w-full flex justify-end cursor-pointer"
          onClick={() => setIsopenHamb(!isopenHamb)}
        >
          X
        </h1>

        {/* Navigation Details */}
        {isHamopen && (
          <>
            <h1 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl mb-4">
              Welcome!
              <br />
              <span className="font-bold">{userData}</span>
            </h1>
            <nav className="w-full flex flex-col gap-y-2">
              <Link
                href="/dashboard"
                className="p-2 bg-white bg-opacity-40 rounded-md text-center md:text-xl hover:bg-opacity-80"
              >
                Dashboard
              </Link>
              <Link
                href="/user-profile"
                className="p-2 bg-white bg-opacity-40 rounded-md text-center md:text-xl hover:bg-opacity-80"
              >
                User Profile
              </Link>
              <Link
                href="/create-new-rent"
                className="p-2 bg-white bg-opacity-40 rounded-md text-center md:text-xl hover:bg-opacity-80"
              >
                Create New Rent
              </Link>
              <Link
                href="/all-properties"
                className="p-2 bg-white bg-opacity-40 rounded-md text-center md:text-xl hover:bg-opacity-80"
              >
                All Properties
              </Link>
              <Link
                href="/add-maintanence"
                className="p-2 bg-white bg-opacity-40 rounded-md text-center md:text-xl hover:bg-opacity-80"
              >
                Add Maintenance
              </Link>
              <Link
                href="/add-expense"
                className="p-2 bg-white bg-opacity-40 rounded-md text-center md:text-xl hover:bg-opacity-80"
              >
                Add Expense
              </Link>
              <Link
                href="/revenue"
                className="p-2 bg-white bg-opacity-40 rounded-md text-center md:text-xl hover:bg-opacity-80"
              >
                Revenue
              </Link>
              <div
                className="p-2 bg-black text-white bg-opacity-60 rounded-md text-center md:text-xl cursor-pointer"
                onClick={logout}
              >
                Logout
              </div>
            </nav>
          </>
        )}
      </div>

      {/* User Profile Dropdown */}
      <div
        className="absolute top-[70px] right-1 w-48 h-28  md:top-[90px] lg:top-[100px] xl:top-[70px] p-2 border bg-white bg-opacity-30 rounded-md backdrop-blur-sm z-10 transition-all ease-in-out duration-500 border-[#283618] border-opacity-20 flex flex-col gap-y-2"
        style={{ display: `${isopenUserProfile ? "flex" : "none"}` }}
      >
        <div className="w-full h-1/2 bg-[#DDA15E] hover:bg-opacity-80 rounded-md bg-opacity-50 flex justify-center items-center cursor-pointer">
          <div
            className="transition-all ease-in-out  duration-500"
            style={{
              display: `${isopenUserProfile ? "flex" : "none"}`,
              fontSize: `${isopenUserProfile ? "16px" : "0px"}`,
            }}
          >
            <Link href={"/user-profile"}>User profile</Link>
          </div>
        </div>
        <div
          className="w-full h-1/2 bg-black rounded-md flex justify-center items-center cursor-pointer"
          onClick={logout}
        >
          <Image
            src="/logoutIconWhite.png"
            width={20}
            height={20}
            alt="Logout"
          />
          <div
            className="transition-all ease-in-out duration-500 text-white"
            style={{ fontSize: `${isopenUserProfile ? "16px" : "0px"}` }}
          >
            Logout
          </div>
        </div>
      </div>
    </>
  );
}
