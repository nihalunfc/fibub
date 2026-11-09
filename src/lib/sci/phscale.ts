// pH scale explorer (school level): pH, [H⁺], [OH⁻] and pOH at 25 °C, what dilution does to a strong acid or base,
// the colours of the common school indicators and a list of household substances with rounded, typical pH values.
// Pure functions, no DOM.

export const KW = 1e-14; // ionic product of water at 25 °C (mol²/L²)

export const hFromPH = (pH: number) => 10 ** -pH;
export const ohFromPH = (pH: number) => KW / 10 ** -pH;
export const pHFromH = (h: number) => { if (!(h > 0)) throw new Error('[H⁺] must be above zero.'); return -Math.log10(h); };
export const pOH = (pH: number) => 14 - pH;

export function kind(pH: number): { id: 'acid' | 'neutral' | 'base'; text: string } {
  if (pH < 6.95) return { id: 'acid', text: pH < 3 ? 'strongly acidic' : pH < 5.5 ? 'acidic' : 'weakly acidic' };
  if (pH <= 7.05) return { id: 'neutral', text: 'neutral' };
  return { id: 'base', text: pH > 11 ? 'strongly basic (alkaline)' : pH > 8.5 ? 'basic (alkaline)' : 'weakly basic' };
}

/** pH after diluting a strong acid or base solution D times with pure water (25 °C). The excess of acid over base,
 *  [H⁺] − [OH⁻], is divided by D, then water's own ions are added back by solving [H⁺]² − x[H⁺] − Kw = 0. So an acid
 *  gets closer to 7 but never crosses it. */
export function dilute(pH: number, D: number): number {
  if (!(D >= 1)) throw new Error('Dilute by a factor of 1 or more.');
  const x = (hFromPH(pH) - ohFromPH(pH)) / D;
  const h = x >= 0 ? (x + Math.sqrt(x * x + 4 * KW)) / 2 : (2 * KW) / (-x + Math.sqrt(x * x + 4 * KW));
  return -Math.log10(h);
}

export type Indicator = { id: string; name: string; colour: (pH: number) => { name: string; hex: string } ; range: string };

const mix = (a: string, b: string, t: number) => {
  const p = (s: string) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));
  const [x, y] = [p(a), p(b)], k = Math.max(0, Math.min(1, t));
  return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * k).toString(16).padStart(2, '0')).join('');
};
const between = (pH: number, lo: number, hi: number, cLo: [string, string], cHi: [string, string], mid: string) =>
  pH <= lo ? { name: cLo[0], hex: cLo[1] } : pH >= hi ? { name: cHi[0], hex: cHi[1] } : { name: mid, hex: mix(cLo[1], cHi[1], (pH - lo) / (hi - lo)) };

/** Universal indicator: the usual chart colours, one per whole pH unit. */
export const UNIVERSAL = ['#c4161c', '#e0262d', '#ee4b2b', '#f47d2b', '#f9a72b', '#f2cf2b', '#c4d52c', '#5cb848', '#22a05a', '#1f9590', '#2a6fb5', '#3b4fa0', '#4b3a8f', '#5a2d82', '#4a1f6b'];
const UNAMES = ['red', 'red', 'red', 'orange', 'orange', 'yellow', 'yellow-green', 'green', 'green-blue', 'blue', 'blue', 'indigo', 'violet', 'violet', 'violet'];

export const INDICATORS: Indicator[] = [
  { id: 'blue-litmus', name: 'Blue litmus', range: 'turns red below about pH 4.5', colour: (p) => (p < 4.5 ? { name: 'red', hex: '#c62828' } : p < 8.3 ? { name: 'stays blue (purple near neutral)', hex: mix('#7b3fa0', '#2f5fb3', (p - 4.5) / 3.8) } : { name: 'stays blue', hex: '#2f5fb3' }) },
  { id: 'red-litmus', name: 'Red litmus', range: 'turns blue above about pH 8.3', colour: (p) => (p > 8.3 ? { name: 'blue', hex: '#2f5fb3' } : p > 4.5 ? { name: 'stays red (purple near neutral)', hex: mix('#c62828', '#7b3fa0', (p - 4.5) / 3.8) } : { name: 'stays red', hex: '#c62828' }) },
  { id: 'phenolphthalein', name: 'Phenolphthalein', range: 'colourless below 8.2, pink above about 10', colour: (p) => between(p, 8.2, 10, ['colourless', '#ffffff'], ['pink', '#e0398f'], 'light pink') },
  { id: 'methyl-orange', name: 'Methyl orange', range: 'red below 3.1, yellow above 4.4', colour: (p) => between(p, 3.1, 4.4, ['red', '#d7261e'], ['yellow', '#f2c12e'], 'orange') },
  { id: 'turmeric', name: 'Turmeric', range: 'yellow in acids, reddish-brown in bases (above about 8)', colour: (p) => between(p, 7.4, 8.6, ['yellow', '#e9b824'], ['reddish-brown', '#9b3a1c'], 'orange-brown') },
  { id: 'universal', name: 'Universal indicator', range: 'a different colour for each pH', colour: (p) => { const i = Math.max(0, Math.min(14, Math.round(p))); return { name: UNAMES[i], hex: UNIVERSAL[i] }; } },
];

/** Household and lab substances with rounded, typical pH values. Real samples vary, so these are labelled typical. */
export const SUBSTANCES: { id: string; name: string; pH: number }[] = [
  { id: 'battery', name: 'Car battery acid', pH: 0.5 },
  { id: 'stomach', name: 'Stomach juice', pH: 1.5 },
  { id: 'lemon', name: 'Lemon juice', pH: 2.2 },
  { id: 'cola', name: 'Cola drink', pH: 2.5 },
  { id: 'vinegar', name: 'Vinegar', pH: 2.8 },
  { id: 'tomato', name: 'Tomato juice', pH: 4.3 },
  { id: 'rain', name: 'Acid rain', pH: 4.5 },
  { id: 'coffee', name: 'Black coffee', pH: 5 },
  { id: 'milk', name: 'Milk', pH: 6.6 },
  { id: 'water', name: 'Pure water', pH: 7 },
  { id: 'blood', name: 'Blood', pH: 7.4 },
  { id: 'sea', name: 'Sea water', pH: 8.1 },
  { id: 'soda', name: 'Baking soda in water', pH: 8.3 },
  { id: 'toothpaste', name: 'Toothpaste', pH: 9 },
  { id: 'soap', name: 'Soap solution', pH: 10 },
  { id: 'magnesia', name: 'Milk of magnesia', pH: 10.5 },
  { id: 'ammonia', name: 'Household ammonia', pH: 11.5 },
  { id: 'lime', name: 'Lime water', pH: 12.4 },
  { id: 'drain', name: 'Drain cleaner', pH: 13.5 },
];

/** Write a number as "a × 10^b" with sig figures (plain decimals between 0.001 and 1000). */
export function sci(x: number, n = 3): string {
  if (x === 0) return '0';
  if (Math.abs(x) >= 1e-3 && Math.abs(x) < 1e3) return String(Number(x.toPrecision(n)));
  const e = Math.floor(Math.log10(Math.abs(x)));
  let m = Number((x / 10 ** e).toPrecision(n)); let ee = e;
  if (Math.abs(m) >= 10) { m /= 10; ee++; }
  const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
  const sup = String(ee).replace('-', '⁻').replace(/\d/g, (d) => SUP[+d]);
  return `${m === 1 ? '' : `${m} × `}10${sup}`;
}
