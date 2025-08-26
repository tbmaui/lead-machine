import { MoveRight, Sparkles, Target, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHeroV2 } from "@/lib/feature-flags";

function HeroSection() {
  const isHeroV2Enabled = useHeroV2();

  // Original hero section (when feature gate is disabled)
  const OriginalHeroSection = () => (
    <div className="w-full bg-background">
      <div className="container mx-auto px-4">
        <div className="flex gap-12 py-16 lg:py-32 items-center justify-center flex-col max-w-6xl mx-auto">
          {/* Enhanced hero badge */}
          <div className="neu-hero-card p-4">
            <Button variant="secondary" size="sm" className="neu-hero-button gap-3 font-semibold tracking-wide">
              <Sparkles className="w-4 h-4" />
              AMERICA'S PREMIER LEAD DISCOVERY PLATFORM
              <MoveRight className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Enhanced typography hierarchy */}
          <div className="flex gap-6 flex-col text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl max-w-5xl mx-auto tracking-tight font-bold bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent leading-tight">
              Welcome to the Lead Machine
            </h1>
            <div className="space-y-4 max-w-4xl mx-auto">
              <h2 className="text-xl md:text-2xl lg:text-3xl leading-relaxed tracking-tight text-muted-foreground font-medium">
                High-efficiency, enhanced prospecting with customizable filters across geography, industry, title, and company size.
              </h2>
              <h3 className="text-lg md:text-xl lg:text-2xl leading-relaxed tracking-tight text-foreground font-normal">
                Generate 1-1000 verified and enriched SMB decision maker contacts in minutes.
              </h3>
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
        </div>
      </div>
    </div>
  );

  // Enhanced hero section (when feature gate is enabled) - NEUMORPHIC ELEMENT 4
  const EnhancedHeroSection = () => (
    <div className="w-full bg-background">
      <div className="container mx-auto px-4">
        <div className="flex gap-12 py-16 lg:py-32 items-center justify-center flex-col max-w-6xl mx-auto">
          {/* NEUMORPHIC ELEMENT 4 Enhanced hero badge */}
          <div className="neu-element neu-green p-4">
            <Button variant="secondary" size="sm" className="gap-3 font-semibold tracking-wide bg-transparent shadow-none hover:shadow-none active:shadow-none">
              <Sparkles className="w-4 h-4" />
              AMERICA'S PREMIER LEAD DISCOVERY PLATFORM
              <MoveRight className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Streamlined typography hierarchy - Cleaned up content */}
          <div className="flex gap-6 flex-col text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl max-w-5xl mx-auto tracking-tight font-bold bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent leading-tight">
              Professional Lead Discovery
            </h1>
            <div className="space-y-4 max-w-4xl mx-auto">
              <h2 className="text-xl md:text-2xl lg:text-3xl leading-relaxed tracking-tight text-muted-foreground font-medium">
                Generate verified SMB decision maker contacts with advanced filtering across geography, industry, and company size.
              </h2>
            </div>
          </div>
          
          {/* NEUMORPHIC ELEMENT 4 Enhanced feature cards - Streamlined */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
            <div className="neu-element flex items-start gap-4 p-6 transition-all duration-300 hover:transform hover:-translate-y-1">
              <div className="neu-element neu-green p-3 flex-shrink-0">
                <Target className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground text-lg">Precision Targeting</h4>
                <p className="text-sm text-muted-foreground">Multi-platform verification with LinkedIn enrichment for maximum accuracy</p>
              </div>
            </div>
            <div className="neu-element flex items-start gap-4 p-6 transition-all duration-300 hover:transform hover:-translate-y-1">
              <div className="neu-element neu-orange p-3 flex-shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground text-lg">Enterprise Ready</h4>
                <p className="text-sm text-muted-foreground">CRM-ready export built for daily volume and seamless integration</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Return the appropriate hero section based on feature gate
  return isHeroV2Enabled ? <EnhancedHeroSection /> : <OriginalHeroSection />;
}

export { HeroSection };