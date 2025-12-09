import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wfncmrchltcvgialghrz.supabase.co'
const supabaseKey = 'sb_publishable_uiHDDn-zM1F8qCa5zu3UYQ_AAGjykvp'

export const supabase = createClient(supabaseUrl, supabaseKey)