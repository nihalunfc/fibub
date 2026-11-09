// Punnett squares and genetics chances for teaching: crosses of 1 to 6 genes (complete, incomplete and codominant
// dominance, ABO blood groups, X-linked recessive and dominant), genotype and phenotype ratios as exact fractions,
// the branch (forked-line) method for one chosen kind of offspring, binomial chances for several children, and
// simple Bayesian carrier risks from a pedigree. All genes are taken to sort independently (unlinked). No DOM.

export type Mode = 'complete' | 'incomplete' | 'codominant' | 'abo' | 'xrec' | 'xdom';
export const MODES: Record<Mode, { name: string; x: boolean; phenos: number }> = {
  complete: { name: 'Complete dominance', x: false, phenos: 2 },
  incomplete: { name: 'Incomplete dominance', x: false, phenos: 3 },
  codominant: { name: 'Codominance', x: false, phenos: 3 },
  abo: { name: 'ABO blood groups', x: false, phenos: 4 },
  xrec: { name: 'X-linked recessive', x: true, phenos: 2 },
  xdom: { name: 'X-linked dominant', x: true, phenos: 2 },
};
/** A father's Y chromosome in place of an X-linked allele. */
export const Y = -1;
/** One gene of the cross. Alleles are numbers: 0 and 1 (A and a), or 0, 1, 2 for ABO (Iᴬ, Iᴮ, i). A father's
 * X-linked genotype is [allele, Y]. names: optional phenotype names, in the order of phenoNames(). */
export type Gene = { letter: string; mode: Mode; mother: number[]; father: number[]; names?: string[] };
/** A printed symbol: base letters and an optional superscript. */
export type Tok = [string, string?];
export const MAX_GENES = 6, MAX_SQUARE_GENES = 4;

const ord = (a: number) => (a < 0 ? 99 : a);
export const norm = (p: number[]) => [...p].sort((a, b) => ord(a) - ord(b));
export const isX = (g: { mode: Mode }) => MODES[g.mode].x;
const letterOf = (g: { letter: string; mode: Mode }) => (g.mode === 'abo' ? 'I' : g.letter.toUpperCase());

export function alleleTok(g: { letter: string; mode: Mode }, a: number): Tok {
  const L = letterOf(g), l = L.toLowerCase();
  if (a === Y) return ['Y'];
  switch (g.mode) {
    case 'complete': case 'incomplete': return [a === 0 ? L : l];
    case 'codominant': return [L, a === 0 ? '1' : '2'];
    case 'abo': return a === 2 ? ['i'] : ['I', a === 0 ? 'A' : 'B'];
    default: return ['X', a === 0 ? L : l];
  }
}
export const genoToks = (g: { letter: string; mode: Mode }, pair: number[]) => norm(pair).map((a) => alleleTok(g, a));
/** Plain text for a list of symbols: X^A X^a, or Aa when there are no superscripts. */
export function plain(t: Tok[]): string {
  const sup = t.some((x) => x[1]);
  return t.map(([b, s]) => (s ? `${b}^${s}` : b)).join(sup ? ' ' : '');
}

/** Genotypes a parent can have for this gene; sex 'f' (mother) or 'm' (father). */
export function genotypeOptions(mode: Mode, sex: 'f' | 'm'): number[][] {
  if (mode === 'abo') return [[0, 0], [0, 2], [1, 1], [1, 2], [0, 1], [2, 2]];
  if (MODES[mode].x && sex === 'm') return [[0, Y], [1, Y]];
  return [[0, 0], [0, 1], [1, 1]];
}

export function defaultNames(g: { letter: string; mode: Mode }): string[] {
  const L = letterOf(g), l = L.toLowerCase();
  switch (g.mode) {
    case 'complete': return [`${L}_`, `${l}${l}`];
    case 'incomplete': return [`${L}${L}`, `${L}${l} (in between)`, `${l}${l}`];
    case 'codominant': return [`${L}1 only`, `${L}1 and ${L}2`, `${L}2 only`];
    case 'abo': return ['Type A', 'Type B', 'Type AB', 'Type O'];
    default: return [`${L} not affected`, `${L} affected`];
  }
}
export const phenoNames = (g: Gene) => (g.names && g.names.length === MODES[g.mode].phenos ? g.names : defaultNames(g));

/** Which phenotype (index into phenoNames) a genotype shows. */
export function phenoIndex(g: { mode: Mode }, pair: number[]): number {
  const [a, b] = norm(pair);
  switch (g.mode) {
    case 'complete': return a === 0 ? 0 : 1;
    case 'incomplete': case 'codominant': return a + b;
    case 'abo': return a === 0 && b === 1 ? 2 : a === 0 ? 0 : a === 1 ? 1 : 3;
    case 'xrec': return b === Y ? (a === 1 ? 1 : 0) : (a === 1 && b === 1 ? 1 : 0);
    default: return a === 0 ? 1 : 0; // xdom: any copy of the dominant allele (allele 0) shows the trait
  }
}

/** Checks a cross. Returns a list of plain messages; empty when it is fine. */
export function validate(genes: Gene[]): string[] {
  const err: string[] = [];
  if (!genes.length || genes.length > MAX_GENES) err.push(`Use 1 to ${MAX_GENES} genes.`);
  const seen = new Set<string>();
  genes.forEach((g, i) => {
    const L = letterOf(g);
    if (!/^[A-Z]$/.test(L) || (g.mode !== 'abo' && /^[XY]$/.test(L))) err.push(`Gene ${i + 1}: use one letter, A to Z (not X or Y).`);
    else if (seen.has(L)) err.push(`Gene ${i + 1}: the letter ${L} is used twice. Give each gene its own letter${g.mode === 'abo' ? ' (ABO uses I)' : ''}.`);
    seen.add(L);
    const ok = (sex: 'f' | 'm', p: number[]) => genotypeOptions(g.mode, sex).some((o) => o.join() === norm(p).join());
    if (!ok('f', g.mother) || !ok('m', g.father)) err.push(`Gene ${i + 1}: pick a genotype for each parent.`);
    if (g.names && g.names.length && g.names.length !== MODES[g.mode].phenos) err.push(`Gene ${i + 1}: give ${MODES[g.mode].phenos} phenotype names, separated by commas (or leave the box empty).`);
  });
  return err;
}

// ---------- Fractions (small numbers; exact) ----------
export type Frac = { n: number; d: number };
const gcd = (a: number, b: number): number => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
export const frac = (n: number, d: number): Frac => { const g = gcd(n, d); return { n: n / g, d: d / g }; };
export const fmul = (a: Frac, b: Frac) => frac(a.n * b.n, a.d * b.d);
export const fadd = (a: Frac, b: Frac) => frac(a.n * b.d + b.n * a.d, a.d * b.d);
export const fstr = (f: Frac) => (f.n === 0 ? '0' : f.d === 1 ? String(f.n) : `${f.n}/${f.d}`);

// ---------- The Punnett square ----------
export type Gamete = { alleles: number[]; y: boolean; toks: Tok[] };
export type Offspring = { sex: number; pairs: number[][] }; // sex: -1 not tracked, 0 female, 1 male
export const hasSex = (genes: Gene[]) => genes.some(isX);

function cart<T>(lists: T[][]): T[][] { return lists.reduce<T[][]>((acc, l) => acc.flatMap((a) => l.map((x) => [...a, x])), [[]]); }
const uniq = (xs: number[]) => [...new Set(xs)].sort((a, b) => ord(a) - ord(b));

/** The different gametes a parent makes, each equally likely (genes sort independently). */
export function gametes(genes: Gene[], who: 'mother' | 'father'): Gamete[] {
  const mk = (alleles: number[], y: boolean): Gamete => ({ alleles, y, toks: alleles.map((a, i) => (a === Y ? null : alleleTok(genes[i], a))).filter((t): t is Tok => !!t).concat(y ? [['Y']] : []) });
  if (who === 'mother' || !hasSex(genes)) return cart(genes.map((g) => uniq(g[who]))).map((a) => mk(a, false));
  // A father passes on either his X (with every X-linked allele he has) or his Y.
  const auto = cart(genes.map((g) => (isX(g) ? [0] : uniq(g.father))));
  const out: Gamete[] = [];
  for (const a of auto) {
    out.push(mk(a.map((x, i) => (isX(genes[i]) ? genes[i].father[0] : x)), false));
    out.push(mk(a.map((x, i) => (isX(genes[i]) ? Y : x)), true));
  }
  return out;
}

export function fuse(genes: Gene[], m: Gamete, f: Gamete): Offspring {
  return { sex: hasSex(genes) ? (f.y ? 1 : 0) : -1, pairs: genes.map((_, i) => norm([m.alleles[i], f.alleles[i]])) };
}
export const genoKey = (o: Offspring) => `${o.sex}|${o.pairs.map((p) => p.join(',')).join(';')}`;
export const phenoOf = (genes: Gene[], o: Offspring) => ({ sex: o.sex, idx: genes.map((g, i) => phenoIndex(g, o.pairs[i])) });
export const phenoKey = (p: { sex: number; idx: number[] }) => `${p.sex}|${p.idx.join(',')}`;

/** The full Punnett square: mother's gametes down the side, father's across the top. */
export function square(genes: Gene[]) {
  const mg = gametes(genes, 'mother'), fg = gametes(genes, 'father');
  return { mg, fg, cells: mg.map((m) => fg.map((f) => fuse(genes, m, f))) };
}

export type GenoClass = Offspring & { key: string; p: Frac; count: number; pheno: string; toks: Tok[][] };
export type PhenoClass = { key: string; sex: number; idx: number[]; p: Frac; count: number; name: string };
export type Ratios = { total: number; genotypes: GenoClass[]; phenotypes: PhenoClass[]; phenoRatio: number[]; genoRatio: number[] };

/** One gene's offspring genotypes for a given sex, as whole-number weights out of `of`. */
export function geneDist(g: Gene, sex: number): { of: number; rows: { pair: number[]; w: number }[] } {
  const m = new Map<string, { pair: number[]; w: number }>();
  const add = (p: number[]) => { const q = norm(p), k = q.join(); const r = m.get(k); if (r) r.w++; else m.set(k, { pair: q, w: 1 }); };
  if (isX(g)) { for (const a of g.mother) add([a, sex === 1 ? Y : g.father[0]]); }
  else for (const a of g.mother) for (const b of g.father) add([a, b]);
  return { of: isX(g) ? 2 : 4, rows: [...m.values()].sort((a, b) => cmpPair(a.pair, b.pair)) };
}
const cmpPair = (a: number[], b: number[]) => ord(a[0]) - ord(b[0]) || ord(a[1]) - ord(b[1]);
const cmpList = (a: number[], b: number[]) => { for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return a[i] - b[i]; return 0; };

export function sexName(sex: number) { return sex === 0 ? 'Female' : sex === 1 ? 'Male' : ''; }
export function phenoLabel(genes: Gene[], p: { sex: number; idx: number[] }) {
  const parts = genes.map((g, i) => phenoNames(g)[p.idx[i]]);
  return (p.sex >= 0 ? `${sexName(p.sex)}: ` : '') + parts.join(', ');
}

/** Genotype and phenotype ratios by the branch (product) method: works for 1 to 6 genes and agrees with the square. */
export function ratios(genes: Gene[]): Ratios {
  const sexes = hasSex(genes) ? [0, 1] : [-1];
  const total = sexes.length * genes.reduce((t, g) => t * (isX(g) ? 2 : 4), 1);
  const geno: GenoClass[] = [];
  for (const s of sexes) {
    const ds = genes.map((g) => geneDist(g, s));
    // Scale each gene's weights so every class counts boxes out of `total`.
    for (const combo of cart(ds.map((d) => d.rows))) {
      const count = combo.reduce((c, r) => c * r.w, 1) * (total / sexes.length / ds.reduce((t, d) => t * d.of, 1));
      const o: Offspring = { sex: s, pairs: combo.map((r) => r.pair) };
      const ph = phenoOf(genes, o);
      geno.push({ ...o, key: genoKey(o), count, p: frac(count, total), pheno: phenoKey(ph), toks: genes.map((g, i) => genoToks(g, o.pairs[i])) });
    }
  }
  geno.sort((a, b) => a.sex - b.sex || a.pairs.reduce((c, p, i) => c || cmpPair(p, b.pairs[i]), 0));
  const pm = new Map<string, PhenoClass>();
  for (const g of geno) {
    const r = pm.get(g.pheno);
    if (r) { r.count += g.count; r.p = frac(r.count, total); continue; }
    const ph = phenoOf(genes, g);
    pm.set(g.pheno, { key: g.pheno, sex: ph.sex, idx: ph.idx, count: g.count, p: frac(g.count, total), name: phenoLabel(genes, ph) });
  }
  // Classic order: largest class first when every gene is plain dominant/recessive (9:3:3:1, 27:9:9:9:3:3:3:1);
  // otherwise gene by gene (1:2:1, females before males).
  const desc = genes.every((g) => g.mode === 'complete');
  const phenotypes = [...pm.values()].sort((a, b) => (desc ? b.count - a.count : 0) || a.sex - b.sex || cmpList(a.idx, b.idx));
  const red = (xs: number[]) => { const g = xs.reduce((a, b) => gcd(a, b), 0); return xs.map((x) => x / g); };
  return { total, genotypes: geno, phenotypes, phenoRatio: red(phenotypes.map((p) => p.count)), genoRatio: red(geno.map((g) => g.count)) };
}

/** Plain-text genotype of an offspring class, e.g. AaBb or Aa X^A X^a. */
export function genoText(genes: Gene[], pairs: number[][]): string {
  const parts = genes.map((g, i) => plain(genoToks(g, pairs[i])));
  return parts.join(genes.every((g) => g.mode === 'complete' || g.mode === 'incomplete') ? '' : ' ');
}

// ---------- Branch method for one chosen kind of offspring ----------
export type Want = { kind: 'any' } | { kind: 'g'; pair: number[] } | { kind: 'p'; idx: number };
export type Query = { sex: 'any' | 0 | 1; genes: Want[] };
/** Options a gene's "want" can take for this cross: any, each possible genotype, each possible phenotype. */
export function wantOptions(g: Gene): { label: string; want: Want }[] {
  const pairs = new Map<string, number[]>();
  for (const s of isX(g) ? [0, 1] : [-1]) for (const r of geneDist(g, s).rows) pairs.set(r.pair.join(), r.pair);
  const names = phenoNames(g), ph = new Set([...pairs.values()].map((p) => phenoIndex(g, p)));
  return [{ label: 'Any', want: { kind: 'any' } },
    ...[...pairs.values()].sort(cmpPair).map((pair) => ({ label: plain(genoToks(g, pair)), want: { kind: 'g', pair } as Want })),
    ...[...ph].sort((a, b) => a - b).map((idx) => ({ label: names[idx], want: { kind: 'p', idx } as Want }))];
}
function geneChance(g: Gene, s: number, w: Want): Frac {
  if (w.kind === 'any') return { n: 1, d: 1 };
  const d = geneDist(g, s);
  const hit = d.rows.filter((r) => (w.kind === 'g' ? norm(w.pair).join() === r.pair.join() : phenoIndex(g, r.pair) === w.idx)).reduce((t, r) => t + r.w, 0);
  return frac(hit, d.of);
}
/** The product rule, shown as working: e.g. 3/4 × 1/2 × 1/4 = 3/32. */
export function chance(genes: Gene[], q: Query): { p: Frac; working: string } {
  const sx = hasSex(genes);
  const part = (s: number) => {
    const fs = genes.map((g, i) => geneChance(g, s, q.genes[i] ?? { kind: 'any' }));
    const shown = fs.filter((f, i) => (q.genes[i] ?? { kind: 'any' }).kind !== 'any');
    return { p: fs.reduce(fmul, { n: 1, d: 1 }), shown };
  };
  const prod = (fs: Frac[]) => (fs.length ? fs.map(fstr).join(' × ') : '1');
  if (!sx) {
    const { p, shown } = part(-1);
    return { p, working: shown.length > 1 ? `${prod(shown)} = ${fstr(p)}` : shown.length ? fstr(p) : '1 (no gene chosen)' };
  }
  if (q.sex !== 'any') {
    const { p, shown } = part(q.sex), t = fmul({ n: 1, d: 2 }, p);
    return { p: t, working: `1/2 (${sexName(q.sex).toLowerCase()})${shown.length ? ' × ' + prod(shown) : ''} = ${fstr(t)}` };
  }
  const a = part(0), b = part(1);
  const t = fadd(fmul({ n: 1, d: 2 }, a.p), fmul({ n: 1, d: 2 }, b.p));
  if (fstr(a.p) === fstr(b.p) && prod(a.shown) === prod(b.shown)) return { p: t, working: a.shown.length > 1 ? `${prod(a.shown)} = ${fstr(t)}` : a.shown.length ? fstr(t) : '1 (no gene chosen)' };
  return { p: t, working: `1/2 × (${prod(a.shown)}) for daughters + 1/2 × (${prod(b.shown)}) for sons = ${fstr(t)}` };
}

// ---------- Exact chances with big whole numbers ----------
export type Big = { n: bigint; d: bigint };
const bgcd = (a: bigint, b: bigint): bigint => { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) [a, b] = [b, a % b]; return a || 1n; };
export const big = (n: bigint, d: bigint): Big => { const g = bgcd(n, d); return d < 0n ? { n: -n / g, d: -d / g } : { n: n / g, d: d / g }; };
export const bmul = (a: Big, b: Big) => big(a.n * b.n, a.d * b.d);
export const badd = (a: Big, b: Big) => big(a.n * b.d + b.n * a.d, a.d * b.d);
export const bsub = (a: Big, b: Big) => big(a.n * b.d - b.n * a.d, a.d * b.d);
export const bdiv = (a: Big, b: Big) => big(a.n * b.d, a.d * b.n);
export const bpow = (a: Big, k: number) => big(a.n ** BigInt(k), a.d ** BigInt(k));
export const ONE: Big = { n: 1n, d: 1n }, ZERO: Big = { n: 0n, d: 1n };
export const bnum = (a: Big) => Number((a.n * 10n ** 15n) / a.d) / 1e15;
export const bstr = (a: Big) => (a.n === 0n ? '0' : a.d === 1n ? String(a.n) : `${a.n}/${a.d}`);
export const fromFrac = (f: Frac): Big => big(BigInt(f.n), BigInt(f.d));
/** "1 in N" form, rounded, for a chance between 0 and 1. */
export function oneIn(a: Big): string {
  if (a.n === 0n) return 'never';
  const x = bnum(a), r = 1 / x;
  if (a.n === a.d) return 'certain';
  return `1 in ${r < 10 ? Number(r.toFixed(1)) : Math.round(r).toLocaleString('en')}`;
}

/** Reads a chance typed as 1/4, 0.25, 25 %, or 1 in 4. Returns null when it is not a chance from 0 to 1. */
export function parseChance(s: string): Big | null {
  const t = s.trim().toLowerCase().replace(/,/g, '').replace(/\s+/g, ' ');
  let m: RegExpMatchArray | null, r: Big | null = null;
  const dec = (x: string): Big => { const [i, f = ''] = x.split('.'); return big(BigInt((i || '0') + f), 10n ** BigInt(f.length)); };
  if ((m = t.match(/^(\d+) ?(?:\/|in|out of) ?(\d+)$/))) r = BigInt(m[2]) === 0n ? null : big(BigInt(m[1]), BigInt(m[2]));
  else if ((m = t.match(/^(\d*\.?\d+) ?%$/))) r = bdiv(dec(m[1]), { n: 100n, d: 1n });
  else if ((m = t.match(/^(\d*\.?\d+)$/))) r = dec(m[1]);
  if (!r || r.n < 0n || r.n > r.d) return null;
  return r;
}

function choose(n: number, k: number): bigint { let c = 1n; for (let i = 1; i <= k; i++) c = (c * BigInt(n - k + i)) / BigInt(i); return c; }
/** Binomial chances: P(exactly k of n) for k = 0..n, each child independent with chance p. */
export function binomial(p: Big, n: number): Big[] {
  const q = bsub(ONE, p);
  return Array.from({ length: n + 1 }, (_, k) => bmul({ n: choose(n, k), d: 1n }, bmul(bpow(p, k), bpow(q, n - k))));
}
export function binomialSummary(p: Big, n: number, k: number) {
  const all = binomial(p, n), sum = (xs: Big[]) => xs.reduce(badd, ZERO);
  return { all, exactly: all[k], atLeast: sum(all.slice(k)), atMost: sum(all.slice(0, k + 1)), none: all[0], atLeastOne: bsub(ONE, all[0]), inOrder: bmul(bpow(p, k), bpow(bsub(ONE, p), n - k)) };
}

// ---------- Pedigree carrier risk (Bayes) ----------
export type BayesRow = { name: string; prior: Big; cond: Big; joint: Big; post: Big };
/** Usual prior chances that an unaffected person carries an autosomal recessive allele. */
export const AR_PRIORS: { id: string; label: string; p: string }[] = [
  { id: 'sib', label: 'Has an affected brother or sister (parents both carriers)', p: '2/3' },
  { id: 'aunt', label: 'Has an affected aunt or uncle on one side', p: '1/3' },
  { id: 'carrier-parent', label: 'One parent is a known carrier, the other is not', p: '1/2' },
  { id: 'affected-parent', label: 'One parent is affected', p: '1' },
  { id: 'known', label: 'Known carrier (test result)', p: '1' },
  { id: 'custom', label: 'Type a chance (for example a population carrier chance)', p: '' },
];
export const XL_PRIORS: { id: string; label: string; p: string }[] = [
  { id: 'carrier-mother', label: 'Her mother is a known carrier', p: '1/2' },
  { id: 'affected-father', label: 'Her father is affected', p: '1' },
  { id: 'carrier-grandmother', label: 'Her mother’s mother is a known carrier', p: '1/4' },
  { id: 'custom', label: 'Type a chance', p: '' },
];

/** Autosomal recessive: two unaffected partners with prior carrier chances p1 and p2 (unrelated, so independent)
 * and `kids` unaffected children. Each child of two carriers is unaffected with chance 3/4. */
export function arBayes(p1: Big, p2: Big, kids: number) {
  const q1 = bsub(ONE, p1), q2 = bsub(ONE, p2), l = bpow({ n: 3n, d: 4n }, kids);
  const rows: BayesRow[] = [
    { name: 'Both carriers', prior: bmul(p1, p2), cond: l },
    { name: 'Only partner 1 a carrier', prior: bmul(p1, q2), cond: ONE },
    { name: 'Only partner 2 a carrier', prior: bmul(q1, p2), cond: ONE },
    { name: 'Neither a carrier', prior: bmul(q1, q2), cond: ONE },
  ].map((r) => ({ ...r, joint: bmul(r.prior, r.cond), post: ZERO }));
  const tot = rows.reduce((t, r) => badd(t, r.joint), ZERO);
  for (const r of rows) r.post = bdiv(r.joint, tot);
  const half = { n: 1n, d: 2n };
  return {
    rows, total: tot,
    carrier1: badd(rows[0].post, rows[1].post), carrier2: badd(rows[0].post, rows[2].post), both: rows[0].post,
    childAffected: bmul(rows[0].post, { n: 1n, d: 4n }),
    childCarrier: badd(bmul(rows[0].post, half), bmul(badd(rows[1].post, rows[2].post), half)),
    priorChildAffected: bmul(rows[0].prior, { n: 1n, d: 4n }),
  };
}

/** X-linked recessive: an unaffected woman with prior carrier chance p and `sons` unaffected sons (each son of a
 * carrier is unaffected with chance 1/2). Her partner is taken to be unaffected. */
export function xlBayes(p: Big, sons: number) {
  const l = bpow({ n: 1n, d: 2n }, sons);
  const rows: BayesRow[] = [
    { name: 'Carrier', prior: p, cond: l },
    { name: 'Not a carrier', prior: bsub(ONE, p), cond: ONE },
  ].map((r) => ({ ...r, joint: bmul(r.prior, r.cond), post: ZERO }));
  const tot = badd(rows[0].joint, rows[1].joint);
  for (const r of rows) r.post = bdiv(r.joint, tot);
  const half = { n: 1n, d: 2n };
  return { rows, total: tot, carrier: rows[0].post, sonAffected: bmul(rows[0].post, half), daughterCarrier: bmul(rows[0].post, half), priorSonAffected: bmul(p, half) };
}

// ---------- Ready-made crosses ----------
const G = (letter: string, mode: Mode, mother: number[], father: number[], names?: string[]): Gene => ({ letter, mode, mother, father, names });
export const PRESETS: { id: string; name: string; genes: Gene[] }[] = [
  { id: 'peas', name: 'Pea seeds, two genes (AaBb × AaBb)', genes: [G('A', 'complete', [0, 1], [0, 1], ['Yellow', 'Green']), G('B', 'complete', [0, 1], [0, 1], ['Round', 'Wrinkled'])] },
  { id: 'mono', name: 'One gene, test cross (Aa × aa)', genes: [G('A', 'complete', [0, 1], [1, 1])] },
  { id: 'flower', name: 'Flower colour, incomplete dominance (Rr × Rr)', genes: [G('R', 'incomplete', [0, 1], [0, 1], ['Red', 'Pink', 'White'])] },
  { id: 'coat', name: 'Coat colour, codominance (C1C2 × C1C2)', genes: [G('C', 'codominant', [0, 1], [0, 1], ['Red coat', 'Roan coat', 'White coat'])] },
  { id: 'abo', name: 'ABO blood groups (Iᴬi × Iᴮi)', genes: [G('I', 'abo', [0, 2], [1, 2])] },
  { id: 'xrec', name: 'X-linked recessive (carrier mother × unaffected father)', genes: [G('H', 'xrec', [0, 1], [0, Y])] },
  { id: 'mixed', name: 'One gene plus one X-linked gene', genes: [G('A', 'complete', [0, 1], [0, 1]), G('B', 'xrec', [0, 1], [0, Y])] },
  { id: 'three', name: 'Three genes (AaBbCc × AaBbCc)', genes: ['A', 'B', 'C'].map((l) => G(l, 'complete', [0, 1], [0, 1])) },
  { id: 'four', name: 'Four genes (AaBbCcDd × AaBbCcDd)', genes: ['A', 'B', 'C', 'D'].map((l) => G(l, 'complete', [0, 1], [0, 1])) },
];
