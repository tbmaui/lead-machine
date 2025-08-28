const UseCasesSection = () => {
  const useCases = [
    "SDR teams needing daily lead lists",
    "Account-based marketing campaigns", 
    "Prospect research prior to outbound sprints",
    "Consultants and clients needing niche contact discovery",
    "Testing lead quality for new verticals/markets"
  ];

  return (
    <div className="neu-card neu-gradient-stroke p-8">
      <h3 className="text-lg font-semibold mb-6">Primary Use Cases</h3>
      <ul className="space-y-2">
        {useCases.map((useCase, index) => (
          <li key={index} className="flex items-start gap-2 text-sm">
            <span className="w-1.5 h-1.5 bg-foreground rounded-full mt-2 flex-shrink-0"></span>
            {useCase}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UseCasesSection;