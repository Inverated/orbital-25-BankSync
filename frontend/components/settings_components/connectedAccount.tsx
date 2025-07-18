import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa"
import { FcGoogle } from "react-icons/fc"

export default function ConnectedAccount() {
    const externalAuthButtonStyle = "w-full my-4 p-2 flex hover:bg-gray-400 active:bg-gray-500 active:scale-95 cursor-pointer transition items-center justify-center border border-black rounded-lg"
    const [connectedAcc, setConnectedAcc] = useState<string[]>([])

    const handleOAuthLogin = async (provider: 'github' | 'google') => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: provider,
        });

        if (error) {
            console.error("OAuth error: " + error.message);
        }
    };

    useEffect(() => {
        const initialise = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setConnectedAcc(user?.app_metadata.providers)
        }
        initialise()
    }, [])

    return (
        <div className="px-5 py-5">
            <div className="text-2xl">Connected Account</div>
            <div>
                <div className="mt-5">Link to account with the same email address</div>
                <button
                    className={externalAuthButtonStyle}
                    disabled={connectedAcc.indexOf('google') != -1}
                    onClick={() => handleOAuthLogin('google')} >
                    <FcGoogle />
                    <span className="mx-2">{connectedAcc.indexOf('google') == -1 ? "Sign in with Google" : "Google is connected"}</span>
                </button>
                <button
                    className={externalAuthButtonStyle}
                    disabled={connectedAcc.indexOf('github') != -1}
                    onClick={() => handleOAuthLogin('github')} >
                    <FaGithub />
                    <span className="mx-2">{connectedAcc.indexOf('github') == -1 ? "Sign in with GitHub" : "Github is connected"}</span>
                </button>
            </div>
        </div>
    )
}