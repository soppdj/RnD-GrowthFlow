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

      <form @submit.prevent="saveProfile" class="space-y-5">
        <!-- 0. FOTO PROFIL & ADJUSTMENT (ZOOM & POSISI) -->
        <div class="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-teal-50/70 via-white to-emerald-50/40 border border-teal-100 shadow-sm space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-teal-100/80">
            <div>
              <h4 class="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
                <Camera class="w-4 h-4 text-teal-600" />
                <span>Foto Profil & Penyesuaian Tampilan (Adjust Foto)</span>
              </h4>
              <p class="text-[11px] text-slate-500 mt-0.5">
                Unggah foto dari perangkat, sesuaikan zoom & posisi crop secara visual, dan lihat live preview di header
              </p>
            </div>
            
            <button
              type="button"
              @click="resetAvatarAdjustments"
              class="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:text-teal-700 bg-white hover:bg-teal-50 border border-slate-200 rounded-lg shadow-micro transition-colors self-start sm:self-auto"
            >
              <RotateCcw class="w-3.5 h-3.5" />
              <span>Reset Posisi & Zoom</span>
            </button>
          </div>

          <!-- Preview & Controls Grid -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
            <!-- Left: Avatar Preview Frame & Header Chip Mockup (4 cols) -->
            <div class="md:col-span-4 flex flex-col items-center justify-center p-3 bg-white/80 rounded-xl border border-teal-100 shadow-micro space-y-3">
              <!-- Circular / Rounded Preview Box -->
              <div class="relative group">
                <div class="w-28 h-28 rounded-2xl ring-4 ring-teal-500/20 shadow-md overflow-hidden bg-slate-100 flex items-center justify-center relative">
                  <img
                    :src="profileForm.avatarUrl"
                    :alt="profileForm.fullName"
                    class="w-full h-full object-cover select-none pointer-events-none transition-transform duration-75"
                    :style="{
                      transform: `scale(${profileForm.avatarZoom / 100})`,
                      objectPosition: `${profileForm.avatarX}% ${profileForm.avatarY}%`
                    }"
                    @error="onAvatarError"
                  />
                  <div class="absolute inset-0 border border-teal-500/30 rounded-2xl pointer-events-none"></div>
                </div>

                <button
                  type="button"
                  @click="triggerFileInput"
                  class="absolute -bottom-2 -right-2 p-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-soft transition-all active:scale-95"
                  title="Ganti Foto dari Perangkat"
                >
                  <UploadCloud class="w-4 h-4" />
                </button>
              </div>

              <!-- Header Chip Live Preview Indicator -->
              <div class="w-full text-center">
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Tampilan di Header Atas:
                </span>
                <div class="inline-flex items-center gap-2 p-1.5 px-2.5 rounded-xl border border-teal-200 bg-white shadow-micro">
                  <div class="w-7 h-7 rounded-lg ring-1 ring-teal-500/30 overflow-hidden flex items-center justify-center bg-teal-50 shrink-0">
                    <img
                      :src="profileForm.avatarUrl"
                      :alt="profileForm.fullName"
                      class="w-full h-full object-cover"
                      :style="{
                        transform: `scale(${profileForm.avatarZoom / 100})`,
                        objectPosition: `${profileForm.avatarX}% ${profileForm.avatarY}%`
                      }"
                      @error="onAvatarError"
                    />
                  </div>
                  <div class="text-left">
                    <p class="text-[11px] font-bold text-slate-800 leading-tight truncate max-w-[110px]">
                      {{ profileForm.fullName || 'Nama Anda' }}
                    </p>
                    <p class="text-[9px] text-teal-600 font-medium truncate max-w-[110px]">
                      {{ profileForm.organization || 'Yayasan' }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right: Adjustments Sliders, Upload Buttons & Presets (8 cols) -->
            <div class="md:col-span-8 space-y-3.5">
              <!-- Upload & URL Source Buttons -->
              <div class="flex flex-wrap items-center gap-2">
                <input
                  ref="fileInputRef"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handleFileUpload"
                />
                <button
                  type="button"
                  @click="triggerFileInput"
                  class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-micro transition-colors"
                >
                  <Upload class="w-3.5 h-3.5" />
                  <span>Unggah dari File</span>
                </button>

                <button
                  type="button"
                  @click="showUrlInput = !showUrlInput"
                  class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-colors shadow-micro"
                >
                  <Link2 class="w-3.5 h-3.5 text-teal-600" />
                  <span>{{ showUrlInput ? 'Tutup URL' : 'Gunakan URL Foto' }}</span>
                </button>

                <div class="flex items-center gap-1 ml-auto">
                  <span class="text-[10px] text-slate-400 font-medium">Contoh:</span>
                  <button
                    type="button"
                    @click="applyPresetAvatar('sopianto')"
                    class="px-2 py-1 rounded text-[10px] font-bold bg-teal-100 text-teal-800 hover:bg-teal-200 transition-colors"
                  >
                    Foto Formal
                  </button>
                  <button
                    type="button"
                    @click="applyPresetAvatar('ui-avatar')"
                    class="px-2 py-1 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors"
                  >
                    Inisial Nama
                  </button>
                </div>
              </div>

              <!-- URL Input Box (collapsible) -->
              <div v-if="showUrlInput" class="animate-fade-in p-2.5 bg-white rounded-xl border border-teal-200">
                <label class="block text-[10px] font-bold text-slate-600 uppercase mb-1">Direct Image URL</label>
                <div class="flex gap-2">
                  <input
                    v-model="profileForm.avatarUrl"
                    type="url"
                    placeholder="https://example.com/foto.jpg"
                    class="flex-1 px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 outline-none focus:border-teal-500 font-mono"
                    @input="onAdjustmentChange"
                  />
                  <button
                    type="button"
                    @click="showUrlInput = false"
                    class="px-3 py-1.5 text-xs font-bold bg-teal-50 text-teal-700 rounded-lg"
                  >
                    OK
                  </button>
                </div>
              </div>

              <!-- SLIDERS -->
              <div class="space-y-3 pt-1">
                <!-- 1. Zoom Slider -->
                <div class="space-y-1">
                  <div class="flex items-center justify-between text-xs">
                    <span class="font-bold text-slate-700 flex items-center gap-1.5">
                      <ZoomIn class="w-3.5 h-3.5 text-teal-600" />
                      <span>Zoom / Skala Foto</span>
                    </span>
                    <span class="font-mono font-bold text-teal-700 text-[11px] bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {{ profileForm.avatarZoom }}%
                    </span>
                  </div>
                  <div class="flex items-center gap-2">
                    <button
                      type="button"
                      @click="adjustZoom(-10)"
                      class="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center font-bold text-xs"
                      title="Perkecil"
                    >
                      -
                    </button>
                    <input
                      v-model.number="profileForm.avatarZoom"
                      type="range"
                      min="80"
                      max="220"
                      step="5"
                      class="flex-1 accent-teal-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                      @input="onAdjustmentChange"
                    />
                    <button
                      type="button"
                      @click="adjustZoom(10)"
                      class="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center font-bold text-xs"
                      title="Perbesar"
                    >
                      +
                    </button>
                  </div>
                </div>

                <!-- 2. Posisi Vertikal (Y) Slider -->
                <div class="space-y-1">
                  <div class="flex items-center justify-between text-xs">
                    <span class="font-bold text-slate-700 flex items-center gap-1.5">
                      <MoveVertical class="w-3.5 h-3.5 text-teal-600" />
                      <span>Posisi Vertikal (Atas - Bawah)</span>
                    </span>
                    <span class="font-mono font-bold text-slate-600 text-[11px] bg-slate-100 px-2 py-0.5 rounded">
                      {{ profileForm.avatarY }}%
                    </span>
                  </div>
                  <input
                    v-model.number="profileForm.avatarY"
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    class="w-full accent-teal-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                    @input="onAdjustmentChange"
                  />
                  <div class="flex justify-between text-[10px] text-slate-400 font-medium">
                    <span>Atas (Fokus Wajah)</span>
                    <span>Tengah</span>
                    <span>Bawah</span>
                  </div>
                </div>

                <!-- 3. Posisi Horisontal (X) Slider -->
                <div class="space-y-1">
                  <div class="flex items-center justify-between text-xs">
                    <span class="font-bold text-slate-700 flex items-center gap-1.5">
                      <MoveHorizontal class="w-3.5 h-3.5 text-teal-600" />
                      <span>Posisi Horisontal (Kiri - Kanan)</span>
                    </span>
                    <span class="font-mono font-bold text-slate-600 text-[11px] bg-slate-100 px-2 py-0.5 rounded">
                      {{ profileForm.avatarX }}%
                    </span>
                  </div>
                  <input
                    v-model.number="profileForm.avatarX"
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    class="w-full accent-teal-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                    @input="onAdjustmentChange"
                  />
                  <div class="flex justify-between text-[10px] text-slate-400 font-medium">
                    <span>Kiri</span>
                    <span>Tengah</span>
                    <span>Kanan</span>
                  </div>
                </div>

                <!-- Quick Focus Presets Buttons -->
                <div class="flex flex-wrap items-center gap-1.5 pt-1">
                  <span class="text-[10px] font-bold text-slate-500 uppercase mr-1">Fokus Cepat:</span>
                  <button
                    type="button"
                    @click="setQuickFocus(50, 20)"
                    class="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-white hover:bg-teal-50 border border-slate-200 text-slate-700 transition-colors"
                  >
                    👤 Wajah / Kepala
                  </button>
                  <button
                    type="button"
                    @click="setQuickFocus(50, 50)"
                    class="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-white hover:bg-teal-50 border border-slate-200 text-slate-700 transition-colors"
                  >
                    ⚖️ Tengah (Center)
                  </button>
                  <button
                    type="button"
                    @click="setQuickFocus(50, 80)"
                    class="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-white hover:bg-teal-50 border border-slate-200 text-slate-700 transition-colors"
                  >
                    🔻 Badan / Bawah
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

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
  RefreshCw,
  Camera,
  UploadCloud,
  Link2,
  RotateCcw,
  ZoomIn,
  MoveVertical,
  MoveHorizontal
} from 'lucide-vue-next';

const store = useGrowthFlowStore();
const { testConnection, initClient } = useSupabase();

const profileForm = ref({
  ...store.profile,
  avatarZoom: store.profile.avatarZoom || 100,
  avatarX: store.profile.avatarX ?? 50,
  avatarY: store.profile.avatarY ?? 50
});

const profileSavedToast = ref(false);
const isTestingConnection = ref(false);
const connectionStatusMessage = ref('');
const connectionStatusSuccess = ref(false);

const fileInputRef = ref(null);
const showUrlInput = ref(false);

const isSupabaseActive = computed(() => {
  return Boolean(store.profile.supabaseUrl && store.profile.supabaseAnonKey && store.profile.isSupabaseConnected);
});

// Photo Adjustment Handlers
function triggerFileInput() {
  fileInputRef.value?.click();
}

function handleFileUpload(event) {
  const file = event.target?.files?.[0];
  if (!file) return;

  // Max 5MB check
  if (file.size > 5 * 1024 * 1024) {
    alert('Ukuran foto terlalu besar. Harap pilih foto maksimal 5 MB.');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    if (e.target?.result) {
      profileForm.value.avatarUrl = e.target.result;
      onAdjustmentChange();
    }
  };
  reader.readAsDataURL(file);
}

function onAdjustmentChange() {
  // Live sync with store so header immediately reflects the changes
  store.updateProfile({
    avatarUrl: profileForm.value.avatarUrl,
    avatarZoom: profileForm.value.avatarZoom,
    avatarX: profileForm.value.avatarX,
    avatarY: profileForm.value.avatarY
  });
}

function adjustZoom(delta) {
  const current = Number(profileForm.value.avatarZoom) || 100;
  profileForm.value.avatarZoom = Math.min(220, Math.max(80, current + delta));
  onAdjustmentChange();
}

function setQuickFocus(x, y) {
  profileForm.value.avatarX = x;
  profileForm.value.avatarY = y;
  onAdjustmentChange();
}

function resetAvatarAdjustments() {
  profileForm.value.avatarZoom = 100;
  profileForm.value.avatarX = 50;
  profileForm.value.avatarY = 50;
  onAdjustmentChange();
}

function applyPresetAvatar(type) {
  if (type === 'sopianto') {
    profileForm.value.avatarUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250';
  } else if (type === 'ui-avatar') {
    const encodedName = encodeURIComponent(profileForm.value.fullName || 'Sopianto Djahar');
    profileForm.value.avatarUrl = `https://ui-avatars.com/api/?name=${encodedName}&background=0d9488&color=fff&bold=true`;
  }
  resetAvatarAdjustments();
}

function onAvatarError(e) {
  const encodedName = encodeURIComponent(profileForm.value.fullName || 'Sopianto Djahar');
  e.target.src = `https://ui-avatars.com/api/?name=${encodedName}&background=0d9488&color=fff&bold=true`;
}

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
