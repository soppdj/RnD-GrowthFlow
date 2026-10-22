<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
    <div class="glass-panel rounded-2xl w-full max-w-lg p-6 shadow-2xl border border-teal-100 max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between pb-3 border-b border-teal-100">
        <h3 class="text-base font-bold text-slate-800 flex items-center gap-2">
          <Coins class="w-5 h-5 text-teal-600" />
          <span>{{ isEdit ? 'Edit Program Donasi' : 'Tambah Program Donasi Baru' }}</span>
        </h3>
        <button @click="$emit('close')" class="p-1 rounded-lg text-slate-400 hover:text-slate-600">
          <X class="w-5 h-5" />
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="mt-4 space-y-4">
        <!-- Program Name -->
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Nama Program Donasi</label>
          <input
            v-model="form.name"
            type="text"
            required
            placeholder="Contoh: Wakaf Sumur Bor & Filter Air Santri..."
            class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-teal-500 text-sm outline-none font-semibold"
          />
        </div>

        <!-- Category & Status -->
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Kategori Program</label>
            <select v-model="form.category" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none">
              <option value="Wakaf">Wakaf Produktif & Sarana</option>
              <option value="Zakat">Zakat Maal & Fitrah</option>
              <option value="Sedekah">Sedekah Pangan & Yatim</option>
              <option value="Pendidikan">Beasiswa & Tahfidz Quran</option>
              <option value="Kemanusiaan">Tanggap Darurat & Medis</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Status Program</label>
            <select v-model="form.status" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none">
              <option value="Active">Aktif Berjalan</option>
              <option value="Target Achieved">Target Tercapai</option>
              <option value="Paused">Jeda Sementara</option>
            </select>
          </div>
        </div>

        <!-- Target & Realisasi -->
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Target Penghimpunan (Rp)</label>
            <input
              v-model.number="form.targetAmount"
              type="number"
              min="0"
              step="1000000"
              required
              class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Realisasi Saat Ini (Rp)</label>
            <input
              v-model.number="form.realizedAmount"
              type="number"
              min="0"
              step="500000"
              required
              class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-emerald-700"
            />
          </div>
        </div>

        <!-- Ad Spend & Donatur Baru -->
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Total Ad Spend (Rp)</label>
            <input
              v-model.number="form.adSpend"
              type="number"
              min="0"
              step="100000"
              class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Jumlah Donatur Baru</label>
            <input
              v-model.number="form.newDonors"
              type="number"
              min="0"
              class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800"
            />
          </div>
        </div>

        <!-- Realtime Auto-calculation preview -->
        <div class="p-3 rounded-xl bg-teal-50/70 border border-teal-100 flex items-center justify-between text-xs">
          <div>
            <span class="text-slate-500 text-[10px]">CPR: </span>
            <strong class="text-teal-800">{{ formatCurrency(calculatedCPR) }}</strong>
          </div>
          <div>
            <span class="text-slate-500 text-[10px]">ROI Iklan: </span>
            <strong class="text-emerald-700">{{ formatPercent(calculatedROI) }}</strong>
          </div>
          <div>
            <span class="text-slate-500 text-[10px]">Capaian: </span>
            <strong class="text-indigo-700">{{ progressPercent }}%</strong>
          </div>
        </div>

        <!-- Description -->
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Deskripsi Singkat / Asnaf</label>
          <textarea
            v-model="form.description"
            rows="2"
            placeholder="Penerima manfaat program, lokasi penyaluran, target santri..."
            class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none"
          ></textarea>
        </div>

        <!-- Actions -->
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
            {{ isEdit ? 'Simpan Program' : 'Daftarkan Program' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { calculateROI, calculateCPR, formatCurrency, formatPercent } from '@/utils/formatters';
import { Coins, X } from 'lucide-vue-next';

const props = defineProps({
  isOpen: Boolean,
  initialData: Object,
  isEdit: Boolean
});

const emit = defineEmits(['close', 'save']);

const form = ref({
  name: '',
  category: 'Wakaf',
  status: 'Active',
  targetAmount: 100000000,
  realizedAmount: 25000000,
  adSpend: 5000000,
  newDonors: 100,
  description: ''
});

watch(
  () => props.initialData,
  (val) => {
    if (val) {
      form.value = { ...val };
    } else {
      form.value = {
        name: '',
        category: 'Wakaf',
        status: 'Active',
        targetAmount: 100000000,
        realizedAmount: 25000000,
        adSpend: 5000000,
        newDonors: 100,
        description: ''
      };
    }
  },
  { immediate: true }
);

const calculatedCPR = computed(() => calculateCPR(form.value.adSpend, form.value.newDonors));
const calculatedROI = computed(() => calculateROI(form.value.realizedAmount, form.value.adSpend));
const progressPercent = computed(() => {
  if (!form.value.targetAmount) return 0;
  return Math.min(Math.round((form.value.realizedAmount / form.value.targetAmount) * 100), 100);
});

function handleSubmit() {
  if (!form.value.name.trim()) return;
  emit('save', { ...form.value });
}
</script>
