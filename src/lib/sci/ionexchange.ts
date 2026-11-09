// Ion exchange and isoelectric focusing pH picker. From each protein's net charge against pH (protparam.ts, with an
// approximate, editable pKa set) it suggests a buffer pH for anion exchange (protein negative, a set distance above
// its pI) and cation exchange (protein positive, the same distance below), finds the pH where two or more proteins
// differ most in the charge that holds them on each resin, and says where each protein stops on a linear IEF
// gradient. No DOM.
import { charge, isoelectric, PKA_DEFAULT, type PkaSet } from './protparam.ts';

export type Resin = 'anion' | 'cation';
export type Protein = { name: string; seq: string };

const r1 = (x: number) => Math.round(x * 10) / 10;

/** Charge that holds a protein on the resin: its negative charge on an anion exchanger, its positive charge on a
 *  cation exchanger, and 0 when it has the wrong sign (then it flows through). */
export const binding = (z: number, kind: Resin) => (kind === 'anion' ? Math.max(0, -z) : Math.max(0, z));

/** pI and the suggested buffer pH for each resin: pI + offset (anion) and pI − offset (cation), rounded to 0.1 as a
 *  buffer is made up, with the net charge at that rounded pH. */
export function pickBuffers(seq: string, pka: PkaSet = PKA_DEFAULT, offset = 1) {
  const pI = isoelectric(seq, pka);
  const anionPH = r1(pI + offset), cationPH = r1(pI - offset);
  return { pI, anionPH, cationPH, zAnion: charge(seq, anionPH, pka), zCation: charge(seq, cationPH, pka) };
}

/** pH values from lo to hi in steps, rounded so they read cleanly. */
export function phGrid(lo: number, hi: number, step = 0.05) {
  const x: number[] = [];
  const n = Math.round((hi - lo) / step);
  for (let k = 0; k <= n; k++) x.push(+(lo + k * step).toFixed(4));
  return x;
}

export type Separation = {
  kind: Resin;
  x: number[];
  /** At each pH: the smallest difference in binding charge between any two proteins (the hardest pair). */
  score: number[];
  best: { pH: number; score: number; charges: number[]; pair: [number, number] } | null;
  /** The pH range around the best pH where the score stays within `keep` (90 %) of the best. */
  range: [number, number] | null;
};

/** Best separation on one resin for two or more proteins, scanning the buffer pH from lo to hi. */
export function separation(seqs: string[], kind: Resin, lo = 4, hi = 9, pka: PkaSet = PKA_DEFAULT, step = 0.05, keep = 0.9): Separation {
  const x = phGrid(lo, hi, step), score: number[] = [], pairs: [number, number][] = [];
  for (const pH of x) {
    const b = seqs.map((s) => binding(charge(s, pH, pka), kind));
    let m = Infinity, pr: [number, number] = [0, 1];
    for (let i = 0; i < b.length; i++) for (let j = i + 1; j < b.length; j++) { const d = Math.abs(b[i] - b[j]); if (d < m) { m = d; pr = [i, j]; } }
    score.push(seqs.length < 2 ? 0 : m); pairs.push(pr);
  }
  let k = -1;
  score.forEach((s, i) => { if (s > 1e-9 && (k < 0 || s > score[k] + 1e-12)) k = i; });
  if (k < 0 || seqs.length < 2) return { kind, x, score, best: null, range: null };
  let a = k, z = k;
  while (a > 0 && score[a - 1] >= keep * score[k]) a--;
  while (z < x.length - 1 && score[z + 1] >= keep * score[k]) z++;
  return { kind, x, score, best: { pH: x[k], score: score[k], charges: seqs.map((s) => charge(s, x[k], pka)), pair: pairs[k] }, range: [x[a], x[z]] };
}

export type Spot = { pI: number; mm: number | null; side: 'in' | 'acid' | 'base' };

/** Where each protein stops on a linear pH gradient from phLo (the + end, anode) to phHi (the − end, cathode) over
 *  `length` mm: distance from the + end = (pI − phLo) / (phHi − phLo) × length. Outside the range it runs off. */
export function iefSpots(pIs: number[], phLo = 3, phHi = 10, length = 70): Spot[] {
  return pIs.map((pI) => {
    if (pI < phLo) return { pI, mm: null, side: 'acid' };
    if (pI > phHi) return { pI, mm: null, side: 'base' };
    return { pI, mm: ((pI - phLo) / (phHi - phLo)) * length, side: 'in' };
  });
}

/** Gaps between neighbouring spots on the strip (in order from the + end), to see which pairs may merge. */
export function iefGaps(spots: Spot[]) {
  const on = spots.map((s, i) => ({ i, mm: s.mm })).filter((s): s is { i: number; mm: number } => s.mm !== null).sort((a, b) => a.mm - b.mm);
  const out: { a: number; b: number; mm: number }[] = [];
  for (let k = 1; k < on.length; k++) out.push({ a: on[k - 1].i, b: on[k].i, mm: on[k].mm - on[k - 1].mm });
  return out;
}

/** Three made-up proteins written for this tool (not real proteins): one acidic, one near neutral, one basic. */
export const EXAMPLE = `>Acidic example (made up)
MSAMCDEHVC TDSDDGLKCY QLEACCQLTE HFEPPFGMRW MHSNWWVGSN TMMREACKEK
TQCCAYNDTD DDTKAYPPDI EVQLRMEEFA QTAPTN
>Neutral example (made up)
MDTCWQGSTN MDIHFLEMGF KERPEVLHDP KRLHVTKLLK HKRYIPCYMI EHNVWPHLPM
CVSVPSEIMF LSCMWEVVAM CANACSRD
>Basic example (made up)
MTKWCSPFLK ACNNVRWSYQ NRWMVHRMRQ MRVWDHTLCQ QFNLLVFIRM AHFICKNEKG
YYRQHMGVHG RYERRCETKP`;
