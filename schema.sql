-- ==============================================================================
-- R&D GrowthFlow • Powered by FatherLab © 2026
-- Supabase Schema & Real-Time Sync for Yayasan Khoirur Rooziqiin
-- Target Organization: Yayasan Khoirur Rooziqiin (Cimareme, Kab. Bandung Barat)
-- PIC / Lead: Sopianto Djahar (R&D Digital Marketing)
-- Catatan: Skrip ini 100% Idempotent (Dapat dijalankan berulang kali tanpa error)
-- ==============================================================================

-- 1. CREATE PROFILES TABLE
create table if not exists public.profiles (
  id text primary key default 'default-user',
  full_name text not null default 'Sopianto Djahar',
  role text default 'R&D Digital Marketing',
  organization text default 'Yayasan Khoirur Rooziqiin',
  tagline text default 'Menebar Manfaat Berkelanjutan Melalui Inovasi Digital',
  quarter_target numeric default 450000000,
  work_capacity_hours_per_day numeric default 8,
  work_days_per_week int default 5,
  foundation_address text default 'Cimareme, Kab. Bandung Barat',
  foundation_contact text default 'admin@khoirurroziqiin.org | +62 812-9988-7766',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. CREATE TASKS TABLE (LOGFRAME HIERARCHY & DAILY CHECKLIST)
create table if not exists public.tasks (
  id text primary key default ('task-' || replace(gen_random_uuid()::text, '-', '')),
  title text not null,
  category text not null check (category in ('GOAL', 'OUTCOME', 'OUTPUT', 'ACTIVITY')),
  completed boolean default false,
  estimated_hours numeric default 1.5,
  priority text default 'MEDIUM' check (priority in ('HIGH', 'MEDIUM', 'LOW')),
  date date default current_date,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. CREATE JOURNAL LOGS TABLE (GROWTH HACKING FINDINGS & EXPERIMENTS)
create table if not exists public.journal_logs (
  id text primary key default ('log-' || replace(gen_random_uuid()::text, '-', '')),
  date date default current_date,
  focus text not null,
  evaluation text not null,
  growth_findings text,
  next_steps text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. CREATE MILESTONES TABLE (ROADMAP & AGENDA DEADLINES)
create table if not exists public.milestones (
  id text primary key default ('m-' || replace(gen_random_uuid()::text, '-', '')),
  title text not null,
  deadline date not null,
  type text default 'Monthly' check (type in ('Weekly', 'Monthly', 'Quarterly')),
  category text default 'OUTCOME' check (category in ('GOAL', 'OUTCOME', 'OUTPUT', 'ACTIVITY')),
  target_metric text not null,
  progress_percent int default 0,
  status text default 'In Progress' check (status in ('In Progress', 'Done', 'Pending')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. CREATE CAMPAIGNS TABLE (AD LAB: TEST -> SCALE 1 -> SCALE 2)
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

-- 6. CREATE DONATION PROGRAMS TABLE (DONASI & METRIK AKUISISI ZISWAF)
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

-- ==============================================================================
-- 7. ROW LEVEL SECURITY (RLS) & ACCESS CONTROL (IDEMPOTENT)
-- ==============================================================================
alter table public.profiles enable row level security;
alter table public.tasks enable row level security;
alter table public.journal_logs enable row level security;
alter table public.milestones enable row level security;
alter table public.campaigns enable row level security;
alter table public.donation_programs enable row level security;

-- Hapus policy lama terlebih dahulu jika sudah ada (mencegah error 42710)
drop policy if exists "Allow all operations on profiles" on public.profiles;
drop policy if exists "Allow all operations on tasks" on public.tasks;
drop policy if exists "Allow all operations on journal_logs" on public.journal_logs;
drop policy if exists "Allow all operations on milestones" on public.milestones;
drop policy if exists "Allow all operations on campaigns" on public.campaigns;
drop policy if exists "Allow all operations on donation_programs" on public.donation_programs;

-- Buat ulang policy dengan akses penuh untuk client aplikasi
create policy "Allow all operations on profiles" on public.profiles for all using (true) with check (true);
create policy "Allow all operations on tasks" on public.tasks for all using (true) with check (true);
create policy "Allow all operations on journal_logs" on public.journal_logs for all using (true) with check (true);
create policy "Allow all operations on milestones" on public.milestones for all using (true) with check (true);
create policy "Allow all operations on campaigns" on public.campaigns for all using (true) with check (true);
create policy "Allow all operations on donation_programs" on public.donation_programs for all using (true) with check (true);

-- ==============================================================================
-- 8. ENABLE REAL-TIME REPLICATION (SAFE & IDEMPOTENT)
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
end $$;

-- ==============================================================================
-- 9. INITIAL SEED DATA FOR YAYASAN KHOIRUR ROOZIQIIN (IDEMPOTENT)
-- ==============================================================================

-- Profile
insert into public.profiles (id, full_name, role, organization, quarter_target, work_capacity_hours_per_day, work_days_per_week, foundation_address)
values (
  'default-user',
  'Sopianto Djahar',
  'R&D Digital Marketing',
  'Yayasan Khoirur Rooziqiin',
  450000000,
  8,
  5,
  'Cimareme, Kab. Bandung Barat'
) on conflict (id) do update set
  full_name = excluded.full_name,
  role = excluded.role,
  foundation_address = excluded.foundation_address;

-- Tasks (Checklist & LogFrame)
insert into public.tasks (id, title, category, completed, estimated_hours, priority, date, notes) values
('task-1', 'A/B Testing 3 Hook Video Emosional Cerita Santri Penghafal Quran (Meta Ads)', 'OUTPUT', true, 2.0, 'HIGH', current_date, 'Hook 1 menghasilkan CTR 3.8% vs Hook 2 yang 1.2%'),
('task-2', 'Optimasi Landing Page Wakaf Sumur: Ubah form 3 langkah jadi 1-step Fast Checkout via QRIS', 'OUTCOME', true, 2.5, 'HIGH', current_date, 'Conversion rate landing page melonjak dari 4.1% ke 8.9%'),
('task-3', 'Analisis Cohort Donatur Kuartal III & Desain Skema Nurturing Donasi Rutin (WhatsApp Bot)', 'ACTIVITY', false, 1.5, 'MEDIUM', current_date, 'Siapkan 4 template pesan doa harian dan reminder zakat'),
('task-4', 'Validasi Laporan Bulanan & Injeksi Anggaran Kampanye Winning ke Scale 2', 'GOAL', false, 2.0, 'HIGH', current_date, 'ROI kampanye Wakaf Produktif mencapai 525%'),
('task-5', 'Riset Copywriting Sudut Pandang "Pahala Jariyah yang Terus Mengalir Pasca Ramadhan"', 'ACTIVITY', true, 1.0, 'LOW', current_date - 1, 'Sudut pandang amal jariyah sangat resonan pada usia 35-54 tahun'),
('task-6', 'Setup Custom Conversion Event TikTok Pixel & Server-Side CAPI', 'OUTPUT', true, 1.5, 'MEDIUM', current_date - 2, 'Event CompleteDonation match rate 88%')
on conflict (id) do nothing;

-- Journal Logs
insert into public.journal_logs (id, date, focus, evaluation, growth_findings, next_steps) values
('log-1', current_date, 'Validasi Creative Angle Wakaf Sumur & Evaluasi CPR Meta Ads', 'Hari ini CPR turun ke angka Rp 41.250. Video dokumentasi air diminum santri menurunkan drop-off detik ke-3.', 'Angle "Alirkan Pahala untuk Almarhum Orang Tua" share rate 3x lebih tinggi.', 'Duplikasi adset winning ke lookalike 2% donatur loyal, naikkan budget bertahap 20%.'),
('log-2', current_date - 1, 'Eksperimen TikTok Lead Form vs Direct Landing Page', 'Biaya per lead murah (Rp 8.000) namun konversi ke transfer nyata hanya 12%. Direct Web landing page konversi ke transfer QRIS 74%.', 'Direct Web Flow jauh lebih menguntungkan dari segi LTV donatur baru.', 'Fokuskan 100% trafik TikTok ke landing page interaktif.')
on conflict (id) do nothing;

-- Milestones
insert into public.milestones (id, title, deadline, type, category, target_metric, progress_percent, status) values
('m-1', 'Peluncuran Fitur Wakaf Otomatis Autodebit Bulanan', current_date + 9, 'Monthly', 'OUTCOME', 'Target 500 Donatur Rutin', 78, 'In Progress'),
('m-2', 'Pencapaian Milestone Q4: Rp 450 Juta Penghimpunan Digital', current_date + 24, 'Quarterly', 'GOAL', 'Realisasi Rp 312 Jt (69.3%)', 69, 'In Progress'),
('m-3', 'Validasi 3 Winning Creatives untuk Program Sedekah Subuh', current_date + 6, 'Weekly', 'OUTPUT', 'CPR < Rp 25.000 & ROI > 300%', 90, 'In Progress'),
('m-4', 'Automasi Nurturing Email & WhatsApp API Terintegrasi CRM', current_date + 39, 'Monthly', 'ACTIVITY', 'Sistem Terhubung 100%', 45, 'In Progress')
on conflict (id) do nothing;

-- Ad Lab Campaigns
insert into public.campaigns (id, name, platform, stage, ad_spend, new_donors, revenue, hook_type, status, notes) values
('camp-1', 'Wakaf Sumur #AlirkanKebaikan - Video Santri', 'Meta Ads', 'SCALE_2', 14500000, 352, 90625000, 'Testimoni & B-Roll Air Sejuk', 'Active', 'Top performing! ROI 525%, CPR Rp 41.193. Siap injeksi anggaran.'),
('camp-2', 'Zakat Maal Akhir Tahun - Kalkulator Cepat', 'Google Search', 'SCALE_1', 8200000, 142, 47580000, 'High Intent Search Keyword', 'Active', 'Audiens niat tinggi. Rata-rata donasi Rp 335.000 per transaksi.'),
('camp-3', 'Sedekah Subuh Beras Santri - Emosional Sahur', 'TikTok Ads', 'SCALE_1', 6500000, 248, 29250000, 'Storytelling TikTok Relatable', 'Active', 'Volume donatur tinggi. CPR sangat efisien di Rp 26.210.'),
('camp-4', 'Beasiswa Generasi Quran - Angle Orang Tua Asuh', 'Meta Ads', 'TEST', 2800000, 46, 11500000, 'Carousel Foto Raport Santri', 'Active', 'Testing 4 kombinasi copy. CTR 2.9%, CPR Rp 60.870.'),
('camp-5', 'Tanggap Darurat Banjir & Dhuafa - Instant Push', 'Meta Ads', 'TEST', 1950000, 38, 6840000, 'Urgency Real-time News Angle', 'Active', 'Testing respon cepat tanggap darurat.'),
('camp-6', 'Wakaf Al-Quran Pelosok Nusantara - Hard Copy Hook', 'TikTok Ads', 'TEST', 1500000, 25, 3750000, 'Unboxing Al-Quran Hafalan', 'Active', 'A/B testing mikro-kreatif. Perlu tuning thumbnail.')
on conflict (id) do nothing;

-- Donation Programs
insert into public.donation_programs (id, name, category, target_amount, realized_amount, ad_spend, new_donors, status, description) values
('prog-1', 'Wakaf Sumur Air Bersih Pelosok', 'Wakaf', 150000000, 118450000, 16400000, 412, 'Active', 'Pembangunan sumur bor dan filter air untuk pesantren dan warga dhuafa.'),
('prog-2', 'Zakat Penghasilan & Maal Terpadu', 'Zakat', 120000000, 94600000, 10200000, 185, 'Active', 'Penyaluran zakat 8 asnaf prioritas fakir, miskin, dan fi sabilillah.'),
('prog-3', 'Sedekah Beras & Nutrisi Santri Yatim', 'Sedekah', 80000000, 62750000, 8100000, 310, 'Active', 'Beras premium dan nutrisi untuk 250 santri yatim dhuafa.'),
('prog-4', 'Beasiswa Kader Ulama & Tahfidz Quran', 'Pendidikan', 100000000, 36700000, 4750000, 82, 'Active', 'Biaya pendidikan dan sertifikasi mutqin santri berprestasi.')
on conflict (id) do nothing;
