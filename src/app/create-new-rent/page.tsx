"use client";
import Navbar from "@/components/Navbar";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";


export default function CreateNewRent() {
  const router = useRouter();
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
  });
  const [err, seterr] = useState("");
  const style = {
    background:
      "linear-gradient(0deg, rgba(188,108,37,1) 0%, rgba(221,161,94,1) 49%, rgba(254,250,224,1) 100%)",
  };
  const[loading, setloading] = useState(false);

  const getUserDetailsinFrontend = async () => {
    // getting user details from Rtoken/sessions from cookies
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
    
  }, [])

  const handleSubmit = async () => {
    try {
      setloading((prev) => !prev)
      if (userData.name === "") {
        router.push("/dashboard");
      }
      createRent.user_email = userData.email;
      
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
  

  // if (userData.name == "") {
  //     return (
  //       <>
  //         <div
  //           style={{ background: style.background }}
  //           className="w-screen h-screen flex justify-center items-center"
  //         >
  //           <Image
  //             src={"/ZKZg.gif"}
  //             width={50}
  //             height={50}
  //             alt="loading..."
  //           ></Image>
  //         </div>
  //       </>
  //     );
  //   }

  
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
          p-2 md:p-28 lg:p-36 xl:p-48"
          >

            {
              userData.name.length !== 0 ? (
                <>
                  <div 
                  className="w-full h-fit  flex 
                  text-sm md:text-xl lg:text-2xl xl:text-3xl
                  flex-col items-center justify-center gap-y-2 
                  p-2 md:p-4 lg:p-6 xl:p-8
                  backdrop-blur-sm bg-white bg-opacity-30 rounded-md"
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
                      className="p-1"
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
                      className="p-1"
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
                      className="p-1"
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
                      className="p-1"
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
                      className="p-1"
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
                      className="p-1"
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
                      className="p-1"
                      onChange={(e)=> setcreateRent({...createRent, ElecUnitPrice: e.target.value})}
                      required
                      />
                    </label>

                    <button
                    className="mt-3 p-1 pr-2 pl-2 w-full flex justify-center items-center
                    rounded-md bg-white bg-opacity-40 backdrop-blur-sm"
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
