<template>
  <div class="space-y-6">
    <!-- Board Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
          <span>Ad Lab: Growth Hacking Pipeline</span>
          <span class="text-xs px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 font-semibold border border-teal-200">
            3-Stage Validation Framework
          </span>
        </h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Proses sistematis: Validasi Mikro Creative (TEST) → Winning Ad Set (SCALE 1) → Injeksi Anggaran Penuh (SCALE 2)
        </p>
      </div>

      <div class="flex items-center gap-2">
        <select
          v-model="platformFilter"
          class="px-3 py-1.5 rounded-xl border border-teal-200 bg-white text-xs font-semibold text-slate-700 outline-none"
        >
          <option value="ALL">Semua Platform</option>
          <option value="Meta Ads">Meta Ads</option>
          <option value="TikTok Ads">TikTok Ads</option>
          <option value="Google Search">Google Search</option>
        </select>

        <button
          @click="isEvaluatorModalOpen = true"
          class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-teal-50 border border-teal-200 text-teal-800 shadow-micro transition-all active:scale-95 shrink-0"
          title="Import file laporan Meta Ads Manager (.xlsx, .csv) untuk evaluasi lanjut vs stop"
        >
          <FileSpreadsheet class="w-4 h-4 text-teal-600" />
          <span>Import &amp; Evaluasi Meta Ads</span>
        </button>

        <button
          @click="openCreateModal"
          class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-soft transition-all active:scale-95 shrink-0"
        >
          <Plus class="w-4 h-4" />
          <span>Eksperimen Baru</span>
        </button>
      </div>
    </div>

    <!-- Standar KPI R&D & SOP Eksperimen (Acuan Baku Playbook) -->
    <AdLabKpiStandard />

    <!-- 3-Column Kanban Board -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <!-- COLUMN 1: TEST -->
      <div class="glass-panel rounded-2xl p-4 border border-amber-200/80 bg-amber-50/20 flex flex-col min-h-[500px]">
        <!-- Column Header -->
        <div class="flex items-center justify-between pb-3 mb-3 border-b border-amber-200/60">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-amber-500"></span>
            <div>
              <h3 class="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
                <span>1. TEST</span>
                <span class="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.2 rounded-full">
                  {{ filteredCampaigns.TEST.length }}
                </span>
              </h3>
              <p class="text-[10px] text-amber-700 font-medium">Mencari Winning Creative & Angle</p>
            </div>
          </div>
          <span class="text-[11px] font-bold text-slate-500">
            {{ formatCompactCurrency(getStageTotalSpend(filteredCampaigns.TEST)) }}
          </span>
        </div>

        <!-- Cards Container -->
        <div class="space-y-3 flex-1 overflow-y-auto pr-1">
          <AdLabCard
            v-for="camp in filteredCampaigns.TEST"
            :key="camp.id"
            :campaign="camp"
            @move-stage="handleMoveStage"
            @edit="handleEditCampaign"
            @delete="handleDeleteCampaign"
          />

          <div v-if="filteredCampaigns.TEST.length === 0" class="text-center py-12 border-2 border-dashed border-amber-200 rounded-xl">
            <p class="text-xs font-semibold text-slate-400">Belum ada eksperimen di tahap TEST</p>
          </div>
        </div>
      </div>

      <!-- COLUMN 2: SCALE 1 -->
      <div class="glass-panel rounded-2xl p-4 border border-teal-200/80 bg-teal-50/20 flex flex-col min-h-[500px]">
        <!-- Column Header -->
        <div class="flex items-center justify-between pb-3 mb-3 border-b border-teal-200/60">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-teal-500"></span>
            <div>
              <h3 class="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
                <span>2. SCALE 1</span>
                <span class="text-[11px] font-bold text-teal-800 bg-teal-100 px-2 py-0.2 rounded-full">
                  {{ filteredCampaigns.SCALE_1.length }}
                </span>
              </h3>
              <p class="text-[10px] text-teal-700 font-medium">Winning Ad Set & LLA Audiens</p>
            </div>
          </div>
          <span class="text-[11px] font-bold text-slate-500">
            {{ formatCompactCurrency(getStageTotalSpend(filteredCampaigns.SCALE_1)) }}
          </span>
        </div>

        <!-- Cards Container -->
        <div class="space-y-3 flex-1 overflow-y-auto pr-1">
          <AdLabCard
            v-for="camp in filteredCampaigns.SCALE_1"
            :key="camp.id"
            :campaign="camp"
            @move-stage="handleMoveStage"
            @edit="handleEditCampaign"
            @delete="handleDeleteCampaign"
          />

          <div v-if="filteredCampaigns.SCALE_1.length === 0" class="text-center py-12 border-2 border-dashed border-teal-200 rounded-xl">
            <p class="text-xs font-semibold text-slate-400">Belum ada kampanye di tahap SCALE 1</p>
          </div>
        </div>
      </div>

      <!-- COLUMN 3: SCALE 2 -->
      <div class="glass-panel rounded-2xl p-4 border border-emerald-200/80 bg-emerald-50/20 flex flex-col min-h-[500px]">
        <!-- Column Header -->
        <div class="flex items-center justify-between pb-3 mb-3 border-b border-emerald-200/60">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-emerald-600"></span>
            <div>
              <h3 class="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
                <span>3. SCALE 2</span>
                <span class="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.2 rounded-full">
                  {{ filteredCampaigns.SCALE_2.length }}
                </span>
              </h3>
              <p class="text-[10px] text-emerald-700 font-medium">Final Scale & Injeksi Anggaran Penuh</p>
            </div>
          </div>
          <span class="text-[11px] font-bold text-slate-500">
            {{ formatCompactCurrency(getStageTotalSpend(filteredCampaigns.SCALE_2)) }}
          </span>
        </div>

        <!-- Cards Container -->
        <div class="space-y-3 flex-1 overflow-y-auto pr-1">
          <AdLabCard
            v-for="camp in filteredCampaigns.SCALE_2"
            :key="camp.id"
            :campaign="camp"
            @move-stage="handleMoveStage"
            @edit="handleEditCampaign"
            @delete="handleDeleteCampaign"
          />

          <div v-if="filteredCampaigns.SCALE_2.length === 0" class="text-center py-12 border-2 border-dashed border-emerald-200 rounded-xl">
            <p class="text-xs font-semibold text-slate-400">Belum ada kampanye di tahap SCALE 2</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Ad Lab Modal -->
    <AdLabModal
      :is-open="isModalOpen"
      :initial-data="editingCampaign"
      :is-edit="!!editingCampaign"
      @close="closeModal"
      @save="handleSaveCampaign"
    />

    <!-- Meta Ads Evaluator Modal (Excel/CSV Parser & Decision Engine) -->
    <MetaAdsEvaluatorModal
      :is-open="isEvaluatorModalOpen"
      @close="isEvaluatorModalOpen = false"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useGrowthFlowStore } from '@/stores/growthFlowStore';
import { formatCompactCurrency } from '@/utils/formatters';
import AdLabCard from './AdLabCard.vue';
import AdLabModal from './AdLabModal.vue';
import AdLabKpiStandard from './AdLabKpiStandard.vue';
import MetaAdsEvaluatorModal from './MetaAdsEvaluatorModal.vue';
import { Plus, FileSpreadsheet } from 'lucide-vue-next';

const store = useGrowthFlowStore();

const platformFilter = ref('ALL');
const isModalOpen = ref(false);
const isEvaluatorModalOpen = ref(false);
const editingCampaign = ref(null);

const filteredCampaigns = computed(() => {
  const all = store.campaigns;
  const filtered = platformFilter.value === 'ALL'
    ? all
    : all.filter(c => c.platform === platformFilter.value);

  return {
    TEST: filtered.filter(c => c.stage === 'TEST'),
    SCALE_1: filtered.filter(c => c.stage === 'SCALE_1'),
    SCALE_2: filtered.filter(c => c.stage === 'SCALE_2')
  };
});

function getStageTotalSpend(campaigns) {
  return campaigns.reduce((sum, c) => sum + (Number(c.adSpend) || 0), 0);
}

function handleMoveStage(campaignId, newStage) {
  store.moveCampaignStage(campaignId, newStage);
}

function openCreateModal() {
  editingCampaign.value = null;
  isModalOpen.value = true;
}

function handleEditCampaign(campaign) {
  editingCampaign.value = { ...campaign };
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
  editingCampaign.value = null;
}

function handleSaveCampaign(data) {
  if (editingCampaign.value) {
    store.updateCampaign(editingCampaign.value.id, data);
  } else {
    store.addCampaign(data);
  }
  closeModal();
}

function handleDeleteCampaign(campaignId) {
  if (confirm('Yakin ingin menghapus eksperimen kampanye ini?')) {
    store.deleteCampaign(campaignId);
  }
}
</script>
