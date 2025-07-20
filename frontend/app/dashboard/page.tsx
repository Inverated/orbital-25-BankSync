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

export default function Dashboard() {
    const [currentSession, setSession] = useState<Session | null>(null)
    const router = useRouter()
    const [sessionLoaded, setSessionLoaded] = useState(false)

    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange(
            (_, session) => {
                if (!session) {
                    router.push('/registration/login');
                } else {
                    setSession(session)
                    setSessionLoaded(true);
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

        return () => {
            authListener.subscription.unsubscribe()
        }
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
        <DatabaseProvider userId={currentSession.user.id}>
            <UserProvider userId={currentSession.user.id}>
                <div>
                    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50 flex flex-col px-40 pt-6 pb-4">
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

                    <div className="pt-44">
                        <CurrentComponent />
                    </div>
                </div>
            </UserProvider>
        </DatabaseProvider>
    )
}