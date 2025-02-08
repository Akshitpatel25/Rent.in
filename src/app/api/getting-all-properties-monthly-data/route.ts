import { dbConnect } from "@/db/dbConnect";
import MonthlyRent from "@/models/monthlyRent.model";
import { NextRequest, NextResponse } from "next/server";
export async function POST(response: NextRequest) {
    try {
        
        await dbConnect();
        const reqBody = await response.json();
        const rents = await MonthlyRent.find({user_id: reqBody.user_id});
        if (!rents) {
            return NextResponse.json({message: "No data found"}, {status: 202});
        }
        
        return NextResponse.json({data: rents}, { status: 200 });
        
    } catch (error:any) {
        return NextResponse.json({error: "error in getting-all-properties-monthly-data route", status: 500})
    }
}