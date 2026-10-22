<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
    <div class="glass-panel rounded-2xl w-full max-w-lg p-6 shadow-2xl border border-teal-100 max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between pb-3 border-b border-teal-100">
        <h3 class="text-base font-bold text-slate-800 flex items-center gap-2">
          <CheckSquare class="w-5 h-5 text-teal-600" />
          <span>{{ isEdit ? 'Edit Tugas LogFrame' : 'Tambah Tugas Baru' }}</span>
        </h3>
        <button
          @click="$emit('close')"
          class="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="mt-4 space-y-4">
        <!-- Title -->
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Judul Tugas / Aktivitas
          </label>
          <input
            v-model="form.title"
            type="text"
            required
            placeholder="Contoh: A/B Testing Hook Video Santri Penghafal Quran..."
            class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-sm transition-all"
          />
        </div>

        <!-- LogFrame Category -->
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Kategori LogFrame (Level Hirarki)
          </label>
          <div class="grid grid-cols-2 gap-2">
            <button
              type="button"
              v-for="(info, key) in LOGFRAME_TYPES"
              :key="key"
              @click="form.category = key"
              class="p-2.5 rounded-xl border text-xs font-bold text-left transition-all flex items-center justify-between"
              :class="form.category === key 
                ? `${info.badgeBg} ${info.badgeText} ${info.badgeBorder} ring-2 ring-teal-400` 
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'"
            >
              <span>{{ info.label }}</span>
              <span class="text-[10px] font-normal opacity-80">{{ key === 'GOAL' ? 'Utama' : key === 'OUTCOME' ? 'Hasil' : key === 'OUTPUT' ? 'Produk' : 'Aksi' }}</span>
            </button>
          </div>
        </div>

        <!-- Priority & Hours -->
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Prioritas
            </label>
            <select
              v-model="form.priority"
              class="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-teal-500 outline-none text-xs font-semibold"
            >
              <option value="HIGH">Tinggi (High Impact)</option>
              <option value="MEDIUM">Sedang (Normal)</option>
              <option value="LOW">Rendah (Backlog)</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Estimasi Jam
            </label>
            <input
              v-model.number="form.estimatedHours"
              type="number"
              step="0.5"
              min="0.5"
              max="12"
              class="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-teal-500 outline-none text-xs font-semibold"
            />
          </div>
        </div>

        <!-- Notes / Experiment Hypotheses -->
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Catatan / Hipotesis Eksperimen
          </label>
          <textarea
            v-model="form.notes"
            rows="3"
            placeholder="Tuliskan metrik yang ingin diuji, target CPR, atau catatan teknis..."
            class="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-xs transition-all"
          ></textarea>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end gap-2 pt-3 border-t border-teal-100">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            class="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-soft transition-all"
          >
            {{ isEdit ? 'Simpan Perubahan' : 'Tambahkan ke Jurnal' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { LOGFRAME_TYPES } from '@/utils/formatters';
import { CheckSquare, X } from 'lucide-vue-next';

const props = defineProps({
  isOpen: Boolean,
  initialData: Object,
  isEdit: Boolean
});

const emit = defineEmits(['close', 'save']);

const form = ref({
  title: '',
  category: 'OUTPUT',
  priority: 'MEDIUM',
  estimatedHours: 1.5,
  notes: '',
  completed: false
});

watch(
  () => props.initialData,
  (val) => {
    if (val) {
      form.value = { ...val };
    } else {
      form.value = {
        title: '',
        category: 'OUTPUT',
        priority: 'MEDIUM',
        estimatedHours: 1.5,
        notes: '',
        completed: false
      };
    }
  },
  { immediate: true }
);

function handleSubmit() {
  if (!form.value.title.trim()) return;
  emit('save', { ...form.value });
}
</script>
