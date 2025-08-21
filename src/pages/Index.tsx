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
      <div className="flex justify-between items-center p-4">
        <Logo />
        <ThemeToggle />
      </div>
      <HeroSection />
      <div className="mx-auto w-full max-w-7xl py-8 px-4 md:px-6">
        <OverviewSection />
        <UseCasesSection />
        <FeaturesTable />
        <QualityLeadsInfo />
        <LeadGenForm />
      </div>
    </div>
  );
};

export default Index;
