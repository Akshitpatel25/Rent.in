import MonthlyRent from "@/models/monthlyRent.model";
import Rents from "@/models/rents.model";
import User from "@/models/user.model";
import { dbConnect } from "@/db/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { sendTenantBillNotification } from "@/helper/whatsapp";

export async function POST (request: NextRequest) {
    try {
        await dbConnect();
        const reqbody = await request.json();
        console.log("Request Body:", reqbody);
        
        // Validate required fields
        const requiredFields = [
            "user_id", "rent_id", "rent_name", "rent_person_name", "monthly_rent_price", "month_year", "meter_reading", "electricity_bill", "payment_mode", "Rent_Paid_date"
        ];
        for (const field of requiredFields) {
            if (!reqbody[field]) {
                return NextResponse.json({ error: `${field} is required.` }, { status: 400 });
            }
        }

        // Check for existing month entry
        const month = await MonthlyRent.findOne({ rent_id: reqbody.rent_id, month_year: reqbody.month_year });
        if (month) {
            return NextResponse.json({ error: "Month already exists." }, { status: 409 });
        }

        // Calculate total rent
        const monthlyRentPrice = Number(reqbody.monthly_rent_price);
        const electricityBill = Number(reqbody.electricity_bill);
        if (isNaN(monthlyRentPrice) || isNaN(electricityBill)) {
            return NextResponse.json({ error: "Invalid rent or electricity bill value." }, { status: 400 });
        }
        const TotalMonthRent = monthlyRentPrice + electricityBill;

        // Create new monthly rent entry
        const MonthRent = new MonthlyRent({
            user_id: reqbody.user_id,
            rent_id: reqbody.rent_id,
            rent_name: reqbody.rent_name,
            rent_person_name: reqbody.rent_person_name,
            monthly_rent_price: TotalMonthRent.toString(),
            month_year: reqbody.month_year,
            meter_reading: reqbody.meter_reading,
            electricity_bill: reqbody.electricity_bill,
            payment_mode: reqbody.payment_mode,
            note: reqbody.note || "",
            Rent_Paid_date: reqbody.Rent_Paid_date,
            rent_person_adhar: reqbody.rent_person_adhar || ""
        });
        console.log("New MonthRent:", MonthRent);
        

        await MonthRent.save();

        // Send WhatsApp notification to tenant
        // Only when meter reading is entered (not "0") AND payment is "Not Paid"
        // This means: owner entered meter reading manually, bill is calculated, tenant needs to pay
        if (reqbody.meter_reading && reqbody.meter_reading !== "0" && reqbody.payment_mode === "Not Paid") {
          try {
            // Get tenant phone from the rent record
            const rentRecord = await Rents.findById(reqbody.rent_id);
            if (rentRecord && rentRecord.rent_person_num) {
              // Get owner name
              const userId = Array.isArray(reqbody.user_id) ? reqbody.user_id[0] : reqbody.user_id;
              const owner = await User.findById(userId);
              
              await sendTenantBillNotification({
                tenantPhone: rentRecord.rent_person_num,
                tenantName: reqbody.rent_person_name,
                monthYear: reqbody.month_year,
                monthlyRent: reqbody.monthly_rent_price,
                electricityBill: reqbody.electricity_bill,
                totalAmount: TotalMonthRent.toString(),
                ownerName: owner?.name || "Owner",
              });
            }
          } catch (whatsappError) {
            // Don't fail the whole request if WhatsApp fails
            console.error("WhatsApp notification failed:", whatsappError);
          }
        }

        return NextResponse.json({ message: "Monthly rent created successfully." }, { status: 201 });
    } catch (error: any) {
        console.error("Create monthly rent error:", error);
        return NextResponse.json({ error: error?.message || "Something went wrong in create-new-monthly-rent route." }, { status: 500 });
    }
}