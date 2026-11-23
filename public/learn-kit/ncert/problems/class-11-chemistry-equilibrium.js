// Class 11 Chemistry, Chapter 6 Equilibrium: live problems (original fibub questions). Ids start with c11c-eqm-.
import { pick, choose, n, steps } from './_util.js';

const KC = [
  ['N₂(g) + 3 H₂(g) ⇌ 2 NH₃(g)', [['N₂', 1], ['H₂', 3]], ['NH₃', 2]],
  ['2 SO₂(g) + O₂(g) ⇌ 2 SO₃(g)', [['SO₂', 2], ['O₂', 1]], ['SO₃', 2]],
  ['N₂O₄(g) ⇌ 2 NO₂(g)', [['N₂O₄', 1]], ['NO₂', 2]],
  ['H₂(g) + I₂(g) ⇌ 2 HI(g)', [['H₂', 1], ['I₂', 1]], ['HI', 2]],
];
const KSP = [['AgCl', 1.8e-10, 1, 1], ['BaSO₄', 1.1e-10, 1, 1], ['CaF₂', 3.9e-11, 1, 2], ['Ag₂CrO₄', 1.1e-12, 2, 1]];
const ACIDS = [['ethanoic acid', 4.76], ['methanoic acid', 3.75], ['benzoic acid', 4.20], ['nitrous acid', 3.35]];
export default {
  'c11c-eqm-kc': {
    title: 'equilibrium constant Kc from concentrations',
    make(r) {
      const rx = choose(r, KC), conc = rx[1].map(() => pick(r, 0.1, 1.5, 0.1)), cp = pick(r, 0.1, 1.5, 0.1);
      let K = Math.pow(cp, rx[2][1]); rx[1].forEach(([, nu], i) => { K /= Math.pow(conc[i], nu); });
      return { rx, conc, cp, q: `<p>At equilibrium for ${rx[0]} the concentrations (mol/L) are ${rx[1].map(([nm], i) => `[${nm}] = ${conc[i]}`).join(', ')} and [${rx[2][0]}] = ${cp}. Find Kc.</p>`, answer: K, unit: '', tol: 0.01,
        hint: 'Kc = [products]^coefficient / [reactants]^coefficient, with pure powers from the balanced equation.',
        solution: steps(`Kc = [${rx[2][0]}]${rx[2][1] > 1 ? '<sup>' + rx[2][1] + '</sup>' : ''} / (${rx[1].map(([nm, nu]) => `[${nm}]${nu > 1 ? '<sup>' + nu + '</sup>' : ''}`).join(' × ')}).`, `= ${cp}${rx[2][1] > 1 ? '<sup>' + rx[2][1] + '</sup>' : ''} / (${rx[1].map(([, nu], i) => `${conc[i]}${nu > 1 ? '<sup>' + nu + '</sup>' : ''}`).join(' × ')}) = <b>${n(K)}</b>.`) };
    },
    verify: (x) => { const lp = x.rx[2][1] * Math.log(x.cp) - x.rx[1].reduce((a, [, nu], i) => a + nu * Math.log(x.conc[i]), 0); return Math.exp(lp); },
  },
  'c11c-eqm-kp': {
    title: 'Kp from Kc',
    make(r) {
      const rx = choose(r, [['N₂(g) + 3 H₂(g) ⇌ 2 NH₃(g)', -2], ['2 SO₂(g) + O₂(g) ⇌ 2 SO₃(g)', -1], ['N₂O₄(g) ⇌ 2 NO₂(g)', 1], ['PCl₅(g) ⇌ PCl₃(g) + Cl₂(g)', 1]]), T = choose(r, [400, 500, 600, 700]), Kc = choose(r, [0.5, 2, 8, 25, 60]);
      return { rx, T, Kc, q: `<p>For ${rx[0]} at ${T} K, Kc = ${Kc} (mol/L units). Find Kp, with pressures in atm. (R = 0.0821 L atm K⁻¹ mol⁻¹)</p>`, answer: Kc * Math.pow(0.0821 * T, rx[1]), unit: '', tol: 0.015,
        hint: 'Kp = Kc (RT)<sup>Δn</sup>, where Δn = moles of gaseous products − moles of gaseous reactants.',
        solution: steps(`Δn = ${rx[1]}.`, `RT = 0.0821 × ${T} = ${n(0.0821 * T)}.`, `Kp = ${Kc} × (${n(0.0821 * T)})<sup>${rx[1]}</sup> = <b>${n(Kc * Math.pow(0.0821 * T, rx[1]))}</b>.`) };
    },
    verify: (x) => Math.exp(Math.log(x.Kc) + x.rx[1] * Math.log(0.0821 * x.T)),
  },
  'c11c-eqm-ice': {
    title: 'ICE table: H₂ + I₂ ⇌ 2HI',
    make(r) {
      const c = choose(r, [0.5, 1.0, 1.5, 2.0]), K = choose(r, [25, 49, 50, 64]);
      const s = Math.sqrt(K), x = c * s / (2 + s);
      return { c, K, q: `<p>H₂(g) + I₂(g) ⇌ 2HI(g) has K = ${K} at a certain temperature. ${c} mol/L of H₂ and ${c} mol/L of I₂ are placed in a vessel with no HI. Find the equilibrium concentration of HI in mol/L.</p>`, answer: 2 * x, unit: 'mol/L', tol: 0.01,
        hint: 'Let x mol/L of H₂ react: [H₂] = [I₂] = c − x and [HI] = 2x. Then (2x)² / (c − x)² = K. Take square roots.',
        solution: steps(`[H₂] = [I₂] = ${c} − x, [HI] = 2x.`, `√K = ${n(s)} = 2x / (${c} − x), so x = ${c} × ${n(s)} / (2 + ${n(s)}) = ${n(x)}.`, `[HI] = 2x = <b>${n(2 * x)} mol/L</b>.`) };
    },
    verify: (p) => { const a = 4 - p.K, b = 4 * 0 + p.K * 2 * p.c, d = -p.K * p.c * p.c; const disc = Math.sqrt(b * b - 4 * a * d); const roots = [(-b + disc) / (2 * a), (-b - disc) / (2 * a)]; const xr = roots.find((v) => v > 0 && v < p.c); return 2 * xr; },
  },
  'c11c-eqm-ph': {
    title: 'pH of a strong acid or base',
    make(r) {
      const acid = choose(r, [true, false]), c = choose(r, [0.1, 0.01, 0.001, 0.0005, 0.02, 0.05]);
      return { acid, c, q: `<p>Find the pH of a ${c} mol/L solution of ${acid ? 'hydrochloric acid (a strong acid)' : 'sodium hydroxide (a strong base)'} at 25 °C.</p>`, answer: acid ? -Math.log10(c) : 14 + Math.log10(c), unit: '', tol: 0.01,
        hint: acid ? 'A strong acid is fully ionised, so [H⁺] = c and pH = −log[H⁺].' : 'A strong base gives [OH⁻] = c. pOH = −log[OH⁻] and pH = 14 − pOH.',
        solution: acid ? steps(`[H⁺] = ${c} M.`, `pH = −log ${c} = <b>${n(-Math.log10(c))}</b>.`) : steps(`[OH⁻] = ${c} M, so pOH = −log ${c} = ${n(-Math.log10(c))}.`, `pH = 14 − ${n(-Math.log10(c))} = <b>${n(14 + Math.log10(c))}</b>.`) };
    },
    verify: (x) => (x.acid ? -Math.log10(x.c) : -Math.log10(1e-14 / x.c)),
  },
  'c11c-eqm-weak': {
    title: 'pH of a weak acid',
    make(r) {
      const a = choose(r, ACIDS), c = choose(r, [0.1, 0.05, 0.2, 0.01]), Ka = Math.pow(10, -a[1]), x = (-Ka + Math.sqrt(Ka * Ka + 4 * Ka * c)) / 2;
      return { a, c, Ka, q: `<p>The pKa of ${a[0]} is ${a[1]}. Find the pH of a ${c} mol/L solution (ionisation is small, but use the quadratic if you want the exact value).</p>`, answer: -Math.log10(x), unit: '', tol: 0.01,
        hint: 'Ka = 10<sup>−pKa</sup>. [H⁺] = x with x² / (c − x) = Ka. If x ≪ c, x ≈ √(Ka c).',
        solution: steps(`Ka = 10<sup>−${a[1]}</sup> = ${n(Ka)}.`, `x² + Ka x − Ka c = 0 gives x = ${n(x)} M (approx √(Ka c) = ${n(Math.sqrt(Ka * c))}).`, `pH = −log x = <b>${n(-Math.log10(x))}</b>.`) };
    },
    verify: (p) => { let x = Math.sqrt(p.Ka * p.c); for (let i = 0; i < 60; i++) x = Math.sqrt(p.Ka * (p.c - x)); return -Math.log10(x); },
  },
  'c11c-eqm-buffer': {
    title: 'pH of a buffer (Henderson–Hasselbalch)',
    make(r) {
      const a = choose(r, ACIDS), acid = choose(r, [0.1, 0.2, 0.05, 0.4]), salt = choose(r, [0.05, 0.1, 0.2, 0.3, 0.5]);
      return { a, acid, salt, q: `<p>A buffer has ${acid} mol/L ${a[0]} (pKa = ${a[1]}) and ${salt} mol/L of its sodium salt. Find its pH.</p>`, answer: a[1] + Math.log10(salt / acid), unit: '', tol: 0.01,
        hint: 'pH = pKa + log([salt] / [acid]).',
        solution: steps(`[salt]/[acid] = ${salt}/${acid} = ${n(salt / acid)}.`, `log of that = ${n(Math.log10(salt / acid))}.`, `pH = ${a[1]} + (${n(Math.log10(salt / acid))}) = <b>${n(a[1] + Math.log10(salt / acid))}</b>.`) };
    },
    verify: (x) => -Math.log10(Math.pow(10, -x.a[1]) * x.acid / x.salt),
  },
  'c11c-eqm-ksp': {
    title: 'solubility from the solubility product',
    make(r) {
      const s = choose(r, KSP), [nm, Ksp, a, b] = s, sol = Math.pow(Ksp / (Math.pow(a, a) * Math.pow(b, b)), 1 / (a + b));
      return { s, q: `<p>The solubility product of ${nm} is ${Ksp.toExponential(1).replace('e-', ' × 10⁻')} at 25 °C. Find its solubility in mol/L, in units of 10⁻⁵ mol/L.</p>`, answer: sol * 1e5, unit: '× 10⁻⁵ mol/L', tol: 0.02,
        hint: `If the solubility is s, the ion concentrations are ${a}s and ${b}s, so Ksp = (${a}s)<sup>${a}</sup> (${b}s)<sup>${b}</sup>. Solve for s.`,
        solution: steps(`Ksp = ${a === 1 ? '' : a ** a + ' '}${b === 1 ? '' : b ** b + ' '}s<sup>${a + b}</sup>.`, `s = (${n(Ksp / (Math.pow(a, a) * Math.pow(b, b)))})<sup>1/${a + b}</sup> = ${n(sol)} mol/L.`, `<b>${n(sol * 1e5)} × 10⁻⁵ mol/L</b>.`) };
    },
    verify: (x) => { const [, Ksp, a, b] = x.s; let lo = 0, hi = 1; for (let i = 0; i < 200; i++) { const mid = (lo + hi) / 2; (Math.pow(a * mid, a) * Math.pow(b * mid, b) > Ksp ? (hi = mid) : (lo = mid)); } return lo * 1e5; },
  },
};
