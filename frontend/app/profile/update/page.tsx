'use client'

import { supabase } from '@/lib/supabase'
import { checkPasswordRequirement } from '@/utils/passwordRequirement'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { RiLockPasswordFill } from 'react-icons/ri'

export default function ResetPassword() {
    const [errorMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const newPassword = useRef<HTMLInputElement>(null)
    const confirmNewPassword = useRef<HTMLInputElement>(null)
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
            setErrorMessage(missing)
            return
        }

        const { data, error } = await supabase.auth.updateUser({ password: newPassword.current?.value })
        if (error) {
            if (error.name == 'AuthSessionMissingError') {
                setErrorMessage('Session expired, please submit another password reset request')
            } else {
                setErrorMessage(error.message)
            }
        } else if (data) {
            setErrorMessage('')
            setSuccessMessage('Password reset successful, redirecting to dashboard')
            setTimeout(() => router.push('/dashboard'), 2000)
            return
        }

    }

    const updatePasswordSimilarity = () => {
        if (confirmNewPassword.current?.value != '' && newPassword.current?.value != confirmNewPassword.current?.value) {
            setErrorMessage('Password do not match!')
        } else {
            setErrorMessage('Password do not match!')
        }
    }


    return (
        <div className="flex justify-center-safe items-center h-screen">
            <div>
                <div className="text-center">
                    <div className="text-3xl font-bold">Reset your password</div>
                </div>
                <form onSubmit={updatePassword}>
                    <div className="my-3 flex bg-gray-300 rounded-lg">
                        <RiLockPasswordFill className="text-2xl" />
                        <input
                            type="password"
                            id='newPassword'
                            placeholder="Enter new password"
                            className="mx-2 bg-transparent w-full"
                            onChange={updatePasswordSimilarity} />

                    </div>
                    <div className="my-3 flex bg-gray-300 rounded-lg">
                        <RiLockPasswordFill className="text-2xl" />
                        <input
                            type="password"
                            id='confirmNewPassword'
                            placeholder='Confirm your password'
                            className="mx-2 bg-transparent w-full"
                            onChange={updatePasswordSimilarity} />
                    </div>
                    <button type="submit" className="bg-black active:bg-gray-900 active:scale-95 w-full transition cursor-pointer text-white p-2 rounded-lg">
                        Update Password
                    </button>
                </form>
                <div className="my-2 text-sm w-sm">
                    <div hidden={errorMessage == ''} className="text-shadow-xm text-red-600">
                        {errorMessage}
                    </div>
                    <div hidden={successMessage == ''} className="text-shadow-xm text-green-600">
                        {successMessage}
                    </div>
                </div>
            </div>
        </div>
    )
}
