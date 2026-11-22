// Live problems for Astronomy, part b: Modules 3-5 (see ../problems.js).
import { pick, n, steps } from './util.js';

const G = 6.674e-11, C = 2.998e8, MSUN = 1.989e30, LY = 9.461e15, PC = 3.086e16;
const one = (r, list) => list[Math.floor(r() * list.length * 0.9999)];

export default {
  // ---------- Module 3: stars ----------
  'parallax-distance': {
    title: 'distance to a star from its parallax',
    make(r) {
      const p = pick(r, 2, 400, 1);
      const d = 1000 / p, ly = d * 3.2616;
      return {
        q: `<p>Gaia measures a star's parallax as ${p} milliarcseconds (thousandths of an arcsecond). How far away is the star, in light-years?</p>`,
        answer: ly, unit: 'ly', tol: 0.01,
        hint: 'd (parsecs) = 1 / p (arcseconds). Turn milliarcseconds into arcseconds first, then 1 pc = 3.26 light-years.',
        solution: steps(`p = ${p} mas = ${n(p / 1000)}″.`, `d = 1 ÷ ${n(p / 1000)} = ${n(d)} pc.`, `× 3.26 = <b>${n(ly)} light-years</b>.`),
        p,
      };
    },
    verify: (p) => (206265 * 1.496e11 / (p.p / 1000)) / LY,
  },
  'star-luminosity': {
    title: 'how bright a star is from its size and temperature',
    make(r) {
      const R = pick(r, 0.2, 60, 0.1), T = pick(r, 3000, 25000, 100);
      const L = R ** 2 * (T / 5772) ** 4;
      return {
        q: `<p>A star has ${R} times the Sun's radius and a surface temperature of ${T.toLocaleString('en-CA')} K. How many times the Sun's luminosity does it give out? (Sun: 5,772 K.)</p>`,
        answer: L, unit: 'L☉', tol: 0.01,
        hint: 'L / L☉ = (R / R☉)² × (T / T☉)⁴.',
        solution: steps(`(R/R☉)² = ${R}² = ${n(R ** 2, 4)}.`, `(T/T☉)⁴ = (${T} / 5772)⁴ = ${n((T / 5772) ** 4, 4)}.`, `L = ${n(R ** 2, 4)} × ${n((T / 5772) ** 4, 4)} = <b>${n(L)} L☉</b>.`),
        R, T,
      };
    },
    verify: (p) => (4 * Math.PI * (p.R * 6.957e8) ** 2 * 5.6704e-8 * p.T ** 4) / 3.828e26,
    vtol: 0.006,
  },
  'star-lifetime': {
    title: 'how long a star lives',
    make(r) {
      const M = pick(r, 0.5, 2, 0.1);
      const L = M ** 4, t = 1e10 * M / L;
      return {
        q: `<p>A main-sequence star has ${M} times the Sun's mass. Using L ≈ M⁴ and a lifetime of 10 billion years for the Sun, roughly how many <b>billion years</b> will it live?</p>`,
        answer: t / 1e9, unit: 'billion years', tol: 0.01,
        hint: 'Lifetime ∝ fuel ÷ burn rate = M / L. With L = M⁴, that is M⁻³ times the Sun\'s 10 billion years.',
        solution: steps(`L ≈ ${M}⁴ = ${n(L)} L☉.`, `Fuel ÷ burn rate = ${M} ÷ ${n(L)} = ${n(M / L)} of the Sun's.`, `t ≈ 10 × ${n(M / L)} = <b>${n(t / 1e9)} billion years</b>.`),
        M,
      };
    },
    verify: (p) => 10 * p.M ** -3,
  },
  'binary-mass': {
    title: 'weigh a pair of stars from their orbit',
    make(r) {
      const Mt = pick(r, 0.4, 12, 0.1), P = pick(r, 1, 200, 0.5);
      const a = +((Mt * P * P) ** (1 / 3)).toFixed(1);
      const M = a ** 3 / P ** 2;
      return {
        q: `<p>Two stars orbit each other every ${P} years. The size (semi-major axis) of their orbit is ${a} AU. What is their total mass, in Suns?</p>`,
        answer: M, unit: 'M☉', tol: 0.01,
        hint: 'Kepler\'s third law with masses: M<sub>A</sub> + M<sub>B</sub> = a³ / P² (a in AU, P in years, mass in Suns).',
        solution: steps(`a³ = ${a}³ = ${n(a ** 3, 4)}.`, `P² = ${P}² = ${n(P ** 2, 4)}.`, `M = ${n(a ** 3, 4)} ÷ ${n(P ** 2, 4)} = <b>${n(M)} M☉</b>.`),
        a, P,
      };
    },
    verify: (p) => (4 * Math.PI ** 2 * (p.a * 1.496e11) ** 3 / (G * (p.P * 3.15576e7) ** 2)) / MSUN,
    vtol: 0.006,
  },
  'cepheid-distance': {
    title: 'distance to a Cepheid from its period',
    make(r) {
      const P = pick(r, 3, 60, 1), m = pick(r, 4, 16, 0.1);
      const M = -2.43 * (Math.log10(P) - 1) - 4.05;
      const d = 10 ** ((m - M) / 5 + 1);
      return {
        q: `<p>A Cepheid variable pulses every ${P} days and has an average apparent magnitude of ${m}. Using M<sub>V</sub> = −2.43 (log₁₀P − 1) − 4.05, how far away is it, in parsecs?</p>`,
        answer: d, unit: 'pc', tol: 0.01,
        hint: 'First find M<sub>V</sub> from the period, then use d = 10^((m − M)/5 + 1) parsecs.',
        solution: steps(`log₁₀ ${P} = ${n(Math.log10(P), 4)}.`, `M<sub>V</sub> = −2.43 × (${n(Math.log10(P), 4)} − 1) − 4.05 = ${n(M, 4)}.`, `m − M = ${n(m - M, 4)}, so d = 10<sup>${n((m - M) / 5 + 1, 4)}</sup> = <b>${n(d)} pc</b>.`),
        P, m,
      };
    },
    verify: (p) => { const M = -2.43 * Math.log10(p.P / 10) - 4.05; return 10 * Math.sqrt(10 ** (0.4 * (p.m - M))); },
  },
  'schwarzschild-radius': {
    title: 'size of a black hole',
    make(r) {
      const big = r() < 0.4;
      const M = big ? pick(r, 1, 900, 1) * 1e6 : pick(r, 3, 60, 1);
      const Rs = 2 * G * M * MSUN / C ** 2 / 1000;
      return {
        q: `<p>What is the radius of the event horizon of a black hole of ${big ? n(M) : M} solar masses, in kilometres?</p>`,
        answer: Rs, unit: 'km', tol: 0.01,
        hint: 'R<sub>s</sub> = 2GM / c². Shortcut: about 2.95 km per solar mass.',
        solution: steps(`M = ${big ? n(M) : M} × 1.989 × 10<sup>30</sup> = ${n(M * MSUN)} kg.`, `R<sub>s</sub> = 2 × 6.674 × 10<sup>−11</sup> × ${n(M * MSUN)} ÷ (2.998 × 10<sup>8</sup>)² = ${n(Rs * 1000)} m = <b>${n(Rs)} km</b>.`),
        M,
      };
    },
    verify: (p) => 2.953 * p.M,
  },
  // ---------- Module 4: galaxies ----------
  'galaxy-mass': {
    title: 'mass of a galaxy inside a star\'s orbit',
    make(r) {
      const kly = pick(r, 10, 80, 1), v = pick(r, 150, 300, 5);
      const rm = kly * 1000 * LY, M = (v * 1e3) ** 2 * rm / G / MSUN;
      return {
        q: `<p>A star orbits the centre of a spiral galaxy at ${v} km/s, ${kly},000 light-years out. How much mass lies inside its orbit, in billions of Suns?</p>`,
        answer: M / 1e9, unit: 'billion M☉', tol: 0.01,
        hint: 'For a circular orbit, gravity supplies the pull: M = v² r / G. Use metres (1 ly = 9.461 × 10¹⁵ m) and m/s, then divide by 1.989 × 10³⁰ kg.',
        solution: steps(`r = ${kly},000 × 9.461 × 10<sup>15</sup> = ${n(rm)} m; v = ${n(v * 1e3)} m/s.`, `M = (${n(v * 1e3)})² × ${n(rm)} ÷ 6.674 × 10<sup>−11</sup> = ${n(M * MSUN)} kg.`, `÷ 1.989 × 10<sup>30</sup> = <b>${n(M / 1e9)} billion Suns</b>.`),
        kly, v,
      };
    },
    // independent: from the orbital period and Kepler's third law
    verify: (p) => { const rm = p.kly * 1000 * LY, P = 2 * Math.PI * rm / (p.v * 1e3); return 4 * Math.PI ** 2 * rm ** 3 / (G * P ** 2) / MSUN / 1e9; },
  },
  'galaxy-angle': {
    title: 'how big a galaxy looks in the sky',
    make(r) {
      const D = pick(r, 20, 200, 5), d = pick(r, 2, 60, 0.5);
      const deg = (D * 1e3) / (d * 1e6) * 180 / Math.PI;
      return {
        q: `<p>A galaxy ${D},000 light-years across lies ${d} million light-years away. How wide does it look in the sky, in <b>arcminutes</b>?</p>`,
        answer: deg * 60, unit: '′', tol: 0.01,
        hint: 'Small angle: θ (radians) ≈ size ÷ distance, in the same units. Then 1 radian = 57.3° and 1° = 60′.',
        solution: steps(`θ = ${D},000 ÷ ${n(d * 1e6)} = ${n(D * 1e3 / (d * 1e6))} rad.`, `× 57.30 = ${n(deg)}°.`, `× 60 = <b>${n(deg * 60)}′</b>. (The full Moon is about 31′.)`),
        D, d,
      };
    },
    verify: (p) => 2 * Math.atan((p.D * 1e3) / (2 * p.d * 1e6)) * 180 / Math.PI * 60,
  },
  'look-back': {
    title: 'how old the light from a galaxy is',
    make(r) {
      const d = pick(r, 2, 300, 1), age = pick(r, 2, 40, 1);
      return {
        q: `<p>A galaxy is ${d} million light-years away. A supernova in it is seen today. How many million years ago did the star actually explode? (For nearby galaxies you can ignore the expansion of the universe.)</p>`,
        answer: d, unit: 'million years', tol: 0.001,
        hint: 'A light-year is the distance light travels in a year, so light from d light-years away left d years ago.',
        solution: steps(`Light covers 1 light-year per year.`, `So the light left <b>${d} million years</b> ago; we see the explosion as it was then.`),
        d,
      };
    },
    verify: (p) => (p.d * 1e6 * LY / C) / 3.15576e7 / 1e6,
    vtol: 0.002,
  },
  'galaxy-redshift': {
    title: 'redshift of a galaxy from one line',
    make(r) {
      const obs = pick(r, 657.5, 700, 0.1);
      const z = (obs - 656.28) / 656.28;
      return {
        q: `<p>In a galaxy's spectrum, hydrogen's H-alpha line (rest wavelength 656.28 nm) appears at ${obs} nm. What is the galaxy's redshift z?</p>`,
        answer: z, unit: '', tol: 0.005,
        hint: 'z = (observed − rest) / rest.',
        solution: steps(`Δλ = ${obs} − 656.28 = ${n(obs - 656.28, 4)} nm.`, `z = ${n(obs - 656.28, 4)} ÷ 656.28 = <b>${n(z)}</b>. For small z this is a speed of about cz = ${n(z * 299792)} km/s; what it means for distance is in the cosmology course.`),
        obs,
      };
    },
    verify: (p) => p.obs / 656.28 - 1,
  },
  // ---------- Module 5: doing research ----------
  'aperture-snr': {
    title: 'signal-to-noise of a star in an aperture',
    make(r) {
      const sum = pick(r, 20000, 400000, 1000), npx = pick(r, 50, 200, 10), b = pick(r, 50, 400, 10), nsky = npx * pick(r, 3, 10);
      const S = sum - npx * b, snr = S / Math.sqrt(S + npx * b * (1 + npx / nsky));
      if (S <= 1000) return this.make(() => 0.7);
      return {
        q: `<p>A star's aperture of ${npx} pixels adds up to ${sum.toLocaleString('en-CA')} electrons. The sky ring (${nsky} pixels) gives ${b} electrons per pixel. Ignoring read noise, what is the signal-to-noise ratio?</p>`,
        answer: snr, unit: '', tol: 0.01,
        hint: 'S = Σ − n b. Noise = √(S + n b (1 + n / n<sub>sky</sub>)). SNR = S ÷ noise.',
        solution: steps(`Sky inside the aperture: ${npx} × ${b} = ${(npx * b).toLocaleString('en-CA')} e⁻; S = ${sum.toLocaleString('en-CA')} − ${(npx * b).toLocaleString('en-CA')} = ${S.toLocaleString('en-CA')} e⁻.`, `Noise² = ${S.toLocaleString('en-CA')} + ${npx * b} × (1 + ${npx}/${nsky}) = ${n(S + npx * b * (1 + npx / nsky), 5)}.`, `SNR = ${S.toLocaleString('en-CA')} ÷ ${n(Math.sqrt(S + npx * b * (1 + npx / nsky)), 4)} = <b>${n(snr)}</b>, a magnitude error of about ${n(1.086 / snr)} mag.`),
        sum, npx, b, nsky,
      };
    },
    verify: (p) => { const S = p.sum - p.npx * p.b; const varSky = p.npx * p.b + p.npx ** 2 * p.b / p.nsky; return S / Math.sqrt(S + varSky); },
  },
  'alias-period': {
    title: 'the false period that daily gaps create',
    make(r) {
      const Ph = pick(r, 4, 20, 0.5);
      const f = 24 / Ph, alias = 24 / (f + 1) ;
      return {
        q: `<p>A star truly varies with a period of ${Ph} hours, but it is observed only once a night. One false peak appears at the true frequency <b>plus</b> 1 cycle per day. What period, in hours, does that false peak suggest?</p>`,
        answer: alias, unit: 'h', tol: 0.005,
        hint: 'Turn the period into cycles per day (f = 24 / P in hours), add 1, then turn back into hours.',
        solution: steps(`f = 24 ÷ ${Ph} = ${n(f, 4)} cycles/day.`, `Alias f + 1 = ${n(f + 1, 4)} cycles/day.`, `P = 24 ÷ ${n(f + 1, 4)} = <b>${n(alias)} h</b>. Data taken once a day fit both equally well.`),
        Ph,
      };
    },
    verify: (p) => (24 * p.Ph) / (24 + p.Ph),
  },
  'transit-radius': {
    title: 'planet size from a transit dip',
    make(r) {
      const depth = pick(r, 100, 20000, 50), Rs = pick(r, 0.3, 1.8, 0.05);
      const Rp = Math.sqrt(depth * 1e-6) * Rs * 109.08;
      return {
        q: `<p>A star of ${Rs} solar radii dims by ${depth.toLocaleString('en-CA')} ppm (parts per million) when a planet crosses it. How big is the planet, in Earth radii? (1 R☉ = 109.1 R⊕.)</p>`,
        answer: Rp, unit: 'R⊕', tol: 0.01,
        hint: 'Depth δ = (R<sub>p</sub> / R<sub>★</sub>)², so R<sub>p</sub> = R<sub>★</sub> √δ. 1 ppm = 10⁻⁶.',
        solution: steps(`δ = ${depth} × 10<sup>−6</sup> = ${n(depth * 1e-6)}.`, `√δ = ${n(Math.sqrt(depth * 1e-6), 4)}, so R<sub>p</sub> = ${n(Math.sqrt(depth * 1e-6), 4)} × ${Rs} R☉ = ${n(Math.sqrt(depth * 1e-6) * Rs, 4)} R☉.`, `× 109.1 = <b>${n(Rp)} R⊕</b>.`),
        depth, Rs,
      };
    },
    verify: (p) => (Math.sqrt(p.depth) / 1000) * p.Rs * 6.957e8 / 6.378e6,
  },
  'spectral-resolution': {
    title: 'finest wavelength step a spectrograph can tell apart',
    make(r) {
      const R = pick(r, 500, 60000, 500), lam = one(r, [393.4, 486.1, 589.0, 656.3, 854.2]);
      const dl = lam / R;
      return {
        q: `<p>A spectrograph has resolving power R = ${R.toLocaleString('en-CA')}. What is the smallest wavelength difference it can separate at ${lam} nm, in <b>nanometres</b>?</p>`,
        answer: dl, unit: 'nm', tol: 0.005,
        hint: 'R = λ / Δλ, so Δλ = λ / R.',
        solution: steps(`Δλ = ${lam} ÷ ${R.toLocaleString('en-CA')} = <b>${n(dl)} nm</b>.`, `As a speed, that is c / R = ${n(299792 / R)} km/s; careful fits measure velocities to a small fraction of this.`),
        R, lam,
      };
    },
    verify: (p) => (299792 / p.R) * p.lam / 299792,
  },
  'fits-size': {
    title: 'how big a FITS image file is',
    make(r) {
      const nx = one(r, [1024, 2048, 4096, 6248, 9576]), ny = one(r, [1024, 2048, 4176, 6388]), bp = one(r, [16, 32, -32, -64]);
      const mb = nx * ny * Math.abs(bp) / 8 / 1e6;
      return {
        q: `<p>A FITS header says NAXIS1 = ${nx}, NAXIS2 = ${ny} and BITPIX = ${bp}. Roughly how many megabytes (10⁶ bytes) does the image data take?</p>`,
        answer: mb, unit: 'MB', tol: 0.01,
        hint: 'Pixels = NAXIS1 × NAXIS2. Each pixel takes |BITPIX| / 8 bytes (the minus sign only means floating point).',
        solution: steps(`Pixels = ${nx} × ${ny} = ${(nx * ny).toLocaleString('en-CA')}.`, `|BITPIX| / 8 = ${Math.abs(bp) / 8} bytes per pixel.`, `${(nx * ny).toLocaleString('en-CA')} × ${Math.abs(bp) / 8} = ${(nx * ny * Math.abs(bp) / 8).toLocaleString('en-CA')} bytes = <b>${n(mb)} MB</b>.`),
        nx, ny, bp,
      };
    },
    verify: (p) => (p.nx * p.ny * Math.abs(p.bp)) / 8e6,
  },
  'cone-count': {
    title: 'how many stars a cone search will return',
    make(r) {
      const rad = pick(r, 2, 30, 1), dens = pick(r, 500, 20000, 100);
      const area = Math.PI * (rad / 60) ** 2, N = area * dens;
      return {
        q: `<p>In a patch of sky, a catalogue lists about ${dens.toLocaleString('en-CA')} stars per square degree. Roughly how many stars will a cone search of radius ${rad} arcminutes return?</p>`,
        answer: N, unit: 'stars', tol: 0.01,
        hint: 'Area = π r² with r in degrees (arcminutes ÷ 60). Stars = area × density.',
        solution: steps(`r = ${rad} ÷ 60 = ${n(rad / 60)}°.`, `Area = π × ${n(rad / 60)}² = ${n(area)} square degrees.`, `Stars ≈ ${n(area)} × ${dens.toLocaleString('en-CA')} = <b>${n(N)}</b>.`),
        rad, dens,
      };
    },
    verify: (p) => (Math.PI * p.rad ** 2 * p.dens) / 3600,
  },
  'magnitude-error': {
    title: 'turn a flux uncertainty into a magnitude error',
    make(r) {
      const F = pick(r, 2000, 90000, 100), sF = pick(r, 10, 1500, 10);
      const sm = 2.5 / Math.LN10 * sF / F;
      return {
        q: `<p>A star's measured flux is ${F.toLocaleString('en-CA')} ± ${sF} counts. What is the uncertainty on its magnitude, in magnitudes?</p>`,
        answer: sm, unit: 'mag', tol: 0.01,
        hint: 'm = −2.5 log₁₀F, so σ<sub>m</sub> = (2.5 / ln 10) × σ<sub>F</sub>/F ≈ 1.086 × σ<sub>F</sub>/F.',
        solution: steps(`σ<sub>F</sub>/F = ${sF} ÷ ${F.toLocaleString('en-CA')} = ${n(sF / F)}.`, `σ<sub>m</sub> = 1.086 × ${n(sF / F)} = <b>${n(sm)} mag</b>.`),
        F, sF,
      };
    },
    verify: (p) => 2.5 * Math.log10(Math.E) * p.sF / p.F,
  },
  'tension-sigma': {
    title: 'how many sigma apart two results are',
    make(r) {
      const a = pick(r, 60, 80, 0.1), sa = pick(r, 0.3, 3, 0.1), sb = pick(r, 0.3, 3, 0.1), gap = pick(r, 0.5, 8, 0.1);
      const b = +(a - gap).toFixed(1), s = Math.sqrt(sa ** 2 + sb ** 2), k = gap / s;
      return {
        q: `<p>One team measures ${a} ± ${sa}; another measures ${b} ± ${sb} (same quantity, independent errors). How many sigma apart are the two results?</p>`,
        answer: k, unit: 'σ', tol: 0.01,
        hint: 'Difference Δ = a − b. Combined uncertainty σ = √(σ<sub>a</sub>² + σ<sub>b</sub>²). Tension = Δ / σ.',
        solution: steps(`Δ = ${a} − ${b} = ${n(gap)}.`, `σ = √(${sa}² + ${sb}²) = ${n(s, 4)}.`, `Δ/σ = <b>${n(k)}σ</b>${k >= 5 ? ': a clear disagreement' : k >= 3 ? ': worth a closer look' : ': could easily be chance'}.`),
        a, b, sa, sb,
      };
    },
    verify: (p) => Math.abs(p.a - p.b) / Math.hypot(p.sa, p.sb),
  },
  'network-clear': {
    title: 'chance that someone in a network sees an event',
    make(r) {
      const p = pick(r, 0.2, 0.8, 0.05), k = pick(r, 2, 8);
      const P = 1 - (1 - p) ** k;
      return {
        q: `<p>${k} observers far apart each have a ${Math.round(p * 100)}% chance of a clear sky tonight, independently. What is the chance, in percent, that at least one of them sees the occultation?</p>`,
        answer: P * 100, unit: '%', tol: 0.005,
        hint: 'Work out the chance that everyone is clouded out, (1 − p)ⁿ, and take it away from 1.',
        solution: steps(`Chance one site is cloudy: 1 − ${p} = ${n(1 - p)}.`, `All ${k} cloudy: ${n(1 - p)}<sup>${k}</sup> = ${n((1 - p) ** k)}.`, `At least one clear: 1 − ${n((1 - p) ** k)} = <b>${n(P * 100)}%</b>.`),
        p, k,
      };
    },
    verify: (q) => { let none = 1; for (let i = 0; i < q.k; i++) none *= 1 - q.p; return 100 - none * 100; },
  },
  'transit-period': {
    title: 'a planet\'s period from two transit times',
    make(r) {
      const P = pick(r, 0.8, 15, 0.0001), N = pick(r, 3, 40), t1 = pick(r, 2460000, 2460600, 0.0001);
      const t2 = +(t1 + N * P).toFixed(4);
      return {
        q: `<p>You time one transit at Julian date ${t1.toFixed(4)} and another at ${t2.toFixed(4)}. A rough period from the archive says about ${(P * (1 + (r() - 0.5) * 0.01)).toFixed(1)} days. What is the planet's period, in days, to 4 decimal places?</p>`,
        answer: (t2 - t1) / N, unit: 'days', tol: 0, abs: 0.00015,
        hint: 'Divide the gap by the rough period and round to a whole number N of orbits. Then P = gap ÷ N.',
        solution: steps(`Gap = ${t2.toFixed(4)} − ${t1.toFixed(4)} = ${(t2 - t1).toFixed(4)} days.`, `Gap ÷ rough period ≈ ${n((t2 - t1) / P)}, so N = ${N} orbits.`, `P = ${(t2 - t1).toFixed(4)} ÷ ${N} = <b>${((t2 - t1) / N).toFixed(4)} days</b>. Timing many orbits apart makes the period very precise.`),
        t1, t2, N, P,
      };
    },
    verify: (p) => (p.t2 - p.t1) / Math.round((p.t2 - p.t1) / p.P),
  },
};
