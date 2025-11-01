import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { callAI } from "../_shared/ai-provider.ts";
import { createCorsResponse, createErrorResponse, handleCorsPreflightRequest } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.4";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false } });

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return handleCorsPreflightRequest();
  }

  try {
    const { documentId } = await req.json();
    if (!documentId) throw new Error("documentId richiesto");

    const { data: document, error } = await supabase.from("documents").select("id, type, file_url").eq("id", documentId).single();
    if (error || !document) throw error ?? new Error("Documento non trovato");

    const response = await callAI(
      [
        {
          role: "system",
          content: `Estrai dati strutturati da un documento di tipo ${document.type}. Rispondi in JSON con campi rilevanti.`,
        },
        {
          role: "user",
          content: `File disponibile all'URL ${document.file_url}. Riassumi le informazioni fiscali principali.`,
        },
      ],
      { temperature: 0.1, max_tokens: 600 }
    );

    let parsed: unknown = response;
    try {
      parsed = JSON.parse(response as string);
    } catch (_error) {
      parsed = { raw: response };
    }

    await supabase
      .from("documents")
      .update({ status: "processed", extracted_data: parsed })
      .eq("id", document.id);

    return createCorsResponse({ success: true, data: parsed });
  } catch (error) {
    console.error("[process-document]", error);
    return createErrorResponse(error instanceof Error ? error.message : "Unknown error", 500);
  }
});
