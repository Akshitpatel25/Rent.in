"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";


export default function VerifyEmailPage() {
    const router = useRouter();

    const [token, setToken] = useState("");
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState(false);

    const verifyUserEmail = async () => {
        try {
            await axios.post('/api/verifyemail',{token})
            setVerified(true);
            setTimeout(() => {
                router.push("/login");
            }, 2000);
            router.push("/login");
        } catch (error:any) {
            setError(true);
            
        }

    }

    useEffect(() => {
        const urlToken = window.location.search.split("=")[1];
        setToken(urlToken || "");
        
    }, []);


    useEffect(() => {
        if(token.length > 0) {
            verifyUserEmail();
        }
    }, [token]);

    return(
        <div className="flex flex-col items-center justify-center min-h-screen py-2 min-w-80 max-w-screen-2xl m-auto">

            <h1 className="text-4xl">Verify Email</h1>
            <h2 className="p-2 bg-orange-500 text-black">{token ? `${token}` : "no token"}</h2>

            {verified && (
                <div>
                    <h2 className="text-2xl">wait for 2 seconds, if you are not redirect to login page then click below</h2>
                    <Link href="/login">Login</Link>
                </div>
            )}
        </div>
    )

}