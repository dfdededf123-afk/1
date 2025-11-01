# LogiTrack

LogiTrack è una piattaforma completa di gestione flotte costruita su Supabase e React. Questo repository contiene sia il frontend che l'infrastruttura delle edge functions, oltre agli script di automazione e alla documentazione necessaria per eseguire, testare e distribuire il progetto.

## 🚀 Avvio rapido

1. **Clona il repository**
2. **Installa le dipendenze**
   ```bash
   npm install
   ```
3. **Configura l'ambiente**
   ```bash
   cp .env.example .env
   npm run setup:local
   ```
4. **Applica le migrazioni del database** (richiede la `SUPABASE_DB_URL`, recuperabile da Supabase → Project Settings → Database → Connection string `psql`)
   ```bash
   npm run db:migrate
   ```
   Questo step crea automaticamente le tabelle necessarie (`profiles`, `user_roles`, ecc.).
5. **Crea un account amministratore (opzionale ma consigliato)**
   ```bash
   npm run setup:admin
   ```
   Lo script ti farà alcune domande (email, password, nome). Al termine avrai un utente con tutti i permessi per accedere all'app.
6. **Avvia il server di sviluppo**
   ```bash
   npm run dev
   ```

## 📁 Struttura principale

La struttura dettagliata è documentata in [`PROJECT_ARCHITECTURE.md`](PROJECT_ARCHITECTURE.md). I punti chiave:

- Frontend React in `src/`
- Edge functions Supabase in `supabase/functions/`
- Migrazioni database in `supabase/migrations/`
- Script di supporto in `scripts/`

## 🧪 Testing

Sono disponibili diversi comandi di test:

```bash
npm run test       # Unit test (Vitest)
npm run test:ui    # Interfaccia interattiva Vitest
npm run test:e2e   # End-to-end (Playwright)
```

## 📦 Build e deploy

```bash
npm run build      # Compila l'applicazione
npm run preview    # Anteprima della build
```

Le linee guida complete di deploy sono disponibili in [`DEPLOYMENT.md`](DEPLOYMENT.md).

## 📚 Documentazione

- [`PROJECT_ARCHITECTURE.md`](PROJECT_ARCHITECTURE.md): blueprint completo
- [`MIGRATION.md`](MIGRATION.md): guida alla migrazione
- [`DEPLOYMENT.md`](DEPLOYMENT.md): strategie di rilascio

## 👤 Creare un amministratore

Se è la prima volta che avvii LogiTrack dovrai avere almeno un utente con i permessi completi:

1. Assicurati di aver eseguito `npm run setup:local` e di avere nel file `.env` le variabili `VITE_SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY`.
2. Nel terminale esegui:
   ```bash
   npm run setup:admin
   ```
3. Inserisci email e password quando richiesto. Alla fine del processo vedrai un messaggio di conferma.

Se hai impostato anche `SUPABASE_DB_URL`, lo script applicherà automaticamente le migrazioni mancanti prima di aggiornare il profilo e assegnare il ruolo `admin`. In caso contrario ti indicherà di eseguire manualmente `npm run db:migrate` e potrai rilanciarlo dopo aver sistemato il database.

## 🔐 Sicurezza

- File `.env` e chiavi sensibili non vanno mai committati
- Le edge functions implementano CORS centralizzato e logging
- Tutte le tabelle del database hanno RLS attivo

## 🛠️ Risoluzione problemi comuni

- **Errore `Failed to resolve import "@hookform/resolvers/zod"`** → Questo significa che non è stata installata la dipendenza `@hookform/resolvers`. Apri il terminale nella cartella del progetto ed esegui:
  ```bash
  npm install @hookform/resolvers
  ```
  Se l'errore persiste, ripeti anche `npm install` per reinstallare tutte le librerie e riavvia il comando `npm run dev`.
- **Messaggio "Could not find the table 'public.profiles' in the schema cache" durante `npm run setup:admin`** → Significa che il database non ha ancora le tabelle di LogiTrack. Recupera da Supabase la connection string `psql`, aggiungila al file `.env` come `SUPABASE_DB_URL` ed esegui `npm run db:migrate`. Quando le migrazioni terminano, rilancia `npm run setup:admin`.

## 🤝 Contributi

1. Crea un branch dalla `main`
2. Implementa le modifiche seguendo le convenzioni in `PROJECT_ARCHITECTURE.md`
3. Esegui i test e la formattazione
4. Apri una Pull Request descrittiva

Buon lavoro con LogiTrack! 🚛
