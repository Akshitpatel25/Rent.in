import { NextResponse, NextRequest } from "next/server";
import { dbConnect } from "@/db/dbConnect";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const reqbody = await request.json();
    const { user_id, M_Y } = reqbody;
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
                      {$eq: ["$month_year", `${M_Y}`]},
                      {$ne: ["$payment_mode", "Not Paid"]}
                    ],
                  },
                },
              },
              {
                $project: {
                  monthly_rent_price: 1,
                },
              },
              {
                $group: {
                  _id: null,
                  total: {
                    $sum: { $toDouble: "$monthly_rent_price" },
                  },
                },
              },
            ],
            as: "monthly_rents",
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
                      { $eq: ["$user_id", { $toString: "$$id" }] },
                      { $eq: ["$maintanence_M_Y", `${M_Y}`] },
                    ],
                  },
                },
              },
              {
                $project: {
                  maintanence_amount: 1,
                },
              },
              {
                $group: {
                  _id: null,
                  total: {
                    $sum: { $toDouble: "$maintanence_amount" },
                  },
                },
              },
            ],
            as: "monthly_maintanence",
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
                      { $eq: ["$user_id", { $toString: "$$id" }] },
                      { $eq: ["$expense_M_Y", `${M_Y}`] },
                    ],
                  },
                },
              },
              {
                $project: {
                  expense_amount: 1,
                },
              },
              {
                $group: {
                  _id: null,
                  total: {
                    $sum: { $toDouble: "$expense_amount" },
                  },
                },
              },
            ],
            as: "monthly_expenses",
          },
        },
        {
          $project: {
            name: 1,
            monthly_rents: 1,
            monthly_maintanence: 1,
            monthly_expenses: 1,
          },
        },
      ])
      .toArray();
    //   console.log(result);
    return NextResponse.json({ data: result || {} });
  } catch (error: any) {
    return NextResponse.json({
      error: "error in get-previous-monthly-revenue route",
      status: 500,
    });
  }
}
