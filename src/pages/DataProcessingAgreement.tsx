import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const DataProcessingAgreement = () => {
  const navigate = useNavigate();
  
  const handleBackToApp = () => {
    // Try to go back in history, but fallback to home if no history
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
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
          <h1 className="text-3xl font-bold mb-8">Data Processing Agreement (DPA)</h1>
          
          <div className="space-y-6 text-sm leading-relaxed">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-2">Future Foundry</h2>
              <p><strong>Effective Date:</strong> [Insert Effective Date]</p>
            </div>

            <p>This Data Processing Agreement ("DPA") is entered into by and between:</p>
            
            <p><strong>Customer</strong> ("Controller" or "you"), and</p>
            
            <p><strong>Future Foundry</strong>, a Delaware corporation with a principal business address at 555 North El Camino Real, San Clemente, California, 92672 ("Processor" or "we").</p>

            <p>This DPA governs our processing of personal data on your behalf in connection with your use of the Future Foundry SaaS platform (the "Service").</p>

            <section>
              <h2 className="text-xl font-semibold mt-8 mb-4">1. DEFINITIONS</h2>
              <ul className="space-y-2">
                <li><strong>"Personal Data"</strong> means any information relating to an identified or identifiable natural person.</li>
                <li><strong>"Processing," "Data Subject," "Controller," and "Processor"</strong> have the meanings set forth in applicable data protection laws, including GDPR.</li>
                <li><strong>"Applicable Law"</strong> means all applicable privacy and data protection laws (e.g., GDPR, CCPA).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-8 mb-4">2. NATURE AND PURPOSE OF PROCESSING</h2>
              <p>Future Foundry processes Personal Data solely to provide, maintain, and support the Service as described in the Terms of Service, including:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Account management</li>
                <li>Customer support</li>
                <li>Billing and payments</li>
                <li>Usage analytics</li>
                <li>Product improvements</li>
              </ul>
              <p>We do not process Personal Data for any purpose other than those expressly authorized by the Controller.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-8 mb-4">3. TYPES OF PERSONAL DATA PROCESSED</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>Names</li>
                <li>Email addresses</li>
                <li>Company contact information</li>
                <li>IP addresses</li>
                <li>Usage data</li>
                <li>Other Personal Data submitted via the Service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-8 mb-4">4. DATA SUBJECTS</h2>
              <p>Data subjects may include:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Customer's employees, contractors, or end-users</li>
                <li>Individuals whose information is submitted by or through the Controller</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-8 mb-4">5. CONTROLLER RESPONSIBILITIES</h2>
              <p>The Controller:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Confirms it has a legal basis for collecting and sharing Personal Data</li>
                <li>Will not instruct Processor to process Personal Data unlawfully</li>
                <li>Is solely responsible for the accuracy and legality of the data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-8 mb-4">6. PROCESSOR OBLIGATIONS</h2>
              <p>Future Foundry will:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Process Personal Data only under documented instructions</li>
                <li>Maintain appropriate technical and organizational measures to protect Personal Data</li>
                <li>Ensure staff are subject to confidentiality obligations</li>
                <li>Notify Controller without undue delay of any data breach</li>
                <li>Assist Controller in responding to Data Subject rights requests, impact assessments, and compliance requests</li>
                <li>At termination, delete or return Personal Data unless required by law to retain it</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-8 mb-4">7. SUB-PROCESSORS</h2>
              <p>
                Future Foundry may use third-party Sub-processors to support the Service. A current list is available upon request. 
                We will enter into written agreements with all Sub-processors imposing equivalent data protection obligations.
              </p>
              <p>Controller authorizes the use of Sub-processors.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-8 mb-4">8. DATA TRANSFERS</h2>
              <p>
                If Personal Data is transferred outside the EEA, UK, or other jurisdiction with similar protections, we will ensure 
                appropriate safeguards are in place (e.g., Standard Contractual Clauses or equivalent measures).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-8 mb-4">9. AUDIT RIGHTS</h2>
              <p>
                Upon written request, Processor shall make available relevant information to demonstrate compliance. Processor may 
                limit the frequency and scope of audits and charge a reasonable fee if audits become excessive or disruptive.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-8 mb-4">10. TERM AND TERMINATION</h2>
              <p>
                This DPA remains in effect for the duration of the Service or as long as Processor processes Personal Data on behalf 
                of Controller. Upon termination, Processor will delete or return all Personal Data, unless legally required to retain it.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-8 mb-4">11. LIABILITY</h2>
              <p>
                Each party shall be liable for its own compliance with applicable data protection laws and the terms of this DPA.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-8 mb-4">12. CONTACT INFORMATION</h2>
              <p>For questions or concerns regarding data processing:</p>
              <div className="bg-muted/50 p-4 rounded-lg mt-4">
                <p><strong>Future Foundry</strong></p>
                <p>555 North El Camino Real</p>
                <p>San Clemente, California, 92672</p>
                <p>Email: info@futurefoundryai.com</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-8 mb-4">13. GOVERNING LAW</h2>
              <p>
                This DPA shall be governed by the laws of the State of Delaware, without regard to conflict of law rules.
              </p>
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

export default DataProcessingAgreement;