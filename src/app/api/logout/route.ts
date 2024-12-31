import { NextResponse } from "next/server";

export async function GET() {
    try {
        
        const response = NextResponse.json({message:"logout success"},{status: 200})
        response.cookies.set("Rtoken", "", {expires: new Date(0)});
        return response;
        
    } catch (error:any) {
        return NextResponse.json({error:error,message: "logout failed"},{status: 400})
    }
}