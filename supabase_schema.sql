-- ==============================================================================
-- R&D GrowthFlow • Powered by FatherLab © 2026
-- Supabase Schema & Real-Time Sync for Yayasan Khoirur Rooziqiin
-- Target Organization: Yayasan Khoirur Rooziqiin (Cimareme, Kab. Bandung Barat)
-- PIC / Lead: Sopianto Djahar (R&D Digital Marketing)
-- Catatan: Skrip ini 100% Idempotent & Non-Destructive (Dapat dijalankan berulang kali tanpa error)
-- ==============================================================================

-- 1. PROFILES TABLE & COLUMN EXTENSIONS
create table if not exists public.profiles (
  id text primary key default 'default-user',
  full_name text not null default 'Sopianto Djahar',
  role text default 'R&D Digital Marketing',
  organization text default 'Yayasan Khoirur Rooziqiin',
  tagline text default 'Menebar Manfaat Berkelanjutan Melalui Inovasi Digital',
  quarter_target numeric default 450000000,
  work_capacity_hours_per_day numeric default 8,
  work_days_per_week int default 5,
  current_daily_logged_hours numeric default 0,
  avatar_url text default 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  avatar_zoom int default 100,
  avatar_x int default 50,
  avatar_y int default 50,
  foundation_address text default 'Jl. Raya Cimareme Rt.001 Rw.002 Desa Cimareme Kecamatan Ngamprah Kab. Bandung Barat',
  foundation_contact text default 'admin@khoirurroziqiin.org | +62 812-9988-7766',
  telegram_bot_token text default '',
  telegram_admin_chat_id text default '',
  rd_product_price numeric default 50000,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Safe migrations for profiles if table already exists
alter table public.profiles add column if not exists avatar_url text default 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250';
alter table public.profiles add column if not exists avatar_zoom int default 100;
alter table public.profiles add column if not exists avatar_x int default 50;
alter table public.profiles add column if not exists avatar_y int default 50;
alter table public.profiles add column if not exists current_daily_logged_hours numeric default 0;
alter table public.profiles add column if not exists telegram_bot_token text default '';
alter table public.profiles add column if not exists telegram_admin_chat_id text default '';
alter table public.profiles add column if not exists rd_product_price numeric default 50000;

-- 2. TASKS TABLE (LOGFRAME HIERARCHY, ATTACHMENTS & REFLECTIONS)
create table if not exists public.tasks (
  id text primary key default ('task-' || replace(gen_random_uuid()::text, '-', '')),
  title text not null,
  category text not null check (category in ('GOAL', 'OUTCOME', 'OUTPUT', 'ACTIVITY')),
  completed boolean default false,
  estimated_hours numeric default 1.5,
  priority text default 'MEDIUM' check (priority in ('HIGH', 'MEDIUM', 'LOW')),
  date date default current_date,
  notes text,
  obstacle text,
  evaluation text,
  conclusion text,
  work_result_url text,
  work_result_title text,
  attachments jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Safe migrations for tasks if table already exists
alter table public.tasks add column if not exists obstacle text;
alter table public.tasks add column if not exists evaluation text;
alter table public.tasks add column if not exists conclusion text;
alter table public.tasks add column if not exists work_result_url text;
alter table public.tasks add column if not exists work_result_title text;
alter table public.tasks add column if not exists attachments jsonb default '[]'::jsonb;

-- 3. JOURNAL LOGS TABLE (GROWTH HACKING FINDINGS & EXPERIMENTS)
create table if not exists public.journal_logs (
  id text primary key default ('log-' || replace(gen_random_uuid()::text, '-', '')),
  date date default current_date,
  focus text not null,
  evaluation text not null,
  growth_findings text,
  next_steps text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. MILESTONES TABLE (ROADMAP & AGENDA DEADLINES)
create table if not exists public.milestones (
  id text primary key default ('m-' || replace(gen_random_uuid()::text, '-', '')),
  title text not null,
  deadline date not null,
  type text default 'Monthly' check (type in ('Weekly', 'Monthly', 'Quarterly')),
  category text default 'OUTCOME' check (category in ('GOAL', 'OUTCOME', 'OUTPUT', 'ACTIVITY')),
  target_metric text not null,
  progress_percent int default 0,
  status text default 'In Progress' check (status in ('In Progress', 'Done', 'Pending')),
  obstacle text,
  evaluation text,
  conclusion text,
  work_result_url text,
  work_result_title text,
  attachments jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Safe migrations for milestones if table already exists
alter table public.milestones add column if not exists obstacle text;
alter table public.milestones add column if not exists evaluation text;
alter table public.milestones add column if not exists conclusion text;
alter table public.milestones add column if not exists work_result_url text;
alter table public.milestones add column if not exists work_result_title text;
alter table public.milestones add column if not exists attachments jsonb default '[]'::jsonb;

-- 5. CAMPAIGNS TABLE (AD LAB: TEST -> SCALE 1 -> SCALE 2)
create table if not exists public.campaigns (
  id text primary key default ('camp-' || replace(gen_random_uuid()::text, '-', '')),
  name text not null,
  platform text not null default 'Meta Ads',
  stage text not null default 'TEST' check (stage in ('TEST', 'SCALE_1', 'SCALE_2')),
  ad_spend numeric default 0,
  new_donors int default 0,
  revenue numeric default 0,
  hook_type text,
  status text default 'Active' check (status in ('Active', 'Paused', 'Graduated')),
  start_date date default current_date,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. DONATION PROGRAMS TABLE (DONASI & METRIK AKUISISI ZISWAF)
create table if not exists public.donation_programs (
  id text primary key default ('prog-' || replace(gen_random_uuid()::text, '-', '')),
  name text not null,
  category text not null default 'Wakaf',
  target_amount numeric default 50000000,
  realized_amount numeric default 0,
  ad_spend numeric default 0,
  new_donors int default 0,
  status text default 'Active',
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. RD_KPIS TABLE (STANDAR TOLAK UKUR KPI MATRIC & AKSI KURATIF SOP)
create table if not exists public.rd_kpis (
  id text primary key,
  no int not null,
  metric text not null,
  target_kpi text not null,
  has_product_price boolean default false,
  actual_target numeric default 0,
  actual_target_formatted text,
  current_value numeric default 0,
  current_value_formatted text,
  unit text default 'percent',
  status text default 'optimal',
  funnel_phase text,
  actions jsonb default '[]'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- 8. ROW LEVEL SECURITY (RLS) & ACCESS CONTROL (IDEMPOTENT)
-- ==============================================================================
alter table public.profiles enable row level security;
alter table public.tasks enable row level security;
alter table public.journal_logs enable row level security;
alter table public.milestones enable row level security;
alter table public.campaigns enable row level security;
alter table public.donation_programs enable row level security;
alter table public.rd_kpis enable row level security;

-- Hapus policy lama terlebih dahulu jika sudah ada (mencegah error 42710)
drop policy if exists "Allow all operations on profiles" on public.profiles;
drop policy if exists "Allow all operations on tasks" on public.tasks;
drop policy if exists "Allow all operations on journal_logs" on public.journal_logs;
drop policy if exists "Allow all operations on milestones" on public.milestones;
drop policy if exists "Allow all operations on campaigns" on public.campaigns;
drop policy if exists "Allow all operations on donation_programs" on public.donation_programs;
drop policy if exists "Allow all operations on rd_kpis" on public.rd_kpis;

-- Buat ulang policy dengan akses penuh untuk client aplikasi
create policy "Allow all operations on profiles" on public.profiles for all using (true) with check (true);
create policy "Allow all operations on tasks" on public.tasks for all using (true) with check (true);
create policy "Allow all operations on journal_logs" on public.journal_logs for all using (true) with check (true);
create policy "Allow all operations on milestones" on public.milestones for all using (true) with check (true);
create policy "Allow all operations on campaigns" on public.campaigns for all using (true) with check (true);
create policy "Allow all operations on donation_programs" on public.donation_programs for all using (true) with check (true);
create policy "Allow all operations on rd_kpis" on public.rd_kpis for all using (true) with check (true);

-- ==============================================================================
-- 9. ENABLE REAL-TIME REPLICATION (SAFE & IDEMPOTENT)
-- ==============================================================================
do $$
begin
  if not exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    create publication supabase_realtime;
  end if;

  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'profiles') then
    alter publication supabase_realtime add table public.profiles;
  end if;

  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'tasks') then
    alter publication supabase_realtime add table public.tasks;
  end if;

  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'journal_logs') then
    alter publication supabase_realtime add table public.journal_logs;
  end if;

  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'milestones') then
    alter publication supabase_realtime add table public.milestones;
  end if;

  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'campaigns') then
    alter publication supabase_realtime add table public.campaigns;
  end if;

  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'donation_programs') then
    alter publication supabase_realtime add table public.donation_programs;
  end if;

  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'rd_kpis') then
    alter publication supabase_realtime add table public.rd_kpis;
  end if;
end $$;

-- ==============================================================================
-- 10. INITIAL SEED DATA FOR YAYASAN KHOIRUR ROOZIQIIN (IDEMPOTENT)
-- ==============================================================================

-- Profile
insert into public.profiles (
  id, full_name, role, organization, quarter_target, work_capacity_hours_per_day, work_days_per_week,
  foundation_address, foundation_contact, rd_product_price
)
values (
  'default-user',
  'Sopianto Djahar',
  'R&D Digital Marketing',
  'Yayasan Khoirur Rooziqiin',
  450000000,
  8,
  5,
  'Jl. Raya Cimareme Rt.001 Rw.002 Desa Cimareme Kecamatan Ngamprah Kab. Bandung Barat',
  'admin@khoirurroziqiin.org | +62 812-9988-7766',
  50000
) on conflict (id) do update set
  full_name = excluded.full_name,
  role = excluded.role,
  foundation_address = excluded.foundation_address,
  foundation_contact = excluded.foundation_contact,
  rd_product_price = excluded.rd_product_price;

-- Seed Standard RD KPIs (9 Funnel Benchmarks)
insert into public.rd_kpis (id, no, metric, target_kpi, has_product_price, actual_target, actual_target_formatted, current_value, current_value_formatted, unit, status, actions) values
('ctr', 1, 'CTR', '> 2%', true, 2.0, '> 2%', 2.85, '2.85%', 'percent', 'optimal', '["Buat konten yang lebih menarik (komen, share, like).", "Ciri-ciri: 1. Kualitas 4K; 2. Informatif; 3. Menarik; 4. Humor."]'::jsonb),
('cpc', 2, 'CPC', '1%', true, 500, 'Rp500', 450, 'Rp450', 'currency', 'optimal', '["Perbaiki konten kreatif; Tambah variasi konten baru."]'::jsonb),
('lc_to_lpv', 3, 'LC to LPV', '80%', false, 80, '80%', 82.5, '82.5%', 'percent', 'optimal', '["Jika kurang, optimasi landing page agar lebih cepat."]'::jsonb),
('cost_lpv', 4, 'Cost LPV', '2 - 3%', true, 1500, 'Rp1.500', 1350, 'Rp1.350', 'currency', 'optimal', '["Perbaiki kecepatan landing page; Gunakan lazy load, website booster."]'::jsonb),
('cpm', 5, 'CPM', '32K', true, 32000, 'Rp32.000', 28500, 'Rp28.500', 'currency', 'optimal', '["Tunggu 2–3 hari evaluasi stabilisasi algoritma; jika tetap buruk, segera matikan (kill)."]'::jsonb),
('lpv_to_atc', 6, 'LPV to ATC', '40%', false, 40, '40%', 41.2, '41.2%', 'percent', 'optimal', '["Gunakan hypno writing di landingpage."]'::jsonb),
('atc_to_ic', 7, 'ATC to IC', '30%', false, 30, '30%', 32.8, '32.8%', 'percent', 'optimal', '["Beri penawaran menarik."]'::jsonb),
('cpr', 8, 'CPR', '25%', true, 12500, 'Rp12.500', 11800, 'Rp11.800', 'currency', 'optimal', '["Perbaiki Website: 1. Desain pro; 2. Offer (bonus/urgensi); 3. Coba turunkan harga; 4. Persingkat alur checkout."]'::jsonb),
('closing_rate', 9, 'Closing Rate', '82%', false, 82, '82%', 84.5, '84.5%', 'percent', 'optimal', '["1. Edukasi CS (IHT, WS); 2. Perbesar nilai bonus organik; 3. Fast respon maksimal 5 menit."]'::jsonb)
on conflict (id) do update set
  no = excluded.no,
  metric = excluded.metric,
  target_kpi = excluded.target_kpi,
  actual_target = excluded.actual_target,
  actual_target_formatted = excluded.actual_target_formatted,
  actions = excluded.actions;
