import { HeroSection } from "@/components/ui/hero-section";
import OverviewSection from "@/components/OverviewSection";
import UseCasesSection from "@/components/UseCasesSection";
import FeaturesTable from "@/components/FeaturesTable";
import QualityLeadsInfo from "@/components/QualityLeadsInfo";
import LeadGenForm from "@/components/LeadGenForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <div className="container max-w-4xl mx-auto py-8 px-4">
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
