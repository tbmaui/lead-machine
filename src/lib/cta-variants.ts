/**
 * CTA Variant System for A/B Testing and Performance Optimization
 * Provides dynamic CTA copy selection with analytics tracking
 */

export interface CTAVariant {
  id: string;
  copy: string;
  description?: string;
  urgency?: string;
  riskReversal?: string;
}

export interface CTAVariantSet {
  primary: CTAVariant[];
  secondary: CTAVariant[];
  educational: CTAVariant[];
}

// CTA variant definitions for A/B testing
export const CTA_VARIANTS: CTAVariantSet = {
  primary: [
    {
      id: 'get-leads-now',
      copy: 'Get Leads Now',
      description: 'Find your next customers today',
      urgency: 'Free for first 100 leads',
      riskReversal: 'No credit card required'
    },
    {
      id: 'start-finding-leads',
      copy: 'Start Finding Leads',
      description: 'Quality prospects in minutes',
      urgency: 'Setup in under 5 minutes',
      riskReversal: '100% satisfaction guarantee'
    },
    {
      id: 'generate-quality-leads',
      copy: 'Generate Quality Leads',
      description: 'Verified contacts & company intelligence',
      urgency: 'Join 500+ sales teams',
      riskReversal: 'Cancel anytime'
    },
    {
      id: 'find-next-customers',
      copy: 'Find Your Next Customers',
      description: 'Advanced lead discovery & enrichment',
      urgency: 'Get 50 free leads to test quality',
      riskReversal: 'Zero setup fees'
    }
  ],
  secondary: [
    {
      id: 'try-it-free',
      copy: 'Try It Free',
      description: 'Preview results with demo data',
      urgency: 'No commitment required',
      riskReversal: 'See results in 30 seconds'
    },
    {
      id: 'see-demo',
      copy: 'See Demo',
      description: 'Watch the lead generation process',
      urgency: 'Real-time preview available',
      riskReversal: 'No signup required'
    },
    {
      id: 'test-drive',
      copy: 'Test Drive',
      description: 'Experience the full platform',
      urgency: 'Instant access',
      riskReversal: 'Full demo • No strings attached'
    },
    {
      id: 'preview-results',
      copy: 'Preview Results',
      description: 'See sample leads for your industry',
      urgency: 'Pre-loaded demo ready',
      riskReversal: 'Explore without commitment'
    }
  ],
  educational: [
    {
      id: 'try-score-calculator',
      copy: 'Try Score Calculator',
      description: 'See how your leads would score',
      urgency: 'Live scoring demo',
      riskReversal: 'Educational preview only'
    },
    {
      id: 'test-lead-quality',
      copy: 'Test Lead Quality',
      description: 'Preview our scoring system',
      urgency: 'Sample leads included',
      riskReversal: 'No data required'
    },
    {
      id: 'explore-scoring',
      copy: 'Explore Scoring',
      description: 'Learn our quality assessment',
      urgency: 'Interactive demo',
      riskReversal: 'No commitment needed'
    }
  ]
};

// Variant selection strategies
export type VariantStrategy = 'random' | 'user-based' | 'session-based' | 'static';

/**
 * Select a CTA variant based on strategy
 */
export function selectCTAVariant(
  variantSet: CTAVariant[], 
  strategy: VariantStrategy = 'session-based',
  userId?: string
): CTAVariant {
  if (variantSet.length === 0) {
    throw new Error('No variants available for selection');
  }

  switch (strategy) {
    case 'random':
      return variantSet[Math.floor(Math.random() * variantSet.length)];

    case 'user-based':
      if (!userId) return variantSet[0];
      // Simple hash-based selection for consistent user experience
      const hash = simpleHash(userId);
      return variantSet[hash % variantSet.length];

    case 'session-based':
      // Use session storage for consistency during session
      return getSessionBasedVariant(variantSet);

    case 'static':
    default:
      return variantSet[0];
  }
}

/**
 * Get or set session-based variant for consistency
 */
function getSessionBasedVariant(variants: CTAVariant[]): CTAVariant {
  try {
    const sessionKey = 'cta_variant_session';
    const storedVariant = sessionStorage.getItem(sessionKey);
    
    if (storedVariant) {
      const parsed = JSON.parse(storedVariant);
      const found = variants.find(v => v.id === parsed.id);
      if (found) return found;
    }

    // Select new variant and store for session
    const selectedVariant = variants[Math.floor(Math.random() * variants.length)];
    sessionStorage.setItem(sessionKey, JSON.stringify(selectedVariant));
    return selectedVariant;
  } catch (error) {
    console.warn('Session storage unavailable, using first variant:', error);
    return variants[0];
  }
}

/**
 * Simple hash function for consistent user-based selection
 */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Analytics tracking for CTA performance
 */
export interface CTAClickEvent {
  variantId: string;
  variantCopy: string;
  location: 'hero' | 'overview' | 'education' | 'quickstart';
  userId?: string;
  timestamp: number;
  sessionId: string;
}

/**
 * Track CTA click events for analytics
 */
export function trackCTAClick(variant: CTAVariant, location: CTAClickEvent['location'], userId?: string): void {
  try {
    const event: CTAClickEvent = {
      variantId: variant.id,
      variantCopy: variant.copy,
      location,
      userId,
      timestamp: Date.now(),
      sessionId: getSessionId()
    };

    // Store in session storage for later analytics processing
    const existingEvents = JSON.parse(sessionStorage.getItem('cta_events') || '[]');
    existingEvents.push(event);
    sessionStorage.setItem('cta_events', JSON.stringify(existingEvents.slice(-50))); // Keep last 50 events

    // Log for development/debugging
    console.log('CTA Click Tracked:', event);

    // TODO: In production, send to analytics service
    // analytics.track('cta_click', event);
  } catch (error) {
    console.warn('Failed to track CTA click:', error);
  }
}

/**
 * Get or create session ID for analytics
 */
function getSessionId(): string {
  try {
    let sessionId = sessionStorage.getItem('cta_session_id');
    if (!sessionId) {
      sessionId = Date.now().toString(36) + Math.random().toString(36).substr(2);
      sessionStorage.setItem('cta_session_id', sessionId);
    }
    return sessionId;
  } catch (error) {
    // Fallback for when session storage is unavailable
    return 'fallback_' + Date.now().toString(36);
  }
}

/**
 * Get CTA performance data for analysis
 */
export function getCTAPerformanceData(): CTAClickEvent[] {
  try {
    return JSON.parse(sessionStorage.getItem('cta_events') || '[]');
  } catch (error) {
    console.warn('Failed to retrieve CTA performance data:', error);
    return [];
  }
}