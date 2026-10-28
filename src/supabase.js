import { createClient } from '@supabase/supabase-js'

// Mengambil URL dan Anon Key dari file .env.local
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Membuat koneksi tunggal ke database
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
