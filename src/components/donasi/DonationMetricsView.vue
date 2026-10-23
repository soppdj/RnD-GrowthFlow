<template>
  <div class="space-y-6">
    <!-- Top Action Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
          <span>Donasi &amp; Metrik Akuisisi Donatur</span>
          <span class="text-xs px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 font-semibold border border-teal-200">
            Realtime Analytics
          </span>
        </h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Monitoring progres target penghimpunan dan realisasi dana per program filantropi Yayasan Khoirur Rooziqiin
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

    <!-- 4 RINGKASAN METRIK KARTU ATAS (PERSIS SEPERTI GAMBAR 1) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- 1. TOTAL TARGET -->
      <div class="glass-card rounded-2xl p-4 sm:p-5 border border-teal-100 shadow-soft bg-white/95">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center shrink-0 shadow-micro">
            <Target class="w-5 h-5 text-teal-600" />
          </div>
          <div>
            <span class="text-[10px] font-extrabold text-teal-800 uppercase tracking-wider block">
              TOTAL TARGET
            </span>
            <p class="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              {{ formatCurrency(summary.totalTarget) }}
            </p>
          </div>
        </div>
      </div>

      <!-- 2. TERKUMPUL (ACTUAL) -->
      <div class="glass-card rounded-2xl p-4 sm:p-5 border border-teal-100 shadow-soft bg-white/95">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center shrink-0 shadow-micro">
            <Wallet class="w-5 h-5 text-teal-600" />
          </div>
          <div>
            <span class="text-[10px] font-extrabold text-teal-800 uppercase tracking-wider block">
              TERKUMPUL (ACTUAL)
            </span>
            <p class="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              {{ formatCurrency(summary.totalRealized) }}
            </p>
          </div>
        </div>
      </div>

      <!-- 3. CAPAIAN (%) WITH PROGRESS BAR -->
      <div class="glass-card rounded-2xl p-4 sm:p-5 border border-teal-100 shadow-soft bg-white/95 flex flex-col justify-between">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center shrink-0 font-extrabold text-xs">
              %
            </div>
            <span class="text-[10px] font-extrabold text-teal-800 uppercase tracking-wider">
              CAPAIAN
            </span>
          </div>
          <span class="text-base font-extrabold text-teal-800">
            {{ summary.achievementPercent }}%
          </span>
        </div>
        <div class="w-full bg-teal-50 rounded-full h-2 mt-3 overflow-hidden border border-teal-100">
          <div
            class="bg-gradient-to-r from-teal-500 to-emerald-600 h-2 rounded-full transition-all duration-700"
            :style="{ width: `${Math.min(100, summary.achievementPercent)}%` }"
          ></div>
        </div>
      </div>

      <!-- 4. SISA PERLU DIHIMPUN -->
      <div class="glass-card rounded-2xl p-4 sm:p-5 border border-amber-200/90 shadow-soft bg-amber-50/20">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-amber-100/80 border border-amber-300 text-amber-700 flex items-center justify-center shrink-0 shadow-micro">
            <ArrowUpRight class="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <span class="text-[10px] font-extrabold text-amber-900 uppercase tracking-wider block">
              SISA PERLU DIHIMPUN
            </span>
            <p class="text-lg sm:text-xl font-extrabold text-amber-800 tracking-tight mt-0.5">
              {{ formatCurrency(summary.remainingToRaise) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 3D ISOMETRIC CHART VISUALIZATION (PERSIS GAMBAR 1) -->
    <DonationComparisonChart />

    <!-- RINCIAN TABEL PROGRES PENGHIMPUNAN DONASI (PERSIS SEPERTI GAMBAR 2) -->
    <div class="glass-card rounded-2xl p-5 sm:p-6 shadow-soft border border-teal-100 bg-white/95 overflow-hidden">
      <!-- Table Header -->
      <div class="flex items-center justify-between mb-4 pb-2 border-b border-teal-100/60">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center shadow-micro">
            <Receipt class="w-4 h-4 text-teal-700" />
          </div>
          <h3 class="text-sm sm:text-base font-extrabold text-slate-800 tracking-tight">
            Rincian Tabel Progres Penghimpunan Donasi
          </h3>
        </div>

        <span class="text-xs text-slate-400 font-medium hidden sm:inline-block">
          {{ store.donationPrograms.length }} Program Terdaftar
        </span>
      </div>

      <!-- Table Content -->
      <div class="overflow-x-auto -mx-5 px-5">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="border-b border-teal-100 text-slate-400 font-extrabold uppercase text-[10px] tracking-wider">
              <th scope="col" class="py-3 px-4 w-60">PROGRAM</th>
              <th scope="col" class="py-3 px-4 w-44">TARGET DONASI</th>
              <th scope="col" class="py-3 px-4 w-44">ACTUAL (TERKUMPUL)</th>
              <th scope="col" class="py-3 px-4 w-64">PERSENTASE REALISASI</th>
              <th scope="col" class="py-3 px-3 w-16 text-center">AKSI</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-teal-50/80 font-medium">
            <tr
              v-for="prog in programRows"
              :key="prog.id"
              class="hover:bg-teal-50/40 transition-colors group"
            >
              <!-- Program Name with Dot indicator -->
              <td class="py-4 px-4">
                <div class="flex items-center gap-2.5">
                  <span class="w-2 h-2 rounded-full bg-teal-600 shrink-0"></span>
                  <span class="font-extrabold text-slate-800 text-xs sm:text-sm">
                    {{ prog.name }}
                  </span>
                </div>
              </td>

              <!-- Target Donasi -->
              <td class="py-4 px-4 font-semibold text-slate-700 whitespace-nowrap">
                {{ formatCurrency(prog.targetAmount) }}
              </td>

              <!-- Actual (Terkumpul) -->
              <td class="py-4 px-4 font-bold text-slate-900 whitespace-nowrap">
                {{ formatCurrency(prog.realizedAmount) }}
              </td>

              <!-- Persentase Realisasi with Badge & Bar -->
              <td class="py-4 px-4">
                <div class="flex items-center gap-3">
                  <!-- Percentage Pill Badge -->
                  <span
                    class="px-2.5 py-0.5 rounded-lg text-xs font-extrabold border shadow-micro shrink-0"
                    :class="prog.percentNum >= 90
                      ? 'bg-teal-50 text-teal-800 border-teal-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'"
                  >
                    {{ prog.percentStr }}%
                  </span>

                  <!-- Progress Bar -->
                  <div class="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden max-w-[140px]">
                    <div
                      class="h-2 rounded-full transition-all duration-700"
                      :class="prog.percentNum >= 90 ? 'bg-teal-600' : 'bg-amber-500'"
                      :style="{ width: `${Math.min(100, prog.percentNum)}%` }"
                    ></div>
                  </div>
                </div>
              </td>

              <!-- Actions (Edit / Delete) -->
              <td class="py-4 px-3 text-center whitespace-nowrap">
                <div class="flex items-center justify-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                  <button
                    @click="editProgram(prog)"
                    class="p-1 rounded-lg text-slate-400 hover:text-teal-700 hover:bg-teal-50 transition-colors"
                    title="Edit Program"
                  >
                    <Edit2 class="w-3.5 h-3.5" />
                  </button>
                  <button
                    @click="deleteProgram(prog.id)"
                    class="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Hapus Program"
                  >
                    <Trash2 class="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>

          <!-- Table Footer: TOTAL AKUMULASI -->
          <tfoot>
            <tr class="bg-teal-50/50 border-t-2 border-teal-100 font-extrabold text-xs text-slate-900">
              <td class="py-3.5 px-4 uppercase tracking-wider text-teal-900">
                TOTAL AKUMULASI
              </td>
              <td class="py-3.5 px-4 font-black text-slate-800 whitespace-nowrap">
                {{ formatCurrency(summary.totalTarget) }}
              </td>
              <td class="py-3.5 px-4 font-black text-teal-900 whitespace-nowrap">
                {{ formatCurrency(summary.totalRealized) }}
              </td>
              <td class="py-3.5 px-4" colspan="2">
                <span class="inline-flex items-center gap-1 font-extrabold text-teal-800 bg-teal-100/80 px-2.5 py-1 rounded-lg border border-teal-200">
                  {{ summary.achievementPercent }}% tercapai
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <!-- Modal Form (Create/Edit) -->
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
import { ref, computed } from 'vue';
import { useGrowthFlowStore } from '@/stores/growthFlowStore';
import { formatCurrency } from '@/utils/formatters';
import DonationComparisonChart from './DonationComparisonChart.vue';
import DonationProgramModal from './DonationProgramModal.vue';
import {
  Target,
  Wallet,
  ArrowUpRight,
  BarChart2,
  Receipt,
  Plus,
  Edit2,
  Trash2
} from 'lucide-vue-next';

const store = useGrowthFlowStore();

const isModalOpen = ref(false);
const editingProgram = ref(null);

const summary = computed(() => {
  const progs = store.donationPrograms || [];
  const totalTarget = progs.reduce((sum, p) => sum + (Number(p.targetAmount) || 0), 0);
  const totalRealized = progs.reduce((sum, p) => sum + (Number(p.realizedAmount) || 0), 0);
  const remainingToRaise = Math.max(0, totalTarget - totalRealized);
  const achievementPercent = totalTarget > 0 ? ((totalRealized / totalTarget) * 100).toFixed(1) : '0.0';

  return {
    totalTarget,
    totalRealized,
    remainingToRaise,
    achievementPercent
  };
});

const programRows = computed(() => {
  return (store.donationPrograms || []).map(p => {
    const target = Number(p.targetAmount) || 1;
    const real = Number(p.realizedAmount) || 0;
    const pct = (real / target) * 100;
    return {
      ...p,
      percentNum: pct,
      percentStr: pct.toFixed(1)
    };
  });
});

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
