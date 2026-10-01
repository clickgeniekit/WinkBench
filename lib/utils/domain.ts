// Pure domain normalization and detection utility functions
// Safe for both client and server components

export function normalizeDomain(input: string, keepWww = false): string {
  if (!input) return '';
  let cleaned = input.trim().toLowerCase();

  // Strip protocol
  cleaned = cleaned.replace(/^https?:\/\//i, '');
  cleaned = cleaned.replace(/^ftp:\/\//i, '');

  // Strip trailing slashes and paths
  const slashIndex = cleaned.indexOf('/');
  if (slashIndex !== -1) {
    cleaned = cleaned.substring(0, slashIndex);
  }

  // Strip query parameters
  const queryIndex = cleaned.indexOf('?');
  if (queryIndex !== -1) {
    cleaned = cleaned.substring(0, queryIndex);
  }

  // Strip port if any
  const portIndex = cleaned.indexOf(':');
  if (portIndex !== -1) {
    cleaned = cleaned.substring(0, portIndex);
  }

  // Strip www. prefix to ensure canonical domain matching (e.g. www.example.com -> example.com)
  if (!keepWww) {
    cleaned = cleaned.replace(/^www\./i, '');
  }

  return cleaned;
}

export function isDomainQuery(input: string): boolean {
  if (!input) return false;
  const cleaned = normalizeDomain(input);
  // Contains dot and valid characters without spaces
  return /^[a-z0-9][a-z0-9-]{0,61}[a-z0-9]?(\.[a-z0-9-]{2,})+$/i.test(cleaned);
}
