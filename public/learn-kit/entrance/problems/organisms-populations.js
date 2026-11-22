// Live problems for Organisms and populations.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';

const ORGS = [['lotus plants in a pond', 'lotus'], ['deer in a forest', 'deer'], ['frogs in a lab colony', 'frog'], ['fruit flies in a culture bottle', 'fly']];
export default {
  'pop-rate': {
    title: 'per capita birth or death rate',
    make(r) {
      const [what, one] = ORGS[Math.floor(r() * ORGS.length)], N = pick(r, 20, 400, 10), birth = r() < 0.5;
      const ev = Math.max(1, Math.round(N * pick(r, 0.05, 0.6, 0.05)));
      const answer = ev / N;
      return { N, ev,
        q: `<p>A population of ${N} ${what} ${birth ? `produced ${ev} new individuals` : `lost ${ev} individuals to death`} in one year. What is the ${birth ? 'birth' : 'death'} rate per ${one} per year?</p>`,
        answer, unit: `per ${one} per year`, tol: 0.005,
        hint: 'Birth and death rates are per capita: the number of events divided by the number of individuals present.',
        solution: steps(`${birth ? 'Births' : 'Deaths'} ÷ population = ${ev} ÷ ${N}.`, `= <b>${n(answer)}</b> per ${one} per year.`) };
    },
    verify: (x) => x.ev / x.N,
  },
  'pop-logistic': {
    title: 'logistic growth rate dN/dt',
    make(r) {
      const K = pick(r, 500, 5000, 100), N = pick(r, 50, K - 50, 50), rr = pick(r, 0.05, 0.9, 0.05);
      const answer = (rr * N * (K - N)) / K;
      return { K, N, rr,
        q: `<p>A population grows logistically with r = ${rr} per year and carrying capacity K = ${K}. How fast does it grow (dN/dt) when N = ${N}?</p>`,
        answer, unit: 'individuals per year', tol: 0.005,
        hint: 'dN/dt = rN × (K − N)/K. The factor (K − N)/K is the share of the carrying capacity still unused.',
        solution: steps(`(K − N)/K = (${K} − ${N})/${K} = ${n((K - N) / K, 4)}.`, `rN = ${rr} × ${N} = ${n(rr * N, 4)}.`, `dN/dt = ${n(rr * N, 4)} × ${n((K - N) / K, 4)} = <b>${n(answer)}</b> per year.`) };
    },
    verify: (x) => x.rr * x.N - (x.rr * x.N * x.N) / x.K,
  },
  'pop-exponential': {
    title: 'population after exponential growth',
    make(r) {
      const N0 = pick(r, 10, 500, 10), rr = pick(r, 0.02, 0.3, 0.01), t = pick(r, 2, 20), answer = N0 * Math.exp(rr * t);
      return { N0, rr, t,
        q: `<p>A population of ${N0} grows exponentially with intrinsic rate r = ${rr} per year and no limits. About how many individuals are there after ${t} years? (Use N<sub>t</sub> = N<sub>0</sub>e<sup>rt</sup>.)</p>`,
        answer, unit: 'individuals', tol: 0.01,
        hint: 'Multiply r by t first, then find e to that power (e ≈ 2.718).',
        solution: steps(`rt = ${rr} × ${t} = ${n(rr * t, 4)}.`, `e<sup>${n(rr * t, 4)}</sup> = ${n(Math.exp(rr * t), 4)}.`, `N<sub>t</sub> = ${N0} × ${n(Math.exp(rr * t), 4)} ≈ <b>${n(answer)}</b>.`) };
    },
    verify: (x) => x.N0 * Math.pow(Math.E, x.rr * x.t),
  },
};
