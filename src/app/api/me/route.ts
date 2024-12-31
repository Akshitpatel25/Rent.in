import { getUserByCookies } from "@/helper/getUserDetails";
import User from "@/models/user.model";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";


export async function GET(request: NextRequest) {
    
    try {
        const userId = await getUserByCookies(request);        
        const user = await User.findById(userId);
        return NextResponse.json({ user }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 400 });
    }
}