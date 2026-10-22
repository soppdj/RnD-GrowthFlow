<template>
  <div class="glass-card rounded-2xl p-5 sm:p-6 shadow-soft relative overflow-hidden border border-teal-100">
    <!-- Subtle Background Gradient Texture -->
    <div class="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-gradient-to-br from-teal-200/40 via-emerald-100/30 to-transparent blur-2xl pointer-events-none"></div>

    <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <!-- Greeting & Subtitle -->
      <div>
        <div class="flex items-center gap-2 mb-1.5">
          <span class="text-xs text-slate-500 font-medium">
            {{ currentDateFormatted }}
          </span>
        </div>

        <h2 class="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight">
          Assalamu'alaikum, <span class="bg-gradient-to-r from-teal-700 to-emerald-600 bg-clip-text text-transparent">{{ store.profile.fullName }}</span>!
        </h2>
        
        <p class="text-xs sm:text-sm text-slate-600 mt-1 flex items-center gap-2">
          <Target class="w-4 h-4 text-teal-600 shrink-0" />
          <span>
            <strong class="text-slate-800 font-semibold">Target Bulan Ini:</strong> 
            Optimasi efisiensi akuisisi (CPR &lt; Rp 45.000) dan validasi kampanye winning di Ad Lab.
          </span>
        </p>
      </div>

      <!-- Quick Action Buttons on Banner -->
      <div class="flex items-center gap-2.5 self-start md:self-auto shrink-0">
        <button
          @click="store.setActiveTab('adlab')"
          class="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white border border-teal-200 hover:border-teal-400 text-teal-800 hover:bg-teal-50 transition-all shadow-micro active:scale-95"
        >
          <FlaskConical class="w-4 h-4 text-teal-600" />
          <span>Buka Ad Lab</span>
        </button>

        <button
          @click="store.setActiveTab('jurnal')"
          class="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-soft transition-all active:scale-95"
        >
          <CheckSquare class="w-4 h-4" />
          <span>Checklist Harian</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useGrowthFlowStore } from '@/stores/growthFlowStore';
import { formatDate } from '@/utils/formatters';
import { Target, FlaskConical, CheckSquare } from 'lucide-vue-next';

const store = useGrowthFlowStore();

const currentDateFormatted = computed(() => {
  return formatDate(new Date(), true);
});
</script>
