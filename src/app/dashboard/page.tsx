"use client";

import { useState, useEffect} from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react"
import Image from "next/image";

export default function Dashboard() {
  const { data: session } = useSession();
  const [userData, setuserData] = useState("");
  const router = useRouter();

  const getUserDetailsinFrontend = async () => {
    try {
      const res = await axios.get("/api/me");
      console.log("page.tsx.dasahboard: ", res);
      setuserData(res.data.user.email);
    } catch (error) {
      setuserData("");
      router.push("/login");
    }
  };

  const getUserDetailsfromGoole = async () => {
    const user = session?.user;
    const email = user?.email;
    // console.log("email: ", session);
    setuserData(email as string);
    
    if (user?.email) {
      await axios.post("/api/googleSignin", { email: session?.user?.email });
    }
  };

  useEffect(() => {
    if (!session?.user) {
      getUserDetailsinFrontend();
    }else {
      getUserDetailsfromGoole();
    }
  },[ session]);

  // loading screen
  if ( userData == "" ) {
      return (
          <>
          <div className="w-screen h-screen flex justify-center items-center">
              <Image src={"/ZKZg.gif"} width={50} height={50} alt="loading..."></Image>
          </div>
          </>
      )
  }

  return (
    <>
      <h1 className="text-center text-2xl">hello, Welcome {userData}</h1>
      <Link href={`/logout`}>Go to logout page</Link>
    </>
  );
}
