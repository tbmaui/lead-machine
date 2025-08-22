import { describe, it, expect } from 'vitest';
import { applyFilters, type Filters } from './filters';

type Lead = {
  name: string;
  title?: string;
  company?: string;
  email?: string;
  phone?: string;
  location?: string;
  score?: number;
  additional_data?: any;
};

const leads: Lead[] = [
  { name: 'Alice', title: 'Engineer', company: 'Acme', email: 'alice@acme.com', phone: '1', location: 'Austin, TX', score: 5, additional_data: { city: 'Austin', state: 'TX' } },
  { name: 'Bob', title: 'Manager', company: 'Beta', email: '', phone: '', location: 'Dallas, TX', score: 3, additional_data: { city: 'Dallas', state: 'TX' } },
  { name: 'Charlie', title: 'Architect', company: 'Gamma', email: 'charlie@gamma.com', phone: '', location: '', score: 1, additional_data: {} },
  { name: 'bravo', title: undefined, company: undefined, email: undefined, phone: '9', location: undefined, score: undefined, additional_data: { city: 'Boston', state: 'MA' } },
];

describe('applyFilters', () => {
  it('returns original when no filters', () => {
    const filters: Filters = { text: {} } as any;
    expect(applyFilters(leads, filters)).toEqual(leads);
  });

  it('filters by case-insensitive text fields with trim', () => {
    const filters: Filters = { text: { name: '  ali ' } } as any;
    const result = applyFilters(leads, filters).map(l => l.name);
    expect(result).toEqual(['Alice']);
  });

  it('filters by derived company and location', () => {
    const filtersCompany: Filters = { text: { company: 'acm' } } as any;
    expect(applyFilters(leads, filtersCompany).map(l => l.name)).toEqual(['Alice']);

    const filtersLocation: Filters = { text: { location: 'boston' } } as any;
    expect(applyFilters(leads, filtersLocation).map(l => l.name)).toEqual(['bravo']);
  });

  it('filters by hasEmail and hasPhone', () => {
    const hasEmailTrue: Filters = { text: {}, hasEmail: true } as any;
    expect(applyFilters(leads, hasEmailTrue).map(l => l.name)).toEqual(['Alice', 'Charlie']);

    const hasPhoneTrue: Filters = { text: {}, hasPhone: true } as any;
    expect(applyFilters(leads, hasPhoneTrue).map(l => l.name)).toEqual(['Alice', 'bravo']);
  });

  it('filters by score min and max', () => {
    const minOnly: Filters = { text: {}, scoreMin: 3 } as any;
    expect(applyFilters(leads, minOnly).map(l => l.name)).toEqual(['Alice', 'Bob']);

    const range: Filters = { text: {}, scoreMin: 2, scoreMax: 4 } as any;
    expect(applyFilters(leads, range).map(l => l.name)).toEqual(['Bob']);
  });

  it('composes with AND semantics across fields', () => {
    const filters: Filters = { text: { name: 'a' }, hasEmail: true, scoreMin: 2 } as any;
    expect(applyFilters(leads, filters).map(l => l.name)).toEqual(['Alice']);
  });

  it('matches title by any token excluding stopwords (and/or/&)', () => {
    const dataset: Lead[] = [
      { name: 'P1', title: 'President and CEO', company: 'X', email: '', phone: '', score: 1, location: '', additional_data: {} },
      { name: 'P2', title: 'Chief Executive Officer', company: 'Y', email: '', phone: '', score: 1, location: '', additional_data: {} },
      { name: 'P3', title: 'VP, Operations', company: 'Z', email: '', phone: '', score: 1, location: '', additional_data: {} },
    ];
    const result = applyFilters(dataset, { text: { title: '  CEO  and ' } } as any).map(l => l.name);
    // Only matches explicit token occurrences in title (no acronym expansion)
    expect(result).toEqual(['P1']);
  });
});


