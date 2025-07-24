import { useProfile } from "@/context/ProfileContext";
import { queryProfileDetails } from "@/lib/supabaseQuery";
import { UserRound } from "lucide-react";
import { useState } from "react";

export default function Username() {
    const { profile } = useProfile();

    const [newName, setNewName] = useState(profile.user_name || "User");
    const { refreshProfile } = useProfile();
    
    const updateUsername = async (e: React.FormEvent) => {
        e.preventDefault();
        await queryProfileDetails(profile.user_id, newName);
        await refreshProfile();
    }

    return (
        <div className="px-7 py-4.5 w-[455px]">
            <div className="text-2xl font-semibold">Change Username</div>

            <form>
                <div className="space-y-0.5">
                    <div className="mt-5">Change your username.</div>

                    <div className="text-gray-400">Current: {profile.user_name}</div>
                </div>

                <div className="pt-4">
                    <div className="flex border rounded-lg">
                        <UserRound className="m-1.5" />
                        <input
                            type="string"
                            id='changeUsername'
                            placeholder="Enter new username"
                            className="bg-transparent w-full"
                            onChange={(e) => setNewName(e.target.value)} />
                    </div>
                </div>

                <div className="flex justify-end pt-1.5">
                    <button
                        className="px-3 py-1.5 my-1 rounded-lg hover:cursor-pointer bg-green-500 hover:bg-green-600 active:bg-green-700 active:scale-97 text-white font-semibold tracking-wide transition"
                        type='submit'
                        onClick={(e) => updateUsername(e)}>
                        Update
                    </button>
                </div>
            </form>
        </div>
    )
}