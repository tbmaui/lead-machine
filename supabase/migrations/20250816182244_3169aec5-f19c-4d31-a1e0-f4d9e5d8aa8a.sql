-- Update the status constraint to allow the new status values from n8n
ALTER TABLE public.lead_gen_jobs 
DROP CONSTRAINT IF EXISTS lead_gen_jobs_status_check;

-- Add new constraint with all allowed status values
ALTER TABLE public.lead_gen_jobs 
ADD CONSTRAINT lead_gen_jobs_status_check 
CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'searching', 'enriching', 'finalizing'));