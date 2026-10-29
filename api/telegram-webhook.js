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
 * - Mencari detail program (/cari) dan menghapus program (/hapus)
 * - Sinkronisasi langsung dan real-time ke database Supabase
 * - Otentikasi dinamis: membaca Bot Token dan Admin Chat ID langsung dari tabel profiles Supabase
 */

import { createClient } from '@supabase/supabase-js';

// Supabase Credentials (Default to project configuration)
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rsnjmllhuucyophursng.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzbmptbGxodXVjeW9waHVyc25nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIxMzQ0MTAsImV4cCI6MjEwNzcxMDQxMH0.nVLriES26tvWFXLbkeD0irZs7AXZvsFq7Zdue7jKClI';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default async function handler(req, res) {
  // 1. Health check & status endpoint (GET)
  if (req.method === 'GET') {
    let hasDbToken = false;
    let registeredAdmin = '';
    try {
      const { data: prof } = await supabase.from('profiles').select('telegram_bot_token, telegram_admin_chat_id').limit(1).maybeSingle();
      if (prof?.telegram_bot_token) hasDbToken = true;
      if (prof?.telegram_admin_chat_id) registeredAdmin = String(prof.telegram_admin_chat_id);
    } catch (e) {
      // ignore
    }

    return res.status(200).json({
      status: 'online',
      service: 'R&D GrowthFlow Telegram Webhook Engine',
      supabaseConnected: true,
      botConfigured: Boolean(process.env.TELEGRAM_BOT_TOKEN || hasDbToken),
      adminChatIdRegistered: registeredAdmin || process.env.TELEGRAM_ADMIN_CHAT_ID || null,
      timestamp: new Date().toISOString()
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let update = req.body;
    if (typeof update === 'string') {
      try {
        update = JSON.parse(update);
      } catch (e) {
        // use as is
      }
    }

    if (!update || !update.message) {
      return res.status(200).send('OK (No message in update)');
    }

    const message = update.message;
    const chatId = message.chat?.id;
    const text = (message.text || '').trim();
    const senderName = message.from?.first_name || 'Sahabat';

    if (!chatId || !text) {
      return res.status(200).send('OK (Empty message or chat ID)');
    }

    // 2. Resolve Active Bot Token & Admin Chat ID from Supabase
    let activeToken = process.env.TELEGRAM_BOT_TOKEN || process.env.VITE_TELEGRAM_BOT_TOKEN;
    let allowedChatId = process.env.TELEGRAM_ADMIN_CHAT_ID || process.env.TELEGRAM_ALLOWED_USER_IDS;

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('telegram_bot_token, telegram_admin_chat_id')
        .limit(1)
        .maybeSingle();

      if (profile) {
        if (profile.telegram_bot_token && !activeToken) {
          activeToken = profile.telegram_bot_token.trim();
        }
        if (profile.telegram_admin_chat_id && !allowedChatId) {
          allowedChatId = String(profile.telegram_admin_chat_id).trim();
        }
      }
    } catch (e) {
      console.warn('Gagal membaca tabel profiles untuk token Telegram:', e.message);
    }

    // 3. Security Verification (Admin Authorization)
    if (allowedChatId) {
      const allowedList = String(allowedChatId).split(',').map(s => s.trim());
      if (!allowedList.includes(String(chatId))) {
        if (activeToken) {
          await sendTelegramMessage(
            chatId,
            `⛔ *Akses Ditolak*\n\nMaaf ${senderName}, ID Telegram Anda (\`${chatId}\`) belum didaftarkan sebagai Admin R&D GrowthFlow.\n\nSilakan masukkan Chat ID ini di menu *Pengaturan Web R&D GrowthFlow* untuk memberikan otorisasi akses.`,
            activeToken
          );
        }
        return res.status(200).json({ ok: false, reason: 'Unauthorized chat ID' });
      }
    }

    // 4. Process Command & Formulate Response
    const responseText = await processCommand(text, senderName, chatId);
    if (responseText && activeToken) {
      await sendTelegramMessage(chatId, responseText, activeToken);
    }

    return res.status(200).json({ ok: true, processed: true });
  } catch (err) {
    console.error('Webhook Execution Error:', err);
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
_Yayasan Khoirur Rooziqiin • Bandung Barat_
━━━━━━━━━━━━━━━━━━━━

Gunakan perintah berikut untuk mengelola program donasi secara live:

📊 */donasi* atau */list*
Melihat rekap semua program donasi, capaian target, CPR & ROI.

➕ */tambah [Nama] | [Target] | [Realisasi] | [AdSpend] | [Donatur]*
Menambah program donasi baru.
_Bisa gunakan pemisah pipa (\`|\`) atau koma (\`,\`)._
_Contoh:_
\`/tambah Wakaf Ambulans | 150jt | 30jt | 4jt | 150\`

✏️ */edit [Nama/ID] | [Realisasi] | [AdSpend] | [Donatur]*
Mengupdate capaian donasi & biaya iklan saat ini.
_Contoh:_
\`/edit Wakaf Ambulans | 45jt | 6jt | 250\`

🎯 */kpi*
Melihat ringkasan capaian agregat ZISWAF dan performa kuartal.

🔍 */cari [kata kunci]*
Mencari detail program donasi spesifik.

🗑️ */hapus [Nama/ID]*
Menghapus program donasi dari sistem.

━━━━━━━━━━━━━━━━━━━━
🆔 *ID Telegram Anda:* \`${chatId}\``;
  }

  // 2. /donasi atau /list
  if (command === '/donasi' || command === '/list') {
    const { data: programs, error } = await supabase
      .from('donation_programs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !programs || programs.length === 0) {
      return `📭 Belum ada program donasi yang tercatat di database Supabase.\n\nKetik \`/tambah Nama | Target | Realisasi | AdSpend | Donatur\` untuk menambahkan.`;
    }

    let out = `📊 *DAFTAR PROGRAM DONASI R&D GROWTHFLOW*\n`;
    out += `_Yayasan Khoirur Rooziqiin • Bandung Barat_\n`;
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
_Yayasan Khoirur Rooziqiin • Bandung Barat_
━━━━━━━━━━━━━━━━━━━━

💰 *Total Realisasi:* ${formatRupiah(totalRevenue)}
🎯 *Total Target:* ${formatRupiah(totalTarget)}
📈 *Capaian Target:* *${percent}%*

📢 *Total Ad Spend:* ${formatRupiah(totalAdSpend)}
👥 *Total Donatur Baru:* *${totalDonors} Jiwa*
⚡ *Cost Per Result (CPR):* *${formatRupiah(cpr)}*
🚀 *Return On Investment (ROI):* *${roi}%*

━━━━━━━━━━━━━━━━━━━━
⚡ _Data live tersinkronisasi otomatis dengan dashboard web._`;
  }

  // 4. /tambah
  if (command === '/tambah') {
    if (!argsText) {
      return `Format salah. Gunakan:\n\`/tambah Nama Program | Target | Realisasi | AdSpend | Donatur\`\n\n_Contoh:_\n\`/tambah Wakaf Ambulans | 150jt | 30jt | 4jt | 150\``;
    }

    // Support both pipe '|' and comma ','
    let segments = [];
    if (argsText.includes('|')) {
      segments = argsText.split('|').map(s => s.trim());
    } else if (argsText.includes(',')) {
      segments = argsText.split(',').map(s => s.trim());
    } else {
      return `⚠️ Gunakan tanda pemisah pipa (\`|\`) atau koma (\`,\`):\n\`/tambah Nama Program | Target | Realisasi | AdSpend | Donatur\`\n\n_Contoh:_\n\`/tambah Wakaf Ambulans | 150jt | 30jt | 4jt | 150\``;
    }

    const name = segments[0];
    const target = parseCurrencyString(segments[1] || '0');
    const realized = parseCurrencyString(segments[2] || '0');
    const adSpend = parseCurrencyString(segments[3] || '0');
    const donors = parseInt(segments[4] || '0', 10);

    if (!name) {
      return `❌ Nama program donasi wajib diisi!`;
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
    const percent = target > 0 ? Math.round((realized / target) * 100) : 0;

    return `✅ *PROGRAM DONASI BERHASIL DITAMBAHKAN!*
━━━━━━━━━━━━━━━━━━━━
📌 *Nama:* ${name}
🎯 *Target:* ${formatRupiah(target)}
💰 *Realisasi Awal:* ${formatRupiah(realized)} (*${percent}%*)
📢 *Ad Spend:* ${formatRupiah(adSpend)}
👥 *Donatur Baru:* ${donors}
⚡ *CPR:* ${formatRupiah(cpr)} | *ROI:* ${roi}%
━━━━━━━━━━━━━━━━━━━━
⚡ _Data telah masuk dan live real-time di web R&D GrowthFlow._`;
  }

  // 5. /edit
  if (command === '/edit') {
    if (!argsText) {
      return `Format salah. Gunakan:\n\`/edit Nama/ID Program | Realisasi Baru | AdSpend Baru | Donatur Baru\`\n\n_Contoh:_\n\`/edit Wakaf Ambulans | 45jt | 6jt | 250\``;
    }

    // Support both pipe '|' and comma ','
    let segments = [];
    if (argsText.includes('|')) {
      segments = argsText.split('|').map(s => s.trim());
    } else if (argsText.includes(',')) {
      segments = argsText.split(',').map(s => s.trim());
    } else {
      return `⚠️ Gunakan tanda pemisah pipa (\`|\`) atau koma (\`,\`):\n\`/edit Nama Program | Realisasi | AdSpend | Donatur\``;
    }

    const query = segments[0];
    let target = null;
    let realized = 0;
    let adSpend = 0;
    let donors = 0;

    // If 5 parameters passed: query | target | realized | adSpend | donors
    if (segments.length >= 5) {
      target = parseCurrencyString(segments[1] || '0');
      realized = parseCurrencyString(segments[2] || '0');
      adSpend = parseCurrencyString(segments[3] || '0');
      donors = parseInt(segments[4] || '0', 10);
    } else {
      // 4 parameters: query | realized | adSpend | donors
      realized = parseCurrencyString(segments[1] || '0');
      adSpend = parseCurrencyString(segments[2] || '0');
      donors = parseInt(segments[3] || '0', 10);
    }

    if (!query) {
      return `❌ Nama atau ID program yang ingin diedit wajib diisi!`;
    }

    // Find program by ID or matching Name
    let existingProg = null;

    // Search exact ID first or name matching
    const { data: existing, error: searchError } = await supabase
      .from('donation_programs')
      .select('*')
      .or(`id.eq.${query},name.ilike.%${query}%`)
      .limit(1);

    if (existing && existing.length > 0) {
      existingProg = existing[0];
    } else {
      // Try searching by first keyword
      const firstWord = query.split(' ')[0];
      const { data: fallback } = await supabase
        .from('donation_programs')
        .select('*')
        .ilike('name', `%${firstWord}%`)
        .limit(1);
      if (fallback && fallback.length > 0) {
        existingProg = fallback[0];
      }
    }

    if (!existingProg) {
      // Fetch available programs to guide the user
      const { data: allProgs } = await supabase.from('donation_programs').select('name').limit(5);
      const namesList = (allProgs || []).map(p => `• \`${p.name}\``).join('\n');
      return `❌ Program donasi "*${query}*" tidak ditemukan di database.\n\n*Program yang tersedia:*\n${namesList}\n\nKetik \`/list\` untuk melihat semua program.`;
    }

    const prog = existingProg;
    const updates = {
      realized_amount: realized,
      ad_spend: adSpend,
      new_donors: donors
    };
    if (target !== null && target > 0) {
      updates.target_amount = target;
    }

    const { error: updateError } = await supabase
      .from('donation_programs')
      .update(updates)
      .eq('id', prog.id);

    if (updateError) {
      return `❌ Gagal memperbarui program donasi:\n_${updateError.message}_`;
    }

    const effectiveTarget = target !== null && target > 0 ? target : (Number(prog.target_amount) || 0);
    const percent = effectiveTarget > 0 ? Math.round((realized / effectiveTarget) * 100) : 0;
    const cpr = donors > 0 ? Math.round(adSpend / donors) : 0;
    const roi = adSpend > 0 ? Math.round(((realized - adSpend) / adSpend) * 100) : 0;

    return `✅ *PROGRAM DONASI BERHASIL DIPERBARUI!*
━━━━━━━━━━━━━━━━━━━━
📌 *Program:* ${prog.name}
🎯 *Target:* ${formatRupiah(effectiveTarget)}
💰 *Realisasi Baru:* ${formatRupiah(realized)} (*${percent}%*)
📢 *Ad Spend Baru:* ${formatRupiah(adSpend)}
👥 *Donatur Baru:* ${donors}
⚡ *CPR Baru:* ${formatRupiah(cpr)} | *ROI Baru:* ${roi}%
━━━━━━━━━━━━━━━━━━━━
⚡ _Data telah diperbarui secara langsung di web dashboard R&D._`;
  }

  // 6. /cari
  if (command === '/cari') {
    if (!argsText) return `Ketik \`/cari <kata kunci>\` untuk mencari program.`;
    const { data: found } = await supabase
      .from('donation_programs')
      .select('*')
      .ilike('name', `%${argsText}%`);

    if (!found || found.length === 0) {
      return `Tidak ditemukan program donasi dengan kata kunci "*${argsText}*".`;
    }

    let out = `🔍 *HASIL PENCARIAN ("${argsText}")*\n\n`;
    found.forEach((p, idx) => {
      out += `${idx + 1}. *${p.name}* (ID: \`${p.id}\`)\n   Target: ${formatRupiah(p.target_amount)} | Realisasi: ${formatRupiah(p.realized_amount)}\n\n`;
    });
    return out;
  }

  // 7. /hapus
  if (command === '/hapus' || command === '/delete') {
    if (!argsText) return `Ketik \`/hapus <nama atau ID>\` untuk menghapus program donasi.`;

    const { data: existing } = await supabase
      .from('donation_programs')
      .select('*')
      .or(`id.eq.${argsText},name.ilike.%${argsText}%`)
      .limit(1);

    if (!existing || existing.length === 0) {
      return `Program "*${argsText}*" tidak ditemukan untuk dihapus.`;
    }

    const progToDelete = existing[0];
    const { error: delError } = await supabase
      .from('donation_programs')
      .delete()
      .eq('id', progToDelete.id);

    if (delError) {
      return `❌ Gagal menghapus: ${delError.message}`;
    }

    return `🗑️ Program *${progToDelete.name}* berhasil dihapus dari database.`;
  }

  return `Perintah tidak dikenali. Ketik */help* untuk melihat daftar perintah yang tersedia.`;
}

/**
 * Send message to Telegram API with robust Markdown fallback
 */
async function sendTelegramMessage(chatId, text, tokenOverride) {
  const token = tokenOverride || process.env.TELEGRAM_BOT_TOKEN || process.env.VITE_TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.warn('TELEGRAM_BOT_TOKEN tidak ditemukan.');
    return;
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'Markdown'
      })
    });
    const resJson = await res.json();
    if (!resJson.ok) {
      console.warn('Telegram API warning:', resJson.description);
      // Fallback: If Markdown entity parsing failed, send as plain text
      if (resJson.description && resJson.description.includes('entity')) {
        await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: text.replace(/[*_`\[\]]/g, '')
          })
        });
      }
    }
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
