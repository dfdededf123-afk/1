import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.4";
import { createCorsResponse, createErrorResponse, handleCorsPreflightRequest } from "../_shared/cors.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false } });

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return handleCorsPreflightRequest();
  }

  try {
    const { email, password } = await req.json();
    if (!email || !password) throw new Error("Email e password richiesti");

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (error) throw error;

    await supabase.from("user_roles").insert({ user_id: data.user?.id, role: "admin" });

    return createCorsResponse({ success: true, id: data.user?.id });
  } catch (error) {
    console.error("[setup-admin]", error);
    return createErrorResponse(error instanceof Error ? error.message : "Unknown error", 500);
  }
});
