import { HeroSection } from "@/components/ui/hero-section";
import OverviewSection from "@/components/OverviewSection";
import LeadGenForm from "@/components/LeadGenForm";
import QuickStartInstructions from "@/components/QuickStartInstructions";
import LeadScoreCalculation from "@/components/LeadScoreCalculation";
import Logo from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced header with gradient stroke */}
      <header className="neu-flat neu-gradient-stroke mx-4 rounded-lg">
        <div className="relative flex justify-center items-center p-0">
          <Logo />
          <div className="absolute right-2 top-2">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero section with improved spacing */}
      <HeroSection />
      
      {/* Main content area with single-layer neumorphic cards */}
      <main className="mx-auto w-full max-w-[1600px] px-4 md:px-6 space-y-8">
        {/* Overview Section - Direct neumorphic card */}
        <OverviewSection />
        
        {/* How Lead Scores Are Calculated - Direct neumorphic card */}  
        <LeadScoreCalculation />
        
        {/* Quick Start Instructions - Direct neumorphic card */}
        <QuickStartInstructions />
        
        {/* Lead generation section with responsive width */}
        <section className="w-full">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Start Your Lead Search</h2>
          </div>
          <LeadGenForm />
        </section>
      </main>
    </div>
  );
};

export default Index;
