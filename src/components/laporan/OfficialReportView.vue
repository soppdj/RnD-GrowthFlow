<template>
  <div class="space-y-6">
    <!-- Non-print Control Bar -->
    <div class="no-print glass-card rounded-2xl p-4 sm:p-5 border border-teal-100 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
      <div>
        <h2 class="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
          <FileText class="w-5 h-5 text-teal-600 shrink-0" />
          <span>Laporan Kinerja Resmi</span>
        </h2>
      </div>

      <div class="flex items-center gap-2 sm:gap-2.5 shrink-0 flex-nowrap">
        <!-- Opsi Filter Periode: Mingguan (W1-W5), Bulanan, Custom Tanggal -->
        <select
          v-model="selectedPeriod"
          class="px-3 py-2 rounded-xl border border-teal-200 bg-white text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-teal-400 cursor-pointer shadow-micro shrink-0"
        >
          <optgroup label="Laporan Mingguan">
            <option value="w-1">Minggu 1 (01 - 02 Okt 2026)</option>
            <option value="w-2">Minggu 2 (05 - 09 Okt 2026)</option>
            <option value="w-3">Minggu 3 (12 - 16 Okt 2026)</option>
            <option value="w-4">Minggu 4 (19 - 23 Okt 2026)</option>
            <option value="w-5">Minggu 5 (26 - 30 Okt 2026)</option>
          </optgroup>
          <optgroup label="Laporan Bulanan">
            <option value="oct-2026">Oktober 2026</option>
            <option value="sep-2026">September 2026</option>
            <option value="aug-2026">Agustus 2026</option>
            <option value="jul-2026">Juli 2026</option>
          </optgroup>
          <optgroup label="Kuartal & Rentang Kustom">
            <option value="q4-2026">Kuartal IV (Okt - Des 2026)</option>
            <option value="custom">Rentang Tanggal Kustom...</option>
            <option value="all">Semua Periode (Tahun 2026)</option>
          </optgroup>
        </select>

        <!-- Input Rentang Tanggal Kustom (Jika memilih opsi custom) -->
        <div v-if="selectedPeriod === 'custom'" class="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-teal-200 shadow-micro shrink-0">
          <span class="text-[11px] font-bold text-slate-500">Dari:</span>
          <input
            type="date"
            v-model="customStartDate"
            class="text-xs text-slate-700 font-semibold outline-none bg-transparent"
          />
          <span class="text-[11px] font-bold text-slate-400">-</span>
          <span class="text-[11px] font-bold text-slate-500">S/d:</span>
          <input
            type="date"
            v-model="customEndDate"
            class="text-xs text-slate-700 font-semibold outline-none bg-transparent"
          />
        </div>

        <!-- Print PDF Button -->
        <button
          @click="printDocument"
          class="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-soft transition-all active:scale-95 shrink-0 whitespace-nowrap cursor-pointer"
        >
          <Printer class="w-4 h-4" />
          <span>Simpan PDF</span>
        </button>
      </div>
    </div>

    <!-- Printable Official Document Paper (Presisi 1 Lembar A4: 210 x 297 mm) -->
    <div class="print-page a4-paper bg-white rounded-2xl p-6 sm:p-7 shadow-soft border border-slate-200/80 mx-auto text-slate-800 font-sans">
      
      <!-- KOP SURAT RESMI YAYASAN KHOIRUR ROOZIQIIN -->
      <div class="flex items-center justify-between gap-3 pb-3 border-b-4 border-double border-slate-800">
        <!-- Logo Yayasan (Official circular emblem) -->
        <img
          src="/logo-yayasan.png"
          alt="Logo Yayasan Khoirur Rooziqiin"
          class="w-16 h-16 sm:w-18 sm:h-18 object-contain shrink-0"
        />

        <!-- Foundation Text Info (Alamat & Legalitas Resmi) -->
        <div class="flex-1 text-center">
          <h1 class="text-lg sm:text-xl font-black tracking-wide text-slate-900 uppercase font-serif leading-tight">
            YAYASAN KHOIRUR ROOZIQIIN
          </h1>
          <p class="text-[11px] font-bold text-teal-800 tracking-wider uppercase mt-0.5">
            LEMBAGA PENGHIMPUNAN ZISWAF
          </p>
          <p class="text-[10px] font-semibold text-slate-700 mt-0.5">
            NPYP: AZ0613 &nbsp;|&nbsp; UPZ No: 027/SK-UPZ/BAZNAS-KBB/XI/2024
          </p>
          <p class="text-[10px] text-slate-600 mt-0.5 leading-snug">
            Jl. Raya Cimareme Rt.001 Rw.002 Desa Cimareme, Kec. Ngamprah, Kab. Bandung Barat
          </p>
        </div>

        <!-- Spacer to balance center alignment with logo on left -->
        <div class="w-16 sm:w-18 shrink-0 hidden sm:block"></div>
      </div>

      <!-- DOCUMENT METADATA (Satu Baris: Laporan • Periode • Tanggal Rilis) -->
      <div class="my-3 text-center">
        <div class="inline-flex items-center justify-center gap-x-2.5 text-[11px] text-slate-700 px-4 py-1 rounded-full bg-slate-100 border border-slate-200 font-medium whitespace-nowrap shadow-micro">
          <span><strong>Laporan:</strong> R&amp;D Digital Marketing</span>
          <span class="text-slate-400 font-bold">•</span>
          <span><strong>Periode:</strong> {{ periodLabel }}</span>
          <span class="text-slate-400 font-bold">•</span>
          <span><strong>Tanggal Rilis:</strong> {{ formatDate(new Date(), true) }}</span>
        </div>
      </div>

      <!-- I. CAPAIAN MATRIKS LOGFRAME (Rata Tinggi Horizontal & Teks Outcome Satu Baris) -->
      <div class="mb-3.5">
        <h3 class="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5 pb-1 border-b border-slate-200">
          <span class="w-1.5 h-1.5 rounded-full bg-teal-600"></span>
          <span>I. Capaian Matriks LogFrame</span>
        </h3>

        <!-- 4 Kotak dengan items-stretch, tinggi seragam & judul satu baris rata -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs items-stretch">
          <div class="p-2 sm:p-2.5 rounded-xl border border-indigo-200 bg-indigo-50/40 flex flex-col justify-between h-full min-h-[72px]">
            <span class="font-extrabold text-[9.5px] sm:text-[10px] text-indigo-800 block uppercase whitespace-nowrap truncate" title="GOAL (Dampak Utama)">
              GOAL (DAMPAK UTAMA)
            </span>
            <span class="text-base sm:text-lg font-black text-indigo-900 block my-0.5">{{ store.logFrameProgress.GOAL.percent }}%</span>
            <span class="text-[9.5px] text-slate-500 font-medium whitespace-nowrap truncate">{{ store.logFrameProgress.GOAL.completed }}/{{ store.logFrameProgress.GOAL.total }} Task Valid</span>
          </div>

          <div class="p-2 sm:p-2.5 rounded-xl border border-teal-200 bg-teal-50/40 flex flex-col justify-between h-full min-h-[72px]">
            <span class="font-extrabold text-[9.5px] sm:text-[10px] text-teal-800 block uppercase whitespace-nowrap truncate" title="OUTCOME (Hasil Strategis)">
              OUTCOME (HASIL STRATEGIS)
            </span>
            <span class="text-base sm:text-lg font-black text-teal-900 block my-0.5">{{ store.logFrameProgress.OUTCOME.percent }}%</span>
            <span class="text-[9.5px] text-slate-500 font-medium whitespace-nowrap truncate">{{ store.logFrameProgress.OUTCOME.completed }}/{{ store.logFrameProgress.OUTCOME.total }} Task Valid</span>
          </div>

          <div class="p-2 sm:p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/40 flex flex-col justify-between h-full min-h-[72px]">
            <span class="font-extrabold text-[9.5px] sm:text-[10px] text-emerald-800 block uppercase whitespace-nowrap truncate" title="OUTPUT (Deliverables)">
              OUTPUT (DELIVERABLES)
            </span>
            <span class="text-base sm:text-lg font-black text-emerald-900 block my-0.5">{{ store.logFrameProgress.OUTPUT.percent }}%</span>
            <span class="text-[9.5px] text-slate-500 font-medium whitespace-nowrap truncate">{{ store.logFrameProgress.OUTPUT.completed }}/{{ store.logFrameProgress.OUTPUT.total }} Deliverables</span>
          </div>

          <div class="p-2 sm:p-2.5 rounded-xl border border-amber-200 bg-amber-50/40 flex flex-col justify-between h-full min-h-[72px]">
            <span class="font-extrabold text-[9.5px] sm:text-[10px] text-amber-800 block uppercase whitespace-nowrap truncate" title="ACTIVITY (Aksi Taktis)">
              ACTIVITY (AKSI TAKTIS)
            </span>
            <span class="text-base sm:text-lg font-black text-amber-900 block my-0.5">{{ store.logFrameProgress.ACTIVITY.percent }}%</span>
            <span class="text-[9.5px] text-slate-500 font-medium whitespace-nowrap truncate">{{ store.logFrameProgress.ACTIVITY.completed }}/{{ store.logFrameProgress.ACTIVITY.total }} Aksi Jalan</span>
          </div>
        </div>
      </div>

      <!-- II. REKAPITULASI JURNAL & AGENDA KINERJA R&D (Menggantikan Tabel 9 KPI Iklan) -->
      <div class="mb-3.5">
        <div class="flex items-center justify-between pb-1 border-b border-slate-200 mb-2">
          <h3 class="text-[11px] font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-teal-600"></span>
            <span>II. Rekapitulasi Jurnal &amp; Agenda Kinerja R&amp;D</span>
          </h3>
          <span class="text-[10px] font-semibold text-slate-500">
            Urutan: 1. Selesai &bull; 2. On Progress &bull; 3. Belum Selesai ({{ sortedReportJournalTasks.length }} Agenda)
          </span>
        </div>

        <!-- Ringkasan Eksekutif KPI Donasi & Efisiensi Ringkas (1 Baris Ramping) -->
        <div class="grid grid-cols-4 gap-2 mb-2 text-xs">
          <div class="p-1.5 sm:p-2 rounded-lg bg-slate-50 border border-slate-200">
            <span class="text-[9px] text-slate-500 font-medium block truncate">Realisasi Donasi</span>
            <span class="text-xs sm:text-sm font-black text-slate-900 block truncate">
              {{ formatCurrency(store.kpiSummary.totalRevenue) }}
            </span>
            <span class="text-[9px] text-teal-700 font-semibold truncate block">
              {{ store.kpiSummary.targetAchievementPercent }}% Capaian Target
            </span>
          </div>

          <div class="p-1.5 sm:p-2 rounded-lg bg-slate-50 border border-slate-200">
            <span class="text-[9px] text-slate-500 font-medium block truncate">Belanja Iklan</span>
            <span class="text-xs sm:text-sm font-black text-slate-900 block truncate">
              {{ formatCurrency(store.kpiSummary.totalAdSpend) }}
            </span>
            <span class="text-[9px] text-slate-500 font-medium truncate block">
              Meta &amp; TikTok Ads
            </span>
          </div>

          <div class="p-1.5 sm:p-2 rounded-lg bg-slate-50 border border-slate-200">
            <span class="text-[9px] text-slate-500 font-medium block truncate">Efisiensi CPR</span>
            <span class="text-xs sm:text-sm font-black text-teal-800 block truncate">
              {{ formatCurrency(store.kpiSummary.overallCPR) }}
            </span>
            <span class="text-[9px] text-emerald-700 font-bold truncate block">
              Target &le; Rp 50.000
            </span>
          </div>

          <div class="p-1.5 sm:p-2 rounded-lg bg-slate-50 border border-slate-200">
            <span class="text-[9px] text-slate-500 font-medium block truncate">ROI Aktual</span>
            <span class="text-xs sm:text-sm font-black text-emerald-700 block truncate">
              {{ formatPercent(store.kpiSummary.overallROI) }}
            </span>
            <span class="text-[9px] text-emerald-600 font-semibold truncate block">
              Net Positif
            </span>
          </div>
        </div>

        <!-- Tabel Rekapitulasi Jurnal & Agenda (Urutan: Selesai -> On Progress -> Belum Selesai) -->
        <div class="border border-slate-300 rounded-xl overflow-hidden shadow-micro">
          <table class="w-full text-left text-xs border-collapse table-fixed">
            <colgroup>
              <col style="width: 28px" />
              <col style="width: 215px" />
              <col style="width: 72px" />
              <col style="width: 82px" />
              <col style="width: 86px" />
              <col />
            </colgroup>
            <thead class="bg-slate-100 border-b border-slate-300 font-bold text-[9.5px] uppercase text-slate-700">
              <tr>
                <th class="py-1.5 px-1 text-center border-r border-slate-300">NO</th>
                <th class="py-1.5 px-2 border-r border-slate-300">Aktivitas Jurnal / Agenda</th>
                <th class="py-1.5 px-1 text-center border-r border-slate-300">LogFrame</th>
                <th class="py-1.5 px-1 text-center border-r border-slate-300">Tanggal</th>
                <th class="py-1.5 px-1 text-center border-r border-slate-300">Status</th>
                <th class="py-1.5 px-2">Temuan &amp; Tindak Lanjut</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 text-[10px]">
              <tr
                v-for="(task, idx) in visibleReportJournalTasks"
                :key="task.id"
                class="hover:bg-slate-50/80 transition-colors"
                :class="task.reportStatus === 'Selesai' ? 'bg-emerald-50/15' : task.reportStatus === 'On Progress' ? 'bg-amber-50/20' : ''"
              >
                <!-- NO -->
                <td class="py-1 px-1 text-center font-bold text-slate-500 border-r border-slate-200 align-top">
                  {{ idx + 1 }}
                </td>

                <!-- AKTIVITAS JURNAL -->
                <td class="py-1 px-2 border-r border-slate-200 align-top">
                  <span class="font-bold text-slate-900 leading-tight block">
                    {{ task.title }}
                  </span>
                  <!-- Link Lampiran Kerja jika ada -->
                  <div v-if="task.attachments && task.attachments.length > 0" class="mt-0.5 flex flex-wrap gap-1">
                    <span
                      v-for="(att, aIdx) in task.attachments.slice(0, 1)"
                      :key="aIdx"
                      class="text-[8.5px] font-bold text-teal-800 bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200 inline-block truncate max-w-[190px]"
                    >
                      🔗 {{ att.title || 'Bukti Kerja' }}
                    </span>
                  </div>
                </td>

                <!-- KATEGORI LOGFRAME -->
                <td class="py-1 px-1 text-center border-r border-slate-200 align-top whitespace-nowrap">
                  <span
                    class="text-[8.5px] font-black px-1.5 py-0.5 rounded border block text-center"
                    :class="getLogFrameBadgeClass(task.category)"
                  >
                    {{ task.category }}
                  </span>
                </td>

                <!-- TANGGAL -->
                <td class="py-1 px-1 text-center border-r border-slate-200 text-slate-700 align-top whitespace-nowrap text-[9.5px]">
                  {{ formatDate(task.date) }}
                </td>

                <!-- STATUS (Selesai -> On Progress -> Belum Selesai) -->
                <td class="py-1 px-1 text-center border-r border-slate-200 align-top whitespace-nowrap">
                  <span
                    class="text-[9px] font-bold px-1.5 py-0.5 rounded border inline-block"
                    :class="task.statusBadgeClass"
                  >
                    {{ task.reportStatus }}
                  </span>
                </td>

                <!-- TEMUAN & TINDAK LANJUT -->
                <td class="py-1 px-2 text-slate-700 align-top leading-snug">
                  <div class="line-clamp-2">
                    <span v-if="task.evaluation" class="font-medium text-slate-800">
                      {{ task.evaluation }}
                    </span>
                    <span v-else-if="task.conclusion" class="font-medium text-slate-800">
                      {{ task.conclusion }}
                    </span>
                    <span v-else-if="task.notes" class="text-slate-600">
                      {{ task.notes }}
                    </span>
                    <span v-else-if="task.reportStatus === 'On Progress'" class="text-amber-700 italic">
                      Sedang berjalan intensif pada periode minggu ini.
                    </span>
                    <span v-else class="text-slate-400 italic">
                      Terjadwal sesuai rencana operasional tim R&amp;D.
                    </span>
                  </div>
                </td>
              </tr>

              <!-- Fallback jika tidak ada data di periode tertentu -->
              <tr v-if="visibleReportJournalTasks.length === 0">
                <td colspan="6" class="py-3 text-center text-slate-400 italic text-[11px]">
                  Tidak ada agenda jurnal yang tercatat pada rentang periode ini.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- III. REKOMENDASI SCALE-UP (RINGKAS & TEPAT SASARAN) -->
      <div class="mb-3">
        <div class="pb-1 border-b border-slate-200 mb-1.5 flex items-center justify-between">
          <h3 class="text-[11px] font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            <span>III. Rekomendasi Scale-Up Ad Lab</span>
          </h3>
          <span class="text-[9.5px] text-slate-500 font-medium">
            Diurutkan berdasarkan ROI aktual tertinggi
          </span>
        </div>

        <!-- Table Scale-Up Ringkas (Top 2-3 Kampanye agar muat 1 Halaman A4) -->
        <div class="border border-slate-200 rounded-xl overflow-hidden shadow-micro">
          <table class="w-full text-left text-xs border-collapse table-fixed">
            <colgroup>
              <col style="width: 28px" />
              <col style="width: 130px" />
              <col style="width: 58px" />
              <col style="width: 68px" />
              <col style="width: 78px" />
              <col style="width: 65px" />
              <col style="width: 68px" />
              <col />
            </colgroup>
            <thead class="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold text-[9px] uppercase">
              <tr>
                <th class="py-1 px-1 text-center">Rank</th>
                <th class="py-1 px-1.5">Kampanye</th>
                <th class="py-1 px-1 text-center">Stage</th>
                <th class="py-1 px-1 text-right whitespace-nowrap">Spend</th>
                <th class="py-1 px-1 text-right whitespace-nowrap">Realisasi</th>
                <th class="py-1 px-1 text-right whitespace-nowrap">CPR</th>
                <th class="py-1 px-1 text-right whitespace-nowrap">ROI</th>
                <th class="py-1 px-1.5 text-left">Rekomendasi Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-[10px]">
              <tr
                v-for="(camp, idx) in topScaleRecommendations"
                :key="camp.id"
                class="hover:bg-slate-50/80 transition-colors"
                :class="idx === 0 ? 'bg-emerald-50/30' : ''"
              >
                <td class="py-1 px-1 text-center font-bold text-slate-500">
                  <span
                    class="w-3.5 h-3.5 rounded-full inline-flex items-center justify-center text-[8.5px]"
                    :class="idx === 0 ? 'bg-amber-100 text-amber-800 font-extrabold' : 'bg-slate-100 text-slate-700'"
                  >
                    #{{ idx + 1 }}
                  </span>
                </td>
                <td class="py-1 px-1.5">
                  <span class="font-bold text-slate-800 block truncate" :title="camp.name">
                    {{ formatCampaignName(camp.name) }}
                  </span>
                  <span class="text-[8.5px] text-slate-400 block truncate">
                    {{ camp.platform || 'Meta Ads' }}
                  </span>
                </td>
                <td class="py-1 px-1 text-center">
                  <span class="text-[8px] font-bold px-1 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200 whitespace-nowrap">
                    {{ camp.stage }}
                  </span>
                </td>
                <td class="py-1 px-1 text-right text-slate-600 whitespace-nowrap">
                  {{ formatCurrency(camp.adSpend) }}
                </td>
                <td class="py-1 px-1 text-right font-black text-slate-900 whitespace-nowrap">
                  {{ formatCurrency(camp.revenue) }}
                </td>
                <td class="py-1 px-1 text-right whitespace-nowrap">
                  <span class="font-bold" :class="camp.cpr <= 25000 ? 'text-emerald-700' : 'text-slate-700'">
                    {{ formatCurrency(camp.cpr) }}
                  </span>
                </td>
                <td class="py-1 px-1 text-right whitespace-nowrap">
                  <span
                    class="font-black px-1 py-0.2 rounded text-[9.5px]"
                    :class="camp.roi >= 400 ? 'text-emerald-800 bg-emerald-100/80' : 'text-slate-800'"
                  >
                    {{ formatPercent(camp.roi) }}
                  </span>
                </td>
                <td class="py-1 px-1.5">
                  <div class="space-y-0.2">
                    <span
                      class="inline-block px-1 py-0.2 rounded text-[8.5px] border font-bold"
                      :class="camp.recBadge"
                    >
                      {{ camp.recommendation }}
                    </span>
                    <p class="text-[9px] text-slate-600 truncate max-w-[210px]">
                      {{ camp.actionText }}
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- IV. CATATAN EVALUASI & TEMUAN LAPANGAN (RINGKAS) -->
      <div class="mb-3">
        <h3 class="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-1.5 flex items-center gap-1.5 pb-1 border-b border-slate-200">
          <span class="w-1.5 h-1.5 rounded-full bg-teal-600"></span>
          <span>IV. Catatan Evaluasi Eksperimen &amp; Temuan Lapangan</span>
        </h3>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px]">
          <div
            v-for="log in store.journalLogs.slice(0, 2)"
            :key="log.id"
            class="p-2 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5"
          >
            <div class="flex items-center justify-between text-slate-800 font-bold">
              <span class="truncate">{{ log.focus }}</span>
              <span class="text-[9px] text-slate-400 font-normal shrink-0 ml-1">{{ formatDate(log.date) }}</span>
            </div>
            <p class="text-slate-600 leading-snug line-clamp-2">
              <strong class="text-slate-800">Temuan:</strong> {{ log.evaluation }}
            </p>
            <p class="text-slate-600 leading-snug line-clamp-1">
              <strong class="text-slate-800">Tindak Lanjut:</strong> {{ log.nextSteps }}
            </p>
          </div>
        </div>
      </div>

      <!-- TANDA TANGAN & PENGESAHAN DOKUMEN (Pindah ke Kanan, Ramping) -->
      <div class="pt-3 border-t border-slate-200 flex justify-end text-xs text-center">
        <div class="w-56">
          <p class="text-slate-500 font-semibold text-[10px]">Diajukan &amp; Disusun Oleh,</p>
          <div class="h-10 sm:h-12 flex items-end justify-center">
            <!-- Ruang tanda tangan / paraf -->
          </div>
          <p class="font-bold text-slate-900 border-t border-slate-400 pt-1 mt-0.5 inline-block min-w-[160px] text-[11px]">
            {{ store.profile.fullName }}
          </p>
          <p class="text-[10px] text-slate-500">{{ store.profile.role }}</p>
        </div>
      </div>

      <!-- Footer Info (Di Kanan Bawah Sesuai Referensi Gambar) -->
      <div class="mt-3 pt-2 border-t border-slate-100 flex items-center justify-end text-[9px] text-slate-400">
        <span>R&amp;D GrowthFlow Platform &bull; Yayasan Khoirur Rooziqiin &copy; 2026</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useGrowthFlowStore } from '@/stores/growthFlowStore';
import {
  formatCurrency,
  formatPercent,
  formatDate,
  getWeekOfMonth,
  LOGFRAME_TYPES
} from '@/utils/formatters';
import { FileText, Printer } from 'lucide-vue-next';

const store = useGrowthFlowStore();
const selectedPeriod = ref('oct-2026');
const customStartDate = ref('2026-10-01');
const customEndDate = ref('2026-10-31');

const periodLabel = computed(() => {
  if (selectedPeriod.value === 'w-1') return 'Minggu 1 (01 - 02 Okt 2026)';
  if (selectedPeriod.value === 'w-2') return 'Minggu 2 (05 - 09 Okt 2026)';
  if (selectedPeriod.value === 'w-3') return 'Minggu 3 (12 - 16 Okt 2026)';
  if (selectedPeriod.value === 'w-4') return 'Minggu 4 (19 - 23 Okt 2026)';
  if (selectedPeriod.value === 'w-5') return 'Minggu 5 (26 - 30 Okt 2026)';

  if (selectedPeriod.value === 'custom') {
    return `${formatDate(customStartDate.value)} s/d ${formatDate(customEndDate.value)}`;
  }

  const map = {
    'oct-2026': 'Oktober 2026',
    'sep-2026': 'September 2026',
    'aug-2026': 'Agustus 2026',
    'jul-2026': 'Juli 2026',
    'q4-2026': 'Kuartal IV (Okt - Des 2026)',
    'all': 'Semua Periode 2026'
  };
  return map[selectedPeriod.value] || 'Oktober 2026';
});

function getLogFrameBadgeClass(category) {
  const c = String(category || '').toUpperCase();
  if (c === 'GOAL') return 'bg-indigo-50 text-indigo-700 border-indigo-200';
  if (c === 'OUTCOME') return 'bg-teal-50 text-teal-700 border-teal-200';
  if (c === 'OUTPUT') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  return 'bg-amber-50 text-amber-700 border-amber-200';
}

function formatCampaignName(name) {
  if (!name) return 'Kampanye';
  const str = String(name).trim();
  const match = str.match(/"([^"]+)"/);
  if (match && match[1]) {
    return match[1].trim();
  }
  if (str.includes(',')) {
    const parts = str.split(',');
    const candidate = parts.find(p => {
      const clean = p.trim().replace(/^["']|["']$/g, '');
      return clean.length > 3 && !/^\d{4}-\d{2}-\d{2}$/.test(clean) && isNaN(Number(clean)) && !clean.startsWith('active') && !clean.startsWith('actions:');
    });
    if (candidate) return candidate.trim().replace(/^["']|["']$/g, '');
  }
  return str;
}

// 1. REKAPITULASI JURNAL & AGENDA (Filter Sesuai Periode & Urut Status: Selesai -> On Progress -> Belum Selesai)
const sortedReportJournalTasks = computed(() => {
  // Ambil seluruh tugas jurnal dari store
  const tasks = [...store.tasks].map(t => {
    let reportStatus = 'Belum Selesai';
    let statusBadgeClass = 'bg-slate-100 text-slate-600 border-slate-300';
    let sortPriority = 3; // 1 = Selesai, 2 = On Progress, 3 = Belum Selesai

    if (t.completed || t.status === 'Done') {
      reportStatus = 'Selesai';
      statusBadgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold';
      sortPriority = 1;
    } else if (t.status === 'In Progress' || t.status === 'ON_PROGRESS' || (t.progressPercent && t.progressPercent > 0)) {
      reportStatus = 'On Progress';
      statusBadgeClass = 'bg-amber-100 text-amber-800 border-amber-300 font-bold';
      sortPriority = 2;
    } else {
      reportStatus = 'Belum Selesai';
      statusBadgeClass = 'bg-slate-100 text-slate-600 border-slate-200 font-semibold';
      sortPriority = 3;
    }

    return {
      ...t,
      reportStatus,
      statusBadgeClass,
      sortPriority
    };
  });

  // Filter berdasarkan selectedPeriod
  const filtered = tasks.filter(t => {
    if (!t.date) return true;

    // Filter per minggu
    if (selectedPeriod.value.startsWith('w-')) {
      const targetWeek = selectedPeriod.value.replace('w-', '');
      const taskWeek = getWeekOfMonth(t.date);
      return String(taskWeek) === String(targetWeek);
    }

    // Filter Custom Range
    if (selectedPeriod.value === 'custom') {
      if (customStartDate.value && t.date < customStartDate.value) return false;
      if (customEndDate.value && t.date > customEndDate.value) return false;
      return true;
    }

    // Filter Bulanan
    if (selectedPeriod.value === 'oct-2026') return t.date.startsWith('2026-10');
    if (selectedPeriod.value === 'sep-2026') return t.date.startsWith('2026-09');
    if (selectedPeriod.value === 'aug-2026') return t.date.startsWith('2026-08');
    if (selectedPeriod.value === 'jul-2026') return t.date.startsWith('2026-07');
    if (selectedPeriod.value === 'q4-2026') {
      return t.date.startsWith('2026-10') || t.date.startsWith('2026-11') || t.date.startsWith('2026-12');
    }

    return true; // 'all'
  });

  // Urutan data WAJIB: 1. Sudah Selesai, 2. On Progress, 3. Belum Selesai
  return filtered.sort((a, b) => {
    if (a.sortPriority !== b.sortPriority) {
      return a.sortPriority - b.sortPriority;
    }
    // Jika status sama, urutkan berdasarkan tanggal
    return new Date(a.date || 0) - new Date(b.date || 0);
  });
});

// Batasi tampilan maksimal 6 agenda teratas jika tampilan bulanan agar muat presisi 1 lembar A4
const visibleReportJournalTasks = computed(() => {
  if (selectedPeriod.value.startsWith('w-')) {
    // Mode mingguan tampilkan seluruh agenda minggu tersebut (biasanya 2-5 task)
    return sortedReportJournalTasks.value;
  }
  // Mode bulanan tampilkan 6 task prioritas tertinggi agar presisi dalam 1 halaman A4
  return sortedReportJournalTasks.value.slice(0, 6);
});

// 2. REKOMENDASI SCALE-UP (Top 3 Kampanye ROI Tertinggi)
const topScaleRecommendations = computed(() => {
  return [...store.campaigns]
    .map(c => {
      const cpr = c.newDonors > 0 ? Math.round(c.adSpend / c.newDonors) : 0;
      const roi = c.adSpend > 0 ? ((c.revenue - c.adSpend) / c.adSpend) * 100 : 0;

      let recommendation = 'Tahan Anggaran';
      let recBadge = 'bg-slate-100 text-slate-700 border-slate-200';
      let actionText = 'Biarkan berjalan stabil, pantau rasio konversi';

      if (c.stage === 'SCALE_2' && roi >= 400) {
        recommendation = 'Injeksi +50%';
        recBadge = 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold';
        actionText = 'Injeksi anggaran ekstra & pertahankan CPR';
      } else if (c.stage === 'SCALE_1' && roi >= 300) {
        recommendation = 'Promosi SCALE 2';
        recBadge = 'bg-teal-100 text-teal-800 border-teal-300 font-bold';
        actionText = 'Naikkan budget 20% & duplikasi audience';
      } else if (c.stage === 'TEST' && roi >= 200) {
        recommendation = 'Lolos ke SCALE 1';
        recBadge = 'bg-indigo-100 text-indigo-800 border-indigo-300 font-bold';
        actionText = 'Pindahkan ke scale, uji lookalike 2%';
      } else if (roi < 0 || (cpr > 50000 && c.newDonors > 0)) {
        recommendation = 'Evaluasi/Matikan';
        recBadge = 'bg-rose-100 text-rose-800 border-rose-300 font-bold';
        actionText = 'Matikan adset boncos, revisi materi visual';
      } else if (roi >= 200) {
        recommendation = 'Scale Bertahap';
        recBadge = 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold';
        actionText = 'Naikkan budget 20% per hari, jaga CPR';
      }

      if (c.notes && c.notes.length > 5) {
        actionText = c.notes;
      }

      return {
        ...c,
        cpr,
        roi,
        recommendation,
        recBadge,
        actionText
      };
    })
    .sort((a, b) => b.roi - a.roi)
    .slice(0, 3); // Ambil top 3 agar muat 1 halaman A4
});

function printDocument() {
  window.print();
}
</script>

<style scoped>
/* A4 Dimensions (210 x 297 mm) for Screen Preview */
.a4-paper {
  max-width: 210mm;
  width: 100%;
  min-height: 297mm;
  box-sizing: border-box;
}

@media print {
  @page {
    size: A4 portrait;
    margin: 6mm 8mm 6mm 8mm;
  }

  body {
    background: white !important;
    color: black !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .no-print {
    display: none !important;
  }

  .a4-paper,
  .print-page {
    max-width: 100% !important;
    width: 100% !important;
    min-height: auto !important;
    box-shadow: none !important;
    border: none !important;
    padding: 0 !important;
    margin: 0 !important;
    border-radius: 0 !important;
  }

  table {
    page-break-inside: avoid !important;
  }

  tr,
  .avoid-page-break {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }
}
</style>
