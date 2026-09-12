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

    const mainUserId = "6783e1b15a171df29fd5c258";
    const addedUserId = "6aa402d1deffc0d18e4e8032";
    
    const mainUserObjId = new ObjectId(mainUserId);
    const addedUserObjId = new ObjectId(addedUserId);
    const bothUsersObjId = [mainUserObjId, addedUserObjId];
    const bothUsersString = [mainUserId, addedUserId];

    // Share all rents (user_id is ObjectId type)
    const rents = await db.collection("rents").updateMany(
      { $or: [{ user_id: mainUserObjId }, { user_id: { $in: [mainUserObjId] } }] },
      { $set: { user_id: bothUsersObjId } }
    );

    // Share all monthly rents (user_id is ObjectId type)
    const monthlyrents = await db.collection("monthlyrents").updateMany(
      { $or: [{ user_id: mainUserObjId }, { user_id: { $in: [mainUserObjId] } }] },
      { $set: { user_id: bothUsersObjId } }
    );

    // Share all expenses (user_id is STRING type)
    const expenses = await db.collection("monthlyexpenses").updateMany(
      { $or: [{ user_id: mainUserId }, { user_id: { $in: [mainUserId] } }] },
      { $set: { user_id: bothUsersString } }
    );

    // Share all maintenance (user_id is STRING type)
    const maintenance = await db.collection("monthlymaintanences").updateMany(
      { $or: [{ user_id: mainUserId }, { user_id: { $in: [mainUserId] } }] },
      { $set: { user_id: bothUsersString } }
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
