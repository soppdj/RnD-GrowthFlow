<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
    <div class="glass-panel rounded-2xl w-full max-w-lg p-6 shadow-2xl border border-teal-100 max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between pb-3 border-b border-teal-100">
        <h3 class="text-base font-bold text-slate-800 flex items-center gap-2">
          <FlaskConical class="w-5 h-5 text-teal-600" />
          <span>{{ isEdit ? 'Edit Eksperimen Kampanye' : 'Tambah Eksperimen Baru (Ad Lab)' }}</span>
        </h3>
        <button @click="$emit('close')" class="p-1 rounded-lg text-slate-400 hover:text-slate-600">
          <X class="w-5 h-5" />
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="mt-4 space-y-4">
        <!-- Campaign Name -->
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Nama Kampanye / Ad Set</label>
          <input
            v-model="form.name"
            type="text"
            required
            placeholder="Contoh: Wakaf Sumur #AlirkanKebaikan - Hook Santri..."
            class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-teal-500 text-sm outline-none font-semibold"
          />
        </div>

        <!-- Platform & Stage -->
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Platform Iklan</label>
            <select v-model="form.platform" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none">
              <option value="Meta Ads">Meta Ads (FB/IG)</option>
              <option value="TikTok Ads">TikTok Ads</option>
              <option value="Google Search">Google Search Ads</option>
              <option value="YouTube Ads">YouTube Ads</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Tahap (Stage Kanban)</label>
            <select v-model="form.stage" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none">
              <option value="TEST">1. TEST (Validasi Creative)</option>
              <option value="SCALE_1">2. SCALE 1 (Winning Ad Set)</option>
              <option value="SCALE_2">3. SCALE 2 (Final Scale Budget)</option>
            </select>
          </div>
        </div>

        <!-- Creative Hook & Status -->
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Angle / Hook Creative</label>
            <input
              v-model="form.hookType"
              type="text"
              placeholder="Contoh: Video Storytelling Emosional"
              class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Status</label>
            <select v-model="form.status" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none">
              <option value="Active">Active (Berjalan)</option>
              <option value="Paused">Paused (Jeda)</option>
              <option value="Graduated">Graduated (Selesai/Lulus)</option>
            </select>
          </div>
        </div>

        <!-- Ad Spend, Donatur Baru, Pendapatan (Realtime Auto-Calculations Preview) -->
        <div class="p-3.5 rounded-xl bg-teal-50/50 border border-teal-100 space-y-3">
          <p class="text-xs font-bold text-teal-900 flex items-center justify-between">
            <span>Metrik Finansial & Konversi</span>
            <span class="text-[10px] font-normal text-teal-700">Auto-Calculate ROI & CPR</span>
          </p>

          <div class="grid grid-cols-3 gap-2">
            <div>
              <label class="block text-[10px] font-bold text-slate-600 uppercase mb-1">Ad Spend (Rp)</label>
              <input
                v-model.number="form.adSpend"
                type="number"
                min="0"
                step="any"
                class="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-800"
              />
            </div>
            <div>
              <label class="block text-[10px] font-bold text-slate-600 uppercase mb-1">Donatur Baru</label>
              <input
                v-model.number="form.newDonors"
                type="number"
                min="0"
                step="any"
                class="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-800"
              />
            </div>
            <div>
              <label class="block text-[10px] font-bold text-slate-600 uppercase mb-1">Realisasi (Rp)</label>
              <input
                v-model.number="form.revenue"
                type="number"
                min="0"
                step="any"
                class="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-emerald-700"
              />
            </div>
          </div>

          <!-- Dynamic Calculations Result Preview -->
          <div class="flex items-center justify-between pt-2 border-t border-teal-200/60 text-xs">
            <div>
              <span class="text-slate-500 text-[10px]">CPR: </span>
              <strong class="text-teal-800">{{ formatCurrency(previewCPR) }}</strong>
            </div>
            <div>
              <span class="text-slate-500 text-[10px]">ROI: </span>
              <strong class="text-emerald-700">{{ formatPercent(previewROI) }}</strong>
            </div>
          </div>
        </div>

        <!-- Notes -->
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Evaluasi / Rencana Injeksi</label>
          <textarea
            v-model="form.notes"
            rows="2"
            placeholder="Catatan optimasi CTR, audiens lookalike, atau rekomendasi..."
            class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none"
          ></textarea>
        </div>

        <div class="flex items-center justify-end gap-2 pt-3 border-t border-teal-100">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
          >
            Batal
          </button>
          <button
            type="submit"
            class="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-soft"
          >
            {{ isEdit ? 'Simpan Eksperimen' : 'Luncurkan Eksperimen' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { calculateROI, calculateCPR, formatCurrency, formatPercent } from '@/utils/formatters';
import { FlaskConical, X } from 'lucide-vue-next';

const props = defineProps({
  isOpen: Boolean,
  initialData: Object,
  isEdit: Boolean
});

const emit = defineEmits(['close', 'save']);

const form = ref({
  name: '',
  platform: 'Meta Ads',
  stage: 'TEST',
  status: 'Active',
  hookType: '',
  adSpend: 2000000,
  newDonors: 50,
  revenue: 8000000,
  notes: ''
});

watch(
  () => props.initialData,
  (val) => {
    if (val) {
      form.value = { ...val };
    } else {
      form.value = {
        name: '',
        platform: 'Meta Ads',
        stage: 'TEST',
        status: 'Active',
        hookType: '',
        adSpend: 2000000,
        newDonors: 50,
        revenue: 8000000,
        notes: ''
      };
    }
  },
  { immediate: true }
);

const previewROI = computed(() => calculateROI(form.value.revenue, form.value.adSpend));
const previewCPR = computed(() => calculateCPR(form.value.adSpend, form.value.newDonors));

function handleSubmit() {
  if (!form.value.name.trim()) return;
  emit('save', { ...form.value });
}
</script>
