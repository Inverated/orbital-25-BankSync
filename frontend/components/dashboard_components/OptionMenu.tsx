import { supabase } from "@/lib/supabase"
import { User } from "@supabase/supabase-js"
import { LogOut, Settings } from "lucide-react";
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface OptionMenuProps {
    user?: User;
};

export default function OptionMenu({ user }: OptionMenuProps) {
    const selection = [
        { label: "Settings", icon: <Settings className="" /> },
        { label: "Logout", icon: <LogOut className="" /> }
    ] as const
    const router = useRouter()
    const [logoutDialogue, togglePopout] = useState(false)

    const logout = async () => {
        await supabase.auth.refreshSession();
        const { error } = await supabase.auth.signOut({
            scope: 'global',
        })

        if (error) {
            console.error(error.message)
        } else {
            router.push("/")
        }
    }

    const selectOption = (label: string) => {
        switch (label) {
            case "Logout":
                togglePopout(true)
                break
            case "Settings":
                break
            default:
                console.error("Unknown option")
        }
    }

    const handleButtonDown = (event: KeyboardEvent) => {
        if (event.key == "Escape") {
            togglePopout(false)
        }
    }

    useEffect(() => {
        document.addEventListener('keydown', handleButtonDown)
        return () => {
            document.removeEventListener('keydown', handleButtonDown)
        }
    }, [])

    return (
        <div>            
            <div className="flex flex-col absolute -right-6 z-10 mt-3 origin-top-right rounded-2xl shadow-lg ring-1 ring-black/5 focus:outline-none bg-white px-4 py-4 text-2xl w-[250px]">
                {user?.email?.slice(0, user.email.indexOf('@')) &&
                    <p>{user?.email?.slice(0, user.email.indexOf('@'))}</p>                    
                }
                
                {user?.email && 
                    <p className="text-sm text-gray-500 mb-2">{user.email}</p>
                }

                <hr className="my-3 border-t border-gray-400" />
                
                {selection.map((tab) =>
                    <span key={tab.label}
                        className="flex flex-row items-center gap-3 px-3 py-2 rounded-lg bg-white hover:bg-gray-200 hover:cursor-pointer active:bg-gray-300 active:scale-95"
                        onClick={() => selectOption(tab.label)}>
                        {tab.icon}
                        {tab.label}
                    </span>
                )}
            </div>

            {logoutDialogue &&
                <div className="fixed inset-0 flex justify-center items-center z-50">
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <div className="bg-white p-8 shadow-lg w-1/4 z-10 rounded-2xl">
                        <p className="text-xl font-semibold">Are you sure you want to logout?</p>
                        
                        <div className="flex justify-end pt-6 gap-4">
                            <button
                                onClick={() => {
                                    togglePopout(false)
                                }}
                                className="bg-transparent hover:bg-gray-200 active:bg-gray-300 active:scale-95 rounded-lg font-sans font-semibold tracking-widest border px-3 py-2 transition cursor-pointer"
                            >
                                Close
                            </button>
                            <button
                                onClick={logout}
                                className="bg-transparent hover:bg-gray-200 active:bg-gray-300 active:scale-95 rounded-lg font-sans font-semibold tracking-widest border px-3 py-2 transition cursor-pointer"
                            >
                                Confirm
                            </button>
                        </div>

                    </div>
                </div>
            }
        </div>

    )
}