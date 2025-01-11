import { dbConnect } from "@/db/dbConnect";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/helper/nodemailer";



export async function POST(request: NextRequest) {
    
    try {
        await dbConnect();
        const reqbody = await request.json();
        const {email} = reqbody;

        const user = await User.findOne({ email });
        
        if (!user) {
            return NextResponse.json(
                { error: "email is not registered" },
                { status: 400 }
            );
        }

        sendEmail({ email, emailType: "PASSWORD_RESET", userId: user._id });

        return NextResponse.json({ data: "check your email" },{status: 200});
    } catch (error:any) {
        return NextResponse.json({ error: "forgetpassword_email_verification route failed" }, { status: 400 });
    }
}