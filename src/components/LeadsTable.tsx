import { Lead } from "@/hooks/useLeadGeneration";
import { ExternalLink, Linkedin, Copy } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/sonner";

interface LeadsTableProps {
  leads: Lead[];
}

const LeadsTable = ({ leads }: LeadsTableProps) => {
  const getPhoneStatusColor = (phone?: string) => {
    if (!phone || phone.trim() === '') return 'bg-gray-300';
    // Simple verification logic - in real app this would come from backend
    return Math.random() > 0.3 ? 'bg-green-500' : 'bg-orange-500';
  };

  const getEmailStatusColor = (email?: string) => {
    if (!email || email.trim() === '') return 'bg-gray-300';
    // Simple verification logic - in real app this would come from backend
    return Math.random() > 0.3 ? 'bg-green-500' : 'bg-orange-500';
  };

  const renderStars = (score: number) => {
    const stars = [];
    const fullStars = Math.floor(score);
    
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span 
          key={i} 
          className={i < fullStars ? 'text-green-500' : 'text-gray-300'}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  const getCompanyWebsite = (lead: Lead) => {
    return (lead.additional_data as any)?.organization_url ||
           (lead.additional_data as any)?.company_website ||
           (lead.additional_data as any)?.website;
  };

  const getCompanyLinkedIn = (lead: Lead) => {
    return (lead.additional_data as any)?.organization_linkedin_url ||
           (lead.additional_data as any)?.company_linkedin;
  };

  const getContactLinkedIn = (lead: Lead) => {
    return (lead.additional_data as any)?.linkedin_url ||
           (lead.additional_data as any)?.profile_url;
  };

  const getLocation = (lead: Lead) => {
    const city = (lead.additional_data as any)?.city || '';
    const state = (lead.additional_data as any)?.state || '';
    const location = lead.location || '';
    
    if (city && state) {
      return `${city}, ${state}`;
    }
    return location || city || state || 'N/A';
  };

  const copyToClipboard = async (value: string, label: string) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = value;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      // Emit a DOM event for tests and integrations to observe copy actions
      document.dispatchEvent(new CustomEvent('lead-copy-success', { detail: { label, value } }));
      toast.success(`${label} copied`);
    } catch (err) {
      document.dispatchEvent(new CustomEvent('lead-copy-error', { detail: { label, value } }));
      toast.error(`Failed to copy ${label.toLowerCase()}`);
    }
  };

  return (
    <div className="neu-card overflow-hidden">
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="border-b border-border text-muted-foreground">
            <th className="text-left p-3 font-medium text-xs uppercase tracking-wide w-[20%]">Name</th>
            <th className="text-left p-3 font-medium text-xs uppercase tracking-wide w-[20%]">Title</th>
            <th className="text-left p-3 font-medium text-xs uppercase tracking-wide w-[22%]">Company</th>
            <th className="text-left p-3 font-medium text-xs uppercase tracking-wide w-[12%]">Phone</th>
            <th className="text-left p-3 font-medium text-xs uppercase tracking-wide w-[18%]">Email</th>
            <th className="text-left p-3 font-medium text-xs uppercase tracking-wide w-[12%]">Location</th>
            <th className="text-left p-3 font-medium text-xs uppercase tracking-wide w-[8%]">Score</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead, index) => {
            const companyWebsite = getCompanyWebsite(lead);
            const companyLinkedIn = getCompanyLinkedIn(lead);
            const contactLinkedIn = getContactLinkedIn(lead);
            const displayCompany =
              lead.company ||
              (lead.additional_data as any)?.company ||
              (lead.additional_data as any)?.Company ||
              'N/A';
            
            return (
              <tr key={index} className="border-b border-border transition-colors hover:bg-accent/30">
                <td className="p-3">
                  <div className="flex items-center gap-2 min-w-0 max-w-full">
                    <span
                      className="font-medium text-foreground truncate whitespace-nowrap overflow-hidden text-ellipsis max-w-[20ch] sm:max-w-[24ch] lg:max-w-[28ch]"
                      title={lead.name}
                    >
                      {lead.name}
                    </span>
                    {contactLinkedIn && (
                      <a
                        href={contactLinkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Open LinkedIn profile for ${lead.name}`}
                        onClick={(e) => e.stopPropagation()}
                        className={cn(
                          buttonVariants({ variant: "ghost", size: "sm" }),
                          "p-1 h-7 w-7"
                        )}
                      >
                        <Linkedin className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </td>
                <td className="p-3">
                  <div className="min-w-0 max-w-full">
                    <span
                      className="text-foreground/80 truncate whitespace-nowrap overflow-hidden text-ellipsis max-w-[24ch] sm:max-w-[28ch] lg:max-w-[32ch] inline-block"
                      title={lead.title || 'N/A'}
                    >
                      {lead.title || 'N/A'}
                    </span>
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2 min-w-0 max-w-full">
                    <span
                      className="text-foreground/80 truncate whitespace-nowrap overflow-hidden text-ellipsis max-w-[20ch] sm:max-w-[28ch] lg:max-w-[32ch]"
                      title={displayCompany}
                    >
                      {displayCompany}
                    </span>
                    <div className="flex gap-1">
                      {companyWebsite && (
                        <a
                          href={companyWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Open company website for ${displayCompany}`}
                          onClick={(e) => e.stopPropagation()}
                          className={cn(
                            buttonVariants({ variant: "ghost", size: "sm" }),
                            "p-1 h-7 w-7"
                          )}
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                      {companyLinkedIn && (
                        <a
                          href={companyLinkedIn}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Open company LinkedIn for ${displayCompany}`}
                          onClick={(e) => e.stopPropagation()}
                          className={cn(
                            buttonVariants({ variant: "ghost", size: "sm" }),
                            "p-1 h-7 w-7"
                          )}
                        >
                          <Linkedin className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </td>
                <td className="p-3">
                  {lead.phone ? (
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getPhoneStatusColor(lead.phone)}`}></div>
                      <span className="text-foreground/80">{lead.phone}</span>
                      <button
                        aria-label={`Copy phone ${lead.phone}`}
                        onClick={(e) => { e.stopPropagation(); copyToClipboard(lead.phone as string, 'Phone'); }}
                        className={cn(
                          buttonVariants({ variant: "ghost", size: "sm" }),
                          "p-1 h-7 w-7"
                        )}
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                      <span className="text-muted-foreground">N/A</span>
                    </div>
                  )}
                </td>
                <td className="p-3">
                  {lead.email ? (
                    <div className="flex items-center gap-2 min-w-0 max-w-full">
                      <div className={`w-2 h-2 rounded-full ${getEmailStatusColor(lead.email)}`}></div>
                      <a
                        href={`mailto:${lead.email}`}
                        className="text-primary hover:underline truncate whitespace-nowrap overflow-hidden text-ellipsis max-w-[28ch] sm:max-w-[32ch] lg:max-w-[40ch] min-w-0"
                        title={lead.email}
                      >
                        {lead.email}
                      </a>
                      <button
                        aria-label={`Copy email ${lead.email}`}
                        onClick={(e) => { e.stopPropagation(); copyToClipboard(lead.email as string, 'Email'); }}
                        className={cn(
                          buttonVariants({ variant: "ghost", size: "sm" }),
                          "p-1 h-7 w-7"
                        )}
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                      <span className="text-muted-foreground">N/A</span>
                    </div>
                  )}
                </td>
                <td className="p-3">
                  <div className="min-w-0 max-w-full">
                    <span
                      className="text-foreground/80 truncate whitespace-nowrap overflow-hidden text-ellipsis max-w-[24ch] sm:max-w-[28ch] lg:max-w-[32ch] inline-block"
                      title={getLocation(lead)}
                    >
                      {getLocation(lead)}
                    </span>
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex">
                    {renderStars(lead.score || 3)}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default LeadsTable;