-- Run in Supabase SQL editor
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text, name text, avatar text,
  last_login timestamptz default now()
);
alter table profiles enable row level security;
create policy "own profile" on profiles for all
  using (auth.uid() = id) with check (auth.uid() = id);
