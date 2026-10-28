<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
    <div class="glass-panel rounded-2xl w-full max-w-lg p-5 sm:p-6 shadow-2xl border border-teal-200 bg-white">
      <!-- Modal Header -->
      <div class="flex items-center justify-between pb-3 border-b border-teal-100">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shadow-micro">
            <Target class="w-5 h-5" />
          </div>
          <div>
            <h3 class="text-sm sm:text-base font-extrabold text-slate-800">
              Evaluasi Capaian Milestone
            </h3>
            <p class="text-[11px] text-slate-500">
              Catat kendala, evaluasi, dan kesimpulan sebelum agenda/milestone diselesaikan
            </p>
          </div>
        </div>
        <button
          @click="$emit('close')"
          class="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Milestone Summary Box -->
      <div v-if="milestone" class="my-4 p-3.5 rounded-xl bg-teal-50/70 border border-teal-100">
        <div class="flex items-center gap-2 mb-1">
          <span class="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-white border border-teal-200 text-teal-800">
            {{ milestone.category }}
          </span>
          <span class="text-xs text-slate-500 font-medium">
            🎯 Target: {{ milestone.targetMetric }}
          </span>
        </div>
        <p class="text-xs sm:text-sm font-bold text-slate-800 leading-snug">
          {{ milestone.title }}
        </p>
      </div>

      <!-- Form Inputs: Kendala, Evaluasi, Kesimpulan -->
      <form @submit.prevent="handleCompleteWithNotes" class="space-y-3.5">
        <!-- 1. Kendala -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
            <AlertTriangle class="w-3.5 h-3.5 text-amber-500" />
            <span>Kendala yang Dihadapi (Opsional)</span>
          </label>
          <textarea
            v-model="obstacle"
            rows="2"
            placeholder="Contoh: Hambatan teknis, keterbatasan waktu, regulasi perbankan..."
            class="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-xs transition-all"
          ></textarea>
        </div>

        <!-- 2. Evaluasi -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
            <Search class="w-3.5 h-3.5 text-indigo-500" />
            <span>Evaluasi Pencapaian &amp; Metrik</span>
          </label>
          <textarea
            v-model="evaluation"
            rows="2"
            placeholder="Contoh: Realisasi konversi melampaui target, tingkat retensi donatur mencapai 80%..."
            class="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-xs transition-all"
          ></textarea>
        </div>

        <!-- 3. Kesimpulan -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
            <CheckSquare2 class="w-3.5 h-3.5 text-emerald-600" />
            <span>Kesimpulan &amp; Rekomendasi Scale-Up</span>
          </label>
          <textarea
            v-model="conclusion"
            rows="2"
            placeholder="Contoh: Terapkan sistem ini secara permanen untuk periode kuartal berikutnya..."
            class="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-xs transition-all"
          ></textarea>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-2 pt-3 border-t border-teal-100">
          <button
            type="button"
            @click="handleQuickComplete"
            class="text-xs font-semibold text-slate-500 hover:text-slate-800 hover:underline order-2 sm:order-1"
          >
            Selesai Langsung (Tanpa Catatan)
          </button>

          <div class="flex items-center gap-2 self-end sm:self-auto order-1 sm:order-2">
            <button
              type="button"
              @click="$emit('close')"
              class="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              type="submit"
              class="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-soft transition-all active:scale-95"
            >
              <Check class="w-4 h-4 stroke-[3]" />
              <span>Simpan &amp; Tandai Selesai</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import {
  Target,
  X,
  AlertTriangle,
  Search,
  CheckSquare as CheckSquare2,
  Check
} from 'lucide-vue-next';

const props = defineProps({
  isOpen: Boolean,
  milestone: Object
});

const emit = defineEmits(['close', 'complete']);

const obstacle = ref('');
const evaluation = ref('');
const conclusion = ref('');

watch(
  () => props.milestone,
  (val) => {
    if (val) {
      obstacle.value = val.obstacle || '';
      evaluation.value = val.evaluation || '';
      conclusion.value = val.conclusion || '';
    } else {
      obstacle.value = '';
      evaluation.value = '';
      conclusion.value = '';
    }
  },
  { immediate: true }
);

function handleCompleteWithNotes() {
  emit('complete', {
    milestoneId: props.milestone.id,
    obstacle: obstacle.value.trim(),
    evaluation: evaluation.value.trim(),
    conclusion: conclusion.value.trim()
  });
}

function handleQuickComplete() {
  emit('complete', {
    milestoneId: props.milestone.id,
    obstacle: '',
    evaluation: '',
    conclusion: ''
  });
}
</script>
