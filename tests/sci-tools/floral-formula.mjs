// #1388 floral formula. The whorl reader checked on hand-written cases; the four family presets checked against
// the family formulas found in standard botany (Brassicaceae, Fabaceae, Solanaceae, Liliaceae).
import * as F from '../../src/lib/sci/school-floral.ts';
export default async (check) => {
  const w = F.readWhorl('1+2+(2)');
  check('floral: 1+2+(2) is 5 parts in 3 groups, last one joined', w.total === 5 && w.groups.length === 3 && w.groups[2].fused && !w.groups[0].fused && w.text === '1+2+(2)');
  check('floral: (3+3) is one joined group of 6 in two whorls', (() => { const r = F.readWhorl('(3+3)'); return r.total === 6 && r.groups.length === 1 && r.groups[0].sub.join() === '3,3' && r.text === '(3+3)'; })());
  check('floral: (9)+1', (() => { const r = F.readWhorl('(9)+1'); return r.total === 10 && r.text === '(9)+1'; })());
  check('floral: ∞ and inf mean many', F.readWhorl('∞').groups[0].many && F.readWhorl('inf').text === '∞');
  check('floral: 0 or empty is absent', F.readWhorl('0').total === 0 && F.readWhorl('').total === 0);
  for (const bad of ['(5', 'x', '2++3', '3+', '0+2']) { let threw = false; try { F.readWhorl(bad); } catch { threw = true; } check(`floral: "${bad}" is refused`, threw); }
  const want = {
    mustard: '⊕ ⚥ K2+2 C4 A2+4 G(2); ovary superior (line under G)',
    pea: '% ⚥ K(5) C1+2+(2) A(9)+1 G1; ovary superior (line under G)',
    potato: '⊕ ⚥ K(5) C(5) A5 G(2); ovary superior (line under G); stamens joined to the petals (an arc joins C and A)',
    lily: '⊕ ⚥ P(3+3) A3+3 G(3); ovary superior (line under G)',
  };
  for (const p of F.PRESETS) check(`floral: ${p.id} formula`, F.formula(p.f) === want[p.id]);
  const male = { ...F.PRESETS[2].f, sex: 'male' };
  check('floral: a male flower has no G', !F.formula(male).includes(' G') && F.formula(male).startsWith('⊕ ♂'));
  check('floral: description mentions syncarpous', F.describe(F.PRESETS[0].f).some((s) => s.includes('syncarpous')));
};
