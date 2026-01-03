-- Create the table for storing activity logs
create table public.activities (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  date date not null,
  hour integer not null check (hour >= 0 and hour <= 23),
  name text not null,
  duration integer not null check (duration > 0),
  color_theme text not null
);

-- Enable Row Level Security (RLS)
alter table public.activities enable row level security;

-- Policy to allow anonymous access (since we aren't using Auth yet)
-- WARNING: This allows anyone with your Anon Key to read/write/delete.
-- For a personal app with local anon key, this is acceptable for prototyping.
create policy "Allow public access"
  on public.activities
  for all
  using (true)
  with check (true);

-- Optional: Create an index on date for faster queries
create index activities_date_idx on public.activities (date);
