import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";


const getUserByCookies = (request: NextRequest) => {

    try {
        const token = request.cookies.get('Rtoken')?.value || '';
        const decodedToken = jwt.verify(token, process.env.JWT_TOKEN_SECRET!) as {
            id: any;
            email: any;
        };
        console.log("decodedToken: ", decodedToken);
        return decodedToken.id;


    } catch (error:any) {
        console.log("getUserByCookies failed: ", error);
        return null;
        
    }

    

}

export {getUserByCookies};