import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { TermsOfService } from "@/components/legal/TermsOfService";

const Footer = () => {
  const [showTerms, setShowTerms] = useState(false);
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-12">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          
          {/* Future Foundry AI Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Future Foundry AI</h4>
            <div className="space-y-2 text-xs text-muted-foreground">
              <p>Your Unfair Advantage in the Age of AI</p>
              <p>© {currentYear} Future Foundry AI</p>
              <p>All rights reserved.</p>
            </div>
          </div>

          {/* Lead Machine */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Lead Machine</h4>
            <div className="space-y-2 text-xs text-muted-foreground">
              <p>Professional lead generation platform</p>
              <p className="font-medium text-foreground">
                <a 
                  href="https://futurefoundryai.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-primary transition-colors"
                >
                  Visit futurefoundryai.com
                  <ExternalLink className="h-3 w-3" />
                </a>
              </p>
            </div>
          </div>

          {/* Legal Information */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Legal</h4>
            <div className="space-y-2 text-xs text-muted-foreground">
              <p>
                <button 
                  className="hover:text-primary transition-colors cursor-pointer"
                  onClick={() => window.open('#', '_blank')}
                >
                  Privacy Policy
                </button>
              </p>
              <p>
                <button 
                  className="hover:text-primary transition-colors cursor-pointer"
                  onClick={() => setShowTerms(true)}
                >
                  Terms of Service
                </button>
              </p>
              <p>
                <button 
                  className="hover:text-primary transition-colors cursor-pointer"
                  onClick={() => window.open('#', '_blank')}
                >
                  Data Processing Agreement
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Legal Notice */}
        <div className="border-t border-border/20 mt-8 pt-6">
          <div className="text-xs text-muted-foreground space-y-2 text-center">
            <p>
              <strong>Software License:</strong> This software is proprietary to Future Foundry AI. 
              Unauthorized reproduction, distribution, or modification is strictly prohibited.
            </p>
            <p>
              <strong>Data Processing:</strong> Lead data is processed in accordance with applicable privacy laws and regulations. 
              Users are responsible for compliance with data protection requirements in their jurisdiction.
            </p>
            <p>
              <strong>Support:</strong> Technical support and software maintenance provided by Future Foundry AI.
            </p>
          </div>
        </div>
      </div>

      {/* Terms of Service Modal */}
      {showTerms && (
        <TermsOfService onClose={() => setShowTerms(false)} />
      )}
    </footer>
  );
};

export default Footer;