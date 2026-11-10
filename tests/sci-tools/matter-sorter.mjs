// #1220 matter sorter: the bins are worked out from the particles; checked against a hand-made answer list and by
// reading every formula string back into atom counts.
import { THINGS, SPECIES, ATOM_COLOUR, kindOf, binOf, dealSet, questions, why } from '../../src/lib/sci/j3-matter.ts';
export default async (check) => {
  const hand = { element: 'oxygen nitrogen helium iron copper gold aluminium diamond sulphur', compound: 'water salt sugar co2 soda marble rust ammonia methane fes', mixture: 'air seawater tapwater sugarwater soda-water brass steel muddy oilwater sand-iron iron-sulphur salt-sand alcohol-water' };
  const want = {}; for (const [k, v] of Object.entries(hand)) for (const id of v.split(' ')) want[id] = k;
  check('matter-sorter: every thing is in the hand-made answer list and agrees', THINGS.length === Object.keys(want).length && THINGS.every((t) => want[t.id] === kindOf(t)));
  check('matter-sorter: ids are unique', new Set(THINGS.map((t) => t.id)).size === THINGS.length);
  const homo = 'air seawater tapwater sugarwater soda-water brass steel alcohol-water'.split(' ');
  check('matter-sorter: homogeneous vs heterogeneous mixtures', THINGS.filter((t) => kindOf(t) === 'mixture').every((t) => binOf(t, true) === (homo.includes(t.id) ? 'mix-same' : 'mix-diff')));
  // read the formula strings back: subscripts and brackets-free formulas like C₂H₅OH
  const sub = { '₀': 0, '₁': 1, '₂': 2, '₃': 3, '₄': 4, '₅': 5, '₆': 6, '₇': 7, '₈': 8, '₉': 9 };
  const read = (f) => { const out = {}; for (const m of f.matchAll(/([A-Z][a-z]?)([₀-₉]*)/g)) { const n = m[2] ? Number([...m[2]].map((c) => sub[c]).join('')) : 1; out[m[1]] = (out[m[1]] || 0) + n; } return out; };
  const same = (a, b) => Object.keys(a).length === Object.keys(b).length && Object.keys(a).every((k) => a[k] === b[k]);
  check('matter-sorter: every formula string matches its atom counts', Object.values(SPECIES).every((s) => same(read(s.formula), s.atoms)));
  check('matter-sorter: every atom drawn has a colour and belongs to its particle', Object.values(SPECIES).every((s) => s.pic.every((a) => ATOM_COLOUR[a] && s.atoms[a])));
  check('matter-sorter: every part is a known particle and mixture shares add to about 1', THINGS.every((t) => t.parts.every((p) => SPECIES[p.s]) && Math.abs(t.parts.reduce((a, p) => a + p.share, 0) - 1) < 0.002));
  check('matter-sorter: mixtures say same/not same; pure things do not', THINGS.every((t) => (kindOf(t) === 'mixture') === (typeof t.same === 'boolean')));
  check('matter-sorter: explanations name the right kind', THINGS.every((t) => why(t, false).includes(`is ${kindOf(t) === 'element' ? 'an element' : kindOf(t) === 'compound' ? 'a compound' : 'a mixture'}`)));
  let seed = 3; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647); let ok = true;
  for (let i = 0; i < 200; i++) {
    const s = dealSet(9, rnd, false), s2 = dealSet(9, rnd, true);
    if (s.length !== 9 || new Set(s.map((t) => t.id)).size !== 9 || !['element', 'compound', 'mixture'].every((k) => s.some((t) => kindOf(t) === k))) ok = false;
    if (!['mix-same', 'mix-diff'].every((k) => s2.some((t) => binOf(t, true) === k))) ok = false;
    for (const x of questions(i % 2 === 0, rnd)) if (!(Number.isFinite(x.ans) && (x.choices ? x.ans >= 0 && x.ans < x.choices.length : x.ans > 0))) ok = false;
  }
  check('matter-sorter: sets of 9 have every kind, no repeats; questions valid', ok);
};
