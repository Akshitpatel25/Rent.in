"use client";
import Navbar from "@/components/Navbar";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function IndividualRent({ params }: any) {
  const router = useRouter();
  const [userData, setuserData] = useState({
    name: "",
    email: "",
  });
  const [rentData, setrentData] = useState({
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
  const [isRentNameEdit, setisRentNameEdit] = useState(false);
  const [isRentPerNameEdit, setisRentPerNameEdit] = useState(false);
  const [isRentPerNumEdit, setisRentPerNumEdit] = useState(false);
  const [isRentPerAdhEdit, setisRentPerAdhEdit] = useState(false);
  const [ismonthly, setismonthly] = useState(false);
  const [ismonthlyEle, setismonthlyEle] = useState(false);
  const [isElecUnit, setisElecUnit] = useState(false);
  const [allMonthData, setallMonthData] = useState([]);
  const [isRentPaidBtn, setisRentPaidBtn] = useState(false);
  const paymentMode = ["Not Paid", "cash", "cheque", "upi", "net banking"];
  const [addPaymentMode, setaddPaymentMode] = useState(paymentMode[0]);
  const date = new Date();
  const day = date.getDate();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  const formattedDate = `${day}/${month}/${year}`;
  const [updateNote, setupdateNote] = useState(false);
  const [monthlyRentNoteId, setmonthlyRentNoteId] = useState("");
  const [noteValue, setnoteValue] = useState("");
  const [delMonth, setdelMonth] = useState(false);
  const [delMsgName, setdelMsgName] = useState("");
  const [delMsgId, setdelMsgId] = useState("");

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

  const universalSaveClick = async () => {
    try {
      await axios.post("/api/edit-rent-details", { rentData });
    } catch (error: any) {
    }
  };

  const gettingAllMonthData = async () => {
    try {
      const { id } = await params;
      const res = await axios.post("/api/getting-monthly-rent", { id });
      setallMonthData(res.data.data);
      if (res.status == 202) {
        seterr("no data found, Create new one");
      }
    } catch (error: any) {
      console.log("error: ", error);
    }
  };

  const updatepaymentMode = async (id: string) => {
    if (addPaymentMode == paymentMode[0] || id.length < 0) {
      return;
    }

    try {
      await axios.post("/api/update-monthly-rent", {
        id,
        addPaymentMode,
        formattedDate,
      });
    } catch (error: any) {
      console.log("error in individual-rent[id]: ", error);
    }
    gettingAllMonthData();
  };

  const updateNoteHandle = async (id: string) => {
    if (noteValue == "" || id.length < 0) {
      return;
    }
    try {
      await axios.post("/api/update-monthly-rent", { id, noteValue });
    } catch (error: any) {
      console.log(
        "error in individual-rent[id] in updateNoteHandle func: ",
        error
      );
    }
    gettingAllMonthData();
  };

  const deleteMonthMsg = (id: string, month: string) => {
    setdelMonth((prev) => !prev);
    setdelMsgName(month);
    setdelMsgId(id);
  };

  const deleteMonthData = async (id: string) => {
    if (id.length < 0) {
      return;
    }
    try {
      const res = await axios.post("/api/update-monthly-rent", {
        id,
        delete: true,
      });
      if (res.status == 200) {
        gettingAllMonthData();
      }
    } catch (error: any) {
      console.log(
        "error in individual-rent[id] in deleteMonthData func: ",
        error
      );
    } finally {
      setdelMonth((prev) => !prev);
    }
  };

  useEffect(() => {
    getingParamCheck();
    getUserDetailsinFrontend();
    gettingAllMonthData();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      seterr("");
    }, 2000);
  }, [err]);


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
          className=" w-full h-5/6 -mt-14
          overflow-y-scroll md:scrollbar-thin   
          overflow-x-hidden "
        >
          <p className="text-red-500 text-center">{err}</p>
          <div
            className="relative w-full h-full 
            flex flex-col "
          >
            <div className="w-full h-1/3 flex flex-col gap-y-1 shadow-md  p-2 overflow-y-auto">
              {rentData.rent_id ? (
                <>
                  <div className="w-full flex justify-between items-center">
                    <div className="w-11/12 flex justify-between">
                      <label>Rent Name :</label>
                      <input
                        type="text"
                        value={rentData.rent_name}
                        onChange={(e) =>
                          setrentData({
                            ...rentData,
                            rent_name: e.target.value,
                          })
                        }
                        disabled={!isRentNameEdit}
                        className="outline-none pl-1 w-1/2"
                      />
                    </div>
                    <button
                      className="w-1/12 flex justify-center items-center"
                      onClick={() => setisRentNameEdit((prev) => !prev)}
                    >
                      {isRentNameEdit ? (
                        <>
                          <Image
                            src={"/Save.png"}
                            width={20}
                            height={20}
                            alt="save"
                            onClick={universalSaveClick}
                          ></Image>
                        </>
                      ) : (
                        <>
                          <Image
                            src={"/edit.png"}
                            width={20}
                            height={20}
                            alt="Edit"
                          ></Image>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="w-full flex justify-between items-center">
                    <div className="w-11/12 flex justify-between">
                      <label>Person Name :</label>
                      <input
                        type="text"
                        value={rentData.rent_person_name}
                        onChange={(e) =>
                          setrentData({
                            ...rentData,
                            rent_person_name: e.target.value,
                          })
                        }
                        disabled={!isRentPerNameEdit}
                        className="outline-none pl-1 w-1/2"
                      />
                    </div>
                    <button
                      className="w-1/12 flex justify-center items-center"
                      onClick={() => setisRentPerNameEdit((prev) => !prev)}
                    >
                      {isRentPerNameEdit ? (
                        <>
                          <Image
                            src={"/Save.png"}
                            width={20}
                            height={20}
                            alt="save"
                            onClick={universalSaveClick}
                          ></Image>
                        </>
                      ) : (
                        <>
                          <Image
                            src={"/edit.png"}
                            width={20}
                            height={20}
                            alt="Edit"
                          ></Image>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="w-full flex justify-between items-center">
                    <div className="w-11/12 flex justify-between">
                      <label>Person Phone :</label>
                      <input
                        type="text"
                        value={rentData.rent_person_num}
                        onChange={(e) =>
                          setrentData({
                            ...rentData,
                            rent_person_num: e.target.value,
                          })
                        }
                        disabled={!isRentPerNumEdit}
                        className="outline-none pl-1 w-1/2"
                      />
                    </div>
                    <button
                      className="w-1/12 flex justify-center items-center"
                      onClick={() => setisRentPerNumEdit((prev) => !prev)}
                    >
                      {isRentPerNumEdit ? (
                        <>
                          <Image
                            src={"/Save.png"}
                            width={20}
                            height={20}
                            alt="save"
                            onClick={universalSaveClick}
                          ></Image>
                        </>
                      ) : (
                        <>
                          <Image
                            src={"/edit.png"}
                            width={20}
                            height={20}
                            alt="Edit"
                          ></Image>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="w-full flex justify-between items-center">
                    <div className="w-11/12 flex justify-between">
                      <label>Person Adhar :</label>
                      <input
                        type="text"
                        value={rentData.rent_person_adhar}
                        onChange={(e) =>
                          setrentData({
                            ...rentData,
                            rent_person_adhar: e.target.value,
                          })
                        }
                        disabled={!isRentPerAdhEdit}
                        className="outline-none pl-1 w-1/2"
                      />
                    </div>
                    <button
                      className="w-1/12 flex justify-center items-center"
                      onClick={() => setisRentPerAdhEdit((prev) => !prev)}
                    >
                      {isRentPerAdhEdit ? (
                        <>
                          <Image
                            src={"/Save.png"}
                            width={20}
                            height={20}
                            alt="save"
                            onClick={universalSaveClick}
                          ></Image>
                        </>
                      ) : (
                        <>
                          <Image
                            src={"/edit.png"}
                            width={20}
                            height={20}
                            alt="Edit"
                          ></Image>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="w-full flex justify-between items-center">
                    <div className="w-11/12 flex justify-between">
                      <label>Monthly Rent:</label>
                      <input
                        type="text"
                        value={rentData.monthly_rent_price}
                        onChange={(e) =>
                          setrentData({
                            ...rentData,
                            monthly_rent_price: e.target.value,
                          })
                        }
                        disabled={!ismonthly}
                        className="outline-none pl-1 w-1/2"
                      />
                    </div>
                    <button
                      className="w-1/12 flex justify-center items-center"
                      onClick={() => setismonthly((prev) => !prev)}
                    >
                      {ismonthly ? (
                        <>
                          <Image
                            src={"/Save.png"}
                            width={20}
                            height={20}
                            alt="save"
                            onClick={universalSaveClick}
                          ></Image>
                        </>
                      ) : (
                        <>
                          <Image
                            src={"/edit.png"}
                            width={20}
                            height={20}
                            alt="Edit"
                          ></Image>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="w-full flex justify-between items-center">
                    <div className="w-11/12 flex justify-between">
                      <label>Elec Bill /mo:</label>
                      <input
                        type="text"
                        value={rentData.monthly_ele_bill_price}
                        onChange={(e) =>
                          setrentData({
                            ...rentData,
                            monthly_ele_bill_price: e.target.value,
                          })
                        }
                        disabled={!ismonthlyEle}
                        className="outline-none pl-1 w-1/2"
                      />
                    </div>
                    <button
                      className="w-1/12 flex justify-center items-center"
                      onClick={() => setismonthlyEle((prev) => !prev)}
                    >
                      {ismonthlyEle ? (
                        <>
                          <Image
                            src={"/Save.png"}
                            width={20}
                            height={20}
                            alt="save"
                            onClick={universalSaveClick}
                          ></Image>
                        </>
                      ) : (
                        <>
                          <Image
                            src={"/edit.png"}
                            width={20}
                            height={20}
                            alt="Edit"
                          ></Image>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="w-full flex justify-between items-center">
                    <div className="w-11/12 flex justify-between">
                      <label>Elec Unit price:</label>
                      <input
                        type="text"
                        value={rentData.ele_unit_price}
                        onChange={(e) =>
                          setrentData({
                            ...rentData,
                            ele_unit_price: e.target.value,
                          })
                        }
                        disabled={!isElecUnit}
                        className="outline-none pl-1 w-1/2"
                      />
                    </div>
                    <button
                      className="w-1/12 flex justify-center items-center"
                      onClick={() => setisElecUnit((prev) => !prev)}
                    >
                      {isElecUnit ? (
                        <>
                          <Image
                            src={"/Save.png"}
                            width={20}
                            height={20}
                            alt="save"
                            onClick={universalSaveClick}
                          ></Image>
                        </>
                      ) : (
                        <>
                          <Image
                            src={"/edit.png"}
                            width={20}
                            height={20}
                            alt="Edit"
                          ></Image>
                        </>
                      )}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-full h-full flex justify-center items-center">
                    <Image
                      src={"/ZKZg.gif"}
                      width={20}
                      height={20}
                      alt="loading..."
                    ></Image>
                  </div>
                </>
              )}
            </div>
            <div
              className="relative w-full h-2/3 p-2 
             overflow-y-scroll md:scrollbar-thin "
            >
              <div
              className="w-full flex justify-end"
              >

                <div
                title="Add new monthly rent"
                className="w-full h-12 md:w-16 md:h-16 rounded-full 
                  bg-white flex cursor-pointer mb-2
                  justify-center items-center text-4xl md:text-5xl"
                onClick={() =>
                  router.push(`/add-monthly-rents/${rentData.rent_id}`)
                }
                >
                +
                </div>

              </div>
              


              {rentData.rent_id ? (
                <>
                  <div className="w-full h-full flex flex-col gap-y-2">
                    {allMonthData && allMonthData.length > 0 ? (
                      <>
                        {
                          // use for reversing array formate
                          allMonthData
                            .slice()
                            .reverse()
                            .map((month: any) => (
                              <div
                                className="w-full h-fit flex flex-col gap-y-1
                                  p-2 backdrop-blur-md bg-black bg-opacity-15 rounded-md
                                  "
                                key={month._id}
                              >
                                <div className="flex">
                                  <h1 className="w-11/12 font-semibold text-lg">
                                    {month.month_year || "check schema"}
                                  </h1>
                                  <div className="w-1/12 flex items-center lg:justify-end lg:pr-10">
                                    <Image
                                      className="cursor-pointer"
                                      src={"/delete.png"}
                                      width={20}
                                      height={20}
                                      alt="delete"
                                      onClick={() =>
                                        deleteMonthMsg(
                                          month._id,
                                          month.month_year
                                        )
                                      }
                                    ></Image>
                                  </div>
                                </div>
                                <p>Person Name : {month.rent_person_name}</p>
                                <p>
                                  Monthly Rent : ₹{month.monthly_rent_price}
                                </p>
                                <p>
                                  Monthly Elec Bill : ₹{month.electricity_bill}
                                </p>
                                <p>
                                  Previous Month Reading : {month.meter_reading}{" "}
                                  unit
                                </p>

                                {month.payment_mode === "Not Paid" ? (
                                  <>
                                    <div
                                      className="w-full h-fit
                                        flex items-center "
                                    >
                                      <div
                                        className="w-11/12
                                          flex items-center "
                                      >
                                        <p>Rent Paid :</p>
                                        <select
                                          style={{
                                            background: `${
                                              isRentPaidBtn
                                                ? "white"
                                                : "transparent"
                                            }`,
                                            appearance: `${
                                              isRentPaidBtn ? "auto" : "none"
                                            }`,
                                          }}
                                          className="outline-none pl-1 w-1/2"
                                          onChange={(e) =>
                                            setaddPaymentMode(e.target.value)
                                          }
                                        >
                                          {paymentMode.map((item, index) => (
                                            <option key={index} value={item}>
                                              {item}
                                            </option>
                                          ))}
                                        </select>
                                      </div>

                                      <button
                                        className="w-1/12  flex justify-center"
                                        onClick={() =>
                                          setisRentPaidBtn((prev) => !prev)
                                        }
                                      >
                                        {isRentPaidBtn ? (
                                          <>
                                            <Image
                                              src={"/Save.png"}
                                              width={20}
                                              height={20}
                                              alt="save"
                                              onClick={() =>
                                                updatepaymentMode(month._id)
                                              }
                                            ></Image>
                                          </>
                                        ) : (
                                          <>
                                            <Image
                                              src={"/edit.png"}
                                              width={20}
                                              height={20}
                                              alt="Edit"
                                            ></Image>
                                          </>
                                        )}
                                      </button>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <p>
                                      Rent Paid Method : {month.payment_mode}
                                    </p>
                                  </>
                                )}

                                {month.payment_mode !== "Not Paid" ? (
                                  <>
                                    <p>
                                      Rent Paid Date : {month.Rent_Paid_date}
                                    </p>
                                  </>
                                ) : (
                                  <></>
                                )}

                                {month.note ? (
                                  <>
                                    <div className="w-full flex">
                                      <div className="w-11/12 flex gap-x-2">
                                        <p>Note : </p>

                                        {updateNote &&
                                        monthlyRentNoteId === month._id ? (
                                          <textarea
                                            value={noteValue}
                                            onChange={(e) =>
                                              setnoteValue(e.target.value)
                                            }
                                          ></textarea>
                                        ) : (
                                          <>
                                            <p>{month.note}</p>
                                          </>
                                        )}
                                      </div>

                                      <button
                                        className="w-1/12 flex justify-center items-center"
                                        onClick={() => {
                                          setupdateNote((prev) => !prev),
                                            setmonthlyRentNoteId(month._id);
                                        }}
                                      >
                                        {updateNote &&
                                        monthlyRentNoteId === month._id ? (
                                          <>
                                            <Image
                                              src={"/Save.png"}
                                              width={20}
                                              height={20}
                                              alt="save"
                                              onClick={() =>
                                                updateNoteHandle(month._id)
                                              }
                                            ></Image>
                                          </>
                                        ) : (
                                          <>
                                            <Image
                                              src={"/edit.png"}
                                              width={20}
                                              height={20}
                                              alt="Edit"
                                            ></Image>
                                          </>
                                        )}
                                      </button>
                                    </div>
                                  </>
                                ) : (
                                  <></>
                                )}
                              </div>
                            ))
                        }
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="w-full h-full flex justify-center items-center">
                    <Image
                      src={"/ZKZg.gif"}
                      width={20}
                      height={20}
                      alt="loading..."
                    ></Image>
                  </div>
                </>
              )}
            </div>

            {/* absolute box for deleting month rent history */}
            {delMonth ? (
              <>
                <div
                  className="absolute inset-0 m-auto h-32 w-fit flex flex-col 
                   p-4 shadow-sm shadow-black backdrop-blur-md rounded-md bg-white bg-opacity-30"
                >
                  <h1 className="text-xl">
                    Want to Delete?{" "}
                    <span className="font-semibold">{delMsgName}</span>
                  </h1>
                  <div
                    className=" p-2 h-full w-full flex
                    justify-center items-center"
                  >
                    <div className="w-full flex gap-x-3 ">
                      <button
                        className="w-1/2 text-lg rounded-md cursor-pointer
                        bg-blue-600 backdrop-blur-sm bg-opacity-40"
                        onClick={() => setdelMonth((prev) => !prev)}
                      >
                        Cancel
                      </button>
                      <button
                        className="w-1/2 text-lg rounded-md cursor-pointer
                        bg-red-600 backdrop-blur-sm bg-opacity-40"
                        onClick={() => deleteMonthData(delMsgId)}
                      >
                        Yes
                      </button>
                    </div>
                  </div>
                </div>
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
