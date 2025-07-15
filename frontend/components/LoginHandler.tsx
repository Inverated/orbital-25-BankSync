import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { UserRound, LockKeyhole } from "lucide-react";
import { useState } from "react";

export default function Login() {
    const router = useRouter()
    const [savedEmail, setEmail] = useState('')
    
    const loginUser = async (formData: FormData) => {
        const userEmail = formData.get('email') as string;
        const userPassword = formData.get('password') as string;

        const { error } = await supabase.auth.signInWithPassword({
            email: userEmail,
            password: userPassword
        })
        
        setEmail(userEmail)

        if (error) {
            alert(error.message)
            return
        }

        router.push('/dashboard')
    }

    const redirectToForgetPassword = () => {
        const emailLogin = document.getElementById('loginEmailInput') as HTMLInputElement
        const message = emailLogin.value == '' ? '' : '?email=' + emailLogin.value
        router.push('/forgetpassword' + message)
    }

    return (
        <div>
            <div className="text-center pt-7 pb-11">
                <div className="text-4xl font-sans font-bold tracking-wider">Login</div>
            </div>

            <form action={loginUser}>
                <div className="relative w-full flex items-center pb-2">
                    <UserRound className="absolute left-1 top-5.5 text-gray-500" />

                    <input
                        id='loginEmailInput'
                        type="email"
                        name="email"
                        defaultValue={savedEmail}
                        placeholder=" "
                        className="peer w-full border-b-2 border-gray-400 bg-transparent text-base
                            pl-10 pt-6 pb-1
                            focus:outline-none focus:border-black" 
                    />
                    
                    <label
                        htmlFor="loginEmailInput"
                        className="absolute left-10 text-gray-400 text-sm transition-all 
                            peer-placeholder-shown:top-6 peer-placeholder-shown:text-sm 
                            peer-focus:top-2 peer-focus:text-xs 
                            peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:text-xs"
                    >
                        Email address
                    </label>
                </div>
                
                <div className="relative w-full flex items-center">
                    <LockKeyhole className="absolute left-1 top-5.5 text-gray-500" />

                    <input
                        id='loginPasswordInput'
                        type="password"
                        name="password"
                        placeholder=" "
                        className="peer w-full border-b-2 border-gray-400 bg-transparent text-base
                            pl-10 pt-6 pb-1
                            focus:outline-none focus:border-black" 
                    />
                    
                    <label
                        htmlFor="loginPasswordInput"
                        className="absolute left-10 text-gray-400 text-sm transition-all 
                            peer-placeholder-shown:top-6 peer-placeholder-shown:text-sm 
                            peer-focus:top-2 peer-focus:text-xs 
                            peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:text-xs"
                    >
                        Password
                    </label>
                </div>

                <div className="my-2 flex cursor-pointer pb-4"
                    onClick={redirectToForgetPassword}>
                    <span className="ml-auto text-sans text-sm text-gray-500 tracking-wider">
                        Forgot your password?
                    </span>
                </div>

                <div>
                    <button 
                        type="submit" 
                        className="bg-green-500 hover:bg-green-600 active:bg-green-700 active:scale-95 w-full rounded-3xl text-white font-sans tracking-wide p-2 transition cursor-pointer"
                    >
                        Login
                    </button>
                </div>
            </form>
        </div>
    )
}