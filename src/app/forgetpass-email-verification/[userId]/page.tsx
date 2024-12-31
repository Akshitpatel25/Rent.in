"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";


export default function forgetPassword() {
  
  // gradient color variable
  const style = {
    background:
    "linear-gradient(0deg, rgba(188,108,37,1) 0%, rgba(221,161,94,1) 49%, rgba(254,250,224,1) 100%)",
  };
  
  // constant variable
  const [passreset, setPassreset] = useState({
    newpassword: "",
    confirmedpassword: "",
  });
  const [token, setToken] = useState("");
  const [msgError, setMsgError] = useState("");
  const [msgSuccess, setMsgSuccess] = useState("");
  const router = useRouter();

  useEffect(() => {
    const urlToken = window.location.search.split("=")[1];
    setToken(urlToken || "");
    // console.log("urlToken", urlToken);
  }, []);


  //   functions
  const resetPasswordHandler = async () => {

    if (!passreset.newpassword || !passreset.confirmedpassword) {
      return setMsgError("All fields are required");
    }

    if (passreset.newpassword != passreset.confirmedpassword) {
      return setMsgError("Password doesn't match");
    }

    try {
      const respnose = await axios.post("/api/new-password", {urlToken: token, sendPassword :passreset.newpassword});
      setMsgSuccess(respnose.data.message);
      if (respnose.status === 200) {
        setTimeout(() => {
          setMsgError("You will be redirected to login page in 2 seconds");
          router.push("/login");
        },2000);
      }
    } catch (error:any) {
      setMsgError(error.response.data.error);
    }
  };


    return (
      <div
        className="w-screen h-screen flex flex-col justify-center items-center"
        style={{ background: style.background }}
      >
        {msgError && <p className="text-red-500">{msgError}</p>}

        {msgSuccess && <p className="text-green-500">{msgSuccess}</p>}
        <h1 className="text-xl">Reset your Password</h1>
        <div className="w-fit border p-2 flex flex-col justify-center items-center shadow-2xl rounded-md ">
          <input
            type="password"
            placeholder="New Password"
            className="p-2 m-2 outline-none border rounded-md"
            onChange={(e) => {
              setPassreset({ ...passreset, newpassword: e.target.value });
            }}
          />
          <input
            type="text"
            placeholder="Confirm Password"
            className="p-2 m-2 outline-none border rounded-md"
            onChange={(e) => {
              setPassreset({ ...passreset, confirmedpassword: e.target.value });
            }}
          />
          <button
            onClick={resetPasswordHandler}
            className="p-2 pl-4 pr-4 m-1 bg-white text-center rounded-2xl"
          >
            Reset Password
          </button>
        </div>
      </div>
    );
  };

