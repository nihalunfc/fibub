// Hydropathy plots: a hydropathy value per amino acid, averaged over a sliding window along the protein, the
// grand average (GRAVY), and likely transmembrane segments (stretches where a long window, 19 residues by default,
// averages above a threshold, 1.6 by default). This is the method Kyte and Doolittle described in 1982. The scale
// shipped here is fibub's own: the widely taught values rounded to the nearest 0.5, so results differ a little from
// tools that use the published decimals. Every value can be changed, or a whole scale pasted in. No DOM.

/** The 20 standard amino acids, in alphabetical one-letter order. */
export const AA = 'ACDEFGHIKLMNPQRSTVWY'.split('');
export const THREE: Record<string, string> = {
  ALA: 'A', ARG: 'R', ASN: 'N', ASP: 'D', CYS: 'C', GLU: 'E', GLN: 'Q', GLY: 'G', HIS: 'H', ILE: 'I',
  LEU: 'L', LYS: 'K', MET: 'M', PHE: 'F', PRO: 'P', SER: 'S', THR: 'T', TRP: 'W', TYR: 'Y', VAL: 'V', SEC: 'U', PYL: 'O',
};

export type Scale = Record<string, number>;

/** fibub's hydropathy scale: positive is water-repelling (hydrophobic), negative is water-loving. Rounded to the
 *  nearest 0.5 by fibub; not the published table. Edit any value on the page. */
export const SCALE_FIBUB: Scale = {
  I: 4.5, V: 4, L: 4, F: 3, C: 2.5, M: 2, A: 2,
  G: -0.5, T: -0.5, S: -1, W: -1, Y: -1.5, P: -1.5,
  H: -3, E: -3.5, Q: -3.5, D: -3.5, N: -3.5, K: -4, R: -4.5,
};

/** Read a pasted scale: one amino acid per line (one-letter or three-letter code, then a number), separated by
 *  spaces, a comma, a tab, a colon or "=". A line of 20 numbers alone is read in the order A C D E F G H I K L M N
 *  P Q R S T V W Y. Lines starting with # are notes. */
export function parseScale(text: string): { scale: Scale; errors: string[] } {
  const scale: Scale = {}, errors: string[] = [];
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
  const numOnly = (l: string) => l.split(/[\s,;]+/).filter(Boolean);
  if (lines.length === 1 && numOnly(lines[0]).length === 20 && numOnly(lines[0]).every((t) => Number.isFinite(Number(t.replace('−', '-'))))) {
    numOnly(lines[0]).forEach((t, i) => { scale[AA[i]] = Number(t.replace('−', '-')); });
    return { scale, errors };
  }
  lines.forEach((l, k) => {
    const m = /^([A-Za-z]{1,3})\s*[\s,;:=\t]\s*([-−+]?\d*\.?\d+(?:[eE][-+]?\d+)?)\s*$/.exec(l);
    if (!m) { errors.push(`Line ${k + 1} ("${l.slice(0, 30)}") is not an amino acid and a number.`); return; }
    const code = m[1].toUpperCase(), aa = code.length === 1 ? code : THREE[code];
    if (!aa || !'ACDEFGHIKLMNPQRSTVWYUO'.includes(aa)) { errors.push(`Line ${k + 1}: "${m[1]}" is not an amino acid code.`); return; }
    scale[aa] = Number(m[2].replace('−', '-'));
  });
  return { scale, errors };
}

/** The scale value for every residue; letters with no value give NaN. */
export const values = (seq: string, scale: Scale) => [...seq].map((c) => (Number.isFinite(scale[c]) ? scale[c] : NaN));

/** Residues in the sequence that have no value in the scale, with counts. */
export function missing(seq: string, scale: Scale): Record<string, number> {
  const out: Record<string, number> = {};
  for (const c of seq) if (!Number.isFinite(scale[c])) out[c] = (out[c] ?? 0) + 1;
  return out;
}

/** Grand average of hydropathy: the mean value over the residues that have one. */
export function gravy(seq: string, scale: Scale): number {
  const v = values(seq, scale).filter(Number.isFinite);
  return v.length ? v.reduce((a, b) => a + b, 0) / v.length : NaN;
}

/** Plain sliding-window means. Window i covers residues i+1 .. i+w (1-based) and is drawn at its middle residue
 *  i + (w+1)/2 (w must be odd). Residues with no value count as 0. */
export function windowAverages(seq: string, scale: Scale, w: number): { pos: number[]; avg: number[] } {
  const v = values(seq, scale).map((x) => (Number.isFinite(x) ? x : 0)), pos: number[] = [], avg: number[] = [];
  if (!(w >= 1) || w > v.length) return { pos, avg };
  let s = 0;
  for (let i = 0; i < v.length; i++) {
    s += v[i];
    if (i >= w) s -= v[i - w];
    if (i >= w - 1) { const start = i - w + 1; pos.push(start + (w + 1) / 2); avg.push(s / w); }
  }
  return { pos, avg };
}

export type Segment = { start: number; end: number; length: number; peak: number; peakAt: number; seq: string };

/** Likely transmembrane segments: every window of w residues whose mean is above the threshold marks all of its
 *  residues; touching or overlapping marked runs join into one segment (1-based, inclusive). `peak` is the
 *  highest window mean inside, drawn at residue `peakAt`. */
export function tmSegments(seq: string, scale: Scale, w = 19, threshold = 1.6): Segment[] {
  const { pos, avg } = windowAverages(seq, scale, w), out: Segment[] = [];
  let cur: Segment | null = null;
  avg.forEach((a, i) => {
    if (!(a > threshold)) return;
    const start = i + 1, end = i + w;
    if (cur && start <= cur.end + 1) { cur.end = end; if (a > cur.peak) { cur.peak = a; cur.peakAt = pos[i]; } }
    else { cur = { start, end, length: 0, peak: a, peakAt: pos[i], seq: '' }; out.push(cur); }
  });
  for (const s of out) { s.length = s.end - s.start + 1; s.seq = seq.slice(s.start - 1, s.end); }
  return out;
}

/** A made-up protein for the example (not a real protein): a water-loving start, then three long water-repelling
 *  stretches joined by charged loops. */
export const EXAMPLE_PROTEIN = `>Example membrane protein (made up for fibub, not a real protein)
MSDNKTPEQRGSDEKPNTSQDRKGEFTPSNWLAVLIGFAVLLSVIAFGLRKDNSEPQTGK
RDYESGKTWAAFVLLIGSMVAVLCFIAPRNEDKTSGQEPHRDNYKPSELFVGLAIVLAWL
IFSAVVGLTMKDREQSNPKTEGHDSRKE`;
