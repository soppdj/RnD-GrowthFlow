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
