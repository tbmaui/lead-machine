import { HeroSection } from "@/components/ui/hero-section";
import OverviewSection from "@/components/OverviewSection";
import UseCasesSection from "@/components/UseCasesSection";
import FeaturesTable from "@/components/FeaturesTable";
import QualityLeadsInfo from "@/components/QualityLeadsInfo";
import LeadGenForm from "@/components/LeadGenForm";
import Logo from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced header with gradient stroke */}
      <header className="neu-flat neu-gradient-stroke mx-4 mt-4 rounded-lg">
        <div className="flex justify-between items-center p-6">
          <Logo />
          <ThemeToggle />
        </div>
      </header>

      {/* Hero section with improved spacing */}
      <HeroSection />
      
      {/* Main content area with enhanced layout */}
      <main className="mx-auto w-full max-w-[1600px] py-12 px-4 md:px-6 space-y-16">
        <section className="neu-card neu-gradient-stroke p-8">
          <OverviewSection />
        </section>
        
        <section className="neu-card neu-gradient-stroke p-8">
          <UseCasesSection />
        </section>
        
        <section className="neu-card neu-gradient-stroke p-8">
          <FeaturesTable />
        </section>
        
        <section className="neu-card neu-gradient-stroke p-8">
          <QualityLeadsInfo />
        </section>
        
        {/* Lead generation section with responsive width */}
        <section className="w-full">
          <LeadGenForm />
        </section>
      </main>
    </div>
  );
};

export default Index;
