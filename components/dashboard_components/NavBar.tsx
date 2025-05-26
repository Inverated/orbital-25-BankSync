'use client'

import { MdFileUpload } from "react-icons/md";
import { CiSettings } from "react-icons/ci";
import { useState } from "react";
import OptionMenu from "./OptionMenu";
import { User } from "@supabase/supabase-js";

export default function NavBar(user: { user: User | undefined; }) {
    const [settingsIsOpened, setSettingOpening] = useState(false)

    const logoStyle = "mx-4 border border-black items-center rounded-lg hover:cursor-pointer"
    console.log()
    return (
        <div className="border border-black">
            <div className="flex justify-between my-7 mx-4">
                <div className="text-3xl">Dashboard</div>
                <div>Welecome {user.user?.email?.slice(0, user.user.email.indexOf("@"))}</div>
                <div className="flex justify-between text-5xl">
                    <div>
                        <MdFileUpload className={logoStyle} />
                    </div>
                    <div>
                        <CiSettings onClick={() => setSettingOpening(!settingsIsOpened)} 
                        className={logoStyle} />
                        <div className="relative">
                            {settingsIsOpened && <OptionMenu />}
                        </div>
                    </div>
                    
                </div>

            </div>
        </div>
    )
}