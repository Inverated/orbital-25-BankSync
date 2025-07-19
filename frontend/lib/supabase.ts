import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: !!localStorage.getItem('rememberMe'),
        autoRefreshToken: true,
        storage: localStorage.getItem('rememberMe') ? localStorage : sessionStorage
    }
})