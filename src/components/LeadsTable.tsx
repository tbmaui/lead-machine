import { Lead } from "@/hooks/useLeadGeneration";
import { ExternalLink } from "lucide-react";

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

  return (
    <div className="neu-card overflow-hidden">
      <table className="w-full table-fixed border-collapse">
        <thead>
          <tr className="border-b border-border text-muted-foreground">
            <th className="text-left p-3 font-medium text-xs uppercase tracking-wide">Name</th>
            <th className="text-left p-3 font-medium text-xs uppercase tracking-wide">Title</th>
            <th className="text-left p-3 font-medium text-xs uppercase tracking-wide">Company</th>
            <th className="text-left p-3 font-medium text-xs uppercase tracking-wide">Phone</th>
            <th className="text-left p-3 font-medium text-xs uppercase tracking-wide">Email</th>
            <th className="text-left p-3 font-medium text-xs uppercase tracking-wide">Location</th>
            <th className="text-left p-3 font-medium text-xs uppercase tracking-wide">Score</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead, index) => {
            const companyWebsite = getCompanyWebsite(lead);
            const companyLinkedIn = getCompanyLinkedIn(lead);
            const contactLinkedIn = getContactLinkedIn(lead);
            
            return (
              <tr key={index} className="border-b border-border transition-colors hover:bg-accent/30">
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground break-words">{lead.name}</span>
                    {contactLinkedIn && (
                      <a href={contactLinkedIn} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </td>
                <td className="p-3">
                  <div className="text-foreground/80 break-words">{lead.title || 'N/A'}</div>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-foreground/80 break-words">
                      {lead.company || 
                       (lead.additional_data as any)?.company ||
                       (lead.additional_data as any)?.Company ||
                       'N/A'}
                    </span>
                    <div className="flex gap-1">
                      {companyWebsite && (
                        <a href={companyWebsite} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                      {companyLinkedIn && (
                        <a href={companyLinkedIn} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </td>
                <td className="p-3">
                  {lead.phone ? (
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getPhoneStatusColor(lead.phone)}`}></div>
                      <span className="text-foreground/80 break-words">{lead.phone}</span>
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
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getEmailStatusColor(lead.email)}`}></div>
                      <a href={`mailto:${lead.email}`} className="text-primary hover:underline break-words">
                        {lead.email}
                      </a>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                      <span className="text-muted-foreground">N/A</span>
                    </div>
                  )}
                </td>
                <td className="p-3">
                  <div className="text-foreground/80 break-words">
                    {getLocation(lead)}
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