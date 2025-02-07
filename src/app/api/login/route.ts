import { dbConnect } from "@/db/dbConnect";
import User from "@/models/user.model";
import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
    try {
        await dbConnect();
        const reqbody = await request.json();
        const { email, password } = reqbody;

        if (!email || !password) {
            return NextResponse.json(
                { error: "email and password are required" },
                { status: 400 }
            );
        }

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { error: "email is not registered" },
                { status: 400 }
            );
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json(
                { error: "invalid credentials" },
                { status: 400 }
            );
        }

        // Generate JWT Token
        const tokenData = {
            id: user._id,
            email: user.email
        };

        const token = jwt.sign(tokenData, process.env.JWT_TOKEN_SECRET!, { expiresIn: "30d" });

        // Create a new response (modifying the existing one doesn't work in Next.js API routes)
        const response = new NextResponse(
            JSON.stringify({ message: "User logged in successfully" }),
            { status: 200 }
        );

        response.cookies.set("Rtoken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",  // Works only in production
            sameSite: "lax",  // Allows cross-tab and external navigation
            maxAge: 30 * 24 * 60 * 60, // 30 days expiration
            path: "/"
        });

        return response;
    } catch (error: any) {
        return NextResponse.json(
            { error: "login route error" },
            { status: 500 }
        );
    }
}
