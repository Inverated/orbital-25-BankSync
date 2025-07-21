'use client'

import { supabase } from '@/lib/supabase'
import { Alert } from '@mui/material'
import { LockKeyhole } from 'lucide-react'
import { checkPasswordRequirement } from '@/utils/passwordRequirement'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export default function ResetPassword() {
    const newPassword = useRef<HTMLInputElement>(null)
    const confirmNewPassword = useRef<HTMLInputElement>(null)
    const [alertMessage, setAlertMessage] = useState("")
    const [alertSeverity, setAlertSeverity] = useState<"success" | "error" | "warning" | null>(null)

    const router = useRouter()

    useEffect(() => {
        const getTokens = (): { access_token: string | null, refresh_token: string | null } => {
            newPassword.current = document.getElementById('newPassword') as HTMLInputElement
            confirmNewPassword.current = document.getElementById('confirmNewPassword') as HTMLInputElement

            const hash = window.location.hash
            const hashParams = new URLSearchParams(hash.substring(1))
            const access_token = hashParams.get('access_token')
            const refresh_token = hashParams.get('refresh_token')
            return { access_token: access_token, refresh_token: refresh_token }
        }

        const { access_token, refresh_token } = getTokens()

        if (access_token && refresh_token) {
            supabase.auth.setSession({
                access_token: access_token,
                refresh_token: refresh_token
            })
        }
    }, [])

    const updatePassword = async (e: React.FormEvent) => {
        e.preventDefault()

        const userPassword = document.getElementById('newPassword') as HTMLInputElement
        const confirmPassword = document.getElementById('confirmNewPassword') as HTMLInputElement

        if (userPassword.value != confirmPassword.value) {
            return
        }

        const missing = checkPasswordRequirement(confirmPassword.value)
        if (missing) {
            setAlertSeverity("error")
            setAlertMessage(missing)
            return
        }

        const { data, error } = await supabase.auth.updateUser({ password: newPassword.current?.value })
        if (error) {
            setAlertSeverity("warning")

            if (error.name == 'AuthSessionMissingError') {
                setAlertMessage('Session expired. Please submit another password reset request')
            } else {
                setAlertMessage(error.message)
            }
        } else if (data) {
            setAlertSeverity("success")
            setAlertMessage('Password reset successful. Redirecting to login...')
            setTimeout(() => router.push('/registration/login'), 2000)
            return
        }

    }

    const updatePasswordSimilarity = () => {
        if (confirmNewPassword.current?.value != '' && newPassword.current?.value != confirmNewPassword.current?.value) {
            setAlertSeverity("error")
            setAlertMessage('Password do not match!')
        } else {
            setAlertMessage('')
        }
    }

    return (
        <div
            className="flex justify-center items-center h-screen bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage: "url('/background.jpg')",
            }}
        >
            <div className="w-[600px] rounded-3xl shadow-xl bg-white p-10 flex flex-col px-17.5">
                <div className="text-center pt-7 pb-11">
                    <div className="text-4xl font-sans font-bold tracking-wider">Reset Password</div>
                </div>

                <form onSubmit={updatePassword}>
                    <div className="relative w-full flex items-center pb-3">
                        <LockKeyhole className="absolute left-1 top-5.5 text-gray-500" />

                        <input
                            id="newPassword"
                            type="password"
                            placeholder=" "
                            className="peer w-full border-b-2 border-gray-400 bg-transparent text-base
                                pl-10 pt-6 pb-1
                                focus:outline-none focus:border-black"
                            onChange={updatePasswordSimilarity}
                        />

                        <label
                            htmlFor="newPasword"
                            className="absolute left-10 text-gray-400 text-sm transition-all 
                            peer-placeholder-shown:top-6 peer-placeholder-shown:text-sm 
                            peer-focus:top-2 peer-focus:text-xs 
                            peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:text-xs"
                        >
                            Enter new password
                        </label>
                    </div>

                    <div className="relative w-full flex items-center">
                        <LockKeyhole className="absolute left-1 top-5.5 text-gray-500" />

                        <input
                            id="confirmNewPassword"
                            type="password"
                            placeholder=" "
                            className="peer w-full border-b-2 border-gray-400 bg-transparent text-base
                                pl-10 pt-6 pb-1
                                focus:outline-none focus:border-black"
                            onChange={updatePasswordSimilarity}
                        />

                        <label
                            htmlFor="confirmNewPassword"
                            className="absolute left-10 text-gray-400 text-sm transition-all 
                            peer-placeholder-shown:top-6 peer-placeholder-shown:text-sm 
                            peer-focus:top-2 peer-focus:text-xs 
                            peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:text-xs"
                        >
                            Confirm new password
                        </label>
                    </div>
                </form>
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
                </div>

                <div>
                    <button
                        type="submit"
                        className="bg-green-500 hover:bg-green-600 active:bg-green-700 active:scale-95 w-full rounded-3xl text-white font-sans tracking-wide p-2 transition cursor-pointer"
                    >
                        Update Password
                    </button>
                </div>
                <button className="my-2 pt-20 text-sans text-sm text-gray-500 flex flex-col items-center justify-center cursor-pointer"
                    onClick={() => router.push('/registration/login')}>
                    <p>Back to <a className="font-semibold underline">Login</a></p>
                </button>

                <button className="pb-2 text-sans text-sm text-gray-500 flex flex-col items-center justify-center cursor-pointer"
                    onClick={() => router.push('/forgetpassword')}>
                    <p>Back to <a className="font-semibold underline">Forget Password</a></p>
                </button>
            </div>
    )
}
