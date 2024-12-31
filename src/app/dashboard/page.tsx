/* eslint-disable react-hooks/rules-of-hooks */
"use client"

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { NextRequest } from "next/server";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function dashboard(request: NextRequest) {
    const { data: session, status } = useSession();
    const [userData,setuserData] = useState("");
    const router = useRouter();
    
    
    const getUserDetailsinFrontend = async() => {
        const res = await axios.get("/api/me");
        setuserData(res?.data?.user?.email);
    }

    useEffect(() => {
        if (status === "authenticated") {
            setuserData(session?.user?.email);
        } else if (status === "unauthenticated") {
            getUserDetailsinFrontend();
        } else if (!session) {
            router.push("/login");
        }
    },[session, status])


    // loading screen
    if (status === "loading" || userData == "" ) {
        return (
            <>
            <div className="w-screen h-screen flex justify-center items-center">
                <Image src={"/ZKZg.gif"} width={50} height={50} alt="loading..."></Image>
            </div>
            </>
        )
    }
    
    return (
        <>
        <h1 className="text-center text-2xl">hello, Welcome {userData }</h1>
        <Link href={`/logout`}>Go to logout page</Link>
        </>
        
    )
}