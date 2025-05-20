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
  const [yearReport, setYearReport] = useState({
    rent: 0,
    electricity: 0,
    maintanence: 0,
    expense: 0
  });
  const [yearlyButton, setYearlyButton] = useState(false);
  const [monthlyReport, setMonthlyReport] = useState(false);

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
    setMonthlyReport(prev => !prev);
    try {
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
    } catch (error:any) {
      console.log("error in handling monthly report")
    }
    setMonthlyReport(prev => !prev);
  }

  const handleYearlyReport = async() => {
    setYearlyButton(prev => !prev);
    try {
      if(years && userData.user_id != "") {
      const yearlyReport = await axios.post('/api/get-yearly-report', {user_id: userData.user_id, years: years});
      const rent = yearlyReport.data.data[0].yearlyRentTotal[0].totalAmount;
      const electricity = yearlyReport.data.data[0].yearlyRentTotal[0].total_Elec_bill;
      const maintanence = yearlyReport.data.data[0].yearly_maintanence_amount[0].totalMaintanence;
      const expense = yearlyReport.data.data[0].yearly_expense_amount[0].total_expense_sum;
      setYearReport({rent: rent, electricity: electricity, maintanence: maintanence, expense: expense});
    }
    } catch (error:any) {
      console.log(error, "error in handle yearly report function");
    }
    setYearlyButton(prev => !prev);
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
        <div className="w-full h-1/6 z-20 bg-blue-100">
          <div className="w-full h-2/3">
            <Navbar userData={userData.name} />
          </div>
        </div>

        <div
          className="w-full -mt-14 flex pt-10 pb-10
          overflow-y-scroll md:scrollbar-thin   
          overflow-x-hidden z-10"
        >

          {
            userData.user_id == "" ? (
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
                    style={{ width: "auto", height: "auto" }}
                  ></Image>
                </div>
              
              </>
            ):(
              <div
              className="w-full h-fit p-2
              flex flex-col md:flex-row justify-center items-center gap-y-4 md:gap-x-6"
              >
              {/* monthly report */}
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
                      <button className={`rounded-md outline-none border bg-white ${monthlyReport ? "bg-slate-300 cursor-not-allowed":""}`} onClick={handleMonthlyReport}>Search</button>
                  </div>
                  <Barchart prev_month={M_Y} 
                            prevMonthRevenue={prevMonthRevenue}
                            prevMonthExpense={prevMonthExpense}
                            prevMonthMaintanence={prevMonthMaintanence}
                  />
                </div>

                {/* yearlly report */}
                <div
                className="p-2 backdrop-blur-md bg-white bg-opacity-70 rounded-md shadow-xl w-80
                flex flex-col justify-center items-center
                "
                >
                  <div className="w-full flex mb-2 pl-2 gap-x-2">
                    <h1 className="font-semibold">Yearly Report</h1>
                      

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
                      <button className={`rounded-md outline-none border bg-white ${yearlyButton ? "bg-slate-300 cursor-not-allowed":""}`} onClick={handleYearlyReport}
                      
                      >Search</button>
                  </div>
                  <Barchart prev_month={years} 
                            prevMonthRevenue={yearReport.rent}
                            prevMonthExpense={yearReport.expense}
                            prevMonthMaintanence={yearReport.maintanence}
                  />
                </div>

              </div>
            )
          }

        </div>
      </div>
    </>
  );
}
