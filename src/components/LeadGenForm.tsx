import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { ChevronDown, ChevronUp } from "lucide-react";
import LeadGenResults from "./LeadGenResults";

const LeadGenForm = () => {
  const jobTitleOptions = ["Owner", "CEO", "CFO", "VP of Finance", "President", "Director"];
  const industryOptions = ["Healthcare", "Legal Services", "Construction"];
  const companySizeOptions = ["1-50", "51-200", "201-500", "501-1000"];
  
  const [targetLocation, setTargetLocation] = useState("");
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedCompanySizes, setSelectedCompanySizes] = useState<string[]>(["1-50"]);
  const [selectedJobTitles, setSelectedJobTitles] = useState<string[]>(["Owner", "CEO", "CFO", "VP of Finance", "President", "Director"]);
  const [leadCount, setLeadCount] = useState([100]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showResults, setShowResults] = useState(false);

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

  const handleGenerate = () => {
    // This will be connected to N8n webhook later
    console.log("Generating leads with:", {
      targetLocation,
      industries: selectedIndustries,
      companySizes: selectedCompanySizes,
      jobTitles: selectedJobTitles,
      leadCount: leadCount[0]
    });
    setShowResults(true);
  };

  const handleNewSearch = () => {
    setShowResults(false);
  };

  if (showResults) {
    return <LeadGenResults onNewSearch={handleNewSearch} />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Generate Your Leads</CardTitle>
        <p className="text-sm text-muted-foreground">{/* Force refresh */}
          Discover verified decision makers in your target market
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              Target Location
            </label>
            <Input
              value={targetLocation}
              onChange={(e) => setTargetLocation(e.target.value)}
              placeholder="city, state, USA"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Industry
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between text-left font-normal"
                >
                  {selectedIndustries.length > 0 
                    ? `${selectedIndustries.length} sector${selectedIndustries.length > 1 ? 's' : ''} selected`
                    : "Please choose 1 or all"
                  }
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0 bg-popover border border-border z-50" align="start">
                <div className="p-4 space-y-2">
                  {industryOptions.map((industry) => (
                    <div key={industry} className="flex items-center space-x-2">
                      <Checkbox
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
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              Company Size (SMB Focus)
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between text-left font-normal"
                >
                  {selectedCompanySizes.length > 0 
                    ? `${selectedCompanySizes.length} size${selectedCompanySizes.length > 1 ? 's' : ''} selected`
                    : "Select company sizes"
                  }
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0 bg-popover border border-border z-50" align="start">
                <div className="p-4 space-y-2">
                  {companySizeOptions.map((size) => (
                    <div key={size} className="flex items-center space-x-2">
                      <Checkbox
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

        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Target Job Titles
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between text-left font-normal"
              >
                {selectedJobTitles.length > 0 
                  ? `${selectedJobTitles.length} title${selectedJobTitles.length > 1 ? 's' : ''} selected`
                  : "Select job titles"
                }
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0 bg-popover border border-border z-50" align="start">
              <div className="p-4 space-y-2">
                {jobTitleOptions.map((title) => (
                  <div key={title} className="flex items-center space-x-2">
                    <Checkbox
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

        <div className="space-y-4">
          <label className="text-sm font-medium"># Number of Leads to Generate</label>
          <div className="space-y-2">
            <Slider
              value={leadCount}
              onValueChange={setLeadCount}
              max={1000}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1</span>
              <span className="font-medium text-lg text-foreground">{leadCount[0]}</span>
              <span>500</span>
              <span className="ml-auto">1000</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            Advanced Targeting Options
          </button>
        </div>

        <Button 
          onClick={handleGenerate}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3"
          size="lg"
        >
          Generate Leads
        </Button>
      </CardContent>
    </Card>
  );
};

export default LeadGenForm;