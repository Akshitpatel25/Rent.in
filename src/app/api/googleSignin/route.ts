import { dbConnect } from "@/db/dbConnect";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
    try {
        await dbConnect();
        const reqbody = await request.json();
        const { email } = reqbody;
        const user = await User.findOne({ email });

        if (!user) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(Date.now().toString(), salt);
            const newUser = new User({
                email: email,
                password: hashedPassword,
                isGoogleSignedIn: true
            });
            await newUser.save();
        }

        return NextResponse.json({ message: "Google Signin Success" }, { status: 200 });

    } catch (error:any) {
        return NextResponse.json({ message: "Google Signin" }, { status: 402 });
    }
}