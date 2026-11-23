// Class 11 Physics, Mechanical Properties of Solids: live problems (original fibub questions). Ids start with c11p-solid-.
import { pick, choose, n, steps } from './_util.js';

const MAT = [['steel', 200], ['copper', 110], ['brass', 90], ['aluminium', 70]];
const sci = (v, d = 3) => { const e = Math.floor(Math.log10(Math.abs(v))), m = v / 10 ** e; return `${(+m.toPrecision(d)).toString()} × 10<sup>${e < 0 ? '−' + -e : e}</sup>`; };

export default {
  'c11p-solid-young': {
    title: 'extension of a loaded wire',
    make(r) {
      const [name, Y] = choose(r, MAT), M = pick(r, 10, 100, 5), L = pick(r, 1, 4, 0.5), d = pick(r, 0.5, 2, 0.1), g = 9.8;
      const F = M * g, A = Math.PI * (d / 2000) ** 2, dL = F * L / (A * Y * 1e9) * 1000;
      return { Y, M, L, d, q: `<p>A ${name} wire (Young’s modulus ${Y} GPa) of length ${L} m and diameter ${d} mm carries a hanging load of ${M} kg. Find its extension in mm. (g = 9.8 m/s².)</p>`, answer: dL, unit: 'mm', tol: 0.01,
        hint: 'Area A = πd²/4 with d in metres. Then ΔL = F L / (A Y).',
        solution: steps(`F = ${M} × 9.8 = ${n(F)} N; A = π(${d}×10<sup>−3</sup>)²/4 = ${sci(A)} m².`, `Stress = F/A = ${sci(F / A)} Pa; strain = stress/Y = ${sci(F / A / (Y * 1e9))}.`, `ΔL = strain × L = <b>${n(dL)} mm</b>.`) };
    },
    verify: (x) => { const r = x.d / 2000, stress = x.M * 9.8 / (Math.PI * r * r), strain = stress / (x.Y * 1e9); return strain * x.L * 1000; },
  },
  'c11p-solid-energy': {
    title: 'energy stored in a stretched wire',
    make(r) {
      const Y = choose(r, [200, 110, 70]), L = pick(r, 1, 3, 0.5), d = pick(r, 0.6, 2, 0.2), M = pick(r, 10, 60, 5), F = M * 9.8, A = Math.PI * (d / 2000) ** 2, dL = F * L / (A * Y * 1e9), U = 0.5 * F * dL;
      return { Y, L, d, M, q: `<p>A wire (Y = ${Y} GPa, length ${L} m, diameter ${d} mm) is stretched by a load of ${M} kg. How much elastic potential energy is stored in it, in millijoules? (g = 9.8 m/s².)</p>`, answer: U * 1000, unit: 'mJ', tol: 0.01,
        hint: 'Energy = ½ F ΔL, where ΔL = FL/(AY).',
        solution: steps(`F = ${n(F)} N, ΔL = FL/(AY) = ${sci(dL)} m.`, `U = ½ F ΔL = ½ × ${n(F)} × ${sci(dL)} = <b>${n(U * 1000)} mJ</b>.`) };
    },
    verify: (x) => { const A = Math.PI * (x.d / 2000) ** 2, strain = x.M * 9.8 / A / (x.Y * 1e9); return 0.5 * (x.Y * 1e9) * strain * strain * (A * x.L) * 1000; },
  },
  'c11p-solid-shear': {
    title: 'shear of a rubber block',
    make(r) {
      const G = choose(r, [0.3, 0.5, 0.8, 1.2]), F = pick(r, 20, 100, 10), a = choose(r, [4, 5, 8, 10]), h = choose(r, [2, 3, 4, 5]), dx = F * (h / 100) / ((a / 100) ** 2 * G * 1e6) * 1000;
      return { G, F, a, h, q: `<p>A square rubber pad of side ${a} cm and thickness ${h} cm (shear modulus ${G} MPa) has its bottom face fixed. A sideways force of ${F} N acts along the top face. By how many mm does the top face slide?</p>`, answer: dx, unit: 'mm', tol: 0.01,
        hint: 'Shear stress = F/A with A = side². Shear strain = Δx/h = stress/G.',
        solution: steps(`A = (${a}×10<sup>−2</sup>)² = ${sci((a / 100) ** 2)} m²; stress = ${n(F)} / A = ${n(F / (a / 100) ** 2)} Pa.`, `Strain = stress/G = ${sci(F / (a / 100) ** 2 / (G * 1e6))}.`, `Δx = strain × h = <b>${n(dx)} mm</b>.`) };
    },
    verify: (x) => { const strain = (x.F / ((x.a / 100) ** 2)) / (x.G * 1e6); return strain * (x.h * 10); }, // shear strain = Δx/h (h in cm, Δx in mm)
  },
  'c11p-solid-bulk': {
    title: 'compressing water',
    make(r) {
      const P = pick(r, 10, 100, 10), B = 2.2, frac = P / (B * 1000) * 100;
      return { P, q: `<p>The bulk modulus of water is 2.2 GPa. By what percentage does its volume decrease when the pressure on it is raised by ${P} MPa (about ${P * 10} atmospheres, the pressure at a depth of ${P * 100} m in the sea)?</p>`, answer: frac, unit: '%', tol: 0.01,
        hint: 'B = −ΔP/(ΔV/V), so |ΔV/V| = ΔP/B. Convert both to the same unit.',
        solution: steps(`ΔP = ${P} MPa = ${P / 1000} GPa.`, `|ΔV/V| = ΔP/B = ${P / 1000} / 2.2 = ${n(frac / 100)}.`, `That is <b>${n(frac)} %</b>: water is nearly incompressible.`) };
    },
    verify: (x) => (x.P * 1e6 / 2.2e9) * 100,
  },
  'c11p-solid-rope': {
    title: 'safe load on a cable',
    make(r) {
      const d = pick(r, 2, 8, 1), k = choose(r, [3, 5, 6, 7]), nn = choose(r, [1, 7, 19]), Fb = nn * 500e6 * Math.PI * (d / 2000) ** 2, m = Fb / 9.8 / k;
      return { d, k, nn, q: `<p>A cable has ${nn} steel strand${nn > 1 ? 's' : ''}, each ${d} mm in diameter. Steel of this kind breaks at a stress of 500 MPa. Engineers keep a safety factor of ${k}, so the working load is the breaking load divided by ${k}. What mass can the cable carry safely, in kg? (g = 9.8 m/s².)</p>`, answer: m, unit: 'kg', tol: 0.01,
        hint: 'Breaking force = stress × total area. Divide by the safety factor, then by g.',
        solution: steps(`Total area = ${nn} × π(${d}×10<sup>−3</sup>)²/4 = ${sci(nn * Math.PI * (d / 2000) ** 2)} m².`, `Breaking force = 500×10⁶ × area = ${n(Fb)} N; safe force = ${n(Fb / k)} N.`, `Mass = force/g = <b>${n(m)} kg</b>.`) };
    },
    verify: (x) => (500e6 * (x.nn * (x.d * 1e-3) ** 2 * Math.PI / 4)) / x.k / 9.8,
  },
};
