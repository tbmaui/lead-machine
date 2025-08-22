-- Add 'finalizing' to allowed statuses for lead_gen_jobs.status (Option A)
-- Reversible: drop then recreate CHECK including finalizing
ALTER TABLE public.lead_gen_jobs 
DROP CONSTRAINT IF EXISTS lead_gen_jobs_status_check;

ALTER TABLE public.lead_gen_jobs 
ADD CONSTRAINT lead_gen_jobs_status_check 
CHECK (
  status IN (
    'pending',
    'processing',
    'searching',
    'enriching',
    'validating',
    'finalizing',
    'completed',
    'failed'
  )
);


