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

  // Check for demo mode
  const isDemoMode = searchParams.get('demo') === 'true';

  // Get lead generation state to determine workflow step
  const { currentJob, leads } = useLeadGeneration(user?.id || 'demo-user');

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

  // Show loading if no user yet (during auth check) - except in demo mode
  if (!user && !isDemoMode) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <SearchPageLayout 
      currentStep={currentStep}
      isDemoMode={isDemoMode}
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
        onLoadDemo={() => navigate('/search?demo=true')}
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

      {/* Demo mode banner */}
      {isDemoMode && currentStep === 'setup' && (
        <div className="neu-card neu-gradient-stroke p-4 mb-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🎯</span>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">Demo Mode Active</h3>
              <p className="text-sm text-muted-foreground">
                We've pre-filled search criteria to demonstrate lead discovery capabilities. 
                Feel free to modify the parameters or click "Start Lead Generation" to see sample results.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main lead generation form */}
      <LeadGenForm 
        userId={user?.id || 'demo-user'}
        restoredSearch={restoredSearch}
        onSearchRestored={handleSearchRestored}
        demoMode={isDemoMode}
        urlRestoredCriteria={urlRestoredCriteria}
      />
    </SearchPageLayout>
  );
};

export default Search;