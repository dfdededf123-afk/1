#!/usr/bin/env node
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error('Missing Supabase credentials. Set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

async function main() {
  console.log('Seeding database with demo data...');
  const { error: userError } = await supabase.auth.admin.createUser({
    email: 'admin@logitrack.demo',
    password: 'Admin123!',
    email_confirm: true,
  });
  if (userError && userError.message !== 'User already registered') {
    console.error(userError);
    process.exit(1);
  }

  if (!userError) {
    const { data: adminUser } = await supabase.auth.admin.getUserByEmail('admin@logitrack.demo');
    const userId = adminUser?.user?.id;
    if (userId) {
      await supabase.from('user_roles').upsert({ user_id: userId, role: 'admin' }, { onConflict: 'user_id,role' });
    }
  }

  const vehicles = [
    { license_plate: 'AB123CD', brand: 'Mercedes', model: 'Actros', year: 2022, vehicle_type: 'truck', fuel_type: 'diesel' },
    { license_plate: 'EF456GH', brand: 'Iveco', model: 'Daily', year: 2021, vehicle_type: 'van', fuel_type: 'diesel' },
    { license_plate: 'IJ789KL', brand: 'Scania', model: 'R-Series', year: 2020, vehicle_type: 'truck', fuel_type: 'diesel' },
  ];

  const { error: vehicleError } = await supabase.from('vehicles').insert(vehicles).select();
  if (vehicleError) {
    console.error(vehicleError);
  }

  const drivers = [
    {
      first_name: 'Luca',
      last_name: 'Bianchi',
      email: 'luca.bianchi@example.com',
      license_number: 'LIC12345',
      license_expiry: '2027-01-01',
    },
    {
      first_name: 'Giulia',
      last_name: 'Rossi',
      email: 'giulia.rossi@example.com',
      license_number: 'LIC54321',
      license_expiry: '2026-06-30',
    },
  ];

  const { error: driverError } = await supabase.from('drivers').insert(drivers).select();
  if (driverError) {
    console.error(driverError);
  }

  console.log('Seed completed.');
}

main();
