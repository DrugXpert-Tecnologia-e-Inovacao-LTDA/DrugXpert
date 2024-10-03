"use client";
import React, { useState, useLayoutEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const publicRoutes = [
    "/auth-page/signin",
    "/auth-page/signup",
    "/verify-email",
    "/reset-password",
  ];

  useLayoutEffect(() => {
    if (status === "unauthenticated" && !publicRoutes.includes(pathname)) {
      router.push("/auth-page/signin");
    }
  }, [status, router, pathname]);

  const isPublicRoute = publicRoutes.includes(pathname);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      {!isPublicRoute && status === "authenticated" && (
        <aside className="w-64 bg-darkGray dark:bg-[#121212]">
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        </aside>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col ml-4"> {/* Aumenta a distância entre Sidebar e Main */}
        {!isPublicRoute && status === "authenticated" && (
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        )}
        <main className="flex-1 overflow-auto bg-white dark:bg-[#121212] p-4 md:p-6 2xl:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
