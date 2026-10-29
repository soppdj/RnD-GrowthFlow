<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 min-h-screen w-full flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-2xl text-white overflow-y-auto select-none animate-fade-in"
  >
    <!-- Background Animated Neon Glow Orbs & Subtle Cyber Grid -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden">
      <div class="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-teal-500/15 blur-[120px] animate-pulse"></div>
      <div class="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-emerald-500/15 blur-[120px] animate-pulse" style="animation-delay: 1.5s;"></div>
      <div class="absolute inset-0 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:24px_24px] opacity-10"></div>
    </div>

    <!-- Main Luxury Glass Card -->
    <div
      class="relative w-full max-w-sm sm:max-w-md rounded-3xl bg-slate-900/90 border border-teal-500/30 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl transition-all overflow-hidden"
      :class="isError ? 'animate-shake ring-2 ring-rose-500/70 border-rose-500/80' : isSuccess ? 'ring-2 ring-emerald-500/70 border-emerald-500/80' : ''"
    >
      <!-- Top Neon Gradient Bar -->
      <div class="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400"></div>

      <!-- Header: Logo & System Identity -->
      <div class="flex flex-col items-center text-center space-y-2 pt-1">
        <div class="relative py-1">
          <div class="absolute inset-0 rounded-2xl bg-teal-400/20 blur-xl animate-pulse"></div>
          <AppLogo size="lg" />
        </div>
        <div>
          <h2 class="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center justify-center gap-1.5">
            <span>R&amp;D GrowthFlow</span>
            <span class="text-[9px] px-1.5 py-0.5 rounded-md font-black bg-teal-500/20 text-teal-300 border border-teal-500/40 uppercase tracking-wider">
              Security
            </span>
          </h2>
          <p class="text-[11px] text-teal-300/80 font-medium mt-0.5">
            Gateway Akses Eksklusif Tim R&amp;D Digital Marketing
          </p>
        </div>
      </div>

      <!-- Verified Lead PIC Profile Card -->
      <div class="my-4 p-3 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center gap-3 text-left shadow-inner">
        <div class="w-11 h-11 rounded-xl ring-2 ring-teal-400/40 overflow-hidden shrink-0 bg-teal-950/60 relative">
          <img
            :src="store.profile.avatarUrl"
            :alt="store.profile.fullName"
            class="w-full h-full object-cover"
            :style="{
              transform: `scale(${(store.profile.avatarZoom || 100) / 100})`,
              objectPosition: `${store.profile.avatarX ?? 50}% ${store.profile.avatarY ?? 50}%`
            }"
            @error="onAvatarError"
          />
        </div>
        <div class="flex-1 min-w-0 leading-tight">
          <div class="flex items-center gap-1.5">
            <span class="font-extrabold text-sm text-white truncate">
              {{ store.profile.fullName }}
            </span>
            <span class="w-2 h-2 rounded-full bg-emerald-400 shrink-0 animate-ping"></span>
          </div>
          <p class="text-[11px] font-semibold text-teal-300 mt-0.5 truncate">
            {{ store.profile.role }}
          </p>
          <p class="text-[10px] text-slate-400 truncate">
            {{ store.profile.organization }}
          </p>
        </div>
      </div>

      <!-- Login Form & PIN Input (UI Seperti Sebelumnya, Tanpa Keyboard Virtual di Layar) -->
      <form @submit.prevent="handlePinSubmit" class="space-y-4 my-2">
        <div>
          <label class="block text-[11px] font-bold text-teal-200 uppercase tracking-wider mb-2 text-center">
            Masukkan PIN Akses R&amp;D
          </label>

          <div class="relative">
            <input
              ref="pinInputRef"
              v-model="pinInput"
              :type="showPassword ? 'text' : 'password'"
              inputmode="numeric"
              pattern="[0-9]*"
              maxlength="6"
              placeholder="••••••"
              class="w-full px-4 py-3 rounded-2xl bg-slate-950/80 border text-center text-2xl font-mono font-black tracking-[0.35em] text-white outline-none transition-all shadow-inner focus:ring-4"
              :class="isError
                ? 'border-rose-500 text-rose-300 focus:ring-rose-500/30 ring-2 ring-rose-500/30'
                : isSuccess
                  ? 'border-emerald-400 text-emerald-300 ring-2 ring-emerald-400/30'
                  : 'border-teal-500/40 text-teal-100 focus:border-teal-400 focus:ring-teal-500/30'"
              autocomplete="off"
              autofocus
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
              :title="showPassword ? 'Sembunyikan PIN' : 'Lihat PIN'"
            >
              <Eye v-if="!showPassword" class="w-4 h-4" />
              <EyeOff v-else class="w-4 h-4 text-teal-300" />
            </button>
          </div>

          <!-- Status & Feedback Alert -->
          <div class="min-h-[22px] mt-2 flex items-center justify-center">
            <p v-if="isError" class="text-xs text-rose-400 font-bold flex items-center gap-1.5 animate-bounce">
              <AlertCircle class="w-3.5 h-3.5" />
              <span>PIN salah! Silakan coba kembali.</span>
            </p>
            <p v-else-if="isSuccess" class="text-xs text-emerald-400 font-bold flex items-center gap-1.5 animate-pulse">
              <CheckCircle2 class="w-3.5 h-3.5" />
              <span>Verifikasi Berhasil! Membuka Workspace...</span>
            </p>
            <p v-else class="text-[11px] text-slate-400">
              Tekan Enter atau klik tombol di bawah untuk masuk
            </p>
          </div>
        </div>

        <!-- Submit Button (Buka Workspace R&D) -->
        <button
          type="submit"
          :disabled="isSuccess"
          class="w-full py-3 sm:py-3.5 rounded-2xl font-black text-sm text-white bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-600 hover:from-teal-400 hover:to-emerald-400 shadow-lg shadow-teal-950/60 transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
        >
          <LockKeyholeOpen class="w-4 h-4" />
          <span>Buka Workspace R&amp;D</span>
        </button>
      </form>

      <!-- Security Notice Footer -->
      <div class="mt-4 pt-3 text-center border-t border-white/10 text-[10px] text-slate-500 flex items-center justify-center gap-1.5">
        <ShieldCheck class="w-3.5 h-3.5 text-teal-400/90" />
        <span>Sesi terproteksi enkripsi lokal • FatherLab Engine 2026</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue';
import { useGrowthFlowStore } from '@/stores/growthFlowStore';
import AppLogo from '@/components/common/AppLogo.vue';
import {
  LockKeyholeOpen,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ShieldCheck
} from 'lucide-vue-next';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['authenticated']);

const store = useGrowthFlowStore();

const pinInput = ref('');
const isError = ref(false);
const isSuccess = ref(false);
const showPassword = ref(false);
const pinInputRef = ref(null);

// Daftar PIN yang diizinkan (Standard PIN R&D Yayasan)
const VALID_PINS = ['000000', '2026', '1928', '261026', '281026', 'admin'];

function focusInput() {
  nextTick(() => {
    if (pinInputRef.value) {
      pinInputRef.value.focus();
    }
  });
}

function handlePinSubmit() {
  if (isSuccess.value) return;

  const entered = pinInput.value.trim();
  const adminChatId = String(store.profile?.telegramAdminChatId || '').trim();

  const isMatched =
    VALID_PINS.includes(entered) ||
    (adminChatId && (entered === adminChatId || entered === adminChatId.slice(-6)));

  if (isMatched) {
    isSuccess.value = true;
    isError.value = false;
    localStorage.setItem('rnd_growthflow_authenticated', 'true');
    localStorage.setItem('rnd_growthflow_last_login', new Date().toISOString());

    setTimeout(() => {
      emit('authenticated');
      isSuccess.value = false;
      pinInput.value = '';
    }, 400);
  } else {
    isError.value = true;
    isSuccess.value = false;

    // Reset otomatis setelah 1.5 detik
    setTimeout(() => {
      isError.value = false;
      pinInput.value = '';
      focusInput();
    }, 1500);
  }
}

function onAvatarError(e) {
  e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250';
}

watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      pinInput.value = '';
      isError.value = false;
      isSuccess.value = false;
      focusInput();
    }
  }
);

onMounted(() => {
  if (props.isOpen) {
    focusInput();
  }
});
</script>

<style scoped>
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-6px); }
  40%, 80% { transform: translateX(6px); }
}
.animate-shake {
  animation: shake 0.4s ease-in-out;
}
</style>
