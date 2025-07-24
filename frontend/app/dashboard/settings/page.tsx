'use client'

import ConnectedAccount from "@/components/settings_components/connectedAccount";
import CustomFilter from "@/components/settings_components/customFilters";
import AccountSecurity from "@/components/settings_components/accountSecurity";
import Password from "@/components/settings_components/password";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ProfileProvider } from "@/context/ProfileContext";
import { Session } from "@supabase/supabase-js";
import { UserProvider } from "@/context/UserContext";
import { DatabaseProvider } from "@/context/DatabaseContext";
import Username from "@/components/settings_components/username";


export default function Settings() {
    const [sideMenuVisible, setSideMenuVisible] = useState(true)
    const [currentSession, setSession] = useState<Session | null>(null)
    const [sessionLoaded, setSessionLoaded] = useState(false)

    type MENUOPTION = 'Username' | 'Password' | 'Filters' | 'Connected Account' | 'Account & Security'
    const selector: MENUOPTION[] = ['Username', 'Password', 'Filters', 'Connected Account', 'Account & Security']
    const [currentTab, setCurrentTab] = useState<MENUOPTION>('Username')

    const router = useRouter()

    const componentSelector: Record<MENUOPTION, React.FC> = {
        "Username": Username,
        "Password": Password,
        "Filters": CustomFilter,
        "Connected Account": ConnectedAccount,
        'Account & Security': AccountSecurity,
    } as const

    const CurrentComponent = componentSelector[currentTab]

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
        )
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

    }, [currentTab])

    return (
        sessionLoaded && currentSession &&
        <ProfileProvider userId={currentSession.user.id}>
            <DatabaseProvider userId={currentSession.user.id}>
                <UserProvider userId={currentSession.user.id}>
                    <div className="flex flex-col h-screen">
                        <div className="h-20 border-b border-b-gray-300 border-b-2 items-center py-7 px-5 pr-6 flex justify-between">
                            <div className="flex flex-row items-center">
                                <Menu className="hover:cursor-pointer" onClick={() => setSideMenuVisible(!sideMenuVisible)} />
                                <p className="text-3xl px-4 font-bold tracking-wide">Settings</p>
                            </div>
                            <X onClick={() => router.push('/dashboard')} className="hover:cursor-pointer" />
                        </div>
                        <div className="flex h-auto">
                            <div className="flex flex-col transition-all min-w-fit min-h-screen border-r border-r-gray-300 border-r-2 py-4 px-4 space-y-1 text-lg" hidden={!sideMenuVisible}>
                                {selector.map(option =>
                                    <button
                                        key={option}
                                        className={"hover:cursor-pointer hover:bg-gray-200 rounded-lg px-3 py-1 text-start " + (currentTab == option ? 'text-green-500' : 'text-gray-500')}
                                        onClick={() => setCurrentTab(option)}>
                                        {option}
                                    </button>
                                )}
                            </div>
                            <div className="flex w-full">
                                <CurrentComponent />
                            </div>
                        </div>
                    </div>
                </UserProvider>
            </DatabaseProvider>
        </ProfileProvider>
    )
}