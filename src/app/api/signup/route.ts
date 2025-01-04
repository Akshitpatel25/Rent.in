import {dbConnect} from "@/db/dbConnect";
import User from "@/models/user.model"; 
import { NextResponse, NextRequest } from "next/server";
import bcrypt from 'bcryptjs';
import { sendEmail } from "@/helper/nodemailer";


export async function POST(request: NextRequest) {
    try {
        await dbConnect();
        const reqbody = await request.json();
        const { name, email, password } = reqbody;

        if(!name || !email || !password) {
            return NextResponse.json(
                {error: "name,email and password are required"},
                {status: 400}
            )
        }

        const user = await User.findOne({ email });
        
        if(user) {
            return NextResponse.json(
                {error: "user already exists"},
                {status: 400}
            )
        }

        // hashing password 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // add user to user models
        const adduser = new User({
            name,
            email,
            password: hashedPassword
        });
        const saveduser = await adduser.save();
        console.log("signup route:", saveduser);

        // send verification email
        await sendEmail({email:email, emailType: "EMAIL_VERIFICATION", userId: saveduser._id});
        
        return NextResponse.json({message: "user created successfully"},{status: 200});

    } catch (error:any) {
        return NextResponse.json({error: "signin route error-> "+error}, {status: 500})
    }
}