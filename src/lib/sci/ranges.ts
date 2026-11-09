// Stratigraphic ranges: taxa with first and last appearances, put into time bins, then counted per bin the way
// Foote (2000) does with boundary crossers: singletons (FL), bottom-only (bL), top-only (Ft) and through-ranging
// (bt) taxa, diversity at each boundary, range-through diversity and per-capita origination and extinction rates.
// Plain TypeScript, no DOM.

export type Taxon = { name: string; first: number; last: number };
export type Bin = { name: string; base?: number; top?: number };
export type BinCounts = {
  bin: Bin; total: number; FL: number; bL: number; Ft: number; bt: number;
  originations: number; extinctions: number; atBase: number; atTop: number; meanStanding: number;
  /** Foote's per-capita rates per bin (p = −ln(bt / (Ft + bt)), q = −ln(bt / (bL + bt))); NaN when undefined. */
  p: number; q: number;
  /** The same per unit of time (per Myr when bins are in Ma); NaN with numbered bins. */
  pTime: number; qTime: number;
};

const isNum = (s: string) => /^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i.test(s.trim());

/** Read rows of taxon, first, last (last may be left out for a taxon known from one horizon). Header row optional. */
export function parseTaxa(rows: string[][], mode: 'ages' | 'bins', binNames: string[] = []): { taxa: (Taxon & { firstRaw: string; lastRaw: string })[] } {
  const body = rows.length && rows[0].length > 1 && !isNum(rows[0][1]) && !binNames.some((b) => b.toLowerCase() === rows[0][1].trim().toLowerCase()) ? rows.slice(1) : rows;
  const val = (s: string, line: number, name: string): number => {
    const t = s.trim();
    if (mode === 'bins') {
      const k = binNames.findIndex((b) => b.toLowerCase() === t.toLowerCase());
      if (k >= 0) return k + 1;
      if (/^\d+$/.test(t)) return Number(t);
      throw new Error(`Line ${line} (${name}): "${t}" is not a bin number${binNames.length ? ' or one of the bin names' : ''}.`);
    }
    if (!isNum(t)) throw new Error(`Line ${line} (${name}): "${t}" is not an age.`);
    return Number(t);
  };
  const off = rows.length - body.length;
  const taxa = body.map((r, i) => {
    const line = i + 1 + off, name = (r[0] ?? '').trim() || `Taxon ${i + 1}`;
    if (r.length < 2 || !r[1].trim()) throw new Error(`Line ${line} (${name}) needs a first appearance after the name.`);
    const fr = r[1], lr = r[2] && r[2].trim() ? r[2] : r[1];
    const first = val(fr, line, name), last = val(lr, line, name);
    if (mode === 'ages' && first < last) throw new Error(`Line ${line} (${name}): the first appearance (${fr.trim()}) is younger than the last (${lr.trim()}). Ages count back from today, so the first appearance is the larger number.`);
    if (mode === 'bins' && first > last) throw new Error(`Line ${line} (${name}): the first bin (${fr.trim()}) comes after the last (${lr.trim()}). Bin 1 is the oldest.`);
    return { name, first, last, firstRaw: fr.trim(), lastRaw: lr.trim() };
  });
  return { taxa };
}

/** Equal bins of width w (in Ma) covering every age, oldest first, on round multiples of w. */
export function equalBins(taxa: Taxon[], w: number): Bin[] {
  const hi = Math.max(...taxa.map((t) => t.first)), lo = Math.min(...taxa.map((t) => t.last));
  let base = Math.ceil(hi / w - 1e-9) * w;
  const stop = Math.floor(lo / w + 1e-9) * w;
  if (base === stop) base += w;
  const out: Bin[] = [];
  for (let b = base; b > stop + w * 1e-9; b -= w) { const t = +(b - w).toPrecision(12); out.push({ name: `${fmt(b)}–${fmt(t)}`, base: +b.toPrecision(12), top: t }); }
  return out;
}
const fmt = (x: number) => String(+x.toPrecision(10));

/** Bins from boundaries in Ma, oldest first (e.g. 100, 90, 80). Names optional, one per bin. */
export function edgeBins(edges: number[], names: string[] = []): Bin[] {
  for (let i = 1; i < edges.length; i++) if (!(edges[i] < edges[i - 1])) throw new Error(`Bin boundaries must get younger (smaller) in order; ${edges[i]} comes after ${edges[i - 1]}.`);
  return edges.slice(1).map((t, i) => ({ name: names[i] || `${fmt(edges[i])}–${fmt(t)}`, base: edges[i], top: t }));
}

/**
 * The bin (0 = oldest) holding an age. A first appearance exactly on a boundary goes in the younger bin, a last
 * appearance exactly on a boundary in the older bin, so a taxon that ends at a boundary did not cross it. A taxon
 * found only at one age that is exactly a boundary goes in the younger bin. −1 outside.
 */
export function binOf(age: number, bins: Bin[], kind: 'first' | 'last'): number {
  const k = bins.findIndex((b) => (kind === 'first' ? age <= b.base! && age > b.top! : age < b.base! && age >= b.top!));
  // The very youngest and oldest edges belong to the bins inside them.
  if (k < 0 && kind === 'first' && bins.length && age === bins[bins.length - 1].top) return bins.length - 1;
  if (k < 0 && kind === 'last' && bins.length && age === bins[0].base) return 0;
  return k;
}

/** Count every bin. Taxa are given as bin indices (0 = oldest) of their first and last appearance. */
export function countBins(ranges: { f: number; l: number }[], bins: Bin[]): BinCounts[] {
  return bins.map((bin, k) => {
    let FL = 0, bL = 0, Ft = 0, bt = 0;
    for (const { f, l } of ranges) {
      if (f > k || l < k) continue;
      const b = f < k, t = l > k;
      if (b && t) bt++; else if (b) bL++; else if (t) Ft++; else FL++;
    }
    const dur = bin.base !== undefined && bin.top !== undefined ? bin.base - bin.top : NaN;
    const p = bt > 0 ? -Math.log(bt / (Ft + bt)) : NaN, q = bt > 0 ? -Math.log(bt / (bL + bt)) : NaN;
    return {
      bin, total: FL + bL + Ft + bt, FL, bL, Ft, bt, originations: FL + Ft, extinctions: FL + bL,
      atBase: bL + bt, atTop: Ft + bt, meanStanding: (bL + Ft) / 2 + bt, p, q, pTime: p / dur, qTime: q / dur,
    };
  });
}

/** Everything at once: taxa to bins (ages or numbered bins), counts per bin. */
export function analyse(taxa: Taxon[], mode: 'ages' | 'bins', bins: Bin[]) {
  const ranges = taxa.map((t) => {
    if (mode === 'bins') {
      if (t.first < 1 || t.last > bins.length) throw new Error(`${t.name}: bin ${t.first < 1 ? t.first : t.last} is outside bins 1 to ${bins.length}.`);
      return { f: t.first - 1, l: t.last - 1 };
    }
    const f = binOf(t.first, bins, 'first'), l = binOf(t.last, bins, 'last');
    if (f < 0 || (l < 0 && t.last !== t.first)) throw new Error(`${t.name}: ${f < 0 ? t.first : t.last} Ma is outside the bins (${fmt(bins[0].base!)} to ${fmt(bins[bins.length - 1].top!)} Ma). Widen the bins.`);
    // A taxon found at one age that is exactly a boundary goes in the younger bin.
    return { f, l: Math.max(l, f) };
  });
  return { ranges, counts: countBins(ranges, bins) };
}

/** Made-up example: 24 invented taxa with first and last appearances in Ma. */
export const EXAMPLE = `taxon	first (Ma)	last (Ma)
Taxon A	118	96
Taxon B	115	112
Taxon C	112	71
Taxon D	109	88
Taxon E	104	104
Taxon F	103	80
Taxon G	99	93
Taxon H	97	66
Taxon I	95	84
Taxon J	92	92
Taxon K	91	75
Taxon L	89	86
Taxon M	87	66
Taxon N	85	78
Taxon O	83	70
Taxon P	81	81
Taxon Q	79	68
Taxon R	77	66
Taxon S	76	73
Taxon T	74	62
Taxon U	72	67
Taxon V	69	63
Taxon W	66	61
Taxon X	64	61
`;
