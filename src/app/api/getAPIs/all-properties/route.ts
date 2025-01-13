import { dbConnect } from "@/db/dbConnect";
import User from "@/models/user.model";
import Rents from "@/models/rents.model";
import { NextRequest, NextResponse } from "next/server";
export async function POST(response: NextRequest) {
    try {
        
        await dbConnect();
        const reqBody = await response.json();
        const {email} = reqBody;

        const user = await User.findOne({email: email});

        const rents = await Rents.find({user_id: user?._id});
        

        return NextResponse.json({data: rents}, { status: 200 });
        
    } catch (error:any) {
        return NextResponse.json({error: "error in all-properties route", status: 500})
    }
}