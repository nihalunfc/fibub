// #831 Orbit elements: elements ↔ state vectors, anomalies, Kepler's equation, propagation and TLE fields.
// Reference numbers: an independent NumPy implementation (rotation matrices R3(Ω)R1(i)R3(ω)), SciPy solve_ivp
// (DOP853, rtol 1e-13) integrating the two-body equations, SciPy brentq for Kepler's equation, Vallado's
// RV2COE worked example (Fundamentals of Astrodynamics, Example 2-5/2-6) and the sgp4 package's TLE reader.
import * as O from '../../src/lib/sci/orbitel.ts';

export default async (check) => {
  const mu = 398600.4418, rel = (a, b, t) => Math.abs(a / b - 1) <= t;
  const close = (a, b, t) => a.every((x, k) => Math.abs(x - b[k]) <= t);
  const v = O.fromState([6524.834, 6862.875, 6448.296], [4.901327, 5.533756, -1.976341], mu);
  check('orbitel: Vallado RV2COE example: p 11067.798, a 36127.34, e 0.832853, i 87.8691°, Ω 227.898°, ω 53.385°, ν 92.335°', rel(v.p, 11067.79834266182, 1e-12) && rel(v.e, 0.8328533984875213, 1e-12) && Math.abs(v.i - 87.86912617702644) < 1e-10 && Math.abs(v.raan - 227.8982603572737) < 1e-10 && Math.abs(v.argp - 53.38) < 0.01 && Math.abs(v.nu - 92.335) < 0.001 && Math.abs(v.a - 36127.34) < 0.01);
  const els = {
    ell: { p: O.pFromA(26600, 0.74), e: 0.74, i: 63.4, raan: 40, argp: 270, nu: 30 },
    hyp: { p: O.pFromQ(7000, 1.6), e: 1.6, i: 28.5, raan: 300, argp: 45, nu: -70 },
    par: { p: O.pFromQ(7500, 1), e: 1, i: 10, raan: 20, argp: 30, nu: 100 },
    circ: { p: 7000, e: 0, i: 51.6, raan: 80, argp: 0, nu: 200 },
  };
  const st = O.toState(els.ell, mu);
  check('orbitel: Molniya-like elements → r, v match NumPy to 1e-12 km', close(st.r, [4637.031328726552, 178.53697947901992, -5679.055240387162], 1e-9) && close(st.v, [6.252424682730313, 6.928411997008256, 2.5730558589825416], 1e-12));
  check('orbitel: round trip elements → state → elements for elliptic, hyperbolic, parabolic orbits', ['ell', 'hyp', 'par'].every((k) => { const el = els[k], s = O.toState(el, mu), b = O.fromState(s.r, s.v, mu); return rel(b.p, el.p, 1e-11) && Math.abs(b.e - el.e) < 1e-11 && Math.abs(b.i - el.i) < 1e-9 && Math.abs(b.raan - el.raan) < 1e-9 && Math.abs(b.argp - el.argp) < 1e-8 && Math.abs(((b.nu - el.nu + 540) % 360) - 180) < 1e-8; }));
  { const s = O.toState(els.circ, mu), b = O.fromState(s.r, s.v, mu); check('orbitel: circular orbit: ω set to 0 and ν = argument of latitude (200°)', b.circular && b.e === 0 && b.argp === 0 && Math.abs(b.nu - 200) < 1e-8 && Math.abs(b.u - 200) < 1e-8 && b.kind === 'circular'); }
  { const s = O.toState({ p: 8000, e: 0.1, i: 0, raan: 0, argp: 75, nu: 20 }, mu), b = O.fromState(s.r, s.v, mu); check('orbitel: equatorial orbit: Ω = 0, ω = longitude of periapsis 75°', b.equatorial && b.raan === 0 && Math.abs(b.argp - 75) < 1e-8 && Math.abs(b.nu - 20) < 1e-8); }
  { const s = O.toState({ p: 8000, e: 0, i: 0, raan: 0, argp: 0, nu: 123 }, mu), b = O.fromState(s.r, s.v, mu); check('orbitel: circular equatorial orbit: ν = true longitude 123°', b.circular && b.equatorial && Math.abs(b.nu - 123) < 1e-8 && Math.abs(b.trueLon - 123) < 1e-8); }
  const prop = { ell: [5 * 3600, [-9388.497025220482, 18612.30017478186, 40523.50299926903]], hyp: [3600, [1441.297470826275, 22206.12361134502, 6706.18811681767]], par: [3600, [-34621.32633161613, 2995.266844184055, 2584.216692270897]], circ: [3600, [-3229.147237068987, 3867.4304976944413, 4859.58737619101]] };
  check('orbitel: Kepler propagation matches SciPy solve_ivp of the two-body equations to 1e-7 km (elliptic 5 h, hyperbolic, parabolic, circular 1 h)', Object.entries(prop).every(([k, [dt, r]]) => close(O.toState(O.propagate(els[k], mu, dt), mu).r, r, 1e-7)));
  { const i = O.info(els.ell, mu); check('orbitel: elliptic info: E 0.20641849, M 0.05475124 rad, t since periapsis 376.2249 s, period 43175.108 s, rp 6916, ra 46284 km', rel(i.E, 0.2064184902415432, 1e-12) && rel(i.M, 0.054751240354002195, 1e-11) && rel(i.tp, 376.22489474640827, 1e-11) && rel(i.period, 43175.10828214549, 1e-12) && Math.abs(i.rp - 6916) < 1e-9 && Math.abs(i.ra - 46284) < 1e-8); }
  { const i = O.info(els.hyp, mu); check('orbitel: hyperbolic info: H −0.69998484, M −0.51371864, v∞ 5.845148 km/s, turn angle 77.36437°', rel(i.E, -0.6999848380535815, 1e-12) && rel(i.M, -0.5137186357408451, 1e-11) && rel(i.vinf, 5.84514774443604, 1e-12) && rel(i.turn, 77.36437490697888, 1e-12) && i.period === Infinity && i.kind === 'hyperbolic'); }
  check('orbitel: Kepler solvers vs brentq: E(M 0.3, e 0.95) 1.17745010, H(M 5, e 1.6) 2.21081266, D(M 2) 1.28790975', rel(O.meanToAnomaly(0.3, 0.95), 1.177450104709831, 1e-13) && rel(O.meanToAnomaly(5, 1.6), 2.2108126572913003, 1e-13) && rel(O.meanToAnomaly(2, 1), 1.2879097507041273, 1e-13));
  check('orbitel: Kepler solver converges for e 0.999 and many revolutions (M = 100.3 rad)', (() => { const E = O.meanToAnomaly(100.3, 0.999); return Math.abs(E - 0.999 * Math.sin(E) - 100.3) < 1e-12; })());
  check('orbitel: ν ↔ anomaly round trips (e 0.3, 0.999, 1, 3)', [0.3, 0.999, 1, 3].every((e) => [-1.5, -0.2, 0.7, 1.4].every((nu) => Math.abs(O.anomalyToNu(O.nuToAnomaly(nu, e), e) - nu) < 1e-10)));
  check('orbitel: unreachable true anomaly on a hyperbola is an error; radial motion is an error', (() => { try { O.toState({ p: 10000, e: 2, i: 0, raan: 0, argp: 0, nu: 130 }, mu); return false; } catch (e) { if (!/120\.0000/.test(e.message)) return false; } try { O.fromState([7000, 0, 0], [3, 0, 0], mu); return false; } catch { return true; } })());
  const tle = 'ISS (ZARYA)\n1 25544U 98067A   08264.51782528 -.00002182  00000-0 -11606-4 0  2927\n2 25544  51.6416 247.4627 0006703 130.5360 325.0288 15.72125391563537';
  const t = O.parseTle(tle);
  check('orbitel: TLE fields match sgp4 2.27 twoline2rv (satnum, epoch, ṅ/2, n̈/6, B*, i, Ω, e, ω, M, n, rev, element set)', t.name === 'ISS (ZARYA)' && t.satnum === '25544' && t.intl === '98067A' && t.classification === 'U' && t.epochYear === 2008 && t.epochDay === 264.51782528 && t.ndot2 === -0.00002182 && t.nddot6 === 0 && rel(t.bstar, -1.1606e-5, 1e-12) && t.inc === 51.6416 && t.raan === 247.4627 && t.ecc === 0.0006703 && t.argp === 130.536 && t.M === 325.0288 && t.n === 15.72125391 && t.revNum === 56353 && t.elsetNum === 292);
  { const e = O.tleToElements(t, mu); check('orbitel: TLE → a 6730.9607 km (Kepler III from sgp4 no_kozai), ν 324.98474°', rel(e.a, 6730.960676936836, 1e-12) && Math.abs(e.nu - 324.984744569446) < 1e-9); }
  check('orbitel: TLE checksum mismatch is reported; exponent fields read', (() => { try { O.parseTle(tle.replace('2927', '2928')); return false; } catch (e) { return /line 1 is 8 but the digits add up to 7/.test(e.message) && O.tleExp(' 12345-3') === 0.12345e-3 && O.tleExp('-11606-4') === -0.11606e-4 && O.tleExp(' 00000+0') === 0; } })());
};
