import { dbConnect } from "@/db/dbConnect";
import User from "@/models/user.model";
import Rents from "@/models/rents.model";
import MonthlyRent from "@/models/monthlyRent.model";
import { NextRequest, NextResponse } from "next/server";
import { sendOwnerMonthlySummary } from "@/helper/whatsapp";

/**
 * Cron API Route - Monthly Owner Summary
 * 
 * Runs on 1st of every month (triggered by external cron service)
 * Sends WhatsApp message to owners with:
 * - List of tenants who didn't pay last month
 * - Total remaining amount
 * 
 * Security: Use CRON_SECRET env var to prevent unauthorized access
 * 
 * Usage: GET /api/cron-owner-summary?secret=YOUR_CRON_SECRET
 */

const monthByName = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");
    if (secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Get last month's M_Y
    const now = new Date();
    const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
    const lastMonthYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
    const M_Y = `${monthByName[lastMonth]}${lastMonthYear}`;

    // Get all users who have whatsapp_numbers
    const owners = await User.find({
      whatsapp_numbers: { $exists: true, $ne: [] },
    });

    const results: any[] = [];

    for (const owner of owners) {
      // Get all rents for this owner
      const ownerRents = await Rents.find({
        $or: [
          { user_id: owner._id },
          { user_id: String(owner._id) },
          { user_id: { $elemMatch: { $eq: owner._id } } },
          { user_id: { $elemMatch: { $eq: String(owner._id) } } },
        ],
      });

      if (ownerRents.length === 0) continue;

      // Find unpaid monthly rents for last month
      const unpaidTenants: { name: string; amount: string }[] = [];
      let totalRemaining = 0;

      for (const rent of ownerRents) {
        // Check if monthly rent exists for last month
        const monthlyRecord = await MonthlyRent.findOne({
          rent_id: rent._id,
          month_year: M_Y,
        });

        if (!monthlyRecord || monthlyRecord.payment_mode === "Not Paid") {
          unpaidTenants.push({
            name: rent.rent_person_name,
            amount: rent.monthly_rent_price,
          });
          totalRemaining += Number(rent.monthly_rent_price) || 0;
        }
      }

      // Only send if there are unpaid tenants
      if (unpaidTenants.length === 0) continue;

      // Format the unpaid list
      const unpaidList = unpaidTenants
        .map((t, i) => `${i + 1}. ${t.name} - ₹${Number(t.amount).toLocaleString("en-IN")}`)
        .join("\n");

      // Send to all owner's WhatsApp numbers
      for (const phone of owner.whatsapp_numbers) {
        const result = await sendOwnerMonthlySummary({
          ownerPhone: phone,
          ownerName: owner.name,
          monthYear: M_Y,
          unpaidList: unpaidList,
          totalRemaining: `₹${totalRemaining.toLocaleString("en-IN")}`,
        });
        results.push({
          owner: owner.name,
          phone,
          success: result.success,
          error: result.error,
        });
      }
    }

    return NextResponse.json({
      message: "Owner summary cron completed",
      month: M_Y,
      results,
    }, { status: 200 });

  } catch (error: any) {
    console.error("Cron owner summary error:", error);
    return NextResponse.json({ error: error.message || "Cron failed" }, { status: 500 });
  }
}
