import { dbConnect } from "@/db/dbConnect";
import Rents from "@/models/rents.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST (request: NextRequest) {
    try {
        await dbConnect();
        const reqbody = await request.json();
        const res = await Rents.find({user_id: reqbody.user_id}).select('monthly_rent_price');
        
        if(!res) {
            return NextResponse.json({message: "No data found"}, {status: 202});
        }
        
        return NextResponse.json({data: res}, {status: 200});
        
    } catch (error:any) {
        
        return NextResponse.json({error: "something went wrong in todays-earning route"}, {status: 500});
    }
}