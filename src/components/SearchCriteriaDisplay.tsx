import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SearchCriteriaDisplayProps {
  criteria: {
    targetLocation: string;
    industries: string[];
    companySizes: string[];
    jobTitles: string[];
    leadCount: number;
  };
}

const SearchCriteriaDisplay = ({ criteria }: SearchCriteriaDisplayProps) => {
  const { targetLocation, industries, companySizes, jobTitles, leadCount } = criteria;

  return (
    <Card className="neu-form-section neu-gradient-stroke-thick">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-foreground bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
          Search Parameters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <h4 className="font-semibold text-foreground mb-2">Target Location</h4>
            <p className="text-muted-foreground bg-muted/30 rounded-lg p-2">
              {targetLocation || "Not specified"}
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-2">Lead Count</h4>
            <p className="text-muted-foreground bg-muted/30 rounded-lg p-2">
              {leadCount} leads requested
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-2">Company Sizes</h4>
            <div className="text-muted-foreground bg-muted/30 rounded-lg p-2">
              {companySizes.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {companySizes.map((size, index) => (
                    <span key={index} className="inline-block bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                      {size}
                    </span>
                  ))}
                </div>
              ) : (
                <span>All sizes</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-foreground mb-2">Industries</h4>
            <div className="text-muted-foreground bg-muted/30 rounded-lg p-2">
              {industries.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {industries.map((industry, index) => (
                    <span key={index} className="inline-block bg-secondary/10 text-secondary-foreground px-2 py-1 rounded text-xs">
                      {industry}
                    </span>
                  ))}
                </div>
              ) : (
                <span>All industries</span>
              )}
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-2">Job Titles</h4>
            <div className="text-muted-foreground bg-muted/30 rounded-lg p-2">
              {jobTitles.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {jobTitles.map((title, index) => (
                    <span key={index} className="inline-block bg-accent/10 text-accent-foreground px-2 py-1 rounded text-xs">
                      {title}
                    </span>
                  ))}
                </div>
              ) : (
                <span>All job titles</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchCriteriaDisplay;