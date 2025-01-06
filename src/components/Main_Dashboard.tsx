import { useContext } from "react";
import Image from "next/image";
import Barchart from "./Barchart";
import Link from "next/link";
export default function Main_Dashboard({user}:any) {
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
        gap-y-4 backdrop-blur-sm bg-white bg-opacity-25
        text-2xl md:text-3xl lg:text-4xl xl:text-6xl
        p-5 md:p-6 lg:p-7
        md:gap-y-6 lg:gap-y-8 xl:gap-y-10"

        >
          <h1
          >Welcome Back! <span className="font-bold ">{user}</span>
          </h1>

          <div
          className="w-full h-fit"
          >
            <h1>$1,000</h1>
            <p
            className="text-sm md:text-md lg:text-lg text-gray-700"
            >Today&apos;s Earnings</p>
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
            alt="as"
            ></Image>
          </div>

        </div>

        <div
        className="w-full h-fit rounded-md flex
        justify-between items-center cursor-pointer
        gap-y-4 backdrop-blur-sm bg-white bg-opacity-25
        text-2xl md:text-3xl lg:text-4xl xl:text-5xl
        p-5 md:p-6 lg:p-7"
        >
          <Link href="/create-new-rent">Create New Rent</Link>
          <span className="text-3xl md:text-4xl lg:text-5xl">+</span>
        </div>

        <div
        className="w-full h-fit rounded-md flex
        justify-between items-center cursor-pointer
        gap-y-4 backdrop-blur-sm bg-white bg-opacity-25
        text-2xl md:text-3xl lg:text-4xl xl:text-5xl
        p-5 md:p-6 lg:p-7"
        >
          <Link href="/all-properties">All Properties</Link>
          <span className="text-3xl md:text-4xl lg:text-5xl">+</span>
        </div>

        <div
        className="w-full h-fit rounded-md flex
        justify-between items-center cursor-pointer
        gap-y-4 backdrop-blur-sm bg-white bg-opacity-25
        text-2xl md:text-3xl lg:text-4xl xl:text-5xl
        p-5 md:p-6 lg:p-7"
        >
          <Link href="/add-expense">Add Expense</Link>
          <span className="text-3xl md:text-4xl lg:text-5xl">+</span>
        </div>

        <div
        className="w-full h-fit rounded-md flex
        justify-between items-center cursor-pointer
        gap-y-4 backdrop-blur-sm bg-white bg-opacity-25
        text-2xl md:text-3xl lg:text-4xl xl:text-5xl
        p-5 md:p-6 lg:p-7"
        >
          <Link href="/add-maintanence">Add Maintanence</Link>
          <span className="text-3xl md:text-4xl lg:text-5xl">+</span>
        </div>

        <div
        className="w-full h-fit rounded-md flex flex-col p-5
        md:p-7 lg:pt-10 md:pl-36 md:pr-36 lg:pl-48 lg:pr-48
        xl:pr-64 xl:pl-64
        justify-between items-center cursor-pointer
        gap-y-4 backdrop-blur-sm bg-white bg-opacity-25"
        >
          <h1 className="w-full text-2xl md:text-3xl lg:text-4xl"
          >Previous Month Revenue</h1>
          <Barchart/>
        </div>

      </div>
    </>
  );
}
