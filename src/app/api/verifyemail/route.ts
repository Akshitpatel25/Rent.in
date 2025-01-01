import { dbConnect } from "@/db/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user.model";





export async function POST(request: NextRequest){
    
    try {
        await dbConnect();
        const reqBody = await request.json()
        const {token} = reqBody
        // console.log(reqBody);
        
        console.log("token route of verifyemail:",token);

        const user = await User.findOne({verifyToken: token, verifyTokenExpiry: {$gt: Date.now()}});

        if (!user) {
            return NextResponse.json({error: "Invalid token"}, {status: 400})
        }
        console.log(user);

        user.isVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;
        await user.save();
        
        return NextResponse.json(
            {message: "Email verification Successfully"},
            {status: 200}
        )


    } catch (error:any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }

}