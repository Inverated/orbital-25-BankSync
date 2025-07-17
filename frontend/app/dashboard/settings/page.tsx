'use client'

import ConnectedAccount from "@/components/settings_components/connectedAccount";
import CustomFilter from "@/components/settings_components/customFilters";
import DeleteAccount from "@/components/settings_components/deleteAccount";
import Password from "@/components/settings_components/password";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";


export default function Settings() {
    const [sideMenuVisible, setSideMenuVisible] = useState(true)

    type MENUOPTION = 'Password' | 'Filters' | 'Connected Account' | 'Delete Account'
    const selector:MENUOPTION[] = ['Password', 'Filters', 'Connected Account', 'Delete Account']
    const [currentTab, setCurrentTab] = useState<MENUOPTION>('Password')
    
    const router = useRouter()

    const componentSelector: Record<MENUOPTION, React.FC> = {
            "Password": Password,
            "Filters": CustomFilter,
            "Connected Account": ConnectedAccount,
            "Delete Account": DeleteAccount,
        } as const
    
    const CurrentComponent = componentSelector[currentTab]

    return (
        <div className="flex flex-col h-screen">
            <div className="min-h-1/10 border-b items-center py-7 px-4 flex justify-between">
                <div className="flex flex-row items-center">
                    <Menu onClick={() => setSideMenuVisible(!sideMenuVisible)}/>
                    <p className="text-3xl px-4">Settings</p>
                </div>
                <X onClick={() => router.push('/dashboard')} className="hover:cursor-pointer"/>
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