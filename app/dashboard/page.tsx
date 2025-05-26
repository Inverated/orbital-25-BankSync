"use client"

import { useEffect, useState } from "react"
import supabase from "../config/supabaseClient"
import NavBar from "@/components/dashboard_components/NavBar"
import Overview from "@/components/dashboard_components/dashboard_tabs/Overview";
import Accounts from "@/components/dashboard_components/dashboard_tabs/Accounts";
import Transactions from "@/components/dashboard_components/dashboard_tabs/Transactions";
import Analytics from "@/components/dashboard_components/dashboard_tabs/Analytics";
import { Session } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

export default function Dashboard() {
    const [currentSession, setSession] = useState<Session | null>(null)
    const router = useRouter()

    useEffect(() => {
        const getData = async () => {
            const { data, error } = await supabase.auth.getSession()

            if (error) {
                console.log(error.message)
            } else {
                console.log("no error")
            }

            if (data.session == null) {
                router.push('/registration')
            } else {
                router.push('/dashboard')
            }
            setSession(data.session)
        }
        getData()
    }, [])

    type Page = "Overview" | "Accounts" | "Transactions" | "Analytics"

    const componentSelector: Record<Page, React.FC> = {
        Overview: Overview,
        Accounts: Accounts,
        Transactions: Transactions,
        Analytics: Analytics,
    } as const

    const [currentPage, setPage] = useState<Page>("Overview")
    const CurrentComponent = componentSelector[currentPage]

    const tabStyle = "text-2xl px-4 mx-4 border border-black rounded-md cursor-pointer"
    return (
        currentSession != null && <div className="">
            <NavBar user={currentSession?.user} />
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