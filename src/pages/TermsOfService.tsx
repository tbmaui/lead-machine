import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { termsContent } from "@/components/legal/TermsContent";

const TermsOfService = () => {
  const handleBackToApp = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Bar */}
      <nav className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToApp}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to App
          </Button>
        </div>
      </nav>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
          
          <div className="space-y-6 text-sm leading-relaxed">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-2">Future Foundry</h2>
              <p><strong>Effective Date:</strong> {termsContent.effectiveDate}</p>
            </div>

            {termsContent.sections.map((section, index) => (
              <section key={index}>
                <h2 className="text-xl font-semibold mt-8 mb-4">{section.title}</h2>
                <div className="whitespace-pre-wrap">{section.content}</div>
              </section>
            ))}

            <section className="mt-12">
              <div className="bg-muted/50 p-4 rounded-lg">
                <p><strong>Future Foundry</strong></p>
                <p>555 North El Camino Real</p>
                <p>San Clemente, California, 92672</p>
                <p>Email: info@futurefoundryai.com</p>
                <p>Website: futurefoundryai.com</p>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-12">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={handleBackToApp}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Lead Machine
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;