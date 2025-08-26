import { useState, useEffect, useRef } from 'react';
import { statusToProgress } from '@/lib/status';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface LeadGenJob {
  id: string;
  status: 'pending' | 'processing' | 'searching' | 'enriching' | 'validating' | 'finalizing' | 'completed' | 'failed';
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
  organization_linkedin_url?: string;
  organization_url?: string;
}

export const useLeadGeneration = (userId?: string) => {
  const [currentJob, setCurrentJob] = useState<LeadGenJob | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [jobIdForSubscription, setJobIdForSubscription] = useState<string | null>(null);
  const simulationTimeoutsRef = useRef<number[]>([]);
  const simulationActiveRef = useRef<boolean>(false);
  const pendingUpdateRef = useRef<{ job: any; status: LeadGenJob['status']; progress: number } | null>(null);
  const { toast } = useToast();

  // Subscribe to real-time updates for jobs as soon as we have a jobId
  // Add fallback polling for anonymous users to handle RLS issues with realtime
  useEffect(() => {
    if (!jobIdForSubscription) return;

    console.log('Setting up real-time subscription for job:', jobIdForSubscription);
    
    let pollingInterval: number | null = null;
    let isPolling = false;

    const handleJobUpdate = (updatedJob: any) => {
      console.log('Job update received:', updatedJob);
      // Ensure type-safe status and provide fallback progress mapping for UI smoothness
      const status = (updatedJob.status as LeadGenJob['status']) || 'processing';
      const progressFromDb: number | undefined = updatedJob.progress;
      // Use centralized helper for mapping
      // Import placed at top: statusToProgress
      const mergedProgress = statusToProgress(status, progressFromDb);

      // Handle interactions with simulation when a real update arrives
      if (simulationActiveRef.current) {
        // If we are still simulating early steps and a >=70% real update arrives, cancel and apply immediately
        if (mergedProgress >= 70) {
          simulationTimeoutsRef.current.forEach((id) => clearTimeout(id));
          simulationTimeoutsRef.current = [];
          simulationActiveRef.current = false;
        } else if (mergedProgress >= 60) {
          // If it's the first real 60% update during simulation, defer it until simulation completes
          pendingUpdateRef.current = { job: updatedJob, status, progress: mergedProgress };
          return; // keep simulated 20/30/50 visible; do not overwrite
        }
      }

      // If early updates were missed and first real update arrives at ~60 (enriching),
      // simulate intermediate waypoints: 20 -> 30 -> 50 (10s apart), then apply real
      const isFirstMeaningful = !currentJob || (currentJob && currentJob.progress <= 10);
      // We now expect the first mid update to arrive as 20% (coerced by backend),
      // so trigger simulation when we see exactly 20% and no job yet.
      const shouldSimulateFromTwenty = isFirstMeaningful && mergedProgress === 20;

      if (shouldSimulateFromTwenty && !simulationActiveRef.current) {
        simulationActiveRef.current = true;

        // Ensure we lock in 20% as the starting point
        setCurrentJob({
          ...(updatedJob as LeadGenJob),
          status,
          progress: 20,
        });

        const t1 = window.setTimeout(() => {
          setCurrentJob((prev) => (prev ? { ...prev, progress: 30 } as LeadGenJob : prev));
        }, 10_000);

        const t2 = window.setTimeout(() => {
          setCurrentJob((prev) => (prev ? { ...prev, progress: 50 } as LeadGenJob : prev));
        }, 20_000);

        const t3 = window.setTimeout(() => {
          // After 50%, if a queued real update exists (e.g., the original 60%), apply it now.
          const pending = pendingUpdateRef.current;
          if (pending) {
            setCurrentJob({
              ...(pending.job as LeadGenJob),
              status: pending.status,
              progress: pending.progress,
            });
          }
          pendingUpdateRef.current = null;
          simulationActiveRef.current = false;
          simulationTimeoutsRef.current = [];
        }, 30_000);

        simulationTimeoutsRef.current = [t1 as unknown as number, t2 as unknown as number, t3 as unknown as number];
        return; // Defer applying the real update immediately; simulation will catch up
      }

      setCurrentJob({
        ...(updatedJob as LeadGenJob),
        status,
        progress: mergedProgress,
      });
      
      if (updatedJob.status === 'completed') {
        toast({
          title: "Lead generation completed!",
          description: `Found ${updatedJob.total_leads_found} leads`,
        });
        fetchLeads(updatedJob.id);
        // Stop polling when completed
        if (pollingInterval) {
          clearInterval(pollingInterval);
          pollingInterval = null;
        }
      } else if (updatedJob.status === 'failed') {
        toast({
          title: "Lead generation failed",
          description: updatedJob.error_message || "An error occurred",
          variant: "destructive",
        });
        // Stop polling when failed
        if (pollingInterval) {
          clearInterval(pollingInterval);
          pollingInterval = null;
        }
      }
    };

    // Set up polling as fallback for anonymous users
    const startPolling = () => {
      if (isPolling) return;
      isPolling = true;
      console.log('Starting polling fallback for job updates');
      
      pollingInterval = window.setInterval(async () => {
        try {
          const { data, error } = await supabase
            .from('lead_gen_jobs')
            .select('*')
            .eq('id', jobIdForSubscription)
            .maybeSingle();

          if (error) {
            console.error('Polling error:', error);
            return;
          }

          if (data && (!currentJob || data.updated_at !== currentJob.updated_at)) {
            handleJobUpdate(data);
          }
        } catch (err) {
          console.error('Polling exception:', err);
        }
      }, 3000); // Poll every 3 seconds
    };
    
    const jobChannel = supabase
      .channel(`job-updates-${jobIdForSubscription}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'lead_gen_jobs',
          filter: `id=eq.${jobIdForSubscription}`
        },
        (payload) => {
          handleJobUpdate(payload.new);
        }
      )
      .subscribe((status) => {
        console.log('Job subscription status:', status);
        
        // If subscription fails (common with RLS + anonymous users), start polling
        if (status === 'SUBSCRIPTION_ERROR' || status === 'CLOSED') {
          console.log('Realtime subscription failed, falling back to polling');
          startPolling();
        }
      });

    // Start polling immediately for anonymous users as primary strategy
    const timeout = setTimeout(() => {
      console.log('Starting polling as primary strategy for anonymous users');
      startPolling();
    }, 1000);

    return () => {
      console.log('Cleaning up job subscription and polling');
      supabase.removeChannel(jobChannel);
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
      clearTimeout(timeout);
    };
  }, [jobIdForSubscription, toast, currentJob]);

  // Subscribe to real-time updates for leads as soon as we have a jobId
  // Add fallback polling for anonymous users
  useEffect(() => {
    if (!jobIdForSubscription) return;

    console.log('Setting up real-time subscription for leads:', jobIdForSubscription);
    
    let leadsPollingInterval: number | null = null;
    let isLeadsPolling = false;
    let lastLeadCount = 0;

    const handleNewLead = (lead: Lead) => {
      console.log('New lead received:', lead);
      console.log('Lead LinkedIn URLs:', {
        linkedin_url: lead.linkedin_url,
        organization_linkedin_url: lead.organization_linkedin_url,
        organization_url: lead.organization_url
      });
      setLeads(prev => [...prev, lead]);
    };

    // Set up polling for leads
    const startLeadsPolling = () => {
      if (isLeadsPolling) return;
      isLeadsPolling = true;
      console.log('Starting polling fallback for leads updates');
      
      leadsPollingInterval = window.setInterval(async () => {
        try {
          const { data, error } = await supabase
            .from('leads')
            .select('*')
            .eq('job_id', jobIdForSubscription)
            .order('created_at', { ascending: true });

          if (error) {
            console.error('Leads polling error:', error);
            return;
          }

          if (data && data.length > lastLeadCount) {
            // Only add new leads (not already in state)
            const newLeads = data.slice(lastLeadCount);
            console.log(`Found ${newLeads.length} new leads via polling`);
            newLeads.forEach(handleNewLead);
            lastLeadCount = data.length;
          }
        } catch (err) {
          console.error('Leads polling exception:', err);
        }
      }, 5000); // Poll every 5 seconds for leads
    };
    
    const leadsChannel = supabase
      .channel(`leads-updates-${jobIdForSubscription}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'leads',
          filter: `job_id=eq.${jobIdForSubscription}`
        },
        (payload) => {
          handleNewLead(payload.new as Lead);
        }
      )
      .subscribe((status) => {
        console.log('Leads subscription status:', status);
        
        // If subscription fails, start polling
        if (status === 'SUBSCRIPTION_ERROR' || status === 'CLOSED') {
          console.log('Realtime leads subscription failed, falling back to polling');
          startLeadsPolling();
        }
      });

    // Start polling immediately for anonymous users as primary strategy
    const timeout = setTimeout(() => {
      console.log('Starting leads polling as primary strategy for anonymous users');
      startLeadsPolling();
    }, 2000);

    return () => {
      console.log('Cleaning up leads subscription and polling');
      supabase.removeChannel(leadsChannel);
      if (leadsPollingInterval) {
        clearInterval(leadsPollingInterval);
      }
      clearTimeout(timeout);
    };
  }, [jobIdForSubscription]);

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
      // Immediately subscribe to job updates to avoid missing early updates
      setJobIdForSubscription(jobId);

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
        ...(job as LeadGenJob),
        status: (job.status as LeadGenJob['status']) || 'processing',
      });
      
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
      console.log('Fetched leads with LinkedIn data:', data?.map(lead => ({
        id: lead.id,
        name: lead.name,
        linkedin_url: lead.linkedin_url,
        organization_linkedin_url: lead.organization_linkedin_url,
        organization_url: lead.organization_url,
        additional_data_type: typeof lead.additional_data
      })));
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
    setJobIdForSubscription(null);
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