import MonthlyRent from "@/models/monthlyRent.model";
import { dbConnect } from "@/db/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { log } from "console";

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
        return NextResponse.json({ message: "Monthly rent created successfully." }, { status: 201 });
    } catch (error: any) {
        console.error("Create monthly rent error:", error);
        return NextResponse.json({ error: error?.message || "Something went wrong in create-new-monthly-rent route." }, { status: 500 });
    }
}