import { describe, it, expect } from 'vitest';
import { statusToProgress } from './status';

describe('statusToProgress (Option B)', () => {
  it('uses DB progress when provided', () => {
    expect(statusToProgress('processing', 25)).toBe(25);
    expect(statusToProgress('validating', 71)).toBe(71);
    expect(statusToProgress('completed', 100)).toBe(100);
  });

  it('maps known statuses correctly when dbProgress is undefined', () => {
    expect(statusToProgress('pending')).toBe(0);
    expect(statusToProgress('processing')).toBe(10);
    expect(statusToProgress('searching')).toBe(40);
    expect(statusToProgress('enriching')).toBe(60);
    expect(statusToProgress('validating')).toBe(70);
    expect(statusToProgress('completed')).toBe(100);
    expect(statusToProgress('failed')).toBe(0);
  });
});


