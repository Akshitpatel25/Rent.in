"use client";
import Navbar from "@/components/Navbar";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import useTheme from "@/zustand/userDetails";


export default function CreateNewRent() {


const router = useRouter();
  const {userDetails} = useTheme();
  const [userData, setuserData] = useState({
    name: "",
    email: "",
  });
  const [createRent, setcreateRent] = useState({
    user_email:"",
    rentName: "",
    rentPersonName: "",
    rentPersonNum: "",
    rentPersonAdhar: "",
    monthlyRentPrice: "",
    EleBillPrice: "",
    ElecUnitPrice:"",
    deposite: "set",
  });
  const [err, seterr] = useState("");
  const[loading, setloading] = useState(false);



  // const getUserDetailsinFrontend = async () => {
  //   // getting user details from Rtoken/sessions from cookies
  //   try {
  //     const res = await axios.get("/api/me");
  //     setuserData({ name: res?.data?.user?.name!, email: res?.data?.user?.email! });
      
  //   } catch (error) {
  //     router.push("/login");
  //   }
  // };

 

  // useEffect(() => {
  //   getUserDetailsinFrontend();
  // }, [])

  const handleSubmit = async () => {
    try {
      setloading((prev) => !prev)
      if (userDetails?.name === "") {
        router.push("/dashboard");
      }
      createRent.user_email = userDetails?.email;
      
      const response = await axios.post("/api/create-new-rent", createRent);
  
      if (response.status === 200) {
        seterr("Successfully created");
        router.push("/all-properties")
      }


    } catch (error:any) {
      seterr(error.response?.data?.error || "Something went wrong");
    } finally {
      setloading((prev) => !prev)
    }
  };
  

  useEffect(()=> {
    setTimeout(() => {
      seterr("");
    }, 2000);
  },[err])

  
  return (
    <>
      <div
        className="w-screen h-screen flex flex-col gap-y-4 min-w-80 max-w-screen-2xl m-auto bg-blue-100"
      >
        <div className="w-full h-1/6 ">
          <div className="w-full h-2/3">
            <Navbar userData={userDetails?.name}  />
          </div>
        </div>

        <div
          className="w-full h-5/6 -mt-14
          overflow-y-scroll md:scrollbar-thin   
          overflow-x-hidden "
        >
          <div 
          className="w-full h-full
          flex flex-col justify-center items-center 
          p-2 md:p-28 lg:p-36 xl:p-48"
          >

            {
              userDetails?.name.length !== 0 ? (
                <>
                  <div 
                  className="w-full h-fit  flex 
                  text-sm md:text-xl lg:text-2xl xl:text-3xl
                  flex-col items-center justify-center gap-y-2 
                  p-2 md:p-4 lg:p-6 xl:p-8 bg-white  rounded-md"
                  >
                    <p className="text-red-500">{err}</p>
                    <h1 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl
                    mb-2 lg:mb-4 xl:mb-6" >Create New Rent</h1>
                    <label
                    className="w-full 
                    flex justify-between items-center "
                    >Rent name :
                      <input type="text" 
                      placeholder="Enter your Rent Name"
                      className="p-1 bg-blue-100 rounded-sm"
                      onChange={(e)=> setcreateRent({...createRent, rentName: e.target.value})}
                      required
                      />
                    </label>

                    <label
                    className="w-full 
                    flex justify-between items-center"
                    >Person name :
                      <input type="text" 
                      placeholder="Enter Person Name"
                      className="p-1  bg-blue-100 rounded-sm"
                      onChange={(e)=> setcreateRent({...createRent, rentPersonName: e.target.value})}
                      required
                      />
                    </label>

                    <label
                    className="w-full 
                    flex justify-between items-center"
                    >Person Phone :
                      <input type="number" 
                      placeholder="Enter Phone Number"
                      className="p-1  bg-blue-100 rounded-sm"
                      onChange={(e)=> setcreateRent({...createRent, rentPersonNum: e.target.value})}
                      required
                      />
                    </label>

                    <label
                    className="w-full 
                    flex justify-between items-center"
                    >Person Adhar :
                      <input type="number" 
                      placeholder="Enter Adhar Number"
                      className="p-1  bg-blue-100 rounded-sm"
                      onChange={(e)=> setcreateRent({...createRent, rentPersonAdhar: e.target.value})}
                      required
                      />
                    </label>

                    <label
                    className="w-full 
                    flex justify-between items-center"
                    >Monthly rent:
                      <input type="number" 
                      placeholder="Enter Monthly Rent"
                      className="p-1  bg-blue-100 rounded-sm"
                      onChange={(e)=> setcreateRent({...createRent, monthlyRentPrice: e.target.value})}
                      required
                      />
                    </label>

                    <label
                    className="w-full 
                    flex justify-between items-center"
                    >Electric bill /mo:
                      <input type="number" 
                      placeholder="Enter Standard Elec-Bill"
                      className="p-1  bg-blue-100 rounded-sm"
                      onChange={(e)=> setcreateRent({...createRent, EleBillPrice: e.target.value})}
                      required
                      />
                    </label>

                    <label
                    className="w-full 
                    flex justify-between items-center"
                    >Elec Unit Price:
                      <input type="number" 
                      placeholder="Enter Electric Unit Price"
                      className="p-1  bg-blue-100 rounded-sm"
                      onChange={(e)=> setcreateRent({...createRent, ElecUnitPrice: e.target.value})}
                      required
                      />
                    </label>

                    <label
                    className="w-full 
                    flex justify-between items-center"
                    >Deposite:
                      <input type="number" 
                      placeholder="Enter Deposite Amount"
                      className="p-1  bg-blue-100 rounded-sm"
                      onChange={(e)=> setcreateRent({...createRent, deposite: e.target.value})}
                      required
                      />
                    </label>

                    <button
                    className="mt-3 text-lg p-1 pr-2 pl-2 w-full flex justify-center items-center
                    rounded-md bg-blue-600 text-white"
                    onClick={handleSubmit}
                    >
                      Create
                      {
                        loading ?
                        <Image
                        src={"/ZKZg.gif"}
                        width={20}
                        height={20}
                        alt="loading..."
                        priority
                        ></Image>
                        :
                        <></>
                      }
                    </button>

                  </div>
                </>
              ): (
                <>
                  <Image
                  src={"/ZKZg.gif"}
                  width={40}
                  height={40}
                  alt="loading..."
                  priority
                  ></Image>
                </>
              )
            }


            
          </div>

        </div>
      </div>
    </>
  );
}
