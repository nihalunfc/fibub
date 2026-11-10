// Sales tax / VAT / GST: add tax to a price or take it out of a tax-inclusive price. Pure maths, no DOM.
// Rates checked 2026-11-10: CRA GST/HST calculator; BC, Manitoba, Saskatchewan finance pages; Revenu Québec;
// gov.uk VAT rates; PIB (GST Council 56th meeting, rates from 22 Sep 2025); Gulf tax authorities;
// US state base rates from the Tax Foundation's July 2026 table.

export interface Part { name: string; rate: number } // rate in percent

export const add = (net: number, rate: number) => net * (1 + rate / 100);
export const remove = (gross: number, rate: number) => gross / (1 + rate / 100);

// Split a total rate across its parts: works out each part's tax on the same pre-tax base.
export function split(amount: number, parts: Part[], mode: 'add' | 'remove') {
  const rate = parts.reduce((s, p) => s + p.rate, 0);
  const net = mode === 'add' ? amount : remove(amount, rate);
  const lines = parts.map((p) => ({ name: p.name, rate: p.rate, tax: net * p.rate / 100 }));
  const tax = lines.reduce((s, l) => s + l.tax, 0);
  return { net, tax, gross: net + tax, rate, lines };
}

export const CANADA: Record<string, { name: string; parts: Part[] }> = {
  AB: { name: 'Alberta', parts: [{ name: 'GST', rate: 5 }] },
  BC: { name: 'British Columbia', parts: [{ name: 'GST', rate: 5 }, { name: 'PST', rate: 7 }] },
  MB: { name: 'Manitoba', parts: [{ name: 'GST', rate: 5 }, { name: 'RST', rate: 7 }] },
  NB: { name: 'New Brunswick', parts: [{ name: 'HST', rate: 15 }] },
  NL: { name: 'Newfoundland and Labrador', parts: [{ name: 'HST', rate: 15 }] },
  NS: { name: 'Nova Scotia', parts: [{ name: 'HST', rate: 14 }] },
  NT: { name: 'Northwest Territories', parts: [{ name: 'GST', rate: 5 }] },
  NU: { name: 'Nunavut', parts: [{ name: 'GST', rate: 5 }] },
  ON: { name: 'Ontario', parts: [{ name: 'HST', rate: 13 }] },
  PE: { name: 'Prince Edward Island', parts: [{ name: 'HST', rate: 15 }] },
  QC: { name: 'Quebec', parts: [{ name: 'GST', rate: 5 }, { name: 'QST', rate: 9.975 }] },
  SK: { name: 'Saskatchewan', parts: [{ name: 'GST', rate: 5 }, { name: 'PST', rate: 6 }] },
  YT: { name: 'Yukon', parts: [{ name: 'GST', rate: 5 }] },
};

// State-level rate only; cities and counties add their own. Tax Foundation, "State and local sales tax rates,
// midyear 2026" (as of 1 July 2026).
export const US_STATES: [string, string, number][] = [
  ['AL', 'Alabama', 4], ['AK', 'Alaska', 0], ['AZ', 'Arizona', 5.6], ['AR', 'Arkansas', 6.5], ['CA', 'California', 7.25],
  ['CO', 'Colorado', 2.9], ['CT', 'Connecticut', 6.35], ['DE', 'Delaware', 0], ['DC', 'District of Columbia', 6],
  ['FL', 'Florida', 6], ['GA', 'Georgia', 4], ['HI', 'Hawaii', 4], ['ID', 'Idaho', 6], ['IL', 'Illinois', 6.25],
  ['IN', 'Indiana', 7], ['IA', 'Iowa', 6], ['KS', 'Kansas', 6.5], ['KY', 'Kentucky', 6], ['LA', 'Louisiana', 5],
  ['ME', 'Maine', 5.5], ['MD', 'Maryland', 6], ['MA', 'Massachusetts', 6.25], ['MI', 'Michigan', 6], ['MN', 'Minnesota', 6.875],
  ['MS', 'Mississippi', 7], ['MO', 'Missouri', 4.225], ['MT', 'Montana', 0], ['NE', 'Nebraska', 5.5], ['NV', 'Nevada', 6.85],
  ['NH', 'New Hampshire', 0], ['NJ', 'New Jersey', 6.625], ['NM', 'New Mexico', 4.875], ['NY', 'New York', 4],
  ['NC', 'North Carolina', 4.75], ['ND', 'North Dakota', 5], ['OH', 'Ohio', 5.75], ['OK', 'Oklahoma', 4.5], ['OR', 'Oregon', 0],
  ['PA', 'Pennsylvania', 6], ['RI', 'Rhode Island', 7], ['SC', 'South Carolina', 6], ['SD', 'South Dakota', 4.2],
  ['TN', 'Tennessee', 7], ['TX', 'Texas', 6.25], ['UT', 'Utah', 6.1], ['VT', 'Vermont', 6], ['VA', 'Virginia', 5.3],
  ['WA', 'Washington', 6.5], ['WV', 'West Virginia', 6], ['WI', 'Wisconsin', 5], ['WY', 'Wyoming', 4],
];

export const UK_VAT = [{ label: 'Standard 20%', rate: 20 }, { label: 'Reduced 5%', rate: 5 }, { label: 'Zero 0%', rate: 0 }];
// GST 2.0 from 22 Sep 2025: 5% merit, 18% standard, 40% demerit; 3% for gold and silver; 0.25% rough diamonds.
export const INDIA_GST = [5, 18, 40, 3, 0.25];
export const GULF_VAT: { name: string; rate: number }[] = [
  { name: 'United Arab Emirates', rate: 5 }, { name: 'Saudi Arabia', rate: 15 }, { name: 'Bahrain', rate: 10 }, { name: 'Oman', rate: 5 },
];

// India: inside one state the GST is split half CGST, half SGST; between states it is all IGST.
export const indiaParts = (rate: number, interState: boolean): Part[] =>
  interState ? [{ name: 'IGST', rate }] : [{ name: 'CGST', rate: rate / 2 }, { name: 'SGST/UTGST', rate: rate / 2 }];
