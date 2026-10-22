<template>
  <div class="glass-card rounded-2xl p-5 shadow-soft border border-teal-100 flex flex-col justify-between">
    <div class="flex items-center justify-between mb-4">
      <div>
        <h3 class="text-sm font-bold text-slate-800 flex items-center gap-2">
          <span>LogFrame Progress</span>
          <span class="text-[10px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
            Realtime Reactive
          </span>
        </h3>
        <p class="text-[11px] text-slate-500">
          Progres otomatis naik saat tugas dicentang (✅) di Jurnal
        </p>
      </div>

      <button
        @click="store.setActiveTab('jurnal')"
        class="text-xs font-semibold text-teal-700 hover:text-teal-900 hover:underline flex items-center gap-1"
      >
        <span>Lihat Tasks</span>
        <ArrowRight class="w-3.5 h-3.5" />
      </button>
    </div>

    <!-- 4 LogFrame Progress Bars -->
    <div class="space-y-4 my-1">
      <!-- GOAL (Indigo) -->
      <div class="p-3 rounded-xl bg-indigo-50/40 border border-indigo-100/80 transition-all hover:bg-indigo-50/70">
        <div class="flex items-center justify-between text-xs mb-1.5">
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-indigo-100 text-indigo-700 border border-indigo-200">
              GOAL
            </span>
            <span class="font-bold text-slate-700">Dampak Utama & Skala</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-slate-500 font-medium">
              {{ logFrame.GOAL.completed }}/{{ logFrame.GOAL.total }} Task
            </span>
            <span class="font-extrabold text-indigo-700 text-sm">
              {{ logFrame.GOAL.percent }}%
            </span>
          </div>
        </div>
        <div class="w-full bg-indigo-100/70 rounded-full h-2 overflow-hidden">
          <div
            class="bg-indigo-600 h-2 rounded-full transition-all duration-700 ease-out"
            :style="{ width: `${logFrame.GOAL.percent}%` }"
          ></div>
        </div>
      </div>

      <!-- OUTCOME (Teal) -->
      <div class="p-3 rounded-xl bg-teal-50/40 border border-teal-100/80 transition-all hover:bg-teal-50/70">
        <div class="flex items-center justify-between text-xs mb-1.5">
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-teal-100 text-teal-700 border border-teal-200">
              OUTCOME
            </span>
            <span class="font-bold text-slate-700">Hasil Strategis & Konversi</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-slate-500 font-medium">
              {{ logFrame.OUTCOME.completed }}/{{ logFrame.OUTCOME.total }} Task
            </span>
            <span class="font-extrabold text-teal-700 text-sm">
              {{ logFrame.OUTCOME.percent }}%
            </span>
          </div>
        </div>
        <div class="w-full bg-teal-100/70 rounded-full h-2 overflow-hidden">
          <div
            class="bg-teal-600 h-2 rounded-full transition-all duration-700 ease-out"
            :style="{ width: `${logFrame.OUTCOME.percent}%` }"
          ></div>
        </div>
      </div>

      <!-- OUTPUT (Emerald) -->
      <div class="p-3 rounded-xl bg-emerald-50/40 border border-emerald-100/80 transition-all hover:bg-emerald-50/70">
        <div class="flex items-center justify-between text-xs mb-1.5">
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-100 text-emerald-700 border border-emerald-200">
              OUTPUT
            </span>
            <span class="font-bold text-slate-700">Keluaran Langsung & Deliverables</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-slate-500 font-medium">
              {{ logFrame.OUTPUT.completed }}/{{ logFrame.OUTPUT.total }} Task
            </span>
            <span class="font-extrabold text-emerald-700 text-sm">
              {{ logFrame.OUTPUT.percent }}%
            </span>
          </div>
        </div>
        <div class="w-full bg-emerald-100/70 rounded-full h-2 overflow-hidden">
          <div
            class="bg-emerald-600 h-2 rounded-full transition-all duration-700 ease-out"
            :style="{ width: `${logFrame.OUTPUT.percent}%` }"
          ></div>
        </div>
      </div>

      <!-- ACTIVITY (Amber) -->
      <div class="p-3 rounded-xl bg-amber-50/40 border border-amber-100/80 transition-all hover:bg-amber-50/70">
        <div class="flex items-center justify-between text-xs mb-1.5">
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-100 text-amber-700 border border-amber-200">
              ACTIVITY
            </span>
            <span class="font-bold text-slate-700">Aktivitas Taktis & Eksekusi</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-slate-500 font-medium">
              {{ logFrame.ACTIVITY.completed }}/{{ logFrame.ACTIVITY.total }} Task
            </span>
            <span class="font-extrabold text-amber-700 text-sm">
              {{ logFrame.ACTIVITY.percent }}%
            </span>
          </div>
        </div>
        <div class="w-full bg-amber-100/70 rounded-full h-2 overflow-hidden">
          <div
            class="bg-amber-600 h-2 rounded-full transition-all duration-700 ease-out"
            :style="{ width: `${logFrame.ACTIVITY.percent}%` }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Motivational Footer Tip -->
    <div class="pt-3 border-t border-teal-100/60 flex items-center justify-between text-[11px] text-slate-500">
      <span>Sinkronisasi otomatis ke Matrix LogFrame Yayasan</span>
      <span class="font-semibold text-teal-700">FatherLab Methodology</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useGrowthFlowStore } from '@/stores/growthFlowStore';
import { ArrowRight } from 'lucide-vue-next';

const store = useGrowthFlowStore();
const logFrame = computed(() => store.logFrameProgress);
</script>
