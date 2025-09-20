import { NextResponse, NextRequest } from "next/server";
import { dbConnect } from "@/db/dbConnect";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const reqbody = await request.json();
    const { user_id, M_Y, M, Y } = reqbody;

    // Validate required fields
    if (!user_id || !M_Y || !M || !Y) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const connection = mongoose.connection;
    if (!connection || !connection.db) {
      return NextResponse.json({ error: "Database connection not ready." }, { status: 500 });
    }

    const db = connection.db;
    let userId;
    try {
      userId = new ObjectId(`${user_id}`);
    } catch (e) {
      return NextResponse.json({ error: "Invalid user_id format." }, { status: 400 });
    }

    const result = await db
      .collection("users")
      .aggregate([
        {
          $match: { _id: userId },
        },
        // ...existing code...
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
                      { $regexMatch: { input: "$Rent_Paid_date", regex: `${M}/${Y}$` } },
                    ],
                  },
                },
              },
              {
                $project: { monthly_rent_price: 1 },
              },
              {
                $group: {
                  _id: null,
                  total: { $sum: { $toDouble: "$monthly_rent_price" } },
                },
              },
            ],
            as: "monthly_rents",
          },
        },
        // ...existing code...
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
                $project: { maintanence_amount: 1 },
              },
              {
                $group: {
                  _id: null,
                  total: { $sum: { $toDouble: "$maintanence_amount" } },
                },
              },
            ],
            as: "monthly_maintanence",
          },
        },
        // ...existing code...
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
                $project: { expense_amount: 1 },
              },
              {
                $group: {
                  _id: null,
                  total: { $sum: { $toDouble: "$expense_amount" } },
                },
              },
            ],
            as: "monthly_expenses",
          },
        },
        // ...existing code...
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

    return NextResponse.json({ data: result || {} });
  } catch (error: any) {
    console.error("Get monthly report error:", error);
    return NextResponse.json({ error: error?.message || "Error in get-monthly-report route." }, { status: 500 });
  }
}
