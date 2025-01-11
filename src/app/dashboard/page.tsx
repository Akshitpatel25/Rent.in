"use client";

import { useState, useEffect} from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Main_Dashboard from "@/components/Main_Dashboard";

export default function Dashboard() {
  const [userData, setuserData] = useState({
    name: "",
    user_id: "",
  });
  const router = useRouter();

  const style = {
    background:
      "linear-gradient(0deg, rgba(188,108,37,1) 0%, rgba(221,161,94,1) 49%, rgba(254,250,224,1) 100%)",
  };

  const getUserDetailsinFrontend = async () => {
    // getting user details from Rtoken from cookies
    try {
      const res = await axios.get("/api/me");
      setuserData({
        name: res.data.user.name,
        user_id: res.data.user._id,
      });
      console.log("res.data.user: ", res.data);
      
    } catch (error) {
      router.push("/login");
    }
  };

 

  useEffect(() => {
    getUserDetailsinFrontend();
  }, []);

  

  

  return (
    <>
      <div
        style={{ background: style.background }}
        className="w-screen h-screen flex flex-col gap-y-4 min-w-80 max-w-screen-2xl m-auto "
      >
        <div className="w-full h-1/6 ">
          <div className="w-full h-2/3">
            <Navbar userData={userData.name}/>
          </div>
        </div>

        {
          userData.name == "" ? (
            <>
              <div
                className="w-full h-screen flex justify-center items-center"
              >
                <Image
                  src={"/ZKZg.gif"}
                  width={50}
                  height={50}
                  alt="loading..."
                ></Image>
              </div>
            </>
          ):(
            <>
              <div
                className="w-full h-5/6 -mt-14
                overflow-y-scroll md:scrollbar-thin   
                overflow-x-hidden "
              >
                <Main_Dashboard userData={userData}/>
              </div>
            </>
          )
        }

        
      </div>
    </>
  );
}
