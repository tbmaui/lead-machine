/**
 * Supabase Client Configuration
 * 
 * Secure implementation using environment variables instead of hardcoded credentials.
 * This file validates environment configuration on import to ensure fail-fast behavior.
 */
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { getEnvironmentConfig } from '@/lib/env-validation';

// Validate environment configuration and get secure credentials
const envConfig = getEnvironmentConfig();

// Use environment variables instead of hardcoded credentials
const SUPABASE_URL = envConfig.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = envConfig.VITE_SUPABASE_ANON_KEY;

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Export configuration for debugging and health checks (without sensitive values)
export const supabaseConfig = {
  url: SUPABASE_URL,
  hasValidKey: Boolean(SUPABASE_ANON_KEY && SUPABASE_ANON_KEY.length > 100),
  environment: import.meta.env.MODE || 'development'
};