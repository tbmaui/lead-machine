import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, Globe, Linkedin, ArrowLeft } from "lucide-react";

interface LeadGenResultsProps {
  onNewSearch: () => void;
}

const LeadGenResults = ({ onNewSearch }: LeadGenResultsProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(true);

  const steps = [
    "Initializing search parameters...",
    "Connecting to data sources...",
    "Scanning company databases...",
    "Verifying contact information...",
    "Analyzing decision maker roles...",
    "Calculating lead scores...",
    "Generating final results..."
  ];

  useEffect(() => {
    if (isProcessing) {
      const progressSteps = steps.map(() => Math.random() * 15 + 5); // Random duration between 5-20%
      let totalProgress = 0;
      
      const runStep = (stepIndex: number) => {
        if (stepIndex >= steps.length) {
          setProgress(100);
          setTimeout(() => setIsProcessing(false), 500);
          return;
        }

        setCurrentStep(stepIndex);
        const stepDuration = progressSteps[stepIndex];
        const stepTime = (stepDuration / 100) * 3000; // Convert to milliseconds
        
        const interval = setInterval(() => {
          totalProgress += 1;
          setProgress(Math.min(totalProgress, (stepIndex + 1) * (100 / steps.length)));
        }, stepTime / stepDuration);

        setTimeout(() => {
          clearInterval(interval);
          totalProgress = (stepIndex + 1) * (100 / steps.length);
          setProgress(totalProgress);
          setTimeout(() => runStep(stepIndex + 1), 300);
        }, stepTime);
      };

      runStep(0);
    }
  }, [isProcessing]);

  const mockLeads = [
    {
      name: "Israel Espinoza",
      title: "Owner",
      company: "Alamo Drywall, Inc",
      address: "1749 Veterans Memorial Hwy, Austell, Georgia, 30106",
      phone: "+1 770-739-9671",
      email: "iespinoza@alamodrywall.com",
      website: "Website",
      linkedin: "LinkedIn",
      score: 5
    },
    {
      name: "Charlie Tobias", 
      title: "Owner",
      company: "Wildwood Development",
      address: "Atlanta, Georgia",
      phone: "+1 404-480-0819",
      email: "charlie@wildwoodlandscaping.com",
      website: "Website",
      linkedin: "LinkedIn", 
      score: 5
    },
    {
      name: "Julie Poirier",
      title: "Owner", 
      company: "Poirier Law Firm",
      address: "1100 Peachtree St NE, Atlanta, Georgia, 30309",
      phone: "+1 404-730-2000",
      email: "julie@poirierlawfirm.com",
      website: "Website",
      linkedin: "LinkedIn",
      score: 5
    },
    {
      name: "John Bellus",
      title: "Owner",
      company: "Stone & Bellus, P.C.",
      address: "6849 Peachtree Dunwoody Rd, Atlanta, Georgia, 30328-1608", 
      phone: "+1 770-390-9950",
      email: "john@stonebellus.com",
      website: "Website",
      linkedin: "LinkedIn",
      score: 5
    },
    {
      name: "Peter Jaraysi",
      title: "Owner",
      company: "Slam Dunk Attorney | Injury Lawyers",
      address: "2250 Satellite Blvd, Duluth, Georgia, 30097-4906",
      phone: "+1 404-951-3513", 
      email: "peter@jaraysislawfirm.com",
      website: "Website",
      linkedin: "LinkedIn",
      score: 5
    },
    {
      name: "Vicky Yarns",
      title: "Owner/Chiropractor",
      company: "Atlanta Spine Center", 
      address: "1375 Peachtree St NE, Atlanta, Georgia, 30309",
      phone: "+1 404-575-1300",
      email: "dr.yarns@mindspring.com",
      website: "Website", 
      linkedin: "LinkedIn",
      score: 5
    }
  ];

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
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>
            <div className="text-sm text-muted-foreground">
              {steps[currentStep]}
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
            <p className="text-muted-foreground mt-1">Found 39 leads</p>
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
                    <div className="text-3xl font-bold">79</div>
                    <div className="text-sm text-muted-foreground">Avg Score</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm">Score 5 (Owners/CEOs): 36</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm">Score 4 (CFOs/VPs/Presidents): 3</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span className="text-sm">Score 3 (Directors): 0</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="text-sm">Score 2 (Others): 0</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm">Score 1 (Entry Level): 0</span>
              </div>
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
                {mockLeads.map((lead, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="p-3">
                      <div className="font-medium">{lead.name}</div>
                      <Badge variant="secondary" className="mt-1 text-xs">
                        {lead.title}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="font-medium">{lead.company}</div>
                      <div className="text-sm text-muted-foreground">{lead.address}</div>
                    </td>
                    <td className="p-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3" />
                          <span className="text-blue-600">{lead.phone}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3" />
                          <span className="text-blue-600">{lead.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1 text-blue-600 text-sm">
                        <Globe className="h-3 w-3" />
                        {lead.website}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1 text-blue-600 text-sm">
                        <Linkedin className="h-3 w-3" />
                        {lead.linkedin}
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        Score {lead.score}<br/>(80)
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