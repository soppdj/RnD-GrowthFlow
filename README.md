# R&D GrowthFlow • Powered by FatherLab © 2026

**R&D GrowthFlow** adalah Progressive Web App (PWA) modern, installable, responsive, dan offline-first yang dirancang khusus untuk memimpin operasional R&D Digital Marketing di **Yayasan Khoirur Rooziqiin**.

Aplikasi ini mengintegrasikan prinsip-prinsip Growth Hacking Filantropi (ZISWAF):
1. **Efisiensi Biaya Akuisisi (CPR - Cost Per Respon / Donatur Baru)**
2. **Pengembalian Investasi Iklan (ROI - Return on Investment)**
3. **Validasi Eksperimen Bertahap (TEST → SCALE 1 → SCALE 2)**
4. **Matriks LogFrame Terpadu (GOAL, OUTCOME, OUTPUT, ACTIVITY)**

---

## 🛠️ Tech Stack & Arsitektur
- **Frontend Framework**: Vue 3 (Composition API, `<script setup>`)
- **Build Tool**: Vite 6 + `vite-plugin-pwa`
- **State Management**: Pinia Store (Reaktif, Offline-First, Local Storage Fallback)
- **Styling**: Tailwind CSS (Glassmorphism, soft warm teal/emerald palette, micro-shadows)
- **Visualisasi & Charts**: `vue3-apexcharts`, `apexcharts`, 3D Isometric SVG Bar Chart
- **Micro-Interactions**: `canvas-confetti` (efek selebrasi saat mencentang checklist tugas)
- **Icons**: `lucide-vue-next`
- **Backend Ready**: Terintegrasi dengan `@supabase/supabase-js` untuk sinkronisasi cloud real-time & auth

---

## 🌟 Modul & Fitur Utama

### 1. Dashboard
- **Welcome Banner**: Sapaan Islami personal *"Assalamu'alaikum, [Nama User]"*, tanggal realtime hari ini, dan target bulan berjalan.
- **Kartu Kapasitas Kerja**: Menghitung sisa jam kerja hari ini, jam tereksekusi, jam pending, sisa hari kerja bulan ini, serta status eksekusi (Terkendali, Optimal, Overloaded).
- **KPI Metrics Grid**: Kartu metrik CPR (Rp), ROI (%), Donatur Baru, dan Total Realisasi Penghimpunan Donasi.
- **Donut Chart**: Capaian target donasi program dan porsi kontribusi per program ZISWAF.
- **LogFrame Progress Bars**: Bar progres untuk **GOAL** (Indigo), **OUTCOME** (Teal), **OUTPUT** (Emerald), dan **ACTIVITY** (Amber) yang **otomatis naik secara reaktif** saat tugas di Jurnal dicentang (✅).

### 2. Jurnal & Agenda (Roadmap)
- **Tab Checklist Harian**:
  - Daftar tugas harian dengan kategori LogFrame, prioritas, estimasi jam, dan catatan.
  - Setiap kali checkbox dicentang, memicu efek selebrasi **`canvas-confetti`** dan memperbarui progres LogFrame di Dashboard.
  - Form & Riwayat **Log Harian** untuk mencatat fokus, evaluasi performa CTR/CPR, serta temuan eksperimen growth hacking.
- **Tab Agenda & Roadmap (Milestones)**:
  - Target jangka panjang mingguan, bulanan, dan kuartalan yang diurutkan strictly berdasarkan **deadline terdekat**.
  - Dilengkapi penghitung hari tersisa (countdown badge) dan pengubah progres persentase.

### 3. Ad Lab (3 Tahap Eksperimen)
- Kanban Board interaktif 3 kolom:
  1. **`TEST`**: Mencari winning creative & validasi mikro hook video/copywriting.
  2. **`SCALE 1`**: Winning ad set & ekspansi audiens Lookalike.
  3. **`SCALE 2`**: Injeksi anggaran penuh pada kampanye yang terbukti profitable.
- Setiap kartu kampanye menghitung otomatis secara realtime:
  $$\text{ROI (\%)} = \left(\frac{\text{Pendapatan} - \text{Ad Spend}}{\text{Ad Spend}}\right) \times 100$$
  $$\text{CPR (Rp)} = \frac{\text{Ad Spend}}{\text{Donatur Baru}}$$
- Tombol perpindahan stage cepat (*Mundur / Lanjut*) dan modal kelola eksperimen.

### 4. Donasi & Metrik Akuisisi
- Visualisasi grafik batang 3D / Isometric menyandingkan **Target vs Realisasi** per program donasi.
- Tabel rincian finansial lengkap dengan kalkulasi real-time ROI dan CPR per program (Wakaf Sumur, Zakat Maal, Sedekah Beras Santri, Beasiswa Quran).
- Form modal untuk mendaftarkan dan memperbarui data program donasi.

### 5. Laporan Resmi (Export to PDF)
- Tampilan dokumen cetak A4 formal berstandar yayasan:
  - **Kop Surat Resmi** Yayasan Khoirur Rooziqiin lengkap dengan logo, nomor SK Kemenkumham, NPWP, dan kontak.
  - Filter periode (Bulan berjalan, Kuartal IV 2026, Semua data).
  - Ringkasan KPI dan Capaian Matriks LogFrame.
  - **Rekomendasi Scale-up Kampanye (CRUCIAL)**: Tabel otomatis dari data Ad Lab yang mengurutkan kampanye aktif berdasarkan **ROI tertinggi ke terendah**, memberikan rekomendasi injeksi anggaran bulan depan (misal: *+50% Budget Injeksi*, *+25% Scale*, *Optimasi Mikro*).
  - Lembar pengesahan tanda tangan Lead R&D dan Ketua Yayasan.
  - Tombol cetak langsung via `window.print()` dengan `@media print` CSS yang menyembunyikan elemen UI non-dokumen.

### 6. Profil & Pengaturan
- Form identitas pengguna (Nama Lengkap, Yayasan, Target Kuartal, Kapasitas Jam Kerja).
- Input kredensial Supabase (`URL` & `Anon Key`) dengan tombol uji koneksi langsung.
- Cadangan data: Ekspor & Impor JSON cadangan, serta tombol reset ke demo data Yayasan Khoirur Rooziqiin.

---

## 🚀 Cara Menjalankan Proyek

```bash
# Masuk ke direktori proyek
cd "C:\Users\sopiekrai\.gemini\antigravity\scratch\rnd-growthflow"

# Jalankan development server
npm run dev
```

Server Vite lokal akan aktif di `http://localhost:5173`.

---

## 🗄️ Setup Database Supabase (Opsional)
Jika ingin menghubungkan ke Supabase Cloud:
1. Buka dashboard proyek Supabase Anda.
2. Masuk ke menu **SQL Editor**.
3. Buka file [`supabase_schema.sql`](file:///C:/Users/sopiekrai/.gemini/antigravity/scratch/rnd-growthflow/supabase_schema.sql) di root proyek ini, salin kodenya dan jalankan di SQL Editor.
4. Salin URL Proyek dan Public Anon Key ke menu **Profil & Pengaturan** di aplikasi.
