import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { dbConnect } from "@/db/dbConnect";
import User from "@/models/user.model";
import {auth} from "@/auth"
import axios from "axios";

const getUserByCookies = async (request: NextRequest) => {
    try {
        await dbConnect();
        const token = request.cookies.get('Rtoken')?.value || '';
        console.log("Rtoken from request:", token);  // Log received cookie

        if (!token) {
            console.log("No token found in cookies");
            return null;
        }

        const decodedToken = jwt.verify(token, process.env.JWT_TOKEN_SECRET!) as {
            id: string;
            email: string;
        };

        console.log("Decoded Token:", decodedToken);
        return decodedToken.id;
    } catch (error) {
        console.log("getUserByCookies failed:", error);
        return null;
    }
};


export {getUserByCookies};