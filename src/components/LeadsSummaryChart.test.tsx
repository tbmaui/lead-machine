import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LeadsSummaryChart, { computeQualityBreakdown, computeTitlesBreakdown } from './LeadsSummaryChart';
import type { Lead } from '@/hooks/useLeadGeneration';

function buildLead(partial: Partial<Lead> = {}): Lead {
  return {
    id: 'id',
    name: 'User',
    title: 'CTO',
    company: 'Acme',
    email: 'user@acme.com',
    phone: '123',
    location: 'Austin, TX',
    score: 3,
    additional_data: {},
    ...partial,
  };
}

describe('LeadsSummaryChart aggregation utils', () => {
  it('computes quality breakdown correctly', () => {
    const leads: Lead[] = [
      buildLead({ email: 'a@a.com', phone: '1' }), // both
      buildLead({ email: 'b@b.com', phone: '' }), // email only
      buildLead({ email: '', phone: '2' }), // phone only
      buildLead({ email: '  ', phone: undefined }), // neither
    ];
    const result = computeQualityBreakdown(leads);
    const map = Object.fromEntries(result.map(r => [r.name, r.value]));
    expect(map['Both']).toBe(1);
    expect(map['Has Email']).toBe(1);
    expect(map['Has Phone']).toBe(1);
    expect(map['Neither']).toBe(1);
  });

  it('computes titles breakdown with top-5 and Other', () => {
    const leads: Lead[] = [];
    const titles = ['A','B','C','D','E','F'];
    for (let i = 0; i < 10; i++) leads.push(buildLead({ title: 'A' }));
    for (let i = 0; i < 8; i++) leads.push(buildLead({ title: 'B' }));
    for (let i = 0; i < 6; i++) leads.push(buildLead({ title: 'C' }));
    for (let i = 0; i < 4; i++) leads.push(buildLead({ title: 'D' }));
    for (let i = 0; i < 2; i++) leads.push(buildLead({ title: 'E' }));
    for (let i = 0; i < 1; i++) leads.push(buildLead({ title: 'F' }));
    const result = computeTitlesBreakdown(leads);
    const names = result.map(r => r.name);
    expect(names).toContain('A');
    expect(names).toContain('B');
    expect(names).toContain('C');
    expect(names).toContain('D');
    expect(names).toContain('E');
    // F should be grouped into Other
    expect(names).toContain('Other');
  });
});

describe('LeadsSummaryChart component', () => {
  it('returns null when no leads', () => {
    const { container } = render(<LeadsSummaryChart leads={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders summary and toggles between modes', async () => {
    const user = userEvent.setup();
    const leads = [
      buildLead({ email: 'x@x.com', phone: '1', title: 'CTO' }),
      buildLead({ email: 'y@y.com', phone: '', title: 'VP' }),
    ];
    render(<LeadsSummaryChart leads={leads} />);
    expect(screen.getByText(/Summary/i)).toBeInTheDocument();
    const qualityRadio = screen.getByRole('radio', { name: /show quality breakdown/i });
    const titlesRadio = screen.getByRole('radio', { name: /show titles breakdown/i });
    // default is quality selected
    expect(qualityRadio).toHaveAttribute('aria-checked', 'true');
    expect(titlesRadio).toHaveAttribute('aria-checked', 'false');
    await user.click(titlesRadio);
    expect(titlesRadio).toHaveAttribute('aria-checked', 'true');
    expect(qualityRadio).toHaveAttribute('aria-checked', 'false');

    // Sectors render inside ResponsiveContainer which measures 0x0 in jsdom.
    // We validate toggle behavior here; a11y focus is implemented in component.
  });
});


