import { supabase } from "@/lib/supabase";
import { checkPasswordRequirement } from "@/utils/passwordRequirement";
import { KeyRound } from "lucide-react";
import { redirect } from "next/navigation";
import { useState } from "react"

export default function Password() {
    const [errorMessage, setErrorMessage] = useState('')
    const [passwordResetSuccess, setPasswordResetSuccess] = useState(false)

    const updatePasswordSimilarity = () => {
        const userPassword = document.getElementById('changePassword') as HTMLInputElement
        const confirmPassword = document.getElementById('confirmChangePassword') as HTMLInputElement

        if (confirmPassword.value != '' && userPassword.value != confirmPassword.value) {
            setErrorMessage('Password do not match!')
        } else {
            setErrorMessage('')
        }
    }

    const updatePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrorMessage('')
        setPasswordResetSuccess(false)
        const userPassword = document.getElementById('changePassword') as HTMLInputElement
        const confirmPassword = document.getElementById('confirmChangePassword') as HTMLInputElement

        if (userPassword.value != confirmPassword.value) {
            return
        }

        const missingItem = checkPasswordRequirement(confirmPassword.value)
        if (missingItem) {
            setErrorMessage(missingItem)
            return
        }

        const { error: newPasswordError } = await supabase.auth.updateUser({
            password: confirmPassword.value
        })

        if (newPasswordError) {
            setErrorMessage(newPasswordError.message)
        } else {
            setPasswordResetSuccess(true)
            await supabase.auth.signOut()
            redirect('/')
        }
    }

    return (
        <div className="px-5 py-5">
            <div className="text-2xl">Change Password</div>
            <form className="space-y-2">
                <div>
                    <div className="mt-5">Change user password</div>
                    <div className="text-red-400">Note: If signed up using OAuth, set password login here</div>
                </div>
                <div>
                    <div className="my-2 flex border">
                        <KeyRound className="m-1" />
                        <input
                            type="password"
                            id='changePassword'
                            placeholder="Enter new password"
                            className="bg-transparent w-full"
                            onChange={updatePasswordSimilarity} />
                    </div>
                    <div className="my-2 flex border">
                        <KeyRound className="m-1" />
                        <input
                            type="password"
                            id='confirmChangePassword'
                            placeholder='Confirm your password'
                            className="bg-transparent w-full"
                            onChange={updatePasswordSimilarity} />
                    </div>
                </div>
                <div hidden={errorMessage == ''} className="text-shadow-xm text-red-600">
                    {errorMessage}
                </div>
                <div hidden={!passwordResetSuccess} className="text-shadow-xm text-green-600">
                    Password reset successful
                </div>
                <button
                    className="border rounded-lg justify-end w-fit px-3 py-1 my-3 hover:cursor-pointer active:scale-95"
                    type='submit'
                    onClick={(e) => updatePassword(e)}>
                    Update
                </button>
            </form>
        </div>
    )
}