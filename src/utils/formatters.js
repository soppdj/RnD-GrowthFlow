/**
 * Formatters & Calculation Utilities for R&D GrowthFlow
 */

export function formatCurrency(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatCompactCurrency(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return 'Rp 0';
  if (Math.abs(amount) >= 1_000_000_000) {
    return `Rp ${(amount / 1_000_000_000).toFixed(1)} M`;
  }
  if (Math.abs(amount) >= 1_000_000) {
    return `Rp ${(amount / 1_000_000).toFixed(1)} Jt`;
  }
  if (Math.abs(amount) >= 1_000) {
    return `Rp ${(amount / 1_000).toFixed(0)} Rb`;
  }
  return `Rp ${amount}`;
}

export function formatNumber(val) {
  if (val === undefined || val === null || isNaN(val)) return '0';
  return new Intl.NumberFormat('id-ID').format(val);
}

export function formatPercent(val, decimals = 1) {
  if (val === undefined || val === null || isNaN(val)) return '0%';
  const prefix = val > 0 ? '+' : '';
  return `${prefix}${val.toFixed(decimals)}%`;
}

export function formatDate(dateStr, includeWeekday = false) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  const options = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...(includeWeekday ? { weekday: 'long' } : {})
  };
  return new Intl.DateTimeFormat('id-ID', options).format(d);
}

export function formatTime(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(d) + ' WIB';
}

/**
 * Calculates Return on Ad Spend / ROI:
 * ROI (%) = ((Pendapatan - Ad Spend) / Ad Spend) * 100
 */
export function calculateROI(pendapatan, adSpend) {
  const p = Number(pendapatan) || 0;
  const s = Number(adSpend) || 0;
  if (s <= 0) return 0;
  return ((p - s) / s) * 100;
}

/**
 * Calculates Cost Per Acquisition / Cost Per Respon (CPR):
 * CPR (Rp) = Ad Spend / Donatur Baru
 */
export function calculateCPR(adSpend, donaturBaru) {
  const s = Number(adSpend) || 0;
  const d = Number(donaturBaru) || 0;
  if (d <= 0) return s;
  return Math.round(s / d);
}

/**
 * LogFrame Badge Styling & Color definition
 * GOAL: Indigo
 * OUTCOME: Teal
 * OUTPUT: Emerald
 * ACTIVITY: Amber
 */
export const LOGFRAME_TYPES = {
  GOAL: {
    label: 'GOAL',
    name: 'Goal (Dampak Utama)',
    badgeBg: 'bg-indigo-50',
    badgeText: 'text-indigo-700',
    badgeBorder: 'border-indigo-200',
    barBg: 'bg-indigo-600',
    ring: 'ring-indigo-400'
  },
  OUTCOME: {
    label: 'OUTCOME',
    name: 'Outcome (Hasil Strategis)',
    badgeBg: 'bg-teal-50',
    badgeText: 'text-teal-700',
    badgeBorder: 'border-teal-200',
    barBg: 'bg-teal-600',
    ring: 'ring-teal-400'
  },
  OUTPUT: {
    label: 'OUTPUT',
    name: 'Output (Keluaran Langsung)',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
    badgeBorder: 'border-emerald-200',
    barBg: 'bg-emerald-600',
    ring: 'ring-emerald-400'
  },
  ACTIVITY: {
    label: 'ACTIVITY',
    name: 'Activity (Aktivitas Taktis)',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-700',
    badgeBorder: 'border-amber-200',
    barBg: 'bg-amber-600',
    ring: 'ring-amber-400'
  }
};

/**
 * Calculates week of the month (Minggu 1 - 5)
 * Week 1: 1 - 7
 * Week 2: 8 - 14
 * Week 3: 15 - 21
 * Week 4: 22 - 28
 * Week 5: 29 - 31
 */
export function getWeekOfMonth(dateStr) {
  if (!dateStr) return 1;
  const d = new Date(dateStr);
  const day = d.getDate();
  if (isNaN(day)) return 1;
  if (day <= 7) return 1;
  if (day <= 14) return 2;
  if (day <= 21) return 3;
  if (day <= 28) return 4;
  return 5;
}

/**
 * Checks if a date falls on a working day according to daysPerWeek (5, 6, 7)
 * 5 days: Monday (1) - Friday (5)
 * 6 days: Monday (1) - Saturday (6)
 * 7 days: Every day (0 - 6)
 */
export function isWorkDay(dateStr, daysPerWeek = 5) {
  if (!dateStr) return true;
  const d = new Date(dateStr);
  const dayOfWeek = d.getDay(); // 0 is Sunday, 1 is Monday, ..., 6 is Saturday
  if (daysPerWeek === 7) return true;
  if (daysPerWeek === 6) return dayOfWeek !== 0; // Exclude Sunday
  return dayOfWeek >= 1 && dayOfWeek <= 5; // Monday - Friday
}

/**
 * Formats full journal date with weekday and week number
 * e.g. "Senin, 26 Okt 2026 • Minggu 4"
 */
export function formatJournalDate(dateStr) {
  if (!dateStr) return 'Hari ini';
  const d = new Date(dateStr);
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const dayName = days[d.getDay()];
  const dateNum = d.getDate();
  const monthName = months[d.getMonth()];
  const year = d.getFullYear();
  const weekNum = getWeekOfMonth(dateStr);
  return `${dayName}, ${dateNum} ${monthName} ${year} • Minggu ${weekNum}`;
}

