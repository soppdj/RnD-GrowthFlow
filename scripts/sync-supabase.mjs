/**
 * Automated Sync & Uploader for Supabase
 * Target: https://rsnjmllhuucyophursng.supabase.co
 * Runs on Node.js to upload / synchronize current state to Supabase.
 */

import { createClient } from '@supabase/supabase-js';
import { initialProfile, initialTasks, initialMilestones, initialJournalLogs, initialCampaigns, initialDonationPrograms, initialRdKpis } from '../src/utils/mockData.js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://rsnjmllhuucyophursng.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzbmptbGxodXVjeW9waHVyc25nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIxMzQ0MTAsImV4cCI6MjEwNzcxMDQxMH0.nVLriES26tvWFXLbkeD0irZs7AXZvsFq7Zdue7jKClI';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export async function syncAll() {
  console.log(`[Supabase Sync] Connecting to ${SUPABASE_URL}...`);

  // 1. Sync Profile
  try {
    const profilePayload = {
      id: 'default-user',
      full_name: initialProfile.fullName,
      role: initialProfile.role,
      organization: initialProfile.organization,
      tagline: initialProfile.tagline,
      quarter_target: initialProfile.quarterTarget,
      work_capacity_hours_per_day: initialProfile.workCapacityHoursPerDay,
      work_days_per_week: initialProfile.workDaysPerWeek,
      foundation_address: initialProfile.foundationAddress,
      foundation_contact: initialProfile.foundationContact
    };
    const { error: pErr } = await supabase.from('profiles').upsert(profilePayload);
    if (pErr) console.warn('[Sync] Profile error:', pErr.message);
    else console.log('✓ Profile synced');
  } catch (err) {
    console.warn('[Sync] Profile exception:', err.message);
  }

  // 2. Sync Milestones
  try {
    const milestonePayloads = initialMilestones.map(m => ({
      id: m.id,
      title: m.title,
      deadline: m.deadline,
      type: m.type,
      category: m.category,
      target_metric: m.targetMetric,
      progress_percent: m.progressPercent,
      status: m.status
    }));
    const { error: mErr } = await supabase.from('milestones').upsert(milestonePayloads);
    if (mErr) console.warn('[Sync] Milestones error:', mErr.message);
    else console.log(`✓ ${milestonePayloads.length} Milestones synced`);
  } catch (err) {
    console.warn('[Sync] Milestones exception:', err.message);
  }

  // 3. Sync Journal Logs
  try {
    const logPayloads = initialJournalLogs.map(l => ({
      id: l.id,
      date: l.date,
      focus: l.focus,
      evaluation: l.evaluation,
      growth_findings: l.growthFindings,
      next_steps: l.nextSteps
    }));
    const { error: lErr } = await supabase.from('journal_logs').upsert(logPayloads);
    if (lErr) console.warn('[Sync] Journal Logs error:', lErr.message);
    else console.log(`✓ ${logPayloads.length} Journal Logs synced`);
  } catch (err) {
    console.warn('[Sync] Journal Logs exception:', err.message);
  }

  // 4. Sync Campaigns
  try {
    const campPayloads = initialCampaigns.map(c => ({
      id: c.id,
      name: c.name,
      platform: c.platform,
      stage: c.stage,
      ad_spend: c.adSpend,
      new_donors: c.newDonors,
      revenue: c.revenue,
      hook_type: c.hookType,
      status: c.status,
      start_date: c.startDate,
      notes: c.notes
    }));
    const { error: cErr } = await supabase.from('campaigns').upsert(campPayloads);
    if (cErr) console.warn('[Sync] Campaigns error:', cErr.message);
    else console.log(`✓ ${campPayloads.length} Campaigns synced`);
  } catch (err) {
    console.warn('[Sync] Campaigns exception:', err.message);
  }

  // 5. Sync Donation Programs
  try {
    const progPayloads = initialDonationPrograms.map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      target_amount: p.targetAmount,
      realized_amount: p.realizedAmount,
      ad_spend: p.adSpend,
      new_donors: p.newDonors,
      status: p.status,
      description: p.description
    }));
    const { error: prErr } = await supabase.from('donation_programs').upsert(progPayloads);
    if (prErr) console.warn('[Sync] Donation Programs error:', prErr.message);
    else console.log(`✓ ${progPayloads.length} Donation Programs synced`);
  } catch (err) {
    console.warn('[Sync] Donation Programs exception:', err.message);
  }

  console.log('[Supabase Sync] Selesai!');
}

syncAll();
