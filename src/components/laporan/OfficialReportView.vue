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

      <div class="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
        <!-- Strict Period Filter with Previous Months Option -->
        <select
          v-model="selectedPeriod"
          class="px-3 py-2 rounded-xl border border-teal-200 bg-white text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-teal-400"
        >
          <optgroup label="Bulan Berjalan">
            <option value="oct-2026">Bulan Berjalan (Oktober 2026)</option>
          </optgroup>
          <optgroup label="Bulan-Bulan Sebelumnya">
            <option value="sep-2026">September 2026</option>
            <option value="aug-2026">Agustus 2026</option>
            <option value="jul-2026">Juli 2026</option>
            <option value="jun-2026">Juni 2026</option>
            <option value="may-2026">Mei 2026</option>
          </optgroup>
          <optgroup label="Kuartal & Tahunan">
            <option value="q4-2026">Kuartal IV (Okt - Des 2026)</option>
            <option value="q3-2026">Kuartal III (Jul - Sep 2026)</option>
            <option value="q2-2026">Kuartal II (Apr - Jun 2026)</option>
            <option value="q1-2026">Kuartal I (Jan - Mar 2026)</option>
            <option value="all">Semua Periode (Tahun 2026)</option>
          </optgroup>
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
        <!-- Logo Yayasan (Official circular emblem) -->
        <img
          src="/logo-yayasan.png"
          alt="Logo Yayasan Khoirur Rooziqiin"
          class="w-20 h-20 object-contain shrink-0"
        />

        <!-- Foundation Text Info (Alamat & Legalitas Resmi Baru) -->
        <div class="flex-1 text-center">
          <h1 class="text-xl sm:text-2xl font-black tracking-wide text-slate-900 uppercase font-serif">
            YAYASAN KHOIRUR ROOZIQIIN
          </h1>
          <p class="text-xs font-bold text-teal-800 tracking-wider uppercase mt-0.5">
            LEMBAGA PENGHIMPUNAN ZISWAF
          </p>
          <p class="text-[11px] font-semibold text-slate-700 mt-0.5">
            NPYP: AZ0613 &nbsp;|&nbsp; UPZ No: 027/SK-UPZ/BAZNAS-KBB/XI/2024
          </p>
          <p class="text-[11px] text-slate-600 mt-0.5">
            Jl. Raya Cimareme Rt.001 Rw.002 Desa Cimareme<br />
            Kecamatan Ngamprah Kab. Bandung Barat
          </p>
        </div>

        <!-- Spacer to balance center alignment with logo on left (stamp badge deleted per user X mark) -->
        <div class="w-20 shrink-0 hidden sm:block"></div>
      </div>

      <!-- DOCUMENT METADATA (Header judul dicoret/dihapus sesuai tanda X) -->
      <div class="my-5 text-center">
        <div class="inline-flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-600 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 font-medium">
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

        <!-- Tabel Baku Standar KPI Iklan (Format Excel 6 Kolom) -->
        <div class="mt-4 border border-slate-300 rounded-lg overflow-hidden">
          <div class="bg-slate-100 px-3 py-1.5 border-b border-slate-300 flex items-center justify-between">
            <span class="text-[10px] font-bold text-slate-800 uppercase tracking-wider">
              Tolak Ukur Standar KPI Iklan
            </span>
            <span class="text-[9px] font-semibold text-slate-600">
              Harga Acuan: {{ formatCurrency(store.rdProductPrice) }}
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
          <span>II. Capaian Matriks LogFrame</span>
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
        <div class="pb-1 border-b border-slate-200 mb-2.5">
          <h3 class="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span>III. Rekomendasi Scale-Up Eksperimen</span>
          </h3>
        </div>

        <p class="text-xs text-slate-600 mb-2">
          Berdasarkan data validasi di Ad Lab, berikut urutan kampanye berdasarkan ROI aktual tertinggi beserta rekomendasi penyesuaian alokasi anggaran:
        </p>

        <!-- Table Ordered Strictly by ROI Descending -->
        <div class="overflow-x-auto border border-slate-200 rounded-xl">
          <table class="w-full text-left text-xs border-collapse">
            <thead class="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold text-[10px] uppercase">
              <tr>
                <th class="py-2.5 px-3 text-center w-12">Rank</th>
                <th class="py-2.5 px-3 min-w-[180px] max-w-[220px]">Kampanye &amp; Platform</th>
                <th class="py-2.5 px-3 text-center w-20">Stage</th>
                <th class="py-2.5 px-3 text-right whitespace-nowrap">Ad Spend</th>
                <th class="py-2.5 px-3 text-right whitespace-nowrap">Realisasi</th>
                <th class="py-2.5 px-3 text-right whitespace-nowrap">CPR</th>
                <th class="py-2.5 px-3 text-right whitespace-nowrap">ROI</th>
                <th class="py-2.5 px-3 min-w-[220px] text-left">Rekomendasi Aksi Selanjutnya</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr
                v-for="(camp, idx) in sortedScaleCampaigns"
                :key="camp.id"
                class="hover:bg-slate-50/80 transition-colors"
                :class="idx === 0 ? 'bg-emerald-50/30' : ''"
              >
                <td class="py-2.5 px-3 text-center font-bold text-slate-500">
                  <span
                    class="w-5 h-5 rounded-full inline-flex items-center justify-center text-[10px]"
                    :class="idx === 0 ? 'bg-amber-100 text-amber-800 font-extrabold' : 'bg-slate-100 text-slate-700'"
                  >
                    #{{ idx + 1 }}
                  </span>
                </td>
                <td class="py-2.5 px-3 max-w-[220px]">
                  <span class="font-bold text-slate-800 block truncate" :title="camp.name">
                    {{ formatCampaignName(camp.name) }}
                  </span>
                  <span class="text-[10px] text-slate-400 font-medium block truncate">
                    {{ camp.platform || 'Meta Ads' }} • {{ camp.hookType || 'Imported Winning Meta Ads' }}
                  </span>
                </td>
                <td class="py-2.5 px-3 text-center">
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {{ camp.stage }}
                  </span>
                </td>
                <td class="py-2.5 px-3 text-right font-medium text-slate-600 whitespace-nowrap">
                  {{ formatCurrency(camp.adSpend) }}
                </td>
                <td class="py-2.5 px-3 text-right font-extrabold text-slate-900 whitespace-nowrap">
                  {{ formatCurrency(camp.revenue) }}
                </td>
                <td class="py-2.5 px-3 text-right whitespace-nowrap">
                  <span
                    class="font-bold text-xs"
                    :class="camp.cpr <= 25000 ? 'text-emerald-700' : 'text-slate-700'"
                  >
                    {{ formatCurrency(camp.cpr) }}
                  </span>
                </td>
                <td class="py-2.5 px-3 text-right whitespace-nowrap">
                  <span
                    class="font-black text-xs px-1.5 py-0.5 rounded"
                    :class="camp.roi >= 400 ? 'text-emerald-800 bg-emerald-100/80' : 'text-slate-800'"
                  >
                    {{ formatPercent(camp.roi) }}
                  </span>
                </td>
                <td class="py-2.5 px-3 min-w-[220px]">
                  <div class="space-y-1">
                    <span
                      class="inline-block px-2.5 py-0.5 rounded-md text-[10px] border leading-tight"
                      :class="camp.recBadge"
                    >
                      {{ camp.recommendation }}
                    </span>
                    <p class="text-[11px] text-slate-600 leading-snug">
                      {{ camp.actionText }}
                    </p>
                  </div>
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
          <span>IV. Catatan Evaluasi Eksperimen &amp; Temuan Lapangan</span>
        </h3>

        <div class="space-y-2 text-xs">
          <div
            v-for="log in store.journalLogs.slice(0, 3)"
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

      <!-- TANDA TANGAN & PENGESAHAN DOKUMEN (Pindah ke Kanan) -->
      <div class="pt-6 border-t border-slate-200 flex justify-end text-xs text-center">
        <div class="w-64">
          <p class="text-slate-500 font-medium">Diajukan &amp; Disusun Oleh,</p>
          <div class="h-16 flex items-end justify-center">
            <span class="font-serif italic text-teal-800 font-bold text-sm">{{ store.profile.fullName }}</span>
          </div>
          <p class="font-bold text-slate-900 border-t border-slate-400 pt-1 mt-1 inline-block min-w-[180px]">
            {{ store.profile.fullName }}
          </p>
          <p class="text-[11px] text-slate-500">{{ store.profile.role }}</p>
        </div>
      </div>

      <!-- Footer Info -->
      <div class="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
        <span>R&amp;D GrowthFlow Platform • Yayasan Khoirur Rooziqiin © 2026</span>
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
const selectedPeriod = ref('oct-2026');

const periodLabel = computed(() => {
  const map = {
    'oct-2026': 'Bulan Oktober 2026',
    'sep-2026': 'Bulan September 2026',
    'aug-2026': 'Bulan Agustus 2026',
    'jul-2026': 'Bulan Juli 2026',
    'jun-2026': 'Bulan Juni 2026',
    'may-2026': 'Bulan Mei 2026',
    'q4-2026': 'Kuartal IV (Okt - Des 2026)',
    'q3-2026': 'Kuartal III (Jul - Sep 2026)',
    'q2-2026': 'Kuartal II (Apr - Jun 2026)',
    'q1-2026': 'Kuartal I (Jan - Mar 2026)',
    'all': 'Semua Periode (Tahun 2026)'
  };
  return map[selectedPeriod.value] || 'Bulan Oktober 2026';
});

function formatCampaignName(name) {
  if (!name) return 'Kampanye';
  const str = String(name).trim();
  // If enclosed or contains quoted text like "RUNAUTO CBO150-AScKS-26/10/2026", extract it
  const match = str.match(/"([^"]+)"/);
  if (match && match[1]) {
    return match[1].trim();
  }
  // If contains commas (raw CSV line), extract the clean campaign name segment
  if (str.includes(',')) {
    const parts = str.split(',');
    const candidate = parts.find(p => {
      const clean = p.trim().replace(/^["']|["']$/g, '');
      return clean.length > 3 && !/^\d{4}-\d{2}-\d{2}$/.test(clean) && isNaN(Number(clean)) && !clean.startsWith('active') && !clean.startsWith('actions:');
    });
    if (candidate) return candidate.trim().replace(/^["']|["']$/g, '');
  }
  return str;
}

const sortedScaleCampaigns = computed(() => {
  return [...store.campaigns]
    .map(c => {
      const cpr = c.newDonors > 0 ? Math.round(c.adSpend / c.newDonors) : 0;
      const roi = c.adSpend > 0 ? ((c.revenue - c.adSpend) / c.adSpend) * 100 : 0;

      let recommendation = 'Tahan Anggaran';
      let recBadge = 'bg-slate-100 text-slate-700 border-slate-200';
      let actionText = 'Biarkan berjalan stabil, pantau rasio konversi harian';

      if (c.stage === 'SCALE_2' && roi >= 400) {
        recommendation = 'Injeksi Budget +50%';
        recBadge = 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold';
        actionText = 'Injeksi anggaran ekstra & pertahankan target CPR efisien';
      } else if (c.stage === 'SCALE_1' && roi >= 300) {
        recommendation = 'Promosi ke SCALE 2';
        recBadge = 'bg-teal-100 text-teal-800 border-teal-300 font-bold';
        actionText = 'Naikkan budget bertahap 20% dan duplikasi ke broad audience';
      } else if (c.stage === 'TEST' && roi >= 200) {
        recommendation = 'Lolos Validasi ke SCALE 1';
        recBadge = 'bg-indigo-100 text-indigo-800 border-indigo-300 font-bold';
        actionText = 'Pindahkan dari tahap testing ke scale, uji lookalike 2%';
      } else if (roi < 0 || (cpr > 50000 && c.newDonors > 0)) {
        recommendation = 'Evaluasi / Matikan';
        recBadge = 'bg-rose-100 text-rose-800 border-rose-300 font-bold';
        actionText = 'Matikan adset boncos, perbaiki materi video atau landing page';
      } else if (roi >= 200) {
        recommendation = 'Lanjut & Scale Bertahap';
        recBadge = 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold';
        actionText = 'Naikkan budget 20% per hari, pertahankan CPR < Rp 25.000';
      }

      if (c.notes && c.notes.length > 5) {
        actionText = c.notes;
      }

      return {
        ...c,
        cpr,
        roi,
        recommendation,
        recBadge,
        actionText
      };
    })
    .sort((a, b) => b.roi - a.roi);
});

function printDocument() {
  window.print();
}
</script>
