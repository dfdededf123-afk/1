#!/usr/bin/env node
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const requiredEnv = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_PUBLISHABLE_KEY', 'AI_PROVIDER'];

const missing = requiredEnv.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.warn(`⚠️  Missing environment variables: ${missing.join(', ')}`);
} else {
  console.log('✅ Environment variables loaded');
}

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  console.error('❌ Supabase credentials are not configured.');
  process.exit(1);
}

const supabase = createClient(url, key);

async function checkSupabase() {
  const { error, count } = await supabase.from('vehicles').select('id', { count: 'exact', head: true });
  if (error) {
    console.error('❌ Supabase query failed:', error.message);
  } else {
    console.log('✅ Supabase connection ok');
    console.log(`ℹ️  Vehicles table reachable. Total veicoli stimati: ${count ?? 0}`);
  }
}

await checkSupabase();
console.log('Health check completed.');
