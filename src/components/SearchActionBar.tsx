import { Button } from '@/components/ui/button';
import { 
  Play, 
  Pause, 
  X, 
  Download, 
  RefreshCw, 
  Plus,
  FileText,
  Clock,
  Trash2
} from 'lucide-react';

interface SearchActionBarProps {
  currentStep: 'setup' | 'searching' | 'results';
  onLoadDemo?: () => void;
  onLoadPrevious?: () => void;
  onClearForm?: () => void;
  onPauseSearch?: () => void;
  onCancelSearch?: () => void;
  onExportCSV?: () => void;
  onRefineSearch?: () => void;
  onNewSearch?: () => void;
  isSearching?: boolean;
  canPause?: boolean;
}

export const SearchActionBar = ({
  currentStep,
  onLoadDemo,
  onLoadPrevious,
  onClearForm,
  onPauseSearch,
  onCancelSearch,
  onExportCSV,
  onRefineSearch,
  onNewSearch,
  isSearching = false,
  canPause = false
}: SearchActionBarProps) => {

  const renderSetupActions = () => (
    <div className="flex gap-3 justify-center">
      <Button
        variant="outline"
        onClick={onLoadDemo}
        className="neu-element flex items-center gap-2"
      >
        <Play className="w-4 h-4" />
        Load Demo Template
      </Button>
      <Button
        variant="outline"
        onClick={onLoadPrevious}
        className="neu-element flex items-center gap-2"
      >
        <Clock className="w-4 h-4" />
        Load Previous Search
      </Button>
      <Button
        variant="outline"
        onClick={onClearForm}
        className="neu-element flex items-center gap-2"
      >
        <Trash2 className="w-4 h-4" />
        Clear Form
      </Button>
    </div>
  );

  const renderSearchingActions = () => (
    <div className="flex gap-3 justify-center">
      {canPause && (
        <Button
          variant="outline"
          onClick={onPauseSearch}
          className="neu-element flex items-center gap-2"
          disabled={!isSearching}
        >
          <Pause className="w-4 h-4" />
          Pause Search
        </Button>
      )}
      <Button
        variant="destructive"
        onClick={onCancelSearch}
        className="flex items-center gap-2"
      >
        <X className="w-4 h-4" />
        Cancel Search
      </Button>
    </div>
  );

  const renderResultsActions = () => (
    <div className="flex gap-4 justify-between items-center">
      {/* Left side - Export actions */}
      <div className="flex gap-2">
        <Button
          onClick={onExportCSV}
          className="neu-element neu-green flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
        <Button
          variant="outline"
          className="neu-element flex items-center gap-2"
        >
          <FileText className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      {/* Right side - Search actions */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onRefineSearch}
          className="neu-element flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refine Search
        </Button>
        <Button
          onClick={onNewSearch}
          className="neu-element neu-orange flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Search
        </Button>
      </div>
    </div>
  );

  // Don't render anything if no actions are available for the current step
  const hasActions = currentStep === 'setup' || currentStep === 'searching' || currentStep === 'results';
  
  if (!hasActions) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto mb-6">
      <div className="neu-element neu-gradient-stroke p-6 rounded-xl">
        {currentStep === 'setup' && renderSetupActions()}
        {currentStep === 'searching' && renderSearchingActions()}
        {currentStep === 'results' && renderResultsActions()}
      </div>
    </div>
  );
};