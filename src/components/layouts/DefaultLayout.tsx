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
        <>
          {/* Button to open the sidebar on mobile */}
          <button
            className="fixed top-4 left-4 z-20 block lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Sidebar - Mobile, Tablet, and Desktop */}
          <aside
            className={`fixed inset-y-0 left-0 z-30 w-64 bg-darkGray dark:bg-[#121212] transition-transform transform lg:relative lg:translate-x-0 ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            } lg:w-64`}
          >
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          </aside>
        </>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-5"> {/* ml-4 only applies on larger screens */}
        {!isPublicRoute && status === "authenticated" && (
          <div className="lg:ml-5"> {/* Adiciona a mesma margem no Header */}
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          </div>
        )}
        <main className="flex-1 overflow-auto bg-white dark:bg-[#121212] p-4 sm:p-6 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
