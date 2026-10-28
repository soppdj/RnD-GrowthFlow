<template>
  <div class="space-y-6">
    <!-- Header with Quick Action & Counters -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
          <span>Jurnal Harian R&D</span>
          <span class="text-xs px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 font-semibold border border-teal-200">
            {{ completedCount }}/{{ totalCount }} Selesai
          </span>
        </h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Tracking aktivitas harian, capaian tugas, dan evaluasi hasil kerja R&D
        </p>
      </div>

      <div class="flex items-center gap-2 flex-wrap">
        <button
          @click="openCreateModal"
          class="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-soft transition-all active:scale-95 shrink-0 cursor-pointer"
        >
          <Plus class="w-4 h-4" />
          <span>Tambah Task Jurnal</span>
        </button>
      </div>
    </div>

    <!-- FILTER & PENGATURAN MINGGU KERJA & HARI KERJA (Tanpa Scroll, Senin-Jumat, Input Manual) -->
    <div class="glass-card rounded-2xl p-4 sm:p-5 border border-teal-100 shadow-soft space-y-3.5">
      <!-- Row 1: Week Selector Tabs (Sesuai Referensi Gambar: 1 Baris Ramping) & Work Days Settings -->
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-teal-100/70">
        <!-- Week Tabs (Semua, Minggu 1, Minggu 2, Minggu 3, Minggu 4, Minggu 5) -->
        <div class="flex items-center gap-1.5 overflow-x-auto sm:overflow-visible flex-nowrap sm:flex-wrap">
          <button
            v-for="tab in weekTabs"
            :key="tab.value"
            @click="selectedWeek = tab.value; customDateFilter = ''"
            class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-micro whitespace-nowrap shrink-0"
            :class="selectedWeek === tab.value && !customDateFilter
              ? 'bg-teal-600 text-white shadow-sm ring-2 ring-teal-200'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800'"
            :title="`Filter ${tab.label}`"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- Opsi Hari Kerja: Sesuai Referensi Gambar (Hari Kerja: [ 3 ] Hari/Minggu) -->
        <div class="flex items-center gap-2 self-start lg:self-auto shrink-0 bg-teal-50/80 px-3 py-1.5 rounded-xl border border-teal-200/80">
          <Briefcase class="w-4 h-4 text-teal-700 shrink-0" />
          <span class="text-xs font-bold text-teal-900 shrink-0">Hari Kerja:</span>

          <!-- Input Manual Jumlah Hari Kerja Efektif -->
          <div class="flex items-center gap-1 bg-white border border-teal-300 px-2 py-0.5 rounded-lg text-xs shadow-micro" title="Ketik jumlah hari efektif per minggu (1 - 7)">
            <input
              type="number"
              min="1"
              max="7"
              v-model.number="workDaysPerWeek"
              @input="handleWorkDaysChange"
              class="w-8 text-center font-extrabold text-teal-900 outline-none text-xs"
            />
            <span class="text-[11px] text-teal-700 font-bold">Hari/Minggu</span>
          </div>
        </div>
      </div>

      <!-- Row 2: Custom Date Picker & Category Filter -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div class="flex items-center gap-2 flex-wrap">
          <!-- Custom Date Input -->
          <div class="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 shadow-micro">
            <span class="text-[11px] font-bold text-slate-600 uppercase">📅 Custom Tanggal:</span>
            <input
              type="date"
              v-model="customDateFilter"
              class="text-xs font-semibold text-slate-700 outline-none bg-transparent cursor-pointer"
            />
            <button
              v-if="customDateFilter"
              @click="customDateFilter = ''"
              class="p-0.5 rounded hover:bg-slate-100 text-slate-400 hover:text-rose-600"
              title="Reset Tanggal"
            >
              <X class="w-3.5 h-3.5" />
            </button>
          </div>

          <!-- Active Filter Badge -->
          <span
            v-if="customDateFilter"
            class="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 font-bold border border-teal-200 text-[11px]"
          >
            Filter Aktif: {{ formatDate(customDateFilter, true) }}
          </span>
        </div>

        <!-- Filter LogFrame Category -->
        <div class="flex items-center gap-2">
          <span class="text-[11px] font-bold text-slate-500 uppercase">Kategori:</span>
          <select
            v-model="selectedCategory"
            class="px-3 py-1.5 rounded-xl border border-teal-200 bg-white text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-teal-300"
          >
            <option value="ALL">Semua Kategori (LogFrame)</option>
            <option value="GOAL">GOAL (Dampak Utama)</option>
            <option value="OUTCOME">OUTCOME (Hasil Strategis)</option>
            <option value="OUTPUT">OUTPUT (Deliverables)</option>
            <option value="ACTIVITY">ACTIVITY (Aktivitas Taktis)</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Tasks Checklist Grid -->
    <div class="space-y-3">
      <div
        v-for="task in filteredTasks"
        :key="task.id"
        class="glass-card rounded-2xl p-4 sm:p-5 border transition-all duration-200 flex flex-col gap-3"
        :class="task.completed 
          ? 'bg-emerald-50/30 border-emerald-200/80 shadow-micro' 
          : 'border-teal-100 hover:border-teal-300 shadow-soft bg-white'"
      >
        <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <!-- Left: Checkbox & Main Info -->
          <div class="flex items-start gap-3.5 flex-1">
            <!-- Checkbox with Evaluation Trigger -->
            <button
              type="button"
              @click="handleCheckboxClick(task, $event)"
              class="mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 shrink-0 cursor-pointer active:scale-90"
              :class="task.completed 
                ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm ring-2 ring-emerald-200' 
                : 'border-slate-300 bg-white hover:border-teal-500'"
              :aria-label="task.completed ? 'Batalkan selesai' : 'Tandai selesai & evaluasi'"
              title="Tandai Selesai (Buka Modal Evaluasi)"
            >
              <Check v-if="task.completed" class="w-4 h-4 stroke-[3]" />
            </button>

            <!-- Task Info -->
            <div class="space-y-1.5 flex-1">
              <!-- Tanggal Jurnal & Metadata Badges -->
              <div class="flex flex-wrap items-center gap-2">
                <!-- TANGGAL JURNAL (Jelas & Prominen Sesuai Perintah Gambar) -->
                <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-extrabold bg-teal-50 border border-teal-200 text-teal-900 shadow-micro">
                  <Calendar class="w-3.5 h-3.5 text-teal-600" />
                  <span>{{ formatJournalDate(task.date) }}</span>
                </span>

                <!-- LogFrame Badge -->
                <span
                  class="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase border"
                  :class="getLogFrameBadgeClass(task.category)"
                >
                  {{ task.category }}
                </span>

                <!-- Priority Badge -->
                <span
                  class="text-[10px] font-bold px-1.5 py-0.5 rounded"
                  :class="task.priority === 'HIGH' 
                    ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                    : task.priority === 'MEDIUM' 
                      ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                      : 'bg-slate-50 text-slate-600 border border-slate-200'"
                >
                  {{ task.priority }}
                </span>

                <span class="text-xs text-slate-400 font-medium flex items-center gap-1">
                  <Clock class="w-3 h-3" />
                  {{ task.estimatedHours }} Jam
                </span>

                <!-- Status Kerja Badge (Hari Kerja vs Weekend) -->
                <span
                  v-if="!isWorkDay(task.date, workDaysPerWeek)"
                  class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200"
                  title="Di luar hari kerja reguler yang diatur"
                >
                  Non-Hari Kerja (Weekend)
                </span>
              </div>

              <!-- Title -->
              <p
                class="text-sm font-semibold transition-colors leading-relaxed"
                :class="task.completed ? 'text-slate-700' : 'text-slate-900'"
              >
                {{ task.title }}
              </p>

              <!-- Notes / Findings -->
              <p v-if="task.notes && !task.evaluation" class="text-xs text-slate-500 italic">
                "{{ task.notes }}"
              </p>

              <!-- Attachments / Link Hasil Kerja -->
              <div v-if="getTaskLinks(task).length > 0" class="flex flex-wrap items-center gap-1.5 pt-0.5">
                <a
                  v-for="(link, idx) in getTaskLinks(task)"
                  :key="idx"
                  :href="link.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200/90 transition-all shadow-micro hover:shadow-soft group"
                  :title="link.url"
                >
                  <LinkIcon class="w-3.5 h-3.5 text-teal-600 group-hover:scale-110 transition-transform" />
                  <span class="max-w-[220px] truncate">{{ link.title || 'Hasil Kerja' }}</span>
                  <ExternalLink class="w-3 h-3 text-teal-500 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </a>
              </div>
            </div>
          </div>

          <!-- Right: Actions -->
          <div class="flex items-center gap-1.5 self-end sm:self-start shrink-0">
            <!-- Catat / Edit Evaluasi Button -->
            <button
              @click="openEvaluationModal(task)"
              class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border"
              :class="(task.obstacle || task.evaluation || task.conclusion)
                ? 'text-indigo-700 bg-indigo-50 border-indigo-200 hover:bg-indigo-100'
                : 'text-slate-500 hover:text-indigo-700 hover:bg-indigo-50 border-slate-200'"
              title="Catat Kendala, Evaluasi & Kesimpulan"
            >
              <MessageSquare class="w-3.5 h-3.5 text-indigo-500" />
              <span>{{ (task.obstacle || task.evaluation || task.conclusion) ? 'Evaluasi' : '+ Evaluasi' }}</span>
            </button>

            <!-- Quick Attach Link Button -->
            <button
              @click="openAttachModal(task)"
              class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border"
              :class="getTaskLinks(task).length > 0
                ? 'text-teal-700 bg-teal-50 border-teal-200 hover:bg-teal-100'
                : 'text-slate-500 hover:text-teal-700 hover:bg-teal-50 border-slate-200'"
              title="Lampirkan Link Hasil Kerja"
            >
              <Paperclip class="w-3.5 h-3.5" />
              <span class="hidden sm:inline">{{ getTaskLinks(task).length > 0 ? `${getTaskLinks(task).length} Link` : 'Attach Link' }}</span>
            </button>

            <button
              @click="editTask(task)"
              class="p-1.5 rounded-lg text-slate-400 hover:text-teal-700 hover:bg-teal-50 transition-colors"
              title="Edit Task"
            >
              <Edit2 class="w-4 h-4" />
            </button>
            <button
              @click="deleteTask(task.id)"
              class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Hapus Task"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- EVALUATION NOTES SECTION (KENDALA, EVALUASI, KESIMPULAN) JIKA ADA -->
        <div
          v-if="task.obstacle || task.evaluation || task.conclusion"
          class="mt-1 pt-2.5 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs bg-slate-50/70 p-3 rounded-xl border border-slate-200/80"
        >
          <!-- 1. Kendala -->
          <div v-if="task.obstacle" class="space-y-0.5">
            <span class="text-[10px] font-extrabold text-amber-800 uppercase flex items-center gap-1">
              <AlertTriangle class="w-3 h-3 text-amber-500" />
              <span>Kendala:</span>
            </span>
            <p class="text-slate-700 text-[11px] leading-relaxed">
              {{ task.obstacle }}
            </p>
          </div>
          <div v-else class="hidden md:block"></div>

          <!-- 2. Evaluasi -->
          <div v-if="task.evaluation" class="space-y-0.5">
            <span class="text-[10px] font-extrabold text-indigo-800 uppercase flex items-center gap-1">
              <Search class="w-3 h-3 text-indigo-500" />
              <span>Evaluasi Hasil:</span>
            </span>
            <p class="text-slate-700 text-[11px] leading-relaxed">
              {{ task.evaluation }}
            </p>
          </div>
          <div v-else class="hidden md:block"></div>

          <!-- 3. Kesimpulan -->
          <div v-if="task.conclusion" class="space-y-0.5">
            <span class="text-[10px] font-extrabold text-emerald-800 uppercase flex items-center gap-1">
              <CheckCircle2 class="w-3 h-3 text-emerald-600" />
              <span>Kesimpulan &amp; Tindak Lanjut:</span>
            </span>
            <p class="text-slate-700 text-[11px] leading-relaxed">
              {{ task.conclusion }}
            </p>
          </div>
          <div v-else class="hidden md:block"></div>
        </div>
      </div>

      <!-- Empty State if no tasks -->
      <div v-if="filteredTasks.length === 0" class="text-center py-10 bg-white/60 rounded-2xl border border-dashed border-teal-200 p-6">
        <CheckSquare class="w-9 h-9 text-teal-400 mx-auto mb-2" />
        <p class="text-sm font-bold text-slate-700">Tidak ada tugas pada filter ini</p>
        <p class="text-xs text-slate-500 mt-1">
          Pilih minggu kerja lain, ubah custom tanggal, atau klik "Tambah Task Jurnal" untuk membuat task baru.
        </p>
      </div>
    </div>

    <!-- Log Harian (Evaluasi & Temuan Eksperimen) -->
    <div class="glass-card rounded-2xl p-5 sm:p-6 border border-teal-100 shadow-soft">
      <div class="flex items-center justify-between mb-4 pb-3 border-b border-teal-100">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
            <BookOpen class="w-4 h-4" />
          </div>
          <div>
            <h3 class="text-sm font-bold text-slate-800">Log Harian: Evaluasi &amp; Temuan Eksperimen</h3>
            <p class="text-[11px] text-slate-500">Catat hipotesis, data CPR/ROI aktual, dan keputusan scale-up hari ini</p>
          </div>
        </div>

        <button
          @click="showPastLogs = !showPastLogs"
          class="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1"
        >
          <span>{{ showPastLogs ? 'Tutup Riwayat' : 'Riwayat Log' }}</span>
          <ChevronDown class="w-4 h-4 transition-transform" :class="showPastLogs ? 'rotate-180' : ''" />
        </button>
      </div>

      <!-- New Log Form -->
      <form @submit.prevent="saveDailyLog" class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Fokus &amp; Validasi Hari Ini
          </label>
          <input
            v-model="newLog.focus"
            type="text"
            required
            placeholder="Contoh: Validasi Creative Video Testimoni Sumur &amp; Optimasi CPR..."
            class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-xs sm:text-sm font-semibold transition-all"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Evaluasi &amp; Temuan Eksperimen (Growth Findings)
            </label>
            <textarea
              v-model="newLog.evaluation"
              required
              rows="4"
              placeholder="Deskripsikan tren CTR, efisiensi CPR, angle copywriting yang resonan, atau drop-off donatur..."
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-xs transition-all"
            ></textarea>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Langkah Perbaikan / Next Action
            </label>
            <textarea
              v-model="newLog.nextSteps"
              required
              rows="4"
              placeholder="Langkah spesifik esok hari: Injeksi budget ke adset X, matikan adset Y, perbaiki form transfer..."
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-xs transition-all"
            ></textarea>
          </div>
        </div>

        <div class="flex items-center justify-between pt-2">
          <span v-if="logSavedToast" class="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1.5 animate-bounce">
            <Check class="w-3.5 h-3.5" />
            Log Harian Berhasil Disimpan!
          </span>
          <span v-else></span>

          <button
            type="submit"
            class="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-soft transition-all active:scale-95"
          >
            <Save class="w-4 h-4" />
            <span>Simpan Log Eksperimen</span>
          </button>
        </div>
      </form>

      <!-- History of Past Logs (Collapsible) -->
      <div v-if="showPastLogs" class="mt-6 pt-5 border-t border-teal-100 space-y-4">
        <h4 class="text-xs font-bold text-slate-600 uppercase tracking-wider">
          Riwayat Log Harian Sebelumnya
        </h4>

        <div
          v-for="log in store.journalLogs"
          :key="log.id"
          class="p-4 rounded-xl bg-white/80 border border-teal-100/80 shadow-micro space-y-2"
        >
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-teal-800">{{ log.focus }}</span>
            <span class="text-[11px] font-semibold text-slate-400">{{ formatDate(log.date) }}</span>
          </div>
          <p class="text-xs text-slate-600">
            <strong class="text-slate-800">Temuan:</strong> {{ log.evaluation }}
          </p>
          <p class="text-xs text-slate-600">
            <strong class="text-slate-800">Next Action:</strong> {{ log.nextSteps }}
          </p>
        </div>
      </div>
    </div>

    <!-- Complete / Evaluation Modal for Tasks -->
    <CompleteTaskEvaluationModal
      :is-open="isEvaluationModalOpen"
      :task="targetEvaluationTask"
      @close="closeEvaluationModal"
      @complete="handleSaveEvaluation"
    />

    <!-- Task Modal (Create & Edit) -->
    <TaskModal
      :is-open="isTaskModalOpen"
      :initial-data="editingTask"
      :is-edit="!!editingTask"
      @close="closeTaskModal"
      @save="handleSaveTask"
    />

    <!-- Quick Attach Link Modal -->
    <AttachLinkModal
      :is-open="isAttachModalOpen"
      :item="targetAttachTask"
      item-type="task"
      @close="closeAttachModal"
      @save="handleSaveAttachment"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useGrowthFlowStore } from '@/stores/growthFlowStore';
import { useConfetti } from '@/composables/useConfetti';
import {
  formatDate,
  formatJournalDate,
  getWeekOfMonth,
  isWorkDay,
  LOGFRAME_TYPES
} from '@/utils/formatters';
import TaskModal from './TaskModal.vue';
import AttachLinkModal from './AttachLinkModal.vue';
import CompleteTaskEvaluationModal from './CompleteTaskEvaluationModal.vue';
import {
  Check,
  Plus,
  Clock,
  Edit2,
  Trash2,
  BookOpen,
  ChevronDown,
  Save,
  CheckSquare,
  Paperclip,
  Link as LinkIcon,
  ExternalLink,
  Calendar,
  Briefcase,
  X,
  AlertTriangle,
  Search,
  CheckCircle2,
  MessageSquare
} from 'lucide-vue-next';

const store = useGrowthFlowStore();
const { triggerConfetti } = useConfetti();

const selectedCategory = ref('ALL');
const selectedWeek = ref('ALL');
const customDateFilter = ref('');
const workDaysPerWeek = ref(store.profile?.workDaysPerWeek || 5);

const showPastLogs = ref(false);
const logSavedToast = ref(false);

const isTaskModalOpen = ref(false);
const editingTask = ref(null);

const isAttachModalOpen = ref(false);
const targetAttachTask = ref(null);

const isEvaluationModalOpen = ref(false);
const targetEvaluationTask = ref(null);

const weekTabs = [
  { value: 'ALL', label: 'Semua' },
  { value: '1', label: 'Minggu 1' },
  { value: '2', label: 'Minggu 2' },
  { value: '3', label: 'Minggu 3' },
  { value: '4', label: 'Minggu 4' },
  { value: '5', label: 'Minggu 5' }
];

const newLog = ref({
  focus: '',
  evaluation: '',
  nextSteps: ''
});

function handleWorkDaysChange() {
  store.setWorkDaysPerWeek(Number(workDaysPerWeek.value));
}

const filteredTasks = computed(() => {
  return store.tasks.filter(t => {
    // 1. Filter Category
    if (selectedCategory.value !== 'ALL' && t.category !== selectedCategory.value) {
      return false;
    }

    // 2. Filter Custom Date if active
    if (customDateFilter.value) {
      return t.date === customDateFilter.value;
    }

    // 3. Filter Week of Month
    if (selectedWeek.value !== 'ALL') {
      const taskWeek = getWeekOfMonth(t.date);
      if (String(taskWeek) !== String(selectedWeek.value)) {
        return false;
      }
    }

    return true;
  });
});

const completedCount = computed(() => store.tasks.filter(t => t.completed).length);
const totalCount = computed(() => store.tasks.length);

function getLogFrameBadgeClass(category) {
  const info = LOGFRAME_TYPES[category] || LOGFRAME_TYPES.OUTPUT;
  return `${info.badgeBg} ${info.badgeText} ${info.badgeBorder}`;
}

function handleCheckboxClick(task, event) {
  if (task.completed) {
    // Toggle directly back to uncompleted
    store.toggleTask(task.id);
  } else {
    // Prompt evaluation modal before marking complete!
    targetEvaluationTask.value = { ...task };
    isEvaluationModalOpen.value = true;
  }
}

function openEvaluationModal(task) {
  targetEvaluationTask.value = { ...task };
  isEvaluationModalOpen.value = true;
}

function closeEvaluationModal() {
  isEvaluationModalOpen.value = false;
  targetEvaluationTask.value = null;
}

function handleSaveEvaluation({ taskId, obstacle, evaluation, conclusion }) {
  store.completeTaskWithEvaluation(taskId, { obstacle, evaluation, conclusion });
  closeEvaluationModal();
  triggerConfetti();
}

function openCreateModal() {
  editingTask.value = null;
  isTaskModalOpen.value = true;
}

function editTask(task) {
  editingTask.value = { ...task };
  isTaskModalOpen.value = true;
}

function closeTaskModal() {
  isTaskModalOpen.value = false;
  editingTask.value = null;
}

function getTaskLinks(task) {
  const links = [];
  if (Array.isArray(task.attachments)) {
    task.attachments.forEach(att => {
      if (att && att.url) {
        links.push({ title: att.title || 'Hasil Kerja', url: att.url });
      }
    });
  }
  if (task.workResultUrl && !links.some(l => l.url === task.workResultUrl)) {
    links.unshift({
      title: task.workResultTitle || 'Hasil Kerja',
      url: task.workResultUrl
    });
  }
  return links;
}

function openAttachModal(task) {
  targetAttachTask.value = { ...task };
  isAttachModalOpen.value = true;
}

function closeAttachModal() {
  isAttachModalOpen.value = false;
  targetAttachTask.value = null;
}

function handleSaveAttachment({ id, payload }) {
  store.updateTask(id, payload);
  closeAttachModal();
}

function handleSaveTask(taskData) {
  if (editingTask.value) {
    store.updateTask(editingTask.value.id, taskData);
  } else {
    store.addTask(taskData);
  }
  closeTaskModal();
}

function deleteTask(taskId) {
  if (confirm('Yakin ingin menghapus tugas ini?')) {
    store.deleteTask(taskId);
  }
}

function saveDailyLog() {
  if (!newLog.value.focus || !newLog.value.evaluation) return;
  store.addJournalLog({
    focus: newLog.value.focus,
    evaluation: newLog.value.evaluation,
    growthFindings: newLog.value.evaluation,
    nextSteps: newLog.value.nextSteps
  });

  newLog.value = { focus: '', evaluation: '', nextSteps: '' };
  logSavedToast.value = true;
  setTimeout(() => {
    logSavedToast.value = false;
  }, 3000);
}
</script>
