"use client";
import Navbar from "@/components/Navbar";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { redirect, useRouter } from "next/navigation";
import axios from "axios";
import { useSession } from "next-auth/react";

export default function AllProperties() {
  const router = useRouter();
  const { data: session } = useSession();
  const [userData, setuserData] = useState({
    name: "",
    email: "",
  });
  const style = {
    background:
      "linear-gradient(0deg, rgba(188,108,37,1) 0%, rgba(221,161,94,1) 49%, rgba(254,250,224,1) 100%)",
  };
  const [resData, setresData] = useState([]);
  const [dataLoading, setdataLoading] = useState(false);

 

  const GETAllProperties = async () => {
    const res = await axios.get("/api/getAPIs/all-properties");
    // console.log("geting all properties", res.data.data);
    setresData(res.data.data);
    setdataLoading(true);
  };


  const getUserDetailsinFrontend = async () => {
    // getting user details from Rtoken from cookies
    try {
      const res = await axios.get("/api/me");
      setuserData({ name: res?.data?.user?.name!, email: res?.data?.user?.email! });
      console.log("res.data.user: ", res.data.user);
      
    } catch (error) {
      router.push("/login");
    }
  };

  useEffect(() => {
    getUserDetailsinFrontend();
    GETAllProperties();
  }, []);


  if (userData.name == "") {
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
            <Navbar userData={userData.name} />
          </div>
        </div>

        <div
          className="w-full h-5/6 -mt-14
          overflow-y-scroll md:scrollbar-thin   
          overflow-x-hidden "
        >
          <div
            className="w-full h-full border border-purple-500
          flex flex-col gap-y-2  
          p-2 pb-4"
          >
            {dataLoading ? (
              <>
                {
                  resData.length == 0 && (
                    <div className="w-full h-full flex justify-center items-center">
                      <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold">
                        No Properties Found Create New One
                      </h1>
                    </div>
                  )
                }
                {
                  resData.map((data: any) => (
                    <div
                      key={data._id}
                      className="w-full h-fit p-2 
                            backdrop-blur-sm bg-white bg-opacity-45 
                            rounded-md flex flex-col cursor-pointer"
                      onClick={() => router.push(`/individual-rent/${data._id}`)}
                    >
                      <h1 className="text-2xl lg:text-3xl  font-semibold">{data.rent_name}</h1>
                      <p className="text-md md:text-lg ">Person Name: {data.rent_person_name}</p>
                    </div>
                  ))
                }
                
              </>
            ) : 
            (
              <div className="w-full h-full flex justify-center items-center">
                <Image
                src={"/ZKZg.gif"}
                width={40}
                height={40}
                alt="loading..."
                ></Image>
              </div>
            )}
            


            {/* absolute box */}
            <div 
            title="Create New Rent"
            className="absolute bottom-16 right-5 w-16 h-16 
            p-2 text-6xl rounded-full bg-white text-black
            flex justify-center items-center cursor-pointer"
            onClick={() => router.push("/create-new-rent")}
            >
              +
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
