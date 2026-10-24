<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-teal-50/20 to-emerald-50/30 text-slate-800">
    <!-- Top Header -->
    <AppHeader
      @toggle-mobile-menu="isMobileDrawerOpen = !isMobileDrawerOpen"
      @quick-add-task="isGlobalTaskModalOpen = true"
    />

    <!-- Main Body Layout -->
    <div class="flex-1 max-w-7xl w-full mx-auto flex">
      <!-- Desktop Sidebar -->
      <AppSidebar />

      <!-- Main Content View Container -->
      <main class="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-12 max-w-full overflow-hidden">
        
        <!-- DASHBOARD TAB -->
        <div v-if="store.activeTab === 'dashboard'" class="space-y-6 animate-fade-in">
          <!-- 1. Welcome Banner -->
          <WelcomeBanner />

          <!-- 2. Core 4 KPI Metrics Grid (CPR, ROI, New Donors, Revenue) -->
          <KpiMetricsGrid />

          <!-- 3. Work Capacity Card & Donut Chart -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CapacityCard />
            <KpiDonutChart />
          </div>

          <!-- 4. Reactive LogFrame Progress Bars -->
          <LogFrameProgress />
        </div>

        <!-- JURNAL & AGENDA TAB -->
        <div v-else-if="store.activeTab === 'jurnal'" class="space-y-6 animate-fade-in">
          <!-- Sub-Tab Switcher -->
          <div class="flex items-center gap-2 p-1 rounded-2xl bg-teal-100/50 w-fit border border-teal-200/60">
            <button
              @click="jurnalSubTab = 'daily'"
              class="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all"
              :class="jurnalSubTab === 'daily' ? 'bg-white text-teal-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'"
            >
              📋 Checklist Jurnal (Harian)
            </button>
            <button
              @click="jurnalSubTab = 'milestones'"
              class="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all"
              :class="jurnalSubTab === 'milestones' ? 'bg-white text-teal-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'"
            >
              🎯 Agenda & Roadmap (Milestones)
            </button>
          </div>

          <DailyJournalTab v-if="jurnalSubTab === 'daily'" />
          <AgendaMilestoneTab v-else />
        </div>

        <!-- AD LAB TAB -->
        <div v-else-if="store.activeTab === 'adlab'" class="animate-fade-in">
          <AdLabBoard />
        </div>

        <!-- DONASI & METRIK TAB -->
        <div v-else-if="store.activeTab === 'donasi'" class="animate-fade-in">
          <DonationMetricsView />
        </div>

        <!-- LAPORAN TAB -->
        <div v-else-if="store.activeTab === 'laporan'" class="animate-fade-in">
          <OfficialReportView />
        </div>

        <!-- PROFIL & PENGATURAN TAB -->
        <div v-else-if="store.activeTab === 'profil'" class="animate-fade-in">
          <ProfileSettingsView />
        </div>
      </main>
    </div>

    <!-- Mobile Drawer Slide-over -->
    <div
      v-if="isMobileDrawerOpen"
      class="lg:hidden fixed inset-0 z-50 flex bg-slate-900/40 backdrop-blur-sm"
      @click.self="isMobileDrawerOpen = false"
    >
      <div class="w-72 bg-white h-full p-5 shadow-2xl flex flex-col justify-between animate-slide-right">
        <div>
          <div class="flex items-center justify-between pb-4 border-b border-teal-100">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-lg bg-teal-700 text-white flex items-center justify-center font-bold text-sm">
                GF
              </div>
              <div>
                <h3 class="text-sm font-bold text-slate-800">R&D GrowthFlow</h3>
                <p class="text-[10px] text-teal-700">FatherLab © 2026</p>
              </div>
            </div>
            <button @click="isMobileDrawerOpen = false" class="p-1 text-slate-400 hover:text-slate-600">
              <X class="w-5 h-5" />
            </button>
          </div>

          <nav class="mt-4 space-y-1">
            <button
              v-for="item in mobileNavList"
              :key="item.id"
              @click="handleSelectMobileTab(item.id)"
              class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-left transition-colors"
              :class="store.activeTab === item.id ? 'bg-teal-600 text-white' : 'text-slate-600 hover:bg-teal-50'"
            >
              <component :is="item.icon" class="w-4 h-4" />
              <span>{{ item.label }}</span>
            </button>
          </nav>
        </div>

        <div class="text-[11px] text-slate-400 text-center pt-4 border-t border-teal-100">
          <p class="font-semibold text-slate-600">Yayasan Khoirur Rooziqiin</p>
          <p>Menebar Manfaat Berkelanjutan</p>
        </div>
      </div>
    </div>

    <!-- Mobile Bottom Navigation Bar -->
    <MobileBottomNav />

    <!-- Global Quick Add Task Modal -->
    <TaskModal
      :is-open="isGlobalTaskModalOpen"
      :is-edit="false"
      @close="isGlobalTaskModalOpen = false"
      @save="handleSaveGlobalTask"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useGrowthFlowStore } from '@/stores/growthFlowStore';

// Layout Components
import AppHeader from '@/components/layout/AppHeader.vue';
import AppSidebar from '@/components/layout/AppSidebar.vue';
import MobileBottomNav from '@/components/layout/MobileBottomNav.vue';

// Dashboard Components
import WelcomeBanner from '@/components/dashboard/WelcomeBanner.vue';
import CapacityCard from '@/components/dashboard/CapacityCard.vue';
import KpiMetricsGrid from '@/components/dashboard/KpiMetricsGrid.vue';
import KpiDonutChart from '@/components/dashboard/KpiDonutChart.vue';
import LogFrameProgress from '@/components/dashboard/LogFrameProgress.vue';

// Module Components
import DailyJournalTab from '@/components/jurnal/DailyJournalTab.vue';
import AgendaMilestoneTab from '@/components/jurnal/AgendaMilestoneTab.vue';
import TaskModal from '@/components/jurnal/TaskModal.vue';
import AdLabBoard from '@/components/adlab/AdLabBoard.vue';
import DonationMetricsView from '@/components/donasi/DonationMetricsView.vue';
import OfficialReportView from '@/components/laporan/OfficialReportView.vue';
import ProfileSettingsView from '@/components/profil/ProfileSettingsView.vue';

// Icons
import {
  X,
  LayoutDashboard,
  BookOpenCheck,
  FlaskConical,
  Coins,
  FileText,
  Settings
} from 'lucide-vue-next';

const store = useGrowthFlowStore();

const isMobileDrawerOpen = ref(false);
const isGlobalTaskModalOpen = ref(false);
const jurnalSubTab = ref('daily');

const mobileNavList = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'jurnal', label: 'Jurnal & Agenda', icon: BookOpenCheck },
  { id: 'adlab', label: 'Ad Lab (Eksperimen)', icon: FlaskConical },
  { id: 'donasi', label: 'Donasi & Metrik', icon: Coins },
  { id: 'laporan', label: 'Laporan Resmi (PDF)', icon: FileText },
  { id: 'profil', label: 'Profil & Pengaturan', icon: Settings }
];

function handleSelectMobileTab(tab) {
  store.setActiveTab(tab);
  isMobileDrawerOpen.value = false;
}

function handleSaveGlobalTask(taskData) {
  store.addTask(taskData);
  isGlobalTaskModalOpen.value = false;
}
</script>

<style>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.25s ease-out forwards;
}

@keyframes slideRight {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}
.animate-slide-right {
  animation: slideRight 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
