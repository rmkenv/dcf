
import { StateConfig } from './types';

export const ALL_STATE_CONFIGS: Record<string, StateConfig> = {
  "AL": {
    "state": "Alabama",
    "state_code": "AL",
    "agency": "Alabama Department of Environmental Management",
    "agency_abbreviation": "ADEM",
    "air_division_url": "https://adem.alabama.gov/programs/air/",
    "permit_search_url": "https://adem.alabama.gov/programs/air/airpermitting.cnt",
    "keywords": ["emergency generator", "backup generator", "diesel generator", "standby generator", "genset"],
    "permit_types": ["Air Permit to Construct", "General Permit", "Permit by Rule"],
    "echo_state_filter": "AL"
  },
  "AK": {
    "state": "Alaska",
    "state_code": "AK",
    "agency": "Alaska Department of Environmental Conservation",
    "agency_abbreviation": "ADEC",
    "air_division_url": "https://dec.alaska.gov/air/",
    "permit_search_url": "https://dec.alaska.gov/air/air-permit/",
    "keywords": ["emergency generator", "backup generator", "diesel generator", "standby generator", "genset"],
    "permit_types": ["Air Quality Control Permit", "General Permit"],
    "echo_state_filter": "AK"
  },
  "AZ": {
    "state": "Arizona",
    "state_code": "AZ",
    "agency": "Arizona Department of Environmental Quality",
    "agency_abbreviation": "ADEQ",
    "air_division_url": "https://azdeq.gov/air",
    "permit_search_url": "https://azdeq.gov/air-permits",
    "keywords": ["emergency generator", "backup generator", "diesel generator", "standby generator", "genset"],
    "permit_types": ["Air Quality Permit", "Class I Permit", "Class II Permit", "General Permit"],
    "echo_state_filter": "AZ"
  },
  "AR": {
    "state": "Arkansas",
    "state_code": "AR",
    "agency": "Arkansas Department of Energy and Environment",
    "agency_abbreviation": "ADEE",
    "air_division_url": "https://www.adeq.state.ar.us/air/",
    "permit_search_url": "https://www.adeq.state.ar.us/air/permits/",
    "keywords": ["emergency generator", "backup generator", "diesel generator", "standby generator", "genset"],
    "permit_types": ["Air Permit to Construct", "General Permit", "Operating Permit"],
    "echo_state_filter": "AR"
  },
  "CA": {
    "state": "California",
    "state_code": "CA",
    "agency": "California Air Resources Board",
    "agency_abbreviation": "CARB",
    "air_division_url": "https://ww2.arb.ca.gov/",
    "permit_search_url": "https://www.aqmd.gov/nav/online-services/public-records/public-document-search",
    "keywords": ["emergency generator", "backup generator", "diesel generator", "standby generator", "genset"],
    "permit_types": ["Authority to Construct", "Permit to Operate", "BACT Determination"],
    "echo_state_filter": "CA",
    "notes": "California has multiple Air Quality Management Districts (AQMD). South Coast AQMD covers LA area."
  },
  "CO": {
    "state": "Colorado",
    "state_code": "CO",
    "agency": "Colorado Department of Public Health and Environment",
    "agency_abbreviation": "CDPHE",
    "air_division_url": "https://cdphe.colorado.gov/air-pollution",
    "permit_search_url": "https://cdphe.colorado.gov/air-pollution-permits",
    "keywords": ["emergency generator", "backup generator", "diesel generator", "standby generator", "genset"],
    "permit_types": ["Air Pollutant Emission Notice", "Construction Permit", "Operating Permit"],
    "echo_state_filter": "CO"
  },
  "FL": {
    "state": "Florida",
    "state_code": "FL",
    "agency": "Florida Department of Environmental Protection",
    "agency_abbreviation": "FDEP",
    "air_division_url": "https://floridadep.gov/air",
    "permit_search_url": "https://depedms.dep.state.fl.us/Oculus/servlet/shell",
    "keywords": ["emergency generator", "backup generator", "diesel generator", "standby generator", "genset"],
    "permit_types": ["Air Construction Permit", "General Permit", "Operating Permit"],
    "echo_state_filter": "FL"
  },
  "GA": {
    "state": "Georgia",
    "state_code": "GA",
    "agency": "Georgia Environmental Protection Division",
    "agency_abbreviation": "GA EPD",
    "air_division_url": "https://epd.georgia.gov/air-protection-branch",
    "permit_search_url": "https://permitsearch.gaepd.org/",
    "keywords": ["emergency generator", "backup generator", "diesel generator", "standby generator", "genset"],
    "permit_types": ["Air Quality Permit", "Synthetic Minor Permit", "General Permit"],
    "echo_state_filter": "GA"
  },
  "IL": {
    "state": "Illinois",
    "state_code": "IL",
    "agency": "Illinois Environmental Protection Agency",
    "agency_abbreviation": "IL EPA",
    "air_division_url": "https://epa.illinois.gov/topics/air-quality.html",
    "permit_search_url": "https://webapps.illinois.gov/EPA/DocumentExplorer/",
    "keywords": ["emergency generator", "backup generator", "diesel generator", "standby generator", "genset"],
    "permit_types": ["Construction Permit", "Operating Permit", "CAAPP Permit"],
    "echo_state_filter": "IL"
  },
  "MD": {
    "state": "Maryland",
    "state_code": "MD",
    "agency": "Maryland Department of the Environment",
    "agency_abbreviation": "MDE",
    "air_division_url": "https://mde.maryland.gov/programs/permits/airmanagementpermits/pages/index.aspx",
    "permit_search_url": "https://mde.maryland.gov/programs/permits/airmanagementpermits/pages/permitstoconstructandoperate.aspx",
    "keywords": ["emergency generator", "backup generator", "diesel generator", "standby generator", "genset"],
    "permit_types": ["Air Quality Permit to Construct", "General Permit - Emergency Generators", "Operating Permit"],
    "echo_state_filter": "MD",
    "notes": "Maryland requires air permits for emergency generators >500 hp diesel or >1000 hp natural gas."
  },
  "NY": {
    "state": "New York",
    "state_code": "NY",
    "agency": "New York State Department of Environmental Conservation",
    "agency_abbreviation": "NYSDEC",
    "air_division_url": "https://dec.ny.gov/regulatory/permits-licenses/air",
    "permit_search_url": "https://www.dec.ny.gov/dardata/boss/afs/issued_asf.html",
    "keywords": ["emergency generator", "backup generator", "diesel generator", "standby generator", "genset"],
    "permit_types": ["Air State Facility Permit", "Air Title V Permit", "Air Facility Registration"],
    "echo_state_filter": "NY"
  },
  "TX": {
    "state": "Texas",
    "state_code": "TX",
    "agency": "Texas Commission on Environmental Quality",
    "agency_abbreviation": "TCEQ",
    "air_division_url": "https://www.tceq.texas.gov/permitting/air",
    "permit_search_url": "https://www.tceq.texas.gov/permitting/air/air_status_permits.html",
    "keywords": ["emergency generator", "backup generator", "diesel generator", "standby generator", "genset"],
    "permit_types": ["Standard Permit", "Permit by Rule", "New Source Review Permit"],
    "echo_state_filter": "TX"
  },
  "VA": {
    "state": "Virginia",
    "state_code": "VA",
    "agency": "Virginia Department of Environmental Quality",
    "agency_abbreviation": "VADEQ",
    "air_division_url": "https://www.deq.virginia.gov/air",
    "permit_search_url": "https://www.deq.virginia.gov/permits-regulations/permits/air",
    "keywords": ["emergency generator", "backup generator", "diesel generator", "standby generator", "genset"],
    "permit_types": ["Permit to Construct", "Operating Permit", "General Permit"],
    "echo_state_filter": "VA"
  }
};
