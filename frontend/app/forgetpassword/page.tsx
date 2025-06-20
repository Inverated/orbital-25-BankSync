'use client'

import { supabase } from "@/lib/supabase";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react"
import { CiUser } from "react-icons/ci";

export default function ForgetPassword() {
    const emailInput = useRef<HTMLInputElement>(null)
    const searchParams = useSearchParams();
    const messageElement = useRef<HTMLElement>(null)


    useEffect(() => {
        const email = searchParams.get('email');
        messageElement.current = document.getElementById('message')
        if (emailInput.current) emailInput.current.value = email ? email : ''
    }, [searchParams])

    const forgetPassword = async () => {
        if (emailInput.current && emailInput.current.value != '') {
            const { data, error } = await supabase
                .auth
                .resetPasswordForEmail(emailInput.current.value)
            if (error) {
                if (messageElement.current) {
                    messageElement.current.textContent = error.message
                }
                console.error(error)
            } else if (data) {
                if (messageElement.current) {
                    messageElement.current.textContent = 'Password reset successful, please check your inbox at ' +
                        emailInput.current.value
                }
            }
            
        } else {
            if (messageElement.current) {
                messageElement.current.textContent = 'Please input a valid email address'
            }
        }
    }

    return (
        <div className="flex justify-center-safe items-center h-screen">
            <div>
                <div className="text-center">
                    <div className="text-3xl font-bold">Forget your password</div>
                    <span>You will receive an email to reset your password</span>
                </div>
                <form action={forgetPassword}>
                    <div className="my-3 flex bg-gray-300 rounded-lg">
                        <CiUser className="text-2xl" />
                        <input
                            type="email"
                            name="forgetPasswordEmail"
                            placeholder="example@email.com"
                            ref={emailInput}
                            className="mx-2 bg-transparent w-full" />
                    </div>
                    <div>
                        <button type="submit" className="bg-black active:bg-gray-900 active:scale-95 w-full transition cursor-pointer text-white p-2 rounded-lg">
                            Confirm
                        </button>
                    </div>
                </form>
                <div className="my-2 text-sm w-sm">
                    <p id='message'></p>
                </div>
            </div>
        </div>
    )


}