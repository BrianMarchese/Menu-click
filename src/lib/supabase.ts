import { createClient } from '@supabase/supabase-js'

// Lee las variables de entorno que configure antes en el .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Creo e exporto la instancia del cliente para usar en toda la app
export const supabase = createClient(supabaseUrl, supabaseAnonKey)