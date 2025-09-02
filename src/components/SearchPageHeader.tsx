import { ArrowLeft, Home, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface Breadcrumb {
  label: string;
  href?: string;
}

interface SearchPageHeaderProps {
  currentStep?: 'setup' | 'searching' | 'results';
  showBackNav?: boolean;
  breadcrumbs?: Breadcrumb[];
}

export const SearchPageHeader = ({
  currentStep = 'setup',
  showBackNav = true,
  breadcrumbs
}: SearchPageHeaderProps) => {
  const navigate = useNavigate();

  // Default breadcrumbs based on current step
  const defaultBreadcrumbs: Breadcrumb[] = [
    { label: 'Home', href: '/' },
    { label: 'Lead Generation' },
    ...(currentStep === 'results' ? [{ label: 'Results' }] : [])
  ];

  const activeBreadcrumbs = breadcrumbs || defaultBreadcrumbs;

  const getStepTitle = () => {
    switch (currentStep) {
      case 'setup': return 'Lead Generation';
      case 'searching': return 'Generating Leads';
      case 'results': return 'Lead Results';
      default: return 'Lead Generation';
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 'setup': return 'Find and enrich your target prospects';
      case 'searching': return 'Processing your search criteria';
      case 'results': return 'Review and export your leads';
      default: return 'Find and enrich your target prospects';
    }
  };

  const handleBreadcrumbClick = (breadcrumb: Breadcrumb) => {
    if (breadcrumb.href) {
      navigate(breadcrumb.href);
    }
  };

  const handleBackClick = () => {
    navigate(-1); // Go back in browser history
  };

  return (
    <div className="flex items-center justify-between">
      {/* Left side - Navigation and title */}
      <div className="flex items-center gap-4">
        {showBackNav && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackClick}
            className="flex items-center gap-2"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        )}
        
        {/* Breadcrumb navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2">
          {activeBreadcrumbs.map((breadcrumb, index) => (
            <div key={index} className="flex items-center gap-2">
              {index > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
              {breadcrumb.href ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleBreadcrumbClick(breadcrumb)}
                  className="text-sm text-muted-foreground hover:text-foreground p-0 h-auto font-normal"
                >
                  {index === 0 && <Home className="h-4 w-4 mr-1" />}
                  {breadcrumb.label}
                </Button>
              ) : (
                <span className="text-sm text-foreground font-medium">
                  {breadcrumb.label}
                </span>
              )}
            </div>
          ))}
        </nav>

      </div>

      {/* Right side - Action shortcuts */}
      <div className="flex items-center gap-4">
        {/* Keyboard shortcut hints */}
        <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
          <kbd className="px-2 py-1 bg-muted rounded text-xs">Esc</kbd>
          <span>Back</span>
        </div>
      </div>
    </div>
  );
};