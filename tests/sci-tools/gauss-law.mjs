// #1400 Gauss's law. Field formulas checked against Python (ε₀ = 8.8541878188e-12): 1 µC gives Φ = 112940.907;
// wire 2 µC/m at 0.2 m 179751.036 N/C; sheet 2 µC/m² 112940.907 N/C; 2 µC shell at 0.2 m 449377.589 N/C.
// Line counts checked with a NumPy script that steps along each ray (800 001 steps) and counts entries and exits:
// the opening layout gives 9 out and 5 in.
import * as G from '../../src/lib/sci/gauss-law.ts';
import { seeded, isRight } from '../../src/lib/sci/elec-quiz.ts';
const near = (a, b, r = 1e-9) => Math.abs(a - b) <= r * Math.abs(b) + 1e-12;

export default async (check) => {
  const cs = [{ q: 2, x: 11, y: 15 }, { q: -1, x: 16, y: 11 }, { q: 1, x: 28, y: 20 }];
  const circ = { kind: 'circle', cx: 13, cy: 13, r: 7.5 };
  const f = G.flux(cs, circ);
  check('gauss: charge inside and flux', f.qin === 1 && near(f.phi, 112940.90666076801));
  const n = G.lineCount(cs, circ);
  check('gauss: line count matches the stepping script', n.out === 9 && n.in === 5 && n.net === 4);
  let ok = true;
  for (let cx = 4; cx <= 32; cx += 3) for (let cy = 4; cy <= 24; cy += 4) for (const r of [3.5, 6.5, 9.5, 12.5]) for (const kind of ['circle', 'square']) {
    const s = { kind, cx, cy, r }, l = G.lineCount(cs, s), fl = G.flux(cs, s);
    if (l.net !== fl.qin * G.LINES_PER_UC) ok = false;
  }
  check('gauss: net lines = 4 × charge inside for 560 surfaces', ok);
  const sq = { kind: 'square', cx: 10, cy: 10, r: 2.5 };
  check('gauss: square inside test', G.isInside({ x: 12, y: 8 }, sq) && !G.isInside({ x: 13, y: 10 }, sq));
  const xs = G.rayCrossings(0, 10, 1, 0, sq);
  check('gauss: ray through a square enters then leaves', xs.length === 2 && xs[0].sign === -1 && xs[1].sign === 1 && near(xs[0].t, 7.5) && near(xs[1].t, 12.5));
  check('gauss: wire field', near(G.symmetricField('wire', 0.2, 2e-6), 179751.03572341593));
  check('gauss: sheet field does not depend on r', near(G.symmetricField('sheet', 0.05, 2e-6), 112940.90666076801) && near(G.symmetricField('sheet', 0.4, 2e-6), 112940.90666076801));
  check('gauss: shell zero inside, kQ/r² outside', G.symmetricField('shell', 0.05, 2e-6, 0.1) === 0 && near(G.symmetricField('shell', 0.2, 2e-6, 0.1), 449377.5893085398));
  let okq = true;
  for (let k = 1; k <= 60; k++) for (const q of G.questions(seeded(k))) { if (!(q.answer > 0) || !isRight(String(q.answer), q) || isRight(String(q.answer * 1.1), q)) okq = false; if (!q.steps.join(' ').includes(String(Number(q.answer.toPrecision(3))))) okq = false; }
  check('gauss: 60 seeded question sets check out', okq);
};
