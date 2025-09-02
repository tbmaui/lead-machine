import { HeroSection } from "@/components/ui/hero-section";
import OverviewSection from "@/components/OverviewSection";
import QuickStartInstructions from "@/components/QuickStartInstructions";
import LeadScoreCalculation from "@/components/LeadScoreCalculation";

// Interface left for future extensibility
interface IndexProps {
  // Properties can be added here in the future
}

const Index = (_props: IndexProps) => {

  return (
    <div className="min-h-screen bg-background">
      {/* Hero section with improved spacing */}
      <HeroSection />
      
      {/* Main content area with single-layer neumorphic cards */}
      <main className="mx-auto w-full max-w-[1600px] px-4 md:px-6 space-y-8 mt-12">
        {/* Overview Section - Direct neumorphic card */}
        <OverviewSection />
        
        {/* How Lead Scores Are Calculated - Direct neumorphic card */}  
        <LeadScoreCalculation />
        
        {/* Quick Start Instructions - Direct neumorphic card */}
        <QuickStartInstructions />
      </main>
    </div>
  );
};

export default Index;
