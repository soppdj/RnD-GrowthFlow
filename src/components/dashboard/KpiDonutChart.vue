<template>
  <div class="glass-card rounded-2xl p-5 shadow-soft border border-teal-100 flex flex-col justify-between">
    <div class="flex items-center justify-between mb-2">
      <div>
        <h3 class="text-sm font-bold text-slate-800">Capaian Target Donasi</h3>
        <p class="text-[11px] text-slate-500">Realisasi Program vs Ad Spend & Target</p>
      </div>
      <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
        {{ kpi.targetAchievementPercent }}% Tercapai
      </span>
    </div>

    <!-- Chart Visual: Donut Presentation -->
    <div class="relative py-4 flex flex-col items-center justify-center">
      <!-- ApexCharts Donut or SVG Donut Component -->
      <div class="w-full max-w-[260px] h-[220px] flex items-center justify-center relative">
        <apexchart
          v-if="isMounted"
          type="donut"
          width="100%"
          height="100%"
          :options="chartOptions"
          :series="chartSeries"
        />

        <!-- Fallback / Center Label overlay -->
        <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span class="text-xs text-slate-400 font-medium">Realisasi</span>
          <span class="text-xl font-extrabold text-teal-800 tracking-tight">
            {{ formatCompactCurrency(kpi.totalRevenue) }}
          </span>
          <span class="text-[10px] text-emerald-600 font-bold">
            ROI {{ formatPercent(kpi.overallROI, 0) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Program Distribution Legend / Summary -->
    <div class="space-y-2 pt-3 border-t border-teal-100/70">
      <div
        v-for="prog in topPrograms"
        :key="prog.id"
        class="flex items-center justify-between text-xs"
      >
        <div class="flex items-center gap-2 truncate">
          <span class="w-2.5 h-2.5 rounded-full shrink-0" :style="{ backgroundColor: prog.color }"></span>
          <span class="text-slate-600 font-medium truncate">{{ prog.name }}</span>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <span class="font-bold text-slate-800">{{ formatCompactCurrency(prog.realizedAmount) }}</span>
          <span class="text-[10px] text-slate-400">({{ Math.round((prog.realizedAmount / (kpi.totalRevenue || 1)) * 100) }}%)</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useGrowthFlowStore } from '@/stores/growthFlowStore';
import { formatCompactCurrency, formatPercent } from '@/utils/formatters';

const store = useGrowthFlowStore();
const kpi = computed(() => store.kpiSummary);
const isMounted = ref(false);

onMounted(() => {
  isMounted.value = true;
});

const programColors = ['#0d9488', '#059669', '#3b82f6', '#f59e0b', '#8b5cf6'];

const topPrograms = computed(() => {
  return store.donationPrograms.map((p, idx) => ({
    ...p,
    color: programColors[idx % programColors.length]
  }));
});

const chartSeries = computed(() => {
  const values = store.donationPrograms.map(p => Number(p.realizedAmount) || 0);
  return values.length ? values : [1];
});

const chartOptions = computed(() => ({
  chart: {
    type: 'donut',
    fontFamily: 'Plus Jakarta Sans, sans-serif',
    toolbar: { show: false },
    sparkline: { enabled: true }
  },
  colors: programColors,
  labels: store.donationPrograms.map(p => p.name),
  plotOptions: {
    pie: {
      donut: {
        size: '72%',
        background: 'transparent',
        labels: {
          show: false
        }
      }
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    width: 3,
    colors: ['#ffffff']
  },
  tooltip: {
    enabled: true,
    y: {
      formatter: (val) => formatCompactCurrency(val)
    }
  },
  legend: {
    show: false
  }
}));
</script>
