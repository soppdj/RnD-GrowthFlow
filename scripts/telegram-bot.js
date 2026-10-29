/**
 * R&D GrowthFlow • Powered by FatherLab © 2026
 * Standalone Long-Polling Telegram Bot for Donasi Management
 * 
 * Cara Menjalankan:
 * 1. Otomatis membaca token dari tabel profiles Supabase, atau set:
 *    - TELEGRAM_BOT_TOKEN
 *    - VITE_SUPABASE_URL
 *    - VITE_SUPABASE_ANON_KEY
 * 2. Jalankan:
 *    npm run bot (atau node scripts/telegram-bot.js)
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rsnjmllhuucyophursng.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzbmptbGxodXVjeW9waHVyc25nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIxMzQ0MTAsImV4cCI6MjEwNzcxMDQxMH0.nVLriES26tvWFXLbkeD0irZs7AXZvsFq7Zdue7jKClI';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

let TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
let ALLOWED_CHAT_IDS = (process.env.TELEGRAM_ALLOWED_USER_IDS || '').split(',').map(s => s.trim()).filter(Boolean);
let offset = 0;

async function initBot() {
  // If token not provided in env, fetch from Supabase profiles
  if (!TELEGRAM_TOKEN) {
    try {
      const { data: profile } = await supabase.from('profiles').select('telegram_bot_token, telegram_admin_chat_id').limit(1).maybeSingle();
      if (profile?.telegram_bot_token) {
        TELEGRAM_TOKEN = profile.telegram_bot_token.trim();
        console.log('✅ Token Bot berhasil dimuat secara otomatis dari Supabase profiles.');
      }
      if (profile?.telegram_admin_chat_id && ALLOWED_CHAT_IDS.length === 0) {
        ALLOWED_CHAT_IDS = [String(profile.telegram_admin_chat_id).trim()];
        console.log('✅ Admin Chat ID berhasil dimuat dari Supabase profiles:', ALLOWED_CHAT_IDS);
      }
    } catch (e) {
      console.warn('Gagal membaca token dari Supabase:', e.message);
    }
  }

  if (!TELEGRAM_TOKEN) {
    console.error('❌ Error: TELEGRAM_BOT_TOKEN belum diset di .env maupun di database Supabase profiles.');
    console.log('Silakan masukkan token di menu Pengaturan Web R&D GrowthFlow atau set environment variable.');
    process.exit(1);
  }

  console.log('🤖 R&D GrowthFlow Telegram Bot sedang berjalan (Long-Polling Mode)...');
  console.log('Supabase URL:', SUPABASE_URL);

  pollUpdates();
}

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
    await sendReply(chatId, `⛔ *Akses Ditolak*\nID Telegram Anda (\`${chatId}\`) belum didaftarkan sebagai Admin R&D GrowthFlow.`);
    return;
  }

  const parts = text.split(/\s+/);
  const command = parts[0].toLowerCase();
  const argsText = text.substring(command.length).trim();

  try {
    if (command === '/start' || command === '/help') {
      await sendReply(chatId, `🤖 *Assalamu'alaikum, ${senderName}!*
Selamat datang di *R&D GrowthFlow Bot*
_Yayasan Khoirur Rooziqiin • Bandung Barat_
━━━━━━━━━━━━━━━━━━━━

Gunakan perintah berikut:
📊 */donasi* atau */list* : Rekap program donasi & capaian live
➕ */tambah [Nama] | [Target] | [Realisasi] | [AdSpend] | [Donatur]*
   _Contoh:_ \`/tambah Wakaf Ambulans | 150jt | 30jt | 4jt | 150\`
✏️ */edit [Nama/ID] | [Realisasi] | [AdSpend] | [Donatur]*
   _Contoh:_ \`/edit Wakaf Ambulans | 45jt | 6jt | 250\`
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
      let segments = [];
      if (argsText.includes('|')) segments = argsText.split('|').map(s => s.trim());
      else if (argsText.includes(',')) segments = argsText.split(',').map(s => s.trim());
      else {
        await sendReply(chatId, '⚠️ Gunakan tanda pemisah pipa `|` atau koma `,`:\n`/tambah Nama | Target | Realisasi | AdSpend | Donatur`');
        return;
      }

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
      let segments = [];
      if (argsText.includes('|')) segments = argsText.split('|').map(s => s.trim());
      else if (argsText.includes(',')) segments = argsText.split(',').map(s => s.trim());
      else {
        await sendReply(chatId, '⚠️ Gunakan tanda pemisah pipa `|` atau koma `,`:\n`/edit Nama | Realisasi | AdSpend | Donatur`');
        return;
      }

      const query = segments[0];
      let target = null;
      let realized = 0;
      let adSpend = 0;
      let donors = 0;

      if (segments.length >= 5) {
        target = parseCurrencyString(segments[1] || '0');
        realized = parseCurrencyString(segments[2] || '0');
        adSpend = parseCurrencyString(segments[3] || '0');
        donors = parseInt(segments[4] || '0', 10);
      } else {
        realized = parseCurrencyString(segments[1] || '0');
        adSpend = parseCurrencyString(segments[2] || '0');
        donors = parseInt(segments[3] || '0', 10);
      }

      const { data: existing } = await supabase.from('donation_programs').select('*').or(`id.eq.${query},name.ilike.%${query}%`).limit(1);
      if (!existing || existing.length === 0) {
        await sendReply(chatId, `Program "${query}" tidak ditemukan.`);
        return;
      }
      const prog = existing[0];
      const updates = {
        realized_amount: realized,
        ad_spend: adSpend,
        new_donors: donors
      };
      if (target !== null && target > 0) updates.target_amount = target;

      const { error } = await supabase.from('donation_programs').update(updates).eq('id', prog.id);

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
    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'Markdown'
      })
    });
    const resJson = await res.json();
    if (!resJson.ok && resJson.description && resJson.description.includes('entity')) {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: text.replace(/[*_`\[\]]/g, '')
        })
      });
    }
  } catch (e) {
    console.error('Gagal kirim balasan:', e.message);
  }
}

function parseCurrencyString(val) {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  let str = String(val).trim().toLowerCase().replace(/rp\.?/g, '').trim();

  const jtMatch = str.match(/^([\d.,]+)\s*(jt|juta|m)$/);
  if (jtMatch) return Math.round(parseFloat(jtMatch[1].replace(',', '.')) * 1000000);

  const rbMatch = str.match(/^([\d.,]+)\s*(rb|ribu|k)$/);
  if (rbMatch) return Math.round(parseFloat(rbMatch[1].replace(',', '.')) * 1000);

  const milMatch = str.match(/^([\d.,]+)\s*(milyar|mil|b)$/);
  if (milMatch) return Math.round(parseFloat(milMatch[1].replace(',', '.')) * 1000000000);

  return parseInt(str.replace(/[^\d]/g, ''), 10) || 0;
}

function formatRupiah(num) {
  return 'Rp ' + Number(num || 0).toLocaleString('id-ID');
}

initBot();
