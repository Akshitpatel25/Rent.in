"use client";
import Navbar from "@/components/Navbar";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function AllProperties() {
  const router = useRouter();
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
  const [deleteMsg, setdeleteMsg] = useState({
    rent_name: "",
    rent_id: "",
  });
  const [isAbsolute, setisAbsolute] = useState(false);
  const [yesLoading, setyesLoading] = useState(false);
  const [err, seterr] = useState("");

  const GETAllProperties = async () => {
    const res = await axios.post("/api/getAPIs/all-properties",{email: userData.email});
    setresData(res.data.data);
    // setdataLoading(true);
    try {
      if (!res.data.data[0]) {
        setTimeout(() => {
          setdataLoading((prev) => !prev);
        }, 2000);
      }else if (res.data.data[0]._id > 0) {
        setdataLoading((prev) => !prev);
      }
    } catch (error:any) {
      console.log("error in presize loading at all-properties");
      
    }
  };


  const getUserDetailsinFrontend = async () => {
    // getting user details from Rtoken from cookies
    try {
      const res = await axios.get("/api/me");
      setuserData({ name: res?.data?.user?.name!, email: res?.data?.user?.email! });
      
    } catch (error) {
      router.push("/login");
    }
  };

  const deleteProperty = async (id: string) => {
    try {
      setyesLoading((prev) => !prev)
      await axios.post(`/api/delete-property`, {id});
    } catch (error:any) {
      alert("Unable to delete property, contact support team");
    } finally {
      setyesLoading((prev) => !prev)
      setisAbsolute((prev) => !prev);
      GETAllProperties();
    }
    
  }

  const deletePropertyMsg = (rent_name: string, rent_id: string) => {
    setisAbsolute((prev)=> !prev);
    setdeleteMsg({
      rent_name: rent_name,
      rent_id: rent_id
    });
  }



  useEffect(() => {
    getUserDetailsinFrontend();
    GETAllProperties();
  }, [userData.email]);

  // useEffect(()=>{
  //   console.log(userData);
  //   console.log(resData);
  //   console.log("one data",resData[0]);

  // },[userData.name, resData])


  

  return (
    <>
      <div
        style={{ background: style.background }}
        className="w-screen h-screen flex flex-col gap-y-4 min-w-80 max-w-screen-2xl m-auto"
      >
        <div className="w-full h-1/6 ">
          <div className="w-full h-2/3">
            <Navbar userData={userData.name} />
          </div>
        </div>

        <div
          className="relative w-full h-5/6 -mt-14 "
        >
          <div
            className="w-full h-full 
            flex flex-col gap-y-2
            p-2 pb-4 overflow-y-scroll md:scrollbar-thin   
            overflow-x-hidden"
          >
            {/* {create new property} */}
            <div
            className="w-full flex md:justify-end"
            >
              <div 
              title="Create New Rent"
              className="w-full h-12 md:w-16 md:h-16 
              p-2 text-6xl rounded-full bg-white text-black
              flex justify-center items-center cursor-pointer"
              onClick={() => router.push("/create-new-rent")}
              >
                +
              </div>

            </div>
            


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
                            rounded-md flex "
                            >
                      <div
                      className="w-10/12 cursor-pointer"
                      onClick={() => router.push(`/individual-rent/${data._id}`)}
                      >
                        <h1 className="text-2xl lg:text-3xl  font-semibold">{data.rent_name}</h1>
                        <p className="text-md md:text-lg ">Person Name: {data.rent_person_name}</p>
                      </div>

                      <div
                      className="w-2/12
                      flex justify-center items-center "
                      >
                        <Image
                        title="Delete"
                        onClick={() => deletePropertyMsg( data.rent_name, data._id)}
                        src={'/delete.png'}
                        width={20}
                        height={20}
                        alt="Del"
                        className="cursor-pointer md:w-6 lg:w-8"
                        >
                        </Image>
                      </div>

                    </div>
                  ))
                }
                

                {/* absolute box for deleting message */}
                <div className="absolute inset-0 m-auto h-32 w-fit bg-white bg-opacity-40
                rounded-md flex flex-col justify-center items-center p-4
                backdrop-blur-sm"
                style={{display: isAbsolute ? "flex" : "none"}}
                >
                  <h1>Want to Delete? <span className="font-bold">{deleteMsg.rent_name}</span></h1>
                  <div
                  className="w-full h-fit flex gap-x-2 "
                  >
                    <button className="w-1/2  p-1 cursor-pointer backdrop-blur-sm
                    bg-blue-500 bg-opacity-50 rounded-md"
                    onClick={() => setisAbsolute((prev) => !prev)}
                    >Cancel</button>
                    <button className="w-1/2  p-1 cursor-pointer backdrop-blur-sm
                    bg-red-500 bg-opacity-50 rounded-md flex justify-center items-center"
                    onClick={() => deleteProperty(deleteMsg.rent_id)}
                    >Yes 
                      <div>
                        {
                          yesLoading ? (
                            <Image
                            src={"/ZKZg.gif"}
                            width={15}
                            height={15}
                            alt="loading..."
                            priority
                            ></Image>
                          ):(<></>)
                        }
                      </div>
                    </button>
                  </div>
                </div>

              </>
            ) : 
            (
              <div className="w-full h-full flex justify-center items-center">
                <Image
                src={"/ZKZg.gif"}
                width={40}
                height={40}
                alt="loading..."
                priority
                ></Image>
              </div>
            )}

            
            
          </div>

          
        </div>
      </div>
    </>
  );
}
