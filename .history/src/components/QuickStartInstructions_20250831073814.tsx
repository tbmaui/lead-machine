const QuickStartInstructions = () => {
  return (
    <div className="neu-card neu-gradient-stroke p-8">
      <h3 className="text-lg font-semibold mb-6 text-center">Quick Start Instructions</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
            1
          </div>
          <div>
            <h4 className="font-medium text-sm mb-2">Define Your Target Criteria</h4>
            <p className="text-sm text-muted-foreground">
              Specify industry, job titles, company size, and geographic location to focus your search
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
            2
          </div>
          <div>
            <h4 className="font-medium text-sm mb-2">Launch Lead Generation</h4>
            <p className="text-sm text-muted-foreground">
              Start the automated search process and monitor real-time progress updates
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
            3
          </div>
          <div>
            <h4 className="font-medium text-sm mb-2">Review & Export Results</h4>
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