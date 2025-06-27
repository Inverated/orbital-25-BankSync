'use client'

import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Home() {
    const router = useRouter()

    useEffect(() => {
        const getData = async () => {
            const { data, error } = await supabase.auth.getSession()

            if (error) {
                console.error(error.message)
            }

            if (data == null) {
                router.push('/registration/signup')
            } else {
                router.push('/dashboard')
            }
        }

        getData()
    }, [router])

}