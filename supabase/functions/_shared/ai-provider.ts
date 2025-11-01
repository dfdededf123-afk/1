import OpenAI from "https://esm.sh/openai@4.73.0";

export interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

interface Options {
  temperature?: number;
  max_tokens?: number;
}

const provider = Deno.env.get("AI_PROVIDER") ?? "openai";

export async function callAI(messages: Message[], options: Options = {}): Promise<string> {
  switch (provider) {
    case "openai":
      return callOpenAI(messages, options);
    default:
      throw new Error(`AI provider ${provider} non configurato`);
  }
}

async function callOpenAI(messages: Message[], options: Options): Promise<string> {
  const apiKey = Deno.env.get("OPENAI_API_KEY");
  if (!apiKey) throw new Error("OPENAI_API_KEY non configurata");

  const client = new OpenAI({ apiKey });
  const response = await client.responses.create({
    model: "gpt-4o-mini",
    messages,
    temperature: options.temperature ?? 0.3,
    max_output_tokens: options.max_tokens ?? 400,
  });

  return response.output_text;
}
