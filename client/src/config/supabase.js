import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

if (import.meta.env.DEV) {
  console.log('[MediOptima Auth Diagnostic]');
  console.log('Supabase URL configured: ' + (supabaseUrl ? 'YES' : 'NO'));
  console.log('Supabase publishable key configured: ' + (supabaseKey ? 'YES' : 'NO'));
  console.log('Google provider expected: ' + (isSupabaseConfigured ? 'YES' : 'NO'));
}

// Create the client only if configured to prevent fatal Vite crashes on load
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey)
  : null;