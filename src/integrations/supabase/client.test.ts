/**
 * Supabase Client Configuration Tests
 * 
 * Tests for secure Supabase client initialization with environment variables
 */
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

// Mock the env-validation module
const mockGetEnvironmentConfig = vi.fn();
vi.mock('@/lib/env-validation', () => ({
  getEnvironmentConfig: mockGetEnvironmentConfig
}));

// Mock @supabase/supabase-js
const mockCreateClient = vi.fn();
vi.mock('@supabase/supabase-js', () => ({
  createClient: mockCreateClient
}));

// Mock import.meta.env
const mockEnv: Record<string, string> = {};
vi.stubGlobal('import.meta', {
  env: mockEnv
});

describe('Supabase Client Configuration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.keys(mockEnv).forEach(key => delete mockEnv[key]);
    
    // Reset modules to ensure fresh imports
    vi.resetModules();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create Supabase client with environment variables', async () => {
    // Mock valid environment configuration
    const mockConfig = {
      VITE_SUPABASE_URL: 'https://test.supabase.co',
      VITE_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test'
    };
    mockGetEnvironmentConfig.mockReturnValue(mockConfig);

    // Mock successful client creation
    const mockClient = { auth: {}, from: vi.fn() };
    mockCreateClient.mockReturnValue(mockClient);

    // Import the module (this will trigger the client creation)
    const clientModule = await import('./client');

    // Verify environment config was called
    expect(mockGetEnvironmentConfig).toHaveBeenCalledOnce();

    // Verify createClient was called with correct parameters
    expect(mockCreateClient).toHaveBeenCalledWith(
      'https://test.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test',
      {
        auth: {
          storage: expect.any(Object), // localStorage
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      }
    );

    // Verify client is exported
    expect(clientModule.supabase).toBe(mockClient);
  });

  it('should export supabaseConfig with correct properties', async () => {
    const mockConfig = {
      VITE_SUPABASE_URL: 'https://test.supabase.co',
      VITE_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test'
    };
    mockGetEnvironmentConfig.mockReturnValue(mockConfig);
    mockCreateClient.mockReturnValue({});

    // Set mode for environment detection
    mockEnv.MODE = 'development';

    const clientModule = await import('./client');

    expect(clientModule.supabaseConfig).toEqual({
      url: 'https://test.supabase.co',
      hasValidKey: true,
      environment: 'development'
    });
  });

  it('should handle missing environment mode gracefully', async () => {
    const mockConfig = {
      VITE_SUPABASE_URL: 'https://test.supabase.co',
      VITE_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test'
    };
    mockGetEnvironmentConfig.mockReturnValue(mockConfig);
    mockCreateClient.mockReturnValue({});

    // Don't set MODE
    const clientModule = await import('./client');

    expect(clientModule.supabaseConfig.environment).toBe('development');
  });

  it('should detect invalid key length in config', async () => {
    const mockConfig = {
      VITE_SUPABASE_URL: 'https://test.supabase.co',
      VITE_SUPABASE_ANON_KEY: 'short' // Less than 100 characters
    };
    mockGetEnvironmentConfig.mockReturnValue(mockConfig);
    mockCreateClient.mockReturnValue({});

    const clientModule = await import('./client');

    expect(clientModule.supabaseConfig.hasValidKey).toBe(false);
  });

  it('should fail fast when environment validation throws', async () => {
    // Mock environment validation to throw error
    mockGetEnvironmentConfig.mockImplementation(() => {
      throw new Error('Missing required environment variables: VITE_SUPABASE_URL');
    });

    // Importing the module should throw the validation error
    await expect(async () => {
      await import('./client');
    }).rejects.toThrow('Missing required environment variables');

    // Verify createClient was not called
    expect(mockCreateClient).not.toHaveBeenCalled();
  });

  it('should configure auth settings correctly', async () => {
    const mockConfig = {
      VITE_SUPABASE_URL: 'https://test.supabase.co',
      VITE_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test'
    };
    mockGetEnvironmentConfig.mockReturnValue(mockConfig);
    mockCreateClient.mockReturnValue({});

    await import('./client');

    const authConfig = mockCreateClient.mock.calls[0][2].auth;
    
    expect(authConfig).toEqual({
      storage: expect.any(Object), // localStorage
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    });

    // Verify localStorage is used for auth storage
    expect(authConfig.storage).toBe(localStorage);
  });

  it('should not expose sensitive values in supabaseConfig', async () => {
    const mockConfig = {
      VITE_SUPABASE_URL: 'https://test.supabase.co',
      VITE_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.secret-key-content'
    };
    mockGetEnvironmentConfig.mockReturnValue(mockConfig);
    mockCreateClient.mockReturnValue({});

    const clientModule = await import('./client');

    // Config should include URL (not sensitive) but not the actual key
    expect(clientModule.supabaseConfig.url).toBe('https://test.supabase.co');
    expect(clientModule.supabaseConfig).not.toHaveProperty('key');
    expect(clientModule.supabaseConfig).not.toHaveProperty('anon_key');
    
    // Should only indicate if key is valid, not expose the key
    expect(clientModule.supabaseConfig.hasValidKey).toBe(true);
  });

  describe('Integration with Environment Validation', () => {
    it('should use validated configuration from env-validation', async () => {
      const mockConfig = {
        VITE_SUPABASE_URL: 'https://validated.supabase.co',
        VITE_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.validated'
      };
      mockGetEnvironmentConfig.mockReturnValue(mockConfig);
      mockCreateClient.mockReturnValue({});

      await import('./client');

      // Verify the exact validated values are used
      expect(mockCreateClient).toHaveBeenCalledWith(
        'https://validated.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.validated',
        expect.any(Object)
      );
    });

    it('should propagate validation errors during import', async () => {
      const validationError = new Error(`
❌ Environment Configuration Error

Missing Required Variables:
  • VITE_SUPABASE_URL
  • VITE_SUPABASE_ANON_KEY

🔧 How to Fix:
1. Create a .env.local file in your project root
2. Copy the template from .env.example
3. Fill in the required values from your Supabase project
      `);

      mockGetEnvironmentConfig.mockImplementation(() => {
        throw validationError;
      });

      await expect(async () => {
        await import('./client');
      }).rejects.toThrow(validationError.message);
    });
  });

  describe('TypeScript Types', () => {
    it('should import Database type correctly', async () => {
      const mockConfig = {
        VITE_SUPABASE_URL: 'https://test.supabase.co',
        VITE_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test'
      };
      mockGetEnvironmentConfig.mockReturnValue(mockConfig);
      mockCreateClient.mockReturnValue({});

      // This should not throw TypeScript errors
      await import('./client');

      // Verify createClient was called with proper typing
      expect(mockCreateClient).toHaveBeenCalled();
    });
  });

  describe('Error Scenarios', () => {
    it('should handle createClient errors gracefully', async () => {
      const mockConfig = {
        VITE_SUPABASE_URL: 'https://test.supabase.co',
        VITE_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test'
      };
      mockGetEnvironmentConfig.mockReturnValue(mockConfig);
      
      // Mock createClient to throw
      mockCreateClient.mockImplementation(() => {
        throw new Error('Supabase client creation failed');
      });

      await expect(async () => {
        await import('./client');
      }).rejects.toThrow('Supabase client creation failed');
    });

    it('should handle malformed environment config', async () => {
      // Mock config with missing properties
      mockGetEnvironmentConfig.mockReturnValue({
        VITE_SUPABASE_URL: undefined,
        VITE_SUPABASE_ANON_KEY: null
      } as any);

      mockCreateClient.mockReturnValue({});

      await import('./client');

      // Should still attempt to create client with undefined values
      expect(mockCreateClient).toHaveBeenCalledWith(
        undefined,
        null,
        expect.any(Object)
      );
    });
  });
});