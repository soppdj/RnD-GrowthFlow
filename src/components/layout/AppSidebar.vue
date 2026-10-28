<template>
  <aside class="no-print hidden lg:flex flex-col w-64 glass-panel border-r border-teal-100/80 min-h-screen p-4 sticky top-0 self-start">
    <!-- Top Branding Box with R&D GrowthFlow Logo -->
    <div class="px-3 py-3.5 mb-3 rounded-2xl bg-gradient-to-br from-teal-800 to-emerald-950 text-white shadow-soft relative overflow-hidden">
      <!-- Decorative Islamic floral watermark / geometric circle -->
      <div class="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-white/10 blur-sm pointer-events-none"></div>
      <div class="relative z-10 flex items-start gap-2.5">
        <AppLogo size="sm" variant="light" />
        <div class="min-w-0">
          <div class="flex items-center gap-1.5 mb-0.5">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span class="text-[9px] tracking-wider uppercase font-extrabold text-teal-200">Growth Engine</span>
          </div>
          <h2 class="text-xs font-black leading-tight truncate tracking-tight text-white" title="Yayasan Khoirur Rooziqiin">
            Yayasan Khoirur Rooziqiin
          </h2>
          <p class="text-[10px] text-teal-200/90 mt-0.5 font-medium">
            R&amp;D Digital Marketing Hub
          </p>
        </div>
      </div>
    </div>

    <!-- Navigation List -->
    <nav class="flex-1 space-y-1.5">
      <button
        v-for="item in navItems"
        :key="item.id"
        @click="store.setActiveTab(item.id)"
        class="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group text-left"
        :class="store.activeTab === item.id 
          ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-soft font-semibold' 
          : 'text-slate-600 hover:text-teal-800 hover:bg-teal-50/70'"
      >
        <div class="flex items-center gap-3">
          <component
            :is="item.icon"
            class="w-4 h-4 transition-transform group-hover:scale-110"
            :class="store.activeTab === item.id ? 'text-white' : 'text-slate-500 group-hover:text-teal-600'"
          />
          <span>{{ item.label }}</span>
        </div>

        <!-- Badge Counter if any -->
        <span
          v-if="item.badge"
          class="text-[11px] px-2 py-0.5 rounded-full font-bold transition-colors"
          :class="store.activeTab === item.id 
            ? 'bg-white/20 text-white' 
            : 'bg-teal-100 text-teal-800 border border-teal-200'"
        >
          {{ item.badge }}
        </span>
      </button>
    </nav>

    <!-- Bottom KPI Card & System Info -->
    <div class="mt-auto pt-4 border-t border-teal-100/60 space-y-3">
      <!-- Mini Quarter Progress -->
      <div class="p-3 rounded-xl bg-teal-50/60 border border-teal-100/80">
        <div class="flex items-center justify-between text-xs mb-1">
          <span class="font-medium text-slate-600">Target Q4</span>
          <span class="font-bold text-teal-800">{{ store.kpiSummary.quarterAchievementPercent }}%</span>
        </div>
        <div class="w-full bg-teal-200/50 rounded-full h-1.5 overflow-hidden">
          <div
            class="bg-gradient-to-r from-teal-500 to-emerald-500 h-1.5 rounded-full transition-all duration-500"
            :style="{ width: `${store.kpiSummary.quarterAchievementPercent}%` }"
          ></div>
        </div>
        <p class="text-[10px] text-slate-500 mt-1.5 text-right font-medium">
          {{ formatCompactCurrency(store.kpiSummary.totalRevenue) }} / {{ formatCompactCurrency(store.profile.quarterTarget) }}
        </p>
      </div>

      <!-- App Copyright Footer -->
      <div class="text-[11px] text-slate-400 text-center">
        <p class="font-semibold text-slate-600">R&D GrowthFlow</p>
        <p>Powered by FatherLab © 2026</p>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue';
import { useGrowthFlowStore } from '@/stores/growthFlowStore';
import { formatCompactCurrency } from '@/utils/formatters';
import AppLogo from '@/components/common/AppLogo.vue';
import {
  LayoutDashboard,
  BookOpenCheck,
  FlaskConical,
  Coins,
  FileText,
  Settings
} from 'lucide-vue-next';

const store = useGrowthFlowStore();

const navItems = computed(() => [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard
  },
  {
    id: 'jurnal',
    label: 'Jurnal & Agenda',
    icon: BookOpenCheck,
    badge: store.tasks.filter(t => !t.completed).length || null
  },
  {
    id: 'adlab',
    label: 'Ad Lab',
    icon: FlaskConical,
    badge: store.campaigns.length || null
  },
  {
    id: 'donasi',
    label: 'Donasi & Metrik',
    icon: Coins
  },
  {
    id: 'laporan',
    label: 'Laporan',
    icon: FileText
  },
  {
    id: 'profil',
    label: 'Pengaturan',
    icon: Settings
  }
]);
</script>
