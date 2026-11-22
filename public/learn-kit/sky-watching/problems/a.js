// Live problems for Sky watching, part a: Modules 1-3 (see ../problems.js).
import { pick, n, steps } from './util.js';

const D = Math.PI / 180;
const sin = (x) => Math.sin(x * D), cos = (x) => Math.cos(x * D), tan = (x) => Math.tan(x * D);
const one = (r, list) => list[Math.floor(r() * list.length * 0.9999)];
const ns = (lat) => (lat >= 0 ? `${lat}° N` : `${-lat}° S`);

export default {
  // ---------- Module 1: the sky above you ----------
  'max-altitude': {
    title: 'how high a star climbs',
    make(r) {
      const lat = pick(r, -45, 60, 1), [name, dec] = one(r, [['Vega', 38.8], ['Sirius', -16.7], ['Arcturus', 19.2], ['Antares', -26.4], ['Capella', 46.0], ['Spica', -11.2], ['Altair', 8.9], ['Rigel', -8.2]]);
      const h = 90 - Math.abs(lat - dec);
      if (h <= 2) return this.make(() => 0.5);
      return {
        q: `<p>You are at latitude ${ns(lat)}. ${name} has declination ${dec > 0 ? '+' : ''}${dec}°. How high above the horizon is it when it crosses your meridian (its highest point), in degrees?</p>`,
        answer: h, unit: '°', tol: 0, abs: 0.051,
        hint: 'Highest altitude h = 90° − |φ − δ|, with southern latitudes and declinations negative.',
        solution: steps(`φ − δ = ${lat} − (${dec}) = ${n(lat - dec)}°.`, `h = 90 − ${n(Math.abs(lat - dec))} = <b>${n(h)}°</b>.`),
        lat, dec,
      };
    },
    verify: (p) => Math.asin(sin(p.dec) * sin(p.lat) + cos(p.dec) * cos(p.lat)) / D,
  },
  'hours-up': {
    title: 'how many hours a star stays above the horizon',
    make(r) {
      const lat = pick(r, 10, 55, 1), dec = pick(r, -25, 25, 1);
      const H0 = Math.acos(-tan(lat) * tan(dec)) / D, hrs = (2 * H0) / 15;
      return {
        q: `<p>At latitude ${lat}° N, how many hours is a star of declination ${dec > 0 ? '+' : ''}${dec}° above the horizon each day? (Ignore refraction; use sidereal hours.)</p>`,
        answer: hrs, unit: 'h', tol: 0.005,
        hint: 'cos H₀ = −tan φ tan δ gives the hour angle of setting in degrees. Hours up = 2H₀ ÷ 15.',
        solution: steps(`cos H₀ = −tan ${lat}° × tan ${dec}° = ${n(-tan(lat) * tan(dec), 4)}.`, `H₀ = ${n(H0, 4)}°.`, `Hours up = 2 × ${n(H0, 4)} ÷ 15 = <b>${n(hrs)} h</b>${dec > 0 ? ' (more than 12: northern stars stay up longer in the north)' : dec < 0 ? ' (less than 12)' : ''}.`),
        lat, dec,
      };
    },
    verify: (p) => { let up = 0; const N = 36000; for (let i = 0; i < N; i++) { const H = (i / N) * 360; if (sin(p.dec) * sin(p.lat) + cos(p.dec) * cos(p.lat) * cos(H) > 0) up++; } return (24 * up) / N; },
    vtol: 0.006,
  },
  'noon-sun': {
    title: 'how high the noon Sun climbs',
    make(r) {
      const lat = pick(r, 20, 60, 1), [when, dec] = one(r, [['the June solstice', 23.44], ['the December solstice', -23.44], ['an equinox', 0], ['early May', 16], ['early November', -15.5]]);
      const h = 90 - Math.abs(lat - dec);
      return {
        q: `<p>At latitude ${lat}° N on ${when} (the Sun's declination is ${dec > 0 ? '+' : ''}${dec}°), how high is the Sun at local noon, in degrees?</p>`,
        answer: h, unit: '°', tol: 0, abs: 0.051,
        hint: 'Noon altitude h = 90° − |φ − δ☉|. (Energy per square metre is proportional to sin h.)',
        solution: steps(`h = 90 − |${lat} − (${dec})| = <b>${n(h)}°</b>.`, `sin ${n(h)}° = ${n(sin(h))}, so flat ground gets ${n(sin(h) * 100)}% of the overhead-Sun energy per square metre.`),
        lat, dec,
      };
    },
    verify: (p) => 90 - Math.acos(cos(p.lat - p.dec)) / D,
  },
  'moon-lit': {
    title: 'how much of the Moon is lit',
    make(r) {
      const psi = pick(r, 10, 170, 5);
      const k = (1 - cos(psi)) / 2;
      return {
        q: `<p>The Moon is ${psi}° from the Sun in the sky (its elongation). What percentage of its disc is lit?</p>`,
        answer: k * 100, unit: '%', tol: 0.01,
        hint: 'Fraction lit k = (1 − cos ψ) / 2: 0 at new Moon (ψ = 0°), 1 at full (ψ = 180°).',
        solution: steps(`cos ${psi}° = ${n(cos(psi), 4)}.`, `k = (1 − ${n(cos(psi), 4)}) / 2 = ${n(k, 4)} = <b>${n(k * 100)}%</b>, a ${psi < 90 ? 'crescent' : psi === 90 ? 'quarter' : 'gibbous'} Moon.`),
        psi,
      };
    },
    verify: (p) => 100 * sin(p.psi / 2) ** 2,
  },
  'synodic-period': {
    title: 'how often a planet comes to opposition',
    make(r) {
      const [name, P] = one(r, [['Mars', 1.881], ['Jupiter', 11.86], ['Saturn', 29.46], ['Uranus', 84.0], ['Neptune', 164.8], ['the dwarf planet Ceres', 4.60]]);
      const S = 1 / (1 - 1 / P);
      return {
        q: `<p>${name[0].toUpperCase() + name.slice(1)} takes ${P} years to orbit the Sun. How many <b>days</b> pass between one opposition and the next?</p>`,
        answer: S * 365.25, unit: 'days', tol: 0.005,
        hint: 'For an outer planet: 1/S = 1/E − 1/P with Earth\'s year E = 1. Then × 365.25 for days.',
        solution: steps(`1/S = 1 − 1/${P} = ${n(1 - 1 / P, 4)}.`, `S = ${n(S, 4)} years.`, `× 365.25 = <b>${n(S * 365.25, 4)} days</b>.`),
        P,
      };
    },
    // independent: step Earth and the planet round until Earth has gained a full lap
    verify: (p) => { let t = 0; const dt = 0.01; while ((t / 365.25) * 360 - (t / (365.25 * p.P)) * 360 < 360) t += dt; return t; },
  },
  'hand-angle': {
    title: 'measure the sky with your hand',
    make(r) {
      const fists = pick(r, 0, 4), fingers = pick(r, 1, 4), little = pick(r, 0, 3);
      const deg = fists * 10 + fingers * 5 + little;
      return {
        q: `<p>At arm's length, the gap between two stars measures ${fists} closed fist${fists === 1 ? '' : 's'}, plus ${fingers} three-finger width${fingers === 1 ? '' : 's'}, plus ${little} little-finger width${little === 1 ? '' : 's'}. About how many degrees apart are they?</p>`,
        answer: deg, unit: '°', tol: 0, abs: 0.01,
        hint: 'At arm\'s length: fist ≈ 10°, three middle fingers ≈ 5°, little finger ≈ 1°.',
        solution: steps(`${fists} × 10° + ${fingers} × 5° + ${little} × 1° = <b>${deg}°</b>.`, 'The Big Dipper\'s pointer stars, for comparison, are about 5° apart.'),
        fists, fingers, little,
      };
    },
    verify: (p) => [p.fists, p.fists, p.fingers, p.little / 5].reduce((s, v) => s + v * 5, 0),
  },
  'mag-ratio': {
    title: 'how many times brighter one star is',
    make(r) {
      const m1 = pick(r, -1.5, 3, 0.1), dm = pick(r, 0.5, 8, 0.1), m2 = +(m1 + dm).toFixed(1);
      const ratio = 10 ** (0.4 * (m2 - m1));
      return {
        q: `<p>Star A has magnitude ${m1} and star B magnitude ${m2}. How many times more light reaches us from star A than from star B?</p>`,
        answer: ratio, unit: '×', tol: 0.01,
        hint: 'F₁/F₂ = 10^(0.4 × (m₂ − m₁)). Every 5 magnitudes is exactly 100 times.',
        solution: steps(`m₂ − m₁ = ${n(dm)}.`, `10<sup>0.4 × ${n(dm)}</sup> = 10<sup>${n(0.4 * dm, 4)}</sup> = <b>${n(ratio)} times</b>.`),
        m1, m2,
      };
    },
    verify: (p) => 100 ** ((p.m2 - p.m1) / 5),
  },
  // ---------- Module 2: coordinates and time ----------
  'altitude-from-ha': {
    title: 'altitude of a star from its hour angle',
    make(r) {
      const lat = pick(r, 25, 55, 1), dec = pick(r, -10, 60, 1), Hh = pick(r, -4, 4, 0.5);
      const h = Math.asin(sin(dec) * sin(lat) + cos(dec) * cos(lat) * cos(Hh * 15)) / D;
      if (h < 3) return this.make(() => 0.6);
      return {
        q: `<p>From latitude ${lat}° N, a star of declination ${dec > 0 ? '+' : ''}${dec}° has hour angle ${Hh} h (${Hh < 0 ? 'east of' : 'west of'} the meridian${Hh === 0 ? ', on it' : ''}). What is its altitude, in degrees?</p>`,
        answer: h, unit: '°', tol: 0, abs: 0.06,
        hint: 'Turn hours into degrees (× 15), then sin h = sin δ sin φ + cos δ cos φ cos H.',
        solution: steps(`H = ${Hh} × 15 = ${Hh * 15}°.`, `sin h = sin ${dec}° sin ${lat}° + cos ${dec}° cos ${lat}° cos ${Hh * 15}° = ${n(Math.sin(h * D), 4)}.`, `h = <b>${n(h)}°</b>.`),
        lat, dec, Hh,
      };
    },
    // independent: build the star's 3D unit vector and measure its height above the horizon plane
    verify: (p) => { const H = p.Hh * 15; const x = cos(p.dec) * cos(H), z = sin(p.dec); const up = x * cos(p.lat) + z * sin(p.lat); return Math.asin(up) / D; },
  },
  'ra-degrees': {
    title: 'right ascension in degrees',
    make(r) {
      const h = pick(r, 0, 23), m = pick(r, 0, 59), s = pick(r, 0, 59.9, 0.1);
      const deg = 15 * (h + m / 60 + s / 3600);
      return {
        q: `<p>A catalogue gives a galaxy's right ascension as ${h}h ${m}m ${s}s. What is that in degrees?</p>`,
        answer: deg, unit: '°', tol: 0, abs: 0.0006,
        hint: 'RA in degrees = 15 × (h + m/60 + s/3600), because 24 h = 360°.',
        solution: steps(`h + m/60 + s/3600 = ${h} + ${n(m / 60, 4)} + ${n(s / 3600, 4)} = ${n(h + m / 60 + s / 3600, 6)} h.`, `× 15 = <b>${deg.toFixed(4)}°</b>.`),
        h, m, s,
      };
    },
    verify: (p) => p.h * 15 + p.m / 4 + p.s / 240,
  },
  'transit-wait': {
    title: 'how long until a star crosses the meridian',
    make(r) {
      const lst = pick(r, 0, 23.9, 0.1), ra = pick(r, 0, 23.9, 0.1);
      const wait = ((ra - lst) % 24 + 24) % 24;
      return {
        q: `<p>Your local sidereal time is ${lst.toFixed(1)} h. A star has right ascension ${ra.toFixed(1)} h. How many hours from now will it cross your meridian (be due south from the north)?</p>`,
        answer: wait, unit: 'h', tol: 0, abs: 0.051,
        hint: 'A star is on the meridian when LST = RA. The wait is RA − LST, plus 24 if that is negative.',
        solution: steps(`RA − LST = ${ra.toFixed(1)} − ${lst.toFixed(1)} = ${n(ra - lst)} h.`, `${ra - lst < 0 ? 'Negative, so add 24: ' : ''}<b>${n(wait)} h</b> (sidereal hours; in clock time about ${n(wait * 0.99727)} h).`),
        lst, ra,
      };
    },
    verify: (p) => { let w = p.ra - p.lst; while (w < 0) w += 24; while (w >= 24) w -= 24; return w; },
  },
  'julian-date': {
    title: 'turn a date into a Julian date',
    make(r) {
      const Y = pick(r, 1950, 2049), M = pick(r, 1, 12), Dd = pick(r, 1, 28), hr = pick(r, 0, 23);
      let y = Y, m = M; if (m <= 2) { y -= 1; m += 12; }
      const A = Math.floor(y / 100), B = 2 - A + Math.floor(A / 4);
      const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + Dd + hr / 24 + B - 1524.5;
      const mon = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][M - 1];
      return {
        q: `<p>What is the Julian date of ${Dd} ${mon} ${Y} at ${String(hr).padStart(2, '0')}:00 UT? Give it to 3 decimal places.</p>`,
        answer: jd, unit: '', tol: 0, abs: 0.0015,
        hint: 'Meeus: if M ≤ 2, use Y − 1 and M + 12. A = ⌊Y/100⌋, B = 2 − A + ⌊A/4⌋. JD = ⌊365.25(Y + 4716)⌋ + ⌊30.6001(M + 1)⌋ + D + B − 1524.5, with D including the time as a fraction of a day.',
        solution: steps(`${M <= 2 ? `January and February count as months 13 and 14 of the year before: Y = ${y}, M = ${m}.` : `Y = ${y}, M = ${m}.`}`, `A = ${A}, B = ${B}. D = ${Dd} + ${hr}/24 = ${n(Dd + hr / 24, 6)}.`, `JD = ${Math.floor(365.25 * (y + 4716))} + ${Math.floor(30.6001 * (m + 1))} + ${n(Dd + hr / 24, 6)} + ${B} − 1524.5 = <b>${jd.toFixed(3)}</b>.`),
        Y, M, Dd, hr,
      };
    },
    verify: (p) => Date.UTC(p.Y, p.M - 1, p.Dd, p.hr) / 86400000 + 2440587.5,
  },
  'precession-shift': {
    title: 'how far precession moves the stars',
    make(r) {
      const yrs = pick(r, 50, 13000, 50);
      const deg = (50.29 * yrs) / 3600;
      return {
        q: `<p>Precession moves every star's ecliptic longitude by 50.29″ a year. By how many degrees has it moved in ${yrs.toLocaleString('en-CA')} years?</p>`,
        answer: deg, unit: '°', tol: 0.005,
        hint: 'Multiply by the number of years, then divide by 3,600 to turn arcseconds into degrees.',
        solution: steps(`50.29″ × ${yrs.toLocaleString('en-CA')} = ${n(50.29 * yrs, 5)}″.`, `÷ 3,600 = <b>${n(deg)}°</b>${deg > 25 ? '. That is why star charts and catalogues must say which epoch (such as J2000) they use.' : '.'}`),
        yrs,
      };
    },
    verify: (p) => (360 * p.yrs) / ((360 * 3600) / 50.29),
  },
  'extinction': {
    title: 'how much dimmer a star looks low in the sky',
    make(r) {
      const h = pick(r, 20, 80, 1), k = pick(r, 0.12, 0.35, 0.01), m0 = pick(r, 1, 9, 0.1);
      const X = 1 / sin(h), m = m0 + k * X;
      return {
        q: `<p>A star has magnitude ${m0} above the atmosphere. Tonight the extinction is k = ${k} magnitudes per airmass. What magnitude does it appear at when it is ${h}° above the horizon? (Use X = 1 / sin h.)</p>`,
        answer: m, unit: 'mag', tol: 0, abs: 0.006,
        hint: 'Airmass X = 1 / sin h. Then m = m₀ + k X.',
        solution: steps(`X = 1 / sin ${h}° = ${n(X, 4)}.`, `k X = ${k} × ${n(X, 4)} = ${n(k * X, 3)} mag.`, `m = ${m0} + ${n(k * X, 3)} = <b>${m.toFixed(2)}</b>.`),
        h, k, m0,
      };
    },
    verify: (p) => p.m0 + p.k / Math.cos((90 - p.h) * D),
  },
  // ---------- Module 3: dark skies ----------
  'pupil-gain': {
    title: 'how much a wider pupil helps',
    make(r) {
      const d1 = pick(r, 2, 3.5, 0.5), d2 = pick(r, 5, 7.5, 0.5);
      const gain = 2.5 * Math.log10((d2 / d1) ** 2);
      return {
        q: `<p>In daylight your pupil is ${d1} mm wide; after dark adaptation it opens to ${d2} mm. How many magnitudes fainter can you see from the pupil alone?</p>`,
        answer: gain, unit: 'mag', tol: 0.01,
        hint: 'Light collected ∝ area ∝ diameter². Magnitudes gained = 2.5 log₁₀(area ratio) = 5 log₁₀(d₂/d₁).',
        solution: steps(`Area ratio = (${d2} / ${d1})² = ${n((d2 / d1) ** 2, 4)}.`, `2.5 × log₁₀ ${n((d2 / d1) ** 2, 4)} = <b>${n(gain)} mag</b>. Most of the eye's night gain comes from the rods, not the pupil.`),
        d1, d2,
      };
    },
    verify: (p) => 5 * Math.log10(p.d2 / p.d1),
  },
  'walker-ratio': {
    title: 'which town brightens your sky more',
    make(r) {
      const P1 = pick(r, 200, 5000, 100) * 1000, d1 = pick(r, 30, 120, 5), P2 = pick(r, 5, 100, 5) * 1000, d2 = pick(r, 5, 25, 1);
      const ratio = (P2 * d2 ** -2.5) / (P1 * d1 ** -2.5);
      return {
        q: `<p>Your site is ${d1} km from a city of ${P1.toLocaleString('en-CA')} people and ${d2} km from a town of ${P2.toLocaleString('en-CA')}. Using Walker's law (glow ∝ P d<sup>−2.5</sup>), how many times more sky glow comes from the town than from the city?</p>`,
        answer: ratio, unit: '×', tol: 0.01,
        hint: 'Work out P × d^−2.5 for each place and divide town by city.',
        solution: steps(`City: ${P1.toLocaleString('en-CA')} × ${d1}<sup>−2.5</sup> = ${n(P1 * d1 ** -2.5)}.`, `Town: ${P2.toLocaleString('en-CA')} × ${d2}<sup>−2.5</sup> = ${n(P2 * d2 ** -2.5)}.`, `Ratio = <b>${n(ratio)}</b>${ratio > 1 ? ': the nearby town matters more' : ': the big city still wins'}.`),
        P1, d1, P2, d2,
      };
    },
    verify: (p) => (p.P2 / p.P1) * (p.d1 / p.d2) ** 2.5,
  },
  'seeing-blur': {
    title: 'how much the air blurs a star',
    make(r) {
      const r0 = pick(r, 3, 25, 1), lam = one(r, [450, 550, 650]);
      const eps = 0.98 * (lam * 1e-9) / (r0 / 100) * 206265;
      return {
        q: `<p>Tonight the Fried parameter is r₀ = ${r0} cm at ${lam} nm. How big is the seeing blur, in arcseconds?</p>`,
        answer: eps, unit: '″', tol: 0.01,
        hint: 'ε ≈ 0.98 λ / r₀ radians, with both in metres; × 206,265 for arcseconds.',
        solution: steps(`λ / r₀ = ${lam} × 10<sup>−9</sup> ÷ ${n(r0 / 100)} = ${n((lam * 1e-9) / (r0 / 100))} rad.`, `× 0.98 × 206,265 = <b>${n(eps)}″</b>${eps < 1 ? ': excellent seeing' : eps < 2.5 ? ': typical' : ': poor, stars will boil'}.`),
        r0, lam,
      };
    },
    verify: (p) => (0.98 * p.lam * 1e-7 / p.r0) * (180 / Math.PI) * 3600,
  },
  'dark-hours': {
    title: 'how many hours of full darkness tonight',
    make(r) {
      const lat = pick(r, 20, 48, 1), dec = pick(r, -23, 23, 1);
      const cH = (sin(-18) - sin(lat) * sin(dec)) / (cos(lat) * cos(dec));
      const H = Math.acos(cH) / D, hrs = 24 - (2 * H) / 15;
      return {
        q: `<p>At latitude ${lat}° N, the Sun's declination today is ${dec > 0 ? '+' : ''}${dec}°. How many hours of full astronomical darkness (Sun more than 18° below the horizon) are there tonight?</p>`,
        answer: hrs, unit: 'h', tol: 0.005,
        hint: 'cos H = (sin(−18°) − sin φ sin δ) / (cos φ cos δ) gives the Sun\'s hour angle when it reaches −18°. Darkness = 24 − 2H/15 hours.',
        solution: steps(`cos H = (${n(sin(-18), 4)} − sin ${lat}° sin ${dec}°) ÷ (cos ${lat}° cos ${dec}°) = ${n(cH, 4)}.`, `H = ${n(H, 4)}°, so the Sun is above −18° for 2H/15 = ${n((2 * H) / 15, 4)} h.`, `Darkness = 24 − ${n((2 * H) / 15, 4)} = <b>${n(hrs)} h</b>.`),
        lat, dec,
      };
    },
    verify: (p) => { let dark = 0; const N = 36000; for (let i = 0; i < N; i++) { const H = (i / N) * 360; if (sin(p.dec) * sin(p.lat) + cos(p.dec) * cos(p.lat) * cos(H) < sin(-18)) dark++; } return (24 * dark) / N; },
    vtol: 0.006,
  },
};
