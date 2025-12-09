import { createClient } from '@supabase/supabase-js'

// Ab ye keys seedha system se uthayega, code mein nahi dikhengi
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase URL or Key')
}

export const supabase = createClient(supabaseUrl, supabaseKey)