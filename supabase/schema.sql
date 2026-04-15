-- Run this in your Supabase SQL Editor (supabase.com → your project → SQL Editor)

-- Profiles table: stores user credits
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  credits integer default 3 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Users can read their own profile
create policy "Users can read own profile" on public.profiles
  for select using (auth.uid() = id);

-- Users can update their own profile
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Service role can do anything (for webhooks/server)
create policy "Service role full access" on public.profiles
  for all using (auth.role() = 'service_role');

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, credits)
  values (new.id, new.email, 3);
  return new;
end;
$$;

-- Trigger to auto-create profile
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
