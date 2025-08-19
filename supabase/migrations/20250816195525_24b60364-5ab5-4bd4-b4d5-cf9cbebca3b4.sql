-- Configure lead_gen_jobs table for real-time updates
ALTER TABLE public.lead_gen_jobs REPLICA IDENTITY FULL;

-- Add the table to the supabase_realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.lead_gen_jobs;