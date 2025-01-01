"use client"

import { useState, useEffect, use } from "react";
import axios from "axios";
import Link from "next/link";
import { useSession } from "next-auth/react"

export default function Dashboard() {
    const [userData,setuserData] = useState("");
    
    const { data: session } = useSession();
    
    const getUserDetailsinFrontend = async() => {
        try {
            const res = await axios.get("/api/me");
            console.log("page.tsx.dasahboard: ",res);
            setuserData(res.data.user.email);
        } catch (error) {
            setuserData("");
        }
    }

    useEffect(() => {
        if (!session?.user) {
            getUserDetailsinFrontend();
        } else {
            setuserData(session?.user?.email! || "");
        }
    },[session?.user]);

    
    

    // loading screen
    // if (!userData) {
    //     return (
    //         <>
    //         <div className="w-screen h-screen flex justify-center items-center">
    //             <Image src={"/ZKZg.gif"} width={50} height={50} alt="loading..."></Image>
    //         </div>
    //         </>
    //     )
    // }
    
    return (
        <>
        <h1 className="text-center text-2xl">hello, Welcome {userData }</h1>
        <Link href={`/logout`}>Go to logout page</Link>
        </>
        
    )
}