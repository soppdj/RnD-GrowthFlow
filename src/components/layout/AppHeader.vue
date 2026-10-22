<template>
  <header class="no-print sticky top-0 z-30 glass-panel border-b border-teal-100/80 px-4 sm:px-6 py-3 transition-all duration-200">
    <div class="max-w-7xl mx-auto flex items-center justify-between gap-4">
      <!-- Left: Mobile Brand & Tagline -->
      <div class="flex items-center gap-3 shrink-0">
        <button
          @click="$emit('toggle-mobile-menu')"
          class="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-teal-50 hover:text-teal-700 transition-colors"
          aria-label="Buka Menu"
        >
          <Menu class="w-5 h-5" />
        </button>

        <div class="flex items-center gap-2.5">
          <!-- Relevant Modern R&D Growth Icon -->
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-800 via-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-soft ring-2 ring-teal-500/20">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 3v18h18" />
              <path d="m19 9-5 5-4-4-3 3" />
              <circle cx="19" cy="9" r="2" fill="currentColor" />
            </svg>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-base sm:text-lg font-extrabold tracking-tight text-slate-800 leading-tight">
                R&D GrowthFlow
              </h1>
            </div>
            <p class="text-[11px] text-teal-700/90 font-medium">
              Powered by FatherLab © 2026
            </p>
          </div>
        </div>
      </div>

      <!-- Center-Left Actions: Shifted to the Left (GESER) -->
      <div class="hidden sm:flex items-center gap-2.5 flex-1 ml-4 sm:ml-8">
        <!-- Online / Offline Status -->
        <div
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors shadow-micro bg-white"
          :class="isOnline ? 'text-emerald-700 border-emerald-200 bg-emerald-50/50' : 'text-amber-700 border-amber-200 bg-amber-50/50'"
          :title="isOnline ? 'Terhubung (Online)' : 'Offline Mode (Local Cache Aktif)'"
        >
          <span class="w-2 h-2 rounded-full" :class="isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'"></span>
          <span>{{ isOnline ? 'Online' : 'Offline' }}</span>
        </div>

        <!-- Tambah Task Button (Shifted Left) -->
        <button
          @click="$emit('quick-add-task')"
          class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-soft transition-all duration-200 active:scale-95"
        >
          <PlusCircle class="w-4 h-4" />
          <span>Tambah Task</span>
        </button>
      </div>

      <!-- Right: Profile Card Only -->
      <div class="flex items-center gap-2 shrink-0">
        <!-- Mobile-only quick task icon -->
        <button
          @click="$emit('quick-add-task')"
          class="sm:hidden p-2 rounded-xl text-white bg-teal-600 active:scale-95"
          title="Tambah Task"
        >
          <PlusCircle class="w-4 h-4" />
        </button>

        <!-- Profile Avatar Button -->
        <button
          @click="store.setActiveTab('profil')"
          class="flex items-center gap-2 p-1.5 px-2.5 rounded-xl border border-teal-100 hover:border-teal-300 hover:bg-teal-50/50 transition-all text-left bg-white/70 shadow-micro"
        >
          <img
            :src="store.profile.avatarUrl"
            :alt="store.profile.fullName"
            class="w-8 h-8 rounded-lg object-cover ring-2 ring-teal-500/20"
            @error="onAvatarError"
          />
          <div class="hidden md:block">
            <p class="text-xs font-bold text-slate-800 leading-tight truncate max-w-[140px]">
              {{ store.profile.fullName }}
            </p>
            <p class="text-[10px] text-teal-600 font-medium truncate max-w-[140px]">
              {{ store.profile.organization }}
            </p>
          </div>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useGrowthFlowStore } from '@/stores/growthFlowStore';
import { useSupabase } from '@/composables/useSupabase';
import { Menu, PlusCircle } from 'lucide-vue-next';

defineEmits(['toggle-mobile-menu', 'quick-add-task']);

const store = useGrowthFlowStore();
const { isOnline } = useSupabase();

function onAvatarError(e) {
  e.target.src = 'https://ui-avatars.com/api/?name=Sopianto+Djahar&background=0d9488&color=fff';
}
</script>
