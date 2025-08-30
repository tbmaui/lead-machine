import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatusBar from "@/components/StatusBar";
import { ArrowLeft, List } from "lucide-react";
import { LeadGenJob, Lead } from "@/hooks/useLeadGeneration";
import LeadGenStats from "./LeadGenStats";
import ExportButtons from "./ExportButtons";
import LeadsTable from "./LeadsTable";
import LeadsSummaryChart from "./LeadsSummaryChart";
import SearchCriteriaDisplay from "./SearchCriteriaDisplay";
import { SimpleLoadingAnimation } from "@/components/ui/simple-loading-animation";

interface LeadGenResultsProps {
  job: LeadGenJob;
  leads: Lead[];
  onNewSearch: () => void;
  showingResults?: boolean;
}

const LeadGenResults = ({ job, leads, onNewSearch, showingResults }: LeadGenResultsProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  // Show processing view for all non-completed states  
  const isProcessing = job.status === 'pending' || job.status === 'processing' || job.status === 'searching' || job.status === 'enriching' || job.status === 'validating' || job.status === 'finalizing';
  
  console.log("LeadGenResults render:", { 
    jobStatus: job.status, 
    jobProgress: job.progress, 
    isProcessing, 
    showingResults,
    leadsCount: leads.length 
  });

  const steps = [
    "Initializing search parameters...",
    "Searching for companies...", 
    "Finding decision makers...",
    "Enriching contact data...",
    "Verifying information...",
    "Calculating lead scores...",
    "Finalizing results..."
  ];

  const getStepFromStatus = (status: string, progress: number) => {
    if (status === 'searching') return "Searching for companies and contacts...";
    if (status === 'enriching') return "Enriching and verifying contact data...";
    if (status === 'validating') return "Validating results and de-duplicating...";
    if (status === 'finalizing') return "Finalizing results and preparing output...";
    if (status === 'processing') return steps[Math.min(Math.floor((progress / 100) * steps.length), steps.length - 1)];
    return steps[0];
  };

  useEffect(() => {
    if (isProcessing) {
      const currentStepIndex = Math.min(
        Math.floor((job.progress / 100) * steps.length), 
        steps.length - 1
      );
      setCurrentStep(currentStepIndex);
    }
  }, [job.progress, job.status, isProcessing]);

  // Show actual leads from backend, not mock data
  const displayLeads = leads.length > 0 ? leads : [];

  if (isProcessing) {
    // Determine animation intensity based on job status
    const getAnimationIntensity = (): "low" | "medium" | "high" => {
      if (job.status === 'searching' || job.status === 'enriching') return 'high';
      if (job.status === 'processing' || job.status === 'validating') return 'medium';
      return 'low';
    };

    return (
      <div className="relative space-y-6 min-h-[400px] animate-in fade-in duration-700">
        {/* Simple loading animation - EXTENDED ABOVE */}
        <div className="fixed top-[20vh] left-0 right-0 bottom-0 z-0">
          <SimpleLoadingAnimation />
        </div>
        
        {/* Content with relative positioning */}
        <div className="relative z-20 space-y-6">
          <Card className="border-blue-200/50 bg-blue-50/20 backdrop-blur-sm animate-in slide-in-from-top-4 fade-in duration-500 delay-150">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">⏳</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1" style={{ color: '#f36334' }}>Processing Your Lead Search</h3>
                  <p className="text-sm" style={{ color: '#f36334' }}>
                    This comprehensive process can take up to 5 minutes as we search, verify, and enrich your leads across multiple platforms. Please hang tight - it's worth the wait for high-quality results!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background/30 backdrop-blur-sm border-2 border-opacity-50 animate-in slide-in-from-top-4 fade-in duration-500 delay-300">
            <CardHeader>
              <CardTitle>Processing Your Request</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <StatusBar status={job.status} progress={job.progress} steps={steps} />
              <div className="flex gap-2 mt-4">
                <Button variant="outline" onClick={onNewSearch} className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Cancel & New Search
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Persist StatusBar post-completion */}
      {job.status !== 'processing' && job.status !== 'pending' && (
        <Card>
          <CardHeader>
            <CardTitle>Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <StatusBar status={job.status} progress={job.progress} steps={steps} />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <List className="h-5 w-5 text-gray-600" />
            <CardTitle className="text-xl font-semibold">Generated Lead List</CardTitle>
          </div>
          <ExportButtons leads={displayLeads} />
        </CardHeader>
        <CardContent className="space-y-6">
          <LeadGenStats leads={displayLeads} />
          <LeadsSummaryChart leads={displayLeads} />
          {job.job_criteria && <SearchCriteriaDisplay criteria={job.job_criteria} />}
          <LeadsTable leads={displayLeads} />
        </CardContent>
      </Card>
      
      <div className="flex justify-center">
        <Button onClick={onNewSearch} variant="outline" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          New Search
        </Button>
      </div>
    </div>
  );
};

export default LeadGenResults;