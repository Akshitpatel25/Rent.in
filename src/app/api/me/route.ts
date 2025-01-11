import { getUserByCookies } from "@/helper/getUserDetails";
import User from "@/models/user.model";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { dbConnect } from "@/db/dbConnect";
 
export async function GET(request: NextRequest) {
    try {
        await dbConnect();
        const userId = await getUserByCookies(request);
        
        if (!userId ) {
            return NextResponse.json({ message: "User not found" }, { status: 400 });
        }
    
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ message: "User with user id not found" }, { status: 400 });
        }

        return NextResponse.json({ user }, { status: 200 });
    } catch (error: any) {

        console.error("Error in /me route:", error);
        return NextResponse.json({user: null }, { status: 400 });
    }
}
