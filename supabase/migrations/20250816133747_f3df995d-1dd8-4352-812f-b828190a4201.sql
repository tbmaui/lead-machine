-- Create lead generation jobs table
CREATE TABLE public.lead_gen_jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  job_criteria JSONB NOT NULL,
  n8n_execution_id TEXT,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  total_leads_found INTEGER DEFAULT 0,
  error_message TEXT,
  webhook_url TEXT DEFAULT 'https://playground.automateanythingacademy.com/webhook-test/lead-intake',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create leads table
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES public.lead_gen_jobs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  title TEXT,
  company TEXT,
  email TEXT,
  phone TEXT,
  linkedin_url TEXT,
  location TEXT,
  industry TEXT,
  company_size TEXT,
  score INTEGER CHECK (score >= 0 AND score <= 100),
  additional_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.lead_gen_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for lead_gen_jobs
CREATE POLICY "Users can view their own jobs" 
ON public.lead_gen_jobs 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own jobs" 
ON public.lead_gen_jobs 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own jobs" 
ON public.lead_gen_jobs 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for leads
CREATE POLICY "Users can view leads for their jobs" 
ON public.leads 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.lead_gen_jobs 
  WHERE id = leads.job_id AND user_id = auth.uid()
));

CREATE POLICY "System can insert leads" 
ON public.leads 
FOR INSERT 
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_lead_gen_jobs_updated_at
BEFORE UPDATE ON public.lead_gen_jobs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_lead_gen_jobs_user_id ON public.lead_gen_jobs(user_id);
CREATE INDEX idx_lead_gen_jobs_status ON public.lead_gen_jobs(status);
CREATE INDEX idx_lead_gen_jobs_n8n_execution_id ON public.lead_gen_jobs(n8n_execution_id);
CREATE INDEX idx_leads_job_id ON public.leads(job_id);

-- Enable realtime for both tables
ALTER TABLE public.lead_gen_jobs REPLICA IDENTITY FULL;
ALTER TABLE public.leads REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.lead_gen_jobs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.leads;