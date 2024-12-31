/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { NextResponse } from "next/server";

export default function signup() {
  const style = {
      background: "linear-gradient(0deg, rgba(188,108,37,1) 0%, rgba(221,161,94,1) 49%, rgba(254,250,224,1) 100%)",
  };
  const { data: session, status } = useSession();

  // constant variable
  const [signup, setSignup] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loadingSignup, setLoadingSignup] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);


  // functions
  const setupSignUp = async () => {
    try {
      if (!signup.email || !signup.password) {
        return setError("email and password are required");
      }

      // email formate checking
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(signup.email)) {
        return setError("Please enter a valid email address");
      }

      setLoadingSignup(true);

      const response = await axios.post("/api/signup", signup);

      if (response.status === 200) {
        setError("user created successfully");
      }
      console.log("response:", response);

    } catch (error) {
      console.log("error in client side signup:", error);
      setError(error.response.data.error);
    } finally {
      setLoadingSignup(false);
      setSignup({
        email: "",
        password: "",
      });
    }
  };


  useEffect(() => {
    if (status === "unauthenticated") {
      setGoogleLoading((prev)=>!prev);
    }else {
      setGoogleLoading((prev)=>!prev);
    }
  }, [status]);

  return (
    <>
    <div className="w-screen h-screen flex flex-col justify-center items-center min-w-80"
    style={{background: style.background}}
    >
        <Image src={"/signup.gif"} width={100} height={100} alt="" ></Image>
        <h3 className="text-red-500">{error}</h3>
        
        <h1 className="text-2xl font-bold">Sign Up</h1>
        <div className="w-fit border p-2 pb-4 border-orange-800 rounded-md  shadow-2xl shadow-orange-900 flex flex-wrap justify-center items-center flex-col">
        
            <input
            type="email"
            placeholder="Email"
            className="p-2 m-2 outline-none border  rounded-md"
            value={signup.email}
            onChange={(e) => setSignup({ ...signup, email: e.target.value })}
            />
            <input
            type="password"
            placeholder="Password"
            className="p-2 m-2 outline-none border rounded-md"
            value={signup.password}
            onChange={(e) => setSignup({ ...signup, password: e.target.value })}
            />
            <button className="p-2 pl-4 pr-4 m-1 bg-white text-center rounded-2xl" onClick={setupSignUp}>
            {loadingSignup ? "SignUp..." : "SignUp"}
            </button>

            {/* google signin box */}

            <div className="flex justify-center items-center flex-col">
            <h1 className="text-xl text-center ">or</h1>
            <button
                className=" border mt-1 flex justify-center items-center gap-x-2 p-2 bg-white rounded-3xl"
                onClick={() => {
                signIn("google");
                setGoogleLoading((prev)=> !prev);
                }}
            >
                <Image
                src="/googleG.png"
                alt="google signin"
                width={20}
                height={20}
                />
                <h2>{googleLoading ? (<Image src={"/ZKZg.gif"} width={25} height={25} alt="Loading..."/>):("Connect with Google")}</h2>
                
            </button>
            <p className="text-center text-sm mt-4">Have an account? <Link className="text-white underline" href="/login">Login</Link></p>
            
        </div>
        </div>

        
    </div>
      
    </>
  );
}
