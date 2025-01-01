"use client"

import { useState, useEffect, use } from "react";
import axios from "axios";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Dashboard() {
    const { data: session, status } = useSession();
    const [userData,setuserData] = useState("");
    const router = useRouter();
    
    
    const getUserDetailsinFrontend = async() => {
        try {
            const res = await axios.get("/api/me");
            console.log("page.tsx.dasahboard: ",res);
            if (res.data.user == null) {
                router.push("/login");
            }
            setuserData(res.data.user.email);
            
        } catch (error) {
            console.log("page/dashboard",error);
        }
    }

    useEffect(() => {
        if (status === "authenticated") {
            setuserData(session?.user?.email || "");
        } else if (status === "unauthenticated") {
            getUserDetailsinFrontend();
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