// Class 12 Physics, Chapter 7 Alternating Current: live problems (original fibub questions). Ids start with c12p-ac-.
import { pick, choose, n, steps } from './_util.js';

const PI = Math.PI;
export default {
  'c12p-ac-rms': {
    title: 'peak and rms voltage',
    make(r) {
      const V0 = choose(r, [141, 170, 220, 311, 325, 400, 440, 565]), ask = choose(r, ['rms', 'peak']);
      const rms = V0 / Math.SQRT2;
      if (ask === 'rms') return { V0, ask, q: `<p>An AC supply has a peak voltage of ${V0} V. What is its rms voltage?</p>`, answer: rms, unit: 'V', tol: 0.01, hint: 'V<sub>rms</sub> = V₀/√2 = 0.707 V₀.', solution: steps(`V<sub>rms</sub> = V₀/√2 = ${V0}/1.414.`, `V<sub>rms</sub> = <b>${n(rms)} V</b>.`) };
      return { V0, ask, rms, q: `<p>A hostel supply is marked ${n(rms, 4)} V rms. What is the peak voltage?</p>`, answer: V0, unit: 'V', tol: 0.01, hint: 'V₀ = √2 × V<sub>rms</sub>.', solution: steps(`V₀ = √2 × ${n(rms, 4)} V.`, `V₀ = <b>${n(V0)} V</b>.`) };
    },
    verify: (x) => (x.ask === 'rms' ? Math.sqrt((x.V0 * x.V0) / 2) : Math.sqrt(2) * x.rms),
  },
  'c12p-ac-reactance': {
    title: 'inductive or capacitive reactance',
    make(r) {
      const f = choose(r, [50, 60, 100, 400, 1000]), ask = choose(r, ['L', 'C']);
      if (ask === 'L') {
        const L = choose(r, [0.05, 0.1, 0.2, 0.5, 1]), X = 2 * PI * f * L;
        return { f, L, ask, q: `<p>An ideal inductor of ${L} H is connected to a ${f} Hz supply. What is its reactance?</p>`, answer: X, unit: 'Ω', tol: 0.01, hint: 'X<sub>L</sub> = ωL = 2πfL.', solution: steps(`ω = 2πf = 2π × ${f} = ${n(2 * PI * f)} rad/s.`, `X<sub>L</sub> = ωL = ${n(2 * PI * f)} × ${L} = <b>${n(X)} Ω</b>.`) };
      }
      const Cu = choose(r, [1, 2, 5, 10, 20, 50]), X = 1 / (2 * PI * f * Cu * 1e-6);
      return { f, Cu, ask, q: `<p>A capacitor of ${Cu} µF is connected to a ${f} Hz supply. What is its reactance?</p>`, answer: X, unit: 'Ω', tol: 0.01, hint: 'X<sub>C</sub> = 1/ωC = 1/(2πfC), with C in farads.', solution: steps(`ω = 2πf = ${n(2 * PI * f)} rad/s and C = ${Cu} × 10<sup>−6</sup> F.`, `X<sub>C</sub> = 1/(ωC) = <b>${n(X)} Ω</b>.`) };
    },
    verify: (x) => (x.ask === 'L' ? (x.f * x.L) / (1 / (2 * PI)) : 1 / (2 * PI * x.f * x.Cu * 1e-6)),
  },
  'c12p-ac-impedance': {
    title: 'current in a series LCR circuit',
    make(r) {
      const R = choose(r, [30, 40, 60, 80]), L = choose(r, [0.1, 0.2, 0.3]), C = choose(r, [20, 40, 50, 100]), V = choose(r, [100, 120, 220, 230]), f = 50;
      const XL = 2 * PI * f * L, XC = 1 / (2 * PI * f * C * 1e-6), Z = Math.hypot(R, XL - XC), I = V / Z;
      return { R, L, C, V, f, q: `<p>A ${R} Ω resistor, a ${L} H inductor and a ${C} µF capacitor are joined in series across a ${V} V (rms), ${f} Hz supply. Find the rms current.</p>`, answer: I, unit: 'A', tol: 0.01,
        hint: 'Find X<sub>L</sub> and X<sub>C</sub>, then Z = √(R² + (X<sub>L</sub> − X<sub>C</sub>)²) and I = V/Z.',
        solution: steps(`X<sub>L</sub> = 2π × ${f} × ${L} = ${n(XL)} Ω; X<sub>C</sub> = 1/(2π × ${f} × ${C} × 10<sup>−6</sup>) = ${n(XC)} Ω.`, `Z = √(${R}² + (${n(XL)} − ${n(XC)})²) = ${n(Z)} Ω.`, `I = V/Z = ${V}/${n(Z)} = <b>${n(I)} A</b>.`) };
    },
    verify: (x) => { const w = 2 * PI * x.f; const re = x.R, im = w * x.L - 1 / (w * x.C * 1e-6); return x.V / Math.sqrt(re * re + im * im); },
  },
  'c12p-ac-resonance': {
    title: 'resonant frequency',
    make(r) {
      const L = choose(r, [0.01, 0.025, 0.05, 0.1, 0.25]), Cu = choose(r, [1, 2, 4, 10, 25]), f0 = 1 / (2 * PI * Math.sqrt(L * Cu * 1e-6));
      return { L, Cu, q: `<p>A series LCR circuit has L = ${L} H and C = ${Cu} µF. At what frequency does it resonate?</p>`, answer: f0, unit: 'Hz', tol: 0.01, hint: 'Resonance when X<sub>L</sub> = X<sub>C</sub>: f₀ = 1/(2π√(LC)).',
        solution: steps(`LC = ${L} × ${Cu} × 10<sup>−6</sup> = ${n(L * Cu * 1e-6)} s².`, `f₀ = 1/(2π√LC) = <b>${n(f0)} Hz</b>.`) };
    },
    verify: (x) => { const w0 = Math.sqrt(1 / (x.L * x.Cu * 1e-6)); return w0 / (2 * PI); },
  },
  'c12p-ac-power': {
    title: 'average power and power factor',
    make(r) {
      const R = choose(r, [20, 30, 40, 60]), X = choose(r, [15, 40, 45, 80]), V = choose(r, [100, 120, 220, 230]);
      const Z = Math.hypot(R, X), I = V / Z, P = I * I * R;
      return { R, X, V, q: `<p>A coil has resistance ${R} Ω and reactance ${X} Ω. It is connected to a ${V} V (rms) AC supply. Find the average power it uses.</p>`, answer: P, unit: 'W', tol: 0.01, hint: 'Find Z and I; then P = V I cos φ with cos φ = R/Z (or P = I²R).',
        solution: steps(`Z = √(${R}² + ${X}²) = ${n(Z)} Ω, I = ${V}/${n(Z)} = ${n(I)} A.`, `cos φ = R/Z = ${n(R / Z)}.`, `P = V I cos φ = ${V} × ${n(I)} × ${n(R / Z)} = <b>${n(P)} W</b>.`) };
    },
    verify: (x) => x.V * x.V * x.R / (x.R * x.R + x.X * x.X),
  },
  'c12p-ac-transformer': {
    title: 'ideal transformer',
    make(r) {
      const Np = choose(r, [100, 200, 500, 1000]), ratio = choose(r, [0.1, 0.2, 0.5, 2, 5, 10]), Vp = choose(r, [110, 220, 230, 400]), Ip = choose(r, [0.5, 1, 2, 5]);
      const Ns = Np * ratio, Vs = Vp * ratio, Is = Ip / ratio, ask = choose(r, ['Vs', 'Is']);
      if (ask === 'Vs') return { Np, Ns, Vp, Ip, ask, q: `<p>An ideal transformer has ${n(Np)} turns in the primary and ${n(Ns)} in the secondary. The primary is connected to ${Vp} V. Find the secondary voltage.</p>`, answer: Vs, unit: 'V', tol: 0.01, hint: 'V<sub>s</sub>/V<sub>p</sub> = N<sub>s</sub>/N<sub>p</sub>.', solution: steps(`V<sub>s</sub> = V<sub>p</sub> × N<sub>s</sub>/N<sub>p</sub> = ${Vp} × ${n(Ns)}/${n(Np)}.`, `V<sub>s</sub> = <b>${n(Vs)} V</b>.`) };
      return { Np, Ns, Vp, Ip, ask, q: `<p>An ideal transformer has ${n(Np)} primary turns and ${n(Ns)} secondary turns. The primary draws ${Ip} A at ${Vp} V. Find the current in the secondary.</p>`, answer: Is, unit: 'A', tol: 0.01, hint: 'For an ideal transformer V<sub>p</sub>I<sub>p</sub> = V<sub>s</sub>I<sub>s</sub>, and V<sub>s</sub> = V<sub>p</sub>N<sub>s</sub>/N<sub>p</sub>.', solution: steps(`V<sub>s</sub> = ${Vp} × ${n(Ns)}/${n(Np)} = ${n(Vs)} V.`, `I<sub>s</sub> = V<sub>p</sub>I<sub>p</sub>/V<sub>s</sub> = ${Vp} × ${Ip}/${n(Vs)} = <b>${n(Is)} A</b>.`) };
    },
    verify: (x) => (x.ask === 'Vs' ? (x.Vp * x.Ns) / x.Np : x.Ip * (x.Np / x.Ns)),
  },
  'c12p-ac-loss': {
    title: 'power lost in a transmission line',
    make(r) {
      const P = choose(r, [1, 2, 5, 10]), V = choose(r, [11, 33, 66, 132, 220]), Rl = choose(r, [1, 2, 4, 5]);
      const I = (P * 1e6) / (V * 1e3), loss = I * I * Rl;
      return { P, V, Rl, q: `<p>A power station sends ${P} MW along a line of total resistance ${Rl} Ω at ${V} kV. How much power is lost as heat in the line?</p>`, answer: loss / 1000, unit: 'kW', tol: 0.01, hint: 'Line current I = P/V; heat lost = I²R.',
        solution: steps(`I = P/V = ${P} × 10<sup>6</sup> ÷ ${V} × 10<sup>3</sup> = ${n(I)} A.`, `Loss = I²R = ${n(I)}² × ${Rl} = ${n(loss)} W = <b>${n(loss / 1000)} kW</b>.`) };
    },
    verify: (x) => ((x.P * 1e6) ** 2 * x.Rl) / (x.V * 1e3) ** 2 / 1000,
  },
};
