// Live problems for Differential equations.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';
// fourth-order Runge-Kutta from (x0, y0) to x1: the numerical check used by verify()
const rk4 = (f, x0, y0, x1, N = 2000) => { const h = (x1 - x0) / N; let x = x0, y = y0; for (let i = 0; i < N; i++) { const k1 = f(x, y), k2 = f(x + h / 2, y + (h * k1) / 2), k3 = f(x + h / 2, y + (h * k2) / 2), k4 = f(x + h, y + h * k3); y += (h * (k1 + 2 * k2 + 2 * k3 + k4)) / 6; x += h; } return y; };

export default {
  'de-decay': {
    title: 'radioactive decay from a half-life',
    make(r) {
      const T = pick(r, 2, 12), t = pick(r, 1, 30);
      const k = Math.LN2 / T, answer = 100 * Math.exp(-k * t);
      return { T, t,
        q: `<p>A substance decays at a rate proportional to the amount present, with a half-life of ${T} years. What percentage of it is left after ${t} years? (2 decimal places)</p>`,
        answer, unit: '%', tol: 0.002, abs: 0.01,
        hint: 'dN/dt = −kN gives N = N₀e^(−kt). The half-life fixes k: e^(−kT) = 1/2, so k = (log 2)/T.',
        solution: steps(`k = log 2 / ${T} = ${n(k, 4)} per year.`, `N/N₀ = e^(−${n(k, 4)} × ${t}) = ${n(Math.exp(-k * t), 5)}.`, `Left: <b>${n(answer, 5)}%</b>. (Same as (1/2)^(${t}/${T}).)`) };
    },
    verify: (x) => rk4((s, N) => -(Math.LN2 / x.T) * N, 0, 100, x.t),
  },
  'de-linear': {
    title: 'a linear first-order equation with an integrating factor',
    make(r) {
      const k = pick(r, 1, 3), m = pick(r, 0, 2), y1 = pick(r, -3, 4), x1 = pick(r, 2, 3);
      const a = 1 / (m + k + 1), C = y1 - a; // y = a·x^(m+1) + C·x^(−k), y(1) = y1
      const answer = a * x1 ** (m + 1) + C * x1 ** -k;
      const rhs = m === 0 ? '1' : m === 1 ? 'x' : `x<sup>${m}</sup>`;
      return { k, m, y1, x1,
        q: `<p>Solve dy/dx + ${k === 1 ? '' : k}y/x = ${rhs} for x > 0 with y(1) = ${y1}, and find y(${x1}). (3 decimal places)</p>`,
        answer, unit: '', tol: 0.002, abs: 0.002,
        hint: `Integrating factor = e^(∫${k}/x dx) = x<sup>${k}</sup>. Then d/dx (y·x<sup>${k}</sup>) = x<sup>${m + k}</sup>.`,
        solution: steps(`IF = x<sup>${k}</sup>. Multiply through: (y x<sup>${k}</sup>)′ = x<sup>${m + k}</sup>.`, `y x<sup>${k}</sup> = x<sup>${m + k + 1}</sup>/${m + k + 1} + C, so y = x<sup>${m + 1}</sup>/${m + k + 1} + C x<sup>−${k}</sup>.`, `y(1) = 1/${m + k + 1} + C = ${y1} ⇒ C = ${n(C, 5)}.`, `y(${x1}) = ${n(a * x1 ** (m + 1), 5)} + ${n(C, 5)} × ${n(x1 ** -k, 5)} = <b>${n(answer, 5)}</b>.`) };
    },
    verify: (x) => rk4((s, y) => s ** x.m - (x.k * y) / s, 1, x.y1, x.x1),
  },
  'de-cooling': {
    title: 'Newton’s law of cooling',
    make(r) {
      const Ts = pick(r, 15, 30, 5), T0 = pick(r, 70, 100, 5), T1 = pick(r, 45, 65, 5), t1 = pick(r, 5, 15, 5), t2 = pick(r, 10, 40, 5);
      const k = Math.log((T0 - Ts) / (T1 - Ts)) / t1, answer = Ts + (T0 - Ts) * Math.exp(-k * t2);
      return { Ts, T0, T1, t1, t2,
        q: `<p>Tea at ${T0} °C cools to ${T1} °C in ${t1} minutes in a room at ${Ts} °C. Using Newton's law of cooling, what is its temperature after ${t2} minutes from the start? (°C, 1 decimal place)</p>`,
        answer, unit: '°C', tol: 0.002, abs: 0.1,
        hint: 'dT/dt = −k(T − Tₛ) gives T − Tₛ = (T₀ − Tₛ)e^(−kt). Use the first reading to find e^(−k).',
        solution: steps(`T − ${Ts} = ${T0 - Ts}e^(−kt).`, `After ${t1} min: ${T1 - Ts} = ${T0 - Ts}e^(−${t1}k), so k = log(${T0 - Ts}/${T1 - Ts})/${t1} = ${n(k, 4)} per minute.`, `After ${t2} min: T = ${Ts} + ${T0 - Ts}e^(−${n(k * t2, 4)}) = <b>${n(answer, 4)} °C</b>.`) };
    },
    // the excess temperature shrinks by the same factor every t1 minutes
    verify: (x) => x.Ts + (x.T0 - x.Ts) * ((x.T1 - x.Ts) / (x.T0 - x.Ts)) ** (x.t2 / x.t1),
  },
};
