'use client'

import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { MdFileUpload, MdOutlineSettings } from "react-icons/md";
import OptionMenu from "./OptionMenu";


export default function NavBar(user: { user: User | undefined; }) {
    const [settingsIsOpened, setSettingOpen] = useState(false)
    const logoStyle = 'mx-4 border border-black items-center rounded-lg hover:cursor-pointer'

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
        <div className='border border-black'>
            <div className='flex justify-between my-7 mx-4'>
                <div>
                    <div className='text-4xl'>Dashboard</div>
                    <div className="text-xl pt-3">Welcome {user.user?.email?.slice(0, user.user.email.indexOf('@')).replace(/\d+$/, '')}</div>
                </div>
                <div className='flex justify-between text-5xl'>
                    <div>
                        <MdFileUpload className={logoStyle} />
                    </div>
                    <div id='optionMenu'>
                        <MdOutlineSettings onClick={() => setSettingOpen(!settingsIsOpened)}
                            className={logoStyle} />
                        <div className='relative'>
                            {settingsIsOpened && <OptionMenu />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}