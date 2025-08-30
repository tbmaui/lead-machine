/**
 * Environment Health Check API
 * 
 * Provides health check functionality for environment configuration
 * Can be used for monitoring, debugging, and operational dashboards
 */

import { getEnvironmentHealthCheck } from './env-validation';
import { supabaseConfig } from '@/integrations/supabase/client';

export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy' | 'error';
  timestamp: string;
  version: string;
  environment: {
    mode: string;
    node_env: string;
    required_vars_configured: number;
    optional_vars_configured: number;
    total_env_vars: number;
  };
  supabase: {
    client_configured: boolean;
    url_valid: boolean;
    key_valid: boolean;
  };
  validation: {
    missing_count: number;
    invalid_count: number;
    missing_vars?: string[];
    issues?: string[];
  };
  checks: {
    environment_validation: 'pass' | 'fail';
    supabase_config: 'pass' | 'fail';
    build_requirements: 'pass' | 'fail';
  };
  error?: string;
}

/**
 * Performs comprehensive health check of environment configuration
 */
export function performHealthCheck(): HealthCheckResponse {
  try {
    // Get basic environment validation results
    const envHealth = getEnvironmentHealthCheck();
    
    // Check Supabase configuration
    const supabaseHealthy = checkSupabaseConfig();
    
    // Check build requirements
    const buildHealthy = checkBuildRequirements();
    
    // Determine overall status
    const allHealthy = envHealth.status === 'healthy' && supabaseHealthy && buildHealthy;
    const hasErrors = envHealth.status === 'error';
    
    return {
      status: hasErrors ? 'error' : (allHealthy ? 'healthy' : 'unhealthy'),
      timestamp: new Date().toISOString(),
      version: getApplicationVersion(),
      environment: {
        mode: import.meta.env.MODE || 'unknown',
        node_env: import.meta.env.NODE_ENV || 'unknown',
        required_vars_configured: envHealth.environment?.required_vars_count || 0,
        optional_vars_configured: envHealth.environment?.optional_vars_count || 0,
        total_env_vars: envHealth.environment?.configured_vars || 0
      },
      supabase: {
        client_configured: supabaseConfig.hasValidKey && Boolean(supabaseConfig.url),
        url_valid: Boolean(supabaseConfig.url && supabaseConfig.url.includes('supabase.co')),
        key_valid: supabaseConfig.hasValidKey
      },
      validation: {
        missing_count: envHealth.validation?.missing_count || 0,
        invalid_count: envHealth.validation?.invalid_count || 0,
        missing_vars: envHealth.validation?.missing_vars,
        issues: envHealth.validation?.invalid_vars
      },
      checks: {
        environment_validation: envHealth.status === 'healthy' ? 'pass' : 'fail',
        supabase_config: supabaseHealthy ? 'pass' : 'fail',
        build_requirements: buildHealthy ? 'pass' : 'fail'
      },
      error: envHealth.error
    };
  } catch (error) {
    return {
      status: 'error',
      timestamp: new Date().toISOString(),
      version: getApplicationVersion(),
      environment: {
        mode: 'unknown',
        node_env: 'unknown',
        required_vars_configured: 0,
        optional_vars_configured: 0,
        total_env_vars: 0
      },
      supabase: {
        client_configured: false,
        url_valid: false,
        key_valid: false
      },
      validation: {
        missing_count: 0,
        invalid_count: 0
      },
      checks: {
        environment_validation: 'fail',
        supabase_config: 'fail',
        build_requirements: 'fail'
      },
      error: error instanceof Error ? error.message : 'Unknown error during health check'
    };
  }
}

/**
 * Simplified health check for quick status endpoint
 */
export function getHealthStatus(): { status: 'ok' | 'error'; timestamp: string } {
  try {
    const health = performHealthCheck();
    return {
      status: health.status === 'healthy' ? 'ok' : 'error',
      timestamp: health.timestamp
    };
  } catch (error) {
    return {
      status: 'error',
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Check Supabase configuration health
 */
function checkSupabaseConfig(): boolean {
  try {
    return (
      Boolean(supabaseConfig.url) &&
      supabaseConfig.url.startsWith('https://') &&
      supabaseConfig.url.includes('supabase.co') &&
      supabaseConfig.hasValidKey
    );
  } catch (error) {
    return false;
  }
}

/**
 * Check build requirements are met
 */
function checkBuildRequirements(): boolean {
  try {
    // Check that critical environment variables are available
    const hasRequiredVars = Boolean(
      import.meta.env.VITE_SUPABASE_URL &&
      import.meta.env.VITE_SUPABASE_ANON_KEY
    );
    
    // Check that we're running in a valid mode
    const validMode = ['development', 'production', 'test'].includes(
      import.meta.env.MODE || 'development'
    );
    
    return hasRequiredVars && validMode;
  } catch (error) {
    return false;
  }
}

/**
 * Get application version from package.json or environment
 */
function getApplicationVersion(): string {
  try {
    // In production, version might be set by build process
    return import.meta.env.VITE_APP_VERSION || 
           import.meta.env.npm_package_version || 
           '0.0.0-dev';
  } catch (error) {
    return '0.0.0-unknown';
  }
}

/**
 * Create health check endpoint response
 * This can be used to create an actual API endpoint
 */
export function createHealthCheckEndpoint() {
  return {
    get: () => {
      const health = performHealthCheck();
      
      // Return appropriate HTTP status based on health
      const httpStatus = health.status === 'healthy' ? 200 : 
                        health.status === 'unhealthy' ? 503 : 500;
      
      return {
        status: httpStatus,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify(health, null, 2)
      };
    }
  };
}

/**
 * Development helper to log health check results
 */
export function logHealthCheck(): void {
  if (import.meta.env.MODE === 'development') {
    const health = performHealthCheck();
    
    console.group('🏥 Environment Health Check');
    console.log('Status:', health.status);
    console.log('Environment:', health.environment.mode);
    console.log('Supabase:', health.supabase.client_configured ? '✅' : '❌');
    
    if (health.validation.missing_count > 0) {
      console.warn('Missing variables:', health.validation.missing_vars);
    }
    
    if (health.validation.invalid_count > 0) {
      console.warn('Invalid variables:', health.validation.issues);
    }
    
    if (health.error) {
      console.error('Error:', health.error);
    }
    
    console.groupEnd();
  }
}

/**
 * React hook for using health check in components
 */
export function useHealthCheck() {
  try {
    const health = performHealthCheck();
    return {
      isHealthy: health.status === 'healthy',
      status: health.status,
      health,
      refresh: () => performHealthCheck()
    };
  } catch (error) {
    return {
      isHealthy: false,
      status: 'error' as const,
      health: null,
      refresh: () => performHealthCheck(),
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}