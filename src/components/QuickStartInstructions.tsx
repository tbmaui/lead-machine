import { Button } from "@/components/ui/button";
import { StarBorder } from "@/components/ui/star-border";
import { MoveRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const QuickStartInstructions = () => {
  const navigate = useNavigate();

  return (
    <div className="neu-card neu-gradient-stroke p-8 mx-auto max-w-4xl">
      <h3 className="text-lg font-semibold mb-6 text-center">Quick Start Instructions</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-8 h-8 border-2 border-foreground bg-transparent text-primary rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
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
          <div className="w-8 h-8 border-2 border-foreground bg-transparent text-primary rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
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
          <div className="w-8 h-8 border-2 border-foreground bg-transparent text-primary rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
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
      
      {/* Start Generating Leads CTA */}
      <div className="flex justify-center mt-8">
        <StarBorder
          onClick={() => navigate('/search')}
          className="cursor-pointer"
          color="#466359"
          speed="4s"
          aria-label="Start generating leads now"
        >
          <span className="flex items-center justify-center gap-2 text-lg font-semibold">
            Start Generating Leads
            <MoveRight className="h-5 w-5" />
          </span>
        </StarBorder>
      </div>
    </div>
  );
};

export default QuickStartInstructions;