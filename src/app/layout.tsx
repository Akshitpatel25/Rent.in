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
      </head>
        <body className={`antialiased`}>
          <SessionProvider>
            {children}
          </SessionProvider>
        </body>
    </html>
  );
}
