// Live problems for Alternating current.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const sci = (v, d = 3) => { const e = Math.floor(Math.log10(Math.abs(v))); return `${+(v / 10 ** e).toPrecision(d)} × 10<sup>${e}</sup>`; };
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';

export default {
  'ac-lcr-current': {
    title: 'current in a series LCR circuit',
    make(r) {
      const V = pick(r, 50, 240, 10), f = 50, R = pick(r, 10, 100, 10), L = pick(r, 0.1, 1, 0.1), C = pick(r, 10, 100, 10);
      const w = 2 * Math.PI * f, XL = w * L, XC = 1 / (w * C * 1e-6), Z = Math.hypot(R, XL - XC), answer = V / Z;
      return { V, f, R, L, C,
        q: `<p>A ${R} Ω resistor, a ${L} H inductor and a ${C} µF capacitor are in series across a ${V} V (rms), ${f} Hz supply. What is the rms current, in A?</p>`,
        answer, unit: 'A', tol: 0.005,
        hint: 'X<sub>L</sub> = 2πfL, X<sub>C</sub> = 1/(2πfC), Z = √(R² + (X<sub>L</sub> − X<sub>C</sub>)²), I = V/Z.',
        solution: steps(`X<sub>L</sub> = 2π × ${f} × ${L} = ${n(XL, 4)} Ω; X<sub>C</sub> = 1/(2π × ${f} × ${C} × 10⁻⁶) = ${n(XC, 4)} Ω.`, `Z = √(${R}² + ${n(XL - XC, 4)}²) = ${n(Z, 4)} Ω.`, `I = ${V}/${n(Z, 4)} = <b>${n(answer)} A</b>; the current ${XL > XC ? 'lags' : 'leads'} the voltage, since X<sub>${XL > XC ? 'L' : 'C'}</sub> is larger.`) };
    },
    verify: (x) => { // from the phase angle: tan φ = X/R and I = V cos φ / R
      const w = 2 * Math.PI * x.f, X = w * x.L - 1 / (w * x.C * 1e-6), phi = Math.atan(X / x.R);
      return (x.V * Math.cos(phi)) / x.R;
    },
  },
  'ac-resonance': {
    title: 'resonant frequency of an LC circuit',
    make(r) {
      const L = pick(r, 1, 100), C = pick(r, 1, 100);
      const answer = 1 / (2 * Math.PI * Math.sqrt(L * 1e-3 * C * 1e-6));
      return { L, C,
        q: `<p>A series LCR circuit has L = ${L} mH and C = ${C} µF. At what supply frequency does the current peak, in Hz?</p>`,
        answer, unit: 'Hz', tol: 0.005,
        hint: 'At resonance X<sub>L</sub> = X<sub>C</sub>, so ω₀ = 1/√(LC) and f₀ = 1/(2π√(LC)). R does not change f₀.',
        solution: steps(`LC = ${L} × 10⁻³ × ${C} × 10⁻⁶ = ${sci(L * C * 1e-9)} s².`, `f₀ = 1/(2π√(${sci(L * C * 1e-9)})) = <b>${n(answer)} Hz</b>.`) };
    },
    verify: (x) => { // bisection on X_L − X_C = 0
      let lo = 0.01, hi = 1e7; const X = (f) => 2 * Math.PI * f * x.L * 1e-3 - 1 / (2 * Math.PI * f * x.C * 1e-6);
      for (let i = 0; i < 200; i++) { const mid = Math.sqrt(lo * hi); X(mid) > 0 ? (hi = mid) : (lo = mid); }
      return lo;
    },
  },
  'ac-transformer': {
    title: 'primary current of a real transformer',
    make(r) {
      const Vp = [220, 230, 240][Math.floor(r() * 3)], Vs = pick(r, 6, 24, 6), P = pick(r, 20, 200, 10), eta = pick(r, 80, 98, 2);
      const answer = P / ((eta / 100) * Vp);
      return { Vp, Vs, P, eta,
        q: `<p>A step-down transformer works from ${Vp} V mains and gives ${Vs} V to a load that takes ${P} W. Its efficiency is ${eta}%. What current does it draw from the mains, in A?</p>`,
        answer, unit: 'A', tol: 0.005,
        hint: 'Input power = output power ÷ efficiency. Then I<sub>p</sub> = P<sub>in</sub>/V<sub>p</sub>.',
        solution: steps(`P<sub>in</sub> = ${P}/${eta / 100} = ${n(P / (eta / 100), 4)} W.`, `I<sub>p</sub> = ${n(P / (eta / 100), 4)}/${Vp} = <b>${n(answer)} A</b>.`, `(The secondary current is ${P}/${Vs} = ${n(P / Vs)} A: low voltage, high current.)`) };
    },
    verify: (x) => { const Is = x.P / x.Vs, ideal = Is * (x.Vs / x.Vp); return ideal / (x.eta / 100); },
  },
};
