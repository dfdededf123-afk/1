# DEPLOYMENT.md

Questa guida illustra diverse strategie di deploy per LogiTrack.

## 1. Prerequisiti comuni

- Variabili ambiente configurate
- Account Supabase operativo
- Token Mapbox se si utilizza la mappa
- Chiave API per il provider AI scelto

## 2. Deploy locale con Docker

```bash
docker compose up --build
```

Il file `docker-compose.yml` contiene i servizi per lo sviluppo (app frontend, nginx reverse proxy, watcher).

## 3. Deploy produzione su VPS

1. Configura un server Ubuntu
2. Installa Docker, Docker Compose e Certbot
3. Copia i file `docker-compose.prod.yml` e `nginx.conf`
4. Imposta le variabili ambiente nel file `.env`
5. Avvia lo stack
   ```bash
   docker compose -f docker-compose.prod.yml up -d --build
   ```
6. Configura HTTPS con Certbot

## 4. Deploy su piattaforme managed

- **Vercel/Netlify**: importa il repo, configura le variabili, utilizza il comando `npm run build`
- **Railway/Fly.io**: utilizza Dockerfile, configura il servizio Supabase separatamente

## 5. Edge Functions

Le funzioni vengono distribuite tramite CLI Supabase:

```bash
supabase functions deploy logi-agent
supabase functions deploy fetch-vehicle-specs
...
```

## 6. Monitoraggio

- Configura log forwarding (Supabase → Grafana/Promtail)
- Abilita alerting sugli errori delle edge functions
- Utilizza `scripts/health-check.js` per verifiche programmate

## 7. Rollback

- Mantieni immagini Docker versionate
- Conserva backup DB e Storage tramite `scripts/export-storage.js`
- Documenta ogni rilascio nella cronologia delle PR

Per dettagli completi consulta [`PROJECT_ARCHITECTURE.md`](PROJECT_ARCHITECTURE.md).
