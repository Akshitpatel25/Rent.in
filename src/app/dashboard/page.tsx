"use client";

import { useState, useEffect} from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Main_Dashboard from "@/components/Main_Dashboard";
import { signOut } from "next-auth/react";

interface todaysEarningDataInterface {
  monthly_rent_price: string;
}

export default function Dashboard() {
  const [userData, setuserData] = useState({
    name: "",
    user_id: "",
  });
  const router = useRouter();
  const [TodaysEarningData, setTodaysEarningData] = useState<todaysEarningDataInterface[]>([]);
  const [TodaysEarning, setTodaysEarning] = useState("---");
  const style = {
    background:
      "linear-gradient(0deg, rgba(188,108,37,1) 0%, rgba(221,161,94,1) 49%, rgba(254,250,224,1) 100%)",
  };

  const getUserDetailsinFrontend = async () => {
    try {
      const res = axios.get("/api/me");
      res
        .then((res) => {
          if (res.status == 200) {
            setuserData({
              name: res.data.user.name,
              user_id: res.data.user._id,
            });
          }
          console.log("response from dashboard me route:",res.data.user);
          
        })
        .catch(async(err) => {
          if (err.response.status == 400) {
            await axios.get("/api/logout");
            signOut();
            router.push("/login");
          }
          
        })
      
    } catch (error) {
      router.push("/login");
    }
  };

  const EstTodaysEarning = async() => {
    if (userData.user_id !== "") {
      const res = await axios.post('/api/todays-earning', {user_id: userData.user_id});
      if (res.status == 200) {
        setTodaysEarningData(res.data.data);

      }
    }
  }
 

  useEffect(() => {
    getUserDetailsinFrontend();
  }, []);
  
 useEffect(()=> {
    EstTodaysEarning();

 },[userData.user_id]);


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
                  priority
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
                <Main_Dashboard userData={userData} todaysEarning={TodaysEarning}/>
              </div>
            </>
          )
        }

        
      </div>
    </>
  );
}
