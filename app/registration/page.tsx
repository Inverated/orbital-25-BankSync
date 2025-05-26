'use client'

import { useState } from "react";
import Login from "@/components/Login";
import Signup from "@/components/Signup";
import supabase from "../config/supabaseClient";
import { FaGithub } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa";

export default function Registration() {
    //switch btw login and signup
    const [isLogin, setIsLogin] = useState(false);

    const handleOAuthLogin = async (provider: 'github' | 'google') => {
        const { data, error } = await supabase.auth.signInWithOAuth({ provider });

        if (error) {
            console.error("OAuth error: " + error);
        } else {
            console.log("OAuth data: " + data);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="w-[400]">
                {isLogin ? <Login /> : <Signup />}

                <div className="my-2 text-sm flex justify-between cursor-pointer"
                    onClick={() => setIsLogin(!isLogin)}>
                    <p>{!isLogin ? "Already have an account?" : "Don't have an account?"}</p>
                    <span className="font-semibold underline">
                        {!isLogin ? "Login" : "Signup"}
                    </span>
                </div>

                <div className="my-2 text-sm flex cursor-pointer">
                    <span className="font-semibold underline ml-auto">
                        Forgot your password?
                    </span>
                </div>

                <div className="flex items-center">
                    <hr className="w-full" />
                    <p className="shrink-0">Login with others</p>
                    <hr className="w-full" />
                </div>

                <div className="my-4 p-2 flex hover:bg-gray-400 active:bg-gray-500 active:scale-95 cursor-pointer transition 
                    items-center justify-center border border-black rounded-lg"
                    onClick={() => handleOAuthLogin('google')} >
                    <FaGoogle />
                    <span className="mx-2">Sign in with Google</span>
                </div>
                <div className="my-4 p-2 flex hover:bg-gray-400 active:bg-gray-500 active:scale-95 cursor-pointer transition 
                    items-center justify-center border border-black rounded-lg"
                    onClick={() => handleOAuthLogin('github')} >
                    <FaGithub />
                    <span onClick={() => handleOAuthLogin('github')} className="mx-2">Sign in with GitHub</span>
                </div>
            </div>
        </div>
    )


}