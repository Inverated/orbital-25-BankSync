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
import Image from "next/image";
import TabsBar, { Page } from "@/components/dashboard_components/TabsBar";
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
            })

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

    const componentSelector: Record<Page, React.FC> = {
        Overview,
        Accounts,
        Transactions,
        Analytics,
    }

    const [currentPage, setPage] = useState<Page>("Overview")
    const CurrentComponent = componentSelector[currentPage]

    registerCharts();

    return (
        sessionLoaded && currentSession &&
        <ProfileProvider userId={currentSession.user.id}>
            <DatabaseProvider userId={currentSession.user.id}>
                <UserProvider userId={currentSession.user.id}>
                    <div className="flex flex-col">
                        <header className="bg-white shadow-md z-50 flex flex-col pt-6 pb-4 mb-2 transition-all lg:px-40 md:px-25 not-lg:px-12">
                            <div className="w-full flex flex-row justify-between items-center">
                                <div>
                                    <Image src="/logo.png" alt="BankSync" width={250} height={125} />
                                </div>

                                <div className="py-2">
                                    <NavBar user={currentSession?.user} />
                                </div>
                            </div>

                            <div className="flex justify-end pt-2">
                                <div className="w-fit rounded-xl px-1 pl-3 py-3 bg-gray-100 flex flex-row items-center">
                                    <TabsBar currentPage={currentPage} setPage={setPage} />
                                </div>
                            </div>
                        </header>
                        <div>
                            <CurrentComponent />
                        </div>
                    </div>
                </UserProvider>
            </DatabaseProvider>
        </ProfileProvider>
    )
}