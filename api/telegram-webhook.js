/**
 * R&D GrowthFlow • Powered by FatherLab © 2026
 * Vercel Serverless Function: Telegram Bot Webhook
 * Endpoint: POST /api/telegram-webhook
 * 
 * Fitur:
 * - Menambah program donasi baru via Telegram (/tambah)
 * - Mengedit realisasi donasi, ad spend, dan donatur (/edit)
 * - Melihat daftar program donasi dan performa (/donasi atau /list)
 * - Melihat ringkasan KPI R&D Digital Marketing (/kpi)
 * - Sinkronisasi langsung dan real-time ke database Supabase
 */

import { createClient } from '@supabase/supabase-js';

// Supabase Credentials
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rsnjmllhuucyophursng.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzbmptbGxodXVjeW9waHVyc25nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIxMzQ0MTAsImV4cCI6MjEwNzcxMDQxMH0.nVLriES26tvWFXLbkeD0irZs7AXZvsFq7Zdue7jKClI';

// Telegram Bot Configuration
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ALLOWED_CHAT_IDS = (process.env.TELEGRAM_ALLOWED_USER_IDS || '').split(',').map(s => s.trim()).filter(Boolean);

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'online',
      service: 'R&D GrowthFlow Telegram Webhook',
      timestamp: new Date().toISOString()
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const update = req.body;
    if (!update || !update.message) {
      return res.status(200).send('OK (No message)');
    }

    const message = update.message;
    const chatId = message.chat?.id;
    const text = (message.text || '').trim();
    const senderName = message.from?.first_name || 'Sahabat';

    if (!chatId || !text) {
      return res.status(200).send('OK (Empty text)');
    }

    // Security Check: If ALLOWED_CHAT_IDS is specified, enforce it
    if (ALLOWED_CHAT_IDS.length > 0 && !ALLOWED_CHAT_IDS.includes(String(chatId))) {
      await sendTelegramMessage(chatId, `⛔ *Akses Ditolak*\n\nMaaf ${senderName}, ID Telegram Anda (\`${chatId}\`) belum didaftarkan sebagai Admin R&D GrowthFlow.\n\nSilakan masukkan Chat ID ini di menu *Pengaturan Web R&D GrowthFlow* untuk memberikan akses.`);
      return res.status(200).send('OK');
    }

    // Process Bot Commands
    const responseText = await processCommand(text, senderName, chatId);
    if (responseText) {
      await sendTelegramMessage(chatId, responseText);
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Webhook error:', err);
    return res.status(200).json({ ok: false, error: err.message });
  }
}

/**
 * Command Processor
 */
async function processCommand(text, senderName, chatId) {
  const parts = text.split(/\s+/);
  const command = parts[0].toLowerCase();
  const argsText = text.substring(command.length).trim();

  // 1. /start atau /help
  if (command === '/start' || command === '/help') {
    return `🤖 *Assalamu'alaikum, ${senderName}!*
Selamat datang di *R&D GrowthFlow Bot*
_Yayasan Khoirur Rooziqiin • Bandung_

Gunakan perintah berikut untuk mengelola program donasi:

📊 */donasi* atau */list*
Melihat rekap semua program donasi, target, realisasi, CPR & ROI.

➕ */tambah [Nama] | [Target] | [Realisasi] | [AdSpend] | [Donatur]*
Menambah program donasi baru.
_Contoh:_
\`/tambah Wakaf Sumur Bor | 50jt | 15jt | 2jt | 95\`

✏️ */edit [Nama/ID] | [Realisasi] | [AdSpend] | [Donatur]*
Mengupdate capaian donasi saat ini.
_Contoh:_
\`/edit Wakaf Sumur Bor | 35jt | 4.5jt | 210\`

🎯 */kpi*
Melihat ringkasan KPI agregat dan pencapaian target kuartal.

🔍 */cari [nama]*
Mencari detail program donasi spesifik.

🆔 *ID Telegram Anda:* \`${chatId}\``;
  }

  // 2. /donasi atau /list
  if (command === '/donasi' || command === '/list') {
    const { data: programs, error } = await supabase
      .from('donation_programs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !programs || programs.length === 0) {
      return `📭 Belum ada program donasi yang tercatat di database Supabase.`;
    }

    let out = `📊 *DAFTAR PROGRAM DONASI R&D GROWTHFLOW*\n`;
    out += `_Yayasan Khoirur Rooziqiin • Bandung_\n`;
    out += `━━━━━━━━━━━━━━━━━━━━\n\n`;

    programs.forEach((p, idx) => {
      const target = Number(p.target_amount) || 0;
      const realized = Number(p.realized_amount) || 0;
      const adSpend = Number(p.ad_spend) || 0;
      const donors = Number(p.new_donors) || 0;
      const percent = target > 0 ? Math.round((realized / target) * 100) : 0;
      const cpr = donors > 0 ? Math.round(adSpend / donors) : 0;
      const roi = adSpend > 0 ? Math.round(((realized - adSpend) / adSpend) * 100) : 0;

      out += `*${idx + 1}. ${p.name}* [${p.category || 'Wakaf'}]\n`;
      out += `   🎯 Target: ${formatRupiah(target)}\n`;
      out += `   💰 Realisasi: ${formatRupiah(realized)} (*${percent}%*)\n`;
      out += `   📢 Ad Spend: ${formatRupiah(adSpend)} | 👥 Donatur: *${donors}*\n`;
      out += `   ⚡ CPR: ${formatRupiah(cpr)} | ROI: *${roi}%*\n\n`;
    });

    out += `━━━━━━━━━━━━━━━━━━━━\n`;
    out += `_Ketik \`/edit Nama | Realisasi | AdSpend | Donatur\` untuk update._`;
    return out;
  }

  // 3. /kpi
  if (command === '/kpi') {
    const { data: programs } = await supabase
      .from('donation_programs')
      .select('*');

    if (!programs || programs.length === 0) {
      return `Belum ada data program donasi untuk kalkulasi KPI.`;
    }

    let totalTarget = 0;
    let totalRevenue = 0;
    let totalAdSpend = 0;
    let totalDonors = 0;

    programs.forEach(p => {
      totalTarget += Number(p.target_amount) || 0;
      totalRevenue += Number(p.realized_amount) || 0;
      totalAdSpend += Number(p.ad_spend) || 0;
      totalDonors += Number(p.new_donors) || 0;
    });

    const percent = totalTarget > 0 ? ((totalRevenue / totalTarget) * 100).toFixed(1) : '0';
    const cpr = totalDonors > 0 ? Math.round(totalAdSpend / totalDonors) : 0;
    const roi = totalAdSpend > 0 ? Math.round(((totalRevenue - totalAdSpend) / totalAdSpend) * 100) : 0;

    return `🎯 *RINGKASAN KPI R&D DIGITAL MARKETING*
_Yayasan Khoirur Rooziqiin • Bandung_
━━━━━━━━━━━━━━━━━━━━

💰 *Total Realisasi:* ${formatRupiah(totalRevenue)}
🎯 *Total Target:* ${formatRupiah(totalTarget)}
📈 *Capaian Target:* *${percent}%*

📢 *Total Ad Spend:* ${formatRupiah(totalAdSpend)}
👥 *Total Donatur Baru:* *${totalDonors} Jiwa*
⚡ *Cost Per Result (CPR):* *${formatRupiah(cpr)}*
🚀 *Return On Investment (ROI):* *${roi}%*

━━━━━━━━━━━━━━━━━━━━
_Data tersinkronisasi otomatis dengan dashboard web._`;
  }

  // 4. /tambah
  if (command === '/tambah') {
    if (!argsText) {
      return `Format salah. Gunakan:\n\`/tambah Nama Program | Target | Realisasi | AdSpend | Donatur\`\n\n_Contoh:_\n\`/tambah Wakaf Ambulans | 150jt | 35jt | 5jt | 180\``;
    }

    const segments = argsText.split('|').map(s => s.trim());
    const name = segments[0];
    const target = parseCurrencyString(segments[1] || '0');
    const realized = parseCurrencyString(segments[2] || '0');
    const adSpend = parseCurrencyString(segments[3] || '0');
    const donors = parseInt(segments[4] || '0', 10);

    if (!name) {
      return `Nama program donasi wajib diisi!`;
    }

    const newProg = {
      name,
      category: 'Wakaf',
      target_amount: target,
      realized_amount: realized,
      ad_spend: adSpend,
      new_donors: donors,
      status: 'Active',
      description: `Ditambahkan via Telegram Bot oleh ${senderName}`
    };

    const { data, error } = await supabase
      .from('donation_programs')
      .insert(newProg)
      .select()
      .single();

    if (error) {
      return `❌ Gagal menyimpan ke database Supabase:\n_${error.message}_`;
    }

    const cpr = donors > 0 ? Math.round(adSpend / donors) : 0;
    const roi = adSpend > 0 ? Math.round(((realized - adSpend) / adSpend) * 100) : 0;

    return `✅ *PROGRAM DONASI BERHASIL DITAMBAHKAN!*
━━━━━━━━━━━━━━━━━━━━
📌 *Nama:* ${name}
🎯 *Target:* ${formatRupiah(target)}
💰 *Realisasi Awal:* ${formatRupiah(realized)}
📢 *Ad Spend:* ${formatRupiah(adSpend)}
👥 *Donatur Baru:* ${donors}
⚡ *CPR:* ${formatRupiah(cpr)} | *ROI:* ${roi}%
━━━━━━━━━━━━━━━━━━━━
⚡ _Data telah terupdate real-time di web R&D GrowthFlow._`;
  }

  // 5. /edit
  if (command === '/edit') {
    if (!argsText) {
      return `Format salah. Gunakan:\n\`/edit Nama/ID Program | Realisasi Baru | AdSpend Baru | Donatur Baru\`\n\n_Contoh:_\n\`/edit Wakaf Sumur | 45jt | 6jt | 250\``;
    }

    const segments = argsText.split('|').map(s => s.trim());
    const query = segments[0];
    const realized = parseCurrencyString(segments[1] || '0');
    const adSpend = parseCurrencyString(segments[2] || '0');
    const donors = parseInt(segments[3] || '0', 10);

    if (!query) {
      return `Nama atau ID program yang ingin diedit wajib diisi!`;
    }

    // Find program by ID or matching Name
    const { data: existing, error: searchError } = await supabase
      .from('donation_programs')
      .select('*')
      .or(`id.eq.${query},name.ilike.%${query}%`)
      .limit(1);

    if (searchError || !existing || existing.length === 0) {
      return `❌ Program donasi dengan nama/ID "*${query}*" tidak ditemukan di database. Ketik \`/list\` untuk melihat nama program yang tersedia.`;
    }

    const prog = existing[0];
    const updates = {
      realized_amount: realized,
      ad_spend: adSpend,
      new_donors: donors
    };

    const { error: updateError } = await supabase
      .from('donation_programs')
      .update(updates)
      .eq('id', prog.id);

    if (updateError) {
      return `❌ Gagal memperbarui program donasi:\n_${updateError.message}_`;
    }

    const target = Number(prog.target_amount) || 0;
    const percent = target > 0 ? Math.round((realized / target) * 100) : 0;
    const cpr = donors > 0 ? Math.round(adSpend / donors) : 0;
    const roi = adSpend > 0 ? Math.round(((realized - adSpend) / adSpend) * 100) : 0;

    return `✅ *PROGRAM DONASI BERHASIL DIPERBARUI!*
━━━━━━━━━━━━━━━━━━━━
📌 *Program:* ${prog.name}
🎯 *Target:* ${formatRupiah(target)}
💰 *Realisasi Baru:* ${formatRupiah(realized)} (*${percent}%*)
📢 *Ad Spend Baru:* ${formatRupiah(adSpend)}
👥 *Donatur Baru:* ${donors}
⚡ *CPR Baru:* ${formatRupiah(cpr)} | *ROI Baru:* ${roi}%
━━━━━━━━━━━━━━━━━━━━
⚡ _Data telah diperbarui secara langsung di web dashboard._`;
  }

  // 6. /cari
  if (command === '/cari') {
    if (!argsText) return `Ketik \`/cari <kata kunci>\` untuk mencari program.`;
    const { data: found } = await supabase
      .from('donation_programs')
      .select('*')
      .ilike('name', `%${argsText}%`);

    if (!found || found.length === 0) {
      return `Tidak ditemukan program dengan kata kunci "*${argsText}*".`;
    }

    let out = `🔍 *HASIL PENCARIAN ("${argsText}")*\n\n`;
    found.forEach((p, idx) => {
      out += `${idx + 1}. *${p.name}* (ID: \`${p.id}\`)\n   Target: ${formatRupiah(p.target_amount)} | Realisasi: ${formatRupiah(p.realized_amount)}\n\n`;
    });
    return out;
  }

  return `Perintah tidak dikenali. Ketik */help* untuk melihat daftar perintah.`;
}

/**
 * Send message to Telegram API
 */
async function sendTelegramMessage(chatId, text) {
  const token = TELEGRAM_TOKEN || process.env.VITE_TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.warn('TELEGRAM_BOT_TOKEN not configured in environment.');
    return;
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'Markdown'
      })
    });
  } catch (e) {
    console.error('Failed to send Telegram message:', e);
  }
}

/**
 * Flexible Currency & Number Parser
 * Converts strings like '50jt', '2.5jt', '500rb', '500k', 'Rp 50.000.000' to numbers
 */
function parseCurrencyString(val) {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  let str = String(val).trim().toLowerCase();
  str = str.replace(/rp\.?/g, '').trim();

  // 'jt' or 'juta' or 'm' (million)
  const jtMatch = str.match(/^([\d.,]+)\s*(jt|juta|m)$/);
  if (jtMatch) {
    const num = parseFloat(jtMatch[1].replace(',', '.'));
    return Math.round(num * 1000000);
  }

  // 'rb' or 'ribu' or 'k' (thousand)
  const rbMatch = str.match(/^([\d.,]+)\s*(rb|ribu|k)$/);
  if (rbMatch) {
    const num = parseFloat(rbMatch[1].replace(',', '.'));
    return Math.round(num * 1000);
  }

  // 'milyar' or 'mil' or 'b' (billion)
  const milMatch = str.match(/^([\d.,]+)\s*(milyar|mil|b)$/);
  if (milMatch) {
    const num = parseFloat(milMatch[1].replace(',', '.'));
    return Math.round(num * 1000000000);
  }

  const clean = str.replace(/[^\d]/g, '');
  return parseInt(clean, 10) || 0;
}

function formatRupiah(num) {
  return 'Rp ' + Number(num || 0).toLocaleString('id-ID');
}
