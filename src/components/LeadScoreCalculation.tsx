import { Star, Users, Mail, Phone, Building } from "lucide-react";

const LeadScoreCalculation = () => {
  return (
    <div className="neu-card neu-gradient-stroke p-8">
      <h3 className="text-lg font-semibold mb-6">How Lead Scores Are Calculated</h3>
      
      <div className="space-y-6">
        {/* 5 Stars - Action Ready - Left Text, Center Stars */}
        <div className="grid grid-cols-3 gap-4 items-start relative">
          <div className="text-left relative">
            <div className="font-medium text-sm mb-1 relative">
              Action Ready (80-100 points)
              <div className="absolute top-1/2 left-full w-full h-px bg-amber-800 transform -translate-y-1/2 z-10" style={{ width: 'calc(100% + 2rem)' }}></div>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>• Complete Profile: Name, title, company, industry, location (5+ core fields)</div>
              <div>• Enhanced Data: LinkedIn, website, company LinkedIn, summary (4+ enhanced fields)</div>
              <div>• Full Contact: BOTH email AND phone verified</div>
              <div>• Title Bonus: +0-20 points based on seniority (CEO/Owner = +20pts)</div>
            </div>
          </div>
          <div className="flex justify-center relative z-20">
            <span className="text-primary text-lg">⭐⭐⭐⭐⭐</span>
          </div>
          <div></div>
        </div>

        {/* 4 Stars - Priority Prospect - Right Text, Center Stars */}
        <div className="grid grid-cols-3 gap-4 items-start relative">
          <div></div>
          <div className="flex justify-center relative z-20">
            <span className="text-primary text-lg">⭐⭐⭐⭐☆</span>
          </div>
          <div className="text-right relative">
            <div className="font-medium text-sm mb-1 relative">
              Priority Prospect (60-79 points)
              <div className="absolute top-1/2 right-full w-full h-px bg-amber-800 transform -translate-y-1/2 z-10" style={{ width: 'calc(100% + 2rem)' }}></div>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>• Nearly Complete: 5+ core fields + 4+ enhanced fields</div>
              <div>• Good Contact: Verified email OR phone (missing one contact method)</div>
              <div>• Title Bonus: +0-16 points based on seniority (80% of title bonus)</div>
            </div>
          </div>
        </div>

        {/* 3 Stars - Basic Profile - Left Text, Center Stars */}
        <div className="grid grid-cols-3 gap-4 items-start relative">
          <div className="text-left relative">
            <div className="font-medium text-sm mb-1 relative">
              Basic Profile (40-59 points)
              <div className="absolute top-1/2 left-full w-full h-px bg-amber-800 transform -translate-y-1/2 z-10" style={{ width: 'calc(100% + 2rem)' }}></div>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>• Good Foundation: 3+ core fields present</div>
              <div>• Some Contact: Email OR phone available</div>
              <div>• Title Bonus: +0-12 points based on seniority (60% of title bonus)</div>
            </div>
          </div>
          <div className="flex justify-center relative z-20">
            <span className="text-primary text-lg">⭐⭐⭐☆☆</span>
          </div>
          <div></div>
        </div>

        {/* 2 Stars - Research Required - Right Text, Center Stars */}
        <div className="grid grid-cols-3 gap-4 items-start relative">
          <div></div>
          <div className="flex justify-center relative z-20">
            <span className="text-primary text-lg">⭐⭐☆☆☆</span>
          </div>
          <div className="text-right relative">
            <div className="font-medium text-sm mb-1 relative">
              Research Required (20-39 points)
              <div className="absolute top-1/2 right-full w-full h-px bg-amber-800 transform -translate-y-1/2 z-10" style={{ width: 'calc(100% + 2rem)' }}></div>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>• Basic Data: 2+ core fields present</div>
              <div>• Title Bonus: +0-8 points based on seniority (40% of title bonus)</div>
            </div>
          </div>
        </div>

        {/* 1 Star - Incomplete Profile - Left Text, Center Stars */}
        <div className="grid grid-cols-3 gap-4 items-start relative">
          <div className="text-left relative">
            <div className="font-medium text-sm mb-1 relative">
              Incomplete Profile (0-19 points)
              <div className="absolute top-1/2 left-full w-full h-px bg-amber-800 transform -translate-y-1/2 z-10" style={{ width: 'calc(100% + 2rem)' }}></div>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>• Minimal Data: Limited information available</div>
              <div>• Title Bonus: +0-4 points based on seniority (20% of title bonus)</div>
            </div>
          </div>
          <div className="flex justify-center relative z-20">
            <span className="text-primary text-lg">⭐☆☆☆☆</span>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default LeadScoreCalculation;