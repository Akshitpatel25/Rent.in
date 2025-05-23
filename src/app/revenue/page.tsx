"use client";
import Navbar from "@/components/Navbar";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";
import Barchart from "@/components/Barchart";



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
  const [M_Y, setM_Y] = useState((`JAN${year}`).toString());
  const [yearReport, setYearReport] = useState({
    rent: 0,
    electricity: 0,
    maintanence: 0,
    expense: 0
  });
  const [monthlyReport, setMonthlyReport] = useState({
    rent:0,
    maintanence:0,
    expense:0
  });
  const [yearlyButton, setYearlyButton] = useState(false);
  const [monthlyButton, setMonthlyButton] = useState(false);

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
    setMonthlyButton(prev => !prev);
      try {
       if (M_Y && userData.user_id != ""){
        let monthNumber = 0;
      if (month == "JAN") {
        monthNumber = 1;
      }
      if (month == "FEB") {
        monthNumber = 2;
      }
      if (month == "MAR") {
        monthNumber = 3
      }
      if (month == "APR") {
        monthNumber = 4;
      }
      if (month == "MAY") {
        monthNumber = 5
      }
      if (month == "JUN") {
        monthNumber = 6
      }
      if (month == "JUL") {
        monthNumber = 7
      }
      if (month == "AUG") {
        monthNumber = 8
      }
      if (month == "SEP") {
        monthNumber = 9
      }
      if (month == "OCT") {
        monthNumber = 10
      }
      if (month == "NOV") {
        monthNumber == 11
      }
      if (month == "DEC") {
        monthNumber = 12
      }
        const result = await axios.post('/api/get-monthly-report', {user_id: userData.user_id, M_Y: `${month}${years}`, M:monthNumber, Y:years.slice(-2) });
        const rent = result.data.data[0].monthly_rents[0]?.total || 0;
        const maintanence = result.data.data[0].monthly_maintanence[0]?.total || 0;
        const expense = result.data.data[0].monthly_expenses[0]?.total || 0;
        // console.log(rent, maintanence, expense);
        setMonthlyReport({
          rent:rent,
          maintanence:maintanence,
          expense:expense
        })
      } 
      } catch (error) {
        console.log("error in monthly report", error)
      }
    
    setMonthlyButton(prev => !prev);
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
                    style={{ width: "50px", height: "50px", maxWidth: "auto", maxHeight: "auto" }}
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
                      <button className={`rounded-md outline-none border bg-white ${monthlyButton ? "bg-slate-300 cursor-not-allowed":""}`} onClick={handleMonthlyReport}>Search</button>
                  </div>
                  <Barchart prev_month={M_Y} 
                            prevMonthRevenue={monthlyReport.rent}
                            prevMonthExpense={monthlyReport.expense}
                            prevMonthMaintanence={monthlyReport.maintanence}
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
