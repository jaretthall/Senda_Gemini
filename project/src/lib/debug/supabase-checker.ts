// Supabase connection and configuration checker
import { createClient } from '@supabase/supabase-js';
import { logger } from '../logger';

export class SupabaseChecker {
  private client: any;

  async checkConnection(): Promise<boolean> {
    logger.info('SUPABASE_CHECK', 'Starting Supabase connection test');

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        logger.error('SUPABASE_CHECK', 'Missing Supabase credentials');
        return false;
      }

      logger.debug('SUPABASE_CHECK', 'Creating Supabase client', {
        url: `${supabaseUrl.substring(0, 30)}...`,
        keyLength: supabaseKey.length
      });

      this.client = createClient(supabaseUrl, supabaseKey);

      // Test basic connection
      const { data, error } = await this.client
        .from('users')
        .select('count', { count: 'exact', head: true });

      if (error) {
        logger.error('SUPABASE_CHECK', 'Supabase connection failed', { error: error.message }, error);
        return false;
      }

      logger.info('SUPABASE_CHECK', 'Supabase connection successful', { 
        userCount: data?.length || 0 
      });

      return true;
    } catch (error) {
      logger.error('SUPABASE_CHECK', 'Supabase connection error', {}, error as Error);
      return false;
    }
  }

  async checkTables(): Promise<{ [tableName: string]: boolean }> {
    logger.info('SUPABASE_CHECK', 'Checking database tables');

    const requiredTables = [
      'users',
      'patients', 
      'episodes',
      'assessments',
      'appointments',
      'crisis_events',
      'notes',
      'audit_logs'
    ];

    const results: { [tableName: string]: boolean } = {};

    for (const tableName of requiredTables) {
      try {
        const { error } = await this.client
          .from(tableName)
          .select('*', { count: 'exact', head: true });

        results[tableName] = !error;
        
        if (error) {
          logger.error('SUPABASE_CHECK', `Table ${tableName} check failed`, { 
            table: tableName,
            error: error.message 
          });
        } else {
          logger.debug('SUPABASE_CHECK', `Table ${tableName} exists and accessible`);
        }
      } catch (error) {
        results[tableName] = false;
        logger.error('SUPABASE_CHECK', `Table ${tableName} check error`, { 
          table: tableName 
        }, error as Error);
      }
    }

    const successCount = Object.values(results).filter(Boolean).length;
    logger.info('SUPABASE_CHECK', 'Table check completed', {
      total: requiredTables.length,
      successful: successCount,
      failed: requiredTables.length - successCount
    });

    return results;
  }

  async checkRLS(): Promise<boolean> {
    logger.info('SUPABASE_CHECK', 'Checking Row Level Security policies');

    try {
      // Test RLS by trying to access data without proper auth
      const { error } = await this.client.auth.signOut();
      
      const { data, error: selectError } = await this.client
        .from('patients')
        .select('*')
        .limit(1);

      // If we can access data without auth, RLS might not be working
      if (!selectError && data && data.length > 0) {
        logger.warn('SUPABASE_CHECK', 'RLS might not be properly configured - data accessible without auth');
        return false;
      }

      logger.info('SUPABASE_CHECK', 'RLS appears to be working correctly');
      return true;
    } catch (error) {
      logger.error('SUPABASE_CHECK', 'RLS check failed', {}, error as Error);
      return false;
    }
  }
}

export const supabaseChecker = new SupabaseChecker();