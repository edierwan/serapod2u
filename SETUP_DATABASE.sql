-- Note: Run this SQL in your Supabase Dashboard > SQL Editor
-- This will create the required tables and setup

-- Create profiles table with RLS
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role_code text not null check (role_code in ('hq_admin','power_user','manufacturer','warehouse','distributor','shop')),
  full_name text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS on profiles table
alter table profiles enable row level security;

-- Create policy for users to read/update their own profile
create policy "Users can view their own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

-- Create product_categories table (fixed, read-only seed)
create table if not exists product_categories(
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz default now()
);

-- Enable RLS on product_categories (read-only for all authenticated users)
alter table product_categories enable row level security;

create policy "Anyone can view product categories"
  on product_categories for select
  using (auth.role() = 'authenticated');

-- Seed product categories
insert into product_categories(name) values ('Vape') on conflict (name) do nothing;
insert into product_categories(name) values ('Non-Vape') on conflict (name) do nothing;

-- Create function to handle profile creation on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role_code, full_name)
  values (new.id, 'shop', new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger to automatically create profile on user signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();