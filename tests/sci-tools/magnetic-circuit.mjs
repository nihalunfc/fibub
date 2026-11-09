// #914 magnetic circuit solver: checked against an exact SymPy (rational arithmetic) solution of the same
// circuits, and against Ampère's law (MMF drops add up to NI) and flux conservation at the junction.
import * as M from '../../src/lib/sci/ph-magcircuit.ts';

export default async (check) => {
  const rel = (a, b, t = 1e-12) => Math.abs(a - b) <= t * Math.abs(b);
  const one = M.parseLeg('core 300 400 2000\ngap 1 400');
  check('magcircuit: parse a leg', Array.isArray(one) && one.length === 2 && one[1].kind === 'gap' && one[1].mr === 1 && rel(one[0].area, 4e-4));
  const s = M.solve(one, [], 500, 2);
  check('magcircuit: single loop reluctance (SymPy)', rel(s.Rtot, 2287852.30724807, 1e-13));
  check('magcircuit: single loop flux and B = 1.0927 T (SymPy)', rel(s.phi, 0.000437091151746087, 1e-13) && rel(s.legs[0].segs[1].B, 1.09272787936522, 1e-13));
  check('magcircuit: inductance N²/R = 109.3 mH (SymPy)', rel(s.L, 0.109272787936522, 1e-13) && rel(s.energy, 0.5 * 0.109272787936522 * 4, 1e-13));
  check("magcircuit: MMF drops add up to NI (Ampère's law)", rel(s.legs[0].segs.reduce((t, x) => t + x.mmf, 0), 1000, 1e-12));
  check('magcircuit: H in the gap is μr times H in the core', rel(s.legs[0].segs[1].H / s.legs[0].segs[0].H, 2000, 1e-12));
  { const f = M.solve(one, [], 500, 2, true);
    check('magcircuit: fringing area (√A + g)² (SymPy)', rel(f.Rtot, 2102893.33140824, 1e-13) && rel(f.legs[0].segs[1].B, 1.07831132577067, 1e-13)); }
  const c = M.parseLeg('core 100 800 3000\ngap 0.5 800'), A = M.parseLeg('core 250 400 3000'), B = M.parseLeg('core 250 400 3000\ngap 0.2 400');
  const t = M.solve(c, [A, B], 200, 1.5);
  check('magcircuit: three-leg core total reluctance (SymPy)', rel(t.Rtot, 658624.149056262, 1e-13));
  check('magcircuit: three-leg fluxes split by reluctance (SymPy)', rel(t.phi, 0.000455494989714343, 1e-13) && rel(t.legs[1].phi, 0.000351973401142902, 1e-13) && rel(t.legs[2].phi, 0.000103521588571442, 1e-13));
  check('magcircuit: flux conservation at the junction', rel(t.legs[1].phi + t.legs[2].phi, t.phi, 1e-14));
  check('magcircuit: three-leg inductance (SymPy)', rel(t.L, 0.0607326652952458, 1e-13));
  check("magcircuit: Ampère's law round each loop", rel(t.legs[0].R * t.phi + t.legs[1].R * t.legs[1].phi, 300, 1e-12) && rel(t.legs[1].R * t.legs[1].phi, t.legs[2].R * t.legs[2].phi, 1e-12));
  check('magcircuit: ampere-turns for 1 T in the gap', rel(M.ampereTurnsFor(one, [], 0, 1, 1), 1000 / 1.09272787936522, 1e-12));
  check('magcircuit: gap force B²A/2μ0 (1 T on 1 cm² ≈ 39.8 N)', rel(M.gapForce(1, 1e-4), 1e-4 / (2 * 1.25663706127e-6), 1e-15) && Math.abs(M.gapForce(1, 1e-4) - 39.79) < 0.01);
  check('magcircuit: bad lines are reported', M.parseLeg('core 100 400') === 'line 1: give core length (mm), area (mm²) and μr, all above 0' && M.parseLeg('iron 1 2 3').startsWith('line 1: start with'));
};
