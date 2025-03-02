import MonthlyRent from "@/models/monthlyRent.model";
import { dbConnect } from "@/db/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function POST (request: NextRequest) {
    try {
        await dbConnect();
        const reqbody = await request.json();
        console.log(reqbody);
        
        const month = await MonthlyRent.findOne({rent_id: reqbody.rent_id, month_year: reqbody.month_year})

        if (month) {
            return NextResponse.json({error: "month already exist"}, {status: 202});
        }

        const TotalMonthRent = Number(reqbody.monthly_rent_price) + Number(reqbody.electricity_bill);

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
            note: reqbody.note,
            Rent_Paid_date: reqbody.date,
            rent_person_adhar: reqbody.rent_person_adhar
        })
        console.log("MonthRent: ", MonthRent);
        await MonthRent.save();

        
        return NextResponse.json({message: "success"}, {status: 200});
        
    } catch (error:any) {
        return NextResponse.json({error: "something went wrong in create-new-monthly-rent route"}, {status: 400});
    }
}