import { NextResponse, NextRequest } from "next/server";
import { dbConnect } from "@/db/dbConnect";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import { log } from "console";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const reqbody = await request.json();
    const { user_id, M_Y } = reqbody;
    console.log(M_Y);
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
                      { $eq: ["$month_year", `${M_Y}`] },
                      { $ne: ["$payment_mode", "Not Paid"] },
                    ],
                  },
                },
              },
              {
                $project: {
                  _id: 1,
                  rent_name: 1,
                  rent_person_name: 1,
                  monthly_rent_price: 1,
                  Rent_Paid_date: 1,
                  electricity_bill: 1
                },
              },
            ],
            as: "monthly_rents",
          },
        },
        {
          $addFields: {
            total_rent: {
              $sum: {
                $map: {
                  input: "$monthly_rents",
                  as: "rent",
                  in: { $toDouble: "$$rent.monthly_rent_price" },
                },
              },
            },
          },
        },
        {
          $addFields: {
            total_eBill: {
              $round: [
                {
                  $sum: {
                    $map: {
                      input: "$monthly_rents",
                      as: "rent",
                      in: { $toDouble: "$$rent.electricity_bill" },
                    },
                  },
                },
                1,
              ],
            },
          },
        },
        {
          $project: {
            name: 1,
            monthly_rents: 1,
            total_rent: 1,
            total_eBill: 1,
          },
        },
      ])
      .toArray();
      // console.log(result);
      // console.log(result[0].monthly_rents);
      
    return NextResponse.json({ data: result || {} });
  } catch (error: any) {
    return NextResponse.json({
      error: "error in get-monthly-report route",
      status: 500,
    });
  }
}
