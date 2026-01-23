-- Run this in your Supabase SQL Editor to create the necessary tables and policies

-- Create Projects Table
create table if not exists projects (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text,
  image_url text,
  link text,
  category text,
  time_saved text,
  cost_saved text,
  tags text[],
  video_url text,
  preview_image text,
  detailed_description text[]
);

-- Create Admin Users Table
create table if not exists admin_users (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  username text unique not null,
  email text unique not null,
  is_active boolean default true not null
);

-- Create Credentials Table
create table if not exists credentials (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  issuer text,
  date_issued date,
  image_url text,
  link text,
  credential_id text,
  categories text[],
  skills text[],
  external_url text,
  provider text
);

-- Enable Row Level Security (RLS)
alter table projects enable row level security;
alter table credentials enable row level security;
alter table admin_users enable row level security;

-- Policies for Projects
-- Allow everyone to view projects (for your public portfolio)
create policy "Public Read Projects" on projects 
  for select using (true);

-- Allow only authenticated users (you) to insert, update, delete
create policy "Admin Manage Projects" on projects 
  for all using (auth.role() = 'authenticated');

-- Policies for Credentials
-- Allow everyone to view credentials
create policy "Public Read Credentials" on credentials 
  for select using (true);

-- Allow only authenticated users to manage credentials
create policy "Admin Manage Credentials" on credentials 
  for all using (auth.role() = 'authenticated');

-- Policies for Admin Users
-- Allow lookup for active usernames during login
create policy "Public Read Admin Users" on admin_users
  for select using (auth.role() = 'authenticated' and is_active = true and email = auth.email());

-- Allow only authenticated users to manage admin users
create policy "Admin Manage Admin Users" on admin_users
  for all using (auth.role() = 'authenticated');
