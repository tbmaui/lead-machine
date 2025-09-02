import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import LeadGenForm from '@/components/LeadGenForm';
import { decodeSearchParams, SearchCriteria } from '@/lib/url-params';
import { SearchPageLayout } from '@/components/SearchPageLayout';
import { SearchProgressIndicator } from '@/components/SearchProgressIndicator';
import { SearchActionBar } from '@/components/SearchActionBar';
import { useLeadGeneration } from '@/hooks/useLeadGeneration';

const Search = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [restoredSearch, setRestoredSearch] = useState<{job: unknown, leads: unknown[]} | null>(null);
  const [urlRestoredCriteria, setUrlRestoredCriteria] = useState<Partial<SearchCriteria> | null>(null);

  // Get lead generation state to determine workflow step
  const { currentJob, leads } = useLeadGeneration(user?.id);

  // Determine current workflow step
  const getCurrentStep = (): 'setup' | 'searching' | 'results' => {
    if (currentJob) {
      const status = currentJob.status;
      if (['pending', 'processing', 'searching', 'enriching', 'validating', 'finalizing'].includes(status)) {
        return 'searching';
      } else if (status === 'completed' && leads.length > 0) {
        return 'results';
      }
    }
    return 'setup';
  };

  const currentStep = getCurrentStep();

  // Restore search criteria from URL on mount
  useEffect(() => {
    try {
      const criteria = decodeSearchParams(searchParams);
      if (Object.keys(criteria).length > 0) {
        setUrlRestoredCriteria(criteria);
      }
    } catch (error) {
      console.warn('Error decoding URL parameters:', error);
    }
  }, [searchParams]);

  // ProtectedRoute handles authentication - no need for additional check

  const handleSearchRestored = () => {
    setRestoredSearch(null);
  };

  // Show loading if no user yet (during auth check)
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <SearchPageLayout 
      currentStep={currentStep}
      showBackNav={true}
    >
      {/* Progress indicator for active searches */}
      {currentStep === 'searching' && currentJob && (
        <SearchProgressIndicator 
          currentStatus={currentJob.status}
          progress={currentJob.progress || 0}
          showTimeEstimates={true}
        />
      )}

      {/* Context-aware action bar */}
      <SearchActionBar 
        currentStep={currentStep}
        onLoadPrevious={() => {/* TODO: Implement load previous search */}}
        onClearForm={() => {/* TODO: Implement clear form */}}
        onPauseSearch={() => {/* TODO: Implement pause search */}}
        onCancelSearch={() => {/* TODO: Implement cancel search */}}
        onExportCSV={() => {/* TODO: Implement export CSV */}}
        onRefineSearch={() => {/* TODO: Implement refine search */}}
        onNewSearch={() => navigate('/search')}
        isSearching={currentJob?.status ? ['pending', 'processing', 'searching', 'enriching'].includes(currentJob.status) : false}
        canPause={false}
      />

      {/* Main lead generation form */}
      <LeadGenForm 
        userId={user.id}
        restoredSearch={restoredSearch}
        onSearchRestored={handleSearchRestored}
        urlRestoredCriteria={urlRestoredCriteria}
      />
    </SearchPageLayout>
  );
};

export default Search;