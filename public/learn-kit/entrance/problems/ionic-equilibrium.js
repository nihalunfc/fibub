// Live problems for Ionic equilibrium: acids, bases, pH and buffers.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';
const sci = (v) => { const e = Math.floor(Math.log10(Math.abs(v))), m = v / 10 ** e; return `${n(m)} × 10<sup>${e}</sup>`; };
const ACIDS = [['acetic acid', 1.8e-5], ['formic acid', 1.8e-4], ['benzoic acid', 6.3e-5], ['hydrocyanic acid', 4.9e-10], ['propanoic acid', 1.3e-5]];

export default {
  'ie-weak-acid-ph': {
    title: 'pH of a weak acid',
    make(r) {
      const [name, Ka] = ACIDS[Math.floor(r() * ACIDS.length)], C = pick(r, 0.01, 0.5, 0.01);
      const approx = Math.sqrt(Ka * C), exact = (-Ka + Math.sqrt(Ka * Ka + 4 * Ka * C)) / 2, answer = -Math.log10(exact);
      return { Ka, C,
        q: `<p>Find the pH of a ${C} M solution of ${name} (K<sub>a</sub> = ${sci(Ka)}) at 25 °C.</p>`,
        answer, unit: '', tol: 0, abs: 0.03,
        hint: 'For a weak acid HA ⇌ H⁺ + A⁻, K<sub>a</sub> = x²/(C − x). If x is much smaller than C, x ≈ √(K<sub>a</sub>C).',
        solution: steps(`Approximation: [H⁺] ≈ √(K<sub>a</sub>C) = √(${sci(Ka)} × ${C}) = ${sci(approx)} M.`, `Check: α = ${n(approx / C, 2)}, ${approx / C < 0.05 ? 'under 5%, so the approximation is fine' : 'above 5%, so solve the quadratic x² + K<sub>a</sub>x − K<sub>a</sub>C = 0'}: exact [H⁺] = ${sci(exact)} M.`, `pH = −log[H⁺] = <b>${n(answer, 3)}</b>. (Shortcut: pH ≈ ½(pK<sub>a</sub> − log C) = ${n(0.5 * (-Math.log10(Ka) - Math.log10(C)), 3)}.)`) };
    },
    verify: (x) => { let lo = -14, hi = 0; for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2, h = 10 ** m; (h - x.C * x.Ka / (x.Ka + h) > 0) ? (hi = m) : (lo = m); } return -(lo + hi) / 2; },
  },
  'ie-buffer-ph': {
    title: 'pH of a buffer (Henderson equation)',
    make(r) {
      const basic = r() < 0.4, pK = basic ? 4.74 : [4.74, 3.75, 4.2][Math.floor(r() * 3)];
      const a = pick(r, 0.02, 0.5, 0.01), s = pick(r, 0.02, 0.5, 0.01), V = pick(r, 100, 1000, 50);
      const answer = basic ? 14 - (pK + Math.log10(s / a)) : pK + Math.log10(s / a);
      const what = basic ? ['ammonia', 'ammonium chloride', 'pK<sub>b</sub> of NH<sub>3</sub>'] : [pK === 4.74 ? 'acetic acid' : pK === 3.75 ? 'formic acid' : 'benzoic acid', pK === 4.74 ? 'sodium acetate' : pK === 3.75 ? 'sodium formate' : 'sodium benzoate', 'pK<sub>a</sub> of the acid'];
      return { basic, pK, a, s,
        q: `<p>A buffer is made with ${a} mol of ${what[0]} and ${s} mol of ${what[1]} in ${V} mL of solution. The ${what[2]} is ${pK}. Find its pH at 25 °C.</p>`,
        answer, unit: '', tol: 0, abs: 0.02,
        hint: basic ? 'For a basic buffer, pOH = pK<sub>b</sub> + log([salt]/[base]); then pH = 14 − pOH. The volume cancels in the ratio.' : 'pH = pK<sub>a</sub> + log([salt]/[acid]). The volume cancels in the ratio, so moles are enough.',
        solution: basic
          ? steps(`pOH = ${pK} + log(${s}/${a}) = ${pK} + (${n(Math.log10(s / a), 3)}) = ${n(pK + Math.log10(s / a), 4)}.`, `pH = 14 − ${n(pK + Math.log10(s / a), 4)} = <b>${n(answer, 3)}</b>.`)
          : steps(`pH = ${pK} + log(${s}/${a}).`, `= ${pK} + (${n(Math.log10(s / a), 3)}) = <b>${n(answer, 3)}</b>.`, 'When salt and acid are equal, pH = pK<sub>a</sub>: the buffer works best there.') };
    },
    verify: (x) => { const K = 10 ** -x.pK; if (x.basic) { const oh = K * x.a / x.s; return 14 + Math.log10(oh); } return -Math.log10(K * x.a / x.s); },
  },
  'ie-ksp': {
    title: 'molar solubility from Ksp',
    make(r) {
      const types = [['MX', 1, 1], ['MX<sub>2</sub>', 1, 2], ['M<sub>2</sub>X', 2, 1], ['MX<sub>3</sub>', 1, 3]];
      const [f, p, q] = types[Math.floor(r() * types.length)], mant = pick(r, 1, 9.9, 0.1), ex = -pick(r, 8, 20), Ksp = mant * 10 ** ex;
      const coef = p ** p * q ** q, answer = (Ksp / coef) ** (1 / (p + q));
      return { p, qq: q, Ksp,
        q: `<p>A sparingly soluble salt ${f} has K<sub>sp</sub> = ${sci(Ksp)} at 25 °C. Find its molar solubility s in pure water, in mol/L.</p>`,
        answer, unit: 'mol/L', tol: 0.01,
        hint: `If s mol/L dissolves, the ion concentrations are ${p === 1 ? '' : p}s and ${q === 1 ? '' : q}s. Then K<sub>sp</sub> = (${p === 1 ? '' : p}s)<sup>${p}</sup>(${q === 1 ? '' : q}s)<sup>${q}</sup>.`,
        solution: steps(`K<sub>sp</sub> = ${coef === 1 ? '' : coef}s<sup>${p + q}</sup>.`, `s = (${sci(Ksp)} ÷ ${coef})<sup>1/${p + q}</sup>.`, `s = <b>${sci(answer)} mol/L</b>.`) };
    },
    verify: (x) => { let lo = -30, hi = 1; for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2, s = 10 ** m; ((x.p * s) ** x.p * (x.qq * s) ** x.qq > x.Ksp) ? (hi = m) : (lo = m); } return 10 ** ((lo + hi) / 2); },
  },
};
