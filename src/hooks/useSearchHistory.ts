import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SearchHistoryItem {
  id: string;
  job_criteria: any;
  total_leads_found: number | null;
  status: string;
  created_at: string;
  completed_at: string | null;
}

export const useSearchHistory = (userId: string | undefined) => {
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchSearchHistory = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('lead_gen_jobs')
        .select('id, job_criteria, total_leads_found, status, created_at, completed_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10); // Get last 10 searches

      if (error) throw error;

      setSearchHistory(data || []);
    } catch (error) {
      console.error('Error fetching search history:', error);
      toast({
        title: "Error fetching search history",
        description: "Failed to load your past searches",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const restoreSearch = async (jobId: string) => {
    try {
      // Fetch the complete job data including leads
      const { data: jobData, error: jobError } = await supabase
        .from('lead_gen_jobs')
        .select('*')
        .eq('id', jobId)
        .single();

      if (jobError) throw jobError;

      const { data: leadsData, error: leadsError } = await supabase
        .from('leads')
        .select('*')
        .eq('job_id', jobId)
        .order('created_at', { ascending: true });

      if (leadsError) throw leadsError;

      return {
        job: jobData,
        leads: leadsData || []
      };
    } catch (error) {
      console.error('Error restoring search:', error);
      toast({
        title: "Error restoring search",
        description: "Failed to restore the selected search",
        variant: "destructive",
      });
      return null;
    }
  };

  const formatSearchCriteria = (criteria: any) => {
    if (!criteria) return "Unknown search";
    
    const parts: string[] = [];
    
    if (criteria.targetLocation) {
      parts.push(criteria.targetLocation);
    }
    
    if (criteria.selectedIndustries && criteria.selectedIndustries.length > 0) {
      parts.push(`${criteria.selectedIndustries.length} industr${criteria.selectedIndustries.length > 1 ? 'ies' : 'y'}`);
    }
    
    if (criteria.leadCount && criteria.leadCount[0]) {
      parts.push(`${criteria.leadCount[0]} leads`);
    }

    return parts.length > 0 ? parts.join(', ') : "Custom search";
  };

  useEffect(() => {
    fetchSearchHistory();
  }, [userId]);

  return {
    searchHistory,
    loading,
    fetchSearchHistory,
    restoreSearch,
    formatSearchCriteria
  };
};