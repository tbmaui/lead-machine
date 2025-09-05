import { Lead } from "@/hooks/useLeadGeneration";
import { ExternalLink, Linkedin, Copy, ChevronUp, ChevronDown, ChevronsUpDown, ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/sonner";
import { useMemo, useState, useRef, useCallback } from "react";
import { applyFilters, type Filters } from "@/lib/filters";
import { Input } from "@/components/ui/input";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { calculateLeadScore, getLeadTier, getTierInfo, getLeadIndustry } from "@/lib/leadScoring";

interface LeadsTableProps {
  leads: Lead[];
  onNewSearch?: () => void;
}

type SortKey = "name" | "title" | "company" | "industry" | "phone" | "email" | "location" | "score";
type SortDirection = "asc" | "desc";

const LeadsTable = ({ leads, onNewSearch }: LeadsTableProps) => {
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection | null>(null);
  const [filters, setFilters] = useState<Filters>({
    text: { name: "", title: "", company: "", email: "", location: "", industry: "" },
    hasEmail: true,
    hasPhone: true,
    scoreMin: null,
    scoreMax: null,
  });
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const debouncedText = useDebouncedValue(filters.text, 200);

  // Column width management
  const [columnWidths, setColumnWidths] = useState({
    number: 40,
    name: 84,
    title: 180,
    company: 120,
    industry: 78,
    phone: 120, // Reduced from 150
    email: 140, // Reduced from 220 to 140
    location: 72,
    rating: 80,
    linkedin: 70,
    website: 70,
    companyLinkedIn: 70,
    summary: 250
  });

  const tableRef = useRef<HTMLTableElement>(null);
  const resizingColumn = useRef<string | null>(null);
  const startX = useRef(0);
  const startWidth = useRef(0);

  // Handle column resize start
  const handleResizeStart = useCallback((columnKey: string, e: React.MouseEvent) => {
    // Only handle if clicking on the right edge (resize handle area)
    const rect = e.currentTarget.getBoundingClientRect();
    const isResizeArea = e.clientX > rect.right - 10; // 10px resize area
    
    if (!isResizeArea) return;
    
    e.preventDefault();
    e.stopPropagation();
    resizingColumn.current = columnKey;
    startX.current = e.clientX;
    startWidth.current = columnWidths[columnKey as keyof typeof columnWidths];
    
    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
    document.body.style.cursor = 'col-resize';
  }, [columnWidths]);

  // Handle column resize move
  const handleResizeMove = useCallback((e: MouseEvent) => {
    if (!resizingColumn.current) return;
    
    const diff = e.clientX - startX.current;
    const newWidth = Math.max(50, startWidth.current + diff); // Minimum 50px
    
    setColumnWidths(prev => ({
      ...prev,
      [resizingColumn.current!]: newWidth
    }));
  }, []);

  // Handle column resize end
  const handleResizeEnd = useCallback(() => {
    resizingColumn.current = null;
    document.removeEventListener('mousemove', handleResizeMove);
    document.removeEventListener('mouseup', handleResizeEnd);
    document.body.style.cursor = 'default';
  }, [handleResizeMove]);

  // Memoize lead scores for performance with large datasets
  const leadsWithScores = useMemo(() => {
    return leads.map(lead => {
      const score = calculateLeadScore(lead);
      return {
        ...lead,
        calculatedScore: score
      };
    });
  }, [leads]);

  const cycleSort = (key: SortKey) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDirection("asc");
      return;
    }
    if (sortDirection === "asc") {
      setSortDirection("desc");
      return;
    }
    if (sortDirection === "desc") {
      setSortKey(null);
      setSortDirection(null);
      return;
    }
    setSortDirection("asc");
  };

  const normalizedString = (value?: string | null) => {
    if (!value) return "";
    return String(value).trim().toLowerCase();
  };
  const getPhoneStatusColor = (phone?: string) => {
    if (!phone || phone.trim() === '') return 'bg-gray-300';
    // Simple verification logic - in real app this would come from backend
    return Math.random() > 0.3 ? 'bg-[#466359]' : 'bg-orange-500';
  };

  const getEmailStatusColor = (email?: string) => {
    if (!email || email.trim() === '') return 'bg-gray-300';
    // Simple verification logic - in real app this would come from backend
    return Math.random() > 0.3 ? 'bg-[#466359]' : 'bg-orange-500';
  };

  const renderStars = (score: number) => {
    // Map 0-100 calculated score to 1-5 star display
    // 0-19: 1 star, 20-39: 2 stars, 40-59: 3 stars, 60-79: 4 stars, 80-100: 5 stars
    const starRating = Math.max(1, Math.min(5, Math.floor(score / 20) + 1));
    const stars = [];
    
    // Color mapping for star ratings
    const getStarColor = (rating: number, filled: boolean) => {
      if (!filled) return 'text-gray-300';
      
      switch (rating) {
        case 5: return 'text-[#dfb809]'; // Golden Rod - Highest quality
        case 4: return 'text-[#466359]'; // Updated green - High quality  
        case 3: return 'text-[#466359]'; // Updated green - Medium quality
        case 2: return 'text-[#f47146]'; // Tomato - Lower quality
        case 1: return 'text-[#fbc8b7]'; // Peach Puff - Lowest quality
        default: return 'text-gray-300';
      }
    };
    
    for (let i = 0; i < 5; i++) {
      const isFilled = i < starRating;
      stars.push(
        <span 
          key={i} 
          className={getStarColor(starRating, isFilled)}
          title={`Score: ${score}/100 (${starRating} stars)`}
          aria-label={isFilled ? 'Filled star' : 'Empty star'}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  const getCompanyWebsite = (lead: Lead) => {
    const ad = (lead.additional_data as any) || {};
    const raw = (lead as any)?.company_website_url ||
                ad.company_website_url ||
                ad.company_website ||
                ad.organization_url ||
                ad.website ||
                ad.domain ||
                (lead as any)?.organization_url;
    if (!raw || String(raw).trim() === '') return undefined;
    const str = String(raw).trim();
    if (/^https?:\/\//i.test(str)) return str;
    return `https://${str}`;
  };
  const getDisplayPhone = (lead: Lead): string | undefined => {
    const ad = (lead.additional_data as any) || {};
    return lead.phone ||
      ad['Phone Number'] || ad['Phone'] || ad['Mobile'] || ad['Mobile Phone'] ||
      ad['mobile'] || ad['mobile_phone'] || ad['Work Phone'] || ad['work_phone'] ||
      ad['Direct Dial'] || ad['direct_dial'] || ad['directDial'];
  };

  const getCompanyLinkedIn = (lead: Lead) => {
    const ad = (lead.additional_data as any) || {};
    // Debug: log the data structure to understand what's available
    if (process.env.NODE_ENV === 'development') {
      console.log('Lead data for LinkedIn debugging:', {
        leadId: lead.id,
        organization_linkedin_url: lead.organization_linkedin_url,
        additional_data_keys: ad ? Object.keys(ad) : 'no additional_data',
        additional_data_sample: ad
      });
    }
    
    // First check the direct database field
    const orgLinkedIn = lead.organization_linkedin_url;
    if (orgLinkedIn && String(orgLinkedIn).trim()) return String(orgLinkedIn).trim();
    
    // Then check additional_data for various field names
    return ad.company_linkedin_url ||
           ad.linkedin_company_url ||
           ad.organization_linkedin_url ||
           ad.company_linkedin ||
           ad.companyLinkedIn ||
           ad['Company LinkedIn'] ||
           ad['Organization LinkedIn'] ||
           (lead as any)?.company_linkedin_url;
  };

  const getContactLinkedIn = (lead: Lead) => {
    const ad = (lead.additional_data as any) || {};
    return lead.linkedin_url ||
           ad.linkedin_url ||
           ad.personal_linkedin_url ||
           ad.profile_url ||
           ad.LinkedIn;
  };

  const getLocation = (lead: Lead) => {
    const ad = (lead.additional_data as any) || {};
    
    // First check direct database fields
    if (lead.location && String(lead.location).trim()) {
      return String(lead.location).trim();
    }
    
    // Check structured data in additional_data
    const locationFields = [
      ad.location, ad.Location, ad.city, ad.City, 
      ad.state, ad.State, ad.region, ad.Region,
      ad.country, ad.Country, ad['Location'],
      ad['Current Location'], ad['Geographic Location']
    ];
    
    // Try to find a meaningful location field
    for (const field of locationFields) {
      if (field && String(field).trim() && String(field).trim() !== 'N/A') {
        return String(field).trim();
      }
    }
    
    // Check for city/state combinations
    const city = ad.city || ad.City || '';
    const state = ad.state || ad.State || ad.region || ad.Region || '';
    if (city && state) return `${city}, ${state}`;
    if (city || state) return city || state;
    
    // Extract location from additional_data text summary
    if (typeof ad === 'string' && ad.length > 0) {
      const locationPatterns = [
        /(?:based|located|lives?|resides?) in ([^,.\\n]+(?:, [^,.\\n]+)?)/i,
        /(?:from|in) ([A-Za-z\\s]+, [A-Z]{2})/i, // City, State format
        /([A-Za-z\\s]+, [A-Z]{2}) area/i,
        /Metro ([A-Za-z\\s]+)/i
      ];
      
      for (const pattern of locationPatterns) {
        const match = ad.match(pattern);
        if (match && match[1].trim().length > 2) {
          return match[1].trim();
        }
      }
    }
    
    return 'N/A';
  };

  const splitLocation = (location: string) => {
    if (!location || location === 'N/A') return { city: location, state: '' };
    
    // Split on comma - assuming format like "San Diego, California"
    const parts = location.split(',').map(part => part.trim());
    if (parts.length >= 2) {
      return {
        city: parts[0],
        state: parts[1]
      };
    }
    
    // If no comma, treat as single location
    return {
      city: location,
      state: ''
    };
  };

  const getIndustry = (lead: Lead) => {
    const ad = (lead.additional_data as any) || {};
    
    // First check direct database field
    if (lead.industry && String(lead.industry).trim() && String(lead.industry).trim() !== 'N/A') {
      return String(lead.industry).trim();
    }
    
    // Check structured data in additional_data with common field variations
    const industryFields = [
      ad.industry, ad.Industry, ad.INDUSTRY,
      ad.company_industry, ad['Company Industry'], ad.companyIndustry,
      ad.sector, ad.Sector, ad.business_sector,
      ad.vertical, ad.Vertical, ad.market_vertical,
      ad.field, ad.Field, ad['Business Field'],
      ad.domain, ad.Domain, ad['Industry Domain'],
      ad.naics, ad.NAICS, ad.sic, ad.SIC,
      ad.industryName, ad['Industry Name'], ad.industry_name,
      ad.businessType, ad['Business Type'], ad.business_type
    ];
    
    for (const field of industryFields) {
      if (field && String(field).trim() && String(field).trim() !== 'N/A' && String(field).trim().length > 2) {
        const value = String(field).trim();
        // Skip obviously bad values
        if (!value.match(/^(unknown|null|undefined|na|n\/a|tbd|pending)$/i)) {
          return value.charAt(0).toUpperCase() + value.slice(1);
        }
      }
    }
    
    // Try to extract from company name patterns (many companies include industry)
    const company = getDisplayCompany(lead);
    if (company && company !== 'N/A') {
      const companyIndustryPatterns = [
        /\b(construction|building|contracting)\b/i,
        /\b(software|technology|tech|digital|IT|systems?)\b/i,
        /\b(marketing|advertising|media)\b/i,
        /\b(consulting|advisory|services?)\b/i,
        /\b(manufacturing|industrial|production)\b/i,
        /\b(healthcare|medical|pharmaceutical|pharma)\b/i,
        /\b(financial|banking|finance|investment)\b/i,
        /\b(real estate|property|realty)\b/i,
        /\b(education|training|learning)\b/i,
        /\b(retail|sales|commerce)\b/i,
        /\b(logistics|supply chain|shipping|transportation)\b/i,
        /\b(energy|utilities|power)\b/i,
        /\b(telecommunications|telecom)\b/i,
        /\b(insurance|risk)\b/i
      ];
      
      const industryMappings: Record<string, string> = {
        'construction': 'Construction',
        'building': 'Construction', 
        'contracting': 'Construction',
        'software': 'Technology',
        'technology': 'Technology',
        'tech': 'Technology',
        'digital': 'Technology',
        'it': 'Technology',
        'systems': 'Technology',
        'marketing': 'Marketing',
        'advertising': 'Marketing',
        'media': 'Media',
        'consulting': 'Consulting',
        'advisory': 'Consulting',
        'services': 'Professional Services',
        'manufacturing': 'Manufacturing',
        'industrial': 'Manufacturing',
        'production': 'Manufacturing',
        'healthcare': 'Healthcare',
        'medical': 'Healthcare',
        'pharmaceutical': 'Healthcare',
        'pharma': 'Healthcare',
        'financial': 'Financial Services',
        'banking': 'Financial Services',
        'finance': 'Financial Services',
        'investment': 'Financial Services',
        'real estate': 'Real Estate',
        'property': 'Real Estate',
        'realty': 'Real Estate',
        'education': 'Education',
        'training': 'Education',
        'learning': 'Education',
        'retail': 'Retail',
        'sales': 'Retail',
        'commerce': 'Retail',
        'logistics': 'Logistics',
        'supply chain': 'Logistics',
        'shipping': 'Logistics',
        'transportation': 'Transportation',
        'energy': 'Energy',
        'utilities': 'Utilities',
        'power': 'Energy',
        'telecommunications': 'Telecommunications',
        'telecom': 'Telecommunications',
        'insurance': 'Insurance',
        'risk': 'Insurance'
      };
      
      for (const pattern of companyIndustryPatterns) {
        const match = company.match(pattern);
        if (match && match[0]) {
          const key = match[0].toLowerCase();
          const mappedIndustry = industryMappings[key];
          if (mappedIndustry) {
            return mappedIndustry;
          }
        }
      }
    }
    
    // Extract industry from additional_data text summary with improved patterns
    if (typeof ad === 'string' && ad.length > 0) {
      const industryPatterns = [
        /\b(construction|building|contracting) industry\b/i,
        /\b(software|technology|tech|digital|IT) (industry|sector|field)\b/i,
        /\b(marketing|advertising|media) (industry|sector|field)\b/i,
        /\b(consulting|advisory|professional services) (industry|sector|field)\b/i,
        /\b(manufacturing|industrial|production) (industry|sector|field)\b/i,
        /\b(healthcare|medical|pharmaceutical) (industry|sector|field)\b/i,
        /\b(financial services|banking|finance) (industry|sector|field)\b/i,
        /\b(real estate|property) (industry|sector|field)\b/i,
        /\bindustry[:\\s]+([^,.\\n]{4,30})(?:[,.]|\\n|$)/i,
        /\bsector[:\\s]+([^,.\\n]{4,30})(?:[,.]|\\n|$)/i,
        /\bfield[:\\s]+([^,.\\n]{4,30})(?:[,.]|\\n|$)/i,
        /\bspecializes? in ([^,.\\n]{4,30})(?:[,.]|\\n|$)/i,
        /\bworks? (?:in|with) ([^,.\\n]{4,30}) (?:companies?|clients?|industry|sector)\b/i,
        /\bexperienced? in ([^,.\\n]{4,30})(?:[,.]|\\n|$)/i,
        /\b([A-Za-z\\s&]{4,25}) industry\b/i,
        /\b([A-Za-z\\s&]{4,25}) sector\b/i
      ];
      
      for (const pattern of industryPatterns) {
        const match = ad.match(pattern);
        if (match && match[1]) {
          let industry = match[1].trim();
          // Clean up and validate the extracted industry
          if (industry.length >= 4 && industry.length <= 30) {
            // Filter out generic/meaningless words
            if (!industry.match(/^(the|and|or|of|in|at|with|for|services?|solutions?|company|business|organization|group|inc|corp|ltd|llc|years?|experience|professional|expert|various|multiple|different|many|several)$/i)) {
              // Clean up common prefixes/suffixes
              industry = industry.replace(/\b(and|&|or)\s.*$/, '').trim();
              industry = industry.replace(/^(the|a|an)\s+/i, '').trim();
              return industry.charAt(0).toUpperCase() + industry.slice(1);
            }
          }
        }
      }
    }
    
    // Try to extract from title/role information
    const title = lead.title;
    if (title && title.length > 3 && title !== 'N/A') {
      const titleIndustryPatterns = [
        /\b(construction|building|contracting)\b/i,
        /\b(software|technology|tech|IT)\b/i,
        /\b(marketing|advertising)\b/i,
        /\b(consulting|advisory)\b/i,
        /\b(manufacturing|industrial)\b/i,
        /\b(healthcare|medical|pharmaceutical)\b/i,
        /\b(financial|banking|finance)\b/i,
        /\b(real estate|property)\b/i,
        /\b(education|academic)\b/i,
        /\b(retail|sales)\b/i
      ];
      
      for (const pattern of titleIndustryPatterns) {
        const match = title.match(pattern);
        if (match && match[0]) {
          const key = match[0].toLowerCase();
          const industryMappings: Record<string, string> = {
            'construction': 'Construction',
            'building': 'Construction',
            'contracting': 'Construction',
            'software': 'Technology',
            'technology': 'Technology',
            'tech': 'Technology',
            'it': 'Technology',
            'marketing': 'Marketing',
            'advertising': 'Marketing',
            'consulting': 'Consulting',
            'advisory': 'Consulting',
            'manufacturing': 'Manufacturing',
            'industrial': 'Manufacturing',
            'healthcare': 'Healthcare',
            'medical': 'Healthcare',
            'pharmaceutical': 'Healthcare',
            'financial': 'Financial Services',
            'banking': 'Financial Services',
            'finance': 'Financial Services',
            'real estate': 'Real Estate',
            'property': 'Real Estate',
            'education': 'Education',
            'academic': 'Education',
            'retail': 'Retail',
            'sales': 'Sales'
          };
          
          const mappedIndustry = industryMappings[key];
          if (mappedIndustry) {
            return mappedIndustry;
          }
        }
      }
    }
    
    return 'N/A';
  };

  const getDisplayCompany = (lead: Lead) => {
    const ad = (lead.additional_data as any) || {};
    return (
      lead.company ||
      ad.company || ad.Company || ad['Company Name'] || ad.company_name || ad.companyName ||
      ad.Organization || ad.organization || ad['Organization Name'] || ad.organization_name ||
      ad.Employer || ad.employer || ad['Employer Name'] || ad.employer_name ||
      'N/A'
    );
  };

  const formatUrlLabel = (url?: string) => {
    if (!url) return '';
    try {
      const u = new URL(url);
      return u.hostname.replace(/^www\./, '');
    } catch {
      return url;
    }
  };

  const getSummary = (lead: Lead) => {
    const ad = lead.additional_data;
    
    // Debug logging for development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Getting summary for lead ${lead.id}:`, {
        leadId: lead.id,
        name: lead.name,
        additional_data_type: typeof ad,
        additional_data_keys: typeof ad === 'object' && ad ? Object.keys(ad) : 'N/A',
        additional_data_preview: typeof ad === 'string' ? ad.substring(0, 100) : typeof ad === 'object' && ad ? JSON.stringify(ad).substring(0, 200) : 'N/A'
      });
    }
    
    if (!ad) {
      console.log(`No additional_data for lead ${lead.id}`);
      return 'No summary available';
    }
    
    // Handle the case where N8N sends data as an array-like object with character indices
    if (typeof ad === 'object' && ad !== null) {
      // Check if it has an 'additional_data' property with the actual summary
      if ((ad as any).additional_data && typeof (ad as any).additional_data === 'string') {
        const summary = (ad as any).additional_data.trim();
        if (summary.length > 0) {
          return summary.length > 250 ? `${summary.substring(0, 250)}...` : summary;
        }
      }
      
      // Check if this looks like a character array (keys are mostly numbers)
      const keys = Object.keys(ad);
      const numericKeys = keys.filter(key => /^\d+$/.test(key));
      if (numericKeys.length > keys.length * 0.8) { // If 80%+ of keys are numeric
        // Reconstruct the string from character indices
        const maxIndex = Math.max(...numericKeys.map(k => parseInt(k)));
        let reconstructed = '';
        for (let i = 0; i <= maxIndex; i++) {
          const char = (ad as any)[i.toString()];
          if (typeof char === 'string') {
            reconstructed += char;
          }
        }
        if (reconstructed.trim().length > 0) {
          const trimmed = reconstructed.trim();
          return trimmed.length > 250 ? `${trimmed.substring(0, 250)}...` : trimmed;
        }
      }
    }
    
    // If additional_data is already a string summary, return it
    if (typeof ad === 'string') {
      const trimmed = ad.trim();
      if (trimmed.length === 0) return 'No summary available';
      // Limit length for display
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
      
      // Try to create a meaningful summary from structured data
      const obj = ad as any;
      const meaningfulParts = [];
      
      // Look for professional headline or current position
      if (obj.professional_headline || obj.professionalHeadline) {
        meaningfulParts.push(obj.professional_headline || obj.professionalHeadline);
      }
      
      // Look for experience or role information
      if (obj.current_role || obj.currentRole) {
        meaningfulParts.push(obj.current_role || obj.currentRole);
      }
      
      // Look for current position or experience
      if (obj.current_position || obj.currentPosition) {
        meaningfulParts.push(obj.current_position || obj.currentPosition);
      }
      
      if (obj.experience && typeof obj.experience === 'string') {
        meaningfulParts.push(obj.experience.substring(0, 120));
      } else if (Array.isArray(obj.experience) && obj.experience.length > 0) {
        // Handle array of experience objects
        const latestExp = obj.experience[0];
        if (typeof latestExp === 'object' && latestExp.description) {
          meaningfulParts.push(latestExp.description.substring(0, 120));
        }
      }
      
      // Look for specialties or areas of expertise
      if (obj.specialties && typeof obj.specialties === 'string') {
        meaningfulParts.push(`Specialties: ${obj.specialties.substring(0, 80)}`);
      }
      
      if (obj.skills && Array.isArray(obj.skills)) {
        meaningfulParts.push(`Skills: ${obj.skills.slice(0, 4).join(', ')}`);
      } else if (obj.skills && typeof obj.skills === 'string') {
        meaningfulParts.push(`Skills: ${obj.skills.substring(0, 60)}`);
      }
      
      // Look for education information
      if (obj.education && typeof obj.education === 'string') {
        meaningfulParts.push(`Education: ${obj.education.substring(0, 80)}`);
      } else if (Array.isArray(obj.education) && obj.education.length > 0) {
        const latestEdu = obj.education[0];
        if (typeof latestEdu === 'object' && latestEdu.school) {
          meaningfulParts.push(`Education: ${latestEdu.school}`);
        }
      }
      
      // If we found meaningful data, return it
      if (meaningfulParts.length > 0) {
        const summary = meaningfulParts.join(' • ');
        return summary.length > 250 ? `${summary.substring(0, 250)}...` : summary;
      }
      
      // Fallback: show key fields if available
      const fallbackParts = [];
      if (obj.title && obj.title !== lead.title) fallbackParts.push(`Role: ${obj.title}`);
      if (obj.company && obj.company !== lead.company) fallbackParts.push(`Company: ${obj.company}`);
      if (obj.industry && obj.industry !== lead.industry) fallbackParts.push(`Industry: ${obj.industry}`);
      if (obj.location && obj.location !== lead.location) fallbackParts.push(`Location: ${obj.location}`);
      
      if (fallbackParts.length > 0) {
        return fallbackParts.join(' • ');
      }
      
      // Very last fallback: try to create a summary from any text fields
      const allTextFields = [];
      Object.entries(obj).forEach(([key, value]) => {
        if (typeof value === 'string' && value.trim().length > 10 && value.trim().length < 200) {
          // Skip keys that are likely IDs, URLs, or other non-descriptive data
          if (!key.match(/(id|url|link|href|_at|date|created|updated|uuid)/i) && !value.match(/^(https?|ftp):\/\//)) {
            allTextFields.push(`${key}: ${value.trim()}`);
          }
        }
      });
      
      if (allTextFields.length > 0) {
        const summary = allTextFields.slice(0, 3).join(' • ');
        return summary.length > 250 ? `${summary.substring(0, 250)}...` : summary;
      }
      
      return `Structured data available (${Object.keys(obj).length} fields)`;
    }
    
    return 'No summary available';
  };

  const createComparator = (key: SortKey, direction: SortDirection) => {
    const dir = direction === "asc" ? 1 : -1;
    return (a: { lead: Lead; index: number }, b: { lead: Lead; index: number }) => {
      const aVal = (() => {
        switch (key) {
          case "company":
            return getDisplayCompany(a.lead);
          case "industry":
            return getIndustry(a.lead);
          case "location":
            return getLocation(a.lead);
          default:
            return (a.lead as any)[key];
        }
      })();
      const bVal = (() => {
        switch (key) {
          case "company":
            return getDisplayCompany(b.lead);
          case "industry":
            return getIndustry(b.lead);
          case "location":
            return getLocation(b.lead);
          default:
            return (b.lead as any)[key];
        }
      })();

      const aMissing = aVal === undefined || aVal === null || aVal === '' || aVal === 'N/A';
      const bMissing = bVal === undefined || bVal === null || bVal === '' || bVal === 'N/A';

      // Missing values sort last in ascending, first in descending
      if (aMissing !== bMissing) {
        if (direction === "asc") return aMissing ? 1 : -1;
        return aMissing ? -1 : 1;
      }

      if (key === "score") {
        // Use calculated scores instead of stored scores
        const aNum = (a.lead as any).calculatedScore || 0;
        const bNum = (b.lead as any).calculatedScore || 0;
        if (aNum < bNum) return -1 * dir;
        if (aNum > bNum) return 1 * dir;
        // stable
        return a.index - b.index;
      }

      const aStr = normalizedString(String(aVal ?? ''));
      const bStr = normalizedString(String(bVal ?? ''));
      if (aStr < bStr) return -1 * dir;
      if (aStr > bStr) return 1 * dir;
      return a.index - b.index;
    };
  };

  const filteredLeads = useMemo(() => {
    return applyFilters(leadsWithScores, { ...filters, text: debouncedText });
  }, [leadsWithScores, filters, debouncedText]);

  const sortedLeads = useMemo(() => {
    const decorated = filteredLeads.map((lead, index) => ({ lead, index }));
    if (!sortKey || !sortDirection) return decorated.map(d => d.lead);
    const comparator = createComparator(sortKey, sortDirection);
    return [...decorated].sort(comparator).map(d => d.lead);
  }, [filteredLeads, sortKey, sortDirection]);

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
    <div className="neu-card text-xs">
      <style>{`
        .resize-table th {
          position: relative;
          user-select: none;
        }
        .resize-table .resize-handle::after {
          content: '';
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          width: 8px;
          cursor: col-resize;
          background: transparent;
          z-index: 10;
          transition: background-color 0.2s ease;
        }
        .resize-table .resize-handle:hover::after {
          background: hsl(var(--border));
        }
        .resize-table th:hover {
          background-color: hsl(var(--muted) / 0.3);
        }
      `}</style>
      {/* Top scroll indicator with neumorphic range slider design */}
      <div 
        className="relative flex flex-col items-center justify-center py-3 border-b border-border" 
        style={{ minHeight: '50px' }}
      >
        <div className="text-xs text-muted-foreground mb-2 text-center">
          ← Slide to view all columns →
        </div>
        <div className="neu-range-slider">
          <input
            type="range"
            min="0"
            max="1440"
            defaultValue="0"
            className="neu-range-input"
            onInput={(e) => {
              const scrollLeft = parseInt(e.currentTarget.value);
              const mainTable = e.currentTarget.closest('.neu-card')?.querySelector('div[class*="overflow-x-auto overflow-y-hidden"]:not(.neu-range-slider)') as HTMLElement;
              if (mainTable) {
                mainTable.scrollLeft = scrollLeft;
              }
            }}
            title="← Drag to scroll horizontally and view all columns →"
            aria-label="Horizontal scroll to view more columns"
          />
        </div>
      </div>
      
      {/* Fixed header with action buttons anchored to right */}
      <div className="flex items-center justify-end p-3 border-b border-border">
        <div className="flex items-center gap-2">
          {onNewSearch && (
            <button
              type="button"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
              onClick={onNewSearch}
            >
              <ArrowLeft className="h-3 w-3 mr-1" />
              New Search
            </button>
          )}
          <button
            type="button"
            className={cn(buttonVariants({ variant: "secondary", size: "sm" }))}
            onClick={() => setShowFilters((s) => !s)}
            aria-expanded={showFilters}
            aria-controls="filters-panel"
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
          <button
            type="button"
            className={cn(buttonVariants({ variant: "secondary", size: "sm" }))}
            onClick={() => setFilters({ text: { name: "", title: "", company: "", email: "", location: "", industry: "" }, hasEmail: true, hasPhone: true, scoreMin: null, scoreMax: null })}
            aria-label="Clear all filters"
          >
            Clear all
          </button>
        </div>
      </div>
      
      <div 
        className="relative overflow-x-auto overflow-y-hidden" 
        onScroll={(e) => {
          // Sync with range slider
          const scrollLeft = e.currentTarget.scrollLeft;
          const rangeInput = document.querySelector('.neu-range-input') as HTMLInputElement;
          if (rangeInput) {
            rangeInput.value = scrollLeft.toString();
          }
        }}
      >
        {/* Right fade indicator to show more columns - fixed for dark mode */}
        <div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-background/90 to-transparent pointer-events-none z-10"></div>
      <div className="flex items-center justify-between p-3 border-b border-border">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="text-xs text-muted-foreground mr-2">
            {filteredLeads.length !== leadsWithScores.length ? `Showing ${filteredLeads.length} of ${leadsWithScores.length} leads` : `Showing ${leadsWithScores.length} leads`}
          </div>
          {/* Active filter chips */}
          {filters.text.name && (
            <button
              type="button"
              className="neu-badge text-xs px-2 py-1"
              aria-label={`Remove Name filter ${filters.text.name}`}
              onClick={() => setFilters(f => ({ ...f, text: { ...f.text, name: "" } }))}
            >
              Name: {filters.text.name} ×
            </button>
          )}
          {filters.text.title && (
            <button
              type="button"
              className="neu-badge text-xs px-2 py-1"
              aria-label={`Remove Title filter ${filters.text.title}`}
              onClick={() => setFilters(f => ({ ...f, text: { ...f.text, title: "" } }))}
            >
              Title: {filters.text.title} ×
            </button>
          )}
          {filters.text.company && (
            <button
              type="button"
              className="neu-badge text-xs px-2 py-1"
              aria-label={`Remove Company filter ${filters.text.company}`}
              onClick={() => setFilters(f => ({ ...f, text: { ...f.text, company: "" } }))}
            >
              Company: {filters.text.company} ×
            </button>
          )}
          {filters.text.email && (
            <button
              type="button"
              className="neu-badge text-xs px-2 py-1"
              aria-label={`Remove Email filter ${filters.text.email}`}
              onClick={() => setFilters(f => ({ ...f, text: { ...f.text, email: "" } }))}
            >
              Email: {filters.text.email} ×
            </button>
          )}
          {filters.text.location && (
            <button
              type="button"
              className="neu-badge text-xs px-2 py-1"
              aria-label={`Remove Location filter ${filters.text.location}`}
              onClick={() => setFilters(f => ({ ...f, text: { ...f.text, location: "" } }))}
            >
              Location: {filters.text.location} ×
            </button>
          )}
          {filters.text.industry && (
            <button
              type="button"
              className="neu-badge text-xs px-2 py-1"
              aria-label={`Remove Industry filter ${filters.text.industry}`}
              onClick={() => setFilters(f => ({ ...f, text: { ...f.text, industry: "" } }))}
            >
              Industry: {filters.text.industry} ×
            </button>
          )}
          {filters.hasEmail === true && (
            <button
              type="button"
              className="neu-badge text-xs px-2 py-1"
              aria-label="Remove Has Email filter"
              onClick={() => setFilters(f => ({ ...f, hasEmail: undefined }))}
            >
              Has Email ×
            </button>
          )}
          {filters.hasPhone === true && (
            <button
              type="button"
              className="neu-badge text-xs px-2 py-1"
              aria-label="Remove Has Phone filter"
              onClick={() => setFilters(f => ({ ...f, hasPhone: undefined }))}
            >
              Has Phone ×
            </button>
          )}
          {(filters.scoreMin !== null && filters.scoreMin !== undefined) && (
            <button
              type="button"
              className="neu-badge text-xs px-2 py-1"
              aria-label={`Remove Min Score filter ${filters.scoreMin}`}
              onClick={() => setFilters(f => ({ ...f, scoreMin: null }))}
            >
              Min: {filters.scoreMin} ×
            </button>
          )}
          {(filters.scoreMax !== null && filters.scoreMax !== undefined) && (
            <button
              type="button"
              className="neu-badge text-xs px-2 py-1"
              aria-label={`Remove Max Score filter ${filters.scoreMax}`}
              onClick={() => setFilters(f => ({ ...f, scoreMax: null }))}
            >
              Max: {filters.scoreMax} ×
            </button>
          )}
        </div>
      </div>
      {showFilters && (
        <div id="filters-panel" className="flex items-center gap-4 p-3 border-b border-border">
          <div className="flex items-center gap-2">
            <label htmlFor="filter-has-email" className="text-sm text-muted-foreground">Has Email</label>
            <input id="filter-has-email" aria-label="Filter Has Email" type="checkbox" checked={!!filters.hasEmail} onChange={(e) => setFilters(f => ({ ...f, hasEmail: e.target.checked ? true : undefined }))} />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="filter-has-phone" className="text-sm text-muted-foreground">Has Phone</label>
            <input id="filter-has-phone" aria-label="Filter Has Phone" type="checkbox" checked={!!filters.hasPhone} onChange={(e) => setFilters(f => ({ ...f, hasPhone: e.target.checked ? true : undefined }))} />
          </div>
        </div>
      )}
      <table ref={tableRef} className="w-full border-collapse resize-table" style={{ minWidth: '1440px', tableLayout: 'fixed' }}>
        <thead>
          <tr className="border-b border-border text-muted-foreground">
            <th
              className="text-center p-2 font-medium uppercase tracking-wide"
              style={{ width: `${columnWidths.number}px`, minWidth: `${columnWidths.number}px` }}
            >
              #
            </th>
            <th
              className="text-left p-2 font-medium uppercase tracking-wide resize-handle"
              style={{ width: `${columnWidths.name}px`, minWidth: '50px', position: 'relative' }}
              aria-sort={sortKey === 'name' ? (sortDirection === 'asc' ? 'ascending' : sortDirection === 'desc' ? 'descending' : 'none') : 'none'}
              onMouseDown={(e) => handleResizeStart('name', e)}
            >
              <button
                type="button"
                aria-label="Sort by Name"
                onClick={() => cycleSort('name')}
                className="inline-flex items-center gap-1 hover:text-foreground"
              >
                Name {sortKey === 'name' ? (sortDirection === 'asc' ? <ChevronUp className="h-3 w-3" /> : sortDirection === 'desc' ? <ChevronDown className="h-3 w-3" /> : <ChevronsUpDown className="h-3 w-3" />) : <ChevronsUpDown className="h-3 w-3 opacity-50" />}
              </button>
            </th>
            <th
              className="text-left p-2 font-medium uppercase tracking-wide resize-handle"
              style={{ width: `${columnWidths.title}px`, minWidth: '50px' }}
              aria-sort={sortKey === 'title' ? (sortDirection === 'asc' ? 'ascending' : sortDirection === 'desc' ? 'descending' : 'none') : 'none'}
              onMouseDown={(e) => handleResizeStart('title', e)}
            >
              <button
                type="button"
                aria-label="Sort by Title"
                onClick={() => cycleSort('title')}
                className="inline-flex items-center gap-1 hover:text-foreground"
              >
                Title {sortKey === 'title' ? (sortDirection === 'asc' ? <ChevronUp className="h-3 w-3" /> : sortDirection === 'desc' ? <ChevronDown className="h-3 w-3" /> : <ChevronsUpDown className="h-3 w-3" />) : <ChevronsUpDown className="h-3 w-3 opacity-50" />}
              </button>
            </th>
            <th
              className="text-left p-2 font-medium uppercase tracking-wide resize-handle"
              style={{ width: `${columnWidths.company}px`, minWidth: '50px' }}
              aria-sort={sortKey === 'company' ? (sortDirection === 'asc' ? 'ascending' : sortDirection === 'desc' ? 'descending' : 'none') : 'none'}
              onMouseDown={(e) => handleResizeStart('company', e)}
            >
              <button
                type="button"
                aria-label="Sort by Company"
                onClick={() => cycleSort('company')}
                className="inline-flex items-center gap-1 hover:text-foreground"
              >
                Company {sortKey === 'company' ? (sortDirection === 'asc' ? <ChevronUp className="h-3 w-3" /> : sortDirection === 'desc' ? <ChevronDown className="h-3 w-3" /> : <ChevronsUpDown className="h-3 w-3" />) : <ChevronsUpDown className="h-3 w-3 opacity-50" />}
              </button>
            </th>
            <th
              className="text-left p-2 font-medium uppercase tracking-wide resize-handle"
              style={{ width: `${columnWidths.industry}px`, minWidth: '50px' }}
              aria-sort={sortKey === 'industry' ? (sortDirection === 'asc' ? 'ascending' : sortDirection === 'desc' ? 'descending' : 'none') : 'none'}
              onMouseDown={(e) => handleResizeStart('industry', e)}
            >
              <button
                type="button"
                aria-label="Sort by Industry"
                onClick={() => cycleSort('industry')}
                className="inline-flex items-center gap-1 hover:text-foreground"
              >
                Industry {sortKey === 'industry' ? (sortDirection === 'asc' ? <ChevronUp className="h-3 w-3" /> : sortDirection === 'desc' ? <ChevronDown className="h-3 w-3" /> : <ChevronsUpDown className="h-3 w-3" />) : <ChevronsUpDown className="h-3 w-3 opacity-50" />}
              </button>
            </th>
            <th
              className="text-left p-2 font-medium uppercase tracking-wide resize-handle"
              style={{ width: `${columnWidths.phone}px`, minWidth: '50px' }}
              aria-sort={sortKey === 'phone' ? (sortDirection === 'asc' ? 'ascending' : sortDirection === 'desc' ? 'descending' : 'none') : 'none'}
              onMouseDown={(e) => handleResizeStart('phone', e)}
            >
              <button
                type="button"
                aria-label="Sort by Phone"
                onClick={() => cycleSort('phone')}
                className="inline-flex items-center gap-1 hover:text-foreground"
              >
                Phone {sortKey === 'phone' ? (sortDirection === 'asc' ? <ChevronUp className="h-3 w-3" /> : sortDirection === 'desc' ? <ChevronDown className="h-3 w-3" /> : <ChevronsUpDown className="h-3 w-3" />) : <ChevronsUpDown className="h-3 w-3 opacity-50" />}
              </button>
            </th>
            <th
              className="text-left p-2 font-medium uppercase tracking-wide resize-handle"
              style={{ width: `${columnWidths.email}px`, minWidth: '50px' }}
              aria-sort={sortKey === 'email' ? (sortDirection === 'asc' ? 'ascending' : sortDirection === 'desc' ? 'descending' : 'none') : 'none'}
              onMouseDown={(e) => handleResizeStart('email', e)}
            >
              <button
                type="button"
                aria-label="Sort by Email"
                onClick={() => cycleSort('email')}
                className="inline-flex items-center gap-1 hover:text-foreground"
              >
                Email {sortKey === 'email' ? (sortDirection === 'asc' ? <ChevronUp className="h-3 w-3" /> : sortDirection === 'desc' ? <ChevronDown className="h-3 w-3" /> : <ChevronsUpDown className="h-3 w-3" />) : <ChevronsUpDown className="h-3 w-3 opacity-50" />}
              </button>
            </th>
            <th
              className="text-left p-2 font-medium uppercase tracking-wide resize-handle"
              style={{ width: `${columnWidths.location}px`, minWidth: '50px' }}
              aria-sort={sortKey === 'location' ? (sortDirection === 'asc' ? 'ascending' : sortDirection === 'desc' ? 'descending' : 'none') : 'none'}
              onMouseDown={(e) => handleResizeStart('location', e)}
            >
              <button
                type="button"
                aria-label="Sort by Location"
                onClick={() => cycleSort('location')}
                className="inline-flex items-center gap-1 hover:text-foreground"
              >
                Location {sortKey === 'location' ? (sortDirection === 'asc' ? <ChevronUp className="h-3 w-3" /> : sortDirection === 'desc' ? <ChevronDown className="h-3 w-3" /> : <ChevronsUpDown className="h-3 w-3" />) : <ChevronsUpDown className="h-3 w-3 opacity-50" />}
              </button>
            </th>
            <th
              className="text-left p-2 font-medium uppercase tracking-wide resize-handle"
              style={{ width: `${columnWidths.rating}px`, minWidth: '50px' }}
              aria-sort={sortKey === 'score' ? (sortDirection === 'asc' ? 'ascending' : sortDirection === 'desc' ? 'descending' : 'none') : 'none'}
              onMouseDown={(e) => handleResizeStart('rating', e)}
            >
              <button
                type="button"
                aria-label="Sort by Rating"
                onClick={() => cycleSort('score')}
                className="inline-flex items-center gap-1 hover:text-foreground"
              >
                Rating {sortKey === 'score' ? (sortDirection === 'asc' ? <ChevronUp className="h-3 w-3" /> : sortDirection === 'desc' ? <ChevronDown className="h-3 w-3" /> : <ChevronsUpDown className="h-3 w-3" />) : <ChevronsUpDown className="h-3 w-3 opacity-50" />}
              </button>
            </th>
            <th 
              className="text-left p-2 font-medium tracking-wide resize-handle" 
              style={{ width: `${columnWidths.linkedin}px`, minWidth: '50px' }}
              onMouseDown={(e) => handleResizeStart('linkedin', e)}
            >LinkedIn</th>
            <th 
              className="text-left p-2 font-medium tracking-wide resize-handle" 
              style={{ width: `${columnWidths.website}px`, minWidth: '50px' }}
              onMouseDown={(e) => handleResizeStart('website', e)}
            >Website</th>
            <th 
              className="text-left p-2 font-medium tracking-wide resize-handle" 
              style={{ width: `${columnWidths.companyLinkedIn}px`, minWidth: '50px' }}
              onMouseDown={(e) => handleResizeStart('companyLinkedIn', e)}
            >Co. LinkedIn</th>
            <th 
              className="text-left p-2 font-medium tracking-wide" 
              style={{ width: `${columnWidths.summary}px`, minWidth: '50px' }}
            >Summary</th>
          </tr>
        </thead>
        <tbody>
          {sortedLeads.map((lead, index) => {
            const companyWebsite = getCompanyWebsite(lead);
            const companyLinkedIn = getCompanyLinkedIn(lead);
            const contactLinkedIn = getContactLinkedIn(lead);
            const displayCompany = getDisplayCompany(lead);
            const industry = getLeadIndustry(lead);
            
            return (
              <tr key={index} className="border-b border-border transition-colors hover:bg-[#f47146]/10">
                <td className="p-2 text-center text-muted-foreground" style={{ width: `${columnWidths.number}px`, minWidth: `${columnWidths.number}px` }}>
                  {index + 1}
                </td>
                <td className="p-2" style={{ width: `${columnWidths.name}px`, minWidth: '50px' }}>
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="font-medium text-foreground break-words"
                      title={lead.name}
                    >
                      {lead.name}
                    </span>
                  </div>
                </td>
                <td className="p-2" style={{ width: `${columnWidths.title}px`, minWidth: '50px' }}>
                  <div className="min-w-0">
                    <span
                      className="text-foreground/80 break-words"
                      title={lead.title || 'N/A'}
                    >
                      {lead.title || 'N/A'}
                    </span>
                  </div>
                </td>
                <td className="p-2" style={{ width: `${columnWidths.company}px`, minWidth: '50px' }}>
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="text-foreground/80 break-words"
                      title={displayCompany}
                    >
                      {displayCompany}
                    </span>
                  </div>
                </td>
                <td className="p-2" style={{ width: `${columnWidths.industry}px`, minWidth: '50px' }}>
                  <div className="min-w-0">
                    <span
                      className="text-foreground/80 text-xs leading-tight break-words inline-block"
                      title={industry || 'N/A'}
                    >
                      {industry || 'N/A'}
                    </span>
                  </div>
                </td>
                <td className="p-2" style={{ width: `${columnWidths.phone}px`, minWidth: '50px' }}>
                  <div className="min-w-0 max-w-full">
                    {getDisplayPhone(lead) ? (
                      <span className="text-foreground/80 text-xs inline-block truncate max-w-full" title={getDisplayPhone(lead)}>{getDisplayPhone(lead)}</span>
                    ) : (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </div>
                </td>
                <td className="p-2" style={{ width: `${columnWidths.email}px`, minWidth: '50px' }}>
                  <div className="min-w-0 max-w-full">
                    {lead.email ? (
                      <a
                        href={`mailto:${lead.email}`}
                        className="text-primary hover:underline inline-block truncate max-w-full"
                        title={lead.email}
                      >
                        {lead.email}
                      </a>
                    ) : (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </div>
                </td>
                <td className="p-2" style={{ width: `${columnWidths.location}px`, minWidth: '50px' }}>
                  <div className="min-w-0">
                    {(() => {
                      const location = getLocation(lead);
                      const { city, state } = splitLocation(location);
                      return (
                        <div className="text-foreground/80 text-xs leading-tight">
                          <div className="font-medium">{city}</div>
                          {state && <div className="text-muted-foreground">{state}</div>}
                        </div>
                      );
                    })()}
                  </div>
                </td>
                <td className="p-2" style={{ width: `${columnWidths.rating}px`, minWidth: '50px' }}>
                  {(() => {
                    const score = (lead as any).calculatedScore || 0;
                    const tier = getLeadTier(score);
                    const tierInfo = getTierInfo(tier);
                    
                    return (
                      <div className="flex items-center justify-center">
                        {renderStars(score)}
                      </div>
                    );
                  })()}
                </td>
                <td className="p-2" style={{ width: `${columnWidths.linkedin}px`, minWidth: '50px' }}>
                  {contactLinkedIn ? (
                    <a
                      href={contactLinkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open LinkedIn profile for ${lead.name}`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center justify-center rounded-full w-7 h-7 bg-surface border border-stroke neu-element hover:neu-pressed hover:text-[#f47146] active:neu-pressed active:text-[#f47146] transition-all duration-180 text-foreground focus:outline-none focus:ring-2 focus:ring-[#f47146] focus:ring-offset-2"
                    >
                      <Linkedin className="h-3 w-3" />
                    </a>
                  ) : (
                    <span className="text-muted-foreground">N/A</span>
                  )}
                </td>
                <td className="p-2" style={{ width: `${columnWidths.website}px`, minWidth: '50px' }}>
                  {companyWebsite ? (
                    <a
                      href={companyWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open company website for ${displayCompany}`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center justify-center rounded-full w-7 h-7 bg-surface border border-stroke neu-element hover:neu-pressed hover:text-[#f47146] active:neu-pressed active:text-[#f47146] transition-all duration-180 text-foreground focus:outline-none focus:ring-2 focus:ring-[#f47146] focus:ring-offset-2"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <span className="text-muted-foreground">N/A</span>
                  )}
                </td>
                <td className="p-2" style={{ width: `${columnWidths.companyLinkedIn}px`, minWidth: '50px' }}>
                  {companyLinkedIn ? (
                    <a
                      href={companyLinkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open company LinkedIn for ${displayCompany}`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center justify-center rounded-full w-7 h-7 bg-surface border border-stroke neu-element hover:neu-pressed hover:text-[#f47146] active:neu-pressed active:text-[#f47146] transition-all duration-180 text-foreground focus:outline-none focus:ring-2 focus:ring-[#f47146] focus:ring-offset-2"
                    >
                      <Linkedin className="h-3 w-3" />
                    </a>
                  ) : (
                    <span className="text-muted-foreground">N/A</span>
                  )}
                </td>
                <td className="p-2" style={{ width: `${columnWidths.summary}px`, minWidth: '50px' }}>
                  <div className="min-w-0 max-w-full">
                    <div
                      className="text-foreground/80 text-xs leading-normal"
                      style={{ 
                        display: '-webkit-box',
                        WebkitLineClamp: 4,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        wordBreak: 'break-word',
                        hyphens: 'auto',
                        maxHeight: '64px'
                      }}
                      title={getSummary(lead)}
                    >
                      {getSummary(lead)}
                    </div>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default LeadsTable;