#!/usr/bin/env node
import 'dotenv/config';
import { runMigrations } from './lib/run-migrations.js';

runMigrations()
  .then(() => {
    console.log('\n✨ Database pronto all\'uso.');
  })
  .catch((error) => {
    console.error('\n❌ Errore durante l\'applicazione delle migrazioni.');
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
