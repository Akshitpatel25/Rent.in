"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const { data: session, status }: any = useSession();

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
    try {
      if (!login.email || !login.password) {
        return setError("Email and password are required");
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(login.email)) {
        return setError("Please enter a valid email address");
      }

      setLoadingLogin(true);
      setError(""); // Clear previous errors

      const response = await axios.post("/api/login", login);

      if (response.status === 200) {
        setError("Login successful");
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error("Error during login:", error);
      setError(error.response?.data?.error || "An error occurred. Please try again.");
    } finally {
      setLoadingLogin(false);
    }
  };

  // Google sign-in function
  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      setError(""); // Clear previous errors
      await signIn("google");
    } catch (error) {
      console.error("Google Sign-In error:", error);
      setError("Google Sign-In failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  // Redirect authenticated users to the dashboard
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  return (
    <div
      className="w-screen h-screen flex flex-col justify-center items-center min-w-80"
      style={{ background: style.background }}
    >
      <Image src={"/signup.gif"} width={100} height={100} alt="Signup" />
      {error && <h3 className="text-red-500">{error}</h3>}

      <h1 className="text-2xl font-bold">Login</h1>

      <div className="w-fit border p-4 border-orange-800 rounded-md shadow-2xl shadow-orange-900 flex flex-col items-center">
        <input
          type="email"
          placeholder="Email"
          className="p-2 m-2 outline-none border rounded-md"
          value={login.email}
          onChange={(e) => setLogin({ ...login, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="p-2 m-2 outline-none border rounded-md"
          value={login.password}
          onChange={(e) => setLogin({ ...login, password: e.target.value })}
        />
        <Link href={"/forgetpass-email-verification"} className="text-red-900 text-sm mb-2">
          Forget Password?
        </Link>
        <button
          className="p-2 bg-white text-center rounded-2xl"
          onClick={setupLogin}
          disabled={loadingLogin}
        >
          {loadingLogin ? "Logging in..." : "Login"}
        </button>

        <div className="flex flex-col items-center mt-4">
          <h1 className="text-xl text-center">or</h1>
          <button
            className="border mt-2 flex items-center gap-x-2 p-2 bg-white rounded-3xl"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
          >
            <Image
              src="/googleG.png"
              alt="Google Sign-In"
              width={20}
              height={20}
            />
            <h2>
              {googleLoading ? (
                <Image src={"/ZKZg.gif"} width={25} height={25} alt="Loading..." />
              ) : (
                "Connect with Google"
              )}
            </h2>
          </button>
          <p className="text-center text-sm mt-4">
            Don&apos;t have an account?{" "}
            <Link className="text-white underline" href="/signup">
              Signup
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
