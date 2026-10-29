import { createClient } from '@supabase/supabase-js'

// Mengambil URL dan Anon Key dari env dengan fallback kredensial resmi
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rsnjmllhuucyophursng.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzbmptbGxodXVjeW9waHVyc25nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIxMzQ0MTAsImV4cCI6MjEwNzcxMDQxMH0.nVLriES26tvWFXLbkeD0irZs7AXZvsFq7Zdue7jKClI'

// Membuat koneksi tunggal ke database
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
