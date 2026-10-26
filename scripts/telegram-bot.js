/**
 * R&D GrowthFlow • Powered by FatherLab © 2026
 * Standalone Long-Polling Telegram Bot for Donasi Management
 * 
 * Cara Menjalankan:
 * 1. Set environment variable:
 *    - TELEGRAM_BOT_TOKEN
 *    - NEXT_PUBLIC_SUPABASE_URL
 *    - NEXT_PUBLIC_ANON_KEY
 * 2. Jalankan:
 *    node scripts/telegram-bot.js
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rsnjmllhuucyophursng.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzbmptbGxodXVjeW9waHVyc25nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIxMzQ0MTAsImV4cCI6MjEwNzcxMDQxMH0.nVLriES26tvWFXLbkeD0irZs7AXZvsFq7Zdue7jKClI';
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ALLOWED_CHAT_IDS = (process.env.TELEGRAM_ALLOWED_USER_IDS || '').split(',').map(s => s.trim()).filter(Boolean);

if (!TELEGRAM_TOKEN) {
  console.error('❌ Error: TELEGRAM_BOT_TOKEN belum diset.');
  console.log('Jalankan dengan: $env:TELEGRAM_BOT_TOKEN="token_anda"; node scripts/telegram-bot.js');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
let offset = 0;

console.log('🤖 R&D GrowthFlow Telegram Bot sedang berjalan (Long-Polling)...');
console.log('Supabase URL:', SUPABASE_URL);

async function pollUpdates() {
  while (true) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/getUpdates?offset=${offset}&timeout=30`);
      const data = await res.json();

      if (data.ok && Array.isArray(data.result)) {
        for (const update of data.result) {
          offset = update.update_id + 1;
          if (update.message && update.message.text) {
            handleMessage(update.message);
          }
        }
      }
    } catch (e) {
      console.error('Polling error:', e.message);
      await new Promise(r => setTimeout(r, 3000));
    }
  }
}

async function handleMessage(message) {
  const chatId = message.chat?.id;
  const text = (message.text || '').trim();
  const senderName = message.from?.first_name || 'Sahabat';

  console.log(`[${new Date().toLocaleTimeString()}] Pesan dari ${senderName} (${chatId}): ${text}`);

  if (ALLOWED_CHAT_IDS.length > 0 && !ALLOWED_CHAT_IDS.includes(String(chatId))) {
    await sendReply(chatId, `⛔ *Akses Ditolak*\nID Telegram Anda (\`${chatId}\`) belum didaftarkan sebagai Admin.`);
    return;
  }

  const parts = text.split(/\s+/);
  const command = parts[0].toLowerCase();
  const argsText = text.substring(command.length).trim();

  try {
    if (command === '/start' || command === '/help') {
      await sendReply(chatId, `🤖 *Assalamu'alaikum, ${senderName}!*
Selamat datang di *R&D GrowthFlow Bot*
_Yayasan Khoirur Rooziqiin • Bandung_

Gunakan perintah berikut:
📊 */donasi* atau */list* : Rekap program & capaian
➕ */tambah [Nama] | [Target] | [Realisasi] | [AdSpend] | [Donatur]*
   _Contoh:_ \`/tambah Wakaf Sumur Bor | 50jt | 15jt | 2jt | 95\`
✏️ */edit [Nama/ID] | [Realisasi] | [AdSpend] | [Donatur]*
   _Contoh:_ \`/edit Wakaf Sumur Bor | 35jt | 4.5jt | 210\`
🎯 */kpi* : Ringkasan KPI ZISWAF R&D
🔍 */cari [nama]* : Cari program tertentu`);
    } else if (command === '/donasi' || command === '/list') {
      const { data: programs } = await supabase.from('donation_programs').select('*').order('created_at', { ascending: false });
      if (!programs || programs.length === 0) {
        await sendReply(chatId, 'Belum ada data program donasi di Supabase.');
        return;
      }
      let out = `📊 *DAFTAR PROGRAM DONASI R&D GROWTHFLOW*\n━━━━━━━━━━━━━━━━━━━━\n\n`;
      programs.forEach((p, idx) => {
        const target = Number(p.target_amount) || 0;
        const realized = Number(p.realized_amount) || 0;
        const adSpend = Number(p.ad_spend) || 0;
        const donors = Number(p.new_donors) || 0;
        const percent = target > 0 ? Math.round((realized / target) * 100) : 0;
        const cpr = donors > 0 ? Math.round(adSpend / donors) : 0;
        const roi = adSpend > 0 ? Math.round(((realized - adSpend) / adSpend) * 100) : 0;
        out += `*${idx + 1}. ${p.name}*\n   🎯 Target: ${formatRupiah(target)} | 💰 Realisasi: ${formatRupiah(realized)} (*${percent}%*)\n   📢 Ad Spend: ${formatRupiah(adSpend)} | 👥 Donatur: *${donors}*\n   ⚡ CPR: ${formatRupiah(cpr)} | ROI: *${roi}%*\n\n`;
      });
      await sendReply(chatId, out);
    } else if (command === '/tambah') {
      const segments = argsText.split('|').map(s => s.trim());
      const name = segments[0];
      const target = parseCurrencyString(segments[1] || '0');
      const realized = parseCurrencyString(segments[2] || '0');
      const adSpend = parseCurrencyString(segments[3] || '0');
      const donors = parseInt(segments[4] || '0', 10);

      if (!name) {
        await sendReply(chatId, 'Nama program donasi wajib diisi.');
        return;
      }

      const { error } = await supabase.from('donation_programs').insert({
        name,
        category: 'Wakaf',
        target_amount: target,
        realized_amount: realized,
        ad_spend: adSpend,
        new_donors: donors,
        status: 'Active',
        description: `Ditambahkan via Telegram Bot oleh ${senderName}`
      });

      if (error) {
        await sendReply(chatId, `❌ Gagal menambahkan: ${error.message}`);
      } else {
        await sendReply(chatId, `✅ *Program Donasi Berhasil Ditambahkan!*\n📌 *Nama:* ${name}\n🎯 *Target:* ${formatRupiah(target)}\n💰 *Realisasi:* ${formatRupiah(realized)}\n⚡ Data otomatis tersinkronisasi live di web.`);
      }
    } else if (command === '/edit') {
      const segments = argsText.split('|').map(s => s.trim());
      const query = segments[0];
      const realized = parseCurrencyString(segments[1] || '0');
      const adSpend = parseCurrencyString(segments[2] || '0');
      const donors = parseInt(segments[3] || '0', 10);

      const { data: existing } = await supabase.from('donation_programs').select('*').or(`id.eq.${query},name.ilike.%${query}%`).limit(1);
      if (!existing || existing.length === 0) {
        await sendReply(chatId, `Program "${query}" tidak ditemukan.`);
        return;
      }
      const prog = existing[0];
      const { error } = await supabase.from('donation_programs').update({
        realized_amount: realized,
        ad_spend: adSpend,
        new_donors: donors
      }).eq('id', prog.id);

      if (error) {
        await sendReply(chatId, `❌ Gagal mengupdate: ${error.message}`);
      } else {
        await sendReply(chatId, `✅ *Program Donasi Berhasil Diperbarui!*\n📌 *Nama:* ${prog.name}\n💰 *Realisasi Baru:* ${formatRupiah(realized)}\n📢 *Ad Spend Baru:* ${formatRupiah(adSpend)}\n👥 *Donatur Baru:* ${donors}`);
      }
    } else if (command === '/kpi') {
      const { data: programs } = await supabase.from('donation_programs').select('*');
      let totalTarget = 0, totalRevenue = 0, totalAdSpend = 0, totalDonors = 0;
      (programs || []).forEach(p => {
        totalTarget += Number(p.target_amount) || 0;
        totalRevenue += Number(p.realized_amount) || 0;
        totalAdSpend += Number(p.ad_spend) || 0;
        totalDonors += Number(p.new_donors) || 0;
      });
      const percent = totalTarget > 0 ? ((totalRevenue / totalTarget) * 100).toFixed(1) : '0';
      const cpr = totalDonors > 0 ? Math.round(totalAdSpend / totalDonors) : 0;
      const roi = totalAdSpend > 0 ? Math.round(((totalRevenue - totalAdSpend) / totalAdSpend) * 100) : 0;

      await sendReply(chatId, `🎯 *RINGKASAN KPI R&D DIGITAL MARKETING*\n💰 *Total Realisasi:* ${formatRupiah(totalRevenue)} (*${percent}%*)\n🎯 *Target:* ${formatRupiah(totalTarget)}\n📢 *Total Ad Spend:* ${formatRupiah(totalAdSpend)}\n👥 *Total Donatur:* *${totalDonors} Jiwa*\n⚡ *CPR Rata-rata:* ${formatRupiah(cpr)} | *ROI:* ${roi}%`);
    }
  } catch (err) {
    console.error('Command handling error:', err);
    await sendReply(chatId, `❌ Terjadi kesalahan: ${err.message}`);
  }
}

async function sendReply(chatId, text) {
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' })
    });
  } catch (e) {
    console.error('Send reply error:', e.message);
  }
}

function parseCurrencyString(val) {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  let str = String(val).trim().toLowerCase().replace(/rp\.?/g, '').trim();
  const jt = str.match(/^([\d.,]+)\s*(jt|juta|m)$/);
  if (jt) return Math.round(parseFloat(jt[1].replace(',', '.')) * 1000000);
  const rb = str.match(/^([\d.,]+)\s*(rb|ribu|k)$/);
  if (rb) return Math.round(parseFloat(rb[1].replace(',', '.')) * 1000);
  return parseInt(str.replace(/[^\d]/g, ''), 10) || 0;
}

function formatRupiah(num) {
  return 'Rp ' + Number(num || 0).toLocaleString('id-ID');
}

pollUpdates();
