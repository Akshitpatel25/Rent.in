import Rents from "@/models/rents.model";
import { dbConnect } from "@/db/dbConnect";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    try {
        await dbConnect();
        const reqbody = await request.json();
        const {id} = reqbody;
        
        await Rents.findByIdAndDelete({ _id: id });

        return NextResponse.json({ data: "Property deleted successfully" }, { status: 200 });

    } catch (error:any) {
        return NextResponse.json({error: "Property not found", status: 500})
    }
}