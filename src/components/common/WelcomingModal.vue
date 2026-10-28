<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-lg animate-fade-in"
  >
    <!-- Background Animated Glow Rings -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-teal-500/25 blur-[100px] animate-pulse"></div>
      <div class="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-emerald-500/25 blur-[100px] animate-pulse delay-700"></div>
    </div>

    <!-- Main Welcoming Card -->
    <div
      class="relative w-full max-w-2xl rounded-3xl bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-teal-950/90 border border-teal-500/30 p-6 sm:p-9 shadow-2xl text-white backdrop-blur-2xl transition-all overflow-hidden"
    >
      <!-- Top Decorative Line -->
      <div class="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400"></div>

      <!-- Close Button -->
      <button
        @click="closeModal"
        class="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        title="Tutup & Masuk"
      >
        <X class="w-5 h-5" />
      </button>

      <!-- Center Logo & Welcoming Header -->
      <div class="flex flex-col items-center text-center space-y-3">
        <!-- Floating Animated Logo -->
        <div class="relative py-2">
          <div class="absolute inset-0 rounded-full bg-teal-400/20 blur-xl animate-ping"></div>
          <AppLogo size="xl" />
        </div>

        <!-- Dynamic Time-Based Greeting -->
        <div class="space-y-1">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold uppercase tracking-wider">
            <span>{{ greetingIcon }}</span>
            <span>{{ timeGreeting }}</span>
          </div>

          <h1 class="text-2xl sm:text-3xl font-black tracking-tight bg-gradient-to-r from-white via-teal-100 to-emerald-300 bg-clip-text text-transparent">
            {{ store.profile.fullName }}
          </h1>

          <p class="text-xs sm:text-sm text-teal-200/90 font-semibold max-w-lg mx-auto">
            {{ store.profile.role }} • {{ store.profile.organization }}
          </p>

          <p class="text-[11px] text-slate-400 italic max-w-md mx-auto pt-0.5">
            "{{ store.profile.tagline || 'Menebar Manfaat Berkelanjutan Melalui Inovasi Digital' }}"
          </p>
        </div>
      </div>

      <!-- 4 Quick Strategic Readiness Cards -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 my-6">
        <!-- Card 1: Target Q4 -->
        <div class="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-teal-500/40 transition-all text-center">
          <span class="text-[10px] font-bold text-teal-300 uppercase block tracking-wider">Target Kuartal</span>
          <span class="text-sm sm:text-base font-extrabold text-white mt-0.5 block">Rp 450 Jt</span>
          <span class="text-[9px] text-slate-400">Target Q4 2026</span>
        </div>

        <!-- Card 2: 9 Standar KPI -->
        <div class="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-teal-500/40 transition-all text-center">
          <span class="text-[10px] font-bold text-emerald-300 uppercase block tracking-wider">Standar KPI</span>
          <span class="text-sm sm:text-base font-extrabold text-emerald-400 mt-0.5 block">9 Corong</span>
          <span class="text-[9px] text-emerald-300/80">SOP Terkalibrasi</span>
        </div>

        <!-- Card 3: Hari Kerja Efektif -->
        <div class="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-teal-500/40 transition-all text-center">
          <span class="text-[10px] font-bold text-cyan-300 uppercase block tracking-wider">Hari Kerja</span>
          <span class="text-sm sm:text-base font-extrabold text-cyan-400 mt-0.5 block">{{ store.profile.workDaysPerWeek || 3 }} Hari</span>
          <span class="text-[9px] text-slate-400">Fokus Efektif</span>
        </div>

        <!-- Card 4: Supabase Sync -->
        <div class="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-teal-500/40 transition-all text-center">
          <span class="text-[10px] font-bold text-amber-300 uppercase block tracking-wider">Database</span>
          <span class="text-sm sm:text-base font-extrabold text-emerald-400 mt-0.5 block flex items-center justify-center gap-1">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Online</span>
          </span>
          <span class="text-[9px] text-slate-400">Supabase Sync</span>
        </div>
      </div>

      <!-- Action Footer -->
      <div class="space-y-3 pt-2">
        <button
          @click="enterWorkspace"
          class="w-full py-3.5 px-6 rounded-2xl font-black text-sm text-white bg-gradient-to-r from-teal-500 via-emerald-600 to-teal-600 hover:from-teal-400 hover:to-emerald-500 shadow-xl shadow-teal-900/50 transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer group"
        >
          <span>Buka Workspace R&amp;D Sekarang</span>
          <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>

        <div class="flex items-center justify-between text-[11px] text-slate-400 pt-1">
          <label class="flex items-center gap-2 cursor-pointer select-none hover:text-teal-200">
            <input
              type="checkbox"
              v-model="alwaysShowWelcome"
              @change="toggleAlwaysShow"
              class="rounded text-teal-600 focus:ring-teal-500"
            />
            <span>Tampilkan welcoming saat membuka aplikasi</span>
          </label>

          <span class="text-[10px] text-teal-400/80 font-mono">
            R&amp;D GrowthFlow v2.0
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useGrowthFlowStore } from '@/stores/growthFlowStore';
import { useConfetti } from '@/composables/useConfetti';
import AppLogo from '@/components/common/AppLogo.vue';
import {
  X,
  ArrowRight
} from 'lucide-vue-next';

defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close']);

const store = useGrowthFlowStore();
const { triggerConfetti } = useConfetti();

const alwaysShowWelcome = ref(localStorage.getItem('rnd_always_show_welcome') !== 'false');

const currentHour = new Date().getHours();

const timeGreeting = computed(() => {
  if (currentHour >= 4 && currentHour < 11) return 'Selamat Pagi';
  if (currentHour >= 11 && currentHour < 15) return 'Selamat Siang';
  if (currentHour >= 15 && currentHour < 18) return 'Selamat Sore';
  return 'Selamat Malam';
});

const greetingIcon = computed(() => {
  if (currentHour >= 4 && currentHour < 11) return '🌅';
  if (currentHour >= 11 && currentHour < 15) return '☀️';
  if (currentHour >= 15 && currentHour < 18) return '🌇';
  return '🌙';
});

function toggleAlwaysShow() {
  localStorage.setItem('rnd_always_show_welcome', String(alwaysShowWelcome.value));
}

function enterWorkspace() {
  triggerConfetti();
  emit('close');
}

function closeModal() {
  emit('close');
}
</script>
