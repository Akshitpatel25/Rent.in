"use client";
import Navbar from "@/components/Navbar";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useSession } from "next-auth/react";


export default function IndividualRent({params}:any) {

  type Rent = {
    _id: string;
    user_id: string;
    rent_person_name: string;
    rent_person_num: string;
    rent_person_adhar: string;
    monthly_rent_price: string;
    monthly_ele_bill_price: string;
  }

  const router = useRouter();
  const { data: session } = useSession();
  const [userData, setuserData] = useState({
    name: "",
    email: "",
  });
  const [rentData, setrentData] = useState<Rent | null>(null);
  const [err, seterr] = useState("");

  
  
  const style = {
    background:
      "linear-gradient(0deg, rgba(188,108,37,1) 0%, rgba(221,161,94,1) 49%, rgba(254,250,224,1) 100%)",
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getUserDetailsinFrontend = async () => {
    // getting user details from Rtoken from cookies
    try {
      const res = await axios.get("/api/me");
      // console.log("page.tsx.dasahboard: ", res);/
      setuserData({name:res?.data?.user?.name!, email:res?.data?.user?.email!});
      // console.log("res.data.user: ", res.data.user);
      
    } catch (error) {
      setuserData({ name: "", email: "" });
      router.push("/login");
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getUserDetailsfromGoole = async () => {
    // getting user details from google auth session
    const user = session?.user;
    const name = user?.name;
    const email = user?.email;
    // console.log("email: ", session);
    setuserData({name:name!, email:email!});


    if (user?.email) {
      await axios.post("/api/googleSignin", { name: name, email: email });
    }
  };

  const getingParamCheck = async () => {
    // getting rents id from params and checking it from database
    try {
      const {id} = await params;
      
      const res = await axios.post(`/api/individual-rent/`, { id });
      
      if (res.status == 200) {
        setrentData(res.data.data);
      }
      
    } catch (error:any) {
      console.log(error);
      
      seterr(error.data.error);
    }
    
    
  }

  useEffect(() => {
    if (!session?.user?.name) {
      getUserDetailsinFrontend();
    } else {
      getUserDetailsfromGoole();
    }
    
    
  }, [session]);

  useEffect(() => {
    getingParamCheck();
  },[])

  
  
 
  
  

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
            <Navbar userData={userData.name}  />
          </div>
        </div>

        <div
          className="w-full h-5/6 -mt-14
          overflow-y-scroll md:scrollbar-thin   
          overflow-x-hidden "
        >
          <div 
          className="w-full h-full border border-purple-500
          flex flex-col justify-center items-center 
          p-2"
          >
            hii
            {
              rentData?.user_id ? (
                <>
                  <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
                    {rentData?.user_id}
                  </h1>
                </>
              ) : (
                <>
                </>
              )
            }
            
          </div>

        </div>
      </div>
    </>
  );
}
