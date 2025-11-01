import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { callAI, type Message } from "../_shared/ai-provider.ts";
import { createCorsResponse, createErrorResponse, handleCorsPreflightRequest } from "../_shared/cors.ts";

interface RequestBody {
  action?: string;
  data?: Record<string, unknown>;
}

const SYSTEM_PROMPTS: Record<string, string> = {
  calculate_quote: "Sei un assistente esperto di logistica. Calcola preventivi dettagliati con carburante, pedaggi e costi extra.",
  analyze_expenses: "Analizza le spese operative e fornisci insight sintetici.",
  suggest_maintenance: "Suggerisci interventi di manutenzione predittiva basandoti sui dati forniti.",
  optimize_assignment: "Ottimizza l'assegnazione veicoli/autisti rispettando normative e disponibilità.",
  check_deadlines: "Verifica scadenze di assicurazioni e certificazioni e priorizza gli alert.",
  general: "Sei l'assistente LogiTrack. Rispondi con consigli pratici e sintetici.",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return handleCorsPreflightRequest();
  }

  try {
    const { action = "general", data = {} } = (await req.json()) as RequestBody;
    const system = SYSTEM_PROMPTS[action] ?? SYSTEM_PROMPTS.general;

    const messages: Message[] = [
      { role: "system", content: system },
      { role: "user", content: JSON.stringify(data) },
    ];

    const response = await callAI(messages, { temperature: 0.4, max_tokens: 500 });
    return createCorsResponse({ success: true, message: response });
  } catch (error) {
    console.error("[logi-agent]", error);
    return createErrorResponse(error instanceof Error ? error.message : "Unknown error", 500);
  }
});
