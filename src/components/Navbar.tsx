"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Navbar({ Nav_user }: any) {
  const [isopenHamb, setIsopenHamb] = useState(false);
  const [isopenUserProfile, setIsopenUserProfile] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  const router = useRouter();

  // Ensure hydration before rendering
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) return null;

  // Functions
  async function logout() {
    try {
      await axios.get('/api/logout');
      signOut();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  return (
    <>
      {/* Navbar */}
      <div className="w-full h-full pl-2 pr-2 border border-black flex justify-between items-center">
        {/* Hamburger Bar */}
        <div
          className={`hamberger-bar p-2 cursor-pointer flex flex-col items-center transition-all duration-300 ${
            isopenHamb ? 'gap-0' : 'gap-2'
          }`}
          onClick={() => setIsopenHamb(!isopenHamb)}
        >
          <div className={`bar-1 w-8 lg:w-10 h-0.5 bg-black ${isopenHamb ? 'rotate-45' : 'rotate-0'} transition-all`}></div>
          <div className={`bar-2 w-8 lg:w-10 h-0.5 bg-black ${isopenHamb ? 'opacity-0' : 'opacity-100'} transition-opacity`}></div>
          <div className={`bar-3 w-8 lg:w-10 h-0.5 bg-black ${isopenHamb ? '-rotate-45' : 'rotate-0'} transition-all`}></div>
        </div>

        {/* Logo */}
        <h1 className="font-semibold text-3xl md:text-4xl">Rent.in</h1>

        {/* Profile Icon */}
        <div
          className="cursor-pointer w-10 h-10 md:w-14 md:h-14 rounded-full flex justify-center items-center"
          onClick={() => setIsopenUserProfile(!isopenUserProfile)}
        >
          <Image src="/userIcon1.png" alt="Google Sign-In" width={50} height={50} />
        </div>
      </div>

      {/* Left Navigation Bar */}
      <div
        className={`absolute top-0 left-0 bg-white bg-opacity-15 backdrop-blur-md h-full z-10 flex flex-col justify-start items-start border border-[#283618] border-opacity-20 transition-all duration-500 ${
          isopenHamb ? 'p-3 w-72' : 'p-0 w-0'
        }`}
      >
        <h1 className="text-2xl w-full flex justify-end cursor-pointer" onClick={() => setIsopenHamb(!isopenHamb)}>
          X
        </h1>

        {/* Navigation Details */}
        {isopenHamb && (
          <>
            <h1 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl mb-4">Welcome!<br /><span className="font-bold">{Nav_user}</span></h1>
            <nav className="w-full flex flex-col gap-y-2">
              <Link href="/dashboard" className="p-2 bg-white bg-opacity-40 rounded-md text-center md:text-xl">Dashboard</Link>
              <Link href="/create-new-rent" className="p-2 bg-white bg-opacity-40 rounded-md text-center md:text-xl">Create New Rent</Link>
              <Link href="/all-properties" className="p-2 bg-white bg-opacity-40 rounded-md text-center md:text-xl">All Properties</Link>
              <Link href="/add-maintanence" className="p-2 bg-white bg-opacity-40 rounded-md text-center md:text-xl">Add Maintenance</Link>
              <Link href="/add-expense" className="p-2 bg-white bg-opacity-40 rounded-md text-center md:text-xl">Add Expense</Link>
              <Link href="/revenue" className="p-2 bg-white bg-opacity-40 rounded-md text-center md:text-xl">Revenue</Link>
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
        className="absolute top-[70px] right-0 md:top-[90px] lg:top-[100px] xl:top-[70px] border w-40 bg-white bg-opacity-15 rounded-md backdrop-blur-sm z-10 transition-all ease-in-out duration-500 border-[#283618] border-opacity-20 flex flex-col gap-y-2"
        style={{ width: `${isopenUserProfile ? '180px' : '0px'}`, height: `${isopenUserProfile ? '120px' : '0px'}`, padding: `${isopenUserProfile ? '7px' : '0px'}` }}
      >
        <div className="w-full h-1/2 bg-[#DDA15E] rounded-md bg-opacity-50 flex justify-center items-center cursor-pointer">
          <div className="transition-all ease-in-out delay-500 duration-500" style={{ fontSize: `${isopenUserProfile ? '16px' : '0px'}` }}>User Profile</div>
        </div>
        <div className="w-full h-1/2 bg-black rounded-md flex justify-center items-center cursor-pointer" onClick={logout}>
          <Image src="/logoutIconWhite.png" width={15} height={15} alt="Logout" />
          <div className="transition-all ease-in-out duration-500 text-white" style={{ fontSize: `${isopenUserProfile ? '16px' : '0px'}` }}>Logout</div>
        </div>
      </div>
    </>
  );
}
