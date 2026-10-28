import { defineStore } from 'pinia';
import {
  initialProfile,
  initialTasks,
  initialJournalLogs,
  initialMilestones,
  initialCampaigns,
  initialDonationPrograms,
  initialRdProductPrice,
  initialRdKpis
} from '@/utils/mockData';
import { calculateROI, calculateCPR } from '@/utils/formatters';
import { createClient } from '@supabase/supabase-js';

const STORAGE_KEY = 'rnd_growthflow_v1';

export const useGrowthFlowStore = defineStore('growthFlow', {
  state: () => {
    // Try to load cached data or fallback to rich mock data
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Load profile with backwards-compatible defaults for avatar adjustments
        let profile = { ...initialProfile, ...(parsed.profile || {}) };
        profile.foundationAddress = 'Jl. Raya Cimareme Rt.001 Rw.002 Desa Cimareme Kec. Ngamprah Kab. Bandung Barat';
        profile.workDaysPerWeek = profile.workDaysPerWeek || 5;
        if (profile.fullName === 'Ustadz Rizky Syahputra') {
          profile = { ...initialProfile, ...profile, fullName: 'Sopianto Djahar' };
        }

        let donationPrograms = parsed.donationPrograms;
        if (!donationPrograms || donationPrograms.length < 5 || (donationPrograms[0] && donationPrograms[0].name === 'Wakaf Sumur Air Bersih Pelosok')) {
          donationPrograms = [...initialDonationPrograms];
        }

        // Backward compatibility: load updated week tasks if existing list is short
        let tasks = parsed.tasks || initialTasks;
        if (!Array.isArray(tasks) || tasks.length < 8) {
          tasks = [...initialTasks];
        } else {
          tasks = tasks.map(t => {
            const init = initialTasks.find(it => it.id === t.id);
            if (init) {
              return {
                ...init,
                ...t,
                date: t.date || init.date,
                obstacle: t.obstacle !== undefined ? t.obstacle : init.obstacle,
                evaluation: t.evaluation !== undefined ? t.evaluation : init.evaluation,
                conclusion: t.conclusion !== undefined ? t.conclusion : init.conclusion,
                workResultUrl: t.workResultUrl || init.workResultUrl,
                workResultTitle: t.workResultTitle || init.workResultTitle,
                attachments: t.attachments || init.attachments
              };
            }
            return t;
          });
        }

        let milestones = parsed.milestones || initialMilestones;
        if (!Array.isArray(milestones) || milestones.length < 4) {
          milestones = [...initialMilestones];
        } else {
          milestones = milestones.map(m => {
            const init = initialMilestones.find(im => im.id === m.id);
            if (init) {
              return {
                ...init,
                ...m,
                workResultUrl: m.workResultUrl || init.workResultUrl,
                workResultTitle: m.workResultTitle || init.workResultTitle,
                attachments: m.attachments || init.attachments,
                obstacle: m.obstacle !== undefined ? m.obstacle : init.obstacle,
                evaluation: m.evaluation !== undefined ? m.evaluation : init.evaluation,
                conclusion: m.conclusion !== undefined ? m.conclusion : init.conclusion
              };
            }
            return m;
          });
        }

        let rdKpis = [...initialRdKpis];
        if (Array.isArray(parsed.rdKpis) && parsed.rdKpis.length >= 9) {
          rdKpis = initialRdKpis.map((init, idx) => {
            const found = parsed.rdKpis.find(k => k.id === init.id);
            return {
              ...init,
              no: idx + 1,
              currentValue: found ? found.currentValue : init.currentValue,
              currentValueFormatted: found ? found.currentValueFormatted : init.currentValueFormatted
            };
          });
        }

        let campaigns = parsed.campaigns || initialCampaigns;
        if (Array.isArray(campaigns)) {
          campaigns = campaigns.map(c => {
            if (c.name && c.name.includes('"')) {
              const match = c.name.match(/"([^"]+)"/);
              if (match) {
                return { ...c, name: match[1].trim() };
              }
            } else if (c.name && c.name.includes(',')) {
              const parts = c.name.split(',');
              const candidate = parts.find(p => {
                const clean = p.trim().replace(/^["']|["']$/g, '');
                return clean.length > 3 && !/^\d{4}-\d{2}-\d{2}$/.test(clean) && isNaN(Number(clean)) && !clean.startsWith('active') && !clean.startsWith('actions:');
              });
              if (candidate) return { ...c, name: candidate.trim().replace(/^["']|["']$/g, '') };
            }
            return c;
          });
        }

        return {
          profile: profile || initialProfile,
          tasks: tasks || initialTasks,
          journalLogs: parsed.journalLogs || initialJournalLogs,
          milestones: milestones || initialMilestones,
          campaigns: campaigns || initialCampaigns,
          donationPrograms: donationPrograms || initialDonationPrograms,
          rdProductPrice: parsed.rdProductPrice !== undefined ? parsed.rdProductPrice : initialRdProductPrice,
          rdKpis: rdKpis,
          activeTab: 'dashboard',
          currentDate: new Date().toISOString(),
          filterPeriod: 'q4-2026',
          searchQuery: '',
          isOffline: !navigator.onLine
        };
      } catch (e) {
        console.error('Failed to parse saved state, using mock data:', e);
      }
    }

    return {
      profile: { ...initialProfile },
      tasks: [...initialTasks],
      journalLogs: [...initialJournalLogs],
      milestones: [...initialMilestones],
      campaigns: [...initialCampaigns],
      donationPrograms: [...initialDonationPrograms],
      rdProductPrice: initialRdProductPrice,
      rdKpis: [...initialRdKpis],
      activeTab: 'dashboard',
      currentDate: new Date().toISOString(),
      filterPeriod: 'q4-2026',
      searchQuery: '',
      isOffline: !navigator.onLine
    };
  },

  getters: {
    // Overall KPI Summary
    kpiSummary(state) {
      const totalAdSpend = state.donationPrograms.reduce((sum, p) => sum + (Number(p.adSpend) || 0), 0);
      const totalRevenue = state.donationPrograms.reduce((sum, p) => sum + (Number(p.realizedAmount) || 0), 0);
      const totalTarget = state.donationPrograms.reduce((sum, p) => sum + (Number(p.targetAmount) || 0), 0);
      const totalNewDonors = state.donationPrograms.reduce((sum, p) => sum + (Number(p.newDonors) || 0), 0);

      const overallROI = calculateROI(totalRevenue, totalAdSpend);
      const overallCPR = calculateCPR(totalAdSpend, totalNewDonors);
      const targetAchievementPercent = totalTarget > 0 ? (totalRevenue / totalTarget) * 100 : 0;
      const quarterAchievementPercent = (state.profile.quarterTarget || 1) > 0
        ? (totalRevenue / state.profile.quarterTarget) * 100
        : 0;

      // R&D Growth Marketing Standards
      const avgDonationValue = totalNewDonors > 0 ? Math.round(totalRevenue / totalNewDonors) : 0;
      const testCampaignsCount = state.campaigns.filter(c => c.stage === 'TEST').length;
      const scaleCampaignsCount = state.campaigns.filter(c => c.stage === 'SCALE_1' || c.stage === 'SCALE_2').length;
      const totalCampaignsCount = state.campaigns.length;
      const validationWinRate = totalCampaignsCount > 0 ? Math.round((scaleCampaignsCount / totalCampaignsCount) * 100) : 0;
      const landingPageConversionRate = 7.4;
      const ltvMultiplier = 4.8;
      const validationCycleDays = 4.5;

      return {
        totalAdSpend,
        totalRevenue,
        totalTarget,
        totalNewDonors,
        overallROI,
        overallCPR,
        targetAchievementPercent: Math.min(Math.round(targetAchievementPercent), 100),
        rawTargetAchievementPercent: targetAchievementPercent,
        quarterAchievementPercent: Math.min(Math.round(quarterAchievementPercent), 100),
        rawQuarterAchievementPercent: quarterAchievementPercent,
        avgDonationValue,
        testCampaignsCount,
        scaleCampaignsCount,
        totalCampaignsCount,
        validationWinRate,
        landingPageConversionRate,
        ltvMultiplier,
        validationCycleDays
      };
    },

    // Standar Baku KPI Ads (Lembar Kerja SOP Gambar Acuan)
    rdKpiList(state) {
      const price = Number(state.rdProductPrice) || 0;
      const desiredOrder = ['ctr', 'cpc', 'lc_to_lpv', 'cost_lpv', 'cpm', 'lpv_to_atc', 'atc_to_ic', 'cpr', 'closing_rate'];

      const list = [...(state.rdKpis || [])].sort((a, b) => {
        const idxA = desiredOrder.indexOf(a.id);
        const idxB = desiredOrder.indexOf(b.id);
        return (idxA !== -1 ? idxA : 99) - (idxB !== -1 ? idxB : 99);
      });

      return list.map((kpi, index) => {
        let actualTarget = kpi.actualTarget;
        let actualTargetFormatted = kpi.actualTargetFormatted;

        // Auto-recalculate dynamically based on formulas from Harga Jual
        if (kpi.id === 'cpc') {
          // 1% of Harga Jual
          actualTarget = Math.round(price * 0.01);
          actualTargetFormatted = `Rp${actualTarget.toLocaleString('id-ID')}`;
        } else if (kpi.id === 'cost_lpv') {
          // 2 - 3% of Harga Jual (menggunakan target 3%)
          actualTarget = Math.round(price * 0.03);
          actualTargetFormatted = `Rp${actualTarget.toLocaleString('id-ID')}`;
        } else if (kpi.id === 'cpm') {
          // Fixed 32 K Objective Sales
          actualTarget = 32000;
          actualTargetFormatted = 'Rp32.000';
        } else if (kpi.id === 'ctr') {
          // Fixed diatas 2%
          actualTarget = 2.0;
          actualTargetFormatted = 'diatas 2%';
        } else if (kpi.id === 'cpr') {
          // 25% of Harga Jual
          actualTarget = Math.round(price * 0.25);
          actualTargetFormatted = `Rp${actualTarget.toLocaleString('id-ID')}`;
        } else if (kpi.id === 'closing_rate') {
          // Fixed 82%
          actualTarget = 82;
          actualTargetFormatted = '82%';
        } else if (kpi.id === 'lc_to_lpv') {
          // Fixed 80%
          actualTarget = 80;
          actualTargetFormatted = '80%';
        } else if (kpi.id === 'lpv_to_atc') {
          // Fixed 40%
          actualTarget = 40;
          actualTargetFormatted = '40%';
        } else if (kpi.id === 'atc_to_ic') {
          // Fixed 30%
          actualTarget = 30;
          actualTargetFormatted = '30%';
        }

        // Clean metric name matching user marking
        let cleanMetric = kpi.metric;
        if (kpi.id === 'cpc') cleanMetric = 'CPC';
        else if (kpi.id === 'cost_lpv') cleanMetric = 'Cost LPV';
        else if (kpi.id === 'ctr') cleanMetric = 'CTR';
        else if (kpi.id === 'cpr') cleanMetric = 'CPR';
        else if (kpi.id === 'closing_rate') cleanMetric = 'Closing Rate';
        else if (kpi.id === 'lc_to_lpv') cleanMetric = 'LC to LPV';
        else if (kpi.id === 'lpv_to_atc') cleanMetric = 'LPV to ATC';
        else if (kpi.id === 'atc_to_ic') cleanMetric = 'ATC to IC';

        return {
          ...kpi,
          no: index + 1,
          metric: cleanMetric,
          productPriceFormatted: kpi.hasProductPrice ? `Rp${price.toLocaleString('id-ID')}` : '',
          productPriceValue: kpi.hasProductPrice ? price : null,
          actualTarget,
          actualTargetFormatted
        };
      });
    },

    // Work Capacity Calculation (Kartu Kapasitas Kerja)
    workCapacity(state) {
      const maxHours = Number(state.profile.workCapacityHoursPerDay) || 8;
      const todayStr = new Date().toISOString().split('T')[0];
      const todayTasks = state.tasks.filter(t => t.date === todayStr || !t.date);
      
      const loggedHours = todayTasks
        .filter(t => t.completed)
        .reduce((sum, t) => sum + (Number(t.estimatedHours) || 0), 0);
        
      const pendingHours = todayTasks
        .filter(t => !t.completed)
        .reduce((sum, t) => sum + (Number(t.estimatedHours) || 0), 0);

      const remainingHours = Math.max(0, maxHours - loggedHours);
      const utilizationRate = maxHours > 0 ? Math.round((loggedHours / maxHours) * 100) : 0;

      let status = 'Terkendali';
      let statusColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
      if (utilizationRate > 100) {
        status = 'Kapasitas Penuh / Lembur';
        statusColor = 'text-rose-700 bg-rose-50 border-rose-200';
      } else if (utilizationRate >= 70) {
        status = 'Optimal (Zona Fokus)';
        statusColor = 'text-teal-700 bg-teal-50 border-teal-200';
      } else {
        status = 'Tersedia Kapasitas';
        statusColor = 'text-blue-700 bg-blue-50 border-blue-200';
      }

      const now = new Date();
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      const daysRemainingInMonth = Math.max(0, lastDay - now.getDate());

      return {
        maxHours,
        loggedHours,
        pendingHours,
        remainingHours,
        utilizationRate,
        status,
        statusColor,
        daysRemainingInMonth,
        completedCount: todayTasks.filter(t => t.completed).length,
        totalTodayCount: todayTasks.length
      };
    },

    // Dynamic LogFrame Progress (automatically reacts to task checks)
    logFrameProgress(state) {
      const categories = ['GOAL', 'OUTCOME', 'OUTPUT', 'ACTIVITY'];
      const result = {};

      categories.forEach(cat => {
        const catTasks = state.tasks.filter(t => t.category === cat);
        const total = catTasks.length;
        const completed = catTasks.filter(t => t.completed).length;
        const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

        result[cat] = {
          total,
          completed,
          percent,
          pending: total - completed
        };
      });

      return result;
    },

    // Ad Lab Campaigns grouped by Kanban stage
    campaignsByStage(state) {
      return {
        TEST: state.campaigns.filter(c => c.stage === 'TEST'),
        SCALE_1: state.campaigns.filter(c => c.stage === 'SCALE_1'),
        SCALE_2: state.campaigns.filter(c => c.stage === 'SCALE_2')
      };
    },

    // Recommendations for Scale-up (Crucial for report & strategic decision)
    // Ordered from HIGHEST ROI to LOWEST ROI
    scaleUpRecommendations(state) {
      const sorted = [...state.campaigns]
        .map(camp => {
          const roi = calculateROI(camp.revenue, camp.adSpend);
          const cpr = calculateCPR(camp.adSpend, camp.newDonors);
          let recommendation = 'Tahan / Evaluasi Ulang';
          let recBadge = 'bg-slate-100 text-slate-700 border-slate-200';
          let priorityScore = 1;

          if (roi >= 400 && cpr <= 50000) {
            recommendation = '🚀 Injeksi Skala Penuh (+50% Budget)';
            recBadge = 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold';
            priorityScore = 4;
          } else if (roi >= 250 && cpr <= 60000) {
            recommendation = '📈 Scale Bertahap (+25% Budget)';
            recBadge = 'bg-teal-100 text-teal-800 border-teal-300 font-semibold';
            priorityScore = 3;
          } else if (roi >= 100) {
            recommendation = '🔬 Optimasi Mikro-Kreatif';
            recBadge = 'bg-amber-100 text-amber-800 border-amber-300';
            priorityScore = 2;
          } else {
            recommendation = '🛑 Stop / Ganti Angle Hook';
            recBadge = 'bg-rose-100 text-rose-800 border-rose-300';
            priorityScore = 0;
          }

          return {
            ...camp,
            calculatedROI: roi,
            calculatedCPR: cpr,
            recommendation,
            recBadge,
            priorityScore
          };
        })
        .sort((a, b) => b.calculatedROI - a.calculatedROI);

      return sorted;
    }
  },

  actions: {
    getSupabaseClient() {
      if (this.profile.supabaseUrl && this.profile.supabaseAnonKey) {
        try {
          return createClient(this.profile.supabaseUrl, this.profile.supabaseAnonKey);
        } catch (e) {
          console.error('Failed to create Supabase client:', e);
        }
      }
      return null;
    },

    saveToStorage() {
      try {
        const payload = {
          profile: this.profile,
          tasks: this.tasks,
          journalLogs: this.journalLogs,
          milestones: this.milestones,
          campaigns: this.campaigns,
          donationPrograms: this.donationPrograms,
          rdProductPrice: this.rdProductPrice,
          rdKpis: this.rdKpis
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch (e) {
        console.error('Failed to save to local storage:', e);
      }
    },

    async syncWithSupabase() {
      const client = this.getSupabaseClient();
      if (!client) return;

      try {
        // Fetch tasks
        const { data: dbTasks, error: taskErr } = await client.from('tasks').select('*');
        if (!taskErr && dbTasks && dbTasks.length > 0) {
          this.tasks = dbTasks.map(t => ({
            id: t.id,
            title: t.title,
            category: t.category,
            completed: t.completed,
            estimatedHours: Number(t.estimated_hours) || 1.0,
            priority: t.priority,
            date: t.date,
            notes: t.notes
          }));
        }

        // Fetch campaigns
        const { data: dbCampaigns, error: campErr } = await client.from('campaigns').select('*');
        if (!campErr && dbCampaigns && dbCampaigns.length > 0) {
          this.campaigns = dbCampaigns.map(c => ({
            id: c.id,
            name: c.name,
            platform: c.platform,
            stage: c.stage,
            adSpend: Number(c.ad_spend) || 0,
            newDonors: Number(c.new_donors) || 0,
            revenue: Number(c.revenue) || 0,
            hookType: c.hook_type,
            status: c.status,
            startDate: c.start_date,
            notes: c.notes
          }));
        }

        // Fetch donation programs
        const { data: dbPrograms, error: progErr } = await client.from('donation_programs').select('*');
        if (!progErr && dbPrograms && dbPrograms.length > 0) {
          this.donationPrograms = dbPrograms.map(p => ({
            id: p.id,
            name: p.name,
            category: p.category,
            targetAmount: Number(p.target_amount) || 0,
            realizedAmount: Number(p.realized_amount) || 0,
            adSpend: Number(p.ad_spend) || 0,
            newDonors: Number(p.new_donors) || 0,
            status: p.status,
            description: p.description
          }));
        }

        this.saveToStorage();
      } catch (e) {
        console.error('Error syncing with Supabase:', e);
      }
    },

    setActiveTab(tab) {
      this.activeTab = tab;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    // Task Actions
    toggleTask(taskId) {
      const task = this.tasks.find(t => t.id === taskId);
      if (task) {
        task.completed = !task.completed;
        this.saveToStorage();

        // Sync to Supabase if connected
        const client = this.getSupabaseClient();
        if (client) {
          client.from('tasks').update({ completed: task.completed }).eq('id', taskId).then();
        }

        return task.completed;
      }
      return false;
    },

    completeTaskWithEvaluation(taskId, { obstacle = '', evaluation = '', conclusion = '' } = {}) {
      const task = this.tasks.find(t => t.id === taskId);
      if (task) {
        task.completed = true;
        if (obstacle) task.obstacle = obstacle;
        if (evaluation) task.evaluation = evaluation;
        if (conclusion) task.conclusion = conclusion;
        this.saveToStorage();

        // Sync to Supabase if connected
        const client = this.getSupabaseClient();
        if (client) {
          client.from('tasks').update({
            completed: true,
            obstacle: task.obstacle || null,
            evaluation: task.evaluation || null,
            conclusion: task.conclusion || null
          }).eq('id', taskId).then();
        }

        return true;
      }
      return false;
    },

    setWorkDaysPerWeek(days) {
      if (this.profile) {
        this.profile.workDaysPerWeek = days;
        this.saveToStorage();
      }
    },

    addTask(taskData) {
      const newTask = {
        id: 'task-' + Date.now(),
        date: new Date().toISOString().split('T')[0],
        completed: false,
        estimatedHours: 1.0,
        priority: 'MEDIUM',
        category: 'OUTPUT',
        notes: '',
        ...taskData
      };
      this.tasks.unshift(newTask);
      this.saveToStorage();

      // Sync to Supabase if connected
      const client = this.getSupabaseClient();
      if (client) {
        client.from('tasks').insert({
          title: newTask.title,
          category: newTask.category,
          completed: newTask.completed,
          estimated_hours: newTask.estimatedHours,
          priority: newTask.priority,
          date: newTask.date,
          notes: newTask.notes
        }).then();
      }

      return newTask;
    },

    updateTask(taskId, updates) {
      const idx = this.tasks.findIndex(t => t.id === taskId);
      if (idx !== -1) {
        this.tasks[idx] = { ...this.tasks[idx], ...updates };
        this.saveToStorage();

        const client = this.getSupabaseClient();
        if (client) {
          client.from('tasks').update({
            title: this.tasks[idx].title,
            category: this.tasks[idx].category,
            completed: this.tasks[idx].completed,
            estimated_hours: this.tasks[idx].estimatedHours,
            priority: this.tasks[idx].priority,
            notes: this.tasks[idx].notes
          }).eq('id', taskId).then();
        }
      }
    },

    deleteTask(taskId) {
      this.tasks = this.tasks.filter(t => t.id !== taskId);
      this.saveToStorage();

      const client = this.getSupabaseClient();
      if (client) {
        client.from('tasks').delete().eq('id', taskId).then();
      }
    },

    // Journal Log Actions
    addJournalLog(logData) {
      const newLog = {
        id: 'log-' + Date.now(),
        date: new Date().toISOString().split('T')[0],
        focus: '',
        evaluation: '',
        growthFindings: '',
        nextSteps: '',
        ...logData
      };
      this.journalLogs.unshift(newLog);
      this.saveToStorage();

      const client = this.getSupabaseClient();
      if (client) {
        client.from('journal_logs').insert({
          date: newLog.date,
          focus: newLog.focus,
          evaluation: newLog.evaluation,
          growth_findings: newLog.growthFindings,
          next_steps: newLog.nextSteps
        }).then();
      }

      return newLog;
    },

    updateJournalLog(logId, updates) {
      const idx = this.journalLogs.findIndex(l => l.id === logId);
      if (idx !== -1) {
        this.journalLogs[idx] = { ...this.journalLogs[idx], ...updates };
        this.saveToStorage();
      }
    },

    // Milestone Actions
    addMilestone(milestoneData) {
      const newM = {
        id: 'm-' + Date.now(),
        deadline: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
        progressPercent: 0,
        status: 'In Progress',
        type: 'Monthly',
        category: 'OUTCOME',
        ...milestoneData
      };
      this.milestones.push(newM);
      this.saveToStorage();
      return newM;
    },

    updateMilestone(milestoneId, updates) {
      const idx = this.milestones.findIndex(m => m.id === milestoneId);
      if (idx !== -1) {
        this.milestones[idx] = { ...this.milestones[idx], ...updates };
        this.saveToStorage();
      }
    },

    completeMilestoneWithEvaluation(milestoneId, { obstacle = '', evaluation = '', conclusion = '' } = {}) {
      const m = this.milestones.find(item => item.id === milestoneId);
      if (m) {
        m.status = 'Done';
        m.progressPercent = 100;
        if (obstacle) m.obstacle = obstacle;
        if (evaluation) m.evaluation = evaluation;
        if (conclusion) m.conclusion = conclusion;
        this.saveToStorage();
        return true;
      }
      return false;
    },

    deleteMilestone(milestoneId) {
      this.milestones = this.milestones.filter(m => m.id !== milestoneId);
      this.saveToStorage();
    },

    // Campaign Actions
    addCampaign(campaignData) {
      const newCamp = {
        id: 'camp-' + Date.now(),
        stage: 'TEST',
        platform: 'Meta Ads',
        status: 'Active',
        startDate: new Date().toISOString().split('T')[0],
        adSpend: 0,
        newDonors: 0,
        revenue: 0,
        hookType: '',
        notes: '',
        ...campaignData
      };
      this.campaigns.unshift(newCamp);
      this.saveToStorage();

      const client = this.getSupabaseClient();
      if (client) {
        client.from('campaigns').insert({
          name: newCamp.name,
          platform: newCamp.platform,
          stage: newCamp.stage,
          ad_spend: newCamp.adSpend,
          new_donors: newCamp.newDonors,
          revenue: newCamp.revenue,
          hook_type: newCamp.hookType,
          status: newCamp.status,
          start_date: newCamp.startDate,
          notes: newCamp.notes
        }).then();
      }

      return newCamp;
    },

    updateCampaign(campaignId, updates) {
      const idx = this.campaigns.findIndex(c => c.id === campaignId);
      if (idx !== -1) {
        this.campaigns[idx] = { ...this.campaigns[idx], ...updates };
        this.saveToStorage();

        const client = this.getSupabaseClient();
        if (client) {
          const camp = this.campaigns[idx];
          client.from('campaigns').update({
            name: camp.name,
            platform: camp.platform,
            stage: camp.stage,
            ad_spend: camp.adSpend,
            new_donors: camp.newDonors,
            revenue: camp.revenue,
            hook_type: camp.hookType,
            status: camp.status,
            notes: camp.notes
          }).eq('id', campaignId).then();
        }
      }
    },

    moveCampaignStage(campaignId, newStage) {
      const camp = this.campaigns.find(c => c.id === campaignId);
      if (camp) {
        camp.stage = newStage;
        this.saveToStorage();

        const client = this.getSupabaseClient();
        if (client) {
          client.from('campaigns').update({ stage: newStage }).eq('id', campaignId).then();
        }
      }
    },

    deleteCampaign(campaignId) {
      this.campaigns = this.campaigns.filter(c => c.id !== campaignId);
      this.saveToStorage();

      const client = this.getSupabaseClient();
      if (client) {
        client.from('campaigns').delete().eq('id', campaignId).then();
      }
    },

    // Donation Program Actions
    addDonationProgram(progData) {
      const newProg = {
        id: 'prog-' + Date.now(),
        category: 'Wakaf',
        targetAmount: 50000000,
        realizedAmount: 0,
        adSpend: 0,
        newDonors: 0,
        status: 'Active',
        description: '',
        ...progData
      };
      this.donationPrograms.push(newProg);
      this.saveToStorage();

      const client = this.getSupabaseClient();
      if (client) {
        client.from('donation_programs').insert({
          name: newProg.name,
          category: newProg.category,
          target_amount: newProg.targetAmount,
          realized_amount: newProg.realizedAmount,
          ad_spend: newProg.adSpend,
          new_donors: newProg.newDonors,
          status: newProg.status,
          description: newProg.description
        }).then();
      }

      return newProg;
    },

    updateDonationProgram(progId, updates) {
      const idx = this.donationPrograms.findIndex(p => p.id === progId);
      if (idx !== -1) {
        this.donationPrograms[idx] = { ...this.donationPrograms[idx], ...updates };
        this.saveToStorage();

        const client = this.getSupabaseClient();
        if (client) {
          const p = this.donationPrograms[idx];
          client.from('donation_programs').update({
            name: p.name,
            category: p.category,
            target_amount: p.targetAmount,
            realized_amount: p.realizedAmount,
            ad_spend: p.adSpend,
            new_donors: p.newDonors,
            status: p.status,
            description: p.description
          }).eq('id', progId).then();
        }
      }
    },

    deleteDonationProgram(progId) {
      this.donationPrograms = this.donationPrograms.filter(p => p.id !== progId);
      this.saveToStorage();

      const client = this.getSupabaseClient();
      if (client) {
        client.from('donation_programs').delete().eq('id', progId).then();
      }
    },

    // Profile Actions
    updateProfile(newProfile) {
      this.profile = { ...this.profile, ...newProfile };
      this.saveToStorage();
    },

    // R&D KPI Actions
    setRdProductPrice(price) {
      this.rdProductPrice = Number(price) || 0;
      this.saveToStorage();
    },

    updateRdKpiAction(kpiId, updates) {
      const idx = this.rdKpis.findIndex(k => k.id === kpiId);
      if (idx !== -1) {
        this.rdKpis[idx] = { ...this.rdKpis[idx], ...updates };
        this.saveToStorage();
      }
    },

    // Reset to Mock Data
    resetToMockData() {
      this.profile = { ...initialProfile };
      this.tasks = [...initialTasks];
      this.journalLogs = [...initialJournalLogs];
      this.milestones = [...initialMilestones];
      this.campaigns = [...initialCampaigns];
      this.donationPrograms = [...initialDonationPrograms];
      this.rdProductPrice = initialRdProductPrice;
      this.rdKpis = [...initialRdKpis];
      this.saveToStorage();
    },

    // Export/Import JSON
    exportDataJSON() {
      const data = {
        profile: this.profile,
        tasks: this.tasks,
        journalLogs: this.journalLogs,
        milestones: this.milestones,
        campaigns: this.campaigns,
        donationPrograms: this.donationPrograms,
        rdProductPrice: this.rdProductPrice,
        rdKpis: this.rdKpis,
        exportedAt: new Date().toISOString(),
        version: '1.0.0'
      };
      return JSON.stringify(data, null, 2);
    },

    importDataJSON(jsonStr) {
      try {
        const parsed = JSON.parse(jsonStr);
        if (parsed.profile) this.profile = parsed.profile;
        if (parsed.tasks) this.tasks = parsed.tasks;
        if (parsed.journalLogs) this.journalLogs = parsed.journalLogs;
        if (parsed.milestones) this.milestones = parsed.milestones;
        if (parsed.campaigns) this.campaigns = parsed.campaigns;
        if (parsed.donationPrograms) this.donationPrograms = parsed.donationPrograms;
        if (parsed.rdProductPrice !== undefined) this.rdProductPrice = parsed.rdProductPrice;
        if (parsed.rdKpis) this.rdKpis = parsed.rdKpis;
        this.saveToStorage();
        return { success: true };
      } catch (err) {
        return { success: false, error: err.message };
      }
    }
  }
});
