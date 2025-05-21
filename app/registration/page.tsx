'use client'

import { useState } from "react";
import Login from "@/components/Login";
import Signup from "@/components/Signup";
import { useRouter } from "next/navigation";
//import { supabase } from "@/lib/supabase";
import { FaGithub } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa";

export default function Registration() {
    //use to redirect to dashboard after signin
    const router = useRouter(); 

    //switch btw login and signup
    const [isLogin, setIsLogin] = useState(false);

    /* const handleOAuthLogin = async (provider: 'github') => {
        await supabase.auth.signInWithOAuth({ provider });
    }; */

    return (
        <div className="flex justify-center items-center h-screen">
            <div>
                {isLogin ? <Login /> : <Signup />}
                
                <div className="my-2 text-sm flex justify-between">
                    <p>{isLogin ? "Already have an account?" : "Don't have an account?" }</p>
                    <button onClick={() => setIsLogin(!isLogin)} className="font-semibold underline"> 
                        {isLogin ? "Login" : "Signup"}
                    </button>
                </div>

                <div className="flex items-center">
                    <hr className="w-full" />
                    <p className="shrink-0">Login with others</p>
                    <hr className="w-full" />
                </div>

                <div className="my-4 p-2 flex items-center justify-center border border-black rounded-lg">
                    <FaGoogle />
                    <p className="mx-2">Sign in with Google</p>
                </div>
                <div className="my-4 p-2 flex items-center justify-center border border-black rounded-lg">
                    <FaGithub />
                    <button onClick={() => router.push("/")} className="mx-2">Sign in with GitHub</button>
                </div>
            </div>
        </div>
    )
}