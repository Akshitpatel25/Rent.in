"use client";
import Navbar from "@/components/Navbar";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import useTheme from "@/zustand/userDetails";
import useProperties from "@/zustand/userProperties";

export default function AllProperties() {
  const {userProperties, fetchUserProperties} = useProperties();
  const {userDetails} = useTheme();
  
  const [deleteMsg, setdeleteMsg] = useState({
    rent_name: "",
    rent_id: "",
  });
  const [isAbsolute, setisAbsolute] = useState(false);
  const [yesLoading, setyesLoading] = useState(false);

  // const getUserDetailsinFrontend = async () => {
  //   // getting user details from Rtoken from cookies
  //   try {
  //     const res = await axios.get("/api/me");
  //     setuserData({
  //       name: res?.data?.user?.name!,
  //       email: res?.data?.user?.email!,
  //     });
  //   } catch (error) {
  //     router.push("/login");
  //   }
  // };


  // const GETAllProperties = () => {
  //   const res = axios.post("/api/getAPIs/all-properties", {
  //     email: userDetails?.email,
  //   });
  //   res
  //     .then((res) => {
  //       setresData(res.data.data);
  //     })
  //     .catch((err) => seterr(err));
  // };

  const deleteProperty = async (id: string) => {
    try {
      setyesLoading((prev) => !prev);
      await axios.post(`/api/delete-property`, { id });
    } catch (error: any) {
      alert("Unable to delete property, contact support team");
    } finally {
      setyesLoading((prev) => !prev);
      setisAbsolute((prev) => !prev);
      fetchUserProperties();
    }
  };

  const deletePropertyMsg = (rent_name: string, rent_id: string) => {
    setisAbsolute((prev) => !prev);
    setdeleteMsg({
      rent_name: rent_name,
      rent_id: rent_id,
    });
  };

  // useEffect(() => {
  //   // getUserDetailsinFrontend();
  //   GETAllProperties();
  // }, [userDetails?.email]);

  // useEffect(()=>{
  //   console.log(userData);
  //   console.log(resData)
  //   console.log(dataLoading);
  // },[userData,resData, dataLoading]);

  // console.log("user properties",userProperties);
  // console.log(resData);


  return (
    <>
      <div
        className="w-screen h-screen flex flex-col gap-y-4 
        min-w-80 max-w-screen-2xl m-auto bg-blue-100"
      >
        <div className="w-full h-1/6 ">
          <div className="w-full h-2/3">
            <Navbar userData={userDetails?.name} />
          </div>
        </div>

        <div className="relative w-full h-5/6 -mt-14 ">
          <div
            className="w-full h-full 
            flex flex-col gap-y-2
            p-2 pb-4 overflow-y-scroll md:scrollbar-thin   
            overflow-x-hidden"
          >
            {/* {create new property} */}
            <div className="w-full flex md:justify-end">
              <Link href="/create-new-rent"
                title="Create New Rent"
                className="w-full h-12 md:w-16 md:h-16 
                p-2 text-6xl rounded-full bg-blue-600 text-white
                flex justify-center items-center cursor-pointer"
              >
                +
              </Link>
            </div>

            {userProperties != null ? (
              <>
                {userProperties.length == 0 && (
                  <div className="w-full h-full flex justify-center items-center">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold"></h1>
                  </div>
                )}
                {userProperties.map((data: any) => (
                  <div
                    key={data._id}
                    className="w-full h-fit p-2 bg-white  
                    rounded-md flex"
                  >
                    <Link
                      href={`/individual-rent/${data._id}`}
                      className="w-10/12 cursor-pointer"
                    >
                      <div>
                        <h1 className="text-2xl lg:text-3xl font-semibold">
                          {data.rent_name}
                        </h1>
                        <p className="text-md md:text-lg">
                          Person Name: {data.rent_person_name}
                        </p>
                      </div>
                    </Link>

                    <div className="w-2/12 flex justify-center items-center">
                      <Image
                        title="Delete"
                        onClick={() =>
                          deletePropertyMsg(data.rent_name, data._id)
                        }
                        src={"/delete.png"}
                        width={20}
                        height={20}
                        alt="Del"
                        className="cursor-pointer md:w-6 lg:w-8 "
                      />
                    </div>
                  </div>
                ))}

                {/* absolute box for deleting message */}
                <div
                  className="absolute inset-0 m-auto h-32 w-fit bg-white border border-blue-600
                rounded-md flex flex-col justify-center items-center p-4 shadow-lg shadow-blue-300
                backdrop-blur-sm"
                  style={{ display: isAbsolute ? "flex" : "none" }}
                >
                  <h1>
                    Want to Delete?{" "}
                    <span className="font-bold">{deleteMsg.rent_name}</span>
                  </h1>
                  <div className="w-full h-fit flex gap-x-2 ">
                    <button
                      className="w-1/2  p-1 cursor-pointer backdrop-blur-sm
                    bg-blue-500 bg-opacity-50 rounded-md"
                      onClick={() => setisAbsolute((prev) => !prev)}
                    >
                      Cancel
                    </button>
                    <button
                      className="w-1/2  p-1 cursor-pointer backdrop-blur-sm
                    bg-red-500 bg-opacity-50 rounded-md flex justify-center items-center"
                      onClick={() => deleteProperty(deleteMsg.rent_id)}
                    >
                      Yes
                      <div>
                        {yesLoading ? (
                          <Image
                            src={"/ZKZg.gif"}
                            width={15}
                            height={15}
                            alt="loading..."
                            priority
                          ></Image>
                        ) : (
                          <></>
                        )}
                      </div>
                    </button>
                  </div>
                </div>
              </>
            ) : (
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
