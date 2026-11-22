// Live problems for Current electricity and circuits.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const sci = (v, d = 3) => { const e = Math.floor(Math.log10(Math.abs(v))); return `${+(v / 10 ** e).toPrecision(d)} × 10<sup>${e}</sup>`; };
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';

export default {
  'ce-load-power': {
    title: 'power in a load on a real cell',
    make(r) {
      const E = pick(r, 2, 24), ri = pick(r, 0.5, 4, 0.5), R = pick(r, 1, 20);
      const I = E / (R + ri), answer = I * I * R;
      return { E, ri, R,
        q: `<p>A cell of emf ${E} V and internal resistance ${ri} Ω is connected to a ${R} Ω resistor. What power is delivered to the resistor, in W?</p>`,
        answer, unit: 'W', tol: 0.005,
        hint: 'The current is set by the total resistance: I = E/(R + r). Then P = I²R.',
        solution: steps(`I = ${E}/(${R} + ${ri}) = ${n(I, 4)} A.`, `P = I²R = ${n(I, 4)}² × ${R} = <b>${n(answer)} W</b>.`, `(The most this cell could give any load is E²/4r = ${n((E * E) / (4 * ri))} W, at R = r.)`) };
    },
    verify: (x) => { const V = (x.E * x.R) / (x.R + x.ri); return (V * V) / x.R; }, // terminal voltage by the divider rule, P = V²/R
  },
  'ce-metre-bridge': {
    title: 'unknown resistance from a metre bridge',
    make(r) {
      const S = pick(r, 2, 20), l = pick(r, 20, 80);
      const answer = (S * l) / (100 - l);
      return { S, l,
        q: `<p>In a metre bridge, the unknown resistance X is in the left gap and a known ${S} Ω resistor in the right gap. The balance point is ${l} cm from the left end. Find X in Ω.</p>`,
        answer, unit: 'Ω', tol: 0.005,
        hint: 'At balance, X/S = l/(100 − l): each resistance matches the length of wire on its own side.',
        solution: steps(`X/${S} = ${l}/(100 − ${l}) = ${l}/${100 - l}.`, `X = ${S} × ${l}/${100 - l} = <b>${n(answer)} Ω</b>.`) };
    },
    verify: (x) => { // Wheatstone bridge with wire resistance 1 Ω per cm: balanced when the middle points are at equal potential
      const P = x.l, Q = 100 - x.l; return x.S / (Q / P);
    },
  },
  'ce-drift': {
    title: 'drift velocity of electrons in a wire',
    make(r) {
      const I = pick(r, 1, 10), d = pick(r, 0.5, 2, 0.1), nn = 8.5;
      const A = Math.PI * (d * 1e-3) ** 2 / 4, answer = (I / (nn * 1e28 * 1.6e-19 * A)) * 1e3;
      return { I, d, nn,
        q: `<p>A copper wire of diameter ${d} mm carries ${I} A. Copper has 8.5 × 10²⁸ free electrons per m³. What is the drift speed, in mm/s? (e = 1.6 × 10⁻¹⁹ C)</p>`,
        answer, unit: 'mm/s', tol: 0.005,
        hint: 'I = neAv<sub>d</sub>, so v<sub>d</sub> = I/(neA) with A = πd²/4.',
        solution: steps(`A = π(${d} × 10⁻³)²/4 = ${sci(A)} m².`, `v<sub>d</sub> = ${I}/(8.5 × 10²⁸ × 1.6 × 10⁻¹⁹ × ${sci(A)}).`, `v<sub>d</sub> = <b>${n(answer)} mm/s</b>: a snail's pace, though the signal travels at nearly the speed of light.`) };
    },
    verify: (x) => { // charge passing per second through a cross-section = (electrons in a length v) × e
      const r0 = (x.d * 1e-3) / 2; return x.I / (Math.PI * r0 * r0 * x.nn * 1e28 * 1.6e-19) * 1e3;
    },
  },
};
