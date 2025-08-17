-- Enable real-time for lead_gen_jobs table
ALTER PUBLICATION supabase_realtime ADD TABLE lead_gen_jobs;

-- Enable real-time for leads table  
ALTER PUBLICATION supabase_realtime ADD TABLE leads;

-- Set replica identity for better real-time updates
ALTER TABLE lead_gen_jobs REPLICA IDENTITY FULL;
ALTER TABLE leads REPLICA IDENTITY FULL;