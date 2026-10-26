<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
    <div class="glass-panel rounded-2xl w-full max-w-lg p-6 shadow-2xl border border-teal-100 max-h-[90vh] overflow-y-auto">
      <!-- Modal Header -->
      <div class="flex items-center justify-between pb-3 border-b border-teal-100">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
            <Paperclip class="w-4 h-4" />
          </div>
          <div>
            <h3 class="text-sm font-bold text-slate-800">
              Lampirkan Link Hasil Kerja (Deliverable)
            </h3>
            <p class="text-[11px] text-slate-500 truncate max-w-[280px] sm:max-w-[340px]">
              {{ item?.title || 'Tugas / Milestone' }}
            </p>
          </div>
        </div>

        <button
          @click="$emit('close')"
          class="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Existing Links List -->
      <div class="mt-4 space-y-3">
        <div v-if="linksList.length > 0" class="space-y-2">
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Tautan Hasil Kerja Terlampir ({{ linksList.length }})
          </label>
          <div
            v-for="(link, idx) in linksList"
            :key="idx"
            class="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-white border border-teal-100/90 shadow-micro hover:border-teal-300 transition-all"
          >
            <div class="flex items-center gap-2 min-w-0 flex-1">
              <span class="w-6 h-6 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center text-xs shrink-0 font-bold">
                {{ idx + 1 }}
              </span>
              <div class="min-w-0 flex-1">
                <p class="text-xs font-bold text-slate-800 truncate">
                  {{ link.title || 'Hasil Kerja' }}
                </p>
                <a
                  :href="link.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-[11px] text-teal-600 hover:underline truncate block font-mono"
                >
                  {{ link.url }}
                </a>
              </div>
            </div>

            <div class="flex items-center gap-1 shrink-0">
              <a
                :href="link.url"
                target="_blank"
                rel="noopener noreferrer"
                class="p-1.5 rounded-lg text-teal-700 hover:bg-teal-50 transition-colors"
                title="Buka Link di Tab Baru"
              >
                <ExternalLink class="w-3.5 h-3.5" />
              </a>
              <button
                type="button"
                @click="removeLink(idx)"
                class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Hapus Link Ini"
              >
                <Trash2 class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-4 bg-teal-50/40 rounded-xl border border-dashed border-teal-200">
          <Paperclip class="w-6 h-6 text-teal-400 mx-auto mb-1" />
          <p class="text-xs font-semibold text-slate-600">Belum ada link hasil kerja yang dilampirkan</p>
          <p class="text-[11px] text-slate-400">Tambahkan link bukti atau deliverable di bawah ini</p>
        </div>

        <!-- Add Link Form -->
        <div class="pt-3 border-t border-teal-100 space-y-3">
          <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Plus class="w-3.5 h-3.5 text-teal-600" />
            <span>Tambah Tautan Baru</span>
          </h4>

          <!-- Title / Description -->
          <div>
            <label class="block text-[11px] font-bold text-slate-600 uppercase mb-1">
              Keterangan / Nama Hasil Kerja
            </label>
            <input
              v-model="newLinkTitle"
              type="text"
              placeholder="Contoh: Draft Video 3 Hook Santri (Drive) / Spreadsheet CPR"
              class="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-xs transition-all font-semibold"
            />
          </div>

          <!-- URL Input -->
          <div>
            <label class="block text-[11px] font-bold text-slate-600 uppercase mb-1">
              URL / Link Lengkap
            </label>
            <div class="flex gap-2">
              <input
                v-model="newLinkUrl"
                type="url"
                placeholder="https://drive.google.com/... atau https://canva.com/..."
                class="flex-1 px-3 py-2 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none text-xs font-mono transition-all"
                @keydown.enter.prevent="addLink"
              />
              <button
                type="button"
                @click="addLink"
                :disabled="!newLinkUrl.trim()"
                class="px-3.5 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 disabled:bg-slate-200 disabled:text-slate-400 text-white shadow-micro transition-all active:scale-95 shrink-0 flex items-center gap-1"
              >
                <Plus class="w-3.5 h-3.5" />
                <span>Tambahkan</span>
              </button>
            </div>
          </div>

          <!-- Quick Presets -->
          <div>
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Pilih Cepat Platform:
            </span>
            <div class="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                @click="applyPreset('📁 Google Drive', 'https://drive.google.com/drive/folders/')"
                class="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-white hover:bg-teal-50 border border-slate-200 text-slate-700 hover:border-teal-300 transition-colors"
              >
                📁 Google Drive
              </button>
              <button
                type="button"
                @click="applyPreset('📊 Spreadsheet CPR', 'https://docs.google.com/spreadsheets/')"
                class="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-white hover:bg-teal-50 border border-slate-200 text-slate-700 hover:border-teal-300 transition-colors"
              >
                📊 Spreadsheet
              </button>
              <button
                type="button"
                @click="applyPreset('🎨 Desain Canva', 'https://www.canva.com/design/')"
                class="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-white hover:bg-teal-50 border border-slate-200 text-slate-700 hover:border-teal-300 transition-colors"
              >
                🎨 Canva
              </button>
              <button
                type="button"
                @click="applyPreset('🌐 Landing Page', 'https://')"
                class="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-white hover:bg-teal-50 border border-slate-200 text-slate-700 hover:border-teal-300 transition-colors"
              >
                🌐 Landing Page
              </button>
              <button
                type="button"
                @click="applyPreset('📝 Docs / Naskah', 'https://docs.google.com/document/')"
                class="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-white hover:bg-teal-50 border border-slate-200 text-slate-700 hover:border-teal-300 transition-colors"
              >
                📝 Google Docs
              </button>
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="flex items-center justify-between pt-4 border-t border-teal-100">
          <span v-if="savedToast" class="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1.5 animate-bounce">
            <Check class="w-3.5 h-3.5" />
            Tautan Berhasil Disimpan!
          </span>
          <span v-else></span>

          <div class="flex items-center gap-2">
            <button
              type="button"
              @click="$emit('close')"
              class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              @click="handleSave"
              class="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-soft transition-all active:scale-95"
            >
              <Save class="w-3.5 h-3.5" />
              <span>Simpan Perubahan Link</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import {
  Paperclip,
  Plus,
  Trash2,
  ExternalLink,
  Save,
  Check,
  X
} from 'lucide-vue-next';

const props = defineProps({
  isOpen: Boolean,
  item: Object,
  itemType: {
    type: String,
    default: 'task' // 'task' | 'milestone'
  }
});

const emit = defineEmits(['close', 'save']);

const linksList = ref([]);
const newLinkTitle = ref('');
const newLinkUrl = ref('');
const savedToast = ref(false);

watch(
  () => [props.isOpen, props.item],
  () => {
    if (props.item) {
      const list = [];
      // Support attachments array
      if (Array.isArray(props.item.attachments)) {
        props.item.attachments.forEach(att => {
          if (att && att.url) {
            list.push({ title: att.title || '', url: att.url });
          }
        });
      }
      // Support primary workResultUrl if not already in list
      if (props.item.workResultUrl && !list.some(l => l.url === props.item.workResultUrl)) {
        list.unshift({
          title: props.item.workResultTitle || 'Hasil Kerja',
          url: props.item.workResultUrl
        });
      }
      linksList.value = list;
    } else {
      linksList.value = [];
    }
    newLinkTitle.value = '';
    newLinkUrl.value = '';
    savedToast.value = false;
  },
  { immediate: true }
);

function applyPreset(presetTitle, presetUrlPrefix) {
  if (!newLinkTitle.value) {
    newLinkTitle.value = presetTitle;
  }
  if (!newLinkUrl.value || newLinkUrl.value === 'https://') {
    newLinkUrl.value = presetUrlPrefix;
  }
}

function addLink() {
  let url = newLinkUrl.value.trim();
  if (!url) return;

  // Prepend https:// if missing
  if (!/^https?:\/\//i.test(url)) {
    url = 'https://' + url;
  }

  const title = newLinkTitle.value.trim() || 'Hasil Kerja';
  linksList.value.push({ title, url });

  newLinkTitle.value = '';
  newLinkUrl.value = '';
}

function removeLink(index) {
  linksList.value.splice(index, 1);
}

function handleSave() {
  // If there's pending input in the fields, auto add it
  if (newLinkUrl.value.trim()) {
    addLink();
  }

  const primary = linksList.value[0] || null;
  const payload = {
    workResultUrl: primary ? primary.url : '',
    workResultTitle: primary ? primary.title : '',
    attachments: [...linksList.value]
  };

  emit('save', {
    id: props.item?.id,
    itemType: props.itemType,
    payload
  });

  savedToast.value = true;
  setTimeout(() => {
    savedToast.value = false;
    emit('close');
  }, 600);
}
</script>
