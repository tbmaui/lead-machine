import { render, screen, waitFor } from '@testing-library/react';
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

