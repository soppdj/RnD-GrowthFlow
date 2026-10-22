<template>
  <div class="glass-card rounded-2xl p-4 border border-teal-100 shadow-soft hover:border-teal-300 transition-all duration-200 flex flex-col justify-between group">
    <!-- Top Platform & Status -->
    <div>
      <div class="flex items-center justify-between gap-2 mb-2">
        <span
          class="px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 border"
          :class="getPlatformBadgeClass(campaign.platform)"
        >
          <span>{{ campaign.platform }}</span>
        </span>

        <span
          class="px-2 py-0.5 rounded-full text-[10px] font-extrabold"
          :class="campaign.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'"
        >
          ● {{ campaign.status }}
        </span>
      </div>

      <!-- Campaign Name -->
      <h4 class="text-sm font-bold text-slate-800 leading-snug">
        {{ campaign.name }}
      </h4>

      <!-- Hook Type / Angle -->
      <p v-if="campaign.hookType" class="text-[11px] text-teal-700 font-medium mt-1 bg-teal-50/80 px-2 py-0.5 rounded-md inline-block">
        🎯 {{ campaign.hookType }}
      </p>

      <!-- Key Metrics 2x2 Grid -->
      <div class="grid grid-cols-2 gap-2 mt-3 p-2.5 rounded-xl bg-slate-50/70 border border-slate-100 text-xs">
        <div>
          <span class="text-[10px] text-slate-400 font-medium block">Ad Spend</span>
          <span class="font-bold text-slate-800">{{ formatCompactCurrency(campaign.adSpend) }}</span>
        </div>
        <div>
          <span class="text-[10px] text-slate-400 font-medium block">Donatur Baru</span>
          <span class="font-bold text-slate-800">{{ formatNumber(campaign.newDonors) }} Jiwa</span>
        </div>
        <div>
          <span class="text-[10px] text-slate-400 font-medium block">Realisasi Donasi</span>
          <span class="font-bold text-emerald-700">{{ formatCompactCurrency(campaign.revenue) }}</span>
        </div>
        <div>
          <span class="text-[10px] text-slate-400 font-medium block">CPR (Biaya/Donatur)</span>
          <span class="font-extrabold text-teal-800">{{ formatCurrency(cpr) }}</span>
        </div>
      </div>

      <!-- ROI Highlight Pill -->
      <div class="mt-2.5 flex items-center justify-between px-3 py-1.5 rounded-xl bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200/80">
        <span class="text-[11px] font-bold text-slate-600">ROI Eksperimen</span>
        <span class="text-xs font-black text-emerald-700">
          {{ formatPercent(roi) }}
        </span>
      </div>

      <!-- Notes -->
      <p v-if="campaign.notes" class="text-[11px] text-slate-500 mt-2 line-clamp-2 italic">
        "{{ campaign.notes }}"
      </p>
    </div>

    <!-- Stage Actions & Edit/Delete -->
    <div class="mt-4 pt-3 border-t border-teal-100/70 flex items-center justify-between">
      <!-- Move backward if not in TEST -->
      <button
        v-if="campaign.stage !== 'TEST'"
        @click="$emit('move-stage', campaign.id, prevStage)"
        class="p-1 rounded-lg text-slate-400 hover:text-teal-700 hover:bg-teal-50 text-[11px] font-semibold flex items-center gap-1 transition-colors"
        title="Kembalikan ke tahap sebelumnya"
      >
        <ChevronLeft class="w-4 h-4" />
        <span class="text-[10px] hidden sm:inline">Mundur</span>
      </button>
      <div v-else></div>

      <div class="flex items-center gap-1.5">
        <button
          @click="$emit('edit', campaign)"
          class="p-1.5 rounded-lg text-slate-400 hover:text-teal-700 hover:bg-teal-50 transition-colors"
          title="Edit Data Kampanye"
        >
          <Edit2 class="w-3.5 h-3.5" />
        </button>
        <button
          @click="$emit('delete', campaign.id)"
          class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          title="Hapus Kampanye"
        >
          <Trash2 class="w-3.5 h-3.5" />
        </button>
      </div>

      <!-- Move forward if not in SCALE_2 -->
      <button
        v-if="campaign.stage !== 'SCALE_2'"
        @click="$emit('move-stage', campaign.id, nextStage)"
        class="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-[10px] font-bold flex items-center gap-1 shadow-micro transition-all active:scale-95"
        title="Promosikan ke tahap berikutnya"
      >
        <span>Lanjut</span>
        <ChevronRight class="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import {
  formatCurrency,
  formatCompactCurrency,
  formatNumber,
  formatPercent,
  calculateROI,
  calculateCPR
} from '@/utils/formatters';
import {
  ChevronLeft,
  ChevronRight,
  Edit2,
  Trash2
} from 'lucide-vue-next';

const props = defineProps({
  campaign: {
    type: Object,
    required: true
  }
});

defineEmits(['move-stage', 'edit', 'delete']);

const roi = computed(() => calculateROI(props.campaign.revenue, props.campaign.adSpend));
const cpr = computed(() => calculateCPR(props.campaign.adSpend, props.campaign.newDonors));

const prevStage = computed(() => {
  if (props.campaign.stage === 'SCALE_2') return 'SCALE_1';
  if (props.campaign.stage === 'SCALE_1') return 'TEST';
  return 'TEST';
});

const nextStage = computed(() => {
  if (props.campaign.stage === 'TEST') return 'SCALE_1';
  if (props.campaign.stage === 'SCALE_1') return 'SCALE_2';
  return 'SCALE_2';
});

function getPlatformBadgeClass(platform) {
  switch (platform) {
    case 'Meta Ads':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'TikTok Ads':
      return 'bg-slate-900 text-white border-slate-700';
    case 'Google Search':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    default:
      return 'bg-teal-50 text-teal-700 border-teal-200';
  }
}
</script>
