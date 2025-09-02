import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import LeadGenForm from '@/components/LeadGenForm';
import { decodeSearchParams, SearchCriteria } from '@/lib/url-params';

const Search = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [restoredSearch, setRestoredSearch] = useState<{job: unknown, leads: unknown[]} | null>(null);
  const [urlRestoredCriteria, setUrlRestoredCriteria] = useState<Partial<SearchCriteria> | null>(null);

  // Check for demo mode
  const isDemoMode = searchParams.get('demo') === 'true';

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

  // Handle authentication check
  useEffect(() => {
    if (!user) {
      // User will be redirected by ProtectedRoute, but this provides additional safety
      navigate('/login');
    }
  }, [user, navigate]);

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
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
                aria-label="Back to home"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Lead Generation</h1>
                <p className="text-sm text-muted-foreground">Find and enrich your target prospects</p>
              </div>
            </div>
            {isDemoMode && (
              <div className="neu-element neu-green px-4 py-2 text-sm font-medium rounded-md">
                <span className="text-primary">✨ Demo Mode</span>
                <span className="text-muted-foreground ml-2">Preview with sample data</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {isDemoMode && (
          <div className="neu-card neu-gradient-stroke p-4 mb-6 max-w-4xl mx-auto">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🎯</span>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">Demo Mode Active</h3>
                <p className="text-sm text-muted-foreground">
                  We've pre-filled search criteria to demonstrate our lead discovery capabilities. 
                  Feel free to modify the parameters or click "Start Lead Generation" to see sample results.
                </p>
              </div>
            </div>
          </div>
        )}
        <LeadGenForm 
          userId={user.id}
          restoredSearch={restoredSearch}
          onSearchRestored={handleSearchRestored}
          demoMode={isDemoMode}
          urlRestoredCriteria={urlRestoredCriteria}
        />
      </main>
    </div>
  );
};

export default Search;