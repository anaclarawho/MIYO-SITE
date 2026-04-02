create extension if not exists pgcrypto;

create table if not exists public.tutors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  name text not null,
  phone text not null,
  email text,
  notes text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  name text not null,
  price numeric(10, 2) not null default 0,
  duration_minutes integer not null default 60,
  description text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.pets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  tutor_id uuid references public.tutors(id) on delete cascade,
  name text not null,
  breed text,
  size text,
  tutor_name text,
  tutor_contact text,
  registration_date date default current_date,
  clubinho_enabled boolean not null default false,
  clubinho_plan text check (clubinho_plan in ('mensal', 'quinzenal')),
  clubinho_price numeric(10, 2),
  clubinho_adhesion_date date,
  notes text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.packages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  service_id uuid references public.services(id) on delete set null,
  name text not null,
  adhesion_date date not null default current_date,
  total_sessions integer not null check (total_sessions > 0),
  expiry_date date,
  status text not null default 'ativo' check (status in ('ativo', 'concluido', 'cancelado')),
  notes text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.package_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  package_id uuid not null references public.packages(id) on delete cascade,
  usage_date date not null default current_date,
  notes text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  service_id uuid references public.services(id) on delete set null,
  package_id uuid references public.packages(id) on delete set null,
  appointment_at timestamptz not null,
  status text not null default 'agendado' check (status in ('agendado', 'confirmado', 'realizado', 'cancelado')),
  service_items jsonb not null default '[]'::jsonb,
  amount numeric(10, 2),
  is_clubinho boolean not null default false,
  clubinho_slot text,
  notes text,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists tutors_user_idx on public.tutors(user_id);
create index if not exists services_user_idx on public.services(user_id);
alter table public.pets add column if not exists tutor_name text;
alter table public.pets add column if not exists tutor_contact text;
alter table public.pets add column if not exists registration_date date default current_date;
alter table public.pets add column if not exists clubinho_enabled boolean not null default false;
alter table public.pets add column if not exists clubinho_plan text;
alter table public.pets add column if not exists clubinho_price numeric(10, 2);
alter table public.pets add column if not exists clubinho_adhesion_date date;
alter table public.appointments add column if not exists service_items jsonb not null default '[]'::jsonb;
alter table public.appointments add column if not exists amount numeric(10, 2);
alter table public.appointments add column if not exists is_clubinho boolean not null default false;
alter table public.appointments add column if not exists clubinho_slot text;
alter table public.pets drop constraint if exists pets_clubinho_plan_check;
alter table public.pets add constraint pets_clubinho_plan_check check (clubinho_plan in ('mensal', 'quinzenal'));
create index if not exists pets_user_idx on public.pets(user_id);
create index if not exists pets_tutor_idx on public.pets(tutor_id);
create index if not exists packages_user_idx on public.packages(user_id);
create index if not exists packages_pet_idx on public.packages(pet_id);
create index if not exists package_sessions_user_idx on public.package_sessions(user_id);
create index if not exists package_sessions_package_idx on public.package_sessions(package_id);
create index if not exists appointments_user_idx on public.appointments(user_id);
create index if not exists appointments_pet_idx on public.appointments(pet_id);
create index if not exists appointments_date_idx on public.appointments(appointment_at);

alter table public.tutors enable row level security;
alter table public.services enable row level security;
alter table public.pets enable row level security;
alter table public.packages enable row level security;
alter table public.package_sessions enable row level security;
alter table public.appointments enable row level security;

create policy "tutors_select_own"
  on public.tutors for select
  using (auth.uid() = user_id);

create policy "tutors_insert_own"
  on public.tutors for insert
  with check (auth.uid() = user_id);

create policy "tutors_update_own"
  on public.tutors for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "tutors_delete_own"
  on public.tutors for delete
  using (auth.uid() = user_id);

create policy "services_select_own"
  on public.services for select
  using (auth.uid() = user_id);

create policy "services_insert_own"
  on public.services for insert
  with check (auth.uid() = user_id);

create policy "services_update_own"
  on public.services for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "services_delete_own"
  on public.services for delete
  using (auth.uid() = user_id);

create policy "pets_select_own"
  on public.pets for select
  using (auth.uid() = user_id);

create policy "pets_insert_own"
  on public.pets for insert
  with check (
    auth.uid() = user_id
    and (
      tutor_id is null
      or exists (
        select 1
        from public.tutors
        where tutors.id = tutor_id
          and tutors.user_id = auth.uid()
      )
    )
  );

create policy "pets_update_own"
  on public.pets for update
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and (
      tutor_id is null
      or exists (
        select 1
        from public.tutors
        where tutors.id = tutor_id
          and tutors.user_id = auth.uid()
      )
    )
  );

create policy "pets_delete_own"
  on public.pets for delete
  using (auth.uid() = user_id);

create policy "packages_select_own"
  on public.packages for select
  using (auth.uid() = user_id);

create policy "packages_insert_own"
  on public.packages for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1
      from public.pets
      where pets.id = pet_id
        and pets.user_id = auth.uid()
    )
    and (
      service_id is null
      or exists (
        select 1
        from public.services
        where services.id = service_id
          and services.user_id = auth.uid()
      )
    )
  );

create policy "packages_update_own"
  on public.packages for update
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and exists (
      select 1
      from public.pets
      where pets.id = pet_id
        and pets.user_id = auth.uid()
    )
    and (
      service_id is null
      or exists (
        select 1
        from public.services
        where services.id = service_id
          and services.user_id = auth.uid()
      )
    )
  );

create policy "packages_delete_own"
  on public.packages for delete
  using (auth.uid() = user_id);

create policy "package_sessions_select_own"
  on public.package_sessions for select
  using (auth.uid() = user_id);

create policy "package_sessions_insert_own"
  on public.package_sessions for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1
      from public.packages
      where packages.id = package_id
        and packages.user_id = auth.uid()
    )
  );

create policy "package_sessions_update_own"
  on public.package_sessions for update
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and exists (
      select 1
      from public.packages
      where packages.id = package_id
        and packages.user_id = auth.uid()
    )
  );

create policy "package_sessions_delete_own"
  on public.package_sessions for delete
  using (auth.uid() = user_id);

create policy "appointments_select_own"
  on public.appointments for select
  using (auth.uid() = user_id);

create policy "appointments_insert_own"
  on public.appointments for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1
      from public.pets
      where pets.id = pet_id
        and pets.user_id = auth.uid()
    )
    and (
      service_id is null
      or exists (
        select 1
        from public.services
        where services.id = service_id
          and services.user_id = auth.uid()
      )
    )
    and (
      package_id is null
      or exists (
        select 1
        from public.packages
        where packages.id = package_id
          and packages.user_id = auth.uid()
      )
    )
  );

create policy "appointments_update_own"
  on public.appointments for update
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and exists (
      select 1
      from public.pets
      where pets.id = pet_id
        and pets.user_id = auth.uid()
    )
    and (
      service_id is null
      or exists (
        select 1
        from public.services
        where services.id = service_id
          and services.user_id = auth.uid()
      )
    )
    and (
      package_id is null
      or exists (
        select 1
        from public.packages
        where packages.id = package_id
          and packages.user_id = auth.uid()
      )
    )
  );

create policy "appointments_delete_own"
  on public.appointments for delete
  using (auth.uid() = user_id);
