// Figures for src/blog/discoveries/al-khadhaf-meteorite-fall-orbit-oman.md, made with the maths of the
// Orbit elements tool (src/lib/sci/orbitel.ts), with the Sun as the central body.
// Run: node scripts/blog-figures/al-khadhaf-meteorite-fall-orbit-oman.mjs   (rewrites the charts inside the article)
import fs from 'node:fs';
import { toState, info, propagate, track, pFromA, meanToAnomaly, anomalyToNu } from '../../src/lib/sci/orbitel.ts';
import { BODIES } from '../../src/lib/sci/orbit.ts';
import { chart, figure, inject } from './svg.mjs';

const ART = new URL('../../src/blog/discoveries/al-khadhaf-meteorite-fall-orbit-oman.md', import.meta.url);
const AU = 149597870.7;                                 // km (IAU 2012)
const MU = BODIES.find((b) => b.id === 'sun').mu;       // km³/s², the tool's Sun
const D2R = Math.PI / 180;

// Inputs. "Paper": Zappatini et al. (2026), Meteoritics & Planetary Science, doi:10.1111/maps.70110 (CC BY 4.0), abstract.
// "GFO page": the Global Fireball Observatory's public event page DN220308_03 (angles and uncertainties the abstract rounds).
const a = 1.722, e = 0.451, inc = 4.36;                 // au, -, degrees: paper (a 1.72, e 0.45, i 4.36) with GFO decimals
const da = 0.021, de = 0.007;                           // uncertainties: GFO page
const node = 347.97, argp = 212.25;                     // degrees: GFO page
const vEntryPaper = 14.0;                               // km/s: paper
const radiant = { ra: 138.785, dec: 34.744 };           // degrees J2000: GFO page (corrected radiant)
const JD_FALL = 2459647.3438;                           // 2022-03-08 20:15 UTC: paper (date and time of the fireball)
const V_ESC = 11.186;                                   // km/s, Earth's escape speed at the surface: literature

// Earth, Mars and Jupiter: JPL approximate mean elements for 1800-2050 (Standish), J2000 ecliptic. Literature.
const T = (JD_FALL - 2451545) / 36525;
const planet = (a0, e0, I, L, varpi, Om, aDot, eDot, LDot) => ({ a: a0 + aDot * T, e: e0 + eDot * T, i: I, L: L + LDot * T, varpi, Om });
const EARTH = planet(1.00000261, 0.01671123, 0, 100.46457166, 102.93768193, 0, 0.00000562, -0.00004392, 35999.37244981);
const MARS = planet(1.52371034, 0.0933941, 1.84969142, -4.55343205, -23.94362959, 49.55953891, 0, 0, 19140.30268499);
const JUP_A = 5.20288700;
const elOf = (p) => { // planet elements -> orbitel Elements at the fall
  const M = (((p.L - p.varpi) % 360) + 360) % 360, nu = anomalyToNu(meanToAnomaly(M * D2R, p.e), p.e) / D2R;
  return { p: pFromA(p.a * AU, p.e), e: p.e, i: p.i, raan: p.Om, argp: p.varpi - p.Om, nu };
};

// 1. The meteoroid at the moment it met Earth: on its descending node (Earth was at heliocentric longitude Ω + 180°),
// so its true anomaly was 180° − ω.
const metAt = (aa, ee) => ({ p: pFromA(aa * AU, ee), e: ee, i: inc, raan: node, argp, nu: 180 - argp });
const met = metAt(a, e), I = info(met, MU), sm = toState(met, MU);
const earth = elOf(EARTH), se = toState(earth, MU);
const sep = Math.hypot(...sm.r.map((x, k) => x - se.r[k]));
const vrel = sm.v.map((x, k) => x - se.v[k]), vinf = Math.hypot(...vrel);
const vEntry = (vi) => Math.sqrt(vi * vi + V_ESC * V_ESC);
// Geocentric radiant: where the meteoroid came from, seen from Earth (ecliptic -> equatorial, obliquity 23.4393°).
const u = vrel.map((x) => -x / vinf), eps = 23.4393 * D2R;
const y = u[1] * Math.cos(eps) - u[2] * Math.sin(eps), z = u[1] * Math.sin(eps) + u[2] * Math.cos(eps);
const ra = ((Math.atan2(y, u[0]) / D2R) + 360) % 360, dec = Math.asin(z) / D2R;
// Spread of the entry speed over the orbit's uncertainty (a ± da, e ± de).
const spread = [];
for (const aa of [a - da, a, a + da]) for (const ee of [e - de, e, e + de]) { const s = toState(metAt(aa, ee), MU); const v = s.v.map((x, k) => x - se.v[k]); spread.push(vEntry(Math.hypot(...v))); }
// 3:1 resonance with Jupiter (Kepler's third law): three meteoroid orbits per Jupiter orbit.
const a31 = JUP_A * (1 / 3) ** (2 / 3);

// Figure 1: the orbit seen from above the ecliptic, with Earth's and Mars's orbits.
const xy = (pts) => ({ x: pts.map((p) => +(p[0] / AU).toFixed(3)), y: pts.map((p) => +(p[1] / AU).toFixed(3)) });
const tMet = xy(track(met, MU, 10 * AU, 181)), tE = xy(track(earth, MU, 10 * AU, 121)), tM = xy(track(elOf(MARS), MU, 10 * AU, 121));
const ring = Array.from({ length: 121 }, (_, k) => [a31 * AU * Math.cos((k * 3 * Math.PI) / 180), a31 * AU * Math.sin((k * 3 * Math.PI) / 180)]), tR = xy(ring);
const peri = toState({ ...met, nu: 0 }, MU).r, aph = toState({ ...met, nu: 180 }, MU).r;
const fig1 = chart({
  title: 'Al-Khadhaf\'s orbit before it hit Earth', xLabel: 'Distance from the Sun (au)', yLabel: 'Distance from the Sun (au)',
  series: [
    { name: 'Meteoroid', kind: 'line', ...tMet },
    { name: 'Earth', kind: 'line', ...tE },
    { name: 'Mars', kind: 'line', ...tM, colour: 'var(--muted)' },
    { name: '3:1 resonance, 2.50 au', kind: 'line', ...tR, colour: 'var(--muted)', dash: '4 4' },
    { name: '', kind: 'dots', x: [0], y: [0], colour: 'var(--ink)', size: 4, label: { text: 'Sun' } },
    { name: '', kind: 'dots', x: [+(sm.r[0] / AU).toFixed(3)], y: [+(sm.r[1] / AU).toFixed(3)], colour: 'var(--ink)', size: 4, label: { text: 'Fall, 8 March 2022', anchor: 'start', dy: 16, dx: 4 } },
    { name: '', kind: 'dots', x: [+(aph[0] / AU).toFixed(3)], y: [+(aph[1] / AU).toFixed(3)], colour: 'var(--c-blog)', size: 4, label: { text: `Aphelion ${(I.ra / AU).toFixed(2)} au`, anchor: 'end', dx: -8, dy: -6 } },
    { name: '', kind: 'dots', x: [+(peri[0] / AU).toFixed(3)], y: [+(peri[1] / AU).toFixed(3)], colour: 'var(--c-blog)', size: 4, label: { text: `Perihelion ${(I.rp / AU).toFixed(3)} au`, anchor: 'start', dx: 8, dy: 4 } },
  ],
  xDomain: [-3.2, 3.2], yDomain: [-2.7, 2.7], xTicks: [-3, -2, -1, 0, 1, 2, 3], yTicks: [-2, -1, 0, 1, 2], height: 490,
  desc: `Top-down view of the meteoroid's orbit: it reached in to ${(I.rp / AU).toFixed(2)} au, inside Earth's orbit, and out to ${(I.ra / AU).toFixed(2)} au, at the 3:1 resonance with Jupiter in the asteroid belt.`,
});

// Figure 2: distance from the Sun over the last orbit before the fall, from the tool's two-body propagation.
const P = I.period, days = [], rs = [];
for (let k = 0; k <= 120; k++) { const dt = -P + (P * k) / 120; const el = propagate(met, MU, dt); days.push(+(dt / 86400 / 365.25).toFixed(3)); rs.push(+(info(el, MU).r / AU).toFixed(4)); }
const fig2 = chart({
  title: 'Distance from the Sun on its last lap', xLabel: 'Years before the fall', yLabel: 'Distance from the Sun (au)',
  series: [{ name: 'Meteoroid', kind: 'line', x: days, y: rs }], yDomain: [0.8, 2.7], yTicks: [1, 1.5, 2, 2.5],
  xFmt: (t) => String(+(-t).toFixed(1)),
  hlines: [{ y: 1, text: 'Earth' }, { y: 1.524, text: 'Mars' }, { y: +a31.toFixed(3), text: '3:1 resonance' }],
  desc: `Over its last ${(P / 86400 / 365.25).toFixed(2)}-year lap the meteoroid swung from ${(I.ra / AU).toFixed(2)} au, in the asteroid belt, to ${(I.rp / AU).toFixed(3)} au and met Earth on the way out.`, height: 280,
});

const facts = {
  q: (I.rp / AU).toFixed(3), Q: (I.ra / AU).toFixed(3), Pyr: (P / 86400 / 365.25).toFixed(3), nuFall: (180 - argp).toFixed(2),
  rFall: (I.r / AU).toFixed(4), rEarth: (Math.hypot(...se.r) / AU).toFixed(4), sepKm: Math.round(sep), helioSpeed: I.speed.toFixed(2),
  earthSpeed: Math.hypot(...se.v).toFixed(2), vinf: vinf.toFixed(2), vEntry: vEntry(vinf).toFixed(2), vEntryPaper,
  spread: [Math.min(...spread).toFixed(2), Math.max(...spread).toFixed(2)], radiant: [ra.toFixed(2), dec.toFixed(2)], radiantGFO: radiant,
  a31: a31.toFixed(3), lonEarth: ((Math.atan2(se.r[1], se.r[0]) / D2R + 360) % 360).toFixed(2),
  energyMJ: (0.5 * 4 * (vEntryPaper * 1000) ** 2 / 1e6).toFixed(0), energyTNTkg: (0.5 * 4 * (vEntryPaper * 1000) ** 2 / 4.184e6).toFixed(0),
  stateR: sm.r.map((x) => Math.round(x)), stateV: sm.v.map((x) => +x.toFixed(4)),
};
console.log(JSON.stringify(facts, null, 1));
if (fs.existsSync(ART)) {
  let md = fs.readFileSync(ART, 'utf8');
  md = inject(md, 'orbit', figure(fig1, 'Figure 1. The meteoroid\'s orbit from the paper\'s elements, drawn with the Orbit elements tool\'s maths (Sun as the central body), seen from above the plane of Earth\'s orbit. Earth and Mars from JPL\'s mean planetary elements for the date of the fall.'));
  md = inject(md, 'lap', figure(fig2, 'Figure 2. The meteoroid\'s distance from the Sun over its last orbit, propagated backwards from the fall with the Orbit elements tool\'s Kepler solver. Pure two-body motion: the pulls of the planets are left out.'));
  fs.writeFileSync(ART, md);
  console.log('Charts written:', [fig1, fig2].map((s) => (s.length / 1024).toFixed(1) + ' KB').join(', '));
}
