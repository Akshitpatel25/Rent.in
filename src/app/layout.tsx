"use client";
/* eslint-disable @next/next/no-page-custom-font */
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import {metadata} from "@/app/metadata";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <link rel="icon" type="image/x-icon" href="/falcon3.ico" />
        <meta name="description" content={metadata.description} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />

        {
          process.env.NODE_ENV === "production" && (
            <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5746197528449579"
            crossOrigin="anonymous"></script>
          )
        }


      </head>
        <body className={`antialiased`}>
          <SessionProvider>
            {children}
          </SessionProvider>
        </body>
    </html>
  );
}
