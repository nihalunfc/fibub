// Live problems for Chemical equilibrium.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';
const sci = (v) => { const e = Math.floor(Math.log10(Math.abs(v))), m = v / 10 ** e; return e === 0 ? n(v) : `${n(m)} × 10<sup>${e}</sup>`; };
const RX = [
  ['N<sub>2</sub>(g) + 3H<sub>2</sub>(g) ⇌ 2NH<sub>3</sub>(g)', -2],
  ['PCl<sub>5</sub>(g) ⇌ PCl<sub>3</sub>(g) + Cl<sub>2</sub>(g)', 1],
  ['N<sub>2</sub>O<sub>4</sub>(g) ⇌ 2NO<sub>2</sub>(g)', 1],
  ['2SO<sub>2</sub>(g) + O<sub>2</sub>(g) ⇌ 2SO<sub>3</sub>(g)', -1],
  ['2NH<sub>3</sub>(g) ⇌ N<sub>2</sub>(g) + 3H<sub>2</sub>(g)', 2],
];

export default {
  'eq-kp-kc': {
    title: 'convert Kc to Kp',
    make(r) {
      const [eq, dn] = RX[Math.floor(r() * RX.length)], mant = pick(r, 1, 9.9, 0.1), ex = pick(r, -3, 3), Kc = mant * 10 ** ex, T = pick(r, 300, 900, 10);
      const RT = 0.0821 * T, answer = Kc * RT ** dn;
      return { Kc, T, dn,
        q: `<p>For ${eq} at ${T} K, K<sub>c</sub> = ${sci(Kc)} (concentrations in mol/L). Find K<sub>p</sub> (pressures in atm). Use R = 0.0821 L atm K<sup>−1</sup> mol<sup>−1</sup>.</p>`,
        answer, unit: '', tol: 0.005,
        hint: 'K<sub>p</sub> = K<sub>c</sub>(RT)<sup>Δn</sup>, where Δn = moles of gaseous products − moles of gaseous reactants in the balanced equation.',
        solution: steps(`Δn = ${dn}.`, `RT = 0.0821 × ${T} = ${n(RT, 4)}.`, `K<sub>p</sub> = ${sci(Kc)} × (${n(RT, 4)})<sup>${dn}</sup> = <b>${sci(answer)}</b>.`) };
    },
    verify: (x) => Math.exp(Math.log(x.Kc) + x.dn * Math.log(0.0821 * x.T)),
  },
  'eq-ice-hi': {
    title: 'equilibrium amount from an ICE table',
    make(r) {
      const a = pick(r, 0.5, 3, 0.1), b = pick(r, 0.5, 3, 0.1), K = pick(r, 9, 64), V = pick(r, 1, 10);
      // 4x² = K(a − x)(b − x)  →  (4 − K)x² + K(a + b)x − Kab = 0, root between 0 and min(a, b)
      const A = 4 - K, B = K * (a + b), C = -K * a * b;
      const x = (-B + Math.sqrt(B * B - 4 * A * C)) / (2 * A);
      const xr = x > 0 && x < Math.min(a, b) ? x : (-B - Math.sqrt(B * B - 4 * A * C)) / (2 * A);
      const answer = 2 * xr;
      return { a, b, K,
        q: `<p>${a} mol of H<sub>2</sub> and ${b} mol of I<sub>2</sub> are heated in a sealed ${V} L flask until H<sub>2</sub>(g) + I<sub>2</sub>(g) ⇌ 2HI(g) reaches equilibrium. K<sub>c</sub> = ${K}. How many moles of HI are present at equilibrium?</p>`,
        answer, unit: 'mol', tol: 0.005,
        hint: 'Let x mol of H<sub>2</sub> react. At equilibrium: H<sub>2</sub> = a − x, I<sub>2</sub> = b − x, HI = 2x. Δn = 0, so the volume cancels and you can use moles directly.',
        solution: steps(`K = (2x)² / ((${a} − x)(${b} − x)) = ${K}.`, `Expand: (4 − ${K})x² + ${n(B, 4)}x − ${n(-C, 4)} = 0.`, `The root between 0 and ${Math.min(a, b)} is x = ${n(xr, 4)} mol.`, `HI = 2x = <b>${n(answer, 4)} mol</b>.`) };
    },
    verify: (x) => { let lo = 0, hi = Math.min(x.a, x.b); for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; (4 * m * m - x.K * (x.a - m) * (x.b - m) < 0) ? (lo = m) : (hi = m); } return lo + hi; },
  },
  'eq-alpha-vd': {
    title: 'degree of dissociation from vapour density',
    make(r) {
      const al = pick(r, 0.1, 0.9, 0.05), D = 104.25, d = +(D / (1 + al)).toFixed(2);
      const answer = (D - d) / d;
      return { d,
        q: `<p>PCl<sub>5</sub>(g) ⇌ PCl<sub>3</sub>(g) + Cl<sub>2</sub>(g). Pure PCl<sub>5</sub> (molar mass 208.5) has vapour density 104.25. After heating, the equilibrium mixture has a vapour density of ${d}. Find the degree of dissociation α of PCl<sub>5</sub>.</p>`,
        answer, unit: '', tol: 0.005,
        hint: 'One mole of PCl<sub>5</sub> becomes 1 + α moles in all. Mass is unchanged, so vapour density falls in proportion: D/d = 1 + α.',
        solution: steps('Start with 1 mol: at equilibrium PCl<sub>5</sub> 1 − α, PCl<sub>3</sub> α, Cl<sub>2</sub> α; total 1 + α.', `D/d = 1 + α, so α = (D − d)/d = (104.25 − ${d}) ÷ ${d}.`, `α = <b>${n(answer, 3)}</b> (${n(answer * 100, 3)}% dissociated).`) };
    },
    verify: (x) => 208.5 / (2 * x.d) - 1,
  },
};
