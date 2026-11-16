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

// ---- Solve my numbers (added 2026-11-16) -----------------------------------------------------------------------

export type PHKnown = 'pH' | 'pOH' | 'H' | 'OH' | 'strongAcid' | 'strongBase' | 'weakAcid' | 'weakBase';
export type PHSolved = { pH: number; pOH: number; H: number; OH: number; steps: string[]; note?: string };

const s3 = (x: number) => sci(x, 3);
const f2 = (x: number) => String(Math.round(x * 100) / 100).replace('-', '−');

/** Everything about a solution at 25 °C from one known quantity, with the working as lines of text.
 *  value: the pH, pOH, [H⁺], [OH⁻] (mol/L) or the concentration (mol/L) for the strong and weak cases.
 *  n: H⁺ or OH⁻ released per formula unit (strong cases: HCl 1, H₂SO₄ about 2, Ca(OH)₂ 2). k: Ka or Kb (weak cases).
 *  Throws an Error with a friendly sentence for impossible input. */
export function solvePH(known: PHKnown, value: number, n = 1, k = 0): PHSolved {
  if (!Number.isFinite(value)) throw new Error('Type a number.');
  let steps: string[] = []; let note: string | undefined; let H: number;
  const needPos = (what: string) => { if (!(value > 0)) throw new Error(`${what} must be above zero.`); };
  if (known === 'pH' || known === 'pOH') {
    if (value < -2 || value > 16) throw new Error('That pH is far outside the usual 0 to 14 range. Check the number.');
    const pH = known === 'pH' ? value : 14 - value;
    H = 10 ** -pH;
    steps = known === 'pH' ? [`[H⁺] = 10^(−pH) = 10^(−${f2(pH)}) = ${s3(H)} mol/L`] : [`pH = 14 − pOH = 14 − ${f2(value)} = ${f2(pH)}`, `[H⁺] = 10^(−${f2(pH)}) = ${s3(H)} mol/L`];
    if (pH < 0 || pH > 14) note = 'Outside 0 to 14 is possible for very strong solutions, but check your numbers.';
  } else if (known === 'H') {
    needPos('[H⁺]'); H = value;
  } else if (known === 'OH') {
    needPos('[OH⁻]'); H = KW / value;
  } else if (known === 'strongAcid' || known === 'strongBase') {
    needPos('The concentration'); if (!(n >= 1)) throw new Error('Ions per formula unit must be 1 or more.');
    const x = n * value, acid = known === 'strongAcid';
    steps.push(`${acid ? '[H⁺]' : '[OH⁻]'} = ${n === 1 ? '' : `${n} × ${s3(value)} = `}${s3(x)} mol/L (fully ionised)`);
    if (x < 1e-6) {
      const h = acid ? (x + Math.sqrt(x * x + 4 * KW)) / 2 : (2 * KW) / (x + Math.sqrt(x * x + 4 * KW));
      H = h; note = 'Very dilute: water\'s own 1.0 × 10⁻⁷ mol/L of H⁺ and OH⁻ is added, so the simple log formula would be wrong here.';
    } else H = acid ? x : KW / x;
  } else {
    needPos('The concentration'); if (!(k > 0)) throw new Error(`${known === 'weakAcid' ? 'Ka' : 'Kb'} must be above zero.`);
    // x² / (C − x) = K  ->  x = (−K + √(K² + 4KC)) / 2
    const x = (-k + Math.sqrt(k * k + 4 * k * value)) / 2, approx = Math.sqrt(k * value);
    const acid = known === 'weakAcid';
    steps.push(`${acid ? 'Ka' : 'Kb'} = x² / (C − x), so x = ${s3(x)} mol/L${Math.abs(x - approx) / x < 0.05 ? ` (the shortcut x ≈ √(K × C) = ${s3(approx)} agrees)` : ' (the shortcut x ≈ √(K × C) would be off by more than 5 %, so the full quadratic is used)'}`);
    steps.push(`${acid ? '[H⁺]' : '[OH⁻]'} = ${s3(x)} mol/L, about ${f2((100 * x) / value)} % ionised`);
    H = acid ? x : KW / x;
    if (acid && x < 1e-6) note = 'Very dilute: water\'s own H⁺ matters here, so this answer is only a rough guide.';
  }
  const pH = -Math.log10(H), OH = KW / H;
  const baseSide = known === 'OH' || known === 'strongBase' || known === 'weakBase';
  if (baseSide) steps.push(`pOH = −log[OH⁻] = −log(${s3(OH)}) = ${f2(-Math.log10(OH))}`, `pH = 14 − pOH = 14 − ${f2(-Math.log10(OH))} = ${f2(pH)}`);
  else if (known === 'pOH') { /* pH and [H⁺] already shown above */ }
  else steps.push(...(known === 'pH' ? [] : [`pH = −log[H⁺] = −log(${s3(H)}) = ${f2(pH)}`]), `pOH = 14 − pH = 14 − ${f2(pH)} = ${f2(14 - pH)}`);
  return { pH, pOH: 14 - pH, H, OH, steps, note };
}

export type Know = 'pH' | 'h' | 'pOH' | 'oh' | 'strongAcid' | 'strongBase' | 'weakAcid' | 'weakBase';
export const KNOW_LABELS: Record<Know, string> = {
  pH: 'pH', h: '[H⁺] in mol/L', pOH: 'pOH', oh: '[OH⁻] in mol/L',
  strongAcid: 'a strong acid of this concentration (mol/L)', strongBase: 'a strong base of this concentration (mol/L)',
  weakAcid: 'a weak acid of this concentration (mol/L), with its pKa', weakBase: 'a weak base of this concentration (mol/L), with its pKb',
};
/**
 * pH from what you know, at 25 °C (Kw = 1.0 × 10⁻¹⁴). Strong acids and bases are fully ionised and include water's own ions;
 * weak ones use Ka = 10^−pKa and [H⁺]² + Ka[H⁺] − Ka·C = 0 (water's own ions ignored, which is fine unless the acid is very dilute or very weak).
 * Returns the exact pH (it can lie outside 0 to 14 for very strong solutions), a line of working, and for weak ones the share ionised.
 */
export function phFrom(know: Know, value: number, pK?: number): { pH: number; working: string; ionised?: number; note?: string } {
  if (!Number.isFinite(value)) throw new Error('Type a number.');
  const needPos = know !== 'pH' && know !== 'pOH';
  if (needPos && !(value > 0)) throw new Error('A concentration must be above zero.');
  const r = (x: number) => String(+x.toPrecision(4));
  switch (know) {
    case 'pH': return { pH: value, working: `pH = ${r(value)}` };
    case 'pOH': return { pH: 14 - value, working: `pH = 14 − pOH = 14 − ${r(value)} = ${r(14 - value)}` };
    case 'h': return { pH: -Math.log10(value), working: `pH = −log[H⁺] = −log(${sci(value)}) = ${r(-Math.log10(value))}` };
    case 'oh': { const po = -Math.log10(value); return { pH: 14 - po, working: `pOH = −log(${sci(value)}) = ${r(po)}; pH = 14 − ${r(po)} = ${r(14 - po)}` }; }
    case 'strongAcid': case 'strongBase': {
      const h = (value + Math.sqrt(value * value + 4 * KW)) / 2, p = -Math.log10(h), acid = know === 'strongAcid';
      const note = value < 1e-6 ? "At this dilution water's own ions matter, so the answer is closer to 7 than −log C." : undefined;
      if (note) return { pH: acid ? p : 14 - p, working: `[${acid ? 'H⁺' : 'OH⁻'}] = (C + √(C² + 4Kw)) / 2 = ${sci(h)} mol/L with C = ${sci(value)} and Kw = 1.0 × 10⁻¹⁴, so ${acid ? `pH = ${r(p)}` : `pOH = ${r(p)} and pH = ${r(14 - p)}`}`, note };
      return acid ? { pH: p, working: `[H⁺] = ${sci(value)} mol/L (fully ionised), so pH = −log(${sci(value)}) = ${r(p)}`, note }
        : { pH: 14 - p, working: `[OH⁻] = ${sci(value)} mol/L (fully ionised), pOH = ${r(p)}, so pH = 14 − ${r(p)} = ${r(14 - p)}`, note };
    }
    case 'weakAcid': case 'weakBase': {
      if (pK === undefined || !Number.isFinite(pK)) throw new Error(know === 'weakAcid' ? 'Type the pKa of the acid.' : 'Type the pKb of the base.');
      const K = 10 ** -pK, x = (-K + Math.sqrt(K * K + 4 * K * value)) / 2, p = -Math.log10(x), ionised = (100 * x) / value;
      const note = x < 1e-6 ? "The solution is so dilute or the acid so weak that water's own ions matter; this answer is only a rough guide." : undefined;
      const w = know === 'weakAcid'
        ? `Ka = 10^−${r(pK)} = ${sci(K)}; [H⁺] = ${sci(x)} mol/L from x² / (C − x) = Ka; pH = ${r(p)}`
        : `Kb = 10^−${r(pK)} = ${sci(K)}; [OH⁻] = ${sci(x)} mol/L from x² / (C − x) = Kb; pOH = ${r(p)}, pH = 14 − ${r(p)} = ${r(14 - p)}`;
      return { pH: know === 'weakAcid' ? p : 14 - p, working: w, ionised, note };
    }
  }
}
