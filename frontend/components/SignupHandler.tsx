import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { LockKeyhole, UserRound } from "lucide-react";
import { Alert } from "@mui/material";

export default function Signup() {
    const router = useRouter();
    const [showIncorrectConfirmPassword, setPasswordDifference] = useState(false)
    const [showSuccessfulSignup, setIsSuccess] = useState(false)

    const signupUser = async (event: FormEvent) => {
        event.preventDefault()

        if (showIncorrectConfirmPassword) return

        const userEmail = document.getElementById('email') as HTMLInputElement
        const userPassword = document.getElementById('password') as HTMLInputElement
        const confirmPassword = document.getElementById('confirmPassword') as HTMLInputElement

        if (userPassword.value != confirmPassword.value) {
            return
        }

        const { error } = await supabase.auth.signUp({
            email: userEmail.value,
            password: userPassword.value
        })

        if (error) {
            alert(error.message)
            return
        }

        setIsSuccess(true)
        setTimeout(() => router.push('/registration/login'), 2000)
    }

    const updatePasswordSimilarity = () => {
        const userPassword = document.getElementById('password') as HTMLInputElement
        const confirmPassword = document.getElementById('confirmPassword') as HTMLInputElement

        if (confirmPassword.value != '' && userPassword.value != confirmPassword.value) {
            setPasswordDifference(true)
        } else {
            setPasswordDifference(false)
        }
    }

    return (
        <div>
            <div className="text-center pt-7 pb-11">
                <h1 className="text-4xl font-sans font-bold tracking-wider">Get Started</h1>
            </div>
            
            <form onSubmit={signupUser}>
                <div className="relative w-full flex items-center pb-2">
                    <UserRound className="absolute left-1 top-5.5 text-gray-500" />
                    
                    <input
                        id="email"
                        type="email"
                        placeholder=" "
                        className="peer w-full border-b-2 border-gray-400 bg-transparent text-base
                            pl-10 pt-6 pb-1
                            focus:outline-none focus:border-black"
                    />

                    <label
                        htmlFor="email"
                        className="absolute left-10 text-gray-400 text-sm transition-all 
                            peer-placeholder-shown:top-6 peer-placeholder-shown:text-sm 
                            peer-focus:top-2 peer-focus:text-xs 
                            peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:text-xs"
                    >
                        Email address
                    </label>
                </div>
                
                <div className="relative w-full flex items-center pb-2">
                    <LockKeyhole className="absolute left-1 top-5.5 text-gray-500" />
                    
                    <input
                        id="password"
                        type="password"
                        placeholder=" "
                        className="peer w-full border-b-2 border-gray-400 bg-transparent text-base
                            pl-10 pt-6 pb-1
                            focus:outline-none focus:border-black"
                        onChange={updatePasswordSimilarity} 
                    />

                    <label
                        htmlFor="password"
                        className="absolute left-10 text-gray-400 text-sm transition-all 
                            peer-placeholder-shown:top-6 peer-placeholder-shown:text-sm 
                            peer-focus:top-2 peer-focus:text-xs 
                            peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:text-xs"
                    >
                        Create password
                    </label>
                </div>

                <div className="relative w-full flex items-center">
                    <LockKeyhole className="absolute left-1 top-5.5 text-gray-500" />

                    <input
                        id="confirmPassword"
                        type="password"
                        placeholder=" "
                        className="peer w-full border-b-2 border-gray-400 bg-transparent text-base
                            pl-10 pt-6 pb-1
                            focus:outline-none focus:border-black"
                        onChange={updatePasswordSimilarity} 
                    />
            
                    <label
                        htmlFor="confirmPassword"
                        className="absolute left-10 text-gray-400 text-sm transition-all 
                            peer-placeholder-shown:top-6 peer-placeholder-shown:text-sm 
                            peer-focus:top-2 peer-focus:text-xs 
                            peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:text-xs"
                    >
                        Confirm password
                    </label>
                </div>

                <div className="my-2 pb-4">
                    {
                        showIncorrectConfirmPassword &&
                        <Alert 
                            sx={{
                                position: "static",
                                alignItems: "center",
                                display: "flex",
                                borderRadius: "12px",
                            }}
                            severity="error"
                            className="mt-3"
                        >
                            <div className="font-bold text-sm">Error</div>
                            <div className="text-xs">Passwords do not match!</div>
                        </Alert>
                    }
                    {
                        showSuccessfulSignup &&
                        <Alert 
                            sx={{
                                position: "static",
                                alignItems: "center",
                                display: "flex",
                                borderRadius: "12px",
                            }}
                            severity="success"
                            className="mt-2"
                        >
                            <div className="font-bold text-sm">Success</div>
                            <div className="text-xs">Check your email to confirm your account.</div>
                        </Alert>
                    }
                </div>
                
                <div>
                    <button 
                        type='submit'
                        className="bg-green-500 hover:bg-green-600 active:bg-green-700 active:scale-95 w-full rounded-3xl text-white font-sans tracking-wide p-2 transition cursor-pointer"
                    >
                        Sign Up
                    </button>
                </div>
            </form>
        </div>
    )
}