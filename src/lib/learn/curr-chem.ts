// Plain maths for the school chemistry Learn tools: electrolysis, ion tests, crude oil, yield and atom economy,
// empirical formulae. No DOM, so tests/curr-chem.mjs can check each function against hand-worked or published values.
// Teaching models: standard atomic masses, standard boiling points (CRC Handbook values, rounded), Faraday constant 96 485 C/mol.

// ---- Atoms and formulae ---------------------------------------------------------------------------------------
/** Standard atomic masses, g/mol (rounded IUPAC values). */
export const AR: Record<string, number> = {
  H: 1.008, Li: 6.94, C: 12.011, N: 14.007, O: 15.999, Na: 22.990, Mg: 24.305, Al: 26.982, Si: 28.086, P: 30.974, S: 32.06,
  Cl: 35.45, K: 39.098, Ca: 40.078, Fe: 55.845, Cu: 63.546, Zn: 65.38, Br: 79.904, Ag: 107.868, I: 126.904, Pb: 207.2,
};
const SUBS = '₀₁₂₃₄₅₆₇₈₉';
/** 12 -> "₁₂" */
export const sub = (n: number) => (n === 1 ? '' : String(n).split('').map((d) => SUBS[+d]).join(''));
/** Count the atoms in a formula such as Ca(OH)2 or C6H12O6. */
export function parseFormula(f: string): Record<string, number> {
  let i = 0;
  const group = (): Record<string, number> => {
    const out: Record<string, number> = {};
    while (i < f.length && f[i] !== ')') {
      let part: Record<string, number>;
      if (f[i] === '(') { i++; part = group(); i++; }
      else { const m = /^[A-Z][a-z]?/.exec(f.slice(i)); if (!m) throw new Error('bad formula ' + f); i += m[0].length; part = { [m[0]]: 1 }; }
      const d = /^\d+/.exec(f.slice(i)); const k = d ? +d[0] : 1; if (d) i += d[0].length;
      for (const [e, c] of Object.entries(part)) out[e] = (out[e] ?? 0) + c * k;
    }
    return out;
  };
  return group();
}
/** Molar mass (g/mol) of a formula. */
export const molarMass = (f: string) => Object.entries(parseFormula(f)).reduce((s, [e, c]) => s + (AR[e] ?? NaN) * c, 0);

// ---- Electrolysis ---------------------------------------------------------------------------------------------
export const FARADAY = 96485; // C per mole of electrons
export const RT_MOLAR_VOLUME = 24; // dm3 per mole of gas at room temperature and pressure (GCSE value)
/** Reactivity series (most reactive first); hydrogen is placed where it belongs for the cathode rule. */
export const REACTIVITY = ['K', 'Na', 'Ca', 'Mg', 'Al', 'Zn', 'Fe', 'Pb', 'H', 'Cu', 'Ag'];
export const lessReactiveThanH = (sym: string) => REACTIVITY.indexOf(sym) > REACTIVITY.indexOf('H');

export type Electrolyte = { id: string; name: string; medium: 'molten' | 'aqueous'; cation: string; charge: number; anion: string; anode: 'inert' | 'copper'; dilute?: boolean };
export const ELECTROLYTES: Electrolyte[] = [
  { id: 'pbbr2', name: 'Molten lead(II) bromide, PbBr₂', medium: 'molten', cation: 'Pb', charge: 2, anion: 'Br', anode: 'inert' },
  { id: 'nacl-m', name: 'Molten sodium chloride, NaCl', medium: 'molten', cation: 'Na', charge: 1, anion: 'Cl', anode: 'inert' },
  { id: 'nacl-aq', name: 'Brine (aqueous NaCl), inert electrodes', medium: 'aqueous', cation: 'Na', charge: 1, anion: 'Cl', anode: 'inert' },
  { id: 'cuso4-i', name: 'Copper(II) sulfate solution, inert electrodes', medium: 'aqueous', cation: 'Cu', charge: 2, anion: 'SO4', anode: 'inert' },
  { id: 'cuso4-cu', name: 'Copper(II) sulfate solution, copper electrodes', medium: 'aqueous', cation: 'Cu', charge: 2, anion: 'SO4', anode: 'copper' },
  { id: 'h2so4', name: 'Dilute sulfuric acid, inert electrodes', medium: 'aqueous', cation: 'H', charge: 1, anion: 'SO4', anode: 'inert', dilute: true },
  { id: 'cucl2', name: 'Copper(II) chloride solution, inert electrodes', medium: 'aqueous', cation: 'Cu', charge: 2, anion: 'Cl', anode: 'inert' },
  { id: 'ki', name: 'Potassium iodide solution, inert electrodes', medium: 'aqueous', cation: 'K', charge: 1, anion: 'I', anode: 'inert' },
];
export type Half = { formula: string; label: string; kind: 'metal' | 'gas' | 'halogen' | 'dissolves'; z: number; eq: string; rule: string; colour: string };
const HALOGEN_COLOUR: Record<string, string> = { Cl: '#b6d646', Br: '#b5541c', I: '#6b3f8c' };
const HALOGEN_NAME: Record<string, string> = { Cl: 'chlorine', Br: 'bromine', I: 'iodine' };
const METAL_NAME: Record<string, string> = { Pb: 'lead', Na: 'sodium', Cu: 'copper', K: 'potassium', H: 'hydrogen' };
const chargeText = (z: number) => (z === 1 ? '' : '²³'[z - 2]) + '⁺';
/** Work out what forms at each electrode, and why, using the school rules. */
export function electrolyse(e: Electrolyte): { cathode: Half; anode: Half; left: string } {
  // Cathode (negative): metal if molten or less reactive than hydrogen, otherwise hydrogen gas.
  let cathode: Half;
  const metalWhy = e.medium === 'molten' ? 'Molten: no water, so the only positive ion is the metal ion.' : `${METAL_NAME[e.cation]} is less reactive than hydrogen, so the metal is discharged, not H₂.`;
  if (e.cation === 'H') cathode = { formula: 'H₂', label: 'hydrogen gas', kind: 'gas', z: 2, eq: '2H⁺ + 2e⁻ → H₂', rule: 'The positive ion is H⁺ itself, so hydrogen gas forms.', colour: '#9fb3c8' };
  else if (e.medium === 'molten' || lessReactiveThanH(e.cation))
    cathode = { formula: e.cation, label: METAL_NAME[e.cation] + ' metal', kind: 'metal', z: e.charge, eq: `${e.cation}${chargeText(e.charge)} + ${e.charge === 1 ? '' : e.charge}e⁻ → ${e.cation}`, rule: metalWhy, colour: e.cation === 'Cu' ? '#b87333' : e.cation === 'Pb' ? '#8a8f98' : '#c4c8ce' };
  else cathode = { formula: 'H₂', label: 'hydrogen gas', kind: 'gas', z: 2, eq: '2H⁺ + 2e⁻ → H₂', rule: `${METAL_NAME[e.cation]} is more reactive than hydrogen, so H⁺ ions from water are discharged and H₂ bubbles off.`, colour: '#9fb3c8' };
  // Anode (positive).
  let anode: Half;
  const halide = ['Cl', 'Br', 'I'].includes(e.anion);
  if (e.anode === 'copper') anode = { formula: 'Cu', label: 'copper dissolves', kind: 'dissolves', z: 2, eq: 'Cu → Cu²⁺ + 2e⁻', rule: 'The anode is made of copper, so the electrode itself loses electrons and dissolves.', colour: '#b87333' };
  else if (halide) anode = { formula: e.anion + '₂', label: HALOGEN_NAME[e.anion], kind: 'halogen', z: 2, eq: `2${e.anion}⁻ → ${e.anion}₂ + 2e⁻`, rule: e.medium === 'molten' ? 'Molten: the only negative ion is the halide ion.' : 'A halide ion is present (concentrated solution), so the halogen forms.', colour: HALOGEN_COLOUR[e.anion] };
  else anode = { formula: 'O₂', label: 'oxygen gas', kind: 'gas', z: 4, eq: '4OH⁻ → O₂ + 2H₂O + 4e⁻', rule: 'No halide ion is present (sulfate is not discharged), so hydroxide ions from water give oxygen.', colour: '#cfe3f5' };
  const left = e.id === 'nacl-aq' ? 'Sodium hydroxide solution is left behind (Na⁺ and OH⁻ stay in the water).'
    : e.id === 'cuso4-i' ? 'The solution turns paler blue and more acidic as Cu²⁺ is used up and H⁺ is made.'
    : e.id === 'cuso4-cu' ? 'The blue colour does not change: copper lost at the anode equals copper gained at the cathode.'
    : e.id === 'h2so4' ? 'Only water is used up, so the acid gets more concentrated. H₂ and O₂ form in a 2 : 1 volume ratio.'
    : e.id === 'cucl2' ? 'The blue solution fades as Cu²⁺ ions are used up.'
    : e.id === 'ki' ? 'Potassium hydroxide solution is left behind. The solution near the anode turns brown with iodine.'
    : 'The molten salt is split into its elements.';
  return { cathode, anode, left };
}
/** Charge Q = I t (coulombs). */
export const charge = (amps: number, seconds: number) => amps * seconds;
/** Moles of electrons = Q / F. */
export const molesElectrons = (q: number) => q / FARADAY;
/** Mass (g) and gas volume (dm3, RTP) from electrolysis: z electrons per formula unit of product. */
export function faraday(amps: number, seconds: number, z: number, formula: string, isGas = false) {
  const q = charge(amps, seconds), ne = molesElectrons(q), mol = ne / z, M = molarMass(formula.replace(/[₀-₉]/g, (d) => String(SUBS.indexOf(d))));
  return { q, ne, mol, mass: mol * M, volume: isGas ? mol * RT_MOLAR_VOLUME : 0, M };
}

// ---- Ion tests ------------------------------------------------------------------------------------------------
export type Cation = { id: string; name: string; sym: string; charge: number; flame?: { name: string; hex: string }; ppt?: { name: string; hex: string; eq: string; dissolves?: boolean } };
export const CATIONS: Cation[] = [
  { id: 'Li+', name: 'lithium', sym: 'Li', charge: 1, flame: { name: 'crimson', hex: '#d1123f' } },
  { id: 'Na+', name: 'sodium', sym: 'Na', charge: 1, flame: { name: 'yellow', hex: '#ffd21a' } },
  { id: 'K+', name: 'potassium', sym: 'K', charge: 1, flame: { name: 'lilac', hex: '#b28cf0' } },
  { id: 'Ca2+', name: 'calcium', sym: 'Ca', charge: 2, flame: { name: 'orange-red', hex: '#e8501a' }, ppt: { name: 'white', hex: '#f4f4f4', eq: 'Ca²⁺ + 2OH⁻ → Ca(OH)₂(s)' } },
  { id: 'Cu2+', name: 'copper(II)', sym: 'Cu', charge: 2, flame: { name: 'green', hex: '#2fcf7a' }, ppt: { name: 'blue', hex: '#3b7be0', eq: 'Cu²⁺ + 2OH⁻ → Cu(OH)₂(s)' } },
  { id: 'Mg2+', name: 'magnesium', sym: 'Mg', charge: 2, ppt: { name: 'white', hex: '#f4f4f4', eq: 'Mg²⁺ + 2OH⁻ → Mg(OH)₂(s)' } },
  { id: 'Al3+', name: 'aluminium', sym: 'Al', charge: 3, ppt: { name: 'white', hex: '#f4f4f4', eq: 'Al³⁺ + 3OH⁻ → Al(OH)₃(s)', dissolves: true } },
  { id: 'Fe2+', name: 'iron(II)', sym: 'Fe', charge: 2, ppt: { name: 'green', hex: '#4c8a4a', eq: 'Fe²⁺ + 2OH⁻ → Fe(OH)₂(s)' } },
  { id: 'Fe3+', name: 'iron(III)', sym: 'Fe', charge: 3, ppt: { name: 'brown', hex: '#9a5a22', eq: 'Fe³⁺ + 3OH⁻ → Fe(OH)₃(s)' } },
];
export type Anion = { id: string; name: string; sym: string; charge: number; poly: boolean };
export const ANIONS: Anion[] = [
  { id: 'Cl-', name: 'chloride', sym: 'Cl', charge: 1, poly: false },
  { id: 'Br-', name: 'bromide', sym: 'Br', charge: 1, poly: false },
  { id: 'I-', name: 'iodide', sym: 'I', charge: 1, poly: false },
  { id: 'SO42-', name: 'sulfate', sym: 'SO4', charge: 2, poly: true },
  { id: 'CO32-', name: 'carbonate', sym: 'CO3', charge: 2, poly: true },
];
export const cationById = (id: string) => CATIONS.find((c) => c.id === id)!;
export const anionById = (id: string) => ANIONS.find((a) => a.id === id)!;
export type Obs = { text: string; hex?: string; kind: 'flame' | 'ppt' | 'none' | 'gas' | 'milky'; eq?: string };
/** Flame test result for the cation. */
export function flameTest(c: Cation): Obs {
  return c.flame ? { kind: 'flame', text: `${c.flame.name} flame`, hex: c.flame.hex } : { kind: 'none', text: 'No characteristic flame colour' };
}
/** Sodium hydroxide test: drops, then in excess. */
export function naohTest(c: Cation, excess: boolean): Obs {
  if (!c.ppt) return { kind: 'none', text: 'No precipitate' };
  if (excess && c.ppt.dissolves) return { kind: 'none', text: 'The white precipitate dissolves in excess: colourless solution', eq: 'Al(OH)₃ + OH⁻ → [Al(OH)₄]⁻' };
  return { kind: 'ppt', text: excess ? `${c.ppt.name} precipitate stays (insoluble in excess)` : `${c.ppt.name} precipitate`, hex: c.ppt.hex, eq: c.ppt.eq };
}
export type Reagent = 'acid' | 'agno3' | 'bacl2';
/** Anion tests: acid for carbonate, acidified silver nitrate for halides, barium chloride for sulfate. */
export function anionTest(a: Anion, reagent: Reagent): Obs {
  if (reagent === 'acid') return a.id === 'CO32-' ? { kind: 'milky', text: 'Fizzing; the gas turns limewater milky (carbon dioxide)', eq: 'CO₃²⁻ + 2H⁺ → H₂O + CO₂' } : { kind: 'none', text: 'No fizzing' };
  if (reagent === 'agno3') {
    if (a.id === 'Cl-') return { kind: 'ppt', text: 'white precipitate', hex: '#f4f4f4', eq: 'Ag⁺ + Cl⁻ → AgCl(s)' };
    if (a.id === 'Br-') return { kind: 'ppt', text: 'cream precipitate', hex: '#efe3b0', eq: 'Ag⁺ + Br⁻ → AgBr(s)' };
    if (a.id === 'I-') return { kind: 'ppt', text: 'yellow precipitate', hex: '#f0d83a', eq: 'Ag⁺ + I⁻ → AgI(s)' };
    if (a.id === 'CO32-') return { kind: 'gas', text: 'Fizzing from the nitric acid; no halide precipitate' };
    return { kind: 'none', text: 'No precipitate' };
  }
  if (a.id === 'SO42-') return { kind: 'ppt', text: 'white precipitate', hex: '#f4f4f4', eq: 'Ba²⁺ + SO₄²⁻ → BaSO₄(s)' };
  if (a.id === 'CO32-') return { kind: 'gas', text: 'Fizzing from the acid; no lasting precipitate' };
  return { kind: 'none', text: 'No precipitate' };
}
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
/** Formula of the salt, e.g. Al³⁺ and SO₄²⁻ -> Al₂(SO₄)₃. */
export function saltFormula(c: Cation, a: Anion): string {
  const g = gcd(c.charge, a.charge), nc = a.charge / g, na = c.charge / g;
  const an = a.sym.replace(/(\d)/g, (d) => sub(+d));
  return c.sym + sub(nc) + (a.poly && na > 1 ? `(${an})` : an) + sub(na);
}
export const saltName = (c: Cation, a: Anion) => `${c.name} ${a.name}`;
/** Salts that really exist as simple solids: aluminium and iron(III) carbonates do not. */
export const saltExists = (c: Cation, a: Anion) => !(a.id === 'CO32-' && (c.id === 'Al3+' || c.id === 'Fe3+'));
/** Check a guess for the mystery salt. */
export const checkGuess = (sc: string, sa: string, gc: string, ga: string) => ({ cation: sc === gc, anion: sa === ga, both: sc === gc && sa === ga });
/** Pick a mystery salt; `rnd` returns a number in [0, 1). */
export function mysterySalt(rnd: () => number = Math.random): { c: Cation; a: Anion } {
  for (;;) {
    const c = CATIONS[Math.floor(rnd() * CATIONS.length)], a = ANIONS[Math.floor(rnd() * ANIONS.length)];
    if (saltExists(c, a)) return { c, a };
  }
}

// ---- Crude oil ------------------------------------------------------------------------------------------------
export const ALKANE_NAMES = ['methane', 'ethane', 'propane', 'butane', 'pentane', 'hexane', 'heptane', 'octane', 'nonane', 'decane', 'undecane', 'dodecane', 'tridecane', 'tetradecane', 'pentadecane', 'hexadecane', 'heptadecane', 'octadecane', 'nonadecane', 'icosane'];
export const ALKENE_NAMES = ['', 'ethene', 'propene', 'butene', 'pentene', 'hexene', 'heptene', 'octene', 'nonene', 'decene', 'undecene', 'dodecene', 'tridecene', 'tetradecene', 'pentadecene', 'hexadecene', 'heptadecene', 'octadecene', 'nonadecene'];
/** Standard boiling points of the straight-chain alkanes C1 to C20, °C at 1 atm (CRC Handbook values, rounded). */
export const BOILING_C = [-161.5, -88.6, -42.1, -0.5, 36.1, 68.7, 98.4, 125.7, 150.8, 174.1, 195.9, 216.3, 235.4, 253.5, 270.6, 286.8, 302.0, 316.3, 329.9, 343.0];
export const boilingPoint = (n: number) => BOILING_C[n - 1];
/** State of a straight-chain alkane at 20 °C: gas to C4, liquid C5 to C16, waxy solid from C17 (melting point above 20 °C). */
export const stateAt20 = (n: number) => (n <= 4 ? 'gas' : n <= 16 ? 'liquid' : 'waxy solid');
export const alkaneFormula = (n: number) => `C${sub(n)}H${sub(2 * n + 2)}`;
export const alkeneFormula = (n: number) => `C${sub(n)}H${sub(2 * n)}`;
/** Relative trend scales (0 to 100) from boiling point: teaching scales, not measurements. */
export const viscosityTrend = (n: number) => Math.round(((boilingPoint(n) - BOILING_C[0]) / (BOILING_C[19] - BOILING_C[0])) * 100);
export const flammabilityTrend = (n: number) => 100 - viscosityTrend(n);
export type Fraction = { id: string; name: string; lo: number; hi: number; colour: string; uses: string; props: string; state: string };
/** Teaching carbon ranges (real refineries overlap). Boiling ranges follow from the table above. */
export const FRACTIONS: Fraction[] = [
  { id: 'gases', name: 'Refinery gases', lo: 1, hi: 4, colour: '#8fb4d9', uses: 'Heating and cooking (LPG, bottled gas), fuel for the refinery itself.', props: 'Gases at room temperature. Very runny, ignite easily, burn with a clean blue flame.', state: 'gas' },
  { id: 'petrol', name: 'Petrol (gasoline)', lo: 5, hi: 10, colour: '#e0a030', uses: 'Fuel for cars.', props: 'Very runny liquid, evaporates easily, very flammable, burns cleanly.', state: 'liquid' },
  { id: 'kerosene', name: 'Kerosene', lo: 11, hi: 15, colour: '#d98a5a', uses: 'Aircraft (jet) fuel, paraffin heaters and lamps.', props: 'Fairly runny liquid, less flammable than petrol.', state: 'liquid' },
  { id: 'diesel', name: 'Diesel oil', lo: 16, hi: 20, colour: '#a0764a', uses: 'Fuel for lorries, buses, trains and some cars.', props: 'Thicker liquid, harder to ignite, burns with a smokier flame.', state: 'liquid' },
  { id: 'fueloil', name: 'Fuel oil', lo: 21, hi: 40, colour: '#6b4f3a', uses: 'Fuel for large ships and power stations.', props: 'Thick and sticky, very hard to ignite, smoky flame.', state: 'liquid' },
  { id: 'bitumen', name: 'Bitumen', lo: 41, hi: 80, colour: '#2b2b2b', uses: 'Road surfaces and roofing.', props: 'A solid or very thick residue, almost impossible to ignite.', state: 'solid' },
];
export const fractionFor = (n: number) => FRACTIONS.find((f) => n >= f.lo && n <= f.hi) ?? FRACTIONS[FRACTIONS.length - 1];
/** Boiling range text for a fraction, from the standard table where it covers the chain lengths. */
export function boilingRange(f: Fraction): string {
  if (f.id === 'gases') return 'below about 30 °C';
  if (f.hi <= 20) return `about ${Math.round(boilingPoint(f.lo))} to ${Math.round(boilingPoint(f.hi))} °C`;
  if (f.id === 'fueloil') return 'about 350 to 400 °C';
  return 'above about 400 °C (stays as the residue)';
}
/** Crack CnH2n+2 into CkH2k+2 (alkane) + C(n-k)H2(n-k) (alkene). Null if not possible. */
export function crack(n: number, k: number) {
  const m = n - k;
  if (!Number.isInteger(n) || !Number.isInteger(k) || k < 1 || m < 2 || n > 20) return null;
  const hLeft = 2 * n + 2, hRight = 2 * k + 2 + 2 * m;
  return { n, k, m, alkane: alkaneFormula(k), alkene: alkeneFormula(m), alkaneName: ALKANE_NAMES[k - 1], alkeneName: ALKENE_NAMES[m - 1], balanced: hLeft === hRight, hLeft, hRight, eq: `${alkaneFormula(n)} → ${alkaneFormula(k)} + ${alkeneFormula(m)}` };
}

// ---- Yield and atom economy ------------------------------------------------------------------------------------
export type Species = { f: string; c: number };
export type YieldRx = { id: string; name: string; eq: string; reactants: Species[]; desired: Species; others: Species[]; wasteNote: string };
export const YIELD_RX: YieldRx[] = [
  { id: 'caco3', name: 'Heating limestone', eq: 'CaCO₃ → CaO + CO₂', reactants: [{ f: 'CaCO3', c: 1 }], desired: { f: 'CaO', c: 1 }, others: [{ f: 'CO2', c: 1 }], wasteNote: 'Carbon dioxide is a second product, so not all the atoms end up in the quicklime.' },
  { id: 'haber', name: 'Haber process', eq: 'N₂ + 3H₂ ⇌ 2NH₃', reactants: [{ f: 'N2', c: 1 }, { f: 'H2', c: 3 }], desired: { f: 'NH3', c: 2 }, others: [], wasteNote: 'Only one product, so every atom ends up in ammonia (100 % atom economy). The reaction is reversible, which lowers the yield.' },
  { id: 'ferment', name: 'Ethanol by fermentation', eq: 'C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂', reactants: [{ f: 'C6H12O6', c: 1 }], desired: { f: 'C2H5OH', c: 2 }, others: [{ f: 'CO2', c: 2 }], wasteNote: 'Carbon dioxide is made too, so only about half the mass of the glucose ends up as ethanol.' },
  { id: 'hydration', name: 'Ethanol by hydration of ethene', eq: 'C₂H₄ + H₂O → C₂H₅OH', reactants: [{ f: 'C2H4', c: 1 }, { f: 'H2O', c: 1 }], desired: { f: 'C2H5OH', c: 1 }, others: [], wasteNote: 'The two reactants combine into one product, so all the atoms are used (100 % atom economy).' },
  { id: 'iron', name: 'Extracting iron', eq: 'Fe₂O₃ + 3CO → 2Fe + 3CO₂', reactants: [{ f: 'Fe2O3', c: 1 }, { f: 'CO', c: 3 }], desired: { f: 'Fe', c: 2 }, others: [{ f: 'CO2', c: 3 }], wasteNote: 'Most of the mass leaves as carbon dioxide, so the atom economy is low.' },
];
export const REASONS = [
  'The reaction is reversible, so it never goes fully to products.',
  'Some product is lost when it is separated, filtered, washed or transferred.',
  'Side reactions make other products instead of the one wanted.',
  'The reactants were not pure, or some did not react.',
];
/** Mass of the first reactant -> theoretical mass of the desired product (others in excess). */
export function theoreticalYield(rx: YieldRx, massG: number) {
  const r0 = rx.reactants[0], mol = massG / molarMass(r0.f), prodMol = mol * (rx.desired.c / r0.c);
  return { mol, prodMol, grams: prodMol * molarMass(rx.desired.f) };
}
export const percentYield = (actual: number, theoretical: number) => (actual / theoretical) * 100;
/** Atom economy (%) = Mr of desired product (× coefficient) / total Mr of all reactants (× coefficients) × 100. */
export function atomEconomy(rx: YieldRx) {
  const desired = molarMass(rx.desired.f) * rx.desired.c, total = rx.reactants.reduce((s, x) => s + molarMass(x.f) * x.c, 0);
  return { desired, total, percent: (desired / total) * 100 };
}

// ---- Empirical formula ----------------------------------------------------------------------------------------
export type Row = { sym: string; amount: number };
/** Find the smallest multiplier (1 to 6) that turns every ratio into a whole number (within 0.1). */
export function wholeMultiplier(ratios: number[], tol = 0.1): { k: number; clean: boolean } {
  for (let k = 1; k <= 6; k++) if (ratios.every((r) => Math.abs(r * k - Math.round(r * k)) <= tol)) return { k, clean: true };
  return { k: 1, clean: false };
}
/** Steps for an empirical formula from masses (g) or percentages: moles, divide by the smallest, whole numbers. */
export function empirical(rows: Row[]) {
  const moles = rows.map((r) => r.amount / AR[r.sym]), min = Math.min(...moles), ratio = moles.map((m) => m / min);
  const { k, clean } = wholeMultiplier(ratio), whole = ratio.map((r) => Math.max(1, Math.round(r * k)));
  const formula = rows.map((r, i) => r.sym + sub(whole[i])).join('');
  const mass = rows.reduce((s, r, i) => s + AR[r.sym] * whole[i], 0);
  return { moles, ratio, k, clean, whole, formula, mass };
}
/** Molecular formula from the empirical formula and the relative formula mass (Mr). */
export function molecular(rows: Row[], whole: number[], Mr: number) {
  const emp = rows.reduce((s, r, i) => s + AR[r.sym] * whole[i], 0), n = Math.round(Mr / emp);
  return { n: Math.max(1, n), empMass: emp, exact: Math.abs(Mr / emp - Math.round(Mr / emp)) < 0.06, formula: rows.map((r, i) => r.sym + sub(whole[i] * Math.max(1, n))).join('') };
}
/** The magnesium burning experiment: masses (g) a balance reading to 0.01 g would show. */
export function mgoExperiment(mMg: number, crucible = 24.5) {
  const mO = mMg * (AR.O / AR.Mg), before = crucible + mMg, after = crucible + mMg + mO;
  const rd = (x: number) => Math.round(x * 100) / 100;
  return { crucible: rd(crucible), before: rd(before), after: rd(after), mg: rd(before - crucible), oxygen: rd(rd(after) - rd(before)), exactOxygen: mO };
}
