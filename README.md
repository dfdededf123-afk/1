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
4. **Avvia il server di sviluppo**
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

## 🤝 Contributi

1. Crea un branch dalla `main`
2. Implementa le modifiche seguendo le convenzioni in `PROJECT_ARCHITECTURE.md`
3. Esegui i test e la formattazione
4. Apri una Pull Request descrittiva

Buon lavoro con LogiTrack! 🚛
