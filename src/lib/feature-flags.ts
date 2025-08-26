/**
 * Feature flags utility for managing feature toggles
 * Provides type-safe access to Vite environment variables
 */

export interface FeatureFlags {
  HERO_V2: boolean;
}

/**
 * Get the current feature flags configuration
 */
export function getFeatureFlags(): FeatureFlags {
  return {
    HERO_V2: import.meta.env.VITE_FEATURE_HERO_V2 === 'true',
  };
}

/**
 * Check if a specific feature is enabled
 */
export function isFeatureEnabled(feature: keyof FeatureFlags): boolean {
  const flags = getFeatureFlags();
  return flags[feature];
}

/**
 * Hook to check if Hero V2 is enabled
 */
export function useHeroV2(): boolean {
  return isFeatureEnabled('HERO_V2');
}