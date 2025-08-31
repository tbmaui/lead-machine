import { Star, Users, Mail, Phone, Building } from "lucide-react";

const LeadScoreCalculation = () => {
  return (
    <div className="neu-card neu-gradient-stroke p-8 mx-auto max-w-4xl">
      <div className="space-y-8">
        {/* Full-Width Header Section */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-foreground mb-4">Tiered Scoring System - Lead Quality, Quantified</h3>
          <p className="text-base text-muted-foreground max-w-4xl mx-auto">
            We help your sales team focus on high-intent, high-conversion leads—using a precise, point-based framework that scores each prospect based on data quality, verified contactability, and seniority.
          </p>
        </div>

        {/* Two-Column Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <div>
              <h4 className="text-base font-medium text-foreground mb-2">Complete, Enriched Profiles</h4>
              <p className="text-sm text-muted-foreground">
                Leads with 5+ core fields (name, title, company, industry, location) plus LinkedIn, company site, and summaries earn higher scores—fueling informed outreach.
              </p>
            </div>

            <div>
              <h4 className="text-base font-medium text-foreground mb-2">Verified, Multichannel Reachability</h4>
              <p className="text-sm text-muted-foreground">
                Full points go to leads with both a verified email and direct phone number. No more guessing how to get in touch.
              </p>
            </div>

            <div>
              <h4 className="text-base font-medium text-foreground mb-2">Seniority-Weighted Scoring</h4>
              <p className="text-sm text-muted-foreground">
                C-suite and owner-level contacts are automatically prioritized with up to +20 bonus points—ensuring decision-makers surface at the top.
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div>
              <h4 className="text-base font-medium text-foreground mb-2">Tiered Conversion Signals</h4>
              <p className="text-sm text-muted-foreground mb-3">Each lead falls into one of five performance bands:</p>
              <div className="text-sm text-muted-foreground space-y-2">
                <div><strong>Action-Ready (80–100):</strong> Call now</div>
                <div><strong>Priority (60–79):</strong> Ready for outreach</div>
                <div><strong>Basic (40–59):</strong> Nurture with context</div>
                <div><strong>Research Needed (20–39):</strong> Flag for enrichment</div>
                <div><strong>Incomplete (0–19):</strong> Deprioritize</div>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width Bottom Section */}
        <div className="border-t border-border/20 pt-6">
          <div className="text-center max-w-3xl mx-auto">
            <h4 className="text-base font-medium text-foreground mb-3">Clear Sales Direction</h4>
            <p className="text-sm text-muted-foreground">
              Scores aren't just numbers—they're next steps. Your reps know exactly who to call, who to warm up, and who to skip—maximizing time and ROI.
              This data-driven approach transforms your sales process from guesswork into a precision instrument for revenue generation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadScoreCalculation;