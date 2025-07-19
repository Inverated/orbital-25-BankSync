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
import { DatabaseProvider } from "@/context/DatabaseContext";
import { ProfileProvider } from "@/context/ProfileContext";


export default function Dashboard() {
    const [currentSession, setSession] = useState<Session | null>(null)
    const router = useRouter()
    const [sessionLoaded, setSessionLoaded] = useState(false)

    useEffect(() => {
        supabase.auth.onAuthStateChange(
            (_, session) => {
                if (!session) {
                    router.push('/registration/login');
                } else {
                    setSession(session)
                    setSessionLoaded(true);
                }
            }
        }
    );

        supabase.auth.getSession()
            .then(({ data: { session }, error }) => {
                if (!session) {
                    router.push('/registration/login')
                } else {
                    setSession(session)
                    setSessionLoaded(true)
                }
                if (error) console.error(error)
            })

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

    const tabStyle = "sm:text-2xl text-xl mx-1 sm:px-2 px-0.5 transition-all py-1 border-b-2 cursor-pointer"

    registerCharts();

    return (
        sessionLoaded && currentSession &&
        <ProfileProvider userId={currentSession.user.id}>
            <DatabaseProvider userId={currentSession.user.id}>
                <UserProvider userId={currentSession.user.id}>
                    <div>
                        <NavBar user={currentSession?.user} />
                        <div className="flex justify-end">
                            <div className="p-2 m-3 transition">
                                {Object.keys(componentSelector).map((tab) =>
                                    <button
                                        onClick={() => setPage(tab as Page)}
                                        key={tab}
                                        className={`${tabStyle} ${currentPage === tab ? " border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-blue-600"}`}>
                                        {tab}
                                    </button>
                                )}
                            </div>

                        </div>
                        <div><CurrentComponent /></div>
                    </div>
                </UserProvider>
            </DatabaseProvider>
        </ProfileProvider>
    )
}