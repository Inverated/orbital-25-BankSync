import supabase from "@/app/config/supabaseClient"
import { useRouter } from "next/navigation"

export default function OptionMenu() {
    const selection = ["Profile", "Settings", "Logout"] as const
    const router = useRouter()

    const logout = async () => {
        const { error } = await supabase.auth.signOut()

        if (error) {
            alert(error.message)
        } else {
            router.push("/registration")
        }
    }

    type SelectionOption = typeof selection[number]
    const selectOption = (option: SelectionOption) => {
        switch (option) {
            case "Logout":
                logout()
                break
            case "Profile":
                break
            case "Settings":
                break
            default:
                console.log("Unknown option")
        }
    }

    return (
        <div className="flex flex-col absolute right-0 mx-4 text-2xl border border-black px-2 py-2 bg-white w-[200] rounded-lg">
            {selection.map((tab) =>
                <span key={tab}
                    className="px-2 py-2 rounded-lg bg-white hover:bg-gray-400 hover:cursor-pointer active:bg-gray-500"
                    onClick={() => selectOption(tab)}>
                    {tab}
                </span>
            )}
        </div>
    )
}