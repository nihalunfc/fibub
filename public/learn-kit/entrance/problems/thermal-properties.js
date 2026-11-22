// Live problems for Heat, expansion, calorimetry and heat transfer.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';
const C = 4200, LF = 336000; // J/kg K and J/kg, as exams usually round them

export default {
  'tp-ice-water': {
    title: 'final temperature when ice is dropped into warm water',
    make(r) {
      const mw = pick(r, 200, 600, 50), Tw = pick(r, 40, 90, 5), mi = pick(r, 20, 80, 10);
      const answer = (mw * C * Tw - mi * LF) / ((mw + mi) * C);
      return { mw, Tw, mi,
        q: `<p>${mi} g of ice at 0 °C is dropped into ${mw} g of water at ${Tw} °C in an insulated flask of negligible heat capacity. What is the final temperature? (c = 4200 J/kg K, latent heat of fusion = 336 000 J/kg)</p>`,
        answer, unit: '°C', tol: 0.01, abs: 0.1,
        hint: 'First check that the water has enough heat to melt all the ice. Then heat lost by the warm water = heat to melt the ice + heat to warm the melted ice from 0 °C.',
        solution: steps(`Heat to melt the ice: ${mi / 1000} × 336 000 = ${n(mi / 1000 * LF, 4)} J. Heat the water could give by cooling to 0 °C: ${mw / 1000} × 4200 × ${Tw} = ${n(mw / 1000 * C * Tw, 4)} J, which is more, so all the ice melts.`, `${mw / 1000} × 4200 × (${Tw} − T) = ${n(mi / 1000 * LF, 4)} + ${mi / 1000} × 4200 × T.`, `T = (${n(mw * C * Tw / 1000, 4)} − ${n(mi * LF / 1000, 4)}) / (${(mw + mi) / 1000} × 4200) = <b>${n(answer)} °C</b>.`) };
    },
    verify: (x) => { // melt the ice first with the water's heat, then mix two waters by weighted average
      const left = x.mw * C * x.Tw - x.mi * LF, Tw2 = left / (x.mw * C); return (x.mw * Tw2 + x.mi * 0) / (x.mw + x.mi);
    },
  },
  'tp-junction': {
    title: 'temperature of the joint between two rods in series',
    make(r) {
      const k1 = [400, 200, 50][Math.floor(r() * 3)], k2 = [400, 200, 50, 100].filter((k) => k !== k1)[Math.floor(r() * 3)];
      const L1 = pick(r, 10, 40, 5), L2 = pick(r, 10, 40, 5), Th = pick(r, 80, 200, 10), Tc = pick(r, 0, 30, 10);
      const R1 = L1 / k1, R2 = L2 / k2, answer = Tc + ((Th - Tc) * R2) / (R1 + R2);
      return { k1, k2, L1, L2, Th, Tc,
        q: `<p>Two rods of the same cross-section are joined end to end and insulated along their sides. Rod A (k = ${k1} W/m K, ${L1} cm long) has its free end at ${Th} °C; rod B (k = ${k2} W/m K, ${L2} cm long) has its free end at ${Tc} °C. In the steady state, what is the temperature of the joint?</p>`,
        answer, unit: '°C', tol: 0.01, abs: 0.1,
        hint: 'In the steady state the same heat current flows through both rods: k₁A(T_h − T)/L₁ = k₂A(T − T_c)/L₂. Think of L/(kA) as a thermal resistance.',
        solution: steps(`Thermal resistances (per unit area): R_A = L/k = ${n(L1 / 100 / k1)}, R_B = ${n(L2 / 100 / k2)} (in m² K/W).`, `The temperature drops in proportion to resistance: T − ${Tc} = (${Th} − ${Tc}) × R_B/(R_A + R_B).`, `T = <b>${n(answer)} °C</b>.`) };
    },
    verify: (x) => (x.k1 * x.Th / x.L1 + x.k2 * x.Tc / x.L2) / (x.k1 / x.L1 + x.k2 / x.L2),
  },
  'tp-pendulum-clock': {
    title: 'time lost by a pendulum clock in hot weather',
    make(r) {
      const alpha = [1.2e-5, 1.9e-5, 2.4e-5][Math.floor(r() * 3)], dT = pick(r, 5, 30, 5);
      const answer = 0.5 * alpha * dT * 86400;
      return { alpha, dT,
        q: `<p>A pendulum clock with a metal rod (α = ${n(alpha * 1e5)} × 10⁻⁵ per °C) keeps correct time at 20 °C. How many seconds does it lose per day at ${20 + dT} °C?</p>`,
        answer, unit: 's', tol: 0.01,
        hint: 'T ∝ √L. A small fractional change in L of αΔT changes T by ½αΔT. The clock loses that fraction of a day (86 400 s).',
        solution: steps(`ΔL/L = αΔT = ${n(alpha * 1e5)} × 10⁻⁵ × ${dT} = ${n(alpha * dT)}.`, `ΔT/T = ½ αΔT = ${n(0.5 * alpha * dT)}: each swing is slower by this fraction.`, `Time lost per day = ${n(0.5 * alpha * dT)} × 86 400 = <b>${n(answer)} s</b>.`) };
    },
    verify: (x) => { // exact: ratio of periods, then ticks lost per day (small-change result within 0.5%)
      const ratio = Math.sqrt(1 + x.alpha * x.dT); return 86400 * (1 - 1 / ratio);
    },
  },
};
