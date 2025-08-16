-- Configure leads table for real-time updates
ALTER TABLE public.leads REPLICA IDENTITY FULL;