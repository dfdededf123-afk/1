#!/usr/bin/env node
import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import inquirer from 'inquirer';
import { createClient } from '@supabase/supabase-js';

const baseDir = 'storage-backup';

if (!fs.existsSync(baseDir)) {
  console.error('Nessun backup trovato nella cartella storage-backup.');
  process.exit(1);
}

const backups = fs.readdirSync(baseDir).filter((dir) => dir.startsWith('backup-'));
if (backups.length === 0) {
  console.error('Nessun backup disponibile.');
  process.exit(1);
}

const answers = await inquirer.prompt([
  {
    type: 'list',
    name: 'backup',
    message: 'Seleziona il backup da importare',
    choices: backups,
  },
]);

const backupDir = path.join(baseDir, answers.backup);
const metadataPath = path.join(backupDir, 'metadata.json');

const url = process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error('Missing Supabase credentials.');
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));

const { data: existingBuckets } = await supabase.storage.listBuckets();
const existingNames = new Set((existingBuckets ?? []).map((bucket) => bucket.name));

for (const entry of metadata) {
  if (!existingNames.has(entry.bucket)) {
    await supabase.storage.createBucket(entry.bucket, { public: false });
    existingNames.add(entry.bucket);
  }
  const filePath = path.join(backupDir, entry.bucket, entry.file);
  const fileBuffer = fs.readFileSync(filePath);
  console.log(`⬆️  Upload ${entry.bucket}/${entry.file}`);
  const { error } = await supabase.storage.from(entry.bucket).upload(entry.file, fileBuffer, {
    upsert: true,
  });
  if (error) {
    console.error('Errore upload', entry.file, error.message);
  }
}

console.log('✅ Import completato');
