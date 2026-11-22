// Live problems for Thermodynamics.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';
const R = 8.314;

export default {
  'td-isothermal-work': {
    title: 'work done in an isothermal expansion',
    make(r) {
      const nm = pick(r, 0.5, 3, 0.5), T = pick(r, 250, 500, 25), k = [2, 3, 4, 5][Math.floor(r() * 4)];
      const answer = nm * R * T * Math.log(k);
      return { nm, T, k,
        q: `<p>${nm} mol of an ideal gas expands slowly at a constant ${T} K until its volume is ${k} times larger. How much work does the gas do, in joules? (R = 8.314 J/mol K)</p>`,
        answer, unit: 'J', tol: 0.01,
        hint: 'Isothermal: W = nRT ln(V₂/V₁). Since T is constant, ΔU = 0 and the gas takes in the same amount as heat.',
        solution: steps(`W = nRT ln(V₂/V₁) = ${nm} × 8.314 × ${T} × ln ${k}.`, `ln ${k} = ${n(Math.log(k), 4)}.`, `W = <b>${n(answer, 4)} J</b>; the heat taken in Q = W, because ΔU = 0.`) };
    },
    verify: (x) => { // integrate P dV numerically with P = nRT/V
      const V1 = 1, V2 = x.k, N = 4000; let W = 0; for (let i = 0; i < N; i++) { const V = V1 + ((V2 - V1) * (i + 0.5)) / N; W += ((x.nm * R * x.T) / V) * ((V2 - V1) / N); } return W;
    },
  },
  'td-adiabatic-temp': {
    title: 'temperature after an adiabatic compression',
    make(r) {
      const T1 = pick(r, 280, 320, 10), k = pick(r, 2, 16, 1), di = r() < 0.5;
      const g = di ? 1.4 : 5 / 3, answer = T1 * Math.pow(k, g - 1);
      return { T1, k, di,
        q: `<p>A ${di ? 'diatomic' : 'monatomic'} ideal gas at ${T1} K is compressed quickly (adiabatically) to 1/${k} of its volume. What is its new temperature? (γ = ${di ? '1.4' : '5/3'})</p>`,
        answer, unit: 'K', tol: 0.01,
        hint: 'Adiabatic: TV^(γ−1) = constant, so T₂ = T₁ (V₁/V₂)^(γ−1).',
        solution: steps(`γ − 1 = ${di ? '0.4' : '2/3'}.`, `T₂ = ${T1} × ${k}<sup>${di ? '0.4' : '2/3'}</sup> = ${T1} × ${n(Math.pow(k, g - 1), 4)}.`, `T₂ = <b>${n(answer, 4)} K</b>. This heating is how a diesel engine ignites its fuel without a spark.`) };
    },
    verify: (x) => { // from PV^γ = const and PV = nRT: T ∝ PV
      const g = x.di ? 1.4 : 5 / 3, P2 = Math.pow(x.k, g), V2 = 1 / x.k; return x.T1 * P2 * V2;
    },
  },
  'td-carnot-fridge': {
    title: 'work needed by an ideal refrigerator',
    make(r) {
      const Tc = pick(r, 250, 280, 5), Th = pick(r, 295, 320, 5), Qc = pick(r, 200, 2000, 100);
      const cop = Tc / (Th - Tc), answer = Qc / cop;
      return { Tc, Th, Qc,
        q: `<p>An ideal (Carnot) refrigerator keeps its inside at ${Tc} K in a room at ${Th} K. How much work must it do to remove ${Qc} J of heat from the inside?</p>`,
        answer, unit: 'J', tol: 0.01,
        hint: 'Coefficient of performance of an ideal refrigerator: β = Q_c/W = T_c/(T_h − T_c).',
        solution: steps(`β = ${Tc}/(${Th} − ${Tc}) = ${n(cop, 4)}.`, `W = Q_c/β = ${Qc}/${n(cop, 4)} = <b>${n(answer, 4)} J</b>.`, `It dumps Q_c + W = ${n(Qc + answer, 4)} J into the room.`) };
    },
    verify: (x) => { // entropy balance for a reversible cycle: Q_h/T_h = Q_c/T_c, W = Q_h − Q_c
      const Qh = (x.Qc * x.Th) / x.Tc; return Qh - x.Qc;
    },
  },
};
