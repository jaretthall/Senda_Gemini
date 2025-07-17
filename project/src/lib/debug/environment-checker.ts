// Environment and configuration checker
import { logger } from '../logger';

interface EnvironmentCheck {
  name: string;
  required: boolean;
  value?: string;
  status: 'ok' | 'missing' | 'invalid';
  message?: string;
}

export class EnvironmentChecker {
  private checks: EnvironmentCheck[] = [];

  checkEnvironmentVariables(): EnvironmentCheck[] {
    logger.info('ENV_CHECK', 'Starting environment variable validation');

    const requiredVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'SUPABASE_SERVICE_ROLE_KEY',
      'NEXTAUTH_URL',
      'NEXTAUTH_SECRET'
    ];

    const optionalVars = [
      'DATABASE_URL',
      'NODE_ENV'
    ];

    // Check required variables
    requiredVars.forEach(varName => {
      const value = process.env[varName];
      const check: EnvironmentCheck = {
        name: varName,
        required: true,
        value: value ? `${value.substring(0, 20)}...` : undefined,
        status: value ? 'ok' : 'missing',
        message: value ? 'Present' : 'Missing required environment variable'
      };

      this.checks.push(check);
      
      if (!value) {
        logger.error('ENV_CHECK', `Missing required environment variable: ${varName}`);
      } else {
        logger.debug('ENV_CHECK', `Environment variable present: ${varName}`, { 
          length: value.length,
          preview: `${value.substring(0, 20)}...`
        });
      }
    });

    // Check optional variables
    optionalVars.forEach(varName => {
      const value = process.env[varName];
      const check: EnvironmentCheck = {
        name: varName,
        required: false,
        value: value ? `${value.substring(0, 20)}...` : undefined,
        status: value ? 'ok' : 'missing',
        message: value ? 'Present' : 'Optional variable not set'
      };

      this.checks.push(check);
      
      if (value) {
        logger.debug('ENV_CHECK', `Optional environment variable present: ${varName}`);
      }
    });

    // Validate URL formats
    this.validateUrls();

    logger.info('ENV_CHECK', 'Environment check completed', {
      total: this.checks.length,
      missing: this.checks.filter(c => c.status === 'missing' && c.required).length,
      invalid: this.checks.filter(c => c.status === 'invalid').length
    });

    return this.checks;
  }

  private validateUrls() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const nextAuthUrl = process.env.NEXTAUTH_URL;

    if (supabaseUrl) {
      try {
        new URL(supabaseUrl);
        logger.debug('ENV_CHECK', 'Supabase URL format valid');
      } catch (error) {
        logger.error('ENV_CHECK', 'Invalid Supabase URL format', { url: supabaseUrl }, error as Error);
        const check = this.checks.find(c => c.name === 'NEXT_PUBLIC_SUPABASE_URL');
        if (check) {
          check.status = 'invalid';
          check.message = 'Invalid URL format';
        }
      }
    }

    if (nextAuthUrl) {
      try {
        new URL(nextAuthUrl);
        logger.debug('ENV_CHECK', 'NextAuth URL format valid');
      } catch (error) {
        logger.error('ENV_CHECK', 'Invalid NextAuth URL format', { url: nextAuthUrl }, error as Error);
        const check = this.checks.find(c => c.name === 'NEXTAUTH_URL');
        if (check) {
          check.status = 'invalid';
          check.message = 'Invalid URL format';
        }
      }
    }
  }

  getFailedChecks(): EnvironmentCheck[] {
    return this.checks.filter(check => 
      (check.required && check.status !== 'ok') || check.status === 'invalid'
    );
  }

  hasErrors(): boolean {
    return this.getFailedChecks().length > 0;
  }
}

export const environmentChecker = new EnvironmentChecker();