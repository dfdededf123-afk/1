const allowedOrigins = (Deno.env.get('ALLOWED_ORIGINS') ?? '*').split(',');

export const handleCorsPreflightRequest = () =>
  new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    },
  });

export const createCorsResponse = (body: unknown, init: ResponseInit = {}) =>
  new Response(JSON.stringify(body), {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': allowedOrigins.includes('*') ? '*' : allowedOrigins[0],
      ...init.headers,
    },
  });

export const createErrorResponse = (message: string, status = 500) =>
  createCorsResponse({ success: false, error: message }, { status });
