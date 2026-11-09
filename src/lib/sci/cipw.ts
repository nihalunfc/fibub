// CIPW norm (Cross, Iddings, Pirsson and Washington 1902) from major-oxide wt%, following the standard published
// step order as restated by Verma et al. (2003, Schweiz. Mineral. Petrogr. Mitt. 83, 197): apatite, ilmenite,
// provisional orthoclase, albite, acmite, anorthite (corundum), sphene (rutile), magnetite (hematite), diopside,
// wollastonite and hypersthene; then quartz, or, if silica runs short, hypersthene → olivine, sphene → perovskite,
// albite → nepheline, orthoclase → leucite, wollastonite → dicalcium silicate, diopside → dicalcium silicate +
// olivine, leucite → kaliophilite. MnO joins FeO (with a weighted molar mass). Major oxides only.
// Optional Fe2O3/FeO split: Le Maitre (1976, Contrib. Mineral. Petrol. 56, 181) or a fixed ratio.
// No DOM; checked against pyrolite's CIPW_norm in tests/sci-tools/cipw-norm.mjs.
import { BY_SYMBOL } from './chem.ts';

const W = (s: string) => BY_SYMBOL.get(s)!.weight;
const O = W('O');
export const M = {
  SiO2: W('Si') + 2 * O, TiO2: W('Ti') + 2 * O, Al2O3: 2 * W('Al') + 3 * O, Fe2O3: 2 * W('Fe') + 3 * O, FeO: W('Fe') + O, MnO: W('Mn') + O,
  MgO: W('Mg') + O, CaO: W('Ca') + O, Na2O: 2 * W('Na') + O, K2O: 2 * W('K') + O, P2O5: 2 * W('P') + 5 * O,
};
export type Major = keyof typeof M;
export const MAJORS = Object.keys(M) as Major[];

export type FeAdjust = { mode: 'none' } | { mode: 'lemaitre'; rock: 'volcanic' | 'plutonic' } | { mode: 'ratio'; ratio: number }; // ratio = Fe2O3/FeO by weight

/** Split total iron into FeO and Fe2O3 (wt%). Total iron is kept as moles of Fe. */
export function adjustIron(wt: Record<Major, number>, a: FeAdjust): Record<Major, number> {
  if (a.mode === 'none') return { ...wt };
  const feT = wt.FeO + (wt.Fe2O3 * 2 * M.FeO) / M.Fe2O3; // total iron as FeO
  let r: number; // FeO/(FeO + Fe2O3) by weight
  if (a.mode === 'lemaitre') r = a.rock === 'volcanic' ? 0.93 - 0.0042 * wt.SiO2 - 0.022 * (wt.Na2O + wt.K2O) : 0.88 - 0.0016 * wt.SiO2 - 0.027 * (wt.Na2O + wt.K2O);
  else r = 1 / (1 + a.ratio);
  r = Math.max(0, Math.min(1, r));
  // Fe²⁺ share of the iron atoms from the weight ratio.
  const nFe2 = r / M.FeO, nFe3 = ((1 - r) / M.Fe2O3) * 2, x = nFe2 / (nFe2 + nFe3);
  return { ...wt, FeO: feT * x, Fe2O3: ((feT * (1 - x)) / (2 * M.FeO)) * M.Fe2O3 };
}

export const MINERALS = ['Q', 'C', 'Or', 'Ab', 'An', 'Lc', 'Ne', 'Kp', 'Ac', 'Ns', 'Ks', 'Di', 'Wo', 'Hy', 'Ol', 'Cs', 'Mt', 'Hm', 'Il', 'Tn', 'Pf', 'Ru', 'Ap'] as const;
export type Mineral = (typeof MINERALS)[number];
export const NAMES: Record<Mineral, string> = {
  Q: 'Quartz', C: 'Corundum', Or: 'Orthoclase', Ab: 'Albite', An: 'Anorthite', Lc: 'Leucite', Ne: 'Nepheline', Kp: 'Kaliophilite', Ac: 'Acmite',
  Ns: 'Sodium metasilicate', Ks: 'Potassium metasilicate', Di: 'Diopside', Wo: 'Wollastonite', Hy: 'Hypersthene', Ol: 'Olivine', Cs: 'Dicalcium silicate',
  Mt: 'Magnetite', Hm: 'Hematite', Il: 'Ilmenite', Tn: 'Titanite (sphene)', Pf: 'Perovskite', Ru: 'Rutile', Ap: 'Apatite',
};

export type Norm = {
  input: Record<Major, number>; sumIn: number; // the oxides used, recalculated to 100 % if asked
  wt: Record<Mineral, number>; mol: Record<Mineral, number>; total: number;
  parts: { DiWo: number; DiEn: number; DiFs: number; HyEn: number; HyFs: number; OlFo: number; OlFa: number }; // wt% of the end-member parts
  DI: number; anPlag: number | null; mafic: number; silicaDeficit: number; saturation: string; mgRatio: number;
};

const min = Math.min;

/** CIPW norm of one analysis (wt% oxides). `close` recalculates the oxides to 100 % first (volatile-free). */
export function cipw(wtIn: Partial<Record<Major, number>>, fe: FeAdjust = { mode: 'none' }, close = true): Norm {
  let wt = Object.fromEntries(MAJORS.map((k) => [k, Math.max(0, wtIn[k] ?? 0)])) as Record<Major, number>;
  wt = adjustIron(wt, fe);
  const s0 = MAJORS.reduce((a, k) => a + wt[k], 0);
  if (!(s0 > 0)) throw new Error('No oxides above zero.');
  if (close) for (const k of MAJORS) wt[k] *= 100 / s0;
  const n = Object.fromEntries(MAJORS.map((k) => [k, wt[k] / M[k]])) as Record<Major, number>;
  // MnO joins FeO; the combined "FeO" has a mole-weighted molar mass.
  const fe2 = n.FeO + n.MnO, mFe = fe2 > 0 ? (n.FeO * M.FeO + n.MnO * M.MnO) / fe2 : M.FeO;
  let SiO2 = n.SiO2, TiO2 = n.TiO2, Al = n.Al2O3, Fe3 = n.Fe2O3, FeO = fe2, MgO = n.MgO, CaO = n.CaO, Na = n.Na2O, K = n.K2O;
  const m = Object.fromEntries(MINERALS.map((k) => [k, 0])) as Record<Mineral, number>;
  // Apatite: 3⅓ CaO per P2O5.
  m.Ap = min(n.P2O5, CaO / (10 / 3)); CaO -= (10 / 3) * m.Ap;
  // Ilmenite.
  m.Il = min(FeO, TiO2); FeO -= m.Il; TiO2 -= m.Il;
  // Orthoclase (provisional); extra K2O as potassium metasilicate.
  const OrP = min(K, Al); Al -= OrP; m.Ks = K - OrP; K = 0;
  // Albite (provisional).
  const AbP = min(Na, Al); Al -= AbP; Na -= AbP;
  // Acmite, then sodium metasilicate.
  m.Ac = min(Na, Fe3); Na -= m.Ac; Fe3 -= m.Ac; m.Ns = Na; Na = 0;
  // Anorthite, then corundum.
  m.An = min(Al, CaO); Al -= m.An; CaO -= m.An; m.C = Al;
  // Sphene (provisional), then rutile.
  const TnP = min(CaO, TiO2); CaO -= TnP; TiO2 -= TnP; m.Ru = TiO2;
  // Magnetite, then hematite.
  m.Mt = min(Fe3, FeO); Fe3 -= m.Mt; FeO -= m.Mt; m.Hm = Fe3;
  // Diopside, wollastonite, hypersthene (provisional).
  const MF = MgO + FeO, xMg = MF > 0 ? MgO / MF : 0;
  const DiP = min(CaO, MF), WoP = CaO - DiP, HyP = MF - DiP;
  // Silica needed so far.
  const need = 6 * OrP + m.Ks + 6 * AbP + 4 * m.Ac + m.Ns + 2 * m.An + TnP + 2 * DiP + WoP + HyP;
  m.Or = OrP; m.Ab = AbP; m.Tn = TnP; m.Di = DiP; m.Wo = WoP; m.Hy = HyP;
  let D = need - SiO2;
  if (D <= 0) { m.Q = -D; D = 0; }
  else {
    // Hypersthene → olivine: 2 MSiO3 → M2SiO4 + SiO2.
    let x = min(D, HyP / 2); m.Ol = x; m.Hy = HyP - 2 * x; D -= x;
    // Sphene → perovskite.
    if (D > 0) { x = min(D, TnP); m.Pf = x; m.Tn = TnP - x; D -= x; }
    // Albite → nepheline (saves 4 SiO2 each).
    if (D > 0) { x = min(D / 4, AbP); m.Ne = x; m.Ab = AbP - x; D -= 4 * x; }
    // Orthoclase → leucite (saves 2 each).
    if (D > 0) { x = min(D / 2, OrP); m.Lc = x; m.Or = OrP - x; D -= 2 * x; }
    // Wollastonite → dicalcium silicate: 2 CaSiO3 → Ca2SiO4 + SiO2.
    if (D > 0) { x = min(D, WoP / 2); m.Cs = x; m.Wo = WoP - 2 * x; D -= x; }
    // Diopside → dicalcium silicate + olivine: CaMSi2O6 → ½Ca2SiO4 + ½M2SiO4 + SiO2.
    if (D > 0) { x = min(D, DiP); m.Cs += x / 2; m.Ol += x / 2; m.Di = DiP - x; D -= x; }
    // Leucite → kaliophilite (saves 2 each).
    if (D > 0) { x = min(D / 2, m.Lc); m.Kp = x; m.Lc -= x; D -= 2 * x; }
  }
  // Molar masses of the normative minerals (Mg-Fe ones split by xMg; Mn in with Fe).
  const mm: Record<Mineral, number> = {
    Q: M.SiO2, C: M.Al2O3, Or: M.K2O + M.Al2O3 + 6 * M.SiO2, Ab: M.Na2O + M.Al2O3 + 6 * M.SiO2, An: M.CaO + M.Al2O3 + 2 * M.SiO2,
    Lc: M.K2O + M.Al2O3 + 4 * M.SiO2, Ne: M.Na2O + M.Al2O3 + 2 * M.SiO2, Kp: M.K2O + M.Al2O3 + 2 * M.SiO2, Ac: M.Na2O + M.Fe2O3 + 4 * M.SiO2,
    Ns: M.Na2O + M.SiO2, Ks: M.K2O + M.SiO2, Di: M.CaO + xMg * M.MgO + (1 - xMg) * mFe + 2 * M.SiO2, Wo: M.CaO + M.SiO2,
    Hy: xMg * M.MgO + (1 - xMg) * mFe + M.SiO2, Ol: 2 * (xMg * M.MgO + (1 - xMg) * mFe) + M.SiO2, Cs: 2 * M.CaO + M.SiO2,
    Mt: mFe + M.Fe2O3, Hm: M.Fe2O3, Il: mFe + M.TiO2, Tn: M.CaO + M.TiO2 + M.SiO2, Pf: M.CaO + M.TiO2, Ru: M.TiO2, Ap: (10 / 3) * M.CaO + M.P2O5,
  };
  const out = Object.fromEntries(MINERALS.map((k) => [k, m[k] * mm[k]])) as Record<Mineral, number>;
  const total = MINERALS.reduce((a, k) => a + out[k], 0);
  const parts = {
    DiWo: m.Di * (M.CaO + M.SiO2), DiEn: m.Di * xMg * (M.MgO + M.SiO2), DiFs: m.Di * (1 - xMg) * (mFe + M.SiO2),
    HyEn: m.Hy * xMg * (M.MgO + M.SiO2), HyFs: m.Hy * (1 - xMg) * (mFe + M.SiO2),
    OlFo: m.Ol * xMg * (2 * M.MgO + M.SiO2), OlFa: m.Ol * (1 - xMg) * (2 * mFe + M.SiO2),
  };
  const DI = out.Q + out.Or + out.Ab + out.Ne + out.Lc + out.Kp;
  const anPlag = out.An + out.Ab > 0 ? (100 * out.An) / (out.An + out.Ab) : null;
  const mafic = out.Di + out.Hy + out.Ol + out.Mt + out.Il + out.Hm;
  const saturation = out.Q > 0 ? 'quartz-normative (oversaturated in silica)' : out.Ne + out.Lc + out.Kp > 0 ? 'nepheline or leucite-normative (undersaturated)' : out.Ol > 0 && out.Hy > 0 ? 'olivine and hypersthene-normative (saturated)' : out.Ol > 0 ? 'olivine-normative' : 'saturated, no quartz, no olivine';
  return { input: wt, sumIn: s0, wt: out, mol: m, total, parts, DI, anPlag, mafic, silicaDeficit: D > 1e-12 ? D * M.SiO2 : 0, saturation, mgRatio: xMg };
}

/** Made-up, rounded example rocks (wt%). The basalt gives FeO only, as total iron. */
export const EXAMPLE = [
  'Sample\tSiO2\tTiO2\tAl2O3\tFe2O3\tFeO\tMnO\tMgO\tCaO\tNa2O\tK2O\tP2O5\tLOI',
  'Basalt-like\t49.5\t1.8\t15.0\t0\t10.5\t0.18\t8.0\t10.5\t2.8\t0.6\t0.25\t0.6',
  'Granite-like\t72.5\t0.3\t14.0\t0.8\t1.2\t0.05\t0.5\t1.5\t3.6\t4.5\t0.1\t0.5',
  'Nephelinite-like\t40.5\t2.6\t12.5\t5.0\t7.5\t0.2\t10.5\t13.0\t4.5\t1.5\t0.9\t1.2',
].join('\n');
