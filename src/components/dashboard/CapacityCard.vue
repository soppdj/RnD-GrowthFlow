<template>
  <div class="glass-card rounded-2xl p-5 shadow-soft border border-teal-100/90 relative overflow-hidden flex flex-col justify-between">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
          <Clock class="w-4 h-4" />
        </div>
        <div>
          <h3 class="text-sm font-bold text-slate-800">Kapasitas Kerja R&D</h3>
          <p class="text-[11px] text-slate-500">Estimasi Beban Kerja & Waktu Eksekusi</p>
        </div>
      </div>

      <!-- Execution Status Badge -->
      <span
        class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border"
        :class="capacity.statusColor"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
        {{ capacity.status }}
      </span>
    </div>

    <!-- Main Capacity Metrics Grid -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 my-2">
      <!-- Sisa Jam Hari Ini -->
      <div class="p-3 rounded-xl bg-white/70 border border-teal-100/70">
        <p class="text-[11px] font-medium text-slate-500">Sisa Jam Hari Ini</p>
        <p class="text-lg sm:text-xl font-extrabold text-teal-800 mt-0.5">
          {{ capacity.remainingHours.toFixed(1) }} <span class="text-xs font-normal text-slate-500">Jam</span>
        </p>
        <p class="text-[10px] text-teal-600 mt-1">
          Dari {{ capacity.maxHours }} jam/hari
        </p>
      </div>

      <!-- Jam Selesai Terkategori -->
      <div class="p-3 rounded-xl bg-white/70 border border-teal-100/70">
        <p class="text-[11px] font-medium text-slate-500">Tereksekusi</p>
        <p class="text-lg sm:text-xl font-extrabold text-emerald-700 mt-0.5">
          {{ capacity.loggedHours.toFixed(1) }} <span class="text-xs font-normal text-slate-500">Jam</span>
        </p>
        <p class="text-[10px] text-emerald-600 mt-1">
          {{ capacity.completedCount }} task selesai
        </p>
      </div>

      <!-- Jam Pending Hari Ini -->
      <div class="p-3 rounded-xl bg-white/70 border border-teal-100/70">
        <p class="text-[11px] font-medium text-slate-500">Pending Hari Ini</p>
        <p class="text-lg sm:text-xl font-extrabold text-amber-700 mt-0.5">
          {{ capacity.pendingHours.toFixed(1) }} <span class="text-xs font-normal text-slate-500">Jam</span>
        </p>
        <p class="text-[10px] text-amber-600 mt-1">
          {{ capacity.totalTodayCount - capacity.completedCount }} task tersisa
        </p>
      </div>

      <!-- Sisa Hari Bulan Ini -->
      <div class="p-3 rounded-xl bg-white/70 border border-teal-100/70">
        <p class="text-[11px] font-medium text-slate-500">Sisa Hari Bulan Ini</p>
        <p class="text-lg sm:text-xl font-extrabold text-indigo-700 mt-0.5">
          {{ capacity.daysRemainingInMonth }} <span class="text-xs font-normal text-slate-500">Hari</span>
        </p>
        <p class="text-[10px] text-indigo-600 mt-1">
          Sprint Akhir Bulan
        </p>
      </div>
    </div>

    <!-- Utilization Progress Bar -->
    <div class="mt-3 pt-3 border-t border-teal-100/60">
      <div class="flex items-center justify-between text-xs mb-1.5">
        <span class="text-slate-600 font-medium">Utilisasi Jam Kerja Harian</span>
        <span class="font-bold text-slate-800">{{ capacity.utilizationRate }}%</span>
      </div>
      <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
        <div
          class="h-2 rounded-full transition-all duration-500"
          :class="capacity.utilizationRate > 100 
            ? 'bg-rose-500' 
            : capacity.utilizationRate >= 70 
              ? 'bg-teal-600' 
              : 'bg-emerald-500'"
          :style="{ width: `${Math.min(capacity.utilizationRate, 100)}%` }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useGrowthFlowStore } from '@/stores/growthFlowStore';
import { Clock } from 'lucide-vue-next';

const store = useGrowthFlowStore();
const capacity = computed(() => store.workCapacity);
</script>
