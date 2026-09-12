import { NextResponse, NextRequest } from "next/server";
import { dbConnect } from "@/db/dbConnect";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const reqbody = await request.json();
    const { user_id } = reqbody;

    if (!user_id) {
      return NextResponse.json({ error: "user_id required" }, { status: 400 });
    }

    const db = mongoose.connection.db;
    if (!db) {
      return NextResponse.json({ error: "DB not ready" }, { status: 500 });
    }

    const userId = new ObjectId(`${user_id}`);
    const userIdStr = String(user_id);
    const userMatch = {
      $or: [
        { user_id: userId },
        { user_id: userIdStr },
        { user_id: { $elemMatch: { $eq: userId } } },
        { user_id: { $elemMatch: { $eq: userIdStr } } },
      ],
    };

    // Latest paid monthly rents (most recent first by _id which reflects insertion order)
    const rents = await db
      .collection("monthlyrents")
      .find({ ...userMatch, payment_mode: { $ne: "Not Paid" } })
      .sort({ _id: -1 })
      .limit(5)
      .toArray();

    // Latest expenses
    const expenses = await db
      .collection("monthlyexpenses")
      .find(userMatch)
      .sort({ _id: -1 })
      .limit(5)
      .toArray();

    // Latest maintenance
    const maintenance = await db
      .collection("monthlymaintanences")
      .find(userMatch)
      .sort({ _id: -1 })
      .limit(5)
      .toArray();

    // Combine into a unified activity list
    const activities: any[] = [];

    for (const r of rents) {
      activities.push({
        _id: String(r._id),
        type: "rent",
        title: `Rent received from ${r.rent_name}`,
        date: r.Rent_Paid_date || r.month_year,
        amount: Number(r.monthly_rent_price) || 0,
        sortKey: r._id.toString(),
      });
    }

    for (const e of expenses) {
      activities.push({
        _id: String(e._id),
        type: "expense",
        title: e.expense_name,
        date: `${e.expense_Day || ""} ${e.expense_M_Y || ""}`.trim(),
        amount: Number(e.expense_amount) || 0,
        sortKey: e._id.toString(),
      });
    }

    for (const m of maintenance) {
      activities.push({
        _id: String(m._id),
        type: "maintenance",
        title: m.maintanence_name,
        date: `${m.maintanence_Day || ""} ${m.maintanence_M_Y || ""}`.trim(),
        amount: Number(m.maintanence_amount) || 0,
        sortKey: m._id.toString(),
      });
    }

    // Sort by MongoDB ObjectId (which encodes creation timestamp) - newest first
    activities.sort((a, b) => (a.sortKey < b.sortKey ? 1 : -1));

    // Return top 5 most recent across all types
    const topActivities = activities.slice(0, 5).map(({ sortKey, ...rest }) => rest);

    return NextResponse.json({ data: topActivities }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error fetching recent activity" }, { status: 500 });
  }
}
