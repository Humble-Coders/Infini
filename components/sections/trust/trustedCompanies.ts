/**
 * Placeholder companies — not verified customers. Replace with real client
 * names (and, if supplied, real logo assets) before this ships to production.
 * `short` is the monogram shown in the logo cell until real logo files exist.
 */
export interface TrustedCompany {
  name: string;
  short: string;
}

export const TRUSTED_COMPANIES: TrustedCompany[] = [
  { name: "Danfoss", short: "DF" },
  { name: "Honeywell", short: "HW" },
  { name: "Cummins", short: "CM" },
  { name: "Thales", short: "TH" },
  { name: "Airbus", short: "AB" },
  { name: "Safran", short: "SF" },
  { name: "Rolls-Royce", short: "RR" },
  { name: "Boeing", short: "BO" },
  { name: "GE Aerospace", short: "GE" },
  { name: "Siemens", short: "SM" },
  { name: "MTU Aero Engines", short: "MTU" },
  { name: "BAE Systems", short: "BAE" },
  { name: "Bombardier", short: "BD" },
  { name: "Bosch", short: "BSH" },
  { name: "Michelin", short: "MI" },
  { name: "Pratt & Whitney", short: "PW" },
  { name: "Collins Aerospace", short: "CA" },
  { name: "Continental", short: "CT" },
  { name: "ZF Friedrichshafen", short: "ZF" },
  { name: "Schaeffler", short: "SC" },
  { name: "Woodward", short: "WD" },
  { name: "Liebherr", short: "LB" },
  { name: "Sandvik", short: "SV" },
  { name: "Kennametal", short: "KM" },
  { name: "Parker Hannifin", short: "PH" },
  { name: "Eaton", short: "EA" },
  { name: "Moog", short: "MG" },
  { name: "General Electric", short: "GEC" },
];
