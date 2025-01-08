import { dbConnect } from "@/db/dbConnect";
import Rents from "@/models/rents.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        console.log("individual-rent route is runnnig...");
        
        await dbConnect();
        const reqbody = await request.json();
        
        const {id} = reqbody;
        console.log("id: ", id);
        
        const rent = await Rents.findById({ _id: id });

        if (!rent) {
            return NextResponse.json({ error: "Individual rent not found" }, { status: 400 });
        }

        return NextResponse.json({ data: rent }, { status: 200 });

    } catch (error:any) {
        // console.log("Error in /api/individual-rent route:", error);
        return NextResponse.json({error:`Error in /api/individual-rent route: ${error.message}`, status: 500})
        
    }
}