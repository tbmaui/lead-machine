import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TermsOfServiceProps {
  onClose?: () => void;
}

export function TermsOfService({ onClose }: TermsOfServiceProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="border-b border-border px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Terms of Service</h1>
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="rounded-full p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="prose prose-sm max-w-none space-y-6">
            {/* Header */}
            <section className="text-center border-b border-border pb-4 mb-6">
              <h2 className="text-lg font-semibold text-foreground mb-3">Terms of Service</h2>
              <p className="text-muted-foreground mb-2">
                Effective Date: {new Date().toLocaleDateString()}
              </p>
              <p className="text-sm text-muted-foreground">
                These Terms of Service (the "Agreement") are a binding legal contract between you ("User," "you," or "your") and Future Foundry, a Delaware corporation ("Future Foundry," "we," "our," or "us"). By accessing or using any part of our software-as-a-service platform (the "Service"), you agree to be bound by the terms of this Agreement.
              </p>
              <p className="text-sm text-muted-foreground font-medium mt-2">
                If you do not agree to these Terms, you may not access or use the Service.
              </p>
            </section>

            {/* Section 1: Eligibility */}
            <section>
              <h3 className="text-base font-semibold text-foreground mb-2">1. ELIGIBILITY</h3>
              <p className="text-sm text-muted-foreground">
                You must be at least 18 years of age (or the age of majority in your jurisdiction) and have the legal capacity to enter into binding contracts to access or use the Service. By using the Service, you represent and warrant that you meet these eligibility requirements.
              </p>
            </section>

            {/* Section 2: License and Acceptable Use */}
            <section>
              <h3 className="text-base font-semibold text-foreground mb-2">2. LICENSE AND ACCEPTABLE USE</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-1">2.1 Limited License</h4>
                  <p className="text-sm text-muted-foreground">
                    Subject to your compliance with this Agreement, Future Foundry grants you a limited, revocable, non-exclusive, non-transferable, non-sublicensable license to access and use the Service solely for your internal business purposes.
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-1">2.2 Restrictions</h4>
                  <p className="text-sm text-muted-foreground mb-2">You shall not:</p>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Reproduce, modify, or distribute the Service or any content;</li>
                    <li>• License, sell, or use the Service for the benefit of third parties;</li>
                    <li>• Interfere with or attempt to breach the security or integrity of the Service;</li>
                    <li>• Use the Service in violation of applicable laws or regulations.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 3: User Accounts */}
            <section>
              <h3 className="text-base font-semibold text-foreground mb-2">3. USER ACCOUNTS</h3>
              <p className="text-sm text-muted-foreground">
                You are responsible for maintaining the confidentiality of your login credentials. You are fully responsible for all activities that occur under your account. You must promptly notify Future Foundry of any unauthorized access or use.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                We reserve the right to suspend or terminate any account at our discretion.
              </p>
            </section>

            {/* Section 4: Fees and Payments */}
            <section>
              <h3 className="text-base font-semibold text-foreground mb-2">4. FEES AND PAYMENTS</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-1">4.1 Fees</h4>
                  <p className="text-sm text-muted-foreground">
                    Access to certain features of the Service may require payment of fees, as described on our website or in separate agreements. You agree to pay all applicable fees in accordance with billing terms in effect at the time.
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-1">4.2 No Refunds</h4>
                  <p className="text-sm text-muted-foreground">
                    All payments are final. Future Foundry maintains a strict no-refund policy, regardless of usage, account status, or technical issues not attributable to us.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 5: Termination */}
            <section>
              <h3 className="text-base font-semibold text-foreground mb-2">5. TERMINATION</h3>
              <p className="text-sm text-muted-foreground">
                We may suspend or terminate your access to the Service at any time, with or without notice, for any reason or no reason. Upon termination, your right to use the Service will cease, and we may delete all associated data.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                You may terminate your account at any time; however, you will remain liable for any unpaid fees.
              </p>
            </section>

            {/* Section 6: Intellectual Property */}
            <section>
              <h3 className="text-base font-semibold text-foreground mb-2">6. INTELLECTUAL PROPERTY</h3>
              <p className="text-sm text-muted-foreground">
                All rights, title, and interest in and to the Service, including but not limited to all software, features, content, trademarks, logos, and documentation, are and shall remain the exclusive property of Future Foundry or its licensors. No rights are granted except as expressly set forth in this Agreement.
              </p>
            </section>

            {/* Section 7: User-Generated Content */}
            <section>
              <h3 className="text-base font-semibold text-foreground mb-2">7. USER-GENERATED CONTENT</h3>
              <p className="text-sm text-muted-foreground mb-2">
                You retain ownership of any data, files, or other materials ("User Content") you upload or transmit through the Service. You grant Future Foundry a worldwide, perpetual, irrevocable, royalty-free, non-exclusive, sublicensable license to use, reproduce, display, modify, distribute, and host User Content for the purpose of operating and improving the Service.
              </p>
              <p className="text-sm text-muted-foreground mb-2">You represent and warrant that:</p>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4 mb-2">
                <li>• You own or have rights to upload the User Content;</li>
                <li>• Your User Content does not violate any third-party rights or laws.</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                We are not liable for any User Content and assume no responsibility to monitor it.
              </p>
            </section>

            {/* Section 8: Disclaimer of Warranties */}
            <section>
              <h3 className="text-base font-semibold text-foreground mb-2">8. DISCLAIMER OF WARRANTIES</h3>
              <p className="text-sm text-muted-foreground mb-2">
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE." FUTURE FOUNDRY DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, AND UNINTERRUPTED ACCESS.
              </p>
              <p className="text-sm text-muted-foreground">
                USE OF THE SERVICE IS AT YOUR SOLE RISK. WE DO NOT GUARANTEE THAT THE SERVICE WILL BE AVAILABLE AT ALL TIMES OR FREE OF ERRORS OR MALWARE.
              </p>
            </section>

            {/* Section 9: Limitation of Liability */}
            <section>
              <h3 className="text-base font-semibold text-foreground mb-2">9. LIMITATION OF LIABILITY</h3>
              <p className="text-sm text-muted-foreground mb-2">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, FUTURE FOUNDRY SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOST PROFITS, LOST DATA, BUSINESS INTERRUPTION, OR SYSTEM FAILURE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
              </p>
              <p className="text-sm text-muted-foreground">
                OUR TOTAL LIABILITY FOR ANY CLAIM ARISING OUT OF OR RELATING TO THIS AGREEMENT OR THE SERVICE SHALL NOT EXCEED THE AMOUNT PAID BY YOU TO US IN THE SIX (6) MONTHS PRECEDING THE CLAIM.
              </p>
            </section>

            {/* Section 10: Indemnification */}
            <section>
              <h3 className="text-base font-semibold text-foreground mb-2">10. INDEMNIFICATION</h3>
              <p className="text-sm text-muted-foreground mb-2">
                You agree to indemnify, defend, and hold harmless Future Foundry, its officers, directors, employees, contractors, affiliates, and licensors from and against any and all claims, damages, liabilities, costs, and expenses (including attorneys' fees) arising out of or related to:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Your use of the Service;</li>
                <li>• Your violation of this Agreement;</li>
                <li>• Your User Content;</li>
                <li>• Your violation of any law or third-party rights.</li>
              </ul>
            </section>

            {/* Section 11: Privacy Policy */}
            <section>
              <h3 className="text-base font-semibold text-foreground mb-2">11. PRIVACY POLICY</h3>
              <p className="text-sm text-muted-foreground mb-2">
                By using the Service, you acknowledge and agree to the collection and use of your data in accordance with our Privacy Policy, including:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4 mb-2">
                <li>• Collection of analytics, usage, and metadata;</li>
                <li>• Use of cookies and similar technologies;</li>
                <li>• Sharing with third-party vendors and service providers;</li>
                <li>• Cross-border data transfers, including to the United States.</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                We use commercially reasonable efforts to safeguard your data but do not guarantee absolute security.
              </p>
            </section>

            {/* Section 12: Third-Party Services */}
            <section>
              <h3 className="text-base font-semibold text-foreground mb-2">12. THIRD-PARTY SERVICES AND PROCESSORS</h3>
              <p className="text-sm text-muted-foreground mb-2">
                The Service may incorporate or integrate with services, platforms, or data processors provided by third parties. By using the Service, you acknowledge and consent to our use of third-party service providers for hosting, analytics, billing, communication, and more.
              </p>
              <p className="text-sm text-muted-foreground">
                Future Foundry is not responsible for the actions or data handling practices of any third-party services.
              </p>
            </section>

            {/* Section 13: Analytics */}
            <section>
              <h3 className="text-base font-semibold text-foreground mb-2">13. ANALYTICS</h3>
              <p className="text-sm text-muted-foreground mb-2">
                We use automated tools and third-party services to collect analytics data, including but not limited to session activity, user behavior, traffic sources, and device/browser characteristics. This information is used to:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4 mb-2">
                <li>• Improve and optimize the Service;</li>
                <li>• Diagnose technical issues;</li>
                <li>• Develop new features;</li>
                <li>• Monitor usage trends.</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                You consent to the collection and use of such data.
              </p>
            </section>

            {/* Section 14: DMCA Policy */}
            <section>
              <h3 className="text-base font-semibold text-foreground mb-2">14. DMCA POLICY</h3>
              <p className="text-sm text-muted-foreground mb-2">
                If you believe that your copyrighted work has been used in violation of the Digital Millennium Copyright Act (DMCA), please submit a written notice to our designated agent:
              </p>
              <div className="bg-muted/20 p-3 rounded text-sm text-muted-foreground mb-2">
                <strong>DMCA Agent:</strong><br />
                Legal Department<br />
                Future Foundry<br />
                555 North El Camino Real<br />
                San Clemente, California, 92672<br />
                Email: info@futurefoundry.com
              </div>
              <p className="text-sm text-muted-foreground mb-2">Your DMCA notice must include:</p>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• A physical or electronic signature;</li>
                <li>• Description of the copyrighted work;</li>
                <li>• URL or location of the infringing material;</li>
                <li>• Your contact information;</li>
                <li>• A statement of good faith belief;</li>
                <li>• A statement under penalty of perjury of the accuracy of your claim.</li>
              </ul>
            </section>

            {/* Section 15: Arbitration Agreement */}
            <section>
              <h3 className="text-base font-semibold text-foreground mb-2">15. ARBITRATION AGREEMENT</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-1">15.1 Binding Arbitration</h4>
                  <p className="text-sm text-muted-foreground">
                    You and Future Foundry agree to resolve any dispute, claim, or controversy relating to this Agreement or the Service through final and binding arbitration, administered by the American Arbitration Association (AAA) in accordance with its Commercial Arbitration Rules.
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-1">15.2 Class Action Waiver</h4>
                  <p className="text-sm text-muted-foreground">
                    You agree that any arbitration shall be conducted only on an individual basis and not in a class, collective, or representative proceeding. You expressly waive any right to participate in class actions or class arbitrations.
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-1">15.3 Location and Governing Law</h4>
                  <p className="text-sm text-muted-foreground">
                    The arbitration shall take place in Delaware, and this Agreement shall be governed by and construed in accordance with the laws of the State of Delaware, without regard to conflict of law principles.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 16: Governing Law */}
            <section>
              <h3 className="text-base font-semibold text-foreground mb-2">16. GOVERNING LAW</h3>
              <p className="text-sm text-muted-foreground">
                This Agreement and any dispute arising hereunder shall be governed by the laws of the State of Delaware, excluding its conflicts of laws principles.
              </p>
            </section>

            {/* Section 17: Modifications */}
            <section>
              <h3 className="text-base font-semibold text-foreground mb-2">17. MODIFICATIONS</h3>
              <p className="text-sm text-muted-foreground">
                We may modify these Terms at any time in our sole discretion. We will provide notice via the Service or by other means. Your continued use of the Service after such notice constitutes your acceptance of the changes. It is your responsibility to review the Terms periodically.
              </p>
            </section>

            {/* Section 18: Entire Agreement */}
            <section>
              <h3 className="text-base font-semibold text-foreground mb-2">18. ENTIRE AGREEMENT</h3>
              <p className="text-sm text-muted-foreground">
                This Agreement constitutes the entire agreement between you and Future Foundry with respect to the Service and supersedes all prior or contemporaneous agreements or representations, whether written or oral.
              </p>
            </section>

            {/* Section 19: Contact Information */}
            <section>
              <h3 className="text-base font-semibold text-foreground mb-2">19. CONTACT INFORMATION</h3>
              <p className="text-sm text-muted-foreground mb-2">
                If you have any questions about these Terms, please contact us at:
              </p>
              <div className="bg-muted/20 p-3 rounded text-sm text-muted-foreground">
                <strong>Future Foundry</strong><br />
                555 North El Camino Real<br />
                San Clemente, California 92672<br />
                Email: <a href="mailto:info@futurefoundry.com" className="text-primary hover:underline">info@futurefoundry.com</a>
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border px-6 py-4 bg-muted/20">
          <p className="text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()} Future Foundry AI. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}