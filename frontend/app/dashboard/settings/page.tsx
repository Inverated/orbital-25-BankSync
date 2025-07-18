'use client'

import ConnectedAccount from "@/components/settings_components/connectedAccount";
import CustomFilter from "@/components/settings_components/customFilters";
import AccountSecurity from "@/components/settings_components/accountSecurity";
import Password from "@/components/settings_components/password";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";


export default function Settings() {
    const [sideMenuVisible, setSideMenuVisible] = useState(true)
    const [sessionLoaded, setSessionLoaded] = useState(false)

    type MENUOPTION = 'Password' | 'Filters' | 'Connected Account' | 'Account & Security'
    const selector: MENUOPTION[] = ['Password', 'Filters', 'Connected Account', 'Account & Security']
    const [currentTab, setCurrentTab] = useState<MENUOPTION>('Password')

    const router = useRouter()

    const componentSelector: Record<MENUOPTION, React.FC> = {
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
                    setSessionLoaded(true);
                }
            }
        );
    }, [])

    return (
        sessionLoaded && <div className="flex flex-col h-screen">
            <div className="min-h-1/10 border-b items-center py-7 px-4 flex justify-between">
                <div className="flex flex-row items-center">
                    <Menu onClick={() => setSideMenuVisible(!sideMenuVisible)} />
                    <p className="text-3xl px-4">Settings</p>
                </div>
                <X onClick={() => router.push('/dashboard')} className="hover:cursor-pointer" />
            </div>
            <div className="flex h-full">
                <div className="flex flex-col transition-all min-w-fit  border-r py-4 px-5 space-y-3 text-lg" hidden={!sideMenuVisible}>
                    {selector.map(option =>
                        <button
                            key={option}
                            className={"hover:cursor-pointer text-start " + (currentTab == option ? 'text-black' : 'text-gray-400')}
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

    )
}