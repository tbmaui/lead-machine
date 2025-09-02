import { Target, Search, Sparkles, BarChart, CheckCircle, Clock } from 'lucide-react';

interface SearchProgressIndicatorProps {
  currentStatus?: string;
  progress?: number;
  showTimeEstimates?: boolean;
}

interface WorkflowStep {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  statuses: string[];
  estimatedTime?: string;
}

const SEARCH_STEPS: WorkflowStep[] = [
  { 
    id: 'setup', 
    label: 'Search Setup', 
    icon: Target, 
    statuses: ['idle', 'pending'],
    estimatedTime: '1-2 min'
  },
  { 
    id: 'processing', 
    label: 'Finding Leads', 
    icon: Search, 
    statuses: ['processing', 'searching'],
    estimatedTime: '3-5 min'
  },
  { 
    id: 'enriching', 
    label: 'Enriching Data', 
    icon: Sparkles, 
    statuses: ['enriching', 'validating'],
    estimatedTime: '2-3 min'
  },
  { 
    id: 'results', 
    label: 'View Results', 
    icon: BarChart, 
    statuses: ['finalizing', 'completed'],
    estimatedTime: 'Ready'
  }
];

export const SearchProgressIndicator = ({
  currentStatus = 'idle',
  progress = 0,
  showTimeEstimates = true
}: SearchProgressIndicatorProps) => {
  
  const getCurrentStepIndex = () => {
    for (let i = 0; i < SEARCH_STEPS.length; i++) {
      if (SEARCH_STEPS[i].statuses.includes(currentStatus)) {
        return i;
      }
    }
    return 0; // Default to first step
  };

  const currentStepIndex = getCurrentStepIndex();

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStepIndex) {
      return 'completed';
    } else if (stepIndex === currentStepIndex) {
      return 'active';
    } else {
      return 'pending';
    }
  };

  const getStatusMessage = () => {
    switch (currentStatus) {
      case 'pending':
        return 'Initializing search...';
      case 'processing':
        return 'Processing search criteria...';
      case 'searching':
        return 'Discovering leads in target market...';
      case 'enriching':
        return 'Enriching lead profiles with additional data...';
      case 'validating':
        return 'Validating contact information...';
      case 'finalizing':
        return 'Finalizing results and preparing export...';
      case 'completed':
        return 'Lead generation completed successfully!';
      default:
        return 'Ready to begin search';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">Progress</span>
          <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-3 neu-element-inset">
          <div 
            className="bg-gradient-to-r from-primary via-accent to-primary h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step indicators */}
      <div className="flex items-center justify-between mb-6">
        {SEARCH_STEPS.map((step, index) => {
          const status = getStepStatus(index);
          const StepIcon = step.icon;
          
          return (
            <div key={step.id} className="flex items-center">
              {/* Step indicator */}
              <div className="flex flex-col items-center">
                <div 
                  className={`
                    flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300
                    ${status === 'completed' 
                      ? 'neu-element neu-green text-primary' 
                      : status === 'active'
                      ? 'neu-element neu-orange text-primary animate-pulse'
                      : 'neu-element text-muted-foreground'
                    }
                  `}
                >
                  {status === 'completed' ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : status === 'active' ? (
                    <div className="relative">
                      <StepIcon className="w-6 h-6" />
                      {currentStatus !== 'idle' && (
                        <div className="absolute -top-1 -right-1">
                          <Clock className="w-3 h-3 animate-spin" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <StepIcon className="w-6 h-6" />
                  )}
                </div>
                
                {/* Step label */}
                <div className="mt-3 text-center">
                  <div className={`text-sm font-medium ${
                    status === 'active' ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {step.label}
                  </div>
                  {showTimeEstimates && step.estimatedTime && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {status === 'completed' ? '✓ Complete' : step.estimatedTime}
                    </div>
                  )}
                </div>
              </div>

              {/* Connection line */}
              {index < SEARCH_STEPS.length - 1 && (
                <div 
                  className={`
                    w-16 h-1 mx-4 rounded-full transition-all duration-500
                    ${index < currentStepIndex 
                      ? 'bg-gradient-to-r from-primary to-accent' 
                      : 'neu-element-inset'
                    }
                  `}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Status message */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          {getStatusMessage()}
        </p>
      </div>
    </div>
  );
};