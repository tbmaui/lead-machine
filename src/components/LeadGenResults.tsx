import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, List } from "lucide-react";
import { LeadGenJob, Lead } from "@/hooks/useLeadGeneration";
import LeadGenStats from "./LeadGenStats";
import ExportButtons from "./ExportButtons";
import LeadsTable from "./LeadsTable";

interface LeadGenResultsProps {
  job: LeadGenJob;
  leads: Lead[];
  onNewSearch: () => void;
}

const LeadGenResults = ({ job, leads, onNewSearch }: LeadGenResultsProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const isProcessing = job.status === 'pending' || job.status === 'processing' || job.status === 'searching' || job.status === 'enriching';

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
    return (
      <div className="space-y-6">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">i</span>
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">How to Generate Quality Leads</h3>
                <p className="text-sm text-blue-700">
                  Choose your target location and industry to discover verified decision makers. This demo uses real, embedded data for Atlanta and Austin.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Processing Your Request</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <span>{job.progress}%</span>
              </div>
              <Progress value={job.progress} className="h-3" />
            </div>
            <div className="text-sm text-muted-foreground">
              {job.status === 'failed' ? `Error: ${job.error_message}` : getStepFromStatus(job.status, job.progress)}
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" onClick={onNewSearch} className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Cancel & New Search
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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