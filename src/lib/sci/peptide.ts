// Peptides from a protein: digest with a common enzyme (allowing missed cleavages), monoisotopic and average masses
// and m/z at any charge, matching measured peaks to the digest (peptide mass fingerprint) with sequence coverage,
// and b, y and a fragment ions of one peptide. Residue masses come from each amino acid's formula (protparam.ts)
// and exact isotope masses (chem.ts). No DOM.
import { RESIDUES } from './protparam.ts';
import { parseFormula, molarMass, monoMass, PROTON } from './chem.ts';

const RES_MONO: Record<string, number> = {}, RES_AVG: Record<string, number> = {};
for (const [k, r] of Object.entries(RESIDUES)) { const f = parseFormula(r.formula); RES_MONO[k] = monoMass(f); RES_AVG[k] = molarMass(f); }
export const WATER_MONO = monoMass(parseFormula('H2O'));
export const WATER_AVG = molarMass(parseFormula('H2O'));
export { PROTON };
const CO_MONO = monoMass(parseFormula('CO'));
const NH3_MONO = monoMass(parseFormula('NH3'));

/** Fixed modifications: formula added to every copy of a residue. */
export const MODS = {
  carbamidomethyl: { name: 'Carbamidomethyl Cys (iodoacetamide)', aa: 'C', formula: 'C2H3NO' },
  oxidation: { name: 'Oxidised Met', aa: 'M', formula: 'O' },
} as const;
export type ModId = keyof typeof MODS;
const modMono = (id: ModId) => monoMass(parseFormula(MODS[id].formula));
const modAvg = (id: ModId) => molarMass(parseFormula(MODS[id].formula));

/** Cleavage rules: cut after (C-terminal side of) `after`, or before `before`, unless the next residue is in `notBefore`. */
export const ENZYMES = {
  trypsin: { name: 'Trypsin (after K, R; not before P)', after: 'KR', before: '', notBefore: 'P' },
  'trypsin-p': { name: 'Trypsin, ignoring the P rule', after: 'KR', before: '', notBefore: '' },
  lysc: { name: 'Lys-C (after K)', after: 'K', before: '', notBefore: '' },
  argc: { name: 'Arg-C (after R; not before P)', after: 'R', before: '', notBefore: 'P' },
  gluc: { name: 'Glu-C (after E)', after: 'E', before: '', notBefore: '' },
  aspn: { name: 'Asp-N (before D)', after: '', before: 'D', notBefore: '' },
  chymotrypsin: { name: 'Chymotrypsin (after F, Y, W; not before P)', after: 'FYW', before: '', notBefore: 'P' },
  cnbr: { name: 'Cyanogen bromide (after M)', after: 'M', before: '', notBefore: '' },
} as const;
export type EnzymeId = keyof typeof ENZYMES;

export type Peptide = { seq: string; start: number; end: number; missed: number; mono: number; avg: number };

/** Places where the enzyme cuts: indices i meaning a cut between seq[i-1] and seq[i]. */
export function sites(seq: string, enzyme: EnzymeId) {
  const e = ENZYMES[enzyme], out: number[] = [];
  for (let i = 1; i < seq.length; i++) {
    const cut = (e.after.includes(seq[i - 1]) || e.before.includes(seq[i])) && !e.notBefore.includes(seq[i]);
    if (cut) out.push(i);
  }
  return out;
}

export function peptideMass(seq: string, mods: ModId[] = []) {
  let mono = WATER_MONO, avg = WATER_AVG;
  for (const ch of seq) { mono += RES_MONO[ch] ?? NaN; avg += RES_AVG[ch] ?? NaN; for (const m of mods) if (MODS[m].aa === ch) { mono += modMono(m); avg += modAvg(m); } }
  return { mono, avg };
}
export const mz = (M: number, z: number) => (M + z * PROTON) / z;

export function digest(seq: string, enzyme: EnzymeId, opts: { missed?: number; mods?: ModId[]; minLen?: number; maxLen?: number; minMass?: number; maxMass?: number } = {}): Peptide[] {
  const missed = opts.missed ?? 0, mods = opts.mods ?? [];
  const cuts = [0, ...sites(seq, enzyme), seq.length];
  const out: Peptide[] = [];
  for (let a = 0; a < cuts.length - 1; a++) for (let m = 0; m <= missed && a + m + 1 < cuts.length; m++) {
    const s = cuts[a], e = cuts[a + m + 1], p = seq.slice(s, e);
    if (p.length < (opts.minLen ?? 1) || p.length > (opts.maxLen ?? Infinity)) continue;
    const { mono, avg } = peptideMass(p, mods);
    if (mono < (opts.minMass ?? 0) || mono > (opts.maxMass ?? Infinity)) continue;
    out.push({ seq: p, start: s + 1, end: e, missed: m, mono, avg });
  }
  return out.sort((x, y) => x.start - y.start || x.end - y.end);
}

/** Match measured m/z values to peptides at the given charges, within `ppm`. Returns each peak's matches and the
 *  share of the protein covered by matched peptides. */
export function fingerprint(seq: string, peps: Peptide[], peaks: number[], opts: { ppm?: number; charges?: number[] } = {}) {
  const ppm = opts.ppm ?? 20, charges = opts.charges ?? [1];
  const hits = peaks.map((obs) => {
    const m: { pep: Peptide; z: number; calc: number; err: number }[] = [];
    for (const p of peps) for (const z of charges) { const calc = mz(p.mono, z), err = ((obs - calc) / calc) * 1e6; if (Math.abs(err) <= ppm) m.push({ pep: p, z, calc, err }); }
    m.sort((x, y) => Math.abs(x.err) - Math.abs(y.err));
    return { obs, matches: m };
  });
  const covered = new Uint8Array(seq.length);
  for (const h of hits) for (const x of h.matches) for (let i = x.pep.start - 1; i < x.pep.end; i++) covered[i] = 1;
  const n = covered.reduce((s, v) => s + v, 0);
  return { hits, matched: hits.filter((h) => h.matches.length).length, coverage: seq.length ? n / seq.length : 0, covered };
}

/** b, y and a ions (singly or multiply charged) of a peptide, numbered from each end. */
export function fragments(seq: string, opts: { mods?: ModId[]; charge?: number; losses?: boolean } = {}) {
  const mods = opts.mods ?? [], z = opts.charge ?? 1;
  const res = [...seq].map((ch) => RES_MONO[ch] + mods.reduce((s, m) => s + (MODS[m].aa === ch ? modMono(m) : 0), 0));
  const rows: { i: number; aa: string; b: number; a: number; y: number; yi: number; bH2O?: number; yNH3?: number }[] = [];
  let pre = 0;
  const total = res.reduce((s, v) => s + v, 0);
  for (let i = 0; i < seq.length; i++) {
    pre += res[i];
    const suf = total - pre + res[i]; // residues i..end
    const bNeutral = pre, yNeutral = suf + WATER_MONO;
    rows.push({
      i: i + 1, aa: seq[i],
      b: (bNeutral + z * PROTON) / z, a: (bNeutral - CO_MONO + z * PROTON) / z,
      y: (yNeutral + z * PROTON) / z, yi: seq.length - i,
      ...(opts.losses ? { bH2O: (bNeutral - WATER_MONO + z * PROTON) / z, yNH3: (yNeutral - NH3_MONO + z * PROTON) / z } : {}),
    });
  }
  return rows; // b of the last row and y of the first row are the whole peptide, which tables usually leave out
}

/** A made-up example: a 150-residue protein written for this tool (not a real protein), and measured peaks made
 *  from some of its tryptic peptides with small errors and a few noise peaks. */
export const EXAMPLE_PROTEIN = `>Example protein (made up for fibub, not a real protein)
MASNTLEKGAVWHPRDFSLQGECKTYVNAIRPEMLSDGKWTQHAFEVRSNPYLCDGTK
AEFVRMQSWLDNGHKPTCYEVLAGSRDQFNMWKHEPTSGLAYDVRCQNEKFMTPGSWL
AIRDEYGKNHQVTSLPMCFR`;
export const EXAMPLE_PEAKS = `822.4395
968.4260
1045.5512
1083.4749
1154.5170
1173.5786
1278.6611
1344.6563
1489.7051
1502.7310
1693.8659
2081.9588
2211.0987`;
