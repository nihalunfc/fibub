// Live problems for Module 9 of Cosmology A to Z (same contract as ../problems.js; ids must be unique across files).
import * as P from '../phys.js';
import { pick, n, steps } from './util.js';

const HBAR = 1.054571817e-34; // reduced Planck constant, J s
const HBARC = HBAR * P.C;     // ħc, J m

export default {
  // ---------- 9.1 The accelerating universe ----------
  'accelerating-universe-fainter': {
    title: 'how much farther is a fainter supernova?',
    make(r) {
      const dm = pick(r, 0.15, 0.4, 0.01);
      const answer = 100 * (Math.pow(10, dm / 5) - 1);
      const light = 100 * (1 - Math.pow(10, -0.4 * dm));
      return {
        q: `<p>A distant Type Ia supernova looks ${dm} magnitudes fainter than a slowing-down universe predicts. Light falls off as 1/distance², and a difference of Δm magnitudes is a brightness ratio of 10<sup>0.4 Δm</sup>. By what <b>percentage</b> is the supernova farther away than predicted?</p>`,
        answer, unit: '%', tol: 0.01,
        hint: 'Brightness ratio = 10^(0.4 Δm). Distance goes as the square root of the brightness ratio, so the distance ratio is 10^(0.2 Δm).',
        solution: steps(
          `Brightness ratio: 10<sup>0.4 × ${dm}</sup> = ${n(Math.pow(10, 0.4 * dm), 4)}, so we receive ${n(light, 3)}% less light than predicted.`,
          `Distance ratio = √(brightness ratio) = 10<sup>0.2 × ${dm}</sup> = ${n(Math.pow(10, dm / 5), 4)}.`,
          `The supernova is <b>${n(answer)}%</b> farther away than predicted. In 1998 a shift of about 0.25 magnitudes, some 12% in distance, was the sign that the expansion is speeding up.`),
        dm,
      };
    },
    verify: (p) => 100 * (Math.sqrt(Math.pow(10, 0.4 * p.dm)) - 1),
  },
  'accelerating-universe-start': {
    title: 'when did the speeding up begin?',
    make(r) {
      const Om = pick(r, 0.22, 0.4, 0.01), OL = +(1 - Om).toFixed(2);
      const answer = Math.cbrt((2 * OL) / Om) - 1;
      return {
        q: `<p>A flat universe holds Ω<sub>m</sub> = ${Om} of matter and Ω<sub>Λ</sub> = ${OL} of dark energy (a cosmological constant). The expansion switches from slowing to speeding up when matter's pull, ρ<sub>m</sub>/2, falls to the size of dark energy's push, ρ<sub>Λ</sub>. At what <b>redshift</b> did that happen?</p>`,
        answer, unit: '', tol: 0.01,
        hint: 'Matter density grows into the past as (1 + z)³; dark energy stays the same. Solve Ωm (1 + z)³ / 2 = ΩΛ.',
        solution: steps(
          `The acceleration equation's bracket ρ + 3p/c² is ρ<sub>m</sub> − 2ρ<sub>Λ</sub>, so the switch is at ρ<sub>m</sub> = 2ρ<sub>Λ</sub>.`,
          `Ω<sub>m</sub>(1 + z)³ = 2 Ω<sub>Λ</sub>, so (1 + z)³ = 2 × ${OL} ÷ ${Om} = ${n((2 * OL) / Om, 4)}.`,
          `1 + z = ${n(Math.cbrt((2 * OL) / Om), 4)}, so z = <b>${n(answer)}</b>. For our universe (0.31 and 0.69) it is z ≈ 0.65, about 6 billion years ago.`),
        Om, OL,
      };
    },
    verify: (p) => { // find where Ωm(1+z)³/2 − ΩΛ changes sign, by bisection
      let lo = 0, hi = 10;
      for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; (p.Om * (1 + m) ** 3) / 2 - p.OL < 0 ? (lo = m) : (hi = m); }
      return (lo + hi) / 2;
    },
  },

  // ---------- 9.2 The cosmological constant ----------
  'cosmological-constant-density': {
    title: 'how dense is dark energy?',
    make(r) {
      const H0 = pick(r, 64, 74, 0.5), OL = pick(r, 0.64, 0.74, 0.01);
      const rc = P.criticalDensity(H0), answer = OL * rc;
      const Hs = (H0 * 1000) / P.MPC;
      return {
        q: `<p>Take H<sub>0</sub> = ${H0} km/s/Mpc and Ω<sub>Λ</sub> = ${OL}. The critical density is ρ<sub>c</sub> = 3H<sub>0</sub>²/(8πG). What is the density of dark energy, ρ<sub>Λ</sub>, in <b>kg/m³</b>? (1 Mpc = 3.086 × 10<sup>22</sup> m, G = 6.674 × 10<sup>−11</sup> m³ kg⁻¹ s⁻².)</p>`,
        answer, unit: 'kg/m³', tol: 0.01,
        hint: 'Turn H0 into "per second" (km → m, then divide by the metres in a megaparsec), find ρc, then multiply by ΩΛ.',
        solution: steps(
          `H<sub>0</sub> = ${H0} × 1000 ÷ (3.086 × 10<sup>22</sup>) = ${n(Hs)} per second.`,
          `ρ<sub>c</sub> = 3 × (${n(Hs)})² ÷ (8π × 6.674 × 10<sup>−11</sup>) = ${n(rc)} kg/m³.`,
          `ρ<sub>Λ</sub> = ${OL} × ${n(rc)} = <b>${n(answer)} kg/m³</b>, the mass of about ${n(answer / P.M_P, 2)} hydrogen atoms in every cubic metre, the same everywhere and at every time.`),
        H0, OL, Hs,
      };
    },
    // independent: go through Einstein's Λ itself (Λ = 3 ΩΛ H0²/c²) and back with ρΛ = Λc²/(8πG)
    verify: (p) => { const lam = 3 * p.OL * p.Hs * p.Hs / (P.C * P.C); return (lam * P.C * P.C) / (8 * Math.PI * P.G); },
  },
  'cosmological-constant-earth': {
    title: 'the dark energy inside the Earth',
    make(r) {
      const rho = +(pick(r, 5.5, 6.5, 0.1) * 1e-27).toPrecision(2);
      const R = P.R_EARTH, V = (4 / 3) * Math.PI * R ** 3;
      const answer = rho * P.C * P.C * V;
      return {
        q: `<p>Dark energy has a density of ${n(rho)} kg/m³ (as mass), the same in every cubic metre, including the space taken up by the Earth (radius 6,371 km). How much <b>energy, in joules</b>, does a cosmological constant hold in a sphere the size of the Earth? (Use E = mc², c = 3.00 × 10<sup>8</sup> m/s.)</p>`,
        answer, unit: 'J', tol: 0.02,
        hint: 'Energy per cubic metre is ρc². Multiply by the Earth\'s volume, (4/3)πR³.',
        solution: steps(
          `Energy per cubic metre: ${n(rho)} × (3.00 × 10<sup>8</sup>)² = ${n(rho * P.C * P.C)} J/m³.`,
          `Earth's volume: (4/3)π × (6.371 × 10<sup>6</sup> m)³ = ${n(V)} m³.`,
          `Energy = ${n(rho * P.C * P.C)} × ${n(V)} = <b>${n(answer)} J</b>, about what a large power station makes in ten minutes. Dark energy is far too thin to notice nearby; it matters only because the universe holds so much space.`),
        rho,
      };
    },
    verify: (p) => { const m = p.rho * (4 / 3) * Math.PI * P.R_EARTH ** 3; return m * P.C * P.C; },
  },

  // ---------- 9.3 The vacuum energy puzzle ----------
  'vacuum-energy-mismatch': {
    title: 'how wrong is the naive vacuum energy?',
    make(r) {
      const opts = [['the Planck energy', 1.22e28], ['the grand-unification energy', 1e25], ['1 TeV, about the energy of the Large Hadron Collider', 1e12], ['the proton mass energy, 0.94 GeV', 9.38e8], ['the electron mass energy, 0.511 MeV', 5.11e5]];
      const [name, Ec] = opts[Math.min(opts.length - 1, Math.floor(r() * opts.length))];
      const rhoObs = pick(r, 5.0, 5.6, 0.1) * 1e-10;
      const E = Ec * P.EV, rhoVac = E ** 4 / (16 * Math.PI * Math.PI * HBARC ** 3);
      const answer = Math.log10(rhoVac / rhoObs);
      return {
        q: `<p>A rough quantum estimate of the vacuum energy, counting every wave up to a cut-off energy E<sub>c</sub>, gives an energy density ρ<sub>vac</sub> ≈ E<sub>c</sub>⁴ / (16π² (ħc)³). Use a cut-off at ${name} (${n(Ec)} eV; 1 eV = 1.602 × 10<sup>−19</sup> J; ħc = 3.162 × 10<sup>−26</sup> J m). Dark energy is measured at ${n(rhoObs)} J/m³. <b>By how many orders of magnitude</b> (log₁₀ of the ratio) does the estimate overshoot?</p>`,
        answer, unit: 'orders of magnitude', tol: 0.02, abs: 0.3,
        hint: 'Turn E_c into joules, raise it to the 4th power, divide by 16π² × (ħc)³, then take log₁₀ of (estimate ÷ measured).',
        solution: steps(
          `E<sub>c</sub> = ${n(Ec)} × 1.602 × 10<sup>−19</sup> = ${n(E)} J.`,
          `ρ<sub>vac</sub> ≈ (${n(E)})⁴ ÷ (16π² × (3.162 × 10<sup>−26</sup>)³) = ${n(rhoVac)} J/m³.`,
          `Ratio = ${n(rhoVac)} ÷ ${n(rhoObs)} = ${n(rhoVac / rhoObs)}, so the estimate is too big by about <b>${n(answer, 3)} orders of magnitude</b>. With the Planck energy it is about 120; even the lowest sensible cut-offs leave dozens.`),
        Ec, rhoObs,
      };
    },
    verify: (p) => 4 * Math.log10(p.Ec * P.EV) - Math.log10(16 * Math.PI ** 2) - 3 * Math.log10(HBARC) - Math.log10(p.rhoObs),
  },
  'vacuum-energy-scale': {
    title: 'the energy scale of dark energy',
    make(r) {
      const OL = pick(r, 0.65, 0.73, 0.01), H0 = pick(r, 66, 74, 1);
      const rho = OL * P.criticalDensity(H0) * P.C * P.C;
      const answer = Math.pow(rho * HBARC ** 3, 0.25) / P.EV * 1000;
      return {
        q: `<p>With H<sub>0</sub> = ${H0} km/s/Mpc and Ω<sub>Λ</sub> = ${OL}, dark energy holds ${n(rho)} J in each cubic metre. Physicists describe an energy density by a single energy E with E⁴ = ρ (ħc)³. Find E in <b>milli-electronvolts (meV)</b>. (ħc = 3.162 × 10<sup>−26</sup> J m, 1 eV = 1.602 × 10<sup>−19</sup> J.)</p>`,
        answer, unit: 'meV', tol: 0.01,
        hint: 'Multiply ρ by (ħc)³, take the fourth root (square root twice) to get joules, then convert to eV and multiply by 1000.',
        solution: steps(
          `ρ(ħc)³ = ${n(rho)} × (3.162 × 10<sup>−26</sup>)³ = ${n(rho * HBARC ** 3)} J⁴.`,
          `Fourth root: ${n(Math.pow(rho * HBARC ** 3, 0.25))} J = ${n(Math.pow(rho * HBARC ** 3, 0.25) / P.EV)} eV.`,
          `E ≈ <b>${n(answer)} meV</b>. Dark energy "lives" at a few thousandths of an electronvolt, far below the energies of particle physics (the Planck energy is about 10<sup>28</sup> eV). That gap, raised to the 4th power, is the famous mismatch of about 120 orders of magnitude.`),
        rho,
      };
    },
    verify: (p) => Math.exp(0.25 * Math.log(p.rho) + 0.75 * Math.log(HBARC)) / P.EV * 1000,
  },

  // ---------- 9.4 The equation of state w ----------
  'equation-of-state-thinning': {
    title: 'how fast does dark energy thin out?',
    make(r) {
      const w = pick(r, -1.4, -0.6, 0.05), f = pick(r, 2, 4, 1);
      const answer = Math.pow(f, -3 * (1 + w));
      return {
        q: `<p>A kind of dark energy has a constant equation of state w = ${w}, so its density changes as ρ ∝ a<sup>−3(1+w)</sup>. If the universe grows ${f} times bigger, by what <b>factor</b> is its density multiplied? (Less than 1 means it thinned out; more than 1 means it grew denser.)</p>`,
        answer, unit: 'times', tol: 0.01,
        hint: 'Work out the power −3(1 + w) first, then raise the growth factor to it.',
        solution: steps(
          `Power: −3(1 + (${w})) = ${n(-3 * (1 + w) + 0, 3)}.`,
          `Factor: ${f}<sup>${n(-3 * (1 + w) + 0, 3)}</sup> = <b>${n(answer, 3)}</b>.`,
          `${Math.abs(1 + w) < 1e-9 ? 'With w = −1 the density never changes: a cosmological constant.' : w < -1 ? 'With w below −1 the density grows as space grows: "phantom" dark energy, which leads towards a Big Rip (Lesson 9.5).' : 'With w above −1 the density slowly falls, but much more slowly than matter, which would fall by ' + n(f ** 3) + ' times.'}`),
        w, f,
      };
    },
    verify: (p) => Math.exp(-3 * (1 + p.w) * Math.log(p.f)),
  },
  'equation-of-state-q0': {
    title: 'does this dark energy speed things up?',
    make(r) {
      const Om = pick(r, 0.26, 0.36, 0.01), Ode = +(1 - Om).toFixed(2), w = pick(r, -1.3, -0.3, 0.05);
      const answer = Om / 2 + ((1 + 3 * w) * Ode) / 2;
      return {
        q: `<p>A flat universe has Ω<sub>m</sub> = ${Om} of matter and Ω<sub>DE</sub> = ${Ode} of dark energy with w = ${w}. In general q<sub>0</sub> = ½ Σ Ω<sub>i</sub>(1 + 3w<sub>i</sub>), with w = 0 for matter. What is q<sub>0</sub>? (Negative means the expansion is speeding up.)</p>`,
        answer, unit: '', tol: 0.01, abs: 0.005,
        hint: 'Matter contributes Ωm/2. Dark energy contributes ΩDE(1 + 3w)/2. Add them.',
        solution: steps(
          `Matter: ${Om} × (1 + 0) ÷ 2 = ${n(Om / 2)}.`,
          `Dark energy: ${Ode} × (1 + 3 × (${w})) ÷ 2 = ${Ode} × (${n(1 + 3 * w, 3)}) ÷ 2 = ${n(((1 + 3 * w) * Ode) / 2)}.`,
          `q<sub>0</sub> = <b>${n(answer)}</b>: ${answer < 0 ? 'speeding up' : 'slowing down'}. ${w < -1 / 3 ? 'This dark energy pushes (w is below −1/3).' : 'With w above −1/3 dark energy pulls, like ordinary matter, and cannot cause acceleration.'}`),
        Om, Ode, w,
      };
    },
    verify: (p) => (p.Om + p.Ode + 3 * p.w * p.Ode) / 2, // (ρ + 3p) / 2 in units of the critical density
  },

  // ---------- 9.5 The fate of the universe ----------
  'fate-of-universe-rip': {
    title: 'how long until the Big Rip?',
    make(r) {
      const w = pick(r, -2, -1.1, 0.05), H0 = pick(r, 66, 74, 1), Om = pick(r, 0.28, 0.33, 0.01);
      const tH = P.hubbleTimeGyr(H0);
      const answer = (2 / 3) / Math.abs(1 + w) * tH / Math.sqrt(1 - Om);
      return {
        q: `<p>Suppose dark energy is "phantom", with a constant w = ${w}. In a flat universe with H<sub>0</sub> = ${H0} km/s/Mpc and Ω<sub>m</sub> = ${Om}, the time left until a Big Rip is roughly t<sub>rip</sub> ≈ (2/3) × |1 + w|<sup>−1</sup> × (1/H<sub>0</sub>) × (1 − Ω<sub>m</sub>)<sup>−1/2</sup>. How many <b>billion years</b> is that? (1/H<sub>0</sub> = 977.8 ÷ H<sub>0</sub> billion years.)</p>`,
        answer, unit: 'billion years', tol: 0.02,
        hint: 'Find the Hubble time 977.8 / H0, then multiply by 2/3, divide by |1 + w| and divide by √(1 − Ωm).',
        solution: steps(
          `Hubble time: 977.8 ÷ ${H0} = ${n(tH)} billion years.`,
          `|1 + w| = ${n(Math.abs(1 + w), 3)} and √(1 − ${Om}) = ${n(Math.sqrt(1 - Om), 4)}.`,
          `t<sub>rip</sub> ≈ (2/3) × ${n(tH)} ÷ ${n(Math.abs(1 + w), 3)} ÷ ${n(Math.sqrt(1 - Om), 4)} = <b>${n(answer)} billion years</b>. The closer w is to −1, the further away the rip; at exactly w = −1 there is none.`),
        w, H0, Om,
      };
    },
    // independent: integrate dt = d(ln a) / H from today to (nearly) infinite size, with H = H0 √ΩDE a^k (matter ignored, as in the formula)
    verify: (p) => {
      const tH = P.hubbleTimeGyr(p.H0), k = -1.5 * (1 + p.w), s = Math.sqrt(1 - p.Om);
      return P.simpson((x) => Math.exp(-k * x) / s, 0, 40 / k, 4000) * tH; // x = ln a, dt = dx / H
    },
  },
  'fate-of-universe-torn': {
    title: 'when is a galaxy torn apart?',
    make(r) {
      const sys = [['the Milky Way (the Sun takes about 230 million years to go once around it)', 230e6], ['the Earth going around the Sun (1 year)', 1], ['Neptune going around the Sun (165 years)', 165], ['a galaxy cluster (a typical orbit takes about 1 billion years)', 1e9]];
      const [name, Pyr] = sys[Math.min(sys.length - 1, Math.floor(r() * sys.length))];
      const w = pick(r, -2, -1.2, 0.1);
      const answer = (Pyr * Math.sqrt(2 * Math.abs(1 + 3 * w))) / (6 * Math.PI * Math.abs(1 + w));
      return {
        q: `<p>In a Big Rip with w = ${w}, a bound system with orbital period P is pulled apart roughly P √(2|1 + 3w|) / (6π|1 + w|) before the rip (Caldwell, Kamionkowski and Weinberg, 2003). For ${name}, how long before the rip is it torn apart, in <b>years</b>?</p>`,
        answer, unit: 'years', tol: 0.01,
        hint: 'Work out |1 + 3w| and |1 + w| first. Then P × √(2|1 + 3w|) ÷ (6π|1 + w|).',
        solution: steps(
          `|1 + 3w| = ${n(Math.abs(1 + 3 * w), 3)}, so √(2 × ${n(Math.abs(1 + 3 * w), 3)}) = ${n(Math.sqrt(2 * Math.abs(1 + 3 * w)), 4)}.`,
          `6π|1 + w| = 6π × ${n(Math.abs(1 + w), 3)} = ${n(6 * Math.PI * Math.abs(1 + w), 4)}.`,
          `Time before the rip ≈ ${n(Pyr)} × ${n(Math.sqrt(2 * Math.abs(1 + 3 * w)), 4)} ÷ ${n(6 * Math.PI * Math.abs(1 + w), 4)} = <b>${n(answer)} years</b>${answer < 1 ? ` (about ${n(answer * 365.25)} days)` : ''}. Big, loosely bound systems go first; atoms go in the last fraction of a second.`),
        Pyr, w,
      };
    },
    verify: (p) => p.Pyr * Math.sqrt(-2 - 6 * p.w) / (-6 * Math.PI * (1 + p.w)),
  },

  // ---------- 9.6 DESI ----------
  'desi-dark-energy-w': {
    title: 'what was w back then?',
    make(r) {
      const w0 = pick(r, -0.9, -0.6, 0.01), wa = pick(r, -1.4, -0.4, 0.05), z = pick(r, 0.2, 2.5, 0.1);
      const answer = w0 + wa * z / (1 + z);
      return {
        q: `<p>In the w<sub>0</sub>-w<sub>a</sub> description, dark energy's equation of state at redshift z is w(z) = w<sub>0</sub> + w<sub>a</sub> × z/(1 + z). Take w<sub>0</sub> = ${w0} and w<sub>a</sub> = ${wa}, values in the range of DESI's best fits. What was w at redshift z = ${z}?</p>`,
        answer, unit: '', tol: 0.01, abs: 0.005,
        hint: 'Work out z/(1 + z) first (it equals 1 − a, how much the universe has grown since, as a fraction of today\'s size), multiply by wa and add w0.',
        solution: steps(
          `z/(1 + z) = ${z} ÷ ${n(1 + z, 3)} = ${n(z / (1 + z), 4)}.`,
          `w<sub>a</sub> × ${n(z / (1 + z), 4)} = ${n(wa * z / (1 + z), 4)}.`,
          `w(${z}) = ${w0} + (${n(wa * z / (1 + z), 4)}) = <b>${n(answer, 3)}</b>. ${answer < -1 ? 'Below −1 ("phantom") back then, crossing −1 later: the odd behaviour the DESI fits point to.' : 'Above −1 at that time.'}`),
        w0, wa, z,
      };
    },
    verify: (p) => { const a = 1 / (1 + p.z); return p.w0 + p.wa * (1 - a); },
  },
  'desi-dark-energy-crossing': {
    title: 'when did w cross −1?',
    make(r) {
      const w0 = pick(r, -0.9, -0.6, 0.01), wa = pick(r, -1.4, -0.6, 0.05);
      const a = 1 + (1 + w0) / wa, answer = 1 / a - 1;
      return {
        q: `<p>Dark energy with w<sub>0</sub> = ${w0} and w<sub>a</sub> = ${wa} follows w = w<sub>0</sub> + w<sub>a</sub>(1 − a), where a is the size of the universe compared with today. It is above −1 today but was below −1 long ago. At what <b>redshift</b> did w cross −1?</p>`,
        answer, unit: '', tol: 0.01, abs: 0.005,
        hint: 'Set w0 + wa(1 − a) = −1 and solve for a; then z = 1/a − 1.',
        solution: steps(
          `${w0} + (${wa})(1 − a) = −1 gives 1 − a = (−1 − (${w0})) ÷ (${wa}) = ${n(1 - a, 4)}.`,
          `a = ${n(a, 4)}: the universe was ${n(a * 100, 3)}% of today's size.`,
          `z = 1/a − 1 = <b>${n(answer, 3)}</b>, about ${n(P.lookbackGyr(answer, P.PLANCK18), 2)} billion years ago. A constant w = −1 never crosses at all.`),
        w0, wa,
      };
    },
    verify: (p) => { let lo = 0, hi = 50; for (let i = 0; i < 100; i++) { const z = (lo + hi) / 2, w = p.w0 + p.wa * z / (1 + z); w > -1 ? (lo = z) : (hi = z); } return (lo + hi) / 2; },
  },

  // ---------- 9.7 The coincidence problem ----------
  'coincidence-problem-equality': {
    title: 'when were matter and dark energy equal?',
    make(r) {
      const Om = pick(r, 0.22, 0.4, 0.01), OL = +(1 - Om).toFixed(2);
      const answer = Math.cbrt(OL / Om) - 1;
      return {
        q: `<p>A flat universe has Ω<sub>m</sub> = ${Om} and Ω<sub>Λ</sub> = ${OL} today. Matter density grows into the past as (1 + z)³; a cosmological constant stays fixed. At what <b>redshift</b> were their densities equal?</p>`,
        answer, unit: '', tol: 0.01,
        hint: 'Solve Ωm (1 + z)³ = ΩΛ for z.',
        solution: steps(
          `(1 + z)³ = Ω<sub>Λ</sub> ÷ Ω<sub>m</sub> = ${OL} ÷ ${Om} = ${n(OL / Om, 4)}.`,
          `1 + z = ∛${n(OL / Om, 4)} = ${n(Math.cbrt(OL / Om), 4)}.`,
          `z = <b>${n(answer)}</b>. For our universe it is z ≈ 0.3, about 3.6 billion years ago: very recent, in cosmic terms.`),
        Om, OL,
      };
    },
    verify: (p) => Math.exp(Math.log(p.OL / p.Om) / 3) - 1,
  },
  'coincidence-problem-ratio': {
    title: 'the dark energy to matter ratio at another time',
    make(r) {
      const useFuture = r() > 0.5;
      const a = useFuture ? pick(r, 2, 10, 1) : pick(r, 0.05, 0.5, 0.01);
      const Om = 0.31, OL = 0.69, answer = (OL / Om) * a ** 3;
      return {
        q: `<p>Today dark energy and matter are in the ratio Ω<sub>Λ</sub>/Ω<sub>m</sub> = 0.69/0.31. What is the ratio ρ<sub>Λ</sub>/ρ<sub>m</sub> ${useFuture ? `in the future, when the universe is ${a} times its present size` : `at the time when the universe was ${a} of its present size (redshift ${n(1 / a - 1, 3)})`}?</p>`,
        answer, unit: '', tol: 0.01,
        hint: 'Dark energy stays the same while matter density goes as 1/a³, so the ratio goes as a³.',
        solution: steps(
          `Today: 0.69 ÷ 0.31 = ${n(OL / Om, 4)}.`,
          `The ratio grows as a³: ${a}³ = ${n(a ** 3, 4)}.`,
          `ρ<sub>Λ</sub>/ρ<sub>m</sub> = ${n(OL / Om, 4)} × ${n(a ** 3, 4)} = <b>${n(answer, 3)}</b>. ${answer > 10 ? 'Dark energy utterly dominates.' : answer < 0.1 ? 'Dark energy hardly mattered then.' : 'Comparable: the brief window we happen to live in.'}`),
        a,
      };
    },
    verify: (p) => { const z = 1 / p.a - 1; return 0.69 / (0.31 * (1 + z) ** 3); },
  },
};
