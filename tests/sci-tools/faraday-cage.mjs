// #1404 Faraday cage. Checked against a NumPy script for a conducting cylinder (a = 7.5 cm) in E0 = 5000 V/m:
// at r = 10 cm above the centre |E| = 2187.5 V/m, 10 cm to the left 7812.5 V/m; the field equals −grad φ with
// φ = −E0 (r − a²/r) cos θ; φ is the same all round the surface; the field there is radial (at right angles).
import * as F from '../../src/lib/sci/faraday-cage.ts';
import { n3 } from '../../src/lib/sci/em-p34.ts';
import { seeded, isRight } from '../../src/lib/sci/elec-quiz.ts';
const near = (a, b, r = 1e-9) => Math.abs(a - b) <= r * Math.abs(b) + 1e-9;

export default async (check) => {
  const at = (x, y, al = 0) => Math.hypot(...F.outsideField(5000, al, 7.5, x, y, true));
  check('cage: zero inside the hollow and the metal', at(18, 14) === 0 && at(21, 16) === 0 && at(18, 21) === 0);
  check('cage: field above and beside the tube', near(at(18, 24), 2187.5) && near(at(8, 14), 7812.5));
  const phi = (x, y, al) => { const dx = (x - 18), dy = (y - 14), r = Math.hypot(dx, dy), t = Math.atan2(dy, dx) - (al * Math.PI) / 180; return -5000 * ((r - 56.25 / r) / 100) * Math.cos(t); };
  let ok = true;
  for (const al of [0, 30, 75]) for (const [x, y] of [[3, 3], [30, 20], [18, 25], [26, 9]]) {
    const h = 1e-4, gx = -(phi(x + h, y, al) - phi(x - h, y, al)) / (2 * h / 100), gy = -(phi(x, y + h, al) - phi(x, y - h, al)) / (2 * h / 100), [ex, ey] = F.outsideField(5000, al, 7.5, x, y, true);
    if (!near(ex, gx, 1e-5) || !near(ey, gy, 1e-5)) ok = false;
  }
  check('cage: field = −grad φ', ok);
  let rad = true;
  for (let k = 0; k < 36; k++) { const a = (k / 36) * 2 * Math.PI, x = 18 + 7.5001 * Math.cos(a), y = 14 + 7.5001 * Math.sin(a), [ex, ey] = F.outsideField(5000, 20, 7.5, x, y, true); if (Math.abs(ex * Math.sin(a) - ey * Math.cos(a)) > 1) rad = false; if (Math.abs(phi(18 + 7.5 * Math.cos(a), 14 + 7.5 * Math.sin(a), 20)) > 1e-9) rad = false; }
  check('cage: surface is an equipotential, field at right angles to it', rad);
  check('cage: surface charge 2ε₀E₀ cos', near(F.sigmaAt(5000, 0, 0), 2 * 8.8541878188e-12 * 5000) && near(F.sigmaAt(5000, 30, 120), 0, 1) && F.sigmaAt(5000, 0, 180) < 0);
  check('cage: without the tube the field is uniform', near(Math.hypot(...F.outsideField(5000, 40, 7.5, 18, 14, false)), 5000));
  const lam = 2e-9, E10 = Math.hypot(...F.insideField(lam, 6, 7.5, false, 18, 24));
  check('cage: charge inside, field outside as without the tube', near(E10, 359.5020714468319, 1e-9) && F.insideField(lam, 6, 7.5, false, 18, 20.8)[1] === 0 && F.insideField(lam, 6, 7.5, true, 18, 24)[1] === 0);
  const f = (x, y) => F.outsideField(5000, 0, 7.5, x, y, true), line = F.trace(f, 0, 30.5, 1, 60, 60, 0.25, 2000), hit = F.trace(f, -0.5, 20, 1, 36, 28), [hx, hy] = hit[hit.length - 1];
  const [lx, ly] = line[line.length - 1];
  check('cage: a field line more than 2a off the axis passes the tube (field lines are ψ = E0(r + a²/r) sin θ)', line.length > 50 && lx > 60 && ly > 29);
  check('cage: a field line aimed at the tube ends on its surface', Math.abs(Math.hypot(hx - 18, hy - 14) - 7.5) < 0.3 && hx < 18);
  let okq = true;
  for (let k = 1; k <= 60; k++) for (const q of F.questions(seeded(k))) { if (!(q.answer > 0) || !isRight(String(q.answer), q) || isRight(String(q.answer * 1.1), q)) okq = false; if (!q.steps.join(' ').includes(n3(q.answer))) okq = false; }
  check('cage: 60 seeded question sets check out', okq);
};
