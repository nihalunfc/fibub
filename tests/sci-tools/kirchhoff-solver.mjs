// #1407 Kirchhoff solver. Checked against the closed-form node-voltage answer for two cells and three resistors
// (6 V + 2 Ω, 4 V + 4 Ω, 6 Ω: V = 4.3636 V, 0.81818, −0.090909, 0.72727 A), hand-worked series/parallel and
// ladder circuits, two cells in parallel (12 V/1 Ω and 10 V/2 Ω on 5 Ω: 2 A and 0 A), and singular cases.
import * as K from '../../src/lib/sci/kirchhoff.ts';
import { seeded, isRight } from '../../src/lib/sci/elec-quiz.ts';
const near = (a, b, r = 1e-9) => Math.abs(a - b) <= r * Math.max(1, Math.abs(b));
const cur = (s, id) => s.branches.find((b) => b.id === id).I;

export default async (check) => {
  const t = K.twoLoop(6, 2, 4, 4, 6);
  check('kirchhoff: closed form', near(t.V, 4.363636363636) && near(t.I1, 0.818181818182) && near(t.I2, -0.090909090909) && near(t.I3, 0.727272727273));
  const s = K.solve(K.PRESETS.twoloop.net);
  check('kirchhoff: two-loop preset', s.ok && near(cur(s, 'h00'), t.I1) && near(cur(s, 'v01'), t.I3) && near(cur(s, 'v02'), -t.I2) && near(cur(s, 'v00'), -t.I1));
  check('kirchhoff: equation count equals branch count', s.equations.length === 5 && s.equations.filter((e) => e.kind === 'loop').length === 2);
  check('kirchhoff: loop equation text', s.equations.some((e) => K.eqText(e) === '2 I₁ + 6 I₄ = 6') && s.equations.some((e) => K.eqText(e) === '2 I₁ + 4 I₂ = 2'));
  const sp = K.solve(K.PRESETS.series.net);
  check('kirchhoff: 9 V, 0.5 + 3 + (6 ∥ 12) Ω', sp.ok && near(cur(sp, 'h00'), 1.2) && near(cur(sp, 'v01'), 0.8) && near(cur(sp, 'v02'), 0.4));
  const pc = K.solve(K.PRESETS.parallelcells.net);
  check('kirchhoff: cells in parallel', pc.ok && near(cur(pc, 'v02'), 2) && near(cur(pc, 'v01'), 0) && near(cur(pc, 'v00'), -2));
  const la = K.solve(K.PRESETS.ladder.net);
  check('kirchhoff: ladder', la.ok && near(cur(la, 'h00'), 10 / 4.4) && near(cur(la, 'v01'), (10 / 4.4) * 0.6) && near(cur(la, 'v02'), (10 / 4.4) * 0.4));
  // Power balance: what the cells give equals what the resistors use.
  const bal = (x) => near(x.branches.filter((b) => b.kind === 'cell').reduce((a, b) => a + b.P, 0), x.branches.filter((b) => b.kind === 'resistor').reduce((a, b) => a + b.P, 0) + x.branches.filter((b) => b.kind === 'cell').reduce((a, b) => a + b.I * b.I * b.R, 0));
  check('kirchhoff: power balance', bal(s) && bal(sp) && bal(pc) && bal(la));
  // Potentials: the top rail of the two-loop circuit sits at V above the bottom.
  check('kirchhoff: potentials', near(s.potentials[1] - s.potentials[4], t.V));
  const E = (kind, R = 0, Ev = 0, plusAtB = false) => ({ kind, R, E: Ev, plusAtB });
  const short = K.solve({ v00: E('cell', 0, 6), h00: E('wire'), v01: E('wire'), h10: E('wire') });
  check('kirchhoff: shorted ideal cell is caught', !short.ok && short.error.includes('short circuit'));
  const two = K.solve({ v00: E('cell', 0, 6), v01: E('cell', 0, 4), h00: E('wire'), h10: E('wire') });
  check('kirchhoff: ideal cells in parallel are caught', !two.ok);
  const shortR = K.solve({ v00: E('cell', 0, 6), h00: E('resistor', 3), v01: E('resistor', 5), v02: E('wire'), h01: E('wire'), h10: E('wire'), h11: E('wire') });
  check('kirchhoff: resistor shorted by a wire carries nothing', shortR.ok && near(cur(shortR, 'v01'), 0) && near(cur(shortR, 'h00'), 2));
  check('kirchhoff: empty grid', !K.solve({}).ok);
  check('kirchhoff: gauss', (() => { const x = K.gauss([[2, 1, -1], [-3, -1, 2], [-2, 1, 2]], [8, -11, -3]); return near(x[0], 2) && near(x[1], 3) && near(x[2], -1); })() && K.gauss([[1, 2], [2, 4]], [1, 2]) === null);
  let ok = true;
  for (let sd = 1; sd <= 40; sd++) for (const q of K.questions(seeded(sd))) { if (!(q.answer > 0) || !isRight(String(q.answer), q) || isRight(String(q.answer * 1.1), q)) ok = false; if (!q.steps.join(' ').includes(String(Number(q.answer.toPrecision(3))))) ok = false; }
  check('kirchhoff: 40 seeded question sets check out', ok);
};
