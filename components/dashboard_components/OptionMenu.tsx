import supabase from "@/app/config/supabaseClient"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function OptionMenu() {
    const selection = ["Profile (WIP)", "Settings (WIP)", "Logout"] as const
    const router = useRouter()
    const [logoutDialogue, togglePopout] = useState(false)

    const logout = async () => {
        await supabase.auth.refreshSession();
        const { error } = await supabase.auth.signOut({
            scope: 'global',
        })

        if (error) {
            console.log(error.message)
        } else {
            router.push("/")
        }
    }

    type SelectionOption = typeof selection[number]
    const selectOption = (option: SelectionOption) => {
        switch (option) {
            case "Logout":
                togglePopout(true)
                break
            case "Profile (WIP)":
                break
            case "Settings (WIP)":
                break
            default:
                console.log("Unknown option")
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
            <div className="flex flex-col absolute right-0 mx-4 text-2xl border border-black px-2 py-4 bg-white w-[200px] rounded-lg">
                {selection.map((tab) =>
                    <span key={tab}
                        className="px-2 py-2 rounded-lg bg-white hover:bg-gray-400 hover:cursor-pointer active:bg-gray-500"
                        onClick={() => selectOption(tab)}>
                        {tab}
                    </span>
                )}
            </div>

            {logoutDialogue &&
                <div className="fixed inset-0 flex justify-center items-center z-50">
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full z-10">
                        <p className="text-xl font-semibold">Are you sure you want to logout?</p>
                        <div className="flex justify-end">
                            <button
                                onClick={() => {
                                    togglePopout(false)
                                }}
                                className="mt-7 border border-black m-2 p-2 rounded text-base flex justify-end hover:bg-gray-400 hover:cursor-pointer active:bg-gray-600 active:scale-95 transition"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => logout()}
                                className="mt-7 border border-black m-2 p-2 rounded text-base flex justify-end hover:bg-gray-400 hover:cursor-pointer active:bg-gray-600 active:scale-95 transition"
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