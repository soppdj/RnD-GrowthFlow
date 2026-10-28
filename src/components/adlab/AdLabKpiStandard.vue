<template>
  <div class="glass-card rounded-2xl border border-teal-200/90 shadow-soft overflow-hidden transition-all">
    <!-- Header Bar -->
    <div class="p-4 sm:p-5 bg-gradient-to-r from-teal-50/90 via-emerald-50/50 to-white border-b border-teal-100">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <!-- Title & Subtitle (Ejaan Yang Benar) -->
        <div class="flex items-start sm:items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-soft shrink-0">
            <FlaskConical class="w-5 h-5" />
          </div>
          <div>
            <div class="flex flex-wrap items-center gap-2">
              <h3 class="text-base font-extrabold text-slate-800 tracking-tight">
                Standar KPI Iklan
              </h3>
              <span class="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                SOP Yayasan Khoirur Rooziqiin
              </span>
            </div>
            <p class="text-xs text-slate-500 mt-0.5">
              Tolak ukur baku performa iklan, ambang batas target aktual, dan SOP tindakan kuratif jika metrik tidak tercapai
            </p>
          </div>
        </div>

        <!-- Controls: Base Price & Evaluator Trigger (Geser ke Kanan) -->
        <div class="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <!-- Price Badge & Editor Button -->
          <button
            @click="openPriceModal"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-teal-200 text-teal-800 hover:bg-teal-50/80 shadow-micro transition-all"
            title="Klik untuk ubah acuan harga jual"
          >
            <Tag class="w-3.5 h-3.5 text-teal-600" />
            <span>Harga Jual:</span>
            <strong class="font-extrabold text-teal-900">{{ formatCurrency(store.rdProductPrice) }}</strong>
            <Edit2 class="w-3 h-3 text-slate-400 hover:text-teal-700 ml-0.5" />
          </button>

          <!-- Evaluator Meta Ads Quick Trigger -->
          <button
            @click="isEvaluatorModalOpen = true"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 shadow-micro transition-all"
            title="Upload file spreadsheet Meta Ads untuk konversi otomatis dan penentuan lanjut vs stop"
          >
            <FileSpreadsheet class="w-3.5 h-3.5 text-emerald-600" />
            <span>Evaluasi File Meta Ads</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Body: Tabel Format Excel (Langsung Tampil Tanpa Opsi / Hide) -->
    <div class="p-4 sm:p-5">
      <div class="overflow-x-auto rounded-xl border border-teal-200/80 shadow-sm bg-white">
        <table class="w-full text-left text-xs text-slate-700 border-collapse">
          <thead>
            <tr class="bg-gradient-to-r from-teal-700 via-teal-800 to-emerald-800 text-white font-extrabold text-[11px] uppercase tracking-wider">
              <th scope="col" class="py-2.5 px-3 w-12 text-center border-r border-teal-600/50">NO</th>
              <th scope="col" class="py-2.5 px-4 w-44 border-r border-teal-600/50">KPI METRIC</th>
              <th scope="col" class="py-2.5 px-4 w-40 border-r border-teal-600/50">TARGET KPI</th>
              <th scope="col" class="py-2.5 px-4 w-40 border-r border-teal-600/50">HARGA JUAL</th>
              <th scope="col" class="py-2.5 px-4 w-36 text-center bg-blue-600 text-white border-r border-blue-500 shadow-inner">
                ACTUAL TARGET KPI
              </th>
              <th scope="col" class="py-2.5 px-4">AKSI BILA TIDAK TERCAPAI</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 font-medium">
            <tr
              v-for="item in kpiList"
              :key="item.no"
              class="hover:bg-teal-50/30 transition-colors"
            >
              <!-- 1. No -->
              <td class="py-2.5 px-3 text-center font-bold text-slate-500 border-r border-slate-100 bg-slate-50/50">
                {{ item.no }}
              </td>

              <!-- 2. KPI Metric -->
              <td class="py-2.5 px-4 font-bold text-slate-800 border-r border-slate-100">
                <div class="flex items-center gap-2">
                  <span
                    class="w-2 h-2 rounded-full"
                    :class="item.status === 'optimal' ? 'bg-emerald-500' : 'bg-amber-500'"
                  ></span>
                  <span>{{ item.metric }}</span>
                </div>
              </td>

              <!-- 3. Target KPI -->
              <td class="py-2.5 px-4 text-slate-600 border-r border-slate-100">
                <span class="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-semibold">
                  {{ item.targetKpi }}
                </span>
              </td>

              <!-- 4. Harga Jual -->
              <td
                class="py-2.5 px-4 text-slate-600 border-r border-slate-100 transition-colors"
                :class="item.hasProductPrice ? 'cursor-pointer hover:bg-teal-50/60 group' : ''"
                @click="item.hasProductPrice ? openPriceModal() : null"
                :title="item.hasProductPrice ? 'Klik untuk ubah Harga Jual' : ''"
              >
                <div v-if="item.hasProductPrice" class="flex items-center justify-between">
                  <span class="font-semibold text-slate-700">
                    {{ item.productPriceFormatted || formatCurrency(store.rdProductPrice) }}
                  </span>
                  <Edit2 class="w-3 h-3 text-teal-600 opacity-60 group-hover:opacity-100 transition-opacity ml-1" />
                </div>
                <span v-else class="text-slate-400 font-normal italic">-</span>
              </td>

              <!-- 5. Actual Target KPI -->
              <td class="py-2.5 px-4 text-center font-black border-r border-blue-100 bg-blue-50/70 text-blue-900 text-sm">
                <span class="px-2.5 py-1 rounded-lg bg-blue-100/90 border border-blue-200 block shadow-micro tracking-tight">
                  {{ item.actualTargetFormatted }}
                </span>
              </td>

              <!-- 6. Aksi Bila Tidak Tercapai (Ejaan Yang Benar) -->
              <td class="py-2.5 px-4 text-slate-700 text-xs">
                <div class="space-y-1">
                  <!-- CPC -->
                  <template v-if="item.id === 'cpc'">
                    <p class="flex items-center gap-1.5 text-slate-700">
                      <span class="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0"></span>
                      <span>Perbaiki konten kreatif</span>
                    </p>
                    <p class="flex items-center gap-1.5 text-slate-700">
                      <span class="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0"></span>
                      <span>Tambah variasi konten baru</span>
                    </p>
                  </template>

                  <!-- Cost LPV -->
                  <template v-else-if="item.id === 'cost_lpv'">
                    <p class="flex items-center gap-1.5 text-slate-700">
                      <span class="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0"></span>
                      <span>Perbaiki kecepatan landing page</span>
                    </p>
                    <p class="flex items-center gap-1.5 text-slate-700">
                      <span class="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0"></span>
                      <span>Gunakan lazy load, website booster</span>
                    </p>
                  </template>

                  <!-- CPM -->
                  <template v-else-if="item.id === 'cpm'">
                    <p class="flex items-center gap-1.5 text-rose-800 font-semibold bg-rose-50/80 px-2 py-1 rounded border border-rose-100">
                      <span>Tunggu 2-3 hari evaluasi stabilisasi algoritma; jika tetap buruk, segera matikan (kill)</span>
                    </p>
                  </template>

                  <!-- CTR -->
                  <template v-else-if="item.id === 'ctr'">
                    <p class="font-semibold text-slate-800">
                      Buat konten yang lebih menarik (komentar, share, like)
                    </p>
                    <div class="pl-2 border-l-2 border-teal-300 text-[11px] text-slate-600 space-y-0.5 mt-1">
                      <p class="font-bold text-teal-800">Ciri-ciri:</p>
                      <p>1. Kualitas konten 4K</p>
                      <p>2. Konten informatif</p>
                      <p>3. Konten menarik</p>
                      <p>4. Konten lucu / humor</p>
                    </div>
                  </template>

                  <!-- CPR -->
                  <template v-else-if="item.id === 'cpr'">
                    <p class="font-bold text-slate-800">Perbaiki Website:</p>
                    <div class="pl-2 border-l-2 border-amber-300 text-[11px] text-slate-600 space-y-0.5 mt-1">
                      <p>1. Desain website profesional</p>
                      <p>2. Penawaran menarik (bonus / urgensi)</p>
                      <p>3. Harga (coba turunkan jika masih kurang optimal dalam 1 pekan)</p>
                      <p>4. Persingkat alur checkout, jangan terlalu panjang</p>
                    </div>
                  </template>

                  <!-- Closing Rate CS -->
                  <template v-else-if="item.id === 'closing_rate'">
                    <div class="text-[11px] text-slate-700 space-y-0.5">
                      <p>1. Edukasi CS (In-House Training, Workshop)</p>
                      <p>2. Perbesar nilai bonus organik</p>
                      <p>3. CS fast respon maksimal 5 menit</p>
                    </div>
                  </template>

                  <!-- LC to LPV -->
                  <template v-else-if="item.id === 'lc_to_lpv'">
                    <p class="flex items-center gap-1.5 text-slate-700 font-semibold">
                      <span class="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0"></span>
                      <span>Jika kurang, optimasi landing page agar lebih cepat</span>
                    </p>
                  </template>

                  <!-- LPV to ATC -->
                  <template v-else-if="item.id === 'lpv_to_atc'">
                    <p class="flex items-center gap-1.5 text-slate-700 font-semibold">
                      <span class="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0"></span>
                      <span>Gunakan hypno writing di landingpage</span>
                    </p>
                  </template>

                  <!-- ATC to IC -->
                  <template v-else-if="item.id === 'atc_to_ic'">
                    <p class="flex items-center gap-1.5 text-slate-700 font-semibold">
                      <span class="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0"></span>
                      <span>Beri penawaran menarik</span>
                    </p>
                  </template>

                  <!-- Default Fallback -->
                  <template v-else>
                    <p v-for="(act, aIdx) in item.actions" :key="aIdx" class="flex items-center gap-1.5 text-slate-700">
                      <span class="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0"></span>
                      <span>{{ act }}</span>
                    </p>
                  </template>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- MODAL EDIT HARGA JUAL -->
    <div
      v-if="isPriceModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
    >
      <div class="glass-panel rounded-2xl w-full max-w-md p-6 shadow-2xl border border-teal-100">
        <div class="flex items-center justify-between pb-3 border-b border-teal-100">
          <h3 class="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Tag class="w-4 h-4 text-teal-600" />
            <span>Ubah Acuan Harga Jual</span>
          </h3>
          <button @click="isPriceModalOpen = false" class="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X class="w-5 h-5" />
          </button>
        </div>

        <form @submit.prevent="saveNewPrice" class="mt-4 space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">
              Harga Jual (Rp)
            </label>
            <div class="relative">
              <span class="absolute left-3 top-2.5 text-xs font-bold text-slate-400">Rp</span>
              <input
                v-model.number="tempPrice"
                type="number"
                min="1000"
                step="100"
                required
                class="w-full pl-10 pr-4 py-2 rounded-xl border border-teal-200 text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-teal-500 bg-white"
              />
            </div>
            <p class="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
              Target aktual seperti CPC (1%), Cost LPV (3%), dan CPR (25%) akan dihitung ulang secara otomatis berdasarkan nilai Harga Jual ini.
            </p>
          </div>

          <div class="p-3 rounded-xl bg-teal-50 border border-teal-200/80 text-xs space-y-1">
            <p class="font-bold text-teal-900">Hitungan Otomatis Target Baru:</p>
            <div class="grid grid-cols-2 gap-2 text-[11px] text-teal-800 mt-1">
              <span>• CPC (1%): <strong>{{ formatCurrency(Math.round(tempPrice * 0.01)) }}</strong></span>
              <span>• Cost LPV (3%): <strong>{{ formatCurrency(Math.round(tempPrice * 0.03)) }}</strong></span>
              <span>• CPR (25%): <strong>{{ formatCurrency(Math.round(tempPrice * 0.25)) }}</strong></span>
              <span>• CPM: <strong>Rp 32.000</strong></span>
            </div>
          </div>

          <div class="flex items-center justify-end gap-2 pt-3 border-t border-teal-100">
            <button
              type="button"
              @click="isPriceModalOpen = false"
              class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-5 py-2 rounded-xl text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white shadow-soft transition-all"
            >
              Simpan &amp; Terapkan
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL EVALUATOR META ADS -->
    <MetaAdsEvaluatorModal
      :is-open="isEvaluatorModalOpen"
      @close="isEvaluatorModalOpen = false"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useGrowthFlowStore } from '@/stores/growthFlowStore';
import { formatCurrency } from '@/utils/formatters';
import MetaAdsEvaluatorModal from './MetaAdsEvaluatorModal.vue';
import {
  FlaskConical,
  Tag,
  FileSpreadsheet,
  Edit2,
  X
} from 'lucide-vue-next';

const store = useGrowthFlowStore();

const isPriceModalOpen = ref(false);
const isEvaluatorModalOpen = ref(false);
const tempPrice = ref(store.rdProductPrice || 50000);

const kpiList = computed(() => store.rdKpiList);

function openPriceModal() {
  tempPrice.value = store.rdProductPrice || 50000;
  isPriceModalOpen.value = true;
}

function saveNewPrice() {
  store.setRdProductPrice(tempPrice.value);
  isPriceModalOpen.value = false;
}
</script>
