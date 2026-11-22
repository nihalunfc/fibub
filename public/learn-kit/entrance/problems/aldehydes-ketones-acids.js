// Live problems for Aldehydes, ketones and carboxylic acids.
const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';

export default {
  'ak-tollens-silver': {
    title: 'silver from Tollens reagent',
    make(r) {
      const A = [['methanal', 'HCHO', 30, 4], ['ethanal', 'CH<sub>3</sub>CHO', 44, 2], ['propanal', 'C<sub>2</sub>H<sub>5</sub>CHO', 58, 2], ['benzaldehyde', 'C<sub>6</sub>H<sub>5</sub>CHO', 106, 2], ['glucose', 'C<sub>6</sub>H<sub>12</sub>O<sub>6</sub>', 180, 2]];
      const [name, f, M, k] = A[Math.floor(r() * A.length)], g = pick(r, 0.1, 3, 0.1);
      const answer = (g / M) * k * 108;
      return { g, M, k,
        q: `<p>${g} g of ${name} (${f}, M = ${M}) is warmed with excess Tollens reagent. What mass of silver is deposited? (Ag = 108)</p>`,
        answer, unit: 'g', tol: 0.005,
        hint: k === 4 ? 'R-CHO + 2Ag⁺ → R-COOH + 2Ag. Methanal is special: its product, methanoic acid, still has an H-C=O and reduces two more Ag⁺ (on to CO₂).' : 'Each CHO group is oxidised to COOH and gives 2 Ag: R-CHO + 2[Ag(NH₃)₂]⁺ + 3OH⁻ → R-COO⁻ + 2Ag + 4NH₃ + 2H₂O.',
        solution: steps(`Moles of ${name} = ${g}/${M} = ${n(g / M, 4)}.`, `Ag per molecule = ${k}${k === 4 ? ' (HCHO → HCOOH → CO₂)' : ''}; moles of Ag = ${n((g / M) * k, 4)}.`, `Mass = ${n((g / M) * k, 4)} × 108 = <b>${n(answer)} g</b>.`) };
    },
    // electrons: each Ag⁺ takes one electron; the aldehyde gives 2 per CHO oxidised (4 for methanal)
    verify: (x) => (x.g * x.k * 108) / x.M,
  },
  'ak-acid-ph': {
    title: 'pH of a weak carboxylic acid',
    make(r) {
      const A = [['methanoic acid', 3.75], ['ethanoic acid', 4.76], ['benzoic acid', 4.20], ['chloroethanoic acid', 2.87], ['propanoic acid', 4.87]];
      const [name, pKa] = A[Math.floor(r() * A.length)], c = [0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1][Math.floor(r() * 7)];
      const answer = 0.5 * (pKa - Math.log10(c));
      return { pKa, c,
        q: `<p>Find the pH of a ${c} M solution of ${name} (pK<sub>a</sub> = ${pKa}) at 25 °C. Use the usual weak-acid approximation.</p>`,
        answer, unit: '', tol: 0.005, abs: 0.02,
        hint: 'For a weak acid with small dissociation, [H⁺] = √(Ka c), so pH = ½(pKa − log c).',
        solution: steps(`pH = ½(pKa − log c) = ½(${pKa} − (${n(Math.log10(c), 3)})).`, `pH = <b>${n(answer)}</b>.`) };
    },
    verify: (x) => -Math.log10(Math.sqrt(Math.pow(10, -x.pKa) * x.c)),
  },
  'ak-ester-eq': {
    title: 'ester at equilibrium (K = 4)',
    make(r) {
      const a = pick(r, 1, 3, 0.5), b = pick(r, 1, 4, 0.5), K = 4;
      // x²/((a−x)(b−x)) = K → (K−1)x² − K(a+b)x + Kab = 0, smaller root
      const A = K - 1, B = -K * (a + b), C = K * a * b, answer = (-B - Math.sqrt(B * B - 4 * A * C)) / (2 * A);
      return { a, b, K,
        q: `<p>${a} mol of ethanoic acid and ${b} mol of ethanol are heated with a little conc. H<sub>2</sub>SO<sub>4</sub> until equilibrium: CH<sub>3</sub>COOH + C<sub>2</sub>H<sub>5</sub>OH ⇌ CH<sub>3</sub>COOC<sub>2</sub>H<sub>5</sub> + H<sub>2</sub>O, K<sub>c</sub> = 4. How many moles of ester are present at equilibrium?</p>`,
        answer, unit: 'mol', tol: 0.005,
        hint: 'Let x mol of ester form: x mol water too, and (a − x), (b − x) mol of acid and alcohol left. Volumes cancel because the moles on both sides are equal. Solve x²/((a − x)(b − x)) = 4 and keep the root smaller than a and b.',
        solution: steps(`x² = 4(${a} − x)(${b} − x) → 3x² − ${n(4 * (a + b))}x + ${n(4 * a * b)} = 0.`, `x = [${n(4 * (a + b))} − √(${n(B * B)} − ${n(4 * A * C)})]/6.`, `x = <b>${n(answer)} mol</b> (the other root is larger than the starting amounts, so it is rejected).`) };
    },
    // bisection on f(x) = x² − K(a − x)(b − x) in (0, min(a, b))
    verify: (x) => { let lo = 0, hi = Math.min(x.a, x.b); for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; (m * m - x.K * (x.a - m) * (x.b - m) > 0) ? (hi = m) : (lo = m); } return (lo + hi) / 2; },
  },
};
