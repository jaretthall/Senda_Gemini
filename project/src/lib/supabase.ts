import { createClient } from '@supabase/supabase-js';
import { createClientComponentClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { logger } from './logger';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Log Supabase initialization
logger.info('SUPABASE_INIT', 'Initializing Supabase clients', {
  hasUrl: !!supabaseUrl,
  hasAnonKey: !!supabaseAnonKey,
  urlPreview: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'missing',
  keyLength: supabaseAnonKey ? supabaseAnonKey.length : 0
});
// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

// Client component client
export const createSupabaseClient = () => {
  logger.debug('SUPABASE_CLIENT', 'Creating client component client');
  return createClientComponentClient();
};

// Server component client
export const createSupabaseServerClient = () => {
  logger.debug('SUPABASE_SERVER', 'Creating server component client');
  return createServerComponentClient({ cookies });
};

// Test connection on initialization
if (typeof window !== 'undefined') {
  supabase.auth.onAuthStateChange((event, session) => {
    logger.info('SUPABASE_AUTH', `Auth state changed: ${event}`, {
      hasSession: !!session,
      userId: session?.user?.id
    });
  });
}
// Admin client for server-side operations
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);