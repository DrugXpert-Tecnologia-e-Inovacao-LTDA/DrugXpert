"use client";
import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/style.css";
import React, { useEffect, useState, useRef } from "react";
import Loader from "@/components/common/Loader";
import * as Ably from "ably";
import { AblyProvider, ChannelProvider } from "ably/react";
import { SessionProvider } from "next-auth/react";
import { UserProvider } from "@/app/context/UserContext";
import Head from "next/head"; // Import Head
import { ReactNode } from "react"; // Import ReactNode

interface RootLayoutProps {
  children: ReactNode; // Specify the type for children
}

export default function RootLayout({ children }: RootLayoutProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const client = useRef(new Ably.Realtime({
    key: process.env.NEXT_PUBLIC_ABLY_API_KEY,
  }));

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <html lang="en">
      <Head>
        <script src="https://unpkg.com/@rdkit/rdkit/dist/RDKit_minimal.js" />
      </Head>
      <body suppressHydrationWarning={true}>
        <SessionProvider>
          <UserProvider>
            <AblyProvider client={client.current}>
              <ChannelProvider channelName="chat-demo1">
                <div className="font-poppins dark:bg-boxdark-2 dark:text-bodydark ">
                  {loading ? <Loader /> : children}
                </div>
              </ChannelProvider>
            </AblyProvider>
          </UserProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
