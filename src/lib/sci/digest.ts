// Restriction digests: find recognition sites (IUPAC letters allowed) on both strands of a linear or circular sequence,
// work out the top-strand cut positions and the fragment sizes, and place the bands on a simple virtual gel
// (distance falls with log10 of size). Enzymes are given as a site with ^ at the top-strand cut, e.g. G^AATTC, and an
// optional _ at the bottom-strand cut (CC^TCA_GC); without _ the bottom cut mirrors the top one. No DOM.

export type Enzyme = { name: string; site: string; cut: number; bottom: number };
const IUPAC: Record<string, string> = { A: 'A', C: 'C', G: 'G', T: 'T', R: '[AG]', Y: '[CT]', S: '[CG]', W: '[AT]', K: '[GT]', M: '[AC]', B: '[CGT]', D: '[AGT]', H: '[ACT]', V: '[ACG]', N: '[ACGT]' };
const COMP: Record<string, string> = { A: 'T', T: 'A', G: 'C', C: 'G', R: 'Y', Y: 'R', S: 'S', W: 'W', K: 'M', M: 'K', B: 'V', V: 'B', D: 'H', H: 'D', N: 'N' };
export const rcSite = (s: string) => s.split('').reverse().map((b) => COMP[b]).join('');

/** A few classic enzymes whose sites are textbook facts. */
export const CLASSIC: Enzyme[] = [
  ['EcoRI', 'G^AATTC'], ['BamHI', 'G^GATCC'], ['HindIII', 'A^AGCTT'], ['XhoI', 'C^TCGAG'], ['SalI', 'G^TCGAC'], ['XbaI', 'T^CTAGA'],
  ['PstI', 'CTGCA^G'], ['KpnI', 'GGTAC^C'], ['SmaI', 'CCC^GGG'], ['EcoRV', 'GAT^ATC'], ['NcoI', 'C^CATGG'], ['NotI', 'GC^GGCCGC'],
].map(([name, s]) => parseEnzyme(`${name} ${s}`)!);

/** "Name SITE" with one ^ (top-strand cut) and optionally one _ (bottom-strand cut); null if it cannot be read. */
export function parseEnzyme(line: string): Enzyme | null {
  const m = line.trim().match(/^(\S+)[\s,;:=]+([ACGTRYSWKMBDHVN^_]+)$/i);
  if (!m) return null;
  const raw = m[2].toUpperCase();
  if ((raw.match(/\^/g) ?? []).length !== 1 || (raw.match(/_/g) ?? []).length > 1) return null;
  const site = raw.replace(/[\^_]/g, ''), cut = raw.replace('_', '').indexOf('^'), b = raw.replace('^', '').indexOf('_');
  if (site.length < 3 || site.length > 40) return null;
  return { name: m[1], site, cut, bottom: b < 0 ? site.length - cut : b };
}

/** 0-based top-strand cut positions (number of bases before the cut), sorted, for one enzyme. */
export function cuts(seq: string, e: Enzyme, circular: boolean) {
  const L = seq.length, n = e.site.length, out = new Set<number>();
  if (L < n) return [];
  const text = circular ? seq + seq.slice(0, n - 1) : seq;
  const fwd = new RegExp(e.site.split('').map((b) => IUPAC[b]).join(''), 'g');
  const rcs = rcSite(e.site), rev = new RegExp(rcs.split('').map((b) => IUPAC[b]).join(''), 'g');
  const scan = (re: RegExp, off: (p: number) => number) => {
    for (let p = 0; p + n <= text.length && p < L; p++) { re.lastIndex = p; const m = re.exec(text); if (!m) break; p = m.index; if (p >= L) break; let c = off(p); if (circular) c = ((c % L) + L) % L; if (circular || (c > 0 && c < L)) out.add(c); }
  };
  scan(fwd, (p) => p + e.cut);
  if (rcs !== e.site) scan(rev, (p) => p + n - e.bottom);
  return [...out].sort((a, b) => a - b);
}

export type Fragment = { start: number; end: number; size: number; left: string; right: string };
/** Fragments from cut positions labelled by enzyme. start/end are 1-based on the top strand (end may wrap for circular). */
export function fragments(L: number, cutList: { pos: number; enz: string }[], circular: boolean): Fragment[] {
  const cs = [...cutList].sort((a, b) => a.pos - b.pos).filter((c, i, a) => i === 0 || c.pos !== a[i - 1].pos);
  if (!cs.length) return [{ start: 1, end: L, size: L, left: circular ? '' : 'end', right: circular ? '' : 'end' }];
  const out: Fragment[] = [];
  if (circular) {
    for (let i = 0; i < cs.length; i++) {
      const a = cs[i], b = cs[(i + 1) % cs.length], size = cs.length === 1 ? L : (b.pos - a.pos + L) % L;
      out.push({ start: a.pos + 1, end: b.pos === 0 ? L : b.pos, size, left: a.enz, right: b.enz });
    }
  } else {
    const pts = [{ pos: 0, enz: 'end' }, ...cs, { pos: L, enz: 'end' }];
    for (let i = 0; i + 1 < pts.length; i++) out.push({ start: pts[i].pos + 1, end: pts[i + 1].pos, size: pts[i + 1].pos - pts[i].pos, left: pts[i].enz, right: pts[i + 1].enz });
  }
  return out;
}

/** Relative migration (0 at the well, 1 at the bottom) for a size, log-linear between the ladder's smallest and largest bands. */
export function migration(size: number, minBp: number, maxBp: number) {
  const top = 0.06, bot = 0.94, f = (Math.log10(maxBp) - Math.log10(size)) / (Math.log10(maxBp) - Math.log10(minBp));
  return top + (bot - top) * f;
}
