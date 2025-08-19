-- Add new fields to leads table for N8n integration
ALTER TABLE public.leads 
ADD COLUMN organization_url text,
ADD COLUMN organization_linkedin_url text;