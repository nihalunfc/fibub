// Live problems for Sky watching, part b: Modules 4-6 (see ../problems.js).
import { pick, n, steps } from './util.js';

const D2R = Math.PI / 180;
const one = (r, list) => list[Math.floor(r() * list.length * 0.9999)];

export default {
  // ---------- Module 4: telescopes ----------
  'lens-image': {
    title: 'where a lens forms an image',
    make(r) {
      const f = pick(r, 100, 1000, 50), u = f * pick(r, 1.5, 20, 0.5);
      const v = 1 / (1 / f - 1 / u);
      return {
        q: `<p>A lens of focal length ${f} mm looks at a lamp ${u.toLocaleString('en-CA')} mm away. How far behind the lens does the sharp image form, in mm?</p>`,
        answer: v, unit: 'mm', tol: 0.005,
        hint: 'Lens equation: 1/u + 1/v = 1/f, so 1/v = 1/f − 1/u.',
        solution: steps(`1/v = 1/${f} − 1/${u} = ${n(1 / f - 1 / u, 4)} mm<sup>−1</sup>.`, `v = <b>${n(v, 4)} mm</b>, a little beyond the focal length. For a star (u → ∞) it would be exactly ${f} mm.`),
        f, u,
      };
    },
    verify: (p) => (p.f * p.u) / (p.u - p.f),
  },
  'aperture-gain': {
    title: 'how many magnitudes fainter a telescope shows',
    make(r) {
      const Dm = one(r, [50, 70, 80, 90, 102, 114, 130, 150, 200, 250, 300, 400]), pup = pick(r, 5, 7, 0.5);
      const gain = 5 * Math.log10(Dm / pup);
      return {
        q: `<p>Your dark-adapted pupil is ${pup} mm wide. How many magnitudes fainter can you see through a telescope of ${Dm} mm aperture (ignoring light losses)?</p>`,
        answer: gain, unit: 'mag', tol: 0.005,
        hint: 'Light grasp G = (D/p)². Magnitude gain = 2.5 log₁₀ G = 5 log₁₀(D/p).',
        solution: steps(`G = (${Dm} / ${pup})² = ${n((Dm / pup) ** 2, 4)} times the light.`, `Δm = 2.5 log₁₀ ${n((Dm / pup) ** 2, 4)} = <b>${n(gain)} mag</b>. From a sky where your eye reaches magnitude 6, that is about magnitude ${n(6 + gain)}.`),
        Dm, pup,
      };
    },
    verify: (p) => 2.5 * Math.log10((p.Dm / p.pup) ** 2),
  },
  'exit-pupil': {
    title: 'magnification and exit pupil',
    make(r) {
      const Dm = one(r, [80, 102, 127, 150, 200, 254]), N = one(r, [4, 5, 6, 8, 10]), fe = one(r, [5, 7, 9, 12, 15, 20, 25, 32, 40]);
      const F = Dm * N, M = F / fe, ep = Dm / M;
      return {
        q: `<p>A ${Dm} mm f/${N} telescope (focal length ${F} mm) is used with a ${fe} mm eyepiece. What is the exit pupil, in mm?</p>`,
        answer: ep, unit: 'mm', tol: 0.005,
        hint: 'Magnification M = F / f<sub>e</sub>. Exit pupil = D / M (or simply f<sub>e</sub> / N).',
        solution: steps(`M = ${F} ÷ ${fe} = ${n(M)}×.`, `Exit pupil = ${Dm} ÷ ${n(M)} = <b>${n(ep)} mm</b>${ep > 7 ? ': wider than your pupil, so some light is wasted' : ep < 0.7 ? ': very small, the view will be dim and blurry (empty magnification)' : ep < 2 ? ': good for planets and double stars' : ': good for faint deep-sky objects'}.`),
        Dm, N, fe,
      };
    },
    verify: (p) => p.fe / p.N,
  },
  'dawson-limit': {
    title: 'closest double star a telescope can split',
    make(r) {
      const Dm = pick(r, 50, 400, 5);
      const lim = 116 / Dm;
      return {
        q: `<p>Using the Dawson limit, what is the closest pair of equal stars a telescope of ${Dm} mm aperture can split, in arcseconds (on a steady night)?</p>`,
        answer: lim, unit: '″', tol: 0.005,
        hint: 'Dawson limit ≈ 116″ ÷ aperture in mm. (The Rayleigh criterion, 138″/D at 550 nm, is a little stricter.)',
        solution: steps(`116 ÷ ${Dm} = <b>${n(lim)}″</b>.`, lim < 1 ? 'Below 1″ the seeing on most nights, not the telescope, sets the limit.' : 'Many famous doubles, such as Albireo (35″), are far wider than this.'),
        Dm,
      };
    },
    verify: (p) => (138 / p.Dm) * (116 / 138),
  },
  'sct-focal-ratio': {
    title: 'focal ratio of a two-mirror telescope',
    make(r) {
      const Dm = one(r, [150, 200, 235, 280, 355]), N1 = one(r, [2, 2.5, 3]), m2 = pick(r, 3, 5, 0.5);
      const F = Dm * N1 * m2, N = F / Dm;
      return {
        q: `<p>A catadioptric telescope has a ${Dm} mm f/${N1} primary mirror. Its convex secondary magnifies the primary's image ${m2} times. What is the telescope's focal ratio (the f-number)?</p>`,
        answer: N, unit: '', tol: 0.005,
        hint: 'Effective focal length F = m₂ × f₁, where f₁ = N₁ × D. Focal ratio = F / D.',
        solution: steps(`f₁ = ${N1} × ${Dm} = ${n(N1 * Dm)} mm.`, `F = ${m2} × ${n(N1 * Dm)} = ${n(F)} mm.`, `Focal ratio = ${n(F)} ÷ ${Dm} = <b>f/${n(N)}</b>: a long focal length in a short tube.`),
        N1, m2,
      };
    },
    verify: (p) => p.N1 * p.m2,
  },
  'polar-drift': {
    title: 'longest exposure before polar misalignment shows',
    make(r) {
      const errMin = pick(r, 1, 30, 1), s = pick(r, 0.8, 4, 0.1);
      const w = (2 * Math.PI) / 86164, t = s / (errMin * 60 * w);
      return {
        q: `<p>Your mount's polar axis is ${errMin} arcminute${errMin === 1 ? '' : 's'} off the pole. Your camera's image scale is ${s}″ per pixel. Roughly how many seconds can you expose before a star near the celestial equator drifts by one pixel in declination?</p>`,
        answer: t, unit: 's', tol: 0.01,
        hint: 'Drift rate ≈ ε × ω, with ε in arcseconds and ω = 7.29 × 10⁻⁵ rad/s (Earth\'s turn). t = s ÷ (ε ω).',
        solution: steps(`ε = ${errMin} × 60 = ${errMin * 60}″.`, `Drift = ${errMin * 60} × 7.29 × 10<sup>−5</sup> = ${n(errMin * 60 * w, 4)}″ per second.`, `t = ${s} ÷ ${n(errMin * 60 * w, 4)} = <b>${n(t)} s</b>.`),
        errMin, s,
      };
    },
    verify: (p) => (p.s * 86164) / (2 * Math.PI * p.errMin * 60),
  },
  'true-field': {
    title: 'how much sky an eyepiece shows',
    make(r) {
      const F = one(r, [400, 650, 750, 900, 1200, 1500, 2000]), fe = one(r, [9, 12, 15, 20, 25, 32, 40]), afov = one(r, [50, 52, 60, 68, 82]);
      const M = F / fe, tf = afov / M;
      return {
        q: `<p>A ${fe} mm eyepiece with a ${afov}° apparent field is used on a telescope of ${F} mm focal length. How wide a patch of sky do you see, in degrees? (The full Moon is about 0.5°.)</p>`,
        answer: tf, unit: '°', tol: 0.005,
        hint: 'Magnification M = F / f<sub>e</sub>. True field ≈ apparent field ÷ M.',
        solution: steps(`M = ${F} ÷ ${fe} = ${n(M)}×.`, `True field = ${afov}° ÷ ${n(M)} = <b>${n(tf)}°</b>, about ${n(tf / 0.5)} full Moons wide.`),
        F, fe, afov,
      };
    },
    verify: (p) => (p.afov * p.fe) / p.F,
  },
  // ---------- Module 5: observing ----------
  'planet-size': {
    title: 'how big a planet looks',
    make(r) {
      const [name, d, a] = one(r, [['Mars', 6779, 1.524], ['Jupiter', 139820, 5.203], ['Saturn (the globe)', 116460, 9.537], ['Uranus', 50724, 19.19], ['Neptune', 49244, 30.07]]);
      const opp = r() < 0.6, dist = (opp ? a - 1 : a + 1) * 1.496e8;
      const th = (206265 * d) / dist;
      return {
        q: `<p>${name} is ${d.toLocaleString('en-CA')} km across and orbits at ${a} AU. Treating orbits as circles, how big does it look at ${opp ? 'opposition (closest)' : 'conjunction (furthest)'}, in arcseconds? (1 AU = 1.496 × 10⁸ km.)</p>`,
        answer: th, unit: '″', tol: 0.005,
        hint: `Distance at ${opp ? 'opposition is a − 1' : 'conjunction is a + 1'} AU. Then θ = 206,265″ × diameter ÷ distance.`,
        solution: steps(`Distance = ${opp ? `${a} − 1` : `${a} + 1`} = ${n(opp ? a - 1 : a + 1, 4)} AU = ${n(dist)} km.`, `θ = 206,265 × ${d.toLocaleString('en-CA')} ÷ ${n(dist)} = <b>${n(th)}″</b>.`),
        d, a, opp,
      };
    },
    verify: (p) => 2 * Math.atan(p.d / 2 / ((p.opp ? p.a - 1 : p.a + 1) * 1.496e8)) / D2R * 3600,
  },
  'surface-brightness': {
    title: 'how faint a galaxy\'s light is per patch',
    make(r) {
      const m = pick(r, 6, 12, 0.1), a = pick(r, 2, 40, 1), b = Math.max(1, Math.round(a * pick(r, 0.3, 1, 0.1)));
      const A = Math.PI * 30 * a * 30 * b, mu = m + 2.5 * Math.log10(A);
      return {
        q: `<p>A galaxy has total magnitude ${m} and is an ellipse ${a}′ × ${b}′. What is its average surface brightness, in magnitudes per square arcsecond?</p>`,
        answer: mu, unit: 'mag/arcsec²', tol: 0, abs: 0.011,
        hint: 'Area A = π × (30a) × (30b) square arcseconds (30 because the semi-axes are half the size, in arcseconds). Then μ = m + 2.5 log₁₀ A.',
        solution: steps(`A = π × ${30 * a} × ${30 * b} = ${n(A, 5)} arcsec².`, `2.5 log₁₀ A = ${n(2.5 * Math.log10(A), 4)}.`, `μ = ${m} + ${n(2.5 * Math.log10(A), 4)} = <b>${mu.toFixed(2)}</b>${mu > 22 ? ': fainter than a dark sky (≈ 21.9), a tough target' : ': brighter than a dark sky background'}.`),
        m, a, b,
      };
    },
    // independent: spread the total flux over the area and convert back to a magnitude
    verify: (p) => -2.5 * Math.log10(10 ** (-0.4 * p.m) / (Math.PI * 900 * p.a * p.b)),
  },
  'double-mass': {
    title: 'weigh a double star from its orbit',
    make(r) {
      const Mt = pick(r, 0.5, 5, 0.1), P = pick(r, 20, 400, 5), par = pick(r, 0.05, 0.4, 0.01);
      const aa = +((Mt * P * P) ** (1 / 3) * par).toFixed(2);
      const aAU = aa / par, M = aAU ** 3 / P ** 2;
      return {
        q: `<p>A double star's orbit has an angular semi-major axis of ${aa}″ and a period of ${P} years. Its parallax is ${par}″. What is the total mass of the two stars, in Suns?</p>`,
        answer: M, unit: 'M☉', tol: 0.01,
        hint: 'Semi-major axis in AU = a″ ÷ p″. Then Kepler: M₁ + M₂ = a³ / P².',
        solution: steps(`a = ${aa} ÷ ${par} = ${n(aAU, 4)} AU.`, `a³ = ${n(aAU ** 3, 4)}; P² = ${n(P ** 2, 4)}.`, `M = <b>${n(M)} M☉</b>.`),
        aa, par, P,
      };
    },
    verify: (p) => (p.aa / p.par) ** 3 / p.P ** 2,
  },
  'fraction-estimate': {
    title: 'estimate a variable star by the fraction method',
    make(r) {
      const mA = pick(r, 5, 9, 0.1), gap = pick(r, 0.4, 1.2, 0.1), mB = +(mA + gap).toFixed(1), a = pick(r, 1, 6), b = pick(r, 1, 6);
      const mv = mA + (mB - mA) * a / (a + b);
      return {
        q: `<p>Comparison star A is magnitude ${mA} and B is ${mB}. You judge the variable to be ${a} step${a === 1 ? '' : 's'} fainter than A and ${b} step${b === 1 ? '' : 's'} brighter than B. What is your estimate of its magnitude (to 0.1)?</p>`,
        answer: Math.round(mv * 10) / 10, unit: 'mag', tol: 0, abs: 0.051,
        hint: 'm<sub>V</sub> = m<sub>A</sub> + (m<sub>B</sub> − m<sub>A</sub>) × a / (a + b). Report to one decimal: visual estimates are not better than that.',
        solution: steps(`a / (a + b) = ${a} / ${a + b} = ${n(a / (a + b), 3)}.`, `m<sub>V</sub> = ${mA} + ${n(gap)} × ${n(a / (a + b), 3)} = ${n(mv, 4)}, so <b>${(Math.round(mv * 10) / 10).toFixed(1)}</b>.`),
        mA, mB, a, b,
      };
    },
    verify: (p) => Math.round((p.mB - (p.mB - p.mA) * p.b / (p.a + p.b)) * 10) / 10,
  },
  'zhr': {
    title: 'zenithal hourly rate from your own count',
    make(r) {
      const N = pick(r, 10, 120), T = pick(r, 1, 3, 0.5), k = pick(r, 0, 0.3, 0.05), lm = pick(r, 5.2, 6.8, 0.1), hR = pick(r, 25, 85, 5), rr = one(r, [2.0, 2.2, 2.5, 2.6, 3.0]);
      const zhr = (N / T) * (1 / (1 - k)) * rr ** (6.5 - lm) / Math.sin(hR * D2R);
      return {
        q: `<p>During a meteor shower (population index r = ${rr}) you count ${N} meteors in ${T} hours of watching. ${Math.round(k * 100)}% of your view is blocked, your limiting magnitude is ${lm}, and the radiant is ${hR}° up. What is the ZHR?</p>`,
        answer: zhr, unit: 'meteors/h', tol: 0.01,
        hint: 'ZHR = (N/T) × 1/(1 − k) × r^(6.5 − lm) × 1/sin h<sub>R</sub>.',
        solution: steps(`N/T = ${n(N / T)} per hour.`, `× 1/(1 − ${k}) = ${n(1 / (1 - k), 4)}; × ${rr}<sup>${n(6.5 - lm)}</sup> = ${n(rr ** (6.5 - lm), 4)}; × 1/sin ${hR}° = ${n(1 / Math.sin(hR * D2R), 4)}.`, `ZHR = <b>${n(zhr)}</b> meteors per hour for an ideal observer.`),
        N, T, k, lm, hR, rr,
      };
    },
    verify: (p) => Math.exp(Math.log(p.N / p.T) - Math.log(1 - p.k) + (6.5 - p.lm) * Math.log(p.rr) - Math.log(Math.cos((90 - p.hR) * D2R))),
  },
  'occultation-chord': {
    title: 'length of an asteroid chord from a timing',
    make(r) {
      const v = pick(r, 3, 25, 0.5), t = pick(r, 0.5, 20, 0.1);
      return {
        q: `<p>An asteroid's shadow sweeps across Earth at ${v} km/s. A star disappears behind it for ${t} seconds at your site. How long is the chord across the asteroid that you measured, in km?</p>`,
        answer: v * t, unit: 'km', tol: 0.005,
        hint: 'Chord = shadow speed × time hidden.',
        solution: steps(`${v} km/s × ${t} s = <b>${n(v * t)} km</b>.`, 'Several observers spread across the path give several chords, which outline the asteroid\'s shape.'),
        v, t,
      };
    },
    verify: (p) => (p.t * 1000 * p.v) / 1000,
  },
  'to-ut': {
    title: 'convert your local time to UT',
    make(r) {
      const [place, off] = one(r, [['Toronto in winter', -5], ['Toronto in summer', -4], ['Vancouver in winter', -8], ['London in summer', 1], ['Mumbai', 5.5], ['Dubai', 4], ['Sydney in summer', 11]]);
      const hh = pick(r, 18, 23), mm = pick(r, 0, 55, 5);
      const loc = hh + mm / 60, ut = (((loc - off) % 24) + 24) % 24;
      return {
        q: `<p>You observe from ${place} (UTC${off >= 0 ? '+' : '−'}${Math.abs(off)}) and log an observation at ${hh}:${String(mm).padStart(2, '0')} local time. What is that in UT, as decimal hours from 0 to 24? (If it passes midnight, note that the UT date moves on too.)</p>`,
        answer: ut, unit: 'h', tol: 0, abs: 0.009,
        hint: 'UT = local time − offset. Add or subtract 24 to land between 0 and 24.',
        solution: steps(`Local = ${hh} + ${mm}/60 = ${n(loc, 4)} h.`, `UT = ${n(loc, 4)} − (${off}) = ${n(loc - off, 4)} h${loc - off >= 24 ? ' − 24' : loc - off < 0 ? ' + 24' : ''} = <b>${n(ut, 4)} h</b>${loc - off >= 24 ? ' on the next UT date' : loc - off < 0 ? ' on the previous UT date' : ''}.`),
        loc, off,
      };
    },
    verify: (p) => { const d = new Date(Date.UTC(2027, 0, 10, 0, 0) + (p.loc - p.off) * 3600000); return d.getUTCHours() + d.getUTCMinutes() / 60 + d.getUTCSeconds() / 3600; },
  },
  // ---------- Module 6: astrophotography ----------
  'image-scale': {
    title: 'image scale of a camera on a telescope',
    make(r) {
      const p = one(r, [2.4, 2.9, 3.76, 3.8, 4.63, 5.4, 6.0]), F = one(r, [250, 360, 420, 530, 800, 1000, 1200, 2000, 2800]);
      const s = (206.265 * p) / F;
      return {
        q: `<p>A camera with ${p} µm pixels sits at the focus of a telescope with a focal length of ${F} mm. What is the image scale, in arcseconds per pixel?</p>`,
        answer: s, unit: '″/px', tol: 0.005,
        hint: 's = 206.265 × p (µm) ÷ F (mm).',
        solution: steps(`s = 206.265 × ${p} ÷ ${F} = <b>${n(s)}″ per pixel</b>.`, s < 0.7 ? 'Finer than most seeing allows: you could bin pixels 2 × 2.' : s > 3.5 ? 'Coarse: stars may look blocky, but you get a wide field.' : 'A good match to typical 2″ to 4″ seeing.'),
        p, F,
      };
    },
    verify: (q) => Math.atan((q.p * 1e-3) / q.F) / D2R * 3600,
  },
  'ccd-snr': {
    title: 'signal-to-noise of a star in one exposure',
    make(r) {
      const S = pick(r, 5, 200, 5), npix = pick(r, 10, 40, 2), B = pick(r, 0.5, 20, 0.5), Dk = pick(r, 0, 0.5, 0.05), R = pick(r, 1.5, 8, 0.5), t = pick(r, 30, 600, 30);
      const snr = (S * t) / Math.sqrt(S * t + npix * (B + Dk) * t + npix * R ** 2);
      return {
        q: `<p>A star gives ${S} e⁻/s spread over ${npix} pixels. The sky gives ${B} e⁻/s per pixel, dark current is ${Dk} e⁻/s per pixel and read noise is ${R} e⁻. What is the signal-to-noise ratio in a ${t} s exposure?</p>`,
        answer: snr, unit: '', tol: 0.005,
        hint: 'SNR = S t / √(S t + n (B + D) t + n R²).',
        solution: steps(`Signal S t = ${(S * t).toLocaleString('en-CA')} e⁻.`, `Noise² = ${(S * t).toLocaleString('en-CA')} + ${npix} × ${n(B + Dk)} × ${t} + ${npix} × ${R}² = ${n(S * t + npix * (B + Dk) * t + npix * R ** 2, 5)}.`, `SNR = ${(S * t).toLocaleString('en-CA')} ÷ ${n(Math.sqrt(S * t + npix * (B + Dk) * t + npix * R ** 2), 4)} = <b>${n(snr)}</b>.`),
        S, npix, B, Dk, R, t,
      };
    },
    verify: (p) => { const parts = [p.S * p.t, p.npix * p.B * p.t, p.npix * p.Dk * p.t, p.npix * p.R * p.R]; return (p.S * p.t) / Math.hypot(...parts.map(Math.sqrt)); },
  },
  'calibrate-pixel': {
    title: 'calibrate one pixel with a dark and a flat',
    make(r) {
      const light = pick(r, 1500, 9000, 10), dark = pick(r, 200, 900, 10), flat = pick(r, 18000, 30000, 100), fdark = pick(r, 100, 400, 10), fmean = pick(r, 20000, 26000, 100);
      const norm = (flat - fdark) / fmean, cal = (light - dark) / norm;
      return {
        q: `<p>One pixel reads ${light.toLocaleString('en-CA')} in a light frame. The master dark reads ${dark} there. The master flat reads ${flat.toLocaleString('en-CA')} at that pixel, its flat dark ${fdark}, and the mean of the dark-subtracted flat is ${fmean.toLocaleString('en-CA')}. What is the calibrated value?</p>`,
        answer: cal, unit: 'ADU', tol: 0.005,
        hint: 'Calibrated = (light − dark) ÷ [(flat − flat dark) ÷ mean of (flat − flat dark)].',
        solution: steps(`Light − dark = ${(light - dark).toLocaleString('en-CA')}.`, `Normalised flat = (${flat.toLocaleString('en-CA')} − ${fdark}) ÷ ${fmean.toLocaleString('en-CA')} = ${n(norm, 4)}${norm < 1 ? ' (this pixel gets less light, e.g. vignetting or dust)' : ' (this pixel gets a little more light than average)'}.`, `Calibrated = ${(light - dark).toLocaleString('en-CA')} ÷ ${n(norm, 4)} = <b>${n(cal, 5)}</b>.`),
        light, dark, flat, fdark, fmean,
      };
    },
    verify: (p) => ((p.light - p.dark) * p.fmean) / (p.flat - p.fdark),
  },
  'frames-needed': {
    title: 'how many frames to stack for a target SNR',
    make(r) {
      const snr1 = pick(r, 2, 15, 0.5), target = pick(r, 20, 100, 5);
      const nf = Math.ceil((target / snr1) ** 2 - 1e-9);
      return {
        q: `<p>One sub-exposure of a faint nebula gives a signal-to-noise ratio of ${snr1}. How many frames must you stack to reach an SNR of at least ${target}?</p>`,
        answer: nf, unit: 'frames', tol: 0, abs: 0.01,
        hint: 'Stacking n frames multiplies SNR by √n. So n = (target / SNR₁)², rounded up.',
        solution: steps(`target ÷ SNR₁ = ${target} ÷ ${snr1} = ${n(target / snr1, 4)}.`, `n = ${n(target / snr1, 4)}² = ${n((target / snr1) ** 2, 5)}, rounded up: <b>${nf} frames</b>.`, 'Four times as many frames doubles the SNR: improvements get slow quickly.'),
        snr1, target,
      };
    },
    verify: (p) => { let k = 1; while (p.snr1 * Math.sqrt(k) < p.target - 1e-9) k++; return k; },
  },
  'npf-rule': {
    title: 'longest untracked exposure before stars trail',
    make(r) {
      const N = one(r, [1.4, 1.8, 2, 2.8, 4]), p = one(r, [3.8, 4.3, 5.9, 6.0]), F = one(r, [14, 20, 24, 35, 50, 85]), dec = pick(r, 0, 70, 5);
      const t = (35 * N + 30 * p) / (F * Math.cos(dec * D2R));
      return {
        q: `<p>On a fixed tripod you shoot with a ${F} mm lens at f/${N}, on a camera with ${p} µm pixels, aimed at declination ${dec}°. Using the simplified NPF rule, what is the longest exposure before stars start to trail, in seconds?</p>`,
        answer: t, unit: 's', tol: 0.005,
        hint: 't ≈ (35N + 30p) ÷ (F cos δ).',
        solution: steps(`35 × ${N} + 30 × ${p} = ${n(35 * N + 30 * p, 4)}.`, `F cos δ = ${F} × cos ${dec}° = ${n(F * Math.cos(dec * D2R), 4)}.`, `t = <b>${n(t)} s</b>. Stars near the pole move slower, so you can expose longer there.`),
        N, p, F, dec,
      };
    },
    verify: (q) => (35 * q.N + 30 * q.p) / q.F / Math.sin((90 - q.dec) * D2R),
  },
  'mosaic-panels': {
    title: 'how many mosaic panels a big target needs',
    make(r) {
      const L = one(r, [15.6, 17.3, 23.5, 36]), F = one(r, [250, 400, 530, 800, 1000]), W = pick(r, 1, 8, 0.5), o = one(r, [0.1, 0.15, 0.2]);
      const th = 57.3 * L / F, panels = W <= th ? 1 : 1 + Math.ceil((W - th) / (th * (1 - o)) - 1e-9);
      return {
        q: `<p>Your sensor is ${L} mm wide and your telescope's focal length is ${F} mm. You want to cover a nebula ${W}° wide in a row of panels overlapping by ${Math.round(o * 100)}%. How many panels does the row need?</p>`,
        answer: panels, unit: 'panels', tol: 0, abs: 0.01,
        hint: 'Field θ ≈ 57.3° × L / F. Then n = 1 + ⌈(W − θ) / (θ (1 − overlap))⌉, or 1 if the target fits in one frame.',
        solution: steps(`θ = 57.3 × ${L} ÷ ${F} = ${n(th, 4)}°.`, W <= th ? `The ${W}° target fits in one frame.` : `Each new panel adds ${n(th * (1 - o), 4)}°. (W − θ) ÷ that = ${n((W - th) / (th * (1 - o)), 4)}, rounded up: ${Math.ceil((W - th) / (th * (1 - o)) - 1e-9)}.`, `<b>${panels} panel${panels === 1 ? '' : 's'}</b>.`),
        L, F, W, o,
      };
    },
    verify: (p) => { const th = 57.3 * p.L / p.F; let k = 1, cover = th; while (cover < p.W - 1e-9) { k++; cover += th * (1 - p.o); } return k; },
  },
  'asinh-stretch': {
    title: 'how an arcsinh stretch lifts faint signal',
    make(r) {
      const x = pick(r, 0.002, 0.05, 0.001), beta = one(r, [10, 20, 40, 80, 150]);
      const y = Math.asinh(beta * x) / Math.asinh(beta);
      return {
        q: `<p>After subtracting the black point, a faint pixel has value ${x} (on a 0 to 1 scale). With an arcsinh stretch of strength β = ${beta}, what value does it get on screen?</p>`,
        answer: y, unit: '', tol: 0.005,
        hint: 'y = asinh(β x) ÷ asinh(β), where asinh(z) = ln(z + √(z² + 1)).',
        solution: steps(`β x = ${n(beta * x, 4)}; asinh = ${n(Math.asinh(beta * x), 4)}.`, `asinh ${beta} = ${n(Math.asinh(beta), 4)}.`, `y = <b>${n(y)}</b>, ${n(y / x)} times brighter on screen, while a pixel at 1 stays at 1.`),
        x, beta,
      };
    },
    verify: (p) => Math.log(p.beta * p.x + Math.sqrt((p.beta * p.x) ** 2 + 1)) / Math.log(p.beta + Math.sqrt(p.beta ** 2 + 1)),
  },
};
