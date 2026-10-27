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
                Standar KPI Ads
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

          <!-- View Mode Toggle -->
          <div class="flex items-center p-0.5 rounded-xl bg-teal-100/70 border border-teal-200/80 text-xs font-bold">
            <button
              @click="viewMode = 'vertical'"
              class="flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all"
              :class="viewMode === 'vertical' ? 'bg-white text-teal-900 shadow-micro font-extrabold' : 'text-slate-600 hover:text-slate-900'"
              title="Formasi KPI Vertikal Ke Bawah"
            >
              <ArrowDownNarrowWide class="w-3.5 h-3.5 text-teal-700" />
              <span>Formasi Ke Bawah</span>
            </button>
            <button
              @click="viewMode = 'table'"
              class="flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all"
              :class="viewMode === 'table' ? 'bg-white text-teal-900 shadow-micro font-extrabold' : 'text-slate-600 hover:text-slate-900'"
              title="Tabel SOP Lengkap (9 KPI)"
            >
              <Table2 class="w-3.5 h-3.5 text-teal-700" />
              <span>Tabel SOP (9 KPI)</span>
            </button>
          </div>

          <!-- Collapse / Expand Button -->
          <button
            @click="isCollapsed = !isCollapsed"
            class="p-1.5 rounded-xl text-slate-500 hover:text-teal-800 hover:bg-teal-100/50 transition-colors"
            :title="isCollapsed ? 'Buka Standar KPI Ads' : 'Sembunyikan/Kecilkan'"
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
            <span class="px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 font-extrabold text-[11px] border border-blue-200">{{ getMetricTarget('cpc') }}</span>
          </span>
          <span class="inline-flex items-center gap-1">
            <span class="font-bold text-slate-700">Target Cost LPV:</span>
            <span class="px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 font-extrabold text-[11px] border border-blue-200">{{ getMetricTarget('cost_lpv') }}</span>
          </span>
          <span class="inline-flex items-center gap-1">
            <span class="font-bold text-slate-700">Target CPM:</span>
            <span class="px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 font-extrabold text-[11px] border border-blue-200">Rp 32.000</span>
          </span>
          <span class="inline-flex items-center gap-1">
            <span class="font-bold text-slate-700">Target CTR:</span>
            <span class="px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 font-extrabold text-[11px] border border-blue-200">diatas 2%</span>
          </span>
          <span class="inline-flex items-center gap-1">
            <span class="font-bold text-slate-700">Target CPR:</span>
            <span class="px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 font-extrabold text-[11px] border border-blue-200">{{ getMetricTarget('cpr') }}</span>
          </span>
          <span class="inline-flex items-center gap-1">
            <span class="font-bold text-slate-700">Target Closing CS:</span>
            <span class="px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 font-extrabold text-[11px] border border-blue-200">82%</span>
          </span>
          <span class="inline-flex items-center gap-1">
            <span class="font-bold text-slate-700">LC to LPV:</span>
            <span class="px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 font-extrabold text-[11px] border border-blue-200">80%</span>
          </span>
          <span class="inline-flex items-center gap-1">
            <span class="font-bold text-slate-700">LPV to ATC:</span>
            <span class="px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 font-extrabold text-[11px] border border-blue-200">40%</span>
          </span>
          <span class="inline-flex items-center gap-1">
            <span class="font-bold text-slate-700">ATC to IC:</span>
            <span class="px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 font-extrabold text-[11px] border border-blue-200">30%</span>
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
              <th scope="col" class="py-3 px-3 w-12 text-center border-r border-teal-600/50">NO</th>
              <th scope="col" class="py-3 px-4 w-44 border-r border-teal-600/50">KPI METRIC</th>
              <th scope="col" class="py-3 px-4 w-40 border-r border-teal-600/50">TARGET KPI</th>
              <th scope="col" class="py-3 px-4 w-40 border-r border-teal-600/50">HARGA JUAL</th>
              <th scope="col" class="py-3 px-4 w-36 text-center bg-blue-600 text-white border-r border-blue-500 shadow-inner">
                ACTUAL TARGET KPI
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

              <!-- 4. Harga Jual (Interactive click to edit) -->
              <td
                class="py-3.5 px-4 text-slate-600 border-r border-slate-100 transition-colors"
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

              <!-- 5. Actual Target KPI (Highlighted in blue like Excel image, auto-calculated) -->
              <td class="py-3.5 px-4 text-center font-black border-r border-blue-100 bg-blue-50/70 text-blue-900 text-sm">
                <span class="px-2.5 py-1 rounded-lg bg-blue-100/90 border border-blue-200 block shadow-micro tracking-tight">
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

                  <template v-else-if="item.id === 'lc_to_lpv'">
                    <p class="flex items-center gap-1.5 text-slate-700 font-semibold">
                      <span class="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0"></span>
                      <span>Jika kurang, optimasi landing page agar lebih cepat</span>
                    </p>
                  </template>

                  <template v-else-if="item.id === 'lpv_to_atc'">
                    <p class="flex items-center gap-1.5 text-slate-700 font-semibold">
                      <span class="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0"></span>
                      <span>Gunakan hypno writing di landingpage</span>
                    </p>
                  </template>

                  <template v-else-if="item.id === 'atc_to_ic'">
                    <p class="flex items-center gap-1.5 text-slate-700 font-semibold">
                      <span class="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0"></span>
                      <span>Beri penawaran menarik</span>
                    </p>
                  </template>

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

      <!-- VIEW 2: FORMASI KE BAWAH (KARTU VERTIKAL & ALUR FUNNEL MENURUN) -->
      <div v-else class="space-y-3 max-w-4xl mx-auto">
        <div
          v-for="(item, idx) in kpiList"
          :key="item.no"
          class="relative"
        >
          <!-- Downward Funnel Connector Indicator between cards -->
          <div
            v-if="idx < kpiList.length - 1"
            class="flex items-center justify-center -my-1.5 relative z-0"
          >
            <div class="w-5 h-5 rounded-full bg-teal-100/90 text-teal-700 flex items-center justify-center text-[10px] font-bold border border-teal-200 shadow-micro">
              <ArrowDown class="w-3 h-3" />
            </div>
          </div>

          <!-- Vertical Card Item -->
          <div class="relative z-10 p-4 rounded-2xl bg-white border border-teal-100/90 shadow-micro hover:border-teal-300 hover:shadow-soft transition-all space-y-3">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <!-- Left: Metric Badge, Name, Formula & Price -->
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-200 text-teal-800 font-black flex items-center justify-center text-xs shadow-micro shrink-0">
                  #{{ item.no }}
                </div>
                <div>
                  <div class="flex flex-wrap items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <h4 class="text-sm sm:text-base font-extrabold text-slate-800 tracking-tight">{{ item.metric }}</h4>
                    <span v-if="item.funnelPhase" class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                      {{ item.funnelPhase }}
                    </span>
                  </div>
                  <div class="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span>Target Formula: <strong class="text-slate-700 font-semibold">{{ item.targetKpi }}</strong></span>
                    <span v-if="item.hasProductPrice" class="text-slate-300">•</span>
                    <span v-if="item.hasProductPrice" class="inline-flex items-center gap-1 cursor-pointer text-teal-800 hover:underline" @click="openPriceModal" title="Klik untuk ubah harga jual">
                      <span>Harga: <strong>{{ item.productPriceFormatted || formatCurrency(store.rdProductPrice) }}</strong></span>
                      <Edit2 class="w-2.5 h-2.5 text-teal-600" />
                    </span>
                  </div>
                </div>
              </div>

              <!-- Right: Actual Target KPI (Blue High-Contrast Badge) -->
              <div class="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <div class="text-left sm:text-right">
                  <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Actual Target KPI</span>
                  <span class="inline-block px-3 py-1 rounded-xl bg-blue-100/90 text-blue-900 border border-blue-200 font-black text-sm tracking-tight shadow-micro">
                    {{ item.actualTargetFormatted }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Bottom: Aksi Bila Tidak Tercapai (Curative Action) -->
            <div class="p-2.5 sm:p-3 rounded-xl bg-slate-50/90 border border-slate-200/80 text-xs">
              <div class="flex flex-col sm:flex-row sm:items-start gap-1.5 sm:gap-2">
                <span class="text-[11px] font-bold text-rose-700 uppercase tracking-wider shrink-0 flex items-center gap-1">
                  <AlertCircle class="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span>Aksi Bila Kurang / Tidak Tercapai:</span>
                </span>
                <div class="text-slate-700 font-medium flex-1">
                  <template v-if="item.id === 'cpc'">
                    <span class="inline-flex items-center gap-1 mr-3 text-slate-700"><span class="w-1.5 h-1.5 rounded-full bg-rose-400"></span> perbaiki konten</span>
                    <span class="inline-flex items-center gap-1 text-slate-700"><span class="w-1.5 h-1.5 rounded-full bg-rose-400"></span> tambah konten baru</span>
                  </template>
                  <template v-else-if="item.id === 'cost_lpv'">
                    <span class="inline-flex items-center gap-1 mr-3 text-slate-700"><span class="w-1.5 h-1.5 rounded-full bg-rose-400"></span> perbaiki kecepatan LP</span>
                    <span class="inline-flex items-center gap-1 text-slate-700"><span class="w-1.5 h-1.5 rounded-full bg-rose-400"></span> pake lazyload, website booster</span>
                  </template>
                  <template v-else-if="item.id === 'cpm'">
                    <span class="text-rose-800 font-semibold bg-rose-100/60 px-2 py-0.5 rounded border border-rose-200">
                      tunggu 2-3 hari / masih jelek kill
                    </span>
                  </template>
                  <template v-else-if="item.id === 'ctr'">
                    <span class="font-semibold text-slate-800">bikin konten yang lebih menarik (komen, share, like)</span>
                    <span class="text-slate-500 text-[11px] block mt-0.5">• Ciri-ciri: 1. kualitas 4K, 2. Informatif, 3. Menarik, 4. Lucu/humor</span>
                  </template>
                  <template v-else-if="item.id === 'cpr'">
                    <span class="font-bold text-slate-800">Perbaiki Website:</span>
                    <span class="text-slate-600 text-[11px] block mt-0.5">1. Desain website pro • 2. Offer (penawaran : bonus) • 3. Harga coba turunin jika &lt; 1 pekan • 4. Persingkat tampilan web</span>
                  </template>
                  <template v-else-if="item.id === 'closing_rate'">
                    <span class="text-slate-700 text-[11px]">1. Edukasi CS (IHT, WS) • 2. Bonus Organik perbesar nilainya</span>
                  </template>
                  <template v-else-if="item.id === 'lc_to_lpv'">
                    <span class="font-bold text-teal-900 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      Jika kurang, optimasi landing page agar lebih cepat
                    </span>
                  </template>
                  <template v-else-if="item.id === 'lpv_to_atc'">
                    <span class="font-bold text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                      Gunakan hypno writing di landingpage
                    </span>
                  </template>
                  <template v-else-if="item.id === 'atc_to_ic'">
                    <span class="font-bold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Beri penawaran menarik
                    </span>
                  </template>
                  <template v-else>
                    <span v-for="(act, aIdx) in item.actions" :key="aIdx" class="mr-2">
                      {{ act }}
                    </span>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
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
  Table2,
  ArrowDownNarrowWide,
  ArrowDown,
  AlertCircle,
  ChevronUp,
  ChevronDown,
  Edit2,
  CheckCircle,
  FileSpreadsheet,
  X
} from 'lucide-vue-next';

const store = useGrowthFlowStore();

const viewMode = ref('vertical'); // 'vertical' (formasi ke bawah) | 'table' (tabel SOP)
const isCollapsed = ref(false);
const isPriceModalOpen = ref(false);
const isEvaluatorModalOpen = ref(false);
const tempPrice = ref(store.rdProductPrice || 50000);

const kpiList = computed(() => store.rdKpiList);

function getMetricTarget(id) {
  const item = (kpiList.value || []).find(k => k.id === id);
  return item ? item.actualTargetFormatted : '';
}

function openPriceModal() {
  tempPrice.value = store.rdProductPrice || 50000;
  isPriceModalOpen.value = true;
}

function saveNewPrice() {
  store.setRdProductPrice(tempPrice.value);
  isPriceModalOpen.value = false;
}
</script>
