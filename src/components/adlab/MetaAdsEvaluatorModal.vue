<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/50 backdrop-blur-sm animate-fade-in"
  >
    <div
      class="glass-panel rounded-2xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl border border-teal-200 overflow-hidden bg-white"
    >
      <!-- Modal Header -->
      <div class="p-4 sm:p-5 bg-gradient-to-r from-teal-800 via-teal-700 to-emerald-800 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shadow-inner shrink-0">
            <FileSpreadsheet class="w-5 h-5 text-teal-200" />
          </div>
          <div>
            <div class="flex flex-wrap items-center gap-2">
              <h3 class="text-base sm:text-lg font-extrabold tracking-tight">
                Evaluator &amp; Converter Meta Ads
              </h3>
              <span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 border border-emerald-300/30">
                Decision Engine (Lanjut vs Stop)
              </span>
            </div>
            <p class="text-xs text-teal-100/80 mt-0.5">
              Upload ekspor Excel/CSV Meta Ads Manager untuk hitung 6 KPI otomatis dan peroleh rekomendasi keputusan SOP
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2 self-end sm:self-auto">
          <!-- Acuan Harga Jual Badge -->
          <div class="px-3 py-1 rounded-xl bg-white/10 border border-white/20 text-xs font-semibold text-teal-100 flex items-center gap-1.5">
            <span>Harga Acuan:</span>
            <strong class="text-white font-extrabold">{{ formatCurrency(store.rdProductPrice) }}</strong>
          </div>

          <button
            @click="closeModal"
            class="p-1.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Modal Body (Scrollable) -->
      <div class="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        <!-- Step 1: Input Methods (Upload / Paste / Load Sample) -->
        <div class="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-teal-50/30 border border-teal-100 shadow-micro">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 pb-3 border-b border-teal-100/70">
            <div class="flex items-center gap-2">
              <span class="w-6 h-6 rounded-lg bg-teal-600 text-white font-black text-xs flex items-center justify-center">1</span>
              <h4 class="text-xs sm:text-sm font-extrabold text-slate-800">
                Pilih Metode Input Data Ekspor Meta Ads
              </h4>
            </div>

            <!-- Tabs: File Upload vs Copy-Paste -->
            <div class="flex items-center p-0.5 rounded-xl bg-teal-100/70 text-xs font-bold self-start sm:self-auto">
              <button
                @click="inputTab = 'file'"
                class="flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all"
                :class="inputTab === 'file' ? 'bg-white text-teal-900 shadow-micro' : 'text-slate-600 hover:text-slate-900'"
              >
                <UploadCloud class="w-3.5 h-3.5" />
                <span>Upload File (.xlsx / .csv)</span>
              </button>
              <button
                @click="inputTab = 'paste'"
                class="flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all"
                :class="inputTab === 'paste' ? 'bg-white text-teal-900 shadow-micro' : 'text-slate-600 hover:text-slate-900'"
              >
                <ClipboardList class="w-3.5 h-3.5" />
                <span>Copy-Paste Text</span>
              </button>
            </div>
          </div>

          <!-- Tab Content 1: Upload File -->
          <div v-if="inputTab === 'file'" class="space-y-3">
            <div
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="handleFileDrop"
              class="border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2"
              :class="isDragging ? 'border-teal-500 bg-teal-50/60' : 'border-teal-200 hover:border-teal-400 bg-white'"
              @click="$refs.fileInput.click()"
            >
              <input
                ref="fileInput"
                type="file"
                accept=".xlsx,.xls,.csv"
                class="hidden"
                @change="handleFileInput"
              />
              <div class="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shadow-micro">
                <UploadCloud class="w-6 h-6" />
              </div>
              <p class="text-xs sm:text-sm font-bold text-slate-800">
                Klik atau seret file laporan Meta Ads (.xlsx, .xls, .csv) ke sini
              </p>
              <p class="text-[11px] text-slate-400 max-w-md">
                Mendukung ekspor langsung dari Ads Manager dengan kolom Spend, Impressions, Clicks, LP Views, Results, dan Revenue
              </p>
            </div>
          </div>

          <!-- Tab Content 2: Copy-Paste -->
          <div v-else class="space-y-2">
            <textarea
              v-model="pastedText"
              rows="4"
              placeholder="Paste data tabel dari Excel/Google Sheets di sini (dengan baris header)..."
              class="w-full p-3 rounded-xl border border-teal-200 text-xs font-mono text-slate-700 bg-white focus:ring-2 focus:ring-teal-500 outline-none"
            ></textarea>
            <div class="flex justify-end">
              <button
                @click="processPastedText"
                class="px-4 py-1.5 rounded-xl text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white shadow-soft transition-all"
                :disabled="!pastedText.trim()"
              >
                Proses Data Paste
              </button>
            </div>
          </div>

          <!-- Quick Action: Load Sample Demo Data -->
          <div class="mt-3 pt-3 border-t border-teal-100 flex flex-wrap items-center justify-between text-xs gap-2">
            <span class="text-slate-500 text-[11px]">
              Belum punya file ekspor? Coba dengan data simulasi:
            </span>
            <button
              @click="loadSampleMetaAdsData"
              class="flex items-center gap-1.5 px-3 py-1 rounded-xl font-bold text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-all shadow-micro"
            >
              <Sparkles class="w-3.5 h-3.5 text-emerald-600" />
              <span>Muat Contoh Data Ekspor Meta Ads (Demo)</span>
            </button>
          </div>
        </div>

        <!-- Step 2: Evaluation Dashboard & Results -->
        <div v-if="evaluatedAds.length > 0" class="space-y-5 animate-fade-in">
          <!-- Summary Cards -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div class="p-3.5 rounded-xl bg-white border border-slate-200 shadow-micro">
              <span class="text-[10px] font-bold text-slate-400 uppercase block">Total Iklan</span>
              <span class="text-xl font-black text-slate-800 mt-0.5 block">{{ evaluatedAds.length }} Iklan</span>
              <span class="text-[10px] text-slate-500">Hasil ekstraksi</span>
            </div>

            <div class="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 shadow-micro">
              <span class="text-[10px] font-bold text-emerald-800 uppercase block">🟢 Lanjut / Scale</span>
              <span class="text-xl font-black text-emerald-700 mt-0.5 block">{{ scaleCount }} Iklan</span>
              <span class="text-[10px] text-emerald-600 font-bold">Winning (CPR aman)</span>
            </div>

            <div class="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 shadow-micro">
              <span class="text-[10px] font-bold text-amber-800 uppercase block">🟡 Pantau 2-3 Hari</span>
              <span class="text-xl font-black text-amber-700 mt-0.5 block">{{ watchCount }} Iklan</span>
              <span class="text-[10px] text-amber-600">Marginal / Optimasi</span>
            </div>

            <div class="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200 shadow-micro">
              <span class="text-[10px] font-bold text-rose-800 uppercase block">🔴 Stop / Kill</span>
              <span class="text-xl font-black text-rose-700 mt-0.5 block">{{ stopCount }} Iklan</span>
              <span class="text-[10px] text-rose-600 font-bold">CPR boncos / CTR drop</span>
            </div>
          </div>

          <!-- Controls & Filters -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div class="flex items-center gap-1.5 p-1 rounded-xl bg-teal-50 border border-teal-200/80 text-xs font-bold">
              <button
                @click="filterDecision = 'ALL'"
                class="px-2.5 py-1 rounded-lg transition-all"
                :class="filterDecision === 'ALL' ? 'bg-white text-teal-900 shadow-micro' : 'text-slate-600'"
              >
                Semua ({{ evaluatedAds.length }})
              </button>
              <button
                @click="filterDecision = 'SCALE'"
                class="px-2.5 py-1 rounded-lg transition-all"
                :class="filterDecision === 'SCALE' ? 'bg-emerald-600 text-white shadow-micro' : 'text-slate-600'"
              >
                Lanjut ({{ scaleCount }})
              </button>
              <button
                @click="filterDecision = 'WATCH'"
                class="px-2.5 py-1 rounded-lg transition-all"
                :class="filterDecision === 'WATCH' ? 'bg-amber-500 text-white shadow-micro' : 'text-slate-600'"
              >
                Pantau ({{ watchCount }})
              </button>
              <button
                @click="filterDecision = 'STOP'"
                class="px-2.5 py-1 rounded-lg transition-all"
                :class="filterDecision === 'STOP' ? 'bg-rose-600 text-white shadow-micro' : 'text-slate-600'"
              >
                Stop ({{ stopCount }})
              </button>
            </div>

            <button
              v-if="selectedScaleAds.length > 0"
              @click="importSelectedToAdLab"
              class="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white shadow-soft transition-all self-start sm:self-auto"
            >
              <PlusCircle class="w-4 h-4" />
              <span>Impor {{ selectedScaleAds.length }} Iklan Lanjut ke Ad Lab Pipeline</span>
            </button>
          </div>

          <!-- Evaluated Ads Table -->
          <div class="overflow-x-auto rounded-2xl border border-teal-200/80 shadow-soft bg-white">
            <table class="w-full text-left text-xs text-slate-700 border-collapse">
              <thead>
                <tr class="bg-gradient-to-r from-teal-800 to-teal-900 text-white font-extrabold text-[10px] uppercase tracking-wider">
                  <th scope="col" class="py-3 px-3 w-10 text-center">
                    <input
                      type="checkbox"
                      v-model="selectAllScale"
                      @change="toggleSelectAllScale"
                      class="rounded text-teal-600"
                      title="Pilih semua iklan yang dilanjut"
                    />
                  </th>
                  <th scope="col" class="py-3 px-3 w-48">NAMA KAMPANYE / IKLAN</th>
                  <th scope="col" class="py-3 px-3 w-28 text-center bg-teal-950/40">KEPUTUSAN</th>
                  <th scope="col" class="py-3 px-3 w-24">SPEND</th>
                  <th scope="col" class="py-3 px-3 w-24">CPR (HASIL)</th>
                  <th scope="col" class="py-3 px-3 w-20">CTR</th>
                  <th scope="col" class="py-3 px-3 w-20">CPC</th>
                  <th scope="col" class="py-3 px-3 w-20">COST LPV</th>
                  <th scope="col" class="py-3 px-3 w-20">CPM</th>
                  <th scope="col" class="py-3 px-4">DIAGNOSA &amp; AKSI SOP</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 font-medium">
                <tr
                  v-for="(ad, idx) in filteredAds"
                  :key="idx"
                  class="hover:bg-teal-50/30 transition-colors"
                >
                  <!-- Checkbox (only for SCALE ads) -->
                  <td class="py-3.5 px-3 text-center">
                    <input
                      v-if="ad.decision === 'SCALE'"
                      type="checkbox"
                      v-model="ad.selectedForImport"
                      class="rounded text-teal-600"
                    />
                    <span v-else class="text-slate-300">-</span>
                  </td>

                  <!-- Campaign Name -->
                  <td class="py-3.5 px-3">
                    <span class="font-extrabold text-slate-800 block leading-tight text-xs">
                      {{ ad.name }}
                    </span>
                    <span class="text-[10px] text-slate-400 mt-0.5 block">
                      {{ ad.results }} Donatur Baru • Impresi: {{ formatNumber(ad.impressions) }}
                    </span>
                  </td>

                  <!-- Decision Badge -->
                  <td class="py-3.5 px-3 text-center">
                    <span
                      class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black border shadow-micro uppercase"
                      :class="getDecisionBadgeClass(ad.decision)"
                    >
                      <span>{{ ad.decisionIcon }}</span>
                      <span>{{ ad.decisionLabel }}</span>
                    </span>
                  </td>

                  <!-- Spend -->
                  <td class="py-3.5 px-3 font-semibold text-slate-700 whitespace-nowrap">
                    {{ formatCurrency(ad.spend) }}
                  </td>

                  <!-- CPR (Cost Per Result) -->
                  <td class="py-3.5 px-3 whitespace-nowrap">
                    <span
                      class="font-black px-1.5 py-0.5 rounded text-xs"
                      :class="ad.cpr <= targetCPR ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'"
                    >
                      {{ formatCurrency(ad.cpr) }}
                    </span>
                    <span class="text-[9px] text-slate-400 block mt-0.5">
                      Max: {{ formatCurrency(targetCPR) }}
                    </span>
                  </td>

                  <!-- CTR -->
                  <td class="py-3.5 px-3 whitespace-nowrap">
                    <span
                      class="font-extrabold text-xs"
                      :class="ad.ctr >= 2.0 ? 'text-emerald-700' : 'text-rose-700'"
                    >
                      {{ ad.ctr.toFixed(2) }}%
                    </span>
                    <span class="text-[9px] text-slate-400 block">Target &gt; 2%</span>
                  </td>

                  <!-- CPC -->
                  <td class="py-3.5 px-3 whitespace-nowrap">
                    <span
                      class="font-semibold text-xs"
                      :class="ad.cpc <= targetCPC ? 'text-emerald-700' : 'text-slate-700'"
                    >
                      {{ formatCurrency(ad.cpc) }}
                    </span>
                  </td>

                  <!-- Cost LPV -->
                  <td class="py-3.5 px-3 whitespace-nowrap">
                    <span
                      class="font-semibold text-xs"
                      :class="ad.costLpv <= targetCostLPV ? 'text-emerald-700' : 'text-slate-700'"
                    >
                      {{ formatCurrency(ad.costLpv) }}
                    </span>
                  </td>

                  <!-- CPM -->
                  <td class="py-3.5 px-3 whitespace-nowrap">
                    <span
                      class="font-semibold text-xs"
                      :class="ad.cpm <= 32000 ? 'text-slate-700' : 'text-rose-700 font-bold'"
                    >
                      {{ formatCurrency(ad.cpm) }}
                    </span>
                  </td>

                  <!-- Diagnosis & SOP Action -->
                  <td class="py-3.5 px-4 text-xs">
                    <p class="font-bold text-slate-800 leading-tight">
                      {{ ad.reason }}
                    </p>
                    <p class="text-[11px] text-slate-600 mt-1 leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-200">
                      <strong>Aksi SOP:</strong> {{ ad.actionSOP }}
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0 text-xs">
        <span class="text-slate-500">
          Kriteria evaluasi mengacu pada Standar KPI Ads Yayasan Khoirur Rooziqiin (Harga: {{ formatCurrency(store.rdProductPrice) }}).
        </span>
        <button
          @click="closeModal"
          class="px-5 py-2 rounded-xl text-xs font-bold bg-slate-700 hover:bg-slate-800 text-white shadow-soft transition-all"
        >
          Tutup Evaluator
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useGrowthFlowStore } from '@/stores/growthFlowStore';
import { formatCurrency, formatNumber } from '@/utils/formatters';
import * as XLSX from 'xlsx';
import {
  FileSpreadsheet,
  UploadCloud,
  ClipboardList,
  Sparkles,
  PlusCircle,
  X
} from 'lucide-vue-next';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'imported']);

const store = useGrowthFlowStore();

const inputTab = ref('file'); // 'file' | 'paste'
const isDragging = ref(false);
const pastedText = ref('');
const filterDecision = ref('ALL');
const evaluatedAds = ref([]);
const selectAllScale = ref(false);

// Targets derived from user's SOP:
// CPC = 1% Harga Jual
// Cost LPV = 3% Harga Jual
// CPR = 25% Harga Jual
// CPM = Rp 32.000
// CTR = > 2%
const targetCPC = computed(() => Math.round((store.rdProductPrice || 50000) * 0.01));
const targetCostLPV = computed(() => Math.round((store.rdProductPrice || 50000) * 0.03));
const targetCPR = computed(() => Math.round((store.rdProductPrice || 50000) * 0.25));

const scaleCount = computed(() => evaluatedAds.value.filter(a => a.decision === 'SCALE').length);
const watchCount = computed(() => evaluatedAds.value.filter(a => a.decision === 'WATCH').length);
const stopCount = computed(() => evaluatedAds.value.filter(a => a.decision === 'STOP').length);
const selectedScaleAds = computed(() => evaluatedAds.value.filter(a => a.decision === 'SCALE' && a.selectedForImport));

const filteredAds = computed(() => {
  if (filterDecision.value === 'ALL') return evaluatedAds.value;
  return evaluatedAds.value.filter(a => a.decision === filterDecision.value);
});

function getDecisionBadgeClass(decision) {
  if (decision === 'SCALE') return 'bg-emerald-100 text-emerald-800 border-emerald-300';
  if (decision === 'WATCH') return 'bg-amber-100 text-amber-800 border-amber-300';
  return 'bg-rose-100 text-rose-800 border-rose-300';
}

function closeModal() {
  emit('close');
}

function handleFileInput(e) {
  const file = e.target.files[0];
  if (file) parseSpreadsheetFile(file);
}

function handleFileDrop(e) {
  isDragging.value = false;
  const file = e.dataTransfer.files[0];
  if (file) parseSpreadsheetFile(file);
}

function parseSpreadsheetFile(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheet];
      const rawJson = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
      processRawRows(rawJson);
    } catch (err) {
      alert('Gagal membaca file Excel/CSV: ' + err.message);
    }
  };
  reader.readAsArrayBuffer(file);
}

function processPastedText() {
  if (!pastedText.value.trim()) return;
  const lines = pastedText.value.trim().split('\n');
  if (lines.length < 2) {
    alert('Format paste harus memiliki baris judul kolom dan minimal 1 baris data!');
    return;
  }
  const sep = lines[0].includes('\t') ? '\t' : lines[0].includes(';') ? ';' : ',';
  const headers = lines[0].split(sep).map(h => h.trim().replace(/^["']|["']$/g, ''));
  const rows = lines.slice(1).map(line => {
    const vals = line.split(sep).map(v => v.trim().replace(/^["']|["']$/g, ''));
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = vals[i] !== undefined ? vals[i] : '';
    });
    return obj;
  });
  processRawRows(rows);
}

function cleanNum(val) {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  const s = String(val).replace(/Rp|\s|%|\./g, '').replace(/,/g, '.');
  const n = parseFloat(s);
  return isNaN(n) ? 0 : n;
}

function getField(row, keywords) {
  const keys = Object.keys(row);
  for (const k of keys) {
    const cleanK = k.toLowerCase().replace(/[^a-z0-9]/g, '');
    for (const kw of keywords) {
      const cleanKw = kw.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (cleanK.includes(cleanKw) || cleanKw.includes(cleanK)) {
        return row[k];
      }
    }
  }
  return '';
}

function processRawRows(rows) {
  if (!rows || rows.length === 0) {
    alert('Tidak ada baris data yang ditemukan dalam file!');
    return;
  }

  const results = rows.map((r, i) => {
    const name = getField(r, ['campaign name', 'nama kampanye', 'ad name', 'ad set name', 'nama', 'campaign']) || `Kampanye #${i + 1}`;
    const spend = cleanNum(getField(r, ['amount spent', 'jumlah yang dibelanjakan', 'spend', 'biaya', 'cost', 'anggaran']));
    const impressions = cleanNum(getField(r, ['impressions', 'penayangan', 'tayangan', 'impresi'])) || 1;
    const clicks = cleanNum(getField(r, ['link clicks', 'clicks (all)', 'klik tautan', 'klik', 'clicks'])) || 0;
    const lpViews = cleanNum(getField(r, ['landing page views', 'tampilan halaman arahan', 'lp views', 'lpv'])) || Math.round(clicks * 0.85);
    const resultsCount = cleanNum(getField(r, ['results', 'purchases', 'hasil', 'donatur', 'leads', 'konversi'])) || 0;
    const revenue = cleanNum(getField(r, ['conversion value', 'nilai konversi', 'revenue', 'nilai'])) || (resultsCount * (store.rdProductPrice || 50000));

    // Calculate the 6 KPIs
    const cpc = clicks > 0 ? Math.round(spend / clicks) : spend;
    const costLpv = lpViews > 0 ? Math.round(spend / lpViews) : spend;
    const cpm = impressions > 0 ? Math.round((spend / impressions) * 1000) : 0;
    const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
    const cpr = resultsCount > 0 ? Math.round(spend / resultsCount) : spend;

    // Decision Engine Logic based on user SOP
    let decision = 'STOP';
    let decisionIcon = '🔴';
    let decisionLabel = 'STOP / KILL';
    let reason = '';
    let actionSOP = '';

    const maxSafeCPR = targetCPR.value; // 25% of Harga Jual
    const isCPRGood = resultsCount > 0 && cpr <= maxSafeCPR;
    const isCPRAcceptable = resultsCount > 0 && cpr <= (maxSafeCPR * 1.35);
    const isCTRGood = ctr >= 2.0;

    if (isCPRGood && isCTRGood) {
      decision = 'SCALE';
      decisionIcon = '🟢';
      decisionLabel = 'LANJUT / SCALE';
      reason = `CPR sangat efisien (${formatCurrency(cpr)} <= ${formatCurrency(maxSafeCPR)}) dan CTR tinggi (${ctr.toFixed(2)}% > 2%).`;
      actionSOP = 'SOP: Pindahkan ke SCALE 1 / SCALE 2. Naikkan budget bertahap 20% per hari untuk maksimalkan perolehan donatur.';
    } else if (isCPRGood && !isCTRGood) {
      decision = 'WATCH';
      decisionIcon = '🟡';
      decisionLabel = 'PANTAU 2-3 HARI';
      reason = `CPR efisien (${formatCurrency(cpr)}), namun CTR agak rendah (${ctr.toFixed(2)}% < 2%).`;
      actionSOP = 'SOP: Bikin konten yang lebih menarik (ciri-ciri: kualitas 4K, informatif, menarik, lucu) agar CTR naik diatas 2%.';
    } else if (isCPRAcceptable && isCTRGood) {
      decision = 'WATCH';
      decisionIcon = '🟡';
      decisionLabel = 'PANTAU 2-3 HARI';
      reason = `CTR bagus (${ctr.toFixed(2)}%), namun CPR sedikit di atas target toleransi.`;
      actionSOP = 'SOP: Perbaiki website (desain pro, tambahkan bonus/offer, persingkat alur checkout jangan terlalu panjang).';
    } else if (cpm > 32000 && resultsCount > 0) {
      decision = 'WATCH';
      decisionIcon = '🟡';
      decisionLabel = 'PANTAU 2-3 HARI';
      reason = `CPM mahal (${formatCurrency(cpm)} > Rp 32.000), audiens sedang kompetitif.`;
      actionSOP = 'SOP: Tunggu 2-3 hari untuk evaluasi stabilisasi algoritma. Jika CPR tetap jelek, segera kill!';
    } else {
      decision = 'STOP';
      decisionIcon = '🔴';
      decisionLabel = 'STOP / KILL';
      if (resultsCount === 0) {
        reason = `Sudah belanja ${formatCurrency(spend)} tanpa hasil donatur (Boncos).`;
      } else {
        reason = `CPR bengkak (${formatCurrency(cpr)} jauh melebihi batas 25% harga jual: ${formatCurrency(maxSafeCPR)}).`;
      }
      actionSOP = 'SOP: Segera matikan kampanye! Evaluasi ulang materi video 4K atau perbaiki alur landing page donasi.';
    }

    return {
      name,
      spend,
      impressions,
      clicks,
      lpViews,
      results: resultsCount,
      revenue,
      cpc,
      costLpv,
      cpm,
      ctr,
      cpr,
      decision,
      decisionIcon,
      decisionLabel,
      reason,
      actionSOP,
      selectedForImport: decision === 'SCALE'
    };
  });

  evaluatedAds.value = results;
}

function loadSampleMetaAdsData() {
  const price = store.rdProductPrice || 50000;
  const sampleRows = [
    {
      'Nama Kampanye': 'Wakaf Sumur Santri - Video Dokumentasi Air 4K',
      'Amount Spent (IDR)': 1850000,
      'Impressions': 92500,
      'Link Clicks': 2450,
      'Landing Page Views': 2080,
      'Results': 162,
      'Purchases Conversion Value': 12500000
    },
    {
      'Nama Kampanye': 'Sedekah Subuh Beras - Storytelling Emosional Santri',
      'Amount Spent (IDR)': 1200000,
      'Impressions': 55000,
      'Link Clicks': 1650,
      'Landing Page Views': 1420,
      'Results': 118,
      'Purchases Conversion Value': 8850000
    },
    {
      'Nama Kampanye': 'Zakat Maal Akhir Tahun - Kalkulator Web Interaktif',
      'Amount Spent (IDR)': 2100000,
      'Impressions': 56000,
      'Link Clicks': 1320,
      'Landing Page Views': 1100,
      'Results': 75,
      'Purchases Conversion Value': 15000000
    },
    {
      'Nama Kampanye': 'Beasiswa Tahfidz Quran - Carousel Foto Santri',
      'Amount Spent (IDR)': 950000,
      'Impressions': 42000,
      'Link Clicks': 920,
      'Landing Page Views': 750,
      'Results': 42,
      'Purchases Conversion Value': 3800000
    },
    {
      'Nama Kampanye': 'Tanggap Bencana - Video Tanpa Hook 3 Detik',
      'Amount Spent (IDR)': 1500000,
      'Impressions': 32000,
      'Link Clicks': 380,
      'Landing Page Views': 240,
      'Results': 12,
      'Purchases Conversion Value': 950000
    },
    {
      'Nama Kampanye': 'Sedekah Yatim - Angle Teks Statis Tanpa Video',
      'Amount Spent (IDR)': 850000,
      'Impressions': 21000,
      'Link Clicks': 210,
      'Landing Page Views': 130,
      'Results': 7,
      'Purchases Conversion Value': 400000
    }
  ];

  processRawRows(sampleRows);
}

function toggleSelectAllScale() {
  evaluatedAds.value.forEach(ad => {
    if (ad.decision === 'SCALE') {
      ad.selectedForImport = selectAllScale.value;
    }
  });
}

function importSelectedToAdLab() {
  const toImport = selectedScaleAds.value;
  if (toImport.length === 0) return;

  toImport.forEach(ad => {
    store.addCampaign({
      name: ad.name,
      platform: 'Meta Ads',
      stage: 'SCALE_1',
      adSpend: ad.spend,
      newDonors: ad.results,
      revenue: ad.revenue,
      hookType: 'Imported Winning Meta Ads',
      status: 'Active',
      notes: `Lolos evaluasi SOP: CPR ${formatCurrency(ad.cpr)}, CTR ${ad.ctr.toFixed(2)}%.`
    });
  });

  alert(`Berhasil mengimpor ${toImport.length} kampanye winning ke tahap SCALE 1 di Ad Lab!`);
  emit('imported');
  closeModal();
}
</script>
