// Live problems for Electric potential and capacitors.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';
const E0 = 8.85e-12;

export default {
  'pc-slab': {
    title: 'capacitance with a dielectric slab',
    make(r) {
      const A = pick(r, 50, 400, 50), d = pick(r, 4, 10), t = pick(r, 1, d - 1), K = pick(r, 2, 8);
      const answer = (E0 * A * 1e-4) / ((d - t + t / K) * 1e-3) * 1e12;
      return { A, d, t, K,
        q: `<p>A parallel plate capacitor has plates of area ${A} cm² placed ${d} mm apart. A slab ${t} mm thick with dielectric constant ${K} is slipped in, parallel to the plates. What is the new capacitance, in pF? (ε₀ = 8.85 × 10⁻¹² F/m)</p>`,
        answer, unit: 'pF', tol: 0.005,
        hint: 'The slab of thickness t acts like an air gap of only t/K. So C = ε₀A/(d − t + t/K).',
        solution: steps(`Effective air gap = d − t + t/K = ${d} − ${t} + ${t}/${K} = ${n(d - t + t / K, 4)} mm.`, `C = 8.85 × 10⁻¹² × ${A} × 10⁻⁴ / (${n(d - t + t / K, 4)} × 10⁻³).`, `C = <b>${n(answer)} pF</b>. (Without the slab it would be ${n((E0 * A * 1e-4) / (d * 1e-3) * 1e12)} pF.)`) };
    },
    verify: (x) => { // two capacitors in series: the air part and the slab part
      const C1 = (E0 * x.A * 1e-4) / ((x.d - x.t) * 1e-3), C2 = (x.K * E0 * x.A * 1e-4) / (x.t * 1e-3);
      return (C1 * C2) / (C1 + C2) * 1e12;
    },
  },
  'pc-sharing-loss': {
    title: 'energy lost when two capacitors share charge',
    make(r) {
      const C1 = pick(r, 1, 10), C2 = pick(r, 1, 10), V1 = pick(r, 20, 200, 10), V2 = pick(r, 0, V1 - 10, 10);
      const answer = (C1 * C2 * (V1 - V2) ** 2) / (2 * (C1 + C2));
      return { C1, C2, V1, V2,
        q: `<p>A ${C1} µF capacitor charged to ${V1} V is connected to a ${C2} µF capacitor charged to ${V2} V, positive plate to positive plate. How much energy is lost as heat and radiation, in µJ?</p>`,
        answer, unit: 'µJ', tol: 0.005,
        hint: 'Use the shortcut ΔU = C₁C₂(V₁ − V₂)²/[2(C₁ + C₂)], or find the common voltage and subtract the energies.',
        solution: steps(`Common voltage V = (C₁V₁ + C₂V₂)/(C₁ + C₂) = (${C1 * V1} + ${C2 * V2})/${C1 + C2} = ${n((C1 * V1 + C2 * V2) / (C1 + C2), 4)} V (charge is conserved).`, `ΔU = C₁C₂(V₁ − V₂)²/[2(C₁ + C₂)] = ${C1} × ${C2} × ${V1 - V2}² / (2 × ${C1 + C2}).`, `ΔU = <b>${n(answer)} µJ</b>. The loss does not depend on the resistance of the wires.`) };
    },
    verify: (x) => { const V = (x.C1 * x.V1 + x.C2 * x.V2) / (x.C1 + x.C2); return 0.5 * x.C1 * x.V1 ** 2 + 0.5 * x.C2 * x.V2 ** 2 - 0.5 * (x.C1 + x.C2) * V * V; },
  },
  'pc-rc-charge': {
    title: 'charge on a capacitor charging through a resistor',
    make(r) {
      const C = pick(r, 2, 20, 2), R = pick(r, 10, 100, 10), V = pick(r, 6, 24, 2), t = pick(r, 0.1, 3, 0.1);
      const tau = R * 1e3 * C * 1e-6, answer = C * V * (1 - Math.exp(-t / tau));
      return { C, R, V, t,
        q: `<p>An uncharged ${C} µF capacitor is connected through a ${R} kΩ resistor to a ${V} V battery. What charge is on it ${t} s later, in µC?</p>`,
        answer, unit: 'µC', tol: 0.005,
        hint: 'Time constant τ = RC. Charge grows as q = CV(1 − e^(−t/τ)).',
        solution: steps(`τ = RC = ${R} × 10³ × ${C} × 10⁻⁶ = ${n(tau)} s.`, `Final charge CV = ${C} × ${V} = ${C * V} µC.`, `q = ${C * V} × (1 − e^(−${t}/${n(tau)})) = <b>${n(answer)} µC</b>.`) };
    },
    verify: (x) => { // step dq/dt = (V − q/C)/R numerically
      const C = x.C * 1e-6, R = x.R * 1e3, dt = x.t / 20000; let q = 0;
      for (let i = 0; i < 20000; i++) { const k1 = (x.V - q / C) / R, k2 = (x.V - (q + k1 * dt) / C) / R; q += 0.5 * (k1 + k2) * dt; }
      return q * 1e6;
    },
  },
};
