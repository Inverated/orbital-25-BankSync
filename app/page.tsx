'use client'

import { useRouter } from "next/navigation"
import supabase from "./config/supabaseClient"
import { useEffect } from "react"

export default function Home() {
    const router = useRouter()

    useEffect(() => {
        const getData = async () => {
            const { data, error } = await supabase.auth.getSession()

            if (error) {
                console.log(error.message)
            } else {
                console.log("no error")
            }

            if (data == null) {
                router.push('/registration')
            } else {
                router.push('/dashboard')
            }
        }

        getData()
    }, [])

}