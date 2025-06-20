import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { CiUser } from "react-icons/ci";
import { RiLockPasswordFill } from "react-icons/ri";

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
        setTimeout(() => router.push('/login'), 2000)
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
            <div className="text-center py-4">
                <h1 className="text-6xl font-bold">Welcome</h1>
            </div>
            {/* use form instead of div onclick for keyboard accessibility*/}
            <form onSubmit={signupUser}>
                <div className="my-3 flex bg-gray-300 rounded-lg">
                    <CiUser className="text-2xl" />
                    <input
                        type="email"
                        id="email"
                        placeholder="example@email.com"
                        className="mx-2 bg-transparent w-full" />
                </div>
                <div className="my-3 flex bg-gray-300 rounded-lg">
                    <RiLockPasswordFill className="text-2xl" />
                    <input
                        type="password"
                        id='password'
                        placeholder="Enter new password"
                        className="mx-2 bg-transparent w-full"
                        onChange={updatePasswordSimilarity} />

                </div>
                <div className="my-3 flex bg-gray-300 rounded-lg">
                    <RiLockPasswordFill className="text-2xl" />
                    <input
                        type="password"
                        id='confirmPassword'
                        placeholder='Confirm your password'
                        className="mx-2 bg-transparent w-full"
                        onChange={updatePasswordSimilarity} />
                </div>
                <div className="my-2">
                    {
                        showIncorrectConfirmPassword &&
                        <div className="text-shadow-xm text-red-600">
                            Password do not match!
                        </div>
                    }
                    {
                        showSuccessfulSignup &&
                        <div className="text-sm text-green-600">
                            Signup successful. Check your email to confirm your account
                        </div>
                    }
                </div>
                <div>
                    <button type='submit'
                        className="bg-black active:bg-gray-900 active:scale-95 w-full 
                    transition cursor-pointer text-white p-2 rounded-lg">
                        Sign Up
                    </button>
                </div>
            </form>
        </div>
    )
}