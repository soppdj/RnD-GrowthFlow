# MASTER PROMPT: SISTEM R&D GROWTHFLOW
**Powered by FatherLab © 2026**

> **PANDUAN PEMELIHARAAN (MAINTENANCE GUIDELINE):**  
> Dokumen ini adalah *Master Prompt* resmi arsitektur, spesifikasi teknis, alur logika, dan SOP aplikasi **R&D GrowthFlow**.  
> **Aturan Wajib:** Selalu perbarui (*update*) file ini setiap kali terjadi perubahan fitur, modifikasi struktur database, perbaikan tata letak UI, atau penyesuaian alur kerja operasional.  
> **Kebijakan Keamanan:** Seluruh kredensial sensitif (seperti PIN otentikasi, URL proyek Supabase, API Key, Token Bot Telegram, dan kredensial privat lainnya) **wajib disamarkan/dihilangkan** dari dokumen ini dan hanya dikelola melalui variabel lingkungan (*Environment Variables*).

---

## 1. IDENTITAS SISTEM & PROFIL PENGGUNA
- **Nama Aplikasi:** R&D GrowthFlow
- **Engine / Pengembang:** FatherLab © 2026
- **Entitas Lembaga:** Yayasan Khoirur Rooziqiin (Lembaga Penghimpunan ZISWAF)
- **Legalitas & UPZ:** NPYP: AZ0613 | UPZ No: 027/SK-UPZ/BAZNAS-KBB/XI/2024
- **Alamat Kantor:** Jl. Raya Cimareme Rt.001 Rw.002 Desa Cimareme, Kecamatan Ngamprah, Kab. Bandung Barat
- **Penanggung Jawab (PIC):** Sopianto Djahar (Lead R&D Digital Marketing)
- **Visi & Tagline:** *"Menebar Manfaat Berkelanjutan Melalui Inovasi Digital"*
- **Target Kuartal Acuan (Q4):** Rp 450.000.000,-
- **Hari Kerja Efektif:** 3 Hari Kerja / Minggu (dapat diatur mandiri 1 - 7 hari)

---

## 2. STACK TEKNOLOGI & ARSITEKTUR
- **Frontend Core:** Vue 3 (Composition API dengan `<script setup>`)
- **State Management:** Pinia (Reactive store tersinkronisasi)
- **CSS Framework:** Tailwind CSS v3 (Palet warna: Teal, Emerald, Slate, Cyan, Dark Glassmorphism)
- **Ikonografi:** `lucide-vue-next`
- **Engine Visualisasi & Grafik:** ApexCharts & `vue3-apexcharts` (Donut Chart & Comparison Bar Chart)
- **Database & Sinkronisasi:** Supabase (`@supabase/supabase-js`) dengan skema PostgreSQL, Row Level Security (RLS), dan mekanisme fallback penyimpanan lokal saat offline
- **Parsing Data:** `xlsx` (membaca file CSV & XLSX ekspor performa iklan Meta Ads)
- **Format Cetak Dokumen:** Standar Kertas A4 (210 x 297 mm) via CSS `@media print`
- **Build Tool:** Vite + `vite-plugin-pwa`

---

## 3. KEAMANAN & PROTOKOL AKSES (SECURITY GATEWAY)
1. **Wajib Login Setiap Link Dibuka:**
   - Setiap kali link aplikasi dibuka di browser, di-refresh, atau diakses melalui sesi baru, sistem **selalu** mengarahkan pengguna ke UI Login (`RdLoginModal.vue`).
   - Seluruh konten dashboard dan menu kerja dilindungi secara ketat dengan `v-if="isAuthenticated"` sehingga data sensitif R&D tidak akan pernah dirender ke layar sebelum otentikasi berhasil.
2. **Input PIN Terproteksi:**
   - Menggunakan input numerik 6 digit dengan visual mono-spaced tracking (`placeholder="••••••"`, `maxlength="6"`).
   - Kredensial PIN dikelola melalui konfigurasi rahasia internal (`[CONFIGURED_6_DIGIT_PIN]`).
   - Kolom PIN otomatis mendapatkan fokus (*auto-focus*) saat halaman dimuat, serta dapat dieksekusi instan dengan tombol `Enter`.
   - Tidak menyediakan tombol bypass / verifikasi kilat publik di antarmuka.
3. **Kunci Sesi Instan:**
   - Tersedia tombol gembok (*Lock Session*) pada Header dan halaman Profil untuk langsung mengunci sesi kerja kapan saja.

---

## 4. UI WELCOMING EKSEKUTIF
- Setelah verifikasi PIN berhasil, sistem dapat menampilkan modal sambutan eksklusif (`WelcomingModal.vue`) jika preferensi diaktifkan.
- Menampilkan sapaan dinamis berdasarkan waktu lokal (Pagi / Siang / Sore / Malam) beserta ikon waktu.
- 4 Kartu Kesiapan Strategis:
  1. Target Kuartal (Rp 450 Jt)
  2. Standar KPI (9 Corong SOP)
  3. Hari Kerja Efektif (3 Hari Fokus)
  4. Status Sinkronisasi Database (Supabase Online)
- Tombol aksi: *"Buka Workspace R&D Sekarang"* yang membuka dashboard secara langsung dan mulus tanpa animasi partikel konfeti.

---

## 5. MODUL & FITUR UTAMA APLIKASI

### A. Dashboard Eksekutif
1. **Welcome Banner:** Menampilkan profil Lead R&D, foto profil, dan kutipan visi inovasi.
2. **4 Kartu Metrik Utama:** Total Realisasi Donasi, Belanja Iklan (*Ad Spend*), Efisiensi CPR (*Cost Per Result*), dan Return on Investment (ROI).
3. **Work Capacity Card & Apex Donut Chart:** Memantau alokasi jam kerja harian, hari kerja efektif per minggu, dan persentase penggunaan kapasitas riset.
4. **LogFrame Progress Bars:** Visualisasi progres capaian pada 4 tingkatan matriks LogFrame.

### B. Jurnal & Agenda (Checklist & Roadmap)
1. **Hierarki LogFrame 4 Level:**
   - **GOAL:** Sasaran dampak jangka panjang program filantropi.
   - **OUTCOME:** Hasil perubahan perilaku dan akuisisi donatur baru.
   - **OUTPUT:** Deliverables fisik hasil riset (halaman landing, materi iklan, SOP).
   - **ACTIVITY:** Rincian aksi harian eksekusi operasional.
2. **Filter Minggu, Real-Time Active Week Indicator & Pengaturan Hari Kerja:**
   - Filter minggu ramping 1 baris tanpa label teks "MINGGU:": `[Semua] [Minggu 1] [Minggu 2] [Minggu 3] [Minggu 4] [Minggu 5]`.
   - **Indikator Minggu Berjalan Real-Time:** Tab minggu kalender berjalan otomatis mendapatkan penanda visual aktif (border hijau emerald bercahaya, pulsing live dot, dan badge `LIVE`) yang berpindah dinamis mengikuti tanggal sistem hari ini.
   - Input hari kerja manual ringkas: `Hari Kerja: [ 3 ] Hari/Minggu` (fleksibel 1 - 7 hari).
3. **Modal Evaluasi Tugas (Complete Task Modal):**
   - Saat menandai tugas selesai, pengguna mengisi 5 poin refleksi riset: Temuan Lapangan, Kendala, Solusi, Tindak Lanjut, dan Tautan Bukti Kerja.
4. **Agenda & Roadmap Milestone:** Pelacakan tenggat waktu target bertingkat Mingguan, Bulanan, dan Kuartalan.

### C. Ad Lab (Meta Ads Growth Hacking & Evaluator SOP)
1. **Papan Kanban 3-Stage Pipeline:**
   - **TEST:** Tahap validasi materi kreatif iklan, angle, dan audiens baru.
   - **SCALE 1:** Kampanye terbukti berhasil dinaikkan anggaran bertahap (+20%).
   - **SCALE 2:** Kampanye pemenang (*winning ads*) dengan alokasi anggaran penuh.
2. **Automated Meta Ads Evaluator (CSV / Excel):**
   - Fitur unggah file laporan performa iklan Meta Ads (.csv / .xlsx).
   - Algoritma otomatis menganalisis baris iklan terhadap standar 9 KPI Funnel dan mengklasifikasikan:
     - `WINNING ADS` -> Rekomendasi Scale-up & Penambahan Anggaran.
     - `ACCEPTABLE` -> Pertahankan performa dan pantau konsistensi.
     - `LEAKY FUNNEL` -> Peringatan corong bocor (misal CTR tinggi namun LC to LPV rendah).
     - `LOSING / KILL` -> Rekomendasi hentikan iklan untuk mencegah inefisiensi.
3. **Tabel Baku 9 Corong Metrik KPI Iklan & Aksi Kuratif SOP:**
   Urutan baku metrik:
   1. **CTR (Click-Through Rate):** Target `≥ 1.5% - 2%` (Aksi: ganti hook, thumbnail, dan 3 detik pertama video).
   2. **CPC (Cost Per Click):** Target `≤ Rp 2.000` (Aksi: perbaiki penawaran kreatif dan uji angle visual baru).
   3. **LC to LPV (Link Clicks to Landing Page Views):** Target `≥ 80%` (Aksi: optimasi kecepatan rendering landing page).
   4. **Cost LPV:** Target `≤ Rp 2.500` (Aksi: selaraskan headline web dengan pesan kreatif iklan).
   5. **CPM (Cost Per Mille):** Target `≤ Rp 35.000` (Aksi: perluas targeting audiens atau ubah format materi).
   6. **LPV to ATC (Add To Cart / Formulir):** Target `≥ 15% - 20%` (Aksi: pertajam copywriting, perjelas tombol CTA donasi).
   7. **ATC to IC (Initiate Checkout):** Target `≥ 50% - 70%` (Aksi: ringkas formulir donasi dan jelaskan pilihan nominal).
   8. **CPR (Cost Per Result / Donatur):** Target `≤ 1x Harga Acuan Produk/Program` (Aksi: evaluasi adset yang melebihi batas toleransi).
   9. **Closing Rate:** Target `≥ 60% - 80%` (Aksi: percepat follow-up CS otomatis dan sediakan metode bayar QRIS instan).
   - Nilai target aktual dihitung secara dinamis berdasarkan parameter harga acuan (`rdProductPrice`).

### D. Donasi & Metrik Akuisisi
- Pemantauan program filantropi ZISWAF (Wakaf, Zakat, Infaq, Sedekah).
- Analisis perbandingan antara realisasi donasi, target program, dan efisiensi biaya iklan.

### E. Laporan Kinerja Resmi (Format Presisi 1 Lembar A4 & PDF Export)
- **Desain Presisi 1 Lembar A4:** Seluruh susunan dokumen dioptimasi secara presisi agar muat sempurna dalam **1 halaman A4 portrait (210 x 297 mm)** tanpa tumpah ke halaman 2 saat di-print atau diekspor ke PDF.
- **Kop Surat Resmi Yayasan:** Menampilkan logo resmi di kiri, teks identitas legalitas lembaga di tengah (NPYP, UPZ BAZNAS, alamat resmi).
- **Metadata Dokumen 1 Baris:** `Laporan: R&D Digital Marketing • Periode: [Label Periode] • Tanggal Rilis: [Tanggal Rilis]`.
- **Opsi Filter Periode Fleksibel:**
  - Laporan Mingguan: Minggu 1 s/d Minggu 5 bulan berjalan.
  - Laporan Bulanan: Oktober 2026, September 2026, Agustus 2026, Juli 2026.
  - Kuartal IV & Semua Periode.
  - Rentang Tanggal Kustom (*Custom Date Range* dengan pemilih tanggal awal & akhir).
- **Sistematika Bab Dokumen:**
  - **I. Capaian Matriks LogFrame (Rata Tinggi Horizontal):** 4 kotak matriks (Goal, Outcome, Output, Activity) dengan tinggi identik merata secara horizontal, dan judul `OUTCOME (HASIL STRATEGIS)` terjaga dalam satu baris tanpa terpotong ke bawah.
  - **II. Rekapitulasi Jurnal & Agenda Kinerja R&D:** Menggantikan tabel 9 metrik KPI iklan dengan tabel rekapitulasi agenda kerja R&D terurut secara hierarkis:
    1. **Sudah Selesai (Selesai)**
    2. **On Progress (In Progress)**
    3. **Belum Selesai (Pending)**
    Lengkap dengan kolom NO, Aktivitas Jurnal, Kategori LogFrame, Tanggal, Status, dan Temuan/Tindak Lanjut serta kartu ringkasan eksekutif donasi (Realisasi, Ad Spend, CPR, ROI).
  - **III. Rekomendasi Scale-Up Ad Lab (Ringkas):** Tabel top kampanye terurut berdasarkan **ROI aktual tertinggi (descending)** beserta rekomendasi aksi anggaran.
  - **IV. Catatan Evaluasi Eksperimen & Temuan Lapangan:** Ringkasan 2 temuan lapangan dan tindak lanjut terpenting.
- **Blok Pengesahan & Tanda Tangan:** Ditempatkan rapi di sisi kanan bawah dokumen.

### F. Profil, Pengaturan Teknis & Integrasi Bot Telegram
- Pengaturan identitas PIC, alamat, kontak, dan nominal target kuartal.
- Pengaturan foto profil interaktif: kontrol pembesaran (*zoom* 50% - 200%), geser horizontal (X), dan geser vertikal (Y).
- **Infrastruktur Bot Telegram Dua Arah (Input & Edit Donasi):**
  - Bot membaca token dan admin chat ID secara dinamis dari tabel `profiles` Supabase tanpa perlu konfigurasi environment manual di Vercel.
  - Perintah didukung: `/tambah`, `/edit`, `/donasi`, `/list`, `/kpi`, `/cari`, `/hapus`, `/help`.
  - Format input fleksibel mendukung pemisah pipa (`|`) maupun koma (`,`), serta penulisan singkatan nominal (`150jt`, `2.5jt`, `500rb`).
  - **Sinkronisasi Realtime Supabase:** Setiap input atau perubahan donasi dari chat Telegram langsung memicu PostgreSQL CDC (Change Data Capture) dan otomatis mengupdate tampilan web secara seketika (*real-time*) tanpa perlu refresh.
- Uji koneksi live database Supabase (*Test Connection*).

---

## 6. SKEMA BASIS DATA (SUPABASE / POSTGRESQL DDL)
Skema database bersifat idempoten (*non-destructive*) dan aman dijalankan berulang kali:

```sql
-- 1. TABEL PROFILES (PENGATURAN PIC & LEMBAGA)
create table if not exists public.profiles (
  id text primary key default 'default-user',
  full_name text not null default 'Sopianto Djahar',
  role text default 'R&D Digital Marketing',
  organization text default 'Yayasan Khoirur Rooziqiin',
  tagline text default 'Menebar Manfaat Berkelanjutan Melalui Inovasi Digital',
  quarter_target numeric default 450000000,
  work_capacity_hours_per_day numeric default 8,
  work_days_per_week int default 3,
  current_daily_logged_hours numeric default 0,
  avatar_url text default '',
  avatar_zoom int default 100,
  avatar_x int default 50,
  avatar_y int default 50,
  foundation_address text default 'Jl. Raya Cimareme Rt.001 Rw.002 Desa Cimareme Kecamatan Ngamprah Kab. Bandung Barat',
  foundation_contact text default 'admin@khoirurroziqiin.org',
  telegram_bot_token text default '',
  telegram_admin_chat_id text default '',
  rd_product_price numeric default 50000,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. TABEL TASKS (MANAJEMEN TUGAS LOGFRAME)
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

-- 3. TABEL JOURNAL_LOGS (CATATAN VALIDASI & JURNAL RISET)
create table if not exists public.journal_logs (
  id text primary key default ('log-' || replace(gen_random_uuid()::text, '-', '')),
  date date default current_date,
  focus text not null,
  evaluation text not null,
  growth_findings text,
  next_steps text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. TABEL MILESTONES (AGENDA & ROADMAP)
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

-- 5. TABEL CAMPAIGNS (KAMPANYE AD LAB)
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

-- 6. TABEL DONATION_PROGRAMS (PROGRAM ZISWAF)
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

-- 7. TABEL RD_KPIS (STANDAR TOLAK UKUR KPI)
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

-- 8. TABEL AD_LAB_EXPERIMENTS (PIPELINE EKSPERIMEN IKLAN REALTIME)
create table if not exists public.ad_lab_experiments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid default null,
  campaign_name text not null,
  stage text not null default 'TEST' check (stage in ('TEST', 'SCALE_1', 'SCALE_2')),
  status text not null default 'ACTIVE' check (status in ('ACTIVE', 'PAUSED', 'GRADUATED', 'STOPPED')),
  ad_spend numeric default 0,
  realized_revenue numeric default 0,
  new_donors int default 0,
  roi numeric generated always as (case when ad_spend > 0 then (realized_revenue - ad_spend) / ad_spend else 0 end) stored,
  cpr numeric generated always as (case when new_donors > 0 then ad_spend / new_donors else 0 end) stored,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. PENGATURAN ROW LEVEL SECURITY (RLS)
alter table public.profiles enable row level security;
alter table public.tasks enable row level security;
alter table public.journal_logs enable row level security;
alter table public.milestones enable row level security;
alter table public.campaigns enable row level security;
alter table public.donation_programs enable row level security;
alter table public.rd_kpis enable row level security;
alter table public.ad_lab_experiments enable row level security;

-- Kebijakan Akses (Idempoten)
drop policy if exists "Allow all operations on profiles" on public.profiles;
drop policy if exists "Allow all operations on tasks" on public.tasks;
drop policy if exists "Allow all operations on journal_logs" on public.journal_logs;
drop policy if exists "Allow all operations on milestones" on public.milestones;
drop policy if exists "Allow all operations on campaigns" on public.campaigns;
drop policy if exists "Allow all operations on donation_programs" on public.donation_programs;
drop policy if exists "Allow all operations on rd_kpis" on public.rd_kpis;
drop policy if exists "Allow all operations on ad_lab_experiments" on public.ad_lab_experiments;

create policy "Allow all operations on profiles" on public.profiles for all using (true) with check (true);
create policy "Allow all operations on tasks" on public.tasks for all using (true) with check (true);
create policy "Allow all operations on journal_logs" on public.journal_logs for all using (true) with check (true);
create policy "Allow all operations on milestones" on public.milestones for all using (true) with check (true);
create policy "Allow all operations on campaigns" on public.campaigns for all using (true) with check (true);
create policy "Allow all operations on donation_programs" on public.donation_programs for all using (true) with check (true);
create policy "Allow all operations on rd_kpis" on public.rd_kpis for all using (true) with check (true);
create policy "Allow all operations on ad_lab_experiments" on public.ad_lab_experiments for all using (true) with check (true);
```

---

## 7. KONFIGURASI ENVIRONMENT VARIABLES
Seluruh URL database dan kunci API dikelola secara aman melalui file `.env.local`:
```env
VITE_SUPABASE_URL=[SUPABASE_PROJECT_URL]
VITE_SUPABASE_ANON_KEY=[SUPABASE_ANON_PUBLIC_KEY]
```
*(Jangan pernah mempublikasikan nilai mentah kredensial di repositori publik).*
