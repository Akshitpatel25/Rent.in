import { dbConnect } from "@/db/dbConnect";
import User from "@/models/user.model";
import Rents from "@/models/rents.model";
import { NextRequest, NextResponse } from "next/server";
import {auth} from "@/auth"
export async function GET(response: NextRequest) {
    try {
        
        await dbConnect();
        const session = await auth();

        const user = await User.findOne({email: session?.user?.email});

        const rents = await Rents.find({user_id: user?._id});
        

        return NextResponse.json({data: rents}, { status: 200 });
        
    } catch (error:any) {
        return NextResponse.json({error: "error in all-properties route", status: 500})
    }
}