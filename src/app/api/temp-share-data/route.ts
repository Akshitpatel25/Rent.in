import { dbConnect } from "@/db/dbConnect";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";

// TEMPORARY ROUTE - Use to share data between users
// Usage: GET /api/temp-share-data
export async function GET() {
  try {
    await dbConnect();
    const db = mongoose.connection.db;
    if (!db) {
      return NextResponse.json({ error: "DB not ready" }, { status: 500 });
    }

    const mainUser = new ObjectId("67829a101501aee9f9ae1b8a");
    const addedUser = new ObjectId("6798e3caf1a6e002f26e8c1a");
    const bothUsers = [mainUser, addedUser];

    // Share all rents
    const rents = await db.collection("rents").updateMany(
      { user_id: mainUser },
      { $set: { user_id: bothUsers } }
    );

    // Share all monthly rents
    const monthlyrents = await db.collection("monthlyrents").updateMany(
      { user_id: mainUser },
      { $set: { user_id: bothUsers } }
    );

    // Share all expenses
    const expenses = await db.collection("monthlyexpenses").updateMany(
      { user_id: mainUser },
      { $set: { user_id: bothUsers } }
    );

    // Share all maintenance
    const maintenance = await db.collection("monthlymaintanences").updateMany(
      { user_id: mainUser },
      { $set: { user_id: bothUsers } }
    );

    return NextResponse.json({
      message: "Data shared successfully",
      results: {
        rents: { matched: rents.matchedCount, modified: rents.modifiedCount },
        monthlyrents: { matched: monthlyrents.matchedCount, modified: monthlyrents.modifiedCount },
        expenses: { matched: expenses.matchedCount, modified: expenses.modifiedCount },
        maintenance: { matched: maintenance.matchedCount, modified: maintenance.modifiedCount },
      }
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
