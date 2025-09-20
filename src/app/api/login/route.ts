import { dbConnect } from "@/db/dbConnect";
import User from "@/models/user.model";
import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
    try {
        await dbConnect();
        const reqbody = await request.json();
        const email = typeof reqbody.email === "string" ? reqbody.email.trim().toLowerCase() : "";
        const password = typeof reqbody.password === "string" ? reqbody.password : "";

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required." },
                { status: 400 }
            );
        }

        // Basic email format validation
        const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Invalid email format." },
                { status: 400 }
            );
        }

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { error: "Email is not registered." },
                { status: 404 }
            );
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json(
                { error: "Invalid credentials." },
                { status: 401 }
            );
        }

        // Generate JWT Token
        const tokenData = {
            id: user._id,
            email: user.email
        };

        if (!process.env.JWT_TOKEN_SECRET) {
            return NextResponse.json(
                { error: "JWT secret not configured." },
                { status: 500 }
            );
        }

        const token = jwt.sign(tokenData, process.env.JWT_TOKEN_SECRET, { expiresIn: "30d" });

        const response = new NextResponse(
            JSON.stringify({ message: "User logged in successfully" }),
            { status: 200 }
        );

        response.cookies.set("Rtoken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 30 * 24 * 60 * 60,
            path: "/"
        });

        return response;
    } catch (error: any) {
        console.error("Login error:", error);
        return NextResponse.json(
            { error: error?.message || "Login route error" },
            { status: 500 }
        );
    }
}
