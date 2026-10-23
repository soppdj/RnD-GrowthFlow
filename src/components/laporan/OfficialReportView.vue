<template>
  <div class="space-y-6">
    <!-- Non-print Control Bar -->
    <div class="no-print glass-card rounded-2xl p-4 sm:p-5 border border-teal-100 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
          <FileText class="w-5 h-5 text-teal-600" />
          <span>Laporan Kinerja Resmi (Export PDF)</span>
        </h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Dokumen standar yayasan dengan Kop Surat, rincian KPI, dan rekomendasi injeksi anggaran Ad Lab
        </p>
      </div>

      <div class="flex items-center gap-2.5">
        <!-- Strict Period Filter -->
        <select
          v-model="selectedPeriod"
          class="px-3 py-2 rounded-xl border border-teal-200 bg-white text-xs font-semibold text-slate-700 outline-none"
        >
          <option value="q4-2026">Kuartal IV (Okt - Des 2026)</option>
          <option value="oct-2026">Bulan Berjalan (Oktober 2026)</option>
          <option value="all">Semua Periode</option>
        </select>

        <!-- Print PDF Button -->
        <button
          @click="printDocument"
          class="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-soft transition-all active:scale-95"
        >
          <Printer class="w-4 h-4" />
          <span>Cetak / Simpan PDF</span>
        </button>
      </div>
    </div>

    <!-- Printable Official Document Paper -->
    <div class="print-page bg-white rounded-2xl p-6 sm:p-10 shadow-soft border border-slate-200/80 max-w-5xl mx-auto text-slate-800 font-sans">
      
      <!-- KOP SURAT RESMI YAYASAN KHOIRUR ROOZIQIIN -->
      <div class="flex items-center justify-between gap-4 pb-4 border-b-4 border-double border-slate-800">
        <!-- Logo Yayasan -->
        <div class="w-20 h-20 rounded-2xl bg-gradient-to-tr from-teal-800 via-teal-700 to-emerald-600 flex items-center justify-center text-white shrink-0 shadow-md">
          <div class="text-center">
            <span class="block text-2xl font-black font-serif">KR</span>
            <span class="block text-[8px] tracking-widest uppercase font-bold text-teal-200">Yayasan</span>
          </div>
        </div>

        <!-- Foundation Text Info -->
        <div class="flex-1 text-center">
          <h1 class="text-xl sm:text-2xl font-black tracking-wide text-slate-900 uppercase font-serif">
            YAYASAN KHOIRUR ROOZIQIIN
          </h1>
          <p class="text-xs font-bold text-teal-800 tracking-wider uppercase mt-0.5">
            Lembaga Filantropi & Pengembangan ZISWAF Berkelanjutan
          </p>
          <p class="text-[11px] text-slate-600 mt-1">
            SK Kemenkumham RI No. AHU-0014285.AH.01.04.Tahun 2021 • NPWP: 94.321.876.5-012.000
          </p>
          <p class="text-[11px] text-slate-500">
            {{ store.profile.foundationAddress }} | Telp: +62 812-9988-7766 | Email: admin@khoirurroziqiin.org
          </p>
        </div>

        <!-- Seal Stamp Placeholder / Badge -->
        <div class="hidden sm:flex flex-col items-center justify-center w-20 text-center">
          <div class="w-14 h-14 rounded-full border-2 border-dashed border-teal-600 flex items-center justify-center p-1 text-[9px] font-bold text-teal-700 text-center leading-tight">
            DIVISI R&amp;D DIGITAL
          </div>
        </div>
      </div>

      <!-- DOCUMENT HEADER & METADATA -->
      <div class="my-6 text-center">
        <h2 class="text-base sm:text-lg font-extrabold uppercase tracking-tight text-slate-900 underline underline-offset-4 decoration-teal-600">
          LAPORAN KINERJA R&D DIGITAL MARKETING &amp; REKOMENDASI SCALE-UP
        </h2>
        <div class="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-600 mt-2 font-medium">
          <span><strong>Periode:</strong> {{ periodLabel }}</span>
          <span>•</span>
          <span><strong>Tanggal Rilis:</strong> {{ formatDate(new Date(), true) }}</span>
          <span>•</span>
          <span><strong>Penyusun:</strong> {{ store.profile.fullName }} ({{ store.profile.role }})</span>
        </div>
      </div>

      <!-- I. RINGKASAN EKSEKUTIF KPI -->
      <div class="mb-6">
        <h3 class="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5 pb-1 border-b border-slate-200">
          <span class="w-2 h-2 rounded-full bg-teal-600"></span>
          <span>I. Ringkasan Eksekutif KPI & Efisiensi Akuisisi</span>
        </h3>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 my-2 text-xs">
          <div class="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span class="text-[10px] text-slate-500 font-medium block">Total Realisasi Donasi</span>
            <span class="text-sm font-extrabold text-slate-900 block mt-0.5">
              {{ formatCurrency(store.kpiSummary.totalRevenue) }}
            </span>
            <span class="text-[10px] text-teal-700 font-semibold">
              {{ store.kpiSummary.targetAchievementPercent }}% dari target program
            </span>
          </div>

          <div class="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span class="text-[10px] text-slate-500 font-medium block">Total Belanja Iklan (Ad Spend)</span>
            <span class="text-sm font-extrabold text-slate-900 block mt-0.5">
              {{ formatCurrency(store.kpiSummary.totalAdSpend) }}
            </span>
            <span class="text-[10px] text-slate-500 font-medium">
              Alokasi eksperimen Meta &amp; TikTok
            </span>
          </div>

          <div class="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span class="text-[10px] text-slate-500 font-medium block">Efisiensi CPR (Cost/Donatur)</span>
            <span class="text-sm font-extrabold text-teal-800 block mt-0.5">
              {{ formatCurrency(store.kpiSummary.overallCPR) }}
            </span>
            <span class="text-[10px] text-emerald-700 font-bold">
              Target maksimal: Rp 50.000 (Sangat Efisien)
            </span>
          </div>

          <div class="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span class="text-[10px] text-slate-500 font-medium block">Return on Investment (ROI)</span>
            <span class="text-sm font-extrabold text-emerald-700 block mt-0.5">
              {{ formatPercent(store.kpiSummary.overallROI) }}
            </span>
            <span class="text-[10px] text-emerald-600 font-semibold">
              Net multiplier positif
            </span>
          </div>
        </div>

        <!-- Tabel Baku Standar KPI Ads (Acuan Operasional & Aksi Mitigasi) -->
        <div class="mt-4 border border-slate-300 rounded-lg overflow-hidden">
          <div class="bg-slate-100 px-3 py-1.5 border-b border-slate-300 flex items-center justify-between">
            <span class="text-[10px] font-bold text-slate-800 uppercase tracking-wider">
              Tolok Ukur Standar KPI Ads (Acuan Operasional &amp; Aksi Mitigasi)
            </span>
            <span class="text-[9px] font-semibold text-slate-600">
              Harga Jual Acuan: {{ formatCurrency(store.rdProductPrice) }}
            </span>
          </div>
          <table class="w-full text-left text-[10px] text-slate-700 border-collapse">
            <thead>
              <tr class="bg-slate-50 font-bold border-b border-slate-300 text-slate-800">
                <th class="py-1.5 px-2 w-8 text-center border-r border-slate-300">NO</th>
                <th class="py-1.5 px-2.5 w-36 border-r border-slate-300">KPI METRIC</th>
                <th class="py-1.5 px-2.5 w-32 border-r border-slate-300">TARGET KPI</th>
                <th class="py-1.5 px-2.5 w-28 border-r border-slate-300">HARGA JUAL</th>
                <th class="py-1.5 px-2.5 w-28 text-center bg-blue-50 font-extrabold text-blue-900 border-r border-slate-300">
                  ACTUAL TARGET KPI
                </th>
                <th class="py-1.5 px-2.5">AKSI BILA TIDAK TERCAPAI</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200">
              <tr v-for="item in store.rdKpiList" :key="item.no" class="hover:bg-slate-50">
                <td class="py-1.5 px-2 text-center font-bold text-slate-500 border-r border-slate-200">{{ item.no }}</td>
                <td class="py-1.5 px-2.5 font-bold text-slate-900 border-r border-slate-200">{{ item.metric }}</td>
                <td class="py-1.5 px-2.5 border-r border-slate-200 font-medium">{{ item.targetKpi }}</td>
                <td class="py-1.5 px-2.5 border-r border-slate-200 text-slate-600">{{ item.productPriceFormatted || '-' }}</td>
                <td class="py-1.5 px-2.5 text-center font-black text-blue-900 bg-blue-50/50 border-r border-slate-200">{{ item.actualTargetFormatted }}</td>
                <td class="py-1.5 px-2.5 text-[9px] text-slate-700">
                  <div class="space-y-0.5">
                    <p v-for="(act, idx) in item.actions" :key="idx" class="leading-tight">
                      {{ act }}
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- II. CAPAIAN MATRIKS LOGFRAME -->
      <div class="mb-6">
        <h3 class="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5 pb-1 border-b border-slate-200">
          <span class="w-2 h-2 rounded-full bg-teal-600"></span>
          <span>II. Capaian Matriks LogFrame (Tingkat Hirarki Sasaran)</span>
        </h3>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div class="p-2.5 rounded-lg border border-indigo-200 bg-indigo-50/30">
            <span class="font-extrabold text-[10px] text-indigo-800 block uppercase">GOAL (Dampak Utama)</span>
            <span class="text-base font-black text-indigo-900 mt-1 block">{{ store.logFrameProgress.GOAL.percent }}%</span>
            <span class="text-[10px] text-slate-500">{{ store.logFrameProgress.GOAL.completed }}/{{ store.logFrameProgress.GOAL.total }} Task Tervalidasi</span>
          </div>

          <div class="p-2.5 rounded-lg border border-teal-200 bg-teal-50/30">
            <span class="font-extrabold text-[10px] text-teal-800 block uppercase">OUTCOME (Hasil Strategis)</span>
            <span class="text-base font-black text-teal-900 mt-1 block">{{ store.logFrameProgress.OUTCOME.percent }}%</span>
            <span class="text-[10px] text-slate-500">{{ store.logFrameProgress.OUTCOME.completed }}/{{ store.logFrameProgress.OUTCOME.total }} Task Tervalidasi</span>
          </div>

          <div class="p-2.5 rounded-lg border border-emerald-200 bg-emerald-50/30">
            <span class="font-extrabold text-[10px] text-emerald-800 block uppercase">OUTPUT (Deliverables)</span>
            <span class="text-base font-black text-emerald-900 mt-1 block">{{ store.logFrameProgress.OUTPUT.percent }}%</span>
            <span class="text-[10px] text-slate-500">{{ store.logFrameProgress.OUTPUT.completed }}/{{ store.logFrameProgress.OUTPUT.total }} Task Selesai</span>
          </div>

          <div class="p-2.5 rounded-lg border border-amber-200 bg-amber-50/30">
            <span class="font-extrabold text-[10px] text-amber-800 block uppercase">ACTIVITY (Aksi Taktis)</span>
            <span class="text-base font-black text-amber-900 mt-1 block">{{ store.logFrameProgress.ACTIVITY.percent }}%</span>
            <span class="text-[10px] text-slate-500">{{ store.logFrameProgress.ACTIVITY.completed }}/{{ store.logFrameProgress.ACTIVITY.total }} Aksi Dijalankan</span>
          </div>
        </div>
      </div>

      <!-- III. REKOMENDASI SCALE-UP (CRUCIAL TABLE) -->
      <div class="mb-6">
        <div class="flex items-center justify-between pb-1 border-b border-slate-200 mb-2.5">
          <h3 class="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span>III. Rekomendasi Scale-up Eksperimen (Diurutkan ROI Tertinggi)</span>
          </h3>
          <span class="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Keputusan Injeksi Anggaran Bulan Depan
          </span>
        </div>

        <p class="text-xs text-slate-600 mb-2">
          Berdasarkan data validasi di Ad Lab, berikut urutan kampanye berdasarkan ROI aktual tertinggi beserta rekomendasi penyesuaian alokasi anggaran:
        </p>

        <!-- Table Ordered Strictly by ROI Descending -->
        <div class="overflow-x-auto border border-slate-200 rounded-xl">
          <table class="w-full text-left text-xs border-collapse">
            <thead class="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold text-[10px] uppercase">
              <tr>
                <th class="py-2.5 px-3 text-center">Rank</th>
                <th class="py-2.5 px-3">Kampanye & Platform</th>
                <th class="py-2.5 px-3">Stage Saat Ini</th>
                <th class="py-2.5 px-3 text-right">Ad Spend</th>
                <th class="py-2.5 px-3 text-right">Realisasi</th>
                <th class="py-2.5 px-3 text-right">CPR</th>
                <th class="py-2.5 px-3 text-right">ROI (%)</th>
                <th class="py-2.5 px-3">Rekomendasi Injeksi Anggaran</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr
                v-for="(camp, index) in store.scaleUpRecommendations"
                :key="camp.id"
                class="hover:bg-slate-50/60"
                :class="index === 0 ? 'bg-emerald-50/30 font-semibold' : ''"
              >
                <!-- Rank -->
                <td class="py-2.5 px-3 text-center font-bold text-slate-700">
                  <span
                    class="w-5 h-5 rounded-full inline-flex items-center justify-center text-[10px]"
                    :class="index === 0 ? 'bg-amber-400 text-slate-900 font-extrabold' : 'bg-slate-100 text-slate-600'"
                  >
                    #{{ index + 1 }}
                  </span>
                </td>

                <!-- Campaign Name & Platform -->
                <td class="py-2.5 px-3">
                  <span class="font-bold text-slate-800 block text-xs">{{ camp.name }}</span>
                  <span class="text-[10px] text-slate-500 font-medium">{{ camp.platform }} • {{ camp.hookType || 'Standard Hook' }}</span>
                </td>

                <!-- Current Stage -->
                <td class="py-2.5 px-3 whitespace-nowrap">
                  <span
                    class="px-2 py-0.5 rounded text-[10px] font-bold"
                    :class="camp.stage === 'SCALE_2' ? 'bg-emerald-100 text-emerald-800' : camp.stage === 'SCALE_1' ? 'bg-teal-100 text-teal-800' : 'bg-amber-100 text-amber-800'"
                  >
                    {{ camp.stage }}
                  </span>
                </td>

                <!-- Ad Spend -->
                <td class="py-2.5 px-3 text-right font-medium text-slate-700 whitespace-nowrap">
                  {{ formatCurrency(camp.adSpend) }}
                </td>

                <!-- Realisasi -->
                <td class="py-2.5 px-3 text-right font-bold text-emerald-800 whitespace-nowrap">
                  {{ formatCurrency(camp.revenue) }}
                </td>

                <!-- CPR -->
                <td class="py-2.5 px-3 text-right font-bold text-teal-800 whitespace-nowrap">
                  {{ formatCurrency(camp.calculatedCPR) }}
                </td>

                <!-- ROI (Crucial ordering metric) -->
                <td class="py-2.5 px-3 text-right font-black text-emerald-700 whitespace-nowrap">
                  {{ formatPercent(camp.calculatedROI) }}
                </td>

                <!-- Recommendation Action Badge -->
                <td class="py-2.5 px-3">
                  <span
                    class="inline-block px-2.5 py-1 rounded-md text-[10px] border leading-tight"
                    :class="camp.recBadge"
                  >
                    {{ camp.recommendation }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- IV. CATATAN EVALUASI JURNAL & STRATEGIS -->
      <div class="mb-8">
        <h3 class="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5 pb-1 border-b border-slate-200">
          <span class="w-2 h-2 rounded-full bg-teal-600"></span>
          <span>IV. Catatan Evaluasi Eksperimen & Temuan Lapangan</span>
        </h3>

        <div class="space-y-2 text-xs">
          <div
            v-for="log in store.journalLogs.slice(0, 2)"
            :key="log.id"
            class="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1"
          >
            <div class="flex items-center justify-between text-slate-700 font-bold">
              <span>{{ log.focus }}</span>
              <span class="text-[10px] text-slate-400 font-normal">{{ formatDate(log.date) }}</span>
            </div>
            <p class="text-slate-600"><strong class="text-slate-800">Temuan Validasi:</strong> {{ log.evaluation }}</p>
            <p class="text-slate-600"><strong class="text-slate-800">Rencana Tindak Lanjut:</strong> {{ log.nextSteps }}</p>
          </div>
        </div>
      </div>

      <!-- TANDA TANGAN & PENGESAHAN DOKUMEN -->
      <div class="pt-6 border-t border-slate-200 grid grid-cols-2 gap-8 text-xs text-center">
        <div>
          <p class="text-slate-500 font-medium">Diajukan &amp; Disusun Oleh,</p>
          <div class="h-16 flex items-end justify-center">
            <span class="font-serif italic text-teal-800 font-bold text-sm">Ahmad Fauzan</span>
          </div>
          <p class="font-bold text-slate-900 border-t border-slate-400 pt-1 mt-1 inline-block min-w-[160px]">
            {{ store.profile.fullName }}
          </p>
          <p class="text-[11px] text-slate-500">{{ store.profile.role }}</p>
        </div>

        <div>
          <p class="text-slate-500 font-medium">Mengetahui &amp; Menyetujui,</p>
          <div class="h-16 flex items-end justify-center">
            <span class="font-serif italic text-slate-700 font-bold text-sm">Khoirur Rooziqiin</span>
          </div>
          <p class="font-bold text-slate-900 border-t border-slate-400 pt-1 mt-1 inline-block min-w-[160px]">
            KH. Muhammad Sholeh, M.A.
          </p>
          <p class="text-[11px] text-slate-500">Ketua Dewan Pengurus Yayasan</p>
        </div>
      </div>

      <!-- Footer Info -->
      <div class="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
        <span>R&amp;D GrowthFlow Platform • FatherLab Framework © 2026</span>
        <span>Dokumen Resmi Internal • Rahasia &amp; Terpercaya</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useGrowthFlowStore } from '@/stores/growthFlowStore';
import { formatCurrency, formatPercent, formatDate } from '@/utils/formatters';
import { FileText, Printer } from 'lucide-vue-next';

const store = useGrowthFlowStore();
const selectedPeriod = ref('q4-2026');

const periodLabel = computed(() => {
  if (selectedPeriod.value === 'oct-2026') return 'Bulan Oktober 2026';
  if (selectedPeriod.value === 'q4-2026') return 'Kuartal IV (Okt - Des 2026)';
  return 'Tahun Berjalan 2026';
});

function printDocument() {
  window.print();
}
</script>
