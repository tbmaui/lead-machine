import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const UseCasesSection = () => {
  const useCases = [
    "SDR teams needing daily lead lists",
    "Account-based marketing campaigns", 
    "Prospect research prior to outbound sprints",
    "Consultants and clients needing niche contact discovery",
    "Testing lead quality for new verticals/markets"
  ];

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Primary Use Cases</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {useCases.map((useCase, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <span className="w-1.5 h-1.5 bg-foreground rounded-full mt-2 flex-shrink-0"></span>
              {useCase}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default UseCasesSection;