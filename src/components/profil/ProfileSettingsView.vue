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
        <!-- 0. FOTO PROFIL (LANGSUNG ADJUST DI KOTAK FOTO) -->
        <div class="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-4 rounded-2xl bg-teal-50/40 border border-teal-100">
          <!-- Kotak Foto Interaktif -->
          <div class="flex flex-col items-center gap-2 shrink-0">
            <div
              ref="photoBoxRef"
              @mousedown="onPhotoMouseDown"
              @touchstart.passive="onPhotoTouchStart"
              @touchmove.prevent="onPhotoTouchMove"
              @touchend="onPhotoTouchEnd"
              @wheel.prevent="onPhotoWheel"
              @dblclick="resetAvatarAdjustments"
              class="w-36 h-36 rounded-2xl ring-4 ring-teal-500/20 shadow-md overflow-hidden bg-slate-100 relative cursor-grab active:cursor-grabbing select-none group border border-teal-200"
              title="Klik & geser untuk atur posisi • Scroll mouse untuk zoom • Dobel-klik untuk reset"
            >
              <img
                :src="profileForm.avatarUrl"
                :alt="profileForm.fullName"
                class="w-full h-full object-cover select-none pointer-events-none transition-transform duration-75"
                :style="{
                  transform: `scale(${(profileForm.avatarZoom || 100) / 100})`,
                  objectPosition: `${profileForm.avatarX ?? 50}% ${profileForm.avatarY ?? 50}%`
                }"
                @error="onAvatarError"
              />

              <!-- Hover hint overlay -->
              <div class="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <span class="text-[10px] font-bold text-white bg-slate-900/75 px-2 py-0.5 rounded shadow">
                  Geser / Drag Foto
                </span>
              </div>

              <!-- Floating upload button on avatar -->
              <button
                type="button"
                @click.stop="triggerFileInput"
                class="absolute bottom-2 right-2 p-1.5 rounded-lg bg-teal-700/90 hover:bg-teal-700 text-white shadow-soft transition-all active:scale-95 z-10"
                title="Ganti Foto"
              >
                <Camera class="w-3.5 h-3.5" />
              </button>
            </div>

            <input
              ref="fileInputRef"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleFileUpload"
            />

            <!-- Minimal Zoom Control right below photo box -->
            <div class="flex items-center gap-1.5 w-36 px-1">
              <button
                type="button"
                @click="adjustZoom(-10)"
                class="w-6 h-6 rounded-md bg-white border border-slate-200 hover:bg-teal-50 text-slate-600 font-bold text-xs flex items-center justify-center shrink-0"
                title="Perkecil Zoom"
              >
                -
              </button>
              <input
                v-model.number="profileForm.avatarZoom"
                type="range"
                min="80"
                max="220"
                step="5"
                class="flex-1 accent-teal-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                @input="onAdjustmentChange"
                title="Zoom Foto"
              />
              <button
                type="button"
                @click="adjustZoom(10)"
                class="w-6 h-6 rounded-md bg-white border border-slate-200 hover:bg-teal-50 text-slate-600 font-bold text-xs flex items-center justify-center shrink-0"
                title="Perbesar Zoom"
              >
                +
              </button>
              <button
                type="button"
                @click="resetAvatarAdjustments"
                class="w-6 h-6 rounded-md bg-white border border-slate-200 hover:bg-teal-50 text-slate-400 hover:text-teal-700 flex items-center justify-center shrink-0 text-[11px]"
                title="Reset Posisi & Zoom"
              >
                <RotateCcw class="w-3 h-3" />
              </button>
            </div>
            <span class="text-[10px] text-slate-400 text-center">
              Geser langsung di foto untuk atur posisi
            </span>
          </div>

          <!-- Keterangan & Aksi Cepat -->
          <div class="flex-1 space-y-2 text-center sm:text-left pt-1">
            <h4 class="text-sm font-bold text-slate-800">
              Foto Profil Pengguna
            </h4>
            <p class="text-xs text-slate-500">
              Foto ini tampil di header atas aplikasi. Cukup klik & geser langsung di dalam kotak foto untuk mengatur posisi crop yang pas.
            </p>
            <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              <button
                type="button"
                @click="triggerFileInput"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-micro transition-colors active:scale-95"
              >
                <Upload class="w-3.5 h-3.5" />
                <span>Unggah Foto dari Perangkat</span>
              </button>
              <button
                type="button"
                @click="applyPresetAvatar('ui-avatar')"
                class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-teal-50 border border-slate-200 text-slate-700 transition-colors"
              >
                <span>Pakai Inisial Nama</span>
              </button>
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

    <!-- 3. Integrasi Bot Telegram (Input & Edit Donasi Real-time) -->
    <div class="glass-card rounded-2xl p-5 sm:p-6 border border-teal-100 shadow-soft space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-teal-100 gap-2">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center font-bold text-sm shrink-0 shadow-micro">
            <Send class="w-4 h-4" />
          </div>
          <div>
            <h3 class="text-sm font-bold text-slate-800">
              Integrasi Bot Telegram (Input & Edit Donasi)
            </h3>
            <p class="text-[11px] text-slate-500">
              Tambah atau perbarui donasi langsung lewat chat Telegram yang tersinkronisasi live ke web
            </p>
          </div>
        </div>

        <span
          class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border self-start sm:self-auto"
          :class="profileForm.telegramBotToken ? 'bg-sky-50 text-sky-700 border-sky-200' : 'bg-slate-100 text-slate-500 border-slate-200'"
        >
          <span class="w-2 h-2 rounded-full" :class="profileForm.telegramBotToken ? 'bg-sky-500 animate-pulse' : 'bg-slate-400'"></span>
          {{ profileForm.telegramBotToken ? 'Bot Dikonfigurasi' : 'Belum Dikonfigurasi' }}
        </span>
      </div>

      <!-- Panduan Setup -->
      <div class="p-3.5 rounded-xl bg-sky-50/60 border border-sky-100 text-xs text-slate-600 space-y-1.5">
        <p class="font-bold text-sky-900 flex items-center gap-1">
          <span>Cara Menghubungkan Bot Telegram ke R&D GrowthFlow:</span>
        </p>
        <ol class="list-decimal list-inside space-y-1 text-[11px] text-slate-600">
          <li>Buka aplikasi Telegram, cari akun <strong class="text-sky-800">@BotFather</strong> lalu kirim perintah <code class="bg-white px-1.5 py-0.5 rounded border border-sky-200 font-mono">/newbot</code>.</li>
          <li>Ikuti petunjuk untuk memberi nama bot dan salin <strong>HTTP API Token</strong> yang diberikan.</li>
          <li>Untuk membatasi akses (agar hanya Anda yang bisa menginput), cari bot <strong class="text-sky-800">@userinfobot</strong> di Telegram untuk mendapatkan <strong>Chat ID</strong> Anda.</li>
          <li>Masukkan Token dan Chat ID di bawah, klik <strong>Simpan Pengaturan</strong>, lalu klik <strong>Aktifkan Webhook</strong>.</li>
        </ol>
      </div>

      <!-- Form Inputs Token & Chat ID -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase mb-1">
            Telegram Bot Token
          </label>
          <input
            v-model="profileForm.telegramBotToken"
            type="password"
            placeholder="Contoh: 123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ"
            class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-teal-500 text-xs font-mono outline-none"
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase mb-1">
            Admin Telegram Chat ID (ID Akun Anda)
          </label>
          <input
            v-model="profileForm.telegramAdminChatId"
            type="text"
            placeholder="Contoh: 123456789 (dari @userinfobot)"
            class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-teal-500 text-xs font-mono outline-none"
          />
        </div>
      </div>

      <!-- Webhook URL Display & Action Buttons -->
      <div class="p-3.5 bg-slate-50/90 rounded-xl border border-slate-200 space-y-2.5">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              URL Endpoint Webhook Vercel:
            </span>
            <code class="text-xs text-teal-800 font-mono font-semibold select-all break-all">
              {{ currentWebhookUrl }}
            </code>
          </div>

          <div class="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              @click="setupTelegramWebhook"
              :disabled="!profileForm.telegramBotToken || isSettingWebhook"
              class="px-3 py-1.5 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-700 disabled:bg-slate-200 disabled:text-slate-400 text-white shadow-micro transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Send class="w-3.5 h-3.5" />
              <span>{{ isSettingWebhook ? 'Menghubungkan...' : 'Aktifkan Webhook' }}</span>
            </button>

            <button
              type="button"
              @click="testTelegramBotMessage"
              :disabled="!profileForm.telegramBotToken || !profileForm.telegramAdminChatId || isSendingTest"
              class="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 disabled:bg-slate-100 disabled:text-slate-400 text-slate-700 border border-slate-200 transition-colors shadow-micro flex items-center gap-1.5"
            >
              <Activity class="w-3.5 h-3.5 text-teal-600" />
              <span>{{ isSendingTest ? 'Mengirim...' : 'Uji Kirim Pesan' }}</span>
            </button>
          </div>
        </div>

        <div v-if="telegramStatusMessage" class="p-2.5 rounded-lg text-xs font-medium border" :class="telegramStatusSuccess ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'">
          {{ telegramStatusMessage }}
        </div>
      </div>

      <!-- Format Perintah Bot Telegram -->
      <div class="pt-1">
        <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Panduan Perintah Pesan Telegram:
        </h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div class="p-3 rounded-xl bg-white border border-slate-200 shadow-micro">
            <code class="font-bold text-teal-800 block mb-1">/tambah Nama | Target | Realisasi | AdSpend | Donatur</code>
            <p class="text-[11px] text-slate-500">
              Menambah program baru. Bisa pakai singkatan angka: <em>50jt</em>, <em>2.5jt</em>, <em>500rb</em>.
            </p>
            <p class="text-[10px] text-slate-400 mt-1 font-mono">
              Contoh: /tambah Wakaf Ambulans | 150jt | 30jt | 4jt | 150
            </p>
          </div>

          <div class="p-3 rounded-xl bg-white border border-slate-200 shadow-micro">
            <code class="font-bold text-teal-800 block mb-1">/edit Nama/ID | Realisasi | AdSpend | Donatur</code>
            <p class="text-[11px] text-slate-500">
              Mengupdate capaian donasi dan belanja iklan secara langsung.
            </p>
            <p class="text-[10px] text-slate-400 mt-1 font-mono">
              Contoh: /edit Wakaf Sumur | 45jt | 6jt | 250
            </p>
          </div>

          <div class="p-3 rounded-xl bg-white border border-slate-200 shadow-micro">
            <code class="font-bold text-teal-800 block mb-1">/donasi atau /list</code>
            <p class="text-[11px] text-slate-500">
              Menampilkan seluruh program donasi aktif, persentase capaian target, CPR, dan ROI.
            </p>
          </div>

          <div class="p-3 rounded-xl bg-white border border-slate-200 shadow-micro">
            <code class="font-bold text-teal-800 block mb-1">/kpi</code>
            <p class="text-[11px] text-slate-500">
              Ringkasan performa agregat ZISWAF dan capaian target kuartal Yayasan Khoirur Rooziqiin.
            </p>
          </div>
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
  RotateCcw,
  Send
} from 'lucide-vue-next';

const store = useGrowthFlowStore();
const { testConnection, initClient } = useSupabase();

const profileForm = ref({
  ...store.profile,
  avatarZoom: store.profile.avatarZoom || 100,
  avatarX: store.profile.avatarX ?? 50,
  avatarY: store.profile.avatarY ?? 50,
  telegramBotToken: store.profile.telegramBotToken || '',
  telegramAdminChatId: store.profile.telegramAdminChatId || ''
});

const profileSavedToast = ref(false);
const isTestingConnection = ref(false);
const connectionStatusMessage = ref('');
const connectionStatusSuccess = ref(false);

const fileInputRef = ref(null);
const photoBoxRef = ref(null);

// Telegram Webhook state
const isSettingWebhook = ref(false);
const isSendingTest = ref(false);
const telegramStatusMessage = ref('');
const telegramStatusSuccess = ref(false);

const currentWebhookUrl = computed(() => {
  if (typeof window !== 'undefined' && window.location.origin) {
    return `${window.location.origin}/api/telegram-webhook`;
  }
  return 'https://rnd-growthflow.vercel.app/api/telegram-webhook';
});

const isSupabaseActive = computed(() => {
  return Boolean(store.profile.supabaseUrl && store.profile.supabaseAnonKey && store.profile.isSupabaseConnected);
});

// Photo Adjustment Handlers - Direct Drag / Pan on Photo Box
const isDraggingPhoto = ref(false);
let dragStartX = 0;
let dragStartY = 0;
let initialAvatarX = 50;
let initialAvatarY = 50;

function onPhotoMouseDown(e) {
  isDraggingPhoto.value = true;
  dragStartX = e.clientX;
  dragStartY = e.clientY;
  initialAvatarX = profileForm.value.avatarX ?? 50;
  initialAvatarY = profileForm.value.avatarY ?? 50;

  window.addEventListener('mousemove', onPhotoMouseMove);
  window.addEventListener('mouseup', onPhotoMouseUp);
}

function onPhotoMouseMove(e) {
  if (!isDraggingPhoto.value) return;
  const boxWidth = photoBoxRef.value?.clientWidth || 144;
  const boxHeight = photoBoxRef.value?.clientHeight || 144;

  const deltaX = e.clientX - dragStartX;
  const deltaY = e.clientY - dragStartY;

  // Dragging right reveals left portion -> decrease X; dragging left reveals right -> increase X
  const deltaPercentX = (deltaX / boxWidth) * 100;
  const deltaPercentY = (deltaY / boxHeight) * 100;

  const newX = Math.min(100, Math.max(0, Math.round(initialAvatarX - deltaPercentX)));
  const newY = Math.min(100, Math.max(0, Math.round(initialAvatarY - deltaPercentY)));

  profileForm.value.avatarX = newX;
  profileForm.value.avatarY = newY;
  onAdjustmentChange();
}

function onPhotoMouseUp() {
  if (isDraggingPhoto.value) {
    isDraggingPhoto.value = false;
    window.removeEventListener('mousemove', onPhotoMouseMove);
    window.removeEventListener('mouseup', onPhotoMouseUp);
  }
}

function onPhotoTouchStart(e) {
  if (e.touches && e.touches[0]) {
    isDraggingPhoto.value = true;
    dragStartX = e.touches[0].clientX;
    dragStartY = e.touches[0].clientY;
    initialAvatarX = profileForm.value.avatarX ?? 50;
    initialAvatarY = profileForm.value.avatarY ?? 50;
  }
}

function onPhotoTouchMove(e) {
  if (!isDraggingPhoto.value || !e.touches || !e.touches[0]) return;
  const boxWidth = photoBoxRef.value?.clientWidth || 144;
  const boxHeight = photoBoxRef.value?.clientHeight || 144;

  const deltaX = e.touches[0].clientX - dragStartX;
  const deltaY = e.touches[0].clientY - dragStartY;

  const deltaPercentX = (deltaX / boxWidth) * 100;
  const deltaPercentY = (deltaY / boxHeight) * 100;

  const newX = Math.min(100, Math.max(0, Math.round(initialAvatarX - deltaPercentX)));
  const newY = Math.min(100, Math.max(0, Math.round(initialAvatarY - deltaPercentY)));

  profileForm.value.avatarX = newX;
  profileForm.value.avatarY = newY;
  onAdjustmentChange();
}

function onPhotoTouchEnd() {
  isDraggingPhoto.value = false;
}

function onPhotoWheel(e) {
  const delta = e.deltaY < 0 ? 5 : -5;
  adjustZoom(delta);
}

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

// Telegram Webhook Activation & Testing
async function setupTelegramWebhook() {
  if (!profileForm.value.telegramBotToken) {
    telegramStatusSuccess.value = false;
    telegramStatusMessage.value = 'Silakan masukkan Telegram Bot Token terlebih dahulu.';
    return;
  }

  isSettingWebhook.value = true;
  telegramStatusMessage.value = '';

  try {
    const url = `https://api.telegram.org/bot${profileForm.value.telegramBotToken.trim()}/setWebhook?url=${encodeURIComponent(currentWebhookUrl.value)}`;
    const response = await fetch(url);
    const data = await response.json();

    isSettingWebhook.value = false;
    if (data.ok) {
      telegramStatusSuccess.value = true;
      telegramStatusMessage.value = `✅ Webhook berhasil diaktifkan ke: ${currentWebhookUrl.value}. Bot siap menerima perintah!`;
      saveProfile();
    } else {
      telegramStatusSuccess.value = false;
      telegramStatusMessage.value = `❌ Gagal mengaktifkan webhook: ${data.description || 'Token tidak valid'}`;
    }
  } catch (err) {
    isSettingWebhook.value = false;
    telegramStatusSuccess.value = false;
    telegramStatusMessage.value = `❌ Terjadi kesalahan jaringan: ${err.message}`;
  }
}

async function testTelegramBotMessage() {
  if (!profileForm.value.telegramBotToken || !profileForm.value.telegramAdminChatId) {
    telegramStatusSuccess.value = false;
    telegramStatusMessage.value = 'Harap isi Bot Token dan Admin Chat ID untuk uji coba pengiriman pesan.';
    return;
  }

  isSendingTest.value = true;
  telegramStatusMessage.value = '';

  try {
    const text = `🤖 *Uji Coba Notifikasi R&D GrowthFlow*\n\nAlhamdulillah, bot Telegram Anda telah terhubung sempurna dengan sistem R&D GrowthFlow!\n\nAnda sekarang dapat menambah atau mengedit donasi dengan perintah seperti:\n\`/donasi\`\n\`/tambah Wakaf Ambulans | 150jt | 35jt | 5jt | 180\``;
    const url = `https://api.telegram.org/bot${profileForm.value.telegramBotToken.trim()}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: profileForm.value.telegramAdminChatId.trim(),
        text: text,
        parse_mode: 'Markdown'
      })
    });
    const data = await response.json();

    isSendingTest.value = false;
    if (data.ok) {
      telegramStatusSuccess.value = true;
      telegramStatusMessage.value = '✅ Pesan uji coba berhasil dikirim ke akun Telegram Anda! Periksa aplikasi Telegram Anda.';
    } else {
      telegramStatusSuccess.value = false;
      telegramStatusMessage.value = `❌ Gagal mengirim pesan: ${data.description || 'Periksa token dan chat ID'}`;
    }
  } catch (err) {
    isSendingTest.value = false;
    telegramStatusSuccess.value = false;
    telegramStatusMessage.value = `❌ Kesalahan jaringan: ${err.message}`;
  }
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
