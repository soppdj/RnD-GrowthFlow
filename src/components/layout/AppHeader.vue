<template>
  <header class="no-print sticky top-0 z-30 glass-panel border-b border-teal-100/80 px-4 sm:px-6 py-3 transition-all duration-200">
    <div class="max-w-7xl mx-auto flex items-center justify-between gap-4">
      <!-- Left: Mobile Brand & Tagline with Dynamic R&D Logo -->
      <div class="flex items-center gap-3 shrink-0">
        <button
          @click="$emit('toggle-mobile-menu')"
          class="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-teal-50 hover:text-teal-700 transition-colors cursor-pointer"
          aria-label="Buka Menu"
        >
          <Menu class="w-5 h-5" />
        </button>

        <div class="flex items-center gap-2.5">
          <!-- Relevant R&D GrowthFlow Custom Logo -->
          <AppLogo size="md" />
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-base sm:text-lg font-extrabold tracking-tight text-slate-800 leading-tight">
                R&amp;D GrowthFlow
              </h1>
            </div>
            <p class="text-[11px] text-teal-700/90 font-medium">
              Powered by FatherLab © 2026
            </p>
          </div>
        </div>
      </div>

      <!-- Right: Online Status, Lock Session, Tambah Task, & Profile Card -->
      <div class="flex items-center gap-2 sm:gap-2.5 shrink-0">
        <!-- Lock / Re-authenticate Session Button -->
        <button
          @click="$emit('open-login')"
          class="p-2 rounded-xl text-slate-500 hover:text-teal-800 hover:bg-teal-50 border border-slate-200/80 bg-white transition-all shadow-micro cursor-pointer"
          title="Kunci / Verifikasi Sesi R&D"
        >
          <Lock class="w-3.5 h-3.5" />
        </button>

        <!-- Online / Offline Status -->
        <div
          class="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium border transition-colors shadow-micro bg-white"
          :class="isOnline ? 'text-emerald-700 border-emerald-200 bg-emerald-50/50' : 'text-amber-700 border-amber-200 bg-amber-50/50'"
          :title="isOnline ? 'Terhubung (Online)' : 'Offline Mode (Local Cache Aktif)'"
        >
          <span class="w-2 h-2 rounded-full" :class="isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'"></span>
          <span>{{ isOnline ? 'Online' : 'Offline' }}</span>
        </div>

        <!-- Tambah Task Button (Moved Next to Profile) -->
        <button
          @click="$emit('quick-add-task')"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-soft transition-all duration-200 active:scale-95 cursor-pointer"
        >
          <PlusCircle class="w-4 h-4" />
          <span class="hidden md:inline">Tambah Task</span>
        </button>

        <!-- Profile Avatar Button -->
        <button
          @click="store.setActiveTab('profil')"
          class="flex items-center gap-2 p-1.5 px-2 rounded-xl border border-teal-100 hover:border-teal-300 hover:bg-teal-50/50 transition-all text-left bg-white/70 shadow-micro group cursor-pointer"
          title="Buka Profil & Pengaturan Foto"
        >
          <div class="w-8 h-8 rounded-lg ring-2 ring-teal-500/20 overflow-hidden flex items-center justify-center shrink-0 bg-teal-100 relative">
            <img
              :src="store.profile.avatarUrl"
              :alt="store.profile.fullName"
              class="w-full h-full object-cover transition-transform duration-150"
              :style="{
                transform: `scale(${(store.profile.avatarZoom || 100) / 100})`,
                objectPosition: `${store.profile.avatarX ?? 50}% ${store.profile.avatarY ?? 50}%`
              }"
              @error="onAvatarError"
            />
          </div>
          <div class="hidden lg:block">
            <p class="text-xs font-bold text-slate-800 leading-tight truncate max-w-[130px] group-hover:text-teal-700 transition-colors">
              {{ store.profile.fullName }}
            </p>
            <p class="text-[10px] text-teal-600 font-medium truncate max-w-[130px]">
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
import AppLogo from '@/components/common/AppLogo.vue';
import { Menu, PlusCircle, Lock } from 'lucide-vue-next';

defineEmits(['toggle-mobile-menu', 'quick-add-task', 'open-login']);

const store = useGrowthFlowStore();
const { isOnline } = useSupabase();

function onAvatarError(e) {
  e.target.src = 'https://ui-avatars.com/api/?name=Sopianto+Djahar&background=0d9488&color=fff';
}
</script>
