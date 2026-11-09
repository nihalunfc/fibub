// #881 magnetic anomaly: closed-form total-field anomalies against independent NumPy/SciPy models (mag_check.py):
// sphere = point-dipole scalar potential differentiated by central differences; cylinder = point dipoles integrated
// along a ±200 km strike (quad); thin dyke = point dipoles integrated over strike and dip (nested quad); prism =
// Gauss-Legendre sums of point dipoles (24 points in each of 6 × 8 × 8 sub-cells). Field F 50000 nT, I 60°, D 10°,
// profile azimuth 30°, with remanence on three of the four bodies.
import { profile, magnetisation, koenigsberger, bodyProblem, misfit, dirVec, bodyField } from '../../src/lib/sci/magnetic.ts';

const EXP = {"sphere": [-0.9090242016063144, 6.9883687699851045, 46.1430265128666, 41.38147314204657, -1.1507556635590908, -1.1716645819421083], "cylinder": [2.4429910344665684, 38.79221761743978, 32.048039116683434, -18.6620320291034, -19.893552178798814, -5.530107959012429], "dyke": [-0.004947015588540614, 3.364028622457079, 32.387424573703704, 81.38396010200762, -13.26275335916936, -6.57607846991539], "prism": [14.256298130556496, 302.82080003625725, 753.413681784713, 24.885272740147393, -74.53680403734293, -8.927668811962759], "xs": [-300.0, -120.0, 0.0, 45.0, 200.0, 410.0]};
const near = (a, b, tol) => Math.abs(a - b) <= tol;
const allNear = (a, b, tol) => a.length === b.length && a.every((v, i) => near(v, b[i], tol));

export default async (check) => {
  const f = { F: 50000, inc: 60, dec: 10, az: 30 };
  check('magnetic: sphere matches the finite-difference dipole potential (1e-6 nT)', allNear(profile({ kind: 'sphere', s0: 20, z: 150, R: 60 }, f, { chi: 0.05, mr: 1.5, rinc: -30, rdec: 200 }, EXP.xs, 2), EXP.sphere, 1e-6));
  check('magnetic: horizontal cylinder matches dipoles integrated along strike (1e-4 nT)', allNear(profile({ kind: 'cylinder', s0: -10, z: 120, R: 40 }, f, { chi: 0.03 }, EXP.xs, 0), EXP.cylinder, 1e-4));
  check('magnetic: thin dyke matches dipoles integrated over the sheet (1e-4 nT)', allNear(profile({ kind: 'dyke', s0: 50, z: 30, thick: 4, dip: 60, extent: 300 }, f, { chi: 0.08, mr: 0.5, rinc: 70, rdec: -20 }, EXP.xs, 0), EXP.dyke, 1e-4));
  check('magnetic: prism matches Gauss-Legendre dipole sums (1e-6 nT)', allNear(profile({ kind: 'prism', s0: 0, t0: 15, width: 100, length: 160, z1: 40, z2: 140 }, f, { chi: 0.1, mr: 2, rinc: 45, rdec: 90 }, EXP.xs, 5), EXP.prism, 1e-6));
  // Physics checks.
  { const pole = { F: 50000, inc: 90, dec: 0, az: 0 }; const v = profile({ kind: 'sphere', s0: 0, z: 100, R: 20 }, pole, { chi: 0.1 }, [-500, -50, 0, 50, 500]);
    const m = (0.1 * 50000e-9 / (4e-7 * Math.PI)) * (4 / 3) * Math.PI * 8000; check('magnetic: sphere at the pole is symmetric with peak 2μ0m/(4πz³)', near(v[1], v[3], 1e-9) && near(v[2], 2e-7 * m / 1e6 * 1e9, 1e-9)); }
  { const b = { kind: 'prism', s0: 0, width: 4, length: 4, z1: 198, z2: 202 }, s = { kind: 'sphere', s0: 0, z: 200, R: Math.cbrt(64 * 3 / (4 * Math.PI)) };
    const xs = [-300, -100, 0, 120]; const a = profile(b, f, { chi: 0.1 }, xs), c = profile(s, f, { chi: 0.1 }, xs);
    check('magnetic: a small cube far away equals a dipole of the same volume (0.1 %)', a.every((v, i) => near(v, c[i], 1e-3 * Math.max(...c.map(Math.abs))))); }
  { const xs = [-200, -60, 0, 80, 240]; const big = profile({ kind: 'prism', s0: 0, width: 60, length: 2e6, z1: 50, z2: 1e6 }, f, { chi: 0.05 }, xs), dk = profile({ kind: 'dyke', s0: -30, z: 50, thick: 1, dip: 90, extent: 1e6 }, f, { chi: 0.05 }, xs);
    const thin = profile({ kind: 'prism', s0: 0, width: 1, length: 2e6, z1: 50, z2: 1e6 }, f, { chi: 0.05 }, xs), dk0 = profile({ kind: 'dyke', s0: 0, z: 50, thick: 1, dip: 90, extent: 1e6 }, f, { chi: 0.05 }, xs);
    check('magnetic: a 1 m wide, very long and deep prism equals a vertical thin dyke (0.1 %)', thin.every((v, i) => near(v, dk0[i], 1e-3 * Math.max(...dk0.map(Math.abs)) )) && big.length === 5 && dk.length === 5); }
  { const c = profile({ kind: 'cylinder', s0: 0, z: 100, R: 10 }, { F: 50000, inc: 90, dec: 0, az: 0 }, { chi: 0.1 }, [0]); const mL = (0.1 * 50000e-9 / (4e-7 * Math.PI)) * Math.PI * 100; check('magnetic: cylinder at the pole peaks at μ0m′/(2πz²)', near(c[0], 2e-7 * mL / 1e4 * 1e9, 1e-9)); }
  check('magnetic: induced magnetisation χF/μ0 and Koenigsberger ratio', near(Math.hypot(...magnetisation(f, { chi: 0.05 })), 0.05 * 5e-5 / (4e-7 * Math.PI), 1e-12) && near(koenigsberger(f, { chi: 0.05, mr: 2 }), 2 / (0.05 * 5e-5 / (4e-7 * Math.PI)), 1e-12));
  check('magnetic: field direction unit vector', near(Math.hypot(...dirVec(37, 120, 15)), 1, 1e-15) && near(dirVec(0, 30, 30)[0], 1, 1e-15) && near(dirVec(90, 0, 0)[2], 1, 1e-15));
  check('magnetic: zero susceptibility and no remanence gives no field', profile({ kind: 'sphere', s0: 0, z: 50, R: 10 }, f, { chi: 0 }, [0, 10]).every((v) => v === 0));
  check('magnetic: body checks', bodyProblem({ kind: 'sphere', s0: 0, z: 10, R: 20 }).includes('deeper') && bodyProblem({ kind: 'prism', s0: 0, width: 1, length: 1, z1: 5, z2: 4 }).includes('bottom') && bodyProblem({ kind: 'dyke', s0: 0, z: 5, thick: 1, dip: 0, extent: 10 }).includes('Dip') && bodyProblem({ kind: 'cylinder', s0: 0, z: 50, R: 5 }) === '');
  { const r = misfit([1, 2, 3], [0, 1, 2]); check('magnetic: RMS misfit and level shift', r.rms === 1 && r.shift === 1 && r.rmsShifted === 0); }
  check('magnetic: prism field finite on a face plane and at a corner line', bodyField({ kind: 'prism', s0: 0, width: 10, length: 10, z1: 5, z2: 15 }, [1, 0, 1], [5, 0, 0]).every(Number.isFinite) && bodyField({ kind: 'prism', s0: 0, width: 10, length: 10, z1: 5, z2: 15 }, [1, 1, 1], [5, 5, 0]).every(Number.isFinite));
};
