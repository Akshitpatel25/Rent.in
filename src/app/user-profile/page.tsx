"use client";
import Navbar from "@/components/Navbar";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Userprofile() {
  const router = useRouter();
  const [userData, setuserData] = useState({
    name: "",
    email: "",
  });

  const style = {
    background:
      "linear-gradient(0deg, rgba(188,108,37,1) 0%, rgba(221,161,94,1) 49%, rgba(254,250,224,1) 100%)",
  };

  const getUserDetailsinFrontend = async () => {
    // getting user details from Rtoken from cookies
    try {
      const res = await axios.get("/api/me");
      setuserData({
        name: res?.data?.user?.name!,
        email: res?.data?.user?.email!,
      });
      console.log("res.data.user: ", res.data.user);
    } catch (error) {
      router.push("/login");
    }
  };

  useEffect(() => {
    getUserDetailsinFrontend();
  }, []);

  if (userData.name == "") {
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
            <Navbar />
          </div>
        </div>

        <div
          className="w-full h-5/6 -mt-14
          overflow-y-scroll md:scrollbar-thin   
          overflow-x-hidden "
        ></div>
      </div>
    </>
  );
}
