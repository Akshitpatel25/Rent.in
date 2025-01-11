import MonthlyRent from "@/models/monthlyRent.model";
import { dbConnect } from "@/db/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function POST (request: NextRequest) {
    try {
        await dbConnect();
        const reqbody = await request.json();
        const res = await MonthlyRent.find({user_id: reqbody.user_id, month_year: reqbody.M_Y})
        
        return NextResponse.json({data: res}, {status: 200});
        
    } catch (error:any) {
        
        return NextResponse.json({error: "error in get-previous-month-revenue route", status: 500})
    }
}