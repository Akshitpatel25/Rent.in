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
    const userIdStr = String(user_id);

    // Get all properties (rents) belonging to this user (handles single/array, ObjectId/string)
    const allProperties = await db
      .collection("rents")
      .find({
        $or: [
          { user_id: userId },
          { user_id: userIdStr },
          { user_id: { $elemMatch: { $eq: userId } } },
          { user_id: { $elemMatch: { $eq: userIdStr } } },
        ],
      })
      .toArray();

    // Get all monthly rent records for this month that ARE paid
    const paidRecords = await db
      .collection("monthlyrents")
      .find({
        month_year: M_Y,
        payment_mode: { $ne: "Not Paid" },
        $or: [
          { user_id: userId },
          { user_id: userIdStr },
          { user_id: { $elemMatch: { $eq: userId } } },
          { user_id: { $elemMatch: { $eq: userIdStr } } },
        ],
      })
      .toArray();

    // Set of rent_ids that have been paid for this month
    const paidRentIds = new Set(paidRecords.map((r) => String(r.rent_id)));

    // Not-paid = properties whose rent_id is NOT in the paid set
    const notPaidProperties = allProperties
      .filter((prop) => !paidRentIds.has(String(prop._id)))
      .map((prop) => ({
        _id: prop._id,
        rent_name: prop.rent_name,
        rent_person_name: prop.rent_person_name,
        monthly_rent_price: prop.monthly_rent_price,
        electricity_bill: prop.monthly_ele_bill_price || "0",
      }));

    // Calculate totals
    const total_rent = notPaidProperties.reduce(
      (sum, p) => sum + (Number(p.monthly_rent_price) || 0),
      0
    );
    const total_eBill =
      Math.round(
        notPaidProperties.reduce(
          (sum, p) => sum + (Number(p.electricity_bill) || 0),
          0
        ) * 10
      ) / 10;

    // Return in same format as before (array with one object)
    const result = [
      {
        monthly_rents: notPaidProperties,
        total_rent,
        total_eBill,
      },
    ];

    return NextResponse.json({ data: result });
  } catch (error: any) {
    return NextResponse.json({
      error: "error in getting-properties-by-monthly-notpaid route",
      status: 500,
    });
  }
}
