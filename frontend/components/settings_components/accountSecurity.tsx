import { supabase } from "@/lib/supabase"
import { Session } from "@supabase/supabase-js"
import { redirect } from "next/navigation"
import { useEffect, useState } from "react"

export default function AccountSecurity() {
    const [currSession, setCurrSession] = useState<Session | null>(null)
    const [confirmDeleteAccount, setConfirmDeleteAccount] = useState(false)
    const [confirmDeleteData, setConfirmDeleteData] = useState(false)

    const checkConfirmDeleteAccount = (text: string) => {
        if (text == "DELETE MY ACCOUNT") {
            setConfirmDeleteAccount(true)
        } else {
            setConfirmDeleteAccount(false)
        }
    }

    const checkConfirmDeleteData = (text: string) => {
        if (text == "DELETE MY DATA") {
            setConfirmDeleteData(true)
        } else {
            setConfirmDeleteData(false)
        }
    }

    const deleteAccount = async () => {
        if (confirmDeleteAccount && currSession) {
            const { error } = await supabase.functions.invoke('deleteUser', {
                body: { userId: currSession.user.id },
                headers: {
                    Authorization: `Bearer ${currSession.access_token}`,
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

    const deleteData = async () => {
        if (confirmDeleteData && currSession) {
            const { error: deleteTransError } = await supabase.from('encryptedTransactionDetails')
                .delete()
                .eq('user_id', currSession.user.id)
            if (deleteTransError) {
                console.error(deleteTransError.message)
            }
            
            const { error: deleteAccError } = await supabase.from('encryptedAccountDetails')
                .delete()
                .eq('user_id', currSession.user.id)
            if (deleteAccError) {
                console.error(deleteAccError.message)
            }
            redirect('/dashboard')
        }
    }

    useEffect(() => {
        const initialise = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            setCurrSession(session)
        }
        initialise()
    }, [])

    return (
        <div className="px-5 py-5 w-full space-y-5">
            <div>
                <div className="text-2xl">Delete Data</div>
                <div className="py-3">
                    <div>Clear all bank account and transaction data</div>
                    <div className="text-red-400">Warning: This action is not reversible</div>
                </div>
                <div className="flex flex-col">
                    <div>
                        To verify, type <i className="select-none">DELETE MY DATA</i> below:
                    </div>
                    <input className="border min-w-1/4 max-w-fit px-2" onChange={(e) => checkConfirmDeleteData(e.target.value)} />
                    <button className={"border rounded-lg text-white w-fit px-3 py-1 my-3 " +
                        (confirmDeleteData ? 'bg-red-600 hover:cursor-pointer active:bg-red-400 active:scale-95' : 'bg-red-300')}
                        onClick={deleteData}>
                        Delete
                    </button>
                </div>
            </div>
            <div>
                <div className="text-2xl">Delete Account</div>
                <div className="py-3">
                    <div>Your account will be deleted, along with all its data</div>
                    <div className="text-red-400">Warning: This action is not reversible</div>
                </div>
                <div className="flex flex-col">
                    <div>
                        To verify, type <i className="select-none">DELETE MY ACCOUNT</i> below:
                    </div>
                    <input className="border min-w-1/4 max-w-fit px-2" onChange={(e) => checkConfirmDeleteAccount(e.target.value)} />
                    <button className={"border rounded-lg text-white w-fit px-3 py-1 my-3 " +
                        (confirmDeleteAccount ? 'bg-red-600 hover:cursor-pointer active:bg-red-400 active:scale-95' : 'bg-red-300')}
                        onClick={deleteAccount}>
                        Delete
                    </button>
                </div>
            </div>

        </div>
    )
}