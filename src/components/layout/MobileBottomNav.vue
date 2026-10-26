<template>
  <nav class="no-print lg:hidden fixed bottom-0 left-0 right-0 z-40 glass-panel border-t border-teal-100/90 px-2 py-1.5 shadow-lg">
    <div class="grid grid-cols-3 gap-1 items-center">
      <button
        v-for="item in mobileItems"
        :key="item.id"
        @click="store.setActiveTab(item.id)"
        class="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all relative"
        :class="store.activeTab === item.id 
          ? 'text-teal-700 font-bold bg-teal-50' 
          : 'text-slate-500 hover:text-slate-700'"
      >
        <div class="relative">
          <component :is="item.icon" class="w-5 h-5" />
          <span
            v-if="item.badge"
            class="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-teal-600 text-white text-[9px] flex items-center justify-center font-bold"
          >
            {{ item.badge }}
          </span>
        </div>
        <span class="text-[10px] mt-0.5 tracking-tight truncate max-w-full">
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
  Coins
} from 'lucide-vue-next';

const store = useGrowthFlowStore();

const mobileItems = computed(() => [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'jurnal', label: 'Jurnal & Agenda', icon: BookOpenCheck, badge: store.tasks.filter(t => !t.completed).length || null },
  { id: 'donasi', label: 'Donasi & Metrik', icon: Coins }
]);
</script>
