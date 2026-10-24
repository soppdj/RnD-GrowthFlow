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
  Wallet
} from 'lucide-vue-next';

const store = useGrowthFlowStore();
const kpi = computed(() => store.kpiSummary);
</script>
