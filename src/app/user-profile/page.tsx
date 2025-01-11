"use client";
import Navbar from "@/components/Navbar";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";
import { sendEmail } from "@/helper/nodemailer";

export default function Userprofile() {
  const router = useRouter();
  const [userData, setuserData] = useState({
    user_id: "",
    name: "",
    email: "",
    isVerified: "",
  });
  const [Name, setName] = useState("");
  const [isedit, setisedit] = useState(false);

  const style = {
    background:
      "linear-gradient(0deg, rgba(188,108,37,1) 0%, rgba(221,161,94,1) 49%, rgba(254,250,224,1) 100%)",
  };

  const getUserDetailsinFrontend = async () => {
    // getting user details from Rtoken from cookies
    try {
      const res = await axios.get("/api/me");
      setuserData({
        user_id: res?.data?.user?._id!,
        name: res?.data?.user?.name!,
        email: res?.data?.user?.email!,
        isVerified: res?.data?.user?.isVerified,
      });
    } catch (error) {
      router.push("/login");
    }
  };

  

  useEffect(() => {
    getUserDetailsinFrontend();
    
  }, []);

  

  return (
    <>
      <div
        style={{ background: style.background }}
        className="w-screen h-screen flex flex-col gap-y-4 min-w-80 max-w-screen-2xl m-auto"
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
        >
          {
            userData.name == "" ? (
              <>
                <div
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
            ):(
              <>
                <div
                className="w-full h-fit p-2 
                 flex flex-col gap-y-4"
                >
                  <div
                  className="w-full flex justify-between items-center"
                  >
                    <div
                    className="w-11/12 flex gap-x-2 "
                    >
                      <h1>Name : {userData.name}</h1>
                      
                    </div>
                  </div>

                  <div>
                    <h1>Email : {userData.email} {userData.isVerified ? "[verified]" : "[not verified]"}</h1>
                  </div>

                  

                  <button>
                    Want to change password?  
                    <span className="underline text-blue-500" 
                    onClick={() => router.push("/forgetpass-email-verification")}
                    >Click here </span>
                  </button>

                </div>
              </>
            )
          }

        </div>
      </div>
    </>
  );
}
