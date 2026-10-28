<template>
  <div class="inline-flex items-center gap-3 select-none group cursor-pointer">
    <!-- SVG Hexagonal / Growth Node Logo -->
    <div
      class="relative flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105"
      :class="sizeClasses[size].container"
    >
      <!-- Glow Filter / Pulse Background -->
      <div
        class="absolute inset-0 rounded-2xl bg-gradient-to-tr from-teal-500/30 via-emerald-400/20 to-cyan-400/30 blur-md group-hover:blur-lg transition-all"
      ></div>

      <!-- Main Vector SVG Icon -->
      <svg
        :viewBox="'0 0 48 48'"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="relative w-full h-full drop-shadow-md"
      >
        <!-- Gradient Definitions -->
        <defs>
          <linearGradient id="gf-grad-primary" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#047857" />
            <stop offset="50%" stop-color="#0d9488" />
            <stop offset="100%" stop-color="#0284c7" />
          </linearGradient>

          <linearGradient id="gf-grad-accent" x1="4" y1="44" x2="44" y2="4" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#10b981" />
            <stop offset="60%" stop-color="#34d399" />
            <stop offset="100%" stop-color="#38bdf8" />
          </linearGradient>

          <linearGradient id="gf-grad-gold" x1="12" y1="12" x2="36" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#f59e0b" />
            <stop offset="100%" stop-color="#fbbf24" />
          </linearGradient>

          <filter id="gf-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <!-- Outer Dynamic Shield / Hexagon Frame -->
        <path
          d="M24 3L41.3 13V35L24 45L6.7 35V13L24 3Z"
          fill="url(#gf-grad-primary)"
          class="transition-all"
        />

        <!-- Inner Dark Backdrop for Depth -->
        <path
          d="M24 6.5L38.2 14.8V33.2L24 41.5L9.8 33.2V14.8L24 6.5Z"
          fill="#064e3b"
          fill-opacity="0.9"
        />

        <!-- Flow Nodes & Grid Lines (Cyber R&D) -->
        <path
          d="M14 34L24 24L34 29"
          stroke="#0d9488"
          stroke-width="1.8"
          stroke-dasharray="2 2"
          stroke-linecap="round"
        />
        <path
          d="M14 26L24 16L34 21"
          stroke="#10b981"
          stroke-width="1.8"
          stroke-dasharray="2 2"
          stroke-linecap="round"
        />

        <!-- Main Ascending Growth Curve (Exponential Flow) -->
        <path
          d="M12 36C17 36 20 28 24 22C28 16 31 12 36 10"
          stroke="url(#gf-grad-accent)"
          stroke-width="3.2"
          stroke-linecap="round"
          stroke-linejoin="round"
          filter="url(#gf-glow)"
        />

        <!-- Growth Arrow Tip -->
        <path
          d="M31 10H36V15"
          stroke="url(#gf-grad-accent)"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        />

        <!-- R&D Atom / Flask Nexus Ring (Center Node) -->
        <ellipse
          cx="24"
          cy="22"
          rx="6"
          ry="3"
          stroke="#38bdf8"
          stroke-width="1.4"
          transform="rotate(-25 24 22)"
          opacity="0.9"
        />
        <ellipse
          cx="24"
          cy="22"
          rx="6"
          ry="3"
          stroke="#34d399"
          stroke-width="1.4"
          transform="rotate(35 24 22)"
          opacity="0.9"
        />

        <!-- Glowing Central Pulse Node -->
        <circle cx="24" cy="22" r="2.5" fill="#ffffff" filter="url(#gf-glow)" />

        <!-- Data Points on Nodes -->
        <circle cx="12" cy="36" r="2" fill="#10b981" />
        <circle cx="36" cy="10" r="2.2" fill="#38bdf8" />
        <circle cx="34" cy="29" r="1.5" fill="#f59e0b" />
      </svg>
    </div>

    <!-- Optional Text Label -->
    <div v-if="showText" class="leading-tight">
      <div class="flex items-center gap-1.5">
        <span
          class="font-black tracking-tight"
          :class="[
            sizeClasses[size].title,
            variant === 'light' ? 'text-white' : 'text-slate-800'
          ]"
        >
          R&amp;D GrowthFlow
        </span>
        <span class="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-teal-100 text-teal-800 border border-teal-200">
          PRO
        </span>
      </div>
      <p
        class="text-[10px] font-semibold tracking-wide"
        :class="variant === 'light' ? 'text-teal-200' : 'text-teal-700'"
      >
        Yayasan Khoirur Rooziqiin • FatherLab
      </p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg', 'xl'].includes(v)
  },
  showText: {
    type: Boolean,
    default: false
  },
  variant: {
    type: String,
    default: 'dark' // 'dark' | 'light'
  }
});

const sizeClasses = {
  sm: {
    container: 'w-7 h-7',
    title: 'text-xs'
  },
  md: {
    container: 'w-9 h-9 sm:w-10 sm:h-10',
    title: 'text-sm sm:text-base'
  },
  lg: {
    container: 'w-14 h-14 sm:w-16 sm:h-16',
    title: 'text-lg sm:text-xl'
  },
  xl: {
    container: 'w-20 h-20 sm:w-24 sm:h-24',
    title: 'text-2xl sm:text-3xl'
  }
};
</script>
