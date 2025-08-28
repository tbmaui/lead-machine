const QuickStartInstructions = () => {
  return (
    <div className="neu-card neu-gradient-stroke p-8">
      <h3 className="text-lg font-semibold mb-6">Quick Start Instructions</h3>
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
            1
          </div>
          <div>
            <h4 className="font-medium text-sm mb-1">Define Your Target Criteria</h4>
            <p className="text-sm text-muted-foreground">
              Specify industry, job titles, company size, and geographic location to focus your search
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
            2
          </div>
          <div>
            <h4 className="font-medium text-sm mb-1">Launch Lead Generation</h4>
            <p className="text-sm text-muted-foreground">
              Start the automated search process and monitor real-time progress updates
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
            3
          </div>
          <div>
            <h4 className="font-medium text-sm mb-1">Review & Export Results</h4>
            <p className="text-sm text-muted-foreground">
              Analyze lead quality scores and export verified contacts to your CRM
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickStartInstructions;