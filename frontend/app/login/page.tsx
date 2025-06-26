'use client'

import { useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { redirect, useRouter } from "next/navigation";
import { Session } from "@supabase/supabase-js";
import LoginHandler from "@/components/LoginHandler";
import { supabase } from "@/lib/supabase";

export default function Login() {
    const [currentSession, setSession] = useState<Session | null>(null)
    const [sessionLoaded, setLoadedStatus] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const getData = async () => {
            const { data, error } = await supabase.auth.getSession()
            if (error) {
                console.error(error.message)
            }

            if (data.session != null) {
                router.push('/dashboard')
            }
            setSession(data.session)
            setLoadedStatus(true)
        }
        getData()
    }, [router])

    const handleOAuthLogin = async (provider: 'github' | 'google') => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: provider,
        });

        if (error) {
            console.error("OAuth error: " + error);
        } else {
            console.log("OAuth data: " + data);
        }
    };

    const redirectToSignUp = () => redirect("/signup")

    const redirectToForgetPassword = () => {
        const emailLogin = document.getElementById('loginEmailInput') as HTMLInputElement
        const message = emailLogin.value == '' ? '' : '?email='+emailLogin.value 
        router.push('/forgetpassword' + message)
    }

    const externalAuthButtonStyle = "my-4 p-2 flex hover:bg-gray-400 active:bg-gray-500 active:scale-95 cursor-pointer transition items-center justify-center border border-black rounded-lg"
    
    return (
        <div className={(currentSession == null && sessionLoaded ? '' : 'hidden ') + "flex justify-center items-center h-screen"}>
            <div className="w-[400]">
                <LoginHandler />

                <div className="my-2 text-sm flex justify-between cursor-pointer"
                    onClick={redirectToSignUp}>
                    <p>Don&#39;t have an account?</p>
                    <span className="font-semibold underline">
                        Signup
                    </span>
                </div>

                <div className="my-2 text-sm flex cursor-pointer"
                    onClick={redirectToForgetPassword}>
                    <span className="font-semibold underline ml-auto">
                        Forgot your password?
                    </span>
                </div>

                <div className="flex items-center">
                    <hr className="w-full" />
                    <p className="shrink-0">Login with others</p>
                    <hr className="w-full" />
                </div>

                <div className={externalAuthButtonStyle}
                    onClick={() => handleOAuthLogin('google')} >
                    <FcGoogle />
                    <span className="mx-2">Sign in with Google</span>
                </div>
                <div className={externalAuthButtonStyle}
                    onClick={() => handleOAuthLogin('github')} >
                    <FaGithub />
                    <span className="mx-2">Sign in with GitHub</span>
                </div>
            </div>
        </div>
    )


}
