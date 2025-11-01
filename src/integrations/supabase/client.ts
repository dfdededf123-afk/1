import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

if (!supabaseUrl || !supabaseKey) {
  console.warn("Supabase environment variables are missing. Did you run npm run setup:local?");
}

export const supabase = createClient(supabaseUrl ?? "", supabaseKey ?? "", {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
