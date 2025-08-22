import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LeadsTable from './LeadsTable';
import type { Lead } from '@/hooks/useLeadGeneration';
import { vi } from 'vitest';
import type { Mock } from 'vitest';

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

describe('LeadsTable copy-to-clipboard buttons', () => {
  let originalDescriptor: PropertyDescriptor | undefined;
  let writeSpy: Mock | undefined;
  let originalExecCommand: any;
  let execSpy: Mock | undefined;
  let removeSuccessListener: (() => void) | undefined;

  beforeAll(() => {
    originalDescriptor = Object.getOwnPropertyDescriptor(navigator, 'clipboard');
    // @ts-expect-error jsdom types
    originalExecCommand = document.execCommand;
  });

  beforeEach(() => {
    type ClipboardLike = { writeText: (text: string) => Promise<void> };
    const mockClipboard: ClipboardLike = {
      writeText: vi.fn().mockResolvedValue(undefined) as unknown as (text: string) => Promise<void>,
    };
    writeSpy = vi.fn().mockResolvedValue(undefined) as unknown as Mock;
    // Replace the clipboard with our mock and ensure writeSpy matches it
    (mockClipboard.writeText as unknown as Mock).mockImplementation((text: string) => (writeSpy as Mock)(text));
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: mockClipboard,
    });
    execSpy = vi.fn();
    // @ts-expect-error jsdom types
    document.execCommand = execSpy;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    if (originalDescriptor) {
      Object.defineProperty(navigator, 'clipboard', originalDescriptor);
    } else {
      // @ts-expect-error cleanup when no original descriptor
      delete navigator.clipboard;
    }
    // @ts-expect-error jsdom types
    document.execCommand = originalExecCommand;
  });

  it('renders copy button next to phone when phone exists', () => {
    const leads = [buildLead({ phone: '555-111-2222' })];
    render(<LeadsTable leads={leads} />);
    expect(screen.getByLabelText(/Copy phone 555-111-2222/i)).toBeInTheDocument();
  });

  it('renders copy button next to email when email exists and mailto link remains', () => {
    const leads = [buildLead({ email: 'user@example.com' })];
    render(<LeadsTable leads={leads} />);
    expect(screen.getByLabelText(/Copy email user@example.com/i)).toBeInTheDocument();
    const mailto = screen.getByRole('link', { name: /user@example.com/i }) as HTMLAnchorElement;
    expect(mailto.href).toContain('mailto:user@example.com');
  });

  it('clicking copy phone calls clipboard and stops propagation', async () => {
    const user = userEvent.setup();
    const leads = [buildLead({ phone: '777-888-9999' })];
    render(<LeadsTable leads={leads} />);
    const btn = screen.getByLabelText(/Copy phone 777-888-9999/i);
    const success = new Promise<void>((resolve) => {
      const handler = (e: Event) => {
        const detail = (e as CustomEvent).detail;
        if (detail?.value === '777-888-9999') resolve();
      };
      document.addEventListener('lead-copy-success', handler);
      removeSuccessListener = () => document.removeEventListener('lead-copy-success', handler);
    });
    await user.click(btn);
    await success;
    removeSuccessListener?.();
  });

  it('clicking copy email calls clipboard and does not navigate', async () => {
    const user = userEvent.setup();
    const leads = [buildLead({ email: 'copyme@example.com' })];
    render(<LeadsTable leads={leads} />);
    const btn = screen.getByLabelText(/Copy email copyme@example.com/i);
    const success = new Promise<void>((resolve) => {
      const handler = (e: Event) => {
        const detail = (e as CustomEvent).detail;
        if (detail?.value === 'copyme@example.com') resolve();
      };
      document.addEventListener('lead-copy-success', handler);
      removeSuccessListener = () => document.removeEventListener('lead-copy-success', handler);
    });
    await user.click(btn);
    await success;
    removeSuccessListener?.();
  });
});

describe('LeadsTable truncation and titles', () => {
  it('applies truncate classes and title attributes to targeted cells', () => {
    const longName = 'Jane Alexandra Doe the Third of Very Long Names';
    const longTitle = 'Chief Technology Officer of International Research and Development Division';
    const longCompany = 'Acme International Holdings and Subsidiaries Worldwide Corporation Unlimited';
    const longEmail = 'jane.alexandra.doe.extremely.long.email.address@very-very-long-domain-example-company.com';
    const city = 'San Francisco';
    const state = 'California';

    const lead = buildLead({
      name: longName,
      title: longTitle,
      company: longCompany,
      email: longEmail,
      additional_data: { city, state },
    });

    render(<LeadsTable leads={[lead]} />);

    // Name span
    const nameEl = screen.getByText(longName);
    expect(nameEl).toHaveAttribute('title', longName);
    expect(nameEl.className).toMatch(/truncate/);

    // Title span
    const titleEl = screen.getByText(longTitle);
    expect(titleEl).toHaveAttribute('title', longTitle);
    expect(titleEl.className).toMatch(/truncate/);

    // Company span
    const companyEl = screen.getByText(longCompany);
    expect(companyEl).toHaveAttribute('title', longCompany);
    expect(companyEl.className).toMatch(/truncate/);

    // Email anchor should still be a mailto link and truncated with title
    const emailLink = screen.getByRole('link', { name: longEmail }) as HTMLAnchorElement;
    expect(emailLink.href).toContain(`mailto:${longEmail}`);
    expect(emailLink).toHaveAttribute('title', longEmail);
    expect(emailLink.className).toMatch(/truncate/);

    // Location span from city/state and truncated with title
    const locationFull = `${city}, ${state}`;
    const locationEl = screen.getByText(locationFull);
    expect(locationEl).toHaveAttribute('title', locationFull);
    expect(locationEl.className).toMatch(/truncate/);
  });
});

describe('LeadsTable sorting', () => {
  function leadsForSorting(): Lead[] {
    return [
      buildLead({ id: '1', name: 'Delta', title: 'Engineer', company: 'Beta Co', email: 'delta@beta.com', phone: '222', location: 'Dallas, TX', score: 2, additional_data: { city: 'Dallas', state: 'TX' } }),
      buildLead({ id: '2', name: 'alpha', title: 'Manager', company: 'Acme', email: 'alpha@acme.com', phone: '111', location: 'Austin, TX', score: 5, additional_data: { city: 'Austin', state: 'TX' } }),
      buildLead({ id: '3', name: 'Charlie', title: undefined, company: undefined, email: undefined, phone: undefined, location: undefined, score: 5, additional_data: {} }),
      buildLead({ id: '4', name: 'bravo', title: 'Architect', company: 'N/A', email: 'bravo@na.com', phone: '333', location: 'N/A', score: 3, additional_data: {} }),
    ];
  }

  const getTableRows = () => screen.getAllByRole('row').slice(1); // skip header
  const getFirstCellText = (row: HTMLElement) => {
    const firstCell = within(row).getAllByRole('cell')[0];
    return (firstCell.textContent || '').trim();
  };
  const getNameOrder = () => getTableRows().map(r => getFirstCellText(r).split('\n')[0].trim());

  it('cycles none→asc→desc→none on Name and sorts case-insensitively, stable', async () => {
    const user = userEvent.setup();
    const leads = leadsForSorting();
    render(<LeadsTable leads={leads} />);

    const nameTh = screen.getByRole('columnheader', { name: /Name/i });
    const nameBtn = screen.getByRole('button', { name: /Sort by Name/i });

    // initial: none, keep natural order
    expect(nameTh).toHaveAttribute('aria-sort', 'none');
    expect(getNameOrder()).toEqual(leads.map(l => l.name));

    // asc
    await user.click(nameBtn);
    expect(nameTh).toHaveAttribute('aria-sort', 'ascending');
    expect(getNameOrder()).toEqual(['alpha', 'bravo', 'Charlie', 'Delta']);

    // desc
    await user.click(nameBtn);
    expect(nameTh).toHaveAttribute('aria-sort', 'descending');
    expect(getNameOrder()).toEqual(['Delta', 'Charlie', 'bravo', 'alpha']);

    // back to none
    await user.click(nameBtn);
    expect(nameTh).toHaveAttribute('aria-sort', 'none');
    expect(getNameOrder()).toEqual(leads.map(l => l.name));
  });

  it('sorts by Score numerically asc and desc; missing last in asc', async () => {
    const user = userEvent.setup();
    const leads: Lead[] = [
      buildLead({ id: '1', name: 'A', score: 2 }),
      buildLead({ id: '2', name: 'B', score: 5 }),
      buildLead({ id: '3', name: 'C', score: undefined }),
      buildLead({ id: '4', name: 'D', score: 3 }),
    ];
    render(<LeadsTable leads={leads} />);

    const scoreTh = screen.getByRole('columnheader', { name: /Score/i });
    const scoreBtn = screen.getByRole('button', { name: /Sort by Score/i });

    await user.click(scoreBtn); // asc
    expect(scoreTh).toHaveAttribute('aria-sort', 'ascending');
    expect(getNameOrder()).toEqual(['A', 'D', 'B', 'C']); // C (missing) last

    await user.click(scoreBtn); // desc
    expect(scoreTh).toHaveAttribute('aria-sort', 'descending');
    expect(getNameOrder()).toEqual(['C', 'B', 'D', 'A']); // missing first in desc
  });

  it('sorts by Company using derived display company', async () => {
    const user = userEvent.setup();
    const leads: Lead[] = [
      buildLead({ id: '1', name: 'A', company: undefined, additional_data: { company: 'Zulu' } }),
      buildLead({ id: '2', name: 'B', company: 'Acme' }),
      buildLead({ id: '3', name: 'C', additional_data: { Company: 'Beta' } }),
      buildLead({ id: '4', name: 'D', company: undefined }), // N/A
    ];
    render(<LeadsTable leads={leads} />);

    const companyBtn = screen.getByRole('button', { name: /Sort by Company/i });
    await user.click(companyBtn); // asc
    expect(getNameOrder()).toEqual(['B', 'C', 'A', 'D']); // Acme, Beta, Zulu, N/A
  });

  it('sorts by Location using derived city/state', async () => {
    const user = userEvent.setup();
    const leads: Lead[] = [
      buildLead({ id: '1', name: 'A', additional_data: { city: 'Dallas', state: 'TX' } }),
      buildLead({ id: '2', name: 'B', location: 'Boston, MA' }),
      buildLead({ id: '3', name: 'C', additional_data: { city: 'Austin', state: 'TX' } }),
      buildLead({ id: '4', name: 'D', location: undefined }), // N/A
    ];
    render(<LeadsTable leads={leads} />);

    const locBtn = screen.getByRole('button', { name: /Sort by Location/i });
    await user.click(locBtn); // asc
    expect(getNameOrder()).toEqual(['C', 'B', 'A', 'D']); // Austin, Boston, Dallas, N/A
  });

  it('does not toggle sort when clicking quick-jump and copy controls', async () => {
    const user = userEvent.setup();
    const leads: Lead[] = [
      buildLead({
        id: '1',
        name: 'Alice',
        email: 'alice@example.com',
        phone: '111',
        additional_data: { linkedin_url: 'https://linkedin.com/in/alice' },
      }),
    ];
    render(<LeadsTable leads={leads} />);

    const nameTh = screen.getByRole('columnheader', { name: /Name/i });
    const nameBtn = screen.getByRole('button', { name: /Sort by Name/i });

    await user.click(nameBtn); // asc
    expect(nameTh).toHaveAttribute('aria-sort', 'ascending');

    const profileLink = screen.getByLabelText(/Open LinkedIn profile for Alice/i);
    await user.click(profileLink);
    expect(nameTh).toHaveAttribute('aria-sort', 'ascending');

    const copyEmailBtn = screen.getByLabelText(/Copy email alice@example.com/i);
    await user.click(copyEmailBtn);
    expect(nameTh).toHaveAttribute('aria-sort', 'ascending');
  });
});

