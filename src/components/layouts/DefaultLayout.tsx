'use client'

import React, { useLayoutEffect, useState } from "react"
import Sidebar from "../Sidebar"

export default function DefaultLayout({
    children,
} :{
    children: React.ReactNode
})
{
    const [sidebarOpen, setSidebarOpen] = useState(false)
    return(
        <div className="flex">
            { /* sidebar */}
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            <div className="relative flex flex-1 flex-col lg:ml-72.5"></div>
            { /* headers */}

            <main>
                <div className="mx-auto max-w-screen-2xl p-4 dark:bg-[#121212} md:p-6 2xl:p-10">
                    { children}
                </div>
            </main>
        </div>
    )
}