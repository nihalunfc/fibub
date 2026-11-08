// Checks for the science maths in src/lib/sci/ against published worked examples.
import zlib from 'node:zlib';
// Run with `node tests/sci.mjs` (Node 22+ strips the TypeScript types itself).
import { tInv, tTwoSided, normInv, normCdf } from '../src/lib/sci/stats.ts';
import { num, parseTable, numericColumns, sig } from '../src/lib/sci/num.ts';
import { calibrate, inverse, limits } from '../src/lib/sci/calibration.ts';
import { fitDose } from '../src/lib/sci/dose.ts';
import { propagate, monteCarlo } from '../src/lib/sci/uncertainty.ts';
import { parse, variables, compile, splitName } from '../src/lib/sci/expr.ts';
import { makeMap, traceLine, findMarkers } from '../src/lib/sci/digitize.ts';
import { pngWithDpi, niceTicks } from '../src/lib/sci/plot.ts';

import { powerT, powerProp, solveN, surveyN } from '../src/lib/sci/power.ts';
import { pws, air, heatIndexF, humidex, pressureAt } from '../src/lib/sci/psychro.ts';
import { pole, project, greatCircle, fisher, planeFromPole, roseBins } from '../src/lib/sci/stereonet.ts';
import { layout, names, order, wellName } from '../src/lib/sci/plate.ts';
import { c1v1, serial, toGperL, fromGperL } from '../src/lib/sci/solution.ts';
import { masterMix } from '../src/lib/sci/mastermix.ts';
import { readCurve, calibrate as calibrate14, calYear } from '../src/lib/sci/radiocarbon.ts';
import { diversity, rarefy, compare } from '../src/lib/sci/diversity.ts';
import { cronbach, cohen, fleiss, icc } from '../src/lib/sci/reliability.ts';
import { cellCount, seeding } from '../src/lib/sci/cells.ts';
import { profile, tableName, columnNames } from '../src/lib/sci/profile.ts';
import { fInv, fCdf } from '../src/lib/sci/stats.ts';
import { readFileSync } from 'node:fs';
import { cosmology, omegaR } from '../src/lib/sci/cosmo.ts';
import { skyFromFrame, skyFromSqm, subLength, efficiency } from '../src/lib/sci/subexp.ts';
import { filterShift, readSpacers, solveSpacers } from '../src/lib/sci/backfocus.ts';
import { BANDS, toJy, fromJy } from '../src/lib/sci/photometry.ts';
import { darkNight, yearDates } from '../src/lib/astro/darkness.ts';
import * as Astro from 'astronomy-engine';
import { staging, propellantFor, BODIES, AU, hohmann, biElliptic } from '../src/lib/sci/orbit.ts';
import { lombScargle, falseAlarm, peaks, phase } from '../src/lib/sci/lombscargle.ts';
import { fovArcmin, framesAlong, offsetToRaDec, mosaic } from '../src/lib/sci/mosaic.ts';
import { hourlyRate } from '../src/lib/sci/meteorrate.ts';
import { sqmToMcd, mcdToSqm, sqmToNelm, nelmToSqm, bortleOf, sqmForBortle, skyglow } from '../src/lib/sci/skyglow.ts';
import { habitableZone, tEq, periodDays, auForPeriod, lumFrom } from '../src/lib/sci/habitable.ts';
import { marsTime, localSolar, missionSol, solStart, MISSIONS, msdToMs, lsTime } from '../src/lib/sci/marstime.ts';
import { transitWindows, bjdToMs, msToBjd, trapezoid } from '../src/lib/astro/transits.ts';
import { velocity, redshift, zFromLambda, nmToGhz, LINES } from '../src/lib/sci/redshift.ts';
import { sunDay, sunAltAz, seasons } from '../src/lib/astro/sun.ts';
import { moonsAt, events as jovEvents } from '../src/lib/astro/jupiter.ts';
import { lambert } from '../src/lib/sci/lambert.ts';
import { leg, grid, nextWindow, hohmannDays, burnFromOrbit, synodicDays } from '../src/lib/astro/porkchop.ts';
import { fitOrbit, binary, rv as rvModel, trueAnomaly } from '../src/lib/sci/rvfit.ts';
import { solarEclipses, lunarEclipses, shadowGeometry, overlap } from '../src/lib/astro/eclipses.ts';
import { parseTLE, tleChecksum, fromHeights, orbitInfo, ssoInclination, gmst, position as satPos, subpoint, footprint, passes as satPasses } from '../src/lib/sci/satorbit.ts';
import { uvTracks, baselines, yArray, dirtyBeam, beamWidth, scales, fft, parseAntennas } from '../src/lib/sci/uvcover.ts';
import { orbitAt, measure as dsMeasure, systemMass, yearOf } from '../src/lib/sci/visualbinary.ts';
import { vDisc, vBulge, vNFW, vIso, fitRotation, nfwVirial, components as rcComponents, besselI0, besselK0, besselI1, besselK1 } from '../src/lib/sci/rotcurve.ts';
import { identify, findRedshift, simulatedSpectrum, findPeaks, vacToAir, airToVac } from '../src/lib/sci/speclines.ts';
import { blocked, overlapUniform, intensity, durations, stellarDensity, aRFromDensity, fitTransit, simulatedTransit, fold } from '../src/lib/sci/transit.ts';
import { measureStar, findStars, fieldSummary, simulatedField, moffatFwhm, plateScale } from '../src/lib/sci/starfwhm.ts';
import { planckLam, bandFraction, bcV, tFromBV, star as starBB, WIEN_LAM } from '../src/lib/sci/blackbody.ts';
import { semiAmplitude, minMass, semiMajor, radiusFromDepth, density, M_JUP, M_EARTH, AU as AU_M, R_JUP } from '../src/lib/sci/rvmass.ts';
import { crater, impactorFor } from '../src/lib/sci/crater.ts';
import { fspl, dishGain, slantRange, requiredEbN0, budget } from '../src/lib/sci/linkbudget.ts';
import { scope } from '../src/lib/sci/radiotel.ts';

let pass = 0, fail = 0;
function near(name, got, want, tol) {
  const ok = Number.isFinite(got) && Math.abs(got - want) <= tol;
  ok ? pass++ : fail++;
  if (!ok) console.log(`FAIL ${name}: got ${got}, want ${want} ± ${tol}`);
}
function check(name, ok) { ok ? pass++ : fail++; if (!ok) console.log(`FAIL ${name}`); }
function throws(name, fn) { try { fn(); check(name, false); } catch { check(name, true); } }

// ---- Statistics: Student t and normal quantiles (standard tables).
near('t 97.5 % df 1', tInv(0.975, 1), 12.706, 0.001);
near('t 97.5 % df 5', tInv(0.975, 5), 2.5706, 0.0001);
near('t 97.5 % df 30', tInv(0.975, 30), 2.0423, 0.0001);
near('t two-sided p', tTwoSided(2.5706, 5), 0.05, 1e-4);
near('z 97.5 %', normInv(0.975), 1.95996, 1e-4);
near('normCdf(1)', normCdf(1), 0.841345, 1e-6);

// ---- Number input.
near('comma decimal', num('1,5'), 1.5, 0);
near('minus sign', num('−2.5'), -2.5, 0);
check('tab table', parseTable('a\tb\n1\t2').length === 2);
{ const t = numericColumns('x;y\n1;2\n3;4'); check('headers', t.headers.join() === 'x,y' && t.cols[1][1] === 4); }
check('sig figures', sig(0.0012345, 3) === '0.00123');

// ---- Calibration: Miller & Miller, Statistics and Chemometrics for Analytical Chemistry, 6th ed., examples 5.3.1, 5.6.1.
{
  const c = calibrate([0, 2, 4, 6, 8, 10, 12], [2.1, 5.0, 9.0, 12.6, 17.3, 21.0, 24.7]);
  near('Miller slope', c.slope, 1.9304, 1e-4);
  near('Miller intercept', c.intercept, 1.5179, 1e-4);
  near('Miller s(y/x)', c.syx, 0.4328, 1e-4);
  near('Miller r', c.r, 0.9989, 1e-4);
  for (const [y, x, s] of [[2.9, 0.72, 0.26], [13.5, 6.21, 0.24], [23.0, 11.13, 0.26]]) {
    const u = inverse(c, [y]);
    near(`Miller x0 at ${y}`, u.x0, x, 0.005); near(`Miller s(x0) at ${y}`, u.se, s, 0.005);
  }
  near('LOD = 3.3 s/b', limits(c).lod, 3.3 * 0.4328 / 1.9304, 1e-3);
}

// ---- 4PL: ryegrass data (Inderjit et al. 2002, R package drc), drc LL.4: b 2.982, c 0.481, d 7.793, e 3.058.
{
  const rows = [[0, 7.58, 8, 8.3286], [0, 7.25, 7.375, 7.9625], [0.94, 8.3556, 6.9143, 7.75], [1.88, 6.8714, 6.45, 5.9222], [3.75, 1.925, 2.8857, 4.2333], [7.5, 1.1875, 0.8571, 1.0571], [15, 0.6875, 0.525, 0.825], [30, 0.25, 0.22, 0.44]];
  const x = [], y = [];
  for (const [d, ...r] of rows) for (const v of r) { x.push(d); y.push(v); }
  const f = fitDose(x, y);
  near('4PL EC50', f.ec50, 3.058, 0.002);
  near('4PL hill', f.hill, -2.982, 0.002);
  near('4PL bottom', f.bottom, 0.481, 0.002);
  near('4PL top', f.top, 7.793, 0.002);
  near('4PL SE hill', f.se.hill, 0.458, 0.003);
  near('4PL SE logEC50', f.se.logEc50, 0.0264, 0.0005);
  check('4PL falls', !f.rising && f.converged);
  near('4PL inverse', f.inverse(f.f(2)), 2, 1e-6);
  throws('4PL needs doses', () => fitDose([1, 1], [2, 3]));
}

// ---- GUM propagation: R = V/I and the pendulum from the tool's guide.
{
  const r = propagate((v) => v[0] / v[1], [{ name: 'V', value: 5, spread: 0.01, dist: 'normal' }, { name: 'I', value: 0.2, spread: 0.0005, dist: 'normal' }]);
  near('R value', r.y, 25, 1e-12);
  near('R u', r.uc, 0.08004, 1e-5);
  near('R k', r.k, 2.0, 0.001);
  const g = (v) => 4 * Math.PI ** 2 * v[0] / v[1] ** 2;
  const ins = [{ name: 'L', value: 1, spread: 0.001, dist: 'rect' }, { name: 'T', value: 0, spread: 0, dist: 'readings', readings: [2.01, 2.00, 2.02, 1.99, 2.01] }];
  const p = propagate(g, ins);
  near('pendulum g', p.y, 9.81, 0.005);
  near('pendulum u', p.uc, 0.050, 0.0015);
  near('pendulum U', p.U, 0.14, 0.005);
  const mc = monteCarlo(g, ins, 50000);
  check('Monte Carlo interval holds g', mc.lo < p.y && mc.hi > p.y && Math.abs((mc.hi - mc.lo) / 2 - p.U) < 0.1 * p.U);
}

// ---- Formula parser.
{
  const n = parse('4 pi^2 L / T^2');
  check('implicit product names', variables(n).sort().join() === 'L,T');
  near('formula value', compile(n, ['L', 'T'])([1, 2]), Math.PI ** 2, 1e-12);
  near('degrees', compile(parse('sin(a)'), ['a'], true)([30]), 0.5, 1e-12);
  near('power is right-assoc', compile(parse('2^3^2'), [])([]), 512, 0);
  near('unary minus', compile(parse('-2^2'), [])([]), -4, 0);
  check('name split', splitName('g = 4 L').name === 'g');
  throws('bad formula', () => parse('2 * (3'));
}

// ---- Graph digitising: axes tilted 10° and a log y axis.
{
  const th = (10 * Math.PI) / 180, R = (u, v) => ({ x: 100 + u * Math.cos(th) - v * Math.sin(th), y: 400 - u * Math.sin(th) - v * Math.cos(th) });
  // x from 0 to 50 over 500 px; y from 1 to 1000 (log) over 300 px.
  const P = (x, y) => R(x * 10, Math.log10(y) * 100);
  const map = makeMap({ x1: { ...P(10, 1), value: 10 }, x2: { ...P(40, 1), value: 40 }, y1: { ...P(0, 10), value: 10 }, y2: { ...P(0, 100), value: 100 }, xLog: false, yLog: true });
  const m = map(P(25, 316.2));
  near('tilted x', m.x, 25, 1e-9); near('log y', m.y, 316.2, 1e-6);
  throws('parallel axes', () => makeMap({ x1: { x: 0, y: 0, value: 0 }, x2: { x: 10, y: 0, value: 1 }, y1: { x: 0, y: 5, value: 0 }, y2: { x: 10, y: 5, value: 1 }, xLog: false, yLog: false }));
  // A 40 × 20 image with a red horizontal line on rows 9-10 and two red 3 × 3 markers.
  const W = 40, H = 20, data = new Uint8ClampedArray(W * H * 4).fill(255);
  const red = (x, y) => { const i = (y * W + x) * 4; data[i] = 220; data[i + 1] = 0; data[i + 2] = 0; };
  for (let x = 0; x < 20; x++) { red(x, 9); red(x, 10); }
  for (const [cx, cy] of [[25, 4], [33, 15]]) for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) red(cx + dx, cy + dy);
  const img = { width: W, height: H, data };
  const line = traceLine(img, { x0: 0, y0: 0, x1: 19, y1: 19 }, [220, 0, 0], 40, 4);
  check('trace samples', line.length === 5 && line.every((p) => p.y === 10));
  const mk = findMarkers(img, { x0: 21, y0: 0, x1: 39, y1: 19 }, [220, 0, 0], 40);
  check('markers', mk.length === 2 && mk[0].x === 25.5 && mk[0].y === 4.5 && mk[1].x === 33.5);
}

// ---- Plot helpers.
check('nice ticks', niceTicks(0, 1.35, 5).join() === '0,0.5,1');
{
  // Minimal PNG: signature + IHDR + IEND. pngWithDpi inserts a 21-byte pHYs chunk after IHDR.
  const png = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 1, 0, 0, 0, 1, 8, 6, 0, 0, 0, 0x1f, 0x15, 0xc4, 0x89, 0, 0, 0, 0, 73, 69, 78, 68, 0xae, 0x42, 0x60, 0x82]);
  const out = pngWithDpi(png, 300), dv = new DataView(out.buffer);
  check('pHYs placed', String.fromCharCode(...out.subarray(37, 41)) === 'pHYs' && dv.getUint32(41) === 11811 && out[49] === 1);
  check('pHYs CRC', dv.getUint32(50) === zlib.crc32(out.subarray(37, 50)));
}

// ---- Power: R power.t.test(delta = .5, power = .8) n = 63.77; power.t.test(n = 64, delta = .5) = 0.8015; power.prop.test(p1 = .5, p2 = .75, power = .9) n = 76.7.
near('t test n', solveN((n) => powerT(n, 0.5), 0.8), 63.766, 0.002);
near('t test power', powerT(64, 0.5), 0.80146, 1e-4);
near('paired power (SciPy nct)', powerT(10, 1, 0.05, 'paired'), 0.80310, 1e-4);
near('small df power (SciPy nct)', powerT(3, 2), 0.46261, 1e-4);
near('two proportions n', solveN((n) => powerProp(n, 0.5, 0.75), 0.9, 1), 76.7, 0.05);
near('survey n', surveyN(0.05), 384.15, 0.01);
near('survey n, N = 1000', surveyN(0.05, 0.95, 0.5, 1000), 277.7, 0.1);

// ---- Psychrometrics: ASHRAE Fundamentals 2017 ch. 1 (table 3 saturation pressures, example of 40 °C / 20 °C wet bulb).
near('pws 20 °C', pws(20), 2338.8, 1); near('pws 0 °C', pws(0), 611.2, 0.2); near('pws −10 °C (ice)', pws(-10), 259.9, 0.2);
{
  const a = air(40, 101325, { tw: 20 });
  near('ASHRAE W', a.W, 0.0064, 0.00002); near('ASHRAE h', a.h, 56.7, 0.05); near('ASHRAE RH', a.rh, 0.14, 0.002); near('ASHRAE v', a.v, 0.896, 0.001); near('ASHRAE dew point', a.td, 7.4, 0.1);
  const b = air(25, 101325, { rh: 0.5 });
  near('25/50 dew point', b.td, 13.86, 0.02); near('25/50 wet bulb', b.tw, 17.89, 0.02);
  near('round trip via dew point', air(25, 101325, { td: b.td }).rh, 0.5, 1e-9);
  near('round trip via wet bulb', air(25, 101325, { tw: b.tw }).rh, 0.5, 1e-6);
  throws('dew point above air', () => air(20, 101325, { td: 25 }));
}
near('NWS heat index 90 °F 70 %', heatIndexF(90, 70), 106, 0.5);
near('humidex 30 °C, dew point 15', humidex(30, 15), 34, 0.1);
near('pressure at 1500 m', pressureAt(1500), 84556, 5);

// ---- Stereonet geometry.
{
  const p = pole({ strike: 30, dip: 40 });
  check('pole of 030/40 is 50 → 300', Math.abs(p.trend - 300) < 1e-9 && Math.abs(p.plunge - 50) < 1e-9);
  const q2 = planeFromPole(p); check('plane from pole', Math.abs(q2.strike - 30) < 1e-9 && Math.abs(q2.dip - 40) < 1e-9);
  near('equal-angle radius of dip 30', Math.hypot(...greatCircle({ strike: 0, dip: 30 }, 'equal-angle', 2)[1]), Math.tan(Math.PI / 6), 1e-9);
  near('equal-area horizontal line on the edge', Math.hypot(...project({ trend: 123, plunge: 0 }, 'equal-area')), 1, 1e-12);
  const f = fisher([[30, 40], [25, 45], [35, 38], [28, 50]].map(([s, d]) => pole({ strike: s, dip: d })));
  near('Fisher mean trend', f.mean.trend, 299.27, 0.01); near('Fisher α95', f.a95, 6.90, 0.01);
  const g = fisher([{ trend: 10, plunge: 0 }, { trend: 190, plunge: 0 }]);
  near('axial: opposite ends are one line', g.rbar, 1, 1e-12);
  check('rose counts strikes both ways', roseBins([5, 15, 185], 30).join() === '3,0,0,0,0,0,3,0,0,0,0,0');
}

// ---- Plate layouts.
{
  const o = { size: 96, byColumn: false, repsAcross: true, skipEdge: false, skip: new Set() };
  check('well names', wellName(0, 0) === 'A1' && wellName(31, 47) === 'AF48');
  check('96 inner wells', order({ ...o, skipEdge: true }).length === 60);
  check('1536 wells', order({ ...o, size: 1536 }).length === 1536);
  check('name runs', names('S1-S3, Blank').join() === 'S1,S2,S3,Blank');
  const r = layout([{ kind: 'sample', names: ['S1', 'S2'], reps: 3 }], o);
  const at = (n) => r.wells.find((w) => w.name === n).content;
  check('replicates in a column block', at('A1') === 'S1' && at('B1') === 'S1' && at('C1') === 'S1' && at('A2') === 'S2');
  const full = layout([{ kind: 'sample', names: names('S1-S40'), reps: 3 }], o);
  check('a plate too small says so', full.placed < full.needed && full.needed === 120);
}

// ---- Solutions, dilutions and master mix (NEB Taq M0273 standard 50 µL reaction).
near('0.5 M NaCl, 250 mL', toGperL(0.5, 'M', 58.44) * 0.25, 7.305, 1e-9);
near('mg/mL to M', fromGperL(9, 'M', 180.16), 0.049956, 1e-6);
near('% w/v is g per 100 mL', toGperL(0.9, '% w/v'), 9, 1e-12);
{ const r = c1v1(10, NaN, 1, 50); near('C1V1 stock volume', r.v1, 5, 1e-12); near('C1V1 diluent', r.diluent, 45, 1e-12); }
throws('cannot dilute up', () => c1v1(1, NaN, 10, 50));
{ const s = serial(1000, 10, 6, 900); near('serial transfer', s.transfer, 100, 1e-12); near('serial last tube', s.tubes[5].conc, 0.001, 1e-15); }
{
  const C = [{ name: 'Buffer', stock: 10, stockUnit: 'X', final: 1, finalUnit: 'X', inMix: true }, { name: 'dNTPs', stock: 10, stockUnit: 'mM', final: 200, finalUnit: 'µM', inMix: true },
    { name: 'F', stock: 10, stockUnit: 'µM', final: 0.2, finalUnit: 'µM', inMix: true }, { name: 'R', stock: 10, stockUnit: 'µM', final: 0.2, finalUnit: 'µM', inMix: true },
    { name: 'Taq', stock: 5, stockUnit: 'U/µL', final: 1.25, finalUnit: 'U', inMix: true }, { name: 'Template', stock: 0, stockUnit: 'ng/µL', final: 1, finalUnit: 'µL', inMix: false }];
  const m = masterMix(C, 50, 10, 10);
  near('NEB water per reaction', m.water.one, 40.75, 1e-9); near('mix per tube', m.mixPerTube, 49, 1e-9); near('mix total', m.mixTotal, 539, 1e-9);
  throws('units that do not match', () => masterMix([{ name: 'x', stock: 10, stockUnit: 'X', final: 1, finalUnit: 'µM', inMix: true }], 50, 1, 0));
}

// ---- F distribution (standard tables).
near('F 95 % (5, 10)', fInv(0.95, 5, 10), 3.3258, 1e-3);
near('F 99 % (3, 20)', fInv(0.99, 3, 20), 4.9382, 1e-3);
near('F cdf round trip', fCdf(fInv(0.3, 7, 4), 7, 4), 0.3, 1e-9);

// ---- Radiocarbon calibration against IntCal20 (OxCal 4.4 gives the same ranges to within a year or two).
{
  const curve = readCurve(readFileSync(new URL('../src/data/intcal20.txt', import.meta.url), 'utf8'));
  check('IntCal20 rows', curve.cal.length === 9501);
  const r = calibrate14(curve, 3000, 30), r95 = r.hpd.find((h) => h.level === 0.954).ranges;
  const bc = (bp) => { const y = calYear(bp); return y.era === 'BC' ? -y.year : y.year; };
  check('3000 ± 30 has two 95 % ranges', r95.length === 2);
  near('3000 ± 30 main range from', bc(r95[1][0]), -1304, 3); near('3000 ± 30 main range to', bc(r95[1][1]), -1125, 3);
  near('3000 ± 30 main range share', r95[1][2], 0.86, 0.01);
  near('3000 ± 30 median', bc(r.median), -1239, 3);
  near('probabilities add to 1', Array.from(r.p).reduce((a, b) => a + b, 0), 1, 1e-6);
  throws('an age far outside the curve', () => calibrate14(curve, -5000, 20));
  check('an age near the end is flagged', calibrate14(curve, 54500, 300).outside);
}

// ---- Biodiversity: Shannon, Simpson, Chao1, rarefaction.
{
  const even = diversity([5, 5, 5, 5]);
  near('Shannon of 4 equal species', even.H, Math.log(4), 1e-12); near('evenness of equal species', even.pielou, 1, 1e-12); near('1/D of 4 equal', even.invSimpson, 4, 1e-12);
  near('Chao1 with all singletons', diversity([1, 1, 1, 1]).chao1, 8.5, 1e-12);
  const meadow = [12, 35, 8, 0, 21, 5, 1, 2, 1, 0], hedge = [4, 18, 22, 15, 2, 0, 3, 1, 0, 1];
  const d = diversity(meadow);
  near('meadow H', d.H, 1.569, 1e-3); near('meadow 1-D', d.simpson, 0.736, 1e-3); near('meadow Chao1', d.chao1, 8.49, 0.01);
  near('rarefy to N gives S', rarefy(meadow, 85).s, 8, 1e-9); near('rarefy to 1 gives 1', rarefy(meadow, 1).s, 1, 1e-9);
  near('meadow rarefied to 66', rarefy(meadow, 66).s, 7.50, 0.01);
  const c = compare(meadow, hedge); near('Bray-Curtis', c.brayCurtis, 0.550, 1e-3); near('Jaccard', c.jaccard, 0.6, 1e-12);
}

// ---- Reliability: Shrout and Fleiss (1979) Table 2, Cohen, Fleiss (Wikipedia worked example).
{
  const SF = [[9, 2, 5, 8], [6, 1, 3, 2], [8, 4, 6, 8], [7, 1, 2, 6], [10, 5, 6, 9], [6, 2, 4, 7]];
  const r = icc(SF);
  near('ICC(1,1)', r.icc1, 0.1657, 1e-4); near('ICC(1,k)', r.icc1k, 0.4428, 1e-4); near('ICC(2,1)', r.icc2, 0.2898, 1e-4);
  near('ICC(2,k)', r.icc2k, 0.6201, 1e-4); near('ICC(3,1)', r.icc3, 0.7148, 1e-4); near('ICC(3,k)', r.icc3k, 0.9093, 1e-4);
  // R psych::ICC(sf) bounds.
  near('ICC(2,1) lower', r.ci.icc2[0], 0.019, 2e-3); near('ICC(2,1) upper', r.ci.icc2[1], 0.761, 2e-3);
  near('ICC(1,1) lower', r.ci.icc1[0], -0.133, 2e-3); near('ICC(3,k) lower', r.ci.icc3k[0], 0.676, 2e-3);
  near('ICC F test p', r.test.icc3.p, 0.00013, 2e-5);
  const a = cronbach(SF); near('alpha = ICC(3,k)', a.alpha, 0.9093, 1e-4); near('Feldt lower = ICC(3,k) lower', a.ci[0], r.ci.icc3k[0], 1e-9);
  near('Cohen kappa', cohen([[20, 5], [10, 15]]).kappa, 0.4, 1e-12);
  near('quadratic kappa of perfect agreement', cohen([[5, 0, 0], [0, 5, 0], [0, 0, 5]], 'quadratic').kappa, 1, 1e-12);
  const F = [[0,0,0,0,14],[0,2,6,4,2],[0,0,3,5,6],[0,3,9,2,0],[2,2,8,1,1],[7,7,0,0,0],[3,2,6,3,0],[2,5,3,2,2],[6,5,2,1,0],[0,2,2,3,7]];
  near('Fleiss kappa', fleiss(F).kappa, 0.2099, 1e-4);
  throws('Fleiss with unequal raters', () => fleiss([[1, 1], [2, 1]]));
}

// ---- Hemocytometer and seeding (guide's worked example).
{
  const c = cellCount([52, 47, 55, 46], [4, 3, 5, 4], 2);
  near('live cells/mL', c.liveMl, 1e6, 1e-6); near('viability', c.viability, 200 / 216, 1e-12);
  const s = seeding(c.liveMl, 1e5, 24, 0.5, 10);
  near('suspension mL', s.suspensionMl, 2.64, 1e-9); near('medium mL', s.mediumMl, 10.56, 1e-9);
  throws('too dilute to seed', () => seeding(1e5, 1e5, 24, 0.5));
}

// ---- Table profiles for the SQL playground.
{
  const p = profile(['zip', 'n', 'x', 'name'], [['007', '1', '1.5', 'a'], ['123', '2', 'NA', 'b'], ['045', '3', '2.5', 'a']]);
  check('leading zeros stay text', p[0].type === 'TEXT'); check('integers', p[1].type === 'INTEGER'); check('reals', p[2].type === 'REAL');
  check('NA is missing', p[2].missing === 1 && p[2].mean === 2); check('top value', p[3].top[0][0] === 'a' && p[3].top[0][1] === 2);
  check('table names', tableName('My Data (2024).csv', new Set()) === 'my_data_2024' && tableName('2024.csv', new Set()) === 't_2024' && tableName('a.csv', new Set(['a'])) === 'a_2');
  check('column names', columnNames(['a', '', 'A']).join() === 'a,column2,A_2');
}

// ---- Cosmology: exact solutions (Einstein-de Sitter, empty, flat LCDM age) and Planck 2018.
{
  const C = 299792.458, HG = 977.792221;
  const eds = cosmology({ H0: 70, Om: 1, OL: 0, Or: 0 }, 3);
  near('EdS comoving distance', eds.dc, ((2 * C) / 70) * (1 - 1 / 2), 1e-3); near('EdS age', eds.age0, ((2 / 3) * HG) / 70, 1e-4); near('EdS age at z=3', eds.ageZ, ((2 / 3) * HG) / 70 / 8, 1e-4);
  near('empty universe luminosity distance', cosmology({ H0: 70, Om: 0, OL: 0, Or: 0 }, 2).dl, (C / 70) * 2 * 2, 1e-3);
  near('flat LCDM age', cosmology({ H0: 70, Om: 0.3, OL: 0.7, Or: 0 }, 0).age0, ((2 / (3 * Math.sqrt(0.7))) * Math.asinh(Math.sqrt(0.7 / 0.3)) * HG) / 70, 1e-4);
  const Or = omegaR(67.66), p18 = cosmology({ H0: 67.66, Om: 0.3111, OL: 1 - 0.3111 - Or, Or }, 3);
  near('Planck 2018 age (13.787 ± 0.020 Gyr)', p18.age0, 13.787, 0.02);
  near('Planck z=3 angular scale', p18.kpcPerArcsec, 7.883, 0.002);
  check('angular diameter distance peaks', cosmology({ H0: 70, Om: 0.3, OL: 0.7, Or: 0 }, 1.6).da > cosmology({ H0: 70, Om: 0.3, OL: 0.7, Or: 0 }, 5).da);
  throws('a universe with no Big Bang', () => cosmology({ H0: 70, Om: 0.1, OL: 2, Or: 0 }, 5));
}

// ---- Sub-exposure length: the 5 % rule is about 10 R²/S.
{
  const s = skyFromFrame(1250, 500, 0.25, 60);
  near('sky e/s from a test frame', s, 3.125, 1e-12);
  near('5 % sub length', subLength(1.5, s), 2.25 / (3.125 * 0.1025), 1e-9);
  near('efficiency at the 5 % length', efficiency(subLength(1.5, s), 1.5, s), 1 / 1.05, 1e-12);
  near('sky photons: 1000 per s per cm² per Å at mag 0', skyFromSqm({ sqm: 20, apertureMm: 112.8379, obstructionPct: 0, focalMm: 206265, pixelUm: 1000, bandwidthNm: 0.1, qe: 1, throughput: 1 }), 1e-3, 1e-7);
  throws('background below offset', () => skyFromFrame(400, 500, 1, 60));
}

// ---- Backfocus and spacers.
{
  near('2 mm filter shift', filterShift(2), 2 / 3, 1e-12);
  check('spacer list', readSpacers('10, 2 x3, 0.5mm').join() === '10,2,2,2,0.5');
  const r = solveSpacers(9.17, readSpacers('10, 5, 2 x2, 1, 0.5, 0.3, 0.2, 0.1'));
  near('spacer stack within 0.03 mm', r.error, 0.03, 1e-9); check('fewest pieces', r.pieces.length === 4);
  check('exact stack', solveSpacers(7.3, [5, 2, 0.3, 1, 1]).pieces.join() === '5,2,0.3');
  throws('parts longer than backfocus', () => solveSpacers(-1, [1]));
}

// ---- Magnitudes and fluxes (Bessell et al. 1998; AB 3631 Jy).
{
  const V = BANDS.find((b) => b.id === 'V'), K = BANDS.find((b) => b.id === 'K2');
  near('V = 0 is 3636 Jy', toJy(0, 'vega', V.lam, V.vegaJy), 3636, 1e-9);
  near('AB 0 is 3631 Jy', toJy(0, 'ab', 0.5, null), 3631, 1e-9);
  near('Ks AB - Vega', fromJy(toJy(10, 'vega', K.lam, K.vegaJy), K.lam, K.vegaJy).ab - 10, 1.84, 0.01);
  near('f_nu to f_lambda round trip', toJy(fromJy(0.1, 0.8, null).cgs_lam, 'cgs_lam', 0.8, null), 0.1, 1e-12);
  near('photon round trip', toJy(fromJy(2, 1.2, null).phot, 'phot', 1.2, null), 2, 1e-12);
  near('1 Jy in cgs', fromJy(1, 1, null).cgs_nu, 1e-23, 1e-35);
}

// ---- Darkness through the night against astronomy-engine's own twilight search.
{
  const place = { lat: 43.65, lon: -79.38, elev: 0 }, obs = new Astro.Observer(43.65, -79.38, 0);
  for (const iso of ['2027-01-15', '2027-06-21']) {
    const r = darkNight(place, iso);
    const du = Astro.SearchAltitude(Astro.Body.Sun, obs, -1, r.start, 1, -18).date, da = Astro.SearchAltitude(Astro.Body.Sun, obs, +1, du, 1, -18).date;
    near(`${iso} dusk within a minute`, (r.dusk - du) / 6e4, 0, 1); near(`${iso} dark hours`, r.darkH, (da - du) / 36e5, 0.02);
    check(`${iso} Moon-free dark is part of the dark`, r.moonFreeH <= r.darkH + 1e-9);
  }
  check('no true darkness in London at midsummer', darkNight({ lat: 51.51, lon: -0.13, elev: 0 }, '2027-06-21').darkH === 0);
  check('a leap year has 366 evenings', yearDates(2028).length === 366);
}

// ---- Rocket equation and orbit transfers (Curtis, Orbital Mechanics for Engineering Students, LEO to GEO).
{
  near('Tsiolkovsky, mass ratio e', staging([{ name: 'S', dry: 1, prop: Math.E - 1, isp: 300 }], 0).dv, 300 * 9.80665, 1e-9);
  const r = staging([{ name: 'A', dry: 22000, prop: 400000, isp: 300 }, { name: 'B', dry: 4000, prop: 100000, isp: 340 }], 10000);
  near('two-stage liftoff mass', r.liftoff, 536000, 1e-9); near('two-stage delta-v', r.dv, 11027.30, 0.01);
  near('propellant for a delta-v', staging([{ name: 'S', dry: 1000, prop: propellantFor(3000, 320, 1000), isp: 320 }], 0).dv, 3000, 1e-6);
  const E = BODIES.find((b) => b.id === 'earth').mu, h = hohmann(E, 6678, 42164);
  near('LEO to GEO first burn', h.dv1, 2.426, 1e-3); near('LEO to GEO second burn', h.dv2, 1.467, 1e-3); near('LEO to GEO time (h)', h.tof / 3600, 5.27, 0.01);
  const S = BODIES.find((b) => b.id === 'sun').mu, m = hohmann(S, AU, 1.5237 * AU);
  near('Earth to Mars days', m.tof / 86400, 259, 1); near('Mars lead angle', (m.lead * 180) / Math.PI, 44.3, 0.3); near('Earth-Mars synodic days', m.synodic / 86400, 780, 1);
  near('bi-elliptic beats Hohmann at ratio 20', hohmann(E, 7000, 140000).dv - biElliptic(E, 7000, 140000, 280000).dv, 0.0703, 0.002);
  throws('bi-elliptic apoapsis too low', () => biElliptic(E, 7000, 14000, 10000));
}

// ---- Lomb-Scargle: a clean sine is found, the fast trig recurrence matches a direct sum, and noise false alarms are calibrated.
{
  let seed = 3; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const t = Array.from({ length: 120 }, () => rnd() * 50).sort((a, b) => a - b), y = t.map((x) => Math.sin((2 * Math.PI * x) / 2.345) + 0.1 * (rnd() - 0.5));
  const P = lombScargle(t, y, null, 1 / 50, 2, 2000), best = peaks(P, 1)[0];
  near('period of a sine', 1 / best.freq, 2.345, 0.002); check('power near 1', best.power > 0.98);
  // Direct evaluation at one frequency.
  const f = P.freq[777], w = 1 / t.length, Y = y.reduce((s, v) => s + v * w, 0);
  let C = 0, Sn = 0, YC = 0, YS = 0, CC = 0, SS = 0, CS = 0, YY = 0;
  t.forEach((x, i) => { const c = Math.cos(2 * Math.PI * f * (x - t[0])), sn = Math.sin(2 * Math.PI * f * (x - t[0])); C += w * c; Sn += w * sn; YC += w * y[i] * c; YS += w * y[i] * sn; CC += w * c * c; SS += w * sn * sn; CS += w * c * sn; YY += w * y[i] * y[i]; });
  const yc = YC - Y * C, ys = YS - Y * Sn, cc = CC - C * C, ss = SS - Sn * Sn, cs = CS - C * Sn, D = cc * ss - cs * cs;
  near('recurrence matches a direct sum', P.power[777], (ss * yc * yc + cc * ys * ys - 2 * cs * yc * ys) / ((YY - Y * Y) * D), 1e-9);
  let low = 0; for (let k = 0; k < 200; k++) { const yy = t.map(() => rnd() + rnd() + rnd()); const p = lombScargle(t, yy, null, 1 / 50, 2, 1000); if (falseAlarm(Math.max(...p.power), t.length, 2, t, null) < 0.1) low++; }
  near('noise: about 10 % of trials below FAP 0.1', low / 200, 0.1, 0.06);
  near('phase', phase([5.5], 2, 0)[0], 0.75, 1e-12);
}

// ---- Mosaics.
{
  near('APS-C at 480 mm', fovArcmin(23.5, 480), 168.27, 0.01);
  check('frames along a side', framesAlong(190, 168.27, 0.15) === 2 && framesAlong(100, 168, 0.15) === 1 && framesAlong(300, 100, 0) === 3);
  const p = offsetToRaDec(0, 0, 60, 0); near('one degree east on the equator', p.ra, 1, 1e-3);
  near('gnomonic north', offsetToRaDec(180, 30, 0, 60).dec, 31, 1e-3);
  const r = mosaic({ ra: 10, dec: 0, tw: 100, th: 10, fw: 60, fh: 40, overlap: 0, pa: 90 });
  check('pa 90: panel 1 to the east', r.panels[0].ra > 10 && Math.abs(r.panels[0].dec) < 1e-9);
}

// ---- Meteor rates (IMO formula).
near('ZHR with radiant overhead, perfect sky', hourlyRate(100, 2.2, 6.5, 90), 100, 1e-9);
near('Perseids at 60°, LM 6', hourlyRate(100, 2.2, 6, 60), 58.39, 0.01);
check('no meteors with radiant below horizon', hourlyRate(100, 2.2, 6.5, -5) === 0);

// ---- Sky brightness: luminance scale, the SQM to NELM relation and Bortle bands.
near('22 mag/arcsec² in mcd/m²', sqmToMcd(22), 0.1712, 0.0005);
near('mcd round trip', mcdToSqm(sqmToMcd(19.3)), 19.3, 1e-9);
near('NELM for SQM 21.5', sqmToNelm(21.5), 6.384, 0.001);
near('NELM round trip', nelmToSqm(sqmToNelm(18.7)), 18.7, 1e-9);
check('Bortle bands', bortleOf(22).n === 1 && bortleOf(21.8).n === 3 && bortleOf(20).n === 5 && bortleOf(17).n === 8);
check('class to reading and back', [1, 2, 3, 4, 5, 6, 7, 8].every((n) => bortleOf(sqmForBortle(n)).n === n));
near('a sky 2.5 mag brighter needs 10× the exposure', skyglow(19.5).exposureFactor, 10, 1e-9);
throws('NELM too faint for the formula', () => nelmToSqm(8));

// ---- Habitable zone (Kopparapu et al. 2014: the Sun's conservative zone is 0.95 to 1.67 AU) and equilibrium temperature.
{
  const hz = habitableZone(5780, 1);
  near('Sun runaway greenhouse edge', hz.conservative[0], 0.950, 0.002); near('Sun maximum greenhouse edge', hz.conservative[1], 1.676, 0.002);
  near('Sun recent Venus edge', hz.optimistic[0], 0.750, 0.002); near('Sun early Mars edge', hz.optimistic[1], 1.768, 0.002);
  check('5 Earth masses moves the inner edge in', habitableZone(5780, 1, '5').conservative[0] < hz.conservative[0]);
  check('cool star flagged outside the fit', habitableZone(2500, 0.0005).outOfRange && !hz.outOfRange);
  near('Earth equilibrium temperature', tEq(1, 1, 0.306), 254.0, 0.5);
  near('day side only is 2^¼ warmer', tEq(1, 1, 0.306, 2) / tEq(1, 1, 0.306), 2 ** 0.25, 1e-12);
  near('Earth year', periodDays(1, 1), 365.256, 0.001); near('Kepler round trip', auForPeriod(periodDays(0.05, 0.12), 0.12), 0.05, 1e-12);
  near('the Sun from radius and temperature', lumFrom(1, 5772), 1, 1e-12);
}

// ---- Mars time: Allison & McEwen (2000) worked example for 2000 January 6, 00:00 UTC.
{
  const t = marsTime(Date.UTC(2000, 0, 6));
  near('ΔtJ2000', t.dt, 4.5007428, 1e-6); near('Mars mean anomaly', t.M, 21.74558, 1e-4); near('fictitious mean sun', t.alphaFMS, 272.74566, 1e-4);
  near('perturbers', t.pbs, 0.00142, 1e-5); near('equation of centre', t.nuM, 4.44193, 1e-4); near('Ls', t.ls, 277.18758, 1e-4);
  near('equation of time', t.eot, -5.18774, 1e-4); near('MSD', t.msd, 44795.99976, 1e-5); near('heliocentric distance', t.r, 1.39358, 1e-4);
  near('MTC', t.mtc, 23.9942, 1e-3);
  check('Mars Year 24', t.marsYear === 24); check('Mars Year 38 on 2025 Jan 1', marsTime(Date.UTC(2025, 0, 1)).marsYear === 38);
  near('MSD round trip', marsTime(msdToMs(52000.25)).msd, 52000.25, 1e-7);
  const c = MISSIONS.find((m) => m.id === 'curiosity');
  near('Curiosity landed mid-afternoon', localSolar(marsTime(c.landing), c.lonEast).lmst, 15.05, 0.05);
  check('Curiosity sol 0 is the landing sol', missionSol(c, c.landing) === 0 && missionSol(c, solStart(c, 1000) + 60e3) === 1000);
  check('Mars Years 36, 37, 38 began 2021 Feb 7, 2022 Dec 26, 2024 Nov 12', [[36, '2021-02-07'], [37, '2022-12-26'], [38, '2024-11-12']].every(([y, d]) => new Date(lsTime(y, 0)).toISOString().startsWith(d)));
  check('Curiosity sol 1000 began on 2015 May 30 (UTC)', new Date(solStart(c, 1000)).toISOString().startsWith('2015-05-30'));
}

// ---- Transit windows: barycentric time round trip and a known epoch count.
{
  const ra = 300.18213, dec = 22.71086, t = Date.UTC(2026, 10, 8);
  near('BJD round trip', msToBjd(bjdToMs(2461000.25, ra, dec), ra, dec), 2461000.25, 1e-9);
  near('BJD differs from JD by at most 8.3 min plus TT', Math.abs(msToBjd(t, ra, dec) - (2440587.5 + t / 864e5)) * 1440, 4, 5.5);
  const w = transitWindows({ ra, dec, t0: 2454279.436714, period: 2.21857567, durH: 1.827, pErr: 1e-7 }, { name: 'T', lat: 43.65, lon: -79.38, elev: 0, tz: 'UTC' }, t, t + 10 * 864e5);
  check('HD 189733 b: 4 or 5 transits in 10 days', w.length >= 4 && w.length <= 5);
  near('epoch spacing (UTC, so the light-time across the orbit adds seconds)', (w[1].mid - w[0].mid) / 864e5, 2.21857567, 3e-4);
  check('timing error grows with epoch', w[0].sigmaMin > 0.4 && w[0].sigmaMin < 0.5);
  check('qualities', w.every((x) => ['full', 'transit', 'partial', 'none'].includes(x.quality)));
  near('trapezoid floor', trapezoid(0, 2, 0.02), 0.98, 1e-12); check('trapezoid outside', trapezoid(1.1, 2, 0.02) === 1);
}

// ---- Redshift conventions.
near('relativistic v at z = 1', velocity(1, 'relativistic'), 179875.47, 0.01);
near('radio v at z = 1', velocity(1, 'radio'), 149896.229, 1e-3);
near('optical z from v', redshift(3000, 'optical'), 0.010006922, 1e-9);
check('round trips', ['relativistic', 'optical', 'radio'].every((c) => Math.abs(redshift(velocity(0.37, c), c) - 0.37) < 1e-12));
near('Hα at z = 0.1', zFromLambda(656.281 * 1.1, 656.281), 0.1, 1e-12);
near('21 cm line frequency', nmToGhz(LINES.find((l) => l.id === 'hi').nm), 1.420405752, 1e-9);
throws('faster than light', () => redshift(3e5, 'relativistic'));

// ---- Black bodies: Wien, Stefan-Boltzmann and the Sun's bolometric correction (Torres 2010: about −0.08).
near('Sun peak wavelength (nm)', (WIEN_LAM / 5772) * 1e9, 502.0, 0.1);
{
  // Numerical peak of Planck's law agrees with Wien's constant.
  let best = 0, at = 0; for (let l = 300e-9; l < 800e-9; l += 0.05e-9) { const b = planckLam(l, 5772); if (b > best) { best = b; at = l; } }
  near('Planck peak matches Wien', at * 1e9, 502.0, 0.1);
}
near('whole spectrum sums to 1', bandFraction(1e-9, 1e-2, 5772), 1, 1e-6);
near('the Sun: 37 % visible (400 to 700 nm)', bandFraction(400e-9, 700e-9, 5772), 0.366, 0.002);
near('one solar luminosity', starBB(5772, 1).Lsun, 1, 1e-5);
near('Sun BC_V', bcV(5772), -0.081, 0.003); near('Sun M_V', starBB(5772, 1).Mv, 4.82, 0.01);
check('hot and cool stars have large negative BCs', bcV(30000) < -2.5 && bcV(3500) < -1.5 && bcV(7000) > -0.1);
near('Ballesteros: Sun B−V 0.65', tFromBV(0.65), 5778, 5);
near('the Sun at 10 pc', starBB(5772, 1, 10).mV, 4.82, 0.01);

// ---- Radial velocity: Jupiter pulls the Sun at 12.5 m/s; 51 Peg b is 0.47 Jupiter masses (Mayor & Queloz 1995).
near('Jupiter K', semiAmplitude(M_JUP, 1, 4332.59, 0.0489), 12.47, 0.02);
{
  const p = minMass(55.94, 1.11, 4.230785, 0.013);
  near('51 Peg b m sin i (MJ), published 0.47', p.m / M_JUP, 0.477, 0.005); near('51 Peg b orbit (AU)', semiMajor(1.11, p.m, 4.230785) / AU_M, 0.0530, 0.0003);
  near('mass round trip', semiAmplitude(p.m, 1.11, 4.230785, 0.013), 55.94, 1e-6);
  near('Earth from 9 cm/s', minMass(0.0895, 1, 365.256).m / M_EARTH, 1.0, 0.005);
  near('Jupiter-size radius from 1 % depth', radiusFromDepth(0.0105, 1) / R_JUP, 1.0, 0.01);
  near('Jupiter density', density(M_JUP, 6.9911e7), 1326, 2);
  throws('eccentricity 1', () => minMass(10, 1, 10, 1));
}

// ---- Impact craters (Collins, Melosh and Marcus 2005, eq. 21, 22, 27).
{
  const p = { L: 50, rhoI: 8000, v: 12800, angle: 45, rhoT: 2500, g: 9.81, dc: 3200 }, r = crater(p);
  near('transient crater (by hand, 1.161 (ρi/ρt)^⅓ L^0.78 v^0.44 g^−0.22 sin^⅓θ)', r.Dtc, 1250.97, 0.1);
  check('simple crater 1.25 × transient', r.simple && Math.abs(r.D - 1.25 * r.Dtc) < 1e-9);
  near('energy in megatons', r.Mt, 10.25, 0.01);
  near('impactor from the crater', impactorFor(r.D, p), 50, 1e-6);
  const big = crater({ ...p, L: 10000, rhoI: 3000, v: 20000 });
  check('complex crater above the transition', !big.simple && Math.abs(big.D - (1.17 * big.Dtc ** 1.13) / 3200 ** 0.13) < 1e-6);
}

// ---- Link budgets.
near('free-space loss, 2.4 GHz over 1 km', fspl(1000, 2.4e9), 100.05, 0.01);
near('free-space loss, 437 MHz over 1000 km', fspl(1e6, 437e6), 145.26, 0.01);
near('BPSK at BER 1e-5', requiredEbN0('bpsk', 1e-5), 9.59, 0.01); near('non-coherent FSK at 1e-5', requiredEbN0('fsk', 1e-5), 13.35, 0.01);
near('500 km satellite on the horizon', slantRange(500, 0) / 1000, 2573, 1); near('overhead', slantRange(500, 90) / 1000, 500, 1e-9);
near('1 m dish at 2.4 GHz, 55 %', dishGain(1, 2.4e9), 25.41, 0.01);
{
  const b = budget({ f: 437e6, d: 1e6, ptW: 1, gt: 0, lt: 1, gr: 12, lr: 1, tsys: 500, latm: 0.5, lpol: 3, lpoint: 0, rate: 9600, req: 9.59, impl: 2 });
  // EIRP −1 dBW; C/N0 = −1 − 145.26 − 3.5 + (11 − 26.99) + 228.60.
  near('C/N0', b.cn0, -1 - 145.257 - 3.5 + 11 - 26.990 + 228.599, 0.01); near('margin', b.margin, b.cn0 - 39.823 - 11.59, 0.01);
}

// ---- Radio telescopes: a 100 m dish with 70 % efficiency gives about 2 K/Jy (as the GBT quotes).
{
  const g = scope({ D: 100, eta: 0.7, tsys: 20, f: 1.4e9, n: 1, npol: 2, bw: 1e6 });
  near('gain K/Jy', g.gain, 1.991, 0.002); near('SEFD', g.sefd, 10.05, 0.01); near('beam (arcmin)', (g.hpbw * 180 * 60) / Math.PI, 8.83, 0.01);
  near('radiometer equation', g.sigma(100), 10.045 / Math.sqrt(2 * 1e6 * 100), 1e-6);
  const v = scope({ D: 25, eta: 0.6, tsys: 30, f: 1.4e9, n: 27, npol: 2, bw: 1e6 });
  near('27 dishes: N(N−1) pairs', v.sigma1s, v.sefd / Math.sqrt(2 * 27 * 26 * 1e6), 1e-12);
  near('time for SNR 5', g.timeFor(1, 5), 25 / (1 / g.sigma1s) ** 2, 1e-9);
}


// Batch H: Sun position, Jupiter's moons, Lambert and porkchop, radial velocity orbits.
{
  const tor = { name: 'Toronto', lat: 43.65, lon: -79.38, elev: 76, tz: 'America/Toronto' };
  const d = sunDay(tor, '2026-06-21');
  // USNO: Toronto 21 June 2026 sunrise 05:36 EDT, sunset 21:03 EDT.
  near('Toronto solstice sunrise (UTC min)', d.rise.getUTCHours() * 60 + d.rise.getUTCMinutes() + d.rise.getUTCSeconds() / 60, 9 * 60 + 36, 1);
  near('Toronto solstice sunset (UTC min)', d.set.getUTCHours() * 60 + d.set.getUTCMinutes() + d.set.getUTCSeconds() / 60, 25 * 60 + 2.6 - 24 * 60, 1);
  near('Toronto solstice day length', d.dayH, 15.44, 0.02);
  near('Toronto noon altitude = 90 − φ + ε', d.noonAlt, 90 - 43.65 + 23.44, 0.1);
  near('equation of time early November', sunDay(tor, '2026-11-03').eotMin, 16.45, 0.1);
  near('equation of time mid February', sunDay(tor, '2026-02-11').eotMin, -14.2, 0.1);
  const tro = { name: 'Tromsø', lat: 69.65, lon: 18.96, elev: 0, tz: 'Europe/Oslo' };
  check('midnight sun and polar night', sunDay(tro, '2026-06-21').polar === 'day' && sunDay(tro, '2026-12-21').polar === 'night');
  near('June solstice 2026 (UTC h on 21 June)', (seasons(2026)[1][1].getTime() - Date.UTC(2026, 5, 21)) / 3600e3, 8.42, 0.05);
  const s3 = sunAltAz(tor, new Date('2026-06-21T19:00:00Z'));
  check('afternoon Sun in the south-west', s3.az > 225 && s3.az < 240 && s3.alt > 60 && s3.alt < 62);

  // Jupiter: Callisto stays within ~26.3 radii; Io's transit lasts about 2 h 15 min; at opposition eclipses and occultations coincide.
  const ms = moonsAt(new Date('2027-02-11T03:00:00Z'));
  near('Jupiter diameter near 2027 opposition (arcsec)', 2 * ms.radiusArcsec, 45.2, 0.3);
  check('moons inside their orbits', ms.moons.every((m, i) => Math.hypot(m.east, m.north) < [5.95, 9.45, 15.1, 26.4][i]));
  const ev = jovEvents(Date.UTC(2027, 1, 10), Date.UTC(2027, 1, 13));
  const ioT = ev.find((e) => e.moon === 'Io' && e.kind === 'Transit' && e.start && e.end);
  near('Io transit duration (h)', (ioT.end - ioT.start) / 3600e3, 2.28, 0.08);
  const eu = ev.filter((e) => e.moon === 'Europa' && (e.kind === 'Occultation' || e.kind === 'Eclipse') && e.start && Math.abs(e.start - Date.UTC(2027, 1, 12)) < 3600e3);
  check('Europa occultation and eclipse overlap at opposition', eu.length === 2 && Math.abs(eu[0].start - eu[1].start) < 600e3);

  // Curtis, Orbital Mechanics, Example 5.2.
  const L = lambert([5000, 10000, 2100], [-14600, 2500, 7000], 3600, 398600);
  near('Lambert v1 x', L.v1[0], -5.9925, 1e-3); near('Lambert v1 y', L.v1[1], 1.9254, 1e-3); near('Lambert v1 z', L.v1[2], 3.2456, 1e-3);
  near('Lambert v2 x', L.v2[0], -3.3125, 1e-3); near('Lambert v2 y', L.v2[1], -4.1966, 1e-3); near('Lambert v2 z', L.v2[2], -0.38529, 1e-3);
  near('Hohmann Earth to Mars (days)', hohmannDays('Earth', 'Mars'), 259, 1);
  near('synodic period Earth–Mars', synodicDays('Earth', 'Mars'), 780, 1);
  near('burn from 200 km LEO at v∞ 3 km/s', burnFromOrbit('Earth', 3), Math.sqrt(9 + 2 * 398600.4 / 6578.1) - Math.sqrt(398600.4 / 6578.1), 1e-9);
  // Perseverance: launched 30 July 2020, landed 18 February 2021 (203 days).
  near('Mars 2020 launch C3', leg('Earth', 'Mars', Date.UTC(2020, 6, 30), 203).c3, 14.5, 0.3);
  const w = nextWindow('Earth', 'Mars', Date.UTC(2026, 10, 8));
  const g = grid('Earth', 'Mars', w.start, w.days, w.tof[0], w.tof[1], 40);
  check('2026 Mars window found', Math.abs(g.best.dep - Date.UTC(2026, 10, 2)) < 12 * 864e5);
  near('2026 Mars window C3', g.best.c3, 9.2, 0.3);
  const wv = nextWindow('Earth', 'Venus', Date.UTC(2026, 10, 8));
  check('a passed window is skipped', wv.best.dep > Date.UTC(2026, 10, 1));

  // Radial velocity fit recovers the simulated binary in src/data.
  const rows = readFileSync(new URL('../src/data/spectroscopic-binary-sim.tsv', import.meta.url), 'utf8').split('\n').filter((l) => /^\d/.test(l)).map((l) => l.split('\t').map(Number));
  const f = fitOrbit(rows.map((r) => r[0]), rows.map((r) => r[1]), rows.map((r) => r[2]));
  near('RV fit P', f.o.P, 12.345, 3 * f.err.P + 1e-3); near('RV fit K', f.o.K, 23.4, 3 * f.err.K);
  near('RV fit e', f.o.e, 0.42, 3 * f.err.e); near('RV fit ω', f.o.w, 2.1, 3 * f.err.w); near('RV fit γ', f.o.gamma, -14.2, 3 * f.err.gamma);
  check('RV fit reduced χ² near 1', f.redChi2 > 0.6 && f.redChi2 < 1.6);
  const b = binary(23.4, 12.345, 0.42);
  // Textbook form: f(m) = 1.0361 × 10⁻⁷ (1 − e²)^1.5 K³ P, with K in km/s and P in days.
  near('mass function', b.fm, 1.0361e-7 * (1 - 0.42 ** 2) ** 1.5 * 23.4 ** 3 * 12.345, 2e-5);
  near('a sin i (km)', b.asini, 23.4 * 12.345 * 86400 * Math.sqrt(1 - 0.42 ** 2) / (2 * Math.PI), 1);
  near('Kepler: true anomaly at periastron', trueAnomaly(5, 10, 0.5, 5), 0, 1e-12);
  // A circular planet: four numbers, finite uncertainties.
  const tt = [], vv = []; let sd = 1; const rnd = () => { sd = (sd * 16807) % 2147483647; return sd / 2147483647 - 0.5; };
  for (let i = 0; i < 30; i++) { const ti = 60000 + i * 1.37 + rnd(); tt.push(ti); vv.push(rvModel(ti, { P: 4.2308, K: 55.9, e: 0, w: 1, tp: 60000, gamma: -33.2 }) + rnd() * 6); }
  const c = fitOrbit(tt, vv, tt.map(() => 3), { circular: true });
  near('circular fit P', c.o.P, 4.2308, 3 * c.err.P); near('circular fit K', c.o.K, 55.9, 3 * c.err.K);
  check('circular fit errors finite', Number.isFinite(c.err.w) && Number.isFinite(c.err.gamma) && c.o.e === 0);
  throws('too few velocities', () => fitOrbit([1, 2, 3, 4, 5, 6], [1, 2, 3, 2, 1, 0], null));
}


// Batch I: eclipses, satellite orbits, uv coverage, visual binaries.
{
  const tor = { name: 'Toronto', lat: 43.65, lon: -79.38, elev: 76, tz: 'America/Toronto' };
  const nf = { name: 'Niagara Falls', lat: 43.0896, lon: -79.0849, elev: 180, tz: 'America/Toronto' };
  const apr = solarEclipses(tor, Date.UTC(2024, 3, 1), Date.UTC(2024, 4, 1))[0];
  check('2024 eclipse partial in Toronto, total elsewhere', apr.kind === 'partial' && apr.globalKind === 'total');
  near('Toronto 2024 obscuration', apr.obscuration, 0.999, 0.002);
  near('Toronto 2024 begin (UTC h)', apr.begin.getUTCHours() + apr.begin.getUTCMinutes() / 60, 18 + 4 / 60, 2 / 60);
  near('Toronto 2024 end (UTC h)', apr.end.getUTCHours() + apr.end.getUTCMinutes() / 60, 20 + 31 / 60, 2 / 60);
  const nfe = solarEclipses(nf, Date.UTC(2024, 3, 1), Date.UTC(2024, 4, 1))[0];
  check('Niagara Falls 2024 total', nfe.kind === 'total');
  near('Niagara Falls totality (s)', (nfe.centralEnd - nfe.centralBegin) / 1000, 213, 10);
  const mar = lunarEclipses(tor, Date.UTC(2025, 2, 1), Date.UTC(2025, 3, 1))[0];
  // NASA: 14 March 2025 total lunar eclipse, U1 05:09, U2 06:26, U3 07:31, U4 08:47 UTC.
  const hm = (d) => d.getUTCHours() * 60 + d.getUTCMinutes() + d.getUTCSeconds() / 60;
  near('lunar U1', hm(mar.contacts[1]), 5 * 60 + 9, 1.5); near('lunar U2', hm(mar.contacts[2]), 6 * 60 + 26, 1.5);
  near('lunar U3', hm(mar.contacts[3]), 7 * 60 + 31, 1.5); near('lunar U4', hm(mar.contacts[4]), 8 * 60 + 47, 1.5);
  check('March 2025 lunar eclipse seen from Toronto', mar.kind === 'total' && mar.visible);
  const g = shadowGeometry(mar.peak);
  near('umbral magnitude (NASA 1.178)', (g.umbra + g.rMoon - Math.hypot(g.east, g.north)) / (2 * g.rMoon), 1.178, 0.01);
  near('overlap: equal discs centred', overlap(1, 1, 0), 1, 1e-12); near('overlap: touching', overlap(1, 1, 2), 0, 1e-12);
  near('overlap: half-offset equal discs', overlap(1, 1, 1), (2 * Math.PI / 3 - Math.sqrt(3) / 2) / Math.PI, 1e-9);

  const tle = 'ISS (ZARYA)\n1 25544U 98067A   08264.51782528 -.00002182  00000-0 -11606-4 0  2927\n2 25544  51.6416 247.4627 0006703 130.5360 325.0288 15.72125391563537';
  const el = parseTLE(tle);
  check('TLE checksums', tleChecksum('1 25544U 98067A   08264.51782528 -.00002182  00000-0 -11606-4 0  2927') === 7 && tleChecksum('2 25544  51.6416 247.4627 0006703 130.5360 325.0288 15.72125391563537') === 7);
  check('TLE epoch 2008-09-20 12:25:40 UTC', Math.abs(el.epoch - Date.UTC(2008, 8, 20, 12, 25, 40, 104)) < 2);
  near('TLE inclination', el.inc, 51.6416, 1e-9); near('TLE eccentricity', el.ecc, 0.0006703, 1e-12);
  throws('TLE with a bad digit', () => parseTLE(tle.replace('51.6416', '51.6417')));
  near('GMST at J2000.0 (deg)', (gmst(Date.UTC(2000, 0, 1, 12)) * 180) / Math.PI, 280.46061837, 1e-6);
  near('sun-synchronous inclination at 700 km', ssoInclination(700, 700), 98.19, 0.02);
  const issLike = orbitInfo(fromHeights('x', 415, 422, 51.64, 0, 0, 0, 0));
  near('ISS-like period (min)', issLike.periodMin, 92.94, 0.02); near('ISS-like nodal drift (°/day)', issLike.raanRate, -4.95, 0.03);
  near('Molniya perigee nearly frozen', orbitInfo(fromHeights('m', 600, 39700, 63.4, 0, 270, 0, 0)).argpRate, 0, 0.01);
  const geo = fromHeights('g', 35786, 35786, 0, 0, 0, 0, Date.UTC(2026, 0, 1));
  near('geostationary period (min)', orbitInfo(geo).periodMin, 1436.07, 0.05);
  const l0 = subpoint(satPos(geo, geo.epoch), geo.epoch).lon, l1 = subpoint(satPos(geo, geo.epoch + 12 * 3600e3), geo.epoch + 12 * 3600e3).lon;
  near('geostationary stays put (12 h)', l1 - l0, 0, 0.05);
  near('ISS height at epoch (km)', subpoint(satPos(el, el.epoch), el.epoch).h, 350, 15);
  near('footprint at 10° from 420 km (deg)', footprint(420, 10), 12.49, 0.02);
  const ps = satPasses(fromHeights('x', 415, 422, 51.64, 0, 0, 0, Date.UTC(2026, 10, 8)), 43.65, -79.38, 0.076, Date.UTC(2026, 10, 8), Date.UTC(2026, 10, 11), 10);
  check('passes found and ordered', ps.length >= 6 && ps.every((p, i) => p.rise < p.peak && p.peak < p.set && (i === 0 || p.rise > ps[i - 1].set)));

  const two = uvTracks([{ e: 0, n: 0 }, { e: 100, n: 0 }], 0, 0, 1.4e9, 0, 0, 1);
  near('E–W baseline at transit: u = B/λ', two.u[0], 100 / (299792458 / 1.4e9), 1e-9);
  const pole = uvTracks([{ e: 0, n: 0 }, { e: 100, n: 0 }], 90, 90, 1.4e9, -6, 6, 13);
  check('pole source traces a circle', pole.u.every((x, i) => Math.abs(Math.hypot(x, pole.v[i]) - two.u[0]) < 1e-9));
  check('27 antennas make 351 baselines', baselines(yArray(9, 600)).length === 351);
  const re = new Float64Array([1, 2, 3, 4, 0, 0, 0, 0]), im = new Float64Array(8); fft(re, im); fft(re, im, true);
  check('FFT round trip', [1, 2, 3, 4, 0, 0, 0, 0].every((x, i) => Math.abs(re[i] / 8 - x) < 1e-12));
  const tr = uvTracks(yArray(9, 600), 34.08, 30, 1.42e9, -4, 4, 97, 15), bw = beamWidth(dirtyBeam(tr.u, tr.v, 256));
  near('Y array beam E–W (arcsec)', bw.ew, 57.8, 2); near('Y array beam N–S (arcsec)', bw.ns, 52.1, 2);
  near('largest scale (arcsec)', scales(1.42e9, 23.946, 1039.23, 25).largest, 1091, 2);
  check('antenna text', parseAntennas('A1 0 0\nA2, 10, 5, 1\n# note\n3 4').length === 3);

  // Meeus, Astronomical Algorithms, example 57.a: η CrB on 1980.0.
  const eta = orbitAt({ P: 41.623, T: 1934.008, e: 0.2763, a: 0.907, i: 59.025, node: 23.717, omega: 219.907 }, 1980.0);
  near('η CrB position angle', eta.theta, 318.4, 0.05); near('η CrB separation', eta.rho, 0.411, 0.0005);
  const sir = { P: 50.1284, T: 1994.5715, e: 0.59142, a: 7.4957, i: 136.336, node: 45.4, omega: 149.161 };
  check('Sirius B widest around 2023', orbitAt(sir, 2023).rho > 11.2 && orbitAt(sir, 1994.57).rho < 3.2);
  near('Sirius system mass', systemMass(7.4957, 50.1284, 0.37921), 3.07, 0.02);
  near('decimal year of J2000.0', yearOf(Date.UTC(2000, 0, 1, 12)), 2000, 1e-12);
  const m1 = dsMeasure(100, 100, 100, 90, 0.5), m2 = dsMeasure(100, 100, 90, 100, 0.5), m3 = dsMeasure(100, 100, 90, 100, 0.5, 0, true);
  check('measure: up is north, left is east, mirrored flips', m1.pa === 0 && m1.sep === 5 && Math.abs(m2.pa - 90) < 1e-9 && Math.abs(m3.pa - 270) < 1e-9);
}

{
  // Rotation curves. Bessel values from Abramowitz and Stegun tables 9.8.
  near('I0(1)', besselI0(1), 1.2660659, 1e-6); near('K0(1)', besselK0(1), 0.4210244, 1e-6);
  near('I1(1)', besselI1(1), 0.5651591, 1e-6); near('K1(1)', besselK1(1), 0.6019072, 1e-6);
  // Freeman (1970): an exponential disc peaks at 2.15 Rd with v = 0.622 √(GM/Rd).
  let pk = 0, rpk = 0; for (let r = 0.5; r < 6; r += 0.005) { const v = vDisc(r, 5e10, 1); if (v > pk) { pk = v; rpk = r; } }
  near('disc peak radius / Rd', rpk, 2.15, 0.01); near('disc peak speed', pk / Math.sqrt(4.30091e-6 * 5e10), 0.6219, 0.001);
  near('disc far out → point mass', vDisc(200, 5e10, 3), Math.sqrt(4.30091e-6 * 5e10 / 200), 0.2);
  near('Hernquist v at r = a', vBulge(1, 1e10, 1), Math.sqrt(4.30091e-6 * 1e10 / 4), 1e-9);
  near('isothermal flat speed', vIso(1e4, 1e7, 2), Math.sqrt(4 * Math.PI * 4.30091e-6 * 1e7 * 4), 0.1);
  near('NFW peak at 2.163 rs', (() => { let b = 0, rb = 0; for (let r = 0.5; r < 6; r += 0.001) { const v = vNFW(r, 1e7, 1); if (v > b) { b = v; rb = r; } } return rb; })(), 2.163, 0.002);
  const vir = nfwVirial(1.2e7, 16); near('M200 encloses 200 ρc', (vir.m200 / (4 / 3 * Math.PI * vir.r200 ** 3)) / vir.rhoc, 200, 0.01);
  const truth = { Mb: 1e10, ab: 0.6, Md: 5e10, Rd: 3, rho: 1.2e7, rh: 16, halo: 'nfw' };
  const rr = Array.from({ length: 20 }, (_, i) => 1.5 * (i + 1)), vv = rr.map((r) => rcComponents(r, truth).total);
  const fr = fitRotation(rr, vv, rr.map(() => 2), { halo: 'nfw', fixRd: 3 });
  check('noise-free curve fits to χ² ≈ 0', fr.chi2 < 0.05);
  near('fitted curve matches at 30 kpc', rcComponents(30, fr.m).total, vv[19], 0.5);

  // Spectral lines: Hα in air and vacuum (NIST 6562.80 / 6564.61 Å).
  near('Hα vacuum → air', vacToAir(6564.61), 6562.80, 0.01); near('Hα air → vacuum', airToVac(6562.80), 6564.61, 0.01);
  const zf = findRedshift([4861.33, 5006.84, 6562.8].map((x) => x * 1.158), ['stellar', 'nebular']);
  near('three lines give z', zf[0].z, 0.158, 1e-6); check('three lines agree', zf[0].n === 3);
  const id = identify([5890.1, 6562.5, 5577.5], 0, 2, ['stellar', 'pollution']);
  check('Na D, Hα and airglow named', id[0].matches[0].line.name.startsWith('Na I D') && id[1].matches[0].line.name === 'Hα' && id[2].matches[0].line.name === '[O I] airglow');
  const sp = simulatedSpectrum(0.0832), peaks = findPeaks(sp.lam, sp.f, 5, false, 40);
  check('10 emission peaks found', peaks.length === 10);
  near('redshift from the peaks', findRedshift(peaks.map((p) => p.aa), ['stellar', 'nebular'])[0].z, 0.0832, 2e-4);
  const dips = findPeaks(sp.lam, sp.f, 5, true, 40).map((p) => p.aa);
  check('atmospheric A band dip found', dips.some((x) => Math.abs(x - 7600) < 3));
  check('A band matched as a band', identify([7605], 0, 3, ['telluric'])[0].matches[0].line.name === 'O₂ A band');

  // Transits: uniform disc overlap, and small-planet limits of the quadratic law.
  near('overlap of a 0.1 disc at the centre', overlapUniform(0, 0.1), 0.01, 1e-12);
  near('half-covered limb (p = 0.1, z = 1)', blocked(1, 0.1, 1e-12, 0), overlapUniform(1, 0.1), 1e-6);
  near('small planet at centre: p²/(1 − u1/3 − u2/6)', blocked(0, 0.01, 0.4, 0.25), 1e-4 / (1 - 0.4 / 3 - 0.25 / 6), 1e-8);
  near('small planet at r = 0.8', blocked(0.8, 0.01, 0.4, 0.25), 1e-4 * intensity(0.8, 0.4, 0.25) / (1 - 0.4 / 3 - 0.25 / 6), 1e-8);
  // HD 209458 b (Torres et al. 2008): P 3.52475 d, a/R* 8.76, b 0.507, k 0.1209 → T14 ≈ 3.07 h, ρ* ≈ 1.02 g/cm³.
  near('HD 209458 b duration (h)', durations({ P: 3.52474859, k: 0.1209, aR: 8.76, b: 0.507 }).t14 * 24, 3.07, 0.05);
  near('HD 209458 b star density', stellarDensity(8.76, 3.52474859), 1.02, 0.03);
  near('density round trip', aRFromDensity(stellarDensity(8.8, 3.5), 3.5), 8.8, 1e-9);
  near('Sun–Earth density', stellarDensity(215.03, 365.25), 1.41, 0.01);
  near('fold', fold(10.4, 1, 3), 0.4, 1e-12);
  const st = simulatedTransit(), tfit = fitTransit(st.t, st.f, null, { P: st.m.P, u1: 0.4, u2: 0.25 });
  check('fit recovers k within 3σ', Math.abs(tfit.m.k - 0.1205) < 3 * tfit.err.k);
  check('fit recovers b within 3σ', Math.abs(tfit.m.b - 0.5) < 3 * tfit.err.b);
  check('fit recovers mid-transit within 3σ', Math.abs(tfit.m.T0 - st.m.T0) < 3 * tfit.err.T0);

  // Star shapes: Gaussian and Moffat stars of known width and elongation.
  near('Moffat FWHM formula', moffatFwhm(2, 1), 4, 1e-12); near('plate scale', plateScale(3.76, 800), 0.9694, 1e-4);
  const mk = (fw, el, ang, gauss) => { const w = 64, d = new Float32Array(w * w).fill(100), c = Math.cos(ang * Math.PI / 180), s = Math.sin(ang * Math.PI / 180), al = fw / (2 * Math.sqrt(2 ** (1 / 3) - 1));
    for (let y = 0; y < w; y++) for (let x = 0; x < w; x++) { const dx = x - 31.3, dy = y - 32.6, u = (dx * c + dy * s) / Math.sqrt(el), v = (-dx * s + dy * c) * Math.sqrt(el), r2 = u * u + v * v; d[y * w + x] += gauss ? 1000 * Math.exp(-0.5 * r2 / (fw / 2.3548) ** 2) : 1000 * (1 + r2 / al ** 2) ** -3; }
    return measureStar(d, w, w, 31, 33, 100, 14); };
  const g = mk(4, 1, 0, true); near('Gaussian FWHM', g.fwhm, 4, 0.04); near('Gaussian HFR = FWHM/2', g.hfr, 2, 0.05);
  const m = mk(5, 1.3, 60, false); near('Moffat FWHM', m.fwhm, 5, 0.01); near('elongation', m.fwhmMaj / m.fwhmMin, 1.3, 0.005); near('angle', m.angle, 60, 0.2); near('centroid x', m.x, 31.3, 0.01);
  const fld = simulatedField(), found = findStars(fld.d, fld.w, fld.h), sm = fieldSummary(found.stars, fld.w, fld.h);
  check('most stars found', found.stars.length > 100); near('median FWHM of the field', sm.fwhm, 4.4, 0.15);
  check('trailing detected', sm.align > 0.6 && Math.abs(sm.direction - 30) < 3);
  check('tilt detected', sm.tilt > 0.2 && Math.abs(sm.curvature) < 0.1);
}

console.log(`sci: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
