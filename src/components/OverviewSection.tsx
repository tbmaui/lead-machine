import { Target, Search, Zap, Link, DollarSign, BarChart3, TrendingUp, Globe, CheckCircle, Infinity } from "lucide-react";

const OverviewSection = () => {
  return (
    <div className="space-y-8">
      {/* Two-Column Feature Grid - No nested cards */}
      <div className="neu-card neu-gradient-stroke p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Smart Lead Scoring Column */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Smart Lead Scoring</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Zap className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
              <div>
                <div className="font-medium text-sm">Smart Prioritization</div>
                <div className="text-xs text-muted-foreground">Automatically prioritize leads by title level, company size, and contact quality</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <DollarSign className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
              <div>
                <div className="font-medium text-sm">Bigger Deals</div>
                <div className="text-xs text-muted-foreground">Tier S leads generate 150-300% larger deals and close 25% faster</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <TrendingUp className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
              <div>
                <div className="font-medium text-sm">Better Conversions</div>
                <div className="text-xs text-muted-foreground">Convert 15-25% of hot leads vs 1-3% of unscored prospects</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Infinity className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
              <div>
                <div className="font-medium text-sm">Infinite Scale</div>
                <div className="text-xs text-muted-foreground">Scale from 5 to 5,000 leads per month with consistent prioritization</div>
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
      
      {/* Performance Stats Card */}
      <div className="neu-card neu-gradient-stroke p-8">
        <div className="text-center space-y-4">
          <p className="text-sm font-medium text-muted-foreground">
            <strong>Tier A:</strong> Call Now | <strong>Tier B:</strong> 24-48hrs | <strong>Tier C:</strong> 3-5 days | <strong>Tier D:</strong> Nurture | <strong>Tier E:</strong> Archive
          </p>
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">3x</div>
              <div className="text-xs text-muted-foreground">Higher Response Rates</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">15-25%</div>
              <div className="text-xs text-muted-foreground">Quality Lead Conversion</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">25%</div>
              <div className="text-xs text-muted-foreground">Faster Deal Closure</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewSection;