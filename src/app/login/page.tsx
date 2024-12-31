"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const { data: session, status } = useSession();

  // constant variable
  const [error, setError] = useState("");
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });

  // gradient color variable
  const style = {
    background:
      "linear-gradient(0deg, rgba(188,108,37,1) 0%, rgba(221,161,94,1) 49%, rgba(254,250,224,1) 100%)",
  };

  // functions
  const setupLogin = async () => {
    try {
      if (!login.email || !login.password) {
        return setError("email and password are required");
      }

      // email formate checking
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(login.email)) {
        return setError("Please enter a valid email address");
      }

      setLoadingLogin(true);

      const response = await axios.post("/api/login", login);

      if (response.status === 200) {
        setError("login successfully");
        router.push("/dashboard");
      }
      console.log("response:", response);
    } catch (error:any) {
      console.log("error in client side login:", error);
      setError(error.response.data.error);
    } finally {
      setLoadingLogin(false);
    }
  };


  return (
    <>
      <div
        className="w-screen h-screen flex flex-col justify-center items-center min-w-80"
        style={{ background: style.background }}
      >
        <Image src={"/signup.gif"} width={100} height={100} alt="" ></Image>
        <h3 className="text-red-500">{error}</h3>
      
        <h1 className="text-2xl font-bold">Login</h1>

          <div className="w-fit border p-2 pb-4 border-orange-800 rounded-md  shadow-2xl shadow-orange-900 flex flex-wrap justify-center items-center flex-col">
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
              className="p-2 m-2 mb-1 outline-none border rounded-md"
              value={login.password}
              onChange={(e) => setLogin({ ...login, password: e.target.value })}
            />
            <Link href={"/forgetpass-email-verification"} className="text-red-900 text-sm mb-2">Forget Password?</Link>
            <button className="p-2 pl-4 pr-4 m-1 bg-white text-center rounded-2xl" onClick={setupLogin}>
              {loadingLogin ? "Login..." : "Login"}
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
              
              <p className="text-center text-sm mt-4">Don&apos;t have an account? <Link className="text-white underline" href="/signup">Signup</Link></p>
            </div>
          </div>
        

      </div>
    </>
  );
}
