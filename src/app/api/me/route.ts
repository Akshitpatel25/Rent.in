import { getUserByCookies } from "@/helper/getUserDetails";
import User from "@/models/user.model";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { dbConnect } from "@/db/dbConnect";
 
export async function GET(request: NextRequest) {
    try {
        await dbConnect();
        const userId = await getUserByCookies(request);
        console.log("userId route/me:", userId);
        
        if (!userId ) {
            return NextResponse.json({ message: "User not found" }, { status: 400 });
        }
    
        const user = await User.findById(userId);
        // console.log(user);
        if (!user) {
            return NextResponse.json({ message: "User with user id not found" }, { status: 400 });
        }

        console.log("userId route/me:", user);
        return NextResponse.json({ user }, { status: 200 });
    } catch (error: any) {

        console.error("Error in /me route:", error);
        return NextResponse.json({user: null }, { status: 400 });
    }
}
