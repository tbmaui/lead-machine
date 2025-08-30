/**
 * Environment Variable Validation Utilities
 * 
 * Provides secure validation for required environment variables
 * with meaningful error messages and fail-fast behavior.
 */

export interface EnvironmentConfig {
  VITE_SUPABASE_URL: string;
  VITE_SUPABASE_ANON_KEY: string;
  VITE_FEATURE_HERO_V2?: string;
}

export interface ValidationResult {
  isValid: boolean;
  missing: string[];
  invalid: string[];
  config?: EnvironmentConfig;
}

/**
 * Required environment variables for production deployment
 */
export const REQUIRED_ENV_VARS = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY'
] as const;

/**
 * Optional environment variables with default values
 */
export const OPTIONAL_ENV_VARS = [
  'VITE_FEATURE_HERO_V2'
] as const;

/**
 * Validates a single environment variable value
 */
function validateEnvVar(key: string, value: string | undefined): { valid: boolean; error?: string } {
  if (!value || value.trim() === '') {
    return { valid: false, error: `${key} is missing or empty` };
  }

  // Specific validations based on variable type
  switch (key) {
    case 'VITE_SUPABASE_URL':
      if (!value.startsWith('https://') || !value.includes('.supabase.co')) {
        return { 
          valid: false, 
          error: `${key} must be a valid Supabase URL (https://...supabase.co)` 
        };
      }
      break;
    
    case 'VITE_SUPABASE_ANON_KEY':
      if (!value.startsWith('eyJ') || value.length < 100) {
        return { 
          valid: false, 
          error: `${key} must be a valid Supabase anonymous key (JWT token)` 
        };
      }
      break;
    
    case 'VITE_FEATURE_HERO_V2':
      if (value !== 'true' && value !== 'false') {
        return { 
          valid: false, 
          error: `${key} must be 'true' or 'false'` 
        };
      }
      break;
  }

  return { valid: true };
}

/**
 * Validates all required environment variables
 * @returns ValidationResult with details about missing or invalid variables
 */
export function validateEnvironment(): ValidationResult {
  const missing: string[] = [];
  const invalid: string[] = [];
  const config: Partial<EnvironmentConfig> = {};

  // Check required variables
  for (const key of REQUIRED_ENV_VARS) {
    const value = import.meta.env[key];
    const validation = validateEnvVar(key, value);
    
    if (!value) {
      missing.push(key);
    } else if (!validation.valid) {
      invalid.push(`${key}: ${validation.error}`);
    } else {
      (config as any)[key] = value;
    }
  }

  // Check optional variables
  for (const key of OPTIONAL_ENV_VARS) {
    const value = import.meta.env[key];
    if (value) {
      const validation = validateEnvVar(key, value);
      if (!validation.valid) {
        invalid.push(`${key}: ${validation.error}`);
      } else {
        (config as any)[key] = value;
      }
    }
  }

  const isValid = missing.length === 0 && invalid.length === 0;

  return {
    isValid,
    missing,
    invalid,
    config: isValid ? config as EnvironmentConfig : undefined
  };
}

/**
 * Validates environment and throws detailed error if validation fails
 * Used for fail-fast behavior during application startup
 */
export function validateEnvironmentOrThrow(): EnvironmentConfig {
  const result = validateEnvironment();
  
  if (!result.isValid) {
    const errorMessages: string[] = [
      '❌ Environment Configuration Error',
      '',
      'The application cannot start due to missing or invalid environment variables:',
      ''
    ];

    if (result.missing.length > 0) {
      errorMessages.push('Missing Required Variables:');
      result.missing.forEach(key => {
        errorMessages.push(`  • ${key}`);
      });
      errorMessages.push('');
    }

    if (result.invalid.length > 0) {
      errorMessages.push('Invalid Variable Values:');
      result.invalid.forEach(error => {
        errorMessages.push(`  • ${error}`);
      });
      errorMessages.push('');
    }

    errorMessages.push('🔧 How to Fix:');
    errorMessages.push('1. Create a .env.local file in your project root');
    errorMessages.push('2. Copy the template from .env.example');
    errorMessages.push('3. Fill in the required values from your Supabase project');
    errorMessages.push('4. Restart the development server');
    errorMessages.push('');
    errorMessages.push('📚 For more help, see: DEPLOYMENT.md');

    throw new Error(errorMessages.join('\n'));
  }

  return result.config!;
}

/**
 * Gets environment configuration with validation
 * @returns Validated environment configuration
 */
export function getEnvironmentConfig(): EnvironmentConfig {
  return validateEnvironmentOrThrow();
}

/**
 * Health check function for environment configuration
 * Returns status information for monitoring and debugging
 */
export function getEnvironmentHealthCheck() {
  try {
    const result = validateEnvironment();
    return {
      status: result.isValid ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      environment: {
        node_env: import.meta.env.MODE || 'unknown',
        required_vars_count: REQUIRED_ENV_VARS.length,
        optional_vars_count: OPTIONAL_ENV_VARS.length,
        configured_vars: Object.keys(import.meta.env).filter(key => 
          key.startsWith('VITE_')
        ).length
      },
      validation: {
        missing_count: result.missing.length,
        invalid_count: result.invalid.length,
        missing_vars: result.missing,
        invalid_vars: result.invalid.map(error => error.split(':')[0]) // Remove error details for security
      }
    };
  } catch (error) {
    return {
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message.split('\n')[0] : 'Unknown error'
    };
  }
}