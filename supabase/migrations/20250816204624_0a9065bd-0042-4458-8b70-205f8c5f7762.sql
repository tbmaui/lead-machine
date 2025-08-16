-- Enable real-time for leads table
ALTER TABLE public.leads REPLICA IDENTITY FULL;

-- Add leads table to the real-time publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.leads;