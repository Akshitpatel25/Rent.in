"use client";
import axios from "axios";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react"

export default function Login() {
  const router = useRouter();
  
  // State variables
  const [error, setError] = useState("");
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });

  // Gradient background style
  const style = {
    background:
      "linear-gradient(0deg, rgba(188,108,37,1) 0%, rgba(221,161,94,1) 49%, rgba(254,250,224,1) 100%)",
  };

  // Email-password login function
  const setupLogin = async () => {
    const source = axios.CancelToken.source();
    let didCancel = false;
    try {
      if (!login.email || !login.password) {
        setError("Email and password are required");
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(login.email)) {
        setError("Please enter a valid email address");
        return;
      }

      setLoadingLogin(true);
      setError(""); // Clear previous errors

      const response = await axios.post("/api/login", login, { cancelToken: source.token });

      if (!didCancel && response.status === 200) {
        setError("Login successful");
        router.push("/dashboard");
      }
    } catch (error: any) {
      if (axios.isCancel(error)) {
        setError("Login request cancelled");
      } else {
        setError(error.response?.data?.error || "An error occurred. Please try again.");
      }
    } finally {
      if (!didCancel) setLoadingLogin(false);
    }
    return () => {
      didCancel = true;
      source.cancel();
    };
  };

  // Google sign-in function
  const googleSigninHandler = async () => {
    setGoogleLoading((prev) => !prev);
    signIn("google", {redirectTo: "/dashboard"});
    
  }

  useEffect(()=> {
    setTimeout(() => {
      setError("");
    }, 2000);
  },[error])


  return (
    <div
      className="w-screen h-screen bg-blue-50 flex flex-col justify-center items-center min-w-80 max-w-screen-2xl m-auto"
      // style={{ background: style.background }}
    >
      <Image src={"/signup.gif"} width={100} height={100} alt="Signup" priority/>
  {error && <h3 role="alert" aria-live="assertive" className="text-red-500">{error}</h3>}

      <h1 className="text-2xl font-bold">Login</h1>

      <div className="w-fit p-4 border bg-white backdrop-blur-2xl shadow-2xl shadow-blue-900 rounded-md  flex flex-col items-center">
        <input
          type="email"
          placeholder="Email"
          className="p-2 m-2 outline-none border rounded-md"
          value={login.email}
          onChange={(e) => setLogin({ ...login, email: e.target.value })}
          aria-label="Email"
          autoComplete="email"
        />
        <input
          type="password"
          placeholder="Password"
          className="p-2 m-2 outline-none border rounded-md"
          value={login.password}
          onChange={(e) => setLogin({ ...login, password: e.target.value })}
          aria-label="Password"
          autoComplete="current-password"
        />
        <Link
          href={"/forgetpass-email-verification"}
          className="text-red-900 text-sm mb-2"
        >
          Forget Password?
        </Link>
        <button
          className="p-2 text-white text-center rounded-2xl bg-blue-600"
          onClick={setupLogin}
          disabled={loadingLogin}
          aria-busy={loadingLogin}
        >
          {loadingLogin ? (
            <span className="flex items-center gap-x-2">
              <Image src={"/ZKZg.gif"} width={20} height={20} alt="Loading..." priority />
              Logging in...
            </span>
          ) : "Login"}
        </button>

        <div className="flex flex-col items-center mt-4">
          <h1 className="text-xl text-center">or</h1>
          <button
            className="border mt-2 flex items-center gap-x-2 p-2 bg-blue-600 text-white rounded-3xl"
            onClick={googleSigninHandler}
            disabled={googleLoading}
            aria-busy={googleLoading}
          >
            <Image
              src="/googleG.png"
              alt="Google Sign-In"
              width={20}
              height={20}
              priority
            />
            <h2>
              {googleLoading ? (
                <Image src={"/ZKZg.gif"} width={25} height={25} alt="Loading..." priority />
              ) : (
                "Connect with Google"
              )}
            </h2>
          </button>


          
          <p className="text-center text-sm mt-4">
            Don&apos;t have an account?{" "}
            <Link className="text-blue-600 underline" href="/signup">
              Signup
            </Link>
          </p>
        </div>

        
      </div>
    </div>
  );
}
