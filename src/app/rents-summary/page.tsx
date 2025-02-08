"use client";
import Navbar from "@/components/Navbar";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function RentsSummary() {

  type PropertyData = {
    rent_id: string;
    month_year: string;
    rent_name: string;
    rent_person_name: string;
    monthly_rent_price: string;
    Rent_Paid_date: string;
    // Add other fields as needed
};

  const router = useRouter();
  const [userData, setuserData] = useState({
    user_id: "",
    name: "",
    email: "",
    isVerified: "",
  });

  const date = new Date();
  const year = date.getFullYear();
  const YEARS = [ year, year - 1]; 
  const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const [monthName, setmonthName] = useState(`${MONTHS[0]}`);
  const [yearName, setyearName] = useState(`${YEARS[0]}`);
  const style = {
    background:
      "linear-gradient(0deg, rgba(188,108,37,1) 0%, rgba(221,161,94,1) 49%, rgba(254,250,224,1) 100%)",
  };
  // const [resData, setresData] = useState([]);

  const [allMonthData, setallMonthData] = useState<PropertyData[]>([]);
  // const [allRentRemainingMonthData, setallRentRemainingMonthData] = useState<PropertyData[]>([]);

  
  const getUserDetailsinFrontend = async () => {
    // getting user details from Rtoken from cookies
    try {
      const res = await axios.get("/api/me");
      setuserData({
        user_id: res?.data?.user?._id!,
        name: res?.data?.user?.name!,
        email: res?.data?.user?.email!,
        isVerified: res?.data?.user?.isVerified,
      });
    } catch (error) {
      router.push("/login");
    }
  };

  // const GETAllProperties = () => {
  //   const res = axios.post("/api/getAPIs/all-properties",{email: userData.email});
  //   res.then((res) => {
  //     setresData(res.data.data)
      
  //   }).catch((err) => console.log(err));
    
  // };

// remember to change in route file
const gettingAllPropertiesMonthlyData = async () => {
  try {
    const res = await axios.post("/api/getting-all-properties-monthly-data", { user_id: userData.user_id });
    setallMonthData(res.data.data.filter((data:any)=> data.Rent_Paid_date != "" && data.month_year == monthName+yearName) || []);
    // setallRentRemainingMonthData(res.data.data.filter((data:any)=> data.Rent_Paid_date == "" && data.month_year == monthName+yearName) || []);
  } catch (error:any) {
    setallMonthData([]);
  }
  
};



  useEffect(() => {
    getUserDetailsinFrontend();
    // GETAllProperties();
    gettingAllPropertiesMonthlyData();
  }, [userData.user_id]);

    useEffect(() => {
      gettingAllPropertiesMonthlyData();
    },[monthName, yearName]);

  // useEffect(() => {
  //   console.log(resData);
  //   console.log(allMonthData);
  //   console.log(allRentRemainingMonthData)
  // },[ resData, allMonthData]);
  

  return (
    <>
      <div
        style={{ background: style.background }}
        className="w-screen h-screen flex flex-col gap-y-4 min-w-80 max-w-screen-2xl m-auto"
      >
        <div className="w-full h-1/6 ">
          <div className="w-full h-2/3">
            <Navbar userData={userData.name}/>
          </div>
        </div>

        <div
          className="w-full h-5/6 -mt-14"
        >
          <div
          className="w-full h-1/6 flex flex-col gap-y-3 justify-center items-center"
          >
            <h1 className="italic font-bold">Select the month and year for Rental Summary</h1>
            <div
            className="w-fit h-fit flex gap-x-2"
            >
              <select
              className="p-2 rounded-md border-none outline-none"
              onChange={(e) => setmonthName(e.target.value)}
              >
                {
                  MONTHS.map((month, index) => (
                    <option key={index}>{month}</option>
                  ))
                }
              </select> 

              <select 
              className="p-2 rounded-md border-none outline-none"
              onChange={(e) =>{ 
                setyearName(e.target.value)
              }}
              >
                {
                  YEARS.map((year, index) => (
                    <option key={index}>{year}</option>
                  ))
                }
              </select>
            </div>
          </div>

          <div
          className=" w-full h-5/6 overflow-y-scroll md:scrollbar-thin   
          overflow-x-hidden flex flex-col gap-y-3 p-1"
          >
            <h1 className=" text-center font-bold underline">Rent Paid Details</h1>
            <div
            className="flex flex-col gap-y-2"
            >
            {
              allMonthData.length > 0 ? allMonthData.map((data) => (
                <div
                className="w-full h-fit flex justify-between shadow-md bg-slate-300 p-2 rounded-md bg-opacity-30"
                key={data.rent_id}
                >
                  <div
                  className="w-1/2 "
                  >
                      <div className="font-bold">
                      {data.rent_name} → 
                      </div>
                      <div>
                        {data.rent_person_name.split(" ").slice(0, 2).join(" ")}
                      </div>
                  </div>

                  <div
                  className="w-1/2 text-right"
                  >
                    <div>
                      {data.Rent_Paid_date}
                    </div>
                    <div>
                      ₹{data.monthly_rent_price}
                    </div>
                  </div>
                  
                </div>
              )):(
                <>
                  <h1 className="text-2xl pl-2">No rents for this month</h1>
                </>
              )
            }
            </div>

            {
              allMonthData.length > 0 ? (
                <div className="pb-4 text-2xl pl-2 font-bold">
                  Total : ₹ {allMonthData.reduce((acc, curr) => acc + parseInt(curr.monthly_rent_price), 0)}
                </div>
              ):(<></>)
            }

            
          </div>
          

        </div>
      </div>
    </>
  );
}
