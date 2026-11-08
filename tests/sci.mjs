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
import { velRadio, eqToGal, lsrCorrection, baseline as hiBaseline, terminalVelocity, tangentPoint, kinematicDistance, columnDensity, simulatedHI, smooth as hiSmooth } from '../src/lib/astro/hline.ts';
import { BODIES as PLANET_BODIES, body as planetBody, derived as planetDerived, weightOn, parentMassFromOrbit } from '../src/lib/sci/planets.ts';
import { findDisc, findSpots, groupSpots, wolfNumber, simulatedSun } from '../src/lib/sci/sunspots.ts';
import { average as stkAverage, hotPixels, calibrate as stkCalibrate, stars as stkStars, align as stkAlign, warp as stkWarp, Stacker, noise as stkNoise, writeFits, simulatedSet } from '../src/lib/sci/stack.ts';
import { readImage } from '../src/lib/astro/fits.ts';
import { planckLam, bandFraction, bcV, tFromBV, star as starBB, WIEN_LAM } from '../src/lib/sci/blackbody.ts';
import { semiAmplitude, minMass, semiMajor, radiusFromDepth, density, M_JUP, M_EARTH, AU as AU_M, R_JUP } from '../src/lib/sci/rvmass.ts';
import { crater, impactorFor } from '../src/lib/sci/crater.ts';
import { fspl, dishGain, slantRange, requiredEbN0, budget } from '../src/lib/sci/linkbudget.ts';
import { scope } from '../src/lib/sci/radiotel.ts';
import { jd as aavsoJd, toVisual, toExtended, parseAavso, fractionEstimate, differential } from '../src/lib/astro/aavso.ts';
import * as CHEM from '../src/lib/sci/chem.ts';
import * as KIN from '../src/lib/sci/kinetics.ts';
import * as TIT from '../src/lib/sci/titration.ts';
import * as GAS from '../src/lib/sci/gas.ts';
import * as BEER from '../src/lib/sci/beer.ts';
import * as EQV from '../src/lib/sci/equivalents.ts';
import * as CHR from '../src/lib/sci/chrom.ts';
import * as VAL from '../src/lib/sci/validation.ts';
import * as COL from '../src/lib/sci/colligative.ts';
import * as EQL from '../src/lib/sci/equilibrium.ts';
import * as CV from '../src/lib/sci/cv.ts';
import * as TLC from '../src/lib/sci/tlc.ts';
import * as HMO from '../src/lib/sci/huckel.ts';
import * as CFT from '../src/lib/sci/crystalfield.ts';
import * as DIA from '../src/lib/sci/diatomic.ts';
import * as THM from '../src/lib/sci/thermo.ts';
import * as NST from '../src/lib/sci/nernst.ts';
import * as FAR from '../src/lib/sci/faraday.ts';
import * as GRN from '../src/lib/sci/green.ts';
import * as DEC from '../src/lib/sci/decay.ts';
import * as PMW from '../src/lib/sci/polymer.ts';
import * as COP from '../src/lib/sci/copolymer.ts';
import * as GT from '../src/lib/sci/glass.ts';
import * as TH from '../src/lib/sci/thermal.ts';
import * as BAT from '../src/lib/sci/battery.ts';
import * as COR from '../src/lib/sci/corrosion.ts';
import * as NMR from '../src/lib/sci/nmr.ts';
import * as EC from '../src/lib/sci/ecount.ts';
import * as PH from '../src/lib/sci/phase.ts';

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

{
  // 21 cm line. The standard solar apex (RA 18h, Dec +30°, B1900) lies at l = 56°, b = +23°; Sgr A* at l = 359.94°, b = −0.05°.
  const apex = eqToGal(18 + 3 / 60 + 50.24 / 3600, 30.0047); near('solar apex l', apex.l, 56.2, 0.1); near('solar apex b', apex.b, 22.8, 0.1);
  const sgr = eqToGal(17 + 45 / 60 + 40.04 / 3600, -29.00781); near('Sgr A* l', sgr.l, 359.944, 0.005); near('Sgr A* b', sgr.b, -0.046, 0.002);
  near('1 MHz below rest = +211 km/s', velRadio(1419.405751768), 211.06, 0.01);
  const lc = lsrCorrection(56.2, 22.8, new Date(Date.UTC(2026, 0, 1))); near('Sun moves 20 km/s towards the apex', lc.sun, 20, 0.05);
  check('Earth orbit term under 30.5 km/s', Math.abs(lc.earth) < 30.5);
  near('tangent point at l = 30°', tangentPoint(30, 110, 8.5, 220).R, 4.25, 1e-9); near('flat curve at the tangent point', tangentPoint(30, 110, 8.5, 220).V, 220, 1e-9);
  const kd = kinematicDistance(30, 0, 50, 8.5, 220); near('near and far distances agree on R', Math.hypot(8.5 - kd.d[0] * Math.cos(Math.PI / 6), kd.d[0] * 0.5), kd.R, 1e-9);
  check('two kinematic distances inside the solar circle', kd.d.length === 2 && kd.d[0] < kd.d[1]);
  near('column density for 100 K km/s', columnDensity(100), 1.823e20, 1e14);
  const bx = Array.from({ length: 200 }, (_, i) => i - 100), by = bx.map((x) => 10 + 0.02 * x + 0.0003 * x * x + 30 * Math.exp(-0.5 * ((x - 10) / 6) ** 2));
  const bb = hiBaseline(bx, by, 2); near('baseline removed under a strong line', bb.residual[0], 0, 0.01); near('line height kept', bb.residual[110], 30, 0.05);
  const hs = simulatedHI(), corr = lsrCorrection(30, 0, new Date(Date.UTC(2026, 6, 15, 4))).total, hv = hs.f.map((f) => velRadio(f) + corr), hb = hiBaseline(hv, hs.T, 2);
  const tv = terminalVelocity(hv, hiSmooth(hb.residual, 1), hb.sigma / Math.sqrt(3), 30, 5);
  check('terminal velocity a few km/s above the 110 km/s rotation value', tv.vt > 110 && tv.vt < 118);

  // Planets: NASA fact sheet densities, Kepler's third law gives Jupiter's mass from Io and Earth+Moon from the Moon.
  near('Earth density', planetDerived(planetBody('earth')).density, 5514, 1); near('Saturn floats', planetDerived(planetBody('saturn')).density, 687, 1);
  near('Jupiter mass from Io', parentMassFromOrbit(planetBody('io')) / 1.898e27, 1, 0.003);
  near('Earth + Moon mass from the Moon', parentMassFromOrbit(planetBody('moon')) / (5.97e24 + 7.346e22), 1, 0.005);
  near('weight on Earth unchanged', weightOn(planetBody('earth'), 70), 70, 1e-9); near('weight on Mars', weightOn(planetBody('mars'), 70), 26.43, 0.01);
  near('Moon surface gravity', planetDerived(planetBody('moon')).gravity, 1.62, 0.01);
  check('20 bodies, every moon has a parent', PLANET_BODIES.length === 20 && PLANET_BODIES.filter((b) => b.kind === 'moon').every((b) => planetBody(b.parent)));

  // Sunspots: the simulated Sun (R = 264 px) has 3 groups of 7 spots.
  const sun = simulatedSun(), disc = findDisc(sun.d, sun.w, sun.h);
  near('disc radius', disc.r, 264, 2); near('disc centre x', disc.cx, 304, 1);
  const spots = findSpots(sun.d, sun.w, sun.h, disc), W = wolfNumber(groupSpots(spots, disc, 2 * Math.sin((10 * Math.PI) / 360)));
  check('Wolf number of the example: g = 3, s = 7, R = 37', W.g === 3 && W.s === 7 && W.R === 37);
  check('tight grouping splits groups', wolfNumber(groupSpots(spots, disc, 0.01)).g > 3);

  // Stacking: calibration, alignment, clipping and FITS output.
  const sset = simulatedSet(), dk = stkAverage(sset.darks), fl = stkAverage(sset.flats), bi = stkAverage(sset.bias), hot = hotPixels(dk);
  check('25 hot pixels found', hot.length === 25);
  const cal = sset.lights.map((l) => stkCalibrate(l, { dark: dk, flat: fl, bias: bi, hot })), sw = cal[0].w, sh = cal[0].h, ref = stkStars(cal[0].planes[0], sw, sh);
  const xfs = cal.map((c) => stkAlign(ref, stkStars(c.planes[0], sw, sh)));
  check('every frame aligns to better than 0.15 px', xfs.every((x) => x && x.rms < 0.15 && x.matched >= 20));
  near('frame 2 rotation matches the simulation', Math.atan2(xfs[1].b, xfs[1].a) - Math.atan2(xfs[0].b, xfs[0].a), sset.truth[1].rot - sset.truth[0].rot, 0.002);
  const stk = new Stacker(sw, sh, 1), wr = cal.map((c, i) => stkWarp(c, xfs[i])); wr.forEach((f) => stk.add(f)); wr.forEach((f) => stk.addClipped(f, 3));
  const res = stk.result(), plain = stk.result(false);
  check('stack noise at least 2.5 times lower', stkNoise(cal[0].planes[0]) / stkNoise(res.planes[0]) > 2.5);
  let trail = 0; for (let i = 0; i < res.planes[0].length; i++) trail = Math.max(trail, plain.planes[0][i] - res.planes[0][i]);
  check('clipping removes the satellite trail', trail > 10);
  const fits = writeFits(res, [['NCOMBINE', 8, 'frames']]), back = readImage(fits);
  check('FITS file is whole 2880-byte blocks', fits.length % 2880 === 0);
  check('FITS round trip', back.w === sw && back.h === sh && Math.abs(back.planes[0][(sh - 1 - 10) * sw + 20] - res.planes[0][10 * sw + 20]) < 1e-3 && back.header.num('NCOMBINE') === 8);
}

{
  // AAVSO formats: J2000.0 = JD 2451545.0; Argelander step estimate; differential photometry; round trip.
  near('JD of J2000', aavsoJd(Date.UTC(2000, 0, 1, 12)), 2451545, 1e-9);
  near('step estimate 11.0/11.3, 1:2', fractionEstimate(11.0, 11.3, 1, 2), 11.1, 1e-9);
  near('differential photometry', differential(15200, 21800, 11.034), 11.4255, 0.0002);
  const obs = [{ name: 'SS Cyg', jd: 2454702.1234, mag: 11.1, fainter: true, filter: 'Vis.', comp1: '110', comp2: '113', chart: '070613', comment: 'B' },
    { name: 'R Leo', jd: 2460000.5, mag: 7.234, err: 0.012, fainter: false, filter: 'V', comp1: '000-BBB-123', cmag: 7.1, mtype: 'ABS' }];
  const vis = toVisual(obs, 'abc'), ext = toExtended(obs, 'abc', 'CCD');
  check('visual header', /^#TYPE=VISUAL\n#OBSCODE=ABC\n/.test(vis) && vis.includes('\nSS CYG,2454702.1234,<11.1,B,110,113,070613,na\n'));
  check('extended row', ext.includes('#OBSTYPE=CCD') && ext.includes('\nR LEO,2460000.50000,7.234,0.012,V,NO,ABS,000-BBB-123,7.100,na,na,na,na,na,na\n'));
  const back = parseAavso(vis + ext.replace(/^#TYPE=VISUAL[\s\S]*?(?=#TYPE)/, ''));
  check('round trip visual', parseAavso(vis).obs[0].fainter && parseAavso(vis).obs[0].comment === 'B' && parseAavso(vis).obscode === 'ABC');
  const pe = parseAavso(ext).obs[0];
  check('round trip extended', pe.filter === 'V' && pe.err === 0.012 && pe.cmag === 7.1 && pe.comp1 === '000-BBB-123' && back.obs.length >= 1);
  check('commas cleaned', toVisual([{ ...obs[0], notes: 'a, b' }], 'X').includes(',a  b\n'));
  near('reduced JD', parseAavso('SS CYG,60000.5,11.2').obs[0].jd, 2460000.5, 1e-9);
}
{
  // Chemistry: IUPAC standard atomic weights; textbook molar masses; balancing; NIST exact masses; isotope patterns.
  const F = CHEM.parseFormula, mm = (x) => CHEM.molarMass(F(x));
  check('118 elements', CHEM.ELEMENTS.length === 118 && CHEM.BY_SYMBOL.get('Og').z === 118);
  check('isotope abundances sum to 1', CHEM.ELEMENTS.every((e) => Math.abs(e.isotopes.reduce((a, x) => a + x.abundance, 0) - 1) < 1e-6));
  near('water 18.015', mm('H2O'), 18.015, 0.0005);
  near('glucose 180.156', mm('C6H12O6'), 180.156, 0.001);
  near('CuSO4·5H2O 249.677', mm('CuSO4·5H2O'), 249.677, 0.001);
  near('CuSO4.5H2O same', mm('CuSO4.5H2O'), 249.677, 0.001);
  near('Ca3(PO4)2 310.174', mm('Ca3(PO4)2'), 310.174, 0.001);
  near('K4[Fe(CN)6]·3H2O 422.39', mm('K4[Fe(CN)6]·3H2O'), 422.39, 0.01);
  near('Fe0.95O', mm('Fe0.95O'), 0.95 * 55.845 + 15.999, 1e-9);
  near('caffeine mono 194.08038', CHEM.monoMass(F('C8H10N4O2')), 194.080376, 2e-6);
  near('13C6 glucose mono', CHEM.monoMass(F('[13C]6H12O6')), 180.063388 + 6 * 1.003354835, 2e-6);
  near('D2O mono', CHEM.monoMass(F('D2O')), 20.023118, 2e-6);
  check('charges', F('SO4^2-').charge === -2 && F('NH4+').charge === 1 && F('Fe^3+').charge === 3 && F('Cl-').charge === -1 && F('[Fe(CN)6]^4-').charge === -4);
  check('Co vs CO', CHEM.byElement(F('Co')).has('Co') && CHEM.byElement(F('CO')).size === 2);
  check('bad formulas', ['Xy', 'C6H5)', '(C6H5', 'h2o', 'Ph'].every((x) => { try { F(x); return false; } catch (e) { return e instanceof CHEM.FormulaError; } }));
  check('Hill order', CHEM.hill(F('CH3CH2OH')) === 'C2H6O' && CHEM.hill(F('H2SO4')) === 'H2O4S' && CHEM.hill(F('[13C]6H12O6')) === '[13C]6H12O6');
  check('unsaturation', CHEM.unsaturation(F('C6H6')) === 4 && CHEM.unsaturation(F('C7H5ClO')) === 5 && CHEM.unsaturation(F('H2O')) === null);
  const eq = (t) => CHEM.balance(CHEM.parseEquation(t)).coefficients.join(',');
  check('balance propane', eq('C3H8 + O2 -> CO2 + H2O') === '1,5,3,4');
  check('balance KMnO4 + HCl', eq('KMnO4 + HCl -> KCl + MnCl2 + H2O + Cl2') === '2,16,2,2,8,5');
  check('balance Cu + HNO3', eq('Cu + HNO3 -> Cu(NO3)2 + NO + H2O') === '3,8,3,2,4');
  check('balance ionic redox', eq('MnO4^- + Fe^2+ + H^+ -> Mn^2+ + Fe^3+ + H2O') === '1,5,8,1,5,4');
  check('balance with typed coefficients and states', eq('2 H2(g) + O2(g) = 2 H2O(l)') === '2,1,2');
  check('balance photosynthesis', eq('CO2 + H2O → C6H12O6 + O2') === '6,6,1,6');
  check('unbalanceable', (() => { try { eq('H2O -> H2 + CO2'); return false; } catch (e) { return /only one side/.test(e.message); } })());
  const b = CHEM.balance(CHEM.parseEquation('C3H8 + O2 -> CO2 + H2O')), st = CHEM.stoichiometry(b, [10 / 44.097, 20 / 31.998, undefined, undefined]);
  check('limiting reagent O2', st.limiting === 1);
  near('CO2 from 20 g O2', st.rows[2].grams, 16.504, 0.002);
  near('propane left', st.rows[0].leftGrams, 4.4875, 0.001);
  // Isotope patterns: Cl2 (75.76/24.24 %): M+2/M = 2·0.2424/0.7576; caffeine [M+H]+ 195.08765; morphine [M+H]+ 286.14377.
  const pat = (f, ad) => { const ion = CHEM.adductFormula(F(f), CHEM.ADDUCTS.find((a) => a.id === ad)); return CHEM.clusterPattern(CHEM.isotopePattern(ion), ion.charge || 1); };
  const cl = pat('Cl2', 'M');
  near('Cl2 M+2', cl[1].abundance, (100 * 2 * 0.2424) / 0.7576, 0.05);
  near('Cl2 M+4', cl[2].abundance, (100 * 0.2424 ** 2) / 0.7576 ** 2, 0.05);
  near('caffeine [M+H]+', pat('C8H10N4O2', 'M+H')[0].mz, 195.087652, 2e-5);
  near('morphine [M+H]+', CHEM.monoMass(CHEM.adductFormula(F('C17H19NO3'), CHEM.ADDUCTS.find((a) => a.id === 'M+H'))), 286.143770, 2e-6);
  near('[M+2H]2+ is half', CHEM.monoMass(CHEM.adductFormula(F('C8H10N4O2'), CHEM.ADDUCTS.find((a) => a.id === 'M+2H'))) / 2, (194.080376 + 2 * CHEM.PROTON) / 2, 2e-6);
  near('[M-H]- caffeine', CHEM.monoMass(CHEM.adductFormula(F('C8H10N4O2'), CHEM.ADDUCTS.find((a) => a.id === 'M-H'))), 194.080376 - CHEM.PROTON, 2e-6);
  const br = pat('Br2', 'M');
  check('Br2 1:2:1', br.length === 3 && br[1].abundance === 100 && Math.abs(br[0].abundance - br[2].abundance) < 5);
  near('morphine M+1', pat('C17H19NO3', 'M+H')[1].abundance, 19.1, 0.2);
  near('ppm', CHEM.ppm(286.1436, 286.14377), -0.594, 0.001);
}
{
  // Kinetics: exact data recover k for each order; half-lives; Arrhenius on the methyl isonitrile textbook data (Ea ≈ 160 kJ/mol).
  const t = [0, 10, 20, 40, 60, 100, 150];
  for (const o of [0, 1, 2]) {
    const k = [1e-4, 0.03, 0.8][o], c = t.map((x) => KIN.conc(o, 0.02, k, x)), f = KIN.fitOrders(t, c);
    near(`order ${o} k recovered`, f[o].k, k, k * 1e-5);
    const w = KIN.akaikeWeights(f.map((x) => x.aicc));
    check(`order ${o} preferred`, w.indexOf(Math.max(...w)) === o);
  }
  near('first-order half-life', KIN.halfLife(1, 1, 0.01), 69.3147, 1e-3);
  near('second-order half-life', KIN.halfLife(2, 0.5, 0.2), 10, 1e-12);
  near('general order 2 matches', KIN.conc(2.0000001, 0.05, 0.8, 30), KIN.conc(2, 0.05, 0.8, 30), 1e-8);
  const run = KIN.simulatedRun(), fr = KIN.fitOrders(run.t, run.c);
  near('N2O5 simulated k', fr[1].k, 6.2e-4, 3 * fr[1].seK);
  const a = KIN.arrhenius([189.7, 198.9, 230.3, 251.2].map((x) => x + 273.15), [2.52e-5, 5.25e-5, 6.30e-4, 3.16e-3]);
  near('methyl isonitrile Ea (kJ/mol)', a.ea / 1000, 160, 3);
  near('Eyring ΔH = Ea − RT', a.dH, a.ea - KIN.R_GAS * 493, 400);
  const two = KIN.arrhenius([300, 310], [1, 2]);
  near('two-point Arrhenius', two.ea, (KIN.R_GAS * Math.log(2)) / (1 / 300 - 1 / 310), 1e-6);
  near('k back at a measured T', KIN.kAt(two, 310), 2, 1e-9);
}
{
  // Titration: 25 mL 0.1 M acetic acid with 0.1 M NaOH (Harris: pH 2.88, 4.76, 8.72); HCl; NH3 with HCl; H3PO4.
  const t = { conc: 0.1 }, ac = { kind: 'acid', pKa: [4.76], conc: 0.1, volume: 25 };
  near('acetic start', TIT.pHAt(ac, t, 0), 2.88, 0.01);
  near('acetic half-way = pKa', TIT.pHAt(ac, t, 12.5), 4.76, 0.005);
  near('acetic equivalence', TIT.pHAt(ac, t, 25), 8.72, 0.015);
  const hcl = { kind: 'acid', pKa: [TIT.STRONG], conc: 0.1, volume: 25 };
  near('HCl start', TIT.pHAt(hcl, t, 0), 1, 1e-6);
  near('HCl equivalence 7', TIT.pHAt(hcl, t, 25), 7, 1e-6);
  near('HCl excess 10 mL', TIT.pHAt(hcl, t, 35), 14 + Math.log10(1 / 60), 1e-4);
  near('NH3 + HCl equivalence', TIT.pHAt({ kind: 'base', pKa: [9.25], conc: 0.1, volume: 25 }, t, 25), 5.28, 0.01);
  near('NaOH start', TIT.pHAt({ kind: 'base', pKa: [-TIT.STRONG], conc: 0.1, volume: 25 }, t, 0), 13, 1e-6);
  const p = { kind: 'acid', pKa: [2.15, 7.2, 12.35], conc: 0.1, volume: 25 };
  near('H3PO4 first equivalence', TIT.pHAt(p, t, 25), 4.70, 0.02);
  near('H3PO4 second half-way = pKa2', TIT.pHAt(p, t, 37.5), 7.20, 0.01);
  check('indicator for acetic', TIT.indicatorsFor(ac, t, 25)[0].name === 'Phenolphthalein');
  const v = [], ph = []; for (let x = 0; x <= 60; x += 1) { v.push(x); ph.push(TIT.pHAt(p, t, x)); }
  const e = TIT.endpoints(v, ph);
  check('two H3PO4 end points', e.length === 2 && Math.abs(e[0].volume - 25) < 0.3 && Math.abs(e[1].volume - 50) < 0.3);
}
{
  // Gas laws: molar volumes; van der Waals CO2 (1 mol, 1 L, 300 K → 22.4 bar); vdW critical point of CO2 (304 K, 74 bar); round trips.
  near('molar volume 0 °C 1 atm', GAS.MOLAR_VOLUME.stpOld * 1000, 22.414, 0.001);
  near('molar volume 0 °C 1 bar', GAS.MOLAR_VOLUME.stpIupac * 1000, 22.711, 0.001);
  near('molar volume 25 °C 1 bar', GAS.MOLAR_VOLUME.satp * 1000, 24.790, 0.001);
  const id = GAS.solveIdeal({ P: 101325, n: 1, T: 273.15 });
  check('ideal solves V', id.solved === 'V' && Math.abs(id.V - 0.022414) < 1e-6);
  near('ideal T back', GAS.solveIdeal({ P: 101325, V: id.V, n: 1 }).T, 273.15, 1e-9);
  near('vdW CO2 pressure (bar)', GAS.vdwPressure(1, 1e-3, 300, 3.640, 0.04267) / 1e5, 22.42, 0.01);
  near('vdW volume inverts pressure', GAS.vdwVolume(1, GAS.vdwPressure(1, 1e-3, 300, 3.640, 0.04267), 300, 3.640, 0.04267), 1e-3, 1e-12);
  const cc = GAS.vdwCritical(3.640, 0.04267);
  near('vdW CO2 Tc', cc.Tc, 304.0, 0.5);
  near('vdW CO2 Pc (bar)', cc.Pc / 1e5, 74.0, 0.3);
  near('°F to K', GAS.toK(32, '°F'), 273.15, 1e-9);
  near('combined law V2', GAS.combined({ P: 1, V: 2, T: 298.15 }, { P: 2, T: 373.15 }).value, 1.2515, 0.0001);
  near('air density', GAS.density(101325, 273.15, 28.96), 1.292, 0.001);
  check('ideal needs exactly one blank', (() => { try { GAS.solveIdeal({ P: 1, V: 1, n: 1, T: 1 }); return false; } catch { return true; } })());
}
{
  // Beer–Lambert: NADH at 340 nm (ε 6220): A 0.622 → 0.100 mM; T ↔ A; peaks of the simulated NADH spectrum.
  near('NADH concentration', BEER.solveBL({ A: 0.622, eps: 6220, l: 1 }).c, 1e-4, 1e-12);
  near('A from 10 % T', BEER.absFromT(0.1), 1, 1e-12);
  near('T from A 0.622', BEER.tFromAbs(0.622) * 100, 23.88, 0.01);
  check('quality ranges', BEER.absQuality(0.5).level === 'good' && BEER.absQuality(1.5).level === 'warn' && BEER.absQuality(2.5).level === 'bad');
  const sp = BEER.simulatedNadh(), pk = BEER.peaks(sp.wl, sp.A).map((p) => Math.round(p.x));
  check(`NADH maxima at 259 and 340 nm (${pk})`, pk.length === 2 && Math.abs(pk[0] - 259) <= 1 && Math.abs(pk[1] - 340) <= 1);
  near('NADH A340', BEER.interpAt(sp.wl, sp.A, 340), 0.622, 0.005);
}
{
  // Reagent table: Suzuki coupling at 5.00 mmol (bromoanisole 187.04, liquid 1.494 g/mL; PhB(OH)2 1.2 eq; K2CO3 2 eq; Pd(PPh3)4 5 mol %).
  const R = [{ name: 'ArBr', mw: 187.037, equiv: 1, density: 1.494 }, { name: 'PhB', mw: 121.93, equiv: 1.2 }, { name: 'K2CO3', mw: 138.205, equiv: 2 }, { name: 'Pd', mw: 1155.58, equiv: 0.05 }];
  const t = EQV.table(R, 5);
  near('bromoanisole mg', t[0].weighMg, 935.2, 0.1);
  near('bromoanisole µL', t[0].volumeUl, 626.0, 0.1);
  near('boronic acid mg', t[1].weighMg, 731.6, 0.1);
  near('K2CO3 mg', t[2].weighMg, 1382.0, 0.1);
  near('Pd(PPh3)4 mg', t[3].weighMg, 288.9, 0.1);
  near('purity 95 % scales the mass', EQV.table([{ name: 'x', mw: 100, equiv: 1, purity: 95 }], 1)[0].weighMg, 105.263, 0.001);
  near('n-BuLi 2.5 M volume (µL)', EQV.table([{ name: 'BuLi', mw: 64.06, equiv: 1.1, molarity: 2.5 }], 5)[0].volumeUl, 2200, 1e-9);
  near('scale from 1.20 g of bromoanisole', EQV.scaleFrom(R[0], 'mg', 1200), 6.4158, 0.0001);
  near('scale from 626 µL', EQV.scaleFrom(R[0], 'ul', 626), 5.0003, 0.001);
  near('scale from a 1.2-equiv reagent', EQV.scaleFrom(R[1], 'mmol', 6), 5, 1e-12);
  const y = EQV.yieldOf(5, 184.238, 1, 780);
  near('theoretical yield mg', y.theoMg, 921.2, 0.1);
  near('percent yield', y.percent, 84.67, 0.01);
  check('volume scale needs density or molarity', (() => { try { EQV.scaleFrom(R[2], 'ul', 1); return false; } catch { return true; } })());
}
{
  // Chromatography: peaks at 6.40 and 7.10 min, t0 1.20, W½ 0.150 and 0.160; transfer 250×4.6 mm 5 µm → 100×2.1 mm 1.8 µm.
  near('k1', CHR.retentionFactor(6.4, 1.2), 4.3333, 0.0001);
  near('Rs (Ph. Eur. half height)', CHR.resolution(6.4, 7.1, 0.15, 0.16, 'half'), 2.658, 0.001);
  near('Rs (USP baseline)', CHR.resolution(10, 11, 0.5, 0.5, 'base'), 2, 1e-12);
  near('N from W½', CHR.plates(7.1, 0.16, 'half'), 10919, 1);
  near('N from base width', CHR.plates(10, 0.5, 'base'), 6400, 1e-9);
  near('Purnell round trip', CHR.purnell(CHR.platesFor(1.5, 1.1, 5), 1.1, 5), 1.5, 1e-9);
  near('plates for Rs 1.5 at α 1.1, k 5', CHR.platesFor(1.5, 1.1, 5), 6272.64, 0.01);
  near('tailing', CHR.tailing(0.3, 0.1), 1.5, 1e-12);
  const tr = CHR.transfer({ L: 250, d: 4.6, dp: 5 }, { L: 100, d: 2.1, dp: 1.8 }, 1.0, 20);
  near('new flow', tr.flow, 0.5789, 0.0001);
  near('new injection', tr.injection, 1.667, 0.001);
  near('time scale', tr.timeScale, 0.144, 0.0005);
  near('L/dp change %', tr.lOverDpChange, 11.11, 0.01);
  check('USP window ok', tr.uspOk);
  near('solvent ratio', tr.solventRatio, 0.0834, 0.0005);
  near('same particles keeps time scale = L ratio', CHR.transfer({ L: 150, d: 4.6, dp: 3 }, { L: 150, d: 3.0, dp: 3 }, 1, 10).timeScale, 1, 1e-12);
  check('L/dp drop beyond −25 % fails', !CHR.transfer({ L: 250, d: 4.6, dp: 5 }, { L: 50, d: 2.1, dp: 1.8 }, 1, 10).uspOk);
}
{
  // Method validation: Grubbs critical values (ASTM E178 two-sided 5 %: n=3 1.155, n=4 1.481, n=10 2.290, n=20 2.709; 1 %: n=10 2.482).
  near('Grubbs crit n=3', VAL.grubbsCritical(3), 1.154, 0.002);
  near('Grubbs crit n=4', VAL.grubbsCritical(4), 1.481, 0.001);
  near('Grubbs crit n=10', VAL.grubbsCritical(10), 2.290, 0.001);
  near('Grubbs crit n=20', VAL.grubbsCritical(20), 2.709, 0.002);
  near('Grubbs crit n=10 at 1 %', VAL.grubbsCritical(10, 0.01), 2.482, 0.001);
  // Miller & Miller nitrite example: 0.403, 0.410, 0.401, 0.380 → G = 1.43, retained.
  const mg = VAL.grubbs([0.403, 0.410, 0.401, 0.380]);
  check(`Miller nitrite G 1.43 retained (${mg.G})`, Math.abs(mg.G - 1.43) < 0.005 && !mg.outlier && mg.value === 0.38);
  const g6 = VAL.grubbs([100.6, 101.0, 100.3, 100.8, 103.9, 100.5]);
  check('high value flagged', g6.outlier && g6.value === 103.9 && Math.abs(g6.G - 2.008) < 0.001);
  check('Grubbs p below 5 % when flagged', g6.p < 0.05 && mg.p > 0.05);
  const rep = VAL.grubbsRepeated([100.6, 101.0, 100.3, 100.8, 103.9, 100.5]);
  check('repeated Grubbs removes only 103.9', rep.removed.length === 1 && rep.removed[0] === 103.9);
  const pr = VAL.precision([[10, 11, 12], [12, 13, 14], [11, 12, 13]]);
  check('ANOVA: MSw 1, MSb 3, F 3, p 0.125', Math.abs(pr.msWithin - 1) < 1e-12 && Math.abs(pr.msBetween - 3) < 1e-12 && Math.abs(pr.p - 0.125) < 1e-9);
  near('intermediate precision s_I', pr.sI, Math.sqrt(5 / 3), 1e-12);
  check('s_L is 0 when series agree better than replicates', VAL.precision([[1, 3], [1.9, 2.1], [2, 2]]).sL === 0);
  const ac = VAL.accuracy([99.8, 100.2, 99.5, 100.4, 99.9, 100.1], 100);
  near('recovery', ac.recovery, 99.9833, 0.0001);
  near('bias t', ac.t, -0.128, 0.001);
  near('Horwitz 1 ppm', VAL.horwitz(1e-6), 16.0, 0.01);
  near('Horwitz 1 %', VAL.horwitz(0.01), 4.0, 0.01);
  near('Horwitz (Thompson) 100 %', VAL.horwitz(1), 1, 1e-12);
  near('Horwitz cap', VAL.horwitz(1e-9), 22, 0);
}
{
  // Colligative: 10.0 g glucose in 200 g water; sulfur in benzene (S8); albumin by osmometry.
  const m = COL.molality(10, 180.156, 200);
  near('glucose molality', m, 0.27754, 0.00001);
  near('ΔTf', COL.deltaT(1, 1.86, m), 0.5162, 0.0001);
  near('ΔTb', COL.deltaT(1, 0.512, m), 0.1421, 0.0001);
  near('S8 from benzene', COL.molarMassFromDT(1, 5.12, 1, 50, 0.4), 256, 1e-9);
  near('albumin by osmotic pressure', COL.molarMassFromOsmotic(10, 0.00373, 298.15), 66460, 1);
  near('Raoult vapour pressure', COL.raoult(10, 180.156, 200, 18.015, 3.169).P, 3.1532, 0.0001);
  near('saline osmotic pressure (bar)', COL.osmotic(2, 9 / 58.44, 310.15), 7.943, 0.001);
  check('every solvent has Kf or Kb', COL.SOLVENTS.every((s) => (s.Kf ?? s.Kb) > 0 && s.M > 0));
}
{
  // Equilibrium: Chang's HI example; acetic acid pH 2.88; AgCl common ion; extreme K stays exact; Kp ↔ Kc.
  let t = EQL.parseReaction('H2(g) + I2(g) ⇌ 2HI(g)');
  let r = EQL.solveIce(t, [0.5, 0.5, 0], 54.3);
  near('HI: [H2]', r.eq[0], 0.1067, 0.0001);
  near('HI: [HI]', r.eq[2], 0.7865, 0.0001);
  check('HI goes forward', r.direction === 'forward');
  t = EQL.parseReaction('CH3COOH(aq) ⇌ H^+(aq) + CH3COO^-(aq)');
  near('acetic acid pH', -Math.log10(EQL.solveIce(t, [0.1, 0, 0], 1.8e-5).eq[1]), 2.875, 0.001);
  t = EQL.parseReaction('AgCl(s) ⇌ Ag^+(aq) + Cl^-(aq)');
  check('solid is not in K', !t[0].active && t[1].active);
  near('AgCl solubility in 0.10 M Cl-', EQL.solveIce(t, [0, 0, 0.1], 1.8e-10).eq[1], 1.8e-9, 1e-12);
  t = EQL.parseReaction('N2(g) + O2(g) = 2NO(g)');
  const tiny = EQL.solveIce(t, [0.8, 0.2, 0], 1e-30), huge = EQL.solveIce(t, [0.8, 0.2, 0], 1e30);
  near('K 1e-30 recovered', Math.log10(EQL.quotient(t, tiny.eq)), -30, 1e-9);
  near('K 1e30 recovered', Math.log10(EQL.quotient(t, huge.eq)), 30, 1e-9);
  const back = EQL.solveIce(t, [0, 0, 0.5], 4.1e-4);
  check('products only goes in reverse', back.direction === 'reverse' && Math.abs(EQL.quotient(t, back.eq) / 4.1e-4 - 1) < 1e-9);
  t = EQL.parseReaction('N2O4(g) ⇌ 2NO2(g)');
  near('N2O4: [NO2]', EQL.solveIce(t, [0.05, 0], 4.63e-3).eq[1], 0.014102, 0.000001);
  near('Kp from Kc (Δn = 1)', EQL.kpFromKc(4.63e-3, 298.15, EQL.deltaNGas(t)), 0.11478, 0.00001);
  near('Kc ↔ Kp round trip', EQL.kcFromKp(EQL.kpFromKc(0.5, 700, -2), 700, -2), 0.5, 1e-12);
  near('van \'t Hoff: same T keeps K', EQL.kAtT(2, 300, 300, 5e4), 2, 1e-12);
  check('endothermic K rises with T', EQL.kAtT(1, 300, 350, 5e4) > 1 && EQL.kAtT(1, 300, 350, -5e4) < 1);
  t = EQL.parseReaction('CaCO3(s) ⇌ CaO(s) + CO2(g)');
  near('decomposition: CO2 equals K', EQL.solveIce(t, [0, 0, 0], 1.16).eq[2], 1.16, 1e-9);
  check('coefficients and fractions read', EQL.parseReaction('1/2 N2(g) + 3/2 H2(g) -> NH3(g)')[1].coef === 1.5);
  check('bad reaction explained', (() => { try { EQL.parseReaction('H2 + I2'); return false; } catch { return true; } })());
}
{
  // Cyclic voltammetry: Randles–Sevcik constant 2.69 × 10^5 at 25 °C; a simulated reversible couple reproduces it.
  near('Randles–Sevcik constant', CV.rsConstant(), 2.6865e5, 50);
  near('ip for 1 mM, 3 mm disc, D 1e-5, 100 mV/s (µA)', CV.randlesSevcik(1, 0.0707, 1e-5, 1e-3, 0.1) * 1e6, 18.993, 0.005);
  near('D back from ip', CV.diffusionFromPeak(CV.randlesSevcik(2, 0.03, 7e-6, 5e-3, 0.05), 2, 0.03, 5e-3, 0.05), 7e-6, 1e-15);
  near('C back from ip', CV.concFromPeak(CV.randlesSevcik(1, 0.03, 7e-6, 5e-3, 0.05), 1, 0.03, 7e-6, 0.05), 5e-3, 1e-15);
  near('reversible ΔEp at 25 °C (mV)', CV.reversibleDeltaEp() * 1000, 56.99, 0.01);
  const sim = CV.simulateCV({ E0: 0.2, Ei: -0.1, Es: 0.5, v: 0.1, A: 0.0707, C: 1e-3, D: 1e-5 });
  const a = CV.analyseCV(sim.E, sim.I);
  near('simulated peak matches Randles–Sevcik', a.forward.I / CV.randlesSevcik(1, 0.0707, 1e-5, 1e-3, 0.1), 1, 0.01);
  near('simulated ΔEp (mV)', a.dEp * 1000, 58, 1.5);
  near('simulated E½ = E°', a.Ehalf, 0.2, 0.001);
  near('Nicholson ratio about 1', a.ratio, 1, 0.03);
  const rev = sim.E.map((e) => -e), cath = CV.analyseCV(rev, sim.I.map((i) => -i));
  check('cathodic-first sweep found', cath.firstAnodic === false && Math.abs(cath.forward.E + 0.229) < 0.003);
  const v = [0.025, 0.05, 0.1, 0.2, 0.4], st = CV.scanRateStudy(v, v.map((x) => CV.randlesSevcik(1, 0.0707, 1e-5, 1e-3, x)), 1, 0.0707, 1e-3);
  near('scan-rate D', st.D, 1e-5, 1e-12);
  near('log-log slope 0.5', st.logFit.slope, 0.5, 1e-9);
}
{
  // TLC: Rf from distances or pixel rows (y grows downward in photos); lanes; column volumes.
  near('Rf from mm', TLC.rf(18, 0, 52), 0.3462, 0.0001);
  near('Rf from photo rows', TLC.rf(387.2, 560, 80), 0.36, 1e-9);
  near('column volumes', TLC.columnVolumes(0.25), 4, 1e-12);
  near('ΔCV', TLC.separation(0.36, 0.58).dCV, 1.0536, 0.0001);
  check('lanes grouped by x', TLC.lanes([130, 240, 242, 350, 352, 348], 480).join() === '0,1,1,2,2,2');
  check('Rf advice', TLC.rfAdvice(0.05).level === 'warn' && TLC.rfAdvice(0.3).text === 'good for a flash column' && TLC.rfAdvice(1.2).level === 'bad');
}
{
  // Hückel: textbook values (Streitwieser; Atkins): butadiene, benzene, naphthalene, allyl, cyclobutadiene, fulvene.
  const P = (id) => { const p = HMO.PRESETS.find((x) => x.id === id); return HMO.solve(HMO.build(p.n, p.bonds, p.types), p.charge); };
  const bd = P('butadiene');
  check('butadiene x', bd.orbitals.map((o) => o.x.toFixed(3)).join() === '1.618,0.618,-0.618,-1.618');
  near('butadiene DE', bd.delocalisation, 0.472, 0.001);
  near('butadiene p12', bd.bondOrders[0].p, 0.894, 0.001);
  near('butadiene p23', bd.bondOrders[1].p, 0.447, 0.001);
  near('butadiene free valence C1', bd.freeValence[0], 0.838, 0.001);
  near('butadiene ψ1 c1', bd.orbitals[0].c[0], 0.3717, 0.0001);
  near('benzene Eπ', P('benzene').xTotal, 8, 1e-9);
  near('benzene DE', P('benzene').delocalisation, 2, 1e-9);
  near('naphthalene DE', P('naphthalene').delocalisation, 3.683, 0.001);
  near('naphthalene p12', P('naphthalene').bondOrders[0].p, 0.725, 0.001);
  near('allyl anion DE', P('allyl-').delocalisation, 0.828, 0.001);
  near('allyl cation end charge', P('allyl+').charges[0], 0.5, 1e-9);
  near('cyclopentadienyl anion DE', P('cp-').delocalisation, 2.472, 0.001);
  near('tropylium DE', P('tropylium').delocalisation, 2.988, 0.001);
  const cb = P('cyclobutadiene');
  check('cyclobutadiene: degenerate pair half filled', Math.abs(cb.orbitals[1].x) < 1e-9 && cb.orbitals[1].occ === 1 && cb.orbitals[2].occ === 1 && Math.abs(cb.delocalisation) < 1e-9);
  check('fulvene levels', P('fulvene').orbitals.map((o) => o.x.toFixed(3)).join() === '2.115,1.000,0.618,-0.254,-1.618,-1.861');
  near('formaldehyde HOMO (h 1, k 1)', P('formaldehyde').orbitals[0].x, 1.618, 0.001);
  check('pyridine: 2- and 4-positions electron poor', P('pyridine').charges[0] < 0 && P('pyridine').charges[1] > 0 && P('pyridine').charges[3] > 0);
  check('jacobi diagonalises', (() => { const j = HMO.jacobi([[2, 1], [1, 2]]); return j.values.map((x) => Math.round(x)).sort().join() === '1,3'; })());
  check('bonds parsed', HMO.parseBonds('1-2, 2–3 3=4').length === 3);
  check('too many electrons refused', (() => { try { HMO.solve(HMO.build(2, [[0, 1]]), -3); return false; } catch { return true; } })());
}
{
  // Crystal field: textbook octahedral CFSE and spin states, square planar d8, Δ from Ti(H2O)6 3+ at 493 nm.
  const oh = CFT.GEOMETRIES.find((g) => g.id === 'oh'), sp = CFT.GEOMETRIES.find((g) => g.id === 'sp'), td = CFT.GEOMETRIES.find((g) => g.id === 'td');
  check('every geometry has its barycentre at 0', CFT.GEOMETRIES.every((g) => Math.abs(g.levels.reduce((s, l) => s + l.e, 0)) < 1e-9));
  const hs = [0, -0.4, -0.8, -1.2, -0.6, 0, -0.4, -0.8, -1.2, -0.6, 0], ls = [0, -0.4, -0.8, -1.2, -1.6, -2.0, -2.4, -1.8, -1.2, -0.6, 0];
  check('octahedral high-spin CFSE d0–d10', hs.every((c, d) => Math.abs(CFT.spinStates(oh.levels, d, 1, 100)[0].cfse - c) < 1e-9));
  check('octahedral low-spin CFSE d0–d10', ls.every((c, d) => Math.abs(CFT.spinStates(oh.levels, d, 100, 1)[0].cfse - c) < 1e-9));
  const fe = CFT.spinStates(oh.levels, 6, 10400, 17600)[0], fecn = CFT.spinStates(oh.levels, 6, 33000, 17600)[0];
  check('Fe(H2O)6 2+ high spin, 4 unpaired', fe.unpaired === 4 && CFT.configLabel(oh, fe.occ) === 't2g⁴ eg²');
  check('Fe(CN)6 4- low spin, diamagnetic', fecn.unpaired === 0 && CFT.configLabel(oh, fecn.occ) === 't2g⁶ eg⁰');
  near('spin-only μ for 4 unpaired', CFT.spinOnly(4), 4.899, 0.001);
  check('square planar d8 diamagnetic', CFT.spinStates(sp.levels, 8, 20000, 15000)[0].unpaired === 0);
  check('tetrahedral d5 high spin', CFT.spinStates(td.levels, 5, 4000, 15000)[0].unpaired === 5);
  check('d counts', CFT.dCount('Fe', 2) === 6 && CFT.dCount('Cu', 2) === 9 && CFT.dCount('Pt', 2) === 8 && CFT.dCount('Ti', 3) === 1);
  check('impossible oxidation state refused', (() => { try { CFT.dCount('Sc', 5); return false; } catch { return true; } })());
  check('Jahn–Teller: Cu2+ strong, Cr3+ none, LS Co3+ none, HS Fe2+ weak', CFT.jahnTeller([2, 2, 2, 2, 1]) === 'strong' && CFT.jahnTeller([1, 1, 1, 0, 0]) === 'none' && CFT.jahnTeller([2, 2, 2, 0, 0]) === 'none' && CFT.jahnTeller(fe.occ) === 'weak');
  near('Ti(H2O)6 3+ Δo (cm-1)', CFT.deltaFromNm(493), 20284, 1);
  near('in kJ/mol', CFT.deltaFromNm(493) * CFT.CM_TO_KJ, 242.6, 0.1);
}
{
  // Diatomics (Huber–Herzberg constants): bond lengths from Be reproduce re; HCl fundamental, lines and isotope shift.
  const mass = (s) => CHEM.monoMass(CHEM.parseFormula(`[${s}]`));
  for (const m of DIA.MOLECULES) near(`${m.id} r from Be`, DIA.bondLength(m.k.Be, DIA.reducedMass(mass(m.atoms[0]), mass(m.atoms[1]))), m.k.re, 0.0015);
  const hcl = DIA.MOLECULES.find((m) => m.id === 'HCl').k, mu = DIA.reducedMass(mass('1H'), mass('35Cl'));
  near('HCl μ', mu, 0.97959, 0.00001);
  near('HCl fundamental', DIA.G(hcl, 1) - DIA.G(hcl, 0), 2885.31, 0.01);
  near('HCl force constant (N/m)', DIA.morse(hcl, mu).kf, 516.3, 0.2);
  const L = DIA.rovibLines(hcl, 298);
  near('HCl R(0)', L.find((l) => l.branch === 'R' && l.J === 0).nu, 2905.57, 0.02);
  near('HCl P(1)', L.find((l) => l.branch === 'P' && l.J === 1).nu, 2864.43, 0.02);
  check('HCl strongest lines from J = 3', DIA.jMax(hcl.Be, 298) === 3);
  const dcl = DIA.isotopeScale(hcl, mu, DIA.reducedMass(mass('2H'), mass('35Cl')));
  near('DCl fundamental', DIA.G(dcl, 1) - DIA.G(dcl, 0), 2090.8, 0.1);
  near('CO first rotational line (GHz)', (DIA.F(DIA.MOLECULES.find((m) => m.id === 'CO').k, 0, 1)) * 29.9792458, 115.27, 0.05);
  const f = DIA.fitAnharmonic([1, 2, 3, 4], [2885.9, 5668.0, 8346.8, 10923.1]);
  near('fit ωe', f.we, 2989.22, 0.01);
  near('fit ωexe', f.wexe, 51.71, 0.01);
  const exact = DIA.fitAnharmonic([1, 2, 3], [1, 2, 3].map((v) => DIA.G(hcl, v) - DIA.G(hcl, 0)));
  near('fit recovers ωe exactly', exact.we, 2990.95, 1e-6);
  near('Morse V at re is 0', DIA.morseV(100, 2, 1.2, 1.2), 0, 1e-12);
}
{
  // Thermochemistry: every table entry obeys ΔfG = ΔfH − TΔfS; methane combustion and limestone (textbook values).
  for (const t of THM.TABLE) {
    let sEl = 0; for (const [e, n] of CHEM.byElement(CHEM.parseFormula(t.f))) sEl += n * THM.ELEMENT_S[e];
    near(`${t.f}(${t.phase}) ΔfG consistent`, t.H - (298.15 * (t.S - sEl)) / 1000, t.G, t.f === 'C6H12O6' ? 1.5 : 0.6);
  }
  const L = (f, p) => THM.lookup(f, p);
  const sp = (pairs) => pairs.map(([nu, f, p]) => ({ nu, ...L(f, p) }));
  const ch4 = THM.reaction(sp([[-1, 'CH4', 'g'], [-2, 'O2', 'g'], [1, 'CO2', 'g'], [2, 'H2O', 'l']]));
  near('CH4 combustion ΔH', ch4.dH, -890.57, 1e-9);
  near('CH4 combustion ΔS', ch4.dS, -242.91, 1e-9);
  near('CH4 combustion ΔG', ch4.dG, -818.15, 1e-9);
  check('CH4 ΔG from ΔfG', ch4.fromG);
  const lime = THM.reaction(sp([[-1, 'CaCO3', 's'], [1, 'CaO', 's'], [1, 'CO2', 'g']]));
  near('CaCO3 ΔH', lime.dH, 179.19, 1e-9);
  near('CaCO3 turnover (K)', THM.crossover(lime.dH, lime.dS), 1118.6, 0.2);
  check('no turnover when ΔH < 0, ΔS > 0', THM.crossover(-10, 5) === null);
  near('ln K from ΔG', THM.lnK(-5.708, 298.15), 2.3027, 0.001);
  check('water lookup by phase', L('H2O', 'g').H === -241.83 && L('H2O', 'l').H === -285.83 && L('H2O') !== undefined && L('XeF4') === undefined);
  const nogG = THM.reaction([{ nu: -1, H: 0, S: 100 }, { nu: 1, H: -50, S: 120 }]);
  check('ΔG from ΔH − TΔS when a ΔfG is missing', !nogG.fromG && Math.abs(nogG.dG - (-50 - 298.15 * 20 / 1000)) < 1e-12);
}
{
  // Nernst: every half-reaction balances atoms and charge; Daniell cell; oxygen electrode in air at pH 7; references.
  for (const h of NST.HALVES) {
    const bal = new Map(); let q = -h.n;
    for (const [c, f] of h.ox) { const fo = CHEM.parseFormula(f); q += c * fo.charge; for (const [e, k] of CHEM.byElement(fo)) bal.set(e, (bal.get(e) ?? 0) + c * k); }
    for (const [c, f] of h.red) { const fo = CHEM.parseFormula(f); q -= c * fo.charge; for (const [e, k] of CHEM.byElement(fo)) bal.set(e, (bal.get(e) ?? 0) - c * k); }
    check(`${h.id} half-reaction balanced`, q === 0 && [...bal.values()].every((v) => v === 0));
  }
  check('table in order of E°', NST.HALVES.every((h, i) => i === 0 || NST.HALVES[i - 1].E >= h.E));
  const zn = NST.half('Zn'), cu = NST.half('Cu2'), st = NST.cellStandard(cu.E, zn.E, 2);
  near('Daniell E°', st.E0, 1.1037, 1e-12);
  near('Daniell ΔG° (kJ/mol)', st.dG0, -212.98, 0.01);
  near('Daniell log K', st.lnK / Math.LN10, 37.31, 0.01);
  near('Daniell with 0.01 M Cu2+', NST.halfE(cu, { 'Cu^2+': 0.01 }) - NST.halfE(zn, { 'Zn^2+': 1 }), 1.0445, 0.0001);
  near('Nernst slope 59.16 mV', NST.thermalV(298.15) * Math.LN10 * 1000, 59.159, 0.001);
  near('O2 electrode, pH 7, air', NST.halfE(NST.half('O2acid'), { 'H^+': 1e-7, O2: 0.21 }), 0.8049, 0.0001);
  const r = NST.cellReaction(NST.half('MnO4'), NST.half('Fe3'));
  check('permanganate + iron(II): n = 5, 5 Fe2+, 8 H+', r.n === 5 && r.reactants.find((x) => x.f === 'Fe^2+').nu === 5 && r.reactants.find((x) => x.f === 'H^+').nu === 8 && r.products.find((x) => x.f === 'H2O').nu === 4);
  const lead = NST.cellReaction(NST.half('PbO2'), NST.half('PbSO4'));
  check('lead-acid: 2 PbSO4 + 2 H2O, n = 2', lead.n === 2 && lead.products.find((x) => x.f === 'PbSO4').nu === 2 && lead.reactants.find((x) => x.f === 'SO4^2-').nu === 2);
  near('lead-acid E°', NST.half('PbO2').E - NST.half('PbSO4').E, 2.0501, 1e-9);
  const conc = NST.cellReaction(cu, cu);
  check('concentration cell cancels to nothing', conc.reactants.length === 0 && conc.products.length === 0);
  check('cell notation', NST.cellNotation(zn, cu, CHEM.pretty) === 'Zn(s) | Zn²⁺(aq) ‖ Cu²⁺(aq) | Cu(s)' && NST.cellNotation(NST.half('H2'), NST.half('AgCl'), CHEM.pretty) === 'Pt(s) | H₂(g) | H⁺(aq) ‖ Cl⁻(aq) | AgCl(s) | Ag(s)');
  near('SCE to Ag/AgCl', NST.convertRef(0.5, 'SCE', 'AgClsat'), 0.544, 1e-12);
  near('Ag/AgCl to RHE at pH 13', NST.convertRef(-1, 'AgClsat', 'RHE', 13), -1 + 0.197 + 0.76907, 0.0001);
}
{
  // Faraday's law: plating rates (Cu 26.5 µm/h at 2 A/dm², Ni 12.3 µm/h at 1 A/dm²), time and current round trips, gas volumes.
  const cu = FAR.sub('Cu'), ni = FAR.sub('Ni');
  near('Cu plating rate at 2 A/dm²', FAR.rate(0.02, cu), 26.46, 0.01);
  near('Ni plating rate at 1 A/dm²', FAR.rate(0.01, ni), 12.29, 0.01);
  const t = FAR.timeFor(25, 2, 100, ni, 0.95);
  near('Ni 25 µm at 2 A, 100 cm², 95 % (min)', t / 60, 64.23, 0.01);
  near('current round trip', FAR.currentFor(25, t, 100, ni, 0.95), 2, 1e-12);
  near('thickness round trip', FAR.thickness(FAR.mass(2, t, ni, 0.95), ni.rho, 100), 25, 1e-9);
  near('Ag: 1 A for 1 h deposits 4.025 g', FAR.mass(1, 3600, FAR.sub('Ag')), 4.0247, 0.0001);
  const h2 = FAR.moles(3600, 2);
  near('H2 from 1 A·h (mol)', h2, 0.018656, 1e-6);
  near('H2 at 0 °C, 1 atm (L)', FAR.gasVolume(h2, 273.15, 101.325), 0.4181, 0.0001);
  check('every metal has a density', FAR.SUBSTANCES.every((x) => x.gas || x.rho > 0));
}
{
  // Green metrics: esterification atom economy 83.0 %; toluene oxidation 87.1 %; addition reaction 100 %; mass metrics.
  const est = CHEM.balance(CHEM.parseEquation('CH3COOH + C2H5OH -> CH3COOC2H5 + H2O'));
  near('esterification atom economy', GRN.atomEconomy(est, 2), 83.02, 0.01);
  near('esterification carbon economy', GRN.carbonEconomy(est, 2), 100, 1e-9);
  near('toluene to benzoic acid', GRN.atomEconomy(CHEM.balance(CHEM.parseEquation('C6H5CH3 + O2 -> C6H5COOH + H2O')), 2), 87.14, 0.01);
  near('Diels–Alder addition is 100 %', GRN.atomEconomy(CHEM.balance(CHEM.parseEquation('C4H6 + C2H4 -> C6H10')), 2), 100, 1e-9);
  const o = GRN.parseOthers('sulfuric acid, 0.5\nsodium hydrogen carbonate, 2.5\nwater, 47.5\ndiethyl ether, 35.7 g\nmagnesium sulfate; 2\n\nnope');
  check('other materials parsed, water flagged, bad line reported', o.rows.length === 5 && o.rows[2].water && !o.rows[0].water && o.bad.length === 1 && o.bad[0] === 7);
  const m = GRN.metrics(est, 2, [6.0, 10.0], 7.04, o.rows);
  check('acetic acid limits', m.limiting === 0);
  near('yield', m.yieldPct, 79.97, 0.01);
  near('RME', m.rme, 44, 1e-9);
  near('E-factor', m.eFactor, 13.80, 0.01);
  near('E-factor without water', m.eFactorNoWater, 7.054, 0.001);
  near('PMI = E + 1', m.pmi, m.eFactor + 1, 1e-12);
}
{
  // Decay: F-18 2 h, time to 100 MBq; carrier-free C-14 62.4–62.7 mCi/mmol, tritium ~29 Ci/mmol, Tc-99m 5.27e6 Ci/g.
  const f18 = DEC.halfLifeS(109.77, 'min');
  near('F-18 370 MBq after 2 h', DEC.decay(370, 7200, f18), 173.43, 0.01);
  near('F-18 back-correction', DEC.decay(173.4272, -7200, f18), 370, 0.001);
  near('F-18 to 100 MBq (min)', DEC.timeTo(370, 100, f18) / 60, 207.19, 0.01);
  near('one half-life halves', DEC.decay(8, DEC.halfLifeS(8.0252, 'd'), DEC.halfLifeS(8.0252, 'd')), 4, 1e-12);
  near('C-14 molar activity (mCi/mmol)', DEC.specific(DEC.halfLifeS(5700, 'y'), 14).perMol / DEC.CI, 62.72, 0.02);
  near('C-14 per gram (Ci/g)', DEC.specific(DEC.halfLifeS(5700, 'y'), 14).perGram / DEC.CI, 4.48, 0.01);
  near('tritium molar activity (Ci/mmol)', DEC.specific(DEC.halfLifeS(12.32, 'y'), 3).perMol / DEC.CI / 1000, 29.02, 0.02);
  near('Tc-99m specific activity (Ci/g)', DEC.specific(DEC.halfLifeS(6.0067, 'h'), 99).perGram / DEC.CI / 1e6, 5.27, 0.01);
  check('nuclide ids unique and half-lives positive', new Set(DEC.NUCLIDES.map((n) => n.id)).size === DEC.NUCLIDES.length && DEC.NUCLIDES.every((n) => n.t > 0 && n.A > 0));
  near('mCi in Bq', DEC.ACT_UNITS.mCi, 3.7e7, 1e-6);
}
{
  // Polymer averages: textbook two-species mixtures; log-normal GPC trace (Mw 100k, Đ 2) recovered through a cubic calibration.
  const n = PMW.averagesFromNumbers([10000, 20000], [1, 1]);
  near('equal numbers Mn', n.Mn, 15000, 1e-9); near('equal numbers Mw', n.Mw, 16666.667, 0.001); near('equal numbers Mz', n.Mz, 18000, 1e-9);
  const w = PMW.averages([10000, 20000], [1, 1]);
  near('equal masses Mn', w.Mn, 13333.333, 0.001); near('equal masses Mw', w.Mw, 15000, 1e-9);
  check('monodisperse Đ = 1', Math.abs(PMW.averages([5e4], [3]).D - 1) < 1e-12);
  const fit = PMW.polyfit([1, 2, 3, 4, 5], [1, 4, 9, 16, 25], 2);
  near('polyfit exact quadratic', fit.f(6), 36, 1e-9); near('polyfit slope', fit.df(3), 6, 1e-9);
  const tr = PMW.exampleTrace(), t = tr.map((r) => r[0]), h = tr.map((r) => r[1]);
  const st = [1e6, 5e5, 2e5, 1e5, 5e4, 2e4, 1e4, 5e3, 2e3, 1e3].map((M) => [(10.5 - Math.log10(M)) / 0.3, Math.log10(M)]);
  const cal = PMW.polyfit(st.map((x) => x[0]), st.map((x) => x[1]), 3);
  const r = PMW.analyseTrace(t, h, cal.f, cal.df, 13.5, 26.5);
  near('GPC Mn (log-normal, 50,000)', r.Mn, 50000, 50);
  near('GPC Mw (100,000, tail cut)', r.Mw, 100000, 200);
  near('GPC Đ', r.D, 2, 0.005);
  near('GPC Mp = Mw/√Đ', r.Mp, 70711, 400);
}
{
  // Copolymerisation: Mayo–Lewis limits, azeotropes, exact recovery of r1/r2 by all three fits, Skeist mass balance.
  near('ideal r1 = r2 = 1 gives F1 = f1', COP.F1(0.3, 1, 1), 0.3, 1e-12);
  near('perfect alternation r1 = r2 = 0', COP.F1(0.2, 0, 0), 0.5, 1e-12);
  near('S/MMA F1 at f1 0.3', COP.F1(0.3, 0.52, 0.46), 0.37099, 0.00001);
  near('S/MMA azeotrope', COP.azeotrope(0.52, 0.46), 0.52941, 0.00001);
  near('S/AN azeotrope', COP.azeotrope(0.4, 0.04), 0.61538, 0.00001);
  check('no azeotrope for VC/VAc', COP.azeotrope(1.68, 0.23) === null);
  near('F1 = f1 at the azeotrope', COP.F1(0.5294117647, 0.52, 0.46), 0.5294117647, 1e-9);
  const f = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9], F = f.map((x) => COP.F1(x, 0.52, 0.46));
  const fr = COP.finemanRoss(f, F), kt = COP.kelenTudos(f, F), nl = COP.fitNLLS(f, F);
  near('Fineman–Ross exact r1', fr.r1, 0.52, 1e-9); near('Fineman–Ross exact r2', fr.r2, 0.46, 1e-9);
  near('Kelen–Tüdős exact r1', kt.r1, 0.52, 1e-9); near('Kelen–Tüdős exact r2', kt.r2, 0.46, 1e-9);
  near('NLLS exact r1', nl.r1, 0.52, 1e-6); near('NLLS exact r2', nl.r2, 0.46, 1e-6);
  const d = COP.drift(0.52, 0.46, 0.3, 0.9), last = d[d.length - 1];
  near('Skeist mass balance', last.Fbar * last.X + last.f1 * (1 - last.X), 0.3, 1e-9);
  near('S/MMA drift to 90 %: feed', last.f1, 0.115, 0.002);
  const san = COP.drift(0.4, 0.04, 0.3, 0.9), sl = san[san.length - 1];
  check('S/AN: styrene used up near 70 % conversion', sl.f1 < 0.005 && Math.abs(sl.X - 0.70) < 0.01);
  check('azeotropic feed does not drift', COP.drift(0.52, 0.46, 0.5294117647).every((p) => Math.abs(p.f1 - 0.5294117647) < 1e-6));
}
{
  // Glass transition: Fox, target solver, Gordon–Taylor (Simha–Boyer, Kwei), Flory–Fox.
  const K = 273.15;
  near('Fox MMA/BA 50:50', GT.fox([50, 50], [105 + K, -54 + K]) - K, 4.337, 0.001);
  near('Fox of one component', GT.fox([1], [300]), 300, 1e-9);
  near('Fox target 20 °C needs 60.0 % MMA', GT.foxTrade(20 + K, 105 + K, -54 + K, []).wA, 0.6004, 0.0001);
  near('Fox target with 2 % AA fixed', GT.foxTrade(20 + K, 105 + K, -54 + K, [{ w: 0.02, Tg: 106 + K }]).wA, 0.5803, 0.0001);
  check('Fox target out of reach is null', GT.foxTrade(120 + K, 105 + K, -54 + K, []) === null);
  near('GT with k = Tg1/Tg2 equals Fox', GT.gordonTaylor(0.3, 400, 250, 400 / 250), GT.fox([0.7, 0.3], [400, 250]), 1e-9);
  near('GT with k = 1 is the weight average', GT.gordonTaylor(0.3, 400, 250, 1), 0.7 * 400 + 0.3 * 250, 1e-9);
  near('sucrose + 5 % water (k 4.7)', GT.gordonTaylor(0.05, 62 + K, -137 + K, 4.7) - K, 22.54, 0.01);
  near('Simha–Boyer k sucrose/water', GT.simhaBoyer(1.58, 62 + K, 1, -137 + K), 3.889, 0.001);
  near('water for Tg 0 °C', GT.solveGT(K, 62 + K, -137 + K, 4.7), 0.0878, 0.0001);
  near('GT inverse round trip with Kwei q', GT.gordonTaylor(GT.solveGT(350, 420, 300, 0.8, 40), 420, 300, 0.8, 40), 350, 1e-6);
  near('mole fractions MMA/BA 50:50', GT.moleFractions([0.5, 0.5], [100.12, 128.17])[0], 0.5614, 0.0001);
  near('Flory–Fox PS at Mn 10 000', GT.floryFox(100, 1e5, 1e4), 90, 1e-9);
  check('all listed materials have Tg, density and M', GT.MATERIALS.every((m) => Number.isFinite(m.tg) && m.rho > 0.5 && m.M > 10));
}
{
  // Thermal analysis: simulated PET DSC and calcium oxalate monohydrate TGA recover the values they were built with.
  const d = TH.exampleDSC(), p = TH.prep(d.map((r) => r[0]), d.map((r) => -r[1] / 10));
  const g = TH.glassTransition(p, 60, 95, 1.5);
  near('DSC Tg midpoint', g.mid, 78, 0.1); near('DSC ΔCp', TH.deltaCp(g.step, 10), 0.4, 0.005);
  check('Tg onset < mid < end', g.onset < g.mid && g.mid < g.end && g.end - g.onset < 8);
  const c = TH.peak(p, 110, 165, 1.5), m = TH.peak(p, 225, 272, 1.5);
  near('cold crystallisation ΔH', TH.enthalpy(c.area, 10), -25, 0.1); near('cold crystallisation peak', c.Tpeak, 135, 0.3);
  near('melting ΔH', TH.enthalpy(m.area, 10), 40, 0.1); near('melting peak', m.Tpeak, 250, 0.3);
  check('melting onset before the peak', m.onset < 245 && m.onset > 238);
  near('PET crystallinity', TH.crystallinity(40, 25, 140), 0.10714, 0.00001);
  near('crystallinity in a 30 % filled sample', TH.crystallinity(28, 0, 140, 0.7), 0.2857, 0.0001);
  near('peak area of a triangle', TH.peak([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((T) => ({ T, y: Math.max(0, 3 - Math.abs(T - 6)) })), 0, 12, 1).area, 9, 1e-9);
  const t = TH.exampleTGA(), r = TH.tga(TH.prep(t.map((x) => x[0]), t.map((x) => x[1])), 5);
  check('TGA finds 3 steps', r.steps.length === 3);
  near('CaC2O4·H2O water loss', r.steps[0].loss, 12.33, 0.02); near('CO loss', r.steps[1].loss, 19.17, 0.02); near('CO2 loss', r.steps[2].loss, 30.12, 0.02);
  near('residue CaO', r.residue, 38.38, 0.02);
  near('DTG peaks', r.steps[2].Tpeak, 735, 1);
  check('fragments matched', ['H2O', 'CO', 'CO2'].every((f, i) => TH.matchFragment(r.steps[i].loss, 146.11)?.frag === f));
  check('no match for an odd loss', TH.matchFragment(4.4, 146.11, 0.3) === null);
}
{
  // Battery cycling: efficiency, retention, cycles to 80 %, and dQ/dV peaks of a two-plateau curve.
  const e = BAT.exampleCycles(), s = BAT.cycling(e.map((r) => r[0]), e.map((r) => r[1]), e.map((r) => r[2]), 'dc', 1);
  near('first-cycle efficiency', s.first.ce, 0.88, 0.0001);
  near('average CE after cycle 1', s.avgCE, 0.99913, 0.00002);
  near('retention at cycle 200', s.last.ret, 0.7892, 0.0001);
  near('cycles to 80 %', BAT.cyclesTo(s.rows, 0.8).n, 184, 0.5);
  check('extrapolated when not reached', BAT.cyclesTo(s.rows.slice(0, 100), 0.8).extrapolated === true);
  const lin = BAT.cycling([1, 2, 3, 4, 5, 6], [101, 100, 99, 98, 97, 96], [100, 99, 98, 97, 96, 95], 'dc', 1);
  near('straight-line fade 1 % per cycle', lin.fadePerCycle, 0.01, 1e-12);
  near('cycles to 80 % on a straight line', BAT.cyclesTo(lin.rows, 0.8).n, 21, 1e-9);
  near('irreversible capacity sum', lin.irrev, 6, 1e-12);
  const an = BAT.cycling([1, 2], [90, 95], [100, 96], 'cd', 1);
  near('anode CE = charge ÷ discharge', an.first.ce, 0.9, 1e-12);
  const c = BAT.exampleCurve(), pk = BAT.peaks(BAT.dqdv(c.map((r) => r[0]), c.map((r) => r[1])));
  check('two dQ/dV peaks', pk.length === 2);
  near('LiMn2O4 peak 1', pk[0].V, 4.0, 0.001); near('LiMn2O4 peak 2', pk[1].V, 4.14, 0.001);
  near('flat line has dQ/dV = slope', BAT.dqdv([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v) => 5 * v), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v) => 3 + v * 0.1), 0.01, 0.03)[20].d, 50, 1e-6);
}
{
  // Corrosion: ASTM G102 conversions, Tafel extrapolation, Wagner–Traud fit and Stern–Geary on a simulated curve.
  near('G102: 1 µA/cm² on iron', COR.rateMmY(1, 27.92, 7.87), 0.0116, 0.0001);
  near('G102 mass loss on iron', COR.massRate(1, 27.92), 0.25, 0.001);
  near('Stern–Geary B for 60/120 mV', COR.sternGeary(0.06, 0.12), 0.017372, 0.000001);
  near('Wagner–Traud is zero at Ecorr', COR.bv(-0.65, -0.65, 1e-5, 0.06, 0.12), 0, 1e-18);
  const e = COR.exampleCurve(), c = COR.signed(e.map((r) => r[0]), e.map((r) => r[1])), t = COR.tafel(c, 0.08, 0.2);
  near('Tafel Ecorr', t.Ecorr, -0.65, 0.0005); near('Tafel icorr', t.icorr, 1e-5, 2e-7);
  near('Tafel βa', t.ba, 0.06, 0.001); near('Tafel βc', t.bc, 0.12, 0.002);
  const nl = COR.fitBV(c, t.E0, t);
  near('fit icorr', nl.icorr, 1e-5, 1e-8); near('fit βa', nl.ba, 0.06, 0.0001); near('fit βc', nl.bc, 0.12, 0.0002);
  const rp = COR.polarisationResistance(c, t.E0);
  near('Stern–Geary icorr', COR.sternGeary(0.06, 0.12) / rp.Rp, 1e-5, 3e-7);
  const ab = COR.signed(e.map((r) => r[0]), e.map((r) => Math.abs(r[1])));
  near('unsigned currents: Ecorr from the minimum', COR.zeroCrossing(ab), -0.65, 0.001);
  near('coupon rate (G31 formula)', (8.76e4 * 0.05) / (20 * 168 * 7.87), 0.1656, 0.0001);
}
{
  // NMR impurities: approximate (rounded) values, parsing a journal-style list, matching and ranking.
  const at = (name, sol, nuc = 'h') => NMR.IMPURITIES.find((x) => x.name === name)[nuc][sol].map((x) => x[0]);
  check('ethyl acetate in CDCl3 about 2.05, 4.10, 1.25', JSON.stringify(at('ethyl acetate', 'CDCl3')) === '[2.05,4.1,1.25]');
  check('water in DMSO-d6 about 3.35, in CDCl3 1.55, in C6D6 0.40', at('water', 'DMSO')[0] === 3.35 && at('water', 'CDCl3')[0] === 1.55 && at('water', 'C6D6')[0] === 0.4);
  check('acetone in CDCl3 about 2.15, 13C 31', at('acetone', 'CDCl3')[0] === 2.15 && at('acetone', 'CDCl3', 'c').includes(31));
  check('dichloromethane in CDCl3 about 5.30, DMSO 5.75', at('dichloromethane', 'CDCl3')[0] === 5.3 && at('dichloromethane', 'DMSO')[0] === 5.75);
  check('every 1H value is on a 0.05 ppm step and every 13C on 0.5 ppm', NMR.IMPURITIES.every((x) => Object.values(x.h).flat().every(([d]) => Math.abs(d * 20 - Math.round(d * 20)) < 1e-9) && Object.values(x.c).flat().every(([d]) => Math.abs(d * 2 - Math.round(d * 2)) < 1e-9)));
  check('only proton-free impurities (CO2, CS2, CCl4) lack 1H data in CDCl3', NMR.IMPURITIES.filter((x) => !x.h.CDCl3).every((x) => !Object.keys(x.h).length && x.c.CDCl3));
  check('10 solvents with residual 1H', NMR.SOLVENTS.length === 10 && NMR.SOLVENTS.every((x) => x.h.length));
  check('parse a journal list', JSON.stringify(NMR.parsePeaks('δ 7.26 (d, J = 8.0 Hz, 2H), 3.80 (s, 3H)\n1.26 3H\n2.17\t1.00')) === '[7.26,3.8,1.26,2.17]');
  const m = NMR.match([7.26, 4.12, 2.05, 1.26, 1.56, 6.88], 'CDCl3', 'h', 0.05);
  check('ethyl acetate ranked first with 3 of 3', m.byImp[0].name === 'ethyl acetate' && m.byImp[0].found === 3);
  check('unmatched peak left for the compound', m.perPeak.find((p) => p.peak === 6.88).hits.every((h) => h.name === 'pyrrole') && NMR.match([3.8], 'CDCl3', 'h', 0.03).perPeak[0].hits.length === 0);
  check('residual solvent recognised', m.perPeak[0].hits.some((h) => h.solvent));
  check('13C residual CDCl3 matched at 0.5 ppm', NMR.match([77.16], 'CDCl3', 'c', 0.5).perPeak[0].hits.some((h) => h.solvent));
}
{
  // Electron counting: every textbook preset gives its known count; OS and dⁿ for classic cases.
  for (const p of EC.PRESETS) { const N = EC.METALS.find((m) => m[0] === p.m)[1]; check(`${p.name}: ${p.ve} electrons`, EC.count(N, p.q, p.items, p.mm).ve === p.ve); }
  const fc = EC.count(8, 0, [{ id: 'Cp', n: 2 }]); check('ferrocene Fe(II) d6', fc.os === 2 && fc.d === 6 && fc.lbn === 6);
  const co = EC.count(9, 3, [{ id: 'NH3', n: 6 }]); check('[Co(NH3)6]3+ Co(III) d6', co.os === 3 && co.d === 6);
  const pt = EC.count(10, -1, [{ id: 'Cl', n: 3 }, { id: 'alkene', n: 1 }]); check('Zeise Pt(II) d8', pt.os === 2 && pt.d === 8);
  const mn = EC.count(7, 0, [{ id: 'CO', n: 5 }], 1); check('Mn2(CO)10: M–M bond does not change OS', mn.os === 0 && mn.ve === 18);
  check('ionic and covalent counts agree', EC.PRESETS.every((p) => { const N = EC.METALS.find((m) => m[0] === p.m)[1], r = EC.count(N, p.q, p.items, p.mm); return r.d + 2 * (r.l + r.x) + r.mm === r.ve; }));
  check('roman numerals', EC.roman(4) === 'IV' && EC.roman(7) === 'VII' && EC.roman(0) === '0' && EC.roman(-1) === '−I');
  check('square-planar d8 verdict', /square-planar/.test(EC.verdict(16, 8, 4)));
}
{
  // Binary phase diagrams (ideal): lens limits and ordering, eutectics against experiment, lever rule, unit conversion.
  const S = Object.fromEntries(PH.SYSTEMS.map((s) => [s.id, s])), c = S.CuNi, K = 273.15;
  const l = PH.lens(c.A.Tm, c.A.H, c.B.Tm, c.B.H, 1500);
  check('lens: solid richer in the higher-melting Ni', l.xS > l.xL);
  const t = PH.lensTemps(c.A.Tm, c.A.H, c.B.Tm, c.B.H, 0.35);
  check('liquidus above solidus', t.liq > t.sol && t.sol > c.A.Tm && t.liq < c.B.Tm);
  near('liquid on the liquidus has the overall composition', PH.lens(c.A.Tm, c.A.H, c.B.Tm, c.B.H, t.liq).xL, 0.35, 1e-6);
  const x = PH.toMole(0.35, c.A.M, c.B.M), st = PH.lensState(c.A.Tm, c.A.H, c.B.Tm, c.B.H, x, 1225 + K);
  near('Cu–Ni 35 wt %: liquidus', st.liq - K, 1237.06, 0.01); near('Cu–Ni 35 wt %: solidus', st.sol - K, 1211.35, 0.01);
  near('Cu–Ni liquid wt % Ni at 1225 °C', 100 * PH.toMass(st.phases[0].x, c.A.M, c.B.M), 31.93, 0.01);
  near('Cu–Ni solid wt % Ni at 1225 °C', 100 * PH.toMass(st.phases[1].x, c.A.M, c.B.M), 38.69, 0.01);
  near('mole fractions of phases add up', st.phases[0].f + st.phases[1].f, 1, 1e-12);
  near('mass ↔ mole round trip', PH.toMass(PH.toMole(0.42, 63.5, 58.7), 63.5, 58.7), 0.42, 1e-12);
  near('Callister lever rule: liquid', 1 - PH.lever(35, 31.5, 42.5), 0.682, 0.001);
  const z = S.BzNp, ez = PH.eutectic(z.A.Tm, z.A.H, z.B.Tm, z.B.H);
  near('benzene–naphthalene eutectic (exp. −3.5 °C)', ez.T - K, -3.5, 0.2);
  near('eutectic lies on both liquidus curves', PH.liqA(z.A.Tm, z.A.H, ez.T), ez.x, 1e-9);
  const b = S.BiCd, eb = PH.eutectic(b.A.Tm, b.A.H, b.B.Tm, b.B.H);
  near('Bi–Cd eutectic T (ideal 135.3 °C)', eb.T - K, 135.31, 0.01); near('Bi–Cd eutectic wt % Cd', 100 * PH.toMass(eb.x, b.A.M, b.B.M), 41.09, 0.01);
  const zs = PH.eutecticState(z.A.Tm, z.A.H, z.B.Tm, z.B.H, 0.5, 25 + K);
  check('Bz–Np 50 % at 25 °C: liquid + solid naphthalene', zs.phases.length === 2 && zs.phases[1].name === 'solid B' && Math.abs(zs.phases[0].x - 0.3015) < 0.0005);
  check('below the eutectic: two pure solids', PH.eutecticState(z.A.Tm, z.A.H, z.B.Tm, z.B.H, 0.5, 250).phases.every((p) => p.name.startsWith('solid')));
  check('above the liquidus: all liquid', PH.eutecticState(z.A.Tm, z.A.H, z.B.Tm, z.B.H, 0.5, 330).phases.length === 1);
}
console.log(`sci: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
