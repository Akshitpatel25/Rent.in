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

  const GETAllProperties = () => {
    const res = axios.post("/api/getAPIs/all-properties", {
      email: userData.email,
    });
    res
      .then((res) => {
        setresData(res.data.data);
      })
      .catch((err) => console.log(err));
  };

  const gettingAllPropertiesMonthlyData = async () => {
    try {
      const res = await axios.post("/api/getting-all-properties-monthly-data", {
        user_id: userData.user_id,
      });
      
      setallPropertiesByMonth(res.data.data);
      setallMonthData(
        res.data.data.filter(
          (data: any) =>
            data.Rent_Paid_date != "" && data.month_year == monthName + yearName
        ) || []
      );
      setallPropertiesByMonthNotPaid(
        res.data.data.filter(
          (data: any) =>
            data.Rent_Paid_date === "" && data.month_year == monthName + yearName
        ) || []
      );
    } catch (error: any) {
      setallMonthData([]);
    }
  };

  // tenant who don't give monthly rent data
  const tenantWithoutMonthlyData = async () => {
    setAllPropertiesNotPaidByMonth([]);
    try {
      // console.log("Fetching tenant data...");

      const responses = await Promise.all(
        resData.map(async (data: any) => {
          try {
            const response = await axios.post("/api/getting-monthly-rent", {
              user_id: userData.user_id,
              rent_id: data._id,
              month_year: monthName + yearName,
            });

            // console.log(`Full response :`, response.data);

            if (response.status === 200 && Array.isArray(response.data?.data)) {
              return response.data.data;
            } else {
              // console.warn("Invalid response structure for rent_id:", data._id, response.data);
              return [];
            }
          } catch (error) {
            console.error("API Error for rent_id:", data._id, error);
            return [];
          }
        })
      );

      // Flatten responses and update state
      const validData = responses.flat();

      if (validData.length > 0) {
        setAllPropertiesNotPaidByMonth((prev) => [...prev, ...validData]);
      } else {
        console.log("No valid data received. State remains unchanged.");
      }
    } catch (error: any) {
      console.error("Error in fetching tenant data:", error);
    }
  };

  useEffect(() => {
    getUserDetailsinFrontend();
    GETAllProperties();
  }, [userData.user_id]);

  useEffect(() => {
    gettingAllPropertiesMonthlyData();
    tenantWithoutMonthlyData();
  }, [monthName, yearName, resData]);

  useEffect(() => {
    if (allPropertiesByMonth != undefined) {
      setallPropertiesElectricBill(
        allPropertiesByMonth.filter(
          (data: any) => data.month_year == monthName + yearName
        )
      );
    }
  }, [allPropertiesByMonth]);

  useEffect(() => {
    let totalFromByMonthNotPaid = 0;
    let totalFromNotPaidByMonth = 0;
    if (allPropertiesByMonthNotPaid.length > 0) {
      totalFromByMonthNotPaid = allPropertiesByMonthNotPaid.reduce(
        (acc, curr: any) => acc + parseInt(curr.monthly_rent_price || "0"),
        0
      );
    }
    if (allPropertiesNotPaidByMonth.length > 0) {
      totalFromNotPaidByMonth = allPropertiesNotPaidByMonth.reduce(
        (acc, curr: any) => acc + parseInt(curr.monthly_rent_price || "0"),
        0
      );
    }


    setTotalRent(totalFromByMonthNotPaid + totalFromNotPaidByMonth);
  }, [allPropertiesByMonthNotPaid, allPropertiesNotPaidByMonth]);


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
              {allMonthData.length > 0 ? (
                allMonthData.map((data) => (
                  <div
                    className="w-full h-fit flex justify-between shadow-md bg-white p-2 rounded-md"
                    key={data.rent_id}
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
                  <h1 className="text-2xl pl-2">
                    Wait {monthName + yearName}, OR no data for this month{" "}
                  </h1>
                </>
              )}
            </div>

            {allMonthData.length > 0 ? (
              <div className="pb-4 text-xl pl-2 ">
                Total : ₹
                {allMonthData.reduce(
                  (acc, curr) => acc + parseInt(curr.monthly_rent_price),
                  0
                )}
              </div>
            ) : (
              <></>
            )}
            {allPropertiesElectricBill.length > 0 ? (
              <div className="pb-4 text-xl pl-2 ">
                Total Electric Bill : ₹
                {allPropertiesElectricBill.reduce(
                  (acc, curr: any) => acc + parseInt(curr.electricity_bill),
                  0
                )}
              </div>
            ) : (
              <></>
            )}
            
            
            {allPropertiesByMonthNotPaid.length > 0 ||
            allPropertiesNotPaidByMonth.length > 0 ? (
              <>
                <h1 className=" text-center font-bold underline">
                  Rent Not Paid Details
                </h1>
                <p className="text-center">NOTE: Future Date Rents will not be considered</p>
                {/* here below all properties who's we take electric meter reading */}
                {allPropertiesByMonthNotPaid.map((data: any, index) => (
                  <div
                    className="w-full h-fit flex justify-between shadow-md bg-white p-2 rounded-md"
                    key={index}
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

                {/* here below all properties who's we don't take electric meter reading */}
                {allPropertiesNotPaidByMonth.map((data: any, index) => (
                  <div
                    className="w-full h-fit flex justify-between shadow-md bg-white p-2 rounded-md "
                    key={index}
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

                {allPropertiesByMonthNotPaid.length > 0 || allPropertiesNotPaidByMonth.length > 0 ? (
                  <div className="pb-4 text-xl pl-2">
                    Total Remaining Amount : ₹{totalRent}
                  </div>
                ) : (
                  <></>
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
