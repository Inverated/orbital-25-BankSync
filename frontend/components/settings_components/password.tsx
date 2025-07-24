import { supabase } from "@/lib/supabase";
import { checkPasswordRequirement } from "@/utils/passwordRequirement";
import { Alert } from "@mui/material";
import { LockKeyhole } from "lucide-react";
import { redirect } from "next/navigation";
import { useState } from "react"

export default function Password() {
    const [alertMessage, setAlertMessage] = useState('')
    const [alertSeverity, setAlertSeverity] = useState<"success" | "error" | "warning" | null>(null)

    const updatePasswordSimilarity = () => {
        const userPassword = document.getElementById('changePassword') as HTMLInputElement
        const confirmPassword = document.getElementById('confirmChangePassword') as HTMLInputElement

        if (confirmPassword.value != '' && userPassword.value != confirmPassword.value) {
            setAlertSeverity('error')
            setAlertMessage('Password do not match!')
        } else {
            setAlertMessage('')
        }
    }

    const updatePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setAlertMessage('')
        const userPassword = document.getElementById('changePassword') as HTMLInputElement
        const confirmPassword = document.getElementById('confirmChangePassword') as HTMLInputElement

        if (userPassword.value != confirmPassword.value) {
            return
        }

        const missingItem = checkPasswordRequirement(confirmPassword.value)
        if (missingItem) {
            setAlertSeverity('warning')
            setAlertMessage(missingItem)
            return
        }

        const { error: newPasswordError } = await supabase.auth.updateUser({
            password: confirmPassword.value
        })

        if (newPasswordError) {
            setAlertSeverity('error')
            setAlertMessage(newPasswordError.message)
        } else {
            setAlertSeverity('success')
            setAlertMessage('Password reset successful')
            await supabase.auth.signOut()
            redirect('/')
        }
    }

    return (
        <div className="px-7 py-4.5">
            <div className="text-2xl font-semibold">Change Password</div>
            <form>
                <div className="space-y-0.5">
                    <div className="mt-5">Change your password.</div>
                    <div className="text-red-400">Note: If signed up using OAuth, set password login here.</div>
                </div>
                <div className="pt-2">
                    <div className="my-2 flex border rounded-lg">
                        <LockKeyhole className="m-1.5" />
                        <input
                            type="password"
                            id='changePassword'
                            placeholder="Enter new password"
                            className="bg-transparent w-full"
                            onChange={updatePasswordSimilarity} />
                    </div>
                    <div className="my-2 flex border rounded-lg">
                        <LockKeyhole className="m-1.5" />
                        <input
                            type="password"
                            id='confirmChangePassword'
                            placeholder='Confirm new password'
                            className="bg-transparent w-full"
                            onChange={updatePasswordSimilarity} />
                    </div>
                </div>
                {alertMessage && alertSeverity && (
                    <Alert
                        sx={{
                            position: "static",
                            alignItems: "center",
                            display: "flex",
                            borderRadius: "12px",
                        }}
                        severity={alertSeverity}
                        className="mt-2"
                    >
                        <p id="message">{alertMessage}</p>
                    </Alert>
                )}
                <div className="flex justify-end">
                    <button
                        className="px-3 py-1.5 my-1 rounded-lg hover:cursor-pointer bg-green-500 hover:bg-green-600 active:bg-green-700 active:scale-97 text-white font-semibold tracking-wide transition"
                        type='submit'
                        onClick={(e) => updatePassword(e)}>
                        Update
                    </button>
                </div>
            </form>
        </div>
    )
}