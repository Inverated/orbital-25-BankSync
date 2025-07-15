'use client'

import { useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { redirect, useRouter } from "next/navigation";
import { Session } from "@supabase/supabase-js";
import SignupHandler from "@/components/SignupHandler";
import { supabase } from "@/lib/supabase";
import { ChevronLeft } from "lucide-react";

export default function Signup() {
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
        const { error } = await supabase.auth.signInWithOAuth({
            provider: provider,
        });
        
        if (error) {
            console.error("OAuth error: " + error);
        }
    };

    const redirectToLogin = () => redirect('/registration/login')

    const externalAuthButtonStyle = "w-full my-3 p-2 flex hover:bg-gray-200 active:bg-gray-300 active:scale-95 cursor-pointer transition items-center justify-center border border-black rounded-xl"
    
    return (
        currentSession == null && sessionLoaded &&
        <div className="flex justify-center items-center h-screen bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/background.jpg')" }}
        >
            <div className="w-[600px] rounded-3xl shadow-xl bg-white p-10 flex flex-row gap-1">
                <div className="flex items-start justify-start w-[5%] pt-1">
                    <ChevronLeft
                        className="cursor-pointer transition" 
                        onClick={() => router.push('/')}
                    />
                </div>
                
                <div className="flex flex-col flex-grow w-[95%] pr-7 pt-3">
                    <SignupHandler />

                    <div className="flex flex-col items-center justify-center text-center pt-10 pb-1">
                        <p className="text-sans text-gray-500 tracking-wider text-sm">
                            Or sign up with
                        </p>
                    </div>

                    <div className="flex flex-row items-center justify-center gap-4">
                        <div className={externalAuthButtonStyle}
                            onClick={() => handleOAuthLogin('google')} >
                            <FcGoogle />
                            <span className="mx-2 font-sans font-semibold">Google</span>
                        </div>

                        <div className={externalAuthButtonStyle}
                            onClick={() => handleOAuthLogin('github')} >
                            <FaGithub />
                            <span className="mx-2 font-sans font-semibold">GitHub</span>
                        </div>
                    </div>

                    <div className="my-2 pt-20 text-sans text-sm text-gray-500 flex flex-col items-center justify-center cursor-pointer"
                        onClick={redirectToLogin}>
                        <p>Already have an account? <a className="font-semibold underline">Login</a></p>
                    </div>
                </div>
            </div>
        </div>
    )
}