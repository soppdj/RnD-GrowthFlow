<template>
  <div class="glass-card rounded-2xl p-5 sm:p-6 shadow-soft border border-teal-100">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-teal-100/70">
      <div>
        <h3 class="text-base font-bold text-slate-800 flex items-center gap-2">
          <span>Komparasi Target vs Realisasi Donasi</span>
          <span class="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
            3D Isometric View
          </span>
        </h3>
        <p class="text-xs text-slate-500 mt-0.5">
          Menyandingkan target penghimpunan vs dana aktual yang dihimpun per program
        </p>
      </div>

      <!-- Legend -->
      <div class="flex items-center gap-4 text-xs">
        <div class="flex items-center gap-1.5">
          <span class="w-3 h-3 rounded bg-indigo-200 border border-indigo-400"></span>
          <span class="text-slate-600 font-medium">Target Program</span>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="w-3 h-3 rounded bg-gradient-to-r from-teal-500 to-emerald-500 shadow-sm"></span>
          <span class="text-slate-800 font-bold">Realisasi Donasi</span>
        </div>
      </div>
    </div>

    <!-- Isometric Visual Bars Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-2">
      <div
        v-for="prog in programs"
        :key="prog.id"
        class="p-4 rounded-2xl bg-white/80 border border-teal-100/80 shadow-micro hover:border-teal-300 transition-all group flex flex-col justify-between"
      >
        <div>
          <!-- Program Badge -->
          <div class="flex items-center justify-between text-xs mb-1">
            <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
              {{ prog.category }}
            </span>
            <span class="font-extrabold text-xs" :class="getAchievementColor(prog)">
              {{ Math.round((prog.realizedAmount / prog.targetAmount) * 100) }}%
            </span>
          </div>

          <h4 class="text-xs font-bold text-slate-800 mt-1 line-clamp-1" :title="prog.name">
            {{ prog.name }}
          </h4>
        </div>

        <!-- 3D Isometric Bar Graphic Simulation -->
        <div class="my-4 py-2 flex items-end justify-center gap-4 h-32 relative">
          <!-- Target Column (Background Slate/Indigo 3D bar) -->
          <div class="flex flex-col items-center">
            <span class="text-[9px] font-semibold text-slate-400 mb-1">
              {{ formatCompactCurrency(prog.targetAmount) }}
            </span>
            <div class="w-8 bg-indigo-100/80 border border-indigo-300/80 rounded-t-lg relative shadow-inner transition-all duration-500" style="height: 100px;">
              <!-- 3D top facet -->
              <div class="absolute -top-1 left-0 right-0 h-2 bg-indigo-200 rounded-t skew-x-12 opacity-80"></div>
            </div>
            <span class="text-[9px] font-bold text-slate-500 mt-1">Target</span>
          </div>

          <!-- Realization Column (Foreground Emerald Gradient 3D bar) -->
          <div class="flex flex-col items-center">
            <span class="text-[9px] font-bold text-emerald-700 mb-1">
              {{ formatCompactCurrency(prog.realizedAmount) }}
            </span>
            <div
              class="w-9 bg-gradient-to-t from-teal-700 via-teal-600 to-emerald-500 rounded-t-lg relative shadow-md transition-all duration-700"
              :style="{ height: `${Math.max(15, Math.min(100, Math.round((prog.realizedAmount / prog.targetAmount) * 100)))}px` }"
            >
              <!-- 3D top facet -->
              <div class="absolute -top-1 left-0 right-0 h-2 bg-emerald-300 rounded-t skew-x-12 opacity-90 shadow-sm"></div>
            </div>
            <span class="text-[9px] font-extrabold text-teal-800 mt-1">Realisasi</span>
          </div>
        </div>

        <!-- Micro Financial Footer -->
        <div class="pt-2 border-t border-teal-100/60 flex items-center justify-between text-[11px]">
          <span class="text-slate-500">Ad Spend: <strong>{{ formatCompactCurrency(prog.adSpend) }}</strong></span>
          <span class="font-extrabold text-emerald-700">ROI {{ formatPercent(calculateROI(prog.realizedAmount, prog.adSpend), 0) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useGrowthFlowStore } from '@/stores/growthFlowStore';
import { formatCompactCurrency, formatPercent, calculateROI } from '@/utils/formatters';

const store = useGrowthFlowStore();
const programs = computed(() => store.donationPrograms);

function getAchievementColor(prog) {
  const pct = Math.round((prog.realizedAmount / prog.targetAmount) * 100);
  if (pct >= 90) return 'text-emerald-700';
  if (pct >= 60) return 'text-teal-700';
  return 'text-amber-700';
}
</script>
