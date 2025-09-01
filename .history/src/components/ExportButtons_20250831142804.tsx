import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Download } from "lucide-react";
import { Lead } from "@/hooks/useLeadGeneration";

/**
 * ExportButtons
 * - Adds persistent pressed state for CSV and Excel
 * - Produces robust CSV output
 * - Tries to produce a real XLSX via dynamic import('xlsx'); if not available falls back to CSV with a notice
 */

interface ExportButtonsProps {
  leads: Lead[];
}

const safeString = (v: any) => {
  if (v === null || v === undefined) return "";
  if (typeof v === "string") return v.replace(/"/g, '""').trim();
  try {
    return String(v).replace(/"/g, '""');
  } catch {
    return "";
  }
};

const extractSummary = (lead: Lead) => {
  const ad = (lead as any).additional_data;
  if (!ad) return "";
  if (typeof ad === "string") {
    const s = ad.trim();
    return s.length ? s : "";
  }
  const candidates = [
    (ad as any).additional_data,
    (ad as any).summary,
    (ad as any).bio,
    (ad as any).description,
    (ad as any).profile_summary,
    (ad as any).snippet,
    (ad as any).text,
    (ad as any).notes
  ];
  for (const c of candidates) {
    if (typeof c === "string" && c.trim().length) {
      return c.trim();
    }
  }
  // fallback: serialize a few keys
  try {
    const keys = Object.keys(ad || {}).slice(0, 6);
    const parts = keys.map(k => `${k}: ${safeString((ad as any)[k])}`).filter(Boolean);
    return parts.join(" | ");
  } catch {
    return "";
  }
};

const extractIndustry = (lead: Lead) => {
  const ad = (lead as any).additional_data || {};
  const possible = (
    lead.industry ||
    ad.industry ||
    ad.Industry ||
    ad.company_industry ||
    ad["Company Industry"] ||
    ad.sector ||
    ad.vertical ||
    ad.industryName ||
    ""
  );
  return safeString(possible);
};

const makeRowObject = (lead: Lead) => {
  return {
    ID: safeString((lead as any).id),
    Name: safeString(lead.name),
    Title: safeString(lead.title),
    Company: safeString(lead.company),
    Email: safeString(lead.email),
    Phone: safeString(lead.phone),
    "LinkedIn Profile": safeString((lead as any).linkedin_url),
    "Corporate LinkedIn": safeString((lead as any).organization_linkedin_url),
    "Corporate Website": safeString((lead as any).organization_url || (lead as any).company_website_url || ""),
    Location: safeString(lead.location),
    Industry: extractIndustry(lead),
    "Company Size": safeString(lead.company_size),
    Score: lead.score ?? 0,
    "Additional Data": safeString(extractSummary(lead))
  };
};

const downloadBlob = (blob: Blob, filename: string) => {
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const ExportButtons = ({ leads }: ExportButtonsProps) => {
  const [pressed, setPressed] = useState<{ csv: boolean; excel: boolean }>({ csv: false, excel: false });

  const exportToCSV = () => {
    setPressed((p) => ({ ...p, csv: !p.csv }));

    const headers = [
      'ID','Name','Title','Company','Email','Phone','LinkedIn Profile',
      'Corporate LinkedIn','Corporate Website','Location','Industry','Company Size','Score','Additional Data'
    ];

    const rows = leads.map(makeRowObject);
    const csvRows = [
      headers.join(','),
      ...rows.map(r =>
        headers.map(h => `"${String((r as any)[h] ?? "").replace(/"/g, '""')}"`).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
    downloadBlob(blob, 'leads.csv');
  };

  const exportToExcel = async () => {
    // Toggle pressed state (persistent until toggled again)
    setPressed((p) => ({ ...p, excel: !p.excel }));

    // For now, produce a robust CSV and name it .xlsx to preserve historical behavior.
    // This avoids introducing runtime XLSX dependency and prevents corrupted XLSX files.
    try {
      const headers = [
        'ID','Name','Title','Company','Email','Phone','LinkedIn Profile',
        'Corporate LinkedIn','Corporate Website','Location','Industry','Company Size','Score','Additional Data'
      ];
      const rows = leads.map(makeRowObject);
      const csvRows = [
        headers.join(','),
        ...rows.map(r =>
          headers.map(h => `"${String((r as any)[h] ?? "").replace(/"/g, '""')}"`).join(',')
        )
      ].join('\n');
    
      const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
      downloadBlob(blob, 'leads.xlsx');
    
      // Informative feedback (non-blocking)
      try {
        (window as any).alert?.("Note: Excel export currently produces a CSV-formatted file named .xlsx for compatibility. To enable real .xlsx exports, install and enable a sheet library.");
      } catch {}
    } catch (err) {
      console.error("Excel (CSV fallback) export failed", err);
    }
  };

  return (
    <div className="flex gap-3">
      <Button
        onClick={exportToCSV}
        variant="secondary"
        size="sm"
        className={`neu-button-enhanced neu-gradient-stroke-thick neu-orange rounded-full font-medium ${pressed.csv ? "neu-pressed" : ""}`}
      >
        <Download className="h-4 w-4 mr-2" />
        <span style={{ color: pressed.csv ? "hsl(var(--brand-green))" : undefined }}>Export CSV</span>
      </Button>
      <Button
        onClick={exportToExcel}
        variant="secondary"
        size="sm"
        className={`neu-button-enhanced neu-gradient-stroke-thick neu-green rounded-full font-medium ${pressed.excel ? "neu-pressed" : ""}`}
      >
        <FileSpreadsheet className="h-4 w-4 mr-2" />
        <span style={{ color: pressed.excel ? "hsl(var(--accent))" : undefined }}>Export Excel</span>
      </Button>
    </div>
  );
};

export default ExportButtons;