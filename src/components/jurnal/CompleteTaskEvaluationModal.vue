<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
    <div class="glass-panel rounded-2xl w-full max-w-lg p-5 sm:p-6 shadow-2xl border border-teal-200 bg-white">
      <!-- Modal Header -->
      <div class="flex items-center justify-between pb-3 border-b border-teal-100">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-micro">
            <CheckCircle2 class="w-5 h-5" />
          </div>
          <div>
            <h3 class="text-sm sm:text-base font-extrabold text-slate-800">
              Evaluasi &amp; Penyelesaian Tugas
            </h3>
            <p class="text-[11px] text-slate-500">
              Catat kendala, evaluasi, atau kesimpulan sebelum tugas ditandai selesai
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

      <!-- Task Summary Box -->
      <div v-if="task" class="my-4 p-3.5 rounded-xl bg-teal-50/70 border border-teal-100">
        <div class="flex items-center gap-2 mb-1">
          <span class="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-white border border-teal-200 text-teal-800">
            {{ task.category }}
          </span>
          <span class="text-xs text-slate-500 font-medium">
            📅 {{ formatTaskDate(task.date) }}
          </span>
        </div>
        <p class="text-xs sm:text-sm font-bold text-slate-800 leading-snug">
          {{ task.title }}
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
            placeholder="Contoh: Format video sempat lama di-render, penyesuaian copywriting, dsb..."
            class="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-xs transition-all"
          ></textarea>
        </div>

        <!-- 2. Evaluasi -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
            <Search class="w-3.5 h-3.5 text-indigo-500" />
            <span>Evaluasi Hasil Kerja</span>
          </label>
          <textarea
            v-model="evaluation"
            rows="2"
            placeholder="Contoh: CTR berhasil naik dari 1.2% ke 3.8%, alur form 1-step meningkatkan konversi..."
            class="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-xs transition-all"
          ></textarea>
        </div>

        <!-- 3. Kesimpulan -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
            <CheckSquare2 class="w-3.5 h-3.5 text-emerald-600" />
            <span>Kesimpulan &amp; Tindak Lanjut</span>
          </label>
          <textarea
            v-model="conclusion"
            rows="2"
            placeholder="Contoh: Rekomendasikan scale budget +20%, jadikan SOP baku untuk kampanye berikutnya..."
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
  CheckCircle2,
  X,
  AlertTriangle,
  Search,
  CheckSquare as CheckSquare2,
  Check
} from 'lucide-vue-next';

const props = defineProps({
  isOpen: Boolean,
  task: Object
});

const emit = defineEmits(['close', 'complete']);

const obstacle = ref('');
const evaluation = ref('');
const conclusion = ref('');

watch(
  () => props.task,
  (val) => {
    if (val) {
      obstacle.value = val.obstacle || '';
      evaluation.value = val.evaluation || val.notes || '';
      conclusion.value = val.conclusion || '';
    } else {
      obstacle.value = '';
      evaluation.value = '';
      conclusion.value = '';
    }
  },
  { immediate: true }
);

function formatTaskDate(dateStr) {
  if (!dateStr) return 'Hari ini';
  const d = new Date(dateStr);
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function handleCompleteWithNotes() {
  emit('complete', {
    taskId: props.task.id,
    obstacle: obstacle.value.trim(),
    evaluation: evaluation.value.trim(),
    conclusion: conclusion.value.trim()
  });
}

function handleQuickComplete() {
  emit('complete', {
    taskId: props.task.id,
    obstacle: '',
    evaluation: '',
    conclusion: ''
  });
}
</script>
