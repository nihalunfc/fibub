// Live problems for Astronomy, part a: Modules 1-2 (see ../problems.js).
import { pick, n, steps } from './util.js';

const H = 6.626e-34, C = 2.998e8, EV = 1.602e-19, G = 6.674e-11, AU = 1.496e11;
const GM_SUN = 1.327e20, GM_EARTH = 3.986e14, R_EARTH = 6.371e6;
const one = (r, list) => list[Math.floor(r() * list.length * 0.9999)];

export default {
  // ---------- Module 1: light ----------
  'em-photon-energy': {
    title: 'photon energy from wavelength',
    make(r) {
      const [name, lam] = one(r, [['violet light', 410], ['blue light', 450], ['green light', 530], ['yellow sodium light', 589], ['red H-alpha light', 656], ['near-infrared light', 850], ['ultraviolet', 300], ['hard ultraviolet', 120]]);
      const E = (H * C) / (lam * 1e-9) / EV;
      return {
        q: `<p>A photon of ${name} has a wavelength of ${lam} nm. How much energy does it carry, in electronvolts (eV)?</p>`,
        answer: E, unit: 'eV', tol: 0.01,
        hint: 'Use E = hc/λ with λ in metres, then divide joules by 1.602 × 10⁻¹⁹ to get eV. Shortcut: E (eV) ≈ 1240 / λ (nm).',
        solution: steps(
          `λ = ${lam} nm = ${lam} × 10<sup>−9</sup> m.`,
          `E = hc/λ = (6.626 × 10<sup>−34</sup> × 2.998 × 10<sup>8</sup>) ÷ (${lam} × 10<sup>−9</sup>) = ${n(E * EV)} J.`,
          `In eV: ${n(E * EV)} ÷ 1.602 × 10<sup>−19</sup> = <b>${n(E)} eV</b>. Check with the shortcut: 1240 ÷ ${lam} = ${n(1240 / lam)} eV.`),
        lam,
      };
    },
    verify: (p) => 1239.84 / p.lam,
  },
  'wien-temperature': {
    title: 'star temperature from the colour it peaks at',
    make(r) {
      const lam = pick(r, 250, 1100, 10);
      const T = 2.898e-3 / (lam * 1e-9);
      return {
        q: `<p>A star's spectrum is brightest at a wavelength of ${lam} nm. Treating it as a blackbody, what is its surface temperature in kelvin?</p>`,
        answer: T, unit: 'K', tol: 0.01,
        hint: "Wien's law: λ<sub>peak</sub> × T = 2.898 × 10⁻³ m K. Put λ in metres.",
        solution: steps(
          `λ<sub>peak</sub> = ${lam} nm = ${lam} × 10<sup>−9</sup> m.`,
          `T = 2.898 × 10<sup>−3</sup> ÷ (${lam} × 10<sup>−9</sup>) = <b>${n(T, 4)} K</b>.`,
          T > 7500 ? 'Hotter than the Sun (5,772 K): the star looks blue-white.' : T > 5000 ? 'Close to the Sun: the star looks white to yellow.' : 'Cooler than the Sun: the star looks orange to red.'),
        lam,
      };
    },
    verify: (p) => 2897.8e3 / p.lam,
  },
  'hydrogen-line': {
    title: 'wavelength of a hydrogen line',
    make(r) {
      const lo = one(r, [1, 2, 2, 2, 3]);
      const hi = lo + pick(r, 1, 4);
      const inv = 1.0968e7 * (1 / lo ** 2 - 1 / hi ** 2);
      const lam = 1e9 / inv;
      return {
        q: `<p>An electron in a hydrogen atom drops from level n = ${hi} to level n = ${lo}. What is the wavelength of the photon it gives out, in nm?</p>`,
        answer: lam, unit: 'nm', tol: 0.005,
        hint: 'Rydberg formula: 1/λ = R (1/n₁² − 1/n₂²) with R = 1.0968 × 10⁷ m⁻¹, n₁ the lower level and n₂ the upper one.',
        solution: steps(
          `1/n₁² − 1/n₂² = 1/${lo ** 2} − 1/${hi ** 2} = ${n(1 / lo ** 2 - 1 / hi ** 2, 4)}.`,
          `1/λ = 1.0968 × 10<sup>7</sup> × ${n(1 / lo ** 2 - 1 / hi ** 2, 4)} = ${n(inv, 4)} m<sup>−1</sup>.`,
          `λ = 1 ÷ ${n(inv, 4)} m = <b>${n(lam, 4)} nm</b>${lam < 400 ? ' (ultraviolet)' : lam > 700 ? ' (infrared)' : ' (visible)'}.`),
        lo, hi,
      };
    },
    verify: (p) => 1239.84 / (13.598 * (1 / p.lo ** 2 - 1 / p.hi ** 2)),
  },
  'doppler-speed': {
    title: 'speed of a star from a shifted line',
    make(r) {
      const [name, rest] = one(r, [['H-alpha', 656.28], ['H-beta', 486.13], ['sodium D', 589.0], ['calcium K', 393.37]]);
      const shift = pick(r, 0.02, 0.4, 0.01);
      const obs = +(rest + shift).toFixed(2);
      const v = 299792 * (obs - rest) / rest;
      return {
        q: `<p>In a star's spectrum, the ${name} line (rest wavelength ${rest} nm) is measured at ${obs} nm. How fast is the star moving away from us, in km/s?</p>`,
        answer: v, unit: 'km/s', tol: 0.01,
        hint: 'v = c × Δλ / λ₀, with c = 299,792 km/s and Δλ = measured − rest.',
        solution: steps(
          `Δλ = ${obs} − ${rest} = ${n(obs - rest)} nm (longer, so redshifted: moving away).`,
          `Δλ/λ₀ = ${n(obs - rest)} ÷ ${rest} = ${n((obs - rest) / rest)}.`,
          `v = 299,792 × ${n((obs - rest) / rest)} = <b>${n(v)} km/s</b>.`),
        rest, obs,
      };
    },
    verify: (p) => 299792 * (p.obs / p.rest - 1),
  },
  'distance-modulus': {
    title: 'distance from apparent and absolute magnitude',
    make(r) {
      const M = pick(r, -2, 6, 0.1), mm = pick(r, 2, 8, 0.1);
      const m = +(M + mm).toFixed(1);
      const d = 10 ** ((m - M + 5) / 5);
      return {
        q: `<p>A star has absolute magnitude M = ${M} (how bright it would look from 10 parsecs) and appears at magnitude m = ${m}. How far away is it, in parsecs?</p>`,
        answer: d, unit: 'pc', tol: 0.01,
        hint: 'Distance modulus: m − M = 5 log₁₀(d / 10 pc), so d = 10^((m − M + 5) / 5).',
        solution: steps(
          `m − M = ${m} − ${M} = ${n(m - M)}.`,
          `(m − M + 5) / 5 = ${n((m - M + 5) / 5, 4)}.`,
          `d = 10<sup>${n((m - M + 5) / 5, 4)}</sup> = <b>${n(d)} pc</b> (${n(d * 3.26)} light-years).`),
        m, M,
      };
    },
    // independent: flux ratio from the magnitude difference, then inverse square from 10 pc
    verify: (p) => 10 * Math.sqrt(10 ** (0.4 * (p.m - p.M))),
  },
  'diffraction-resolution': {
    title: 'sharpest detail a telescope can see',
    make(r) {
      const [band, lam, unit, lamM] = one(r, [['visible (550 nm)', 550, 'nm', 550e-9], ['near-infrared (2.2 μm)', 2.2, 'μm', 2.2e-6], ['millimetre radio (1.3 mm)', 1.3, 'mm', 1.3e-3], ['radio (21 cm)', 21, 'cm', 0.21]]);
      const D = lamM < 1e-5 ? pick(r, 1, 10, 0.5) : pick(r, 10, 300, 5);
      const th = (1.22 * lamM / D) * 206265;
      return {
        q: `<p>A telescope ${D} m across observes in the ${band}. What is the smallest angle it can resolve, in arcseconds?</p>`,
        answer: th, unit: '″', tol: 0.01,
        hint: 'Diffraction limit: θ = 1.22 λ / D in radians, with λ and D in metres. 1 radian = 206,265 arcseconds.',
        solution: steps(
          `λ = ${lam} ${unit} = ${n(lamM)} m.`,
          `θ = 1.22 × ${n(lamM)} ÷ ${D} = ${n(1.22 * lamM / D)} rad.`,
          `× 206,265 = <b>${n(th)}″</b>.`),
        lamM, D,
      };
    },
    verify: (p) => (1.22 * p.lamM / p.D) * (180 / Math.PI) * 3600,
  },

  // ---------- Module 2: gravity and the Solar System ----------
  'kepler-period': {
    title: "orbital period from Kepler's third law",
    make(r) {
      const a = pick(r, 0.4, 45, 0.1);
      const P = a ** 1.5;
      return {
        q: `<p>An asteroid orbits the Sun with a semi-major axis of ${a} AU. How many years does one orbit take?</p>`,
        answer: P, unit: 'years', tol: 0.005,
        hint: 'For orbits around the Sun, P² = a³ with P in years and a in AU. So P = a^1.5 = a × √a.',
        solution: steps(
          `a³ = ${a}³ = ${n(a ** 3, 4)}.`,
          `P = √${n(a ** 3, 4)} = <b>${n(P)} years</b>.`),
        a,
      };
    },
    verify: (p) => 2 * Math.PI * Math.sqrt((p.a * AU) ** 3 / GM_SUN) / (365.25 * 86400),
    vtol: 0.006,
  },
  'orbit-speed': {
    title: 'speed of a satellite in a circular orbit',
    make(r) {
      const h = pick(r, 300, 36000, 100);
      const v = Math.sqrt(GM_EARTH / (R_EARTH + h * 1e3)) / 1e3;
      return {
        q: `<p>A satellite circles Earth ${h.toLocaleString('en-CA')} km above the ground. How fast does it move, in km/s? (GM of Earth = 3.986 × 10¹⁴ m³/s², Earth's radius 6,371 km.)</p>`,
        answer: v, unit: 'km/s', tol: 0.005,
        hint: 'v = √(GM / r), where r is measured from Earth\'s centre: r = 6,371 km + height, in metres.',
        solution: steps(
          `r = 6,371 + ${h.toLocaleString('en-CA')} = ${(6371 + h).toLocaleString('en-CA')} km = ${n((6371 + h) * 1e3, 4)} m.`,
          `GM / r = 3.986 × 10<sup>14</sup> ÷ ${n((6371 + h) * 1e3, 4)} = ${n(GM_EARTH / (R_EARTH + h * 1e3), 4)} m²/s².`,
          `v = √ that = <b>${n(v)} km/s</b>. Higher orbits are slower.`),
        h,
      };
    },
    verify: (p) => { const rr = R_EARTH + p.h * 1e3; return (2 * Math.PI * rr / (2 * Math.PI * Math.sqrt(rr ** 3 / GM_EARTH))) / 1e3; },
  },
  'perihelion-distance': {
    title: 'closest and furthest points of an orbit',
    make(r) {
      const a = pick(r, 1.2, 30, 0.1), e = pick(r, 0.05, 0.9, 0.01), far = r() < 0.5;
      const ans = far ? a * (1 + e) : a * (1 - e);
      return {
        q: `<p>A comet's orbit has semi-major axis a = ${a} AU and eccentricity e = ${e}. How far from the Sun is it at its <b>${far ? 'furthest point (aphelion)' : 'closest point (perihelion)'}</b>, in AU?</p>`,
        answer: ans, unit: 'AU', tol: 0.005,
        hint: 'Perihelion r = a(1 − e); aphelion r = a(1 + e).',
        solution: steps(`${far ? 'Aphelion' : 'Perihelion'}: ${a} × (1 ${far ? '+' : '−'} ${e}) = <b>${n(ans)} AU</b>.`, `Check: perihelion + aphelion = 2a = ${n(2 * a)} AU.`),
        a, e, far,
      };
    },
    verify: (p) => (p.far ? 2 * p.a - p.a * (1 - p.e) : 2 * p.a - p.a * (1 + p.e)),
  },
  'rocket-equation': {
    title: 'how much fuel a change of speed costs',
    make(r) {
      const dv = pick(r, 1, 9, 0.1), ve = pick(r, 2.5, 4.5, 0.1), mf = pick(r, 2, 30);
      const m0 = mf * Math.exp(dv / ve);
      return {
        q: `<p>A spacecraft with an empty mass of ${mf} tonnes must change its speed by ${dv} km/s. Its engine's exhaust speed is ${ve} km/s. How many tonnes of <b>fuel</b> must it carry?</p>`,
        answer: m0 - mf, unit: 't', tol: 0.01,
        hint: 'Rocket equation: m₀/m_f = e^(Δv / v_e). Fuel = m₀ − m_f.',
        solution: steps(
          `Δv / v<sub>e</sub> = ${dv} ÷ ${ve} = ${n(dv / ve, 4)}.`,
          `m₀ / m<sub>f</sub> = e<sup>${n(dv / ve, 4)}</sup> = ${n(Math.exp(dv / ve), 4)}, so m₀ = ${n(m0, 4)} t.`,
          `Fuel = ${n(m0, 4)} − ${mf} = <b>${n(m0 - mf)} t</b>.`),
        dv, ve, mf,
      };
    },
    verify: (p) => p.mf * 10 ** (p.dv / (p.ve * Math.LN10)) - p.mf,
  },
  'planet-density': {
    title: 'what a planet is made of, from its density',
    make(r) {
      const M = pick(r, 0.3, 300, 0.1), R = pick(r, 0.5, 11, 0.1);
      const rho = (M * 5.972e24) / ((4 / 3) * Math.PI * (R * 6.371e6) ** 3) / 1000;
      return {
        q: `<p>A planet has ${M} times Earth's mass and ${R} times Earth's radius. What is its average density, in g/cm³? (Earth: 5.972 × 10²⁴ kg, radius 6,371 km.)</p>`,
        answer: rho, unit: 'g/cm³', tol: 0.01,
        hint: 'ρ = M / (4/3 π R³). Work in kg and m to get kg/m³, then divide by 1,000 for g/cm³. Shortcut: ρ = 5.51 × M/R³ in Earth units.',
        solution: steps(
          `Volume = 4/3 × π × (${R} × 6.371 × 10<sup>6</sup>)³ = ${n((4 / 3) * Math.PI * (R * 6.371e6) ** 3)} m³.`,
          `ρ = ${n(M * 5.972e24)} ÷ that = ${n(rho * 1000)} kg/m³ = <b>${n(rho)} g/cm³</b>.`,
          rho > 4 ? 'Rock and iron, like Earth.' : rho > 2 ? 'Rock with ice or a thick atmosphere.' : 'Mostly gas or ice, like the giant planets.'),
        M, R,
      };
    },
    verify: (p) => 5.513 * p.M / p.R ** 3,
  },
  'sun-mass-loss': {
    title: 'how much mass a star turns into light',
    make(r) {
      const L = pick(r, 0.1, 50, 0.1);
      const dm = (L * 3.828e26) / C ** 2;
      return {
        q: `<p>A star shines with ${L} times the Sun's power (Sun: 3.828 × 10²⁶ W). How many kilograms of mass does it turn into energy every second?</p>`,
        answer: dm, unit: 'kg/s', tol: 0.01,
        hint: 'E = mc², so mass per second = power ÷ c², with c = 2.998 × 10⁸ m/s.',
        solution: steps(
          `L = ${L} × 3.828 × 10<sup>26</sup> = ${n(L * 3.828e26)} W.`,
          `c² = (2.998 × 10<sup>8</sup>)² = 8.988 × 10<sup>16</sup> m²/s².`,
          `Δm/Δt = ${n(L * 3.828e26)} ÷ 8.988 × 10<sup>16</sup> = <b>${n(dm)} kg/s</b>, about ${n(dm / 1e9)} million tonnes a second.`),
        L,
      };
    },
    verify: (p) => p.L * 4.26e9,
  },
};
