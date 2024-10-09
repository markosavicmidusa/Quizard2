"use client"

import MainContent from "@/components/shared/MainContent"
import Link from "next/link"

export default function NotFound(){

    return (
        <div className="flex flex-col items-center gap-5 m-10">
            <h1 className="text-xl text-red-500">Error: Page not found</h1>
            <p>Could not find requested resource</p>
            <Link className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 mb-2" href="/">Home</Link>
            <MainContent/>
        </div>
    )
}