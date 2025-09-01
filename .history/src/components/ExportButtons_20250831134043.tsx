import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Download } from "lucide-react";
import { Lead } from "@/hooks/useLeadGeneration";

interface ExportButtonsProps {
  leads: Lead[];
}

const ExportButtons = ({ leads }: ExportButtonsProps) => {
  const exportToCSV = () => {
    // Include all Lead fields as headers
    const headers = [
      'ID',
      'Name',
      'Title',
      'Company',
      'Email',
      'Phone',
      'LinkedIn Profile',
      'Corporate LinkedIn',
      'Corporate Website',
      'Location',
      'Industry',
      'Company Size',
      'Score',
      'Additional Data'
    ];

    const csvContent = [
      headers.join(','),
      ...leads.map(lead => [
        `"${lead.id}"`,
        `"${lead.name || ''}"`,
        `"${lead.title || ''}"`,
        `"${lead.company || ''}"`,
        `"${lead.email || ''}"`,
        `"${lead.phone || ''}"`,
        `"${lead.linkedin_url || ''}"`,
        `"${lead.organization_linkedin_url || ''}"`,
        `"${lead.organization_url || ''}"`,
        `"${lead.location || ''}"`,
        `"${lead.industry || ''}"`,
        `"${lead.company_size || ''}"`,
        `"${lead.score || 0}"`,
        `"${lead.additional_data ? JSON.stringify(lead.additional_data).replace(/"/g, '""') : ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'leads.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = () => {
    // For proper Excel export, we need to generate a more complex format
    // For now, using CSV with .xlsx extension and Excel-compatible quoting
    const headers = [
      'ID',
      'Name',
      'Title',
      'Company',
      'Email',
      'Phone',
      'LinkedIn Profile',
      'Corporate LinkedIn',
      'Corporate Website',
      'Location',
      'Industry',
      'Company Size',
      'Score',
      'Additional Data'
    ];

    const csvContent = [
      headers.join(','),
      ...leads.map(lead => [
        `"${lead.id}"`,
        `"${lead.name || ''}"`,
        `"${lead.title || ''}"`,
        `"${lead.company || ''}"`,
        `"${lead.email || ''}"`,
        `"${lead.phone || ''}"`,
        `"${lead.linkedin_url || ''}"`,
        `"${lead.organization_linkedin_url || ''}"`,
        `"${lead.organization_url || ''}"`,
        `"${lead.location || ''}"`,
        `"${lead.industry || ''}"`,
        `"${lead.company_size || ''}"`,
        `"${lead.score || 0}"`,
        `"${lead.additional_data ? JSON.stringify(lead.additional_data).replace(/"/g, '""') : ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'leads.xlsx');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex gap-3">
      <Button
        onClick={exportToCSV}
        variant="secondary"
        size="sm"
        className="neu-button-enhanced neu-orange rounded-full font-medium"
      >
        <Download className="h-4 w-4 mr-2" />
        Export CSV
      </Button>
      <Button
        onClick={exportToExcel}
        variant="secondary"
        size="sm"
        className="neu-button-enhanced neu-green rounded-full font-medium"
      >
        <FileSpreadsheet className="h-4 w-4 mr-2" />
        Export Excel
      </Button>
    </div>
  );
};

export default ExportButtons;