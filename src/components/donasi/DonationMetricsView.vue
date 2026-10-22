<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
          <span>Donasi & Metrik Akuisisi Donatur</span>
          <span class="text-xs px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 font-semibold border border-teal-200">
            Realtime Analytics
          </span>
        </h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Monitoring performa efisiensi akuisisi (CPR) dan return investasi iklan (ROI) per program dakwah & sosial
        </p>
      </div>

      <button
        @click="openCreateModal"
        class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-soft transition-all active:scale-95 shrink-0 self-start sm:self-auto"
      >
        <Plus class="w-4 h-4" />
        <span>Tambah Program Donasi</span>
      </button>
    </div>

    <!-- 3D Isometric Chart Visualization -->
    <DonationComparisonChart />

    <!-- Table of Donation Programs & Metrics -->
    <div class="glass-card rounded-2xl p-5 shadow-soft border border-teal-100 overflow-hidden">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-bold text-slate-800 flex items-center gap-2">
          <Table class="w-4 h-4 text-teal-600" />
          <span>Rincian Program & Metrik Finansial Realtime</span>
        </h3>
        <span class="text-xs text-slate-400 font-medium">
          {{ store.donationPrograms.length }} Program Terdaftar
        </span>
      </div>

      <div class="overflow-x-auto -mx-5 px-5">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="border-b border-teal-100 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
              <th class="py-3 px-3">Program & Kategori</th>
              <th class="py-3 px-3">Target</th>
              <th class="py-3 px-3">Realisasi Donasi</th>
              <th class="py-3 px-3">Ad Spend</th>
              <th class="py-3 px-3">Donatur Baru</th>
              <th class="py-3 px-3 text-right">CPR (Cost/Donatur)</th>
              <th class="py-3 px-3 text-right">ROI Iklan</th>
              <th class="py-3 px-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-teal-50">
            <tr
              v-for="prog in store.donationPrograms"
              :key="prog.id"
              class="hover:bg-teal-50/40 transition-colors"
            >
              <!-- Name & Category -->
              <td class="py-3.5 px-3">
                <span class="font-bold text-slate-800 block text-xs">{{ prog.name }}</span>
                <span class="text-[10px] text-teal-700 font-semibold bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200 mt-0.5 inline-block">
                  {{ prog.category }}
                </span>
              </td>

              <!-- Target -->
              <td class="py-3.5 px-3 font-semibold text-slate-600 whitespace-nowrap">
                {{ formatCurrency(prog.targetAmount) }}
              </td>

              <!-- Realisasi with progress bar -->
              <td class="py-3.5 px-3 whitespace-nowrap">
                <span class="font-bold text-emerald-700 block">
                  {{ formatCurrency(prog.realizedAmount) }}
                </span>
                <div class="w-24 bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
                  <div
                    class="bg-gradient-to-r from-teal-500 to-emerald-500 h-1.5 rounded-full"
                    :style="{ width: `${Math.min(100, Math.round((prog.realizedAmount / prog.targetAmount) * 100))}%` }"
                  ></div>
                </div>
              </td>

              <!-- Ad Spend -->
              <td class="py-3.5 px-3 font-semibold text-slate-700 whitespace-nowrap">
                {{ formatCurrency(prog.adSpend) }}
              </td>

              <!-- Donatur Baru -->
              <td class="py-3.5 px-3 font-bold text-slate-800 whitespace-nowrap">
                {{ formatNumber(prog.newDonors) }} Donatur
              </td>

              <!-- CPR Realtime -->
              <td class="py-3.5 px-3 text-right whitespace-nowrap">
                <span class="font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                  {{ formatCurrency(calculateCPR(prog.adSpend, prog.newDonors)) }}
                </span>
              </td>

              <!-- ROI Realtime -->
              <td class="py-3.5 px-3 text-right whitespace-nowrap">
                <span class="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  {{ formatPercent(calculateROI(prog.realizedAmount, prog.adSpend)) }}
                </span>
              </td>

              <!-- Actions -->
              <td class="py-3.5 px-3 text-center whitespace-nowrap">
                <div class="flex items-center justify-center gap-1">
                  <button
                    @click="editProgram(prog)"
                    class="p-1 rounded text-slate-400 hover:text-teal-700 hover:bg-teal-50 transition-colors"
                    title="Edit Program"
                  >
                    <Edit2 class="w-3.5 h-3.5" />
                  </button>
                  <button
                    @click="deleteProgram(prog.id)"
                    class="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Hapus Program"
                  >
                    <Trash2 class="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Form -->
    <DonationProgramModal
      :is-open="isModalOpen"
      :initial-data="editingProgram"
      :is-edit="!!editingProgram"
      @close="closeModal"
      @save="handleSaveProgram"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useGrowthFlowStore } from '@/stores/growthFlowStore';
import { formatCurrency, formatPercent, formatNumber, calculateROI, calculateCPR } from '@/utils/formatters';
import DonationComparisonChart from './DonationComparisonChart.vue';
import DonationProgramModal from './DonationProgramModal.vue';
import { Plus, Table, Edit2, Trash2 } from 'lucide-vue-next';

const store = useGrowthFlowStore();
const isModalOpen = ref(false);
const editingProgram = ref(null);

function openCreateModal() {
  editingProgram.value = null;
  isModalOpen.value = true;
}

function editProgram(prog) {
  editingProgram.value = { ...prog };
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
  editingProgram.value = null;
}

function handleSaveProgram(data) {
  if (editingProgram.value) {
    store.updateDonationProgram(editingProgram.value.id, data);
  } else {
    store.addDonationProgram(data);
  }
  closeModal();
}

function deleteProgram(id) {
  if (confirm('Yakin ingin menghapus program donasi ini?')) {
    store.deleteDonationProgram(id);
  }
}
</script>
