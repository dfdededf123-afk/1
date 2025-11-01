import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Client } from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const migrationsDir = path.resolve(__dirname, '../../supabase/migrations');
let hasRun = false;

export async function runMigrations() {
  if (hasRun) {
    return;
  }

  const databaseUrl = process.env.SUPABASE_DB_URL;
  if (!databaseUrl) {
    throw new Error(
      'Variabile SUPABASE_DB_URL mancante. Recupera la connection string completa da Supabase (sezione Project Settings → Database) e aggiungila al file .env.'
    );
  }

  if (!fs.existsSync(migrationsDir)) {
    throw new Error('Cartella supabase/migrations non trovata.');
  }

  const sqlFiles = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith('.sql'))
    .sort();

  if (sqlFiles.length === 0) {
    console.log('Nessuna migrazione da applicare.');
    hasRun = true;
    return;
  }

  const client = new Client({ connectionString: databaseUrl });
  await client.connect();

  try {
    for (const file of sqlFiles) {
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      console.log(`Eseguo migrazione: ${file}`);
      await client.query(sql);
    }
    console.log('✅ Migrazioni applicate con successo.');
    hasRun = true;
  } finally {
    await client.end();
  }
}

export async function ensureMigrations() {
  try {
    await runMigrations();
    return true;
  } catch (error) {
    console.error('\n⚠️ Impossibile applicare automaticamente le migrazioni.');
    if (error instanceof Error) {
      console.error(`   Dettagli: ${error.message}`);
    }
    console.error('   Esegui manualmente "npm run db:migrate" dopo aver impostato SUPABASE_DB_URL.');
    return false;
  }
}
