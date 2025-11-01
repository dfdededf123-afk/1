create type app_role as enum ('admin', 'manager', 'driver');
create type vehicle_type as enum ('truck', 'van', 'trailer');
create type fuel_type as enum ('diesel', 'gasoline', 'electric', 'hybrid');
create type vehicle_status as enum ('available', 'in_use', 'maintenance', 'out_of_service');
create type driver_status as enum ('available', 'on_trip', 'off_duty', 'unavailable');
create type assignment_type as enum ('primary', 'backup', 'temporary');
create type trip_status as enum ('planned', 'in_progress', 'completed', 'cancelled');
create type expense_type as enum ('fuel', 'maintenance', 'toll', 'parking', 'fine', 'insurance', 'other');
create type document_type as enum ('ddt', 'fuel_invoice', 'toll_receipt', 'maintenance_invoice', 'insurance', 'other');
create type document_status as enum ('pending', 'processed', 'verified', 'rejected');
create type maintenance_type as enum ('ordinary', 'extraordinary', 'repair');
create type notification_type as enum ('info', 'warning', 'alert', 'deadline');
create type notification_priority as enum ('low', 'medium', 'high', 'urgent');

drop table if exists profiles cascade;
create table profiles (
  id uuid primary key references auth.users (id),
  email text not null unique,
  username text unique,
  first_name text,
  last_name text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id),
  role app_role not null,
  created_at timestamptz default now(),
  unique (user_id, role)
);

create table vehicles (
  id uuid primary key default gen_random_uuid(),
  license_plate text not null unique,
  brand text not null,
  model text not null,
  year integer not null,
  vehicle_type vehicle_type not null,
  fuel_type fuel_type not null,
  status vehicle_status default 'available',
  engine_displacement integer,
  horsepower integer,
  torque integer,
  max_load_capacity integer,
  consumption_highway numeric(5,2),
  consumption_city numeric(5,2),
  consumption_mixed numeric(5,2),
  consumption_data_source text,
  length_mm integer,
  width_mm integer,
  height_mm integer,
  euro_emission_standard text,
  insurance_expiry date,
  inspection_expiry date,
  tax_expiry date,
  current_km integer default 0,
  last_maintenance_km integer,
  last_maintenance_date date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table drivers (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  phone text,
  email text,
  license_number text not null unique,
  license_expiry date not null,
  cqc_expiry date,
  medical_cert_expiry date,
  adr_cert_expiry date,
  status driver_status default 'available',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table driver_assignments (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references vehicles (id),
  driver_id uuid not null references drivers (id),
  assignment_type assignment_type not null,
  assigned_at timestamptz default now(),
  unassigned_at timestamptz,
  notes text
);

create table trips (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references vehicles (id),
  driver_id uuid not null references drivers (id),
  start_location text not null,
  end_location text not null,
  start_time timestamptz not null,
  end_time timestamptz,
  distance_km numeric(10,2),
  fuel_consumed_liters numeric(10,2),
  average_consumption numeric(5,2),
  status trip_status default 'planned',
  route_geometry jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table expenses (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid references vehicles (id),
  driver_id uuid references drivers (id),
  trip_id uuid references trips (id),
  expense_type expense_type not null,
  amount numeric(10,2) not null,
  currency text default 'EUR',
  date date not null,
  description text,
  notes text,
  payment_method text,
  receipt_url text,
  created_at timestamptz default now()
);

create table documents (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid references vehicles (id),
  driver_id uuid references drivers (id),
  trip_id uuid references trips (id),
  type document_type not null,
  file_name text not null,
  file_url text not null,
  file_size integer,
  document_number text,
  date date,
  status document_status default 'pending',
  extracted_data jsonb,
  uploaded_by uuid references auth.users (id),
  created_at timestamptz default now()
);

create table maintenance_records (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references vehicles (id),
  date date not null,
  km_at_maintenance integer not null,
  type maintenance_type not null,
  description text not null,
  cost numeric(10,2),
  performed_by text,
  next_maintenance_km integer,
  next_maintenance_date date,
  parts_replaced text[],
  created_at timestamptz default now()
);

create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id),
  type notification_type not null,
  title text not null,
  message text not null,
  priority notification_priority default 'medium',
  read boolean default false,
  read_at timestamptz,
  related_entity_type text,
  related_entity_id uuid,
  created_at timestamptz default now()
);

alter table vehicles enable row level security;
alter table drivers enable row level security;
alter table driver_assignments enable row level security;
alter table trips enable row level security;
alter table expenses enable row level security;
alter table documents enable row level security;
alter table maintenance_records enable row level security;
alter table notifications enable row level security;

create policy "Managers can view vehicles" on vehicles
  for select to authenticated using (
    exists(select 1 from user_roles where user_id = auth.uid() and role in ('admin','manager'))
  );

create policy "Drivers can view assigned vehicles" on vehicles
  for select to authenticated using (
    exists (
      select 1 from driver_assignments da
      join drivers d on d.id = da.driver_id
      where da.vehicle_id = vehicles.id
      and d.email = auth.jwt() ->> 'email'
    )
  );
