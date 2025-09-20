"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function Signup() {
  const router = useRouter();

  // Gradient background style
  const style = {
    background:
      "linear-gradient(0deg, rgba(188,108,37,1) 0%, rgba(221,161,94,1) 49%, rgba(254,250,224,1) 100%)",
  };

  // State variables
  const [signup, setSignup] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loadingSignup, setLoadingSignup] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Functions
  const setupSignUp = async () => {
    if (!signup.name || !signup.email || !signup.password) {
      setError("Email and password are required");
      return;
    }
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signup.email)) {
      setError("Please enter a valid email address");
      return;
    }
    setLoadingSignup(true);
    setError("");
    const source = axios.CancelToken.source();
    let didCancel = false;
    try {
      const response = await axios.post("/api/signup", signup, { cancelToken: source.token });
      if (!didCancel && response.status === 200) {
        setError("Signup successful");
        router.push("/dashboard");
      }
    } catch (error: any) {
      if (axios.isCancel(error)) {
        setError("Signup request cancelled");
      } else {
        setError(error.response?.data?.error || "Signup failed");
      }
    } finally {
      if (!didCancel) setLoadingSignup(false);
    }
    return () => {
      didCancel = true;
      source.cancel();
    };
  };

  // Google sign-in function
  const googleSigninHandler = async () => {
    setGoogleLoading((prev) => !prev);
    signIn("google", { redirectTo: "/dashboard" });
  };

  useEffect(() => {
    setTimeout(() => {
      setError("");
    }, 2000);
  }, [error]);

  return (
    <div
      className="w-screen h-screen bg-blue-50 flex flex-col justify-center items-center min-w-80 max-w-screen-2xl m-auto"
      // style={{ background: style.background }}
    >
      <Image src="/signup.gif" width={100} height={100} alt="Signup" />
      {error && <h3 className="text-red-500">{error}</h3>}

      <h1 className="text-2xl font-bold">Sign Up</h1>

      <div className="w-fit  p-4  backdrop-blur-2xl bg-transparent rounded-md shadow-2xl shadow-blue-900 flex flex-col items-center bg-white">
        <input
          type="text"
          placeholder="Name"
          className="p-2 m-2 outline-none border rounded-md"
          value={signup.name}
          onChange={(e) => setSignup({ ...signup, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          className="p-2 m-2 outline-none border rounded-md"
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
        <button
          className="p-2 bg-blue-600 text-white text-center rounded-2xl"
          onClick={setupSignUp}
          disabled={loadingSignup}
        >
          {loadingSignup ? "SignUp..." : "Sign Up"}
        </button>

        <div className="flex flex-col items-center mt-4">
          <h1 className="text-xl text-center">or</h1>
          <button
            className="border mt-2 flex items-center gap-x-2 p-2 bg-blue-600 text-white rounded-3xl"
            onClick={googleSigninHandler}
          >
            <Image
              src="/googleG.png"
              alt="Google Sign-In"
              width={20}
              height={20}
            />
            <h2>
              {googleLoading ? (
                <Image
                  src="/ZKZg.gif"
                  width={25}
                  height={25}
                  alt="Loading..."
                  priority
                />
              ) : (
                "Connect with Google"
              )}
            </h2>
          </button>
          <p className="text-center text-sm mt-4">
            Have an account?{" "}
            <Link className="text-blue-600 underline" href="/login">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
