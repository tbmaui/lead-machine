/**
 * Health Check Tests
 * 
 * Tests for environment health check functionality
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  performHealthCheck,
  getHealthStatus,
  useHealthCheck,
  logHealthCheck,
  createHealthCheckEndpoint
} from './health-check';

// Mock dependencies
const mockGetEnvironmentHealthCheck = vi.fn();
const mockSupabaseConfig = {
  url: '',
  hasValidKey: false,
  environment: 'test'
};

vi.mock('./env-validation', () => ({
  getEnvironmentHealthCheck: mockGetEnvironmentHealthCheck
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabaseConfig: mockSupabaseConfig
}));

// Mock import.meta.env
const mockEnv: Record<string, string> = {};
vi.stubGlobal('import.meta', {
  env: mockEnv
});

describe('Health Check', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.keys(mockEnv).forEach(key => delete mockEnv[key]);
    
    // Reset supabase config mock
    Object.assign(mockSupabaseConfig, {
      url: '',
      hasValidKey: false,
      environment: 'test'
    });
  });

  describe('performHealthCheck', () => {
    it('should return healthy status when all checks pass', () => {
      // Mock healthy environment
      mockGetEnvironmentHealthCheck.mockReturnValue({
        status: 'healthy',
        timestamp: '2023-01-01T00:00:00.000Z',
        environment: {
          required_vars_count: 2,
          optional_vars_count: 1,
          configured_vars: 3
        },
        validation: {
          missing_count: 0,
          invalid_count: 0,
          missing_vars: [],
          invalid_vars: []
        }
      });

      // Mock healthy Supabase config
      Object.assign(mockSupabaseConfig, {
        url: 'https://test.supabase.co',
        hasValidKey: true
      });

      // Mock healthy environment variables
      Object.assign(mockEnv, {
        MODE: 'development',
        NODE_ENV: 'development',
        VITE_SUPABASE_URL: 'https://test.supabase.co',
        VITE_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test'
      });

      const health = performHealthCheck();

      expect(health.status).toBe('healthy');
      expect(health.checks.environment_validation).toBe('pass');
      expect(health.checks.supabase_config).toBe('pass');
      expect(health.checks.build_requirements).toBe('pass');
      expect(health.supabase.client_configured).toBe(true);
    });

    it('should return unhealthy status when environment validation fails', () => {
      mockGetEnvironmentHealthCheck.mockReturnValue({
        status: 'unhealthy',
        timestamp: '2023-01-01T00:00:00.000Z',
        environment: {
          required_vars_count: 2,
          optional_vars_count: 1,
          configured_vars: 1
        },
        validation: {
          missing_count: 1,
          invalid_count: 0,
          missing_vars: ['VITE_SUPABASE_URL'],
          invalid_vars: []
        }
      });

      Object.assign(mockSupabaseConfig, {
        url: 'https://test.supabase.co',
        hasValidKey: true
      });

      const health = performHealthCheck();

      expect(health.status).toBe('unhealthy');
      expect(health.checks.environment_validation).toBe('fail');
      expect(health.validation.missing_count).toBe(1);
      expect(health.validation.missing_vars).toEqual(['VITE_SUPABASE_URL']);
    });

    it('should return unhealthy status when Supabase config is invalid', () => {
      mockGetEnvironmentHealthCheck.mockReturnValue({
        status: 'healthy',
        environment: { required_vars_count: 2, optional_vars_count: 1, configured_vars: 3 },
        validation: { missing_count: 0, invalid_count: 0 }
      });

      // Invalid Supabase config
      Object.assign(mockSupabaseConfig, {
        url: 'http://invalid.com',
        hasValidKey: false
      });

      const health = performHealthCheck();

      expect(health.status).toBe('unhealthy');
      expect(health.checks.supabase_config).toBe('fail');
      expect(health.supabase.client_configured).toBe(false);
      expect(health.supabase.url_valid).toBe(false);
      expect(health.supabase.key_valid).toBe(false);
    });

    it('should return error status when health check throws', () => {
      mockGetEnvironmentHealthCheck.mockImplementation(() => {
        throw new Error('Test error');
      });

      const health = performHealthCheck();

      expect(health.status).toBe('error');
      expect(health.error).toBe('Test error');
      expect(health.checks.environment_validation).toBe('fail');
    });

    it('should include environment metadata', () => {
      mockGetEnvironmentHealthCheck.mockReturnValue({
        status: 'healthy',
        environment: { required_vars_count: 2, optional_vars_count: 1, configured_vars: 5 },
        validation: { missing_count: 0, invalid_count: 0 }
      });

      Object.assign(mockEnv, {
        MODE: 'production',
        NODE_ENV: 'production'
      });

      const health = performHealthCheck();

      expect(health.environment).toEqual({
        mode: 'production',
        node_env: 'production',
        required_vars_configured: 2,
        optional_vars_configured: 1,
        total_env_vars: 5
      });
    });

    it('should handle missing environment mode gracefully', () => {
      mockGetEnvironmentHealthCheck.mockReturnValue({
        status: 'healthy',
        environment: { required_vars_count: 2, optional_vars_count: 1, configured_vars: 3 },
        validation: { missing_count: 0, invalid_count: 0 }
      });

      const health = performHealthCheck();

      expect(health.environment.mode).toBe('unknown');
      expect(health.environment.node_env).toBe('unknown');
    });
  });

  describe('getHealthStatus', () => {
    it('should return ok status when healthy', () => {
      mockGetEnvironmentHealthCheck.mockReturnValue({
        status: 'healthy',
        environment: { required_vars_count: 2, optional_vars_count: 1, configured_vars: 3 },
        validation: { missing_count: 0, invalid_count: 0 }
      });

      Object.assign(mockSupabaseConfig, {
        url: 'https://test.supabase.co',
        hasValidKey: true
      });

      const status = getHealthStatus();

      expect(status.status).toBe('ok');
      expect(status.timestamp).toBeDefined();
    });

    it('should return error status when unhealthy', () => {
      mockGetEnvironmentHealthCheck.mockReturnValue({
        status: 'unhealthy',
        environment: { required_vars_count: 2, optional_vars_count: 1, configured_vars: 1 },
        validation: { missing_count: 1, invalid_count: 0 }
      });

      const status = getHealthStatus();

      expect(status.status).toBe('error');
    });

    it('should handle exceptions gracefully', () => {
      mockGetEnvironmentHealthCheck.mockImplementation(() => {
        throw new Error('Test error');
      });

      const status = getHealthStatus();

      expect(status.status).toBe('error');
      expect(status.timestamp).toBeDefined();
    });
  });

  describe('useHealthCheck', () => {
    it('should return health check data for healthy environment', () => {
      mockGetEnvironmentHealthCheck.mockReturnValue({
        status: 'healthy',
        environment: { required_vars_count: 2, optional_vars_count: 1, configured_vars: 3 },
        validation: { missing_count: 0, invalid_count: 0 }
      });

      Object.assign(mockSupabaseConfig, {
        url: 'https://test.supabase.co',
        hasValidKey: true
      });

      const result = useHealthCheck();

      expect(result.isHealthy).toBe(true);
      expect(result.status).toBe('healthy');
      expect(result.health).toBeDefined();
      expect(typeof result.refresh).toBe('function');
    });

    it('should return error state when health check fails', () => {
      mockGetEnvironmentHealthCheck.mockImplementation(() => {
        throw new Error('Health check failed');
      });

      const result = useHealthCheck();

      expect(result.isHealthy).toBe(false);
      expect(result.status).toBe('error');
      expect(result.health).toBe(null);
      expect(result.error).toBe('Health check failed');
    });

    it('should provide refresh function', () => {
      mockGetEnvironmentHealthCheck.mockReturnValue({
        status: 'healthy',
        environment: { required_vars_count: 2, optional_vars_count: 1, configured_vars: 3 },
        validation: { missing_count: 0, invalid_count: 0 }
      });

      const result = useHealthCheck();
      
      expect(typeof result.refresh).toBe('function');
      
      // Should be able to call refresh
      const refreshed = result.refresh();
      expect(refreshed).toBeDefined();
    });
  });

  describe('logHealthCheck', () => {
    it('should log health check in development mode', () => {
      const consoleSpy = vi.spyOn(console, 'group').mockImplementation(() => {});
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const consoleEndSpy = vi.spyOn(console, 'groupEnd').mockImplementation(() => {});

      mockGetEnvironmentHealthCheck.mockReturnValue({
        status: 'healthy',
        environment: { required_vars_count: 2, optional_vars_count: 1, configured_vars: 3 },
        validation: { missing_count: 0, invalid_count: 0 }
      });

      Object.assign(mockEnv, { MODE: 'development' });
      Object.assign(mockSupabaseConfig, {
        url: 'https://test.supabase.co',
        hasValidKey: true
      });

      logHealthCheck();

      expect(consoleSpy).toHaveBeenCalledWith('🏥 Environment Health Check');
      expect(consoleLogSpy).toHaveBeenCalledWith('Status:', 'healthy');
      expect(consoleEndSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
      consoleLogSpy.mockRestore();
      consoleEndSpy.mockRestore();
    });

    it('should not log in production mode', () => {
      const consoleSpy = vi.spyOn(console, 'group').mockImplementation(() => {});

      Object.assign(mockEnv, { MODE: 'production' });

      logHealthCheck();

      expect(consoleSpy).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('createHealthCheckEndpoint', () => {
    it('should create endpoint with correct response for healthy status', () => {
      mockGetEnvironmentHealthCheck.mockReturnValue({
        status: 'healthy',
        environment: { required_vars_count: 2, optional_vars_count: 1, configured_vars: 3 },
        validation: { missing_count: 0, invalid_count: 0 }
      });

      Object.assign(mockSupabaseConfig, {
        url: 'https://test.supabase.co',
        hasValidKey: true
      });

      const endpoint = createHealthCheckEndpoint();
      const response = endpoint.get();

      expect(response.status).toBe(200);
      expect(response.headers['Content-Type']).toBe('application/json');
      expect(response.headers['Cache-Control']).toBe('no-cache');
      expect(response.body).toBeDefined();
      
      const body = JSON.parse(response.body);
      expect(body.status).toBe('healthy');
    });

    it('should return 503 for unhealthy status', () => {
      mockGetEnvironmentHealthCheck.mockReturnValue({
        status: 'unhealthy',
        environment: { required_vars_count: 2, optional_vars_count: 1, configured_vars: 1 },
        validation: { missing_count: 1, invalid_count: 0 }
      });

      const endpoint = createHealthCheckEndpoint();
      const response = endpoint.get();

      expect(response.status).toBe(503);
      
      const body = JSON.parse(response.body);
      expect(body.status).toBe('unhealthy');
    });

    it('should return 500 for error status', () => {
      mockGetEnvironmentHealthCheck.mockImplementation(() => {
        throw new Error('Health check error');
      });

      const endpoint = createHealthCheckEndpoint();
      const response = endpoint.get();

      expect(response.status).toBe(500);
      
      const body = JSON.parse(response.body);
      expect(body.status).toBe('error');
    });
  });

  describe('Build Requirements Check', () => {
    it('should pass when required variables are present', () => {
      mockGetEnvironmentHealthCheck.mockReturnValue({
        status: 'healthy',
        environment: { required_vars_count: 2, optional_vars_count: 1, configured_vars: 3 },
        validation: { missing_count: 0, invalid_count: 0 }
      });

      Object.assign(mockEnv, {
        MODE: 'development',
        VITE_SUPABASE_URL: 'https://test.supabase.co',
        VITE_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test'
      });

      const health = performHealthCheck();

      expect(health.checks.build_requirements).toBe('pass');
    });

    it('should fail when required variables are missing', () => {
      mockGetEnvironmentHealthCheck.mockReturnValue({
        status: 'healthy',
        environment: { required_vars_count: 2, optional_vars_count: 1, configured_vars: 3 },
        validation: { missing_count: 0, invalid_count: 0 }
      });

      Object.assign(mockEnv, {
        MODE: 'development'
        // Missing VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
      });

      const health = performHealthCheck();

      expect(health.checks.build_requirements).toBe('fail');
    });

    it('should fail with invalid mode', () => {
      mockGetEnvironmentHealthCheck.mockReturnValue({
        status: 'healthy',
        environment: { required_vars_count: 2, optional_vars_count: 1, configured_vars: 3 },
        validation: { missing_count: 0, invalid_count: 0 }
      });

      Object.assign(mockEnv, {
        MODE: 'invalid-mode',
        VITE_SUPABASE_URL: 'https://test.supabase.co',
        VITE_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test'
      });

      const health = performHealthCheck();

      expect(health.checks.build_requirements).toBe('fail');
    });
  });
});