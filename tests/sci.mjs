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

console.log(`sci: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
