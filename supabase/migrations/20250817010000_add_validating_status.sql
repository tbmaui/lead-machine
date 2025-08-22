-- Expand allowed statuses to include 'validating' and remove unused 'finalizing'
-- Safe: drops existing CHECK then adds new comprehensive list
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
    'completed',
    'failed'
  )
);


