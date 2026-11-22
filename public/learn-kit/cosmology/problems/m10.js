// Live problems for Module 10 of Cosmology A to Z (same contract as ../problems.js; ids must be unique across files).
import * as P from '../phys.js';
import { pick, n, steps } from './util.js';

const H0 = 67.7, OM = 0.31;
const RHOC = P.criticalDensity(H0);                       // kg/m³
const RHOC_SUN = RHOC * P.MPC ** 3 / P.M_SUN;             // solar masses per Mpc³ (1.27 × 10¹¹)
const KPC = 1e3 * P.PC;
const LYA = 121.567;                                      // Lyman-alpha rest wavelength, nm
const TAU_A = 0.00223;                                    // τ ≈ TAU_A [(1+z)^1.5 − 1] for H + He⁺ ionised (Planck-like, matter era)
const RD = 147.1;                                         // sound horizon at the drag epoch, Mpc (Planck 2018)
const FB = 0.157;                                         // cosmic baryon fraction Ωb/Ωm
const sup = (v) => String(v).replace(/[-0-9]/g, (d) => '⁻⁰¹²³⁴⁵⁶⁷⁸⁹'['-0123456789'.indexOf(d)]);
const simpson = (f, a, b, m = 2000) => { const h = (b - a) / m; let s = f(a) + f(b); for (let i = 1; i < m; i++) s += f(a + i * h) * (i % 2 ? 4 : 2); return (s * h) / 3; };
// erfc by its continued fraction for x > 0.5 and series below (good to 1e-10 here)
const erfc = (x) => {
  if (x < 0.5) { let s = 0, t = x, k = 0; while (Math.abs(t) > 1e-16 && k < 60) { s += t / (2 * k + 1); k++; t *= -x * x / k; } return 1 - (2 / Math.sqrt(Math.PI)) * s; }
  let f = 0; for (let k = 60; k >= 1; k--) f = (k / 2) / (x + f);
  return Math.exp(-x * x) / Math.sqrt(Math.PI) / (x + f);
};
const Ea = (a, Om) => Math.sqrt(Om / a ** 3 + 1 - Om);

export default {
  // ---------- 10.1 The seeds of structure ----------
  'seeds-of-structure-region': {
    title: 'how big a patch of the early universe made a galaxy?',
    make(r) {
      const m = pick(r, 1, 9, 1), e = pick(r, 11, 15, 1), M = m * 10 ** e;
      const rhoM = OM * RHOC_SUN, answer = Math.cbrt((3 * M) / (4 * Math.PI * rhoM));
      return {
        q: `<p>Today a galaxy or cluster holds ${m === 1 ? '' : m + ' × '}10${sup(e)} solar masses of matter. All of it was once spread out at the average density of matter, which in today's (comoving) units is Ω<sub>m</sub>ρ<sub>c</sub> = 0.31 × 1.272 × 10¹¹ = ${n(rhoM)} suns per cubic megaparsec. What was the <b>radius</b> of that sphere, in comoving Mpc?</p>`,
        answer, unit: 'Mpc', tol: 0.02,
        hint: 'Mass = density × volume, with volume (4/3)πR³. Solve for R: R = ∛(3M / (4πρ)).',
        solution: steps(
          `Volume needed: V = M ÷ ρ = ${n(M)} ÷ ${n(rhoM)} = ${n(M / rhoM)} Mpc³.`,
          `R = ∛(3V / 4π) = ∛(${n((3 * M / rhoM) / (4 * Math.PI))}) = <b>${n(answer)} Mpc</b>.`,
          `A Milky Way halo (10¹² suns) came from a ball of radius about 1.8 Mpc in today's units, some 6 million light-years: nearly ten times the radius of its halo now (about 0.2 Mpc). Gravity squeezed it some ten times in radius, several hundred times in density.`),
        M,
      };
    },
    verify: (p) => { const rho = OM * RHOC; return Math.cbrt((3 * p.M * P.M_SUN) / (4 * Math.PI * rho)) / P.MPC; },
  },
  'seeds-of-structure-peaks': {
    title: 'how rare are the highest peaks?',
    make(r) {
      const nu = pick(r, 1, 4, 0.5), answer = 50 * erfc(nu / Math.SQRT2);
      return {
        q: `<p>The starting ripples are a Gaussian random field: at any point the density contrast δ follows a bell curve with spread σ. The first stars and galaxies form where δ is highest. What <b>percentage</b> of space starts out denser than ${nu}σ above average?</p>`,
        answer, unit: '%', tol: 0.02,
        hint: 'For a bell curve, the fraction above νσ is ½ erfc(ν/√2). Rough guides: 1σ → 16%, 2σ → 2.3%, 3σ → 0.13%.',
        solution: steps(
          `Fraction above ${nu}σ = ½ erfc(${nu} ÷ √2) = ½ erfc(${n(nu / Math.SQRT2, 4)}).`,
          `= <b>${n(answer, 3)}%</b> of space.`,
          `Rare high peaks collapse first, and they sit in clumps: the first galaxies formed close together, inside the regions that later became the biggest clusters.`),
        nu,
      };
    },
    verify: (p) => 100 * simpson((x) => Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI), p.nu, 14, 6000),
  },

  // ---------- 10.2 Gravitational instability and the Jeans scale ----------
  'gravitational-instability-jeans': {
    title: 'the Jeans mass of gas after recombination',
    make(r) {
      const T = pick(r, 500, 4000, 100), z = pick(r, 200, 1100, 50);
      const rho = OM * RHOC * (1 + z) ** 3, cs = Math.sqrt((5 / 3) * P.K_B * T / (1.22 * P.M_P));
      const lam = cs * Math.sqrt(Math.PI / (P.G * rho)), answer = (Math.PI / 6) * rho * lam ** 3 / P.M_SUN;
      return {
        q: `<p>At redshift ${z}, gas at ${T} K sits among the dark matter. Take the matter density as ρ = Ω<sub>m</sub>ρ<sub>c</sub>(1+z)³ with Ω<sub>m</sub>ρ<sub>c</sub> = ${n(OM * RHOC)} kg/m³, the sound speed c<sub>s</sub> = √(γkT/μm<sub>p</sub>) with γ = 5/3 and μ = 1.22, the Jeans length λ<sub>J</sub> = c<sub>s</sub>√(π/Gρ) and the Jeans mass M<sub>J</sub> = (π/6)ρλ<sub>J</sub>³. What is M<sub>J</sub> in <b>solar masses</b>?</p>`,
        answer, unit: 'solar masses', tol: 0.02,
        hint: 'Work in SI: k = 1.381 × 10⁻²³ J/K, m_p = 1.673 × 10⁻²⁷ kg, G = 6.674 × 10⁻¹¹. Divide the mass by 1.989 × 10³⁰ kg.',
        solution: steps(
          `ρ = ${n(OM * RHOC)} × ${1 + z}³ = ${n(rho)} kg/m³.`,
          `c<sub>s</sub> = √(5/3 × 1.381 × 10⁻²³ × ${T} ÷ (1.22 × 1.673 × 10⁻²⁷)) = ${n(cs / 1e3)} km/s.`,
          `λ<sub>J</sub> = ${n(cs)} × √(π ÷ (6.674 × 10⁻¹¹ × ${n(rho)})) = ${n(lam)} m = ${n(lam / P.PC)} parsecs.`,
          `M<sub>J</sub> = (π/6) × ${n(rho)} × (${n(lam)})³ = ${n(answer * P.M_SUN)} kg = <b>${n(answer)} solar masses</b>.`,
          `About the mass of a globular star cluster. Smaller lumps of gas could not collapse until they cooled; dark matter, with no pressure, had no such limit.`),
        T, z,
      };
    },
    // closed form: M_J = (π/6) (π γ k T / (G μ m_p))^{3/2} ρ^{-1/2}
    verify: (p) => { const rho = OM * RHOC * (1 + p.z) ** 3; return (Math.PI / 6) * Math.pow(Math.PI * (5 / 3) * P.K_B * p.T / (P.G * 1.22 * P.M_P), 1.5) / Math.sqrt(rho) / P.M_SUN; },
  },
  'gravitational-instability-suppression': {
    title: 'how much has dark energy slowed the growth of lumps?',
    make(r) {
      const Om = pick(r, 0.25, 0.5, 0.01), OL = 1 - Om;
      const den = Om ** (4 / 7) - OL + (1 + Om / 2) * (1 + OL / 70), answer = 100 * 2.5 * Om / den;
      return {
        q: `<p>In a flat universe with Ω<sub>m</sub> = ${Om} and Ω<sub>Λ</sub> = ${OL.toFixed(2)}, how big are lumps today as a <b>percentage</b> of what they would be in a matter-only universe (where δ ∝ a)? Use the handy formula of Carroll, Press and Turner (1992): g = (5/2)Ω<sub>m</sub> ÷ [Ω<sub>m</sub><sup>4/7</sup> − Ω<sub>Λ</sub> + (1 + Ω<sub>m</sub>/2)(1 + Ω<sub>Λ</sub>/70)].</p>`,
        answer, unit: '%', tol: 0.01,
        hint: 'Work out Ω_m^(4/7) first (use x^(4/7) = e^((4/7) ln x)), then the bracket, then divide.',
        solution: steps(
          `Ω<sub>m</sub><sup>4/7</sup> = ${Om}<sup>0.5714</sup> = ${n(Om ** (4 / 7), 4)}.`,
          `Bracket: ${n(Om ** (4 / 7), 4)} − ${OL.toFixed(2)} + (1 + ${n(Om / 2, 3)})(1 + ${n(OL / 70, 3)}) = ${n(den, 4)}.`,
          `g = 2.5 × ${Om} ÷ ${n(den, 4)} = ${n(answer / 100, 4)}, so <b>${n(answer, 3)}%</b>.`,
          `The rest of the growth never happened: once dark energy takes over, space stretches too fast for gravity to keep pulling lumps together.`),
        Om,
      };
    },
    // exact growth factor for flat matter + Λ (Heath 1977): D(1) = (5Ωm/2) E(1) ∫₀¹ da / (a E)³, with E(1) = 1
    verify: (p) => 100 * 2.5 * p.Om * simpson((a) => (a <= 0 ? 0 : 1 / (a * Ea(a, p.Om)) ** 3), 0, 1, 4000),
  },

  // ---------- 10.3 Dark matter halos ----------
  'dark-matter-halos-r200': {
    title: 'the size of a dark matter halo',
    make(r) {
      const m = pick(r, 1, 9, 1), e = pick(r, 10, 14, 1), M = m * 10 ** e;
      const rhoKpc = RHOC_SUN / 1e9, answer = Math.cbrt((3 * M) / (4 * Math.PI * 200 * rhoKpc));
      const v = Math.sqrt(4.30091e-6 * M / answer);
      return {
        q: `<p>A halo's edge r<sub>200</sub> is drawn where its average density is 200 times the critical density, ρ<sub>c</sub> = ${n(rhoKpc, 4)} solar masses per cubic kiloparsec (for H<sub>0</sub> = ${H0}). A halo has M<sub>200</sub> = ${m === 1 ? '' : m + ' × '}10${sup(e)} suns. What is r<sub>200</sub> in <b>kpc</b>?</p>`,
        answer, unit: 'kpc', tol: 0.02,
        hint: 'M200 = (4/3)π r200³ × 200 ρc. Solve for r200 = ∛(3 M200 / (800 π ρc)).',
        solution: steps(
          `200ρ<sub>c</sub> = ${n(200 * rhoKpc, 4)} suns/kpc³.`,
          `r<sub>200</sub>³ = 3 × ${n(M)} ÷ (4π × ${n(200 * rhoKpc, 4)}) = ${n(answer ** 3)} kpc³.`,
          `r<sub>200</sub> = <b>${n(answer)} kpc</b>. An orbit at that edge goes at v<sub>200</sub> = √(GM/r) ≈ ${n(v)} km/s.`,
          `The visible galaxy is tiny in comparison: the Milky Way's star disc is about 15 kpc in radius, inside a halo of roughly 200 kpc.`),
        M,
      };
    },
    verify: (p) => Math.cbrt((3 * p.M * P.M_SUN) / (4 * Math.PI * 200 * RHOC)) / KPC,
  },
  'dark-matter-halos-collapse': {
    title: 'when does a lump collapse?',
    make(r) {
      const d = pick(r, 0.004, 0.012, 0.0005), answer = (1001 * d) / 1.686 - 1;
      return {
        q: `<p>At redshift 1000 a region of dark matter is ${n(d * 100, 3)}% denser than average (δ = ${d}). Assume a matter-only universe, where small lumps grow in step with the scale factor, δ ∝ a = 1/(1+z). Spherical-collapse theory says the region becomes a halo when this linear δ reaches 1.686. At what <b>redshift</b> does that happen?</p>`,
        answer, unit: '', abs: 0.03, tol: 0.01,
        hint: 'δ(z) = δ_start × (1 + 1000) / (1 + z). Set it equal to 1.686 and solve for 1 + z.',
        solution: steps(
          `δ grows by (1001)/(1+z), so 1.686 = ${d} × 1001 ÷ (1 + z).`,
          `1 + z = ${d} × 1001 ÷ 1.686 = ${n(answer + 1, 4)}.`,
          `z = <b>${n(answer, 3)}</b>. Bigger starting lumps collapse earlier. (With dark energy, growth slows at low redshift, so late collapses happen a little later still.)`),
        d,
      };
    },
    verify: (p) => { let lo = 1e-3, hi = 1; for (let k = 0; k < 60; k++) { const m = (lo + hi) / 2; p.d * m / (1 / 1001) < 1.686 ? (lo = m) : (hi = m); } return 1 / lo - 1; },
  },

  // ---------- 10.4 The cosmic web ----------
  'cosmic-web-density': {
    title: 'how dense is a filament?',
    make(r) {
      const fm = pick(r, 40, 55, 1), fv = pick(r, 5, 10, 1), answer = fm / fv;
      return {
        q: `<p>In a simulation, filaments hold ${fm}% of all the mass but fill only ${fv}% of the volume. On average, how many <b>times denser than the cosmic average</b> is a filament?</p>`,
        answer, unit: '× average', tol: 0.01,
        hint: 'Average density of a part = its share of the mass ÷ its share of the volume (in units of the cosmic average).',
        solution: steps(
          `Density ÷ average = (mass share) ÷ (volume share) = ${fm}% ÷ ${fv}%.`,
          `= <b>${n(answer, 3)} times</b> the average.`,
          `Voids are the opposite: most of the volume, little of the mass, so they are only a fraction of the average density.`),
        fm, fv,
      };
    },
    verify: (p) => { const Mtot = 1e17, Vtot = 1e6; return ((p.fm / 100) * Mtot / ((p.fv / 100) * Vtot)) / (Mtot / Vtot); },
  },
  'cosmic-web-crossing': {
    title: 'is the cosmic web frozen?',
    make(r) {
      const v = pick(r, 200, 600, 50), answer = v * 1e3 * 13.8 * P.GYR / P.MPC;
      return {
        q: `<p>Galaxies drift through the web at a few hundred km/s on top of the expansion. If a galaxy moved at ${v} km/s for the entire 13.8 billion years, how far would it go, in <b>Mpc</b>? (Compare with filaments tens of Mpc long.)</p>`,
        answer, unit: 'Mpc', tol: 0.01,
        hint: 'Distance = speed × time. 1 Gyr = 3.156 × 10¹⁶ s; 1 Mpc = 3.086 × 10¹⁹ km.',
        solution: steps(
          `Time: 13.8 × 3.156 × 10¹⁶ s = ${n(13.8 * P.GYR)} s.`,
          `Distance: ${v} km/s × ${n(13.8 * P.GYR)} s = ${n(v * 13.8 * P.GYR)} km.`,
          `÷ 3.086 × 10¹⁹ km per Mpc = <b>${n(answer)} Mpc</b>.`,
          `Even this is an overestimate (drift speeds were slower in the past, in today's units), and it is small next to the web's tens to hundreds of Mpc. The pattern we map today is nearly the pattern written into the first ripples.`),
        v,
      };
    },
    verify: (p) => (p.v / (P.C / 1e3)) * 13.8e9 * P.LY / P.MPC,
  },

  // ---------- 10.5 The first stars and reionisation ----------
  'first-stars-reionisation-trough': {
    title: 'where is the Gunn-Peterson trough?',
    make(r) {
      const z = pick(r, 5.7, 7.5, 0.1), answer = LYA * (1 + z);
      return {
        q: `<p>A quasar shines at redshift ${z}. Neutral hydrogen absorbs at the Lyman-alpha wavelength, 121.6 nm, in its own rest frame. Light from the quasar is absorbed by hydrogen along the way wherever it has been stretched to 121.6 nm, so the absorption (and, if the gas is neutral, the dark trough) sits just blueward of the quasar's own Lyman-alpha line. At what observed wavelength is that line, in <b>nm</b>?</p>`,
        answer, unit: 'nm', tol: 0.005,
        hint: 'Observed wavelength = emitted × (1 + z).',
        solution: steps(
          `λ<sub>obs</sub> = 121.6 nm × (1 + ${z}) = <b>${n(answer, 4)} nm</b>.`,
          `That is in the near infrared, beyond what eyes see. Everything just shortward of it was emitted at shorter wavelengths and redshifted down onto 121.6 nm somewhere between the quasar and us, so any neutral hydrogen there removes it.`),
        z,
      };
    },
    verify: (p) => P.hydrogenLine(1, 2) * 1e9 * (1 + p.z),
  },
  'first-stars-reionisation-tau': {
    title: 'when did reionisation happen, from the CMB?',
    make(r) {
      const tau = pick(r, 0.045, 0.065, 0.001), answer = (tau / TAU_A + 1) ** (2 / 3) - 1;
      return {
        q: `<p>Free electrons after reionisation scatter a small fraction τ of the CMB's light. If all the hydrogen were ionised at once at redshift z<sub>re</sub> and stayed ionised, then in a universe like ours (matter era) τ ≈ 0.00223 × [(1 + z<sub>re</sub>)<sup>3/2</sup> − 1]. A CMB experiment measures τ = ${tau}. What is z<sub>re</sub>?</p>`,
        answer, unit: '', abs: 0.05, tol: 0.01,
        hint: 'Solve for (1 + z)^(3/2) = τ / 0.00223 + 1, then raise both sides to the power 2/3.',
        solution: steps(
          `(1 + z)<sup>3/2</sup> = ${tau} ÷ 0.00223 + 1 = ${n(tau / TAU_A + 1, 4)}.`,
          `1 + z = ${n(tau / TAU_A + 1, 4)}<sup>2/3</sup> = ${n(answer + 1, 4)}, so z<sub>re</sub> ≈ <b>${n(answer, 3)}</b>.`,
          `Planck's τ = 0.054 gives about 7.7 with the full calculation: the universe was half ionised some 650-700 million years after the Big Bang.`),
        tau,
      };
    },
    verify: (p) => { let lo = 0, hi = 30; for (let k = 0; k < 80; k++) { const m = (lo + hi) / 2; TAU_A * ((1 + m) ** 1.5 - 1) < p.tau ? (lo = m) : (hi = m); } return lo; },
  },

  // ---------- 10.6 How galaxies form ----------
  'galaxy-formation-freefall': {
    title: 'how long does a gas cloud take to collapse?',
    make(r) {
      const e = pick(r, -1, 2, 1), m = pick(r, 1, 9, 1), nH = m * 10 ** e;
      const rho = nH * 1e6 * P.M_P, answer = Math.sqrt((3 * Math.PI) / (32 * P.G * rho)) / (1e6 * P.YEAR);
      return {
        q: `<p>A cloud of hydrogen holds ${n(nH)} atoms per cubic centimetre (each 1.673 × 10⁻²⁷ kg). With nothing holding it up, it collapses in the free-fall time t<sub>ff</sub> = √(3π / (32Gρ)). How long is that, in <b>million years</b>?</p>`,
        answer, unit: 'million years', tol: 0.02,
        hint: 'Turn atoms per cm³ into kg per m³: multiply by 10⁶ (cm³ in a m³) and by the mass of an atom. One million years = 3.156 × 10¹³ s.',
        solution: steps(
          `ρ = ${n(nH)} × 10⁶ × 1.673 × 10⁻²⁷ = ${n(rho)} kg/m³.`,
          `t<sub>ff</sub> = √(3π ÷ (32 × 6.674 × 10⁻¹¹ × ${n(rho)})) = ${n(answer * 1e6 * P.YEAR)} s.`,
          `÷ 3.156 × 10¹³ s = <b>${n(answer)} million years</b>. Denser clouds fall faster (t ∝ 1/√ρ). Real gas first has to cool, so cooling often sets the pace.`),
        nH,
      };
    },
    // uniform ball of radius R and mass M = (4/3)πR³ρ falls in (π/2)√(R³/2GM)
    verify: (p) => { const rho = p.nH * 1e6 * P.M_P, R = 1, M = (4 / 3) * Math.PI * R ** 3 * rho; return (Math.PI / 2) * Math.sqrt(R ** 3 / (2 * P.G * M)) / (1e6 * P.YEAR); },
  },
  'galaxy-formation-efficiency': {
    title: 'how much of a halo\'s gas became stars?',
    make(r) {
      const M = pick(r, 0.6, 3, 0.2) * 1e12, Ms = pick(r, 2, 8, 0.5) * 1e10, answer = 100 * Ms / (FB * M);
      return {
        q: `<p>A galaxy has ${n(Ms)} suns of stars in a dark matter halo of ${n(M)} suns in total. The universe's matter is 15.7% atoms (Ω<sub>b</sub>/Ω<sub>m</sub> = 0.157). What <b>percentage</b> of the atoms this halo should hold ended up in stars?</p>`,
        answer, unit: '%', tol: 0.01,
        hint: 'Fair share of atoms = 0.157 × halo mass. Then stars ÷ fair share.',
        solution: steps(
          `Fair share of atoms: 0.157 × ${n(M)} = ${n(FB * M)} suns.`,
          `Stars ÷ that = ${n(Ms)} ÷ ${n(FB * M)} = <b>${n(answer, 3)}%</b>.`,
          `Even the most efficient galaxies turn only about a fifth to a third of their atoms into stars; the rest is hot gas in the halo or was blown out by feedback.`),
        M, Ms,
      };
    },
    verify: (p) => { const Ob = 0.0490, Om = Ob / FB; return (p.Ms / p.M) / (Ob / Om) * 100; },
  },

  // ---------- 10.7 Baryon acoustic oscillations ----------
  'baryon-acoustic-oscillations-angle': {
    title: 'how big does the BAO ruler look on the sky?',
    make(r) {
      const z = pick(r, 0.3, 2.3, 0.1), D = P.transverseMpc(z, P.PLANCK18), answer = (RD / D) * 180 / Math.PI;
      return {
        q: `<p>The BAO ruler is r<sub>d</sub> = 147.1 Mpc (comoving). Galaxies at redshift ${z} are at a comoving distance of D<sub>M</sub> = ${n(D, 4)} Mpc. What <b>angle</b> does the ruler span across the sky there, in degrees?</p>`,
        answer, unit: 'degrees', tol: 0.01,
        hint: 'Small angles: angle in radians = size ÷ distance (both comoving). Multiply by 180/π for degrees.',
        solution: steps(
          `θ = 147.1 ÷ ${n(D, 4)} = ${n(RD / D, 4)} radians.`,
          `× 57.30 = <b>${n(answer, 3)}°</b>.`,
          `Measure this angle and you know D<sub>M</sub>(z) = r<sub>d</sub> ÷ θ: a distance from a ruler, not a candle. Nearby it spans a dozen or more Moon widths; at z ≈ 2 only about three.`),
        z,
      };
    },
    // comoving distance by integrating over the scale factor instead of redshift: D = (c/H0) ∫ da / (a² E)
    verify: (p) => { const a0 = 1 / (1 + p.z); const D = simpson((a) => 1 / (a * a * P.E(1 / a - 1, P.PLANCK18)), a0, 1, 4000) * P.hubbleDistMpc(P.PLANCK18.H0); return (RD / D) * 180 / Math.PI; },
  },
  'baryon-acoustic-oscillations-dz': {
    title: 'the BAO ruler along the line of sight',
    make(r) {
      const z = pick(r, 0.3, 2.3, 0.1), d0 = P.comovingMpc(z, P.PLANCK18);
      let lo = z, hi = z + 1; for (let k = 0; k < 50; k++) { const m = (lo + hi) / 2; P.comovingMpc(m, P.PLANCK18) - d0 < RD ? (lo = m) : (hi = m); }
      const answer = lo - z, Hz = P.PLANCK18.H0 * P.E(z, P.PLANCK18);
      return {
        q: `<p>Two galaxies lie one behind the other, exactly 147.1 Mpc apart (comoving), the nearer at redshift ${z}. There the expansion rate is H(z) = ${n(Hz, 4)} km/s/Mpc. How much higher is the far one's <b>redshift</b>? (Use Δz ≈ r<sub>d</sub> H(z) / c.)</p>`,
        answer, unit: '', tol: 0.03,
        hint: 'Along the line of sight, a comoving step Δd needs Δz = Δd × H(z) / c, with c = 299,792 km/s.',
        solution: steps(
          `Δz ≈ 147.1 × ${n(Hz, 4)} ÷ 299,792 = ${n(RD * Hz / 299792.458, 3)}.`,
          `Allowing for H changing a little across the gap: <b>Δz = ${n(answer, 3)}</b>.`,
          `So the BAO bump along the line of sight measures H(z) directly. Across the sky it measures distance; along it, the expansion rate. That is how DESI tracks dark energy.`),
        z,
      };
    },
    // H evaluated at the middle of the gap (second-order accurate), found by iteration
    verify: (p) => { let dz = RD * P.E(p.z, P.PLANCK18) * P.PLANCK18.H0 / 299792.458; for (let k = 0; k < 6; k++) { const zm = p.z + dz / 2; dz = RD * P.E(zm, P.PLANCK18) * P.PLANCK18.H0 / 299792.458; } return dz; },
  },

  // ---------- 10.8 Galaxy surveys ----------
  'galaxy-surveys-volume': {
    title: 'how much space does a survey map?',
    make(r) {
      const A = pick(r, 5000, 15000, 1000), z = pick(r, 0.4, 1.2, 0.1), D = P.comovingMpc(z, P.PLANCK18);
      const f = A / 41253, answer = f * (4 / 3) * Math.PI * D ** 3 / 1e9;
      return {
        q: `<p>A survey covers ${n(A)} square degrees of sky (the whole sky is 41,253) out to redshift ${z}, which is ${n(D, 4)} Mpc away (comoving). What volume does it map, in <b>cubic gigaparsecs</b> (Gpc³; 1 Gpc = 1,000 Mpc)?</p>`,
        answer, unit: 'Gpc³', tol: 0.01,
        hint: 'The full sphere has volume (4/3)πD³. The survey gets the fraction (area ÷ 41,253) of it.',
        solution: steps(
          `Fraction of the sky: ${n(A)} ÷ 41,253 = ${n(f, 3)}.`,
          `Full sphere: (4/3)π × (${n(D / 1e3, 4)} Gpc)³ = ${n((4 / 3) * Math.PI * (D / 1e3) ** 3)} Gpc³.`,
          `Survey: <b>${n(answer)} Gpc³</b>. A sphere 147 Mpc in radius is about 0.013 Gpc³, so this volume holds hundreds of independent BAO spheres: the more of them, the sharper the ruler.`),
        A, z,
      };
    },
    verify: (p) => { const a0 = 1 / (1 + p.z); const D = simpson((a) => 1 / (a * a * P.E(1 / a - 1, P.PLANCK18)), a0, 1, 4000) * P.hubbleDistMpc(P.PLANCK18.H0); const sr = p.A * (Math.PI / 180) ** 2; return (sr / 3) * D ** 3 / 1e9; },
  },
  'galaxy-surveys-fingers': {
    title: 'fingers of God',
    make(r) {
      const s = pick(r, 400, 1200, 100), answer = s / H0;
      return {
        q: `<p>Galaxies in a cluster swarm about with a speed spread of ${s} km/s along our line of sight. A redshift survey turns each galaxy's redshift into a distance with Hubble's law, d = v/H<sub>0</sub> (H<sub>0</sub> = ${H0} km/s/Mpc). By how many <b>Mpc</b> does that spread smear the cluster out along the line of sight (one spread, ±)?</p>`,
        answer, unit: 'Mpc', tol: 0.01,
        hint: 'A speed error Δv becomes a distance error Δd = Δv ÷ H₀.',
        solution: steps(
          `Δd = ${s} ÷ ${H0} = <b>${n(answer, 3)} Mpc</b> each way.`,
          `A cluster only about 2 Mpc across looks like a long finger pointing at us: the "finger of God". Its stretch measures the cluster's mass. The opposite effect on large scales, matter falling into walls, squashes them and measures how fast structure grows.`),
        s,
      };
    },
    verify: (p) => (p.s * 1e3) * P.hubbleTimeGyr(H0) * P.GYR / P.MPC,
  },

  // ---------- 10.9 Cosmological simulations ----------
  'cosmological-simulations-particle': {
    title: 'how heavy is one simulation particle?',
    make(r) {
      const L = pick(r, 300, 1000, 50), k = pick(r, 1024, 4096, 256), N = k ** 3;
      const answer = OM * RHOC_SUN * L ** 3 / N;
      return {
        q: `<p>A simulation box is ${L} Mpc on a side (comoving) and holds ${k}³ = ${n(N)} particles of dark matter. The average matter density is Ω<sub>m</sub>ρ<sub>c</sub> = 0.31 × 1.272 × 10¹¹ suns per Mpc³. What is the mass of <b>one particle</b>, in solar masses?</p>`,
        answer, unit: 'solar masses', tol: 0.02,
        hint: 'Total mass in the box = density × L³. Share it equally among N particles.',
        solution: steps(
          `Total: ${n(OM * RHOC_SUN)} × ${L}³ = ${n(OM * RHOC_SUN * L ** 3)} suns.`,
          `Per particle: ÷ ${n(N)} = <b>${n(answer)} suns</b>.`,
          `Each "particle" is a whole cloud of dark matter heavier than a million suns, not a real particle. A halo needs a hundred or more of them to be trusted, so the smallest reliable halo here is about ${n(100 * answer)} suns.`),
        L, N,
      };
    },
    verify: (p) => OM * RHOC * (p.L * P.MPC) ** 3 / p.N / P.M_SUN,
  },
  'cosmological-simulations-cost': {
    title: 'why not add up every pull directly?',
    make(r) {
      const e = pick(r, 7, 10, 1), m = pick(r, 1, 9, 1), N = m * 10 ** e;
      const answer = (N * (N - 1) / 2) / 1e15 / 3600;
      return {
        q: `<p>A simulation has ${n(N)} particles. Adding up the pull of every particle on every other one means N(N − 1)/2 pairs per time step. A supercomputer handles 10¹⁵ pairs per second. How many <b>hours</b> would one step take?</p>`,
        answer, unit: 'hours', tol: 0.01,
        hint: 'Pairs ≈ N²/2. Divide by 10¹⁵ for seconds, then by 3,600.',
        solution: steps(
          `Pairs: ${n(N)} × ${n(N - 1)} ÷ 2 = ${n(N * (N - 1) / 2)}.`,
          `Seconds: ÷ 10¹⁵ = ${n(N * (N - 1) / 2 / 1e15)} s = <b>${n(answer)} hours</b>.`,
          `And a run needs thousands of steps. Tree and particle-mesh methods cut the work to about N log N, roughly ${n((N * (N - 1) / 2) / (N * Math.log2(N)))} times less, which is what made billion-particle runs like Millennium possible.`),
        N,
      };
    },
    verify: (p) => (p.N / 1e15) * (p.N - 1) * 0.5 / 3600,
  },
};
