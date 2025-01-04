"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react"

export default function Paramshandling() {
    const router = useRouter();
    const logout = async() => {
        try {
            await axios.get("/api/logout");
            signOut();
            router.push("/login");
            
        } catch (error:any) {
            console.log("logout failed (frontend)", error);
        }
    }

    return (
        <>
        <h1 className="text-center text-2xl">welcome to logout route</h1>
        <button
        className="rounded-md bg-gray-500 p-2 flex flex-col justify-center items-center "
        onClick={logout}
        >logout</button>
        </>
    )
}