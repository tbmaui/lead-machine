import { Target, Search, Zap, Link, DollarSign, BarChart3, TrendingUp, Globe, CheckCircle, Infinity, Star, MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StarBorder } from "@/components/ui/star-border";
import { useNavigate } from "react-router-dom";
import { CTA_VARIANTS, selectCTAVariant, trackCTAClick } from "@/lib/cta-variants";
import { useAuth } from "@/hooks/useAuth";

const OverviewSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Progressive enhancement: Ensure CTA works even if variant system fails
  let contextualCTA;
  try {
    contextualCTA = selectCTAVariant([
      {
        id: 'start-first-campaign',
        copy: 'Start Your First Campaign',
        description: 'Begin generating quality leads today',
        urgency: 'Get 50 free leads to test quality',
        riskReversal: 'No commitment required'
      },
      {
        id: 'discover-leads-now',
        copy: 'Discover Leads Now',
        description: 'Find your ideal prospects instantly',
        urgency: 'Setup takes less than 2 minutes',
        riskReversal: 'Free trial available'
      },
      {
        id: 'build-your-pipeline',
        copy: 'Build Your Pipeline',
        description: 'Start filling your sales pipeline',
        urgency: 'Join thousands of sales teams',
        riskReversal: '100% satisfaction guaranteed'
      }
    ], 'session-based', user?.id);
  } catch (error) {
    console.warn('CTA variant selection failed, using default:', error);
    contextualCTA = {
      id: 'default-contextual',
      copy: 'Start Your First Campaign',
      description: 'Begin generating quality leads today',
      urgency: 'Get 50 free leads to test quality',
      riskReversal: 'No commitment required'
    };
  }

  const handleCTAClick = () => {
    try {
      trackCTAClick(contextualCTA, 'overview', user?.id);
    } catch (error) {
      console.warn('CTA tracking failed:', error);
    }
    navigate('/search');
  };

  return (
    <div className="space-y-8">
      {/* Two-Column Feature Grid - Centered with hero section */}
      <div className="neu-card neu-gradient-stroke p-8 mx-auto max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Smart Star Rating System Column */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Star className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-semibold">Smart Star Rating System</h3>
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
            <h3 className="text-xl font-semibold">Multi-Source Data Discovery</h3>
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
      
      {/* Strategic CTA Placement After Feature Explanation */}
      <div className="neu-card neu-green p-8 mx-auto max-w-4xl text-center">
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-2xl font-semibold text-foreground">Ready to Find Your Next Customers?</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our multi-source discovery engine and smart star rating system help you identify and prioritize
              the highest quality leads for your sales team.
            </p>
          </div>
          
          {/* CTA Button */}
          <div className="flex flex-col items-center">
            <StarBorder
              onClick={handleCTAClick}
              className="cursor-pointer"
              color="#466359"
              speed="4s"
              aria-label={contextualCTA.description}
            >
              <span className="flex items-center justify-center gap-2 text-lg font-semibold">
                {contextualCTA.copy}
                <MoveRight className="h-5 w-5" />
              </span>
            </StarBorder>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewSection;