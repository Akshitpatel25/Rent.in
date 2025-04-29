import Image from "next/image";
import Barchart from "./Barchart";
import Link from "next/link";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Main_Dashboard({userData, todaysEarning}:any) {

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
  

  const date = new Date();
  const month = date.getMonth();
  const year = date.getFullYear();
  const monthByName = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const [M_Y, setM_Y] = useState("");
  const [previousMonthData, setPreviousMonthData] = useState<RentData[]>([]);
  const [previousMonthExpense, setPreviousMonthExpense] = useState<ExpenseData[]>([]);
  const [previousMonthMaintanence, setPreviousMonthMaintanence] = useState<MaintanenceData[]>([]);
  const [prevMonthRevenue, setPrevMonthRevenue] = useState(0);
  const [prevMonthExpense, setPrevMonthExpense] = useState(0);
  const [prevMonthMaintanence, setPrevMonthMaintanence] = useState(0);

  useEffect(()=>{
    if (month == 0) {
      setM_Y(`${monthByName[11]}${year - 1}`);
    }else {
      setM_Y(`${monthByName[month-1]}${year}`);
    }
  },[]);

//  console.log(userData)

  const getPreviousMonthRevenue = async() => {
    if (M_Y && userData?._id != "") {
      const res = await axios.post('/api/get-previous-month-revenue', {user_id: userData?._id, M_Y: M_Y});
      if (res.status == 200) {
        setPreviousMonthData(res.data.data);
      }
      const exRes = await axios.post('/api/get-previous-month-expense', {user_id: userData?._id, M_Y: M_Y});
      if (exRes.status == 200) {
        setPreviousMonthExpense(exRes.data.data);  
      }
      const MainRes = await axios.post('/api/get-previous-month-maintanence', {user_id: userData?._id, M_Y: M_Y});
      if (MainRes.status == 200) {
        setPreviousMonthMaintanence(MainRes.data.data);
      }
    }
  }

  const allMonthDataExpenseMain = () => {
    if (previousMonthData.length > 0) {
      let sum = 0;
      for (let i = 0; i < previousMonthData.length; i++) {
        if (previousMonthData[i].payment_mode !== "Not Paid") {
          sum = sum + Number(previousMonthData[i].monthly_rent_price);
        }
      }
      setPrevMonthRevenue(sum);
    }

    if (previousMonthExpense.length > 0) {
      let sum = 0;
      for (let i = 0; i < previousMonthExpense.length; i++) {
        sum = sum + Number(previousMonthExpense[i].expense_amount);
      }
      setPrevMonthExpense(sum);
    }

    if (previousMonthMaintanence.length > 0) {
      let sum = 0;
      for (let i = 0; i < previousMonthMaintanence.length; i++) {
        sum = sum + Number(previousMonthMaintanence[i].maintanence_amount);
      }
      setPrevMonthMaintanence(sum);
    }
  }

  useEffect(()=> {
    getPreviousMonthRevenue();
  },[userData?._id]);

  useEffect(()=>{
      allMonthDataExpenseMain();
  },[previousMonthData, previousMonthExpense, previousMonthMaintanence]);

  
  
  return (
    <>
      <div
      // main container
      className="w-full h-fit p-3 pb-4
      flex flex-col gap-y-4 md:gap-y-6 lg:gap-y-8 xl:gap-y-10"
      >
        <div
        // welcome box
        className="w-full h-fit rounded-md flex flex-col
        gap-y-4 backdrop-blur-sm bg-white 
        text-2xl md:text-3xl lg:text-4xl xl:text-6xl
        p-5 md:p-6 lg:p-7
        md:gap-y-6 lg:gap-y-8 xl:gap-y-10"

        >
          <h1
          >Welcome Back! <span className="font-bold ">{userData?.name}</span>
          </h1>

          <div
          className="w-full h-fit"
          >
            <h1>₹{todaysEarning}</h1>
            <p
            className="text-sm md:text-md lg:text-lg text-gray-700"
            >Est Today&apos;s Earnings</p>
          </div>

          <div
          className="w-full h-fit flex justify-end
          -mt-20 xl:-mt-24"
          >
            <Image
            className="w-44 h-40 
            md:w-56 md:h-52 md:mr-8 md:-mt-12
            lg:w-64 lg:h-64 lg:mr-12 lg:-mt-12
            xl:w-80 xl:h-72 xl:mr-14 xl:-mt-12"
            src={"/dash-bg.png"}
            width={150}
            height={150}
            alt="dash-bg"
            priority
            ></Image>
          </div>

        </div>

        <Link href={"/create-new-rent"}
        className="w-full h-fit rounded-md flex
        justify-between items-center cursor-pointer
        gap-y-4 backdrop-blur-sm bg-white
        text-2xl md:text-3xl lg:text-4xl xl:text-5xl
        p-5 md:p-6 lg:p-7 hover:bg-opacity-60"
        >
          <h1 >Create New Rent</h1>
          <span className="text-3xl md:text-4xl lg:text-5xl 
          px-2 text-white bg-blue-600 rounded-full">+</span>
        </Link>

        <Link href={'/all-properties'}
        className="w-full h-fit rounded-md flex
        justify-between items-center cursor-pointer
        gap-y-4 backdrop-blur-sm bg-white 
        text-2xl md:text-3xl lg:text-4xl xl:text-5xl
        p-5 md:p-6 lg:p-7 hover:bg-opacity-60"
        >
          <h1 >All Properties</h1>
          <span className="text-3xl md:text-4xl lg:text-5xl 
          px-2 text-white bg-blue-600 rounded-full">+</span>
        </Link>

        <Link href={'/add-expense'}
        className="w-full h-fit rounded-md flex
        justify-between items-center cursor-pointer
        gap-y-4 backdrop-blur-sm bg-white 
        text-2xl md:text-3xl lg:text-4xl xl:text-5xl
        p-5 md:p-6 lg:p-7 hover:bg-opacity-60"
        >
          <h1 >Add Expense</h1>
          <span className="text-3xl md:text-4xl lg:text-5xl 
          px-2 text-white bg-blue-600 rounded-full">+</span>
        </Link>

        <Link href={'/add-maintanence'}
        className="w-full h-fit rounded-md flex
        justify-between items-center cursor-pointer
        gap-y-4 backdrop-blur-sm bg-white 
        text-2xl md:text-3xl lg:text-4xl xl:text-5xl
        p-5 md:p-6 lg:p-7 hover:bg-opacity-60"
        >
          <h1 >Add Maintanence</h1>
          <span className="text-3xl md:text-4xl lg:text-5xl 
          px-2 text-white bg-blue-600 rounded-full">+</span>
        </Link>

        <Link href={'/rents-summary'}
        className="w-full h-fit rounded-md flex
        justify-between items-center cursor-pointer
        gap-y-4 backdrop-blur-sm bg-white
        text-2xl md:text-3xl lg:text-4xl xl:text-5xl
        p-5 md:p-6 lg:p-7 hover:bg-opacity-60"
        >
          <h1 >Rents Summary</h1>
          <span className="text-3xl md:text-4xl lg:text-5xl 
          px-2 text-white bg-blue-600 rounded-full">+</span>
        </Link>

        <div
        className="w-full h-fit rounded-md flex flex-col p-5
        md:p-7 lg:pt-10 md:pl-36 md:pr-36 lg:pl-48 lg:pr-48
        xl:pr-64 xl:pl-64
        justify-between items-center cursor-pointer
        gap-y-4 backdrop-blur-sm bg-white "
        >
          <h1 className="w-full text-2xl md:text-3xl lg:text-4xl"
          ><span className="font-bold">{M_Y.slice(0,3)}</span>-<span className="font-bold">{M_Y.slice(3)}</span> Revenue</h1>
          <Barchart prev_month={M_Y} 
          prevMonthRevenue={prevMonthRevenue}
          prevMonthExpense={prevMonthExpense}
          prevMonthMaintanence={prevMonthMaintanence}
          />
        </div>

      </div>
    </>
  );
}
