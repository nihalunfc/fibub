// Protein parameters from a sequence: mass (average and monoisotopic) and formula worked out from each residue's
// chemical formula with standard atomic weights, composition, net charge at any pH and the isoelectric point from
// a set of pKa values (rounded approximate values by default; anyone can type their own), the extinction
// coefficient at 280 nm from Trp, Tyr and cystine, and concentration from A280. No DOM.
import { parseFormula, molarMass, monoMass, hill, type Formula } from './chem.ts';

export const RESIDUES: Record<string, { name: string; three: string; formula: string }> = {
  A: { name: 'Alanine', three: 'Ala', formula: 'C3H5NO' },
  R: { name: 'Arginine', three: 'Arg', formula: 'C6H12N4O' },
  N: { name: 'Asparagine', three: 'Asn', formula: 'C4H6N2O2' },
  D: { name: 'Aspartic acid', three: 'Asp', formula: 'C4H5NO3' },
  C: { name: 'Cysteine', three: 'Cys', formula: 'C3H5NOS' },
  E: { name: 'Glutamic acid', three: 'Glu', formula: 'C5H7NO3' },
  Q: { name: 'Glutamine', three: 'Gln', formula: 'C5H8N2O2' },
  G: { name: 'Glycine', three: 'Gly', formula: 'C2H3NO' },
  H: { name: 'Histidine', three: 'His', formula: 'C6H7N3O' },
  I: { name: 'Isoleucine', three: 'Ile', formula: 'C6H11NO' },
  L: { name: 'Leucine', three: 'Leu', formula: 'C6H11NO' },
  K: { name: 'Lysine', three: 'Lys', formula: 'C6H12N2O' },
  M: { name: 'Methionine', three: 'Met', formula: 'C5H9NOS' },
  F: { name: 'Phenylalanine', three: 'Phe', formula: 'C9H9NO' },
  P: { name: 'Proline', three: 'Pro', formula: 'C5H7NO' },
  S: { name: 'Serine', three: 'Ser', formula: 'C3H5NO2' },
  T: { name: 'Threonine', three: 'Thr', formula: 'C4H7NO2' },
  W: { name: 'Tryptophan', three: 'Trp', formula: 'C11H10N2O' },
  Y: { name: 'Tyrosine', three: 'Tyr', formula: 'C9H9NO2' },
  V: { name: 'Valine', three: 'Val', formula: 'C5H9NO' },
  U: { name: 'Selenocysteine', three: 'Sec', formula: 'C3H5NOSe' },
  O: { name: 'Pyrrolysine', three: 'Pyl', formula: 'C12H19N3O2' },
};
export const ORDER = 'ACDEFGHIKLMNPQRSTVWYUO'.split('');

/** pKa values for the charge and pI. The default set is fibub's own rounded, approximate values of the kind found
 *  in biochemistry textbooks; published sets differ by up to about 0.5, so pI values differ between tools too. */
export type PkaSet = { nTerm: number; cTerm: number; D: number; E: number; H: number; C: number; Y: number; K: number; R: number; U: number };
export const PKA_DEFAULT: PkaSet = { nTerm: 9.0, cTerm: 3.0, D: 3.9, E: 4.2, H: 6.3, C: 8.4, Y: 10.1, K: 10.5, R: 12.5, U: 5.5 };
/** Conventional molar absorption at 280 nm per residue (M⁻¹ cm⁻¹), used across protein labs; editable. */
export type EpsSet = { W: number; Y: number; cystine: number };
export const EPS_DEFAULT: EpsSet = { W: 5500, Y: 1490, cystine: 125 };

export type ParsedProtein = { seq: string; name: string; skipped: Record<string, number>; ambiguous: Record<string, number>; stop: boolean };

/** Clean a pasted protein: FASTA headers, numbers, spaces and a trailing stop (*) are dropped; B, Z, J and X are
 *  counted as ambiguous (left out of mass and charge); other characters are reported. Takes the first record. */
export function readProtein(text: string): ParsedProtein[] {
  const out: ParsedProtein[] = [];
  let cur: ParsedProtein | null = null;
  const start = (name: string) => { cur = { seq: '', name, skipped: {}, ambiguous: {}, stop: false }; out.push(cur); };
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (line.startsWith('>')) { start(line.slice(1).trim() || `Protein ${out.length + 1}`); continue; }
    if (!line || line.startsWith(';')) continue;
    if (!cur) start('Protein');
    const c = cur!;
    for (const ch0 of line) {
      const ch = ch0.toUpperCase();
      if (/[\s\d]/.test(ch) || ch === '-' || ch === '.') continue;
      if (ch === '*') { c.stop = true; continue; }
      if (RESIDUES[ch]) { c.seq += ch; continue; }
      if ('BZJX'.includes(ch)) { c.ambiguous[ch] = (c.ambiguous[ch] ?? 0) + 1; continue; }
      c.skipped[ch0] = (c.skipped[ch0] ?? 0) + 1;
    }
  }
  return out.filter((p) => p.seq.length || Object.keys(p.ambiguous).length);
}

export const counts = (seq: string) => { const m: Record<string, number> = {}; for (const ch of seq) m[ch] = (m[ch] ?? 0) + 1; return m; };

/** Molecular formula of the chain (residues + one water), less 2 H per disulfide bond. */
export function formula(seq: string, disulfides = 0): Formula {
  const tot = new Map<string, number>([['H', 2], ['O', 1]]);
  const n = counts(seq);
  for (const [aa, k] of Object.entries(n)) for (const [el, c] of parseFormula(RESIDUES[aa].formula).counts) tot.set(el, (tot.get(el) ?? 0) + c * k);
  tot.set('H', tot.get('H')! - 2 * disulfides);
  return { counts: tot, charge: 0 };
}

/** Net charge at a pH (Henderson–Hasselbalch for every ionisable group, plus the two ends). */
export function charge(seq: string, pH: number, p: PkaSet = PKA_DEFAULT, freeCys = -1) {
  const n = counts(seq);
  const pos = (pk: number) => 1 / (1 + 10 ** (pH - pk)), neg = (pk: number) => -1 / (1 + 10 ** (pk - pH));
  const cys = freeCys >= 0 ? freeCys : n.C ?? 0;
  let z = 0;
  if (seq.length) z += pos(p.nTerm) + neg(p.cTerm);
  z += (n.K ?? 0) * pos(p.K) + (n.R ?? 0) * pos(p.R) + (n.H ?? 0) * pos(p.H);
  z += (n.D ?? 0) * neg(p.D) + (n.E ?? 0) * neg(p.E) + cys * neg(p.C) + (n.Y ?? 0) * neg(p.Y) + (n.U ?? 0) * neg(p.U);
  return z;
}

/** The pH where the net charge is zero (charge falls steadily with pH, so bisection finds it). */
export function isoelectric(seq: string, p: PkaSet = PKA_DEFAULT, freeCys = -1) {
  let lo = 0, hi = 14;
  for (let k = 0; k < 100; k++) { const mid = (lo + hi) / 2; if (charge(seq, mid, p, freeCys) > 0) lo = mid; else hi = mid; }
  return (lo + hi) / 2;
}

/** Extinction coefficient at 280 nm: with every Cys reduced, and with every pair of Cys as a cystine. */
export function extinction(seq: string, e: EpsSet = EPS_DEFAULT) {
  const n = counts(seq), base = (n.W ?? 0) * e.W + (n.Y ?? 0) * e.Y;
  return { reduced: base, cystines: base + Math.floor((n.C ?? 0) / 2) * e.cystine, pairs: Math.floor((n.C ?? 0) / 2) };
}

export function analyse(seq: string, opts: { pH?: number; pka?: PkaSet; eps?: EpsSet; disulfides?: number } = {}) {
  const pka = opts.pka ?? PKA_DEFAULT, eps = opts.eps ?? EPS_DEFAULT, n = counts(seq);
  const ds = Math.min(opts.disulfides ?? 0, Math.floor((n.C ?? 0) / 2));
  const f = formula(seq, ds), fRed = formula(seq, 0);
  const avg = molarMass(f), mono = monoMass(f);
  const ex = extinction(seq, eps);
  const epsUsed = ds > 0 ? ex.reduced + ds * eps.cystine : ex.reduced;
  const freeCys = (n.C ?? 0) - 2 * ds;
  return {
    length: seq.length, counts: n, formula: hill(f), avg, mono, avgReduced: molarMass(fRed), disulfides: ds,
    pI: isoelectric(seq, pka, freeCys), chargeAt: charge(seq, opts.pH ?? 7, pka, freeCys), pH: opts.pH ?? 7,
    eps: ex, epsUsed, abs01: avg > 0 ? epsUsed / avg : 0, // A280 of 1 g/L (1 mg/mL) in a 1 cm path
    positive: (n.K ?? 0) + (n.R ?? 0), negative: (n.D ?? 0) + (n.E ?? 0),
  };
}

/** Concentration from A280: c (M) = A / (ε · path). */
export function fromA280(A: number, eps: number, mw: number, pathCm = 1) {
  const M = A / (eps * pathCm);
  return { uM: M * 1e6, mgPerMl: M * mw };
}

/** Charge against pH, for a plot. */
export function chargeCurve(seq: string, p: PkaSet = PKA_DEFAULT, freeCys = -1, step = 0.05) {
  const x: number[] = [], y: number[] = [];
  for (let pH = 0; pH <= 14 + 1e-9; pH += step) { x.push(+pH.toFixed(2)); y.push(charge(seq, pH, p, freeCys)); }
  return { x, y };
}

/** A made-up example: a 120-residue sequence written for this tool (not a real protein). */
export const EXAMPLE = `>Example protein (made up for fibub, not a real protein)
MSKGEELFTA VNPQRSDWHY KLGCEATRPV DMNSFYGKEQ LHTCIRAPWD
EVKSGNLYQT AMRDFHPEKS VCWLGTNAQY RDPEKMSHVF GLTNWQYKAE
CDRSPLVGHT KYEMAQNWFR`;
