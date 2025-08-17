import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, Globe, Linkedin, ArrowLeft } from "lucide-react";
import { LeadGenJob, Lead } from "@/hooks/useLeadGeneration";

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
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">Generated Leads</CardTitle>
            <p className="text-muted-foreground mt-1">Found {leads.length} leads</p>
          </div>
          <Button onClick={onNewSearch} className="bg-blue-600 hover:bg-blue-700">
            New Search
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="flex items-center justify-center">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    stroke="currentColor"
                    strokeWidth="20"
                    fill="none"
                    className="text-gray-200"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    stroke="currentColor"
                    strokeWidth="20"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 80}`}
                    strokeDashoffset={`${2 * Math.PI * 80 * (1 - 0.85)}`}
                    className="text-green-500"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold">
                      {displayLeads.length > 0 ? Math.round(displayLeads.reduce((sum, lead) => sum + (lead.score || 0), 0) / displayLeads.length) : 0}
                    </div>
                    <div className="text-sm text-muted-foreground">Avg Score</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map(score => {
                const count = displayLeads.filter(lead => lead.score === score).length;
                const colors = ['bg-green-500', 'bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-red-500'];
                const labels = ['(Owners/CEOs)', '(CFOs/VPs/Presidents)', '(Directors)', '(Others)', '(Entry Level)'];
                return (
                  <div key={score} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${colors[5 - score]}`}></div>
                    <span className="text-sm">Score {score} {labels[5 - score]}: {count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Name<br/>Title</th>
                  <th className="text-left p-3 font-medium">Organization Name<br/>Address</th>
                  <th className="text-left p-3 font-medium">Contact Information</th>
                  <th className="text-left p-3 font-medium">Company<br/>Website</th>
                  <th className="text-left p-3 font-medium">Company<br/>LinkedIn</th>
                  <th className="text-left p-3 font-medium">Score</th>
                </tr>
              </thead>
              <tbody>
                {displayLeads.map((lead, index) => (
                <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="p-3">
                      <div className="font-medium text-lg">{lead.name}</div>
                      {lead.title && (
                        <div className="text-sm text-muted-foreground mt-1">{lead.title}</div>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="font-medium">
                        {lead.company || 
                         (lead.additional_data as any)?.company ||
                         (lead.additional_data as any)?.Company ||
                         'N/A'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {lead.location || 
                         (lead.additional_data as any)?.location ||
                         (lead.additional_data as any)?.city ||
                         (lead.additional_data as any)?.state ||
                         'N/A'}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="space-y-1">
                        {lead.phone && (
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3" />
                            <span className="text-blue-600">{lead.phone}</span>
                          </div>
                        )}
                        {lead.email && (
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3" />
                            <span className="text-blue-600">{lead.email}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1 text-blue-600 text-sm">
                        <Globe className="h-3 w-3" />
                        Website
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1 text-blue-600 text-sm">
                        <Linkedin className="h-3 w-3" />
                        {lead.linkedin_url ? 'LinkedIn' : 'N/A'}
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        Score {lead.score || 0}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadGenResults;