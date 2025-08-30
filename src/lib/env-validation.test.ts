/**
 * Environment Validation Tests
 * 
 * Comprehensive test suite for environment variable validation functionality
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  validateEnvironment,
  validateEnvironmentOrThrow,
  getEnvironmentConfig,
  getEnvironmentHealthCheck,
  REQUIRED_ENV_VARS,
  OPTIONAL_ENV_VARS
} from './env-validation';

// Mock import.meta.env
const mockEnv: Record<string, string> = {};

vi.mock('./env-validation', async () => {
  const actual = await vi.importActual('./env-validation');
  return {
    ...actual,
    // Mock the import.meta.env access
  };
});

// Helper to mock environment variables
function mockEnvironmentVariables(env: Record<string, string | undefined>) {
  Object.keys(mockEnv).forEach(key => delete mockEnv[key]);
  Object.assign(mockEnv, env);
  
  // Replace import.meta.env access
  vi.stubGlobal('import.meta', {
    env: mockEnv
  });
}

describe('Environment Validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockEnvironmentVariables({});
  });

  describe('validateEnvironment', () => {
    it('should pass validation with all required variables', () => {
      mockEnvironmentVariables({
        VITE_SUPABASE_URL: 'https://test.supabase.co',
        VITE_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlc3QiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NzI3MjQwMCwiZXhwIjoxOTYyNjQ4NDAwfQ.test'
      });

      const result = validateEnvironment();
      
      expect(result.isValid).toBe(true);
      expect(result.missing).toEqual([]);
      expect(result.invalid).toEqual([]);
      expect(result.config).toBeDefined();
      expect(result.config?.VITE_SUPABASE_URL).toBe('https://test.supabase.co');
    });

    it('should fail validation with missing required variables', () => {
      mockEnvironmentVariables({});

      const result = validateEnvironment();
      
      expect(result.isValid).toBe(false);
      expect(result.missing).toEqual(['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY']);
      expect(result.config).toBeUndefined();
    });

    it('should fail validation with invalid SUPABASE_URL format', () => {
      mockEnvironmentVariables({
        VITE_SUPABASE_URL: 'http://invalid-url.com',
        VITE_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlc3QiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NzI3MjQwMCwiZXhwIjoxOTYyNjQ4NDAwfQ.test'
      });

      const result = validateEnvironment();
      
      expect(result.isValid).toBe(false);
      expect(result.missing).toEqual([]);
      expect(result.invalid).toHaveLength(1);
      expect(result.invalid[0]).toContain('VITE_SUPABASE_URL');
      expect(result.invalid[0]).toContain('valid Supabase URL');
    });

    it('should fail validation with invalid SUPABASE_ANON_KEY format', () => {
      mockEnvironmentVariables({
        VITE_SUPABASE_URL: 'https://test.supabase.co',
        VITE_SUPABASE_ANON_KEY: 'invalid-key'
      });

      const result = validateEnvironment();
      
      expect(result.isValid).toBe(false);
      expect(result.missing).toEqual([]);
      expect(result.invalid).toHaveLength(1);
      expect(result.invalid[0]).toContain('VITE_SUPABASE_ANON_KEY');
      expect(result.invalid[0]).toContain('valid Supabase JWT token');
    });

    it('should validate optional environment variables', () => {
      mockEnvironmentVariables({
        VITE_SUPABASE_URL: 'https://test.supabase.co',
        VITE_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlc3QiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NzI3MjQwMCwiZXhwIjoxOTYyNjQ4NDAwfQ.test',
        VITE_FEATURE_HERO_V2: 'true'
      });

      const result = validateEnvironment();
      
      expect(result.isValid).toBe(true);
      expect(result.config?.VITE_FEATURE_HERO_V2).toBe('true');
    });

    it('should fail validation with invalid optional variable', () => {
      mockEnvironmentVariables({
        VITE_SUPABASE_URL: 'https://test.supabase.co',
        VITE_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlc3QiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NzI3MjQwMCwiZXhwIjoxOTYyNjQ4NDAwfQ.test',
        VITE_FEATURE_HERO_V2: 'maybe'
      });

      const result = validateEnvironment();
      
      expect(result.isValid).toBe(false);
      expect(result.invalid).toHaveLength(1);
      expect(result.invalid[0]).toContain('VITE_FEATURE_HERO_V2');
      expect(result.invalid[0]).toContain("'true' or 'false'");
    });
  });

  describe('validateEnvironmentOrThrow', () => {
    it('should return config when validation passes', () => {
      mockEnvironmentVariables({
        VITE_SUPABASE_URL: 'https://test.supabase.co',
        VITE_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlc3QiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NzI3MjQwMCwiZXhwIjoxOTYyNjQ4NDAwfQ.test'
      });

      const config = validateEnvironmentOrThrow();
      
      expect(config.VITE_SUPABASE_URL).toBe('https://test.supabase.co');
      expect(config.VITE_SUPABASE_ANON_KEY).toBeDefined();
    });

    it('should throw detailed error when validation fails', () => {
      mockEnvironmentVariables({});

      expect(() => validateEnvironmentOrThrow()).toThrow();
      
      try {
        validateEnvironmentOrThrow();
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        const errorMessage = (error as Error).message;
        expect(errorMessage).toContain('Environment Configuration Error');
        expect(errorMessage).toContain('Missing Required Variables');
        expect(errorMessage).toContain('VITE_SUPABASE_URL');
        expect(errorMessage).toContain('VITE_SUPABASE_ANON_KEY');
        expect(errorMessage).toContain('How to Fix');
      }
    });

    it('should include setup instructions in error message', () => {
      mockEnvironmentVariables({ VITE_SUPABASE_URL: 'invalid' });

      expect(() => validateEnvironmentOrThrow()).toThrow();
      
      try {
        validateEnvironmentOrThrow();
      } catch (error) {
        const errorMessage = (error as Error).message;
        expect(errorMessage).toContain('Copy .env.example to .env.local');
        expect(errorMessage).toContain('DEPLOYMENT.md');
      }
    });
  });

  describe('getEnvironmentConfig', () => {
    it('should return validated config', () => {
      mockEnvironmentVariables({
        VITE_SUPABASE_URL: 'https://test.supabase.co',
        VITE_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlc3QiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NzI3MjQwMCwiZXhwIjoxOTYyNjQ4NDAwfQ.test'
      });

      const config = getEnvironmentConfig();
      
      expect(config).toBeDefined();
      expect(config.VITE_SUPABASE_URL).toBe('https://test.supabase.co');
    });

    it('should throw when environment is invalid', () => {
      mockEnvironmentVariables({});

      expect(() => getEnvironmentConfig()).toThrow('Environment Configuration Error');
    });
  });

  describe('getEnvironmentHealthCheck', () => {
    it('should return healthy status with valid environment', () => {
      mockEnvironmentVariables({
        VITE_SUPABASE_URL: 'https://test.supabase.co',
        VITE_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlc3QiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NzI3MjQwMCwiZXhwIjoxOTYyNjQ4NDAwfQ.test'
      });

      const health = getEnvironmentHealthCheck();
      
      expect(health.status).toBe('healthy');
      expect(health.timestamp).toBeDefined();
      expect(health.environment).toBeDefined();
      expect(health.validation.missing_count).toBe(0);
      expect(health.validation.invalid_count).toBe(0);
    });

    it('should return unhealthy status with invalid environment', () => {
      mockEnvironmentVariables({});

      const health = getEnvironmentHealthCheck();
      
      expect(health.status).toBe('unhealthy');
      expect(health.validation.missing_count).toBe(2);
      expect(health.validation.missing_vars).toEqual(['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY']);
    });

    it('should return error status when validation throws', () => {
      // Mock the validateEnvironment function to throw
      const originalValidateEnvironment = validateEnvironment;
      vi.mocked(validateEnvironment).mockImplementation(() => {
        throw new Error('Test validation error');
      });

      const health = getEnvironmentHealthCheck();
      
      expect(health.status).toBe('error');
      expect(health.error).toBeDefined();
      
      // Restore original function
      vi.mocked(validateEnvironment).mockImplementation(originalValidateEnvironment);
    });

    it('should include environment metadata in health check', () => {
      mockEnvironmentVariables({
        VITE_SUPABASE_URL: 'https://test.supabase.co',
        VITE_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlc3QiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NzI3MjQwMCwiZXhwIjoxOTYyNjQ4NDAwfQ.test',
        VITE_FEATURE_HERO_V2: 'true',
        VITE_ANOTHER_VAR: 'test'
      });

      const health = getEnvironmentHealthCheck();
      
      expect(health.environment.required_vars_count).toBe(REQUIRED_ENV_VARS.length);
      expect(health.environment.optional_vars_count).toBe(OPTIONAL_ENV_VARS.length);
      expect(health.environment.configured_vars).toBeGreaterThanOrEqual(3);
    });

    it('should not expose sensitive values in health check', () => {
      mockEnvironmentVariables({
        VITE_SUPABASE_URL: 'https://test.supabase.co',
        VITE_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlc3QiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NzI3MjQwMCwiZXhwIjoxOTYyNjQ4NDAwfQ.test'
      });

      const health = getEnvironmentHealthCheck();
      const healthString = JSON.stringify(health);
      
      // Should not contain actual JWT token or sensitive URLs in error details
      expect(healthString).not.toContain('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');
      expect(healthString).not.toContain('test.supabase.co');
    });
  });

  describe('Constants', () => {
    it('should have correct required environment variables', () => {
      expect(REQUIRED_ENV_VARS).toEqual([
        'VITE_SUPABASE_URL',
        'VITE_SUPABASE_ANON_KEY'
      ]);
    });

    it('should have correct optional environment variables', () => {
      expect(OPTIONAL_ENV_VARS).toEqual([
        'VITE_FEATURE_HERO_V2'
      ]);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string values as missing', () => {
      mockEnvironmentVariables({
        VITE_SUPABASE_URL: '',
        VITE_SUPABASE_ANON_KEY: '   ' // whitespace only
      });

      const result = validateEnvironment();
      
      expect(result.isValid).toBe(false);
      expect(result.missing).toEqual(['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY']);
    });

    it('should handle undefined import.meta.env gracefully', () => {
      vi.stubGlobal('import.meta', { env: undefined });

      expect(() => validateEnvironment()).not.toThrow();
    });

    it('should validate minimum JWT token length', () => {
      mockEnvironmentVariables({
        VITE_SUPABASE_URL: 'https://test.supabase.co',
        VITE_SUPABASE_ANON_KEY: 'eyJ' // Too short
      });

      const result = validateEnvironment();
      
      expect(result.isValid).toBe(false);
      expect(result.invalid[0]).toContain('valid Supabase JWT token');
    });
  });
});