<template>
  <div class="space-y-6">
    <!-- Non-print Control Bar -->
    <div class="no-print glass-card rounded-2xl p-4 sm:p-5 border border-teal-100 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
          <FileText class="w-5 h-5 text-teal-600" />
          <span>Laporan Kinerja Resmi</span>
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
          <span>Simpan PDF</span>
        </button>
      </div>
    </div>

    <!-- Printable Official Document Paper (Format Standar Kertas A4: 210 x 297 mm) -->
    <div class="print-page a4-paper bg-white rounded-2xl p-6 sm:p-10 shadow-soft border border-slate-200/80 mx-auto text-slate-800 font-sans">
      
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

      <!-- DOCUMENT METADATA (Satu baris: Laporan • Periode • Tanggal Rilis) -->
      <div class="my-5 text-center">
        <div class="inline-flex items-center justify-center gap-x-3 text-xs text-slate-700 px-5 py-1.5 rounded-full bg-slate-100 border border-slate-200 font-medium whitespace-nowrap">
          <span><strong>Laporan:</strong> R&amp;D Digital Marketing</span>
          <span class="text-slate-400 font-bold">•</span>
          <span><strong>Periode:</strong> {{ periodLabel }}</span>
          <span class="text-slate-400 font-bold">•</span>
          <span><strong>Tanggal Rilis:</strong> {{ formatDate(new Date(), true) }}</span>
        </div>
      </div>

      <!-- I. CAPAIAN MATRIKS LOGFRAME (Dipindahkan ke Posisi I Sesuai Perintah Gambar) -->
      <div class="mb-6">
        <h3 class="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5 pb-1 border-b border-slate-200">
          <span class="w-2 h-2 rounded-full bg-teal-600"></span>
          <span>I. Capaian Matriks LogFrame</span>
        </h3>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          <div class="p-3 rounded-xl border border-indigo-200 bg-indigo-50/40">
            <span class="font-extrabold text-[10px] text-indigo-800 block uppercase">GOAL (Dampak Utama)</span>
            <span class="text-lg font-black text-indigo-900 mt-1 block">{{ store.logFrameProgress.GOAL.percent }}%</span>
            <span class="text-[10px] text-slate-500 font-medium">{{ store.logFrameProgress.GOAL.completed }}/{{ store.logFrameProgress.GOAL.total }} Task Tervalidasi</span>
          </div>

          <div class="p-3 rounded-xl border border-teal-200 bg-teal-50/40">
            <span class="font-extrabold text-[10px] text-teal-800 block uppercase">OUTCOME (Hasil Strategis)</span>
            <span class="text-lg font-black text-teal-900 mt-1 block">{{ store.logFrameProgress.OUTCOME.percent }}%</span>
            <span class="text-[10px] text-slate-500 font-medium">{{ store.logFrameProgress.OUTCOME.completed }}/{{ store.logFrameProgress.OUTCOME.total }} Task Tervalidasi</span>
          </div>

          <div class="p-3 rounded-xl border border-emerald-200 bg-emerald-50/40">
            <span class="font-extrabold text-[10px] text-emerald-800 block uppercase">OUTPUT (Deliverables)</span>
            <span class="text-lg font-black text-emerald-900 mt-1 block">{{ store.logFrameProgress.OUTPUT.percent }}%</span>
            <span class="text-[10px] text-slate-500 font-medium">{{ store.logFrameProgress.OUTPUT.completed }}/{{ store.logFrameProgress.OUTPUT.total }} Task Selesai</span>
          </div>

          <div class="p-3 rounded-xl border border-amber-200 bg-amber-50/40">
            <span class="font-extrabold text-[10px] text-amber-800 block uppercase">ACTIVITY (Aksi Taktis)</span>
            <span class="text-lg font-black text-amber-900 mt-1 block">{{ store.logFrameProgress.ACTIVITY.percent }}%</span>
            <span class="text-[10px] text-slate-500 font-medium">{{ store.logFrameProgress.ACTIVITY.completed }}/{{ store.logFrameProgress.ACTIVITY.total }} Aksi Dijalankan</span>
          </div>
        </div>
      </div>

      <!-- II. RINGKASAN EKSEKUTIF KPI & EFISIENSI AKUISISI (Menjadi Posisi II Sesuai Perintah Gambar) -->
      <div class="mb-6">
        <h3 class="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5 pb-1 border-b border-slate-200">
          <span class="w-2 h-2 rounded-full bg-teal-600"></span>
          <span>II. Ringkasan Eksekutif KPI &amp; Efisiensi Akuisisi</span>
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

        <!-- Tabel Baku Tolak Ukur Standar KPI Iklan (Font Diperbesar, Susunan Baru & EYD Rapih) -->
        <div class="mt-4 border border-slate-300 rounded-xl overflow-hidden shadow-micro">
          <div class="bg-slate-100 px-3.5 py-2 border-b border-slate-300 flex items-center justify-between">
            <span class="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Tolak Ukur Standar KPI Iklan
            </span>
            <span class="text-[11px] font-semibold text-slate-600">
              Harga Acuan: {{ formatCurrency(store.rdProductPrice) }}
            </span>
          </div>
          <table class="w-full text-left text-xs text-slate-800 border-collapse table-fixed">
            <colgroup>
              <col style="width: 32px" />
              <col style="width: 95px" />
              <col style="width: 80px" />
              <col style="width: 75px" />
              <col style="width: 90px" />
              <col />
            </colgroup>
            <thead>
              <tr class="bg-slate-50 font-bold border-b border-slate-300 text-slate-800 text-[11px]">
                <th class="py-2 px-1 text-center border-r border-slate-300 w-[32px]">NO</th>
                <th class="py-2 px-2 border-r border-slate-300 w-[95px]">KPI METRIC</th>
                <th class="py-2 px-1 text-center border-r border-slate-300 w-[80px]">TARGET KPI</th>
                <th class="py-2 px-1 text-center border-r border-slate-300 w-[75px]">HARGA JUAL</th>
                <th class="py-1.5 px-1 text-center bg-blue-50 font-black text-blue-900 border-r border-slate-300 w-[90px]">
                  <span class="block leading-tight">ACTUAL TARGET</span>
                  <span class="block leading-tight text-[10px]">KPI</span>
                </th>
                <th class="py-2 px-3">AKSI BILA TIDAK TERCAPAI</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200">
              <tr v-for="item in store.rdKpiList" :key="item.no" class="hover:bg-slate-50/80 transition-colors">
                <td class="py-2 px-1 text-center font-bold text-slate-500 border-r border-slate-200 align-top">{{ item.no }}</td>
                <td class="py-2 px-2 font-bold text-slate-900 border-r border-slate-200 align-top whitespace-nowrap">{{ item.metric }}</td>
                <td class="py-2 px-1 text-center border-r border-slate-200 font-bold text-slate-800 align-top whitespace-nowrap text-xs">
                  <span class="inline-block px-1.5 py-0.5 rounded bg-slate-100 text-[11px]">
                    {{ item.targetKpi }}
                  </span>
                </td>
                <td class="py-2 px-1 text-center border-r border-slate-200 text-slate-600 align-top whitespace-nowrap text-[11px]">{{ item.productPriceFormatted || '-' }}</td>
                <td class="py-2 px-1 text-center font-black text-blue-900 bg-blue-50/40 border-r border-slate-200 align-top whitespace-nowrap text-xs">{{ item.actualTargetFormatted }}</td>
                <td class="py-2 px-3 text-xs text-slate-800 align-top leading-relaxed">
                  <div class="space-y-0.5">
                    <p v-for="(act, idx) in item.actions" :key="idx" class="leading-relaxed">
                      {{ act }}
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- III. REKOMENDASI SCALE-UP (CRUCIAL TABLE) -->
      <div class="mb-6">
        <div class="pb-1 border-b border-slate-200 mb-2.5">
          <h3 class="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span>III. Rekomendasi Scale-Up</span>
          </h3>
        </div>

        <p class="text-xs text-slate-600 mb-2">
          Berdasarkan data validasi di Ad Lab, berikut urutan kampanye berdasarkan ROI aktual tertinggi beserta rekomendasi penyesuaian alokasi anggaran:
        </p>

        <!-- Table Ordered Strictly by ROI Descending - Fit 100% without scroll -->
        <div class="border border-slate-200 rounded-xl overflow-hidden">
          <table class="w-full text-left text-xs border-collapse table-fixed">
            <colgroup>
              <col style="width: 32px" />
              <col style="width: 145px" />
              <col style="width: 65px" />
              <col style="width: 75px" />
              <col style="width: 85px" />
              <col style="width: 68px" />
              <col style="width: 75px" />
              <col />
            </colgroup>
            <thead class="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold text-[10px] uppercase">
              <tr>
                <th class="py-2 px-1 text-center">Rank</th>
                <th class="py-2 px-1.5">Kampanye &amp; Platform</th>
                <th class="py-2 px-1 text-center">Stage</th>
                <th class="py-2 px-1.5 text-right whitespace-nowrap">Ad Spend</th>
                <th class="py-2 px-1.5 text-right whitespace-nowrap">Realisasi</th>
                <th class="py-2 px-1.5 text-right whitespace-nowrap">CPR</th>
                <th class="py-2 px-1.5 text-right whitespace-nowrap">ROI</th>
                <th class="py-2 px-2 text-left">Rekomendasi Aksi Selanjutnya</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr
                v-for="(camp, idx) in sortedScaleCampaigns"
                :key="camp.id"
                class="hover:bg-slate-50/80 transition-colors"
                :class="idx === 0 ? 'bg-emerald-50/30' : ''"
              >
                <td class="py-2 px-1 text-center font-bold text-slate-500">
                  <span
                    class="w-4 h-4 rounded-full inline-flex items-center justify-center text-[9px]"
                    :class="idx === 0 ? 'bg-amber-100 text-amber-800 font-extrabold' : 'bg-slate-100 text-slate-700'"
                  >
                    #{{ idx + 1 }}
                  </span>
                </td>
                <td class="py-2 px-1.5">
                  <span class="font-bold text-slate-800 text-[11px] block truncate" :title="camp.name">
                    {{ formatCampaignName(camp.name) }}
                  </span>
                  <span class="text-[9px] text-slate-400 font-medium block truncate">
                    {{ camp.platform || 'Meta Ads' }} • {{ camp.hookType || 'Winning Ads' }}
                  </span>
                </td>
                <td class="py-2 px-1 text-center">
                  <span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 whitespace-nowrap">
                    {{ camp.stage }}
                  </span>
                </td>
                <td class="py-2 px-1.5 text-right font-medium text-slate-600 whitespace-nowrap text-[11px]">
                  {{ formatCurrency(camp.adSpend) }}
                </td>
                <td class="py-2 px-1.5 text-right font-extrabold text-slate-900 whitespace-nowrap text-[11px]">
                  {{ formatCurrency(camp.revenue) }}
                </td>
                <td class="py-2 px-1.5 text-right whitespace-nowrap">
                  <span
                    class="font-bold text-[11px]"
                    :class="camp.cpr <= 25000 ? 'text-emerald-700' : 'text-slate-700'"
                  >
                    {{ formatCurrency(camp.cpr) }}
                  </span>
                </td>
                <td class="py-2 px-1.5 text-right whitespace-nowrap">
                  <span
                    class="font-black text-[11px] px-1 py-0.5 rounded"
                    :class="camp.roi >= 400 ? 'text-emerald-800 bg-emerald-100/80' : 'text-slate-800'"
                  >
                    {{ formatPercent(camp.roi) }}
                  </span>
                </td>
                <td class="py-2 px-2">
                  <div class="space-y-0.5">
                    <span
                      class="inline-block px-1.5 py-0.5 rounded text-[9px] border leading-tight font-semibold"
                      :class="camp.recBadge"
                    >
                      {{ camp.recommendation }}
                    </span>
                    <p class="text-[10px] text-slate-600 leading-snug">
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

      <!-- TANDA TANGAN & PENGESAHAN DOKUMEN (Pindah ke Kanan & Cursive Dihapus Sesuai Tanda X) -->
      <div class="pt-6 border-t border-slate-200 flex justify-end text-xs text-center">
        <div class="w-64">
          <p class="text-slate-500 font-medium">Diajukan &amp; Disusun Oleh,</p>
          <div class="h-16 flex items-end justify-center">
            <!-- Ruang tanda tangan / paraf -->
          </div>
          <p class="font-bold text-slate-900 border-t border-slate-400 pt-1 mt-1 inline-block min-w-[180px]">
            {{ store.profile.fullName }}
          </p>
          <p class="text-[11px] text-slate-500">{{ store.profile.role }}</p>
        </div>
      </div>

      <!-- Footer Info (Pindah ke Kanan Sesuai Tanda Panah Merah) -->
      <div class="mt-8 pt-4 border-t border-slate-100 flex items-center justify-end text-[10px] text-slate-400">
        <span>R&amp;D GrowthFlow Platform • Yayasan Khoirur Rooziqiin © 2026</span>
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
    'oct-2026': 'Oktober',
    'sep-2026': 'September',
    'aug-2026': 'Agustus',
    'jul-2026': 'Juli',
    'jun-2026': 'Juni',
    'may-2026': 'Mei',
    'q4-2026': 'Kuartal IV',
    'q3-2026': 'Kuartal III',
    'q2-2026': 'Kuartal II',
    'q1-2026': 'Kuartal I',
    'all': 'Semua Periode'
  };
  return map[selectedPeriod.value] || 'Oktober';
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

<style scoped>
/* A4 Dimensions (210 x 297 mm) for Screen Preview */
.a4-paper {
  max-width: 210mm;
  width: 100%;
  min-height: 297mm;
  box-sizing: border-box;
}

@media print {
  @page {
    size: A4 portrait;
    margin: 10mm 12mm 10mm 12mm;
  }

  body {
    background: white !important;
    color: black !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .no-print {
    display: none !important;
  }

  .a4-paper,
  .print-page {
    max-width: 100% !important;
    width: 100% !important;
    min-height: auto !important;
    box-shadow: none !important;
    border: none !important;
    padding: 0 !important;
    margin: 0 !important;
    border-radius: 0 !important;
  }

  table {
    page-break-inside: auto;
  }

  tr,
  .avoid-page-break {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }
}
</style>
