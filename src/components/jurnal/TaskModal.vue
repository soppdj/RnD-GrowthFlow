<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
    <div class="glass-panel rounded-2xl w-full max-w-lg p-6 shadow-2xl border border-teal-100 max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between pb-3 border-b border-teal-100">
        <h3 class="text-base font-bold text-slate-800 flex items-center gap-2">
          <CheckSquare class="w-5 h-5 text-teal-600" />
          <span>{{ isEdit ? 'Edit Tugas Jurnal LogFrame' : 'Tambah Tugas Jurnal Baru' }}</span>
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
            placeholder="Contoh: Audit Database Churn Rate Donatur Adik Asuh..."
            class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-sm transition-all"
          />
        </div>

        <!-- Tanggal Jurnal & Priority & Hours -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Tanggal Jurnal
            </label>
            <input
              v-model="form.date"
              type="date"
              required
              class="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-teal-500 outline-none text-xs font-semibold bg-white"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Prioritas
            </label>
            <select
              v-model="form.priority"
              class="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-teal-500 outline-none text-xs font-semibold bg-white"
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
              class="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-teal-500 outline-none text-xs font-semibold bg-white"
            />
          </div>
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

        <!-- Notes / Experiment Hypotheses -->
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Catatan / Hipotesis Eksperimen
          </label>
          <textarea
            v-model="form.notes"
            rows="2"
            placeholder="Tuliskan metrik yang ingin diuji, target CPR, atau catatan teknis..."
            class="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-xs transition-all"
          ></textarea>
        </div>

        <!-- Evaluasi Hasil Kerja (Kendala, Evaluasi, Kesimpulan) -->
        <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <div class="flex items-center justify-between">
            <label class="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Evaluasi &amp; Temuan Lapangan
            </label>
            <span class="text-[10px] text-teal-700 font-semibold">Dapat diisi saat checklist selesai</span>
          </div>

          <div>
            <label class="block text-[11px] font-bold text-slate-700 mb-1">
              ⚠️ Kendala yang Dihadapi
            </label>
            <textarea
              v-model="form.obstacle"
              rows="2"
              placeholder="Contoh: Keterbatasan response time tim kreatif, adset sempat delay review..."
              class="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:border-teal-500 outline-none bg-white"
            ></textarea>
          </div>

          <div>
            <label class="block text-[11px] font-bold text-slate-700 mb-1">
              🔍 Evaluasi Hasil Kerja
            </label>
            <textarea
              v-model="form.evaluation"
              rows="2"
              placeholder="Contoh: CTR video 3.8% jauh lebih tinggi dibanding target 2%, konversi meningkat..."
              class="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:border-teal-500 outline-none bg-white"
            ></textarea>
          </div>

          <div>
            <label class="block text-[11px] font-bold text-slate-700 mb-1">
              ✅ Kesimpulan &amp; Tindak Lanjut
            </label>
            <textarea
              v-model="form.conclusion"
              rows="2"
              placeholder="Contoh: Lanjut scale-up ke adset 2, standarisasi alur form 1-step QRIS..."
              class="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:border-teal-500 outline-none bg-white"
            ></textarea>
          </div>
        </div>

        <!-- Attach Link Hasil Kerja (Deliverables) -->
        <div class="p-3.5 rounded-xl bg-teal-50/60 border border-teal-100/90 space-y-2.5">
          <div class="flex items-center justify-between">
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Paperclip class="w-3.5 h-3.5 text-teal-600" />
              <span>Lampirkan Link Hasil Kerja (Deliverable)</span>
            </label>
            <span class="text-[10px] text-teal-700 font-semibold">Opsional</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              v-model="form.workResultTitle"
              type="text"
              placeholder="Label link (contoh: 📁 Google Drive)"
              class="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:border-teal-500 outline-none text-xs bg-white"
            />
            <input
              v-model="form.workResultUrl"
              type="text"
              placeholder="https://..."
              class="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:border-teal-500 outline-none text-xs bg-white"
            />
          </div>

          <!-- Quick presets -->
          <div class="flex flex-wrap items-center gap-1.5 pt-0.5">
            <span class="text-[10px] text-slate-400 font-medium mr-1">Preset:</span>
            <button
              type="button"
              @click="applyPreset('📁 Google Drive', 'https://drive.google.com/drive/folders/')"
              class="px-2 py-0.5 rounded text-[10px] font-semibold bg-white border border-slate-200 text-slate-600 hover:text-teal-700 hover:border-teal-300 transition-colors"
            >
              📁 Google Drive
            </button>
            <button
              type="button"
              @click="applyPreset('📊 Spreadsheet CPR', 'https://docs.google.com/spreadsheets/')"
              class="px-2 py-0.5 rounded text-[10px] font-semibold bg-white border border-slate-200 text-slate-600 hover:text-teal-700 hover:border-teal-300 transition-colors"
            >
              📊 Spreadsheet
            </button>
            <button
              type="button"
              @click="applyPreset('🎨 Desain Canva', 'https://www.canva.com/design/')"
              class="px-2 py-0.5 rounded text-[10px] font-semibold bg-white border border-slate-200 text-slate-600 hover:text-teal-700 hover:border-teal-300 transition-colors"
            >
              🎨 Canva
            </button>
            <button
              type="button"
              @click="applyPreset('🌐 Landing Page', 'https://')"
              class="px-2 py-0.5 rounded text-[10px] font-semibold bg-white border border-slate-200 text-slate-600 hover:text-teal-700 hover:border-teal-300 transition-colors"
            >
              🌐 Landing Page
            </button>
          </div>
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
import { CheckSquare, X, Paperclip } from 'lucide-vue-next';

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
  date: new Date().toISOString().split('T')[0],
  notes: '',
  obstacle: '',
  evaluation: '',
  conclusion: '',
  workResultUrl: '',
  workResultTitle: '',
  attachments: [],
  completed: false
});

watch(
  () => props.initialData,
  (val) => {
    if (val) {
      form.value = {
        title: val.title || '',
        category: val.category || 'OUTPUT',
        priority: val.priority || 'MEDIUM',
        estimatedHours: val.estimatedHours || 1.5,
        date: val.date || new Date().toISOString().split('T')[0],
        notes: val.notes || '',
        obstacle: val.obstacle || '',
        evaluation: val.evaluation || '',
        conclusion: val.conclusion || '',
        workResultUrl: val.workResultUrl || '',
        workResultTitle: val.workResultTitle || '',
        attachments: val.attachments ? [...val.attachments] : [],
        completed: Boolean(val.completed)
      };
    } else {
      form.value = {
        title: '',
        category: 'OUTPUT',
        priority: 'MEDIUM',
        estimatedHours: 1.5,
        date: new Date().toISOString().split('T')[0],
        notes: '',
        obstacle: '',
        evaluation: '',
        conclusion: '',
        workResultUrl: '',
        workResultTitle: '',
        attachments: [],
        completed: false
      };
    }
  },
  { immediate: true }
);

function applyPreset(presetTitle, presetUrlPrefix) {
  if (!form.value.workResultTitle) {
    form.value.workResultTitle = presetTitle;
  }
  if (!form.value.workResultUrl || form.value.workResultUrl === 'https://') {
    form.value.workResultUrl = presetUrlPrefix;
  }
}

function handleSubmit() {
  if (!form.value.title.trim()) return;

  // Auto ensure https:// if url is filled
  let url = form.value.workResultUrl.trim();
  if (url && !/^https?:\/\//i.test(url)) {
    url = 'https://' + url;
    form.value.workResultUrl = url;
  }

  // Sync attachments array if workResultUrl is given
  const attachments = form.value.attachments ? [...form.value.attachments] : [];
  if (url && !attachments.some(a => a.url === url)) {
    attachments.unshift({
      title: form.value.workResultTitle.trim() || 'Hasil Kerja',
      url
    });
  }

  emit('save', {
    ...form.value,
    workResultUrl: url,
    workResultTitle: form.value.workResultTitle.trim(),
    attachments
  });
}
</script>
