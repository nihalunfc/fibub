// #1408 Charged particle in fields. Checked against an independent Python calculation (proton at 1e6 m/s in
// 0.1 T: r = 0.104397 m, T = 6.55945e-7 s; 1 T: f = 15.2452 MHz; R = 0.5 m: K = 11.9735 MeV) and against a
// fourth-order Runge–Kutta integration of m dv/dt = q (E + v × B) written here, independent of the exact formulas.
import * as L from '../../src/lib/sci/lorentz-motion.ts';
import { seeded, isRight } from '../../src/lib/sci/elec-quiz.ts';
const near = (a, b, r = 1e-5) => Math.abs(a - b) <= r * Math.abs(b);

// RK4 in 3D for constant E and B.
function rk4(qm, E, B, r0, v0, t, n) {
  const f = (s) => { const [, , , vx, vy, vz] = s; return [vx, vy, vz, qm * (E[0] + vy * B[2] - vz * B[1]), qm * (E[1] + vz * B[0] - vx * B[2]), qm * (E[2] + vx * B[1] - vy * B[0])]; };
  let s = [...r0, ...v0]; const h = t / n;
  for (let i = 0; i < n; i++) {
    const k1 = f(s), k2 = f(s.map((x, j) => x + (h / 2) * k1[j])), k3 = f(s.map((x, j) => x + (h / 2) * k2[j])), k4 = f(s.map((x, j) => x + h * k3[j]));
    s = s.map((x, j) => x + (h / 6) * (k1[j] + 2 * k2[j] + 2 * k3[j] + k4[j]));
  }
  return s;
}

export default async (check) => {
  const h = L.helix('proton', 1e6, 0.1, 90);
  check('lorentz: proton circle', near(h.r, 0.104397) && near(h.T, 6.55945e-7) && near(h.f, 1.524519e6));
  check('lorentz: period does not depend on speed', near(L.helix('proton', 3e6, 0.1, 90).T, h.T, 1e-12) && near(L.helix('proton', 3e6, 0.1, 90).r, 3 * h.r, 1e-12));
  check('lorentz: helix pitch at 60°', near(L.helix('proton', 1e6, 0.1, 60).pitch, 0.5e6 * h.T, 1e-9) && near(L.helix('proton', 1e6, 0.1, 60).r, h.r * Math.sin(Math.PI / 3), 1e-9));
  check('lorentz: electron radius', near(L.helix('electron', 1e6, 0.1, 90).r, 5.68563e-5));
  // Helix against RK4: B along x, start moving in the x–y plane at 60° to B.
  const p = L.PARTICLES.proton, qm = (p.q * L.E_CHARGE) / p.m, t = 0.37 * h.T;
  const s = rk4(qm, [0, 0, 0], [0.1, 0, 0], [0, 0, 0], [0.5e6, Math.sin(Math.PI / 3) * 1e6, 0], t, 4000), at = L.helixAt('proton', 1e6, 0.1, 60, t);
  check('lorentz: helix matches RK4', Math.abs(s[0] - at[0]) < 1e-8 && Math.abs(s[1] - at[1]) < 1e-8 && Math.abs(s[2] - at[2]) < 1e-8);
  const se = rk4(-L.E_CHARGE / L.PARTICLES.electron.m, [0, 0, 0], [0.01, 0, 0], [0, 0, 0], [0, 1e6, 0], 2e-10, 4000), ae = L.helixAt('electron', 1e6, 0.01, 90, 2e-10);
  check('lorentz: electron turns the other way (RK4)', Math.abs(se[1] - ae[1]) < 1e-9 && Math.abs(se[2] - ae[2]) < 1e-9 && ae[2] > 0 && L.helixAt("proton", 1e6, 0.1, 90, 1e-8)[2] < 0);
  // Crossed fields against RK4: E along y, B along z.
  for (const [part, v0, E, B, tt] of [['proton', 2e6, 1e5, 0.1, 3e-7], ['alpha', 0.4e6, 1e5, 0.2, 5e-7], ['electron', 3e6, 1e4, 0.002, 2e-9]]) {
    const P = L.PARTICLES[part], c = L.crossed(part, v0, E, B), [x, y] = c.at(tt);
    const r = rk4((P.q * L.E_CHARGE) / P.m, [0, E, 0], [0, 0, B], [0, 0, 0], [v0, 0, 0], tt, 6000);
    const sc = Math.max(Math.abs(x), Math.abs(y));
    check(`lorentz: crossed fields match RK4 (${part})`, Math.abs(r[0] - x) < 1e-6 * sc && Math.abs(r[1] - y) < 1e-6 * sc);
  }
  const sel = L.crossed('proton', 1e6, 1e5, 0.1);
  check('lorentz: selector passes v = E/B', sel.passes && sel.vd === 1e6 && Math.abs(sel.at(1e-6)[1]) < 1e-12 && !L.crossed('proton', 2e6, 1e5, 0.1).passes);
  const cy = L.cyclotron('proton', 1, 0.5, 50e3);
  check('lorentz: cyclotron', near(cy.f, 1.524519e7) && near(cy.KEmax / L.MEV, 11.97354) && cy.crossings === 240 && cy.turns === 120 && near(cy.radii[239], 0.5, 1e-12));
  check('lorentz: cyclotron radii grow as √k', near(cy.radii[3] / cy.radii[0], 2, 1e-12));
  let ok = true;
  for (let sd = 1; sd <= 40; sd++) for (const q of L.questions(seeded(sd))) { if (!(q.answer > 0) || !isRight(String(q.answer), q) || isRight(String(q.answer * 1.1), q)) ok = false; if (!q.steps.join(' ').includes(String(Number(q.answer.toPrecision(3))))) ok = false; }
  check('lorentz: 40 seeded question sets check out', ok);
};
