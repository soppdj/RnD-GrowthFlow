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

    <!-- SECTION 2: PANDUAN STANDAR KPI R&D TERPUSAT DI AD LAB -->
    <div class="glass-card rounded-2xl p-4 sm:p-5 border border-teal-100/90 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-teal-50/60 via-white to-emerald-50/40">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs shrink-0 shadow-micro">
          <FlaskConical class="w-4 h-4 text-teal-700" />
        </div>
        <div>
          <h4 class="text-xs font-bold text-slate-800 flex flex-wrap items-center gap-2">
            <span>Standar Operasional KPI Ads (CPC, Cost LPV, CPM, CTR, CPR, Closing CS)</span>
            <span class="text-[10px] font-bold text-teal-800 bg-teal-100/80 px-2 py-0.5 rounded-full border border-teal-200">
              Telah Dipindahkan ke Ad Lab
            </span>
          </h4>
          <p class="text-[11px] text-slate-500 mt-0.5">
            Evaluasi eksperimen iklan, simulasi harga jual, dan SOP penanganan metrik kini terpusat langsung di Pipeline Ad Lab.
          </p>
        </div>
      </div>
      <button
        @click="store.setActiveTab('adlab')"
        class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white shadow-soft transition-all active:scale-95 self-start sm:self-auto shrink-0"
      >
        <span>Buka Ad Lab</span>
        <ArrowRight class="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
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
  ArrowRight
} from 'lucide-vue-next';

const store = useGrowthFlowStore();
const kpi = computed(() => store.kpiSummary);
</script>
