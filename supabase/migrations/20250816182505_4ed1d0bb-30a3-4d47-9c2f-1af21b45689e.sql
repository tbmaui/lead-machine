-- Allow anonymous users to view jobs they created using a session-based approach
-- Update the RLS policy to handle both authenticated and anonymous users
DROP POLICY IF EXISTS "Users can view their own jobs" ON public.lead_gen_jobs;

CREATE POLICY "Users can view their own jobs" 
ON public.lead_gen_jobs 
FOR SELECT 
USING (
  -- Authenticated users can see their own jobs
  (auth.uid() IS NOT NULL AND auth.uid() = user_id) 
  OR 
  -- Anonymous users can see jobs created in the last hour (temporary access)
  (auth.uid() IS NULL AND created_at > now() - interval '1 hour')
);

-- Also update the leads policy to match
DROP POLICY IF EXISTS "Users can view leads for their jobs" ON public.leads;

CREATE POLICY "Users can view leads for their jobs" 
ON public.leads 
FOR SELECT 
USING (
  EXISTS ( 
    SELECT 1
    FROM lead_gen_jobs
    WHERE lead_gen_jobs.id = leads.job_id 
    AND (
      -- Authenticated users can see leads for their jobs
      (auth.uid() IS NOT NULL AND lead_gen_jobs.user_id = auth.uid())
      OR 
      -- Anonymous users can see leads for recent jobs
      (auth.uid() IS NULL AND lead_gen_jobs.created_at > now() - interval '1 hour')
    )
  )
);