export interface CountryInfo {
  code: string;
  name: string;
  flagEmoji: string;
}

export const COUNTRIES: CountryInfo[] = [
  { code: 'US', name: 'United States', flagEmoji: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flagEmoji: '🇬🇧' },
  { code: 'CA', name: 'Canada', flagEmoji: '🇨🇦' },
  { code: 'AU', name: 'Australia', flagEmoji: '🇦🇺' },
  { code: 'BD', name: 'Bangladesh', flagEmoji: '🇧🇩' },
  { code: 'IN', name: 'India', flagEmoji: '🇮🇳' },
  { code: 'PK', name: 'Pakistan', flagEmoji: '🇵🇰' },
  { code: 'DE', name: 'Germany', flagEmoji: '🇩🇪' },
  { code: 'FR', name: 'France', flagEmoji: '🇫🇷' },
  { code: 'AE', name: 'United Arab Emirates', flagEmoji: '🇦🇪' },
  { code: 'SA', name: 'Saudi Arabia', flagEmoji: '🇸🇦' },
  { code: 'SG', name: 'Singapore', flagEmoji: '🇸🇬' },
  { code: 'MY', name: 'Malaysia', flagEmoji: '🇲🇾' },
  { code: 'NL', name: 'Netherlands', flagEmoji: '🇳🇱' },
  { code: 'SE', name: 'Sweden', flagEmoji: '🇸🇪' },
  { code: 'CH', name: 'Switzerland', flagEmoji: '🇨🇭' },
  { code: 'IT', name: 'Italy', flagEmoji: '🇮🇹' },
  { code: 'ES', name: 'Spain', flagEmoji: '🇪🇸' },
  { code: 'IE', name: 'Ireland', flagEmoji: '🇮🇪' },
  { code: 'NZ', name: 'New Zealand', flagEmoji: '🇳🇿' },
  { code: 'ZA', name: 'South Africa', flagEmoji: '🇿🇦' },
  { code: 'BR', name: 'Brazil', flagEmoji: '🇧🇷' },
  { code: 'MX', name: 'Mexico', flagEmoji: '🇲🇽' },
  { code: 'JP', name: 'Japan', flagEmoji: '🇯🇵' },
  { code: 'KR', name: 'South Korea', flagEmoji: '🇰🇷' },
  { code: 'PH', name: 'Philippines', flagEmoji: '🇵🇭' },
  { code: 'ID', name: 'Indonesia', flagEmoji: '🇮🇩' },
  { code: 'TH', name: 'Thailand', flagEmoji: '🇹🇭' },
  { code: 'VN', name: 'Vietnam', flagEmoji: '🇻🇳' },
  { code: 'NG', name: 'Nigeria', flagEmoji: '🇳🇬' },
  { code: 'KE', name: 'Kenya', flagEmoji: '🇰🇪' },
  { code: 'EG', name: 'Egypt', flagEmoji: '🇪🇬' },
  { code: 'TR', name: 'Turkey', flagEmoji: '🇹🇷' },
  { code: 'PL', name: 'Poland', flagEmoji: '🇵🇱' },
  { code: 'NO', name: 'Norway', flagEmoji: '🇳🇴' },
  { code: 'DK', name: 'Denmark', flagEmoji: '🇩🇰' },
  { code: 'FI', name: 'Finland', flagEmoji: '🇫🇮' },
  { code: 'BE', name: 'Belgium', flagEmoji: '🇧🇪' },
  { code: 'AT', name: 'Austria', flagEmoji: '🇦🇹' },
  { code: 'PT', name: 'Portugal', flagEmoji: '🇵🇹' },
  { code: 'GR', name: 'Greece', flagEmoji: '🇬🇷' },
  { code: 'QA', name: 'Qatar', flagEmoji: '🇶🇦' },
  { code: 'KW', name: 'Kuwait', flagEmoji: '🇰🇼' },
  { code: 'OM', name: 'Oman', flagEmoji: '🇴🇲' },
  { code: 'BH', name: 'Bahrain', flagEmoji: '🇧🇭' },
  { code: 'IL', name: 'Israel', flagEmoji: '🇮🇱' },
  { code: 'AR', name: 'Argentina', flagEmoji: '🇦🇷' },
  { code: 'CL', name: 'Chile', flagEmoji: '🇨🇱' },
  { code: 'CO', name: 'Colombia', flagEmoji: '🇨🇴' },
  { code: 'LK', name: 'Sri Lanka', flagEmoji: '🇱🇰' },
  { code: 'NP', name: 'Nepal', flagEmoji: '🇳🇵' },
];

export function getCountryByCode(code?: string): CountryInfo | undefined {
  if (!code) return undefined;
  return COUNTRIES.find((c) => c.code.toUpperCase() === code.toUpperCase());
}
