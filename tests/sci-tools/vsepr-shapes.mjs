// #1101 VSEPR shape viewer. Shapes, lone pairs and hybridisation checked against the standard VSEPR table found in
// every general chemistry text (AX2 to AX6 with up to 3 lone pairs) for 18 molecules and ions; ideal angles checked
// against geometry (the tetrahedral angle is arccos(-1/3) = 109.47°).
import { shapeOf, countPairs, EXAMPLES, isSymmetric, angleDeg, pickQuiz,QUIZ, formulaText } from '../../src/lib/sci/vsepr.ts';

export default async (check) => {
  const want = {
    becl2: ['linear', 'sp', 0], co2: ['linear', 'sp', 0], bf3: ['trigonal planar', 'sp²', 0], so2: ['bent (V-shaped)', 'sp²', 1],
    ch4: ['tetrahedral', 'sp³', 0], nh4: ['tetrahedral', 'sp³', 0], nh3: ['trigonal pyramidal', 'sp³', 1], h2o: ['bent (V-shaped)', 'sp³', 2],
    pcl5: ['trigonal bipyramidal', 'sp³d', 0], sf4: ['see-saw', 'sp³d', 1], clf3: ['T-shaped', 'sp³d', 2], xef2: ['linear', 'sp³d', 3],
    sf6: ['octahedral', 'sp³d²', 0], brf5: ['square pyramidal', 'sp³d²', 1], xef4: ['square planar', 'sp³d²', 2],
    so4: ['tetrahedral', 'sp³', 0], co3: ['trigonal planar', 'sp²', 0], i3: ['linear', 'sp³d', 3],
  };
  let ok = 0;
  for (const e of EXAMPLES) {
    const c = countPairs(e.central, e.outer, e.charge); const s = shapeOf(c.bonds, c.lone); const w = want[e.id];
    if (s.shape === w[0] && s.hybrid === w[1] && s.lone === w[2]) ok++; else console.log('  vsepr mismatch', e.id, s.shape, s.hybrid, s.lone);
  }
  check(`vsepr: all ${EXAMPLES.length} examples give the textbook shape`, ok === EXAMPLES.length && EXAMPLES.length === 18);
  const t = shapeOf(4, 0);
  check('vsepr: tetrahedral angle 109.47°', Math.abs(angleDeg(t.positions[0], t.positions[1]) - 109.4712) < 1e-3 && t.ideal === '109.5°');
  check('vsepr: TBP angles 90, 120, 180', shapeOf(5, 0).angles.join() === '90,120,180');
  check('vsepr: octahedral angles 90 and 180', shapeOf(6, 0).angles.join() === '90,180');
  check('vsepr: NH3 below 109.5', shapeOf(3, 1).ideal === 'less than 109.5°');
  check('vsepr: square planar lone pairs opposite', (() => { const s = shapeOf(4, 2); return Math.abs(angleDeg(s.positions[4], s.positions[5]) - 180) < 1e-9; })());
  check('vsepr: see-saw lone pair equatorial', (() => { const s = shapeOf(4, 1); return Math.abs(s.positions[4][2]) < 1e-9; })());
  check('vsepr: T-shaped bonds at 90 and 180', shapeOf(3, 2).angles.join() === '90,180');
  check('vsepr: symmetric shapes (non-polar if outer atoms alike)', isSymmetric(shapeOf(4, 0)) && isSymmetric(shapeOf(2, 3)) && isSymmetric(shapeOf(4, 2)) && !isSymmetric(shapeOf(3, 1)) && !isSymmetric(shapeOf(4, 1)) && !isSymmetric(shapeOf(2, 1)));
  const no2 = countPairs('N', [{ el: 'O', n: 2 }], 0);
  check('vsepr: NO2 odd electron counted as a domain', no2.odd && no2.lone === 1 && shapeOf(no2.bonds, no2.lone).shape === 'bent (V-shaped)');
  check('vsepr: errors', typeof shapeOf(5, 2) === 'string' && typeof shapeOf(0, 1) === 'string' && typeof countPairs('B', [{ el: 'F', n: 5 }], 0) === 'string' && typeof countPairs('Zz', [{ el: 'F', n: 2 }], 0) === 'string');
  check('vsepr: formula text', formulaText('S', [{ el: 'O', n: 4 }], -2) === 'SO₄²⁻' && formulaText('N', [{ el: 'H', n: 4 }], 1) === 'NH₄⁺' && formulaText('I', [{ el: 'I', n: 2 }], -1) === 'I₃⁻' && formulaText('O', [{ el: 'H', n: 3 }], 1) === 'H₃O⁺' && formulaText('N', [{ el: 'H', n: 2 }], -1) === 'NH₂⁻');
  const qs = { 'NO₃⁻': 'trigonal planar', 'O₃': 'bent (V-shaped)', 'BF₄⁻': 'tetrahedral', 'PO₄³⁻': 'tetrahedral', 'H₃O⁺': 'trigonal pyramidal', 'ClO₃⁻': 'trigonal pyramidal', 'SO₃²⁻': 'trigonal pyramidal', 'NH₂⁻': 'bent (V-shaped)', 'ICl₂⁻': 'linear', 'PF₆⁻': 'octahedral', 'SiF₆²⁻': 'octahedral', 'ICl₄⁻': 'square planar', 'XeO₃': 'trigonal pyramidal', 'XeOF₄': 'square pyramidal', 'IF₅': 'square pyramidal', 'TeCl₄': undefined };
  let qok = 0, qn = 0; for (const m of QUIZ) { const c = countPairs(m.central, m.outer, m.charge); const s = typeof c === 'string' ? c : shapeOf(c.bonds, c.lone); if (typeof s !== 'string' && !c.odd) qok++; if (qs[m.name]) { qn++; if (s.shape !== qs[m.name]) console.log('  quiz mismatch', m.name, s.shape); else qn += 100; } }
  check(`vsepr: all ${QUIZ.length} practice species valid and 15 checked by hand`, qok === QUIZ.length && qn === 15 * 101);
  let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const p = pickQuiz(4, rnd); check('vsepr: 4 different quiz picks', p.length === 4 && new Set(p.map((x) => x.name)).size === 4);
  const c = countPairs('Xe', [{ el: 'F', n: 4 }], 0);
  check('vsepr: XeF4 steps', c.steps.join(' ').includes('8 valence') && c.steps.join(' ').includes('4 left over = 2 lone pairs'));
};
