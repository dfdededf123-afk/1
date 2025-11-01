# MIGRATION.md

Questa guida descrive i passaggi necessari per migrare da una precedente installazione LogiTrack ospitata su Lovable o su un altro provider a questa versione open-source basata su Supabase.

## 1. Preparazione

- Assicurati di avere accesso amministratore al progetto di origine
- Esporta i dati esistenti (utenti, veicoli, autisti, viaggi, spese, documenti)
- Verifica le chiavi API e le integrazioni esterne utilizzate

## 2. Setup nuovo progetto

1. Crea un nuovo progetto Supabase
2. Importa le migrazioni presenti in `supabase/migrations/` (in locale puoi usare `npm run db:migrate` dopo aver impostato `SUPABASE_DB_URL`)
3. Configura le edge functions tramite `supabase functions deploy`
4. Popola le variabili ambiente seguendo `.env.example`

## 3. Migrazione dati

- Utilizza lo script `scripts/import-storage.js` per ripristinare i file
- Importa i dati tabellari usando i comandi SQL generati dagli export
- Verifica i riferimenti (foreign key) e gli UUID

## 4. Verifiche finali

- Esegui `npm run health-check`
- Accedi con l'account amministratore generato o migrato
- Controlla il funzionamento delle edge functions chiave (logi-agent, fetch-vehicle-specs, process-document)

## 5. Rollout

- Aggiorna DNS e configurazioni del reverse proxy/Nginx
- Monitorare i log (Supabase, edge functions, frontend)
- Pianificare una fase di monitoraggio post-rilascio di almeno 48h

Per ulteriori dettagli consulta anche [`PROJECT_ARCHITECTURE.md`](PROJECT_ARCHITECTURE.md).
