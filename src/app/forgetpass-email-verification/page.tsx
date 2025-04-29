"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function Forgetpassword_email_verification() {
  // gradient color variable
  

  //   constant variables
  const [email, setEmail] = useState("");
  const [res, setRes ] = useState("");
  const [loading, setLoading] = useState(false);
  const [routeError, setrouteError] = useState("");

  //   functions
  const emailCheckingHandler = async () => {
    if (!email) {
      return setRes("Invalid email");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return setRes("Invalid email");
    }

    try {
      setLoading((prev) => !prev);
      const response = await axios.post("/api/forgetpass-email-verification", {
        email,
      });
      if (response.status === 200) {
        setrouteError(response.data.data);
      }
    } catch (error:any) {
      setrouteError(error.response.data.error);
      
    } finally {
      setLoading((prev) => !prev);
    }
  };

  useEffect(()=> {
    setTimeout(() => {
      setRes("");
      setrouteError("");
    }, 5000);
  },[res, routeError]);

  return (
    <>
      <div
        className="w-screen h-screen bg-blue-100 flex flex-col justify-center items-center min-w-80 max-w-screen-2xl m-auto"
        
      >
        {
          routeError ? (
            <p className="text-red-500">{routeError}</p>
          ):<p className="text-red-500">{res}</p>
        }
        
        <h1 className="text-2xl">Enter your email</h1>
        <div className="rounded-md  shadow-lg shadow-blue-600
         w-fit p-2 flex flex-col justify-center items-center">
          <input
            type="email"
            placeholder="Enter your email"
            className="p-2 m-2 mb-1 outline-none border rounded-md"
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            className="p-2 pl-4 pr-4 m-1 bg-blue-600 text-white text-center rounded-2xl"
            onClick={emailCheckingHandler}
          >
            {loading ? "Submit..." : "Submit"}
          </button>
        </div>
      </div>
    </>
  );
}
