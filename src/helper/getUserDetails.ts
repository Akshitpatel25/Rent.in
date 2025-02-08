import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { dbConnect } from "@/db/dbConnect";
import User from "@/models/user.model";
import {auth} from "@/auth"
import axios from "axios";

const getUserByCookies = async (request: NextRequest) => {

    try {
        await dbConnect();
        const session = await auth();
        const token = request.cookies.get('Rtoken')?.value || '';
        // console.log("Rtoken:",token);
        
        
        if (token.length === 0) {
            const apiUrl = process.env.DOMAIN || "http://localhost:3000";
            await axios.post(`${apiUrl}/api/googleSignin`, { name: session?.user?.name, email: session?.user?.email });
            const user = await User.findOne({email: session?.user?.email});
            return user?._id;
        }else {

            const decodedToken = jwt.verify(token, process.env.JWT_TOKEN_SECRET!) as {
                id: string;
                email: string;
            };
            // console.log("Decoded Token:",decodedToken);
            
            return decodedToken.id;
        }

    } catch (error:any) {
        console.log("getUserByCookies failed: ", error);
        return null;
        
    }

    

}

export {getUserByCookies};