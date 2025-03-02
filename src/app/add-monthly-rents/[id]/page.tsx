"use client";
import Navbar from "@/components/Navbar";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function AddMonthlyRents({ params }: any) {
  const router = useRouter();
  const [userData, setuserData] = useState({
    name: "",
    email: "",
  });
  const [rentData, setrentData] = useState({
    user_id: "",
    rent_id: "",
    rent_name: "",
    rent_person_name: "",
    rent_person_num: "",
    rent_person_adhar: "",
    monthly_rent_price: "",
    monthly_ele_bill_price: "",
    ele_unit_price: "",
  });
  const [err, seterr] = useState("");

  const [selectedMonth, setSelectedMonth] = useState("JAN");
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState("");
  const [monthIndex, setMonthIndex] = useState(0);
  const years = [currentYear, currentYear - 1];
  const MonthByName = [
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
  const [isElecheck, setisElechecked] = useState(false);
  const [meterReading, setmeterReading] = useState(""); 
  const [isRentPaid, setisRentPaid] = useState(false);
  const paymentMethod = ["cash", "cheque", "upi" ,"net banking"];
  const [paymentMode, setpaymentMode] = useState("Select Payment Mode");
  const [note, setnote] = useState("All Clear");
  const [submitLoading, setsubmitLoading] = useState(false);
  const date = new Date();
  const day = date.getDate();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);

  const formattedDate = `${day}/${month}/${year}`;

  const style = {
    background:
      "linear-gradient(0deg, rgba(188,108,37,1) 0%, rgba(221,161,94,1) 49%, rgba(254,250,224,1) 100%)",
  };

  const getUserDetailsinFrontend = async () => {
    // getting user details from Rtoken/sessions from cookies
    try {
      const res = await axios.get("/api/me");
      setuserData({
        name: res?.data?.user?.name!,
        email: res?.data?.user?.email!,
      });
    } catch (error) {
      router.push("/login");
    }
  };

  const getingParamCheck = async () => {
    // getting rents id from params and checking it from database
    try {
      const { id } = await params;

      const res = await axios.post(`/api/individual-rent/`, { id });
      
      if (res.status == 200) {
        setrentData({
          user_id: res.data.data.user_id,
          rent_id: res.data.data._id,
          rent_name: res.data.data.rent_name,
          rent_person_name: res.data.data.rent_person_name,
          rent_person_num: res.data.data.rent_person_num,
          rent_person_adhar: res.data.data.rent_person_adhar,
          monthly_rent_price: res.data.data.monthly_rent_price,
          monthly_ele_bill_price: res.data.data.monthly_ele_bill_price,
          ele_unit_price: res.data.data.ele_unit_price,
        });
      }
    } catch (error: any) {

      seterr(error.data.error);
    }
  };

  const MonthHandleChange = (e: any) => {
    const monthIndex = e.target.value;
    setMonthIndex(monthIndex);

    setSelectedMonth(MonthByName[monthIndex]);
  };

  const YearHandleChange = (e: any) => {
    setSelectedYear(e.target.value);
  };

  const handleCreateNewMonthRent = async() => {
    if (selectedMonth === "" || selectedYear === "") {
        return seterr("Select Month and Year");
    }else if (!isElecheck) {
        if (meterReading === "") {
            return seterr("Enter Meter Reading");
        }
        
    }else if (isRentPaid) {
        
        if (paymentMode === "Select Payment Mode") {
            
            return seterr("Select Payment Mode");
        }
    }else if (isElecheck && !isRentPaid) {
      return seterr("If you select Default Electric Price, then you have to select Rent paid");

    }
    setsubmitLoading((prev)=> !prev);

    

    if (selectedMonth == "JAN" && isElecheck == true && isRentPaid == true) {
        const month = "DEC";
        const Year = Number(selectedYear) - 1;
        const finalM_Y = month + Year;

        const resp = await axios.post('/api/find-previous-month', {finalM_Y, rent_id: rentData.rent_id});

        const currentMonthFinalDataForNoHistory = {
            user_id: rentData.user_id,
            rent_id: rentData.rent_id,
            rent_name: rentData.rent_name,
            rent_person_name: rentData.rent_person_name,
            rent_person_adhar: rentData.rent_person_adhar,
            monthly_rent_price: rentData.monthly_rent_price,
            month_year: selectedMonth + selectedYear,
            meter_reading: "0",
            electricity_bill: rentData.monthly_ele_bill_price,
            payment_mode: paymentMode,
            note: note,
            date: formattedDate 
            
        }
        if (resp.status == 202) {
            const res = await axios.post('/api/create-new-monthly-rent', currentMonthFinalDataForNoHistory);
            if (res.status == 202) {
                seterr(`You have already store data for ${selectedMonth+selectedYear}`);
                setsubmitLoading((prev)=> !prev);
            }else {
              const response = await axios.post('/api/send-sms', {
                to: `+91${rentData.rent_person_num}`, 
                message: `Hello ${rentData.rent_person_name}!, Your Rent for ${selectedMonth + selectedYear} is ₹${rentData.monthly_rent_price} and Electricity Bill is ₹${rentData.monthly_ele_bill_price}. Total Bill is ₹${Number(rentData.monthly_rent_price) + Number(rentData.monthly_ele_bill_price)}.`,
                });

                setsubmitLoading((prev)=> !prev);
                router.push(`/individual-rent/${rentData.rent_id}`);
                
            }
            return;
        }

        const currentMonthFinalDataForHistory = {
            user_id: rentData.user_id,
            rent_id: rentData.rent_id,
            rent_name: rentData.rent_name,
            rent_person_name: rentData.rent_person_name,
            rent_person_adhar: rentData.rent_person_adhar,
            monthly_rent_price: rentData.monthly_rent_price,
            month_year: selectedMonth + selectedYear,
            meter_reading: resp.data.data.meter_reading,
            electricity_bill: rentData.monthly_ele_bill_price,
            payment_mode: paymentMode,
            note: note,
            date: formattedDate 
        }
        
        if (resp.status == 200) {
            const res =await axios.post('/api/create-new-monthly-rent', currentMonthFinalDataForHistory);
            if (res.status == 202) {
              seterr(`You have already store data for ${selectedMonth+selectedYear}`);
                setsubmitLoading((prev)=> !prev);
            }else {
              const response = await axios.post('/api/send-sms', {
                to: `+91${rentData.rent_person_num}`, 
                message: `Hello ${rentData.rent_person_name}!, Your Rent for ${selectedMonth + selectedYear} is ₹${rentData.monthly_rent_price} and Electricity Bill is ₹${rentData.monthly_ele_bill_price}. Total Bill is ₹${Number(rentData.monthly_rent_price) + Number(rentData.monthly_ele_bill_price)}.`,
                });
                setsubmitLoading((prev)=> !prev);
                router.push(`/individual-rent/${rentData.rent_id}`);
            }
            return;
        }
    }
    else if (selectedMonth !== "JAN" && isElecheck == true && isRentPaid == true) {
        const month = MonthByName[monthIndex-1];
        const finalM_Y = month + selectedYear;
        

        const resp = await axios.post('/api/find-previous-month', {finalM_Y, rent_id: rentData.rent_id});

        
        const currentMonthFinalDataForNoHistory = {
            user_id: rentData.user_id,
            rent_id: rentData.rent_id,
            rent_name: rentData.rent_name,
            rent_person_name: rentData.rent_person_name,
            rent_person_adhar: rentData.rent_person_adhar,
            monthly_rent_price: rentData.monthly_rent_price,
            month_year: selectedMonth + selectedYear,
            meter_reading: "0",
            electricity_bill: rentData.monthly_ele_bill_price,
            payment_mode: paymentMode,
            note: note,
            date: formattedDate
        }
        
        if (resp.status == 202) {
            const res = await axios.post('/api/create-new-monthly-rent', currentMonthFinalDataForNoHistory);
            if (res.status == 202) {
              seterr(`You have already store data for ${selectedMonth+selectedYear}`);
                setsubmitLoading((prev)=> !prev);
            }else {
              const response = await axios.post('/api/send-sms', {
                to: `+91${rentData.rent_person_num}`, 
                message: `Hello ${rentData.rent_person_name}!, Your Rent for ${selectedMonth + selectedYear} is ₹${rentData.monthly_rent_price} and Electricity Bill is ₹${rentData.monthly_ele_bill_price}. Total Bill is ₹${Number(rentData.monthly_rent_price) + Number(rentData.monthly_ele_bill_price)}.`,
                });
                setsubmitLoading((prev)=> !prev);
                router.push(`/individual-rent/${rentData.rent_id}`);
            }
            return;
        }

        const currentMonthFinalDataForHistory = {
            user_id: rentData.user_id,
            rent_id: rentData.rent_id,
            rent_name: rentData.rent_name,
            rent_person_name: rentData.rent_person_name,
            rent_person_adhar: rentData.rent_person_adhar,
            monthly_rent_price: rentData.monthly_rent_price,
            month_year: selectedMonth + selectedYear,
            meter_reading: resp.data.data.meter_reading,
            electricity_bill: rentData.monthly_ele_bill_price,
            payment_mode: paymentMode,
            note: note,
            date: formattedDate 
        }
        if (resp.status == 200) {
            const res = await axios.post('/api/create-new-monthly-rent', currentMonthFinalDataForHistory);
            if (res.status == 202) {
              seterr(`You have already store data for ${selectedMonth+selectedYear}`);
                setsubmitLoading((prev)=> !prev);
            }else {
              const response = await axios.post('/api/send-sms', {
                to: `+91${rentData.rent_person_num}`, 
                message: `Hello ${rentData.rent_person_name}!, Your Rent for ${selectedMonth + selectedYear} is ₹${rentData.monthly_rent_price} and Electricity Bill is ₹${rentData.monthly_ele_bill_price}. Total Bill is ₹${Number(rentData.monthly_rent_price) + Number(rentData.monthly_ele_bill_price)}.`,
                });
                setsubmitLoading((prev)=> !prev);
                router.push(`/individual-rent/${rentData.rent_id}`);
            }
            return;
        }
        
    }
    else if (selectedMonth == "JAN" && isElecheck == false && isRentPaid == false) {
        const month = "DEC";
        const Year = Number(selectedYear) - 1;
        const finalM_Y = month + Year;

        const resp = await axios.post('/api/find-previous-month', {finalM_Y, rent_id: rentData.rent_id});

        // calculating electric bill from meter reading if previous month not found 
        const elecBill = (Number(meterReading) * Number(rentData.ele_unit_price));

        const currentMonthFinalDataForNoHistory = {
            user_id: rentData.user_id,
            rent_id: rentData.rent_id,
            rent_name: rentData.rent_name,
            rent_person_name: rentData.rent_person_name,
            rent_person_adhar: rentData.rent_person_adhar,
            monthly_rent_price: rentData.monthly_rent_price,
            month_year: selectedMonth + selectedYear,
            meter_reading: meterReading,
            electricity_bill: elecBill.toString(),
            payment_mode: "Not Paid",
            note: note,
            date: "",
        }
        if (resp.status == 202) {
            const res =await axios.post('/api/create-new-monthly-rent', currentMonthFinalDataForNoHistory);
            if (res.status == 202) {
              seterr(`You have already store data for ${selectedMonth+selectedYear}`);
                setsubmitLoading((prev)=> !prev);
            }else {
              const response = await axios.post('/api/send-sms', {
                to: `+91${rentData.rent_person_num}`, 
                message: `Hello ${rentData.rent_person_name}!, Your Rent for ${selectedMonth + selectedYear} is ₹${rentData.monthly_rent_price} and Electricity Bill is ₹${elecBill}. Total Bill is ₹${Number(rentData.monthly_rent_price) + Number(elecBill)}.`,
                });
                setsubmitLoading((prev)=> !prev);
                router.push(`/individual-rent/${rentData.rent_id}`);
            }
            return;
        } 

        // calculating electric bill from meter reading if previous month found
        const elecBill_prev_month = (Number(meterReading) - Number(resp.data.data.meter_reading)) * Number(rentData.ele_unit_price);

        const currentMonthFinalDataForHistory = {
            user_id: rentData.user_id,
            rent_id: rentData.rent_id,
            rent_name: rentData.rent_name,
            rent_person_name: rentData.rent_person_name,
            rent_person_adhar: rentData.rent_person_adhar,
            monthly_rent_price: rentData.monthly_rent_price,
            month_year: selectedMonth + selectedYear,
            meter_reading: meterReading,
            electricity_bill: elecBill_prev_month.toString(),
            payment_mode: "Not Paid",
            note: note,
            date: "",
        }

        if (resp.status == 200) {
            const res = await axios.post('/api/create-new-monthly-rent', currentMonthFinalDataForHistory);
            if (res.status == 202) {
              seterr(`You have already store data for ${selectedMonth+selectedYear}`);
                setsubmitLoading((prev)=> !prev);
            }else {
              const response = await axios.post('/api/send-sms', {
                to: `+91${rentData.rent_person_num}`, 
                message: `Hello ${rentData.rent_person_name}!, Your Rent for ${selectedMonth + selectedYear} is ₹${rentData.monthly_rent_price} and Electricity Bill is ₹${elecBill_prev_month}. Total Bill is ₹${Number(rentData.monthly_rent_price) + Number(elecBill_prev_month)}.`,
                });
                setsubmitLoading((prev)=> !prev);
                router.push(`/individual-rent/${rentData.rent_id}`);
            }
            return;
        }
    }
    else if (selectedMonth !== "JAN" && isElecheck == false && isRentPaid == false) {
        const month = MonthByName[monthIndex-1];
        const finalM_Y = month + selectedYear;

        const resp = await axios.post('/api/find-previous-month', {finalM_Y, rent_id: rentData.rent_id});

        // calculating electric bill from meter reading if previous month not found 
        const elecBill = (Number(meterReading) * Number(rentData.ele_unit_price));

        const currentMonthFinalDataForNoHistory = {
            user_id: rentData.user_id,
            rent_id: rentData.rent_id,
            rent_name: rentData.rent_name,
            rent_person_name: rentData.rent_person_name,
            rent_person_adhar: rentData.rent_person_adhar,
            monthly_rent_price: rentData.monthly_rent_price,
            month_year: selectedMonth + selectedYear,
            meter_reading: meterReading,
            electricity_bill: elecBill.toString(),
            payment_mode: "Not Paid",
            note: note,
            date: "",
        }
        if (resp.status == 202) {
            const res = await axios.post('/api/create-new-monthly-rent', currentMonthFinalDataForNoHistory);
            if (res.status == 202) {
              seterr(`You have already store data for ${selectedMonth+selectedYear}`);
                setsubmitLoading((prev)=> !prev);
            }else {
              const response = await axios.post('/api/send-sms', {
                to: `+91${rentData.rent_person_num}`, 
                message: `Hello ${rentData.rent_person_name}!, Your Rent for ${selectedMonth + selectedYear} is ₹${rentData.monthly_rent_price} and Electricity Bill is ₹${elecBill}. Total Bill is ₹${Number(rentData.monthly_rent_price) + Number(elecBill)}.`,
                });
                setsubmitLoading((prev)=> !prev);
                router.push(`/individual-rent/${rentData.rent_id}`);
            }
            return;
        } 

        // calculating electric bill from meter reading if previous month found
        const elecBill_prev_month = (Number(meterReading) - Number(resp.data.data.meter_reading)) * Number(rentData.ele_unit_price);

        const currentMonthFinalDataForHistory = {
            user_id: rentData.user_id,
            rent_id: rentData.rent_id,
            rent_name: rentData.rent_name,
            rent_person_name: rentData.rent_person_name,
            rent_person_adhar: rentData.rent_person_adhar,
            monthly_rent_price: rentData.monthly_rent_price,
            month_year: selectedMonth + selectedYear,
            meter_reading: meterReading,
            electricity_bill: elecBill_prev_month.toString(),
            payment_mode: "Not Paid",
            note: note,
            date: "",
        }

        if (resp.status == 200) {
            const res = await axios.post('/api/create-new-monthly-rent', currentMonthFinalDataForHistory);
            if (res.status == 202) {
              seterr(`You have already store data for ${selectedMonth+selectedYear}`);
                setsubmitLoading((prev)=> !prev);
            }else {
              const response = await axios.post('/api/send-sms', {
                to: `+91${rentData.rent_person_num}`, 
                message: `Hello ${rentData.rent_person_name}!, Your Rent for ${selectedMonth + selectedYear} is ₹${rentData.monthly_rent_price} and Electricity Bill is ₹${elecBill_prev_month}. Total Bill is ₹${Number(rentData.monthly_rent_price) + Number(elecBill_prev_month)}.`,
                });
                setsubmitLoading((prev)=> !prev);
                router.push(`/individual-rent/${rentData.rent_id}`);
            }
            return;
        }
    }
    else if (selectedMonth == "JAN" && isElecheck == false && isRentPaid == true) {
        const month = "DEC";
        const Year = Number(selectedYear) - 1;
        const finalM_Y = month + Year;

        const resp = await axios.post('/api/find-previous-month', {finalM_Y, rent_id: rentData.rent_id});

        // calculating electric bill from meter reading if previous month not found 
        const elecBill = (Number(meterReading) * Number(rentData.ele_unit_price));

        const currentMonthFinalDataForNoHistory = {
            user_id: rentData.user_id,
            rent_id: rentData.rent_id,
            rent_name: rentData.rent_name,
            rent_person_name: rentData.rent_person_name,
            rent_person_adhar: rentData.rent_person_adhar,
            monthly_rent_price: rentData.monthly_rent_price,
            month_year: selectedMonth + selectedYear,
            meter_reading: meterReading,
            electricity_bill: elecBill.toString(),
            payment_mode: paymentMode,
            note: note,
            date: formattedDate 
            
        }
        if (resp.status == 202) {
            const res = await axios.post('/api/create-new-monthly-rent', currentMonthFinalDataForNoHistory);
            if (res.status == 202) {
              seterr(`You have already store data for ${selectedMonth+selectedYear}`);
                setsubmitLoading((prev)=> !prev);
            }else {
              const response = await axios.post('/api/send-sms', {
                to: `+91${rentData.rent_person_num}`, 
                message: `Hello ${rentData.rent_person_name}!, Your Rent for ${selectedMonth + selectedYear} is ₹${rentData.monthly_rent_price} and Electricity Bill is ₹${elecBill}. Total Bill is ₹${Number(rentData.monthly_rent_price) + Number(elecBill)}.`,
                });
                setsubmitLoading((prev)=> !prev);
                router.push(`/individual-rent/${rentData.rent_id}`);
            }
            return;
        }

        
        // calculating electric bill from meter reading if previous month found
        const elecBill_prev_month = (Number(meterReading) - Number(resp.data.data.meter_reading)) * Number(rentData.ele_unit_price);
        
        const currentMonthFinalDataForHistory = {
            user_id: rentData.user_id,
            rent_id: rentData.rent_id,
            rent_name: rentData.rent_name,
            rent_person_name: rentData.rent_person_name,
            rent_person_adhar: rentData.rent_person_adhar,
            monthly_rent_price: rentData.monthly_rent_price,
            month_year: selectedMonth + selectedYear,
            meter_reading: meterReading,
            electricity_bill: elecBill_prev_month.toString(),
            payment_mode: paymentMode,
            note: note,
            date: formattedDate 

        }

        if (resp.status == 200) {
            const res = await axios.post('/api/create-new-monthly-rent', currentMonthFinalDataForHistory);
            if (res.status == 202) {
              seterr(`You have already store data for ${selectedMonth+selectedYear}`);
                setsubmitLoading((prev)=> !prev);
            }else {
              const response = await axios.post('/api/send-sms', {
                to: `+91${rentData.rent_person_num}`, 
                message: `Hello ${rentData.rent_person_name}!, Your Rent for ${selectedMonth + selectedYear} is ₹${rentData.monthly_rent_price} and Electricity Bill is ₹${elecBill_prev_month}. Total Bill is ₹${Number(rentData.monthly_rent_price) + Number(elecBill_prev_month)}.`,
                });
                setsubmitLoading((prev)=> !prev);
                router.push(`/individual-rent/${rentData.rent_id}`);
            }
            return;
        }
    }
    else if (selectedMonth !== "JAN" && isElecheck == false && isRentPaid == true) {
        const month = MonthByName[monthIndex-1];
        const finalM_Y = month + selectedYear;

        const resp = await axios.post('/api/find-previous-month', {finalM_Y, rent_id: rentData.rent_id});

        // calculating electric bill from meter reading if previous month not found 
        const elecBill = (Number(meterReading) * Number(rentData.ele_unit_price));

        const currentMonthFinalDataForNoHistory = {
            user_id: rentData.user_id,
            rent_id: rentData.rent_id,
            rent_name: rentData.rent_name,
            rent_person_name: rentData.rent_person_name,
            rent_person_adhar: rentData.rent_person_adhar,
            monthly_rent_price: rentData.monthly_rent_price,
            month_year: selectedMonth + selectedYear,
            meter_reading: meterReading,
            electricity_bill: elecBill.toString(),
            payment_mode: paymentMode,
            note: note,
            date: formattedDate 

        }

        if (resp.status == 202) {
            const res = await axios.post('/api/create-new-monthly-rent', currentMonthFinalDataForNoHistory);
            if (res.status == 202) {
              seterr(`You have already store data for ${selectedMonth+selectedYear}`);
                setsubmitLoading((prev)=> !prev);
            }else {
              const response = await axios.post('/api/send-sms', {to: `+91${rentData.rent_person_num}`, 
                message: `Hello ${rentData.rent_person_name}!, Your Rent for ${selectedMonth + selectedYear} is ₹${rentData.monthly_rent_price} and Electricity Bill is ₹${elecBill}. Total Bill is ₹${Number(rentData.monthly_rent_price) + Number(elecBill)}.`,
                });
                setsubmitLoading((prev)=> !prev);
                router.push(`/individual-rent/${rentData.rent_id}`);
            }
            return;
        }

        // calculating electric bill from meter reading if previous month found
        const elecBill_prev_month = (Number(meterReading) - Number(resp.data.data.meter_reading)) * Number(rentData.ele_unit_price);

        const currentMonthFinalDataForHistory = {
            user_id: rentData.user_id,
            rent_id: rentData.rent_id,
            rent_name: rentData.rent_name,
            rent_person_name: rentData.rent_person_name,
            rent_person_adhar: rentData.rent_person_adhar,
            monthly_rent_price: rentData.monthly_rent_price,
            month_year: selectedMonth + selectedYear,
            meter_reading: meterReading,
            electricity_bill: elecBill_prev_month.toString(),
            payment_mode: paymentMode,
            note: note,
            date: formattedDate 
            
        }

        if (resp.status == 200) {
            const res = await axios.post('/api/create-new-monthly-rent', currentMonthFinalDataForHistory);
            if (res.status == 202) {
              seterr(`You have already store data for ${selectedMonth+selectedYear}`);
                setsubmitLoading((prev)=> !prev);
                

            }else {
              const response = await axios.post('/api/send-sms', {to: `+91${rentData.rent_person_num}`, 
                message: `Hello ${rentData.rent_person_name}!, Your Rent for ${selectedMonth + selectedYear} is ₹${rentData.monthly_rent_price} and Electricity Bill is ₹${elecBill_prev_month}. Total Bill is ₹${Number(rentData.monthly_rent_price) + Number(elecBill_prev_month)}.`,
                });
                setsubmitLoading((prev)=> !prev);
                router.push(`/individual-rent/${rentData.rent_id}`);
            }
            return;
        }
    }
    setsubmitLoading((prev)=> !prev);
    
  }

  

  useEffect(() => {
    getingParamCheck();
    getUserDetailsinFrontend();
  }, []);

  useEffect(()=> {
    setTimeout(() => {
        seterr("");
    }, 3000);
  },[err])

  

  return (
    <>
      <div
        style={{ background: style.background }}
        className="w-screen h-screen flex flex-col gap-y-4 min-w-80 max-w-screen-2xl m-auto "
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
          <div className="w-full h-full flex flex-col p-2">
            <p className="text-red-500 text-center">{err}</p>
            {rentData.rent_id ? (
              <>
                <div className="w-full h-fit flex flex-col gap-y-5
                backdrop-blur-sm bg-white bg-opacity-30  rounded-md
                shadow-xl  ">
                  <h1 className="text-center text-xl underline">
                    Creating New Month Rent For {rentData.rent_name}
                  </h1>

                  <div
                    className="w-full h-fit
                    p-2 flex flex-col gap-y-2"
                  >
                    <div
                      className="w-full h-fit p-1 flex items-center gap-x-2"
                    >
                      <p>Select Month :</p>
                      <select
                        name="month"
                        id="month"
                        className="outline-none w-fit"
                        onChange={MonthHandleChange}
                      >
                        {MonthByName.map((month, index) => (
                          <option key={index} value={index}>
                            {month}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div
                      className="w-full h-fit p-1 flex items-center gap-x-2"
                    >
                      <h3>Select a Year :</h3>
                      <select
                        name="year"
                        id="year"
                        className="outline-none"
                        onChange={YearHandleChange}
                      >
                        <option value="">Select a year</option>
                        {years.map((year, index) => (
                          <option key={index} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div
                    className="w-full p-1 flex items-center gap-x-2 "
                    >
                        <input 
                        type="checkbox" 
                        className="w-5 h-5 "
                        onChange={(e) => {
                          if (e.target.checked) {
                            setisElechecked(true);
                          } else {
                            setisElechecked(false);
                          }
                        }}
                        />
                        <p>Default Electric Price</p>

                    </div>
                    {
                        isElecheck ? (<></>):(
                        <>
                            <div
                            className="w-full h-fit p-1 flex gap-x-2 items-center 
                            border border-gray-400 "
                            >
                                <p>Meter Reading : </p>
                                <input
                                type="number"
                                className="outline-none pl-2"
                                onChange={(e) => setmeterReading(e.target.value)}
                                value={meterReading}
                                />
                            </div>
                        </>)
                    }

                    <div
                    className="w-full p-1 flex items-center gap-x-2 "
                    >
                        <input 
                        type="checkbox" 
                        className="w-5 h-5 "
                        onChange={(e) => {
                          if (e.target.checked) {
                            setisRentPaid(true);
                          } else {
                            setisRentPaid(false);
                          }
                        }}
                        />
                        <p>Rent Paid</p>

                    </div>

                    {
                        isRentPaid ? (
                            <>
                                <div
                                className="w-full h-fit p-1 flex flex-col gap-y-2 gap-x-2 border border-gray-500"
                                >
                                    <div
                                    className="flex gap-y-2"
                                    >
                                        <p>Payment Mode :</p>

                                        <select 
                                        className="outline-none"
                                        onChange={(e)=> setpaymentMode(e.target.value)}
                                        >
                                            <option >Select Payment Mode</option>
                                            {
                                                paymentMethod.map((mode, index) => (
                                                    <option 
                                                    className="cursor-pointer"
                                                    key={index} value={mode}>
                                                        {mode}
                                                    </option>
                                                ))
                                            }
                                        </select>
                                    </div>

                                    <div className="flex gap-x-2">
                                        <p>Note :</p>
                                        <textarea
                                        className="outline-none w-60 h-14 pl-2"
                                        onChange={(e) => setnote(e.target.value)}
                                        placeholder="Any thing to note about this rent"
                                        />
                                    </div>
                                </div>
                            </>
                        ):(<></>)
                    }

                    <button
                    className="backdrop-blur-md rounded-md bg-white bg-opacity-40 p-2"
                    onClick={handleCreateNewMonthRent}
                    >
                        {
                            submitLoading ? "Creating..." : "Create"
                        }
                    </button>

                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="w-full h-full flex justify-center items-center">
                  <Image
                    src={"/ZKZg.gif"}
                    width={25}
                    height={25}
                    alt="loading..."
                    priority
                  ></Image>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
