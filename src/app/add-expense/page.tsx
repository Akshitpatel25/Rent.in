"use client";
import Navbar from "@/components/Navbar";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function AddExpense() {
const router = useRouter();
  const [userData, setuserData] = useState({
    userId: "",
    name: "",
    email: "",
  });
  const date = new Date();
  const month = date.getMonth();
  const year = date.getFullYear();
  const monthByName = [
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
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [err, seterr] = useState("");
  const [loading, setloading] = useState(false);
  const [allExpense, setAllExpense] = useState([]);
  const [isdelmsg, setisdelmsg] = useState(false);
  const [yesloading, setyesloading] = useState(false);
  const [delExpenseData, setdelExpenseData] = useState({
    id: "",
    name: "",
  });
  const style = {
    background:
      "linear-gradient(0deg, rgba(188,108,37,1) 0%, rgba(221,161,94,1) 49%, rgba(254,250,224,1) 100%)",
  };

  const getUserDetailsinFrontend = async () => {
    // getting user details from Rtoken from cookies
    try {
      const res = await axios.get("/api/me");
      setuserData({
        userId: res?.data?.user?._id!,
        name: res?.data?.user?.name!,
        email: res?.data?.user?.email!,
      });
    } catch (error) {
      router.push("/login");
    }
  };

  const handleAddExpense = async () => {
setloading((prev) => !prev);

    if (!userData.userId || !expenseName || !expenseAmount) {
      seterr("Please fill all the fields");
      setloading((prev) => !prev);
      return;
    }
    const expenseM_Y = monthByName[month] + year;
    try {
      const res = await axios.post("/api/add-expense", {
        userID: userData.userId,
        expenseName: expenseName,
        expenseAmount: expenseAmount,
        expenseM_Y: expenseM_Y,
        expense_Day: date.getDate(),
      });
      if (res.status === 200) {
        seterr("Expense added");
        getAllExpenses();
      }
    } catch (error: any) {
      seterr(error.response.data.error);
    }
    setloading((prev) => !prev);
    setExpenseName("");
    setExpenseAmount("");
  };

  const getAllExpenses = async () => {
const res = await axios.post("/api/add-expense", {
      userID: userData.userId,
      getAllExpense: true,
    });
    setAllExpense(res.data.data);
  };

  const handleDeleteExpenseMsg = async (id: string, expenseName: string) => {
setisdelmsg((prev) => !prev);
    setdelExpenseData({
      id: id,
      name: expenseName,
    });
    
  };

  const handleDeleteExpense = async() => {
setyesloading((prev) => !prev);
    try {
      await axios.post('/api/add-expense', {id: delExpenseData.id, deleteExpense: true});
      getAllExpenses();
    } catch (error:any) {
      seterr(error.response.data.error);
    }
    setyesloading((prev) => !prev);
    setisdelmsg((prev) => !prev);
  }
  
  useEffect(() => {
    getUserDetailsinFrontend();
    getAllExpenses();
  }, [userData.userId]);

  useEffect(() => {
    setTimeout(() => {
      seterr("");
    }, 4000);
  }, [err]);

  return (
    <>
      <div
        style={{ background: style.background }}
        className="w-screen h-screen flex flex-col gap-y-4 min-w-80 max-w-screen-2xl m-auto"
      >
        <div className="w-full h-1/6 ">
          <div className="w-full h-2/3">
            <Navbar userData={userData.name} />
          </div>
        </div>

        <div
          className=" relative w-full h-5/6 -mt-14
          overflow-y-scroll md:scrollbar-thin   
          overflow-x-hidden "
        >
          <p className="text-red-600 text-center">{err}</p>
          {userData.name == "" ? (
            <>
              <div className="w-screen h-screen flex justify-center items-center">
                <Image
                  src={"/ZKZg.gif"}
                  width={50}
                  height={50}
                  alt="loading..."
                  priority
                ></Image>
              </div>
            </>
          ) : (
            <>
              <div
                className="w-full h-1/6
               p-2  flex flex-col gap-y-1"
              >
                <h1 className="w-full text-center font-semibold underline">
                  Add Expense
                </h1>
                <div className="w-full h-fit text-center">
                  Current M/Y:{" "}
                  <span className="font-semibold">
                    {monthByName[month]} {year}
                  </span>
                </div>

                <div className="w-full h-fit flex gap-x-2">
                  <div className="w-10/12 flex gap-x-2">
                    <input
                      type="text"
                      placeholder="Expense Name"
                      value={expenseName}
                      onChange={(e) => setExpenseName(e.target.value)}
                      className="w-2/3 p-1 outline-none"
                    ></input>

                    <input
                      type="number"
                      placeholder="Amount"
                      value={expenseAmount}
                      onChange={(e) => setExpenseAmount(e.target.value)}
                      className="w-1/3 p-1 outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-2/12 cursor-pointer bg-blue-600 rounded-md text-white"
                    onClick={handleAddExpense}
                  >
                    {loading ? "Add..." : "Add"}
                  </button>
                </div>
              </div>

              <div
                className="w-full flex flex-col p-2 gap-y-2 h-5/6
              overflow-y-scroll md:scrollbar-thin"
              >
                {allExpense.length > 0
                  ? allExpense
                      .slice()
                      .reverse()
                      .map((expense: any) => (
                        <div
                          key={expense._id}
                          className="w-full h-fit rounded-md flex flex-col gap-y-1 p-2 bg-white backdrop-blur-sm bg-opacity-25"
                        >
                          <div className="w-full flex justify-between pr-3 ">
                            <p className="font-semibold w-11/12">
                              {expense.expense_Day} - {expense.expense_M_Y}
                            </p>

                            <button className="w-1/12 ">
                              <Image
                                src={"/delete.png"}
                                width={20}
                                height={20}
                                alt="del"
                                className="cursor-pointer outline-none"
                                onClick={() => handleDeleteExpenseMsg(expense._id, expense.expense_name)}
                              ></Image>
                            </button>
                          </div>
                          <p>
                            Expense Name :{" "}
                            <span className="font-semibold">
                              {expense.expense_name}
                            </span>
                          </p>
                          <p>
                            Expense Ammount :{" "}
                            <span className="font-semibold">
                              ₹{expense.expense_amount}
                            </span>
                          </p>
                        </div>
                      ))
                  : "No expense added yet"}
              </div>
            </>
          )}

          {/* {absolute box for deleting expense} */}
          <div
            className="absolute inset-0 m-auto h-32 w-fit bg-white bg-opacity-40
                          rounded-md flex flex-col justify-center items-center p-4
                          backdrop-blur-sm"
            style={{ display: isdelmsg ? "flex" : "none" }}
          >
            <h1>
              Want to Delete?{" "}
              <span className="font-bold">{delExpenseData.name}</span>
            </h1>
            <div className="w-full h-fit flex gap-x-2 ">
              <button
                className="w-1/2  p-1 cursor-pointer backdrop-blur-sm
                              bg-blue-500 bg-opacity-50 rounded-md"
                onClick={() => setisdelmsg((prev) => !prev)}
              >
                Cancel
              </button>
              <button
                className="w-1/2  p-1 cursor-pointer backdrop-blur-sm
                              bg-red-500 bg-opacity-50 rounded-md flex justify-center items-center"
                onClick={handleDeleteExpense}
              >
                Yes
                <div>
                  {yesloading ? (
                    <Image
                      src={"/ZKZg.gif"}
                      width={15}
                      height={15}
                      alt="loading..."
                      priority
                    ></Image>
                  ) : (
                    <></>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
