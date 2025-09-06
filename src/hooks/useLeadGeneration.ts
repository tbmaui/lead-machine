import { useState, useEffect, useRef } from 'react';
import { statusToProgress } from '@/lib/status';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { saveSearchState, loadSearchState, clearSearchState, STORAGE_KEYS } from '@/lib/session-storage';

// N8N webhooks are handled entirely by the edge function - no frontend calls needed

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

// Global flag to prevent multiple simultaneous job creations
let isJobCreationInProgress = false;

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
  const lastCallTimeRef = useRef<number>(0);
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
      
      setCurrentJob({
        ...(updatedJob as LeadGenJob),
        status: updatedJob.status || 'processing',
        progress: updatedJob.progress || statusToProgress(updatedJob.status || 'processing'),
      });
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
  }, [jobIdForSubscription, toast, userId]);

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

    const now = Date.now();
    const timeSinceLastCall = now - lastCallTimeRef.current;
    
    // Prevent multiple simultaneous calls
    if (loading || isJobCreationInProgress || currentJob) {
      console.log(`⚠️ Lead generation blocked - loading:${loading}, globalFlag:${isJobCreationInProgress}, hasJob:${!!currentJob}`);
      return;
    }

    // Set global flag and timestamp
    isJobCreationInProgress = true;
    lastCallTimeRef.current = now;
    setLoading(true);
    
    setLeads([]); // Clear previous leads

    try {
      
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
      
      // Note: N8N webhook is called by the edge function, no need to call again from frontend
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
      isJobCreationInProgress = false;
      console.log('🏁 Lead generation attempt completed - clearing flags');
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
    console.log('🔄 Resetting job state');
    setCurrentJob(null);
    setLeads([]);
    setJobIdForSubscription(null);
    setShowingResults(false);
    
    // Clear global state  
    isJobCreationInProgress = false;
    
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