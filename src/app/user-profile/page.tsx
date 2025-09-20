"use client";
import Navbar from "@/components/Navbar";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Userprofile() {
  const router = useRouter();
  const [userData, setuserData] = useState({
    user_id: "",
    name: "",
    email: "",
    isVerified: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getUserDetailsinFrontend = async () => {
    setLoading(true);
    setError("");
    const source = axios.CancelToken.source();
    let didCancel = false;
    try {
      const res = await axios.get("/api/me", { cancelToken: source.token });
      if (!didCancel) {
        setuserData({
          user_id: res?.data?.user?._id!,
          name: res?.data?.user?.name!,
          email: res?.data?.user?.email!,
          isVerified: res?.data?.user?.isVerified,
        });
      }
    } catch (error: any) {
      if (axios.isCancel(error)) {
        setError("User details request cancelled.");
      } else {
        setError("Failed to fetch user details.");
        setTimeout(() => router.push("/login"), 2000);
      }
    } finally {
      if (!didCancel) setLoading(false);
    }
    return () => {
      didCancel = true;
      source.cancel();
    };
  };

  

  useEffect(() => {
    getUserDetailsinFrontend();
    
  }, []);

  

  return (
    <>
      <div className="w-screen h-screen flex flex-col gap-y-4 min-w-80 max-w-screen-2xl m-auto bg-blue-100">
        <div className="w-full h-1/6 ">
          <div className="w-full h-2/3">
            <Navbar />
          </div>
        </div>
        <div className="w-full h-5/6 -mt-14 overflow-y-scroll md:scrollbar-thin overflow-x-hidden ">
          {loading ? (
            <div className="w-screen h-screen flex justify-center items-center">
              <Image src={"/ZKZg.gif"} width={50} height={50} alt="loading..." priority />
            </div>
          ) : error ? (
            <div className="w-screen h-screen flex justify-center items-center">
              <h2 className="text-red-500" role="alert" aria-live="assertive">{error}</h2>
            </div>
          ) : userData.name === "" ? (
            <div className="w-screen h-screen flex justify-center items-center">
              <Image src={"/ZKZg.gif"} width={50} height={50} alt="loading..." priority />
            </div>
          ) : (
            <div className="w-full h-fit p-2 flex flex-col gap-y-4">
              <div className="w-full flex justify-between items-center">
                <div className="w-11/12 flex gap-x-2 ">
                  <h1>Name : {userData.name}</h1>
                </div>
              </div>
              <div>
                <h1>Email : {userData.email} {userData.isVerified ? "[verified]" : "[not verified]"}</h1>
              </div>
              <button>
                Want to change password?
                <span className="underline text-blue-500" onClick={() => router.push("/forgetpass-email-verification")}>Click here </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
