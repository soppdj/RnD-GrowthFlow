<template>
  <div class="space-y-4">
    <!-- SECTION 1: FINANSIAL & AKUISISI INTI (CORE GROWTH METRICS) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- 1. CPR (Cost Per Respon / Akuisisi Donatur Baru) -->
      <div class="glass-card glass-card-hover rounded-2xl p-4 sm:p-5 border border-teal-100 shadow-soft">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Efisiensi CPR</span>
          <div class="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
            <BadgePercent class="w-4 h-4" />
          </div>
        </div>
        <div class="mt-3">
          <p class="text-2xl font-extrabold text-slate-800 tracking-tight">
            {{ formatCurrency(kpi.overallCPR) }}
          </p>
          <div class="flex items-center gap-1.5 mt-1">
            <span class="inline-flex items-center text-xs font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              ↓ 14.2% Efisien
            </span>
            <span class="text-[11px] text-slate-400">Target baku max Rp 45.000</span>
          </div>
        </div>
      </div>

      <!-- 2. ROI (Return on Investment Iklan) -->
      <div class="glass-card glass-card-hover rounded-2xl p-4 sm:p-5 border border-teal-100 shadow-soft">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Return Investasi (ROI)</span>
          <div class="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <TrendingUp class="w-4 h-4" />
          </div>
        </div>
        <div class="mt-3">
          <p class="text-2xl font-extrabold text-emerald-700 tracking-tight">
            {{ formatPercent(kpi.overallROI) }}
          </p>
          <div class="flex items-center gap-1.5 mt-1">
            <span class="inline-flex items-center text-xs font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              High Multiplier
            </span>
            <span class="text-[11px] text-slate-400">Target baku > 300%</span>
          </div>
        </div>
      </div>

      <!-- 3. Donatur Baru Terakuisisi -->
      <div class="glass-card glass-card-hover rounded-2xl p-4 sm:p-5 border border-teal-100 shadow-soft">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Donatur Baru</span>
          <div class="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
            <Users class="w-4 h-4" />
          </div>
        </div>
        <div class="mt-3">
          <p class="text-2xl font-extrabold text-slate-800 tracking-tight">
            {{ formatNumber(kpi.totalNewDonors) }} <span class="text-xs font-normal text-slate-500">Jiwa</span>
          </p>
          <div class="flex items-center gap-1.5 mt-1">
            <span class="inline-flex items-center text-xs font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
              +18.5% MoM
            </span>
            <span class="text-[11px] text-slate-400">Database aktif terverifikasi</span>
          </div>
        </div>
      </div>

      <!-- 4. Total Realisasi vs Ad Spend -->
      <div class="glass-card glass-card-hover rounded-2xl p-4 sm:p-5 border border-teal-100 shadow-soft">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Penghimpunan</span>
          <div class="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <Wallet class="w-4 h-4" />
          </div>
        </div>
        <div class="mt-3">
          <p class="text-2xl font-extrabold text-slate-800 tracking-tight">
            {{ formatCompactCurrency(kpi.totalRevenue) }}
          </p>
          <div class="flex items-center gap-1.5 mt-1 text-[11px] text-slate-500">
            <span>Ad Spend: <strong>{{ formatCompactCurrency(kpi.totalAdSpend) }}</strong></span>
            <span>•</span>
            <span class="text-teal-700 font-bold">{{ kpi.targetAchievementPercent }}% Capaian</span>
          </div>
        </div>
      </div>
    </div>

    <!-- SECTION 2: STANDAR KERJA & VALIDASI R&D (GROWTH HACKING BENCHMARKS) -->
    <div class="glass-card rounded-2xl p-5 border border-teal-100/90 shadow-soft">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-3 border-b border-teal-100/70">
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs">
            <FlaskConical class="w-4 h-4 text-teal-700" />
          </div>
          <div>
            <h3 class="text-sm font-extrabold text-slate-800 flex items-center gap-2">
              <span>Standard Kinerja &amp; Validasi R&amp;D</span>
              <span class="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                Playbook Yayasan Khoirur Rooziqiin
              </span>
            </h3>
            <p class="text-[11px] text-slate-500">Tolok ukur keberhasilan riset eksperimen, kualitas akuisisi, dan efisiensi funnel</p>
          </div>
        </div>

        <button
          @click="showPlaybookModal = true"
          class="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1.5 self-start sm:self-auto bg-teal-50/80 px-2.5 py-1 rounded-lg border border-teal-200 transition-colors"
        >
          <HelpCircle class="w-3.5 h-3.5" />
          <span>Panduan Standard Baku</span>
        </button>
      </div>

      <!-- 4 Standard R&D Benchmark Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <!-- R&D KPI 1: Creative Win Rate (Rasio Validasi) -->
        <div class="p-3.5 rounded-xl bg-white/80 border border-teal-100/80 shadow-micro hover:border-teal-300 transition-all">
          <div class="flex items-center justify-between text-xs mb-1">
            <span class="text-slate-500 font-medium">Win Rate Eksperimen</span>
            <span class="font-extrabold text-xs px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              Target > 50%
            </span>
          </div>
          <div class="flex items-baseline gap-1 mt-1">
            <span class="text-xl font-black text-slate-800">{{ kpi.validationWinRate }}%</span>
            <span class="text-[10px] text-emerald-700 font-bold">({{ kpi.scaleCampaignsCount }}/{{ kpi.totalCampaignsCount }} Valid)</span>
          </div>
          <p class="text-[10px] text-slate-400 mt-1">
            Rasio kampanye TEST yang berhasil lolos ke tahap SCALE 1/2
          </p>
        </div>

        <!-- R&D KPI 2: Nilai Donasi Rata-rata (AOV / Gift Size) -->
        <div class="p-3.5 rounded-xl bg-white/80 border border-teal-100/80 shadow-micro hover:border-teal-300 transition-all">
          <div class="flex items-center justify-between text-xs mb-1">
            <span class="text-slate-500 font-medium">Nilai Donasi Rata-rata (AOV)</span>
            <span class="font-extrabold text-xs px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
              Kualitas Donatur
            </span>
          </div>
          <div class="flex items-baseline gap-1 mt-1">
            <span class="text-xl font-black text-teal-800">{{ formatCurrency(kpi.avgDonationValue) }}</span>
          </div>
          <p class="text-[10px] text-slate-400 mt-1">
            Rata-rata nominal per donatur baru yang diakuisisi iklan
          </p>
        </div>

        <!-- R&D KPI 3: Conversion Rate Web Landing Page -->
        <div class="p-3.5 rounded-xl bg-white/80 border border-teal-100/80 shadow-micro hover:border-teal-300 transition-all">
          <div class="flex items-center justify-between text-xs mb-1">
            <span class="text-slate-500 font-medium">Conversion Rate (CR)</span>
            <span class="font-extrabold text-xs px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              Target > 5%
            </span>
          </div>
          <div class="flex items-baseline gap-1 mt-1">
            <span class="text-xl font-black text-slate-800">{{ kpi.landingPageConversionRate }}%</span>
            <span class="text-[10px] text-emerald-700 font-bold">Fast Checkout</span>
          </div>
          <p class="text-[10px] text-slate-400 mt-1">
            Rasio pengunjung web donasi yang sukses transaksi via QRIS/Transfer
          </p>
        </div>

        <!-- R&D KPI 4: LTV to CPR Ratio (Skalabilitas Nurturing) -->
        <div class="p-3.5 rounded-xl bg-white/80 border border-teal-100/80 shadow-micro hover:border-teal-300 transition-all">
          <div class="flex items-center justify-between text-xs mb-1">
            <span class="text-slate-500 font-medium">LTV to CPR Ratio</span>
            <span class="font-extrabold text-xs px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
              Target > 3.0x
            </span>
          </div>
          <div class="flex items-baseline gap-1 mt-1">
            <span class="text-xl font-black text-indigo-700">{{ kpi.ltvMultiplier }}x</span>
            <span class="text-[10px] text-indigo-700 font-bold">Zona Sehat</span>
          </div>
          <p class="text-[10px] text-slate-400 mt-1">
            Nilai akumulasi donasi donatur berulang dibanding biaya akuisisi
          </p>
        </div>
      </div>
    </div>

    <!-- MODAL PANDUAN STANDARD BAKU R&D (PLAYBOOK) -->
    <div
      v-if="showPlaybookModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
    >
      <div class="glass-panel rounded-2xl w-full max-w-xl p-6 shadow-2xl border border-teal-100 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between pb-3 border-b border-teal-100">
          <h3 class="text-base font-bold text-slate-800 flex items-center gap-2">
            <BookOpen class="w-5 h-5 text-teal-600" />
            <span>Standard Baku Kinerja R&amp;D Digital Marketing</span>
          </h3>
          <button @click="showPlaybookModal = false" class="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X class="w-5 h-5" />
          </button>
        </div>

        <div class="mt-4 space-y-4 text-xs text-slate-600">
          <p class="leading-relaxed">
            Sebagai divisi <strong>R&amp;D Digital Marketing Yayasan Khoirur Rooziqiin</strong>, setiap eksperimen iklan dan alokasi anggaran dievaluasi berdasarkan 5 pilar baku berikut:
          </p>

          <div class="space-y-3">
            <div class="p-3 rounded-xl bg-teal-50/60 border border-teal-100">
              <h4 class="font-bold text-teal-900 text-xs">1. Cost Per Respon / Donatur (CPR &lt; Rp 45.000)</h4>
              <p class="mt-0.5 text-slate-600">
                Biaya untuk mendapatkan 1 donatur baru yang terverifikasi nomor WhatsApp dan transfernya. Jika CPR &gt; Rp 55.000, kampanye wajib dimatikan atau dirombak hook videonya.
              </p>
            </div>

            <div class="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100">
              <h4 class="font-bold text-emerald-900 text-xs">2. Return On Ad Spend / ROI (&gt; 300%)</h4>
              <p class="mt-0.5 text-slate-600">
                Nilai pengembalian dana donasi dibanding anggaran iklan. Minimal 3x lipat agar operasional penyaluran dan dakwah filantropi tetap memiliki surplus manfaat berkelanjutan.
              </p>
            </div>

            <div class="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100">
              <h4 class="font-bold text-indigo-900 text-xs">3. Creative Validation Win Rate (&gt; 50%)</h4>
              <p class="mt-0.5 text-slate-600">
                Dari minimal 5 variasi materi iklan (hook visual, copywriting masalah-solusi, testimoni penerima manfaat) di tahap <code>TEST</code>, minimal 2-3 materi harus mampu naik kelas ke tahap <code>SCALE</code>.
              </p>
            </div>

            <div class="p-3 rounded-xl bg-amber-50/60 border border-amber-100">
              <h4 class="font-bold text-amber-900 text-xs">4. Conversion Rate Landing Page (&gt; 5.0%)</h4>
              <p class="mt-0.5 text-slate-600">
                Dari setiap 100 pengunjung web yang datang dari TikTok/Meta Ads, minimal 5 orang menyelesaikan donasi. Dioptimalkan dengan form 1-step checkout dan pembayaran instan QRIS.
              </p>
            </div>

            <div class="p-3 rounded-xl bg-purple-50/60 border border-purple-100">
              <h4 class="font-bold text-purple-900 text-xs">5. LTV to CPR Ratio (&gt; 3.5x)</h4>
              <p class="mt-0.5 text-slate-600">
                Mengukur efektivitas program *nurturing* donatur berulang (wakaf rutin bulanan / reminder zakat via WhatsApp) agar nilai donasi kumulatif berlipat ganda jauh melampaui biaya akuisisi pertama.
              </p>
            </div>
          </div>

          <div class="pt-3 border-t border-teal-100 flex justify-end">
            <button
              @click="showPlaybookModal = false"
              class="px-5 py-2 rounded-xl text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white shadow-soft"
            >
              Mengerti &amp; Terapkan
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useGrowthFlowStore } from '@/stores/growthFlowStore';
import {
  formatCurrency,
  formatCompactCurrency,
  formatPercent,
  formatNumber
} from '@/utils/formatters';
import {
  BadgePercent,
  TrendingUp,
  Users,
  Wallet,
  FlaskConical,
  HelpCircle,
  BookOpen,
  X
} from 'lucide-vue-next';

const store = useGrowthFlowStore();
const kpi = computed(() => store.kpiSummary);
const showPlaybookModal = ref(false);
</script>
