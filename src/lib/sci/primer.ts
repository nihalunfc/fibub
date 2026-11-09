// PCR primer checks: length, GC, melting temperature by the simple textbook formulas (Wallace rule, the basic GC
// formula and a sodium-adjusted GC formula), runs and repeats, GC clamp, hairpins, self- and cross-dimers, and binding
// sites and products on a template. No nearest-neighbour tables are used. No DOM.

const PAIR: Record<string, string> = { A: 'T', T: 'A', G: 'C', C: 'G' };
export const rc = (s: string) => s.split('').reverse().map((b) => PAIR[b] ?? 'N').join('');
/** Upper-case DNA with U read as T; null if anything other than A, C, G, T is left. */
export function clean(s: string) {
  const t = s.toUpperCase().replace(/U/g, 'T').replace(/[\s\d\-]/g, '');
  return /^[ACGT]*$/.test(t) ? t : null;
}
export const gcCount = (s: string) => (s.match(/[GC]/g) ?? []).length;
/** Wallace rule, 2 °C per A/T and 4 °C per G/C: for primers under about 14 nt. */
export const tmWallace = (s: string) => 2 * (s.length - gcCount(s)) + 4 * gcCount(s);
/** Basic GC formula: 64.9 + 41 × (G+C − 16.4) / N. */
export const tmBasic = (s: string) => 64.9 + (41 * (gcCount(s) - 16.4)) / s.length;
/** Sodium-adjusted GC formula: 81.5 + 16.6 log10[Na⁺ in M] + 0.41 × %GC − 675 / N. */
export const tmSalt = (s: string, naMM = 50) => 81.5 + 16.6 * Math.log10(naMM / 1000) + 0.41 * ((100 * gcCount(s)) / s.length) - 675 / s.length;

/** Longest run of one base, and longest run of a repeated dinucleotide (in repeats). */
export function runs(s: string) {
  let best = { base: '', len: 0, at: 0 }, di = { unit: '', reps: 0, at: 0 };
  for (let i = 0; i < s.length; ) { let j = i; while (j < s.length && s[j] === s[i]) j++; if (j - i > best.len) best = { base: s[i], len: j - i, at: i }; i = j; }
  for (let i = 0; i + 1 < s.length; i++) {
    const u = s.slice(i, i + 2); if (u[0] === u[1]) continue;
    let k = 1; while (s.slice(i + 2 * k, i + 2 * k + 2) === u) k++;
    if (k > di.reps) di = { unit: u, reps: k, at: i };
  }
  return { run: best, di };
}
/** G or C bases among the last 5 at the 3′ end. */
export const clamp = (s: string) => gcCount(s.slice(-5));

/** Longest hairpin: a stem of Watson–Crick pairs closing a loop of at least minLoop bases. Positions are 0-based. */
export function hairpin(s: string, minLoop = 3) {
  let best = { stem: 0, i: -1, j: -1, loop: 0 };
  const n = s.length;
  for (let i = 0; i < n; i++) for (let j = n - 1; j > i; j--) {
    let k = 0;
    while (i + k < j - k && PAIR[s[i + k]] === s[j - k]) k++;
    // trim the stem until the loop is long enough
    while (k > 0 && j - k + 1 - (i + k - 1) - 1 < minLoop) k--;
    if (k > best.stem) best = { stem: k, i, j, loop: j - k + 1 - (i + k - 1) - 1 };
  }
  return best;
}

/**
 * Dimer of a with b (5′→3′ each), antiparallel: every offset, the longest run of complementary bases, and the longest
 * run that includes the 3′-terminal base of either primer (the kind that polymerase can extend).
 */
export function dimer(a: string, b: string) {
  const br = b.split('').reverse().join(''); // b written 3′→5′
  let any = { len: 0, ai: 0, off: 0 }, end3 = 0;
  for (let off = -(br.length - 1); off < a.length; off++) {
    let run = 0;
    for (let i = Math.max(0, off); i < Math.min(a.length, off + br.length); i++) {
      const j = i - off;
      if (PAIR[a[i]] === br[j]) {
        run++;
        if (run > any.len) any = { len: run, ai: i - run + 1, off };
        // a's 3′ end is i = a.length − 1; b's 3′ end is j = 0 (start of br) — the run must reach it.
        if (i === a.length - 1) end3 = Math.max(end3, run);
        if (j === 0) { let r = 0; while (i + r < a.length && j + r < br.length && PAIR[a[i + r]] === br[j + r]) r++; end3 = Math.max(end3, r); }
      } else run = 0;
    }
  }
  return { longest: any.len, threePrime: end3, at: any };
}

export type Site = { pos: number; strand: '+' | '−'; mm: number };
/**
 * Binding sites on the top strand of a template: the primer itself (forward, + strand) and its reverse complement
 * (− strand), with up to maxMM mismatches, but the 3′-most `exact3` bases must match. pos is the 0-based start on the top strand.
 */
export function sites(tpl: string, p: string, maxMM = 1, exact3 = 3) {
  const out: Site[] = [], n = p.length, r = rc(p);
  for (let s = 0; s + n <= tpl.length; s++) {
    let mf = 0, mr = 0, okf = true, okr = true;
    for (let k = 0; k < n && (okf || okr); k++) {
      const t = tpl[s + k];
      if (okf && t !== p[k]) { if (k >= n - exact3 || ++mf > maxMM) okf = false; }
      if (okr && t !== r[k]) { if (k < exact3 || ++mr > maxMM) okr = false; }
    }
    if (okf) out.push({ pos: s, strand: '+', mm: mf });
    if (okr) out.push({ pos: s, strand: '−', mm: mr });
  }
  return out;
}
/** Products from a forward primer on + and a reverse primer on −, forward first, up to maxLen bp. */
export function products(fSites: Site[], rSites: Site[], rLen: number, maxLen = 10000) {
  const out: { start: number; end: number; size: number; mm: number }[] = [];
  for (const f of fSites) if (f.strand === '+') for (const r of rSites) if (r.strand === '−') {
    const end = r.pos + rLen, size = end - f.pos;
    if (r.pos >= f.pos && size <= maxLen) out.push({ start: f.pos, end, size, mm: f.mm + r.mm });
  }
  return out.sort((x, y) => x.mm - y.mm || x.size - y.size);
}
