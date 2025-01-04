"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
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

  useEffect(() => {
    const rootStyles = getComputedStyle(document.documentElement);
    setBackgroundColor(rootStyles.getPropertyValue("--background60"));
  }, []);

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
        className="w-screen h-screen flex flex-col gap-y-2"
      >
        <Navbar Nav_width={"w-full"} Nav_height={"60px"} Nav_user={userData} />

        {/*First Two Sections  */}
        <div className="z-0 w-full h-fit 
        flex flex-col xl:flex-row
        gap-y-4 md:gap-y-6 lg:gap-y-8 xl:gap-y-10
        xl:gap-x-8
        p-3 md:p-4 lg:p-6 xl:p-8">

          {/* welcome section */}
          <div
            className=" w-full h-fit p-2 flex flex-col
          backdrop-blur-sm bg-white bg-opacity-30 rounded-md
          lg:flex-row xl:w-2/3"
          >
            <div className="w-full h-fit lg:w-2/3">
              <h1 className=" text-xl md:text-3xl lg:text-4xl xl:text-5xl p-3">
                Welcome! back <span className="font-bold">{userData}</span>
              </h1>
              
              <div className="w-full h-fit  ">
                <h1 className="text-xl md:text-3xl lg:text-4xl xl:text-4xl p-3">
                  $7777
                  <br />
                  <span
                  className="text-sm  md:text-md lg:text-lg"
                  >Today&apos;s earnings</span>
                </h1>
              </div>
            </div>

            <div 
            className="flex justify-end 
            -mt-20 md:-mt-15 lg:mt-0
            lg:w-1/3 lg:justify-center
            "
            >
              <Image
              className="md:w-80"
              src={"/dash-bg.png"}
              width={150}
              height={150}
              alt="a"
              >

              </Image>
            </div>

          </div>

          {/* create new Rent section */} 
          <div
          title="create new Rent"
          className="w-full h-fit p-2 flex justify-between xl:justify-center items-center cursor-pointer
          backdrop-blur- bg-white bg-opacity-40 rounded-md xl:w-4/12 xl:h-full"
          >
            <h1 className=" text-xl md:text-3xl lg:text-4xl xl:text-5xl p-3
             xl:w-2/3 ">
              Create new Rent
            </h1>
            <span className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl pr-5 ">+</span>
          </div>

        </div>

        {/* section from View all Rents */}
        <div
        className="z-0  border-black w-full h-fit 
        flex flex-col xl:flex-row
        gap-y-4 md:gap-y-6 lg:gap-y-8 xl:gap-y-10
        xl:gap-x-8
        p-3 pt-0 md:p-4 md:pt-0 lg:p-6 lg:pt-0 xl:p-8 xl:pt-0"
        >

          <div
          className="w-full h-fit p-2 flex justify-between xl:justify-center items-center cursor-pointer
          backdrop-blur- bg-white bg-opacity-40 rounded-md "
          >
            <h1 className=" text-xl md:text-3xl lg:text-4xl xl:text-5xl p-3">
              View All Properties
            </h1>
            <span className="text-3xl md:text-4xl lg:text-5xl pr-3 ">👁</span>

          </div>


          <div
          className="w-full h-fit p-2 flex flex-col cursor-pointer
          backdrop-blur- bg-white bg-opacity-40 rounded-md "
          >
            <h1 className="text-xl md:text-3xl lg:text-4xl xl:text-5xl p-3">
              Previous Month Revenu
            </h1>

            <div className="w-full h-32 flex flex-col justify-center items-center">
              <div className="w-1/12 h-full bg-[#BC6C25] rounded-tl-xl rounded-tr-xl ">

              </div>
              <span>$1000000</span>
            </div>

          </div>

          {/* start from above */}

        </div>





        {/* <h1 className="text-center text-2xl">hello, Welcome {userData}</h1>
      <Link href={`/logout`}>Go to logout page</Link> */}
      </div>
    </>
  );
}
