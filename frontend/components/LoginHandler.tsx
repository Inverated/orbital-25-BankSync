import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { CiUser } from "react-icons/ci";
import { RiLockPasswordFill } from "react-icons/ri";

export default function Login() {
    const router = useRouter()
    
    const loginUser = async (formData: FormData) => {
        const userEmail = formData.get('email') as string;
        const userPassword = formData.get('password') as string;

        const { error } = await supabase.auth.signInWithPassword({
            email: userEmail,
            password: userPassword
        })

        if (error) {
            alert(error.message)
            return
        }

        router.push('/dashboard')
    }

    return (
        <div>
            <div className="text-center py-4">
                <div className="text-6xl font-bold">Login</div>
            </div>
            <form action={loginUser}>
                <div className="my-2 flex bg-gray-300 rounded-lg">
                    <CiUser className="text-2xl" />
                    <input
                        id='loginEmailInput'
                        type="email"
                        name="email"
                        placeholder="example@email.com"
                        className="mx-2 bg-transparent w-full" />
                </div>
                <div className="my-2 flex bg-gray-300 rounded-lg">
                    <RiLockPasswordFill className="text-2xl" />
                    <input
                        type="password"
                        name="password"
                        placeholder="*****"
                        className="mx-2 bg-transparent w-full" />
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