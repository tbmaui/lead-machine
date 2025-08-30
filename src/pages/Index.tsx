import { HeroSection } from "@/components/ui/hero-section";
import OverviewSection from "@/components/OverviewSection";
import LeadGenForm from "@/components/LeadGenForm";
import QuickStartInstructions from "@/components/QuickStartInstructions";
import LeadScoreCalculation from "@/components/LeadScoreCalculation";
import { useAuth } from "@/hooks/useAuth";

interface IndexProps {
  restoredSearch?: {job: any, leads: any[]} | null;
  onSearchRestored?: () => void;
}

const Index = ({ restoredSearch, onSearchRestored }: IndexProps) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
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
          {user && (
            <LeadGenForm 
              userId={user.id} 
              restoredSearch={restoredSearch}
              onSearchRestored={onSearchRestored}
            />
          )}
        </section>
      </main>
    </div>
  );
};

export default Index;
