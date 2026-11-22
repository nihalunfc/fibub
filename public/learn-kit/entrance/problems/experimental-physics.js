// Live problems for Experimental skills and practical physics.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';

export default {
  'ex-screw-gauge': {
    title: 'read a screw gauge with a zero error',
    make(r) {
      const [p, N] = [[0.5, 50], [1, 100], [0.5, 100]][Math.floor(r() * 3)], lc = p / N;
      const msr = pick(r, 1, 12, p), csr = pick(r, 0, N - 1), z = pick(r, -5, 5);
      const answer = msr + csr * lc - z * lc;
      return { p, N, msr, csr, z,
        q: `<p>A screw gauge has pitch ${p} mm and ${N} divisions on its circular scale. With the jaws closed, the zero of the circular scale is ${z === 0 ? 'exactly on' : `${Math.abs(z)} divisions ${z > 0 ? 'below' : 'above'}`} the reference line${z === 0 ? '' : ` (zero error ${z > 0 ? '+' : '−'}${Math.abs(z)} divisions)`}. Measuring a wire, the main scale reads ${msr} mm and the circular scale division ${csr} is on the line. What is the diameter, in mm?</p>`,
        answer, unit: 'mm', tol: 0, abs: 0.0005,
        hint: 'Least count = pitch ÷ number of divisions. Reading = MSR + CSR × LC. True value = reading − zero error (with its sign).',
        solution: steps(`LC = ${p}/${N} = ${lc} mm.`, `Observed = ${msr} + ${csr} × ${lc} = ${n(msr + csr * lc, 6)} mm.`, `Zero error = ${z} × ${lc} = ${n(z * lc, 4)} mm.`, `Diameter = ${n(msr + csr * lc, 6)} − (${n(z * lc, 4)}) = <b>${n(answer, 6)} mm</b>.`) };
    },
    verify: (x) => { const N = x.N, divs = Math.round(x.msr / x.p) * N + x.csr - x.z; return (divs * x.p) / N; }, // count everything in circular divisions
  },
  'ex-pendulum-slope': {
    title: 'g from a pendulum\'s T² against L graph',
    make(r) {
      const L1 = pick(r, 40, 70, 5), L2 = L1 + pick(r, 20, 50, 5), g0 = pick(r, 9.6, 9.95, 0.05);
      const T1 = +(2 * Math.PI * Math.sqrt(L1 / 100 / g0)).toFixed(3), T2 = +(2 * Math.PI * Math.sqrt(L2 / 100 / g0)).toFixed(3);
      const answer = (4 * Math.PI ** 2 * (L2 - L1) / 100) / (T2 ** 2 - T1 ** 2);
      return { L1, L2, T1, T2,
        q: `<p>A simple pendulum gives a period of ${T1} s at an effective length of ${L1} cm and ${T2} s at ${L2} cm. Using the slope of the T² against L line, find g in m/s².</p>`,
        answer, unit: 'm/s²', tol: 0.005,
        hint: 'T² = (4π²/g) L, so the slope of T² against L is 4π²/g. Using two points removes any constant error in measuring L (for example, the bob\'s radius).',
        solution: steps(`T₁² = ${n(T1 ** 2, 4)} s², T₂² = ${n(T2 ** 2, 4)} s².`, `Slope = (${n(T2 ** 2, 4)} − ${n(T1 ** 2, 4)}) / ${n((L2 - L1) / 100, 3)} m = ${n((T2 ** 2 - T1 ** 2) / ((L2 - L1) / 100), 4)} s²/m.`, `g = 4π²/slope = <b>${n(answer, 4)} m/s²</b>.`) };
    },
    verify: (x) => { const k = (x.T2 * x.T2 - x.T1 * x.T1) / ((x.L2 - x.L1) / 100); return (4 * Math.PI * Math.PI) / k; },
  },
  'ex-resistivity': {
    title: 'resistivity of a wire with a metre bridge',
    make(r) {
      const S = pick(r, 1, 10), l = pick(r, 30, 70), Lw = pick(r, 50, 150, 10), d = pick(r, 0.2, 0.8, 0.05);
      const X = (S * l) / (100 - l), answer = (X * Math.PI * (d * 1e-3) ** 2) / 4 / (Lw / 100) * 1e7;
      return { S, l, Lw, d,
        q: `<p>A wire ${Lw} cm long with diameter ${d} mm is placed in the left gap of a metre bridge, with a ${S} Ω resistor in the right gap. The balance point is ${l} cm from the left end. Find the resistivity of the wire, in units of 10⁻⁷ Ω m.</p>`,
        answer, unit: '× 10⁻⁷ Ω m', tol: 0.005,
        hint: 'First X = S l/(100 − l). Then ρ = XA/L with A = πd²/4.',
        solution: steps(`X = ${S} × ${l}/${100 - l} = ${n(X, 4)} Ω.`, `A = π(${d} × 10⁻³)²/4 = ${n(Math.PI * (d * 1e-3) ** 2 / 4 * 1e6, 4)} mm² = ${n(Math.PI * (d * 1e-3) ** 2 / 4 * 1e6, 4)} × 10⁻⁶ m².`, `ρ = XA/L = <b>${n(answer)} × 10⁻⁷ Ω m</b>.`) };
    },
    verify: (x) => { const X = x.S / ((100 - x.l) / x.l), rad = (x.d * 1e-3) / 2; return (X * Math.PI * rad * rad) / (x.Lw / 100) * 1e7; },
  },
};
