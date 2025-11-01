#!/usr/bin/env node
import fs from 'node:fs';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const rl = readline.createInterface({ input, output });

async function prompt(question, defaults = '') {
  const answer = await rl.question(`${question}${defaults ? ` (${defaults})` : ''}: `);
  return answer || defaults;
}

async function main() {
  console.log('LogiTrack local setup');
  const env = {
    VITE_SUPABASE_URL: await prompt('Supabase URL'),
    VITE_SUPABASE_PUBLISHABLE_KEY: await prompt('Supabase anon key'),
    SUPABASE_SERVICE_ROLE_KEY: await prompt('Supabase service role key'),
    VITE_SUPABASE_PROJECT_ID: await prompt('Supabase project id'),
    AI_PROVIDER: await prompt('AI provider', 'openai'),
    OPENAI_API_KEY: await prompt('OpenAI API key'),
    VITE_MAPBOX_TOKEN: await prompt('Mapbox token'),
    VITE_APP_URL: await prompt('App URL', 'http://localhost:5173'),
  };

  const envContent = Object.entries(env)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  fs.writeFileSync('.env', `${envContent}\n`);
  console.log('✅ File .env creato.');
  await rl.close();
}

await main();
