import { useState } from "react";
// Removed unused Card imports - using neu-form-section instead
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CustomCheckbox } from "@/components/ui/custom-checkbox";
import { Slider } from "@/components/ui/slider";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useLeadGeneration } from "@/hooks/useLeadGeneration";
import LeadGenResults from "./LeadGenResults";

interface LeadGenFormProps {
  userId: string;
}

const LeadGenForm = ({ userId }: LeadGenFormProps) => {
  const { currentJob, leads, loading, startLeadGeneration, resetJob } = useLeadGeneration(userId);
  
  const jobTitleOptions = ["Owner", "CEO", "CFO", "VP of Finance", "President", "Director"];
  const industryOptions = [
    "Agriculture", 
    "Auto Repair & Maintenance", 
    "Construction", 
    "Construction & Artisans",
    "Consumer Services", 
    "Healthcare", 
    "Household", 
    "Legal Services",
    "Manufacturing", 
    "Mortgage & Finance", 
    "Non-Profit", 
    "Printing & Marketing", 
    "Production & Entertainment", 
    "Professional Services", 
    "Property Mgmt & RE Invest", 
    "Restaurant", 
    "Retail & eCommerce", 
    "Specialty Industries", 
    "Moving & Storage", 
    "Trucking & Logistics", 
    "Trusts & Holding Co."
  ];
  const companySizeOptions = ["1-50", "51-200", "201-500", "501-1000"];
  
  const [targetLocation, setTargetLocation] = useState("");
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedCompanySizes, setSelectedCompanySizes] = useState<string[]>(["1-50"]);
  const [selectedJobTitles, setSelectedJobTitles] = useState<string[]>(["Owner", "CEO", "CFO", "VP of Finance", "President", "Director"]);
  const [leadCount, setLeadCount] = useState([100]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleJobTitleToggle = (title: string) => {
    setSelectedJobTitles(prev => 
      prev.includes(title) 
        ? prev.filter(t => t !== title)
        : [...prev, title]
    );
  };

  const handleIndustryToggle = (industry: string) => {
    setSelectedIndustries(prev => 
      prev.includes(industry) 
        ? prev.filter(i => i !== industry)
        : [...prev, industry]
    );
  };

  const handleCompanySizeToggle = (size: string) => {
    setSelectedCompanySizes(prev => 
      prev.includes(size) 
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  const handleGenerate = async () => {
    const jobCriteria = {
      targetLocation,
      industries: selectedIndustries,
      companySizes: selectedCompanySizes,
      jobTitles: selectedJobTitles,
      leadCount: leadCount[0]
    };

    await startLeadGeneration(jobCriteria);
  };

  const handleNewSearch = () => {
    resetJob();
  };

  if (currentJob) {
    return <LeadGenResults job={currentJob} leads={leads} onNewSearch={handleNewSearch} />;
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="neu-form-section neu-gradient-stroke-thick">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-3 bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">Generate Your Leads</h2>
        <p className="text-base text-muted-foreground">
          Discover verified decision makers in your target market with precision targeting
        </p>
      </div>
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-3">
            <label htmlFor="target-location" className="neu-label">
              <span className="neu-field-indicator bg-red-500"></span>
              Target Location
            </label>
            <Input
              id="target-location"
              value={targetLocation}
              onChange={(e) => setTargetLocation(e.target.value)}
              placeholder="Enter city, state, USA"
              className="neu-input w-full text-base border-0"
              aria-required="true"
              aria-describedby="target-location-hint"
            />
            <div id="target-location-hint" className="sr-only">
              Enter the city and state where you want to find leads
            </div>
          </div>

          <div className="space-y-3">
            <label id="industry-label" className="neu-label">
              <span className="neu-field-indicator bg-blue-500"></span>
              Industry
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="neu-button w-full justify-between text-left font-normal border-0"
                  aria-labelledby="industry-label"
                  aria-describedby="industry-description"
                  aria-expanded="false"
                >
                  {selectedIndustries.length > 0 
                    ? `${selectedIndustries.length} sector${selectedIndustries.length > 1 ? 's' : ''} selected`
                    : "Please choose 1 or all"
                  }
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="neu-popover w-full p-0 z-50" align="start">
                <div className="p-4 space-y-3">
                  {industryOptions.map((industry) => (
                    <div key={industry} className="flex items-center space-x-3">
                      <CustomCheckbox
                        id={industry}
                        checked={selectedIndustries.includes(industry)}
                        onCheckedChange={() => handleIndustryToggle(industry)}
                      />
                      <label
                        htmlFor={industry}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {industry}
                      </label>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            <div id="industry-description" className="sr-only">
              Select one or more industries to target for lead generation
            </div>
          </div>

          <div className="space-y-3">
            <label className="neu-label">
              <span className="neu-field-indicator bg-purple-500"></span>
              Company Size (SMB Focus)
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="neu-button w-full justify-between text-left font-normal border-0"
                >
                  {selectedCompanySizes.length > 0 
                    ? `${selectedCompanySizes.length} size${selectedCompanySizes.length > 1 ? 's' : ''} selected`
                    : "Select company sizes"
                  }
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="neu-popover w-full p-0 z-50" align="start">
                <div className="p-4 space-y-3">
                  {companySizeOptions.map((size) => (
                    <div key={size} className="flex items-center space-x-3">
                      <CustomCheckbox
                        id={size}
                        checked={selectedCompanySizes.includes(size)}
                        onCheckedChange={() => handleCompanySizeToggle(size)}
                      />
                      <label
                        htmlFor={size}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {size}
                      </label>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="space-y-3">
          <label className="neu-label">
            <span className="neu-field-indicator bg-green-500"></span>
            Target Job Titles
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="neu-button w-full justify-between text-left font-normal border-0"
              >
                {selectedJobTitles.length > 0 
                  ? `${selectedJobTitles.length} title${selectedJobTitles.length > 1 ? 's' : ''} selected`
                  : "Select job titles"
                }
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0 z-50" align="start">
              <div className="p-4 space-y-3">
                {jobTitleOptions.map((title) => (
                  <div key={title} className="flex items-center space-x-3">
                    <CustomCheckbox
                      id={title}
                      checked={selectedJobTitles.includes(title)}
                      onCheckedChange={() => handleJobTitleToggle(title)}
                    />
                    <label
                      htmlFor={title}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {title}
                    </label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-6">
          <label className="neu-label">
            <span className="neu-field-indicator bg-orange-500"></span>
            Number of Leads to Generate
          </label>
          <div className="space-y-4">
            <Slider
              value={leadCount}
              onValueChange={setLeadCount}
              max={1000}
              min={100}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>100</span>
              <span className="font-medium text-xl text-foreground neu-flat px-3 py-1 rounded-lg">
                {leadCount[0]}
              </span>
              <span className="ml-auto">1000</span>
            </div>
          </div>
        </div>


        <Button 
          onClick={handleGenerate}
          className="neu-button-primary w-full font-medium py-6 text-lg"
          size="lg"
          disabled={loading}
        >
          {loading ? "Starting Generation..." : "🚀 Generate Leads"}
        </Button>
      </div>
    </div>
    </div>
  );
};

export default LeadGenForm;