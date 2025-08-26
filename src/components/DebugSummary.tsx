import React from 'react';
import { Lead } from "@/hooks/useLeadGeneration";

interface DebugSummaryProps {
  leads: Lead[];
}

export const DebugSummary: React.FC<DebugSummaryProps> = ({ leads }) => {
  // Only show debug info for the first lead to avoid clutter
  const firstLead = leads[0];
  
  if (!firstLead) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 p-4 rounded mb-4">
        <h3 className="font-bold">🔍 Debug Summary Data</h3>
        <p>No leads available to debug</p>
      </div>
    );
  }

  const ad = firstLead.additional_data;
  
  return (
    <div className="bg-blue-50 border border-blue-400 text-blue-800 p-4 rounded mb-4 text-xs">
      <h3 className="font-bold mb-2">🔍 Debug Summary Data (First Lead: {firstLead.name})</h3>
      
      <div className="space-y-2">
        <div>
          <strong>additional_data type:</strong> {typeof ad}
        </div>
        
        {ad === null && <div>❌ additional_data is null</div>}
        {ad === undefined && <div>❌ additional_data is undefined</div>}
        
        {typeof ad === 'string' && (
          <div>
            <div><strong>String length:</strong> {ad.length}</div>
            <div><strong>First 200 chars:</strong> "{ad.substring(0, 200)}..."</div>
          </div>
        )}
        
        {typeof ad === 'object' && ad !== null && (
          <div className="space-y-1">
            <div><strong>Object keys ({Object.keys(ad).length}):</strong></div>
            <div className="ml-4 max-h-32 overflow-y-auto">
              {Object.keys(ad).map(key => (
                <div key={key} className="text-xs">
                  • <strong>{key}</strong>: {typeof (ad as any)[key]} 
                  {typeof (ad as any)[key] === 'string' && (ad as any)[key].length > 0 && 
                    ` ("${((ad as any)[key] as string).substring(0, 50)}${((ad as any)[key] as string).length > 50 ? '...' : ''}")`
                  }
                </div>
              ))}
            </div>
            
            {/* Check for specific summary fields */}
            <div><strong>Summary fields found:</strong></div>
            {['summary', 'Summary', 'description', 'Description', 'bio', 'Bio', 'about', 'About', 'profile', 'Profile', 'overview', 'Overview'].map(field => {
              const value = (ad as any)[field];
              return value ? (
                <div key={field} className="ml-4 text-xs">
                  ✅ <strong>{field}</strong>: "{typeof value === 'string' ? value.substring(0, 100) : JSON.stringify(value).substring(0, 100)}..."
                </div>
              ) : null;
            })}
          </div>
        )}
        
        <div className="mt-2 p-2 bg-white rounded border">
          <strong>getSummary() would return:</strong>
          <div className="mt-1 text-xs italic">
            "{getSummaryPreview(firstLead)}"
          </div>
        </div>
      </div>
    </div>
  );
};

// Copy of the getSummary logic to preview what it would return
function getSummaryPreview(lead: Lead): string {
  const ad = lead.additional_data;
  
  if (!ad) {
    return 'No summary available';
  }
  
  // If additional_data is already a string summary, return it
  if (typeof ad === 'string') {
    const trimmed = ad.trim();
    if (trimmed.length === 0) return 'No summary available';
    return trimmed.length > 250 ? `${trimmed.substring(0, 250)}...` : trimmed;
  }
  
  // If it's an object, look for common summary field names
  if (typeof ad === 'object') {
    const summaryFields = [
      'summary', 'Summary', 'SUMMARY',
      'description', 'Description', 'DESCRIPTION', 
      'bio', 'Bio', 'BIO', 'biography',
      'about', 'About', 'ABOUT', 'about_me',
      'profile', 'Profile', 'PROFILE', 'profile_summary',
      'overview', 'Overview', 'OVERVIEW',
      'headline', 'Headline', 'professional_headline',
      'experience_summary', 'career_summary',
      'profileSummary', 'profile_text', 'profileText',
      'linkedin_summary', 'linkedinSummary'
    ];
    
    for (const field of summaryFields) {
      const value = (ad as any)[field];
      if (value && typeof value === 'string' && value.trim().length > 0) {
        const trimmed = value.trim();
        return trimmed.length > 250 ? `${trimmed.substring(0, 250)}...` : trimmed;
      }
    }
    
    return `Structured data available (${Object.keys(ad).length} fields)`;
  }
  
  return 'No summary available';
}