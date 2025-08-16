import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { ChevronDown, ChevronUp } from "lucide-react";
import LeadGenResults from "./LeadGenResults";

const LeadGenForm = () => {
  const jobTitleOptions = ["Owner", "CEO", "CFO", "VP of Finance", "President", "Director"];
  const [targetLocation, setTargetLocation] = useState("atlanta");
  const [industry, setIndustry] = useState("all");
  const [companySize, setCompanySize] = useState("1-50");
  const [selectedJobTitles, setSelectedJobTitles] = useState<string[]>(["Owner", "CEO"]);
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

  const handleGenerate = () => {
    // This will be connected to N8n webhook later
    console.log("Generating leads with:", {
      targetLocation,
      industry,
      companySize,
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
        <p className="text-sm text-muted-foreground">
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
            <Select value={targetLocation} onValueChange={setTargetLocation}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="atlanta">Atlanta, Georgia</SelectItem>
                <SelectItem value="austin">Austin, Texas</SelectItem>
                <SelectItem value="chicago">Chicago, Illinois</SelectItem>
                <SelectItem value="miami">Miami, Florida</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Industry Sector
            </label>
            <Select value={industry} onValueChange={setIndustry}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="manufacturing">Manufacturing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              Company Size (SMB Focus)
            </label>
            <Select value={companySize} onValueChange={setCompanySize}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-50">1-50</SelectItem>
                <SelectItem value="51-200">51-200</SelectItem>
                <SelectItem value="201-500">201-500</SelectItem>
                <SelectItem value="501-1000">501-1000</SelectItem>
              </SelectContent>
            </Select>
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