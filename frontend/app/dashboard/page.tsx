"use client"

import { useEffect, useState } from "react"
import NavBar from "@/components/dashboard_components/NavBar"
import Overview from "@/components/dashboard_components/dashboard_tabs/overview_tab/Overview";
import Accounts from "@/components/dashboard_components/dashboard_tabs/accounts_tab/Accounts";
import Transactions from "@/components/dashboard_components/dashboard_tabs/transactions_tab/Transactions";
import Analytics from "@/components/dashboard_components/dashboard_tabs/analytics_tab/Analytics";
import { Session } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

import { UserProvider } from "@/context/UserContext";
import { registerCharts } from "@/utils/RegisterCharts";

export default function Dashboard() {
    const [currentSession, setSession] = useState<Session | null>(null)
    const router = useRouter()
    const [isLoaded, setLoadingStatus] = useState(false)

    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange(
            (_, session) => {
                if (!session) {
                    router.push('/login');
                } else {
                    setSession(session)
                    setLoadingStatus(true);
                }
            }
        );

        supabase.auth.getSession()
            .then(({ data: { session }, error }) => {
                if (!session) {
                    router.push('/login')
                } else {
                    setSession(session)
                    setLoadingStatus(true)
                }
                if (error) console.error(error)
            })

        return () => {
            authListener.subscription.unsubscribe()
        }
    }, [router])

    type Page = "Overview" | "Accounts" | "Transactions" | "Analytics"

    const componentSelector: Record<Page, React.FC> = {
        Overview: Overview,
        Accounts: Accounts,
        Transactions: Transactions,
        Analytics: Analytics,
    } as const

    const [currentPage, setPage] = useState<Page>("Overview")
    const CurrentComponent = componentSelector[currentPage]
    //const CurrentComponent = componentSelector["Transactions"]

    const tabStyle = "text-2xl mx-1 px-2 py-1  border border-black rounded-md cursor-pointer"
    
    registerCharts();
    
    return (
        isLoaded && currentSession &&
        <UserProvider userId={currentSession.user.id}>
            <div>
                <NavBar user={currentSession?.user} />
                <div className="flex justify-end">
                    <div className=" border border-black p-2 m-3">
                        {Object.keys(componentSelector).map((tab) =>
                            <span
                                onClick={() => setPage(tab as Page)}
                                key={tab}
                                className={`${tabStyle} ${currentPage === tab ? "bg-gray-500" : ""}`}>
                                {tab}
                            </span>
                        )}
                    </div>

                </div>
                <div><CurrentComponent /></div>
            </div>
        </UserProvider>

    )
}