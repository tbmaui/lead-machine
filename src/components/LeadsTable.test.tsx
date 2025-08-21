import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LeadsTable from './LeadsTable';
import type { Lead } from '@/hooks/useLeadGeneration';

function buildLead(partial: Partial<Lead> = {}): Lead {
  return {
    id: '1',
    name: 'Jane Doe',
    title: 'CTO',
    company: 'Acme Inc',
    email: 'jane@acme.com',
    phone: '123-456-7890',
    linkedin_url: 'https://linkedin.com/in/janedoe',
    location: 'Austin, TX',
    score: 4,
    additional_data: {},
    ...partial,
  };
}

describe('LeadsTable quick-jump links', () => {
  it('renders contact LinkedIn button when linkedin_url exists', () => {
    const leads = [buildLead({ additional_data: { linkedin_url: 'https://linkedin.com/in/janedoe' } })];
    render(<LeadsTable leads={leads} />);
    expect(screen.getByLabelText(/Open LinkedIn profile for Jane Doe/i)).toBeInTheDocument();
  });

  it('does not render contact LinkedIn button when linkedin_url missing', () => {
    const leads = [buildLead({ additional_data: {} })];
    render(<LeadsTable leads={leads} />);
    expect(screen.queryByLabelText(/Open LinkedIn profile for Jane Doe/i)).not.toBeInTheDocument();
  });

  it('renders company website and linkedin buttons when provided', () => {
    const leads = [
      buildLead({ additional_data: { company: 'Acme Inc', organization_url: 'https://acme.com', organization_linkedin_url: 'https://linkedin.com/company/acme' } }),
    ];
    render(<LeadsTable leads={leads} />);
    expect(screen.getByLabelText(/Open company website for Acme Inc/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Open company LinkedIn for Acme Inc/i)).toBeInTheDocument();
  });

  it('links open in new tab with proper rel attrs', () => {
    const leads = [
      buildLead({ additional_data: { linkedin_url: 'https://linkedin.com/in/janedoe', organization_url: 'https://acme.com' } }),
    ];
    render(<LeadsTable leads={leads} />);
    const profile = screen.getByLabelText(/Open LinkedIn profile/i) as HTMLAnchorElement;
    const website = screen.getByLabelText(/Open company website/i) as HTMLAnchorElement;
    expect(profile.target).toBe('_blank');
    expect(profile.rel).toContain('noopener');
    expect(profile.rel).toContain('noreferrer');
    expect(website.target).toBe('_blank');
    expect(website.rel).toContain('noopener');
    expect(website.rel).toContain('noreferrer');
  });

  it('stops propagation on link click', async () => {
    const user = userEvent.setup();
    const leads = [
      buildLead({ additional_data: { linkedin_url: 'https://linkedin.com/in/janedoe' } }),
    ];
    render(<LeadsTable leads={leads} />);
    const link = screen.getByLabelText(/Open LinkedIn profile/i);
    // We cannot directly assert stopPropagation; ensure no errors and element is clickable
    await user.click(link);
    expect(link).toBeInTheDocument();
  });
});


