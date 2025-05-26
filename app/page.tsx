'use client'

import { useRouter } from "next/navigation"
import supabase from "./config/supabaseClient"

export default function Home() {
    const router = useRouter()
    const getData = async () => {
        const {data,error} = await supabase.auth.getSession()
        error ? console.log(error.message) : console.log("no error")
        data == null ? router.push('/registration') : router.push('/dashboard')
    }

    getData()
}