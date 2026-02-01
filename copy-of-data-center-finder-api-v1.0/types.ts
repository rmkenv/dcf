
export interface StateConfig {
  state: string;
  state_code: string;
  agency: string;
  agency_abbreviation: string;
  air_division_url: string;
  permit_search_url: string;
  keywords: string[];
  permit_types: string[];
  echo_state_filter: string;
  notes?: string;
}

export interface PermitData {
  id: string;
  facility: string;
  location: string;
  size: string;
  fuel: string;
  issueDate: string;
  agency: string;
  description: string;
  isEmergencyGenerator?: boolean;
  sourceUrl?: string;
}

export type ViewType = 'dashboard' | 'setup' | 'analyzer' | 'api-portal';

export interface ApiTier {
  name: string;
  price: string;
  limit: string;
  features: string[];
  color: string;
}
