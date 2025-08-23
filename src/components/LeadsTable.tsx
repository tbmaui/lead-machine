import { Lead } from "@/hooks/useLeadGeneration";
import { ExternalLink, Linkedin, Copy, ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/sonner";
import { useMemo, useState } from "react";
import { applyFilters, type Filters } from "@/lib/filters";
import { Input } from "@/components/ui/input";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

interface LeadsTableProps {
  leads: Lead[];
}

type SortKey = "name" | "title" | "company" | "industry" | "phone" | "email" | "location" | "score";
type SortDirection = "asc" | "desc";

const LeadsTable = ({ leads }: LeadsTableProps) => {
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
    return Math.random() > 0.3 ? 'bg-green-500' : 'bg-orange-500';
  };

  const getEmailStatusColor = (email?: string) => {
    if (!email || email.trim() === '') return 'bg-gray-300';
    // Simple verification logic - in real app this would come from backend
    return Math.random() > 0.3 ? 'bg-green-500' : 'bg-orange-500';
  };

  const renderStars = (score: number) => {
    const stars = [];
    const fullStars = Math.floor(score);
    
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span 
          key={i} 
          className={i < fullStars ? 'text-green-500' : 'text-gray-300'}
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
    return (lead as any)?.company_linkedin_url ||
           ad.company_linkedin_url ||
           ad.linkedin_company_url ||
           ad.organization_linkedin_url ||
           ad.company_linkedin ||
           ad.companyLinkedIn;
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
    const city = ad.city || '';
    const state = ad.state || '';
    const region = ad.region || '';
    const country = ad.country || '';
    const location = lead.location || '';
    if (city && state) return `${city}, ${state}`;
    return state || region || country || location || 'N/A';
  };

  const getIndustry = (lead: Lead) => {
    const ad = (lead.additional_data as any) || {};
    return (
      (lead.industry && String(lead.industry).trim()) ||
      ad.industry ||
      ad.company_industry ||
      ad.sector ||
      ad.naics ||
      ''
    );
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
        const aNum = typeof aVal === 'number' ? aVal : Number(aVal ?? 0);
        const bNum = typeof bVal === 'number' ? bVal : Number(bVal ?? 0);
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
    return applyFilters(leads, { ...filters, text: debouncedText });
  }, [leads, filters, debouncedText]);

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
    <div className="neu-card overflow-hidden text-xs">
      <div className="flex items-center justify-between p-3 border-b border-border">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="text-xs text-muted-foreground mr-2">
            {filteredLeads.length !== leads.length ? `Showing ${filteredLeads.length} of ${leads.length} leads` : `Showing ${leads.length} leads`}
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
        <div className="flex items-center gap-2">
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
      {showFilters && (
        <div id="filters-panel" className="flex items-center gap-2 p-3 border-b border-border">
          <div className="flex-1 grid grid-cols-2 md:grid-cols-7 gap-2">
            <label className="sr-only" htmlFor="filter-name">Filter Name</label>
            <Input id="filter-name" placeholder="Filter Name" value={filters.text.name || ""} onChange={(e) => setFilters(f => ({ ...f, text: { ...f.text, name: e.target.value } }))} />
            <label className="sr-only" htmlFor="filter-title">Filter Title</label>
            <Input id="filter-title" placeholder="Filter Title" value={filters.text.title || ""} onChange={(e) => setFilters(f => ({ ...f, text: { ...f.text, title: e.target.value } }))} />
            <label className="sr-only" htmlFor="filter-company">Filter Company</label>
            <Input id="filter-company" placeholder="Filter Company" value={filters.text.company || ""} onChange={(e) => setFilters(f => ({ ...f, text: { ...f.text, company: e.target.value } }))} />
            <label className="sr-only" htmlFor="filter-email">Filter Email</label>
            <Input id="filter-email" placeholder="Filter Email" value={filters.text.email || ""} onChange={(e) => setFilters(f => ({ ...f, text: { ...f.text, email: e.target.value } }))} />
            <label className="sr-only" htmlFor="filter-location">Filter Location</label>
            <Input id="filter-location" placeholder="Filter Location" value={filters.text.location || ""} onChange={(e) => setFilters(f => ({ ...f, text: { ...f.text, location: e.target.value } }))} />
            <label className="sr-only" htmlFor="filter-industry">Filter Industry</label>
            <Input id="filter-industry" placeholder="Filter Industry" value={filters.text.industry || ""} onChange={(e) => setFilters(f => ({ ...f, text: { ...f.text, industry: e.target.value } }))} />
            <div className="flex items-center gap-2">
              <label htmlFor="filter-has-email" className="text-xs text-muted-foreground">Has Email</label>
              <input id="filter-has-email" aria-label="Filter Has Email" type="checkbox" checked={!!filters.hasEmail} onChange={(e) => setFilters(f => ({ ...f, hasEmail: e.target.checked ? true : undefined }))} />
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="filter-has-phone" className="text-xs text-muted-foreground">Has Phone</label>
              <input id="filter-has-phone" aria-label="Filter Has Phone" type="checkbox" checked={!!filters.hasPhone} onChange={(e) => setFilters(f => ({ ...f, hasPhone: e.target.checked ? true : undefined }))} />
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="filter-score-min" className="text-xs text-muted-foreground">Min Score</label>
              <Input id="filter-score-min" inputMode="numeric" placeholder="Min" value={filters.scoreMin ?? ""} onChange={(e) => setFilters(f => ({ ...f, scoreMin: e.target.value === "" ? null : Number(e.target.value) }))} />
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="filter-score-max" className="text-xs text-muted-foreground">Max Score</label>
              <Input id="filter-score-max" inputMode="numeric" placeholder="Max" value={filters.scoreMax ?? ""} onChange={(e) => setFilters(f => ({ ...f, scoreMax: e.target.value === "" ? null : Number(e.target.value) }))} />
            </div>
          </div>
        </div>
      )}
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="border-b border-border text-muted-foreground">
            <th
              className="text-left p-2 font-medium uppercase tracking-wide w-[16%]"
              aria-sort={sortKey === 'name' ? (sortDirection === 'asc' ? 'ascending' : sortDirection === 'desc' ? 'descending' : 'none') : 'none'}
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
              className="text-left p-2 font-medium uppercase tracking-wide w-[16%]"
              aria-sort={sortKey === 'title' ? (sortDirection === 'asc' ? 'ascending' : sortDirection === 'desc' ? 'descending' : 'none') : 'none'}
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
              className="text-left p-2 font-medium uppercase tracking-wide w-[18%]"
              aria-sort={sortKey === 'company' ? (sortDirection === 'asc' ? 'ascending' : sortDirection === 'desc' ? 'descending' : 'none') : 'none'}
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
              className="text-left p-2 font-medium uppercase tracking-wide w-[12%]"
              aria-sort={sortKey === 'industry' ? (sortDirection === 'asc' ? 'ascending' : sortDirection === 'desc' ? 'descending' : 'none') : 'none'}
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
              className="text-left p-2 font-medium uppercase tracking-wide w-[12%]"
              aria-sort={sortKey === 'phone' ? (sortDirection === 'asc' ? 'ascending' : sortDirection === 'desc' ? 'descending' : 'none') : 'none'}
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
              className="text-left p-2 font-medium uppercase tracking-wide w-[16%]"
              aria-sort={sortKey === 'email' ? (sortDirection === 'asc' ? 'ascending' : sortDirection === 'desc' ? 'descending' : 'none') : 'none'}
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
              className="text-left p-2 font-medium uppercase tracking-wide w-[12%]"
              aria-sort={sortKey === 'location' ? (sortDirection === 'asc' ? 'ascending' : sortDirection === 'desc' ? 'descending' : 'none') : 'none'}
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
              className="text-left p-2 font-medium uppercase tracking-wide w-[8%]"
              aria-sort={sortKey === 'score' ? (sortDirection === 'asc' ? 'ascending' : sortDirection === 'desc' ? 'descending' : 'none') : 'none'}
            >
              <button
                type="button"
                aria-label="Sort by Score"
                onClick={() => cycleSort('score')}
                className="inline-flex items-center gap-1 hover:text-foreground"
              >
                Score {sortKey === 'score' ? (sortDirection === 'asc' ? <ChevronUp className="h-3 w-3" /> : sortDirection === 'desc' ? <ChevronDown className="h-3 w-3" /> : <ChevronsUpDown className="h-3 w-3" />) : <ChevronsUpDown className="h-3 w-3 opacity-50" />}
              </button>
            </th>
            <th className="text-left p-2 font-medium uppercase tracking-wide w-[8%]">LinkedIn</th>
            <th className="text-left p-2 font-medium uppercase tracking-wide w-[8%]">Company Website</th>
            <th className="text-left p-2 font-medium uppercase tracking-wide w-[8%]">Company LinkedIn</th>
          </tr>
        </thead>
        <tbody>
          {sortedLeads.map((lead, index) => {
            const companyWebsite = getCompanyWebsite(lead);
            const companyLinkedIn = getCompanyLinkedIn(lead);
            const contactLinkedIn = getContactLinkedIn(lead);
            const displayCompany = getDisplayCompany(lead);
            const industry = getIndustry(lead);
            
            return (
              <tr key={index} className="border-b border-border transition-colors hover:bg-accent/30">
                <td className="p-2">
                  <div className="flex items-center gap-2 min-w-0 max-w-full">
                    <span
                      className="font-medium text-foreground truncate whitespace-nowrap overflow-hidden text-ellipsis max-w-[20ch] sm:max-w-[24ch] lg:max-w-[28ch]"
                      title={lead.name}
                    >
                      {lead.name}
                    </span>
                    {contactLinkedIn && (
                      <a
                        href={contactLinkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Open LinkedIn profile for ${lead.name}`}
                        onClick={(e) => e.stopPropagation()}
                        className={cn(
                          buttonVariants({ variant: "ghost", size: "sm" }),
                          "p-1 h-7 w-7"
                        )}
                      >
                        <Linkedin className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </td>
                <td className="p-2">
                  <div className="min-w-0 max-w-full">
                    <span
                      className="text-foreground/80 truncate whitespace-nowrap overflow-hidden text-ellipsis max-w-[24ch] sm:max-w-[28ch] lg:max-w-[32ch] inline-block"
                      title={lead.title || 'N/A'}
                    >
                      {lead.title || 'N/A'}
                    </span>
                  </div>
                </td>
                <td className="p-2">
                  <div className="flex items-center gap-2 min-w-0 max-w-full">
                    <span
                      className="text-foreground/80 truncate whitespace-nowrap overflow-hidden text-ellipsis max-w-[20ch] sm:max-w-[28ch] lg:max-w-[32ch]"
                      title={displayCompany}
                    >
                      {displayCompany}
                    </span>
                    <div className="flex gap-1">
                      {companyWebsite && (
                        <a
                          href={companyWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Open company website for ${displayCompany}`}
                          onClick={(e) => e.stopPropagation()}
                          className={cn(
                            buttonVariants({ variant: "ghost", size: "sm" }),
                            "p-1 h-7 w-7"
                          )}
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                      {companyLinkedIn && (
                        <a
                          href={companyLinkedIn}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Open company LinkedIn for ${displayCompany}`}
                          onClick={(e) => e.stopPropagation()}
                          className={cn(
                            buttonVariants({ variant: "ghost", size: "sm" }),
                            "p-1 h-7 w-7"
                          )}
                        >
                          <Linkedin className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </td>
                <td className="p-2">
                  <span
                    className="text-foreground/80 truncate whitespace-nowrap overflow-hidden text-ellipsis max-w-[20ch] sm:max-w-[24ch] lg:max-w-[28ch]"
                    title={industry || 'N/A'}
                  >
                    {industry || 'N/A'}
                  </span>
                </td>
                <td className="p-2">
                  {getDisplayPhone(lead) ? (
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getPhoneStatusColor(getDisplayPhone(lead))}`}></div>
                      <span className="text-foreground/80">{getDisplayPhone(lead)}</span>
                      <button
                        aria-label={`Copy phone ${getDisplayPhone(lead)}`}
                        onClick={(e) => { e.stopPropagation(); copyToClipboard(getDisplayPhone(lead) as string, 'Phone'); }}
                        className={cn(
                          buttonVariants({ variant: "ghost", size: "sm" }),
                          "p-1 h-7 w-7"
                        )}
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                      <span className="text-muted-foreground">N/A</span>
                    </div>
                  )}
                </td>
                <td className="p-2">
                  {lead.email ? (
                    <div className="flex items-center gap-2 min-w-0 max-w-full">
                      <div className={`w-2 h-2 rounded-full ${getEmailStatusColor(lead.email)}`}></div>
                      <a
                        href={`mailto:${lead.email}`}
                        className="text-primary hover:underline truncate whitespace-nowrap overflow-hidden text-ellipsis max-w-[28ch] sm:max-w-[32ch] lg:max-w-[40ch] min-w-0"
                        title={lead.email}
                      >
                        {lead.email}
                      </a>
                      <button
                        aria-label={`Copy email ${lead.email}`}
                        onClick={(e) => { e.stopPropagation(); copyToClipboard(lead.email as string, 'Email'); }}
                        className={cn(
                          buttonVariants({ variant: "ghost", size: "sm" }),
                          "p-1 h-7 w-7"
                        )}
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                      <span className="text-muted-foreground">N/A</span>
                    </div>
                  )}
                </td>
                <td className="p-2">
                  <div className="min-w-0 max-w-full">
                    <span
                      className="text-foreground/80 truncate whitespace-nowrap overflow-hidden text-ellipsis max-w-[24ch] sm:max-w-[28ch] lg:max-w-[32ch] inline-block"
                      title={getLocation(lead)}
                    >
                      {getLocation(lead)}
                    </span>
                  </div>
                </td>
                <td className="p-2">
                  <div className="flex">
                    {renderStars(lead.score || 3)}
                  </div>
                </td>
                <td className="p-2">
                  {contactLinkedIn ? (
                    <a
                      href={contactLinkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open LinkedIn profile for ${lead.name}`}
                      onClick={(e) => e.stopPropagation()}
                      className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "p-1 h-7 w-7")}
                    >
                      <Linkedin className="h-3 w-3" />
                    </a>
                  ) : (
                    <span className="text-muted-foreground">N/A</span>
                  )}
                </td>
                <td className="p-2">
                  {companyWebsite ? (
                    <a
                      href={companyWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open company website for ${displayCompany}`}
                      onClick={(e) => e.stopPropagation()}
                      className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "p-1 h-7 w-7")}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <span className="text-muted-foreground">N/A</span>
                  )}
                </td>
                <td className="p-2">
                  {companyLinkedIn ? (
                    <a
                      href={companyLinkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open company LinkedIn for ${displayCompany}`}
                      onClick={(e) => e.stopPropagation()}
                      className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "p-1 h-7 w-7")}
                    >
                      <Linkedin className="h-3 w-3" />
                    </a>
                  ) : (
                    <span className="text-muted-foreground">N/A</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default LeadsTable;