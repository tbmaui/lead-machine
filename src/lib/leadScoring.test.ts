import { describe, it, expect } from 'vitest';
import {
  calculateLeadScore,
  getTitleScore,
  getContactScore,
  getCompanySizeScore,
  getIndustryScore,
  getGrowthScore,
  getDataCompletenessScore,
  getLeadTier,
  getTierInfo,
  getTierColor,
  type LeadTier
} from './leadScoring';
import { Lead } from '@/hooks/useLeadGeneration';

// Mock lead data for testing
const mockLead: Lead = {
  id: '1',
  name: 'John Doe',
  title: 'CEO',
  company: 'Test Corp',
  email: 'john@test.com',
  phone: '555-123-4567',
  linkedin_url: 'https://linkedin.com/in/johndoe',
  location: 'San Francisco, CA',
  industry: 'Technology',
  company_size: '500',
  organization_linkedin_url: 'https://linkedin.com/company/testcorp',
  organization_url: 'https://testcorp.com',
  additional_data: {
    experience: 'Over 10 years of leadership experience in tech',
    education: 'Stanford MBA',
    funding: 'Series B funded startup'
  }
};

describe('Lead Scoring System', () => {
  describe('getTitleScore', () => {
    it('should assign 25 points for CEO/Owner level titles', () => {
      expect(getTitleScore('CEO')).toBe(25);
      expect(getTitleScore('Chief Executive Officer')).toBe(25);
      expect(getTitleScore('Owner')).toBe(25);
      expect(getTitleScore('Founder')).toBe(25);
      expect(getTitleScore('President')).toBe(25);
    });

    it('should assign 20 points for C-Suite titles', () => {
      expect(getTitleScore('CTO')).toBe(20);
      expect(getTitleScore('CMO')).toBe(20);
      expect(getTitleScore('CFO')).toBe(20);
      expect(getTitleScore('CSO')).toBe(20);
      expect(getTitleScore('Chief Technology Officer')).toBe(20);
    });

    it('should assign 15 points for VP level titles', () => {
      expect(getTitleScore('VP Sales')).toBe(15);
      expect(getTitleScore('Vice President of Marketing')).toBe(15);
      expect(getTitleScore('V.P. Operations')).toBe(15);
    });

    it('should assign 10 points for Director/Manager level titles', () => {
      expect(getTitleScore('Director of Engineering')).toBe(10);
      expect(getTitleScore('Head of Sales')).toBe(10);
      expect(getTitleScore('Department Head')).toBe(10);
      expect(getTitleScore('Marketing Manager')).toBe(10);
      expect(getTitleScore('Senior Developer')).toBe(10);
      expect(getTitleScore('Team Lead')).toBe(10);
    });

    it('should assign 5 points for Associate/Junior level titles', () => {
      expect(getTitleScore('Junior Developer')).toBe(5);
      expect(getTitleScore('Associate')).toBe(5);
      expect(getTitleScore('Intern')).toBe(5);
      expect(getTitleScore('Specialist')).toBe(5);
      expect(getTitleScore('Coordinator')).toBe(5);
      expect(getTitleScore('Assistant')).toBe(5);
    });

    it('should assign 0 points for unknown/generic titles', () => {
      expect(getTitleScore('')).toBe(0);
      expect(getTitleScore('N/A')).toBe(0);
      expect(getTitleScore('Employee')).toBe(0);
      expect(getTitleScore(undefined)).toBe(0);
    });
  });

  describe('getContactScore', () => {
    it('should assign 15 points for email + phone', () => {
      expect(getContactScore('test@example.com', '555-123-4567')).toBe(15);
    });

    it('should assign 10 points for email only', () => {
      expect(getContactScore('test@example.com', undefined)).toBe(10);
      expect(getContactScore('test@example.com', '')).toBe(10);
      expect(getContactScore('test@example.com', 'N/A')).toBe(10);
    });

    it('should assign 5 points for phone only', () => {
      expect(getContactScore(undefined, '555-123-4567')).toBe(5);
      expect(getContactScore('', '555-123-4567')).toBe(5);
      expect(getContactScore('N/A', '555-123-4567')).toBe(5);
    });

    it('should assign 0 points for neither email nor phone', () => {
      expect(getContactScore(undefined, undefined)).toBe(0);
      expect(getContactScore('', '')).toBe(0);
      expect(getContactScore('N/A', 'N/A')).toBe(0);
    });
  });

  describe('getCompanySizeScore', () => {
    it('should assign 20 points for enterprise companies (1000+ employees)', () => {
      const enterpriseLead: Lead = { ...mockLead, company_size: '1000+' };
      expect(getCompanySizeScore(enterpriseLead)).toBe(20);

      const enterpriseLead2: Lead = { ...mockLead, company_size: '5000' };
      expect(getCompanySizeScore(enterpriseLead2)).toBe(20);

      const enterpriseLead3: Lead = { ...mockLead, company_size: 'Enterprise' };
      expect(getCompanySizeScore(enterpriseLead3)).toBe(20);
    });

    it('should assign 15 points for mid-market companies (100-999 employees)', () => {
      const midMarketLead: Lead = { ...mockLead, company_size: '500' };
      expect(getCompanySizeScore(midMarketLead)).toBe(15);

      const midMarketLead2: Lead = { ...mockLead, company_size: '100-999' };
      expect(getCompanySizeScore(midMarketLead2)).toBe(15);
    });

    it('should assign 10 points for small businesses (20-99 employees)', () => {
      const smallLead: Lead = { ...mockLead, company_size: '50' };
      expect(getCompanySizeScore(smallLead)).toBe(10);

      const smallLead2: Lead = { ...mockLead, company_size: 'Small' };
      expect(getCompanySizeScore(smallLead2)).toBe(10);
    });

    it('should assign 5 points for startups (1-19 employees)', () => {
      const startupLead: Lead = { ...mockLead, company_size: '10' };
      expect(getCompanySizeScore(startupLead)).toBe(5);

      const startupLead2: Lead = { ...mockLead, company_size: '1-19' };
      expect(getCompanySizeScore(startupLead2)).toBe(5);
    });

    it('should check additional_data for company size', () => {
      const leadWithAdditionalData: Lead = { 
        ...mockLead, 
        company_size: undefined,
        additional_data: { employees: '250' }
      };
      expect(getCompanySizeScore(leadWithAdditionalData)).toBe(15);
    });

    it('should assign 0 points for unknown company size', () => {
      const unknownLead: Lead = { ...mockLead, company_size: undefined };
      expect(getCompanySizeScore(unknownLead)).toBe(0);
    });
  });

  describe('getIndustryScore', () => {
    it('should assign 15 points for high priority industries', () => {
      expect(getIndustryScore('Technology')).toBe(15);
      expect(getIndustryScore('Software')).toBe(15);
      expect(getIndustryScore('SaaS')).toBe(15);
      expect(getIndustryScore('Finance')).toBe(15);
      expect(getIndustryScore('Financial Services')).toBe(15);
      expect(getIndustryScore('FinTech')).toBe(15);
      expect(getIndustryScore('Banking')).toBe(15);
    });

    it('should assign 10 points for medium priority industries', () => {
      expect(getIndustryScore('Healthcare')).toBe(10);
      expect(getIndustryScore('Medical')).toBe(10);
      expect(getIndustryScore('Manufacturing')).toBe(10);
      expect(getIndustryScore('Industrial')).toBe(10);
      expect(getIndustryScore('Retail')).toBe(10);
      expect(getIndustryScore('E-commerce')).toBe(10);
    });

    it('should assign 5 points for low priority industries', () => {
      expect(getIndustryScore('Non-profit')).toBe(5);
      expect(getIndustryScore('Government')).toBe(5);
      expect(getIndustryScore('Education')).toBe(5);
      expect(getIndustryScore('Academic')).toBe(5);
      expect(getIndustryScore('Public Sector')).toBe(5);
    });

    it('should assign 0 points for unknown/irrelevant industries', () => {
      expect(getIndustryScore('')).toBe(0);
      expect(getIndustryScore('N/A')).toBe(0);
      expect(getIndustryScore(undefined)).toBe(0);
      expect(getIndustryScore('Unknown Industry')).toBe(0);
    });
  });

  describe('getGrowthScore', () => {
    it('should assign 10 points for recent funding/high growth indicators', () => {
      const fundedLead: Lead = { 
        ...mockLead, 
        additional_data: 'Series B funding round completed last year'
      };
      expect(getGrowthScore(fundedLead)).toBe(10);

      const growthLead: Lead = { 
        ...mockLead, 
        additional_data: { description: 'Rapid growth in the tech sector' }
      };
      expect(getGrowthScore(growthLead)).toBe(10);
    });

    it('should assign 7 points for stable growth indicators', () => {
      const stableLead: Lead = { 
        ...mockLead, 
        additional_data: 'Company is growing steadily and hiring'
      };
      expect(getGrowthScore(stableLead)).toBe(7);
    });

    it('should assign 5 points for mature/stable companies', () => {
      const matureLead: Lead = { 
        ...mockLead, 
        additional_data: 'Well-established Fortune 500 company'
      };
      expect(getGrowthScore(matureLead)).toBe(5);
    });

    it('should assign 0 points for unknown/declining indicators', () => {
      const unknownLead: Lead = { 
        ...mockLead, 
        additional_data: undefined
      };
      expect(getGrowthScore(unknownLead)).toBe(0);
    });
  });

  describe('getDataCompletenessScore', () => {
    it('should assign 15 points for rich profiles (8+ data points)', () => {
      const richLead: Lead = {
        ...mockLead,
        additional_data: {
          field1: 'value1',
          field2: 'value2',
          field3: 'value3'
        }
      };
      expect(getDataCompletenessScore(richLead)).toBe(15);
    });

    it('should assign 10 points for good profiles (5-7 data points)', () => {
      const goodLead: Lead = {
        id: '1',
        name: 'John Doe',
        email: 'john@test.com',
        title: 'CEO',
        company: 'Test Corp',
        industry: 'Technology',
        location: 'San Francisco'
      };
      expect(getDataCompletenessScore(goodLead)).toBe(10);
    });

    it('should assign 5 points for basic profiles (3-4 data points)', () => {
      const basicLead: Lead = {
        id: '1',
        name: 'John Doe',
        email: 'john@test.com',
        title: 'CEO'
      };
      expect(getDataCompletenessScore(basicLead)).toBe(5);
    });

    it('should assign 0 points for poor profiles (0-2 data points)', () => {
      const poorLead: Lead = {
        id: '1',
        name: 'John Doe'
      };
      expect(getDataCompletenessScore(poorLead)).toBe(0);
    });

    it('should handle string additional_data as 2 data points', () => {
      const stringDataLead: Lead = {
        id: '1',
        name: 'John Doe',
        email: 'john@test.com',
        additional_data: 'Professional summary string'
      };
      expect(getDataCompletenessScore(stringDataLead)).toBe(5); // 3 core + 2 from string = 5 total
    });
  });

  describe('getLeadTier', () => {
    it('should assign correct tiers based on score ranges', () => {
      expect(getLeadTier(95)).toBe('S'); // 80-100: Hot Leads
      expect(getLeadTier(80)).toBe('S');
      
      expect(getLeadTier(79)).toBe('A'); // 60-79: Warm Leads
      expect(getLeadTier(60)).toBe('A');
      
      expect(getLeadTier(59)).toBe('B'); // 40-59: Qualified Leads
      expect(getLeadTier(40)).toBe('B');
      
      expect(getLeadTier(39)).toBe('C'); // 20-39: Low Priority
      expect(getLeadTier(20)).toBe('C');
      
      expect(getLeadTier(19)).toBe('D'); // 0-19: Disqualified
      expect(getLeadTier(0)).toBe('D');
    });
  });

  describe('getTierInfo', () => {
    it('should return correct tier information', () => {
      const tierS = getTierInfo('S');
      expect(tierS.label).toBe('Hot Leads');
      expect(tierS.color).toBe('#f36334');
      expect(tierS.action).toBe('Contact within 2-4 hours');
      expect(tierS.urgency).toBe('IMMEDIATE ACTION REQUIRED');

      const tierA = getTierInfo('A');
      expect(tierA.label).toBe('Warm Leads');
      expect(tierA.color).toBe('#91bfa5');
      expect(tierA.action).toBe('Contact within 24-48 hours');
      expect(tierA.urgency).toBe('HIGH PRIORITY');

      const tierB = getTierInfo('B');
      expect(tierB.label).toBe('Qualified Leads');
      expect(tierB.color).toBe('#566e67');

      const tierC = getTierInfo('C');
      expect(tierC.label).toBe('Low Priority');
      expect(tierC.color).toBe('#5d5d5f');

      const tierD = getTierInfo('D');
      expect(tierD.label).toBe('Disqualified');
      expect(tierD.color).toBe('#7c797c');
    });
  });

  describe('getTierColor', () => {
    it('should return correct Complete Controller colors', () => {
      expect(getTierColor('S')).toBe('#f36334'); // --cc-tomato
      expect(getTierColor('A')).toBe('#91bfa5'); // --cc-sea
      expect(getTierColor('B')).toBe('#566e67'); // --cc-dim1
      expect(getTierColor('C')).toBe('#5d5d5f'); // --cc-dim2
      expect(getTierColor('D')).toBe('#7c797c'); // --cc-gray
    });
  });

  describe('calculateLeadScore', () => {
    it('should calculate correct total score for high-quality lead', () => {
      const highQualityLead: Lead = {
        id: '1',
        name: 'Jane Smith',
        title: 'CEO',                    // 25 points
        email: 'jane@techcorp.com',      // +15 points (with phone)
        phone: '555-987-6543',           // (counted in contact score)
        company: 'TechCorp Inc',
        industry: 'Technology',          // 15 points
        company_size: '1500',            // 20 points (enterprise)
        location: 'Silicon Valley, CA',
        linkedin_url: 'https://linkedin.com/in/janesmith',
        organization_linkedin_url: 'https://linkedin.com/company/techcorp',
        organization_url: 'https://techcorp.com',
        additional_data: {
          experience: 'Over 15 years in tech leadership',
          education: 'MIT MBA',
          funding: 'Series C funded with rapid expansion',  // 10 points (growth)
          skills: ['Leadership', 'Strategy', 'Innovation'],
          achievements: 'Led company to 300% revenue growth'
        }
      };

      const score = calculateLeadScore(highQualityLead);
      
      // Expected: 25 (title) + 15 (contact) + 20 (company size) + 15 (industry) + 10 (growth) + 15 (data completeness) = 100
      expect(score).toBeGreaterThanOrEqual(90); // High-quality lead should score very high
      expect(score).toBeLessThanOrEqual(100);   // Max score is 100
    });

    it('should calculate correct total score for medium-quality lead', () => {
      const mediumQualityLead: Lead = {
        id: '2',
        name: 'Bob Johnson',
        title: 'Marketing Manager',      // 10 points
        email: 'bob@company.com',        // 10 points (email only)
        company: 'Mid Company',
        industry: 'Healthcare',          // 10 points
        company_size: '150',             // 15 points (mid-market)
        additional_data: {
          experience: 'Marketing professional'
        }
      };

      const score = calculateLeadScore(mediumQualityLead);
      
      // Expected: 10 (title) + 10 (contact) + 15 (company size) + 10 (industry) + 0 (growth) + 10 (data completeness) = 55
      expect(score).toBeGreaterThanOrEqual(45);
      expect(score).toBeLessThanOrEqual(65);
      expect(getLeadTier(score)).toBe('B'); // Should be Qualified Lead tier
    });

    it('should calculate correct total score for low-quality lead', () => {
      const lowQualityLead: Lead = {
        id: '3',
        name: 'Unknown Person',
        title: 'Assistant',              // 5 points
        email: 'unknown@email.com'       // 10 points (email only)
        // Missing most data fields
      };

      const score = calculateLeadScore(lowQualityLead);
      
      // Expected: 5 (title) + 10 (contact) + 0 (company size) + 0 (industry) + 0 (growth) + 5 (data completeness) = 20
      expect(score).toBeGreaterThanOrEqual(15);
      expect(score).toBeLessThanOrEqual(25);
      expect(getLeadTier(score)).toBe('C'); // Should be Low Priority tier
    });

    it('should ensure score never exceeds 100', () => {
      // Create a lead with maximum possible points
      const maxLead: Lead = {
        id: '4',
        name: 'Max Score Lead',
        title: 'CEO and Founder',
        email: 'ceo@enterprise.com',
        phone: '555-111-2222',
        company: 'Enterprise Corp',
        industry: 'Technology',
        company_size: '5000',
        location: 'New York, NY',
        linkedin_url: 'https://linkedin.com/in/max',
        organization_linkedin_url: 'https://linkedin.com/company/enterprise',
        organization_url: 'https://enterprise.com',
        additional_data: {
          funding: 'Series D with rapid growth',
          experience: 'Tech industry veteran',
          education: 'Stanford PhD',
          achievements: 'Multiple successful exits',
          skills: ['Leadership', 'Innovation', 'Strategy'],
          field1: 'value1',
          field2: 'value2',
          field3: 'value3',
          field4: 'value4',
          field5: 'value5'
        }
      };

      const score = calculateLeadScore(maxLead);
      expect(score).toBeLessThanOrEqual(100);
      expect(getLeadTier(score)).toBe('S');
    });

    it('should ensure score never goes below 0', () => {
      const emptyLead: Lead = {
        id: '5',
        name: ''
      };

      const score = calculateLeadScore(emptyLead);
      expect(score).toBeGreaterThanOrEqual(0);
    });

    it('should handle leads with missing optional fields gracefully', () => {
      const partialLead: Lead = {
        id: '6',
        name: 'Partial Lead'
        // Most fields missing
      };

      const score = calculateLeadScore(partialLead);
      expect(typeof score).toBe('number');
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });
  });

  describe('Performance Requirements', () => {
    it('should calculate scores for 1000 leads within performance benchmark', () => {
      const leads: Lead[] = Array.from({ length: 1000 }, (_, i) => ({
        id: String(i),
        name: `Lead ${i}`,
        title: i % 5 === 0 ? 'CEO' : i % 3 === 0 ? 'Director' : 'Manager',
        email: `lead${i}@company.com`,
        phone: i % 2 === 0 ? `555-${String(i).padStart(4, '0')}` : undefined,
        company: `Company ${i}`,
        industry: i % 4 === 0 ? 'Technology' : 'Healthcare'
      }));

      const startTime = performance.now();
      
      leads.forEach(lead => {
        calculateLeadScore(lead);
      });
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Story 3.1 requirement: Score calculation <50ms for 1000 leads
      expect(duration).toBeLessThan(50);
    });
  });
});