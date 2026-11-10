// #1412 Potentiometer. Checked by hand (k = 2 × 4 / 4.6 / 4 = 0.434783 V/m; 1.5 V balances at 3.45 m) and against
// a separate nodal analysis of the whole circuit written here (nodes J and B with A at 0 V; driver from B back to A),
// which gives the galvanometer current at any jockey position independently of the Thévenin formula.
import * as P from '../../src/lib/sci/potentiometer.ts';
import { seeded, isRight } from '../../src/lib/sci/elec-quiz.ts';
const near = (a, b, r = 1e-9) => Math.abs(a - b) <= r * Math.max(1e-15, Math.abs(b));

// Nodal analysis: unknowns VJ, VB. Branches: A–J wire R1, J–B wire R2, driver B→A (emf Ed with + at B through Rd),
// galvanometer branch J→A: Rg + cell (+ terminal towards J side, Thévenin V, R).
function nodal(s, V, Rc, l) {
  const R1 = (s.Rw * l) / s.L, R2 = s.Rw - R1, Rd = s.Rh + s.rd, Rb = s.Rg + Rc;
  // KCL at J: (VJ − 0)/R1 + (VJ − VB)/R2 + (VJ − V)/Rb = 0 ; at B: (VB − VJ)/R2 + (VB − Ed)/Rd = 0
  const a11 = 1 / R1 + 1 / R2 + 1 / Rb, a12 = -1 / R2, b1 = V / Rb, a21 = -1 / R2, a22 = 1 / R2 + 1 / Rd, b2 = s.Ed / Rd;
  const det = a11 * a22 - a12 * a21, VJ = (b1 * a22 - a12 * b2) / det;
  return (VJ - V) / Rb; // current from J through the galvanometer towards the cell: positive when the wire drop is bigger
}

export default async (check) => {
  const s = P.DEFAULT;
  check('pot: gradient', near(P.gradient(s), 0.43478260869565, 1e-12));
  check('pot: 1.5 V balances at 3.45 m', near(P.balance(s, { E: 1.5, r: 0.8 }), 3.45, 1e-12) && Math.abs(P.galvo(s, { E: 1.5, r: 0.8 }, 3.45)) < 1e-15);
  let ok = true;
  for (const l of [0.3, 1.2, 2.5, 3.45, 3.9]) for (const b of [{ E: 1.5, r: 0.8 }, { E: 1.1, r: 2 }]) if (!near(P.galvo(s, b, l), nodal(s, b.E, b.r, l), 1e-9) && Math.abs(P.galvo(s, b, l)) > 1e-15) ok = false;
  check('pot: galvanometer current matches nodal analysis', ok);
  const sh = { E: 1.478, r: 1, shunt: 5 }, thV = (1.478 * 5) / 6, thR = 5 / 6;
  check('pot: shunted cell matches nodal analysis', near(P.galvo(s, sh, 2), nodal(s, thV, thR, 2), 1e-9) && near(P.balance(s, sh), P.balance(s, { E: 1.478, r: 1 }) * 5 / 6, 1e-12));
  check('pot: internal resistance recovered', near(P.internalR(5, P.balance(s, { E: 1.478, r: 1 }), P.balance(s, sh)), 1, 1e-12));
  check('pot: emf ratio', near(P.emfRatio(P.balance(s, { E: 1.5, r: 1 }), P.balance(s, { E: 1.2, r: 3 })), 1.25, 1e-12));
  check('pot: no balance with a big rheostat', P.balance({ ...s, Rh: 4 }, { E: 1.5, r: 1 }) === null && P.galvo({ ...s, Rh: 4 }, { E: 1.5, r: 1 }, 4) < 0);
  check('pot: sign of the deflection', P.galvo(s, { E: 1.5, r: 0.8 }, 3.6) > 0 && P.galvo(s, { E: 1.5, r: 0.8 }, 3.3) < 0);
  let qok = true;
  for (let sd = 1; sd <= 40; sd++) for (const q of P.questions(seeded(sd))) { if (!(q.answer > 0) || !isRight(String(q.answer), q) || isRight(String(q.answer * 1.1), q)) qok = false; if (!q.steps.join(' ').includes(String(Number(q.answer.toPrecision(3))))) qok = false; }
  check('pot: 40 seeded question sets check out', qok);
};
