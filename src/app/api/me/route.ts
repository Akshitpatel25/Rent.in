import { getUserByCookies } from "@/helper/getUserDetails";
import User from "@/models/user.model";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const userId = await getUserByCookies(request);
        if (!userId ) {
            throw new Error("Invalid user ID");
        }

        const user = await User.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        console.log("userId route/me:", user);
        return NextResponse.json({ user }, { status: 200 });
    } catch (error: any) {
        console.error("Error in /me route:", error);
        return NextResponse.json({ error: "me route failed" }, { status: 400 });
    }
}
