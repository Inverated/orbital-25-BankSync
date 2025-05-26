import { createBrowserClient } from "@supabase/ssr/dist/main/createBrowserClient";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase url and/or key is missing");
}

const supabase = createBrowserClient(supabaseUrl, supabaseKey)

export default supabase