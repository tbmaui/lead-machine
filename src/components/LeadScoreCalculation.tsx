import { Users, Building2, Database, Brain, TrendingUp } from "lucide-react";

const LeadScoreCalculation = () => {
  return (
    <div className="neu-card neu-gradient-stroke p-8">
      <h3 className="text-lg font-semibold mb-6">How Lead Scores Are Calculated</h3>
      
      <div className="space-y-6">
        {/* Contact Quality */}
        <div className="flex items-start gap-3">
          <Users className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
          <div className="flex-1">
            <div className="font-medium text-sm mb-1">Contact Quality (40%)</div>
            <div className="text-xs text-muted-foreground">
              Title level (C-Level = 25pts, Director = 20pts) + Contact completeness (Email+Phone = 15pts)
            </div>
          </div>
        </div>

        {/* Company Attributes */}
        <div className="flex items-start gap-3">
          <Building2 className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
          <div className="flex-1">
            <div className="font-medium text-sm mb-1">Company Attributes (45%)</div>
            <div className="text-xs text-muted-foreground">
              Company size (SMB = 20pts) + Industry relevance (High priority = 15pts) + Growth indicators (Recent funding = 10pts)
            </div>
          </div>
        </div>

        {/* Data Enrichment */}
        <div className="flex items-start gap-3">
          <Database className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
          <div className="flex-1">
            <div className="font-medium text-sm mb-1">Data Enrichment (15%)</div>
            <div className="text-xs text-muted-foreground">
              Profile completeness with 8+ verified data points including personal LinkedIn, Org website, and Socials
            </div>
          </div>
        </div>

        {/* Smart Algorithm */}
        <div className="flex items-start gap-3">
          <Brain className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
          <div className="flex-1">
            <div className="font-medium text-sm mb-1">Smart Algorithm</div>
            <div className="text-xs text-muted-foreground">
              All factors combine into a single 0-100 score that automatically assigns leads to actionable tiers (A/B/C/D/E)
            </div>
          </div>
        </div>

        {/* Dynamic Adjustments */}
        <div className="flex items-start gap-3">
          <TrendingUp className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
          <div className="flex-1">
            <div className="font-medium text-sm mb-1">Dynamic Adjustments</div>
            <div className="text-xs text-muted-foreground">
              Bonus points for recent company news, job changes, or technology stack matches to keep scoring current
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadScoreCalculation;