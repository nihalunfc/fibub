// #202 Punnett square and pedigree probability. The square, the ratios, the branch-method chances, the binomial and
// the Bayesian carrier risks were checked against an independent brute-force Python version (it enumerates every
// equally likely way a child can inherit, with exact fractions): 300 random crosses of 1 to 5 genes (190 with
// X-linked genes, 250 with a square), 50 binomial and 50 Bayes cases: 1600 comparisons, 0 differences.
// The cases below are the classic textbook results, worked by hand.
import * as P from '../../src/lib/sci/punnett.ts';

export default async (check) => {
  const preset = (id) => structuredClone(P.PRESETS.find((p) => p.id === id).genes);
  const ratio = (r) => r.phenoRatio.join(':');

  // Dihybrid: 9:3:3:1 and 1:2:1:2:4:2:1:2:1.
  const peas = preset('peas'), rp = P.ratios(peas), sp = P.square(peas);
  check('punnett: dihybrid square is 4 × 4 with gametes AB, Ab, aB, ab', sp.mg.length === 4 && sp.fg.length === 4 && sp.mg.map((g) => P.plain(g.toks)).join() === 'AB,Ab,aB,ab');
  check('punnett: dihybrid phenotypes 9:3:3:1 in the order A_B_, A_bb, aaB_, aabb', ratio(rp) === '9:3:3:1' && rp.phenotypes[0].name === 'Yellow, Round' && P.fstr(rp.phenotypes[3].p) === '1/16');
  check('punnett: dihybrid genotypes 1:2:1:2:4:2:1:2:1, AaBb is 1/4', rp.genoRatio.join(':') === '1:2:1:2:4:2:1:2:1' && P.fstr(rp.genotypes.find((g) => P.genoText(peas, g.pairs) === 'AaBb').p) === '1/4');
  check('punnett: no validation messages for the presets', P.PRESETS.every((p) => P.validate(p.genes).length === 0));

  // Test cross, incomplete dominance, codominance, ABO.
  check('punnett: test cross Aa × aa gives 1:1', ratio(P.ratios(preset('mono'))) === '1:1');
  { const r = P.ratios(preset('flower')); check('punnett: incomplete dominance Rr × Rr: red 1/4, pink 1/2, white 1/4', ratio(r) === '1:2:1' && r.phenotypes.map((p) => `${p.name} ${P.fstr(p.p)}`).join(', ') === 'Red 1/4, Pink 1/2, White 1/4'); }
  { const g = preset('coat'), r = P.ratios(g); check('punnett: codominance C^1 C^2 genotypes and roan 1/2', P.plain(P.genoToks(g[0], [1, 0])) === 'C^1 C^2' && P.fstr(r.phenotypes[1].p) === '1/2'); }
  { const g = preset('abo'), r = P.ratios(g); check('punnett: I^A i × I^B i gives A, B, AB, O at 1/4 each', r.phenotypes.map((p) => p.name).join() === 'Type A,Type B,Type AB,Type O' && r.phenotypes.every((p) => P.fstr(p.p) === '1/4') && P.genoText(g, r.genotypes[1].pairs) === 'I^A i'); }
  { const g = [{ letter: 'I', mode: 'abo', mother: [0, 1], father: [2, 2] }]; check('punnett: I^A I^B × ii gives A and B, 1/2 each', P.ratios(g).phenotypes.map((p) => `${p.name} ${P.fstr(p.p)}`).join(', ') === 'Type A 1/2, Type B 1/2'); }

  // X-linked recessive: carrier mother × unaffected father.
  { const g = preset('xrec'), r = P.ratios(g), s = P.square(g);
    check('punnett: X-linked gametes X^H, X^h and X^H, Y', s.mg.map((x) => P.plain(x.toks)).join() === 'X^H,X^h' && s.fg.map((x) => P.plain(x.toks)).join() === 'X^H,Y');
    check('punnett: X-linked recessive: daughters all unaffected (1/2), sons half affected (1/4 of all children)', r.phenotypes.map((p) => `${p.name} ${P.fstr(p.p)}`).join(', ') === 'Female: H not affected 1/2, Male: H not affected 1/4, Male: H affected 1/4');
    check('punnett: X-linked genotypes X^H X^H, X^H X^h, X^H Y, X^h Y at 1/4', r.genotypes.map((x) => P.genoText(g, x.pairs)).join() === 'X^H X^H,X^H X^h,X^H Y,X^h Y');
    const sons = P.chance(g, { sex: 1, genes: [{ kind: 'p', idx: 1 }] });
    check('punnett: chance of an affected son is 1/2 × 1/2 = 1/4', sons.working === '1/2 (male) × 1/2 = 1/4'); }
  { const g = [{ letter: 'D', mode: 'xdom', mother: [1, 1], father: [0, P.Y] }], r = P.ratios(g); check('punnett: X-linked dominant affected father: every daughter affected, no son', r.phenotypes.map((p) => `${p.name} ${P.fstr(p.p)}`).join(', ') === 'Female: D affected 1/2, Male: D not affected 1/2'); }

  // Trihybrid and four genes.
  { const g = preset('three'), r = P.ratios(g); check('punnett: trihybrid 27:9:9:9:3:3:3:1 over 64 boxes, 27 genotypes', ratio(r) === '27:9:9:9:3:3:3:1' && r.total === 64 && r.genotypes.length === 27); }
  { const g = preset('four'), s = P.square(g), r = P.ratios(g);
    check('punnett: four genes: 16 × 16 square, 81 genotypes, 16 phenotypes, A_B_C_D_ 81/256', s.mg.length === 16 && s.fg.length === 16 && r.genotypes.length === 81 && r.phenotypes.length === 16 && P.fstr(r.phenotypes[0].p) === '81/256');
    const c = P.chance(g, { sex: 'any', genes: [{ kind: 'g', pair: [1, 1] }, { kind: 'g', pair: [0, 1] }, { kind: 'p', idx: 0 }, { kind: 'any' }] });
    check('punnett: branch method aa Bb C_ (any D) = 1/4 × 1/2 × 3/4 = 3/32', c.working === '1/4 × 1/2 × 3/4 = 3/32'); }
  // Square and branch method agree for a mixed cross with sex.
  { const g = preset('mixed'), s = P.square(g), r = P.ratios(g), cnt = new Map();
    for (const row of s.cells) for (const o of row) cnt.set(P.genoKey(o), (cnt.get(P.genoKey(o)) ?? 0) + 1);
    check('punnett: mixed cross square (4 × 4) matches the branch method', s.mg.length === 4 && s.fg.length === 4 && r.genotypes.every((x) => P.fstr(P.frac(cnt.get(x.key), 16)) === P.fstr(x.p)) && cnt.size === r.genotypes.length);
    const c = P.chance(g, { sex: 'any', genes: [{ kind: 'p', idx: 1 }, { kind: 'p', idx: 1 }] });
    check('punnett: aa with the X-linked trait, either sex: 1/2 × (1/4 × 0) + 1/2 × (1/4 × 1/2) = 1/16', P.fstr(c.p) === '1/16' && c.working.includes('for sons')); }

  // Validation.
  check('punnett: duplicate or bad letters are reported', P.validate([{ letter: 'A', mode: 'complete', mother: [0, 1], father: [0, 1] }, { letter: 'a', mode: 'complete', mother: [0, 1], father: [0, 1] }]).some((e) => e.includes('used twice')) && P.validate([{ letter: 'X', mode: 'complete', mother: [0, 1], father: [0, 1] }]).length === 1);
  check('punnett: wrong number of phenotype names is reported', P.validate([{ letter: 'A', mode: 'incomplete', mother: [0, 1], father: [0, 1], names: ['a', 'b'] }]).length === 1);

  // Chances typed in different ways.
  check('punnett: reads 1/4, 0.25, 25 %, 1 in 4', ['1/4', '0.25', '25 %', '1 in 4', '25%'].every((s) => P.bstr(P.parseChance(s)) === '1/4'));
  check('punnett: refuses 5/4, -1, abc, 1/0', ['5/4', '-1', 'abc', '1/0', ''].every((s) => P.parseChance(s) === null));

  // Binomial: 4 children, each 1/4 affected.
  { const b = P.binomialSummary(P.parseChance('1/4'), 4, 1);
    check('punnett: exactly 1 of 4 affected = 4 × 1/4 × (3/4)³ = 27/64', P.bstr(b.exactly) === '27/64');
    check('punnett: at least 1 of 4 = 1 − (3/4)⁴ = 175/256; none = 81/256', P.bstr(b.atLeast) === '175/256' && P.bstr(b.none) === '81/256' && P.bstr(b.atLeastOne) === '175/256');
    check('punnett: at most 1 = 81/256 + 108/256 = 189/256; one given order 27/256', P.bstr(b.atMost) === '189/256' && P.bstr(b.inOrder) === '27/256');
    check('punnett: the binomial adds up to 1', P.bstr(b.all.reduce(P.badd, P.ZERO)) === '1'); }
  { const b = P.binomialSummary(P.parseChance('1/2'), 3, 2); check('punnett: 2 girls of 3 children = 3/8', P.bstr(b.exactly) === '3/8'); }

  // Bayes, autosomal recessive: both partners have an affected sibling (2/3 each).
  { const r0 = P.arBayes(P.parseChance('2/3'), P.parseChance('2/3'), 0);
    check('punnett: two partners with affected siblings: child affected 2/3 × 2/3 × 1/4 = 1/9', P.bstr(r0.childAffected) === '1/9' && P.bstr(r0.both) === '4/9');
    const r1 = P.arBayes(P.parseChance('2/3'), P.parseChance('2/3'), 1);
    check('punnett: after one unaffected child: both carriers 3/8, each 5/8, next child affected 3/32', P.bstr(r1.both) === '3/8' && P.bstr(r1.carrier1) === '5/8' && P.bstr(r1.carrier2) === '5/8' && P.bstr(r1.childAffected) === '3/32');
    check('punnett: Bayes table rows (joint 1/3, 2/9, 2/9, 1/9; total 8/9)', r1.rows.map((x) => P.bstr(x.joint)).join() === '1/3,2/9,2/9,1/9' && P.bstr(r1.total) === '8/9' && P.bstr(r1.priorChildAffected) === '1/9');
    check('punnett: next child a carrier = 3/8 × 1/2 + 4/8 × 1/2 = 7/16', P.bstr(r1.childCarrier) === '7/16'); }
  { const r = P.arBayes(P.ONE, P.parseChance('1/50'), 0); check('punnett: known carrier × 1/50 (made-up) partner: child affected 1/200', P.bstr(r.childAffected) === '1/200' && P.oneIn(r.childAffected) === '1 in 200'); }
  // X-linked recessive: mother of a possible carrier; two unaffected sons.
  { const x = P.xlBayes(P.parseChance('1/2'), 2); check('punnett: X-linked: prior 1/2 and two unaffected sons gives carrier 1/5, next son affected 1/10', P.bstr(x.carrier) === '1/5' && P.bstr(x.sonAffected) === '1/10' && P.bstr(x.priorSonAffected) === '1/4'); }
};
