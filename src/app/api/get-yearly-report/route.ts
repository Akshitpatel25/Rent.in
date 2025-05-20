import { NextResponse, NextRequest } from "next/server";
import { dbConnect } from "@/db/dbConnect";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const reqbody = await request.json();
    const {user_id, years} = reqbody;
    const connection = mongoose.connection;

    if (!connection || !connection.db) {
      return NextResponse.json(
        { error: "Database connection not ready" },
        { status: 500 }
      );
    }

    const db = connection.db;
    const userId = new ObjectId(`${user_id}`);
    const result = await db
      .collection("users")
      .aggregate([
        {
          $match: {
            _id: userId,
          },
        },
        {
          $lookup: {
            from: "monthlyrents",
            let: { id: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$user_id", "$$id"] },
                      { $regexMatch: { input: "$month_year", regex: `${years}$` } },
                      { $ne: ["$payment_mode", "Not Paid"] },
                    ],
                  },
                },
              },
              {
                $group: {
                  _id: null,
                  totalAmount: {
                    $sum: { $toDouble: "$monthly_rent_price" },
                  },
                  total_Elec_bill: {
                    $sum: { $toDouble: "$electricity_bill" },
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                  totalAmount: 1,
                  total_Elec_bill: 1,
                },
              },
            ],
            as: "yearlyRentTotal",
          },
        },
        {
          $lookup: {
            from: "monthlymaintanences",
            let: { id: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $regexMatch: {
                          input: "$maintanence_M_Y",
                          regex: `2025$`,
                        },
                      },
                      {
                        $eq: ["$user_id", `${user_id}`],
                      },
                    ],
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                  maintanence_amount: 1,
                  maintanence_M_Y: 1,
                },
              },
              {
                $group: {
                  _id: null,
                  totalMaintanence: {
                    $sum: { $toDouble: "$maintanence_amount" },
                  },
                },
              },
            ],
            as: "yearly_maintanence_amount",
          },
        },
        {
          $lookup: {
            from: "monthlyexpenses",
            let: { id: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$user_id", `${user_id}`] },
                      {
                        $regexMatch: {
                          input: "$expense_M_Y",
                          regex: `2025$`,
                        },
                      },
                    ],
                  },
                },
              },
              {
                $project: {
                  expense_amount: 1,
                  expense_M_Y: 1,
                },
              },
              {
                $group: {
                  _id: null,
                  total_expense_sum: {
                    $sum: { $toDouble: "$expense_amount" },
                  },
                },
              },
            ],
            as: "yearly_expense_amount",
          },
        },
        {
          $project: {
            password: 0,
            email: 0,
            verifyToken: 0,
            verifyTokenExpiry: 0,
            __v: 0,
            isVerified: 0,
            isGoogleSignedIn: 0,
          },
        },
      ])
      .toArray();
    //   console.log(result);
    return NextResponse.json({ data: result || {} });
  } catch (error:any) {
        return NextResponse.json({error: "error in get-yearly-report route", status: 500})

  }
}

