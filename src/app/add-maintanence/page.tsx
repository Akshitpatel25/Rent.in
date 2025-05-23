"use client";
import Navbar from "@/components/Navbar";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function AddMaintanence() {
  const router = useRouter();
  const [userData, setuserData] = useState({
    userId: "",
    name: "",
    email: "",
  });
  const date = new Date();
  const month = date.getMonth();
  const year = date.getFullYear();
  const monthByName = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];
  const [maintanenceName, setMaintanenceName] = useState("");
  const [maintanenceAmount, setMaintanenceAmount] = useState("");
  const [err, seterr] = useState("");
  const [loading, setloading] = useState(false);
  const [allMaintanence, setAllMaintanence] = useState([]);
  const [isdelmsg, setisdelmsg] = useState(false);
  const [yesloading, setyesloading] = useState(false);
  const [delMaintanenceData, setdelMaintanenceData] = useState({
    id: "",
    name: "",
  });
 

  const getUserDetailsinFrontend = async () => {
    // getting user details from Rtoken from cookies
    try {
      const res = await axios.get("/api/me");
      setuserData({
        userId: res?.data?.user?._id!,
        name: res?.data?.user?.name!,
        email: res?.data?.user?.email!,
      });
    } catch (error) {
      router.push("/login");
    }
  };

  const handleAddMaintanence = async () => {
    setloading((prev) => !prev);
    if (!userData.userId || !maintanenceName || !maintanenceAmount) {
      seterr("Please fill all the fields");
      setloading((prev) => !prev);
      return;
    }
    const maintanenceM_Y = monthByName[month] + year;
    try {
      const res = await axios.post("/api/add-maintanence", {
        userID: userData.userId,
        maintanenceName: maintanenceName,
        maintanenceAmount: maintanenceAmount,
        maintanenceM_Y: maintanenceM_Y,
        maintanence_Day: date.getDate(),
      });
      if (res.status === 200) {
        seterr("Maintanence added");
        getAllMaintanence();
      }
    } catch (error: any) {
      seterr(error.response.data.error);
    }
    setloading((prev) => !prev);
    setMaintanenceName("");
    setMaintanenceAmount("");
  };

  const getAllMaintanence = async () => {
    const res = await axios.post("/api/add-maintanence", {
      userID: userData.userId,
      getAllMaintanence: true,
    });
    setAllMaintanence(res.data.data);
  };

  const handleDeleteMaintanenceMsg = async (id: string, maintanenceName: string) => {
    setisdelmsg((prev) => !prev);
    setdelMaintanenceData({
      id: id,
      name: maintanenceName,
    });
    
  };

  const handleDeleteMaintanence = async() => {
    setyesloading((prev) => !prev);
    try {
      await axios.post('/api/add-maintanence', {id: delMaintanenceData.id, deleteMaintanence: true});
      getAllMaintanence();
    } catch (error:any) {
      seterr(error.response.data.error);
    }
    setyesloading((prev) => !prev);
    setisdelmsg((prev) => !prev);
  }
  
  useEffect(() => {
    getUserDetailsinFrontend();
    getAllMaintanence();
  }, [userData.userId]);

  useEffect(() => {
    setTimeout(() => {
      seterr("");
    }, 4000);
  }, [err]);

  return (
    <>
      <div
        className="w-screen h-screen flex flex-col gap-y-4 
        bg-blue-100 min-w-80 max-w-screen-2xl m-auto"
      >
        <div className="w-full h-1/6 ">
          <div className="w-full h-2/3">
            <Navbar userData={userData.name} />
          </div>
        </div>

        <div
          className=" relative w-full h-5/6 -mt-14
          overflow-y-scroll md:scrollbar-thin   
          overflow-x-hidden "
        >
          <p className="text-red-600 text-center">{err}</p>
          {userData.name == "" ? (
            <>
              <div className="w-screen h-screen flex justify-center items-center">
                <Image
                  src={"/ZKZg.gif"}
                  width={50}
                  height={50}
                  alt="loading..."
                  priority
                ></Image>
              </div>
            </>
          ) : (
            <>
              <div
                className="w-full h-fit
               p-2  flex flex-col gap-y-1 "
              >
                <h1 className="w-full text-center font-semibold underline">
                  Add Maintanence
                </h1>
                <div className="w-full h-fit text-center">
                  Current M/Y:{" "}
                  <span className="font-semibold">
                    {monthByName[month]} {year}
                  </span>
                </div>

                <div className="w-full h-fit flex gap-x-2">
                  <div className="w-10/12 flex gap-x-2">
                    <input
                      type="text"
                      placeholder="Maintanence Name"
                      value={maintanenceName}
                      onChange={(e) => setMaintanenceName(e.target.value)}
                      className="w-2/3 p-1 outline-none"
                    ></input>

                    <input
                      type="number"
                      placeholder="Amount"
                      value={maintanenceAmount}
                      onChange={(e) => setMaintanenceAmount(e.target.value)}
                      className="w-1/3 p-1 outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-2/12 cursor-pointer bg-blue-600 rounded-md text-white"
                    onClick={handleAddMaintanence}
                  >
                    {loading ? "Add..." : "Add"}
                  </button>
                </div>
              </div>

              <div
                className="w-full flex flex-col p-2 gap-y-2 h-5/6
              overflow-y-scroll md:scrollbar-thin "
              >
                {allMaintanence.length > 0
                  ? allMaintanence
                      .slice()
                      .reverse()
                      .map((maintanence: any) => (
                        <div
                          key={maintanence._id}
                          className="w-full h-fit rounded-md flex flex-col gap-y-1 p-2 bg-white "
                        >
                          <div className="w-full flex justify-between pr-3 ">
                            <p className="font-semibold w-11/12">
                              {maintanence.maintanence_Day} - {maintanence.maintanence_M_Y}
                            </p>

                            <button className="w-1/12 ">
                              <Image
                                src={"/delete.png"}
                                width={20}
                                height={20}
                                alt="del"
                                className="cursor-pointer outline-none"
                                onClick={() => handleDeleteMaintanenceMsg(maintanence._id, maintanence.maintanence_name)}
                              ></Image>
                            </button>
                          </div>
                          <p>
                            Maintnence Name :
                            <span className="font-semibold">
                              {maintanence.maintanence_name}
                            </span>
                          </p>
                          <p>
                            Maintnence Ammount :
                            <span className="font-semibold">
                              ₹{maintanence.maintanence_amount}
                            </span>
                          </p>
                        </div>
                      ))
                  : "No maintanence added yet"}
              </div>
            </>
          )}

          {/* {absolute box for deleting maintanence} */}
          <div
            className="absolute inset-0 m-auto h-32 w-fit bg-white border border-blue-600
                          rounded-md flex flex-col justify-center items-center p-4
                          backdrop-blur-sm"
            style={{ display: isdelmsg ? "flex" : "none" }}
          >
            <h1>
              Want to Delete?{" "}
              <span className="font-bold">{delMaintanenceData.name}</span>
            </h1>
            <div className="w-full h-fit flex gap-x-2 ">
              <button
                className="w-1/2  p-1 cursor-pointer backdrop-blur-sm
                              bg-blue-500 bg-opacity-50 rounded-md"
                onClick={() => setisdelmsg((prev) => !prev)}
              >
                Cancel
              </button>
              <button
                className="w-1/2  p-1 cursor-pointer backdrop-blur-sm
                              bg-red-500 bg-opacity-50 rounded-md flex justify-center items-center"
                onClick={handleDeleteMaintanence}
              >
                Yes
                <div>
                  {yesloading ? (
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
        </div>
      </div>
    </>
  );
}
