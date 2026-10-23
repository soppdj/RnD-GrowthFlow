<template>
  <div class="glass-card rounded-2xl p-5 sm:p-6 shadow-soft border border-teal-100 bg-white/95">
    <!-- Chart Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-2">
      <!-- Title Badge -->
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center shadow-micro">
          <BarChart2 class="w-4 h-4 text-teal-700" />
        </div>
        <h3 class="text-sm sm:text-base font-extrabold text-slate-800 tracking-tight">
          Grafik Progres Penghimpunan Donasi
        </h3>
      </div>

      <!-- Unit Info & Legend -->
      <div class="flex flex-wrap items-center gap-4 text-xs">
        <span class="text-slate-400 font-medium">Unit: Rupiah (IDR)</span>
        
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-1.5">
            <span class="w-3.5 h-3.5 rounded bg-slate-600 border border-slate-700 shadow-sm"></span>
            <span class="text-xs font-bold text-slate-700">Target Donasi</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="w-3.5 h-3.5 rounded bg-teal-600 border border-teal-700 shadow-sm"></span>
            <span class="text-xs font-bold text-teal-800">Realisasi</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 3D Isometric Chart Container -->
    <div class="relative pt-6 pb-2 px-2 overflow-x-auto">
      <div class="min-w-[650px]">
        <!-- Chart Drawing Area -->
        <div class="relative h-64 border-b border-teal-100/80">
          <!-- Horizontal Grid Lines & Y-Axis Labels -->
          <div class="absolute inset-0 flex flex-col justify-between pointer-events-none">
            <div
              v-for="line in yGridLines"
              :key="line.value"
              class="relative w-full border-b border-slate-100 flex items-center"
            >
              <span class="absolute -left-16 text-[11px] font-semibold text-slate-400 w-14 text-right">
                {{ line.label }}
              </span>
            </div>
            <!-- Zero Line -->
            <div class="relative w-full border-b border-teal-200 flex items-center">
              <span class="absolute -left-16 text-[11px] font-bold text-slate-500 w-14 text-right">
                Rp 0
              </span>
            </div>
          </div>

          <!-- 3D Isometric Bars Columns Grid -->
          <div class="absolute inset-0 pl-4 pr-6 flex items-end justify-around">
            <div
              v-for="prog in programData"
              :key="prog.id"
              class="flex items-end justify-center gap-2 sm:gap-3 group relative h-full"
            >
              <!-- TARGET 3D ISOMETRIC BAR (Slate/Grey) -->
              <div class="relative flex flex-col items-center justify-end h-full w-8 sm:w-11">
                <!-- Bar Column Body -->
                <div
                  class="w-full relative transition-all duration-700 ease-out cursor-pointer hover:brightness-110"
                  :style="{ height: `${Math.max(4, (prog.targetAmount / maxVal) * 100)}%` }"
                  :title="`${prog.name} - Target: ${formatCurrency(prog.targetAmount)}`"
                >
                  <!-- 3D Top Facet (Slanted parallelogram) -->
                  <div
                    class="absolute -top-2 left-0 w-full h-2.5 bg-slate-400 border-t border-l border-slate-300 transform -skew-x-[35deg] origin-bottom-left shadow-sm z-10"
                  ></div>
                  <!-- 3D Right Side Facet -->
                  <div
                    class="absolute top-0 -right-2 w-2 h-full bg-slate-700 border-r border-slate-800 transform -skew-y-[35deg] origin-top-left shadow-sm"
                  ></div>
                  <!-- Front Face -->
                  <div class="w-full h-full bg-gradient-to-b from-slate-500 to-slate-600 border-l border-slate-400 shadow-md"></div>
                </div>
              </div>

              <!-- REALISASI 3D ISOMETRIC BAR (Teal/Emerald) -->
              <div class="relative flex flex-col items-center justify-end h-full w-8 sm:w-11">
                <!-- Bar Column Body -->
                <div
                  class="w-full relative transition-all duration-700 ease-out cursor-pointer hover:brightness-110"
                  :style="{ height: `${Math.max(4, (prog.realizedAmount / maxVal) * 100)}%` }"
                  :title="`${prog.name} - Realisasi: ${formatCurrency(prog.realizedAmount)} (${prog.percent}%)`"
                >
                  <!-- 3D Top Facet -->
                  <div
                    class="absolute -top-2 left-0 w-full h-2.5 bg-emerald-300 border-t border-l border-emerald-200 transform -skew-x-[35deg] origin-bottom-left shadow-sm z-10"
                  ></div>
                  <!-- 3D Right Side Facet -->
                  <div
                    class="absolute top-0 -right-2 w-2 h-full bg-teal-800 border-r border-teal-900 transform -skew-y-[35deg] origin-top-left shadow-sm"
                  ></div>
                  <!-- Front Face -->
                  <div class="w-full h-full bg-gradient-to-b from-teal-500 via-teal-600 to-emerald-600 border-l border-teal-400 shadow-lg"></div>
                </div>
              </div>

              <!-- Tooltip on Hover -->
              <div
                class="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-[11px] py-1.5 px-2.5 rounded-xl shadow-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30"
              >
                <p class="font-extrabold text-teal-300">{{ prog.name }}</p>
                <div class="flex items-center gap-2 mt-0.5 text-[10px]">
                  <span>Target: {{ formatCompactCurrency(prog.targetAmount) }}</span>
                  <span>•</span>
                  <span class="text-emerald-400 font-bold">Real: {{ formatCompactCurrency(prog.realizedAmount) }} ({{ prog.percent }}%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- X-Axis Labels -->
        <div class="pl-4 pr-6 flex justify-around mt-3">
          <div
            v-for="prog in programData"
            :key="prog.id"
            class="text-center w-28 sm:w-36 px-1"
          >
            <p class="text-xs font-bold text-slate-800 leading-tight truncate" :title="prog.name">
              {{ prog.name }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useGrowthFlowStore } from '@/stores/growthFlowStore';
import { formatCurrency, formatCompactCurrency } from '@/utils/formatters';
import { BarChart2 } from 'lucide-vue-next';

const store = useGrowthFlowStore();

// Max scale reference for Y-axis: 120 Jt (Rp 120.000.000)
const maxVal = 120000000;

const yGridLines = [
  { value: 120000000, label: 'Rp 120 Jt' },
  { value: 90000000, label: 'Rp 90 Jt' },
  { value: 60000000, label: 'Rp 60 Jt' },
  { value: 30000000, label: 'Rp 30 Jt' }
];

const programData = computed(() => {
  return (store.donationPrograms || []).map(p => {
    const target = Number(p.targetAmount) || 1;
    const real = Number(p.realizedAmount) || 0;
    const percent = ((real / target) * 100).toFixed(1);
    return {
      ...p,
      percent
    };
  });
});
</script>
