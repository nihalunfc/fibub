// Class 11 Physics, Thermodynamics: live problems (original fibub questions). Ids start with c11p-tdyn-.
import { pick, choose, n, steps } from './_util.js';
const R = 8.314;

export default {
  'c11p-tdyn-first': {
    title: 'change in internal energy',
    make(r) {
      const Q = pick(r, 200, 1000, 50), W = pick(r, 50, 400, 25), dU = Q - W;
      return { Q, W, q: `<p>A gas absorbs ${Q} J of heat and does ${W} J of work on its surroundings. What is the change in its internal energy, in joules?</p>`, answer: dU, unit: 'J', tol: 0.01, abs: 0.5,
        hint: 'Q = ΔU + W, with W the work done BY the gas.',
        solution: steps(`ΔU = Q − W = ${Q} − ${W}.`, `ΔU = <b>${dU} J</b> (the gas ${dU >= 0 ? 'warms up' : 'cools down'}).`) };
    },
    verify: (x) => x.Q + -x.W,
  },
  'c11p-tdyn-isothermal': {
    title: 'work in an isothermal expansion',
    make(r) {
      const nn = choose(r, [0.5, 1, 2]), T = pick(r, 280, 400, 20), f = choose(r, [2, 3, 4]), W = nn * R * T * Math.log(f);
      return { nn, T, f, q: `<p>${nn} mol of an ideal gas expands isothermally at ${T} K until its volume is ${f} times the original. Find the work done by the gas, in joules. (R = 8.314 J/(mol K).)</p>`, answer: W, unit: 'J', tol: 0.01,
        hint: 'W = nRT ln(V₂/V₁).',
        solution: steps(`W = nRT ln(V₂/V₁) = ${nn} × 8.314 × ${T} × ln ${f}.`, `ln ${f} = ${n(Math.log(f))}, so W = <b>${n(W)} J</b>. The internal energy does not change, so Q = W.`) };
    },
    verify: (x) => { const P1V1 = x.nn * R * x.T, V1 = 1; let s = 0; const N = 20000, dV = (x.f * V1 - V1) / N; for (let i = 0; i < N; i++) { const V = V1 + (i + 0.5) * dV; s += (P1V1 / V) * dV; } return s; },
  },
  'c11p-tdyn-adiabatic': {
    title: 'temperature after adiabatic compression',
    make(r) {
      const T1 = pick(r, 280, 320, 10), f = choose(r, [2, 4, 8]), g = choose(r, [5 / 3, 7 / 5]), T2 = T1 * f ** (g - 1);
      return { T1, f, g, q: `<p>A ${g > 1.5 ? 'monatomic (γ = 5/3)' : 'diatomic (γ = 7/5)'} ideal gas at ${T1} K is compressed suddenly (adiabatically) to 1/${f} of its volume. Find its final temperature in kelvin.</p>`, answer: T2, unit: 'K', tol: 0.01,
        hint: 'T V^(γ−1) = constant.',
        solution: steps(`T₂ = T₁ (V₁/V₂)^(γ−1) = ${T1} × ${f}<sup>${n(g - 1)}</sup>.`, `T₂ = <b>${n(T2)} K</b>.`) };
    },
    verify: (x) => { const P1 = 1e5, V1 = 1, V2 = V1 / x.f, P2 = P1 * (V1 / V2) ** x.g; return x.T1 * (P2 * V2) / (P1 * V1); },
  },
  'c11p-tdyn-carnot': {
    title: 'Carnot engine',
    make(r) {
      const Th = pick(r, 400, 800, 50), Tc = choose(r, [250, 300, 320]), Qh = pick(r, 500, 2000, 100), W = Qh * (1 - Tc / Th);
      return { Th, Tc, Qh, q: `<p>A Carnot engine works between ${Th} K and ${Tc} K and takes ${Qh} J of heat from the hot source in each cycle. How much work does it do per cycle, in joules?</p>`, answer: W, unit: 'J', tol: 0.01,
        hint: 'η = 1 − T꜀/Tₕ and W = η Qₕ.',
        solution: steps(`η = 1 − ${Tc}/${Th} = ${n(1 - Tc / Th)}.`, `W = η Qₕ = ${n(1 - Tc / Th)} × ${Qh} = <b>${n(W)} J</b>.`) };
    },
    verify: (x) => { const Qc = x.Qh * x.Tc / x.Th; return x.Qh - Qc; },
  },
  'c11p-tdyn-fridge': {
    title: 'refrigerator work',
    make(r) {
      const Tc = choose(r, [260, 270, 275]), Th = choose(r, [300, 310, 320]), Qc = pick(r, 500, 2000, 100), W = Qc * (Th - Tc) / Tc;
      return { Tc, Th, Qc, q: `<p>An ideal (Carnot) refrigerator keeps its inside at ${Tc} K in a ${Th} K kitchen. How much work must be supplied to remove ${Qc} J of heat from the inside? Answer in joules.</p>`, answer: W, unit: 'J', tol: 0.01,
        hint: 'COP = Q꜀/W = T꜀/(Tₕ − T꜀).',
        solution: steps(`COP = ${Tc}/(${Th} − ${Tc}) = ${n(Tc / (Th - Tc))}.`, `W = Q꜀/COP = ${Qc} / ${n(Tc / (Th - Tc))} = <b>${n(W)} J</b>.`) };
    },
    verify: (x) => { const Qh = x.Qc * x.Th / x.Tc; return Qh - x.Qc; },
  },
  'c11p-tdyn-isobaric': {
    title: 'heating a gas at constant pressure',
    make(r) {
      const nn = choose(r, [1, 2, 3]), dT = pick(r, 20, 100, 10), Q = 2.5 * nn * R * dT;
      return { nn, dT, q: `<p>${nn} mol of a monatomic ideal gas is heated at constant pressure so that its temperature rises by ${dT} K. How much heat is supplied, in joules? (R = 8.314 J/(mol K).)</p>`, answer: Q, unit: 'J', tol: 0.01,
        hint: 'Cₚ = 5R/2 for a monatomic gas, Q = n Cₚ ΔT.',
        solution: steps(`Q = n Cₚ ΔT = ${nn} × (5/2 × 8.314) × ${dT}.`, `= <b>${n(Q)} J</b>.`) };
    },
    verify: (x) => 1.5 * x.nn * R * x.dT + x.nn * R * x.dT,
  },
};
