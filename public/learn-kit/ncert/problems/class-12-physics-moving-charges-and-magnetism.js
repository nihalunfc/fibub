// Class 12 Physics, Moving Charges and Magnetism: live problems (original fibub questions). Ids start with c12p-mag-.
import { pick, choose, n, steps } from './_util.js';

const MU0 = 4e-7 * Math.PI, E = 1.602e-19, MP = 1.673e-27, ME = 9.109e-31;
const PART = [['proton', MP, 1], ['electron', ME, 1], ['alpha particle', 6.645e-27, 2]];

export default {
  'c12p-mag-force': {
    title: 'force on a moving charge',
    make(r) {
      const q = pick(r, 2, 20, 2), v = pick(r, 2, 50, 4), B = pick(r, 0.1, 1.5, 0.1), th = choose(r, [30, 45, 60, 90]);
      const answer = q * 1e-6 * v * 1e3 * B * Math.sin((th * Math.PI) / 180);
      return { q: `<p>A charge of ${q} µC moves at ${v} km/s in a uniform magnetic field of ${n(B)} T. Its velocity makes an angle of ${th}° with the field. Find the magnetic force on it, in newtons.</p>`, qc: q, v, B, th, answer, unit: 'N', tol: 0.01,
        hint: 'F = q v B sin θ. Convert µC to C and km/s to m/s first.',
        solution: steps(`q = ${q}×10⁻⁶ C, v = ${v}×10³ m/s.`, `F = q v B sin θ = ${q}×10⁻⁶ × ${v}×10³ × ${n(B)} × sin ${th}°.`, `F = <b>${n(answer)} N</b>.`) };
    },
    verify: (x) => x.qc * 1e-6 * (x.v * 1e3 * Math.sin((x.th * Math.PI) / 180)) * x.B,
  },
  'c12p-mag-radius': {
    title: 'radius of the circle a particle moves in',
    make(r) {
      const p = choose(r, PART), v = pick(r, 1, 9, 1), B = pick(r, 0.05, 0.5, 0.05), vel = v * 1e6;
      const answer = ((p[1] * vel) / (p[2] * E * B)) * 100;
      return { name: p[0], m: p[1], z: p[2], v, B, q: `<p>A ${p[0]} moves at ${v}×10⁶ m/s at right angles to a uniform magnetic field of ${n(B)} T. Find the radius of its circular path, in centimetres. (Mass ${n(p[1])} kg, charge ${p[2]}e with e = 1.6×10⁻¹⁹ C.)</p>`, answer, unit: 'cm', tol: 0.02,
        hint: 'The magnetic force is the centripetal force: q v B = m v²/r, so r = m v / (q B).',
        solution: steps(`q v B = m v²/r gives r = m v/(qB).`, `r = ${n(p[1])} × ${v}×10⁶ ÷ (${p[2]} × 1.6×10⁻¹⁹ × ${n(B)}) m.`, `r = <b>${n(answer)} cm</b>.`) };
    },
    verify: (x) => { const K = 0.5 * x.m * (x.v * 1e6) ** 2; return (Math.sqrt(2 * x.m * K) / (x.z * E * x.B)) * 100; },
  },
  'c12p-mag-period': {
    title: 'frequency of circulation',
    make(r) {
      const p = choose(r, PART), B = pick(r, 0.1, 2, 0.1), v = pick(r, 1, 9, 2);
      const answer = (p[2] * E * B) / (2 * Math.PI * p[1]) / 1e6;
      return { m: p[1], z: p[2], B, v, q: `<p>A ${p[0]} circles in a magnetic field of ${n(B)} T. How many times a second does it go round? Give the frequency in MHz. (Its speed does not matter. It happens to be ${v}×10⁶ m/s.)</p>`, answer, unit: 'MHz', tol: 0.02,
        hint: 'T = 2πm/(qB) does not depend on the speed, and f = 1/T.',
        solution: steps(`T = 2πm/(qB) = 2π × ${n(p[1])} ÷ (${p[2]} × 1.6×10⁻¹⁹ × ${n(B)}).`, `f = 1/T = <b>${n(answer)} MHz</b>.`) };
    },
    verify: (x) => { const r = (x.m * x.v * 1e6) / (x.z * E * x.B), T = (2 * Math.PI * r) / (x.v * 1e6); return 1 / T / 1e6; },
  },
  'c12p-mag-loop': {
    title: 'field at the centre of a coil',
    make(r) {
      const N = pick(r, 10, 200, 10), I = pick(r, 0.5, 5, 0.5), a = pick(r, 2, 20, 1), answer = (MU0 * N * I) / (2 * (a / 100)) * 1e6;
      return { N, I, a, q: `<p>A circular coil of ${N} turns and radius ${a} cm carries a current of ${I} A. Find the magnetic field at its centre, in microtesla.</p>`, answer, unit: 'µT', tol: 0.01,
        hint: 'For N turns, B = μ0 N I / 2a at the centre. Convert cm to m.',
        solution: steps(`B = μ0 N I / 2a = 4π×10⁻⁷ × ${N} × ${I} ÷ (2 × ${a / 100} m).`, `B = <b>${n(answer)} µT</b>.`) };
    },
    verify: (x) => 2 * Math.PI * 1e-7 * x.N * x.I / (x.a / 100) * 1e6,
  },
  'c12p-mag-wire': {
    title: 'field near a long straight wire',
    make(r) {
      const I = pick(r, 2, 100, 2), d = pick(r, 1, 30, 1), answer = (MU0 * I) / (2 * Math.PI * (d / 100)) * 1e6;
      return { I, d, q: `<p>A long straight wire carries ${I} A. Find the magnetic field ${d} cm from it, in microtesla.</p>`, answer, unit: 'µT', tol: 0.01,
        hint: 'Ampère’s law gives B = μ0 I / 2πr.',
        solution: steps(`B = μ0 I / 2πr = 2×10⁻⁷ × ${I} ÷ ${d / 100} m.`, `B = <b>${n(answer)} µT</b>.`) };
    },
    verify: (x) => 2e-7 * x.I / (x.d / 100) * 1e6,
  },
  'c12p-mag-solenoid': {
    title: 'field inside a long solenoid',
    make(r) {
      const N = pick(r, 200, 2000, 100), L = pick(r, 20, 100, 5), I = pick(r, 0.5, 4, 0.5), answer = (MU0 * (N / (L / 100)) * I) * 1e3;
      return { N, L, I, q: `<p>A solenoid ${L} cm long has ${N} turns of wire and carries ${I} A. Find the magnetic field well inside it, in millitesla.</p>`, answer, unit: 'mT', tol: 0.01,
        hint: 'n = N/L is the number of turns per metre; B = μ0 n I.',
        solution: steps(`n = N/L = ${N} ÷ ${L / 100} m = ${n(N / (L / 100))} turns per metre.`, `B = μ0 n I = 4π×10⁻⁷ × ${n(N / (L / 100))} × ${I} = <b>${n(answer)} mT</b>.`) };
    },
    verify: (x) => 4 * Math.PI * 1e-7 * x.N * x.I / (x.L / 100) * 1e3,
  },
  'c12p-mag-parallel': {
    title: 'force between two parallel currents',
    make(r) {
      const I1 = pick(r, 2, 50, 2), I2 = pick(r, 2, 50, 2), d = pick(r, 1, 20, 1), answer = (MU0 * I1 * I2) / (2 * Math.PI * (d / 100)) * 1e3;
      return { I1, I2, d, q: `<p>Two long parallel wires ${d} cm apart carry ${I1} A and ${I2} A in the same direction. Find the force on each metre of one of them, in millinewtons per metre.</p>`, answer, unit: 'mN/m', tol: 0.01,
        hint: 'F/L = μ0 I₁ I₂ / 2πd. Same direction means attraction.',
        solution: steps(`F/L = μ0 I₁ I₂ / 2πd = 2×10⁻⁷ × ${I1} × ${I2} ÷ ${d / 100}.`, `F/L = <b>${n(answer)} mN/m</b> (attractive).`) };
    },
    verify: (x) => { const B1 = 2e-7 * x.I1 / (x.d / 100); return B1 * x.I2 * 1 * 1e3; },
  },
  'c12p-mag-torque': {
    title: 'torque on a rectangular coil',
    make(r) {
      const N = pick(r, 10, 100, 10), I = pick(r, 0.5, 4, 0.5), a = pick(r, 4, 12, 2), b = pick(r, 3, 9, 3), B = pick(r, 0.1, 0.8, 0.1), th = choose(r, [30, 45, 60, 90]);
      const answer = N * I * (a / 100) * (b / 100) * B * Math.sin((th * Math.PI) / 180) * 1000;
      return { N, I, a, b, B, th, q: `<p>A rectangular coil of ${N} turns, ${a} cm by ${b} cm, carries ${I} A in a uniform field of ${n(B)} T. The plane of the coil is turned so that the angle between its normal and the field is ${th}°. Find the torque on it, in millinewton metres.</p>`, answer, unit: 'mN m', tol: 0.01,
        hint: 'τ = N I A B sin θ, with θ the angle between the normal (the magnetic moment) and B.',
        solution: steps(`A = ${a} cm × ${b} cm = ${n((a * b) / 1e4)} m².`, `τ = N I A B sin θ = ${N} × ${I} × ${n((a * b) / 1e4)} × ${n(B)} × sin ${th}°.`, `τ = <b>${n(answer)} mN m</b>.`) };
    },
    verify: (x) => { const F = x.N * x.I * (x.b / 100) * x.B, arm = (x.a / 100) * Math.sin((x.th * Math.PI) / 180); return F * arm * 1000; },
  },
  'c12p-mag-shunt': {
    title: 'shunt to make an ammeter',
    make(r) {
      const G = pick(r, 20, 100, 10), Ig = choose(r, [1, 2, 5, 10]), range = choose(r, [0.5, 1, 2, 5]);
      const answer = (Ig * 1e-3 * G) / (range - Ig * 1e-3);
      return { G, Ig, range, q: `<p>A galvanometer of resistance ${G} Ω gives full-scale deflection for ${Ig} mA. What shunt resistance, in ohms, turns it into an ammeter reading up to ${range} A?</p>`, answer, unit: 'Ω', tol: 0.02,
        hint: 'The shunt is in parallel with the galvanometer, so both have the same voltage: Ig G = (I − Ig) S.',
        solution: steps(`Same voltage across both: Ig G = (I − Ig) S.`, `S = Ig G / (I − Ig) = ${Ig}×10⁻³ × ${G} ÷ (${range} − ${Ig}×10⁻³).`, `S = <b>${n(answer)} Ω</b>, very small, so the ammeter has a very low resistance.`) };
    },
    verify: (x) => { const RA = (x.Ig * 1e-3 * x.G) / x.range; return (x.G * RA) / (x.G - RA); },
  },
  'c12p-mag-voltmeter': {
    title: 'series resistance to make a voltmeter',
    make(r) {
      const G = pick(r, 20, 100, 10), Ig = choose(r, [1, 2, 5]), V = choose(r, [3, 5, 10, 15, 30]);
      const answer = V / (Ig * 1e-3) - G;
      return { G, Ig, V, q: `<p>A galvanometer of resistance ${G} Ω has a full-scale current of ${Ig} mA. What resistance must be put in series with it, in ohms, to make a voltmeter reading up to ${V} V?</p>`, answer, unit: 'Ω', tol: 0.01,
        hint: 'At full scale the whole V drives Ig through G and R in series: V = Ig (G + R).',
        solution: steps(`V = Ig (G + R), so R = V/Ig − G.`, `R = ${V} ÷ ${Ig}×10⁻³ − ${G} = <b>${n(answer)} Ω</b>.`) };
    },
    verify: (x) => (x.V - x.Ig * 1e-3 * x.G) / (x.Ig * 1e-3),
  },
};
