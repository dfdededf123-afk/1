import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createCorsResponse, createErrorResponse, handleCorsPreflightRequest } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return handleCorsPreflightRequest();
  }

  try {
    const { brand } = await req.json();
    if (!brand) throw new Error("Brand richiesto");
    const url = new URL("https://www.carqueryapi.com/api/0.3/");
    url.searchParams.set("cmd", "getModels");
    url.searchParams.set("make", brand);
    const response = await fetch(url.toString());
    const data = await response.json();
    return createCorsResponse({ success: true, data: data.Models ?? [] });
  } catch (error) {
    console.error("[get-vehicle-models]", error);
    return createErrorResponse(error instanceof Error ? error.message : "Unknown error", 500);
  }
});
