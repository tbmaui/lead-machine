export type LeadGenStatus =
  | 'pending'
  | 'processing'
  | 'searching'
  | 'enriching'
  | 'validating'
  | 'finalizing'
  | 'completed'
  | 'failed';

const defaultProgressByStatus: Record<LeadGenStatus, number> = {
  pending: 0,
  processing: 10,
  searching: 40,
  enriching: 60,
  validating: 70,
  finalizing: 90,
  completed: 100,
  failed: 0,
};

export function statusToProgress(status: LeadGenStatus, dbProgress?: number): number {
  if (typeof dbProgress === 'number') return Math.max(0, Math.min(100, dbProgress));
  return defaultProgressByStatus[status] ?? 0;
}

export const ALLOWED_STATUSES: LeadGenStatus[] = [
  'pending',
  'processing',
  'searching',
  'enriching',
  'validating',
  'finalizing',
  'completed',
  'failed',
];


