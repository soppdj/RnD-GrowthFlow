<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/50 backdrop-blur-sm animate-fade-in"
  >
    <div
      class="glass-panel rounded-2xl w-full max-w-7xl max-h-[94vh] flex flex-col shadow-2xl border border-teal-200 overflow-hidden bg-white"
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
                Decision Engine (Lanjut vs Pantau vs Stop)
              </span>
            </div>
            <p class="text-xs text-teal-100/80 mt-0.5">
              Upload ekspor Excel/CSV Meta Ads Manager untuk evaluasi otomatis seluruh corong konversi (CTR, CPC, Cost LPV, LC to LPV, LPV to ATC, ATC to IC, CPM, CPR) sesuai SOP
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
              <p class="text-xs sm:text-sm font-bold text-slate-700">
                Klik untuk memilih file Excel/CSV atau drag &amp; drop ke sini
              </p>
              <p class="text-[11px] text-slate-400">
                Mendukung file ekspor resmi Ads Manager (.xlsx, .xls, .csv). Sistem otomatis mendeteksi kolom Spend, Impressions, Clicks, Landing Page Views, Adds to Cart, Checkouts, dan Results.
              </p>
            </div>
          </div>

          <!-- Tab Content 2: Copy-Paste -->
          <div v-else class="space-y-3">
            <textarea
              v-model="pastedText"
              rows="5"
              placeholder="Paste data tabel Meta Ads di sini (termasuk baris header kolom)...&#10;Contoh format tab-separated atau comma-separated:&#10;Campaign Name&#9;Amount Spent&#9;Impressions&#9;Link Clicks&#9;Landing Page Views&#9;Adds to Cart&#9;Checkouts Initiated&#9;Results"
              class="w-full text-xs font-mono p-3 rounded-xl border border-teal-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none resize-y"
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
              Belum punya file ekspor? Coba dengan data simulasi corong konversi lengkap:
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
          <!-- Standar KPI Benchmark Reference Strip -->
          <div class="p-3 rounded-xl bg-slate-50 border border-teal-200/80 shadow-micro flex flex-wrap items-center justify-between gap-2 text-xs">
            <div class="flex items-center gap-1.5 font-bold text-slate-700">
              <span class="w-2 h-2 rounded-full bg-teal-600"></span>
              <span class="text-[11px] uppercase tracking-wider text-teal-900">Standar Acuan KPI:</span>
            </div>
            <div class="flex flex-wrap items-center gap-2.5 text-[11px]">
              <span class="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                CPC (1%): <strong>≤ {{ formatCurrency(targetCPC) }}</strong>
              </span>
              <span class="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                Cost LPV (2-3%): <strong>≤ {{ formatCurrency(targetCostLPV) }}</strong>
              </span>
              <span class="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                CTR: <strong>&gt; 2.0%</strong>
              </span>
              <span class="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-300 text-emerald-800 font-semibold">
                LC to LPV: <strong>≥ 80%</strong>
              </span>
              <span class="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-300 text-emerald-800 font-semibold">
                LPV to ATC: <strong>≥ 40%</strong>
              </span>
              <span class="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-300 text-emerald-800 font-semibold">
                ATC to IC: <strong>≥ 30%</strong>
              </span>
              <span class="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                CPM: <strong>≤ Rp 32.000</strong>
              </span>
              <span class="px-2 py-0.5 rounded-md bg-blue-50 border border-blue-300 text-blue-900 font-bold">
                CPR (25%): <strong>≤ {{ formatCurrency(targetCPR) }}</strong>
              </span>
            </div>
          </div>

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
              <span class="text-[10px] text-emerald-600 font-bold">Lolos CPR &amp; Seluruh Corong KPI</span>
            </div>

            <div class="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 shadow-micro">
              <span class="text-[10px] font-bold text-amber-800 uppercase block">🟡 Pantau / Perbaiki</span>
              <span class="text-xl font-black text-amber-700 mt-0.5 block">{{ watchCount }} Iklan</span>
              <span class="text-[10px] text-amber-600 font-bold">Optimasi LP / Konten / Penawaran</span>
            </div>

            <div class="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200 shadow-micro">
              <span class="text-[10px] font-bold text-rose-800 uppercase block">🔴 Stop / Kill</span>
              <span class="text-xl font-black text-rose-700 mt-0.5 block">{{ stopCount }} Iklan</span>
              <span class="text-[10px] text-rose-600 font-bold">CPR boncos / 0 konversi</span>
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
                  <th scope="col" class="py-3 px-3 min-w-[180px]">NAMA KAMPANYE / IKLAN</th>
                  <th scope="col" class="py-3 px-3 w-32 text-center bg-teal-950/40">KEPUTUSAN</th>
                  <th scope="col" class="py-3 px-3 w-24">SPEND</th>
                  <th scope="col" class="py-3 px-3 w-24">CPR (HASIL)</th>
                  <th scope="col" class="py-3 px-3 w-20">CTR</th>
                  <th scope="col" class="py-3 px-3 w-20">CPC</th>
                  <th scope="col" class="py-3 px-3 w-20">COST LPV</th>
                  <th scope="col" class="py-3 px-3 w-24 bg-emerald-950/30">LC to LPV (80%)</th>
                  <th scope="col" class="py-3 px-3 w-24 bg-emerald-950/30">LPV to ATC (40%)</th>
                  <th scope="col" class="py-3 px-3 w-24 bg-emerald-950/30">ATC to IC (30%)</th>
                  <th scope="col" class="py-3 px-3 w-20">CPM</th>
                  <th scope="col" class="py-3 px-4 min-w-[280px]">DIAGNOSA &amp; AKSI SOP</th>
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
                      {{ ad.results }} Donatur Baru • Impresi: {{ formatNumber(ad.impressions) }} • Klik: {{ formatNumber(ad.clicks) }}
                    </span>
                  </td>

                  <!-- Decision Badge -->
                  <td class="py-3.5 px-3 text-center whitespace-nowrap">
                    <span
                      class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black border shadow-micro uppercase"
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
                      :class="ad.results > 0 && ad.cpr <= targetCPR ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'"
                    >
                      {{ ad.results > 0 ? formatCurrency(ad.cpr) : 'Rp 0' }}
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
                    <span class="text-[9px] text-slate-400 block">Target: {{ formatCurrency(targetCPC) }}</span>
                  </td>

                  <!-- Cost LPV -->
                  <td class="py-3.5 px-3 whitespace-nowrap">
                    <template v-if="ad.costLpv > 0">
                      <span
                        class="font-semibold text-xs"
                        :class="ad.costLpv <= targetCostLPV ? 'text-emerald-700 font-bold' : (ad.costLpv <= targetCostLPV * 1.5 ? 'text-slate-700' : 'text-rose-700 font-bold')"
                      >
                        {{ formatCurrency(ad.costLpv) }}
                      </span>
                      <span class="text-[9px] text-slate-400 block">Max: {{ formatCurrency(targetCostLPV) }}</span>
                    </template>
                    <span v-else class="text-slate-400 text-center block">-</span>
                  </td>

                  <!-- LC to LPV (Funnel KPI 1: Target >= 80%) -->
                  <td class="py-3.5 px-3 whitespace-nowrap">
                    <template v-if="ad.clicks > 0">
                      <span
                        class="font-black text-xs px-2 py-0.5 rounded inline-block"
                        :class="ad.lcToLpv >= 80 ? 'text-emerald-700 bg-emerald-50 border border-emerald-200' : 'text-rose-700 bg-rose-50 border border-rose-200'"
                      >
                        {{ ad.lcToLpv.toFixed(0) }}%
                      </span>
                      <span class="text-[9px] text-slate-400 block mt-0.5">
                        {{ formatNumber(ad.lpViews) }} LPV / Target ≥ 80%
                      </span>
                    </template>
                    <span v-else class="text-slate-400">-</span>
                  </td>

                  <!-- LPV to ATC (Funnel KPI 2: Target >= 40%) -->
                  <td class="py-3.5 px-3 whitespace-nowrap">
                    <template v-if="ad.lpvToAtc !== null">
                      <span
                        class="font-black text-xs px-2 py-0.5 rounded inline-block"
                        :class="ad.lpvToAtc >= 40 ? 'text-emerald-700 bg-emerald-50 border border-emerald-200' : 'text-rose-700 bg-rose-50 border border-rose-200'"
                      >
                        {{ ad.lpvToAtc.toFixed(0) }}%
                      </span>
                      <span class="text-[9px] text-slate-400 block mt-0.5">
                        {{ formatNumber(ad.atc) }} ATC / Target ≥ 40%
                      </span>
                    </template>
                    <span v-else class="text-slate-300 text-center block" title="Data ATC tidak ditemukan">-</span>
                  </td>

                  <!-- ATC to IC (Funnel KPI 3: Target >= 30%) -->
                  <td class="py-3.5 px-3 whitespace-nowrap">
                    <template v-if="ad.atcToIc !== null">
                      <span
                        class="font-black text-xs px-2 py-0.5 rounded inline-block"
                        :class="ad.atcToIc >= 30 ? 'text-emerald-700 bg-emerald-50 border border-emerald-200' : 'text-rose-700 bg-rose-50 border border-rose-200'"
                      >
                        {{ ad.atcToIc.toFixed(0) }}%
                      </span>
                      <span class="text-[9px] text-slate-400 block mt-0.5">
                        {{ formatNumber(ad.ic) }} IC / Target ≥ 30%
                      </span>
                    </template>
                    <span v-else class="text-slate-300 text-center block" title="Data IC tidak ditemukan">-</span>
                  </td>

                  <!-- CPM -->
                  <td class="py-3.5 px-3 whitespace-nowrap">
                    <span
                      class="font-semibold text-xs"
                      :class="ad.cpm <= 32000 ? 'text-slate-700' : 'text-rose-700 font-bold'"
                    >
                      {{ formatCurrency(ad.cpm) }}
                    </span>
                    <span class="text-[9px] text-slate-400 block">Target: ≤ 32rb</span>
                  </td>

                  <!-- Diagnosis & SOP Action -->
                  <td class="py-3.5 px-4 text-xs">
                    <p class="font-bold text-slate-800 leading-tight">
                      {{ ad.reason }}
                    </p>
                    <div class="mt-1.5 p-2 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                      <p class="text-[11px] text-slate-700 leading-relaxed">
                        <strong class="text-teal-900 font-extrabold">Aksi SOP:</strong> {{ ad.actionSOP }}
                      </p>
                      <!-- Specific Funnel Warning Pills -->
                      <div v-if="ad.funnelAlerts && ad.funnelAlerts.length > 0" class="pt-1 flex flex-wrap gap-1">
                        <span
                          v-for="(alert, aIdx) in ad.funnelAlerts"
                          :key="aIdx"
                          class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300"
                        >
                          ⚠️ {{ alert }}
                        </span>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 text-xs">
        <span class="text-slate-500">
          Kriteria evaluasi mengacu pada 9 Standar KPI Ads Yayasan Khoirur Rooziqiin (Harga Acuan: {{ formatCurrency(store.rdProductPrice) }}).
        </span>
        <button
          @click="closeModal"
          class="px-5 py-2 rounded-xl text-xs font-bold bg-slate-700 hover:bg-slate-800 text-white shadow-soft transition-all self-end sm:self-auto"
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
// LC to LPV = >= 80% (Aksi: Jika kurang, optimasi landing page agar lebih cepat)
// LPV to ATC = >= 40% (Aksi: Gunakan hypno writing di landingpage)
// ATC to IC = >= 30% (Aksi: Beri penawaran menarik)
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

function parseCSVLine(text, sep) {
  if (sep === '\t') {
    return text.split('\t').map(v => v.trim().replace(/^["']|["']$/g, ''));
  }
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      inQuotes = !inQuotes;
    } else if (c === sep && !inQuotes) {
      result.push(cur.trim().replace(/^["']|["']$/g, ''));
      cur = '';
    } else {
      cur += c;
    }
  }
  result.push(cur.trim().replace(/^["']|["']$/g, ''));
  return result;
}

function processPastedText() {
  if (!pastedText.value.trim()) return;
  const lines = pastedText.value.trim().split('\n').filter(l => l.trim().length > 0);
  if (lines.length < 2) {
    alert('Format paste harus memiliki baris judul kolom dan minimal 1 baris data!');
    return;
  }
  const sep = lines[0].includes('\t') ? '\t' : lines[0].includes(';') ? ';' : ',';
  const headers = parseCSVLine(lines[0], sep);
  const rows = lines.slice(1).map(line => {
    const vals = parseCSVLine(line, sep);
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

function getField(row, keywords, excludeKeywords = []) {
  const keys = Object.keys(row);
  for (const k of keys) {
    const cleanK = k.toLowerCase().replace(/[^a-z0-9]/g, '');

    // Check if key contains any excluded substring
    const isExcluded = excludeKeywords.some(ex => {
      const cleanEx = ex.toLowerCase().replace(/[^a-z0-9]/g, '');
      return cleanK.includes(cleanEx);
    });
    if (isExcluded) continue;

    for (const kw of keywords) {
      const cleanKw = kw.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (cleanK === cleanKw || cleanK.includes(cleanKw) || (cleanK.length >= 4 && cleanKw.includes(cleanK))) {
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
    let name = getField(r, ['campaign name', 'nama kampanye', 'ad name', 'nama iklan', 'adset name', 'ad set name', 'nama set iklan', 'nama', 'campaign']);
    if (name) {
      const match = String(name).match(/"([^"]+)"/);
      if (match) name = match[1];
    }
    name = (name || `Kampanye #${i + 1}`).trim();
    const spend = cleanNum(getField(r, ['amount spent', 'jumlah yang dibelanjakan', 'spend', 'biaya', 'cost', 'anggaran'], ['cpc', 'cpr', 'ctr', 'roas', 'per']));
    const impressions = cleanNum(getField(r, ['impressions', 'penayangan', 'tayangan', 'impresi'], ['cost', 'biaya', 'cpm', 'per', 'rate'])) || 1;
    const clicks = cleanNum(getField(r, ['link clicks', 'clicks (all)', 'klik tautan', 'klik unik', 'klik', 'clicks'], ['cost', 'biaya', 'cpc', 'cpr', 'per', 'rate', 'tampilan']));
    
    // Landing page views (counts)
    let lpViews = cleanNum(getField(r, ['landing page views', 'landing page view', 'tampilan halaman arahan', 'tampilan laman landas', 'kunjungan halaman arahan', 'lp views', 'lp view', 'halaman arahan', 'laman landas', 'lpv'], ['cost', 'biaya', 'per', 'cpc', 'rate', 'harga']));
    
    // Check if export provided 'Cost per landing page view' but not count
    const exportedCostLpv = cleanNum(getField(r, ['cost per landing page view', 'biaya per tampilan halaman arahan', 'cost per lpv', 'biaya per lpv']));
    if (lpViews === 0 && exportedCostLpv > 0 && spend > 0) {
      lpViews = Math.round(spend / exportedCostLpv);
    }

    // Add to cart count
    const atc = cleanNum(getField(r, ['adds to cart', 'add to cart', 'penambahan ke keranjang', 'tambah ke keranjang', 'keranjang', 'atc', 'cart'], ['cost', 'biaya', 'per', 'rate', 'harga', 'value', 'nilai', 'roas']));

    // Initiate checkout count
    const ic = cleanNum(getField(r, ['checkouts initiated', 'checkout initiated', 'initiate checkout', 'pembayaran dimulai', 'memulai pembayaran', 'checkout', 'ic'], ['cost', 'biaya', 'per', 'rate', 'harga', 'value', 'nilai', 'roas']));

    // Results (Conversions / Donatur)
    const resultsCount = cleanNum(getField(r, ['results', 'purchases', 'pembelian', 'hasil', 'donatur', 'leads', 'konversi'], ['cost', 'biaya', 'cpr', 'per', 'rate', 'harga', 'value', 'nilai', 'roas'])) || 0;
    const revenue = cleanNum(getField(r, ['conversion value', 'nilai konversi', 'revenue', 'nilai'])) || (resultsCount * (store.rdProductPrice || 50000));

    // Calculate funnel metrics
    const cpc = clicks > 0 ? Math.round(spend / clicks) : 0;
    const costLpv = lpViews > 0 ? Math.round(spend / lpViews) : (exportedCostLpv > 0 ? exportedCostLpv : 0);
    const cpm = impressions > 0 ? Math.round((spend / impressions) * 1000) : 0;
    const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
    const cpr = resultsCount > 0 ? Math.round(spend / resultsCount) : 0;
    
    // Funnel conversion percentages
    const lcToLpv = clicks > 0 && lpViews > 0 ? Math.round((lpViews / clicks) * 100) : 0;
    const lpvToAtc = lpViews > 0 && atc > 0 ? Math.round((atc / lpViews) * 100) : (atc > 0 && clicks > 0 ? Math.round((atc / clicks) * 100) : null);
    const atcToIc = atc > 0 && ic > 0 ? Math.round((ic / atc) * 100) : null;

    // Benchmarks
    const maxSafeCPR = targetCPR.value; // 25% of Harga Jual
    const maxSafeCostLpv = targetCostLPV.value; // 3% of Harga Jual
    const isCPRGood = resultsCount > 0 && cpr <= maxSafeCPR;
    const isCPRAcceptable = resultsCount > 0 && cpr <= (maxSafeCPR * 1.35);
    const isCTRGood = ctr >= 2.0;
    const isCostLpvAcceptable = costLpv === 0 || costLpv <= (maxSafeCostLpv * 1.5);

    // Funnel evaluation
    // LC to LPV: Target >= 80%
    const isLcLpvGood = (clicks === 0) ? true : (lpViews > 0 && lcToLpv >= 80);
    // LPV to ATC: Target >= 40% (only if ATC tracked)
    const isLpvAtcGood = (lpvToAtc === null) ? true : (lpvToAtc >= 40);
    // ATC to IC: Target >= 30% (only if IC tracked)
    const isAtcIcGood = (atcToIc === null) ? true : (atcToIc >= 30);
    const isFunnelGood = isLcLpvGood && isLpvAtcGood && isAtcIcGood;

    // Collect specific SOP alerts
    const funnelAlerts = [];
    if (clicks > 0 && lcToLpv < 80) {
      funnelAlerts.push(`LC to LPV ${lcToLpv}% (< 80%): Jika kurang, optimasi landing page agar lebih cepat`);
    }
    if (lpvToAtc !== null && lpvToAtc < 40) {
      funnelAlerts.push(`LPV to ATC ${lpvToAtc}% (< 40%): Gunakan hypno writing di landingpage`);
    }
    if (atcToIc !== null && atcToIc < 30) {
      funnelAlerts.push(`ATC to IC ${atcToIc}% (< 30%): Beri penawaran menarik`);
    }

    // Decision Engine Logic based on user SOP
    let decision = 'STOP';
    let decisionIcon = '🔴';
    let decisionLabel = 'STOP / KILL';
    let reason = '';
    let actionSOP = '';

    // CASE 1: Zero conversions
    if (resultsCount === 0) {
      if (spend >= maxSafeCPR || clicks >= 50) {
        decision = 'STOP';
        decisionIcon = '🔴';
        decisionLabel = 'STOP / KILL';
        reason = `Sudah belanja ${formatCurrency(spend)} tanpa hasil donatur (Boncos).`;
        actionSOP = 'SOP: Segera matikan kampanye! Jangan buang anggaran pada audiens/materi yang tidak menghasilkan konversi.';
      } else {
        decision = 'WATCH';
        decisionIcon = '🟡';
        decisionLabel = 'PANTAU (TESTING)';
        reason = `Spend baru ${formatCurrency(spend)} (< batas 1x target CPR ${formatCurrency(maxSafeCPR)}). Belum ada konversi.`;
        actionSOP = 'SOP: Biarkan berjalan 1-2 hari lagi hingga mencapai batas target CPR untuk melihat kestabilan data.';
      }
    }
    // CASE 2: CPR too high (Boncos)
    else if (cpr > (maxSafeCPR * 1.35)) {
      decision = 'STOP';
      decisionIcon = '🔴';
      decisionLabel = 'STOP / KILL';
      reason = `CPR bengkak (${formatCurrency(cpr)} jauh melebihi batas 25% harga acuan: ${formatCurrency(maxSafeCPR)}).`;
      actionSOP = 'SOP: Segera matikan kampanye! Evaluasi ulang materi video 4K atau perbaiki alur landing page donasi.';
    }
    // CASE 3: CPR Good & CTR Good & Whole Funnel Passes! (WINNING SCALE)
    else if (isCPRGood && isCTRGood && isFunnelGood && isCostLpvAcceptable) {
      decision = 'SCALE';
      decisionIcon = '🟢';
      decisionLabel = 'LANJUT / SCALE';
      reason = `CPR sangat efisien (${formatCurrency(cpr)} ≤ ${formatCurrency(maxSafeCPR)}), CTR tinggi (${ctr.toFixed(2)}%), dan seluruh KPI corong (LC-LPV-ATC-IC) memenuhi standar SOP.`;
      actionSOP = 'SOP: Pindahkan ke SCALE 1 / SCALE 2. Naikkan budget bertahap 20% per hari untuk maksimalkan perolehan donatur.';
    }
    // CASE 4: CPR Good/Acceptable, but Funnel has Leaks (LC to LPV / LPV to ATC / ATC to IC)
    else if ((isCPRGood || isCPRAcceptable) && !isFunnelGood) {
      decision = 'WATCH';
      decisionIcon = '🟡';
      decisionLabel = 'PANTAU (PERBAIKI CORONG)';
      
      if (!isLcLpvGood) {
        reason = `CPR efisien (${formatCurrency(cpr)}) & CTR tinggi (${ctr.toFixed(2)}%), namun LC to LPV jebol (${lcToLpv}% < 80%). Banyak pengunjung mental sebelum web termuat!`;
        actionSOP = 'SOP: Tahan scale! Jika kurang, optimasi landing page agar lebih cepat (kompres gambar, perbaiki kecepatan server, pasang lazyload).';
      } else if (!isLpvAtcGood) {
        reason = `CPR & CTR bagus, namun LPV to ATC rendah (${lpvToAtc}% < 40%). Pengunjung membaca tapi tidak menekan tombol donasi.`;
        actionSOP = 'SOP: Gunakan hypno writing di landingpage (headline emosional, bukti sosial nyata, call-to-action tegas) untuk mendongkrak konversi ke keranjang.';
      } else {
        reason = `Pengunjung sudah menekan tombol donasi, tapi banyak batal saat proses pembayaran (ATC to IC ${atcToIc}% < 30%).`;
        actionSOP = 'SOP: Beri penawaran menarik (bonus sertifikat/doa khusus) dan sederhanakan proses formulir checkout.';
      }
    }
    // CASE 5: CPR Good, but CTR is low (< 2%)
    else if (isCPRGood && !isCTRGood) {
      decision = 'WATCH';
      decisionIcon = '🟡';
      decisionLabel = 'PANTAU (GANTI KREATIF)';
      reason = `CPR efisien (${formatCurrency(cpr)}), namun CTR iklan rendah (${ctr.toFixed(2)}% < 2%). Materi kreatif kurang memikat klik audiens.`;
      actionSOP = 'SOP: Bikin konten yang lebih menarik (ciri-ciri: kualitas 4K, informatif, menarik, lucu) agar CTR naik di atas 2%.';
    }
    // CASE 6: CPR in marginal tolerance (1.0x - 1.35x maxSafeCPR) & CTR Good
    else if (isCPRAcceptable && isCTRGood) {
      decision = 'WATCH';
      decisionIcon = '🟡';
      decisionLabel = 'PANTAU 2-3 HARI';
      reason = `CTR bagus (${ctr.toFixed(2)}%), namun CPR sedikit di atas target toleransi (${formatCurrency(cpr)} vs target ${formatCurrency(maxSafeCPR)}).`;
      actionSOP = 'SOP: Perbaiki alur landing page, berikan penawaran menarik, dan pantau 2-3 hari sebelum kill.';
    }
    // CASE 7: High CPM
    else if (cpm > 32000 && resultsCount > 0) {
      decision = 'WATCH';
      decisionIcon = '🟡';
      decisionLabel = 'PANTAU (CPM MAHAL)';
      reason = `CPM mahal (${formatCurrency(cpm)} > Rp 32.000), audiens sedang kompetitif.`;
      actionSOP = 'SOP: Tunggu 2-3 hari untuk evaluasi stabilisasi algoritma. Jika CPR tetap jelek, segera kill!';
    }
    // Fallback STOP
    else {
      decision = 'STOP';
      decisionIcon = '🔴';
      decisionLabel = 'STOP / KILL';
      reason = `Performa di bawah standar KPI (CPR ${formatCurrency(cpr)}, CTR ${ctr.toFixed(2)}%).`;
      actionSOP = 'SOP: Segera matikan kampanye! Jangan lanjutkan spending pada audiens/iklan yang tidak menguntungkan.';
    }

    return {
      name,
      spend,
      impressions,
      clicks,
      lpViews,
      atc,
      ic,
      results: resultsCount,
      revenue,
      cpc,
      costLpv,
      cpm,
      ctr,
      cpr,
      lcToLpv,
      lpvToAtc,
      atcToIc,
      decision,
      decisionIcon,
      decisionLabel,
      reason,
      actionSOP,
      funnelAlerts,
      selectedForImport: decision === 'SCALE'
    };
  });

  evaluatedAds.value = results;
}

function loadSampleMetaAdsData() {
  const sampleRows = [
    {
      'Nama Kampanye': 'Wakaf Sumur Santri - Video Dokumentasi Air 4K',
      'Amount Spent (IDR)': 1850000,
      'Impressions': 92500,
      'Link Clicks': 2450,
      'Landing Page Views': 2080,
      'Adds to Cart': 940,
      'Checkouts Initiated': 330,
      'Results': 162,
      'Purchases Conversion Value': 12500000
    },
    {
      'Nama Kampanye': 'Sedekah Subuh Beras - Storytelling Emosional Santri',
      'Amount Spent (IDR)': 1200000,
      'Impressions': 55000,
      'Link Clicks': 1650,
      'Landing Page Views': 1420,
      'Adds to Cart': 610,
      'Checkouts Initiated': 210,
      'Results': 118,
      'Purchases Conversion Value': 8850000
    },
    {
      'Nama Kampanye': 'Zakat Maal Akhir Tahun - Kalkulator Web Interaktif',
      'Amount Spent (IDR)': 1500000,
      'Impressions': 48000,
      'Link Clicks': 1200,
      'Landing Page Views': 720, // LC to LPV: 60% (< 80%) -> Optimasi LP Speed
      'Adds to Cart': 320,
      'Checkouts Initiated': 110,
      'Results': 60,
      'Purchases Conversion Value': 9000000
    },
    {
      'Nama Kampanye': 'Beasiswa Tahfidz Quran - Carousel Foto Santri',
      'Amount Spent (IDR)': 950000,
      'Impressions': 42000,
      'Link Clicks': 950,
      'Landing Page Views': 810,
      'Adds to Cart': 195, // LPV to ATC: 24% (< 40%) -> Hypno Writing
      'Checkouts Initiated': 80,
      'Results': 45,
      'Purchases Conversion Value': 4200000
    },
    {
      'Nama Kampanye': 'Sedekah Mushaf Quran - Paket Santri Pelosok',
      'Amount Spent (IDR)': 850000,
      'Impressions': 36000,
      'Link Clicks': 820,
      'Landing Page Views': 700,
      'Adds to Cart': 310,
      'Checkouts Initiated': 62, // ATC to IC: 20% (< 30%) -> Penawaran Menarik
      'Results': 35,
      'Purchases Conversion Value': 3150000
    },
    {
      'Nama Kampanye': 'Tanggap Bencana - Video Tanpa Hook 3 Detik',
      'Amount Spent (IDR)': 1500000,
      'Impressions': 85000,
      'Link Clicks': 980, // CTR 1.15% (< 2%) -> Buat konten 4K menarik
      'Landing Page Views': 830,
      'Adds to Cart': 340,
      'Checkouts Initiated': 120,
      'Results': 120,
      'Purchases Conversion Value': 6000000
    },
    {
      'Nama Kampanye': 'Sedekah Yatim - Angle Teks Statis Tanpa Video',
      'Amount Spent (IDR)': 850000,
      'Impressions': 21000,
      'Link Clicks': 210,
      'Landing Page Views': 130,
      'Adds to Cart': 20,
      'Checkouts Initiated': 8,
      'Results': 7, // CPR Rp 121.428 (Boncos) -> STOP / KILL
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
      notes: `Lolos evaluasi SOP: CPR ${formatCurrency(ad.cpr)}, CTR ${ad.ctr.toFixed(2)}%, LC to LPV ${ad.lcToLpv}%.`
    });
  });

  alert(`Berhasil mengimpor ${toImport.length} kampanye winning ke tahap SCALE 1 di Ad Lab!`);
  emit('imported');
  closeModal();
}
</script>
