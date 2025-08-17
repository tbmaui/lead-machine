import { Lead } from "@/hooks/useLeadGeneration";

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
          className={i < fullStars ? 'text-orange-400' : 'text-gray-300'}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left p-3 font-medium text-gray-600 text-sm uppercase tracking-wide">Name</th>
            <th className="text-left p-3 font-medium text-gray-600 text-sm uppercase tracking-wide">Title</th>
            <th className="text-left p-3 font-medium text-gray-600 text-sm uppercase tracking-wide">Company</th>
            <th className="text-left p-3 font-medium text-gray-600 text-sm uppercase tracking-wide">Phone</th>
            <th className="text-left p-3 font-medium text-gray-600 text-sm uppercase tracking-wide">Email</th>
            <th className="text-left p-3 font-medium text-gray-600 text-sm uppercase tracking-wide">Location</th>
            <th className="text-left p-3 font-medium text-gray-600 text-sm uppercase tracking-wide">Score</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead, index) => (
            <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="p-3">
                <div className="font-medium text-gray-900">{lead.name}</div>
              </td>
              <td className="p-3">
                <div className="text-gray-700">{lead.title || 'N/A'}</div>
              </td>
              <td className="p-3">
                <div className="text-gray-700">
                  {lead.company || 
                   (lead.additional_data as any)?.company ||
                   (lead.additional_data as any)?.Company ||
                   'N/A'}
                </div>
              </td>
              <td className="p-3">
                {lead.phone ? (
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getPhoneStatusColor(lead.phone)}`}></div>
                    <span className="text-gray-700">{lead.phone}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                    <span className="text-gray-400">N/A</span>
                  </div>
                )}
              </td>
              <td className="p-3">
                {lead.email ? (
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getEmailStatusColor(lead.email)}`}></div>
                    <span className="text-gray-700">{lead.email}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                    <span className="text-gray-400">N/A</span>
                  </div>
                )}
              </td>
              <td className="p-3">
                <div className="text-gray-700">
                  {lead.location || 
                   (lead.additional_data as any)?.location ||
                   (lead.additional_data as any)?.city ||
                   (lead.additional_data as any)?.state ||
                   'N/A'}
                </div>
              </td>
              <td className="p-3">
                <div className="flex">
                  {renderStars(lead.score || 3)}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeadsTable;