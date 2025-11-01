#!/usr/bin/env node
import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error('Missing Supabase credentials.');
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

async function main() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const baseDir = path.join('storage-backup', `backup-${timestamp}`);
  fs.mkdirSync(baseDir, { recursive: true });

  const { data: buckets, error } = await supabase.storage.listBuckets();
  if (error) {
    console.error('Unable to list buckets', error.message);
    process.exit(1);
  }

  const metadata = [];

  async function exportFolder(bucket, prefix = '') {
    const { data: files, error: listError } = await supabase.storage.from(bucket).list(prefix, {
      limit: 1000,
      offset: 0,
      sortBy: { column: 'name', order: 'asc' },
    });
    if (listError) throw listError;

    for (const item of files ?? []) {
      const fullPath = prefix ? `${prefix}/${item.name}` : item.name;
      const isFolder = item.id?.endsWith('/') || item.name.endsWith('/') || item.metadata?.mimetype === 'folder';
      if (isFolder) {
        await exportFolder(bucket, fullPath);
      } else {
        const { data: download, error: downloadError } = await supabase.storage.from(bucket).download(fullPath);
        if (downloadError) {
          console.error(`Errore download ${fullPath}:`, downloadError.message);
          continue;
        }
        const filePath = path.join(baseDir, bucket, fullPath);
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.writeFileSync(filePath, Buffer.from(await download.arrayBuffer()));
        metadata.push({ bucket, file: fullPath, size: item.metadata?.size ?? 0 });
      }
    }
  }

  for (const bucket of buckets ?? []) {
    console.log(`⬇️  Exporting bucket ${bucket.name}`);
    fs.mkdirSync(path.join(baseDir, bucket.name), { recursive: true });
    await exportFolder(bucket.name);
  }

  fs.writeFileSync(path.join(baseDir, 'metadata.json'), JSON.stringify(metadata, null, 2));
  console.log(`✅ Backup completato in ${baseDir}`);
}

await main();
