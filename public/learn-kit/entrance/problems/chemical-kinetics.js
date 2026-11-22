// Live problems for Chemical kinetics.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';
const R = 8.314;

export default {
  'kin-first-order-time': {
    title: 'time for a first-order reaction to reach a given fraction',
    make(r) {
      const th = pick(r, 5, 60, 5), pct = [50, 75, 80, 87.5, 90, 99][Math.floor(r() * 6)];
      const k = Math.LN2 / th, answer = (Math.LN10 / k) * Math.log10(100 / (100 - pct));
      return { th, pct,
        q: `<p>A first-order reaction has a half-life of ${th} minutes. How long does it take for ${pct}% of the reactant to be used up?</p>`,
        answer, unit: 'min', tol: 0.005,
        hint: 'k = 0.693/t½. Then t = (2.303/k) log([A]₀/[A]). If x% has reacted, [A]₀/[A] = 100/(100 − x).',
        solution: steps(`k = 0.693/${th} = ${n(k, 4)} min⁻¹.`, `[A]₀/[A] = 100/${n(100 - pct)} = ${n(100 / (100 - pct), 4)}.`, `t = (2.303/${n(k, 4)}) × log ${n(100 / (100 - pct), 4)} = <b>${n(answer)} min</b>.`) };
    },
    // count half-lives: t = t½ × log₂([A]₀/[A])
    verify: (x) => x.th * Math.log2(100 / (100 - x.pct)),
  },
  'kin-arrhenius': {
    title: 'activation energy from rate constants at two temperatures',
    make(r) {
      const T1 = pick(r, 280, 320, 5), dT = pick(r, 10, 40, 5), T2 = T1 + dT, ratio = pick(r, 1.5, 6, 0.5);
      const answer = (R * Math.log(ratio)) / (1 / T1 - 1 / T2) / 1000;
      return { T1, T2, ratio,
        q: `<p>The rate constant of a reaction becomes ${ratio} times larger when the temperature rises from ${T1} K to ${T2} K. Find the activation energy in kJ/mol. (R = 8.314 J mol<sup>−1</sup> K<sup>−1</sup>)</p>`,
        answer, unit: 'kJ/mol', tol: 0.005,
        hint: 'log(k₂/k₁) = (Eₐ / 2.303R) × (T₂ − T₁)/(T₁T₂).',
        solution: steps(`log ${ratio} = ${n(Math.log10(ratio), 4)}.`, `(T₂ − T₁)/(T₁T₂) = ${dT}/(${T1} × ${T2}) = ${n(dT / (T1 * T2), 4)} K⁻¹.`, `Eₐ = 2.303 × 8.314 × ${n(Math.log10(ratio), 4)} / ${n(dT / (T1 * T2), 4)} = ${n(answer * 1000, 4)} J/mol = <b>${n(answer)} kJ/mol</b>.`) };
    },
    verify: (x) => (2.302585 * R * Math.log10(x.ratio) * x.T1 * x.T2) / (x.T2 - x.T1) / 1000,
  },
  'kin-initial-rate': {
    title: 'rate law from initial-rate data',
    make(r) {
      const a = pick(r, 0, 2), b = pick(r, 0, 2), k = pick(r, 0.5, 5, 0.5);
      const A1 = 0.1, B1 = 0.1, fa = [2, 3][Math.floor(r() * 2)], fb = [2, 3][Math.floor(r() * 2)];
      const r1 = k * A1 ** a * B1 ** b, r2 = k * (fa * A1) ** a * B1 ** b, r3 = k * A1 ** a * (fb * B1) ** b;
      const A4 = 0.2, B4 = 0.3, answer = k * A4 ** a * B4 ** b;
      return { a, b, k, A4, B4, r1, A1, B1,
        q: `<p>For A + B → products, initial rates at 298 K were: [A] = 0.1, [B] = 0.1 M: rate ${n(r1, 3)} M/s; [A] = ${n(fa * A1)}, [B] = 0.1 M: rate ${n(r2, 3)} M/s; [A] = 0.1, [B] = ${n(fb * B1)} M: rate ${n(r3, 3)} M/s. What is the initial rate when [A] = 0.2 M and [B] = 0.3 M?</p>`,
        answer, unit: 'M/s', tol: 0.01,
        hint: 'Compare two runs where only one concentration changes. If [A] goes up f times and the rate goes up f^p times, the order in A is p.',
        solution: steps(`Runs 1 and 2: [A] × ${fa}, rate × ${n(r2 / r1, 3)} = ${fa}<sup>${a}</sup>, so order in A = ${a}.`, `Runs 1 and 3: [B] × ${fb}, rate × ${n(r3 / r1, 3)} = ${fb}<sup>${b}</sup>, so order in B = ${b}.`, `k = rate₁/([A]<sup>${a}</sup>[B]<sup>${b}</sup>) = ${n(k)}.`, `Rate = ${n(k)} × 0.2<sup>${a}</sup> × 0.3<sup>${b}</sup> = <b>${n(answer)} M/s</b>.`) };
    },
    // scale run 1 by the concentration ratios
    verify: (x) => x.r1 * (x.A4 / x.A1) ** x.a * (x.B4 / x.B1) ** x.b,
  },
};
