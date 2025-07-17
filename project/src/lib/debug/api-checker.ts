// API routes checker
import { logger } from '../logger';

interface ApiEndpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  requiresAuth: boolean;
  description: string;
}

export class ApiChecker {
  private endpoints: ApiEndpoint[] = [
    { path: '/api/auth/signin', method: 'POST', requiresAuth: false, description: 'User authentication' },
    { path: '/api/dashboard/stats', method: 'GET', requiresAuth: true, description: 'Dashboard statistics' },
    { path: '/api/patients', method: 'GET', requiresAuth: true, description: 'Patient list' },
    { path: '/api/patients', method: 'POST', requiresAuth: true, description: 'Create patient' },
    { path: '/api/crisis-events', method: 'GET', requiresAuth: true, description: 'Crisis events' },
    { path: '/api/crisis-events', method: 'POST', requiresAuth: true, description: 'Create crisis event' }
  ];

  async checkEndpoints(): Promise<{ [key: string]: any }> {
    logger.info('API_CHECK', 'Starting API endpoint checks');

    const results: { [key: string]: any } = {};

    for (const endpoint of this.endpoints) {
      const key = `${endpoint.method} ${endpoint.path}`;
      
      try {
        logger.debug('API_CHECK', `Testing endpoint: ${key}`);

        const response = await fetch(endpoint.path, {
          method: endpoint.method,
          headers: {
            'Content-Type': 'application/json',
          },
          // Add test data for POST requests
          ...(endpoint.method === 'POST' && {
            body: JSON.stringify({ test: true })
          })
        });

        results[key] = {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
          description: endpoint.description,
          requiresAuth: endpoint.requiresAuth
        };

        if (response.ok) {
          logger.info('API_CHECK', `✅ ${key} - ${response.status}`, {
            endpoint: endpoint.path,
            method: endpoint.method
          });
        } else {
          logger.warn('API_CHECK', `⚠️ ${key} - ${response.status}`, {
            endpoint: endpoint.path,
            method: endpoint.method,
            status: response.status,
            statusText: response.statusText
          });
        }

      } catch (error) {
        results[key] = {
          error: (error as Error).message,
          description: endpoint.description,
          requiresAuth: endpoint.requiresAuth
        };

        logger.error('API_CHECK', `❌ ${key} failed`, {
          endpoint: endpoint.path,
          method: endpoint.method
        }, error as Error);
      }
    }

    const successCount = Object.values(results).filter((r: any) => r.ok).length;
    logger.info('API_CHECK', 'API endpoint check completed', {
      total: this.endpoints.length,
      successful: successCount,
      failed: this.endpoints.length - successCount
    });

    return results;
  }
}

export const apiChecker = new ApiChecker();