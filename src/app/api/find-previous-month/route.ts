import MonthlyRent from "@/models/monthlyRent.model";
import { dbConnect } from "@/db/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function POST (request: NextRequest) {
    try {
        await dbConnect();
        const reqbody = await request.json();
        const {finalM_Y, rent_id} = reqbody;
        console.log(finalM_Y);
        const monthlyRent = await MonthlyRent.findOne({rent_id: rent_id, month_year: finalM_Y});
        

        if (!monthlyRent) {
            return NextResponse.json({data: null }, {status: 202});
            
        }

        return NextResponse.json({data: monthlyRent}, {status: 200});
        
    } catch (error:any) {
        console.log("error in find-previous-month route", error);
        return NextResponse.json({error: "something went wrong in find-previous-month route"}, {status: 500});
    }
}