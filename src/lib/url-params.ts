/**
 * URL Parameter Utilities for Search State Persistence
 * Handles encoding/decoding of search form state to/from URL parameters
 */

export interface SearchCriteria {
  targetLocation: string;
  selectedIndustries: string[];
  selectedCompanySizes: string[];
  selectedJobTitles: string[];
  leadCount: number[];
  employeeRange?: [number, number];
}

/**
 * Convert form state to URL parameters
 */
export function encodeSearchParams(criteria: SearchCriteria): URLSearchParams {
  const params = new URLSearchParams();

  if (criteria.targetLocation.trim()) {
    // Convert spaces to dashes for cleaner URLs
    params.set('location', criteria.targetLocation.toLowerCase().replace(/\s+/g, '-'));
  }

  if (criteria.selectedIndustries.length > 0) {
    // Comma-separate multiple industries
    params.set('industries', criteria.selectedIndustries
      .map(industry => industry.toLowerCase().replace(/\s+/g, '-'))
      .join(','));
  }

  if (criteria.selectedCompanySizes.length > 0) {
    params.set('sizes', criteria.selectedCompanySizes.join(','));
  }

  if (criteria.selectedJobTitles.length > 0) {
    // Handle job titles with special characters
    params.set('titles', criteria.selectedJobTitles
      .map(title => title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))
      .join(','));
  }

  if (criteria.leadCount.length > 0) {
    params.set('count', criteria.leadCount[0].toString());
  }

  if (criteria.employeeRange && criteria.employeeRange.length === 2) {
    params.set('employees', `${criteria.employeeRange[0]},${criteria.employeeRange[1]}`);
  }

  return params;
}

/**
 * Parse URL parameters back to form state
 */
export function decodeSearchParams(params: URLSearchParams): Partial<SearchCriteria> {
  const criteria: Partial<SearchCriteria> = {};

  try {
    const location = params.get('location');
    if (location) {
      // Convert dashes back to spaces and capitalize
      criteria.targetLocation = location
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }

    const industries = params.get('industries');
    if (industries) {
      criteria.selectedIndustries = industries
        .split(',')
        .map(industry => industry
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
        )
        .filter(Boolean);
    }

    const sizes = params.get('sizes');
    if (sizes) {
      criteria.selectedCompanySizes = sizes.split(',').filter(Boolean);
    }

    const titles = params.get('titles');
    if (titles) {
      criteria.selectedJobTitles = titles
        .split(',')
        .map(title => {
          // Convert back to proper job title format
          const normalized = title.replace(/-/g, ' ');
          // Handle common abbreviations
          return normalized
            .split(' ')
            .map(word => {
              if (word.toLowerCase() === 'ceo') return 'CEO';
              if (word.toLowerCase() === 'cfo') return 'CFO';
              if (word.toLowerCase() === 'vp') return 'VP';
              return word.charAt(0).toUpperCase() + word.slice(1);
            })
            .join(' ');
        })
        .filter(Boolean);
    }

    const count = params.get('count');
    if (count) {
      const countNum = parseInt(count, 10);
      if (!isNaN(countNum) && countNum > 0) {
        criteria.leadCount = [countNum];
      }
    }

    const employees = params.get('employees');
    if (employees) {
      const [min, max] = employees.split(',').map(n => parseInt(n.trim(), 10));
      if (!isNaN(min) && !isNaN(max) && min <= max) {
        criteria.employeeRange = [min, max];
      }
    }
  } catch (error) {
    console.warn('Error decoding search parameters:', error);
    // Return partial criteria - graceful degradation
  }

  return criteria;
}

/**
 * Update browser URL without reload
 */
export function updateURL(criteria: SearchCriteria, demo: boolean = false): void {
  try {
    const params = encodeSearchParams(criteria);
    
    if (demo) {
      params.set('demo', 'true');
    }

    const newURL = `${window.location.pathname}?${params.toString()}`;
    
    // Use pushState to update URL without reload
    if (window.history?.pushState) {
      window.history.pushState(null, '', newURL);
    }
  } catch (error) {
    console.warn('Error updating URL:', error);
    // Graceful degradation - URL not updated but functionality continues
  }
}