// Mendel's pea garden (school genetics): crosses, exact ratios, random offspring and a chi-square check.
// Plain maths, no DOM. A genotype is one string of 2 allele letters per gene, e.g. ['Tt'] or ['Rr', 'Yy'].

export type Dominance = 'complete' | 'incomplete' | 'codominant';
export type Gene = { id: string; alleles: string[]; dominance: Dominance; trait: string; pheno: (g: string) => string };

const sortPair = (a: string, b: string, order: string[]) => (order.indexOf(a) <= order.indexOf(b) ? a + b : b + a);

export const GENES: Record<string, Gene> = {
  height: { id: 'height', trait: 'Plant height', alleles: ['T', 't'], dominance: 'complete', pheno: (g) => (g.includes('T') ? 'tall' : 'short') },
  shape: { id: 'shape', trait: 'Seed shape', alleles: ['R', 'r'], dominance: 'complete', pheno: (g) => (g.includes('R') ? 'round' : 'wrinkled') },
  colour: { id: 'colour', trait: 'Seed colour', alleles: ['Y', 'y'], dominance: 'complete', pheno: (g) => (g.includes('Y') ? 'yellow' : 'green') },
  flower: { id: 'flower', trait: 'Snapdragon flower', alleles: ['R', 'W'], dominance: 'incomplete', pheno: (g) => (g === 'RR' ? 'red' : g === 'WW' ? 'white' : 'pink') },
  blood: { id: 'blood', trait: 'ABO blood group', alleles: ['A', 'B', 'O'], dominance: 'codominant',
    pheno: (g) => (g.includes('A') && g.includes('B') ? 'AB' : g.includes('A') ? 'A' : g.includes('B') ? 'B' : 'O') },
};

export const normalise = (gene: Gene, g: string) => sortPair(g[0], g[1], gene.alleles);
export const genotypesOf = (gene: Gene) => {
  const out: string[] = [];
  gene.alleles.forEach((a, i) => gene.alleles.slice(i).forEach((b) => out.push(a + b)));
  return out;
};
export const isValid = (gene: Gene, g: string) => g.length === 2 && gene.alleles.includes(g[0]) && gene.alleles.includes(g[1]);

/** Gametes of a parent (independent assortment): allele strings with their chances. */
export function gametes(genes: Gene[], geno: string[]): Map<string, number> {
  let out = new Map<string, number>([['', 1]]);
  genes.forEach((_, k) => {
    const next = new Map<string, number>();
    for (const [g, p] of out) for (const a of geno[k]) next.set(g + a, (next.get(g + a) ?? 0) + p / 2);
    out = next;
  });
  return out;
}

export type Outcome = { geno: string; pheno: string; p: number };
/** Exact offspring of a cross: every genotype and phenotype with its chance. */
export function cross(genes: Gene[], mum: string[], dad: string[]) {
  const gm = gametes(genes, mum), gd = gametes(genes, dad);
  const geno = new Map<string, number>(), pheno = new Map<string, number>();
  for (const [a, pa] of gm) for (const [b, pb] of gd) {
    const parts = genes.map((gene, k) => normalise(gene, a[k] + b[k]));
    const key = parts.join(' '), ph = genes.map((gene, k) => gene.pheno(parts[k])).join(', ');
    geno.set(key, (geno.get(key) ?? 0) + pa * pb);
    pheno.set(ph, (pheno.get(ph) ?? 0) + pa * pb);
  }
  return { gametesMum: gm, gametesDad: gd, geno, pheno };
}

/** One random child: a random allele from each parent for each gene. */
export function child(genes: Gene[], mum: string[], dad: string[], r: () => number): string[] {
  return genes.map((gene, k) => normalise(gene, mum[k][r() < 0.5 ? 0 : 1] + dad[k][r() < 0.5 ? 0 : 1]));
}
export const phenoOf = (genes: Gene[], g: string[]) => genes.map((gene, k) => gene.pheno(g[k])).join(', ');

/** Smallest whole-number ratio of chances (e.g. 0.75, 0.25 -> 3, 1), using the 1/4^n grid of a cross. */
export function ratio(ps: number[]): number[] {
  const n = ps.map((p) => Math.round(p * 256));
  const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
  const g = n.reduce((a, b) => gcd(a, b));
  return n.map((x) => x / g);
}

// ---------- chi-square ----------
function lnGamma(z: number): number {
  const c = [676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
  if (z < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * z)) - lnGamma(1 - z);
  z -= 1; let x = 0.99999999999980993;
  for (let i = 0; i < 8; i++) x += c[i] / (z + i + 1);
  const t = z + 7.5;
  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x);
}
/** Regularised upper incomplete gamma Q(a, x) (series below a + 1, continued fraction above). */
function gammaQ(a: number, x: number): number {
  if (x <= 0) return 1;
  const gl = lnGamma(a);
  if (x < a + 1) {
    let sum = 1 / a, del = sum, ap = a;
    for (let n = 0; n < 500; n++) { ap++; del *= x / ap; sum += del; if (Math.abs(del) < Math.abs(sum) * 1e-15) break; }
    return 1 - sum * Math.exp(-x + a * Math.log(x) - gl);
  }
  let b = x + 1 - a, c = 1e300, d = 1 / b, h = d;
  for (let i = 1; i < 500; i++) {
    const an = -i * (i - a); b += 2;
    d = an * d + b; if (Math.abs(d) < 1e-300) d = 1e-300;
    c = b + an / c; if (Math.abs(c) < 1e-300) c = 1e-300;
    d = 1 / d; const del = d * c; h *= del; if (Math.abs(del - 1) < 1e-15) break;
  }
  return Math.exp(-x + a * Math.log(x) - gl) * h;
}
/** Chance of a chi-square this big or bigger with df degrees of freedom. */
export const chiP = (chi2: number, df: number) => gammaQ(df / 2, chi2 / 2);

/** Chi-square goodness of fit of observed counts to expected chances. */
export function chiSquare(obs: number[], ps: number[]) {
  const n = obs.reduce((s, v) => s + v, 0);
  const exp = ps.map((p) => p * n);
  const terms = obs.map((o, i) => (exp[i] > 0 ? (o - exp[i]) ** 2 / exp[i] : 0));
  const chi2 = terms.reduce((s, v) => s + v, 0), df = ps.length - 1;
  return { n, exp, terms, chi2, df, p: df > 0 ? chiP(chi2, df) : 1, small: exp.some((e) => e < 5) };
}
