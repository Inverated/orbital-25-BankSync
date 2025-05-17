'use client'

import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function Navbar() {
    const handleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'github'
        });
    };

    return(
        <nav>
            <button onClick={handleLogin}> Sign in with GitHub</button>  
        </nav> 
    )
}