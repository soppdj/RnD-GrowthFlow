<template>
  <div class="glass-card rounded-2xl border border-teal-200/90 shadow-soft overflow-hidden transition-all">
    <!-- Header Bar -->
    <div class="p-4 sm:p-5 bg-gradient-to-r from-teal-50/90 via-emerald-50/50 to-white border-b border-teal-100">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <!-- Title & Subtitle -->
        <div class="flex items-start sm:items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-soft shrink-0">
            <FlaskConical class="w-5 h-5" />
          </div>
          <div>
            <div class="flex flex-wrap items-center gap-2">
              <h3 class="text-base font-extrabold text-slate-800 tracking-tight">
                Standar KPI R&amp;D (Ads Lab)
              </h3>
              <span class="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                SOP Yayasan Khoirur Rooziqiin
              </span>
            </div>
            <p class="text-xs text-slate-500 mt-0.5">
              Tolok ukur baku performa iklan, ambang batas target aktual, dan SOP aksi kuratif jika metrik tidak tercapai
            </p>
          </div>
        </div>

        <!-- Controls: Base Price & View Switcher & Collapse -->
        <div class="flex flex-wrap items-center gap-2 self-start lg:self-auto">
          <!-- Price Badge & Editor Button -->
          <button
            @click="openPriceModal"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-teal-200 text-teal-800 hover:bg-teal-50/80 shadow-micro transition-all"
            title="Klik untuk ubah acuan harga produk"
          >
            <Tag class="w-3.5 h-3.5 text-teal-600" />
            <span>Harga Jual:</span>
            <strong class="font-extrabold text-teal-900">{{ formatCurrency(store.rdProductPrice) }}</strong>
            <Edit2 class="w-3 h-3 text-slate-400 hover:text-teal-700 ml-0.5" />
          </button>

          <!-- View Mode Toggle -->
          <div class="flex items-center p-0.5 rounded-xl bg-teal-100/70 border border-teal-200/80 text-xs font-bold">
            <button
              @click="viewMode = 'table'"
              class="flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all"
              :class="viewMode === 'table' ? 'bg-white text-teal-900 shadow-micro' : 'text-slate-600 hover:text-slate-900'"
            >
              <Table2 class="w-3.5 h-3.5" />
              <span>Tabel SOP</span>
            </button>
            <button
              @click="viewMode = 'cards'"
              class="flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all"
              :class="viewMode === 'cards' ? 'bg-white text-teal-900 shadow-micro' : 'text-slate-600 hover:text-slate-900'"
            >
              <LayoutGrid class="w-3.5 h-3.5" />
              <span>Kartu Ringkas</span>
            </button>
          </div>

          <!-- Collapse / Expand Button -->
          <button
            @click="isCollapsed = !isCollapsed"
            class="p-1.5 rounded-xl text-slate-500 hover:text-teal-800 hover:bg-teal-100/50 transition-colors"
            :title="isCollapsed ? 'Buka Standar KPI R&D' : 'Sembunyikan/Kecilkan'"
          >
            <ChevronUp v-if="!isCollapsed" class="w-4 h-4" />
            <ChevronDown v-else class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Collapsed Teaser Bar -->
      <div v-if="isCollapsed" class="mt-3 pt-3 border-t border-teal-100 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
        <div class="flex items-center gap-4 flex-wrap">
          <span class="inline-flex items-center gap-1">
            <span class="font-bold text-slate-700">Target CPC:</span>
            <span class="px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 font-extrabold text-[11px] border border-blue-200">Rp 1.200</span>
          </span>
          <span class="inline-flex items-center gap-1">
            <span class="font-bold text-slate-700">Target Cost LP:</span>
            <span class="px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 font-extrabold text-[11px] border border-blue-200">Rp 3.714</span>
          </span>
          <span class="inline-flex items-center gap-1">
            <span class="font-bold text-slate-700">Target CPM:</span>
            <span class="px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 font-extrabold text-[11px] border border-blue-200">Rp 32.000</span>
          </span>
          <span class="inline-flex items-center gap-1">
            <span class="font-bold text-slate-700">Target CTR:</span>
            <span class="px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 font-extrabold text-[11px] border border-blue-200">&gt; 2%</span>
          </span>
          <span class="inline-flex items-center gap-1">
            <span class="font-bold text-slate-700">Target CPR:</span>
            <span class="px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 font-extrabold text-[11px] border border-blue-200">Rp 32.000</span>
          </span>
          <span class="inline-flex items-center gap-1">
            <span class="font-bold text-slate-700">Target Closing CS:</span>
            <span class="px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 font-extrabold text-[11px] border border-blue-200">82%</span>
          </span>
        </div>
        <button
          @click="isCollapsed = false"
          class="text-xs font-bold text-teal-700 hover:text-teal-900 underline flex items-center gap-0.5"
        >
          Lihat Detail &amp; Aksi SOP
        </button>
      </div>
    </div>

    <!-- Expanded Body Content -->
    <div v-show="!isCollapsed" class="p-4 sm:p-5">
      <!-- VIEW 1: TABEL SOP EXCEL (PERSIS DENGAN GAMBAR ACUAN) -->
      <div v-if="viewMode === 'table'" class="overflow-x-auto rounded-xl border border-teal-200/80 shadow-sm bg-white">
        <table class="w-full text-left text-xs text-slate-700 border-collapse">
          <thead>
            <tr class="bg-gradient-to-r from-teal-700 via-teal-800 to-emerald-800 text-white font-extrabold text-[11px] uppercase tracking-wider">
              <th scope="col" class="py-3 px-3 w-12 text-center border-r border-teal-600/50">No</th>
              <th scope="col" class="py-3 px-4 w-48 border-r border-teal-600/50">KPI Metric</th>
              <th scope="col" class="py-3 px-4 w-40 border-r border-teal-600/50">Target KPI</th>
              <th scope="col" class="py-3 px-4 w-40 border-r border-teal-600/50">Harga Jual Product</th>
              <th scope="col" class="py-3 px-4 w-36 text-center bg-blue-600 text-white border-r border-blue-500 shadow-inner">
                Actual Target KPI
              </th>
              <th scope="col" class="py-3 px-4">AKSI BILA TIDAK TERCAPAI</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 font-medium">
            <tr
              v-for="item in kpiList"
              :key="item.no"
              class="hover:bg-teal-50/30 transition-colors"
            >
              <!-- 1. No -->
              <td class="py-3.5 px-3 text-center font-bold text-slate-500 border-r border-slate-100 bg-slate-50/50">
                {{ item.no }}
              </td>

              <!-- 2. KPI Metric -->
              <td class="py-3.5 px-4 font-bold text-slate-800 border-r border-slate-100">
                <div class="flex items-center gap-2">
                  <span
                    class="w-2 h-2 rounded-full"
                    :class="item.status === 'optimal' ? 'bg-emerald-500' : 'bg-amber-500'"
                  ></span>
                  <span>{{ item.metric }}</span>
                </div>
              </td>

              <!-- 3. Target KPI -->
              <td class="py-3.5 px-4 text-slate-600 border-r border-slate-100">
                <span class="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-semibold">
                  {{ item.targetKpi }}
                </span>
              </td>

              <!-- 4. Harga Jual Product -->
              <td class="py-3.5 px-4 text-slate-600 border-r border-slate-100">
                <span v-if="item.hasProductPrice" class="font-semibold text-slate-700">
                  {{ item.productPriceFormatted || formatCurrency(store.rdProductPrice) }}
                </span>
                <span v-else class="text-slate-400 font-normal italic">-</span>
              </td>

              <!-- 5. Actual Target KPI (Highlighted in blue like Excel image) -->
              <td class="py-3.5 px-4 text-center font-black border-r border-blue-100 bg-blue-50/70 text-blue-900 text-sm">
                <span class="px-2.5 py-1 rounded-lg bg-blue-100/80 border border-blue-200 block shadow-micro">
                  {{ item.actualTargetFormatted }}
                </span>
              </td>

              <!-- 6. Aksi Bila Tidak Tercapai -->
              <td class="py-3.5 px-4 text-slate-700 text-xs">
                <div class="space-y-1">
                  <template v-if="item.id === 'cpc'">
                    <p class="flex items-center gap-1.5 text-slate-700">
                      <span class="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0"></span>
                      <span>perbaiki konten</span>
                    </p>
                    <p class="flex items-center gap-1.5 text-slate-700">
                      <span class="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0"></span>
                      <span>tambah konten baru</span>
                    </p>
                  </template>

                  <template v-else-if="item.id === 'cost_lpv'">
                    <p class="flex items-center gap-1.5 text-slate-700">
                      <span class="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0"></span>
                      <span>perbaiki kecepatan LP</span>
                    </p>
                    <p class="flex items-center gap-1.5 text-slate-700">
                      <span class="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0"></span>
                      <span>pake lazyload, wesite boster</span>
                    </p>
                  </template>

                  <template v-else-if="item.id === 'cpm'">
                    <p class="flex items-center gap-1.5 text-rose-800 font-semibold bg-rose-50/80 px-2 py-1 rounded border border-rose-100">
                      <span>tunggu 2-3 hari / masih jelek kill</span>
                    </p>
                  </template>

                  <template v-else-if="item.id === 'ctr'">
                    <p class="font-semibold text-slate-800">
                      bikin konten yang lebih menarik (komen,share,like)
                    </p>
                    <div class="pl-2 border-l-2 border-teal-300 text-[11px] text-slate-600 space-y-0.5 mt-1">
                      <p class="font-bold text-teal-800">ciri - ciri :</p>
                      <p>1. kualitas konten 4K</p>
                      <p>2. Konten Informatif</p>
                      <p>3. Konten Menarik</p>
                      <p>4. Konten Lucu/humor</p>
                    </div>
                  </template>

                  <template v-else-if="item.id === 'cpr'">
                    <p class="font-bold text-slate-800">Perbaiki Website :</p>
                    <div class="pl-2 border-l-2 border-amber-300 text-[11px] text-slate-600 space-y-0.5 mt-1">
                      <p>1. design website (pro)</p>
                      <p>2. Offer (penawaran : bonus)</p>
                      <p>3. Harga (coba turunin klo masih kurang bagus dalm 1 pekan)</p>
                      <p>4. Persingkat tampilan web jangan terlalu panjang</p>
                    </div>
                  </template>

                  <template v-else-if="item.id === 'closing_rate'">
                    <div class="text-[11px] text-slate-700 space-y-0.5">
                      <p>1. edukasi CS ( IHT, WS)</p>
                      <p>2. Bonus Organik Perbesar nilai nya</p>
                    </div>
                  </template>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- VIEW 2: KARTU RINGKASAN (CARDS VIEW) -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="item in kpiList"
          :key="item.no"
          class="p-4 rounded-xl bg-white border border-teal-100/90 shadow-micro hover:border-teal-300 transition-all flex flex-col justify-between"
        >
          <div>
            <div class="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
              <span class="font-bold text-slate-400">#{{ item.no }} Metric</span>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                Formula: {{ item.targetKpi }}
              </span>
            </div>

            <div class="mt-2.5">
              <h4 class="text-sm font-extrabold text-slate-800">{{ item.metric }}</h4>
              <div class="flex items-center justify-between mt-2 p-2.5 rounded-lg bg-blue-50/70 border border-blue-100">
                <div>
                  <span class="text-[10px] text-slate-500 font-medium block">Actual Target KPI:</span>
                  <span class="text-base font-black text-blue-900">{{ item.actualTargetFormatted }}</span>
                </div>
                <div class="text-right">
                  <span class="text-[10px] text-slate-500 font-medium block">Harga Acuan:</span>
                  <span class="text-xs font-bold text-slate-700">
                    {{ item.hasProductPrice ? formatCurrency(store.rdProductPrice) : '-' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Action Guideline -->
            <div class="mt-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 text-[11px]">
              <span class="font-bold text-rose-700 block mb-1">Aksi Jika Tidak Tercapai:</span>
              <ul class="text-slate-600 space-y-1 list-disc list-inside">
                <li v-for="(act, idx) in item.actions" :key="idx" class="leading-relaxed">
                  {{ act }}
                </li>
              </ul>
            </div>
          </div>

          <div class="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span class="text-slate-400">SOP R&amp;D Digital Marketing</span>
            <span class="text-emerald-700 font-bold flex items-center gap-1">
              <CheckCircle class="w-3.5 h-3.5" />
              <span>Standar Aktif</span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL EDIT HARGA JUAL PRODUCT -->
    <div
      v-if="isPriceModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
    >
      <div class="glass-panel rounded-2xl w-full max-w-md p-6 shadow-2xl border border-teal-100">
        <div class="flex items-center justify-between pb-3 border-b border-teal-100">
          <h3 class="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Tag class="w-4 h-4 text-teal-600" />
            <span>Ubah Acuan Harga Jual Product</span>
          </h3>
          <button @click="isPriceModalOpen = false" class="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X class="w-5 h-5" />
          </button>
        </div>

        <form @submit.prevent="saveNewPrice" class="mt-4 space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">
              Harga Jual Product / Paket Donasi (Rp)
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
              Target aktual seperti CPC (1%), Cost LP View (2-3%), dan CPR (25%) akan dihitung ulang secara otomatis berdasarkan nilai ini.
            </p>
          </div>

          <div class="p-3 rounded-xl bg-teal-50 border border-teal-200/80 text-xs space-y-1">
            <p class="font-bold text-teal-900">Simulasi Target Baru:</p>
            <div class="grid grid-cols-2 gap-2 text-[11px] text-teal-800 mt-1">
              <span>• CPC (1%): <strong>{{ formatCurrency(Math.round(tempPrice * 0.01)) }}</strong></span>
              <span>• Cost LP (3%): <strong>{{ formatCurrency(Math.round(tempPrice * 0.03)) }}</strong></span>
              <span>• CPR (25%): <strong>{{ formatCurrency(32000) }}</strong></span>
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
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useGrowthFlowStore } from '@/stores/growthFlowStore';
import { formatCurrency } from '@/utils/formatters';
import {
  FlaskConical,
  Tag,
  Table2,
  LayoutGrid,
  ChevronUp,
  ChevronDown,
  Edit2,
  CheckCircle,
  X
} from 'lucide-vue-next';

const store = useGrowthFlowStore();

const viewMode = ref('table'); // 'table' | 'cards'
const isCollapsed = ref(false);
const isPriceModalOpen = ref(false);
const tempPrice = ref(store.rdProductPrice || 123800);

const kpiList = computed(() => store.rdKpiList);

function openPriceModal() {
  tempPrice.value = store.rdProductPrice || 123800;
  isPriceModalOpen.value = true;
}

function saveNewPrice() {
  store.setRdProductPrice(tempPrice.value);
  isPriceModalOpen.value = false;
}
</script>
