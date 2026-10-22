import { createClient } from '@supabase/supabase-js';
import { ref } from 'vue';

let supabaseClient = null;
const isConnected = ref(false);
const isOnline = ref(navigator.onLine);

window.addEventListener('online', () => { isOnline.value = true; });
window.addEventListener('offline', () => { isOnline.value = false; });

export function useSupabase() {
  const initClient = (url, anonKey) => {
    if (!url || !anonKey) {
      supabaseClient = null;
      isConnected.value = false;
      return null;
    }
    try {
      supabaseClient = createClient(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true
        }
      });
      isConnected.value = true;
      return supabaseClient;
    } catch (err) {
      console.error('Failed to initialize Supabase client:', err);
      supabaseClient = null;
      isConnected.value = false;
      return null;
    }
  };

  const testConnection = async (url, anonKey) => {
    try {
      const client = createClient(url, anonKey);
      // Simple lightweight health check query or auth session check
      const { data, error } = await client.from('campaigns').select('count', { count: 'exact', head: true });
      if (error && error.code !== 'PGRST116' && !error.message.includes('relation "campaigns" does not exist')) {
        // Even if table doesn't exist yet, reaching postgres validates credentials
        if (error.message.includes('Invalid API key') || error.message.includes('JWT')) {
          return { success: false, message: 'Kredensial tidak valid: ' + error.message };
        }
      }
      return { success: true, message: 'Berhasil terhubung ke Supabase Instance!' };
    } catch (err) {
      return { success: false, message: err.message || 'Gagal menghubungi server Supabase' };
    }
  };

  return {
    supabaseClient,
    isConnected,
    isOnline,
    initClient,
    testConnection
  };
}
