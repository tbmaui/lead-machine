import { MoveRight, Sparkles, Target, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHeroV2 } from "@/lib/feature-flags";
import { BackgroundPaths } from "@/components/ui/background-paths";
import { motion } from "framer-motion";
import Switch from "@/components/ui/sky-toggle";

function HeroSection() {
  const isHeroV2Enabled = useHeroV2();

  // Original hero section (when feature gate is disabled)
  const OriginalHeroSection = () => (
    <div className="w-full bg-background">
      <div className="container mx-auto px-4 relative">
        <div className="absolute top-4 right-4 z-20">
          <Switch />
        </div>
        <div className="flex gap-12 py-16 lg:py-32 items-center justify-center flex-col max-w-6xl mx-auto">
          
          {/* Enhanced typography hierarchy */}
          <div className="flex gap-6 flex-col text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl max-w-5xl mx-auto tracking-tight font-bold bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent leading-tight">
              Welcome to the Lead Machine
            </h1>
            <div className="space-y-4 max-w-4xl mx-auto">
              <h2 className="text-xl md:text-2xl lg:text-3xl leading-relaxed tracking-tight text-primary font-semibold">
                Your Source for Intelligent Lead Generation
              </h2>
              <h3 className="text-lg md:text-xl lg:text-2xl leading-relaxed tracking-tight text-foreground font-normal">
                Stop chasing cold leads. Start closing hot prospects.
              </h3>
              <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
                Our advanced lead scraping engine automatically harvests prospect data from LinkedIn, industry databases, organizational directories, and the entire web to build comprehensive lead profiles with verified contact information and company intelligence.
              </p>
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

  // Enhanced hero section with BackgroundPaths animation
  const EnhancedHeroSection = () => {
    return (
      <div className="relative w-full bg-background">
        {/* Animated Background Paths */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 pointer-events-none">
            <svg
              className="w-full h-full text-slate-950 dark:text-white"
              viewBox="0 0 696 316"
              fill="none"
            >
              <title>Background Paths</title>
              {Array.from({ length: 36 }, (_, i) => {
                const position = 1;
                return (
                  <motion.path
                    key={i}
                    d={`M-${380 - i * 5 * position} -${189 + i * 6}C-${
                      380 - i * 5 * position
                    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
                      152 - i * 5 * position
                    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
                      684 - i * 5 * position
                    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`}
                    stroke="currentColor"
                    strokeWidth={0.5 + i * 0.03}
                    strokeOpacity={0.05 + i * 0.02}
                    initial={{ pathLength: 0.3, opacity: 0.6 }}
                    animate={{
                      pathLength: 1,
                      opacity: [0.2, 0.4, 0.2],
                      pathOffset: [0, 1, 0],
                    }}
                    transition={{
                      duration: 20 + Math.random() * 10,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  />
                );
              })}
              {Array.from({ length: 36 }, (_, i) => {
                const position = -1;
                return (
                  <motion.path
                    key={i + 36}
                    d={`M-${380 - i * 5 * position} -${189 + i * 6}C-${
                      380 - i * 5 * position
                    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
                      152 - i * 5 * position
                    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
                      684 - i * 5 * position
                    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`}
                    stroke="currentColor"
                    strokeWidth={0.5 + i * 0.03}
                    strokeOpacity={0.05 + i * 0.02}
                    initial={{ pathLength: 0.3, opacity: 0.6 }}
                    animate={{
                      pathLength: 1,
                      opacity: [0.2, 0.4, 0.2],
                      pathOffset: [0, 1, 0],
                    }}
                    transition={{
                      duration: 20 + Math.random() * 10,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  />
                );
              })}
            </svg>
          </div>
        </div>

        {/* Original Content Layout */}
        <div className="relative z-10 container mx-auto px-4">
          <div className="absolute top-4 right-4 z-20">
            <Switch />
          </div>
          <div className="flex gap-12 py-8 lg:py-12 items-center justify-center flex-col max-w-6xl mx-auto">
            
            {/* Streamlined typography hierarchy - Cleaned up content */}
            <div className="flex gap-6 flex-col text-center">
              <h1 className="text-4xl md:text-6xl lg:text-7xl max-w-5xl mx-auto tracking-tight font-bold bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent leading-tight">
                Welcome to the Lead Machine
              </h1>
              <div className="space-y-4 max-w-4xl mx-auto">
                <h2 className="text-xl md:text-2xl lg:text-3xl leading-relaxed tracking-tight text-primary font-semibold">
                  Your Source for Intelligent Lead Generation
                </h2>
                <h3 className="text-lg md:text-xl lg:text-2xl leading-relaxed tracking-tight text-foreground font-normal">
                  Stop chasing cold leads. Start closing hot prospects.
                </h3>
                <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
                  Our advanced lead scraping engine automatically harvests prospect data from LinkedIn, industry databases, organizational directories, and the entire web to build comprehensive lead profiles with verified contact information and company intelligence.
                </p>
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
  };

  // Return the appropriate hero section based on feature gate
  return isHeroV2Enabled ? <EnhancedHeroSection /> : <OriginalHeroSection />;
}

export { HeroSection };