import { createClient } from '@supabase/supabase-js'
import { Database } from './types'

// Read values from your Next.js environment variables (.env.local)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

// Export your fully type-safe instance
export const supabase = createClient<Database>(supabaseUrl, supabaseKey);



