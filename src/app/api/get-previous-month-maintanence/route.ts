import { dbConnect } from "@/db/dbConnect";
import MaintanenceModel from "@/models/maintanence.model";
import { NextResponse, NextRequest } from "next/server";

export async function POST (request: NextRequest) {
    try {
        await dbConnect();
        const reqbody = await request.json();
        const {user_id, M_Y} = reqbody;

        const res = await MaintanenceModel.find({user_id: user_id, maintanence_M_Y: M_Y});
        if (!res) {
            return NextResponse.json({message: "No maintanence data found"}, {status: 202})
        }
        
        return NextResponse.json({data: res}, {status: 200})
        
    } catch (error:any) {
        console.log("Error in /api/getAPIs/get-previous-month-maintanence route:", error);
        
        return NextResponse.json({error: "error in get-previous-month-maintanence route", status: 500})
    }
}