<template>
  <div class="space-y-6">
    <!-- Header with Quick Action & Filter -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
          <span>Jurnal Harian R&D</span>
          <span class="text-xs px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 font-semibold border border-teal-200">
            {{ completedCount }}/{{ totalCount }} Selesai
          </span>
        </h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Tandai checklist (✅) untuk memicu progres LogFrame & catat temuan eksperimen
        </p>
      </div>

      <div class="flex items-center gap-2">
        <!-- Filter Category -->
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

        <button
          @click="openCreateModal"
          class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-soft transition-all active:scale-95 shrink-0"
        >
          <Plus class="w-4 h-4" />
          <span>Tambah Task</span>
        </button>
      </div>
    </div>

    <!-- Tasks Checklist Grid -->
    <div class="space-y-3">
      <div
        v-for="task in filteredTasks"
        :key="task.id"
        class="glass-card rounded-2xl p-4 border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        :class="task.completed 
          ? 'bg-emerald-50/30 border-emerald-200/80 shadow-micro opacity-90' 
          : 'border-teal-100 hover:border-teal-300 shadow-soft'"
      >
        <!-- Left: Custom Checkbox & Details -->
        <div class="flex items-start gap-3.5 flex-1">
          <!-- Checkbox with confetti trigger -->
          <button
            type="button"
            @click="handleToggleTask(task, $event)"
            class="mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 shrink-0 cursor-pointer active:scale-90"
            :class="task.completed 
              ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm ring-2 ring-emerald-200' 
              : 'border-slate-300 bg-white hover:border-teal-500'"
            :aria-label="task.completed ? 'Batalkan selesai' : 'Tandai selesai'"
          >
            <Check v-if="task.completed" class="w-4 h-4 stroke-[3]" />
          </button>

          <!-- Task Info -->
          <div class="space-y-1">
            <div class="flex flex-wrap items-center gap-2">
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
            </div>

            <!-- Title -->
            <p
              class="text-sm font-semibold transition-colors"
              :class="task.completed ? 'line-through text-slate-400' : 'text-slate-800'"
            >
              {{ task.title }}
            </p>

            <!-- Notes / Findings -->
            <p v-if="task.notes" class="text-xs text-slate-500 italic">
              "{{ task.notes }}"
            </p>

            <!-- Attachments / Link Hasil Kerja -->
            <div v-if="getTaskLinks(task).length > 0" class="flex flex-wrap items-center gap-1.5 pt-1">
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
                <span class="max-w-[200px] truncate">{{ link.title || 'Hasil Kerja' }}</span>
                <ExternalLink class="w-3 h-3 text-teal-500 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </a>
            </div>
          </div>
        </div>

        <!-- Right: Actions -->
        <div class="flex items-center gap-1.5 self-end sm:self-center shrink-0">
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

      <!-- Empty State if no tasks -->
      <div v-if="filteredTasks.length === 0" class="text-center py-8 bg-white/50 rounded-2xl border border-dashed border-teal-200">
        <CheckSquare class="w-8 h-8 text-teal-400 mx-auto mb-2" />
        <p class="text-sm font-semibold text-slate-600">Tidak ada tugas pada filter ini</p>
        <p class="text-xs text-slate-400 mt-1">Tambahkan tugas baru untuk memperbarui progres LogFrame</p>
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
            <h3 class="text-sm font-bold text-slate-800">Log Harian: Evaluasi & Temuan Eksperimen</h3>
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
            Fokus & Validasi Hari Ini
          </label>
          <input
            v-model="newLog.focus"
            type="text"
            required
            placeholder="Contoh: Validasi Creative Video Testimoni Sumur & Optimasi CPR..."
            class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-xs sm:text-sm font-semibold transition-all"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Evaluasi & Temuan Eksperimen (Growth Findings)
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

    <!-- Task Modal -->
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
import { formatDate, LOGFRAME_TYPES } from '@/utils/formatters';
import TaskModal from './TaskModal.vue';
import AttachLinkModal from './AttachLinkModal.vue';
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
  ExternalLink
} from 'lucide-vue-next';

const store = useGrowthFlowStore();
const { triggerConfetti } = useConfetti();

const selectedCategory = ref('ALL');
const showPastLogs = ref(false);
const logSavedToast = ref(false);

const isTaskModalOpen = ref(false);
const editingTask = ref(null);

const isAttachModalOpen = ref(false);
const targetAttachTask = ref(null);

const newLog = ref({
  focus: '',
  evaluation: '',
  nextSteps: ''
});

const filteredTasks = computed(() => {
  if (selectedCategory.value === 'ALL') return store.tasks;
  return store.tasks.filter(t => t.category === selectedCategory.value);
});

const completedCount = computed(() => store.tasks.filter(t => t.completed).length);
const totalCount = computed(() => store.tasks.length);

function getLogFrameBadgeClass(category) {
  const info = LOGFRAME_TYPES[category] || LOGFRAME_TYPES.OUTPUT;
  return `${info.badgeBg} ${info.badgeText} ${info.badgeBorder}`;
}

function handleToggleTask(task, event) {
  const willBeCompleted = !task.completed;
  store.toggleTask(task.id);
  
  if (willBeCompleted) {
    // Trigger celebratory confetti burst!
    const rect = event.target.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    triggerConfetti({ x, y });
  }
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
