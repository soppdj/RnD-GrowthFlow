<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
          <span>Agenda & Target Roadmap</span>
          <span class="text-xs px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 font-semibold border border-teal-200">
            Diurutkan Deadline Terdekat
          </span>
        </h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Milestones jangka panjang mingguan, bulanan, dan kuartalan R&D Growth Hacking
        </p>
      </div>

      <button
        @click="openModal"
        class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-soft transition-all active:scale-95 shrink-0 self-start sm:self-auto"
      >
        <Plus class="w-4 h-4" />
        <span>Tambah Milestone</span>
      </button>
    </div>

    <!-- Milestones List Sorted by Nearest Deadline -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="item in sortedMilestones"
        :key="item.id"
        class="glass-card rounded-2xl p-5 border border-teal-100 shadow-soft flex flex-col justify-between hover:border-teal-300 transition-all duration-200"
      >
        <div>
          <!-- Header: Category & Type Badge + Deadline Countdown -->
          <div class="flex items-center justify-between gap-2 mb-2.5">
            <div class="flex items-center gap-1.5">
              <span
                class="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase border"
                :class="getLogFrameBadgeClass(item.category)"
              >
                {{ item.category }}
              </span>
              <span class="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600">
                {{ item.type }}
              </span>
            </div>

            <!-- Deadline Badge -->
            <span
              class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border"
              :class="getDeadlineBadgeClass(item.deadline)"
            >
              <Calendar class="w-3.5 h-3.5" />
              {{ formatDate(item.deadline) }} ({{ getDaysLeft(item.deadline) }})
            </span>
          </div>

          <!-- Title -->
          <h3 class="text-sm font-bold text-slate-800 leading-snug">
            {{ item.title }}
          </h3>

          <!-- Target Metric -->
          <p class="text-xs text-teal-700 font-semibold mt-1 flex items-center gap-1">
            <Target class="w-3.5 h-3.5 text-teal-600" />
            <span>Target: {{ item.targetMetric }}</span>
          </p>

          <!-- Attachments / Link Hasil Kerja Milestone -->
          <div v-if="getMilestoneLinks(item).length > 0" class="flex flex-wrap items-center gap-1.5 mt-2.5">
            <a
              v-for="(link, idx) in getMilestoneLinks(item)"
              :key="idx"
              :href="link.url"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200/90 transition-all shadow-micro hover:shadow-soft group"
              :title="link.url"
            >
              <LinkIcon class="w-3.5 h-3.5 text-teal-600 group-hover:scale-110 transition-transform" />
              <span class="max-w-[180px] truncate">{{ link.title || 'Hasil Kerja' }}</span>
              <ExternalLink class="w-3 h-3 text-teal-500 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </a>
          </div>
        </div>

        <!-- Progress Slider / Bar -->
        <div class="mt-4 pt-3 border-t border-teal-100/70">
          <div class="flex items-center justify-between text-xs mb-1.5">
            <span class="text-slate-500 font-medium">Progres Pencapaian</span>
            <div class="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max="100"
                v-model.number="item.progressPercent"
                @change="store.saveToStorage()"
                class="w-14 px-1.5 py-0.5 rounded border border-slate-200 text-right text-xs font-bold text-teal-800"
              />
              <span class="font-bold text-teal-800">%</span>
            </div>
          </div>

          <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              class="bg-gradient-to-r from-teal-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
              :style="{ width: `${Math.min(item.progressPercent, 100)}%` }"
            ></div>
          </div>

          <!-- Bottom Actions -->
          <div class="flex items-center justify-between mt-3 text-xs">
            <button
              @click="toggleMilestoneStatus(item)"
              class="font-semibold px-2 py-0.5 rounded text-[11px] transition-colors"
              :class="item.status === 'Done' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
            >
              {{ item.status === 'Done' ? '✅ Selesai' : '⏳ In Progress' }}
            </button>

            <div class="flex items-center gap-1.5">
              <button
                @click="openAttachModal(item)"
                class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all border"
                :class="getMilestoneLinks(item).length > 0
                  ? 'text-teal-700 bg-teal-50 border-teal-200 hover:bg-teal-100'
                  : 'text-slate-500 hover:text-teal-700 hover:bg-teal-50 border-slate-200'"
                title="Lampirkan Link Hasil Kerja"
              >
                <Paperclip class="w-3 h-3" />
                <span>{{ getMilestoneLinks(item).length > 0 ? `${getMilestoneLinks(item).length} Link` : 'Attach Link' }}</span>
              </button>
              <button
                @click="deleteMilestone(item.id)"
                class="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                title="Hapus Milestone"
              >
                <Trash2 class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Milestone Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div class="glass-panel rounded-2xl w-full max-w-md p-6 shadow-2xl border border-teal-100">
        <div class="flex items-center justify-between pb-3 border-b border-teal-100">
          <h3 class="text-base font-bold text-slate-800">Tambah Target Milestone</h3>
          <button @click="isModalOpen = false" class="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X class="w-5 h-5" />
          </button>
        </div>

        <form @submit.prevent="handleCreateMilestone" class="mt-4 space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Judul Target</label>
            <input
              v-model="newMilestone.title"
              type="text"
              required
              placeholder="Contoh: Scaling Kampanye Wakaf ke Rp 100 Juta..."
              class="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-teal-500 text-xs sm:text-sm outline-none"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Tipe Roadmap</label>
              <select v-model="newMilestone.type" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none">
                <option value="Weekly">Mingguan (Weekly)</option>
                <option value="Monthly">Bulanan (Monthly)</option>
                <option value="Quarterly">Kuartalan (Q4)</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Kategori LogFrame</label>
              <select v-model="newMilestone.category" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none">
                <option value="GOAL">GOAL (Dampak)</option>
                <option value="OUTCOME">OUTCOME (Hasil)</option>
                <option value="OUTPUT">OUTPUT (Deliverable)</option>
                <option value="ACTIVITY">ACTIVITY (Taktis)</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Target Metrik / Key Result</label>
            <input
              v-model="newMilestone.targetMetric"
              type="text"
              required
              placeholder="Contoh: CPR < Rp 30.000 & 500 Donatur Baru"
              class="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-teal-500 text-xs outline-none"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Deadline</label>
            <input
              v-model="newMilestone.deadline"
              type="date"
              required
              class="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-teal-500 text-xs font-semibold outline-none"
            />
          </div>

          <!-- Attach Deliverable Link (Optional) -->
          <div class="p-3 rounded-xl bg-teal-50/60 border border-teal-100 space-y-2">
            <div class="flex items-center justify-between">
              <label class="block text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
                <Paperclip class="w-3.5 h-3.5 text-teal-600" />
                <span>Link Deliverable / Hasil Kerja</span>
              </label>
              <span class="text-[10px] text-teal-700 font-semibold bg-teal-100/80 px-2 py-0.5 rounded">
                Opsional
              </span>
            </div>

            <div class="space-y-2">
              <input
                v-model="newMilestone.workResultTitle"
                type="text"
                placeholder="Judul Link (misal: Live URL / Dokumen Integrasi CRM)"
                class="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:border-teal-500 text-xs outline-none"
              />
              <input
                v-model="newMilestone.workResultUrl"
                type="url"
                placeholder="https://drive.google.com/... atau https://..."
                class="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:border-teal-500 text-xs font-mono outline-none"
              />
            </div>
          </div>

          <div class="flex items-center justify-end gap-2 pt-3 border-t border-teal-100">
            <button
              type="button"
              @click="isModalOpen = false"
              class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-soft"
            >
              Simpan Milestone
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Quick Attach Link Modal for Milestones -->
    <AttachLinkModal
      :is-open="isAttachModalOpen"
      :item="targetAttachMilestone"
      item-type="milestone"
      @close="closeAttachModal"
      @save="handleSaveAttachment"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useGrowthFlowStore } from '@/stores/growthFlowStore';
import { formatDate, LOGFRAME_TYPES } from '@/utils/formatters';
import AttachLinkModal from './AttachLinkModal.vue';
import {
  Calendar,
  Target,
  Plus,
  Trash2,
  X,
  Paperclip,
  Link as LinkIcon,
  ExternalLink
} from 'lucide-vue-next';

const store = useGrowthFlowStore();
const isModalOpen = ref(false);

const isAttachModalOpen = ref(false);
const targetAttachMilestone = ref(null);

const newMilestone = ref({
  title: '',
  type: 'Monthly',
  category: 'OUTCOME',
  targetMetric: '',
  deadline: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
  progressPercent: 0,
  status: 'In Progress',
  workResultTitle: '',
  workResultUrl: '',
  attachments: []
});

function getMilestoneLinks(item) {
  const links = [];
  if (Array.isArray(item.attachments)) {
    item.attachments.forEach(att => {
      if (att && att.url) {
        links.push({ title: att.title || 'Hasil Kerja', url: att.url });
      }
    });
  }
  if (item.workResultUrl && !links.some(l => l.url === item.workResultUrl)) {
    links.unshift({
      title: item.workResultTitle || 'Hasil Kerja',
      url: item.workResultUrl
    });
  }
  return links;
}

function openAttachModal(item) {
  targetAttachMilestone.value = { ...item };
  isAttachModalOpen.value = true;
}

function closeAttachModal() {
  isAttachModalOpen.value = false;
  targetAttachMilestone.value = null;
}

function handleSaveAttachment({ id, payload }) {
  store.updateMilestone(id, payload);
  closeAttachModal();
}

// Sort strictly by nearest deadline first
const sortedMilestones = computed(() => {
  return [...store.milestones].sort((a, b) => {
    return new Date(a.deadline) - new Date(b.deadline);
  });
});

function getLogFrameBadgeClass(category) {
  const info = LOGFRAME_TYPES[category] || LOGFRAME_TYPES.OUTCOME;
  return `${info.badgeBg} ${info.badgeText} ${info.badgeBorder}`;
}

function getDaysLeft(dateStr) {
  const now = new Date();
  const target = new Date(dateStr);
  const diffTime = target - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return 'Lewat deadline';
  if (diffDays === 0) return 'Hari ini!';
  return `${diffDays} hari lagi`;
}

function getDeadlineBadgeClass(dateStr) {
  const now = new Date();
  const target = new Date(dateStr);
  const diffDays = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return 'bg-rose-50 text-rose-700 border-rose-200';
  if (diffDays <= 7) return 'bg-amber-50 text-amber-700 border-amber-200';
  return 'bg-teal-50 text-teal-700 border-teal-200';
}

function toggleMilestoneStatus(item) {
  item.status = item.status === 'Done' ? 'In Progress' : 'Done';
  if (item.status === 'Done') {
    item.progressPercent = 100;
  }
  store.saveToStorage();
}

function deleteMilestone(id) {
  if (confirm('Hapus milestone ini?')) {
    store.deleteMilestone(id);
  }
}

function openModal() {
  isModalOpen.value = true;
}

function handleCreateMilestone() {
  if (!newMilestone.value.title) return;

  let url = (newMilestone.value.workResultUrl || '').trim();
  if (url && !/^https?:\/\//i.test(url)) {
    url = 'https://' + url;
  }
  const title = (newMilestone.value.workResultTitle || '').trim();
  const attachments = url ? [{ title: title || 'Hasil Kerja', url }] : [];

  store.addMilestone({
    ...newMilestone.value,
    workResultUrl: url,
    workResultTitle: title,
    attachments
  });

  isModalOpen.value = false;
  newMilestone.value = {
    title: '',
    type: 'Monthly',
    category: 'OUTCOME',
    targetMetric: '',
    deadline: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    progressPercent: 0,
    status: 'In Progress',
    workResultTitle: '',
    workResultUrl: '',
    attachments: []
  };
}
</script>
