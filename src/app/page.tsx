"use client";
import { dbConnect } from "@/db/dbConnect";
import Link from "next/link";

export default function Home() {

  return (
    <>
      <h1>Welcome to Rent.in</h1>
      <Link href="/login">Login</Link>
      <br />
      <Link href="/signup">signup</Link>
    </>
  );
}
