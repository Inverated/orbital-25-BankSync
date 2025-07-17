import { supabase } from "@/lib/supabase"
import { redirect } from "next/navigation"
import { useState } from "react"

export default function DeleteAccount() {
    const [confirmDelete, setConfirmDelete] = useState(false)

    const checkConfirmDelete = (text: string) => {
        if (text == "DELETE MY ACCOUNT") {
            setConfirmDelete(true)
        } else {
            setConfirmDelete(false)
        }
    }

    const deleteAccount = async () => {
        if (confirmDelete) {
            const { data: { session } } = await supabase.auth.getSession()
            if (session) {
                const { error } = await supabase.functions.invoke('deleteUser', {
                    body: { userId: session.user.id },
                    headers: {
                        Authorization: `Bearer ${session.access_token}`,
                    },
                })
                if (error) {
                    console.error(error.message)
                } else {
                    await supabase.auth.signOut()
                    redirect('/')
                }
            }

        }
    }

    return (
        <div className="px-5 py-5 w-full">
            <div className="text-2xl">Delete Account</div>
            <div className="py-3">
                <div>Your account will be deleted, along with all its data</div>
                <div className="text-red-400">Warning: This action is not reversible</div>
            </div>
            <div className="flex flex-col">
                <div>
                    To verify, type <i className="select-none">DELETE MY ACCOUNT</i> below:
                </div>
                <input className="border min-w-1/4 max-w-fit px-2" onChange={(e) => checkConfirmDelete(e.target.value)} />
                <button className={"border rounded-lg text-white w-fit px-3 py-1 my-3 " +
                    (confirmDelete ? 'bg-red-600 hover:cursor-pointer active:bg-red-400 active:scale-95' : 'bg-red-300')}
                    onClick={deleteAccount}>
                    Delete
                </button>
            </div>
        </div>
    )
}