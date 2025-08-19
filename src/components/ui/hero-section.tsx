import { MoveRight, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";

function HeroSection() {
  return (
    <div className="w-full">
      <div className="container mx-auto">
        <div className="flex gap-8 py-20 lg:py-40 items-center justify-center flex-col">
          <div>
            <Button variant="secondary" size="sm" className="gap-4">
              AMERICA'S BOOKKEEPING EXPERTS - LEAD DISCOVERY PLATFORM <MoveRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex gap-4 flex-col">
            <h1 className="text-5xl md:text-7xl max-w-4xl tracking-tighter text-center font-regular">
              Welcome to the Lead Machine
            </h1>
            <h2 className="text-xl md:text-2xl leading-relaxed tracking-tight text-muted-foreground max-w-4xl text-center font-medium">
              High-efficiency, enhanced prospecting with customizable filters across geography, industry, title, and company size.
            </h2>
            <h3 className="text-lg md:text-xl leading-relaxed tracking-tight text-foreground max-w-3xl text-center">
              Generate 1-1000 verified and enriched SMB decision maker contacts in minutes.
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl">
            <div className="flex items-center gap-3 p-4 border border-border rounded-lg bg-card">
              <div className="w-2 h-2 bg-accent rounded-full flex-shrink-0"></div>
              <span className="text-sm">Cross-platform verification (email, phone, LinkedIn)</span>
            </div>
            <div className="flex items-center gap-3 p-4 border border-border rounded-lg bg-card">
              <div className="w-2 h-2 bg-accent rounded-full flex-shrink-0"></div>
              <span className="text-sm">Real-time LinkedIn enrichment</span>
            </div>
            <div className="flex items-center gap-3 p-4 border border-border rounded-lg bg-card">
              <div className="w-2 h-2 bg-accent rounded-full flex-shrink-0"></div>
              <span className="text-sm">CRM-ready export, built for daily volume</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { HeroSection };