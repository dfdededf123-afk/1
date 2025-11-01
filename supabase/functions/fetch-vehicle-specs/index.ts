import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { callAI } from "../_shared/ai-provider.ts";
import { createCorsResponse, createErrorResponse, handleCorsPreflightRequest } from "../_shared/cors.ts";

interface RequestBody {
  brand?: string;
  model?: string;
  year?: number;
  source?: "carquery" | "ai" | "both";
}

async function fetchFromCarQuery(brand: string, model?: string, year?: number) {
  const url = new URL("https://www.carqueryapi.com/api/0.3/");
  url.searchParams.set("cmd", "getTrims");
  url.searchParams.set("make", brand);
  if (model) url.searchParams.set("model", model);
  if (year) url.searchParams.set("year", String(year));

  const response = await fetch(url.toString());
  const data = await response.json();
  return data.Trims?.[0];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return handleCorsPreflightRequest();
  }

  try {
    const { brand = "", model, year, source = "both" } = (await req.json()) as RequestBody;
    if (!brand) throw new Error("Brand obbligatorio");

    const results: Record<string, unknown> = {};

    if (source === "carquery" || source === "both") {
      results.carquery = await fetchFromCarQuery(brand, model, year);
    }

    if (source === "ai" || source === "both") {
      const response = await callAI(
        [
          { role: "system", content: "Sei un assistente che restituisce specifiche veicoli in JSON compatto." },
          { role: "user", content: `Ricerca specifiche per ${brand} ${model ?? ""} ${year ?? ""}` },
        ],
        { temperature: 0.2, max_tokens: 400 }
      );
      try {
        results.ai = JSON.parse(response);
      } catch (_error) {
        results.ai = { raw: response };
      }
    }

    return createCorsResponse({ success: true, data: results });
  } catch (error) {
    console.error("[fetch-vehicle-specs]", error);
    return createErrorResponse(error instanceof Error ? error.message : "Unknown error", 500);
  }
});
