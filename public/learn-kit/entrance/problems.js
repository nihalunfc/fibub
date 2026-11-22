// Live problems for the entrance courses (engineering and medical share them). Each make(rand) returns
// { q, answer, unit, tol (relative), abs?, hint, solution } as small HTML strings; `verify` works the answer out
// another way for tests/entrance.mjs. Placed in a lesson as <div class="problem" data-problem="id"></div>.
import { PATTERNS, score, guessValue } from './exams.js';

const pick = (r, min, max, step = 1) => +(min + Math.floor(r() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
const n = (v, d = 3) => (+(+v).toPrecision(d)).toLocaleString('en-IN', { maximumFractionDigits: 6 });
const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';
const G = 9.8;

export default {
  // ---------- Start here ----------
  'net-score': {
    title: 'work out a net score with negative marks',
    make(r) {
      const id = ['jee-main', 'keam', 'cusat'][Math.floor(r() * 3)], p = PATTERNS[id];
      const total = Object.values(p.q).reduce((a, b) => a + b, 0);
      const tried = pick(r, Math.round(total * 0.5), Math.round(total * 0.9)), right = Math.round(tried * pick(r, 0.6, 0.9, 0.05)), wrong = tried - right;
      const answer = score(p, right, wrong);
      return { id, right, wrong,
        q: `<p>In ${p.name} (right +${p.plus}, wrong −${p.minus}, blank 0) a student attempts ${tried} of ${total} questions and gets ${right} right. What is the score?</p>`,
        answer, unit: 'marks', tol: 0, abs: 0.5,
        hint: `Wrong answers = attempted − right. Each wrong one takes away ${p.minus}.`,
        solution: steps(`Wrong = ${tried} − ${right} = ${wrong}.`, `Marks from right answers = ${right} × ${p.plus} = ${right * p.plus}.`, `Marks lost = ${wrong} × ${p.minus} = ${wrong * p.minus}.`, `Score = ${right * p.plus} − ${wrong * p.minus} = <b>${answer}</b>.`) };
    },
    verify: (x) => x.right * PATTERNS[x.id].plus - x.wrong * PATTERNS[x.id].minus,
  },
  'neet-score': {
    title: 'work out a NEET score',
    make(r) {
      const p = PATTERNS.neet, tried = pick(r, 140, 180), right = Math.round(tried * pick(r, 0.7, 0.95, 0.05)), wrong = tried - right;
      const answer = score(p, right, wrong);
      return { right, wrong,
        q: `<p>In NEET UG (right +4, wrong −1, blank 0) a student attempts ${tried} of 180 questions and gets ${right} right. What is the score out of 720?</p>`,
        answer, unit: 'marks', tol: 0, abs: 0.5,
        hint: 'Wrong answers = attempted − right.',
        solution: steps(`Wrong = ${tried} − ${right} = ${wrong}.`, `Score = 4 × ${right} − 1 × ${wrong} = ${4 * right} − ${wrong} = <b>${answer}</b>.`) };
    },
    verify: (x) => 4 * x.right - x.wrong,
  },
  'guess-value': {
    title: 'is a guess worth it?',
    make(r) {
      const [plus, minus] = [[4, 1], [3, 1], [4, 2], [3, 1]][Math.floor(r() * 4)], left = pick(r, 2, 4);
      const answer = guessValue({ plus, minus }, left);
      return { plus, minus, left,
        q: `<p>A right answer gives +${plus}, a wrong one −${minus}. You have crossed out wrong options and ${left} remain, and you pick one at random. On average, how many marks is the guess worth?</p>`,
        answer, unit: 'marks', tol: 0.005, abs: 0.005,
        hint: `Chance of right = 1/${left}. Expected marks = (chance right) × ${plus} − (chance wrong) × ${minus}.`,
        solution: steps(`P(right) = 1/${left}, P(wrong) = ${left - 1}/${left}.`, `Expected = ${plus}/${left} − ${minus} × ${left - 1}/${left} = (${plus} − ${minus * (left - 1)})/${left} = <b>${n(answer)}</b>.`, answer > 0 ? 'Positive: on average the guess gains marks.' : answer === 0 ? 'Zero: it breaks even.' : 'Negative: on average the guess loses marks.') };
    },
    verify: (x) => (x.plus - x.minus * (x.left - 1)) / x.left,
  },
  // ---------- Units, dimensions and errors ----------
  'pendulum-error': {
    title: 'percentage error in g from a pendulum',
    make(r) {
      const eL = pick(r, 0.1, 1, 0.1), eT = pick(r, 0.1, 1.5, 0.1);
      const answer = eL + 2 * eT;
      return { eL, eT,
        q: `<p>g is found from a pendulum with <i>g</i> = 4π²<i>L</i>/<i>T</i>². The length L is measured with ${eL}% error and the period T with ${eT}% error. What is the largest possible percentage error in g?</p>`,
        answer, unit: '%', tol: 0.001, abs: 0.01,
        hint: 'For a product of powers, percentage errors add, each multiplied by the size of its power. 4π² has no error.',
        solution: steps('Δ<i>g</i>/<i>g</i> = Δ<i>L</i>/<i>L</i> + 2 Δ<i>T</i>/<i>T</i> (the minus sign of the power does not reduce the error: errors always add).', `= ${eL}% + 2 × ${eT}% = <b>${n(answer)}%</b>.`) };
    },
    verify: (x) => x.eL + 2 * x.eT,
  },
  'vernier-read': {
    title: 'read a vernier with a zero error',
    make(r) {
      const N = [10, 20, 25, 50][Math.floor(r() * 4)], s = 1; // N vernier divisions = N−1 main divisions of 1 mm
      const lc = s / N, msr = pick(r, 10, 60), vc = pick(r, 1, N - 1), z = pick(r, -4, 4) * lc;
      const answer = msr + vc * lc - z;
      return { N, msr, vc, z, lc,
        q: `<p>A vernier has ${N} divisions that equal ${N - 1} main-scale divisions of 1 mm. A reading shows main scale ${msr} mm and vernier line ${vc} coinciding. With the jaws closed, the reading was ${z >= 0 ? '+' : ''}${n(z)} mm (zero error). What is the true length in mm?</p>`,
        answer, unit: 'mm', tol: 1e-6, abs: 0.0005,
        hint: 'Least count = 1 main division − 1 vernier division = 1/N mm. True value = reading − zero error.',
        solution: steps(`Least count = 1 − ${N - 1}/${N} = 1/${N} = ${n(lc)} mm.`, `Reading = ${msr} + ${vc} × ${n(lc)} = ${n(msr + vc * lc, 5)} mm.`, `True length = reading − zero error = ${n(msr + vc * lc, 5)} − (${n(z)}) = <b>${n(answer, 5)} mm</b>.`) };
    },
    verify: (x) => x.msr + x.vc / x.N - x.z,
  },
  'error-power': {
    title: 'percentage error of a power formula',
    make(r) {
      const a = pick(r, 1, 3), b = pick(r, 1, 3), c = pick(r, 1, 4), ea = pick(r, 0.5, 2, 0.5), eb = pick(r, 0.5, 2, 0.5), ec = pick(r, 0.5, 3, 0.5);
      const answer = a * ea + b * eb + (c / 2) * ec;
      return { a, b, c, ea, eb, ec,
        q: `<p>A quantity is worked out as <i>P</i> = <i>x</i><sup>${a}</sup> <i>y</i><sup>${b}</sup> / √(<i>z</i><sup>${c}</sup>). The percentage errors in x, y and z are ${ea}%, ${eb}% and ${ec}%. What is the maximum percentage error in P?</p>`,
        answer, unit: '%', tol: 0.001, abs: 0.01,
        hint: '√(z^c) is z to the power c/2. Multiply each percentage error by its power and add them all.',
        solution: steps(`Powers: x → ${a}, y → ${b}, z → ${c}/2 = ${c / 2}.`, `Error = ${a}(${ea}) + ${b}(${eb}) + ${c / 2}(${ec}) = ${a * ea} + ${b * eb} + ${n((c / 2) * ec)} = <b>${n(answer)}%</b>.`) };
    },
    verify: (x) => x.a * x.ea + x.b * x.eb + x.c * x.ec / 2,
  },
  // ---------- Motion in a straight line ----------
  'brake-distance': {
    title: 'stopping distance with a reaction time',
    make(r) {
      const kmh = pick(r, 36, 108, 18), tr = pick(r, 0.4, 1.2, 0.1), a = pick(r, 4, 8, 0.5);
      const u = kmh / 3.6, answer = u * tr + (u * u) / (2 * a);
      return { u, tr, a,
        q: `<p>A car moves at ${kmh} km/h. The driver sees a hazard and reacts after ${tr} s, then brakes with a constant deceleration of ${a} m/s². How far does the car travel from the moment the driver sees the hazard until it stops?</p>`,
        answer, unit: 'm', tol: 0.01,
        hint: 'Change km/h to m/s (divide by 3.6). During the reaction time the speed is constant; then use v² = u² − 2as with v = 0.',
        solution: steps(`u = ${kmh}/3.6 = ${n(u)} m/s.`, `Reaction distance = u × t = ${n(u)} × ${tr} = ${n(u * tr)} m.`, `Braking distance = u²/(2a) = ${n(u * u)}/(2 × ${a}) = ${n((u * u) / (2 * a))} m.`, `Total = <b>${n(answer)} m</b>.`) };
    },
    verify: (x) => x.u * x.tr + (x.u * x.u) / (2 * x.a),
  },
  'throw-up': {
    title: 'a ball thrown up from a tower',
    make(r) {
      const u = pick(r, 5, 25), H = pick(r, 10, 60, 5);
      const answer = (u + Math.sqrt(u * u + 2 * G * H)) / G;
      return { u, H,
        q: `<p>A ball is thrown straight up at ${u} m/s from the top of a tower ${H} m tall. How long after the throw does it hit the ground? (g = 9.8 m/s²)</p>`,
        answer, unit: 's', tol: 0.01,
        hint: 'Take up as positive and the throw point as origin. The ground is at −H. Solve −H = ut − ½gt² and keep the positive root.',
        solution: steps(`−${H} = ${u}t − 4.9t² ⇒ 4.9t² − ${u}t − ${H} = 0.`, `t = [${u} + √(${u}² + 4(4.9)(${H}))] / 9.8 = (${u} + ${n(Math.sqrt(u * u + 2 * G * H), 4)}) / 9.8.`, `<b>t ≈ ${n(answer)} s</b>. (The negative root is a time before the throw and has no meaning here.)`) };
    },
    verify: (x) => { // step the motion numerically
      let y = 0, v = x.u, t = 0; const dt = 1e-4;
      while (y > -x.H) { v -= G * dt; y += v * dt; t += dt; }
      return t;
    },
  },
  'nth-second': {
    title: 'distance in the nth second',
    make(r) {
      const u = pick(r, 0, 10), a = pick(r, 1, 6, 0.5), k = pick(r, 3, 10);
      const answer = u + (a / 2) * (2 * k - 1);
      return { u, a, k,
        q: `<p>A body starts with ${u} m/s and accelerates uniformly at ${a} m/s². How far does it travel during the ${k}th second only?</p>`,
        answer, unit: 'm', tol: 0.001,
        hint: 'Distance in the nth second = s(n) − s(n−1) = u + a(2n − 1)/2. Its unit is still metres.',
        solution: steps(`s<sub>n</sub> = u + (a/2)(2n − 1) = ${u} + (${a}/2)(2 × ${k} − 1).`, `= ${u} + ${a / 2} × ${2 * k - 1} = <b>${n(answer)} m</b>.`) };
    },
    verify: (x) => (x.u * x.k + 0.5 * x.a * x.k * x.k) - (x.u * (x.k - 1) + 0.5 * x.a * (x.k - 1) ** 2),
  },
  'chase': {
    title: 'a police car catches a speeder',
    make(r) {
      const vs = pick(r, 15, 30), a = pick(r, 2, 5, 0.5);
      const answer = (2 * vs) / a;
      return { vs, a,
        q: `<p>A car passes a parked police jeep at a steady ${vs} m/s. At that instant the jeep starts from rest with acceleration ${a} m/s². After how many seconds does the jeep catch the car?</p>`,
        answer, unit: 's', tol: 0.001,
        hint: 'Both start at the same point at t = 0. Set their positions equal: v t = ½ a t².',
        solution: steps(`Car: x = ${vs}t. Jeep: x = ½(${a})t².`, `${vs}t = ${a / 2}t² ⇒ t = 0 (the start) or t = 2 × ${vs}/${a}.`, `<b>t = ${n(answer)} s</b>. At that moment the jeep is moving at a t = ${n(a * answer)} m/s, exactly twice the car's speed.`) };
    },
    verify: (x) => { let t = 0; while (0.5 * x.a * t * t < x.vs * t || t === 0) t += 1e-4; return t; },
  },
  // ---------- Moles and stoichiometry ----------
  'limiting-reagent': {
    title: 'which reactant runs out first?',
    make(r) {
      const mN = pick(r, 14, 84, 7), mH = pick(r, 3, 18, 1); // N2 + 3H2 -> 2NH3
      const nN = mN / 28, nH = mH / 2, ext = Math.min(nN, nH / 3);
      const answer = ext * 2 * 17;
      return { mN, mH,
        q: `<p>${mN} g of nitrogen gas and ${mH} g of hydrogen gas react completely by N<sub>2</sub> + 3H<sub>2</sub> → 2NH<sub>3</sub>. What mass of ammonia forms? (N = 14, H = 1)</p>`,
        answer, unit: 'g', tol: 0.005,
        hint: 'Change both masses to moles. Divide each by its coefficient in the equation: the smaller result is the limiting reagent and sets how far the reaction goes.',
        solution: steps(`n(N<sub>2</sub>) = ${mN}/28 = ${n(nN)} mol; n(H<sub>2</sub>) = ${mH}/2 = ${n(nH)} mol.`, `Divide by coefficients: N<sub>2</sub> ${n(nN)}/1 = ${n(nN)}, H<sub>2</sub> ${n(nH)}/3 = ${n(nH / 3)}. The limiting reagent is <b>${nN <= nH / 3 ? 'N<sub>2</sub>' : 'H<sub>2</sub>'}</b>.`, `NH<sub>3</sub> formed = 2 × ${n(ext)} = ${n(2 * ext)} mol = ${n(2 * ext)} × 17 = <b>${n(answer)} g</b>.`) };
    },
    verify: (x) => 34 * Math.min(x.mN / 28, x.mH / 6),
  },
  'molarity-mix': {
    title: 'mixing two solutions',
    make(r) {
      const M1 = pick(r, 0.1, 2, 0.1), V1 = pick(r, 50, 500, 50), M2 = pick(r, 0.1, 2, 0.1), V2 = pick(r, 50, 500, 50);
      const answer = (M1 * V1 + M2 * V2) / (V1 + V2);
      return { M1, V1, M2, V2,
        q: `<p>${V1} mL of ${M1} M NaCl is mixed with ${V2} mL of ${M2} M NaCl. Assuming the volumes add, what is the molarity of the mixture?</p>`,
        answer, unit: 'M', tol: 0.005,
        hint: 'Moles of solute add, and the volumes add. Molarity = total moles / total volume (millimoles / mL gives M directly).',
        solution: steps(`Millimoles: ${M1} × ${V1} = ${n(M1 * V1)} and ${M2} × ${V2} = ${n(M2 * V2)}; total ${n(M1 * V1 + M2 * V2)} mmol.`, `Volume = ${V1 + V2} mL.`, `M = ${n(M1 * V1 + M2 * V2)}/${V1 + V2} = <b>${n(answer)} M</b>.`) };
    },
    verify: (x) => (x.M1 * x.V1 + x.M2 * x.V2) / (x.V1 + x.V2),
  },
  'molality-from-molarity': {
    title: 'molarity to molality',
    make(r) {
      const M = pick(r, 0.5, 4, 0.5), d = pick(r, 1.02, 1.3, 0.02), Mm = [58.5, 40, 98, 180][Math.floor(r() * 4)];
      const name = { 58.5: 'NaCl', 40: 'NaOH', 98: 'H<sub>2</sub>SO<sub>4</sub>', 180: 'glucose' }[Mm];
      const answer = (1000 * M) / (1000 * d - M * Mm);
      return { M, d, Mm,
        q: `<p>A ${M} M solution of ${name} (molar mass ${Mm} g/mol) has a density of ${d} g/mL. What is its molality?</p>`,
        answer, unit: 'mol/kg', tol: 0.005,
        hint: 'Take 1 L of solution. Its mass is 1000 × density grams; subtract the solute mass to get the solvent mass.',
        solution: steps(`1 L of solution has ${M} mol of solute = ${n(M * Mm)} g, and weighs ${n(1000 * d)} g.`, `Solvent = ${n(1000 * d)} − ${n(M * Mm)} = ${n(1000 * d - M * Mm)} g.`, `m = ${M} / (${n(1000 * d - M * Mm)}/1000) = <b>${n(answer)} mol/kg</b>.`) };
    },
    verify: (x) => x.M / ((x.d * 1000 - x.M * x.Mm) / 1000),
  },
  // ---------- Cell cycle ----------
  'dna-stage': {
    title: 'DNA content at a stage of division',
    make(r) {
      const g1 = pick(r, 4, 40, 2), stages = [['the S phase is over (G2)', 2], ['metaphase of mitosis', 2], ['each daughter cell after mitosis', 1], ['prophase I of meiosis', 2], ['each cell after meiosis I', 1], ['each cell after meiosis II', 0.5]];
      const [st, f] = stages[Math.floor(r() * stages.length)];
      const answer = g1 * f;
      return { g1, f,
        q: `<p>A diploid cell has ${g1} pg of DNA in G1. How much DNA does it have at ${st}?</p>`,
        answer, unit: 'pg', tol: 0.001,
        hint: 'G1 is 2C. S doubles the DNA to 4C. Mitosis gives two 2C cells; meiosis I gives two 2C cells; meiosis II gives four 1C cells.',
        solution: steps(`G1 = 2C = ${g1} pg, so 1C = ${g1 / 2} pg.`, `At ${st} the DNA is ${f * 2}C.`, `${f * 2} × ${g1 / 2} = <b>${n(answer)} pg</b>.`) };
    },
    verify: (x) => x.g1 * x.f,
  },
  // ---------- Atomic structure ----------
  'bohr-wavelength': {
    title: 'wavelength of a spectral line',
    make(r) {
      const Z = pick(r, 1, 3), n1 = pick(r, 1, 3), n2 = n1 + pick(r, 1, 3);
      const dE = 13.6 * Z * Z * (1 / (n1 * n1) - 1 / (n2 * n2)), answer = 1240 / dE;
      const ion = ['H', 'He<sup>+</sup>', 'Li<sup>2+</sup>'][Z - 1];
      return { Z, n1, n2,
        q: `<p>An electron in ${ion} (Z = ${Z}) falls from n = ${n2} to n = ${n1}. What is the wavelength of the light emitted, in nm? (Use E<sub>n</sub> = −13.6 Z²/n² eV and hc = 1240 eV nm.)</p>`,
        answer, unit: 'nm', tol: 0.005,
        hint: 'Energy of the photon = E(upper) − E(lower) = 13.6 Z² (1/n₁² − 1/n₂²) eV. Then λ = 1240/E nm.',
        solution: steps(`ΔE = 13.6 × ${Z * Z} × (1/${n1 * n1} − 1/${n2 * n2}) = ${n(dE, 4)} eV.`, `λ = 1240 / ${n(dE, 4)} = <b>${n(answer, 4)} nm</b>.`) };
    },
    verify: (x) => 1e9 / (1.097e7 * x.Z * x.Z * (1 / x.n1 ** 2 - 1 / x.n2 ** 2)), // Rydberg formula, R = 1.097 × 10⁷ m⁻¹
  },
  // ---------- Sets, relations and functions ----------
  'count-onto': {
    title: 'count the onto functions',
    make(r) {
      const n = pick(r, 2, 4), m = n + pick(r, 0, 2);
      const C = (a, b) => { let x = 1; for (let i = 0; i < b; i++) x = (x * (a - i)) / (i + 1); return x; };
      let answer = 0; const terms = [];
      for (let k = 0; k <= n; k++) { const t = (-1) ** k * C(n, k) * (n - k) ** m; answer += t; terms.push(`${k % 2 ? '−' : k ? '+' : ''} ${C(n, k)}·${n - k}<sup>${m}</sup>`); }
      return { m, n,
        q: `<p>How many functions from a set with ${m} elements onto a set with ${n} elements are there (every element of the second set must be used)?</p>`,
        answer, unit: '', tol: 0, abs: 0.5,
        hint: 'Count all functions, then remove those that miss at least one element of the target, using inclusion and exclusion: Σ (−1)^k C(n, k) (n − k)^m.',
        solution: steps(`All functions: ${n}<sup>${m}</sup>. Remove those missing one chosen element, add back those missing two, and so on.`, `Onto = ${terms.join(' ')}.`, `= <b>${answer}</b>.`) };
    },
    verify: (x) => { let c = 0; const tot = x.n ** x.m; for (let f = 0; f < tot; f++) { const hit = new Set(); let v = f; for (let i = 0; i < x.m; i++) { hit.add(v % x.n); v = Math.floor(v / x.n); } if (hit.size === x.n) c++; } return c; },
  },
  // ---------- Quadratic equations ----------
  'root-sum': {
    title: 'a symmetric function of the roots',
    make(r) {
      const a = pick(r, 1, 3), b = pick(r, -9, 9), c = pick(r, -9, 9) || 1;
      const s = -b / a, p = c / a, answer = s * s * s - 3 * p * s;
      return { a, b, c,
        q: `<p>If α and β are the roots of ${a === 1 ? '' : a}x² ${b < 0 ? '−' : '+'} ${Math.abs(b)}x ${c < 0 ? '−' : '+'} ${Math.abs(c)} = 0, find α³ + β³.</p>`,
        answer, unit: '', tol: 0.001, abs: 0.01,
        hint: 'Do not solve for the roots. Use α + β = −b/a, αβ = c/a and α³ + β³ = (α + β)³ − 3αβ(α + β).',
        solution: steps(`α + β = ${n(s, 4)}, αβ = ${n(p, 4)}.`, `α³ + β³ = (${n(s, 4)})³ − 3(${n(p, 4)})(${n(s, 4)}) = ${n(s ** 3, 5)} − ${n(3 * p * s, 5)} = <b>${n(answer, 5)}</b>.`, 'This works even when the roots are complex.') };
    },
    verify: (x) => { // complex roots allowed: compute with Newton's identity p3 = s·p2 − p·s
      const s = -x.b / x.a, p = x.c / x.a, p2 = s * s - 2 * p; return s * p2 - p * s;
    },
  },
};
