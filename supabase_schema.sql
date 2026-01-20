-- Run this in your Supabase SQL Editor to create the necessary tables and policies

-- Create Projects Table
create table if not exists projects (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text,
  image_url text,
  link text,
  category text
);

-- Create Credentials Table
create table if not exists credentials (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  issuer text,
  date_issued date,
  image_url text,
  link text
);

-- Enable Row Level Security (RLS)
alter table projects enable row level security;
alter table credentials enable row level security;

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
