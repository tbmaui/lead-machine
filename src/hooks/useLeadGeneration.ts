import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface LeadGenJob {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  job_criteria: any;
  progress: number;
  total_leads_found: number;
  error_message?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface Lead {
  id: string;
  name: string;
  title?: string;
  company?: string;
  email?: string;
  phone?: string;
  linkedin_url?: string;
  location?: string;
  industry?: string;
  company_size?: string;
  score?: number;
  additional_data?: any;
}

export const useLeadGeneration = (userId?: string) => {
  const [currentJob, setCurrentJob] = useState<LeadGenJob | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Subscribe to real-time updates for jobs
  useEffect(() => {
    if (!userId || !currentJob) return;

    const jobChannel = supabase
      .channel('job-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'lead_gen_jobs',
          filter: `id=eq.${currentJob.id}`
        },
        (payload) => {
          console.log('Job update received:', payload.new);
          const updatedJob = payload.new as any;
          setCurrentJob({
            ...updatedJob,
            status: updatedJob.status as 'pending' | 'processing' | 'completed' | 'failed'
          } as LeadGenJob);
          
          if (updatedJob.status === 'completed') {
            toast({
              title: "Lead generation completed!",
              description: `Found ${updatedJob.total_leads_found} leads`,
            });
            fetchLeads(currentJob.id);
          } else if (updatedJob.status === 'failed') {
            toast({
              title: "Lead generation failed",
              description: updatedJob.error_message || "An error occurred",
              variant: "destructive",
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(jobChannel);
    };
  }, [userId, currentJob?.id, toast]);

  // Subscribe to real-time updates for leads
  useEffect(() => {
    if (!currentJob) return;

    const leadsChannel = supabase
      .channel('leads-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'leads',
          filter: `job_id=eq.${currentJob.id}`
        },
        (payload) => {
          console.log('New lead received:', payload.new);
          setLeads(prev => [...prev, payload.new as Lead]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(leadsChannel);
    };
  }, [currentJob?.id]);

  const startLeadGeneration = async (jobCriteria: any) => {
    // Use provided userId or generate proper UUID for anonymous user
    const effectiveUserId = userId || crypto.randomUUID();

    setLoading(true);
    setLeads([]); // Clear previous leads

    try {
      console.log('Starting lead generation with criteria:', jobCriteria);
      
      const response = await supabase.functions.invoke('trigger-lead-generation', {
        body: {
          jobCriteria,
          userId: effectiveUserId
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      const { jobId } = response.data;
      console.log('Lead generation job started:', jobId);

      // Fetch the created job with retry logic to handle timing and RLS issues
      let job = null;
      let attempts = 0;
      const maxAttempts = 10; // Increased attempts
      
      while (!job && attempts < maxAttempts) {
        const { data, error: jobError } = await supabase
          .from('lead_gen_jobs')
          .select('*')
          .eq('id', jobId)
          .maybeSingle();

        if (jobError) {
          console.error('Error fetching job:', jobError);
          throw jobError;
        }
        
        if (data) {
          console.log('Successfully retrieved job:', data);
          job = data;
          break;
        }
        
        attempts++;
        if (attempts < maxAttempts) {
          // Wait with longer delays: 200ms, 400ms, 800ms, 1600ms, 3200ms, etc.
          const delay = 200 * Math.pow(2, attempts - 1);
          await new Promise(resolve => setTimeout(resolve, delay));
          console.log(`Retrying job fetch, attempt ${attempts + 1}/${maxAttempts} (waiting ${delay}ms)`);
        }
      }

      if (!job) {
        throw new Error('Job was created but could not be retrieved after multiple attempts');
      }

      setCurrentJob({
        ...job,
        status: job.status as 'pending' | 'processing' | 'completed' | 'failed'
      } as LeadGenJob);
      
      toast({
        title: "Lead generation started",
        description: "Your lead generation is in progress...",
      });

    } catch (error) {
      console.error('Error starting lead generation:', error);
      toast({
        title: "Error starting lead generation",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchLeads = async (jobId: string) => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('job_id', jobId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast({
        title: "Error fetching leads",
        description: "Failed to load leads data",
        variant: "destructive",
      });
    }
  };

  const resetJob = () => {
    setCurrentJob(null);
    setLeads([]);
  };

  return {
    currentJob,
    leads,
    loading,
    startLeadGeneration,
    resetJob,
    fetchLeads
  };
};