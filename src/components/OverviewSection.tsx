import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

const OverviewSection = () => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Overview: What This Tool Does</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          High-efficiency, enhanced prospecting with customizable filters across geography, industry, title, and company size.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-2">
            <Check className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
            <span className="text-sm">Cross-platform verification (email, phone, LinkedIn)</span>
          </div>
          <div className="flex items-start gap-2">
            <Check className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
            <span className="text-sm">Real-time LinkedIn enrichment</span>
          </div>
          <div className="flex items-start gap-2">
            <Check className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
            <span className="text-sm">CRM-ready export, built for daily volume</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OverviewSection;