import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('[DataShel] Runtime Check:', {
  hasUrl: !!supabaseUrl,
  urlStart: supabaseUrl?.slice(0, 10),
  hasKey: !!supabaseAnonKey
});

let supabaseInstance = null;

if (supabaseUrl && supabaseAnonKey) {
  try {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  } catch (err) {
    console.error('[DataShel] Supabase initialization failed:', err.message);
  }
} else {
  console.warn('[DataShel] Supabase environment variables are missing. App will run in limited mode.');
}

export const supabase = supabaseInstance;

