import { dbConnect } from "@/db/dbConnect";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

dbConnect();
export async function POST(request: NextRequest) {

    
    try {
        const reqbody = await request.json();
        const {urlToken, sendPassword} = reqbody;
        // console.log("urlToken from route:", urlToken);
        
        const user = await User.findOne({forgotPasswordToken: urlToken, forgotPasswordTokenExpiry: {$gt: Date.now()}});

        if (!user) {
            return NextResponse.json({ error: "Try again later" }, { status: 404 });
        }
        console.log(user);

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(sendPassword, salt);

        user.password= hashedPassword;
        user.forgotPasswordToken = undefined;
        user.forgotPasswordTokenExpiry = undefined;

        await user.save();

        return NextResponse.json({ message: "Password changed successfully" }, { status: 200 });
        
    } catch (error) {
        return NextResponse.json({ error: "new password route failed" }, { status: 500 });
    }

}