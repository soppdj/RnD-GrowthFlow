/**
 * Realistic Mock Data for Yayasan Khoirur Rooziqiin
 * Domain: R&D Digital Marketing & Growth Hacking (Philanthropy / ZISWAF)
 */

export const initialProfile = {
  fullName: "Sopianto Djahar",
  role: "R&D Digital Marketing",
  organization: "Yayasan Khoirur Rooziqiin",
  tagline: "Menebar Manfaat Berkelanjutan Melalui Inovasi Digital",
  quarterTarget: 450000000, // Rp 450 Juta
  workCapacityHoursPerDay: 8,
  workDaysPerWeek: 5,
  currentDailyLoggedHours: 5.5,
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
  foundationAddress: "Cimareme, Kab. Bandung Barat",
  foundationContact: "admin@khoirurroziqiin.org | +62 812-9988-7766",
  supabaseUrl: import.meta.env?.VITE_SUPABASE_URL || import.meta.env?.NEXT_PUBLIC_SUPABASE_URL || "https://rsnjmllhuucyophursng.supabase.co",
  supabaseAnonKey: import.meta.env?.VITE_SUPABASE_ANON_KEY || import.meta.env?.NEXT_PUBLIC_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzbmptbGxodXVjeW9waHVyc25nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIxMzQ0MTAsImV4cCI6MjEwNzcxMDQxMH0.nVLriES26tvWFXLbkeD0irZs7AXZvsFq7Zdue7jKClI",
  isSupabaseConnected: true
};

export const initialTasks = [
  {
    id: "task-1",
    title: "A/B Testing 3 Hook Video Emosional Cerita Santri Penghafal Quran (Meta Ads)",
    category: "OUTPUT",
    completed: true,
    estimatedHours: 2.0,
    priority: "HIGH",
    date: "2026-10-22",
    notes: "Hook 1 (Problem-Agitate-Solve) menghasilkan CTR 3.8% vs Hook 2 yang hanya 1.2%."
  },
  {
    id: "task-2",
    title: "Optimasi Landing Page Wakaf Sumur: Ubah form 3 langkah jadi 1-step Fast Checkout via QRIS",
    category: "OUTCOME",
    completed: true,
    estimatedHours: 2.5,
    priority: "HIGH",
    date: "2026-10-22",
    notes: "Conversion rate landing page melonjak dari 4.1% ke 8.9% setelah payment direct QRIS."
  },
  {
    id: "task-3",
    title: "Analisis Cohort Donatur Kuartal III & Desain Skema Nurturing Donasi Rutin (WhatsApp Bot)",
    category: "ACTIVITY",
    completed: false,
    estimatedHours: 1.5,
    priority: "MEDIUM",
    date: "2026-10-22",
    notes: "Siapkan 4 template pesan doa harian dan reminder zakat penghasilan tanggal 25."
  },
  {
    id: "task-4",
    title: "Validasi Laporan Bulanan & Injeksi Anggaran Kampanye Winning ke Scale 2",
    category: "GOAL",
    completed: false,
    estimatedHours: 2.0,
    priority: "HIGH",
    date: "2026-10-22",
    notes: "Realisasi ROI kampanye Wakaf Produktif telah mencapai 525%, siap injeksi Rp 15 Juta."
  },
  {
    id: "task-5",
    title: "Riset Copywriting Sudut Pandang 'Pahala Jariyah yang Terus Mengalir Pasca Ramadhan'",
    category: "ACTIVITY",
    completed: true,
    estimatedHours: 1.0,
    priority: "LOW",
    date: "2026-10-21",
    notes: "Sudut pandang amal jariyah sangat resonan pada segmen usia 35-54 tahun."
  },
  {
    id: "task-6",
    title: "Setup Custom Conversion Event TikTok Pixel & Server-Side CAPI",
    category: "OUTPUT",
    completed: true,
    estimatedHours: 1.5,
    priority: "MEDIUM",
    date: "2026-10-20",
    notes: "Event 'CompleteDonation' terkirim akurat dengan match rate 88%."
  }
];

export const initialJournalLogs = [
  {
    id: "log-1",
    date: "2026-10-22",
    focus: "Validasi Creative Angle Wakaf Sumur & Evaluasi CPR Meta Ads",
    evaluation: "Hari ini CPR turun ke angka Rp 41.250 (dibandingkan target batas aman Rp 55.000). Penambahan video dokumentasi sumur yang airnya langsung diminum santri berhasil menurunkan drop-off di detik ke-3 video.",
    growthFindings: "Sudut pandang 'Alirkan Pahala untuk Almarhum Orang Tua' memiliki share-rate 3x lebih tinggi dibanding sudut pandang umum.",
    nextSteps: "Duplikasi adset winning ke segmen Lookalike 2% donatur loyal kuartal lalu, dan naikkan budget harian bertahap 20% besok pagi."
  },
  {
    id: "log-2",
    date: "2026-10-21",
    focus: "Eksperimen TikTok Lead Form vs Direct Landing Page",
    evaluation: "Biaya per lead di TikTok Form murah (Rp 8.000), namun kualitas konversi ke transfer rekening nyata hanya 12%. Direct Landing Page CPR Rp 38.000 namun konversi langsung transfer via QRIS mencapai 74%.",
    growthFindings: "Direct Web Flow jauh lebih menguntungkan dari segi LTV (Lifetime Value) donatur baru.",
    nextSteps: "Stop kampanye Lead Form internal, fokuskan 100% trafik TikTok ke landing page interaktif."
  }
];

export const initialMilestones = [
  {
    id: "m-1",
    title: "Peluncuran Fitur Wakaf Otomatis Autodebit Bulanan",
    deadline: "2026-10-31",
    type: "Monthly",
    category: "OUTCOME",
    targetMetric: "Target 500 Donatur Rutin",
    progressPercent: 78,
    status: "In Progress"
  },
  {
    id: "m-2",
    title: "Pencapaian Milestone Q4: Rp 450 Juta Penghimpunan Digital",
    deadline: "2026-11-15",
    type: "Quarterly",
    category: "GOAL",
    targetMetric: "Realisasi Rp 312 Jt (69.3%)",
    progressPercent: 69,
    status: "In Progress"
  },
  {
    id: "m-3",
    title: "Validasi 3 Winning Creatives untuk Program Sedekah Subuh",
    deadline: "2026-10-28",
    type: "Weekly",
    category: "OUTPUT",
    targetMetric: "CPR < Rp 25.000 & ROI > 300%",
    progressPercent: 90,
    status: "In Progress"
  },
  {
    id: "m-4",
    title: "Automasi Nurturing Email & WhatsApp API Terintegrasi CRM",
    deadline: "2026-11-30",
    type: "Monthly",
    category: "ACTIVITY",
    targetMetric: "Sistem Terhubung 100%",
    progressPercent: 45,
    status: "In Progress"
  }
];

export const initialCampaigns = [
  {
    id: "camp-1",
    name: "Wakaf Sumur #AlirkanKebaikan - Video Santri",
    platform: "Meta Ads",
    stage: "SCALE_2",
    adSpend: 14500000,
    newDonors: 352,
    revenue: 90625000,
    hookType: "Testimoni & B-Roll Air Sejuk",
    status: "Active",
    startDate: "2026-10-01",
    notes: "Top performing campaign! ROI tembus 525%, CPR Rp 41.193. Direkomendasikan untuk injeksi anggaran ekstra."
  },
  {
    id: "camp-2",
    name: "Zakat Maal Akhir Tahun - Kalkulator Cepat",
    platform: "Google Search",
    stage: "SCALE_1",
    adSpend: 8200000,
    newDonors: 142,
    revenue: 47580000,
    hookType: "High Intent Search Keyword",
    status: "Active",
    startDate: "2026-10-08",
    notes: "Audiens dengan niat tinggi. Nilai rata-rata donasi Rp 335.000 per transaksi. ROI 480%."
  },
  {
    id: "camp-3",
    name: "Sedekah Subuh Beras Santri - Emosional Sahur",
    platform: "TikTok Ads",
    stage: "SCALE_1",
    adSpend: 6500000,
    newDonors: 248,
    revenue: 29250000,
    hookType: "Storytelling Relatable TikTok Gen-Z/Millennials",
    status: "Active",
    startDate: "2026-10-12",
    notes: "Volume donatur baru tinggi. CPR sangat efisien di Rp 26.210."
  },
  {
    id: "camp-4",
    name: "Beasiswa Generasi Quran - Angle Orang Tua Asuh",
    platform: "Meta Ads",
    stage: "TEST",
    adSpend: 2800000,
    newDonors: 46,
    revenue: 11500000,
    hookType: "Carousel Foto Raport & Surat Santri",
    status: "Active",
    startDate: "2026-10-18",
    notes: "Dalam tahap testing 4 kombinasi copy. CTR 2.9%, CPR Rp 60.870. Menunjukkan potensi membaik."
  },
  {
    id: "camp-5",
    name: "Tanggap Darurat Banjir & Dhuafa - Instant Push",
    platform: "Meta Ads",
    stage: "TEST",
    adSpend: 1950000,
    newDonors: 38,
    revenue: 6840000,
    hookType: "Urgency Real-time News Angle",
    status: "Active",
    startDate: "2026-10-19",
    notes: "Testing respon cepat. Konversi tinggi di 24 jam pertama."
  },
  {
    id: "camp-6",
    name: "Wakaf Al-Quran Pelosok Nusantara - Hard Copy Hook",
    platform: "TikTok Ads",
    stage: "TEST",
    adSpend: 1500000,
    newDonors: 25,
    revenue: 3750000,
    hookType: "Unboxing Al-Quran Hafalan",
    status: "Active",
    startDate: "2026-10-20",
    notes: "A/B testing mikro-kreatif. Perlu tuning thumbnail video."
  }
];

export const initialDonationPrograms = [
  {
    id: "prog-1",
    name: "Wakaf Sumur Air Bersih Pelosok",
    category: "Wakaf",
    targetAmount: 150000000,
    realizedAmount: 118450000,
    adSpend: 16400000,
    newDonors: 412,
    status: "Active",
    description: "Pembangunan sumur bor dan instalasi filter air untuk pesantren dan warga dhuafa."
  },
  {
    id: "prog-2",
    name: "Zakat Penghasilan & Maal Terpadu",
    category: "Zakat",
    targetAmount: 120000000,
    realizedAmount: 94600000,
    adSpend: 10200000,
    newDonors: 185,
    status: "Active",
    description: "Penyaluran zakat 8 asnaf prioritas fakir, miskin, dan fi sabilillah."
  },
  {
    id: "prog-3",
    name: "Sedekah Beras & Nutrisi Santri Yatim",
    category: "Sedekah",
    targetAmount: 80000000,
    realizedAmount: 62750000,
    adSpend: 8100000,
    newDonors: 310,
    status: "Active",
    description: "Pemberian beras premium dan vitamin berkala untuk 250 santri yatim dhuafa."
  },
  {
    id: "prog-4",
    name: "Beasiswa Kader Ulama & Tahfidz Quran",
    category: "Pendidikan",
    targetAmount: 100000000,
    realizedAmount: 36700000,
    adSpend: 4750000,
    newDonors: 82,
    status: "Active",
    description: "Biaya hidup, kitab, dan sertifikasi mutqin untuk santri berprestasi."
  }
];
