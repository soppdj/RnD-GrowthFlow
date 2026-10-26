<template>
  <nav class="no-print lg:hidden fixed bottom-0 left-0 right-0 z-40 glass-panel border-t border-teal-100/90 px-1 py-1.5 shadow-lg">
    <div class="grid grid-cols-6 gap-0.5 items-center">
      <button
        v-for="item in mobileItems"
        :key="item.id"
        @click="store.setActiveTab(item.id)"
        class="flex flex-col items-center justify-center py-1 px-0.5 rounded-xl transition-all relative"
        :class="store.activeTab === item.id 
          ? 'text-teal-700 font-bold bg-teal-50' 
          : 'text-slate-500 hover:text-slate-700'"
      >
        <div class="relative">
          <component :is="item.icon" class="w-4 h-4 sm:w-5 sm:h-5" />
          <span
            v-if="item.badge"
            class="absolute -top-1.5 -right-2 w-3.5 h-3.5 rounded-full bg-teal-600 text-white text-[8px] flex items-center justify-center font-bold"
          >
            {{ item.badge }}
          </span>
        </div>
        <span class="text-[9px] sm:text-[10px] mt-0.5 tracking-tight truncate max-w-full">
          {{ item.label }}
        </span>
      </button>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue';
import { useGrowthFlowStore } from '@/stores/growthFlowStore';
import {
  LayoutDashboard,
  BookOpenCheck,
  FlaskConical,
  Coins,
  FileText,
  Settings
} from 'lucide-vue-next';

const store = useGrowthFlowStore();

const mobileItems = computed(() => [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'jurnal', label: 'Jurnal', icon: BookOpenCheck, badge: store.tasks.filter(t => !t.completed).length || null },
  { id: 'adlab', label: 'Ad Lab', icon: FlaskConical, badge: store.campaigns.length || null },
  { id: 'donasi', label: 'Donasi', icon: Coins },
  { id: 'laporan', label: 'Laporan', icon: FileText },
  { id: 'profil', label: 'Pengaturan', icon: Settings }
]);
</script>
