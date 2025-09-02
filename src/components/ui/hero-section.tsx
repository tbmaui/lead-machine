import { MoveRight, Sparkles, Target, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHeroV2 } from "@/lib/feature-flags";
import { HeroBackgroundPaths } from "@/components/ui/hero-background-paths";
import { AnimatedBackgroundPaths } from "@/components/ui/animated-background-paths";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CTA_VARIANTS, selectCTAVariant, trackCTAClick } from "@/lib/cta-variants";
import { useAuth } from "@/hooks/useAuth";

function HeroSection() {
  const isHeroV2Enabled = useHeroV2();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Progressive enhancement: Use try-catch to ensure CTAs work even if variant system fails
  let primaryCTA, secondaryCTA;
  try {
    primaryCTA = selectCTAVariant(CTA_VARIANTS.primary, 'session-based', user?.id);
    secondaryCTA = selectCTAVariant(CTA_VARIANTS.secondary, 'session-based', user?.id);
  } catch (error) {
    console.warn('CTA variant selection failed, using defaults:', error);
    primaryCTA = { id: 'default-primary', copy: 'Get Leads Now', urgency: 'Free for first 100 leads', riskReversal: 'No credit card required' };
    secondaryCTA = { id: 'default-secondary', copy: 'Try It Free', urgency: 'No commitment required', riskReversal: 'See results in 30 seconds' };
  }

  const handlePrimaryCTAClick = () => {
    try {
      trackCTAClick(primaryCTA, 'hero', user?.id);
    } catch (error) {
      console.warn('CTA tracking failed:', error);
    }
    navigate('/search');
  };

  const handleSecondaryCTAClick = () => {
    try {
      trackCTAClick(secondaryCTA, 'hero', user?.id);
    } catch (error) {
      console.warn('CTA tracking failed:', error);
    }
    navigate('/search?demo=true');
  };

  // Original hero section (when feature gate is disabled)
  const OriginalHeroSection = () => (
    <div className="w-full bg-background">
      <div className="container mx-auto px-4">
        <div className="flex gap-16 py-16 lg:py-32 items-center justify-center flex-col max-w-6xl mx-auto">
          
          {/* Enhanced typography hierarchy */}
          <div className="flex gap-8 flex-col text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl max-w-5xl mx-auto tracking-tight font-bold bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent leading-tight">
              Welcome to the Lead Machine
            </h1>
            <div className="space-y-6 max-w-4xl mx-auto">
              <h2 className="text-xl md:text-2xl lg:text-3xl leading-relaxed tracking-tight font-semibold" style={{ color: '#91bfa5' }}>
                Quality Prospects At Scale
              </h2>
              <p className="text-base md:text-lg max-w-3xl mx-auto" style={{ color: 'black' }}>
                The unfair advantage for high-quota sales teams, our advanced lead scraping engine automatically harvests prospect data from LinkedIn, industry databases, organizational directories, and the entire web to build comprehensive lead profiles with verified contact information and company intelligence.
              </p>
              {/* Trust signals */}
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
                <span className="font-semibold">Join 500+ sales teams</span>
                <span className="text-muted-foreground">•</span>
                <span>100k+ leads generated daily</span>
                <span className="text-muted-foreground">•</span>
                <span>95% data accuracy</span>
              </div>
            </div>
          </div>
          
          {/* Enhanced feature cards with gradient stroke outlines */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
            <div className="neu-hero-feature flex items-start gap-4 p-6 transition-all duration-300 hover:neu-raised">
              <div className="w-3 h-3 bg-gradient-to-br from-primary to-accent rounded-full flex-shrink-0 mt-1"></div>
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Cross-Platform Verification</h4>
                <p className="text-sm text-muted-foreground">Email, phone, and LinkedIn verification for maximum accuracy</p>
              </div>
            </div>
            <div className="neu-hero-feature flex items-start gap-4 p-6 transition-all duration-300 hover:neu-raised">
              <div className="w-3 h-3 bg-gradient-to-br from-primary to-accent rounded-full flex-shrink-0 mt-1"></div>
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Real-Time Enrichment</h4>
                <p className="text-sm text-muted-foreground">Live LinkedIn data integration and profile enhancement</p>
              </div>
            </div>
            <div className="neu-hero-feature flex items-start gap-4 p-6 transition-all duration-300 hover:neu-raised">
              <div className="w-3 h-3 bg-gradient-to-br from-primary to-accent rounded-full flex-shrink-0 mt-1"></div>
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">CRM-Ready Export</h4>
                <p className="text-sm text-muted-foreground">Built for daily volume with seamless CRM integration</p>
              </div>
            </div>
          </div>
          
          {/* CTA Buttons with urgency and risk reversal */}
          <div className="flex flex-col gap-6 items-center justify-center w-full max-w-2xl">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full">
              <div className="flex flex-col items-center gap-2">
                <Button
                  onClick={handlePrimaryCTAClick}
                  className="neu-button neu-gradient-stroke w-full sm:w-auto px-8 py-3 text-lg font-semibold min-h-[44px]"
                  aria-label={primaryCTA.description || "Start generating leads"}
                >
                  {primaryCTA.copy}
                  <MoveRight className="ml-2 h-5 w-5" />
                </Button>
                {primaryCTA.urgency && (
                  <span className="text-xs text-muted-foreground font-medium">{primaryCTA.urgency}</span>
                )}
              </div>
              <div className="flex flex-col items-center gap-2">
                <Button
                  onClick={handleSecondaryCTAClick}
                  variant="outline"
                  className="neu-button w-full sm:w-auto px-8 py-3 text-lg font-semibold min-h-[44px]"
                  aria-label={secondaryCTA.description || "Try demo version"}
                >
                  {secondaryCTA.copy}
                </Button>
                {secondaryCTA.urgency && (
                  <span className="text-xs text-muted-foreground font-medium">{secondaryCTA.urgency}</span>
                )}
              </div>
            </div>
            {/* Risk reversal messaging */}
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
              <span>{primaryCTA.riskReversal || "No credit card required"}</span>
              <span>•</span>
              <span>Setup in under 5 minutes</span>
              <span>•</span>
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Enhanced hero section with BackgroundPaths animation
  const EnhancedHeroSection = () => {
    return (
      <div className="relative w-full bg-background">
        {/* Original BackgroundPaths Animation */}
        <HeroBackgroundPaths />

        {/* Original Content Layout */}
        <div className="relative z-10 container mx-auto px-4">
          <div className="flex gap-16 py-8 lg:py-12 items-center justify-center flex-col max-w-6xl mx-auto">
            
            {/* Streamlined typography hierarchy - Cleaned up content */}
            <div className="flex gap-8 flex-col text-center">
              <h1 className="text-4xl md:text-6xl lg:text-7xl max-w-5xl mx-auto tracking-tight font-bold bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent leading-tight">
                Welcome to the Lead Machine
              </h1>
              <div className="space-y-6 max-w-4xl mx-auto">
                <h2 className="text-xl md:text-2xl lg:text-3xl leading-relaxed tracking-tight font-semibold" style={{ color: '#91bfa5' }}>
                  Quality Prospects At Scale
                </h2>
                <p className="text-base md:text-lg max-w-3xl mx-auto" style={{ color: 'black' }}>
                  The unfair advantage for high-quota sales teams, our advanced lead scraping engine automatically harvests prospect data from LinkedIn, industry databases, organizational directories, and the entire web to build comprehensive lead profiles with verified contact information and company intelligence.
                </p>
                {/* Trust signals */}
                <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
                  <span className="font-semibold">Join 500+ sales teams</span>
                  <span className="text-muted-foreground">•</span>
                  <span>100k+ leads generated daily</span>
                  <span className="text-muted-foreground">•</span>
                  <span>95% data accuracy</span>
                </div>
              </div>
            </div>
            
            {/* NEUMORPHIC ELEMENT 4 Enhanced feature cards - Streamlined */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
              <div className="neu-element flex items-start gap-4 p-6 transition-all duration-300 hover:transform hover:-translate-y-1">
                <div className="neu-element neu-green p-3 flex-shrink-0">
                  <Target className="w-5 h-5" style={{ color: '#f36334' }} />
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground text-lg">Outbound Optimized</h4>
                  <p className="text-sm text-muted-foreground">Multi-platform verification with LinkedIn enrichment for maximum accuracy</p>
                </div>
              </div>
              <div className="neu-element flex items-start gap-4 p-6 transition-all duration-300 hover:transform hover:-translate-y-1">
                <div className="neu-element neu-orange p-3 flex-shrink-0">
                  <Zap className="w-5 h-5" style={{ color: '#f36334' }} />
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground text-lg">Enterprise Ready</h4>
                  <p className="text-sm text-muted-foreground">CRM-ready export built for daily volume and seamless integration</p>
                </div>
              </div>
            </div>
          
          {/* CTA Buttons with urgency and risk reversal */}
          <div className="flex flex-col gap-6 items-center justify-center w-full max-w-2xl">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full">
              <div className="flex flex-col items-center gap-2">
                <Button
                  onClick={handlePrimaryCTAClick}
                  className="neu-button neu-gradient-stroke w-full sm:w-auto px-8 py-3 text-lg font-semibold min-h-[44px]"
                  aria-label={primaryCTA.description || "Start generating leads"}
                >
                  {primaryCTA.copy}
                  <MoveRight className="ml-2 h-5 w-5" />
                </Button>
                {primaryCTA.urgency && (
                  <span className="text-xs text-muted-foreground font-medium">{primaryCTA.urgency}</span>
                )}
              </div>
              <div className="flex flex-col items-center gap-2">
                <Button
                  onClick={handleSecondaryCTAClick}
                  variant="outline"
                  className="neu-button w-full sm:w-auto px-8 py-3 text-lg font-semibold min-h-[44px]"
                  aria-label={secondaryCTA.description || "Try demo version"}
                >
                  {secondaryCTA.copy}
                </Button>
                {secondaryCTA.urgency && (
                  <span className="text-xs text-muted-foreground font-medium">{secondaryCTA.urgency}</span>
                )}
              </div>
            </div>
            {/* Risk reversal messaging */}
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
              <span>{primaryCTA.riskReversal || "No credit card required"}</span>
              <span>•</span>
              <span>Setup in under 5 minutes</span>
              <span>•</span>
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Return the appropriate hero section based on feature gate
  return isHeroV2Enabled ? <EnhancedHeroSection /> : <OriginalHeroSection />;
}

export { HeroSection };