// Class 11 Physics, Mechanical Properties of Fluids: live problems (original fibub questions). Ids start with c11p-fluid-.
import { pick, choose, n, steps } from './_util.js';

export default {
  'c11p-fluid-depth': {
    title: 'pressure at the bottom of a tank',
    make(r) {
      const [name, rho] = choose(r, [['water', 1000], ['sea water', 1025], ['petrol', 740], ['mercury', 13600]]), h = pick(r, 2, 30, 2) / (rho > 5000 ? 20 : 1), P = rho * 9.8 * h / 1000;
      return { rho, h, q: `<p>Find the gauge pressure at a depth of ${n(h)} m in ${name} (density ${rho} kg/m³), in kPa. (g = 9.8 m/s².)</p>`, answer: P, unit: 'kPa', tol: 0.01,
        hint: 'Gauge pressure = ρ g h.',
        solution: steps(`P = ρgh = ${rho} × 9.8 × ${n(h)}.`, `= ${n(P * 1000)} Pa = <b>${n(P)} kPa</b>. (Add 101 kPa for the total pressure.)`) };
    },
    verify: (x) => { const area = 0.01, mass = x.rho * area * x.h; return (mass * 9.8 / area) / 1000; },
  },
  'c11p-fluid-lift': {
    title: 'hydraulic lift',
    make(r) {
      const a = choose(r, [4, 5, 10, 20]), A = choose(r, [400, 500, 800, 1000]), F = pick(r, 20, 200, 20), L = F * A / a;
      return { a, A, F, q: `<p>In a hydraulic lift the small piston has an area of ${a} cm² and the large piston ${A} cm². What force on the small piston lifts a load of ${n(F * A / a)} N? Give the force on the small piston in N.</p>`, answer: F, unit: 'N', tol: 0.01,
        hint: 'Pascal’s law: the same pressure acts on both pistons, F₁/a = F₂/A.',
        solution: steps(`Pressure P = load/A = ${n(L)} / ${A} cm².`, `F = P × a = (${n(L)} / ${A}) × ${a} = <b>${n(F)} N</b>.`) };
    },
    verify: (x) => { const L = x.F * x.A / x.a; return (L / (x.A * 1e-4)) * (x.a * 1e-4); },
  },
  'c11p-fluid-continuity': {
    title: 'speed in a narrowing pipe',
    make(r) {
      const D1 = choose(r, [6, 8, 10, 12]), D2 = choose(r, [2, 3, 4, 5]), v1 = pick(r, 0.5, 3, 0.5), v2 = v1 * (D1 / D2) ** 2;
      return { D1, D2, v1, q: `<p>Water flows at ${v1} m/s in a pipe of diameter ${D1} cm which narrows to ${D2} cm. Find the speed in the narrow part, in m/s.</p>`, answer: v2, unit: 'm/s', tol: 0.01,
        hint: 'Continuity: A₁v₁ = A₂v₂, and area ∝ diameter².',
        solution: steps(`A₂/A₁ = (${D2}/${D1})² = ${n((D2 / D1) ** 2)}.`, `v₂ = v₁ × A₁/A₂ = ${v1} × ${n((D1 / D2) ** 2)} = <b>${n(v2)} m/s</b>.`) };
    },
    verify: (x) => { const Q = x.v1 * Math.PI * (x.D1 / 200) ** 2; return Q / (Math.PI * (x.D2 / 200) ** 2); },
  },
  'c11p-fluid-bernoulli': {
    title: 'pressure drop in a venturi',
    make(r) {
      const v1 = pick(r, 1, 3, 0.5), v2 = pick(r, 4, 12, 1), dP = 0.5 * 1000 * (v2 * v2 - v1 * v1) / 1000;
      return { v1, v2, q: `<p>Water at the same level flows at ${v1} m/s in the wide part of a horizontal pipe and at ${v2} m/s in the narrow part. By how much is the pressure lower in the narrow part, in kPa? (Density 1000 kg/m³.)</p>`, answer: dP, unit: 'kPa', tol: 0.01,
        hint: 'For a level pipe P + ½ρv² is constant, so P₁ − P₂ = ½ρ(v₂² − v₁²).',
        solution: steps(`P₁ − P₂ = ½ × 1000 × (${v2}² − ${v1}²).`, `= 500 × ${n(v2 * v2 - v1 * v1)} = ${n(dP * 1000)} Pa = <b>${n(dP)} kPa</b>.`) };
    },
    verify: (x) => (500 * x.v2 * x.v2 - 500 * x.v1 * x.v1) / 1000,
  },
  'c11p-fluid-stokes': {
    title: 'terminal velocity of a falling ball',
    make(r) {
      const rad = choose(r, [0.5, 1, 1.5, 2]), eta = choose(r, [0.8, 1.0, 1.4]), rho = 7800, sg = 1260, v = 2 * (rad * 1e-3) ** 2 * (rho - sg) * 9.8 / (9 * eta) * 1000;
      return { rad, eta, q: `<p>A steel ball (density 7800 kg/m³) of radius ${rad} mm falls through glycerine (density 1260 kg/m³, viscosity ${eta} Pa s). Find its terminal speed in mm/s. (g = 9.8 m/s².)</p>`, answer: v, unit: 'mm/s', tol: 0.01,
        hint: 'v = 2r²(ρ − σ)g / (9η).',
        solution: steps(`r = ${rad}×10<sup>−3</sup> m, ρ − σ = ${7800 - 1260} kg/m³.`, `v = 2 × r² × ${7800 - 1260} × 9.8 / (9 × ${eta}) = ${n(v / 1000)} m/s = <b>${n(v)} mm/s</b>.`) };
    },
    verify: (x) => { const d = 2 * x.rad * 1e-3; return d * d * (7800 - 1260) * 9.8 / (18 * x.eta) * 1000; },
  },
  'c11p-fluid-capillary': {
    title: 'capillary rise of water',
    make(r) {
      const rad = choose(r, [0.1, 0.2, 0.25, 0.5, 1]), h = 2 * 0.073 / (rad * 1e-3 * 1000 * 9.8) * 100;
      return { rad, q: `<p>A glass tube of inner radius ${rad} mm is dipped in water (surface tension 0.073 N/m, angle of contact 0°). How high does the water rise, in cm? (ρ = 1000 kg/m³, g = 9.8 m/s².)</p>`, answer: h, unit: 'cm', tol: 0.01,
        hint: 'h = 2S cosθ / (r ρ g) with r in metres.',
        solution: steps(`h = 2 × 0.073 × cos 0° / (${rad}×10<sup>−3</sup> × 1000 × 9.8).`, `= ${n(h / 100)} m = <b>${n(h)} cm</b>.`) };
    },
    verify: (x) => { const R = x.rad * 1e-3, up = 2 * Math.PI * R * 0.073, area = Math.PI * R * R; return (up / (area * 1000 * 9.8)) * 100; },
  },
};
