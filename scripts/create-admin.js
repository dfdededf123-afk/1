#!/usr/bin/env node
import 'dotenv/config';
import inquirer from 'inquirer';
import { createClient } from '@supabase/supabase-js';
import { ensureMigrations } from './lib/run-migrations.js';

async function main() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('\n❌ Impossibile creare l\'utente admin.');
    console.error('Assicurati che il file .env contenga:');
    console.error('  • VITE_SUPABASE_URL (o SUPABASE_URL)');
    console.error('  • SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'email',
      message: "Email dell'admin",
      validate: (value) => value.includes('@') || 'Inserisci un\'email valida',
    },
    {
      type: 'password',
      name: 'password',
      message: 'Password',
      mask: '*',
      validate: (value) => value.length >= 6 || 'La password deve avere almeno 6 caratteri',
    },
    {
      type: 'input',
      name: 'firstName',
      message: 'Nome',
      default: 'Admin',
    },
    {
      type: 'input',
      name: 'lastName',
      message: 'Cognome',
      default: 'User',
    },
  ]);

  const { data, error } = await supabase.auth.admin.createUser({
    email: answers.email,
    password: answers.password,
    email_confirm: true,
    user_metadata: {
      first_name: answers.firstName,
      last_name: answers.lastName,
    },
  });

  if (error) {
    console.error('\n❌ Errore durante la creazione dell\'utente:', error.message);
    process.exit(1);
  }

  const userId = data.user?.id;
  if (!userId) {
    console.error('\n❌ Supabase non ha restituito l\'ID utente.');
    process.exit(1);
  }

  const ensureSchema = async () => {
    const { error: profilesError } = await supabase.from('profiles').select('id').limit(1);
    const { error: rolesError } = await supabase.from('user_roles').select('user_id').limit(1);

    if (
      (profilesError && profilesError.message.includes("Could not find the table")) ||
      (rolesError && rolesError.message.includes("Could not find the table"))
    ) {
      const success = await ensureMigrations();
      if (!success) {
        console.error('\n⚠️ Utente creato, ma è necessario applicare le migrazioni del database.');
        return false;
      }
      const { error: profilesRetry } = await supabase.from('profiles').select('id').limit(1);
      const { error: rolesRetry } = await supabase.from('user_roles').select('user_id').limit(1);

      if (profilesRetry || rolesRetry) {
        console.error('\n⚠️ Le tabelle richieste non sono ancora disponibili. Riprova tra qualche secondo.');
        return false;
      }
      return true;
    }

    return true;
  };

  const schemaReady = await ensureSchema();

  if (!schemaReady) {
    console.log('\nℹ️ Puoi rieseguire questo script dopo aver sistemato il database.');
  }

  if (schemaReady) {
    const profileResult = await supabase
      .from('profiles')
      .upsert(
        {
          id: userId,
          email: answers.email,
          first_name: answers.firstName,
          last_name: answers.lastName,
        },
        { onConflict: 'id' }
      );

    if (profileResult.error) {
      console.error('\n⚠️ Utente creato, ma non è stato possibile aggiornare il profilo:', profileResult.error.message);
    }

    const roleResult = await supabase
      .from('user_roles')
      .upsert({ user_id: userId, role: 'admin' }, { onConflict: 'user_id,role' });

    if (roleResult.error) {
      console.error('\n⚠️ Utente creato, ma non è stato possibile assegnare il ruolo admin:', roleResult.error.message);
    }
  }

  console.log('\n✅ Utente admin creato con successo!');
  console.log(`   Email: ${answers.email}`);
  console.log('   Ricordati di conservare la password in un posto sicuro.');
}

main().catch((err) => {
  console.error('\n❌ Errore imprevisto:', err instanceof Error ? err.message : err);
  process.exit(1);
});
