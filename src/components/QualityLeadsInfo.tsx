import { Card, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";

const QualityLeadsInfo = () => {
  return (
    <Card className="mb-6 border-blue-200 bg-blue-50">
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-sm mb-1">How to Generate Quality Leads</h3>
            <p className="text-sm text-muted-foreground">
              Choose your target location and industry to discover verified decision makers. This demo uses real, embedded data for Atlanta and Austin.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QualityLeadsInfo;