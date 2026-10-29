import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../supabase' // Import konektor yang baru kita buat

export const useAdLabStore = defineStore('adLab', () => {
  const experiments = ref([])
  const isLoading = ref(false)
  const errorMessage = ref(null)

  // 1. FETCH (GET) DATA DARI SUPABASE
  const fetchExperiments = async () => {
    isLoading.value = true
    try {
      if (!supabase) return
      const { data, error } = await supabase
        .from('ad_lab_experiments')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.warn("Notice Ad Lab Supabase:", error.message)
        return
      }
      experiments.value = data || []
    } catch (error) {
      errorMessage.value = error.message
      console.warn("Notice Ad Lab:", error.message)
    } finally {
      isLoading.value = false
    }
  }

  // 2. INSERT (POST) DATA BARU KE SUPABASE
  const addExperiment = async (campaignName, stage = 'TEST') => {
    try {
      const { data, error } = await supabase
        .from('ad_lab_experiments')
        .insert([
          { 
            campaign_name: campaignName, 
            stage: stage,
            status: 'ACTIVE',
            ad_spend: 0,
            realized_revenue: 0,
            new_donors: 0
            // Kolom id, user_id, roi, cpr, dan created_at akan diisi otomatis oleh Supabase
          }
        ])
        .select() // Minta Supabase mengembalikan data yang baru dimasukkan

      if (error) throw error
      
      // Masukkan data baru ke state lokal (agar UI langsung update tanpa refresh)
      if (data && data.length > 0) {
        experiments.value.unshift(data[0])
      }
    } catch (error) {
      console.error("Gagal menambah kampanye:", error.message)
    }
  }

  // 3. GETTERS (Untuk memfilter data di UI)
  const getExperimentsByStage = computed(() => {
    return (stageName) => experiments.value.filter(exp => exp.stage === stageName)
  })

  // Rekomendasi Scale-up untuk laporan PDF (Diurutkan dari ROI tertinggi)
  const topScaleUpRecommendations = computed(() => {
    return [...experiments.value]
      .filter(exp => exp.status === 'ACTIVE' && exp.roi > 0)
      .sort((a, b) => b.roi - a.roi)
  })

  return {
    experiments,
    isLoading,
    errorMessage,
    fetchExperiments,
    addExperiment,
    getExperimentsByStage,
    topScaleUpRecommendations
  }
})
