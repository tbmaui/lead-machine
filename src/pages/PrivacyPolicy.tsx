import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const PrivacyPolicy = () => {
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
          <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
          
          <div className="space-y-6 text-sm leading-relaxed">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-2">Future Foundry</h2>
              <p><strong>Effective Date:</strong> August 31, 2025</p>
            </div>

            <p>
              Future Foundry ("Company," "we," "us," or "our") respects your privacy and is committed to protecting your personal information. 
              This Privacy Policy explains how we collect, use, share, and safeguard your data when you access or use our website, platform, 
              and services (collectively, the "Service").
            </p>

            <p>
              By using the Service, you agree to the terms of this Privacy Policy.
            </p>

            <section>
              <h2 className="text-xl font-semibold mt-8 mb-4">1. INFORMATION WE COLLECT</h2>
              <p>We collect the following categories of personal data:</p>

              <h3 className="text-lg font-medium mt-6 mb-3">1.1 Information You Provide to Us</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Name, email address, phone number</li>
                <li>Company name and job title</li>
                <li>Billing and payment information</li>
                <li>Any other information you choose to provide</li>
              </ul>

              <h3 className="text-lg font-medium mt-6 mb-3">1.2 Information We Collect Automatically</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Device and browser data</li>
                <li>IP address and geolocation</li>
                <li>Usage data (e.g., pages visited, features used)</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>

              <h3 className="text-lg font-medium mt-6 mb-3">1.3 Information from Third Parties</h3>
              <p>We may receive information about you from third-party services (e.g., login providers, analytics, or payment processors).</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-8 mb-4">2. HOW WE USE YOUR INFORMATION</h2>
              <p>We use your personal data to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Provide and maintain the Service</li>
                <li>Process transactions and manage billing</li>
                <li>Communicate with you (support, service announcements, marketing)</li>
                <li>Monitor and analyze platform usage</li>
                <li>Improve our Service and develop new features</li>
                <li>Enforce legal agreements and protect our rights</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-8 mb-4">3. LEGAL BASES FOR PROCESSING (IF UNDER GDPR)</h2>
              <p>We process your personal data based on one or more of the following legal grounds:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Performance of a contract</li>
                <li>Legitimate interests</li>
                <li>Compliance with legal obligations</li>
                <li>Consent (for optional marketing and similar activities)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-8 mb-4">4. COOKIES AND TRACKING</h2>
              <p>
                We use cookies, beacons, and similar technologies to enhance functionality and analyze performance. 
                You may disable cookies in your browser settings, though certain functionality may be affected.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-8 mb-4">5. SHARING YOUR INFORMATION</h2>
              <p>We may share your information with:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Service providers and vendors:</strong> For hosting, analytics, support, payment processing, etc.</li>
                <li><strong>Law enforcement or regulatory bodies:</strong> When legally required</li>
                <li><strong>In business transfers:</strong> If we are involved in a merger, acquisition, or sale of assets</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-8 mb-4">6. DATA RETENTION</h2>
              <p>
                We retain your data for as long as necessary to fulfill the purposes outlined in this Privacy Policy, 
                or as required by law. We may retain anonymized or aggregated data indefinitely.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-8 mb-4">7. INTERNATIONAL TRANSFERS</h2>
              <p>
                If you are located outside the United States, your information may be transferred to and processed in the 
                United States or other jurisdictions that may not have the same data protection laws. By using the Service, 
                you consent to such transfers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-8 mb-4">8. YOUR RIGHTS</h2>
              <p>Depending on your jurisdiction (e.g., EU, UK, California), you may have the right to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Access or obtain a copy of your personal data</li>
                <li>Correct inaccurate information</li>
                <li>Delete or restrict your data</li>
                <li>Object to processing</li>
                <li>Withdraw consent</li>
                <li>File a complaint with a supervisory authority</li>
              </ul>
              <p className="mt-3">To exercise these rights, contact us at: [Insert Contact Email]</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-8 mb-4">9. SECURITY</h2>
              <p>
                We implement commercially reasonable safeguards to protect your personal information. However, 
                no method of transmission over the internet is completely secure.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-8 mb-4">10. CHILDREN'S PRIVACY</h2>
              <p>
                The Service is not intended for use by children under the age of 13 (or 16 in the EU). 
                We do not knowingly collect personal data from children.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-8 mb-4">11. CHANGES TO THIS PRIVACY POLICY</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any material changes via email 
                or by posting a notice on the Service. Your continued use of the Service constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mt-8 mb-4">12. CONTACT US</h2>
              <p>If you have any questions about this Privacy Policy or our data practices, please contact:</p>
              <div className="bg-muted/50 p-4 rounded-lg mt-4">
                <p><strong>Future Foundry</strong></p>
                <p>555 North El Camino Real</p>
                <p>San Clemente, California, 92672</p>
                <p>Email: info@futurefoundryai.com</p>
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

export default PrivacyPolicy;