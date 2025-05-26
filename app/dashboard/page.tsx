"use client"

import { useState } from "react"
import supabase from "../config/supabaseClient"
import NavBar from "@/components/dashboard_components/NavBar"
import Overview from "@/components/dashboard_components/dashboard_tabs/Overview";
import Accounts from "@/components/dashboard_components/dashboard_tabs/Accounts";
import Transactions from "@/components/dashboard_components/dashboard_tabs/Transactions";
import Analytics from "@/components/dashboard_components/dashboard_tabs/Analytics";

export default function Dashboard() {
    const getData = async () => {
        const { data, error } = await supabase.auth.getSession()
        error ? console.log(error.message) : console.log("no error")
        console.log("Session data:", data.session)
    }

    getData()

    //do some redirection protection for non logged in 

    type Page = "Overview" | "Accounts" | "Transactions" | "Analytics"

    const componentSelector: Record<Page, React.FC> = {
        Overview: Overview,
        Accounts: Accounts,
        Transactions: Transactions,
        Analytics: Analytics,
    } as const

    const [currentPage, setPage] = useState<Page>("Overview")
    let CurrentComponent = componentSelector[currentPage]

    const tabStyle = "text-2xl px-4 mx-4 border border-black rounded-md cursor-pointer"
    return (
        <div className="">
            <NavBar />
            <div className="flex gap-4 my-4 mx-4 justify-center">
                {Object.keys(componentSelector).map((tab) => 
                        <span
                            onClick={() => setPage(tab as Page)}
                            key={tab}
                            className={`${tabStyle} ${currentPage === tab ? "bg-gray-500" : ""}`}>
                            {tab}
                        </span>
                )}
            </div>
            <CurrentComponent />

        </div>
    )
}