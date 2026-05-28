-- Create waitlist_signups table for Onmatch marketing site
create table if not exists public.waitlist_signups (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  tier text check (tier in ('starter', 'operator', 'scale')),
  source text not null check (source in (
    'hero',
    'final_cta',
    'pricing_starter',
    'pricing_operator',
    'pricing_scale',
    'tool_request'
  )),
  tool_name text, -- populated when source = 'tool_request'
  created_at timestamptz not null default now()
);

-- Index for querying by source and created_at
create index if not exists idx_waitlist_signups_source on public.waitlist_signups (source);
create index if not exists idx_waitlist_signups_created_at on public.waitlist_signups (created_at desc);

-- Enable Row Level Security
alter table public.waitlist_signups enable row level security;

-- Allow anonymous inserts only (no reads, updates, or deletes from client)
create policy "Allow anonymous inserts"
  on public.waitlist_signups
  for insert
  to anon
  with check (true);

-- No select/update/delete policies for anon — reads require service role key
