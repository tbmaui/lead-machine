import { Lead } from "@/hooks/useLeadGeneration";

// Lead tier type definition matching Story 3.1 requirements
export type LeadTier = 'S' | 'A' | 'B' | 'C' | 'D';

// Tier information with Complete Controller Design System colors
export interface TierInfo {
  label: string;
  color: string;
  action: string;
  urgency: string;
}

// Complete Controller Design System colors for tiers
const TIER_COLORS = {
  S: '#DAA520', // goldenrod (5-star leads)
  A: '#466359', // Updated green color (Warm leads)  
  B: '#f36334', // --cc-tomato (3-star leads)
  C: '#5d5d5f', // --cc-dim2 (Low priority)
  D: '#7c797c'  // --cc-gray (Disqualified)
};

const TIER_INFO: Record<LeadTier, TierInfo> = {
  S: {
    label: 'Action Ready',
    color: TIER_COLORS.S,
    action: 'Complete profile - ready for immediate outreach',
    urgency: 'READY FOR CONTACT'
  },
  A: {
    label: 'Priority Prospect', 
    color: TIER_COLORS.A,
    action: 'High-quality data - prioritize for outreach',
    urgency: 'HIGH PRIORITY'
  },
  B: {
    label: 'Basic Profile',
    color: TIER_COLORS.B,
    action: 'Standard prospect - include in regular campaigns',
    urgency: 'STANDARD PRIORITY'
  },
  C: {
    label: 'Research Required',
    color: TIER_COLORS.C,
    action: 'Additional research needed before contact',
    urgency: 'RESEARCH FOCUS'
  },
  D: {
    label: 'Incomplete Profile',
    color: TIER_COLORS.D,
    action: 'Insufficient data for effective outreach',
    urgency: 'DATA ENRICHMENT NEEDED'
  }
};

/**
 * Data-Driven Lead Scoring Algorithm (0-100 scale)
 * Score based on data completeness with title-based bonus within each tier
 * 
 * 5 Stars (80-100): Action Ready - Complete profile ready for immediate outreach
 * 4 Stars (60-79): Priority Prospect - High-quality data, prioritize for outreach
 * 3 Stars (40-59): Basic Profile - Standard prospect for regular campaigns
 * 2 Stars (20-39): Research Required - Additional research needed before contact
 * 1 Star (0-19): Incomplete Profile - Insufficient data for effective outreach
 */
export function calculateLeadScore(lead: Lead): number {
  // Get helper functions for data extraction
  const getLinkedIn = (lead: Lead) => lead.linkedin_url || (lead.additional_data as any)?.linkedin_url || (lead.additional_data as any)?.LinkedIn;
  const getWebsite = (lead: Lead) => lead.organization_url || (lead.additional_data as any)?.company_website_url || (lead.additional_data as any)?.website;
  const getCompanyLinkedIn = (lead: Lead) => lead.organization_linkedin_url || (lead.additional_data as any)?.company_linkedin_url || (lead.additional_data as any)?.organization_linkedin_url;
  const getSummary = (lead: Lead) => (lead.additional_data as any)?.summary || (lead.additional_data as any)?.Summary || (lead.additional_data as any)?.bio;

  // Check required core fields (name, title, company, industry, location)
  const coreFields = [
    lead.name?.trim(),
    lead.title?.trim(), 
    lead.company?.trim(),
    lead.industry?.trim(),
    lead.location?.trim()
  ];

  // Check enhanced fields (LinkedIn, website, company LinkedIn, summary)
  const enhancedFields = [
    getLinkedIn(lead),
    getWebsite(lead),
    getCompanyLinkedIn(lead),
    getSummary(lead)
  ];

  // Check contact fields
  const hasEmail = !!(lead.email?.trim() && lead.email !== 'N/A');
  const hasPhone = !!(lead.phone?.trim() && lead.phone !== 'N/A');

  // Count completed core and enhanced fields
  const completedCore = coreFields.filter(field => field && field !== 'N/A').length;
  const completedEnhanced = enhancedFields.filter(field => field && String(field).trim() && String(field).trim() !== 'N/A').length;

  let baseScore = 0;

  // 5 Stars (80-100): All core + enhanced fields + both email AND phone
  if (completedCore >= 4 && completedEnhanced >= 2 && hasEmail && hasPhone) {
    baseScore = 80 + getTitleBonus(lead.title);
  }
  // 4 Stars (60-79): All core + most enhanced + email OR phone
  else if (completedCore >= 4 && completedEnhanced >= 2 && (hasEmail || hasPhone)) {
    baseScore = 60 + Math.floor(getTitleBonus(lead.title) * 0.8);
  }
  // 3 Stars (40-59): Most core fields + some contact info
  else if (completedCore >= 3 && (hasEmail || hasPhone)) {
    baseScore = 40 + Math.floor(getTitleBonus(lead.title) * 0.6);
  }
  // 2 Stars (20-39): Some core fields
  else if (completedCore >= 2) {
    baseScore = 20 + Math.floor(getTitleBonus(lead.title) * 0.4);
  }
  // 1 Star (0-19): Minimal data
  else {
    baseScore = Math.floor(getTitleBonus(lead.title) * 0.2);
  }

  // Ensure score stays within bounds
  return Math.max(0, Math.min(100, Math.round(baseScore)));
}

/**
 * Title Bonus for Data-Driven Scoring (0-20 points max)
 * Used as bonus points within each star tier
 */
export function getTitleBonus(title?: string): number {
  if (!title || title.trim() === '' || title === 'N/A') return 0;
  
  const titleLower = title.toLowerCase().trim();
  
  // CEO/Owner/Founder (20 points): Highest level decision makers
  if (titleLower.indexOf('ceo') !== -1 || 
      titleLower.indexOf('chief executive') !== -1 ||
      titleLower.indexOf('owner') !== -1 ||
      titleLower.indexOf('founder') !== -1) {
    return 20;
  }
  
  // President (18 points): High-level executives
  if (titleLower.indexOf('president') !== -1 && !titleLower.includes('vice')) {
    return 18;
  }
  
  // C-Suite (15 points): CTO, CMO, CFO, CSO, etc.
  if (titleLower.match(/\b(cto|cmo|cfo|cso|chief technology officer|chief marketing officer|chief financial officer|c-level)\b/) ||
      (titleLower.indexOf('chief') !== -1 && titleLower.indexOf('director') === -1)) {
    return 15;
  }
  
  // VP Level (12 points): Vice Presidents
  if (titleLower.includes('vp') || 
      titleLower.includes('vice president') || 
      titleLower.includes('v.p.') || 
      titleLower.includes('v. p.')) {
    return 12;
  }
  
  // Director Level (8 points): Directors, Department Heads
  if (titleLower.indexOf('director') !== -1 ||
      titleLower.indexOf('head of') !== -1 ||
      titleLower.indexOf('department head') !== -1) {
    return 8;
  }
  
  // Manager/Senior Level (5 points): Managers, Senior roles, Team leads
  if (titleLower.indexOf('manager') !== -1 ||
      titleLower.indexOf('senior') !== -1 ||
      titleLower.indexOf('team lead') !== -1) {
    return 5;
  }
  
  // Associate/Junior Level (2 points): Junior roles, Associates, Specialists
  if (titleLower.indexOf('junior') !== -1 ||
      titleLower.indexOf('associate') !== -1 ||
      titleLower.indexOf('specialist') !== -1 ||
      titleLower.indexOf('coordinator') !== -1 ||
      titleLower.indexOf('assistant') !== -1) {
    return 2;
  }
  
  // Unknown/Generic (0 points)
  return 0;
}

/**
 * Legacy Title Scoring function - kept for compatibility
 * @deprecated Use getTitleBonus instead for new data-driven scoring
 */
export function getTitleScore(title?: string): number {
  return getTitleBonus(title);
}

/**
 * Contact Completeness Scoring (15 points max)
 */
export function getContactScore(email?: string, phone?: string): number {
  const hasEmail = !!(email && email.trim().length > 0 && email !== 'N/A');
  const hasPhone = !!(phone && phone.trim().length > 0 && phone !== 'N/A');
  
  if (hasEmail && hasPhone) return 15; // Email + Phone
  if (hasEmail) return 10; // Email Only
  if (hasPhone) return 5;  // Phone Only
  return 0; // Neither
}

/**
 * Company Size Scoring (20 points max)
 * Extract company size from lead data and additional_data
 */
export function getCompanySizeScore(lead: Lead): number {
  // Check direct company_size field
  if (lead.company_size) {
    return scoreCompanySize(lead.company_size);
  }
  
  // Check additional_data for company size information
  const ad = (lead.additional_data as any) || {};
  const sizeFields = [
    ad.company_size, ad.employees, ad['Company Size'], ad['Employee Count'],
    ad.companySize, ad.employeeCount, ad.size, ad.Size
  ];
  
  for (const field of sizeFields) {
    if (field && String(field).trim()) {
      const score = scoreCompanySize(String(field));
      if (score > 0) return score;
    }
  }
  
  return 0; // Unknown
}

function scoreCompanySize(sizeStr: string): number {
  const size = sizeStr.toLowerCase().trim();
  
  // Enterprise (1000+ employees): 20 points
  if (size.match(/\b(1000\+|1k\+|enterprise|large|fortune)\b/) || 
      size.match(/\b([1-9]\d{3,}|\d{4,})\b/)) { // 1000+ numbers
    return 20;
  }
  
  // Mid-Market (100-999 employees): 15 points
  if (size.match(/\b(100-999|mid-market|medium)\b/) ||
      size.match(/\b([1-9]\d{2})\b/)) { // 100-999 numbers
    return 15;
  }
  
  // Small Business (20-99 employees): 10 points
  if (size.match(/\b(20-99|small|startup)\b/) ||
      size.match(/\b([2-9]\d)\b/)) { // 20-99 numbers
    return 10;
  }
  
  // Startup (1-19 employees): 5 points
  if (size.match(/\b(1-19|very small|micro)\b/) ||
      size.match(/\b([1-9]|1[0-9])\b/)) { // 1-19 numbers
    return 5;
  }
  
  return 0; // Unknown
}

/**
 * Industry Relevance Scoring (15 points max)
 * Based on Story 3.1 industry priorities
 */
export function getIndustryScore(industry?: string): number {
  if (!industry || industry.trim() === '' || industry === 'N/A') return 0;
  
  const industryLower = industry.toLowerCase().trim();
  
  // High Priority Industries: 15 points (Technology, SaaS, Finance) - optimized with indexOf
  if (industryLower.indexOf('technology') !== -1 ||
      industryLower.indexOf('tech') !== -1 ||
      industryLower.indexOf('software') !== -1 ||
      industryLower.indexOf('saas') !== -1 ||
      industryLower.indexOf('finance') !== -1 ||
      industryLower.indexOf('financial') !== -1 ||
      industryLower.indexOf('fintech') !== -1 ||
      industryLower.indexOf('banking') !== -1) {
    return 15;
  }
  
  // Medium Priority Industries: 10 points (Healthcare, Manufacturing, Retail) - optimized with indexOf
  if (industryLower.indexOf('healthcare') !== -1 ||
      industryLower.indexOf('health') !== -1 ||
      industryLower.indexOf('medical') !== -1 ||
      industryLower.indexOf('manufacturing') !== -1 ||
      industryLower.indexOf('industrial') !== -1 ||
      industryLower.indexOf('retail') !== -1 ||
      industryLower.indexOf('e-commerce') !== -1) {
    return 10;
  }
  
  // Low Priority Industries: 5 points (Non-profit, Government, Education) - optimized with indexOf
  if (industryLower.indexOf('non-profit') !== -1 ||
      industryLower.indexOf('government') !== -1 ||
      industryLower.indexOf('education') !== -1 ||
      industryLower.indexOf('academic') !== -1 ||
      industryLower.indexOf('public sector') !== -1) {
    return 5;
  }
  
  return 0; // Unknown/Irrelevant
}

/**
 * Growth Indicators Scoring (10 points max)
 * Analyze additional_data for growth signals
 */
export function getGrowthScore(lead: Lead): number {
  const ad = (lead.additional_data as any) || {};
  
  // Look for growth indicators in additional_data
  const dataStr = typeof ad === 'string' ? ad.toLowerCase() : 
                  typeof ad === 'object' ? JSON.stringify(ad).toLowerCase() : '';
  
  // Recent Funding/High Growth: 10 points
  if (dataStr.match(/\b(funding|investment|series [abc]|vc|venture|rapid growth|expanding)\b/)) {
    return 10;
  }
  
  // Stable Growth: 7 points
  if (dataStr.match(/\b(growing|growth|hiring|expansion|profitable)\b/)) {
    return 7;
  }
  
  // Mature/Stable: 5 points
  if (dataStr.match(/\b(established|mature|stable|fortune 500)\b/)) {
    return 5;
  }
  
  return 0; // Declining/Unknown
}

/**
 * Data Completeness Scoring (15 points max)
 * Count populated fields from Lead interface and additional_data
 */
export function getDataCompletenessScore(lead: Lead): number {
  let dataPoints = 0;
  
  // Core fields from Lead interface
  if (lead.name && lead.name.trim()) dataPoints++;
  if (lead.email && lead.email.trim() && lead.email !== 'N/A') dataPoints++;
  if (lead.phone && lead.phone.trim() && lead.phone !== 'N/A') dataPoints++;
  if (lead.title && lead.title.trim() && lead.title !== 'N/A') dataPoints++;
  if (lead.company && lead.company.trim() && lead.company !== 'N/A') dataPoints++;
  if (lead.location && lead.location.trim() && lead.location !== 'N/A') dataPoints++;
  if (lead.industry && lead.industry.trim() && lead.industry !== 'N/A') dataPoints++;
  if (lead.linkedin_url && lead.linkedin_url.trim()) dataPoints++;
  
  // Enriched fields
  if (lead.company_size && lead.company_size.trim() && lead.company_size !== 'N/A') dataPoints++;
  if (lead.organization_linkedin_url && lead.organization_linkedin_url.trim()) dataPoints++;
  if (lead.organization_url && lead.organization_url.trim()) dataPoints++;
  
  // Additional data fields (count non-null, non-empty values)
  if (lead.additional_data && typeof lead.additional_data === 'object') {
    const ad = lead.additional_data as any;
    Object.values(ad).forEach(value => {
      if (value && String(value).trim() && String(value).trim() !== 'N/A') {
        dataPoints++;
      }
    });
  } else if (lead.additional_data && typeof lead.additional_data === 'string' && lead.additional_data.trim()) {
    dataPoints += 2; // String summary counts as 2 data points
  }
  
  // Apply scoring thresholds
  if (dataPoints >= 8) return 15; // Rich Profile (8+ data points)
  if (dataPoints >= 5) return 10; // Good Profile (5-7 data points)
  if (dataPoints >= 3) return 5;  // Basic Profile (3-4 data points)
  return 0; // Poor Profile (0-2 data points)
}

/**
 * Get lead tier based on score (S/A/B/C/D system)
 */
export function getLeadTier(score: number): LeadTier {
  if (score >= 80) return 'S'; // Action Ready: 80-100 points
  if (score >= 60) return 'A'; // Priority Prospect: 60-79 points
  if (score >= 40) return 'B'; // Basic Profile: 40-59 points
  if (score >= 20) return 'C'; // Research Required: 20-39 points
  return 'D'; // Incomplete Profile: 0-19 points
}

/**
 * Get tier information with Complete Controller colors and actions
 */
export function getTierInfo(tier: LeadTier): TierInfo {
  return TIER_INFO[tier];
}

/**
 * Get tier color (Complete Controller Design System)
 */
export function getTierColor(tier: LeadTier): string {
  return TIER_COLORS[tier];
}

/**
 * Get lead industry using existing logic from LeadsTable
 * This function bridges to the existing getIndustry logic
 */
export function getLeadIndustry(lead: Lead): string {
  // Use existing industry detection logic from LeadsTable
  // This is a placeholder that should match the complex logic in LeadsTable.tsx
  return lead.industry || 'N/A';
}