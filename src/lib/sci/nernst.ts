// Nernst equation and electrochemical cells from standard reduction potentials (25 °C, 1 bar, vs SHE).
// Values: CRC Handbook of Chemistry and Physics, "Electrochemical series" (Vanýsek), and Bard, Parsons & Jordan.

export const F = 96485.33212; // C/mol
export const R = 8.314462618; // J/(mol·K)

export type State = 'aq' | 's' | 'l' | 'g';
/** One species in a half-reaction: coefficient, formula (charges as ^2+), state. */
export type Sp = [number, string, State];
/** Reduction half-reaction: ox + n e⁻ → red, with E° in V vs SHE. */
export type Half = { id: string; ox: Sp[]; red: Sp[]; n: number; E: number; name: string };

const s = (txt: string): Sp[] => txt.split(' + ').map((t) => {
  const m = /^(\d*)(.+)\((aq|s|l|g)\)$/.exec(t.trim());
  if (!m) throw new Error(`bad species ${t}`);
  return [m[1] ? Number(m[1]) : 1, m[2], m[3] as State];
});
const h = (id: string, ox: string, n: number, red: string, E: number, name: string): Half => ({ id, ox: s(ox), red: s(red), n, E, name });

export const HALVES: Half[] = [
  h('F2', 'F2(g)', 2, '2F^-(aq)', 2.866, 'fluorine'),
  h('Co3', 'Co^3+(aq)', 1, 'Co^2+(aq)', 1.92, 'cobalt(III)'),
  h('H2O2', 'H2O2(aq) + 2H^+(aq)', 2, '2H2O(l)', 1.776, 'hydrogen peroxide'),
  h('Au1', 'Au^+(aq)', 1, 'Au(s)', 1.692, 'gold(I)'),
  h('PbO2', 'PbO2(s) + SO4^2-(aq) + 4H^+(aq)', 2, 'PbSO4(s) + 2H2O(l)', 1.6913, 'lead-acid positive plate'),
  h('MnO4', 'MnO4^-(aq) + 8H^+(aq)', 5, 'Mn^2+(aq) + 4H2O(l)', 1.507, 'permanganate (acid)'),
  h('Au3', 'Au^3+(aq)', 3, 'Au(s)', 1.498, 'gold(III)'),
  h('Cl2', 'Cl2(g)', 2, '2Cl^-(aq)', 1.35827, 'chlorine'),
  h('O2acid', 'O2(g) + 4H^+(aq)', 4, '2H2O(l)', 1.229, 'oxygen (acid)'),
  h('MnO2', 'MnO2(s) + 4H^+(aq)', 2, 'Mn^2+(aq) + 2H2O(l)', 1.224, 'manganese dioxide'),
  h('Br2', 'Br2(l)', 2, '2Br^-(aq)', 1.066, 'bromine'),
  h('NO3', 'NO3^-(aq) + 4H^+(aq)', 3, 'NO(g) + 2H2O(l)', 0.957, 'nitrate to NO'),
  h('Hg2', 'Hg^2+(aq)', 2, 'Hg(l)', 0.851, 'mercury(II)'),
  h('Ag', 'Ag^+(aq)', 1, 'Ag(s)', 0.7996, 'silver'),
  h('Fe3', 'Fe^3+(aq)', 1, 'Fe^2+(aq)', 0.771, 'iron(III)/iron(II)'),
  h('O2H2O2', 'O2(g) + 2H^+(aq)', 2, 'H2O2(aq)', 0.695, 'oxygen to peroxide'),
  h('I2', 'I2(s)', 2, '2I^-(aq)', 0.5355, 'iodine'),
  h('Cu1', 'Cu^+(aq)', 1, 'Cu(s)', 0.521, 'copper(I)'),
  h('O2base', 'O2(g) + 2H2O(l)', 4, '4OH^-(aq)', 0.401, 'oxygen (base)'),
  h('Cu2', 'Cu^2+(aq)', 2, 'Cu(s)', 0.3419, 'copper(II)'),
  h('calomel', 'Hg2Cl2(s)', 2, '2Hg(l) + 2Cl^-(aq)', 0.26808, 'calomel'),
  h('AgCl', 'AgCl(s)', 1, 'Ag(s) + Cl^-(aq)', 0.22233, 'silver chloride'),
  h('Cu21', 'Cu^2+(aq)', 1, 'Cu^+(aq)', 0.153, 'copper(II)/copper(I)'),
  h('Sn4', 'Sn^4+(aq)', 2, 'Sn^2+(aq)', 0.151, 'tin(IV)/tin(II)'),
  h('S', 'S(s) + 2H^+(aq)', 2, 'H2S(g)', 0.142, 'sulfur to H₂S'),
  h('H2', '2H^+(aq)', 2, 'H2(g)', 0, 'hydrogen (SHE)'),
  h('Fe30', 'Fe^3+(aq)', 3, 'Fe(s)', -0.037, 'iron(III) to iron'),
  h('Pb', 'Pb^2+(aq)', 2, 'Pb(s)', -0.1262, 'lead'),
  h('Sn', 'Sn^2+(aq)', 2, 'Sn(s)', -0.1375, 'tin'),
  h('Ni', 'Ni^2+(aq)', 2, 'Ni(s)', -0.257, 'nickel'),
  h('Co', 'Co^2+(aq)', 2, 'Co(s)', -0.28, 'cobalt'),
  h('PbSO4', 'PbSO4(s)', 2, 'Pb(s) + SO4^2-(aq)', -0.3588, 'lead-acid negative plate'),
  h('Cd', 'Cd^2+(aq)', 2, 'Cd(s)', -0.403, 'cadmium'),
  h('Cr32', 'Cr^3+(aq)', 1, 'Cr^2+(aq)', -0.407, 'chromium(III)/chromium(II)'),
  h('Fe', 'Fe^2+(aq)', 2, 'Fe(s)', -0.447, 'iron'),
  h('Cr', 'Cr^3+(aq)', 3, 'Cr(s)', -0.744, 'chromium'),
  h('Zn', 'Zn^2+(aq)', 2, 'Zn(s)', -0.7618, 'zinc'),
  h('H2Obase', '2H2O(l)', 2, 'H2(g) + 2OH^-(aq)', -0.8277, 'water to hydrogen (base)'),
  h('Al', 'Al^3+(aq)', 3, 'Al(s)', -1.662, 'aluminium'),
  h('Mg', 'Mg^2+(aq)', 2, 'Mg(s)', -2.372, 'magnesium'),
  h('Na', 'Na^+(aq)', 1, 'Na(s)', -2.71, 'sodium'),
  h('Ca', 'Ca^2+(aq)', 2, 'Ca(s)', -2.868, 'calcium'),
  h('K', 'K^+(aq)', 1, 'K(s)', -2.931, 'potassium'),
  h('Li', 'Li^+(aq)', 1, 'Li(s)', -3.0401, 'lithium'),
];
export const half = (id: string) => HALVES.find((x) => x.id === id);

/** Species whose activity the user sets (aqueous ions and gases); solids, liquids and water count as 1. */
export const variable = (hr: Half): Sp[] => {
  const seen = new Map<string, Sp>();
  for (const x of [...hr.ox, ...hr.red]) if (x[2] === 'aq' || x[2] === 'g') seen.set(x[1], x);
  return [...seen.values()];
};

/** RT/F in volts. */
export const thermalV = (T: number) => (R * T) / F;
/** ln Q of the reduction half-reaction (Q = Π a(red)^ν / Π a(ox)^ν). Missing activities count as 1. */
export function lnQhalf(hr: Half, a: Record<string, number>) {
  const term = (list: Sp[]) => list.reduce((acc, [c, f, st]) => acc + (st === 'aq' || st === 'g' ? c * Math.log(a[f] ?? 1) : 0), 0);
  return term(hr.red) - term(hr.ox);
}
/** Electrode potential (V vs SHE) by the Nernst equation; E° held at its 25 °C value. */
export const nernst = (E0: number, n: number, lnQ: number, T = 298.15) => E0 - (thermalV(T) / n) * lnQ;
export const halfE = (hr: Half, a: Record<string, number>, T = 298.15) => nernst(hr.E, hr.n, lnQhalf(hr, a), T);

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
export const lcm = (a: number, b: number) => (a * b) / gcd(a, b);

/** Overall cell reaction (cathode reduction + anode oxidation), with species shared by both sides cancelled. */
export function cellReaction(cat: Half, an: Half) {
  const L = lcm(cat.n, an.n), kc = L / cat.n, ka = L / an.n;
  const net = new Map<string, { f: string; st: State; nu: number }>(); // ν > 0 product
  const add = (list: Sp[], k: number) => { for (const [c, f, st] of list) { const key = `${f}(${st})`; const e = net.get(key) ?? { f, st, nu: 0 }; e.nu += k * c; net.set(key, e); } };
  add(cat.ox, -kc); add(cat.red, kc); add(an.red, -ka); add(an.ox, ka);
  const items = [...net.values()].filter((x) => Math.abs(x.nu) > 1e-12);
  return { n: L, reactants: items.filter((x) => x.nu < 0).map((x) => ({ ...x, nu: -x.nu })), products: items.filter((x) => x.nu > 0) };
}

/** Standard cell values: E°cell (V), ΔG° (kJ/mol), ln K at T. */
export function cellStandard(Ecat: number, Ean: number, n: number, T = 298.15) {
  const E0 = Ecat - Ean;
  return { E0, dG0: (-n * F * E0) / 1000, lnK: (n * F * E0) / (R * T) };
}

/** Reference electrodes: potential vs SHE at 25 °C (RHE depends on pH). */
export const REFERENCES: { id: string; name: string; E: number }[] = [
  { id: 'SHE', name: 'SHE / NHE', E: 0 },
  { id: 'SCE', name: 'SCE (saturated KCl)', E: 0.241 },
  { id: 'AgClsat', name: 'Ag/AgCl (saturated KCl)', E: 0.197 },
  { id: 'AgCl3M', name: 'Ag/AgCl (3 M KCl)', E: 0.21 },
  { id: 'RHE', name: 'RHE (at your pH)', E: NaN },
];
/** Potential of a reference electrode vs SHE; RHE = −(RT ln10 / F)·pH. */
export const refE = (id: string, pH = 0, T = 298.15) => (id === 'RHE' ? -thermalV(T) * Math.LN10 * pH : REFERENCES.find((r) => r.id === id)!.E);
/** Convert a potential measured against one reference to another. */
export const convertRef = (E: number, from: string, to: string, pH = 0, T = 298.15) => E + refE(from, pH, T) - refE(to, pH, T);

const spText = (pretty: (t: string) => string, [c, f, st]: Sp) => `${c === 1 ? '' : c}${pretty(f)}(${st})`;
/** "Cu²⁺(aq) + 2e⁻ → Cu(s)". */
export const halfText = (hr: Half, pretty: (t: string) => string) => `${hr.ox.map((x) => spText(pretty, x)).join(' + ')} + ${hr.n === 1 ? '' : hr.n}e⁻ → ${hr.red.map((x) => spText(pretty, x)).join(' + ')}`;

/** Line notation, anode on the left: Zn(s) | Zn²⁺(aq) ‖ Cu²⁺(aq) | Cu(s). Pt(s) when no metal is part of the couple. */
export function cellNotation(an: Half, cat: Half, pretty: (t: string) => string) {
  const side = (hr: Half) => {
    const all = [...hr.ox, ...hr.red].filter(([, f]) => f !== 'H2O');
    const metal = all.find(([, f, st]) => (st === 's' || st === 'l') && /^[A-Z][a-z]?$/.test(f));
    const p = ([, f, st]: Sp) => `${pretty(f)}(${st})`;
    const solids = all.filter((x) => (x[2] === 's' || x[2] === 'l') && x !== metal).map(p);
    const gases = all.filter((x) => x[2] === 'g').map(p);
    const aq = [...new Set(all.filter((x) => x[2] === 'aq').map(p))].join(', ');
    return { electrode: metal ? p(metal) : 'Pt(s)', parts: [...solids, ...gases], aq };
  };
  const a = side(an), c = side(cat);
  return [a.electrode, ...a.parts, a.aq].filter(Boolean).join(' | ') + ' ‖ ' + [c.aq, ...[...c.parts].reverse(), c.electrode].filter(Boolean).join(' | ');
}
