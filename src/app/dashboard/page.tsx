"use client";

import { useState, useEffect, createContext } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Main_Dashboard from "@/components/Main_Dashboard";

export default function Dashboard() {
  const { data: session } = useSession();
  const [userData, setuserData] = useState("");
  const router = useRouter();

  const style = {
    background:
      "linear-gradient(0deg, rgba(188,108,37,1) 0%, rgba(221,161,94,1) 49%, rgba(254,250,224,1) 100%)",
  };

  const getUserDetailsinFrontend = async () => {
    // getting user details from Rtoken from cookies
    try {
      const res = await axios.get("/api/me");
      console.log("page.tsx.dasahboard: ", res);
      setuserData(res.data.user.name);
    } catch (error) {
      setuserData("");
      router.push("/login");
    }
  };

  const getUserDetailsfromGoole = async () => {
    // getting user details from google auth session
    const user = session?.user;
    const name = user?.name;
    const email = user?.email;
    // console.log("email: ", session);
    setuserData(name!);

    if (user?.email) {
      await axios.post("/api/googleSignin", { name: name, email: email });
    }
  };

  useEffect(() => {
    if (!session?.user) {
      getUserDetailsinFrontend();
    } else {
      getUserDetailsfromGoole();
    }
  }, [session]);

  // loading screen
  if (userData == "") {
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
            <Navbar Nav_user={userData} />
          </div>
        </div>

        <div
          className="w-full h-5/6 -mt-14
           overflow-y-scroll md:scrollbar-thin   
           overflow-x-hidden "
        >
          <Main_Dashboard user={userData} />
        </div>
      </div>
    </>
  );
}
