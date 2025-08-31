import { Target, Search, Zap, Link, DollarSign, BarChart3, TrendingUp, Globe, CheckCircle, Infinity, Star } from "lucide-react";

const OverviewSection = () => {
  return (
    <div className="space-y-8">
      {/* Two-Column Feature Grid - No nested cards */}
      <div className="neu-card neu-gradient-stroke p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Smart Star Rating System Column */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Star className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Smart Star Rating System</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Target className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
              <div>
                <div className="font-medium text-sm">Data-Driven Scoring</div>
                <div className="text-xs text-muted-foreground">Star ratings based on profile completeness and contact information quality</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <DollarSign className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
              <div>
                <div className="font-medium text-sm">Action Ready Leads</div>
                <div className="text-xs text-muted-foreground">5-star prospects have complete profiles with both email and phone for immediate outreach</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <TrendingUp className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
              <div>
                <div className="font-medium text-sm">Clear Prioritization</div>
                <div className="text-xs text-muted-foreground">Focus on 5-star and 4-star leads for highest response rates and conversion</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Infinity className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
              <div>
                <div className="font-medium text-sm">Scalable Quality</div>
                <div className="text-xs text-muted-foreground">Consistent scoring from 5 leads to 5,000 leads per month with visual star system</div>
              </div>
            </div>
          </div>
        </div>

        {/* Multi-Source Data Discovery Column */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Search className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Multi-Source Data Discovery</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Link className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
              <div>
                <div className="font-medium text-sm">LinkedIn Intelligence</div>
                <div className="text-xs text-muted-foreground">Verified job titles, company insights, and professional connections for personalized outreach</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <BarChart3 className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
              <div>
                <div className="font-medium text-sm">Premium Database Access</div>
                <div className="text-xs text-muted-foreground">Tap into specialized directories to find prospects competitors miss completely</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Globe className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
              <div>
                <div className="font-medium text-sm">Web-Wide Prospecting</div>
                <div className="text-xs text-muted-foreground">Capture fresh leads from company websites and industry publications before anyone else</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
              <div>
                <div className="font-medium text-sm">Instant Contact Verification</div>
                <div className="text-xs text-muted-foreground">Every email and phone number validated so outreach always reaches real people</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default OverviewSection;