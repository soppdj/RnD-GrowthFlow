<template>
  <div class="space-y-6 max-w-4xl mx-auto">
    <!-- Header -->
    <div>
      <h2 class="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
        <Settings class="w-5 h-5 text-teal-600" />
        <span>Profil & Pengaturan Sistem</span>
      </h2>
      <p class="text-xs text-slate-500 mt-0.5">
        Konfigurasi identitas organisasi, kapasitas jam kerja, dan integrasi backend Supabase
      </p>
    </div>

    <!-- 1. Profile & Target Form -->
    <div class="glass-card rounded-2xl p-5 sm:p-6 border border-teal-100 shadow-soft">
      <div class="flex items-center justify-between pb-3 mb-4 border-b border-teal-100">
        <h3 class="text-sm font-bold text-slate-800 flex items-center gap-2">
          <User class="w-4 h-4 text-teal-600" />
          <span>Informasi Pengguna & Yayasan</span>
        </h3>
      </div>

      <form @submit.prevent="saveProfile" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Nama Lengkap -->
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Nama Lengkap</label>
            <input
              v-model="profileForm.fullName"
              type="text"
              required
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-teal-500 text-sm font-semibold outline-none"
            />
          </div>

          <!-- Jabatan / Role -->
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Peran / Jabatan</label>
            <input
              v-model="profileForm.role"
              type="text"
              required
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-teal-500 text-sm outline-none"
            />
          </div>

          <!-- Nama Yayasan -->
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Nama Yayasan</label>
            <input
              v-model="profileForm.organization"
              type="text"
              required
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-teal-500 text-sm font-semibold outline-none"
            />
          </div>

          <!-- Target Kuartal -->
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Target Kuartal (Rp)</label>
            <input
              v-model.number="profileForm.quarterTarget"
              type="number"
              step="10000000"
              required
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-teal-500 text-sm font-bold text-teal-800 outline-none"
            />
          </div>

          <!-- Kapasitas Jam Kerja -->
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Kapasitas Jam Kerja (Jam/Hari)</label>
            <input
              v-model.number="profileForm.workCapacityHoursPerDay"
              type="number"
              min="1"
              max="24"
              required
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-teal-500 text-sm outline-none"
            />
          </div>

          <!-- Hari Kerja Per Minggu -->
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Hari Kerja / Minggu</label>
            <input
              v-model.number="profileForm.workDaysPerWeek"
              type="number"
              min="1"
              max="7"
              required
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-teal-500 text-sm outline-none"
            />
          </div>
        </div>

        <!-- Alamat Yayasan -->
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Alamat Resmi Yayasan</label>
          <input
            v-model="profileForm.foundationAddress"
            type="text"
            class="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs outline-none"
          />
        </div>

        <div class="flex items-center justify-between pt-2">
          <span v-if="profileSavedToast" class="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1.5 animate-bounce">
            <Check class="w-3.5 h-3.5" />
            Profil Berhasil Diperbarui!
          </span>
          <span v-else></span>

          <button
            type="submit"
            class="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-soft transition-all active:scale-95"
          >
            <Save class="w-4 h-4" />
            <span>Simpan Profil</span>
          </button>
        </div>
      </form>
    </div>

    <!-- 2. Supabase Integration Backend Card -->
    <div class="glass-card rounded-2xl p-5 sm:p-6 border border-teal-100 shadow-soft">
      <div class="flex items-center justify-between pb-3 mb-4 border-b border-teal-100">
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
            ⚡
          </div>
          <div>
            <h3 class="text-sm font-bold text-slate-800">Integrasi Supabase (Database & Real-time)</h3>
            <p class="text-[11px] text-slate-500">Hubungkan cloud database Supabase untuk sinkronisasi otomatis</p>
          </div>
        </div>

        <span
          class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border"
          :class="isSupabaseActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'"
        >
          <span class="w-2 h-2 rounded-full" :class="isSupabaseActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'"></span>
          {{ isSupabaseActive ? 'Supabase Terhubung' : 'Offline / Local Cache' }}
        </span>
      </div>

      <div class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Supabase Project URL</label>
          <input
            v-model="profileForm.supabaseUrl"
            type="url"
            placeholder="https://your-project.supabase.co"
            class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-teal-500 text-xs font-mono outline-none"
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Supabase Anon Public Key</label>
          <input
            v-model="profileForm.supabaseAnonKey"
            type="password"
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-teal-500 text-xs font-mono outline-none"
          />
        </div>

        <!-- Connection Test Result Message -->
        <div v-if="connectionStatusMessage" class="p-3 rounded-xl text-xs font-medium border" :class="connectionStatusSuccess ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'">
          {{ connectionStatusMessage }}
        </div>

        <div class="flex flex-wrap items-center justify-between gap-2 pt-2">
          <button
            type="button"
            @click="testSupabase"
            :disabled="isTestingConnection"
            class="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white border border-teal-200 hover:bg-teal-50 text-teal-800 transition-colors"
          >
            <Activity class="w-4 h-4 text-teal-600" />
            <span>{{ isTestingConnection ? 'Memeriksa...' : 'Uji Koneksi Supabase' }}</span>
          </button>

          <button
            type="button"
            @click="saveProfile"
            class="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white shadow-soft transition-all"
          >
            <Database class="w-4 h-4" />
            <span>Simpan Kredensial Backend</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 3. Backup, Export, Import & Reset -->
    <div class="glass-card rounded-2xl p-5 sm:p-6 border border-teal-100 shadow-soft">
      <div class="flex items-center justify-between pb-3 mb-4 border-b border-teal-100">
        <h3 class="text-sm font-bold text-slate-800 flex items-center gap-2">
          <HardDrive class="w-4 h-4 text-teal-600" />
          <span>Cadangan & Pemulihan Data (Offline-First)</span>
        </h3>
        <span class="text-xs text-slate-400 font-medium">JSON Data Engine</span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <!-- Export JSON -->
        <button
          @click="exportData"
          class="p-4 rounded-xl border border-teal-100 bg-white hover:bg-teal-50 text-left transition-all group shadow-micro"
        >
          <Download class="w-5 h-5 text-teal-600 group-hover:scale-110 transition-transform mb-2" />
          <p class="text-xs font-bold text-slate-800">Ekspor Data JSON</p>
          <p class="text-[11px] text-slate-500 mt-0.5">Unduh seluruh task, ad lab, dan metrik</p>
        </button>

        <!-- Import JSON -->
        <label
          class="p-4 rounded-xl border border-teal-100 bg-white hover:bg-teal-50 text-left transition-all group shadow-micro cursor-pointer block"
        >
          <Upload class="w-5 h-5 text-indigo-600 group-hover:scale-110 transition-transform mb-2" />
          <p class="text-xs font-bold text-slate-800">Impor Data JSON</p>
          <p class="text-[11px] text-slate-500 mt-0.5">Pulihkan cadangan dari file komputer</p>
          <input type="file" accept=".json" @change="importData" class="hidden" />
        </label>

        <!-- Reset to Mock Data -->
        <button
          @click="resetData"
          class="p-4 rounded-xl border border-rose-100 bg-rose-50/40 hover:bg-rose-50 text-left transition-all group shadow-micro"
        >
          <RefreshCw class="w-5 h-5 text-rose-600 group-hover:rotate-180 transition-transform duration-500 mb-2" />
          <p class="text-xs font-bold text-rose-800">Reset ke Demo Data</p>
          <p class="text-[11px] text-rose-600/80 mt-0.5">Kembalikan contoh data awal Khoirur Rooziqiin</p>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useGrowthFlowStore } from '@/stores/growthFlowStore';
import { useSupabase } from '@/composables/useSupabase';
import {
  Settings,
  User,
  Check,
  Save,
  Activity,
  Database,
  HardDrive,
  Download,
  Upload,
  RefreshCw
} from 'lucide-vue-next';

const store = useGrowthFlowStore();
const { testConnection, initClient } = useSupabase();

const profileForm = ref({ ...store.profile });
const profileSavedToast = ref(false);
const isTestingConnection = ref(false);
const connectionStatusMessage = ref('');
const connectionStatusSuccess = ref(false);

const isSupabaseActive = computed(() => {
  return Boolean(store.profile.supabaseUrl && store.profile.supabaseAnonKey && store.profile.isSupabaseConnected);
});

function saveProfile() {
  store.updateProfile({ ...profileForm.value });
  if (profileForm.value.supabaseUrl && profileForm.value.supabaseAnonKey) {
    initClient(profileForm.value.supabaseUrl, profileForm.value.supabaseAnonKey);
  }
  profileSavedToast.value = true;
  setTimeout(() => {
    profileSavedToast.value = false;
  }, 3000);
}

async function testSupabase() {
  if (!profileForm.value.supabaseUrl || !profileForm.value.supabaseAnonKey) {
    connectionStatusSuccess.value = false;
    connectionStatusMessage.value = 'Harap isi URL dan Anon Key Supabase terlebih dahulu.';
    return;
  }
  isTestingConnection.value = true;
  connectionStatusMessage.value = '';

  const res = await testConnection(profileForm.value.supabaseUrl, profileForm.value.supabaseAnonKey);
  isTestingConnection.value = false;
  connectionStatusSuccess.value = res.success;
  connectionStatusMessage.value = res.message;

  if (res.success) {
    profileForm.value.isSupabaseConnected = true;
    store.updateProfile({ isSupabaseConnected: true });
    // Also trigger initial cloud sync
    store.syncWithSupabase();
  }
}

function exportData() {
  const jsonStr = store.exportDataJSON();
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `rnd-growthflow-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importData(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const res = store.importDataJSON(e.target.result);
    if (res.success) {
      alert('Data berhasil dipulihkan dari cadangan JSON!');
      location.reload();
    } else {
      alert('Gagal membaca file: ' + res.error);
    }
  };
  reader.readAsText(file);
}

function resetData() {
  if (confirm('Kembalikan semua data ke pengaturan demo awal Yayasan Khoirur Rooziqiin?')) {
    store.resetToMockData();
    profileForm.value = { ...store.profile };
    alert('Data berhasil di-reset ke demo awal!');
  }
}
</script>
