export type TextFilterFields = {
  name?: string;
  title?: string;
  company?: string;
  email?: string;
  location?: string;
};

export type Filters = {
  text: TextFilterFields;
  hasEmail?: boolean;
  hasPhone?: boolean;
  scoreMin?: number | null;
  scoreMax?: number | null;
};

export interface LeadLike {
  name: string;
  title?: string;
  company?: string;
  email?: string;
  phone?: string;
  location?: string;
  score?: number;
  additional_data?: any;
}

export function normalizeString(value?: string | null): string {
  if (!value) return "";
  return String(value).trim().toLowerCase();
}

function getLocation(lead: LeadLike): string {
  const city = (lead.additional_data as any)?.city || "";
  const state = (lead.additional_data as any)?.state || "";
  const location = lead.location || "";
  if (city && state) return `${city}, ${state}`;
  return location || city || state || "";
}

function getDisplayCompany(lead: LeadLike): string {
  return (
    lead.company ||
    (lead.additional_data as any)?.company ||
    (lead.additional_data as any)?.Company ||
    ""
  );
}

function getDisplayTitle(lead: LeadLike): string {
  return (
    lead.title ||
    (lead.additional_data as any)?.title ||
    (lead.additional_data as any)?.Title ||
    ""
  );
}

const TITLE_STOPWORDS = new Set(["and", "or", "&"]);

function tokenizeQuery(value: string): string[] {
  return value
    .split(/[^a-z0-9]+/i)
    .map((t) => normalizeString(t))
    .filter((t) => t.length > 0 && !TITLE_STOPWORDS.has(t));
}

export function applyFilters<T extends LeadLike>(leads: T[], filters: Filters): T[] {
  const {
    text: { name = "", title = "", company = "", email = "", location = "" } = {},
    hasEmail,
    hasPhone,
    scoreMin,
    scoreMax,
  } = filters || { text: {} };

  const nName = normalizeString(name);
  const nTitle = normalizeString(title);
  const nCompany = normalizeString(company);
  const nEmail = normalizeString(email);
  const nLocation = normalizeString(location);

  const hasTextFilters = !!(nName || nTitle || nCompany || nEmail || nLocation);
  const hasBooleanFilters = hasEmail !== undefined || hasPhone !== undefined;
  const hasScoreFilters = (scoreMin ?? null) !== null || (scoreMax ?? null) !== null;

  if (!hasTextFilters && !hasBooleanFilters && !hasScoreFilters) return leads;

  return leads.filter((lead) => {
    // text filters
    if (nName && !normalizeString(lead.name).includes(nName)) return false;
    if (nTitle) {
      const titleStr = normalizeString(getDisplayTitle(lead));
      const tokens = tokenizeQuery(nTitle);
      if (tokens.length > 0) {
        const anyMatch = tokens.some((tok) => titleStr.includes(tok));
        if (!anyMatch) return false;
      }
    }
    if (nCompany && !normalizeString(getDisplayCompany(lead)).includes(nCompany)) return false;
    if (nEmail && !normalizeString(lead.email).includes(nEmail)) return false;
    if (nLocation && !normalizeString(getLocation(lead)).includes(nLocation)) return false;

    // boolean filters
    if (hasEmail !== undefined) {
      const has = !!(lead.email && String(lead.email).trim());
      if (hasEmail !== has) return false;
    }
    if (hasPhone !== undefined) {
      const maybePhone = lead.phone ||
        (lead.additional_data && (
          (lead.additional_data['Phone Number']) ||
          (lead.additional_data['Phone']) ||
          (lead.additional_data['Mobile']) ||
          (lead.additional_data['Mobile Phone']) ||
          (lead.additional_data['mobile']) ||
          (lead.additional_data['mobile_phone']) ||
          (lead.additional_data['Work Phone']) ||
          (lead.additional_data['work_phone']) ||
          (lead.additional_data['Direct Dial']) ||
          (lead.additional_data['direct_dial']) ||
          (lead.additional_data['directDial'])
        ));
      const has = !!(maybePhone && String(maybePhone).trim());
      if (hasPhone !== has) return false;
    }

    // score filters
    if (scoreMin !== null && scoreMin !== undefined) {
      const scoreVal = typeof lead.score === "number" ? lead.score : Number(lead.score ?? NaN);
      if (!Number.isFinite(scoreVal) || scoreVal < (scoreMin as number)) return false;
    }
    if (scoreMax !== null && scoreMax !== undefined) {
      const scoreVal = typeof lead.score === "number" ? lead.score : Number(lead.score ?? NaN);
      if (!Number.isFinite(scoreVal) || scoreVal > (scoreMax as number)) return false;
    }

    return true;
  });
}


