import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import LeadGenForm, { LeadGenFormRef } from '@/components/LeadGenForm';
import { SearchHistory } from '@/components/SearchHistory';
import { decodeSearchParams, SearchCriteria } from '@/lib/url-params';
import { SearchPageLayout } from '@/components/SearchPageLayout';
import { SearchProgressIndicator } from '@/components/SearchProgressIndicator';
import { SearchActionBar } from '@/components/SearchActionBar';
import { useLeadGeneration } from '@/hooks/useLeadGeneration';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { WebhookTester } from '@/components/WebhookTester';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

interface SearchProps {
  restoredSearch?: {job: any, leads: any[]} | null;
  onSearchRestored?: () => void;
}

const Search = ({ restoredSearch: propsRestoredSearch, onSearchRestored: propsOnSearchRestored }: SearchProps = {}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [restoredSearch, setRestoredSearch] = useState<{job: unknown, leads: unknown[]} | null>(null);
  const [urlRestoredCriteria, setUrlRestoredCriteria] = useState<Partial<SearchCriteria> | null>(null);
  const [showSearchHistoryModal, setShowSearchHistoryModal] = useState(false);
  const [showWebhookTester, setShowWebhookTester] = useState(false);
  const formRef = useRef<LeadGenFormRef>(null);

  // Handle restored search from dropdown
  useEffect(() => {
    if (propsRestoredSearch) {
      setRestoredSearch(propsRestoredSearch);
    }
  }, [propsRestoredSearch]);

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
    if (propsOnSearchRestored) {
      propsOnSearchRestored();
    }
  };

  const handleClearForm = () => {
    if (formRef.current) {
      formRef.current.clearForm();
    }
  };

  const handleLoadPrevious = () => {
    console.log('🔍 Search History button clicked - opening modal');
    setShowSearchHistoryModal(true);
  };

  const handleRestoreFromModal = (job: any, leads: any[]) => {
    setRestoredSearch({ job, leads });
    setShowSearchHistoryModal(false);
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
        onLoadPrevious={handleLoadPrevious}
        onClearForm={handleClearForm}
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
        ref={formRef}
        userId={user.id}
        restoredSearch={restoredSearch}
        onSearchRestored={handleSearchRestored}
        urlRestoredCriteria={urlRestoredCriteria}
      />

      {/* Search History Modal */}
      <Dialog open={showSearchHistoryModal} onOpenChange={setShowSearchHistoryModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Search History</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <SearchHistory 
              onRestoreSearch={handleRestoreFromModal}
              onClose={() => setShowSearchHistoryModal(false)}
            />
            <div className="flex justify-end pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => setShowSearchHistoryModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Webhook Tester Modal - Only show in development */}
      {process.env.NODE_ENV === 'development' && (
        <Dialog open={showWebhookTester} onOpenChange={setShowWebhookTester}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>N8N Webhook Tester</DialogTitle>
            </DialogHeader>
            <WebhookTester />
          </DialogContent>
        </Dialog>
      )}

      {/* Floating Webhook Test Button - Development Only */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 z-50">
          <Button
            onClick={() => setShowWebhookTester(true)}
            className="neu-button-primary shadow-lg"
            size="lg"
          >
            <Send className="w-4 h-4 mr-2" />
            Test N8N Webhook
          </Button>
        </div>
      )}
    </SearchPageLayout>
  );
};

export default Search;