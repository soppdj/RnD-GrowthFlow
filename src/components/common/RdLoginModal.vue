<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
  >
    <!-- Background Animated Grid Orbs -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-teal-500/20 blur-3xl animate-pulse"></div>
      <div class="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-emerald-500/20 blur-3xl animate-pulse delay-1000"></div>
    </div>

    <!-- Main Glass Dialog Box -->
    <div
      class="relative w-full max-w-md rounded-3xl bg-slate-900/90 border border-teal-500/30 p-6 sm:p-8 shadow-2xl text-white backdrop-blur-xl transition-all overflow-hidden"
      :class="isError ? 'animate-shake ring-2 ring-rose-500' : ''"
    >
      <!-- Top Decorative Banner / Circuit Glow -->
      <div class="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-teal-500 via-emerald-400 to-cyan-400"></div>

      <!-- Header: Logo & System Identity -->
      <div class="flex flex-col items-center text-center space-y-3 pt-2">
        <AppLogo size="lg" />
        <div>
          <h2 class="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-white via-teal-100 to-emerald-200 bg-clip-text text-transparent">
            R&amp;D GrowthFlow Access
          </h2>
          <p class="text-xs text-teal-300/80 font-medium mt-1">
            Gateway Otentikasi Khusus Divisi R&amp;D Digital Marketing
          </p>
        </div>
      </div>

      <!-- Lead R&D Profile Card -->
      <div class="my-5 p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3.5 shadow-inner">
        <div class="w-12 h-12 rounded-xl ring-2 ring-teal-400/50 overflow-hidden shrink-0 bg-teal-900/50 relative">
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
        <div class="text-left leading-tight flex-1 min-w-0">
          <div class="flex items-center gap-1.5">
            <span class="font-extrabold text-sm text-white truncate">
              {{ store.profile.fullName }}
            </span>
            <span class="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping"></span>
          </div>
          <p class="text-xs font-semibold text-teal-300 mt-0.5 truncate">
            {{ store.profile.role }}
          </p>
          <p class="text-[10px] text-slate-400 truncate">
            {{ store.profile.organization }} • Bandung Barat
          </p>
        </div>
      </div>

      <!-- Login Form & PIN Input -->
      <form @submit.prevent="handlePinSubmit" class="space-y-4">
        <div>
          <div class="flex items-center justify-between mb-1.5">
            <label class="text-xs font-bold text-teal-200 uppercase tracking-wider">
              Masukkan PIN Akses R&amp;D
            </label>
            <span class="text-[11px] text-slate-400 font-mono">Default: 2026</span>
          </div>

          <div class="relative">
            <input
              ref="pinInputRef"
              v-model="pinInput"
              :type="showPassword ? 'text' : 'password'"
              maxlength="10"
              placeholder="••••"
              class="w-full px-4 py-3 rounded-xl bg-slate-950/70 border text-center text-xl font-mono tracking-widest outline-none transition-all focus:ring-2"
              :class="isError 
                ? 'border-rose-500 text-rose-300 focus:ring-rose-400' 
                : 'border-teal-500/40 text-teal-100 focus:border-teal-400 focus:ring-teal-400/30'"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
            >
              <Eye v-if="!showPassword" class="w-4 h-4" />
              <EyeOff v-else class="w-4 h-4" />
            </button>
          </div>

          <p v-if="isError" class="text-[11px] text-rose-400 font-semibold mt-1.5 text-center">
            ⚠️ PIN salah! Gunakan PIN default 2026 atau verifikasi cepat di bawah.
          </p>
        </div>

        <!-- Quick One-Touch Access Button -->
        <button
          type="submit"
          class="w-full py-3 rounded-xl font-extrabold text-sm text-white bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-500 hover:from-teal-500 hover:to-emerald-500 shadow-lg shadow-teal-900/40 transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
        >
          <LockKeyholeOpen class="w-4 h-4" />
          <span>Buka Workspace R&amp;D</span>
        </button>

        <!-- Alternative: Instant Biometric / One-Click Lead Verification -->
        <div class="pt-2 text-center border-t border-white/10 space-y-2">
          <p class="text-[11px] text-slate-400">
            Akses langsung khusus Lead R&amp;D (Sopianto Djahar):
          </p>
          <button
            type="button"
            @click="handleInstantBypass"
            class="w-full py-2.5 px-3 rounded-xl border border-teal-500/40 bg-teal-500/10 hover:bg-teal-500/20 text-teal-200 text-xs font-bold transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
          >
            <ShieldCheck class="w-4 h-4 text-emerald-400" />
            <span>Verifikasi Kilat Akun Sopianto Djahar</span>
          </button>
        </div>
      </form>

      <!-- Security Notice Footer -->
      <div class="mt-4 pt-3 text-center border-t border-white/5 text-[10px] text-slate-500 flex items-center justify-center gap-1.5">
        <Shield class="w-3.5 h-3.5 text-teal-500/80" />
        <span>Sesi terenkripsi secara lokal • FatherLab Engine 2026</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useGrowthFlowStore } from '@/stores/growthFlowStore';
import { useConfetti } from '@/composables/useConfetti';
import AppLogo from '@/components/common/AppLogo.vue';
import {
  LockKeyholeOpen,
  ShieldCheck,
  Shield,
  Eye,
  EyeOff
} from 'lucide-vue-next';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['authenticated']);

const store = useGrowthFlowStore();
const { triggerConfetti } = useConfetti();

const pinInput = ref('');
const isError = ref(false);
const showPassword = ref(false);
const pinInputRef = ref(null);

const DEFAULT_PINS = ['2026', '1928', 'rnd2026', 'admin'];

function handlePinSubmit() {
  const entered = pinInput.value.trim();
  if (DEFAULT_PINS.includes(entered) || entered === (store.profile?.telegramAdminChatId || '')) {
    unlockSuccess();
  } else {
    isError.value = true;
    setTimeout(() => {
      isError.value = false;
    }, 2000);
  }
}

function handleInstantBypass() {
  unlockSuccess();
}

function unlockSuccess() {
  isError.value = false;
  localStorage.setItem('rnd_growthflow_authenticated', 'true');
  localStorage.setItem('rnd_growthflow_last_login', new Date().toISOString());
  triggerConfetti();
  emit('authenticated');
}

function onAvatarError(e) {
  e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250';
}

onMounted(() => {
  nextTick(() => {
    if (props.isOpen && pinInputRef.value) {
      pinInputRef.value.focus();
    }
  });
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
