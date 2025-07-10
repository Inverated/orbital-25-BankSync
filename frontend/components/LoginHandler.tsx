import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { UserRoundPen, KeyRound } from "lucide-react";
import { useEffect, useState } from "react";

export default function Login() {
    const router = useRouter()
    const [savedEmail, setEmail] = useState('')
    const [rememberMe, setRememberMe] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const loginUser = async (formData: FormData) => {
        const userEmail = formData.get('email') as string;
        const userPassword = formData.get('password') as string;

        const { error } = await supabase.auth.signInWithPassword({
            email: userEmail,
            password: userPassword
        })

        setEmail(userEmail)

        if (error) {
            setErrorMessage(error.message)
            return
        }

        router.push('/dashboard')
    }

    useEffect(() => {
        localStorage.setItem('rememberMe', '' + rememberMe)
    }, [rememberMe])

    const redirectToForgetPassword = () => {
        const emailLogin = document.getElementById('loginEmailInput') as HTMLInputElement
        const message = emailLogin.value == '' ? '' : '?email=' + emailLogin.value
        router.push('/forgetpassword' + message)
    }

    return (
        <div>
            <div className="text-center py-4">
                <div className="text-6xl font-bold">Login</div>
            </div>
            <form action={loginUser}>
                <div className="my-2 flex bg-gray-300 rounded-lg">
                    <UserRoundPen className="m-1" />
                    <input
                        id='loginEmailInput'
                        type="email"
                        name="email"
                        defaultValue={savedEmail}
                        placeholder="example@email.com"
                        className="bg-transparent w-full" />
                </div>
                <div className="my-2 flex bg-gray-300 rounded-lg">
                    <KeyRound className="m-1" />
                    <input
                        type="password"
                        name="password"
                        placeholder="*****"
                        className="bg-transparent w-full" />
                </div>
                <div className="text-sm flex justify-between my-3">
                    <label className="flex space-x-1">
                        <input
                            type='checkbox'
                            checked={rememberMe}
                            onChange={() => setRememberMe(!rememberMe)}
                        />
                        <p>Keep me signed in</p>
                    </label>
                    <div className="cursor-pointer"
                        onClick={redirectToForgetPassword}>
                        <span className="font-semibold underline ml-auto">
                            Forgot your password?
                        </span>
                    </div>
                </div>
                <div hidden={errorMessage == ''} className="text-shadow-xm text-red-600">
                    {errorMessage}
                </div>
                <div>
                    <button type="submit" className="bg-black active:bg-gray-900 active:scale-95 w-full transition cursor-pointer text-white p-2 rounded-lg">
                        Login
                    </button>
                </div>
            </form>
        </div>
    )
}