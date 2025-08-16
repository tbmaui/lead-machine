-- Configure lead_gen_jobs table for real-time updates
ALTER TABLE public.lead_gen_jobs REPLICA IDENTITY FULL;