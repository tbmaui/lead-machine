import { Star, Users, Mail, Phone, Building } from "lucide-react";

const LeadScoreCalculation = () => {
  return (
    <div className="neu-card neu-gradient-stroke p-8">
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-foreground mb-4">Tiered Scoring System - Lead Quality, Quantified</h3>
        
        <p className="text-base text-muted-foreground mb-6">
          We help your sales team focus on high-intent, high-conversion leads—using a precise, point-based framework that scores each prospect based on data quality, verified contactability, and seniority.
        </p>

        <div className="space-y-4">
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

          <div>
            <h4 className="text-base font-medium text-foreground mb-2">Tiered Conversion Signals</h4>
            <p className="text-sm text-muted-foreground mb-3">Each lead falls into one of five performance bands:</p>
            <div className="text-sm text-muted-foreground space-y-1 ml-4">
              <div><strong>Action-Ready (80–100):</strong> Call now</div>
              <div><strong>Priority (60–79):</strong> Ready for outreach</div>
              <div><strong>Basic (40–59):</strong> Nurture with context</div>
              <div><strong>Research Needed (20–39):</strong> Flag for enrichment</div>
              <div><strong>Incomplete (0–19):</strong> Deprioritize</div>
            </div>
          </div>

          <div>
            <h4 className="text-base font-medium text-foreground mb-2">Clear Sales Direction</h4>
            <p className="text-sm text-muted-foreground">
              Scores aren't just numbers—they're next steps. Your reps know exactly who to call, who to warm up, and who to skip—maximizing time and ROI.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadScoreCalculation;