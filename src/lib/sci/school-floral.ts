// Floral formula and floral diagram (Class 11 biology, morphology of flowering plants): read each whorl as
// written in a floral formula (5, (5), 1+2+(2), (9)+1, 3+3, (3+3), ∞), and build the formula for a flower from
// its symmetry, sex, whorls and ovary position. Plain TypeScript, no DOM.
export type Group = { n: number; fused: boolean; sub: number[]; many: boolean };   // sub: whorls inside a group, e.g. (3+3)
export type Whorl = { groups: Group[]; total: number; text: string };

/** Read one whorl. Throws a friendly Error when it cannot. */
export function readWhorl(src: string): Whorl {
  const s = src.replace(/\s+/g, '').replace(/inf(inity)?/gi, '∞');
  if (!s || s === '0') return { groups: [], total: 0, text: '0' };
  const groups: Group[] = [];
  let i = 0;
  const num = (t: string): { n: number; many: boolean } => {
    if (t === '∞') return { n: 12, many: true };
    if (!/^\d{1,2}$/.test(t) || +t < 1) throw new Error(`"${t}" is not a count: use whole numbers such as 5, brackets such as (5) for joined parts, + between groups, or ∞ for many.`);
    return { n: +t, many: false };
  };
  while (i < s.length) {
    if (s[i] === '(') {
      const j = s.indexOf(')', i);
      if (j < 0) throw new Error('A bracket is not closed.');
      const parts = s.slice(i + 1, j).split('+').map(num);
      groups.push({ n: parts.reduce((a, p) => a + p.n, 0), fused: true, sub: parts.map((p) => p.n), many: parts.some((p) => p.many) });
      i = j + 1;
    } else {
      let j = i; while (j < s.length && s[j] !== '+' && s[j] !== '(') j++;
      const p = num(s.slice(i, j)); groups.push({ n: p.n, fused: false, sub: [p.n], many: p.many }); i = j;
    }
    if (i < s.length) { if (s[i] !== '+') throw new Error('Put + between groups, as in 1+2+(2).'); i++; if (i >= s.length) throw new Error('Nothing after the last +.'); }
  }
  if (groups.length > 6) throw new Error('At most 6 groups in one whorl.');
  const total = groups.reduce((a, g) => a + g.n, 0);
  if (total > 30) throw new Error('At most 30 parts in one whorl.');
  const text = groups.map((g) => (g.fused ? `(${g.sub.map((x, k) => (g.many && x === 12 && k === 0 ? '∞' : String(x))).join('+')})` : g.many ? '∞' : String(g.n))).join('+');
  return { groups, total, text };
}

export type Flower = {
  sym: 'actino' | 'zygo'; sex: 'bi' | 'male' | 'female';
  perianth: boolean;           // true: tepals (P) instead of calyx and corolla
  K: string; C: string; P: string; A: string;
  G: number; Gfused: boolean; ovary: 'superior' | 'inferior';
  epipetalous: boolean;        // stamens joined to the petals (or tepals)
};
export const SYM = { actino: '⊕', zygo: '%' } as const;
export const SEX = { bi: '⚥', male: '♂', female: '♀' } as const;

/** The formula as plain text, e.g. "⊕ ⚥ K(5) C(5) A5 G(2), ovary superior; stamens on the petals". */
export function formula(f: Flower): string {
  const parts: string[] = [SYM[f.sym], SEX[f.sex]];
  if (f.perianth) parts.push(`P${readWhorl(f.P).text}`);
  else parts.push(`K${readWhorl(f.K).text}`, `C${readWhorl(f.C).text}`);
  if (f.sex !== 'female') parts.push(`A${readWhorl(f.A).text}`);
  if (f.sex !== 'male') parts.push(`G${f.Gfused && f.G > 1 ? `(${f.G})` : f.G}`);
  const notes: string[] = [];
  if (f.sex !== 'male') notes.push(`ovary ${f.ovary} (${f.ovary === 'superior' ? 'line under G' : 'line over G'})`);
  if (f.epipetalous && f.sex !== 'female') notes.push(`stamens joined to the ${f.perianth ? 'tepals' : 'petals'} (an arc joins ${f.perianth ? 'P' : 'C'} and A)`);
  return parts.join(' ') + (notes.length ? `; ${notes.join('; ')}` : '');
}

/** Short description in words. */
export function describe(f: Flower): string[] {
  const out: string[] = [];
  out.push(f.sym === 'actino' ? 'Actinomorphic: it can be cut into two equal halves through the centre in any direction.' : 'Zygomorphic: only one cut through the centre gives two mirror halves.');
  out.push(f.sex === 'bi' ? 'Bisexual: both stamens and carpels.' : f.sex === 'male' ? 'Male (staminate): stamens only.' : 'Female (pistillate): carpels only.');
  const w = (name: string, s: string, word: string) => { const r = readWhorl(s); if (!r.total) return `${name}: absent or reduced.`; const fused = r.groups.filter((g) => g.fused && g.n > 1); return `${name}: ${r.groups.some((g) => g.many) ? 'many' : r.total} ${word}${r.total === 1 ? '' : 's'}${fused.length ? (fused.length === r.groups.length ? ', joined' : ', some joined') : ', free'}.`; };
  if (f.perianth) out.push(w('Perianth', f.P, 'tepal'));
  else { out.push(w('Calyx', f.K, 'sepal')); out.push(w('Corolla', f.C, 'petal')); }
  if (f.sex !== 'female') out.push(w('Androecium', f.A, 'stamen') + (f.epipetalous ? ' Epipetalous: attached to the petals.' : ''));
  if (f.sex !== 'male') out.push(`Gynoecium: ${f.G} carpel${f.G > 1 ? 's' : ''}${f.G > 1 ? (f.Gfused ? ', joined (syncarpous)' : ', free (apocarpous)') : ' (monocarpellary)'}, ovary ${f.ovary}.`);
  return out;
}

export type Preset = { id: string; label: string; f: Flower; note: string };
// Family formulas are standard botany facts; the notes are fibub's own words.
export const PRESETS: Preset[] = [
  { id: 'mustard', label: 'Mustard family (Brassicaceae)', note: 'Four petals in a cross; six stamens, four long and two short.', f: { sym: 'actino', sex: 'bi', perianth: false, K: '2+2', C: '4', P: '', A: '2+4', G: 2, Gfused: true, ovary: 'superior', epipetalous: false } },
  { id: 'pea', label: 'Pea family (Fabaceae)', note: 'Butterfly-shaped: one standard, two wings and two joined keel petals; nine stamens joined and one free.', f: { sym: 'zygo', sex: 'bi', perianth: false, K: '(5)', C: '1+2+(2)', P: '', A: '(9)+1', G: 1, Gfused: false, ovary: 'superior', epipetalous: false } },
  { id: 'potato', label: 'Potato family (Solanaceae)', note: 'Petals joined into a tube with the stamens attached to it.', f: { sym: 'actino', sex: 'bi', perianth: false, K: '(5)', C: '(5)', P: '', A: '5', G: 2, Gfused: true, ovary: 'superior', epipetalous: true } },
  { id: 'lily', label: 'Lily family (Liliaceae)', note: 'A monocot: parts in threes, sepals and petals alike (tepals).', f: { sym: 'actino', sex: 'bi', perianth: true, K: '', C: '', P: '(3+3)', A: '3+3', G: 3, Gfused: true, ovary: 'superior', epipetalous: false } },
];
