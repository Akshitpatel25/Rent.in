"use client";
import Navbar from "@/components/Navbar";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import Image from "next/image";


export default function AddExpense() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const user = session?.user;

  const style = {
    background:
      "linear-gradient(0deg, rgba(188,108,37,1) 0%, rgba(221,161,94,1) 49%, rgba(254,250,224,1) 100%)",
    };

  useEffect(()=> {
     if (user) {
      setLoading(true);
    }
  },[session?.user, user]);


  if (!loading) {
      return (
        <>
          <div
            style={{ background: style.background }}
            className="w-screen h-screen flex justify-center items-center"
          >
            <Image
              src={"/ZKZg.gif"}
              width={50}
              height={50}
              alt="loading..."
            ></Image>
          </div>
        </>
      );
    }

  
  return (
    <>
      <div
        style={{ background: style.background }}
        className="w-screen h-screen flex flex-col gap-y-4"
      >
        <div className="w-full h-1/6 ">
          <div className="w-full h-2/3">
            <Navbar Nav_user={user?.name} />
          </div>
        </div>

        <div
          className="w-full h-5/6 -mt-14
          overflow-y-scroll md:scrollbar-thin   
          overflow-x-hidden "
        >

        </div>
      </div>
    </>
  );
}
