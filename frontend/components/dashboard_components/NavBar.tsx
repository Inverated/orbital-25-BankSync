'use client'

import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { CircleUserRound } from "lucide-react";
import OptionMenu from "./OptionMenu";
import UploadButton from "./upload_util/UploadButton";

export default function NavBar(user: { user: User | undefined; }) {
    const [profileIsOpened, setProfileIsOpen] = useState(false)

    const handleButtonDown = (event: KeyboardEvent) => {
        if (event.key == 'Escape') {
            setProfileIsOpen(false)
        }
    }

    const closeOptionMenu = (event: MouseEvent) => {
        const currentElement = document.getElementById('optionMenu')
        const cursorAt = event.target as Node
        if (!(currentElement && currentElement.contains(cursorAt))) {
            setProfileIsOpen(false)
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
        <div className='flex justify-between gap-2 mx-3'>
            <div>
                <UploadButton />
            </div>
            
            <div id='optionMenu' className="relative group">
                <CircleUserRound
                    onClick={() => setProfileIsOpen(!profileIsOpened)}
                    className='mx-2 w-8 h-8 items-center rounded-lg hover:cursor-pointer' 
                />

                {!profileIsOpened && (
                    <div className="absolute -top-7 -translate-x-1/2 left-1/2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointers-events-none">
                        Your profile
                    </div>
                )}
                
                <div className='relative'>
                    {profileIsOpened && <OptionMenu user={user.user}/>}
                </div>
            </div>
        </div>
    )
}