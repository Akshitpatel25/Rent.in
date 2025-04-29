"use client";
import Navbar from "@/components/Navbar";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";
import Barchart from "@/components/Barchart";

interface RentData {
  Rent_Paid_date: string;
  electricity_bill: string;
  meter_reading: string;
  month_year: string;
  monthly_rent_price: string;
  note: string;
  payment_mode: string;
  rent_id: string;
  rent_name: string;
  rent_person_name: string;
  user_id: string;
  _id: string;
}

interface ExpenseData {
  expense_amount: string;
  expense_Day: string;
  expense_M_Y: string;
  expense_name: string;
  user_id: string;
  _id: string;
}

interface MaintanenceData {
  maintanence_amount: string;
  maintanence_Day: string;
  maintanence_M_Y: string;
  maintanence_name: string;
  user_id: string;
  _id: string;
}


export default function Revenue() {
  const router = useRouter();
  const [userData, setuserData] = useState({
    user_id: "",
    name: "",
    email: "",
  });
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];  
  const date = new Date();
  const year = date.getFullYear();
  const selectyear = [year,year - 1];
  const [month, setmonth] = useState("JAN");
  const [years, setyears] = useState(`${year}`);
  const [previousMonthData, setPreviousMonthData] = useState<RentData[]>([]);
  const [previousMonthExpense, setPreviousMonthExpense] = useState<ExpenseData[]>([]);
  const [previousMonthMaintanence, setPreviousMonthMaintanence] = useState<MaintanenceData[]>([]);
  const [prevMonthRevenue, setPrevMonthRevenue] = useState(0);
  const [prevMonthExpense, setPrevMonthExpense] = useState(0);
  const [prevMonthMaintanence, setPrevMonthMaintanence] = useState(0);
  const [M_Y, setM_Y] = useState((`JAN${year}`).toString());
  

  const getUserDetailsinFrontend = async () => {
    // getting user details from Rtoken from cookies
    try {
      const res = await axios.get("/api/me");
      setuserData({
        user_id: res?.data?.user?._id!,
        name: res?.data?.user?.name!,
        email: res?.data?.user?.email!,
      });
    } catch (error) {
      router.push("/login");
    }
  };

  const handleMonthlyReport = async() => {
    if (M_Y && userData.user_id != "") {
      const res = await axios.post('/api/get-previous-month-revenue', {user_id: userData.user_id, M_Y: `${month}${years}`});
      if (res.status == 200) {
        setPreviousMonthData(res.data.data);
      }
      const exRes = await axios.post('/api/get-previous-month-expense', {user_id: userData.user_id, M_Y: `${month}${years}`});
      if (exRes.status == 200) {
        setPreviousMonthExpense(exRes.data.data);  
      }
      const MainRes = await axios.post('/api/get-previous-month-maintanence', {user_id: userData.user_id, M_Y: `${month}${years}`});
      if (MainRes.status == 200) {
        setPreviousMonthMaintanence(MainRes.data.data);
      }
    }
  }


  useEffect(() => {
    getUserDetailsinFrontend();
  }, []);

  useEffect(() => {
    setM_Y(`${month}${years}`);
  },[month,years]);

  useEffect(()=>{
    if (previousMonthData != undefined) {
      let sum = 0;
      for (let i = 0; i < previousMonthData.length; i++) {
        if (previousMonthData[i].payment_mode !== "Not Paid") {
          sum = sum + Number(previousMonthData[i].monthly_rent_price);
        }
      }
      setPrevMonthRevenue(sum);
    }

    if (previousMonthExpense != undefined) {
      let sum = 0;
      for (let i = 0; i < previousMonthExpense.length; i++) {
        sum = sum + Number(previousMonthExpense[i].expense_amount);
      }
      setPrevMonthExpense(sum);
    }

    if (previousMonthMaintanence != undefined) {
      let sum = 0;
      for (let i = 0; i < previousMonthMaintanence.length; i++) {
        sum = sum + Number(previousMonthMaintanence[i].maintanence_amount);
      }
      setPrevMonthMaintanence(sum);
    }
    
  },[previousMonthData,previousMonthExpense,previousMonthMaintanence]);


  return (
    <>
      <div
        className="w-screen h-screen flex flex-col bg-blue-100
        gap-y-4 min-w-80 max-w-screen-2xl m-auto"
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

          {
            userData.name == "" ? (
              <>

                <div
                  className="w-screen h-screen flex justify-center items-center"
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
              className="w-full h-full p-2
              flex flex-col justify-center items-center gap-y-2"
              >
                <div
                className="p-2 backdrop-blur-md bg-white bg-opacity-70 rounded-md shadow-xl w-80
                flex flex-col justify-center items-center
                "
                >
                  <div className="w-full flex mb-2 pl-2 gap-x-2">
                    <h1 className="font-semibold">Month Report</h1>
                      <select 
                      className="rounded-md outline-none"
                        onChange={(e)=> setmonth(e.target.value)}
                      >
                        {months.map((month, index) => (
                          <option 
                          key={index} 
                          value={month}
                          >
                            {month}
                          </option>
                        ))}
                      </select>

                      <select
                      className="rounded-md outline-none"
                      onChange={(e)=> setyears(e.target.value)}
                      >

                        {
                          selectyear.map((year, index)=>(
                            <option
                            value={year}
                            key={index}
                            >{year}</option>
                          ))
                        }

                      </select>
                      <button className="rounded-md outline-none border bg-white" onClick={handleMonthlyReport}>Search</button>
                  </div>
                  <Barchart prev_month={M_Y} 
                            prevMonthRevenue={prevMonthRevenue}
                            prevMonthExpense={prevMonthExpense}
                            prevMonthMaintanence={prevMonthMaintanence}
                  />
                </div>

              </div>
              </>
            )
          }

        </div>
      </div>
    </>
  );
}
