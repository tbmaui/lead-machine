import { Card, CardContent } from "@/components/ui/card";
import { Lead } from "@/hooks/useLeadGeneration";

interface LeadGenStatsProps {
  leads: Lead[];
}

const LeadGenStats = ({ leads }: LeadGenStatsProps) => {
  const totalLeads = leads.length;
  const verifiedPhones = leads.filter(lead => lead.phone && lead.phone.trim() !== '').length;
  const verifiedEmails = leads.filter(lead => lead.email && lead.email.trim() !== '').length;
  
  // Count unique companies
  const uniqueCompanies = new Set(
    leads.map(lead => 
      lead.company || 
      (lead.additional_data as any)?.company ||
      (lead.additional_data as any)?.Company ||
      'Unknown'
    ).filter(company => company !== 'Unknown')
  ).size;

  const stats = [
    {
      number: totalLeads,
      label: "Total Leads",
      bgColor: "bg-[hsl(140_25%_88%)]",
      textColor: "text-[hsl(140_25%_35%)]"
    },
    {
      number: verifiedPhones,
      label: "Verified Phones",
      bgColor: "bg-[hsl(140_25%_88%)]",
      textColor: "text-[hsl(140_25%_35%)]"
    },
    {
      number: verifiedEmails,
      label: "Verified Emails",
      bgColor: "bg-[hsl(40_40%_88%)]",
      textColor: "text-[hsl(40_40%_35%)]"
    },
    {
      number: uniqueCompanies,
      label: "Unique Companies",
      bgColor: "bg-[hsl(40_40%_88%)]",
      textColor: "text-[hsl(40_40%_35%)]"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <Card key={index} className={`${stat.bgColor} border-0`}>
          <CardContent className="p-4 text-center">
            <div className={`text-3xl font-bold ${stat.textColor} mb-1`}>
              {stat.number}
            </div>
            <div className={`text-sm ${stat.textColor} opacity-80`}>
              {stat.label}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default LeadGenStats;