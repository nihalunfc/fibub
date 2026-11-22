// Class 12 Physics, Semiconductor Electronics: live problems (original fibub questions). Ids start with c12p-semi-.
import { pick, choose, n, steps } from './_util.js';

const sci = (v, d = 3) => { const e = Math.floor(Math.log10(Math.abs(v))), m = v / 10 ** e; return `${(+m.toPrecision(d)).toString()} × 10<sup>${e < 0 ? '−' + -e : e}</sup>`; };

export default {
  'c12p-semi-wavelength': {
    title: 'longest wavelength that frees a carrier pair',
    make(r) {
      const Eg = choose(r, [0.67, 1.1, 1.4, 1.8, 2.3, 3.4]), lam = 1240 / Eg;
      return { Eg, q: `<p>A semiconductor has a band gap of ${Eg} eV. What is the longest wavelength of light, in nm, that can lift an electron across the gap? (hc = 1240 eV nm)</p>`, answer: lam, unit: 'nm', tol: 0.01,
        hint: 'The photon energy hc/λ must be at least Eg.',
        solution: steps(`hc/λ = Eg gives λ = 1240/${Eg}.`, `λ = <b>${n(lam)} nm</b>. Longer wavelengths (less energy) cannot do it.`) };
    },
    verify: (x) => { const h = 6.626e-34, c = 2.998e8, e = 1.602e-19; return h * c / (x.Eg * e) * 1e9; },
  },
  'c12p-semi-holes': {
    title: 'hole concentration in n-type silicon',
    make(r) {
      const Nd = choose(r, [1e21, 2e21, 5e21, 1e22, 5e22]), ni = 1.5e16, p = ni * ni / Nd / 1e10;
      return { Nd, q: `<p>Silicon (nᵢ = 1.5 × 10<sup>16</sup> m<sup>−3</sup>) is doped with ${sci(Nd, 2)} donor atoms per m³, so that n ≈ N<sub>d</sub>. Find the hole concentration, in units of 10<sup>10</sup> m<sup>−3</sup>.</p>`, answer: p, unit: '× 10¹⁰ m⁻³', tol: 0.01,
        hint: 'Use n p = nᵢ², so p = nᵢ²/n.',
        solution: steps(`n ≈ ${sci(Nd, 2)} m⁻³, nᵢ² = 2.25 × 10<sup>32</sup>.`, `p = 2.25×10<sup>32</sup> ÷ ${sci(Nd, 2)} = ${sci(p * 1e10)} m⁻³ = <b>${n(p)} × 10<sup>10</sup></b> m⁻³.`, 'Far fewer holes than before doping (1.5 × 10¹⁶): the minority carriers are almost wiped out.') };
    },
    verify: (x) => { const lg = 2 * Math.log10(1.5e16) - Math.log10(x.Nd); return 10 ** (lg - 10); },
  },
  'c12p-semi-current': {
    title: 'current through a diode and resistor',
    make(r) {
      const V = choose(r, [3, 5, 6, 9, 12]), R = choose(r, [100, 220, 330, 470, 1000]), Vk = choose(r, [0.7, 0.3]), I = (V - Vk) / R * 1000;
      return { V, R, Vk, q: `<p>A ${Vk === 0.7 ? 'silicon' : 'germanium'} diode (forward drop ${Vk} V) is connected in forward bias in series with a ${R} Ω resistor to a ${V} V battery. Find the current in mA.</p>`, answer: I, unit: 'mA', tol: 0.01,
        hint: 'The diode takes its knee voltage; the rest of the battery voltage is across the resistor.',
        solution: steps(`Voltage across R = ${V} − ${Vk} = ${n(V - Vk)} V.`, `I = ${n(V - Vk)} ÷ ${R} = ${n((V - Vk) / R, 4)} A = <b>${n(I)} mA</b>.`) };
    },
    verify: (x) => (x.V / x.R - x.Vk / x.R) * 1e3,
  },
  'c12p-semi-vdc': {
    title: 'average output of a rectifier',
    make(r) {
      const Vr = choose(r, [6, 9, 12, 15, 18, 24]), full = choose(r, [true, false]), Vm = Vr * Math.SQRT2, Vdc = (full ? 2 : 1) * Vm / Math.PI;
      return { Vr, full, q: `<p>The secondary of a transformer gives ${Vr} V rms to an ideal ${full ? 'full-wave' : 'half-wave'} rectifier with no filter. Find the average (dc) output voltage in V.</p>`, answer: Vdc, unit: 'V', tol: 0.02,
        hint: `Peak V<sub>m</sub> = √2 × rms. Average = ${full ? '2V<sub>m</sub>/π' : 'V<sub>m</sub>/π'}.`,
        solution: steps(`V<sub>m</sub> = ${Vr} × 1.414 = ${n(Vm)} V.`, `V<sub>dc</sub> = ${full ? '2' : ''}V<sub>m</sub>/π = <b>${n(Vdc)} V</b>.`) };
    },
    verify: (x) => { const Vm = x.Vr * Math.SQRT2; let s = 0; const N = 20000; for (let i = 0; i < N; i++) { const v = Vm * Math.sin(2 * Math.PI * (i + 0.5) / N); s += x.full ? Math.abs(v) : Math.max(0, v); } return s / N; },
  },
  'c12p-semi-ripple': {
    title: 'ripple voltage across a smoothing capacitor',
    make(r) {
      const Vp = choose(r, [10, 12, 15]), R = choose(r, [500, 1000, 2000]), C = choose(r, [100, 220, 470, 1000]), dV = (Vp / R) * 0.01 / (C * 1e-6);
      return { Vp, R, C, q: `<p>A full-wave rectifier with a ${C} µF capacitor feeds a ${R} Ω load at about ${Vp} V. Between peaks (10 ms apart, as the ripple frequency is 100 Hz) the capacitor supplies the load current. Estimate the ripple voltage in V.</p>`, answer: dV, unit: 'V', tol: 0.02,
        hint: 'I = V/R. The charge lost is Q = I × 0.01 s, and the voltage drop is ΔV = Q/C.',
        solution: steps(`I = ${Vp}/${R} = ${n(Vp / R * 1000)} mA.`, `Q = I t = ${n(Vp / R)} × 0.01 = ${sci(Vp / R * 0.01)} C.`, `ΔV = Q/C = <b>${n(dV)} V</b>.`) };
    },
    verify: (x) => { const tau = x.R * x.C * 1e-6; return (x.Vp * 0.01) / tau; },
  },
};
