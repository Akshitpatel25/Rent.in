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
            setuserData(res.data.user.email);
        } catch (error) {
            setuserData("");
        }
    }

    useEffect(() => {
        getUserDetailsinFrontend();
    },[])

    useEffect(() => {
        if (status == "authenticated") {
            setuserData(session?.user?.email || "");
            router.push("/dashboard");
        }
        console.log("status:",status);
        
    },[ router, session, status])
    

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