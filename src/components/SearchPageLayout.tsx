import { ReactNode } from 'react';
import { SearchPageHeader } from './SearchPageHeader';
import { AdaptiveSearchLayout } from './AdaptiveSearchLayout';

interface SearchPageLayoutProps {
  children: ReactNode;
  currentStep?: 'setup' | 'searching' | 'results';
  showBackNav?: boolean;
  breadcrumbs?: Array<{label: string, href?: string}>;
}

export const SearchPageLayout = ({ 
  children, 
  currentStep = 'setup', 
  showBackNav = true, 
  breadcrumbs
}: SearchPageLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header section with integrated navigation */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <SearchPageHeader
            currentStep={currentStep}
            showBackNav={showBackNav}
            breadcrumbs={breadcrumbs}
          />
        </div>
      </header>

      {/* Main content area with adaptive layout */}
      <main className="container mx-auto px-4 py-8">
        <AdaptiveSearchLayout currentStep={currentStep}>
          {children}
        </AdaptiveSearchLayout>
      </main>

      {/* Footer section (optional) */}
      <footer className="border-t border-border mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            {/* Footer content can be added here if needed */}
          </div>
        </div>
      </footer>
    </div>
  );
};