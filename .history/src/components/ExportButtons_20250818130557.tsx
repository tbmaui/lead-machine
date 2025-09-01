import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Download } from "lucide-react";
import { Lead } from "@/hooks/useLeadGeneration";

interface ExportButtonsProps {
  leads: Lead[];
}

const ExportButtons = ({ leads }: ExportButtonsProps) => {
  const exportToCSV = () => {
    const headers = ['Name', 'Title', 'Company', 'Phone', 'Email', 'Location', 'Score'];
    const csvContent = [
      headers.join(','),
      ...leads.map(lead => [
        `"${lead.name || ''}"`,
        `"${lead.title || ''}"`,
        `"${lead.company || (lead.additional_data as any)?.company || (lead.additional_data as any)?.Company || ''}"`,
        `"${lead.phone || ''}"`,
        `"${lead.email || ''}"`,
        `"${lead.location || (lead.additional_data as any)?.location || (lead.additional_data as any)?.city || ''}"`,
        `"${lead.score || 0}"`
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
    // For now, export as CSV with .xlsx extension
    // In a real app, you'd use a library like xlsx
    exportToCSV();
  };

  return (
    <div className="flex gap-2">
      <Button 
        onClick={exportToCSV}
        className="bg-green-600 hover:bg-green-700 text-white"
        size="sm"
      >
        <Download className="h-4 w-4 mr-2" />
        Export CSV
      </Button>
      <Button 
        onClick={exportToExcel}
        className="bg-blue-600 hover:bg-blue-700 text-white"
        size="sm"
      >
        <FileSpreadsheet className="h-4 w-4 mr-2" />
        Export Excel
      </Button>
    </div>
  );
};

export default ExportButtons;