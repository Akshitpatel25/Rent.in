import MonthlyRent from "@/models/monthlyRent.model";
import { dbConnect } from "@/db/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function POST (request: NextRequest) {
    try {
        await dbConnect();
        const reqbody = await request.json();

        const res = await MonthlyRent.find({rent_id: reqbody.id})
        
        if (!res) {
            return NextResponse.json({message: "No data found"}, {status: 202});
        }


        return NextResponse.json({data: res}, {status: 200});
        
    } catch (error:any) {
        
        return NextResponse.json({error: "something went wrong in getting-monthly-rent route"}, {status: 500});
    }
}