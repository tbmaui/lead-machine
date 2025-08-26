import { describe, it, expect } from 'vitest';
import { getFeatureFlags, isFeatureEnabled, useHeroV2 } from './feature-flags';

describe('Feature Flags', () => {
  it('should have proper interface structure', () => {
    const flags = getFeatureFlags();
    expect(flags).toHaveProperty('HERO_V2');
    expect(typeof flags.HERO_V2).toBe('boolean');
  });

  it('should check if Hero V2 feature flag exists', () => {
    const result = isFeatureEnabled('HERO_V2');
    expect(typeof result).toBe('boolean');
  });

  it('should return Hero V2 status via hook', () => {
    const result = useHeroV2();
    expect(typeof result).toBe('boolean');
  });

  it('should handle feature flag utility functions', () => {
    // Test that feature functions work consistently
    const directFlag = getFeatureFlags().HERO_V2;
    const utilityFlag = isFeatureEnabled('HERO_V2');
    const hookFlag = useHeroV2();
    
    expect(directFlag).toBe(utilityFlag);
    expect(utilityFlag).toBe(hookFlag);
  });
});