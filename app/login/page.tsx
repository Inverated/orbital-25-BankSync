'use client'

//import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
    //const router = useRouter(); use to redirect to dashboard after signin

    const handleOAuthLogin = async (provider : 'github' | 'google') => {
        await supabase.auth.signInWithOAuth({ provider });
    };

    return (
        <div className="relative flex flex-col items-center justify-center h-screen">
            <div className="p-8">
                <p className="text-4xl">BankSync</p>
            </div>
            <div className="bg-white p-8 rounded shadow text-black">
                <div className="border-2 border-black px-5 py-3">
                    <button onClick={ () => handleOAuthLogin('github') }>
                        Sign in with GitHub
                    </button>
                </div>
                <div className="border-2 border-black px-5 py-3">
                    <button onClick={ () => handleOAuthLogin('google')}>
                        Sign in with Google
                    </button>
                </div>
            </div>
        </div>
    )
}