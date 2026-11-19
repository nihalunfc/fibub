// Hardware prices for Part B of the Offline AI course, by country. Each price says where it came from and when it was
// read. A missing price shows "check the official store". Update the CHECKED date and the numbers together.
export type Country = 'IN' | 'CA' | 'US' | 'UK';
export const COUNTRIES: { id: Country; name: string; sym: string; locale: string }[] = [
  { id: 'IN', name: 'India', sym: '₹', locale: 'en-IN' },
  { id: 'CA', name: 'Canada', sym: 'CA$', locale: 'en-CA' },
  { id: 'US', name: 'USA', sym: 'US$', locale: 'en-US' },
  { id: 'UK', name: 'UK', sym: '£', locale: 'en-GB' },
];
export const CHECKED = '18 November 2026';

// A price is one number or a [low, high] range, in the country's own currency.
export type Price = number | [number, number];
export interface Option {
  name: string;
  memory: string;
  note: string;
  price: Partial<Record<Country, Price>>;
}
export interface Tier { id: string; name: string; slug: string; options: Option[] }

export const TIERS: Tier[] = [
  { id: 'budget', name: 'Budget: use what you have', slug: 'budget-tier', options: [
    { name: 'Your current laptop or PC', memory: '8 to 16 GB', note: 'Small models (Gemma 4 E2B to 12B). Costs nothing to try.', price: { IN: 0, CA: 0, US: 0, UK: 0 } },
  ] },
  { id: 'starter', name: 'Starter: 16 GB card or 16 to 32 GB Mac', slug: 'starter-tier', options: [
    { name: 'RTX 5060 Ti 16 GB graphics card (card only)', memory: '16 GB, 448 GB/s', note: 'Needs a desktop PC with a free slot and a 550 W or bigger power supply.', price: { IN: [44767, 48295], CA: [1073, 1170], US: [429, 479], UK: [640, 875] } },
    { name: 'Mac mini M6, 16 GB (base)', memory: '16 GB unified', note: 'Fits 8B to 12B models. Pick 24 or 32 GB if you can.', price: { IN: 99900, CA: 1249, US: 899, UK: 899 } },
    { name: 'Mac mini M6, 32 GB', memory: '32 GB unified', note: 'Fits 27B to 31B models at 4-bit.', price: { US: 1299 } },
  ] },
  { id: 'enthusiast', name: 'Enthusiast: 24 to 64 GB', slug: 'enthusiast-tier', options: [
    { name: 'Used RTX 3090 24 GB (card only)', memory: '24 GB, 936 GB/s', note: 'Second-hand: test it before paying. Draws up to 350 W.', price: { US: [699, 999] } },
    { name: 'RTX 5070 Ti 16 GB (card only)', memory: '16 GB, 896 GB/s', note: 'Fast, but still 16 GB: speed, not bigger models.', price: { US: [1049, 1299] } },
    { name: 'RTX 5090 32 GB (card only)', memory: '32 GB, 1,792 GB/s', note: 'The fastest home card; street prices run far above the $1,999 list price.', price: { IN: 332000, US: [2500, 5000] } },
    { name: 'Mac mini M5 Pro, 24 GB (base)', memory: '24 GB unified', note: '48 GB is US$2,299 and 64 GB is US$2,699.', price: { IN: 209900, CA: 2399, US: 1699 } },
  ] },
  { id: 'box', name: '128 GB AI boxes', slug: 'unified-memory-boxes', options: [
    { name: 'AMD Ryzen AI Halo box', memory: '128 GB unified, about 256 GB/s', note: 'Windows or Linux. Big MoE models at fair speed.', price: { US: 3999 } },
    { name: 'NVIDIA DGX Spark', memory: '128 GB unified, 273 GB/s', note: 'Linux, NVIDIA software. Built for developers.', price: { US: 4699 } },
    { name: 'Mac Studio M5 Max, 128 GB', memory: '128 GB unified, about 614 GB/s', note: 'Base Mac Studio (36 GB) is ₹2,79,900, CA$3,499, US$2,499, from £2,499.', price: { US: 5099 } },
  ] },
];

// Home electricity: the unit and where the typical price came from; MID is the typical price per kWh the calculator starts with.
export const POWER: Record<Country, { unit: string; src: string }> = {
  IN: { unit: '₹ per unit (kWh)', src: 'State tariffs vary; about ₹6.5 average (GlobalPetrolPrices, 2023 to 2025 average).' },
  CA: { unit: 'CA$ per kWh', src: 'Ontario time-of-use from 1 November 2026: 9.1¢ off-peak, 14.6¢ mid-peak, 18.9¢ on-peak (Ontario Energy Board), before delivery charges. Quebec is lower, Alberta varies.' },
  US: { unit: 'US$ per kWh', src: 'National average 18.2¢ in August 2026 (EIA, via ElectricRates.org); Nevada 12.7¢, Massachusetts 30.5¢, Hawaii 47.2¢.' },
  UK: { unit: '£ per kWh', src: 'Price cap 1 October to 31 December 2026: 26.32p per kWh, plus 54.83p a day standing charge (Ofgem). Fixed deals can be lower.' },
};
export const MID: Record<Country, number> = { IN: 6.5, CA: 0.13, US: 0.182, UK: 0.2632 };

export function money(c: Country, p: Price, cents = false): string {
  const meta = COUNTRIES.find((x) => x.id === c)!;
  // Symbols are spelled out (CA$, US$) because a bare $ is ambiguous between Canada and the USA.
  const one = (n: number) => meta.sym + n.toLocaleString(meta.locale, { maximumFractionDigits: cents ? 2 : 0, minimumFractionDigits: cents ? 2 : 0 });
  return Array.isArray(p) ? `${one(p[0])} to ${one(p[1])}` : one(p);
}
