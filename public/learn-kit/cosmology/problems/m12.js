// Live problems for Module 12 of Cosmology A to Z (same contract as ../problems.js; ids must be unique across files).
import * as P from '../phys.js';
import { pick, n, steps } from './util.js';

const RHO_C100 = 1.8785e-26;      // critical density for h = 1, kg/m³ (3 (100 km/s/Mpc)² / 8πG)
const N_GAMMA = 4.107e8;          // CMB photons per m³ today (410.7 per cm³, T = 2.7255 K)
const NU21 = 1420.405751768;      // hydrogen 21 cm line, MHz
const LAM21 = P.C / (NU21 * 1e6); // its wavelength, m (0.2111)
const LYA_NM = 121.567;           // Lyman alpha, nm
const GM_SUN_C2 = (P.G * P.M_SUN) / (P.C * P.C); // 1,477 m

export default {
  // ---------- 12.1 ΛCDM ----------
  'lambda-cdm-photons': {
    title: 'how many photons for every atom?',
    make(r) {
      const obh2 = pick(r, 0.0215, 0.0235, 0.0001);
      const rhoB = obh2 * RHO_C100, nb = rhoB / 1.6726e-27, answer = N_GAMMA / nb;
      return {
        q: `<p>The CMB measures the density of ordinary matter as Ω<sub>b</sub>h² = ${obh2}. The critical density is 1.8785 × 10<sup>−26</sup> h² kg/m³, so the matter density is Ω<sub>b</sub>h² × 1.8785 × 10<sup>−26</sup> kg/m³. Treat every bit of it as protons (1.6726 × 10<sup>−27</sup> kg each). The CMB holds 410.7 photons in every cubic centimetre. How many CMB <b>photons are there for each proton</b> (or neutron)?</p>`,
        answer, unit: 'photons per baryon', tol: 0.01,
        hint: 'Find the baryon density in kg/m³, divide by the proton mass to get baryons per m³, then divide 4.107 × 10⁸ photons per m³ by it.',
        solution: steps(
          `Baryon density: ${obh2} × 1.8785 × 10<sup>−26</sup> = ${n(rhoB, 4)} kg/m³.`,
          `Baryons per m³: ${n(rhoB, 4)} ÷ 1.6726 × 10<sup>−27</sup> = ${n(nb, 4)}, about one atom in every four cubic metres.`,
          `Photons per m³: 410.7 × 10<sup>6</sup> = 4.107 × 10<sup>8</sup>. Ratio: <b>${n(answer)}</b> photons for every baryon.`,
          `This ratio, written the other way up as η ≈ 6 × 10<sup>−10</sup>, is what Big Bang nucleosynthesis needs to make the right amount of deuterium: one number, measured at 380,000 years and at three minutes, agreeing.`),
        obh2,
      };
    },
    // standard shortcut: η = 273.9 × 10⁻¹⁰ Ωb h² (for T = 2.7255 K), so photons per baryon = 1/η
    verify: (p) => 1 / (273.9e-10 * p.obh2),
  },
  'lambda-cdm-neutrinos': {
    title: 'how much of the universe is neutrinos?',
    make(r) {
      const mnu = pick(r, 0.06, 0.12, 0.01), h = pick(r, 0.66, 0.73, 0.005);
      const perEv = (112e6 * P.EV) / (P.C * P.C); // kg/m³ for each eV of summed mass
      const rho = mnu * perEv, rc = RHO_C100 * h * h, answer = (100 * rho) / rc;
      return {
        q: `<p>Standard ΛCDM includes three kinds of neutrino left over from the first second, with masses adding up to Σm<sub>ν</sub> = ${mnu} eV. Each kind fills space with 112 neutrinos (and antineutrinos) per cm³, so the mass density is Σm<sub>ν</sub> × 112 per cm³. Take h = ${h} (critical density 1.8785 × 10<sup>−26</sup> h² kg/m³; 1 eV/c² = 1.783 × 10<sup>−36</sup> kg). What <b>percentage</b> of the critical density do neutrinos make up?</p>`,
        answer, unit: '%', tol: 0.01,
        hint: 'Mass density = Σm × 112 × 10⁶ per m³ × 1.783 × 10⁻³⁶ kg per eV. Divide by the critical density for this h, then times 100.',
        solution: steps(
          `Mass density: ${mnu} × 1.12 × 10<sup>8</sup> m<sup>−3</sup> × 1.783 × 10<sup>−36</sup> kg = ${n(rho, 4)} kg/m³.`,
          `Critical density: 1.8785 × 10<sup>−26</sup> × ${h}² = ${n(rc, 4)} kg/m³.`,
          `Share: <b>${n(answer)}%</b>. Tiny, but neutrinos stream fast and smooth out small lumps, so galaxy surveys can weigh them. Cosmologists write Ω<sub>ν</sub>h² = Σm<sub>ν</sub> ÷ 93.1 eV; the 93.1 rather than 94 includes small corrections from how neutrinos let go.`),
        mnu, h,
      };
    },
    verify: (p) => (100 * p.mnu) / (94.09 * p.h * p.h),
  },

  // ---------- 12.2 The Hubble tension ----------
  'hubble-tension-sigma': {
    title: 'how many sigma apart?',
    make(r) {
      const H1 = pick(r, 66.5, 68.5, 0.1), s1 = pick(r, 0.4, 1.0, 0.1);
      const H2 = pick(r, 71.5, 74.5, 0.1), s2 = pick(r, 0.8, 1.8, 0.1);
      const sd = Math.sqrt(s1 * s1 + s2 * s2), answer = (H2 - H1) / sd;
      return {
        q: `<p>An early-universe method gives H<sub>0</sub> = ${H1} ± ${s1} km/s/Mpc. A local distance ladder gives ${H2} ± ${s2}. The uncertainty of a difference is √(σ<sub>1</sub>² + σ<sub>2</sub>²). How many <b>sigma</b> apart are the two results?</p>`,
        answer, unit: 'σ', tol: 0.01,
        hint: 'Difference ÷ combined uncertainty. The uncertainties add "in quadrature" (square, add, square root), not straight.',
        solution: steps(
          `Difference: ${n(H2, 3)} − ${n(H1, 3)} = ${n(H2 - H1, 3)} km/s/Mpc.`,
          `Combined uncertainty: √(${s1}² + ${s2}²) = ${n(sd, 4)}.`,
          `Gap: ${n(H2 - H1, 3)} ÷ ${n(sd, 4)} = <b>${n(answer)}σ</b>. ${answer >= 5 ? 'Past 5σ, physicists\' bar for "this is real, not bad luck".' : answer >= 3 ? 'Between 3σ and 5σ: "evidence", not yet a discovery.' : 'Below 3σ: could easily be chance.'}`),
        H1, s1, H2, s2,
      };
    },
    verify: (p) => Math.abs(p.H1 - p.H2) / Math.hypot(p.s1, p.s2),
  },
  'hubble-tension-ruler': {
    title: 'how much smaller must the ruler be?',
    make(r) {
      const H = pick(r, 70, 74, 0.5), answer = (147.1 * 67.4) / H;
      return {
        q: `<p>The CMB and baryon acoustic oscillations measure, in effect, the product H<sub>0</sub> × r<sub>d</sub>, where r<sub>d</sub> is the sound horizon: the "ruler" printed into the universe 380,000 years after the start. Standard ΛCDM gives r<sub>d</sub> = 147.1 Mpc and H<sub>0</sub> = 67.4 km/s/Mpc. New early-universe physics (such as early dark energy) could shrink the ruler. Keeping the product fixed, what <b>r<sub>d</sub>, in Mpc,</b> would give H<sub>0</sub> = ${H}?</p>`,
        answer, unit: 'Mpc', tol: 0.005,
        hint: 'H0 × rd stays the same, so rd(new) = 147.1 × 67.4 ÷ H0(new).',
        solution: steps(
          `Product: 67.4 × 147.1 = ${n(67.4 * 147.1, 5)} km/s.`,
          `New ruler: ${n(67.4 * 147.1, 5)} ÷ ${H} = <b>${n(answer, 4)} Mpc</b>.`,
          `That is ${n(100 * (1 - answer / 147.1), 2)}% shorter. A ruler 7 to 8% shorter would reach the local value of about 73, which is why proposed fixes add something that speeds up the expansion shortly before recombination.`),
        H,
      };
    },
    verify: (p) => 147.1 * (1 - (p.H - 67.4) / p.H),
  },

  // ---------- 12.3 S8 ----------
  's8-tension-s8': {
    title: 'work out S8',
    make(r) {
      const s8 = pick(r, 0.74, 0.84, 0.005), Om = pick(r, 0.26, 0.34, 0.005);
      const answer = s8 * Math.sqrt(Om / 0.3);
      return {
        q: `<p>A survey finds σ<sub>8</sub> = ${s8} (how lumpy matter is, in spheres of radius 8 h<sup>−1</sup> Mpc) and Ω<sub>m</sub> = ${Om}. Weak lensing measures best the combination S<sub>8</sub> = σ<sub>8</sub> √(Ω<sub>m</sub>/0.3). What is <b>S<sub>8</sub></b>?</p>`,
        answer, unit: '', tol: 0.005,
        hint: 'Divide Ωm by 0.3, take the square root, and multiply by σ8.',
        solution: steps(
          `Ω<sub>m</sub>/0.3 = ${n(Om / 0.3, 4)}; its square root is ${n(Math.sqrt(Om / 0.3), 4)}.`,
          `S<sub>8</sub> = ${s8} × ${n(Math.sqrt(Om / 0.3), 4)} = <b>${n(answer, 4)}</b>. Planck's CMB predicts 0.832 ± 0.013; the 2021-2023 lensing surveys measured 0.76 to 0.78.`),
        s8, Om,
      };
    },
    verify: (p) => Math.sqrt((p.s8 * p.s8 * p.Om) / 0.3),
  },
  's8-tension-smoother': {
    title: 'how much smoother?',
    make(r) {
      const S8 = pick(r, 0.74, 0.8, 0.005), Om = pick(r, 0.3, 0.33, 0.005);
      const s8 = S8 / Math.sqrt(Om / 0.3), answer = 100 * (1 - s8 / 0.811);
      return {
        q: `<p>A weak lensing survey measures S<sub>8</sub> = σ<sub>8</sub>√(Ω<sub>m</sub>/0.3) = ${S8}. Take the matter density Ω<sub>m</sub> = ${Om}. The Planck CMB prediction, from ΛCDM, is σ<sub>8</sub> = 0.811. By what <b>percentage</b> is matter smoother than predicted (how much lower is σ<sub>8</sub>)?</p>`,
        answer, unit: '%', tol: 0.01, abs: 0.05,
        hint: 'Solve for σ8 = S8 ÷ √(Ωm/0.3), then compare with 0.811.',
        solution: steps(
          `σ<sub>8</sub> = ${S8} ÷ √(${Om}/0.3) = ${S8} ÷ ${n(Math.sqrt(Om / 0.3), 4)} = ${n(s8, 4)}.`,
          `1 − ${n(s8, 4)} ÷ 0.811 = ${n(answer / 100, 3)}, so matter is <b>${n(answer)}%</b> smoother than predicted.`,
          `A few per cent: small, but lensing surveys measure S<sub>8</sub> to 2 or 3%, so it mattered. The 2025 KiDS-Legacy analysis moved back up to about 0.815, close to Planck.`),
        S8, Om,
      };
    },
    verify: (p) => 100 - (100 * p.S8 * Math.sqrt(0.3 / p.Om)) / 0.811,
  },

  // ---------- 12.4 JWST ----------
  'jwst-early-galaxies-break': {
    title: 'where does the Lyman break land?',
    make(r) {
      const z = pick(r, 9, 15, 0.05), answer = (LYA_NM * (1 + z)) / 1000;
      const filters = [[0.9, 'F090W'], [1.15, 'F115W'], [1.5, 'F150W'], [2.0, 'F200W'], [2.77, 'F277W'], [3.56, 'F356W'], [4.44, 'F444W']];
      const gone = filters.filter(([c]) => c < answer).map(([, f]) => f);
      return {
        q: `<p>Neutral hydrogen between the galaxies swallows almost all light bluer than the Lyman alpha line (121.567 nm in the galaxy's own frame). A galaxy is at redshift z = ${z}. At what wavelength, in <b>micrometres (µm)</b>, does its light switch off ("the Lyman break") by the time it reaches JWST?</p>`,
        answer, unit: 'µm', tol: 0.005,
        hint: 'Observed wavelength = emitted wavelength × (1 + z). 1 µm = 1,000 nm.',
        solution: steps(
          `121.567 nm × (1 + ${z}) = ${n(LYA_NM * (1 + z), 5)} nm = <b>${n(answer, 4)} µm</b>.`,
          `JWST's NIRCam filters are centred near 0.90, 1.15, 1.50, 2.00, 2.77, 3.56 and 4.44 µm. This galaxy is dark in ${gone.join(', ')} and bright in the redder ones: a "dropout". That is how candidates are picked out before a spectrum confirms them.`),
        z,
      };
    },
    verify: (p) => P.hydrogenLine(1, 2) * (1 + p.z) * 1e6,
  },
  'jwst-early-galaxies-age': {
    title: 'how old was the universe?',
    make(r) {
      const z = pick(r, 10, 15, 0.1), H0 = 67.7, Om = 0.31;
      const approx = (977.8 / H0) * (2 / (3 * Math.sqrt(Om))) * Math.pow(1 + z, -1.5) * 1000;
      const answer = P.ageGyr(z, P.PLANCK18) * 1000;
      return {
        q: `<p>JWST confirms a galaxy at z = ${z}. That early, matter ruled the expansion, and the age of the universe was very nearly t = (2 ÷ 3H<sub>0</sub>√Ω<sub>m</sub>) × (1 + z)<sup>−3/2</sup>. Take H<sub>0</sub> = ${H0} km/s/Mpc (so 1/H<sub>0</sub> = 977.8 ÷ ${H0} billion years) and Ω<sub>m</sub> = ${Om}. How old was the universe when this light set out, in <b>millions of years</b>?</p>`,
        answer, unit: 'million years', tol: 0.02,
        hint: '1/H0 = 977.8 ÷ 67.7 = 14.44 billion years. Multiply by 2/(3√0.31), then by (1 + z)^(−1.5), then by 1,000 for millions.',
        solution: steps(
          `1/H<sub>0</sub> = 977.8 ÷ ${H0} = ${n(977.8 / H0, 4)} billion years; 2/(3√${Om}) = ${n(2 / (3 * Math.sqrt(Om)), 4)}.`,
          `(1 + z)<sup>−3/2</sup> = ${n(1 + z, 4)}<sup>−1.5</sup> = ${n(Math.pow(1 + z, -1.5), 4)}.`,
          `t ≈ ${n(977.8 / H0, 4)} × ${n(2 / (3 * Math.sqrt(Om)), 4)} × ${n(Math.pow(1 + z, -1.5), 4)} × 1,000 = ${n(approx, 4)} million years. The full calculation, with radiation and dark energy included, gives <b>${n(answer)} million years</b>: about 3% of the universe's present age or less.`),
        z,
      };
    },
    // independent: t = ∫ dz / ((1 + z) H(z)) from z to ∞, done in x = ln(1 + z)
    verify: (p) => P.simpson((x) => 1 / P.E(Math.exp(x) - 1, P.PLANCK18), Math.log(1 + p.z), 25, 20000) * P.hubbleTimeGyr(P.PLANCK18.H0) * 1000,
  },

  // ---------- 12.5 New surveys ----------
  'new-surveys-galaxies': {
    title: 'how many galaxies will Euclid measure?',
    make(r) {
      const area = pick(r, 12000, 16000, 500), dens = pick(r, 25, 35, 1);
      const answer = area * 3600 * dens;
      return {
        q: `<p>A space survey images ${area.toLocaleString('en-CA')} square degrees of sky and measures the shapes of ${dens} galaxies in every square arcminute (1 degree = 60 arcminutes). How many <b>galaxy shapes</b> does it measure in total?</p>`,
        answer, unit: 'galaxies', tol: 0.005,
        hint: 'One square degree = 60 × 60 = 3,600 square arcminutes.',
        solution: steps(
          `Area in square arcminutes: ${area.toLocaleString('en-CA')} × 3,600 = ${n(area * 3600, 4)}.`,
          `Galaxies: ${n(area * 3600, 4)} × ${dens} = <b>${n(answer)}</b>, over a billion: the scale of Euclid's wide survey. The whole sky is 41,253 square degrees, so this is ${n((100 * area) / 41252.96, 3)}% of it.`),
        area, dens,
      };
    },
    verify: (p) => (p.area / 41252.96) * 4 * Math.PI * Math.pow((180 / Math.PI) * 60, 2) * p.dens,
  },
  'new-surveys-data': {
    title: 'Rubin\'s nightly data',
    make(r) {
      const N = pick(r, 800, 1000, 20), answer = (3.2e9 * 2 * N) / 1e12;
      return {
        q: `<p>The Vera C. Rubin Observatory's camera has 3.2 billion pixels, and each pixel is stored as 2 bytes. On a long night it takes about ${N} exposures. How many <b>terabytes</b> (10<sup>12</sup> bytes) of raw pixels is that per night?</p>`,
        answer, unit: 'TB', tol: 0.005,
        hint: 'Bytes per image = 3.2 × 10⁹ × 2. Multiply by the number of exposures, then divide by 10¹².',
        solution: steps(
          `One image: 3.2 × 10<sup>9</sup> × 2 = 6.4 × 10<sup>9</sup> bytes = 6.4 GB.`,
          `${N} images: 6.4 × 10<sup>9</sup> × ${N} = ${n(6.4e9 * N, 4)} bytes = <b>${n(answer)} TB</b>.`,
          `With calibration frames and processed images, Rubin expects about 20 TB a night, for ten years, and alerts on millions of changing objects every night.`),
        N,
      };
    },
    verify: (p) => (3.2e9 * 16 * p.N) / 8 / 1e12,
  },

  // ---------- 12.6 Standard sirens ----------
  'standard-sirens-h0': {
    title: 'the Hubble constant from a siren',
    make(r) {
      const d = pick(r, 35, 50, 0.5), v = pick(r, 2800, 3300, 10), answer = v / d;
      return {
        q: `<p>The gravitational waves from a neutron-star merger say it is ${d} Mpc away (no distance ladder needed). Light from the explosion pins down its host galaxy, which is moving away with the expansion at ${v.toLocaleString('en-CA')} km/s. What <b>Hubble constant</b>, in km/s/Mpc, does this one event give?</p>`,
        answer, unit: 'km/s/Mpc', tol: 0.005,
        hint: 'Hubble\'s law, v = H0 d, so H0 = v ÷ d.',
        solution: steps(
          `H<sub>0</sub> = v ÷ d = ${v.toLocaleString('en-CA')} ÷ ${d} = <b>${n(answer)} km/s/Mpc</b>.`,
          `For GW170817 the numbers were about 3,017 km/s and 44 Mpc, but the distance was uncertain by 15 to 20% (the wave's strength also depends on how the orbit is tilted towards us), so the result was 70 (+12, −8). Many more events are needed.`),
        d, v,
      };
    },
    verify: (p) => ((p.v * 1000) / (p.d * P.MPC)) * (P.MPC / 1000),
  },
  'standard-sirens-distance': {
    title: 'distance from a wave\'s strength',
    make(r) {
      const Mc = pick(r, 1.1, 1.3, 0.01), f = pick(r, 50, 150, 10), hs = pick(r, 3, 12, 0.5) * 1e-23;
      const L = GM_SUN_C2 * Mc, k = (Math.PI * f) / P.C;
      const dm = (4 / hs) * Math.pow(L, 5 / 3) * Math.pow(k, 2 / 3), answer = dm / P.MPC;
      return {
        q: `<p>For a merger whose orbit faces us, the strain is h = (4/d) (G𝓜/c²)<sup>5/3</sup> (πf/c)<sup>2/3</sup>, where 𝓜 is the chirp mass (read from how fast the pitch rises), f the wave frequency and d the distance. Two neutron stars have 𝓜 = ${Mc} solar masses (G M<sub>☉</sub>/c² = 1,477 m). At f = ${f} Hz the detectors measure h = ${n(hs)}. How far away is it, in <b>megaparsecs</b> (1 Mpc = 3.086 × 10<sup>22</sup> m)?</p>`,
        answer, unit: 'Mpc', tol: 0.01,
        hint: 'Rearrange: d = (4/h)(G𝓜/c²)^(5/3)(πf/c)^(2/3). Work out G𝓜/c² in metres first.',
        solution: steps(
          `G𝓜/c² = ${Mc} × 1,477 = ${n(L, 4)} m; to the power 5/3: ${n(Math.pow(L, 5 / 3), 4)}.`,
          `πf/c = π × ${f} ÷ 2.998 × 10<sup>8</sup> = ${n(k, 4)} m<sup>−1</sup>; to the power 2/3: ${n(Math.pow(k, 2 / 3), 4)}.`,
          `d = 4 ÷ ${n(hs)} × ${n(Math.pow(L, 5 / 3), 4)} × ${n(Math.pow(k, 2 / 3), 4)} = ${n(dm, 4)} m = <b>${n(answer)} Mpc</b>. A real analysis also fits the tilt of the orbit, the biggest source of error.`),
        Mc, f, hs,
      };
    },
    verify: (p) => Math.exp(Math.log(4) - Math.log(p.hs) + (5 / 3) * Math.log(GM_SUN_C2 * p.Mc) + (2 / 3) * Math.log((Math.PI * p.f) / P.C)) / P.MPC,
  },

  // ---------- 12.7 21 cm ----------
  'dark-ages-21cm-freq': {
    title: 'tune the radio to an era',
    make(r) {
      const z = pick(r, 6, 30, 0.5), answer = NU21 / (1 + z);
      return {
        q: `<p>Hydrogen's spin-flip line is at 1,420.4 MHz (21.1 cm). Light from hydrogen at redshift z = ${z} is stretched on its way to us. At what <b>frequency, in MHz</b>, should a radio telescope listen?</p>`,
        answer, unit: 'MHz', tol: 0.005,
        hint: 'Wavelengths stretch by (1 + z), so frequencies drop by the same factor: ν = 1,420.4 ÷ (1 + z).',
        solution: steps(
          `ν = 1,420.4 ÷ (1 + ${z}) = <b>${n(answer, 4)} MHz</b>, a wavelength of ${n(LAM21 * (1 + z), 3)} m.`,
          `${answer > 88 && answer < 108 ? 'Right in the FM radio band (88 to 108 MHz): one reason these experiments go to the remotest places on Earth.' : answer < 50 ? 'Down here Earth\'s ionosphere distorts radio waves badly (and below about 10 MHz blocks them), which is why some cosmologists want a telescope on the far side of the Moon.' : 'Each frequency is a slice of the universe at one time: tune the dial and you travel through cosmic history.'}`),
        z,
      };
    },
    verify: (p) => P.C / (LAM21 * (1 + p.z)) / 1e6,
  },
  'dark-ages-21cm-depth': {
    title: 'how deep is the cosmic dawn dip?',
    make(r) {
      const z = pick(r, 15, 20, 0.5), Ts = pick(r, 4, 12, 0.5);
      const Tg = P.T_CMB * (1 + z), answer = -27 * Math.sqrt((1 + z) / 10) * (1 - Tg / Ts);
      return {
        q: `<p>The 21 cm signal measured against the CMB is roughly δT = 27 mK × √((1 + z)/10) × (1 − T<sub>CMB</sub>/T<sub>S</sub>) for fully neutral gas, where T<sub>S</sub> is the "spin temperature" of the hydrogen. At z = ${z} the CMB is 2.7255 × (1 + z) K. Suppose starlight has locked T<sub>S</sub> to the cold gas, at ${Ts} K. How <b>deep</b> is the absorption, in millikelvin (give a positive number)?</p>`,
        answer, unit: 'mK', tol: 0.01,
        hint: 'T_CMB = 2.7255 × (1 + z). Then (1 − T_CMB/T_S) is negative: the gas absorbs. The depth is minus δT.',
        solution: steps(
          `T<sub>CMB</sub> = 2.7255 × ${1 + z} = ${n(Tg, 4)} K.`,
          `1 − ${n(Tg, 4)}/${Ts} = ${n(1 - Tg / Ts, 4)}; √(${1 + z}/10) = ${n(Math.sqrt((1 + z) / 10), 4)}.`,
          `δT = 27 × ${n(Math.sqrt((1 + z) / 10), 4)} × (${n(1 - Tg / Ts, 4)}) = −${n(answer, 4)} mK: a dip <b>${n(answer)} mK</b> deep. With the coldest gas standard physics allows (about 6 to 7 K at z ≈ 17), the dip is about 200 mK. EDGES claimed 500 mK, which would need even colder gas or extra radio light.`),
        z, Ts,
      };
    },
    verify: (p) => 27 * Math.sqrt((1 + p.z) / 10) * (P.cmbTemp(p.z) - p.Ts) / p.Ts,
  },

  // ---------- 12.8 India ----------
  'india-in-cosmology-ligo': {
    title: 'pointing with LIGO-India',
    make(r) {
      const L = pick(r, 8000, 12000, 100), dt = pick(r, 4, 25, 0.5);
      const x = (P.C * dt * 1e-3) / (L * 1e3), answer = Math.acos(x) / P.DEG;
      return {
        q: `<p>Two gravitational-wave detectors are ${L.toLocaleString('en-CA')} km apart in a straight line (through the Earth). A wave reaches one of them ${dt} ms before the other. The delay is (L/c) cos θ, where θ is the angle between the source's direction and the line joining the detectors. What is <b>θ, in degrees</b>? (c = 299,792 km/s.)</p>`,
        answer, unit: '°', tol: 0.005,
        hint: 'The longest possible delay is L/c (a wave arriving along the line). cos θ = delay ÷ (L/c).',
        solution: steps(
          `Longest possible delay: ${L.toLocaleString('en-CA')} ÷ 299,792 s = ${n((L / 299792.458) * 1000, 4)} ms.`,
          `cos θ = ${dt} ÷ ${n((L / 299792.458) * 1000, 4)} = ${n(x, 4)}, so θ = <b>${n(answer)}°</b>.`,
          `One pair of detectors only places the source on a ring on the sky. Each extra detector far away, like LIGO-India, adds another ring; where they cross, the source is pinned down, so telescopes know where to look for the flash.`),
        L, dt,
      };
    },
    verify: (p) => { const a = P.C * p.dt * 1e-3, b = p.L * 1e3; return Math.atan2(Math.sqrt(b * b - a * a), a) / P.DEG; },
  },
  'india-in-cosmology-gmrt': {
    title: 'how sharp is the GMRT?',
    make(r) {
      const z = pick(r, 0.2, 3, 0.1), B = 25e3;
      const lam = LAM21 * (1 + z), answer = lam / B / P.ARCSEC;
      return {
        q: `<p>The Giant Metrewave Radio Telescope near Pune has dishes spread over about 25 km. Its sharpness is roughly θ ≈ λ/B radians, for wavelength λ and longest baseline B. It is studying hydrogen gas (the 21.1 cm line) in galaxies at z = ${z}. What resolution does it reach, in <b>arcseconds</b>? (1 radian = 206,265 arcseconds.)</p>`,
        answer, unit: 'arcsec', tol: 0.01,
        hint: 'First stretch the wavelength: λ = 0.2111 m × (1 + z). Then divide by 25,000 m and turn radians into arcseconds.',
        solution: steps(
          `λ = 0.2111 × ${n(1 + z, 3)} = ${n(lam, 4)} m (frequency ${n(NU21 / (1 + z), 4)} MHz).`,
          `θ = ${n(lam, 4)} ÷ 25,000 = ${n(lam / B, 4)} rad = <b>${n(answer)} arcseconds</b>.`,
          `A single 45 m dish at this wavelength would see only about ${n((lam / 45) / P.ARCSEC / 60, 2)} arcminutes of detail: linking dishes across 25 km makes them work as one giant telescope.`),
        z,
      };
    },
    verify: (p) => P.C / ((NU21 * 1e6) / (1 + p.z)) / 25e3 * 206264.806,
  },
};
