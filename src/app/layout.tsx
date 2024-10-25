"use client";
import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/style.css";
import React, { useEffect, useState, useRef, ReactNode } from "react";
import Loader from "@/components/common/Loader";
import * as Ably from "ably";
import { AblyProvider, ChannelProvider } from "ably/react";
import { SessionProvider } from "next-auth/react";
import { UserProvider } from "@/app/context/UserContext";
import Head from "next/head"; // Import Head for metadata management

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const client = useRef(
    new Ably.Realtime({
      key: process.env.NEXT_PUBLIC_ABLY_API_KEY,
    })
  );

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <html lang="en">
      <Head>
        {/* Essential Metadata */}
        <title>DrugXpert - Real-time Interaction & Insights</title>
        <meta name="description" content="Experience real-time interaction with DrugXpert. Manage data, authenticate users, and explore insights seamlessly." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="UTF-8" />

        {/* Open Graph Metadata for Social Sharing */}
        <meta property="og:title" content="DrugXpert" />
        <meta property="og:description" content="Explore DrugXpert, the real-time platform for efficient data management and user authentication." />
        <meta property="og:image" content="/images/og-image.jpg" />
        <meta property="og:url" content="https://your-site-url.com" />
        <meta property="og:type" content="website" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />

        {/* External Script */}
        <script
          src="https://unpkg.com/@rdkit/rdkit/dist/RDKit_minimal.js"
          async
          defer
        />
      </Head>
      <body suppressHydrationWarning={true}>
        <SessionProvider>
          <UserProvider>
            <AblyProvider client={client.current}>
              <ChannelProvider channelName="chat-demo1">
                <div className="font-poppins dark:bg-boxdark-2 dark:text-bodydark">
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
