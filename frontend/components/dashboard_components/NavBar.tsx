'use client'

import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { Settings } from "lucide-react";
import OptionMenu from "./OptionMenu";
import UploadButton from "./upload_util/UploadButton";

export default function NavBar(user: { user: User | undefined; }) {
    const [settingsIsOpened, setSettingOpen] = useState(false)

    const handleButtonDown = (event: KeyboardEvent) => {
        if (event.key == 'Escape') {
            setSettingOpen(false)
        }
    }

    const closeOptionMenu = (event: MouseEvent) => {
        const currentElement = document.getElementById('optionMenu')
        const cursorAt = event.target as Node
        if (!(currentElement && currentElement.contains(cursorAt))) {
            setSettingOpen(false)
        }
    }

    useEffect(() => {
        document.addEventListener('click', closeOptionMenu)
        document.addEventListener('keydown', handleButtonDown)
        return () => {
            document.removeEventListener('keydown', handleButtonDown)
        }
    }, [])

    return (
            <div className='flex justify-between my-7 mx-4'>
                <div>
                    <div className='text-4xl'>Dashboard</div>
                    <div className="text-xl pt-3">Welcome {user.user?.email?.slice(0, user.user.email.indexOf('@'))}</div>
                </div>
                <div className='flex justify-between text-5xl'>
                    <div>
                        <UploadButton />
                    </div>
                    <div id='optionMenu'>
                        <Settings 
                            onClick={() => setSettingOpen(!settingsIsOpened)}
                            className='mx-2 w-8 h-8 items-center rounded-lg hover:cursor-pointer' 
                        />
                        <div className='relative'>
                            {settingsIsOpened && <OptionMenu />}
                        </div>
                    </div>
                </div>
            </div>
    )
}