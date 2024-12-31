/* eslint-disable react-hooks/rules-of-hooks */
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { signIn, signOut, useSession } from "next-auth/react";


const getUserByCookies = (request: NextRequest) => {

    try {
        const token = request.cookies.get('Rtoken')?.value || '';
        const decodedToken = jwt.verify(token, process.env.JWT_TOKEN_SECRET!);
        console.log("decodedToken: ", decodedToken);
        return decodedToken.id;

        // const sessionToken = request.cookies[`next-auth.session-token`] || '';
        // const decodedSessionToken = jwt.verify(sessionToken, process.env.NEXTAUTH_SECRET!);
        // console.log(decodedSessionToken);

    } catch (error) {
        console.log("getUserByCookies failed: ", error);
        
    }

    

}

export {getUserByCookies};