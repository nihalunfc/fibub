// #926 Bloch sphere: gate sequences against SciPy expm of the Pauli matrices (NumPy), Rabi oscillations against
// the Rabi formula and SciPy solve_ivp with T1 and T2, and the Torrey steady state.
import * as B from '../../src/lib/sci/phbloch.ts';

export default async (check) => {
  const near = (a, b, t) => Math.abs(a - b) <= t;
  const vnear = (a, b, t) => a.every((x, i) => near(x, b[i], t));
  { const r = B.runGates(B.fromAngles(0.3, 0.7), B.parseGates('H; Rx(90); T; Ry(pi/4); R(60, 1, 1, 0); S†; √X')); check('bloch: seven-gate sequence matches NumPy/SciPy expm (0.94494, 0.32613, −0.02682)', vnear(B.blochOf(r.states.at(-1)), [0.9449445289440224, 0.32612973553417546, -0.026818516349112587], 1e-12)); }
  check('bloch: H takes |0⟩ to |+⟩ (x = 1)', vnear(B.blochOf(B.runGates(B.fromAngles(0, 0), B.parseGates('H')).states[1]), [1, 0, 0], 1e-14));
  check('bloch: S takes |+⟩ to |+i⟩', vnear(B.blochOf(B.runGates(B.fromAngles(Math.PI / 2, 0), B.parseGates('S')).states[1]), [0, 1, 0], 1e-14));
  check('bloch: gate path follows the Rodrigues rotation', vnear(B.runGates(B.fromAngles(1, 2), B.parseGates('R(75, 1, 2, 3)'), 10).path[0][4], B.rotateVec(B.blochOf(B.fromAngles(1, 2)), [1, 2, 3].map((x) => x / Math.sqrt(14)), (75 * Math.PI) / 180 * 0.4), 1e-12));
  { let e = ''; try { B.parseGates('H; Q'); } catch (x) { e = x.message; } check('bloch: unknown gate is refused', e.includes('"Q"')); }
  { let e = ''; try { B.parseGates('Rx(a)'); } catch (x) { e = x.message; } check('bloch: bad angle is refused', e.includes('not an angle')); }
  const W = 2 * Math.PI, D = Math.PI;
  check('bloch: Rabi formula equals SciPy solve_ivp (P1 = 0.64337554)', near(B.rabiP1(W, D, 3), 0.6433755443889211, 1e-10) && near((1 - B.blochRun(W, D, 3, Infinity, Infinity).r.at(-1)[2]) / 2, 0.6433755443889211, 1e-9));
  check('bloch: damped Bloch equations match SciPy solve_ivp (T1 = 2, T2 = 1.5)', vnear(B.blochRun(W, D, 3, 2, 1.5).r.at(-1), [0.3625983, -0.19020499, 0.09988651], 1e-7));
  check('bloch: long damped run reaches the Torrey steady state 0.41808', near((1 - B.blochRun(W, D, 60, 2, 1.5, [0, 0, 1], 40000).r.at(-1)[2]) / 2, B.steadyP1(W, D, 2, 1.5), 1e-9) && near(B.steadyP1(W, D, 2, 1.5), 0.4180799748833446, 1e-12));
  check('bloch: resonant π pulse flips |0⟩ to |1⟩', near(B.rabiP1(W, 0, 0.5), 1, 1e-15));
};
