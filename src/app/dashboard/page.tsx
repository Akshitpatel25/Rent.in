"use client";

import { useState, useEffect} from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react"
import Image from "next/image";
import Navbar from "@/components/Navbar";

export default function Dashboard() {
  const { data: session } = useSession();
  const [userData, setuserData] = useState("");
  const router = useRouter();
  // console.log(session?.user);

  // Gradient background style
  const style = {
    background:
      "linear-gradient(0deg, rgba(188,108,37,1) 0%, rgba(221,161,94,1) 49%, rgba(254,250,224,1) 100%)",
  };

  const [backgroundColor, setBackgroundColor] = useState("");

  // getting user details from Rtoken from cookies
  const getUserDetailsinFrontend = async () => {
    try {
      const res = await axios.get("/api/me");
      console.log("page.tsx.dasahboard: ", res);
      setuserData(res.data.user.name);
    } catch (error) {
      setuserData("");
      router.push("/login");
    }
  };

  // getting user details from google auth session 
  const getUserDetailsfromGoole = async () => {
    const user = session?.user;
    const name = user?.name;
    const email = user?.email;
    console.log("email: ", session);
    setuserData(name!);
    
    if (user?.email) {
      await axios.post("/api/googleSignin", {name: name, email: email });
    }
  };

  useEffect(() => {
    if (!session?.user) {
      getUserDetailsinFrontend();
    }else {
      getUserDetailsfromGoole();
    }
  },[ session]);

  useEffect(() => {
    const rootStyles = getComputedStyle(document.documentElement);
    setBackgroundColor(rootStyles.getPropertyValue('--background60'));
  }, []);

  // loading screen
  if ( userData == "" ) {
      return (
          <>
          <div 
          style={{background: style.background}}
          className="w-screen h-screen flex justify-center items-center">
              <Image src={"/ZKZg.gif"} width={50} height={50} alt="loading..."></Image>
          </div>
          </>
      )
  }

  return (
    <>
      <div
      style={{background: style.background}}
      className="w-screen h-screen"
      >
        <Navbar Nav_width={"w-full"} Nav_height={"60px"} Nav_user={userData}/>

      {/* <h1 className="text-center text-2xl">hello, Welcome {userData}</h1>
      <Link href={`/logout`}>Go to logout page</Link> */}
      </div>
    </>
  );
}
