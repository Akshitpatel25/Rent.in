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
  };
  type resDataType = {
    user_id: string;
    ele_unit_price: string;
    monthly_ele_bill_price: string;
    monthly_rent_price: string;
    rent_name: string;
    rent_person_adhar: string;
    rent_person_name: string;
    rent_person_num: string;
    _id: string;
  };

  type objData = {
    _id: string;
    rent_name: string;
    rent_person_name: string;
    monthly_rent_price: string;
    Rent_Paid_date: string;
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
  const YEARS = [year, year - 1];
  const MONTHS = [
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
  const [monthName, setmonthName] = useState(`${MONTHS[0]}`);
  const [yearName, setyearName] = useState(`${YEARS[0]}`);
  const [resData, setresData] = useState<resDataType[]>([]);
  const [allMonthData, setallMonthData] = useState<PropertyData[]>([]);
  const [allPropertiesByMonth, setallPropertiesByMonth] = useState([]);
  const [allPropertiesByMonthNotPaid, setallPropertiesByMonthNotPaid] =
    useState([]);
  const [allPropertiesElectricBill, setallPropertiesElectricBill] = useState(
    []
  );
  const [allPropertiesNotPaidByMonth, setAllPropertiesNotPaidByMonth] =
    useState<any[]>([]);
  const [totalRent, setTotalRent] = useState(0);

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

  useEffect(() => {
    getUserDetailsinFrontend();
  }, []);

  const [obj, setObj] = useState<objData[]>([]);
  const [total_rent, settotal_rent] = useState(0);
  const [total_eBill, settotal_eBill] = useState(0);
  const handleMonthlyRentDetails = async () => {
    const source = axios.CancelToken.source();
    let didCancel = false;
    try {
      const res = await axios.post("/api/getting-properties-by-monthly-paid", {
        user_id: userData.user_id,
        M_Y: monthName + yearName,
      }, { cancelToken: source.token });
      if (!didCancel) {
        setObj(res.data.data[0].monthly_rents);
        settotal_rent(res.data.data[0].total_rent);
        settotal_eBill(res.data.data[0].total_eBill);
      }
    } catch (error: any) {
      if (axios.isCancel(error)) {
        // Optionally handle cancellation
      } else {
        console.log("error in handling monthly rent details in rents-summary");
      }
    }
    return () => {
      didCancel = true;
      source.cancel();
    };
  };

  const [obj1, setObj1] = useState<objData[]>([]);
  const [total_rent1, settotal_rent1] = useState(0);
  const [total_eBill1, settotal_eBill1] = useState(0);
  const handleMonthlyRentDetails1 = async () => {
    const source = axios.CancelToken.source();
    let didCancel = false;
    try {
      const res = await axios.post(
        "/api/getting-properties-by-monthly-notpaid",
        {
          user_id: userData.user_id,
          M_Y: monthName + yearName,
        },
        { cancelToken: source.token }
      );
      if (!didCancel) {
        setObj1(res.data.data[0].monthly_rents);
        settotal_rent1(res.data.data[0].total_rent);
        settotal_eBill1(res.data.data[0].total_eBill);
      }
    } catch (error: any) {
      if (axios.isCancel(error)) {
        // Optionally handle cancellation
      } else {
        console.log("error in handling monthly rent details in rents-summary");
      }
    }
    return () => {
      didCancel = true;
      source.cancel();
    };
  };

  useEffect(() => {
    if (userData.user_id != "") {
      handleMonthlyRentDetails();
      handleMonthlyRentDetails1();
    }
  }, [userData.user_id, monthName, yearName]);

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

        <div className="w-full h-5/6 -mt-14">
          <div className="w-full h-1/6 flex flex-col gap-y-3 justify-center items-center">
            <h1 className="italic font-bold text-center">
              Select the month and year for Rental Summary
            </h1>
            <div className="w-fit h-fit flex gap-x-2">
              <select
                className="p-2 rounded-md border-none outline-none"
                onChange={(e) => setmonthName(e.target.value)}
              >
                {MONTHS.map((month, index) => (
                  <option key={index}>{month}</option>
                ))}
              </select>

              <select
                className="p-2 rounded-md border-none outline-none"
                onChange={(e) => {
                  setyearName(e.target.value);
                }}
              >
                {YEARS.map((year, index) => (
                  <option key={index}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          <div
            className=" w-full h-5/6 overflow-y-scroll md:scrollbar-thin   
          overflow-x-hidden flex flex-col gap-y-3 p-1"
          >
            <h1 className=" text-center font-bold underline">
              Rent Paid Details
            </h1>
            <div className="flex flex-col gap-y-2">
              {obj.length > 0 ? (
                obj.map((data) => (
                  <div
                    className="w-full h-fit flex justify-between shadow-md bg-white p-2 rounded-md"
                    key={data._id}
                  >
                    <div className="w-1/2 ">
                      <div className="font-bold">{data.rent_name} →</div>
                      <div>
                        {data.rent_person_name.split(" ").slice(0, 2).join(" ")}
                      </div>
                    </div>

                    <div className="w-1/2 text-right">
                      <div>{data.Rent_Paid_date}</div>
                      <div>₹{data.monthly_rent_price}</div>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <h1 className="text-2xl pl-2 text-center">NO DATA</h1>
                </>
              )}
            </div>

            {obj.length == 0 ? (
              <></>
            ) : (
              <>
                <div className="pb-4 text-xl pl-2 ">Total : ₹ {total_rent}</div>
                <div className="pb-4 text-xl pl-2 ">
                  Total Electric Bill : ₹ {total_eBill}
                </div>
              </>
            )}

            {obj1.length != 0 ? (
              <>
                <h1 className=" text-center font-bold underline">
                  Rent Not Paid Details
                </h1>
                <p className="text-center">
                  NOTE: Future Date Rents will not be considered
                </p>
                {/* here below all properties who's we take electric meter reading */}
                {obj1.map((data: any, index) => (
                  <div
                    className="w-full h-fit flex justify-between shadow-md bg-white p-2 rounded-md"
                    key={data._id}
                  >
                    <div className="w-1/2 ">
                      <div className="font-bold">{data.rent_name} →</div>
                      <div>
                        {data.rent_person_name.split(" ").slice(0, 2).join(" ")}
                      </div>
                    </div>
                    <div className="w-1/2 text-right">
                      <div>₹{data.monthly_rent_price}</div>
                    </div>
                  </div>
                ))}

                {obj1.length == 0 ? (
                  <></>
                ) : (
                  <>
                    <div className="pb-4 text-xl pl-2 ">
                      Total remaining amount : ₹ {total_rent1}
                    </div>
                    <div className="pb-4 text-xl pl-2 ">
                      Total remaining eBill : ₹ {total_eBill1}
                    </div>
                  </>
                )}
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
