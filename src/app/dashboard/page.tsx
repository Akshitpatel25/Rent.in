"use client";

import { useState, useEffect} from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Main_Dashboard from "@/components/Main_Dashboard";
import { signOut } from "next-auth/react";
import useTheme from "@/zustand/userDetails";
import useProperties from "@/zustand/userProperties";

interface todaysEarningDataInterface {
  monthly_rent_price: string;
}

export default function Dashboard() {
  const {fetchUserProperties} = useProperties();
  const {userDetails, fetchUserDetails} = useTheme();
  const router = useRouter();
  const [TodaysEarningData, setTodaysEarningData] = useState<todaysEarningDataInterface[]>([]);
  const [TodaysEarning, setTodaysEarning] = useState("---");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  

  useEffect(() => {
    fetchUserDetails();
  },[])



  const EstTodaysEarning = async(cancelToken: any) => {
    try {
      setLoading(true);
      setError("");
      if (userDetails?._id !== "") {
        const res = await axios.post('/api/todays-earning', {user_id: userDetails?._id}, { cancelToken });
        if (res.status === 200) {
          setTodaysEarningData(res.data.data);
        } else {
          setError("Failed to fetch today's earning.");
        }
        fetchUserProperties(userDetails?.email);
      }
    } catch (err) {
      if (axios.isCancel && axios.isCancel(err)) {
        // Request cancelled
      } else {
        setError("Error fetching today's earning.");
      }
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    EstTodaysEarning(source.token);
    if (userDetails?._id == "") {
      router.push("/");
    }
    return () => {
      source.cancel("Dashboard API call cancelled");
    };
  }, [userDetails?._id]);


 useEffect(()=> {
  let sum = 0;
  for (let i = 0; i < TodaysEarningData.length; i++) {
    sum += Number(TodaysEarningData[i].monthly_rent_price);
  }
  let totalSum = Math.round(sum/30);
  setTodaysEarning(String(totalSum));
  
 },[TodaysEarningData])
 

  return (
    <>
      <div className="w-screen h-screen flex flex-col gap-y-4 min-w-80 max-w-screen-2xl m-auto bg-blue-100">
        <div className="w-full h-1/6 ">
          <div className="w-full h-2/3">
            <Navbar userData={userDetails?.name}/>
          </div>
        </div>
        {userDetails?._id == "" || loading ? (
          <div className="w-full h-screen flex justify-center items-center">
            <Image src={"/ZKZg.gif"} width={50} height={50} alt="loading..." priority />
          </div>
        ) : error ? (
          <div className="w-full h-screen flex justify-center items-center">
            <h2 className="text-red-500">{error}</h2>
          </div>
        ) : (
          <div className="w-full h-5/6 -mt-14 overflow-y-scroll md:scrollbar-thin overflow-x-hidden ">
            <Main_Dashboard userData={userDetails} todaysEarning={TodaysEarning}/>
          </div>
        )}
      </div>
    </>
  );
}
