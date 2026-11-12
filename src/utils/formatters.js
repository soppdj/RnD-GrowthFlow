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
 * Calculates calendar week of the month according to explicit user rule:
 * Tanggal 1 (hari apapun itu) sampai hari Minggu (tanggal berapa pun) adalah Minggu 1,
 * dan seterusnya untuk Minggu 2 dan lainnya (Senin s/d Minggu berikutnya).
 *
 * Catatan penting: Jika tanggal 1 adalah hari Minggu (seperti November 2026),
 * minggu 1 berlanjut hingga hari Minggu berikutnya (tanggal 8) agar minggu kerja
 * pertama tetap memiliki hari kerja efektif, sehingga tanggal 2-8 (termasuk tanggal 5)
 * tetap terhitung secara benar sebagai Minggu 1 (bukan prematur melompat ke Minggu 2).
 */
export function getWeekOfMonth(dateStr) {
  if (!dateStr) return 1;
  let year, month, day;
  if (typeof dateStr === 'string') {
    const parts = dateStr.split('T')[0].split('-');
    if (parts.length >= 3) {
      year = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10) - 1;
      day = parseInt(parts[2], 10);
    } else {
      const d = new Date(dateStr);
      year = d.getFullYear();
      month = d.getMonth();
      day = d.getDate();
    }
  } else if (dateStr instanceof Date) {
    year = dateStr.getFullYear();
    month = dateStr.getMonth();
    day = dateStr.getDate();
  } else {
    const d = new Date(dateStr);
    year = d.getFullYear();
    month = d.getMonth();
    day = d.getDate();
  }

  if (isNaN(day)) return 1;

  // Cari tanggal hari Minggu pertama yang menutup siklus Minggu 1
  let firstSunday = 7;
  for (let i = 1; i <= 7; i++) {
    const testD = new Date(year, month, i);
    if (testD.getDay() === 0) { // 0 = Minggu
      // Jika tanggal 1 itu sendiri hari Minggu, Minggu 1 berlanjut ke hari Minggu tanggal 8
      firstSunday = (i === 1) ? 8 : i;
      break;
    }
  }

  // Tanggal 1 sampai hari Minggu pertama adalah Minggu 1
  if (day <= firstSunday) {
    return 1;
  }

  // Hari setelah hari Minggu pertama dibagi per 7 hari
  const daysAfterFirstSunday = day - firstSunday;
  const weekNum = 1 + Math.ceil(daysAfterFirstSunday / 7);
  return Math.min(weekNum, 5);
}

/**
 * Checks if a date falls on a working day according to daysPerWeek (1 - 7)
 * Mendukung fleksibilitas input manual (contoh: 3 hari kerja efektif R&D: Senin, Rabu, Jumat)
 */
export function isWorkDay(dateStr, daysPerWeek = 5) {
  if (!dateStr) return true;
  const d = new Date(dateStr);
  const dayOfWeek = d.getDay(); // 0: Minggu, 1: Senin, 2: Selasa, 3: Rabu, 4: Kamis, 5: Jumat, 6: Sabtu
  const days = Number(daysPerWeek) || 5;

  if (days >= 7) return true;
  if (days === 6) return dayOfWeek !== 0; // Senin - Sabtu (tanpa Minggu)
  if (days === 5) return dayOfWeek >= 1 && dayOfWeek <= 5; // Senin - Jumat
  if (days === 4) return dayOfWeek >= 1 && dayOfWeek <= 4; // Senin - Kamis
  if (days === 3) return dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5; // 3 Hari Efektif: Senin, Rabu, Jumat
  if (days === 2) return dayOfWeek === 1 || dayOfWeek === 4; // 2 Hari: Senin & Kamis
  if (days === 1) return dayOfWeek === 1; // 1 Hari: Senin
  return dayOfWeek >= 1 && dayOfWeek <= days;
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

export const INDONESIAN_MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export const INDONESIAN_MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
];

/**
 * Menghitung rentang tanggal presisi untuk setiap minggu (Minggu 1 s/d Minggu 5)
 * pada bulan dan tahun tertentu berdasarkan siklus kalender baku.
 */
export function getMonthWeekRanges(year, monthIndex) {
  const y = Number(year) || new Date().getFullYear();
  const m = Number(monthIndex); // 0-indexed
  const daysInMonth = new Date(y, m + 1, 0).getDate();

  // Cari hari Minggu pertama penutup minggu 1
  let firstSunday = 7;
  for (let i = 1; i <= 7; i++) {
    const testD = new Date(y, m, i);
    if (testD.getDay() === 0) { // 0 = Minggu
      firstSunday = (i === 1) ? 8 : i;
      break;
    }
  }

  const weeks = [];
  const mShort = INDONESIAN_MONTHS_SHORT[m] || 'Bln';
  const mTwoDigits = String(m + 1).padStart(2, '0');

  // Minggu 1
  const w1End = Math.min(firstSunday, daysInMonth);
  weeks.push({
    weekNum: 1,
    startDay: 1,
    endDay: w1End,
    startDate: `${y}-${mTwoDigits}-01`,
    endDate: `${y}-${mTwoDigits}-${String(w1End).padStart(2, '0')}`,
    label: `Minggu 1 (${String(1).padStart(2, '0')} - ${String(w1End).padStart(2, '0')} ${mShort} ${y})`
  });

  // Minggu 2..5
  let currentStart = w1End + 1;
  let weekIdx = 2;
  while (currentStart <= daysInMonth && weekIdx <= 5) {
    let currentEnd;
    if (weekIdx === 5) {
      currentEnd = daysInMonth;
    } else {
      currentEnd = Math.min(currentStart + 6, daysInMonth);
    }

    weeks.push({
      weekNum: weekIdx,
      startDay: currentStart,
      endDay: currentEnd,
      startDate: `${y}-${mTwoDigits}-${String(currentStart).padStart(2, '0')}`,
      endDate: `${y}-${mTwoDigits}-${String(currentEnd).padStart(2, '0')}`,
      label: `Minggu ${weekIdx} (${String(currentStart).padStart(2, '0')} - ${String(currentEnd).padStart(2, '0')} ${mShort} ${y})`
    });

    currentStart = currentEnd + 1;
    weekIdx++;
  }

  return weeks;
}

/**
 * Menghasilkan daftar opsi 12 bulan untuk tahun tertentu
 */
export function getYearMonths(year) {
  const y = Number(year) || new Date().getFullYear();
  return INDONESIAN_MONTHS.map((name, idx) => ({
    value: `${y}-${String(idx + 1).padStart(2, '0')}`,
    label: `${name} ${y}`,
    year: y,
    monthIndex: idx,
    monthName: name
  }));
}

