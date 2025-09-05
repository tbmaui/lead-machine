import { useState, useEffect, useRef } from 'react';
import { statusToProgress } from '@/lib/status';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { saveSearchState, loadSearchState, clearSearchState, STORAGE_KEYS } from '@/lib/session-storage';

// N8N Webhook URLs
const N8N_WEBHOOK_URL_PROD = 'https://playground.automateanythingacademy.com/webhook/lead-intake';
const N8N_WEBHOOK_URL_TEST = 'https://playground.automateanythingacademy.com/webhook-test/lead-intake';

// Helper function to send data to N8N webhook
const sendToN8NWebhook = async (data: any) => {
  const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const webhookUrl = isDevelopment ? N8N_WEBHOOK_URL_TEST : N8N_WEBHOOK_URL_PROD;
  
  try {
    console.log(`🎯 Sending data to N8N webhook (${isDevelopment ? 'TEST' : 'PROD'}):`, data);
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        timestamp: new Date().toISOString(),
        source: 'lead-machine-production',
        environment: 'production'
      })
    });

    if (response.ok) {
      const result = await response.text();
      console.log('✅ N8N webhook response:', result);
      return { success: true, response: result };
    } else {
      console.error('❌ N8N webhook error:', response.status, response.statusText);
      return { success: false, error: `HTTP ${response.status}: ${response.statusText}` };
    }
  } catch (error) {
    console.error('❌ N8N webhook network error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

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

export const useLeadGeneration = (userId: string, restoreFromStorage: boolean = true) => {
  const [currentJob, setCurrentJob] = useState<LeadGenJob | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [jobIdForSubscription, setJobIdForSubscription] = useState<string | null>(null);
  const [showingResults, setShowingResults] = useState(false);
  const simulationTimeoutsRef = useRef<number[]>([]);
  const simulationActiveRef = useRef<boolean>(false);
  const pendingUpdateRef = useRef<{ job: any; status: LeadGenJob['status']; progress: number } | null>(null);
  const completionTimeoutRef = useRef<number | null>(null);
  const { toast } = useToast();

  // Restore state from storage on mount
  useEffect(() => {
    if (!restoreFromStorage || !userId) return;

    try {
      // Restore current job
      const savedJob = loadSearchState<LeadGenJob>(STORAGE_KEYS.CURRENT_JOB);
      if (savedJob) {
        setCurrentJob(savedJob);
        setJobIdForSubscription(savedJob.id);
        if (savedJob.status === 'completed') {
          setShowingResults(true);
        }
      }

      // Restore leads
      const savedLeads = loadSearchState<Lead[]>(STORAGE_KEYS.SEARCH_RESULTS);
      if (savedLeads) {
        setLeads(savedLeads);
      }
    } catch (error) {
      console.warn('Error restoring state from storage:', error);
    }
  }, [userId, restoreFromStorage]);

  // Auto-save state changes
  useEffect(() => {
    if (!restoreFromStorage) return;
    
    if (currentJob) {
      saveSearchState(STORAGE_KEYS.CURRENT_JOB, currentJob);
    } else {
      clearSearchState(STORAGE_KEYS.CURRENT_JOB);
    }
  }, [currentJob, restoreFromStorage]);

  useEffect(() => {
    if (!restoreFromStorage) return;
    
    if (leads.length > 0) {
      saveSearchState(STORAGE_KEYS.SEARCH_RESULTS, leads);
    } else {
      clearSearchState(STORAGE_KEYS.SEARCH_RESULTS);
    }
  }, [leads, restoreFromStorage]);

  // Subscribe to real-time updates for jobs as soon as we have a jobId
  useEffect(() => {
    if (!jobIdForSubscription || !userId) return;

    console.log('Setting up real-time subscription for job:', jobIdForSubscription);

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

      // Handle completion status with smooth 100% progress and pause
      if (updatedJob.status === 'completed') {
        // 🎯 Send completion data to N8N webhook
        sendToN8NWebhook({
          action: 'lead_generation_completed',
          jobId: updatedJob.id,
          totalLeads: updatedJob.total_leads_found,
          status: 'completed',
          userId,
          message: 'Lead generation completed successfully'
        });
        
        // First, set progress to 100% and show completion
        setCurrentJob({
          ...(updatedJob as LeadGenJob),
          status,
          progress: 100,
        });
        
        // Then wait 2-3 seconds before showing results
        completionTimeoutRef.current = window.setTimeout(() => {
          toast({
            title: "Lead generation completed!",
            description: `Found ${updatedJob.total_leads_found} leads`,
          });
          fetchLeads(updatedJob.id);
          setShowingResults(true);
        }, 2500); // 2.5 second pause for user satisfaction
        
        return;
      }
      
      // Handle failed status
      if (updatedJob.status === 'failed') {
        // 🎯 Send failure data to N8N webhook
        sendToN8NWebhook({
          action: 'lead_generation_failed',
          jobId: updatedJob.id,
          status: 'failed',
          userId,
          error: updatedJob.error_message || 'Unknown error',
          message: 'Lead generation failed'
        });
      }
      
      setCurrentJob({
        ...(updatedJob as LeadGenJob),
        status,
        progress: mergedProgress,
      });
      
      if (updatedJob.status === 'failed') {
        toast({
          title: "Lead generation failed",
          description: updatedJob.error_message || "An error occurred",
          variant: "destructive",
        });
      }
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
      });

    return () => {
      console.log('Cleaning up job subscription');
      supabase.removeChannel(jobChannel);
      // Clear completion timeout when subscription cleanup
      if (completionTimeoutRef.current) {
        clearTimeout(completionTimeoutRef.current);
        completionTimeoutRef.current = null;
      }
    };
  }, [jobIdForSubscription, toast, currentJob, userId]);

  // Subscribe to real-time updates for leads as soon as we have a jobId
  useEffect(() => {
    if (!jobIdForSubscription || !userId) return;

    console.log('Setting up real-time subscription for leads:', jobIdForSubscription);

    const handleNewLead = (lead: Lead) => {
      console.log('New lead received:', lead);
      console.log('Lead LinkedIn URLs:', {
        linkedin_url: lead.linkedin_url,
        organization_linkedin_url: lead.organization_linkedin_url,
        organization_url: lead.organization_url
      });
      
      // 🎯 Send new lead data to N8N webhook
      sendToN8NWebhook({
        action: 'new_lead_found',
        jobId: lead.job_id,
        leadData: {
          name: lead.full_name,
          title: lead.job_title,
          company: lead.company_name,
          linkedinUrl: lead.linkedin_url,
          companyLinkedinUrl: lead.organization_linkedin_url,
          companyUrl: lead.organization_url,
          industry: lead.industry,
          location: lead.location
        },
        message: 'New lead discovered'
      });
      
      setLeads(prev => [...prev, lead]);
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
      });

    return () => {
      console.log('Cleaning up leads subscription');
      supabase.removeChannel(leadsChannel);
    };
  }, [jobIdForSubscription, userId]);

  const startLeadGeneration = async (jobCriteria: any) => {
    if (!userId) {
      throw new Error('User must be authenticated to generate leads');
    }

    setLoading(true);
    setLeads([]); // Clear previous leads

    try {
      console.log('Starting lead generation with criteria:', jobCriteria);
      
      const response = await supabase.functions.invoke('trigger-lead-generation', {
        body: {
          jobCriteria,
          userId: userId
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      const { jobId } = response.data;
      console.log('Lead generation job started:', jobId);
      
      // 🎯 Send data to N8N webhook for testing (now with actual jobId)
      const webhookResult = await sendToN8NWebhook({
        action: 'lead_generation_started',
        jobId,
        userId,
        jobCriteria,
        message: 'Lead generation initiated from local development environment'
      });
      
      if (!webhookResult.success) {
        console.warn('N8N webhook failed:', webhookResult.error);
        // Don't throw error - continue with normal flow even if webhook fails
      }
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
    setShowingResults(false);
    
    // Clear any pending completion timeout
    if (completionTimeoutRef.current) {
      clearTimeout(completionTimeoutRef.current);
      completionTimeoutRef.current = null;
    }
    
    // Clear any simulation timeouts
    simulationTimeoutsRef.current.forEach((id) => clearTimeout(id));
    simulationTimeoutsRef.current = [];
    simulationActiveRef.current = false;
  };

  const restoreSearchData = (job: LeadGenJob, leadsData: Lead[]) => {
    console.log("Restoring search data:", { job, leadsData });
    setCurrentJob(job);
    setLeads(leadsData);
    setShowingResults(true);
    setJobIdForSubscription(job.id);
  };

  return {
    currentJob,
    leads,
    loading,
    showingResults,
    startLeadGeneration,
    resetJob,
    fetchLeads,
    restoreSearchData
  };
};