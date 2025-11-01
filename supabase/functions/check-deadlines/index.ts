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
    const today = new Date();
    const warningThreshold = new Date(today);
    warningThreshold.setDate(warningThreshold.getDate() + 30);

    const { data: vehicles } = await supabase
      .from("vehicles")
      .select("id, license_plate, insurance_expiry, inspection_expiry, tax_expiry");

    const defaultUserId = Deno.env.get("ADMIN_USER_ID") ?? null;

    let targetUserId = defaultUserId;
    if (!targetUserId) {
      const { data: admin } = await supabase
        .from("user_roles")
        .select("user_id")
        .in("role", ["admin", "manager"])
        .limit(1)
        .single();
      targetUserId = admin?.user_id ?? null;
    }

    if (!targetUserId) {
      return createCorsResponse({ success: false, error: "Nessun utente amministratore trovato" }, { status: 400 });
    }

    const notifications = [] as Array<{ user_id: string; title: string; message: string; priority: string }>;

    for (const vehicle of vehicles ?? []) {
      const deadlines = [
        { label: "assicurazione", date: vehicle.insurance_expiry },
        { label: "revisione", date: vehicle.inspection_expiry },
        { label: "bollo", date: vehicle.tax_expiry },
      ];

      for (const deadline of deadlines) {
        if (!deadline.date) continue;
        const expiry = new Date(deadline.date);
        if (expiry <= warningThreshold) {
          notifications.push({
            user_id: targetUserId,
            title: `Scadenza ${deadline.label}`,
            message: `Il veicolo ${vehicle.license_plate} scadrà il ${expiry.toLocaleDateString("it-IT")}`,
            priority: expiry <= today ? "urgent" : "high",
          });
        }
      }
    }

    if (notifications.length > 0) {
      await supabase.from("notifications").insert(
        notifications.map((item) => ({
          user_id: item.user_id,
          title: item.title,
          message: item.message,
          priority: item.priority,
          type: "deadline",
        }))
      );
    }

    return createCorsResponse({ success: true, created: notifications.length });
  } catch (error) {
    console.error("[check-deadlines]", error);
    return createErrorResponse(error instanceof Error ? error.message : "Unknown error", 500);
  }
});
