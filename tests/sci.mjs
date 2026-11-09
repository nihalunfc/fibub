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
import * as IR from '../src/lib/sci/irbands.ts';
import * as PG from '../src/lib/sci/pointgroup.ts';
import * as EIS from '../src/lib/sci/eis.ts';
import * as ENZ from '../src/lib/sci/enzyme.ts';
import * as BUF from '../src/lib/sci/buffer.ts';
import * as BND from '../src/lib/sci/binding.ts';
import * as CEN from '../src/lib/sci/centrifuge.ts';
import * as AQ from '../src/lib/sci/aqi.ts';
import * as ALT from '../src/lib/sci/altermagnet.ts';
import * as PL from '../src/lib/sci/plume.ts';
import * as MT from '../src/lib/sci/mccabe.ts';
import * as VL from '../src/lib/sci/vle.ts';
import * as GC from '../src/lib/sci/geochron.ts';
import * as DL from '../src/lib/sci/delta.ts';
import * as MX from '../src/lib/sci/mixing.ts';
import * as TER from '../src/lib/sci/ternary.ts';
import * as PIP from '../src/lib/sci/piper.ts';
import * as PT from '../src/lib/sci/pumptest.ts';
import * as SLG from '../src/lib/sci/slug.ts';
import * as DAR from '../src/lib/sci/darcy.ts';
import * as WF from '../src/lib/sci/wellfield.ts';
import * as GTN from '../src/lib/sci/gradetonnage.ts';
import * as DH from '../src/lib/sci/drillhole.ts';
import * as TRV from '../src/lib/sci/traverse.ts';
import * as LVL from '../src/lib/sci/levelling.ts';
import * as GPS from '../src/lib/sci/gpstrack.ts';
import * as TIF from '../src/lib/sci/tiff.ts';
import * as SPX from '../src/lib/sci/spectral.ts';
import * as SND from '../src/lib/sci/sounding.ts';
import * as KOP from '../src/lib/sci/koppen.ts';
import * as TRD from '../src/lib/sci/trend.ts';
import * as WAV from '../src/lib/sci/waves.ts';
import * as OCH from '../src/lib/sci/openchannel.ts';
import * as RO from '../src/lib/sci/runoff.ts';
import * as FF from '../src/lib/sci/floodfreq.ts';
import * as ET from '../src/lib/sci/et0.ts';
import * as RC from '../src/lib/sci/rating.ts';
import * as AMB from '../src/lib/sci/amband.ts';
import * as AHE from '../src/lib/sci/ahe.ts';
import * as SSC from '../src/lib/sci/sscond.ts';
import * as AMG from '../src/lib/sci/amagnon.ts';
import * as UH from '../src/lib/sci/uh.ts';
import * as THS from '../src/lib/sci/thiessen.ts';
import * as PRB from '../src/lib/sci/probit.ts';
import * as SSD from '../src/lib/sci/ssd.ts';
import * as NDS from '../src/lib/sci/censored.ts';

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
{
  // IR bands: table sanity, group rules, parsing, peak picking on the simulated ester.
  check('every band has lo < hi inside 400–4000', IR.BANDS.every((b) => b.lo < b.hi && b.lo >= 400 && b.hi <= 4000));
  check('band ids unique', new Set(IR.BANDS.map((b) => b.id)).size === IR.BANDS.length);
  check('every group rule names real bands', IR.GROUPS.every((g) => [...g.need, ...(g.not ?? [])].flat().every((id) => IR.BANDS.some((b) => b.id === id))));
  check('parse a characterisation line', JSON.stringify(IR.parseIR('3350 (br, s), 2960, 1715 (s)\n3300–2500 br; 45.2')) === JSON.stringify([{ x: 3350, broad: true }, { x: 2960, broad: false }, { x: 1715, broad: false }, { x: 2900, broad: true }]));
  const likely = (t) => IR.assign(IR.parseIR(t)).groups.filter((g) => g.likely).map((g) => g.name);
  check('carboxylic acid', likely('3300-2500 br, 1710, 1290').includes('Carboxylic acid'));
  check('sharp C–H does not count as acid O–H', !likely('2820, 2720, 1730, 2950').includes('Carboxylic acid') && likely('2820, 2720, 1730').includes('Aldehyde'));
  check('ketone', JSON.stringify(likely('2960, 1715, 1360').sort()) === JSON.stringify(['Alkyl chain', 'Ketone']));
  check('ester rules out ketone and ether', JSON.stringify(likely('2984, 2940, 1742, 1447, 1373, 1240, 1047').sort()) === JSON.stringify(['Alkyl chain', 'Ester']));
  check('amide', likely('3300, 1650, 1550').includes('Amide'));
  check('nitrile', likely('2250, 2950').includes('Nitrile'));
  check('toluene is aromatic, not nitro', likely('3030, 1600, 1500, 730, 2920, 1460, 1380').includes('Aromatic ring') && !likely('3030, 1600, 1500, 730, 2920, 1460, 1380').includes('Nitro'));
  const s = IR.exampleSpectrum(), pk = IR.pickPeaks(s.x, s.y, true, 0.05);
  check('example spectrum: 9 peaks found within 4 cm⁻¹', pk.length === 9 && [2984, 2940, 1742, 1447, 1373, 1240, 1047, 938, 847].every((c, i) => Math.abs(pk[i].x - c) <= 4));
  near('cm⁻¹ to µm', IR.toMicron(1715), 5.8309, 0.0001);
  near('%T ↔ A', IR.toAbsorbance(IR.toTransmittance(0.5)), 0.5, 1e-12);
}
{
  // Point groups: every example, also turned, moved and with ±0.02 Å noise; orders, chirality, polarity, flowchart.
  for (const e of PG.EXAMPLES) check(`${e.id}: ${e.group}`, PG.findPointGroup(e.atoms()).group === e.group);
  let seed = 11; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647 - 0.5; };
  const u = [0.3, 0.5, 0.81].map((x) => x / Math.hypot(0.3, 0.5, 0.81));
  check('all examples survive rotation, translation and noise', PG.EXAMPLES.every((e) => PG.findPointGroup(e.atoms().map((a) => ({ el: a.el, p: PG.rotate(a.p, u, 1.234).map((x) => x + 3 + 0.04 * rnd()) }))).group === e.group));
  const w = PG.EXAMPLES[0].atoms(); w[1].p = [w[1].p[0] + 0.3, w[1].p[1], w[1].p[2]];
  check('distorted water drops to Cs', PG.findPointGroup(w).group === 'Cs');
  check('group orders', PG.orderOf('D3h') === 12 && PG.orderOf('C2v') === 4 && PG.orderOf('Td') === 24 && PG.orderOf('Oh') === 48 && PG.orderOf('S4') === 4 && PG.orderOf('C3h') === 6 && PG.orderOf('D∞h') === null);
  check('chiral groups', PG.isChiral('C2') && PG.isChiral('C1') && PG.isChiral('D3') && !PG.isChiral('Cs') && !PG.isChiral('S4') && !PG.isChiral('D2d'));
  check('polar groups', PG.isPolar('C2v') && PG.isPolar('C∞v') && PG.isPolar('Cs') && !PG.isPolar('D3h') && !PG.isPolar('C2h') && !PG.isPolar('Td'));
  const F = (o) => PG.flowchart({ linear: false, inversion: false, cubic: 'none', n: 1, perpC2: false, sigmaH: false, sigmaV: false, s2n: false, mirror: false, ...o });
  check('flowchart', F({ n: 3, perpC2: true, sigmaH: true }) === 'D3h' && F({ n: 2, sigmaV: true }) === 'C2v' && F({ n: 2, s2n: true }) === 'S4' && F({ n: 3, perpC2: true, sigmaV: true }) === 'D3d' && F({ mirror: true }) === 'Cs' && F({}) === 'C1' && F({ cubic: 'T', mirror: true }) === 'Td' && F({ linear: true, inversion: true }) === 'D∞h');
  const px = PG.parseXYZ('3\nwater from a file\nO 0 0 0\nH 0.757 0.586 0\nh -0.757 0.586 0');
  check('read an .xyz file', px.atoms.length === 3 && px.bad.length === 0 && px.atoms[2].el === 'H');
  check('bad line reported', PG.parseXYZ('O 0 0 0\nH 1 2').bad.length === 1);
  check('subscripts', PG.pretty('D3h') === 'D₃h' && PG.pretty('C2v') === 'C₂v' && PG.pretty('Td') === 'Td' && PG.pretty('D∞h') === 'D∞h');
}
{
  // Impedance: element formulas, exact recovery for every circuit, the simulated Randles cell, sign handling.
  const z = EIS.zQ(2 * Math.PI * 1000, 1e-6, 1); near('CPE with α = 1 is a capacitor', z[1], -1 / (2 * Math.PI * 1000 * 1e-6), 1e-9);
  near('Warburg: equal real and imaginary parts', EIS.zW(4, 10)[0] + EIS.zW(4, 10)[1], 0, 1e-12);
  const truths = { RC: [15, 200, 1e-5], RQ: [15, 200, 1e-5, 0.85], Randles: [20, 100, 2e-5, 0.9, 30], RQRQ: [10, 50, 1e-6, 0.95, 300, 1e-4, 0.8], 'RQ-blocking': [12, 5e-5, 0.92] };
  for (const m of EIS.MODELS) {
    const t = truths[m.id], pts = Array.from({ length: 41 }, (_, k) => { const f = 10 ** (5 - (k * 7) / 40), zz = m.z(2 * Math.PI * f, t); return { f, re: zz[0], im: zz[1] }; });
    const r = EIS.fitEIS(m, pts); check(`${m.code}: exact values recovered`, r.p.every((v, i) => Math.abs(v / t[i] - 1) < 1e-6) && !r.runaway);
  }
  const ex = EIS.exampleData(), rd = EIS.fitEIS(EIS.MODELS.find((m) => m.id === 'Randles'), ex);
  near('example Rs', rd.p[0], 20, 0.1); near('example Rct', rd.p[1], 100, 0.3); near('example α', rd.p[3], 0.9, 0.002); near('example σ', rd.p[4], 30, 0.1);
  check('example: rms error under 0.2 %', rd.rmsPct < 0.2);
  check('two-arc circuit flagged on Randles data', EIS.fitEIS(EIS.MODELS.find((m) => m.id === 'RQRQ'), ex).runaway);
  near('Hsu–Mansfeld with α = 1 gives Q', EIS.cEff(2e-5, 1, 100), 2e-5, 1e-15);
  near('i0 for 1 Ω·cm² at 25 °C', EIS.exchangeCurrent(1, 1, 298.15), 0.025693, 1e-5);
  const flipped = EIS.toPoints([[100, 10], [5, 6], [2, 3]], 'reim', 'auto');
  check('−Z″ column detected', flipped.flipped && flipped.pts[0].im === -2 && flipped.pts[0].f === 100);
  const mp = EIS.toPoints([[10], [2], [-30]], 'modphase', 'auto').pts[0]; near('|Z| and phase to Z″', mp.im, -1, 1e-12);
  check('SI prefixes', EIS.eng(2.004e-5, 'F') === '20.04 µF' && EIS.eng(1234, 'Ω') === '1.234 kΩ');
}
{
  // Enzyme kinetics: every model recovers its own values from exact rates; the simulated competitive study is identified.
  const Ss = [1, 2.5, 5, 10, 20, 40, 80, 160, 320];
  const truth = { mm: [100, 20], subinh: [120, 20, 200], hill: [100, 20, 2.2], comp: [100, 20, 10], uncomp: [100, 20, 15], noncomp: [100, 20, 25], mixed: [100, 20, 8, 40] };
  for (const m of ENZ.MODELS) {
    const d = (m.needsI ? [0, 10, 30] : [0]).flatMap((I) => Ss.map((S) => ({ S, I, v: m.v(S, I, truth[m.id]) })));
    const f = ENZ.fitEnzyme(m, d);
    check(`enzyme ${m.id} recovers its values`, f.p.every((v, i) => Math.abs(v / truth[m.id][i] - 1) < 1e-4));
  }
  const ex = ENZ.exampleData(), fits = ENZ.MODELS.filter((m) => m.needsI).map((m) => ENZ.fitEnzyme(m, ex)), w = ENZ.akaikeWeights(fits);
  const comp = fits[0];
  near('enzyme example Vmax', comp.p[0], 98.13, 0.02); near('enzyme example Km', comp.p[1], 19.20, 0.02); near('enzyme example Ki', comp.p[2], 9.816, 0.01);
  check('enzyme: competitive and mixed share the support, the other two are ruled out', w[0] > 0.5 && w[3] > 0.4 && w[1] < 1e-10 && w[2] < 1e-10);
  check('enzyme: mixed fit puts Ki′ far above Ki', fits[3].p[3] / fits[3].p[2] > 50);
  const L = ENZ.linearised(ex.filter((o) => o.I === 0));
  near('Lineweaver–Burk Vmax', L.lineweaver.Vmax, 102.07, 0.01); near('Eadie–Hofstee Km', L.eadie.Km, 19.83, 0.01); near('Hanes–Woolf Vmax', L.hanes.Vmax, 98.65, 0.01);
  // Exact linear data: all three straight-line methods agree with the truth.
  const L2 = ENZ.linearised([2, 5, 10, 20, 50].map((S) => ({ S, I: 0, v: (60 * S) / (8 + S) })));
  check('linear plots exact on perfect data', [L2.lineweaver, L2.eadie, L2.hanes].every((r) => Math.abs(r.Vmax - 60) < 1e-9 && Math.abs(r.Km - 8) < 1e-9));
  let threw = false; try { ENZ.fitEnzyme(ENZ.MODELS[0], [{ S: 1, I: 0, v: 1 }, { S: 2, I: 0, v: 2 }]); } catch { threw = true; }
  check('enzyme: too few rates refused', threw);
}
{
  // Buffers: Henderson–Hasselbalch at zero ionic strength, charge balance, Davies shifts, temperature and capacity.
  const g = (id) => BUF.BUFFERS.find((b) => b.id === id);
  check('every buffer form has a molar mass', BUF.BUFFERS.every((b) => b.forms.length && b.forms.every((f) => BUF.formMass(f) > 30)));
  near('Tris base molar mass', BUF.formMass(g('tris').forms[0]), 121.14, 0.01);
  near('Na2HPO4·7H2O molar mass', BUF.formMass(g('phosphate').forms.find((f) => f.formula === 'Na2HPO4·7H2O')), 268.06, 0.01);
  check('fractions at pH = pKa are a half each', Math.abs(BUF.fractions(7.5, [7.5])[0] - 0.5) < 1e-12);
  near('Henderson–Hasselbalch ratio 10:1 one unit above pKa', BUF.fractions(8.5, [7.5])[1] / BUF.fractions(8.5, [7.5])[0], 10, 1e-9);
  const h = BUF.oneForm(g('hepes'), g('hepes').forms[0], 7.5, 25, 1e-4, 1, 1);
  near('dilute HEPES at its pKa is half deprotonated', h.state.nbar, 0.5, 0.005);
  // Davies: a −1 → −2 pair (phosphate) drops, a +1 → 0 pair (Tris) rises with ionic strength.
  check('ionic strength moves pKa′ the right way', BUF.pKaApparent(g('phosphate'), 25, 0.1)[1] < 7.2 - 0.3 && BUF.pKaApparent(g('tris'), 25, 0.1)[0] > 8.05 + 0.08);
  const t = BUF.oneForm(g('tris'), g('tris').forms[0], 8.0, 25, 0.05, 1, 1);
  near('Tris 50 mM pH 8.0: mL of 1 M HCl', t.titrantmL, 28.40, 0.02); near('Tris grams', t.forms[0].grams, 6.057, 0.001);
  check('Tris: acid, not base', t.titrant < 0);
  near('Tris pH at 4 °C', BUF.pHAtOtherT(g('tris'), t, 4), 8.63, 0.01);
  const p = BUF.twoForms(g('phosphate'), g('phosphate').forms[0], g('phosphate').forms[3], 7.4, 25, 0.1, 1);
  check('phosphate pair reaches 7.4', p.ok);
  near('phosphate 7.4: NaH2PO4 share', p.forms[0].mol / 0.1, 0.202, 0.003); near('phosphate ionic strength', p.state.I, 0.2596, 0.001);
  // Round trip: the pH of the mixed solution comes back as the target.
  near('phosphate recipe round trip', BUF.pHAtOtherT(g('phosphate'), p, 25), 7.4, 1e-4);
  near('Tris recipe round trip', BUF.pHAtOtherT(g('tris'), t, 25), 8.0, 1e-4);
  check('pure NaH2PO4 and Na2HPO4 pH', Math.abs(BUF.pHFor(g('phosphate'), g('phosphate').forms[0], 25, 0.1) - 4.48) < 0.03 && Math.abs(BUF.pHFor(g('phosphate'), g('phosphate').forms[3], 25, 0.1) - 9.22) < 0.03);
  check('pair out of reach refused', !BUF.twoForms(g('phosphate'), g('phosphate').forms[0], g('phosphate').forms[3], 10, 25, 0.1, 1).ok);
  near('acetate: NaOH at pH 4.75', BUF.oneForm(g('acetate'), g('acetate').forms[0], 4.75, 25, 0.1, 1, 1).titrantmL, 55.04, 0.05);
  near('capacity of a single pair at its pKa′ ≈ 2.303 C / 4', BUF.oneForm(g('mops'), g('mops').forms[0], BUF.pKaApparent(g('mops'), 25, 0.05)[0], 25, 0.1, 1, 1).state.beta / BUF.betaMaxSingle(0.1), 1, 0.01);
  near('pKw at 25 °C and 37 °C', BUF.pKw(25) + BUF.pKw(37), 27.6, 1e-9);
}
{
  // Binding: exact recovery for every model, the simulated saturation study, Scatchard on perfect data, Cheng–Prusoff.
  const Ls = [0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 50, 100, 200];
  const truth = { one: [100, 3], ns: [100, 3, 2], two: [60, 0.5, 80, 20], hill: [100, 3, 2] };
  for (const m of BND.MODELS.filter((m) => !m.needsRt)) {
    const f = BND.fitBinding(m, Ls, Ls.map((l) => m.y(l, truth[m.id], 0)));
    check(`binding ${m.id} recovers its values`, f.p.every((v, i) => Math.abs(v / truth[m.id][i] - 1) < 1e-4));
  }
  const tm = BND.MODELS.find((m) => m.id === 'tight'), Lt = [0, 0.2, 0.5, 1, 1.5, 2, 3, 5, 10, 20];
  const ft = BND.fitBinding(tm, Lt, Lt.map((l) => tm.y(l, [0.1, 0.8, 0.05], 1)), 1);
  check('tight binding recovers y0, ΔY and Kd', Math.abs(ft.p[0] - 0.1) < 1e-6 && Math.abs(ft.p[1] - 0.8) < 1e-6 && Math.abs(ft.p[2] / 0.05 - 1) < 1e-4);
  near('quadratic: equal R and L, Kd = R gives 0.382 bound', BND.complexTotal(1, 1, 1), (3 - Math.sqrt(5)) / 2, 1e-12);
  near('quadratic: very tight binding takes all of the smaller', BND.complexTotal(0.4, 1, 1e-9), 0.4, 1e-6);
  near('quadratic: weak binding matches one site with free ≈ total', BND.complexTotal(1e-6, 1e-6, 10) / 1e-6, 1e-6 / (10 + 1e-6), 1e-6);
  const ex = BND.exampleData(), L = ex.map((o) => o.L), sp = ex.map((o) => o.total - o.nsb), tot = ex.map((o) => o.total);
  const one = BND.fitBinding(BND.MODELS[0], L, sp);
  near('example Kd', one.p[1], 2.514, 0.005); near('example Bmax', one.p[0], 1204, 1);
  const fits = ['one', 'ns', 'two', 'hill'].map((id) => BND.fitBinding(BND.MODELS.find((m) => m.id === id), L, tot)), w = BND.akaikeWeights(fits);
  check('total binding: one site + non-specific wins', w[1] > 0.9 && Math.abs(fits[1].p[1] - 2.53) < 0.01);
  const S = BND.scatchard(Ls, Ls.map((l) => (100 * l) / (3 + l)));
  check('Scatchard exact on one-site data', Math.abs(S.Kd - 3) < 1e-9 && Math.abs(S.Bmax - 100) < 1e-9);
  near('Cheng–Prusoff', BND.chengPrusoff(40, 2, 2.5), 40 / 1.8, 1e-12);
}
{
  // Centrifuge: the textbook constant, round trips, k-factor scaling and protocol conversion.
  near('RCF constant 1.118e-5', CEN.RCF_CONST, 1.118e-5, 0.001e-5);
  near('10 cm at 3000 rpm ≈ 1006 × g', CEN.rcf(3000, 10), 1006.42, 0.01);
  near('rpm round trip', CEN.rpmFor(CEN.rcf(13000, 9.5), 9.5), 13000, 1e-6);
  near('RCF grows with rpm²', CEN.rcf(20000, 8) / CEN.rcf(10000, 8), 4, 1e-12);
  const k = CEN.kFactor(40000, 4, 8.5);
  near('k-factor 4–8.5 cm at 40,000 rpm', k, 119.33, 0.01);
  near('k = 2.533e11 ln(rmax/rmin) / rpm²', k, 2.533e11 * Math.log(8.5 / 4) / 40000 ** 2, 0.05);
  near('k scales with 1/rpm²', CEN.kAtSpeed(k, 40000, 20000), CEN.kFactor(20000, 4, 8.5), 1e-9);
  near('70 S pellets in 102 min', CEN.pelletHours(k, 70) * 60, 102.29, 0.01);
  near('protocol conversion', CEN.convertTime(1, k, CEN.kFactor(45000, 3.5, 7.5)) * 60, 47.93, 0.01);
  let threw = false; try { CEN.kFactor(40000, 8, 4); } catch { threw = true; } check('k-factor needs rmax > rmin', threw);
  check('time text', CEN.hms(0.005) === '18 s' && CEN.hms(1.7048) === '102 min' && CEN.hms(2.5) === '2 h 30 min');
}
{
  // Air quality: unit conversion, US AQI (2024 PM2.5 breakpoints, truncation), India AQI and Canada AQHI.
  near('molar volume 25 °C, 1 atm', AQ.molarVolume(25, 101.325), 24.465, 0.001);
  near('100 µg/m³ NO2 → ppb', AQ.convertGas(100, 'ug', 'ppb', AQ.gasMass('NO2')), 53.18, 0.01);
  near('1 ppm CO → mg/m³', AQ.convertGas(1, 'ppm', 'mg', AQ.gasMass('CO')), 1.145, 0.001);
  near('unit round trip at 0 °C', AQ.convertGas(AQ.convertGas(37, 'ppb', 'ug', 48, 0, 90), 'ug', 'ppb', 48, 0, 90), 37, 1e-9);
  const u = (k, c) => AQ.usSub(k, c);
  check('US breakpoints map to their AQI', u('PM2.5', 9.0).index === 50 && u('PM2.5', 9.1).index === 51 && u('PM2.5', 35.4).index === 100 && u('PM2.5', 55.5).index === 151 && u('PM2.5', 225.5).index === 301 && u('PM2.5', 325.4).index === 500);
  check('US PM2.5 truncates to 0.1 (9.05 is Good)', u('PM2.5', 9.05).index === 50 && u('PM2.5', 9.05).cat === 0);
  check('US PM2.5 35.9 → 102, sensitive groups', u('PM2.5', 35.9).index === 102 && u('PM2.5', 35.9).cat === 2);
  check('US ozone 8-hour 0.0789 → 126', u('O3_8h', 0.0789).index === 126);
  check('US ozone 8-hour above 0.200 is off its scale', Number.isNaN(u('O3_8h', 0.25).index));
  check('US 1-hour ozone below 0.125 not used', u('O3_1h', 0.1).text === 'not used');
  check('US CO, NO2, PM10', u('CO', 8.4).index === 90 && u('NO2', 60).index === 57 && u('PM10', 155).index === 101 && u('NO2', 2049).index === 500);
  const i = (k, c) => AQ.inSub(k, c);
  check('India bands', i('PM2.5', 30).index === 50 && i('PM2.5', 31).index === 51 && i('PM10', 250).index === 200 && i('PM10', 351).index === 301 && i('PM2.5', 300).text === '401+');
  check('India CO in mg/m³', i('CO', 2.0).index === 100 && i('CO', 2.1).index === 101);
  near('India ozone 118 µg/m³', i('O3_8h', 118).index, 126, 0);
  const a = AQ.aqhi(20, 30, 10);
  near('AQHI raw', a.raw, (1000 / 10.4) * (Math.exp(0.000871 * 20) - 1 + Math.exp(0.000537 * 30) - 1 + Math.exp(0.000487 * 10) - 1), 1e-12);
  check('AQHI 4, moderate', a.value === 4 && a.cat === 1);
  check('AQHI+ wins in smoke', AQ.aqhi(20, 30, 10, 85).value === 9 && AQ.aqhiPlus(0) === 1 && AQ.aqhiPlus(10.1) === 2);
  check('AQHI bands', AQ.aqhiCat(3) === 0 && AQ.aqhiCat(6) === 1 && AQ.aqhiCat(10) === 2 && AQ.aqhiCat(11) === 3 && AQ.aqhiText(11) === '10+');
}
{
  // Altermagnets: textbook verdicts for idealised structures, the swapping operation and the d/g-wave forms.
  const run = (id) => ALT.classify(ALT.parseCrystal(ALT.EXAMPLES.find((e) => e.id === id).text).crystal);
  const ru = run('rutile');
  check('rutile: d-wave altermagnet, Δ ∝ kx·ky', ru.kind === 'altermagnet' && ru.wave === 'd' && ru.form === 'kxky');
  check('rutile: swapped by the 4₂ screw', /^4-fold screw .*\[0 0 1\] with translation \(1\/2, 1\/2, 1\/2\)/.test(ru.byOp.name) && ru.keep.length === 8 && ru.swap.length === 8);
  const mt = run('nias');
  check('MnTe: g-wave altermagnet via the 6₃ screw', mt.kind === 'altermagnet' && mt.wave === 'g' && /^6-fold screw .*\[0 0 1\] with translation \(0, 0, 1\/2\)/.test(mt.byOp.name));
  check('MnTe form: ky·kz·(3kx² − ky²)/3', mt.form === 'kx²kykz − (1/3)ky³kz');
  check('g-wave form odd under the swap, even under keepers', mt.swap.every((o) => [[0.3, 0.5, 0.8], [0.9, -0.2, 0.4]].every((k) => Math.abs(mt.formFn([o.R[0][0] * k[0] + o.R[0][1] * k[1] + o.R[0][2] * k[2], o.R[1][0] * k[0] + o.R[1][1] * k[1] + o.R[1][2] * k[2], o.R[2][0] * k[0] + o.R[2][1] * k[1] + o.R[2][2] * k[2]]) + mt.formFn(k)) < 1e-9)));
  check('CrSb also g-wave', run('crsb').wave === 'g');
  const bcc = run('bcc'); check('bcc checkerboard: antiferromagnet by translation', bcc.kind === 'antiferromagnet' && /^translation/.test(bcc.byOp.name));
  const ch = run('chain'); check('chain: antiferromagnet by inversion (PT)', ch.kind === 'antiferromagnet' && ch.byOp.name === 'inversion');
  check('unequal moments: ferrimagnet', run('ferri').kind === 'ferrimagnet');
  const fm = ALT.classify(ALT.parseCrystal('cell 3 3 3 90 90 90\nFe 0 0 0 up\nFe 1/2 1/2 1/2 up').crystal);
  check('all up: ferromagnet', fm.kind === 'ferromagnet');
  const cf = ALT.classify(ALT.parseCrystal('cell 3 3 3 90 90 90\nFe 0 0 0 up\nFe 0.5 0.5 0.3 down\nO 0 0 0.5').crystal);
  check('cancelling but unrelated sites: compensated ferrimagnet', cf.kind === 'not compensated by symmetry');
  // Square-lattice Néel order with ligands that make the two sites differ by a 90° rotation: the 2D d-wave toy model.
  const sq = ALT.classify(ALT.parseCrystal('cell 4 4 6 90 90 90\nMn 0 0 0 up\nMn 1/2 1/2 0 down\nO 0.2 0 0\nO 0.8 0 0\nO 1/2 0.7 0\nO 1/2 0.3 0').crystal);
  check('square Néel with rotated ligands: d-wave altermagnet, kx² − ky²', sq.kind === 'altermagnet' && sq.wave === 'd' && /kx² − ky²|−kx² \+ ky²/.test(sq.form));
  // Small coordinate noise is tolerated.
  const noisy = ALT.classify(ALT.parseCrystal('cell 4.5 4.5 3.1 90 90 90\nRu 0.002 0 0 up\nRu 0.5 0.501 0.5 down\nO 0.301 0.3 0\nO 0.7 0.699 0\nO 0.8 0.2 0.5\nO 0.2 0.801 0.5').crystal, 0.1);
  check('rutile with 0.01 Å noise still d-wave', noisy.kind === 'altermagnet' && noisy.wave === 'd');
  const pc = ALT.parseCrystal('cell 3 3 3 90 90 90\nFe 1/3 -0.25 1.5 2.5\nnonsense line');
  check('parser: fractions, wrapping, moments, bad lines', pc.crystal.atoms[0].f[0] === 1 / 3 && pc.crystal.atoms[0].f[1] === 0.75 && pc.crystal.atoms[0].f[2] === 0.5 && pc.crystal.atoms[0].m === 2.5 && pc.bad.length === 1);
}
{
  // Gaussian plume: hand-worked values (Briggs rural D at 1 km, stack 50 m, 100 g/s, 4 m/s at 10 m).
  const u = PL.windAt(4, 50, 'D', 'rural');
  near('plume: wind power law', u, 4 * 5 ** 0.15, 1e-12);
  const s = PL.sigmas(1000, 'D', 'rural');
  near('plume: sigma-y D rural 1 km', s.sy, 80 / Math.sqrt(1.1), 1e-9);
  near('plume: sigma-z D rural 1 km', s.sz, 60 / Math.sqrt(2.5), 1e-9);
  const src = { Q: 100, u, H: 50, cls: 'D', terrain: 'rural' };
  const hand = (100 / (Math.PI * u * s.sy * s.sz)) * Math.exp(-2500 / (2 * s.sz * s.sz));
  near('plume: ground centreline = Q/(pi u sy sz) exp(-H²/2sz²)', PL.conc(src, 1000), hand, 1e-15);
  near('plume: hand value in µg/m³', PL.conc(src, 1000) * 1e6, 906.5, 0.1);
  near('plume: off-axis factor', PL.conc(src, 1000, s.sy) / PL.conc(src, 1000), Math.exp(-0.5), 1e-12);
  check('plume: nothing upwind', PL.conc(src, -10) === 0);
  // The maximum agrees with a brute-force search.
  const m = PL.groundMax(src);
  let bx = 0, bc = 0; for (let x = 100; x < 5000; x += 0.5) { const c = PL.conc(src, x); if (c > bc) { bc = c; bx = x; } }
  near('plume: max distance', m.x, bx, 1); near('plume: max value', m.c, bc, bc * 1e-6);
  // Ground release: the mirror doubles it.
  near('plume: ground source', PL.conc({ ...src, H: 0 }, 500), 100 / (Math.PI * u * PL.sigmas(500, 'D', 'rural').sy * PL.sigmas(500, 'D', 'rural').sz), 1e-15);
  // Mixing lid: far downwind the images add up to a well-mixed layer.
  const x = 60000, sy = PL.sigmas(x, 'D', 'rural').sy;
  near('plume: well mixed under a lid', PL.conc({ ...src, L: 200 }, x) / (100 / (Math.sqrt(2 * Math.PI) * u * sy * 200)), 1, 1e-6);
  near('plume: image sum close to well mixed', PL.vertical(0, 50, 250, 200) / (Math.sqrt(2 * Math.PI) * 250 / 200), 1, 0.01);
  check('plume: above the lid gives nothing at the ground', PL.conc({ ...src, H: 300, L: 200 }, 2000) === 0);
  // Briggs plume rise: F = g vs d² (Ts - Ta) / (4 Ts).
  const r = PL.plumeRise(15, 2, 420, 288, u, 'D');
  near('plume: buoyancy flux', r.F, (9.80665 * 15 * 4 * 132) / (4 * 420), 1e-12);
  near('plume: final rise F<55', r.dh, (21.425 * r.F ** 0.75) / u, 1e-12);
  near('plume: final rise distance', r.xf, 49 * r.F ** (5 / 8), 1e-9);
  near('plume: gradual rise reaches the final rise at xf', r.gradual(r.xf * 0.999) / r.dh, 1, 0.01);
  const r2 = PL.plumeRise(20, 5, 450, 288, u, 'D');
  near('plume: final rise F>=55', r2.dh, (38.71 * r2.F ** 0.6) / u, 1e-12);
  const rs = PL.plumeRise(15, 2, 420, 288, 3, 'F');
  near('plume: stable rise', rs.dh, 2.6 * Math.cbrt(rs.F / (3 * (9.80665 * 0.035) / 288)), 1e-12);
  check('plume: cold gas, no rise', PL.plumeRise(15, 2, 280, 288, 3, 'D').dh === 0);
  // Pasquill's table and paired classes.
  check('plume: Pasquill table', PL.pasquillClass(1.5, 'strong') === 'A' && PL.pasquillClass(4, 'moderate') === 'BC' && PL.pasquillClass(7, 'strong') === 'C' && PL.pasquillClass(2.5, 'night-clear') === 'F' && PL.pasquillClass(4, 'night-cloudy') === 'D' && PL.pasquillClass(1, 'overcast') === 'D');
  near('plume: paired class averages sigmas', PL.sigmasFor(800, 'BC', 'rural').sz, (PL.sigmas(800, 'B', 'rural').sz + PL.sigmas(800, 'C', 'rural').sz) / 2, 1e-12);
  near('plume: urban A-B sigma-z', PL.sigmas(1000, 'A', 'urban').sz, 240 * Math.sqrt(2), 1e-9);
  check('plume: stable plumes spread less', PL.sigmas(2000, 'F', 'rural').sz < PL.sigmas(2000, 'D', 'rural').sz && PL.sigmas(2000, 'D', 'rural').sz < PL.sigmas(2000, 'A', 'rural').sz);
}

{
  // McCabe-Thiele: alpha 2.5, xF 0.5 (saturated liquid), xD 0.95, xB 0.05.
  const eq = MT.alphaEq(2.5);
  near('mccabe: equilibrium', eq.y(0.5), 1.25 / 1.75, 1e-12);
  near('mccabe: inverse equilibrium', eq.x(eq.y(0.3)), 0.3, 1e-12);
  const m = MT.minReflux(eq, 0.5, 0.95, 1);
  near('mccabe: Rmin by hand', m.Rmin, (0.95 - 1.25 / 1.75) / (1.25 / 1.75 - 0.5), 1e-9);
  check('mccabe: no tangent pinch for constant alpha', !m.tangent);
  // q = 0.5: q-line y = 1 - x meets the curve where 1.5x² + 2x - 1 = 0.
  near('mccabe: q-line pinch', MT.qPinch(eq, 0.5, 0.5)[0], (-2 + Math.sqrt(10)) / 3, 1e-9);
  near('mccabe: saturated vapour feed pinch', MT.qPinch(eq, 0.5, 0)[1], 0.5, 1e-12);
  const spec = { xF: 0.5, xD: 0.95, xB: 0.05, q: 1, R: 1.5 * m.Rmin };
  const st = MT.stepStages(eq, spec);
  check('mccabe: 12 stages, feed on 6', st.N === 12 && st.feed === 6);
  near('mccabe: operating lines meet on the q-line', st.intersect[1], (spec.R * 0.5 + 0.95) / (spec.R + 1), 1e-12);
  near('mccabe: stripping line passes (xB, xB)', st.strip.s * 0.05 + st.strip.c, 0.05, 1e-12);
  // Each step: y(n) on the curve with x(n); the next y on the operating line.
  check('mccabe: steps lie on the curve', st.stages.every((s) => Math.abs(eq.y(s.x) - s.y) < 1e-9));
  near('mccabe: Fenske', MT.fenske(0.95, 0.05, 2.5), Math.log(19 * 19) / Math.log(2.5), 1e-12);
  const tot = MT.stepStages(eq, { ...spec, R: Infinity });
  check('mccabe: total reflux steps close to Fenske', tot.N === 7 && Math.abs(tot.frac - MT.fenske(0.95, 0.05, 2.5)) < 0.15);
  near('mccabe: Gilliland at R = Rmin gives infinity-like', MT.gilliland(m.Rmin, m.Rmin, 6.4268), (6.4268 + 0.75) / 0.25, 1e-9);
  const fl = MT.flows(100, spec);
  near('mccabe: D', fl.D, 50, 1e-9); near('mccabe: V below = V above for q = 1', fl.Vs, fl.V, 1e-9); near('mccabe: L below', fl.Ls, fl.L + 100, 1e-9);
  near('mccabe: component balance', fl.D * 0.95 + fl.B * 0.05, 50, 1e-9);
  let threw = false; try { MT.stepStages(eq, { ...spec, R: 0.9 * m.Rmin }); } catch { threw = true; }
  check('mccabe: below minimum reflux refused', threw);
  // Tangent pinch on a made-up curve that flattens near the top.
  const tq = { y: (x) => x + 0.6 * x * (1 - x) ** 3, x: (y) => { let lo = 0, hi = 1; for (let k = 0; k < 80; k++) { const mid = (lo + hi) / 2; if (mid + 0.6 * mid * (1 - mid) ** 3 < y) lo = mid; else hi = mid; } return (lo + hi) / 2; }, label: 't' };
  const tp = MT.minReflux(tq, 0.2, 0.9, 1);
  let best = 0; for (let x = 0.2; x < 0.9; x += 1e-5) best = Math.max(best, (0.9 - tq.y(x)) / (0.9 - x));
  check('mccabe: tangent pinch found', tp.tangent && tp.pinch[0] > 0.3);
  near('mccabe: tangent pinch Rmin', tp.Rmin, best / (1 - best), 1e-5);
  // Data curve: monotone cubic passes through the points and stays monotone.
  const d = MT.dataEq([0.1, 0.3, 0.5, 0.7, 0.9], [0.3, 0.55, 0.7, 0.82, 0.94]);
  near('mccabe: data curve hits a point', d.y(0.5), 0.7, 1e-12);
  let mono = true, prev = -1; for (let x = 0; x <= 1; x += 0.001) { const y = d.y(x); if (y < prev - 1e-12) mono = false; prev = y; }
  check('mccabe: data curve monotone', mono);
  near('mccabe: data inverse', d.x(d.y(0.42)), 0.42, 1e-9);
  let bad = false; try { MT.dataEq([0.2, 0.4], [0.5, 0.45]); } catch { bad = true; }
  check('mccabe: falling data refused', bad);
}

{
  // Antoine and Raoult: every rounded example boils within 0.2 °C of its normal boiling point.
  for (const e of VL.EXAMPLES) near(`vle: ${e.name} normal boiling point`, VL.tsat(e, 101.325), e.bp, 0.2);
  const [bz, tl] = [VL.EXAMPLES.find((e) => e.name === 'Benzene'), VL.EXAMPLES.find((e) => e.name === 'Toluene')];
  near('vle: Antoine by hand', VL.psat(bz, 95), 10 ** (6.906 - 1211 / 315.8) * 101.325 / 760, 1e-12);
  near('vle: tsat inverts psat', VL.tsat(tl, VL.psat(tl, 47.3)), 47.3, 1e-9);
  near('vle: kPa constants agree', VL.psat({ ...bz, A: bz.A + Math.log10(101.325 / 760), unit: 'kPa' }, 60), VL.psat(bz, 60), 1e-9);
  const b = VL.bubbleT(bz, tl, 0.5, 101.325), d = VL.dewT(bz, tl, 0.5, 101.325);
  near('vle: bubble point sums', 0.5 * VL.psat(bz, b.t) + 0.5 * VL.psat(tl, b.t), 101.325, 1e-6);
  near('vle: dew point sums', 0.5 / VL.psat(bz, d.t) + 0.5 / VL.psat(tl, d.t), 1 / 101.325, 1e-9);
  check('vle: bubble below dew, between pure points', VL.tsat(bz, 101.325) < b.t && b.t < d.t && d.t < VL.tsat(tl, 101.325));
  near('vle: dew of the bubble vapour gives the bubble T', VL.dewT(bz, tl, b.y1, 101.325).t, b.t, 1e-6);
  near('vle: bubble P at the bubble T', VL.bubbleP(bz, tl, 0.5, b.t).P, 101.325, 1e-6);
  near('vle: dew P at the dew T', VL.dewP(bz, tl, 0.5, d.t).P, 101.325, 1e-6);
  const f = VL.flash(bz, tl, 0.5, 95, 101.325);
  near('vle: flash mass balance', f.V * f.y1 + (1 - f.V) * f.x1, 0.5, 1e-12);
  near('vle: flash phases sum', f.x1 * VL.psat(bz, 95) + (1 - f.x1) * VL.psat(tl, 95), 101.325, 1e-9);
  check('vle: flash below bubble is liquid, above dew is vapour', VL.flash(bz, tl, 0.5, 85, 101.325).state === 'liquid' && VL.flash(bz, tl, 0.5, 105, 101.325).state === 'vapour');
  near('vle: alpha mean', VL.alphaMean(bz, tl, 101.325).mean, Math.sqrt(VL.alphaAt(bz, tl, VL.tsat(bz, 101.325)) * VL.alphaAt(bz, tl, VL.tsat(tl, 101.325))), 1e-12);
  // Clausius-Clapeyron: dHvap equals -R d(lnP)/d(1/T), checked by finite differences.
  const T1 = 90, T2 = 90.01, num = Math.log(VL.psat(tl, T2) / VL.psat(tl, T1)), den = 1 / (T1 + 273.15) - 1 / (T2 + 273.15);
  near('vle: heat of vaporisation from the slope', VL.dHvap(tl, 90.005), (8.314462618 * num) / den / 1000, 1e-3);
  near('vle: water at 70 kPa boils near 90 °C', VL.tsat(VL.EXAMPLES[0], 70), 90.03, 0.05);
  const c = VL.txy(bz, tl, 101.325, 10);
  check('vle: Txy ends at the pure boiling points', Math.abs(c[0].t - VL.tsat(tl, 101.325)) < 1e-6 && Math.abs(c[10].t - VL.tsat(bz, 101.325)) < 1e-6);
}

{
  // Radiometric ages. Pearson's data with York's weights: the standard test of a York fit (b = -0.4805, a = 5.4799).
  const X = [0, 0.9, 1.8, 2.6, 3.3, 4.4, 5.2, 6.1, 6.5, 7.4], Y = [5.9, 5.4, 4.4, 4.6, 3.5, 3.7, 2.8, 2.8, 2.4, 1.5];
  const WX = [1000, 1000, 500, 800, 200, 80, 60, 20, 1.8, 1], WY = [1, 1.8, 4, 8, 20, 20, 70, 70, 100, 500];
  const yf = GC.york(X.map((x, i) => ({ x, sx: 1 / Math.sqrt(WX[i]), y: Y[i], sy: 1 / Math.sqrt(WY[i]) })));
  near('geochron: York slope (Pearson-York data)', yf.b, -0.48053, 1e-4);
  near('geochron: York intercept', yf.a, 5.47991, 1e-4);
  near('geochron: York slope error', yf.sb, 0.0576, 0.0005);
  // With tiny x errors York reduces to weighted least squares of y on x.
  const pts = [[1, 2.1, 0.1], [2, 3.9, 0.2], [3, 6.2, 0.1], [4, 7.8, 0.3], [5, 10.1, 0.2]];
  const w = pts.map((p) => 1 / p[2] ** 2), Sw = w.reduce((a, b) => a + b), Sx = w.reduce((a, v, i) => a + v * pts[i][0], 0), Sy = w.reduce((a, v, i) => a + v * pts[i][1], 0);
  const Sxx = w.reduce((a, v, i) => a + v * pts[i][0] ** 2, 0), Sxy = w.reduce((a, v, i) => a + v * pts[i][0] * pts[i][1], 0), D = Sw * Sxx - Sx * Sx;
  const yw = GC.york(pts.map((p) => ({ x: p[0], sx: 1e-9, y: p[1], sy: p[2] })));
  near('geochron: York -> weighted LS slope', yw.b, (Sw * Sxy - Sx * Sy) / D, 1e-9);
  near('geochron: York -> weighted LS slope error', yw.sb, Math.sqrt(Sw / D), 1e-9);
  near('geochron: chi-square tail (3.84, 1 dof)', GC.chiSqUpper(3.841459, 1), 0.05, 1e-6);
  near('geochron: chi-square tail (10, 10 dof)', GC.chiSqUpper(10, 10), 0.4404933, 1e-6);
  // A perfect isochron returns its age and initial ratio.
  const lam = 1.42e-11, b = GC.ratioForAge(1.25e9, lam);
  const perfect = [0.5, 1.5, 3, 5, 8].map((x) => ({ x, sx: 0.005 * x, y: 0.7035 + b * x, sy: 2e-5 }));
  const pf = GC.york(perfect), pa = GC.isochronAge(pf, lam);
  near('geochron: perfect isochron age', pa.t, 1.25e9, 1); near('geochron: perfect isochron initial', pa.initial, 0.7035, 1e-12);
  check('geochron: perfect isochron MSWD 0', pf.mswd < 1e-12);
  // Simple ages and half-lives.
  near('geochron: ratio age', GC.ageFromRatio(1, 1.55125e-10).t, Math.LN2 / 1.55125e-10, 1e-3);
  near('geochron: U-238 half-life 4.468 Ga', Math.LN2 / GC.L238 / 1e9, 4.468, 0.001);
  near('geochron: U-235 half-life 703.8 Ma', Math.LN2 / GC.L235 / 1e6, 703.8, 0.1);
  near('geochron: K-40 half-life 1.25 Ga', Math.LN2 / GC.K40.lambda / 1e9, 1.250, 0.001);
  const kr = GC.kArAge(GC.K40.lambdaE / GC.K40.lambda * Math.expm1(GC.K40.lambda * 1e8));
  near('geochron: K-Ar round trip', kr.t, 1e8, 1e-3);
  const J = GC.jFromStandard(28.2e6, 12);
  near('geochron: Ar-Ar standard gives its own age', GC.arArAge(J, 12).t, 28.2e6, 1e-3);
  // U-Pb: a point on concordia is concordant and all three ages agree.
  const c = GC.concordia(2.0e9), u = GC.uPbAges(c[1], c[0]);
  near('geochron: concordant 206/238', u.t68, 2e9, 1e-3); near('geochron: concordant 207/235', u.t75, 2e9, 1e-3); near('geochron: concordant 207/206', u.t76, 2e9, 1e-2);
  near('geochron: concordance 100 %', u.concordance, 1, 1e-9);
  // Lead loss: move towards the origin along a chord; the 207/206 age stays put.
  const lost = GC.uPbAges(c[1] * 0.8, c[0] * 0.8);
  near('geochron: lead loss keeps the 207/206 age', lost.t76, 2e9, 1e-2);
  check('geochron: lead loss is discordant', lost.concordance < 0.9);
  check('geochron: age units', GC.fmtAge(1.2504e9, 3.1e6) === '1250.4 ± 3.1 Ma' && GC.fmtAge(5000) === '5 ka');
}

{
  // Delta notation.
  const R = DL.rFromDelta(-8.5, 2005.2e-6);
  near('delta: ratio from δ', R, 2005.2e-6 * 0.9915, 1e-15);
  near('delta: δ from ratio round trip', DL.deltaFromR(R, 2005.2e-6), -8.5, 1e-9);
  near('delta: VPDB -> VSMOW', DL.vpdbToVsmow(-5.2), 1.03092 * -5.2 + 30.92, 1e-9);
  near('delta: VSMOW -> VPDB round trip', DL.vsmowToVpdb(DL.vpdbToVsmow(-5.2)), -5.2, 1e-9);
  near('delta: VPDB standard itself is +30.92 on VSMOW', DL.vpdbToVsmow(0), 30.92, 1e-12);
  near('delta: VSMOW is -29.99 on VPDB', DL.vsmowToVpdb(0), -29.99, 0.005);
  // Rescaling chains: going A->B->A returns the start.
  near('delta: rescale chain', DL.rescale(DL.rescale(12.3, 7.5), -7.5 / (1 + 7.5 / 1000)), 12.3, 1e-9);
  const f = DL.fractionation(25, -5);
  near('delta: alpha', f.alpha, 1025 / 995, 1e-15); near('delta: epsilon', f.eps, (1025 / 995 - 1) * 1000, 1e-12); near('delta: 1000 ln alpha', f.lnAlpha, 1000 * Math.log(1025 / 995), 1e-12);
  near('delta: Δ′17O', DL.capDelta17(5.3, 10.1), 1000 * (Math.log(1.0053) - 0.528 * Math.log(1.0101)), 1e-12);
  check('delta: mass-dependent point has Δ′17O 0', Math.abs(DL.capDelta17(1000 * (Math.exp(0.528 * Math.log(1.02)) - 1), 20)) < 1e-12);
  const m = DL.mix(0.6, 1, -28, 3, -12);
  near('delta: mixing', m.delta, (0.6 * -28 + 0.4 * 3 * -12) / (0.6 + 1.2), 1e-12);
  near('delta: inverse mixing', DL.mix(DL.fractionFor(-18, 1, -28, 3, -12), 1, -28, 3, -12).delta, -18, 1e-12);
  check('delta: target outside the sources', Number.isNaN(DL.fractionFor(-30, 1, -28, 3, -12)));
  near('delta: equal concentrations mix linearly', DL.mix(0.25, 2, -10, 2, 10).delta, 5, 1e-12);
  // Exact ratio mixing agrees with the δ approximation within 0.01 ‰ for ordinary values.
  const Rs = 0.01118, RA = DL.rFromDelta(-28, Rs), RB = DL.rFromDelta(-12, Rs);
  const hA = 0.6 * 1 * RA / (1 + RA), hB = 0.4 * 3 * RB / (1 + RB), lA = 0.6 * 1 / (1 + RA), lB = 0.4 * 3 / (1 + RB);
  near('delta: δ mixing vs exact', DL.deltaFromR((hA + hB) / (lA + lB), Rs), m.delta, 0.01);
}

{
  // Mixing model: exact recovery, weighted δ, clipping and a degenerate case.
  const m = { tracers: [{ name: 'Cl', delta: false }, { name: 'SO4', delta: false }, { name: 'd18O', delta: true }], names: ['A', 'B', 'C'], em: [[1, 2, -12], [15, 40, -8], [60, 10, -5]] };
  const f0 = [0.2, 0.3, 0.5], u = MX.unmix(m, MX.predict(m, f0));
  check('mixing: exact three-source recovery', u.f.every((v, i) => Math.abs(v - f0[i]) < 1e-9) && u.rms < 1e-9 && !u.clipped);
  near('mixing: fractions sum to 1', u.f.reduce((a, b) => a + b), 1, 1e-12);
  const m2 = { tracers: [{ name: 'Sr', delta: false }, { name: 'd87', delta: true, weight: 0 }], names: ['A', 'B'], em: [[100, 5], [400, 15]] };
  near('mixing: weighted δ forward', MX.predict(m2, [0.3, 0.7])[1], (0.3 * 100 * 5 + 0.7 * 400 * 15) / (0.3 * 100 + 0.7 * 400), 1e-12);
  // δ alone (weighted) recovers the fraction too.
  const m3 = { tracers: [{ name: 'C', delta: false }, { name: 'd13C', delta: true, weight: 0 }], names: ['A', 'B'], em: [[2, -25], [8, -5]] };
  const y3 = MX.predict(m3, [0.6, 0.4]);
  near('mixing: weighted δ inverse', MX.unmix(m3, y3).f[0], 0.6, 1e-9);
  check('mixing: weighted δ curve is not linear', Math.abs(y3[1] - (0.6 * -25 + 0.4 * -5)) > 1);
  const out = MX.unmix(m, [0.5, 1, -13]);
  check('mixing: outside sample is clipped to a vertex', out.clipped && Math.abs(out.f[0] - 1) < 1e-12 && out.free.some((v) => v < 0));
  // Outside an edge: the answer must be the best point on that edge (brute force).
  const yE = [40, 30, -6];
  const ue = MX.unmix(m, yE);
  let best = Infinity, bf = null;
  for (let a = 0; a <= 1.000001; a += 0.0005) for (let b = 0; a + b <= 1.000001; b += 0.0005) {
    const f = [a, b, Math.max(0, 1 - a - b)], p = MX.predict(m, f);
    const sp = [59, 38, 7], c = p.reduce((s, v, j) => s + ((v - yE[j]) / sp[j]) ** 2, 0); if (c < best) { best = c; bf = f; }
  }
  check('mixing: constrained answer matches brute force', ue.f.every((v, i) => Math.abs(v - bf[i]) < 0.003));
  let threw = false; try { MX.unmix({ tracers: [{ name: 'x', delta: false }], names: ['A', 'B'], em: [[5], [5]] }, [5]); } catch { threw = true; }
  check('mixing: identical sources refused', threw);
  check('mixing: δ names', MX.looksDelta('d18O') && MX.looksDelta('δ13C') && MX.looksDelta('delta2H') && !MX.looksDelta('Cl') && !MX.looksDelta('DOC'));
}

{
  // Ternary and spider diagrams.
  const c = TER.closure(2, 3, 5);
  near('ternary: closure', c[1], 0.3, 1e-12);
  check('ternary: closure rejects negatives and zeros', TER.closure(1, -1, 2) === null && TER.closure(0, 0, 0) === null);
  const [ax, ay] = TER.toXY(1, 0, 0), [bx, by] = TER.toXY(0, 1, 0), [cx, cy] = TER.toXY(0, 0, 1);
  check('ternary: corners', ax === 0.5 && Math.abs(ay - Math.sqrt(3) / 2) < 1e-12 && bx === 0 && by === 0 && cx === 1 && cy === 0);
  const [mx, my] = TER.toXY(1, 1, 1);
  near('ternary: centroid x', mx, 0.5, 1e-12); near('ternary: centroid y', my, Math.sqrt(3) / 6, 1e-12);
  const back = TER.fromXY(...TER.toXY(0.2, 0.5, 0.3));
  near('ternary: round trip a', back[0], 0.2, 1e-12); near('ternary: round trip b', back[1], 0.5, 1e-12); near('ternary: round trip c', back[2], 0.3, 1e-12);
  const ce = TER.centres([[0.5, 0.25, 0.25], [0.5, 0.25, 0.25]]);
  near('ternary: centre of identical rows', ce.geometric[0], 0.5, 1e-12);
  const g2 = TER.centres([[0.8, 0.1, 0.1], [0.2, 0.4, 0.4]]).geometric, gm = [0.4, 0.2, 0.2], sg = 0.8;
  near('ternary: geometric centre closed', g2[0], gm[0] / sg, 1e-12);
  check('ternary: centre skips rows with zeros', TER.centres([[1, 0, 0]]).geometric === null);
  const n = TER.normalise([10, 0, 6], [2, 1, 0]);
  check('spider: normalise', n[0] === 5 && Number.isNaN(n[1]) && Number.isNaN(n[2]));
  near('spider: Eu anomaly', TER.anomaly(10, 25, 16), 0.5, 1e-12);
  check('spider: Eu anomaly missing value', Number.isNaN(TER.anomaly(1, 0, 2)));
}
{
  // Piper diagram: meq/L, ion balance, positions, water type.
  near('piper: 40.078 mg/L Ca is 2 meq/L', PIP.meq(40.078, 'Ca'), 2, 1e-12);
  near('piper: 61.0168 mg/L HCO3 is 1 meq/L', PIP.meq(61.0168, 'HCO3'), 1, 1e-12);
  near('piper: mmol to meq for SO4', PIP.meqFromMmol(1.5, 'SO4'), 3, 1e-12);
  const a = PIP.analyse({ Ca: 3, Mg: 1, Na: 1, HCO3: 4, SO4: 0.5, Cl: 0.5 });
  near('piper: balanced sample', a.ibe, 0, 1e-12);
  near('piper: ion balance error', PIP.analyse({ Ca: 5.5, HCO3: 4.5 }).ibe, 10, 1e-12);
  near('piper: nitrate in the balance', PIP.analyse({ Ca: 2, HCO3: 1, NO3: 1 }).ibe, 0, 1e-12);
  near('piper: cation share', a.cp.Ca, 0.6, 1e-12);
  const pCa = PIP.piperXY({ Ca: 1, Mg: 0, NaK: 0 }, { HCO3: 1, SO4: 0, Cl: 0 }, 0.2);
  check('piper: Ca corner and HCO3 corner', Math.abs(pCa.cat[0]) < 1e-12 && Math.abs(pCa.an[0] - 1.2) < 1e-12);
  near('piper: Ca-HCO3 is the left diamond corner x', pCa.dia[0], 0.6, 1e-12);
  near('piper: Ca-HCO3 is the left diamond corner y', pCa.dia[1], 1.2 * Math.sqrt(3) / 2, 1e-12);
  const pNa = PIP.piperXY({ Ca: 0, Mg: 0, NaK: 1 }, { HCO3: 1, SO4: 0, Cl: 0 }, 0.2);
  near('piper: Na-HCO3 is the bottom corner', pNa.dia[1], 0.2 * Math.sqrt(3) / 2, 1e-12);
  const pTop = PIP.piperXY({ Ca: 0.5, Mg: 0.5, NaK: 0 }, { HCO3: 0, SO4: 0.5, Cl: 0.5 }, 0.2);
  near('piper: top corner', pTop.dia[1], 2.2 * Math.sqrt(3) / 2, 1e-12);
  // Projection rule: from the cation point along the left edge's direction to the diamond's lower-left edge.
  const cp = { Ca: 0.3, Mg: 0.25, NaK: 0.45 }, ap = { HCO3: 0.7, SO4: 0.1, Cl: 0.2 }, pp = PIP.piperXY(cp, ap, 0.2), h = Math.sqrt(3) / 2;
  const tHit = 0.2 + (cp.Ca + cp.Mg) - cp.Mg;
  near('piper: cation projection meets the diamond edge', pp.cat[0] + 0.5 * tHit, 1.1 - 0.5 * (cp.Ca + cp.Mg), 1e-12);
  check('piper: diamond point inside', pp.dia[1] > 0.2 * h && pp.dia[1] < 2.2 * h);
  check('piper: fields', PIP.diamondField({ Ca: 0.7, Mg: 0.1, NaK: 0.2 }, { HCO3: 0.8, SO4: 0.1, Cl: 0.1 }) === 'Ca-Mg-HCO3' && PIP.diamondField({ Ca: 0.2, Mg: 0.2, NaK: 0.6 }, { HCO3: 0.2, SO4: 0.1, Cl: 0.7 }) === 'Na-K-Cl-SO4' && PIP.diamondField(cp, { HCO3: 0.2, SO4: 0.1, Cl: 0.7 }) === 'Ca-Mg-Cl-SO4');
  check('piper: water type', PIP.waterType({ Ca: 3, Mg: 1.2, Na: 0.8, HCO3: 4, SO4: 0.6, Cl: 0.5 }) === 'Ca-Mg-HCO3');
  check('piper: water type with K added to Na', PIP.waterType({ Ca: 1, Na: 0.5, K: 0.6, Cl: 2 }) === 'Na-Ca-Cl');
  near('piper: hardness', PIP.hardness(2, 1), 150.13035, 1e-9);
}
{
  // Pumping tests. W(u) = E1(u) checked against values from the definition: E1(1) = 0.219383934395520 and
  // E1(u) = -γ - ln u + u - u²/4 + ... for small u.
  near('pump test: W(1)', PT.wellW(1), 0.21938393439552, 1e-12);
  near('pump test: W(1e-6) from the series', PT.wellW(1e-6), -0.5772156649015329 - Math.log(1e-6) + 1e-6 - 0.25e-12, 1e-12);
  // Above 1, compare with a fine numerical integral of e^-x / x.
  const e1 = (u) => { let s = 0; const N = 400000, L = 50; for (let i = 0; i < N; i++) { const x = u + (i + 0.5) * L / N; s += Math.exp(-x) / x; } return s * L / N; };
  near('pump test: W(2.5)', PT.wellW(2.5), e1(2.5), 1e-9);
  near('pump test: W(0.99) and W(1.01) join smoothly', PT.wellW(0.99) - PT.wellW(1.01), 0.02 * Math.exp(-1) / 1, 1e-5);
  check('pump test: W(0) is undefined', Number.isNaN(PT.wellW(0)));
  const Q = 500 / 86400, r = 30, T = 250 / 86400, S = 2e-4;
  const t = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000].map((m) => m * 60), s = t.map((ti) => PT.theis(ti, r, Q, T, S));
  const f = PT.fitTheis(t, s, r, Q);
  near('pump test: Theis fit recovers T', f.T / T, 1, 1e-6); near('pump test: Theis fit recovers S', f.S / S, 1, 1e-6);
  const cj = PT.cooperJacob(t, s, r, Q);
  near('pump test: Cooper-Jacob T on exact data', cj.T / T, 1, 0.02);
  check('pump test: Cooper-Jacob keeps small u only', t.every((ti, i) => !cj.used[i] || PT.uOf(ti, r, cj.T, cj.S) <= 0.05));
  // Cooper-Jacob in its own terms: exact log-linear drawdown gives the exact T and S.
  const tl = [100, 200, 400, 800, 1600], sl = tl.map((ti) => (2.303 * Q / (4 * Math.PI * T)) * Math.log10((2.25 * T * ti) / (r * r * 1e-6)));
  const cjl = PT.cooperJacob(tl, sl, r, Q, 1);
  near('pump test: Cooper-Jacob line T', cjl.T / T, 1, 1e-9); near('pump test: Cooper-Jacob line S', cjl.S / 1e-6, 1, 1e-9);
  const tp = 6e4, tq = [600, 1200, 3000, 6000, 12000], sr = tq.map((x) => (Q / (4 * Math.PI * T)) * (PT.wellW(PT.uOf(tp + x, r, T, S)) - PT.wellW(PT.uOf(x, r, T, S))));
  near('pump test: recovery T', PT.recovery(tq, sr, tp, Q, 1).T / T, 1, 0.01);
  const rs = [5, 10, 20, 40], sd = rs.map((ri) => (2.303 * Q / (2 * Math.PI * T)) * Math.log10(Math.sqrt(2.25 * T * 6e4 / S) / ri));
  const dd = PT.distanceDrawdown(rs, sd, 6e4, Q);
  near('pump test: distance-drawdown T', dd.T / T, 1, 1e-9); near('pump test: distance-drawdown S', dd.S / S, 1, 1e-9);
}
{
  // Slug tests: exact exponential recovery gives T0 back, and Hvorslev K by hand.
  const T0 = 70, t = [0, 10, 20, 40, 80, 160], h = t.map((x) => -0.4 * Math.exp(-x / T0));
  const f = SLG.fitRecovery(t, h, { lo: 0.01, hi: 1 });
  near('slug: basic time lag', f.T0, 70, 1e-9); near('slug: line through H/H0 = 1', f.a, 0, 1e-12);
  check('slug: rising head (negative displacement) handled', f.n === 6 && !f.oscillates);
  const g = SLG.fitRecovery(t, h, { lo: 0.2, hi: 0.9 });
  check('slug: fit window', g.n === 4 && !g.used[0] && g.used[1]);
  check('slug: oscillation flagged', SLG.fitRecovery([0, 1, 2, 3], [1, 0.5, -0.2, 0.1], { lo: 0.05 }).oscillates);
  near('slug: Hvorslev', SLG.hvorslev(0.025, 0.05, 1.5, 70), 0.025 ** 2 * Math.log(30) / (2 * 1.5 * 70), 1e-18);
  near('slug: Bouwer-Rice equals Hvorslev when ln(Re/R) = ln(Le/R)', SLG.bouwerRice(0.025, Math.log(30), 1.5, 70), SLG.hvorslev(0.025, 0.05, 1.5, 70), 1e-18);
  near('slug: effective casing radius', SLG.rcEffective(0.025, 0.05, 0.3), Math.sqrt(0.7 * 0.025 ** 2 + 0.3 * 0.05 ** 2), 1e-15);
}
{
  // Darcy flow, gradient from wells, grain size and Hazen.
  const d = DAR.darcy(1e-4, 0.002, 50, 0.25, 100);
  near('darcy: flux', d.q, 2e-7, 1e-20); near('darcy: discharge', d.Q, 1e-5, 1e-18); near('darcy: seepage velocity', d.v, 8e-7, 1e-20); near('darcy: travel time', d.time, 100 / 8e-7, 1e-3);
  near('darcy: water viscosity at 20 °C about 1.002 mPa·s', DAR.waterViscosity(20) * 1000, 1.002, 0.003);
  near('darcy: water density at 4 °C', DAR.waterDensity(4), 1000, 0.01);
  near('darcy: K to k and back', DAR.KFromk(DAR.kFromK(3e-5, 15), 15), 3e-5, 1e-18);
  const g = DAR.gradient3([0, 100, 0], [0, 0, 100], [10, 9.9, 10.05]);
  near('darcy: three-point gradient', g.i, Math.hypot(0.001, 0.0005), 1e-15);
  near('darcy: flow bearing', g.bearing, 90 + Math.atan(0.0005 / 0.001) * 180 / Math.PI, 1e-9);
  near('darcy: flow due north', DAR.gradient3([0, 10, 0], [0, 0, 10], [5, 5, 4]).bearing % 360, 0, 1e-9);
  const g4 = DAR.gradient3([0, 100, 0, 100], [0, 0, 100, 100], [10, 9.9, 10.05, 9.95]);
  near('darcy: four wells on a plane fit exactly', g4.rms, 0, 1e-12);
  let threw = false; try { DAR.gradient3([0, 1, 2], [0, 1, 2], [1, 2, 3]); } catch { threw = true; }
  check('darcy: wells in a line refused', threw);
  near('darcy: d at a sieve', DAR.dAt([1, 0.1], [50, 10], 10), 0.1, 1e-12);
  near('darcy: d halfway in log size', DAR.dAt([1, 0.1], [50, 10], 30), Math.sqrt(0.1), 1e-12);
  const gr = DAR.gradation([4, 2, 1, 0.5, 0.25], [100, 80, 60, 30, 10]);
  near('darcy: d10', gr.d10, 0.25, 1e-12); near('darcy: Cu', gr.Cu, 4, 1e-12); near('darcy: Cc', gr.Cc, 1, 1e-12);
  near('darcy: Hazen, d10 0.2 mm and C 100 gives 0.04 cm/s', DAR.hazen(0.2, 100), 4e-4, 1e-15);
}
{
  // Well field: superposition, image wells, contours and the capture zone.
  const w1 = { name: 'A', x: 0, y: 0, Q: 800, t0: 0 }, w2 = { name: 'B', x: 300, y: 0, Q: 500, t0: 5 };
  const T = 500, S = 1e-4, one = (w, x, y, t) => WF.drawdown(x, y, t, [w], T, S);
  near('well field: superposition adds', WF.drawdown(100, 50, 20, [w1, w2], T, S), one(w1, 100, 50, 20) + one(w2, 100, 50, 20), 1e-12);
  near('well field: later start shifts time', one(w2, 100, 50, 20), PT.theis(15, Math.hypot(200, 50), 500, T, S), 1e-12);
  check('well field: nothing before a well starts', one(w2, 100, 50, 4) === 0);
  const head = WF.withImages([w1], { kind: 'head', axis: 'x', at: 100 });
  check('well field: constant-head image', head.length === 2 && head[1].x === 200 && head[1].Q === -800);
  near('well field: zero drawdown on a constant-head line', WF.drawdown(100, 37, 30, head, T, S), 0, 1e-12);
  const nf = WF.withImages([w1], { kind: 'noflow', axis: 'y', at: -50 });
  check('well field: no-flow image', nf[1].y === -100 && nf[1].Q === 800);
  near('well field: no-flow line has no gradient across it', (WF.drawdown(20, -49.9, 30, nf, T, S) - WF.drawdown(20, -50.1, 30, nf, T, S)), 0, 1e-12);
  // Contours of z = x on a grid: the level-1.5 line is the vertical x = 1.5.
  const xs = [0, 1, 2, 3], ys = [0, 1, 2], z = ys.map(() => xs.slice()), seg = WF.contour(z, xs, ys, 1.5);
  check('well field: contour', seg.length === 2 && seg.every((g) => g[0] === 1.5 && g[2] === 1.5));
  const cz = WF.captureZone(800, 20, 0.05);
  near('well field: stagnation point', cz.stagnation, 800 / (2 * Math.PI * 20 * 0.05), 1e-9);
  near('well field: width at the well', 2 * cz.halfWidthAtWell, 400, 1e-9);
  const mid = cz.pts.reduce((b, p) => (Math.abs(p[0]) < Math.abs(b[0]) ? p : b));
  near('well field: divide crosses the well line at Q/(4Bq)', Math.abs(mid[1]), 200, 5);
}
{
  // Grade-tonnage and cut-offs.
  const b = [{ t: 100, g: 0.2 }, { t: 200, g: 0.5 }, { t: 100, g: 1.0 }];
  const a = GTN.above(b, 0.5);
  check('grade-tonnage: tonnes above', a.t === 300); near('grade-tonnage: mean grade above', a.g, (200 * 0.5 + 100) / 300, 1e-12);
  check('grade-tonnage: nothing above the top', GTN.above(b, 2).t === 0 && Number.isNaN(GTN.above(b, 2).g));
  const cv = GTN.curve(b, 10);
  check('grade-tonnage: curve falls', cv.every((c, i) => i === 0 || c.t <= cv[i - 1].t) && cv[0].t === 400);
  const v = GTN.netValue(9000, 500, 0.02, 'pct');
  near('grade-tonnage: net value per %', v, 83.2, 1e-12);
  const co = GTN.cutoffs(v, 0.88, 2.5, 9, 2);
  near('grade-tonnage: breakeven cut-off', co.breakeven, 13.5 / (83.2 * 0.88), 1e-12); near('grade-tonnage: marginal cut-off', co.marginal, 11 / (83.2 * 0.88), 1e-12);
  near('grade-tonnage: margin is zero at breakeven grade', GTN.margin(1000, co.breakeven, v, 0.88, 13.5), 0, 1e-9);
  near('grade-tonnage: gold in g/t', GTN.cutoffs(GTN.netValue(2000 / GTN.TROY_OZ, 0, 0, 'gpt'), 0.9, 3, 15, 2).breakeven, 20 / (2000 / 31.1034768 * 0.9), 1e-12);
}
// Drill hole composites and intercepts (worked by hand).
{
  const H = [[0, 2, 0.1, 'OX'], [2, 4, 3, 'QV'], [4, 5, 0.2, 'QV'], [5, 7, 2, 'QV'], [7, 8, 0.05, 'SED'], [8, 10, 0.1, 'SED'], [10, 11, 5, 'QV']].map(([from, to, g, lith]) => ({ hole: 'H', from, to, g, lith }));
  const a = DH.intercepts(H, 0.5, 2, 1);
  check('drillhole: two intercepts with 2 m dilution', a.length === 2 && a[0].from === 2 && a[0].to === 7 && a[0].dilution === 1 && a[1].from === 10);
  near('drillhole: first intercept grade', a[0].g, 2.04, 1e-9);
  const b = DH.intercepts(H, 0.5, 3, 1);
  check('drillhole: 3 m dilution joins them', b.length === 1 && b[0].len === 9 && b[0].dilution === 4);
  near('drillhole: joined grade', b[0].g, 15.45 / 9, 1e-9);
  check('drillhole: minimum length drops the short one', DH.intercepts(H, 0.5, 2, 2).length === 1);
  check('drillhole: intercept text', DH.fmtIntercept(a[0], 'g/t') === '5.0 m @ 2.04 g/t from 2.0 m');
  const c = DH.composites(H, 4, 'half');
  check('drillhole: half rule keeps a 3 m tail', c.length === 3 && c[2].from === 8 && c[2].to === 11);
  near('drillhole: composite 1', c[0].g, 1.55, 1e-9); near('drillhole: composite 2', c[1].g, 1.0625, 1e-9); near('drillhole: tail composite', c[2].g, 5.2 / 3, 1e-9);
  const m = DH.composites(H, 4, 'merge');
  check('drillhole: merge rule', m.length === 2 && m[1].len === 7); near('drillhole: merged grade', m[1].g, 9.45 / 7, 1e-9);
  check('drillhole: drop rule', DH.composites(H, 4, 'drop').length === 2 && DH.composites(H, 4, 'keep').length === 3);
  const e = DH.composites(H, 4, 'equal'); near('drillhole: equal lengths', e[1].len, 11 / 3, 1e-9);
  check('drillhole: half rule merges a short tail', DH.composites(H, 5, 'half').map((x) => x.to).join() === '5,11');
  const l = DH.lithComposites(H);
  check('drillhole: lithology runs', l.map((x) => x.lith).join() === 'OX,QV,SED,QV'); near('drillhole: QV run grade', l[1].g, 10.2 / 5, 1e-9);
  const iss = DH.validate([{ hole: 'A', from: 0, to: 2, g: 1 }, { hole: 'A', from: 3, to: 4, g: 1 }, { hole: 'A', from: 3.5, to: 5, g: 1 }, { hole: 'A', from: 6, to: 6, g: 1 }]);
  check('drillhole: gap, overlap and bad row found', iss.map((x) => `${x.kind}${x.from}-${x.to}`).join() === 'gap2-3,overlap3.5-4,bad6-6');
  const cl = DH.clean([{ hole: 'A', from: 3, to: 4, g: 1 }, { hole: 'A', from: 3.5, to: 5, g: 2 }]);
  check('drillhole: overlap trimmed', cl[1].from === 4);
  // An unsampled gap counts as zero-grade waste in an intercept but is left out of a composite grade.
  const G = [{ hole: 'G', from: 0, to: 1, g: 2 }, { hole: 'G', from: 2, to: 3, g: 2 }];
  near('drillhole: gap is waste in intercepts', DH.intercepts(G, 1, 1, 0)[0].g, 4 / 3, 1e-9);
  near('drillhole: gap left out of composites', DH.composites(G, 3, 'keep')[0].g, 2, 1e-9);
  check('drillhole: thin coverage composite dropped', DH.composites(G, 1, 'keep').length === 2);
}

// Traverses (worked by hand on a 100 m square and simple triangles).
{
  near('traverse: DMS', TRV.parseAngle('45 30 15'), 45.50416666666667, 1e-12);
  near('traverse: DMS symbols', TRV.parseAngle("45°30'15\""), 45.50416666666667, 1e-12);
  near('traverse: dashes', TRV.parseAngle('45-30-15'), 45.50416666666667, 1e-12);
  near('traverse: quadrant SW', TRV.parseAngle('S 30 W'), 210, 1e-12);
  near('traverse: quadrant NW', TRV.parseAngle('N45°30\'W'), 314.5, 1e-12);
  near('traverse: gons', TRV.parseAngle('150', 'gon') * 0.9, 135, 1e-12);
  check('traverse: bad minutes rejected', Number.isNaN(TRV.parseAngle('45 61 00')) && Number.isNaN(TRV.parseAngle('abc')));
  check('traverse: DMS text', TRV.fmtDMS(45.50416666666667) === '45°30′15″' && TRV.fmtDMS(10.99999999) === '11°00′00″');
  check('traverse: quadrant text', TRV.fmtQuadrant(210) === 'S 30°00′00″ W' && TRV.fmtQuadrant(135) === 'S 45°00′00″ E');
  const legs = [{ az: 0, d: 100.02 }, { az: 90, d: 100 }, { az: 180, d: 99.97 }, { az: 270, d: 100.03 }];
  const c = TRV.close(legs, { E: 1000, N: 1000 }, null, 'bowditch');
  near('traverse: misclosure N', c.fN, 0.05, 1e-9); near('traverse: misclosure E', c.fE, -0.03, 1e-9);
  near('traverse: precision', c.precision, 400.02 / Math.hypot(0.05, 0.03), 1e-6);
  near('traverse: Bowditch correction', c.cN[0], -0.05 * 100.02 / 400.02, 1e-12);
  near('traverse: Bowditch closes', Math.hypot(c.adj[4].E - 1000, c.adj[4].N - 1000), 0, 1e-9);
  const t = TRV.close(legs, { E: 1000, N: 1000 }, null, 'transit');
  near('traverse: transit puts N error on N legs', t.cN[0], -0.05 * 100.02 / 199.99, 1e-12);
  check('traverse: transit leaves E of N legs', Math.abs(t.cE[0]) < 1e-12 && Math.hypot(t.adj[4].E - 1000, t.adj[4].N - 1000) < 1e-9);
  near('traverse: area of the adjusted square', TRV.area(c.adj.slice(0, 4)), 10000, 1);
  near('traverse: shoelace', TRV.area([{ E: 0, N: 0 }, { E: 4, N: 0 }, { E: 4, N: 3 }]), 6, 1e-12);
  const link = TRV.close([{ az: 90, d: 50 }, { az: 90, d: 50.1 }], { E: 0, N: 0 }, { E: 100, N: 0 });
  near('traverse: link misclosure', link.fE, 0.1, 1e-9); near('traverse: link adjusted end', link.adj[2].E, 100, 1e-9);
  // Square walked anticlockwise: interior angles 90; one angle 20″ too big.
  const a = TRV.anglesToAzimuths([90, 90 + 20 / 3600, 90, 90], 0);
  near('traverse: angular misclosure', a.misclosure * 3600, 20, 1e-6);
  check('traverse: interior sum', a.interior === 360);
  near('traverse: adjusted azimuths', a.az[1], 270 + 15 / 3600, 1e-9);
  near('traverse: adjusted last azimuth', a.az[3], 90 + 5 / 3600, 1e-9);
  const inv = TRV.inverse({ E: 0, N: 0 }, { E: -3, N: -4 });
  near('traverse: inverse distance', inv.d, 5, 1e-12); near('traverse: inverse azimuth', inv.az, 180 + Math.atan(3 / 4) * 180 / Math.PI, 1e-9);
  const bb = TRV.bearingBearing({ E: 0, N: 0 }, 45, { E: 100, N: 0 }, 315);
  near('traverse: bearing-bearing E', bb.E, 50, 1e-9); near('traverse: bearing-bearing N', bb.N, 50, 1e-9);
  check('traverse: parallel lines', TRV.bearingBearing({ E: 0, N: 0 }, 10, { E: 5, N: 0 }, 190) === null);
  const dd = TRV.distanceDistance({ E: 0, N: 0 }, 5, { E: 8, N: 0 }, 5);
  check('traverse: distance-distance', dd.length === 2 && Math.abs(dd[0].E - 4) < 1e-9 && Math.abs(dd[0].N - 3) < 1e-9 && Math.abs(dd[1].N + 3) < 1e-9);
  check('traverse: circles too far apart', TRV.distanceDistance({ E: 0, N: 0 }, 1, { E: 8, N: 0 }, 1).length === 0);
}

// Level book (worked by hand).
{
  const book = [{ name: 'BM1', bs: 1.5, dist: 0 }, { name: 'P1', is: 1.2, dist: 30 }, { name: 'CP1', fs: 0.8, bs: 2.1, dist: 30 }, { name: 'P2', is: 2.5, dist: 40 }, { name: 'BM2', fs: 1.0, dist: 20 }];
  check('levelling: good book has no errors', LVL.bookErrors(book).length === 0);
  const r = LVL.reduce(book, 100);
  check('levelling: HoC RLs', r.map((x) => x.rlHoc.toFixed(3)).join() === '100.000,100.300,100.700,100.300,101.800');
  check('levelling: rise and fall RLs agree', r.every((x) => Math.abs(x.rlRf - x.rlHoc) < 1e-9));
  near('levelling: second HI', r[2].hi, 102.8, 1e-9);
  check('levelling: rises and falls', Math.abs(r[3].fall - 0.4) < 1e-9 && Math.abs(r[4].rise - 1.5) < 1e-9);
  const c = LVL.checks(r);
  near('levelling: ΣBS − ΣFS', c.bsFs, 1.8, 1e-9);
  check('levelling: all checks close', [c.hocDiff, c.rfDiff, c.rlDiff, c.fullHoc].every((x) => Math.abs(x) < 1e-9) && c.setups === 2);
  near('levelling: Σrise', c.sRise, 2.2, 1e-9);
  const a = LVL.adjust(r, 101.79, 'setup');
  near('levelling: closing error', a.error, 0.01, 1e-9);
  check('levelling: correction by setup', a.corr.map((x) => (x * 1000).toFixed(1)).join() === '0.0,-5.0,-5.0,-10.0,-10.0');
  near('levelling: adjusted closing RL', a.adj[4], 101.79, 1e-9);
  const d = LVL.adjust(r, 101.79, 'distance');
  near('levelling: correction by distance', d.corr[2], -0.01 * 60 / 120, 1e-12);
  check('levelling: chainage mode', LVL.reduce([{ name: 'A', bs: 1, dist: 100 }, { name: 'B', fs: 1, dist: 150 }], 0, 'chainage')[1].chain === 150);
  near('levelling: allowable', LVL.allowable(12, 4), 24, 1e-12);
  check('levelling: IS with FS flagged', LVL.bookErrors([{ name: 'A', bs: 1 }, { name: 'B', is: 1, fs: 2 }]).some((x) => /intermediate/.test(x.msg)));
  const bad = LVL.bookErrors([{ name: 'A', is: 1 }, { name: 'B', bs: 1 }, { name: 'C', is: 1 }]);
  check('levelling: book errors', bad.length === 3 && bad.some((x) => /change point/.test(x.msg)) && bad.some((x) => /last reading/.test(x.msg)));
}

// GPS tracks.
{
  near('gps: 1° of longitude on the sphere', GPS.haversine(0, 0, 0, 1), 2 * Math.PI * 6371008.8 / 360, 1e-6);
  near('gps: 1° on the WGS84 equator', GPS.vincenty(0, 0, 0, 1).d, 6378137 * Math.PI / 180, 1e-6);
  // Flinders Peak to Buninyong, the standard Vincenty test line: 54 972.271 m, forward azimuth 306°52′05.37″.
  const dms = (d, m, s) => Math.sign(d) * (Math.abs(d) + m / 60 + s / 3600);
  const fb = GPS.vincenty(dms(-37, 57, 3.7203), dms(144, 25, 29.5244), dms(-37, 39, 10.1561), dms(143, 55, 35.3839));
  near('gps: Vincenty test line distance', fb.d, 54972.271, 0.005);
  near('gps: Vincenty test line azimuth', fb.az, dms(306, 52, 5.37), 1 / 3600);
  check('gps: same point', GPS.vincenty(10, 20, 10, 20).d === 0);
  check('gps: nearly antipodal falls back', Number.isFinite(GPS.vincenty(0, 0, 0.5, 179.7).d));
  near('gps: ISO time', GPS.parseTime('2026-01-01T00:00:10Z') - GPS.parseTime('2026-01-01T00:00:00Z'), 10000, 0);
  // Due north along a meridian, 100 m steps (on the sphere) every 20 s, then a 60 s stop, then a spike.
  const dLat = 100 / (6371008.8 * Math.PI / 180);
  const pts = [0, 1, 2, 3].map((k) => ({ lat: k * dLat, lon: 0, t: k * 20000, ele: [100, 101, 106, 104][k], seg: 0 }));
  pts.push({ lat: 3 * dLat, lon: 0, t: 120000, ele: 104, seg: 0 }, { lat: 3 * dLat + 1, lon: 0, t: 121000, ele: 104, seg: 0 }, { lat: 4 * dLat, lon: 0, t: 140000, ele: 98, seg: 0 });
  const a = GPS.analyse(pts, { moveSpeed: 0.5, spikeSpeed: 50, eleStep: 3, ellipsoid: false });
  check('gps: spike dropped', a.spikes === 1);
  near('gps: distance without the spike', a.dist, 400, 1e-6);
  near('gps: moving time (the 60 s stop left out)', a.moving, 80, 1e-9);
  near('gps: elapsed', a.elapsed, 140, 1e-9);
  near('gps: max speed', a.maxV, 5, 1e-9);
  check('gps: climbing with a 3 m step', a.gain === 6 && a.loss === 8);
  const sp = GPS.splits(pts, a.cum, 150);
  check('gps: splits', sp.length === 2 && Math.abs(sp[0].time - 30) < 1e-9 && Math.abs(sp[1].split - 30) < 1e-9);
  const segs = [{ lat: 0, lon: 0, seg: 0 }, { lat: dLat, lon: 0, seg: 0 }, { lat: 5, lon: 5, seg: 1 }, { lat: 5 + dLat, lon: 5, seg: 1 }];
  const s2 = GPS.analyse(segs, { moveSpeed: 0.5, spikeSpeed: 50, eleStep: 3, ellipsoid: false });
  check('gps: no distance across a segment gap', Math.abs(s2.dist - 200) < 1e-6 && s2.gaps === 1 && !s2.timed);
  const zig = Array.from({ length: 11 }, (_, k) => ({ lat: 0, lon: (k * 100) / 111195 + (k % 2 ? 0 : 0), seg: 0 }));
  zig[5] = { lat: 30 / 111195, lon: zig[5].lon, seg: 0 };
  check('gps: thinning keeps the bump only', GPS.thin(zig, 10).length === 5 && GPS.thin(zig, 25).length === 3 && GPS.thin(zig, 50).length === 2);
  const noisy = [100, 102, 100, 102, 100, 102].map((ele, k) => ({ lat: 0, lon: k * 1e-4, ele, seg: 0 }));
  check('gps: height noise below the step is not climbing', GPS.analyse(noisy, { moveSpeed: 0.5, spikeSpeed: 50, eleStep: 5, ellipsoid: false }).gain === 0 && GPS.analyse(noisy, { moveSpeed: 0.5, spikeSpeed: 50, eleStep: 0, ellipsoid: false }).gain === 6);
  check('gps: durations', GPS.fmtDuration(3725) === '1:02:05' && GPS.fmtDuration(247) === '4:07');
}

// TIFF reader (fixtures written with Pillow/libtiff) and writer; spectral indices.
{
  const { readFileSync } = await import('node:fs');
  const fx = (f) => { const b = readFileSync(new URL('./fixtures/' + f, import.meta.url)); return b.buffer.slice(b.byteOffset, b.byteOffset + b.length); };
  for (const f of ['u16-lzw.tif', 'u16-deflate.tif', 'u16-lzw-pred.tif']) {
    const r = TIF.readTiff(fx(f));
    check(`tiff: ${f}`, r.width === 37 && r.height === 23 && r.bands.length === 1 && r.bands[0][2 * 37 + 3] === 539 && r.bands[0][36] === 252);
  }
  const rgb = TIF.readTiff(fx('rgb-packbits.tif'));
  check('tiff: PackBits RGB', rgb.bands.length === 3 && rgb.bands[0][77] === 77 && rgb.bands[1][5] === 15 && rgb.bands[2][400] === 200);
  for (const f of ['f32-lzw.tif', 'f32-deflate-pred3.tif']) near(`tiff: ${f}`, TIF.readTiff(fx(f)).bands[0][2 * 37 + 3], 2.7, 1e-6);
  const big = TIF.readTiff(fx('u8-lzw-big.tif'));
  check('tiff: long LZW stream (12-bit codes, table resets)', big.bands[0].reduce((s, x) => s + x, 0) === 801247 && big.bands[0][100 * 160 + 57] === 24);
  let msg = '';
  try { TIF.readTiff(new Uint8Array([0x49, 0x49, 43, 0, 8, 0, 0, 0]).buffer); } catch (e) { msg = e.message; }
  check('tiff: BigTIFF explained', /BigTIFF/.test(msg));
  // Round trip with georeferencing (UTM-like, metres) and Deflate.
  const geoTags = new Map([[33550, { type: 12, count: 3, values: [30, 30, 0] }], [33922, { type: 12, count: 6, values: [0, 0, 0, 500000, 4600000, 0] }], [34735, { type: 3, count: 12, values: [1, 1, 0, 2, 1024, 0, 1, 1, 3072, 0, 1, 32617] }]]);
  const b1 = Float32Array.from({ length: 50 * 20 }, (_, i) => i / 7), b2 = Float32Array.from({ length: 1000 }, (_, i) => (i % 3 ? -i : NaN));
  for (const z of [false, true]) {
    const back = TIF.readTiff(TIF.writeTiff(50, 20, [b1, b2], geoTags, z).buffer);
    check(`tiff: round trip${z ? ' (Deflate)' : ''}`, back.width === 50 && back.height === 20 && back.bands[0][999] === b1[999] && back.bands[1][4] === -4 && Number.isNaN(back.bands[1][3]));
    check(`tiff: georeferencing kept${z ? ' (Deflate)' : ''}`, back.geo.model === 1 && back.geo.epsg === 32617 && back.geo.scale[0] === 30 && back.geo.tie[2] === 500000);
  }
  // Indices on single values.
  const one = (v) => Float32Array.of(v);
  const bands = { blue: one(0.04), green: one(0.08), red: one(0.05), nir: one(0.4), swir1: one(0.2), swir2: one(0.1) };
  const get = (id) => SPX.computeIndex(SPX.INDICES.find((d) => d.id === id), bands, 1)[0];
  near('spectral: NDVI', get('ndvi'), 0.35 / 0.45, 1e-6);
  near('spectral: NDWI', get('ndwi'), -0.32 / 0.48, 1e-6);
  near('spectral: MNDWI', get('mndwi'), -0.12 / 0.28, 1e-6);
  near('spectral: NBR', get('nbr'), 0.3 / 0.5, 1e-6);
  near('spectral: NDBI', get('ndbi'), -0.2 / 0.6, 1e-6);
  near('spectral: EVI', get('evi'), 2.5 * 0.35 / (0.4 + 0.3 - 0.3 + 1), 1e-6);
  near('spectral: SAVI', SPX.computeIndex(SPX.INDICES.find((d) => d.id === 'savi'), bands, 1, 1, 0, 0.5)[0], 1.5 * 0.35 / 0.95, 1e-6);
  near('spectral: scale and offset', SPX.computeIndex(SPX.INDICES[0], { nir: one(20000), red: one(9000) }, 1, 0.0000275, -0.2)[0], (0.35 - 0.0475) / (0.35 + 0.0475), 1e-5);
  near('spectral: custom', SPX.computeIndex('custom', { a: one(3), b: one(1) }, 1)[0], 0.5, 1e-9);
  check('spectral: missing input gives no value', Number.isNaN(SPX.computeIndex(SPX.INDICES[0], { nir: one(NaN), red: one(1) }, 1)[0]));
  const st = SPX.stats(Float32Array.of(1, 2, 3, 4, NaN));
  check('spectral: stats', st.n === 4 && st.mean === 2.5 && st.median === 2.5 && st.min === 1 && Math.abs(st.sd - Math.sqrt(5 / 3)) < 1e-12);
  const th = SPX.threshold(Float32Array.of(0.1, 0.5, 0.7, NaN), 0.3);
  check('spectral: threshold', th.count === 2 && th.valid === 3);
  check('spectral: histogram', SPX.histogram(Float32Array.of(0, 0.1, 0.99, 1), 0, 1, 10).map((h) => h.count).join() === '1,1,0,0,0,0,0,0,0,2');
  check('spectral: projected pixel area', SPX.rowAreas(3, { model: 1, scale: [30, 30] })[2] === 900);
  // A 1° × 1° cell at the equator on the sphere: R² × (π/180) × sin 1°.
  near('spectral: geographic pixel area', SPX.rowAreas(1, { model: 2, scale: [1, 1], tie: [0, 0, 0, 1] })[0], 6371008.8 ** 2 * (Math.PI / 180) * Math.sin(Math.PI / 180), 1);
}

// Sounding (#136): Bolton es and θe, LCL, moist adiabat, CAPE/CIN, indices; references computed with MetPy 1.7 (BSD) on made-up soundings.
{
  near('sounding: es(20 °C) Bolton', SND.es(20), 23.37, 0.01);
  near('sounding: es(0 °C)', SND.es(0), 6.112, 1e-9);
  near('sounding: dew point round trip', SND.tdFromW(850, SND.mixr(850, 12.3)), 12.3, 1e-9);
  near('sounding: saturation mixing ratio 1000 hPa 20 °C (MetPy 0.014868)', SND.mixr(1000, 20), 0.014868, 0.00005);
  near('sounding: θe 850 hPa 20/15 °C (MetPy 345.68 K)', SND.thetaE(850, 20, 15), 345.676, 0.05);
  near('sounding: moist adiabat 1000→500 hPa from 20 °C (MetPy −8.48)', SND.moist(1000, 20, 500), -8.485, 0.05);
  const L = SND.lcl(1000, 30, 20);
  near('sounding: LCL pressure (MetPy 864.2 hPa)', L.p, 864.2, 1);
  near('sounding: LCL temperature (MetPy 17.66 °C)', L.t, 17.66, 0.05);
  near('sounding: θ at 850 hPa, 10 °C', SND.theta(850, 10), 283.15 * (1000 / 850) ** SND.KAPPA, 1e-9);
  const demo = '985 30.0 20.0 170 10\n950 26.6 18.8 180 18\n925 24.2 18.0 190 22\n900 22.0 16.6 200 25\n850 18.6 13.4 210 28\n800 15.0 9.0 220 30\n750 11.2 3.5 230 32\n700 7.4 -2.6 235 35\n650 3.4 -9.0 240 38\n600 -0.8 -14.5 245 42\n550 -5.4 -19.0 250 46\n500 -10.4 -24.0 250 50\n450 -15.9 -30.5 255 55\n400 -22.1 -36.0 255 60\n350 -29.2 -42.0 260 66\n300 -37.4 -49.0 260 72\n250 -46.8 -57.0 265 78\n200 -55.6 -65.0 265 80\n150 -60.5 -73.0 270 65\n100 -63.0 -80.0 270 45';
  const ps = SND.parseSounding(demo);
  check('sounding: headerless 5-column table read', ps.levels.length === 20 && ps.levels[0].dir === 170 && ps.levels[19].spd === 45 && ps.levels[3].td === 16.6);
  const sb = SND.analyse(ps.levels, 'sb');
  near('sounding: SBCAPE (MetPy 2849 J/kg, within 2 %)', sb.cape, 2849, 57);
  check('sounding: SBCIN 0 (MetPy 0)', sb.cin === 0);
  near('sounding: LCL (MetPy 851.2 hPa)', sb.lcl.p, 851.2, 1);
  near('sounding: EL (MetPy 188.0 hPa)', sb.el.p, 188.0, 1.5);
  check('sounding: LFC just above the LCL', sb.lfc.p < sb.lcl.p && sb.lfc.p > 800);
  near('sounding: lifted index (MetPy −7.41)', sb.li, -7.41, 0.1);
  near('sounding: Showalter (MetPy −3.66)', sb.showalter, -3.66, 0.1);
  near('sounding: K index (MetPy 32.4)', sb.k, 32.4, 1e-6);
  near('sounding: total totals (MetPy 52.8)', sb.tt, 52.8, 1e-6);
  near('sounding: precipitable water (MetPy 36.72 mm)', sb.pw, 36.72, 0.1);
  const nv = SND.analyse(ps.levels, 'sb', { virtual: false });
  near('sounding: LFC without virtual correction (MetPy 813.7 hPa)', nv.lfc.p, 813.7, 1.5);
  check('sounding: virtual correction raises CAPE', sb.cape > nv.cape);
  const ml = SND.startParcel(ps.levels, 'ml');
  near('sounding: mixed parcel T (MetPy 29.76 °C)', ml.t, 29.763, 0.02);
  near('sounding: mixed parcel Td (MetPy 18.98 °C)', ml.td, 18.978, 0.03);
  near('sounding: MLCAPE (MetPy 2238, within 3 %)', SND.analyse(ps.levels, 'ml').cape, 2238, 70);
  // Shear: 10 kt from 170° at the ground, wind at 6 km interpolated.
  check('sounding: 0–6 km shear about 52 kt', Math.abs(sb.shear06 - 52.1) < 0.5 && sb.shear01 > 15 && sb.shear01 < 22);
  near('sounding: freezing level ≈ 4.05 km', sb.freezing, 4052, 15);
  // Hypsometric heights: thickness 1000→500 hPa of an isothermal 0 °C dry layer = Rd·T/g·ln 2.
  const z = SND.heights([{ p: 1000, t: 0 }, { p: 500, t: 0 }], 0);
  near('sounding: hypsometric thickness', z[1], (SND.RD * 273.15 / SND.G) * Math.log(2), 1e-6);
  // Elevated instability over a cold surface: no surface CAPE, MU parcel from 800 hPa (MetPy MUCAPE 368.7, MUCIN −0.77).
  const el = SND.parseSounding('1000 2.0 0.0 90 10\n950 1.0 -1.0 120 20\n900 8.0 7.0 200 35\n850 10.0 9.5 220 45\n800 7.5 7.0 230 50\n750 4.2 3.8 235 52\n700 0.6 0.0 240 55\n650 -3.4 -4.5 245 58\n600 -7.6 -10.0 250 60\n550 -12.2 -16.0 250 64\n500 -17.4 -24.0 255 68\n400 -29.4 -38.0 260 75\n300 -44.0 -52.0 260 85\n250 -52.5 -60.0 265 90\n200 -56.0 -68.0 265 80').levels;
  const esb = SND.analyse(el, 'sb'), emu = SND.analyse(el, 'mu');
  check('sounding: cold surface has no SBCAPE', esb.cape === 0 && esb.lfc === null);
  check('sounding: MU parcel at 800 hPa', emu.start.p === 800);
  near('sounding: MUCAPE (MetPy 368.7)', emu.cape, 368.7, 10);
  near('sounding: MUCIN (MetPy −0.77)', emu.cin, -0.77, 0.3);
  // Parsers: Wyoming fixed-width text with blank cells, header names, m/s and kelvin.
  const wy = ['-----------------------------------------------------------------------------', '   PRES   HGHT   TEMP   DWPT   RELH   MIXR   DRCT   SKNT   THTA   THTE   THTV', '    hPa     m      C      C      %    g/kg    deg   knot     K      K      K ', '-----------------------------------------------------------------------------', ' 1000.0    111                                                               ', '  985.0    250   30.0   20.0     55  15.21    170     10  304.4  350.0  307.1', '  850.0   1500   18.6   13.4     72  11.37    210     28  304.6  338.9  306.7', '  500.0   5800  -10.4  -24.0     31   0.71    250     50  320.4  322.9  320.5', ['30.0', '24000', '-50.0', '', '', '', '270', '40', '700.0', '', ''].map((c) => c.padStart(7)).join(''), '', 'Station information and sounding indices'].join('\n');
  const w = SND.parseSounding(wy);
  check('sounding: Wyoming text read, below-ground level skipped', w.format === 'University of Wyoming text' && w.levels.length === 4 && w.levels[0].p === 985 && w.levels[0].z === 250);
  check('sounding: Wyoming missing dew point and wind kept as blanks', w.levels[3].td === undefined && w.levels[3].dir === 270 && w.levels[3].spd === 40 && w.levels[2].dir === 250);
  const hd = SND.parseSounding('Pressure,Height,Temperature (K),Dewpoint (K),Wind dir,Wind speed (m/s)\n1000,100,300.15,290.15,180,5.14444\n900,1000,293.15,283.15,200,10.28888\n800,2000,286.15,275.15,220,15.43332');
  check('sounding: header names, kelvin and m/s converted', hd.levels.length === 3 && Math.abs(hd.levels[0].t - 27) < 1e-9 && Math.abs(hd.levels[1].td - 10) < 1e-9 && Math.abs(hd.levels[0].spd - 10) < 1e-3 && hd.levels[2].z === 2000 && /kelvin/.test(hd.note));
  check('sounding: tidy sorts and drops repeats', SND.tidy([{ p: 500, t: -10 }, { p: 1000, t: 20 }, { p: 500, t: -9 }, { p: NaN, t: 1 }]).length === 2);
  let threw = ''; try { SND.analyse([{ p: 1000, t: 20 }, { p: 900, t: 12 }, { p: 800, t: 5 }]); } catch (e) { threw = e.message; }
  check('sounding: needs a surface dew point', /dew point/.test(threw));
}

// Köppen (#137): made-up stations worked by hand against the Peel et al. (2007) rules; Walter-Lieth scale; parser.
{
  const med = [[10, 11, 13, 15, 19, 23, 26, 26, 23, 19, 14, 11], [80, 70, 55, 40, 25, 8, 2, 5, 25, 60, 85, 95]];
  const r = KOP.koppen(...med);
  check('koppen: Mediterranean Csa', r.code === 'Csa' && r.name === 'Mediterranean, hot summer');
  near('koppen: MAT', r.m.MAT, 17.5, 1e-12); near('koppen: MAP', r.m.MAP, 550, 1e-12);
  near('koppen: winter share → Pthreshold = 2·MAT', KOP.pThreshold(r.m).v, 35, 1e-12);
  check('koppen: summer half Apr–Sep, Psdry 2, Pwwet 95', r.m.nhSummer && r.m.Psdry === 2 && r.m.Pwwet === 95);
  check('koppen: explanation steps', r.steps.map((s) => s.result).filter(Boolean).join('>') === 'not E>not B>C (temperate)>s (dry summer)>a (hot summer)');
  const cls = (T, P, o) => KOP.koppen(T, P, o).code;
  check('koppen: hot desert BWh', cls([14, 16, 20, 25, 30, 33, 34, 33, 31, 26, 19, 15], [5, 4, 3, 1, 0, 0, 0, 0, 0, 1, 3, 5]) === 'BWh');
  check('koppen: monsoon Am (driest 20 mm ≥ 100 − 2540/25)', cls([26, 27, 28, 29, 28, 27, 27, 27, 27, 27, 27, 26], [20, 25, 40, 120, 300, 450, 500, 450, 350, 200, 60, 25]) === 'Am');
  check('koppen: rainforest Af', cls(Array(12).fill(27), Array(12).fill(200)) === 'Af');
  check('koppen: savanna Aw (dry month in winter)', cls([24, 25, 27, 29, 29, 28, 27, 27, 27, 27, 26, 24], [5, 5, 10, 30, 120, 200, 250, 250, 180, 80, 15, 5]) === 'Aw');
  check('koppen: humid continental Dfb', cls([-12, -10, -3, 6, 13, 18, 21, 19, 13, 6, -2, -9], [30, 25, 35, 50, 70, 90, 100, 90, 70, 55, 45, 35]) === 'Dfb');
  check('koppen: southern hemisphere oceanic Cfb (summer = Oct–Mar)', cls([17, 17, 16, 14, 11, 9, 8, 9, 10, 12, 14, 16], [60, 55, 65, 75, 90, 95, 100, 95, 80, 70, 65, 60]) === 'Cfb' && !KOP.metrics([17, 17, 16, 14, 11, 9, 8, 9, 10, 12, 14, 16], Array(12).fill(1)).nhSummer);
  check('koppen: tundra ET and ice cap EF', cls([-28, -27, -25, -17, -6, 3, 7, 6, 1, -9, -20, -25], [10, 8, 9, 9, 12, 25, 35, 40, 25, 18, 12, 10]) === 'ET' && cls(Array(12).fill(-20), Array(12).fill(1)) === 'EF');
  // E before B: an ice cap with almost no precipitation stays EF.
  check('koppen: E takes precedence over B', cls(Array(12).fill(-30), Array(12).fill(0)) === 'EF');
  // Dry winter monsoon with a hot summer: Cwa.
  check('koppen: Cwa', cls([3, 6, 12, 18, 23, 27, 28, 27, 23, 17, 10, 4], [10, 12, 25, 60, 110, 180, 230, 210, 120, 50, 20, 8]) === 'Cwa');
  // Coldest month −2 °C: D with Peel's 0 °C, C with Köppen's −3 °C.
  const edge = [[-2, 0, 5, 11, 16, 20, 23, 22, 17, 11, 5, 0], Array(12).fill(70)];
  check('koppen: C/D boundary option', cls(...edge) === 'Dfa' && cls(...edge, { cdBoundary: -3 }) === 'Cfa');
  // Cold steppe at MAT < 18 (k), hot by the coldest-month rule (coldest month 2 °C > 0).
  const steppe = [[2, 4, 9, 14, 19, 24, 27, 26, 21, 15, 8, 3], [25, 20, 30, 35, 30, 15, 8, 10, 15, 25, 30, 30]];
  check('koppen: BSk by MAT, BSh by coldest month', cls(...steppe) === 'BSk' && cls(...steppe, { hk: 'cold' }) === 'BSh');
  // Subarctic with a very cold winter: Dfd; with a dry winter: Dwd.
  check('koppen: Dfd and Dwd', cls([-45, -40, -28, -12, 3, 13, 16, 12, 3, -12, -32, -43], [20, 15, 12, 12, 20, 40, 50, 45, 30, 25, 20, 20]) === 'Dfd' && cls([-45, -40, -28, -12, 3, 13, 16, 12, 3, -12, -32, -43], [3, 3, 3, 5, 20, 40, 60, 50, 30, 10, 5, 3]) === 'Dwd');
  check('koppen: Cfc (only 3 months above 10 °C)', cls([1, 1, 2, 4, 7, 10.5, 12, 11.5, 9, 6, 3, 2], Array(12).fill(100)) === 'Cfc');
  // Walter-Lieth: 10 °C ↔ 20 mm, compressed above 100 mm; dry months where P < 2T.
  const w = KOP.walterLieth(med[0], med[1]);
  check('koppen: Walter-Lieth dry months May–Sep', w.arid.map((a, i) => (a ? i : -1)).filter((i) => i >= 0).join() === '4,5,6,7,8');
  const w2 = KOP.walterLieth([20], [300]); near('koppen: compressed scale above 100 mm', w2.py[0], 60, 1e-12);
  near('koppen: curves cross', KOP.crossing(20, 20, 60, 20), 0.5, 1e-12);
  // Parser: long with month names, a year row skipped, wide two-row form with labels, wrong counts.
  const rows = (t) => t.split('\n').map((l) => l.split(/\t|,/));
  const n = (s) => (s.trim() === '' ? NaN : Number(s));
  const long = KOP.parseMonthly(rows('month,T,P\n' + med[0].map((t, i) => `${i + 1},${t},${med[1][i]}`).join('\n') + '\nYear,17.5,550'), n);
  check('koppen: parse 12 rows with a month number and a year row', long.T?.[6] === 26 && long.P?.[11] === 95 && long.T.length === 12);
  const wide = KOP.parseMonthly(rows('Precipitation (mm),' + med[1].join(',') + '\nTemperature,' + med[0].join(',')), n);
  check('koppen: parse two labelled rows of 12', wide.P?.[0] === 80 && wide.T?.[0] === 10);
  check('koppen: too few months explained', /only 3 months/.test(KOP.parseMonthly(rows('1,2,3\n4,5,6\n7,8,9'), n).error));
}

// Trend (#138): Mann-Kendall, Hamed-Rao, seasonal MK and Sen slope against pyMannKendall 1.4.3 (MIT) on made-up series; Pettitt by brute force.
{
  const x = [14.0, 14.02, 14.12, 14.02, 13.78, 13.77, 13.61, 13.83, 14.36, 14.13, 13.96, 14.2, 14.31, 14.3, 14.0, 14.09, 14.37, 13.93, 13.94, 13.51, 13.45, 13.25, 13.62, 13.54, 13.96, 14.18, 14.22, 13.55, 13.74, 14.01, 14.23, 13.87, 13.98, 13.9, 13.91, 14.48, 14.27, 14.39, 14.73, 14.51, 14.52, 14.6, 14.64, 14.28, 14.47, 14.97, 14.4, 14.79, 14.81, 14.59];
  const m = TRD.mannKendall(x);
  check('trend: S = 480', m.S === 480);
  near('trend: Var(S) with ties (pyMK 14288.667)', m.varS, 14288.666666666666, 1e-9);
  near('trend: Z (pyMK 4.007187)', m.Z, 4.00718747245112, 1e-9);
  near('trend: p (pyMK 6.14461e-5)', m.p, 6.144608917701966e-5, 1e-10);
  near('trend: tau (pyMK 0.391837)', m.tau, 0.39183673469387753, 1e-12);
  const t = x.map((_, i) => i), ss = TRD.senSlope(t, x);
  near('trend: Sen slope (pyMK 0.0152381)', ss.slope, 0.015238095238095252, 1e-12);
  near('trend: Conover intercept (pyMK 13.731667)', ss.intercept, 13.731666666666667, 1e-9);
  const ci = TRD.senCI(ss.slopes, m.varS);
  check('trend: Sen CI brackets the slope', ci.lo < ss.slope && ci.hi > ss.slope && Math.abs(ci.lo - 0.0086957) < 1e-6 && Math.abs(ci.hi - 0.0222771) < 1e-6);
  const h = TRD.hamedRao(x);
  near('trend: Hamed-Rao Var(S) all lags (pyMK 35298.284)', h.varS, 35298.283998397, 1e-6);
  near('trend: Hamed-Rao p (pyMK 0.0107871)', h.p, 0.010787079015057266, 1e-7);
  const h3 = TRD.hamedRao(x, 0.05, 3);
  near('trend: Hamed-Rao Var(S) 3 lags (pyMK 46826.823)', h3.varS, 46826.82320034314, 1e-6);
  near('trend: Hamed-Rao p 3 lags (pyMK 0.0268602)', h3.p, 0.02686016098085986, 1e-7);
  // Without ties: Var(S) = n(n−1)(2n+5)/18; a perfectly rising series has tau = 1.
  const up = TRD.mannKendall([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  check('trend: monotone series', up.S === 45 && up.varS === 125 && up.tau === 1);
  near('trend: Z with continuity correction', up.Z, 44 / Math.sqrt(125), 1e-12);
  check('trend: tie groups', TRD.mkScore([1, 1, 2, 2, 2, 3]).tiedGroups === 2 && TRD.mkScore([1, 1, 2, 2, 2, 3]).varS === (6 * 5 * 17 - 2 * 1 * 9 - 3 * 2 * 11) / 18);
  check('trend: ranks with ties', TRD.ranks([3, 1, 3, 2]).join() === '3.5,1,3.5,2');
  // Seasonal MK on made-up monthly data (10 years).
  const M = [5.0, 10.3, 13.26, 15.23, 13.75, 9.65, 5.38, -0.15, -3.83, -4.62, -4.0, 0.07, 5.3, 9.65, 13.99, 15.07, 13.4, 10.44, 4.84, -0.06, -3.25, -5.32, -3.48, 0.24, 4.71, 10.43, 13.72, 14.83, 14.16, 9.83, 5.05, 0.43, -3.95, -4.71, -3.43, -0.27, 5.51, 10.04, 13.6, 15.54, 13.5, 10.17, 5.43, -0.25, -3.26, -4.78, -3.85, 0.53, 5.03, 10.05, 14.24, 14.85, 13.95, 10.43, 4.8, 0.5, -3.46, -5.1, -3.06, -0.03, 5.16, 10.6, 13.53, 15.4, 14.09, 9.86, 5.59, 0.19, -3.66, -4.35, -3.69, 0.22, 5.61, 9.91, 14.17, 15.41, 13.6, 10.67, 5.17, 0.1, -2.97, -5.02, -3.32, 0.57, 4.95, 10.61, 14.06, 15.02, 14.4, 10.16, 5.21, 0.72, -3.67, -4.54, -3.09, -0.04, 5.71, 10.38, 13.77, 15.8, 13.81, 10.33, 5.74, 0.02, -3.09, -4.44, -3.64, 0.75, 5.36, 10.22, 14.51, 15.15, 14.11, 10.75, 5.05, 0.68, -3.12, -4.9, -2.83, 0.3];
  const g = Array.from({ length: 12 }, () => ({ t: [], x: [] }));
  M.forEach((v, i) => { g[i % 12].t.push(Math.floor(i / 12)); g[i % 12].x.push(v); });
  const sm = TRD.seasonalMK(g);
  check('trend: seasonal S and Var(S) (pyMK 163, 1499)', sm.S === 163 && sm.varS === 1499);
  near('trend: seasonal p (pyMK 2.86151e-5)', sm.p, 2.8615069253445924e-5, 1e-10);
  near('trend: seasonal tau (pyMK 0.301852)', sm.tau, 0.30185185185185187, 1e-12);
  near('trend: seasonal Sen slope (pyMK 0.05)', sm.slope, 0.05, 1e-12);
  // Pettitt: brute-force U_t = Σ_{i≤t} Σ_{j>t} sign(x_i − x_j) gives K = 509 after index 34.
  const pt = TRD.pettitt(x);
  check('trend: Pettitt K and position', pt.K === 509 && pt.at === 34);
  near('trend: Pettitt p', pt.p, 1.014124406710227e-5, 1e-12);
  const step = TRD.pettitt([1, 1, 1, 1, 1, 5, 5, 5, 5, 5]);
  check('trend: Pettitt finds a clean step', step.at === 4 && step.K === 25);
  const an = TRD.anomalies([2000, 2001, 2002, 2003], [1, 2, 3, 10], 2000, 2002);
  check('trend: anomalies from a baseline', an.mean === 2 && an.count === 3 && an.a.join() === '-1,0,1,8');
  // Parser: header, dates with months, unsorted rows, a missing value, single column.
  const rows = (s) => s.split('\n').map((l) => l.split(/\t|,/));
  const n = (s) => (s === undefined || s.trim() === '' ? NaN : Number(s));
  const p1 = TRD.parseSeries(rows('date,value\n2020-03,5\n2020-01,3\n2020-02,\n2020-04-16,6'), n);
  check('trend: parse dates, sort, skip blanks', p1.kind === 'dates' && p1.x.join() === '3,5,6' && p1.month.join() === '1,3,4' && p1.skipped === 1 && Math.abs(p1.t[2] - (2020 + 3 / 12 + 15 / 365.25)) < 1e-9);
  const p2 = TRD.parseSeries(rows('4\n5\nx\n7'), n);
  check('trend: parse a single column', p2.kind === 'values' && p2.t.join() === '1,2,3' && p2.x.join() === '4,5,7');
}

// Waves (#139): dispersion against an independent SciPy root-find, deep and shallow limits, shoaling, refraction and breaking.
{
  const w = WAV.wave(10, 10);
  near('waves: L for T 10 s, h 10 m (SciPy 92.35582)', w.L, 92.35581694832722, 1e-9);
  near('waves: Cg (SciPy 8.067984)', w.Cg, 8.067984310698067, 1e-9);
  near('waves: n (SciPy 0.873576)', w.n, 0.8735761944710076, 1e-12);
  near('waves: L for 8 s in 5 m (SciPy 53.07145)', WAV.wave(8, 5).L, 53.071449593263175, 1e-9);
  near('waves: L for 12 s in 100 m (SciPy 223.1468)', WAV.wave(12, 100).L, 223.14684963659394, 1e-9);
  near('waves: Cg for 6 s in 2 m (SciPy 3.955186)', WAV.wave(6, 2).Cg, 3.9551859452633202, 1e-9);
  near('waves: deep limit L = gT²/2π', WAV.wave(15, 5000).L, (WAV.G * 225) / (2 * Math.PI), 1e-9);
  near('waves: deep group speed = C/2', WAV.wave(9, 5000).Cg, WAV.wave(9, 5000).C / 2, 1e-12);
  near('waves: shallow limit C → √(gh)', WAV.wave(200, 1).C, Math.sqrt(WAV.G), 1e-3);
  check('waves: Fenton-McKee within 1.7 %', [[10, 10], [8, 5], [12, 100], [6, 2]].every(([T, h]) => Math.abs(WAV.fentonMcKee(T, h) / WAV.wave(T, h).L - 1) < 0.017));
  near('waves: bed orbital speed (SciPy 0.427991)', w.ub, 0.42799129591085666, 1e-9);
  near('waves: power per metre for H = 1 m (SciPy 10137.24 W)', w.P, 10137.236974877485, 1e-6);
  check('waves: depth classes', w.regime === 'intermediate' && WAV.wave(10, 200).regime === 'deep' && WAV.wave(10, 1).regime === 'shallow');
  const t = WAV.transform(10, 2, 50, 5, 30);
  near('waves: shoaling Ks (SciPy 1.162573)', t.Ks, 1.1625731928861587, 1e-9);
  near('waves: refraction Kr (SciPy 0.942625)', t.Kr, 0.9426246337224414, 1e-9);
  near('waves: angle at 5 m (SciPy 12.926°)', t.a2, 12.92599201073054, 1e-7);
  const bp = WAV.breakPoint(10, 2, 50);
  near('waves: breaking depth (SciPy 3.25905 m)', bp.hb, 3.2590514863823823, 2e-4);
  near('waves: breaking height = 0.78 × depth', bp.Hb, 0.78 * bp.hb, 2e-4);
  check('waves: breaking is depth-limited', bp.by === 'depth' && !bp.already);
  check('waves: already broken offshore', WAV.breakPoint(10, 5, 5).already === true);
  const ir = WAV.iribarren(0.02, 2, 156.08);
  check('waves: Iribarren spilling, plunging, surging', ir.type === 'spilling' && WAV.iribarren(0.1, 1, 100).type === 'plunging' && WAV.iribarren(0.5, 1, 100).type === 'surging or collapsing');
  near('waves: deep-water equivalent height', WAV.deepEquivalent(10, 2, 50), 2 / Math.sqrt(WAV.wave(10, 50).C0 / 2 / WAV.wave(10, 50).Cg), 1e-12);
  check('waves: no depth gives NaN', Number.isNaN(WAV.wavenumber(10, 0)));
}

// Open channels (#140): Manning, normal and critical depth, part-full pipe peak, weirs; against an independent SciPy calculation.
{
  const tr = { kind: 'trap', b: 2, z1: 2, z2: 2 }, pipe = { kind: 'circ', D: 1 };
  near('channel: rectangle 3 m × 1 m, n 0.013, S 0.001 (SciPy 5.19133)', OCH.manningQ({ kind: 'rect', b: 3 }, 1, 0.013, 0.001), 5.191331186026805, 1e-9);
  near('channel: trapezoid Q (SciPy 3.78232)', OCH.manningQ(tr, 1.2, 0.025, 0.0005), 3.7823198655300083, 1e-9);
  near('channel: trapezoid normal depth for 5 m³/s (SciPy 1.369813)', OCH.normalDepth(tr, 5, 0.025, 0.0005), 1.3698134016594972, 1e-8);
  near('channel: trapezoid critical depth (SciPy 0.681644)', OCH.criticalDepth(tr, 5), 0.6816444124755032, 1e-8);
  near('channel: rectangle critical depth = (q²/g)^(1/3)', OCH.criticalDepth({ kind: 'rect', b: 3 }, 6), Math.cbrt(4 / OCH.G), 1e-9);
  const tri = OCH.section({ kind: 'tri', z1: 1, z2: 3 }, 2);
  check('channel: triangle area, perimeter, top width', Math.abs(tri.A - 8) < 1e-12 && Math.abs(tri.P - 2 * (Math.SQRT2 + Math.sqrt(10))) < 1e-12 && tri.T === 8);
  const half = OCH.section(pipe, 0.5);
  check('channel: half-full pipe A = πD²/8, P = πD/2', Math.abs(half.A - Math.PI / 8) < 1e-12 && Math.abs(half.P - Math.PI / 2) < 1e-12 && Math.abs(half.T - 1) < 1e-12);
  near('channel: full pipe (SciPy 1.072231)', OCH.manningQ(pipe, 1, 0.013, 0.002), 1.0722306051861303, 1e-9);
  near('channel: pipe peak at y/D ≈ 0.938', OCH.peakDepth(pipe, 0.013, 0.002), 0.9381812163758312, 1e-6);
  near('channel: peak is 1.0757 × full flow', OCH.manningQ(pipe, OCH.peakDepth(pipe, 0.013, 0.002), 0.013, 0.002) / OCH.manningQ(pipe, 1, 0.013, 0.002), 1.0757061294004646, 1e-8);
  near('channel: pipe normal depth for 0.8 m³/s (SciPy 0.643818)', OCH.normalDepth(pipe, 0.8, 0.013, 0.002), 0.6438177507245075, 1e-8);
  check('channel: pipe too small gives NaN', Number.isNaN(OCH.normalDepth(pipe, 2, 0.013, 0.002)));
  near('channel: US units factor 1.486', OCH.manningQ({ kind: 'rect', b: 10 }, 2, 0.015, 0.002, 1.486) / OCH.manningQ({ kind: 'rect', b: 10 }, 2, 0.015, 0.002), 1.486, 1e-12);
  const fl = OCH.flowAt(tr, 1.2, 3.7823198655300083, 0.0005);
  near('channel: Froude', fl.Fr, 0.7163484593806837 / Math.sqrt(OCH.G * 5.28 / 6.8), 1e-12);
  near('channel: specific energy', fl.E, 1.2 + fl.V ** 2 / (2 * OCH.G), 1e-12);
  near('channel: bed shear ρgRS', fl.tau, 9806.65 * (5.28 / (2 + 2 * 1.2 * Math.sqrt(5))) * 0.0005, 1e-9);
  near('weir: V-notch 90°, 0.3 m (SciPy 0.0675313)', OCH.vNotch(90, 0.3), 0.06753131303139304, 1e-12);
  near('weir: rectangular 2 m, 2 contractions, 0.4 m (SciPy 0.889134)', OCH.rectWeir(2, 0.4, 0.62, 2), 0.889133516858493, 1e-12);
  near('weir: broad-crested Cd 1 = L √g (2H/3)^1.5', OCH.broadWeir(3, 0.6, 1), 3 * Math.sqrt(OCH.G) * 0.4 ** 1.5, 1e-12);
  near('weir: Cipolletti', OCH.cipolletti(1.5, 0.25), 0.63 * (2 / 3) * Math.sqrt(2 * OCH.G) * 1.5 * 0.125, 1e-12);
  near('weir: head from discharge round trip', OCH.headFor((H) => OCH.vNotch(90, H), OCH.vNotch(90, 0.3)), 0.3, 1e-9);
}

{
  // Rainfall runoff, against an independent Python calculation of the made-up example.
  const parts = [{ area: 12, c: 0.45, cn: 75 }, { area: 8, c: 0.25, cn: 61 }];
  near('runoff: weighted C', RO.weighted(parts, 'c'), 0.37, 1e-12);
  near('runoff: weighted CN', RO.weighted(parts, 'cn'), 69.4, 1e-12);
  near('runoff: weighted skips parts without a value', RO.weighted([{ area: 5, c: 0.5 }, { area: 5, cn: 70 }], 'c'), 0.5, 1e-12);
  check('runoff: weighted is NaN with nothing', Number.isNaN(RO.weighted([{ area: 5 }], 'cn')));
  const tc = RO.kirpich(600, 0.02);
  near('runoff: Kirpich tc (Python 12.1147519)', tc, 12.114751934895255, 1e-9);
  near('runoff: Kirpich in feet form 0.0078 L^0.77 S^-0.385 agrees (rounded constants)', RO.kirpich(600, 0.02), 0.0078 * Math.pow(600 / 0.3048, 0.77) * Math.pow(0.02, -0.385), 0.03);
  const i = RO.idf(1500, 12, 0.8, tc);
  near('runoff: IDF intensity (Python 117.561473)', i, 117.56147329106953, 1e-9);
  near('runoff: rational Q SI (Python 2.41654140)', RO.rationalQ(0.37, i, 20), 2.4165413954275405, 1e-9);
  near('runoff: rational Q US is CiA', RO.rationalQ(0.5, 2, 10, true), 10, 1e-12);
  near('runoff: SI and US forms differ by 1.008', RO.rationalQ(0.5, 2 * 25.4, 10 * 0.40468564224) * 35.3146667 / RO.rationalQ(0.5, 2, 10, true), 1.008, 0.001);
  near('runoff: retention S for CN 69.4 (Python 111.994236)', RO.retention(69.4), 111.99423631123915, 1e-9);
  near('runoff: retention in inches is 1000/CN - 10', RO.retention(80) / 25.4, 1000 / 80 - 10, 1e-12);
  const r = RO.scsRunoff(80, 69.4);
  near('runoff: Ia = 0.2 S', r.Ia, 22.39884726224783, 1e-9);
  near('runoff: SCS Q 80 mm, CN 69.4 (Python 19.5635790)', r.Q, 19.563579029612708, 1e-9);
  near('runoff: lambda 0.05 with S x 1.42 (Python 22.4639442)', RO.scsRunoff(80, 69.4, 0.05).Q, 22.46394418328949, 1e-9);
  check('runoff: no runoff below Ia', RO.scsRunoff(20, 69.4).Q === 0);
  near('runoff: CN 100 runs off everything', RO.scsRunoff(50, 100).Q, 50, 1e-9);
  near('runoff: 1 in on CN 80 is 0.08 in (hand: (1-0.5)^2/(1+2))', RO.scsRunoff(25.4, 80).Q / 25.4, 0.25 / 3, 1e-9);
  near('runoff: CN dry (Python 48.7848966)', RO.cnDry(69.4), 48.78489656557542, 1e-9);
  near('runoff: CN wet (Python 83.9133635)', RO.cnWet(69.4), 83.91336347387237, 1e-9);
  near('runoff: CN 100 stays 100 dry and wet', RO.cnDry(100) + RO.cnWet(100), 200, 1e-9);
  const h = RO.triangularHydrograph(0.2, r.Q, 1, tc / 60);
  near('runoff: time to peak (Python 0.621148 h)', h.Tp, 0.6211475193489525, 1e-9);
  near('runoff: triangular peak (Python 1.31068939)', h.qp, 1.310689387860392, 1e-9);
  near('runoff: triangle holds the runoff volume', 0.5 * h.Tb * 3600 * h.qp, r.Q / 1000 * 0.2e6, 1e-6);
  near('runoff: peak is about 0.208 A Q / Tp', h.qp, 0.208 * 0.2 * r.Q / h.Tp, 0.002);
}
{
  // Flood frequency, against SciPy 1.18 (pearson3, gumbel_r, genextreme, gammainc) on a made-up 40-year record.
  const x = [675, 325, 441, 434, 319, 682, 318, 346, 300, 353, 379, 534, 620, 392, 492, 366, 494, 619, 920, 665, 397, 379, 565, 789, 240, 500, 719, 568, 356, 376, 205, 812, 359, 464, 448, 534, 463, 629, 529, 367];
  for (const [a, v, want] of [[0.5, 0.3, 0.5614219739190003], [3, 2.5, 0.45618688411667035], [10, 15, 0.9301463393005901], [400, 380, 0.15855070978429484], [2, 7, 0.9927049442755639]]) near(`flood: gammaP(${a}, ${v}) (SciPy gammainc)`, FF.gammaP(a, v), want, 1e-12);
  near('flood: gammaPInv round trip', FF.gammaP(3, FF.gammaPInv(0.37, 3)), 0.37, 1e-12);
  for (const [p, g, want] of [[0.99, 0.5, 2.685721479529419], [0.99, -0.5, 1.9547230565417744], [0.9, 1.2, 1.3404673495554114], [0.5, 0.3, -0.04993278464719886], [0.002, 2.0, -0.9979979973293269], [0.999, -1.5, 1.3127490769294372], [0.99, 0.02, 2.341043791580546]]) near(`flood: Pearson III K(p ${p}, g ${g}) (SciPy pearson3.ppf)`, FF.pearsonK(p, g), want, 1e-7);
  near('flood: Pearson III K with g ≈ 0 is the normal z (Wilson-Hilferty branch)', FF.pearsonK(0.99, 0.005), 2.326347874 + 0.005 / 6 * (2.326347874 ** 2 - 1), 1e-4);
  const L = FF.lmoments(x);
  near('flood: L-moment λ2', L.l2, 91.73653846153849, 1e-9);
  near('flood: L-moment τ3', L.t3, 0.1692787720511917, 1e-12);
  near('flood: Gumbel moments Q100 (SciPy 995.68676)', FF.gumbelMoments(x).q(100), 995.6867596814511, 1e-8);
  near('flood: Gumbel L-moments Q100 (SciPy 1016.7516)', FF.gumbelL(x).q(100), 1016.7516040136445, 1e-8);
  const gev = FF.gevL(x);
  near('flood: GEV k (Hosking approximation)', gev.params.k, 0.0010111034027748954, 1e-12);
  near('flood: GEV Q10 (SciPy genextreme 705.76322)', gev.q(10), 705.7632215706234, 1e-7);
  near('flood: GEV Q100 (SciPy 1015.9660)', gev.q(100), 1015.9660356646408, 1e-7);
  near('flood: GEV return period of 800 (SciPy 19.87225)', FF.returnPeriod(gev, 800), 19.872247468697104, 1e-6);
  const x2 = x.map((v) => (v * v) / 1000), gev2 = FF.gevL(x2);
  near('flood: skewed GEV k (Python -0.204776)', gev2.params.k, -0.20477628517702348, 1e-10);
  near('flood: skewed GEV Q100 (SciPy 1003.6413)', gev2.q(100), 1003.6412608022964, 1e-7);
  near('flood: skewed GEV return period of 500 (SciPy 11.03591)', FF.returnPeriod(gev2, 500), 11.035908059473918, 1e-6);
  const lp = FF.logPearson3(x);
  near('flood: LP3 log mean', lp.params.mean, 2.6615991904416894, 1e-12);
  near('flood: LP3 log sd', lp.params.sd, 0.14545701521863424, 1e-12);
  near('flood: LP3 station skew (SciPy skew, bias=False)', lp.params.skew, -0.05234611937201275, 1e-10);
  near('flood: LP3 Q10 (SciPy 703.35678)', lp.q(10), 703.3567804365356, 1e-6);
  near('flood: LP3 Q100 (SciPy 987.12958)', lp.q(100), 987.129580129204, 1e-6);
  near('flood: LP3 Q100 with typed skew -0.1 (SciPy 975.5563)', FF.logPearson3(x, -0.1).q(100), 975.5563009697038, 1e-6);
  near('flood: LP3 return period of 800 (SciPy 21.34228)', FF.returnPeriod(lp, 800), 21.34227799312686, 1e-6);
  const gb = FF.grubbsBeck(x);
  near('flood: Grubbs-Beck K_N for n = 40', gb.KN, 2.681356937533647, 1e-12);
  near('flood: Grubbs-Beck high threshold', gb.hi, 1126.2151553890617, 1e-6);
  check('flood: no outliers in the example', gb.high.length === 0 && gb.low.length === 0 && gb.valid);
  check('flood: Grubbs-Beck flags a planted low outlier', FF.grubbsBeck([...x.slice(0, 39), 20]).low.length === 1);
  near('flood: Gumbel standard error at T = 100 (Kite)', FF.gumbelSE(x, 100), 101.14610793271349, 1e-8);
  const pp = FF.plotting(x);
  check('flood: Weibull largest T = n + 1', pp[0].T === 41 && pp[0].x === 920 && pp[39].T === 41 / 40);
  near('flood: Gringorten largest T', FF.plotting(x, 0.44)[0].T, (40 + 0.12) / 0.56, 1e-12);
  const ci = FF.bootstrap(x, FF.gevL, [10, 100], 400);
  check('flood: bootstrap interval brackets the estimate', ci[0][0] < gev.q(10) && gev.q(10) < ci[0][1] && ci[1][0] < gev.q(100) && gev.q(100) < ci[1][1]);
  check('flood: bootstrap is repeatable with the seed', JSON.stringify(FF.bootstrap(x, FF.gumbelMoments, [50], 200)) === JSON.stringify(FF.bootstrap(x, FF.gumbelMoments, [50], 200)));
  near('flood: 100-year flood in 30 years', FF.riskInYears(100, 30), 1 - 0.99 ** 30, 1e-15);
}
{
  // FAO-56 Penman-Monteith on made-up days, against an independent Python version (and pyet 1.5 pm_fao56 for day 1, 5.52785).
  const d1 = ET.penmanMonteith({ tmax: 29, tmin: 16.5, lat: 43.1, z: 180, J: 196, u: 3.1, uh: 10, hum: { kind: 'rhmaxmin', rhmax: 88, rhmin: 41 }, sol: { kind: 'sun', n: 10.2 } });
  near('et0: day 1 ET0 (Python and pyet 5.5278496)', d1.et0, 5.527849621116586, 1e-9);
  near('et0: day 1 Ra', d1.Ra, 40.69930161983453, 1e-9);
  near('et0: day 1 daylight hours', d1.N, 14.878123797966975, 1e-9);
  near('et0: day 1 Rs from sunshine', d1.Rs, 24.125941895165486, 1e-9);
  near('et0: day 1 Rnl', d1.Rnl, 4.302173796565052, 1e-9);
  near('et0: day 1 ea from RHmax/RHmin', d1.ea, 1.647121275020091, 1e-12);
  near('et0: wind at 10 m to 2 m', d1.u2, 2.3186483330206267, 1e-12);
  near('et0: pressure at 180 m', d1.P, 99.19030396361237, 1e-10);
  near('et0: radiation and aerodynamic parts add up', d1.radPart + d1.aeroPart, d1.et0, 1e-12);
  const d2 = ET.penmanMonteith({ tmax: 12.4, tmin: 3.1, lat: -33.9, z: 40, J: 170, u: 4, hum: { kind: 'tdew', tdew: 2 }, sol: { kind: 'rs', rs: 9.5 } });
  near('et0: day 2 southern winter, dew point, measured Rs (Python 1.8017673)', d2.et0, 1.8017673003420527, 1e-9);
  near('et0: day 2 Ra', d2.Ra, 16.219422863339513, 1e-9);
  const d3 = ET.penmanMonteith({ tmax: 34.5, tmin: 21, lat: 13, z: 350, J: 75, u: 1.6, hum: { kind: 'rhmean', rh: 48 }, sol: { kind: 'temp' } });
  near('et0: day 3 RH mean, Hargreaves radiation (Python 5.4704115)', d3.et0, 5.470411527731706, 1e-9);
  near('et0: day 3 Rs from the temperature range', d3.Rs, 21.390841932470586, 1e-9);
  const d4 = ET.penmanMonteith({ tmax: 5, tmin: -4, lat: 60, z: 800, J: 40, u: 2.5, uh: 3, hum: { kind: 'none' }, sol: { kind: 'sun', n: 4 } });
  near('et0: day 4 cold, no humidity (dew point = Tmin), negative Rn (Python 0.5239102)', d4.et0, 0.5239102395205919, 1e-9);
  check('et0: day 4 net radiation is negative', d4.Rn < 0 && Math.abs(d4.Rn - -0.8425105124825056) < 1e-9);
  near('et0: Hargreaves day 1 (Python 5.4754627)', ET.hargreaves(29, 16.5, d1.Ra), 5.475462654153093, 1e-9);
  near('et0: Hargreaves day 2 (Python 1.1859210)', ET.hargreaves(12.4, 3.1, d2.Ra), 1.1859210408730503, 1e-9);
  near('et0: svp at 20 °C', ET.svp(20), 2.338281, 1e-6);
  near('et0: wind default is 2 m/s', ET.penmanMonteith({ tmax: 25, tmin: 15, lat: 0, z: 0, J: 100, hum: { kind: 'rhmean', rh: 60 }, sol: { kind: 'temp' } }).u2, 2, 0);
  check('et0: polar night has no sun', ET.extraterrestrial(75, 355).Ra === 0 && ET.extraterrestrial(75, 355).N === 0);
  near('et0: midnight sun has 24 h of daylight', ET.extraterrestrial(75, 172).N, 24, 1e-9);
  near('et0: sunshine capped at the day length', ET.penmanMonteith({ tmax: 25, tmin: 15, lat: 40, z: 0, J: 172, hum: { kind: 'rhmean', rh: 60 }, sol: { kind: 'sun', n: 20 } }).Rs, (0.75) * ET.extraterrestrial(40, 172).Ra, 1e-9);
  check('et0: day of year', ET.dayOfYear('2026-07-15') === 196 && ET.dayOfYear('2024-12-31') === 366 && Number.isNaN(ET.dayOfYear('15/07/2026')));
  const wc = ET.weatherColumns(['Date', 'Tmax (°C)', 'Tmin (°C)', 'RH max %', 'RH min %', 'Wind 2 m (m/s)', 'Sunshine (h)']);
  check('et0: weather columns found by name', wc.date === 0 && wc.tmax === 1 && wc.tmin === 2 && wc.rhmax === 3 && wc.rhmin === 4 && wc.rh === -1 && wc.u === 5 && wc.sun === 6 && wc.rs === -1 && wc.tdew === -1);
  const wc2 = ET.weatherColumns(['day', 'max temp', 'min temp', 'humidity', 'dew point', 'solar radiation']);
  check('et0: other column names', wc2.tmax === 1 && wc2.tmin === 2 && wc2.rh === 3 && wc2.tdew === 4 && wc2.rs === 5 && wc2.u === -1);
}
{
  // Rating curves on 24 made-up gaugings, against SciPy curve_fit (h0 free) and linregress (h0 fixed).
  const h = [0.642, 0.658, 0.677, 0.711, 0.731, 0.79, 0.9, 0.93, 0.97, 0.981, 1.147, 1.284, 1.295, 1.671, 1.83, 1.881, 2.269, 2.454, 2.636, 2.67, 2.722, 2.766, 2.887, 3.041], Q = [1.566, 1.67, 1.809, 2.241, 2.525, 2.98, 4.121, 4.611, 5.258, 5.534, 7.973, 11.116, 11.022, 19.104, 21.919, 24.115, 36.939, 41.45, 47.97, 46.741, 49.209, 47.673, 57.671, 61.862];
  const s = RC.fitSearch(h, Q);
  near('rating: searched h0 (SciPy 0.3406196)', s.h0, 0.34061961776027544, 2e-5);
  near('rating: a (SciPy 11.61084)', s.a, 11.610844433136483, 2e-3);
  near('rating: b (SciPy 1.681117)', s.b, 1.6811168654976243, 1e-4);
  near('rating: log standard error (SciPy 0.0349236)', s.s, 0.03492364890363027, 1e-7);
  near('rating: Q at 2.5 m (SciPy 42.3555)', RC.qAt(s, 2.5), 42.355535950917414, 2e-4);
  const f = RC.fitFixed(h, Q, 0.3);
  near('rating: fixed h0 a (SciPy linregress 10.602063)', f.a, 10.602063210872172, 1e-9);
  near('rating: fixed h0 b (SciPy 1.7639135)', f.b, 1.763913506299644, 1e-12);
  const bd = RC.band(f, 2);
  near('rating: 95 % band low at 2 m (SciPy t 26.49459)', bd[0], 26.494592419590404, 1e-8);
  near('rating: 95 % band high at 2 m (SciPy 27.58084)', bd[1], 27.580838507481623, 1e-8);
  near('rating: stage for a discharge round trip', RC.hAt(s, RC.qAt(s, 1.7)), 1.7, 1e-12);
  check('rating: zero flow at or below h0', RC.qAt(s, s.h0) === 0 && RC.qAt(s, 0.1) === 0);
  // Exact curve with a typed h0 is recovered exactly.
  const hx = [0.5, 0.8, 1.2, 1.9, 2.6, 3.4], qx = hx.map((v) => 7.5 * Math.pow(v - 0.2, 1.8));
  const ex = RC.fitFixed(hx, qx, 0.2);
  near('rating: exact a', ex.a, 7.5, 1e-10); near('rating: exact b', ex.b, 1.8, 1e-12);
  near('rating: exact curve found by the search', RC.fitSearch(hx, qx).h0, 0.2, 1e-5);
  // Two segments: a control change at 2 m.
  const h2 = [0.4, 0.6, 0.8, 1.0, 1.3, 1.6, 1.9, 2.1, 2.4, 2.8, 3.2, 3.6], q2 = h2.map((v) => (v < 2 ? 5 * Math.pow(v - 0.1, 1.6) : 9 * Math.pow(v - 0.6, 1.4)));
  const r2 = RC.fitRating(h2, q2, { brk: 2, h0: 0.1, h0Upper: 0.6 });
  check('rating: two segments recovered', Math.abs(r2.segs[0].b - 1.6) < 1e-10 && Math.abs(r2.segs[1].a - 9) < 1e-9 && Math.abs(RC.ratingQ(r2, 3) - 9 * Math.pow(2.4, 1.4)) < 1e-9);
  near('rating: two-segment stage for a discharge', RC.ratingH(r2, 9 * Math.pow(2.4, 1.4)), 3, 1e-9);
  near('rating: two-segment stage below the break', RC.ratingH(r2, 5 * Math.pow(1.4, 1.6)), 1.5, 1e-9);
  const sc = RC.scatterPct(s);
  check('rating: scatter band about ±7 %', sc[0] < -6 && sc[0] > -8 && sc[1] > 6 && sc[1] < 8);
  check('rating: columns by name', JSON.stringify(RC.pickColumns(['date', 'Discharge (m3/s)', 'Gauge height (m)'], [[NaN, NaN, NaN], [1, 2, 3], [4, 5, 6]])) === JSON.stringify({ hi: 2, qi: 1 }));
  check('rating: columns by order', JSON.stringify(RC.pickColumns(['a', 'b'], [[1, 2, 3], [4, 5, 6]])) === JSON.stringify({ hi: 0, qi: 1 }));
}
{
  // Altermagnet band models, against NumPy eigh on the two-sublattice Hamiltonian, and symmetry checks.
  const m = { kind: 'two', t1: 1, ta: 0.3, tb: -0.1, J: 0.8, mu: 0.2 };
  const ref = [[0.7, 0.2, 1, -4.391269506032175, 3.2933059999818832, 0.3846924263377676], [0.7, 0.2, -1, -4.355251312186078, 3.257287806135787, 0.5937808309003051], [Math.PI, 0.3, 1, -1.7732018934753635, 1.3910672978251213, 0], [Math.PI, 0.3, -1, -0.20893270217487886, -0.17320189347536347, 1], [1.1, 2.5, 1, -1.246328094282544, 0.9853470919310865, 0.36642137392907353], [1.1, 2.5, -1, -1.819028447896271, 1.5580474455448137, 0.8855098125918729]];
  for (const [kx, ky, sp, e0, e1, wa] of ref) {
    const e = AMB.bands(m, kx, ky, sp);
    near(`amband: two-sublattice bands at (${kx.toFixed(2)}, ${ky}) spin ${sp > 0 ? 'up' : 'down'} (NumPy)`, Math.abs(e[0] - e0) + Math.abs(e[1] - e1), 0, 1e-12);
    near(`amband: sublattice A weight at (${kx.toFixed(2)}, ${ky}) spin ${sp > 0 ? 'up' : 'down'} (NumPy)`, AMB.weightA(m, kx, ky, sp)[0], wa, 1e-12);
  }
  // Spin up at (kx, ky) equals spin down at (ky, kx): the 90° rotation swaps the sublattices.
  let worst = 0;
  for (const [x, y] of [[0.3, 1.9], [2.2, -0.7], [-1.4, 2.8], [3, 0.1]]) { const u = AMB.bands(m, x, y, 1), d = AMB.bands(m, y, x, -1); worst = Math.max(worst, Math.abs(u[0] - d[0]), Math.abs(u[1] - d[1])); }
  near('amband: E up(kx, ky) = E down(ky, kx)', worst, 0, 1e-12);
  near('amband: no splitting on the diagonal kx = ky', Math.abs(AMB.bands(m, 1.3, 1.3, 1)[0] - AMB.bands(m, 1.3, 1.3, -1)[0]), 0, 1e-12);
  near('amband: no splitting at Γ', Math.abs(AMB.bands(m, 0, 0, 1)[1] - AMB.bands(m, 0, 0, -1)[1]), 0, 1e-12);
  check('amband: splitting changes sign across the diagonal', (AMB.bands(m, 2, 0.5, 1)[0] - AMB.bands(m, 2, 0.5, -1)[0]) * (AMB.bands(m, 0.5, 2, 1)[0] - AMB.bands(m, 0.5, 2, -1)[0]) < 0);
  const g = AMB.grid(m, 200), fill = AMB.filling(g, 200);
  near('amband: electrons per spin at μ = 0.2 (NumPy 1.0071)', fill[0], 1.0071, 1e-12);
  check('amband: equal filling for both spins (no net moment)', fill[0] === fill[1]);
  const D = AMB.dos(g, 200);
  near('amband: spin-resolved DOS identical', D.up.reduce((s, v, i) => Math.max(s, Math.abs(v - D.dn[i])), 0), 0, 1e-9);
  near('amband: DOS integrates to 2 bands per spin', D.up.reduce((s, v) => s + v, 0) * D.w, 2, 1e-9);
  check('amband: no spin splitting without anisotropy (ta = tb)', AMB.maxSplit({ ...m, ta: 0.2, tb: 0.2 })[0].d === 0 || Math.abs(AMB.maxSplit({ ...m, ta: 0.2, tb: 0.2 })[0].d) < 1e-12);
  // One-band forms.
  const o = { kind: 'one', t: 1, tp: 0.2, J: 0.5, mu: -0.5, form: 'dx2y2' };
  near('amband: one-band d-wave value', AMB.bands(o, 1, 2, 1)[0], -2 * (Math.cos(1) + Math.cos(2)) + 0.8 * Math.cos(1) * Math.cos(2) + 0.5 + 0.5 * (Math.cos(1) - Math.cos(2)), 1e-12);
  near('amband: largest d-wave split is 4J at X', Math.abs(AMB.maxSplit(o)[0].d), 4 * 0.5, 1e-9);
  near('amband: dxy split vanishes on the axes', AMB.bands({ ...o, form: 'dxy' }, 1.7, 0, 1)[0] - AMB.bands({ ...o, form: 'dxy' }, 1.7, 0, -1)[0], 0, 1e-12);
  const gw = { ...o, form: 'g' };
  check('amband: g-wave has four sign changes around a circle', (() => { let ch = 0, prev = 0; for (let a = 10; a <= 370; a += 1) { const r = 1.5, x = r * Math.cos(a * Math.PI / 180), y = r * Math.sin(a * Math.PI / 180), v = AMB.FORMS.g.f(x, y); const sg = Math.abs(v) < 1e-9 ? 0 : Math.sign(v); if (sg && prev && sg !== prev) ch++; if (sg) prev = sg; } return ch === 8; })());
  near('amband: g-wave filling equal for both spins', AMB.filling(AMB.grid(gw, 120), 120)[0] - AMB.filling(AMB.grid(gw, 120), 120)[1], 0, 1e-12);
  const P = AMB.kPath(40);
  check('amband: path Y-Γ-X-M-Γ', P.ticks.map((t) => t.label).join('') === 'YΓXMΓ' && Math.abs(P.length - (3 + Math.SQRT2) * Math.PI) < 1e-12);
  const circ = new Float64Array(64 * 64).map((_, i) => { const x = -Math.PI + (i % 64 + 0.5) * 2 * Math.PI / 64, y = -Math.PI + (Math.floor(i / 64) + 0.5) * 2 * Math.PI / 64; return x * x + y * y - 1; });
  const seg = AMB.contour(circ, 64);
  check('amband: contour of a unit circle lies on the circle', seg.length > 20 && seg.every(([a, b, c, d]) => Math.abs(Math.hypot(a, b) - 1) < 0.01 && Math.abs(Math.hypot(c, d) - 1) < 0.01));
}
// #146 anomalous Hall checker: magnetic point group and allowed Hall vector, checked against spglib 2.8 magnetic symmetry
{
  const { EXAMPLES: EX, parseCrystal: PC } = ALT;
  const cr = (id) => PC(EX.find((e) => e.id === id).text).crystal;
  const run = (id, d, cart = false) => { const c = cr(id), r = AHE.hall(AHE.prepare(c), cart ? d : AHE.latticeDir(c.cell, d)); return { r, dirs: r.basis.map((b) => AHE.dirName(c.cell, b)).join(' ') }; };
  const want = [
    ['rutile', [0, 0, 1], 0, ''], ['rutile', [1, 0, 0], 1, '[0 1 0]'], ['rutile', [1, 1, 0], 1, '[1 1 0]'], ['rutile', [1, -1, 0], 1, '[1 −1 0]'],
    ['rutile', [1, 2, 0], 2, '[1 0 0] [0 1 0]'], ['rutile', [1, 0, 1], 1, '[0 1 0]'],
    ['nias', [0, 0, 1], 0, ''], ['nias', [1, 0, 0], 0, ''], ['nias', [1, 1, 0], 0, ''], ['nias', [1, -1, 0], 1, '[0 0 1]'], ['nias', [1, 2, 0], 1, '[0 0 1]'],
    ['ferri', [0, 0, 1], 1, '[0 0 1]'], ['ferri', [1, 1, 0], 1, '[1 1 0]'],
  ];
  for (const [id, d, rank, dirs] of want) { const { r, dirs: got } = run(id, d); check(`ahe: ${id} n=[${d}] rank ${rank} ${dirs}`, r.rank === rank && got === dirs); }
  for (const id of ['bcc', 'chain']) for (const d of [[0, 0, 1], [1, 0, 0], [1, 1, 0], [1, 2, 3]]) check(`ahe: ${id} n=[${d}] Hall forbidden`, run(id, d).r.rank === 0);
  check('ahe: rutile generic direction allows all three', run('rutile', [0.3, 0.5, 0.8], true).r.rank === 3);
  check('ahe: MnTe generic direction allows all three', run('nias', [0.3, 0.5, 0.8], true).r.rank === 3);
  // P is a projector (P² = P) and its trace is the rank.
  { const { r } = run('rutile', [1, 1, 0]); const P = r.P, P2 = P.map((row, i) => row.map((_, j) => P[i][0] * P[0][j] + P[i][1] * P[1][j] + P[i][2] * P[2][j]));
    check('ahe: P is a projector', P.every((row, i) => row.every((x, j) => Math.abs(x - P2[i][j]) < 1e-9)) && Math.abs(P[0][0] + P[1][1] + P[2][2] - r.rank) < 1e-9); }
  // RuO2 n ∥ [001]: half the 16 operations need time reversal (magnetic point group 4′/mm′m).
  { const { r } = run('rutile', [0, 0, 1]); check('ahe: rutile [001] has 16 ops, 8 with time reversal', r.ops.length === 16 && r.ops.filter((o) => o.T).length === 8); }
  // Reversing n reverses no allowed direction set.
  { const a = run('nias', [1, -1, 0]).dirs, b = run('nias', [-1, 1, 0]).dirs; check('ahe: −n gives the same allowed directions', a === b); }
  check('ahe: components named', AHE.components([[0, 0, 1]]).join() === 'σxy (Hall vector along z)');
  { const s = AHE.scanSphere(AHE.prepare(cr('rutile')), 12); check('ahe: sphere scan pole is forbidden, most directions allowed', s[0].rank === 0 && s.filter((x) => x.rank === 3).length > s.length / 2); }
}

// #147 spin splitter conductivity: Boltzmann tensors checked against an independent NumPy calculation (eigvalsh, 400², kT 0.1)
{
  const two = { kind: 'two', t1: 1, ta: 0.3, tb: -0.1, J: 0.8, mu: 0.2 }, one = (form, J = 0.3) => ({ kind: 'one', t: 1, tp: 0.2, J, mu: -0.5, form });
  const ref = { two: [[0.003935, 0, 0.15401], [0.15401, 0, 0.003935]], d: [[0.218053, 0, 0.606105], [0.606105, 0, 0.218053]], dxy: [[0.417628, -0.021293, 0.417628], [0.417628, 0.021293, 0.417628]], g: [[0.42329, 0, 0.42329], [0.42329, 0, 0.42329]] };
  const res = { two: SSC.tensors(two), d: SSC.tensors(one('dx2y2')), dxy: SSC.tensors(one('dxy')), g: SSC.tensors(one('g')) };
  for (const k of Object.keys(ref)) ['up', 'dn'].forEach((s, i) => ['xx', 'xy', 'yy'].forEach((c, j) => near(`ssc: ${k} σ${s}_${c}`, res[k][s][c], ref[k][i][j], 2e-6)));
  const d = res.d, b = SSC.bestAngle(d.up, d.dn);
  near('ssc: d-wave best field angle 45°', (b.angle * 180) / Math.PI, 45, 0.06);
  near('ssc: d-wave splitter ratio at 45°', SSC.atAngle(d.up, d.dn, Math.PI / 4).splitter, (0.606105 - 0.218053) / 0.824158, 2e-5);
  near('ssc: d-wave current along x is spin polarised', SSC.atAngle(d.up, d.dn, 0).polar, (0.218053 - 0.606105) / 0.824158, 2e-5);
  near('ssc: d-wave no transverse spin current along x', SSC.atAngle(d.up, d.dn, 0).splitter, 0, 1e-9);
  near('ssc: d-wave no transverse charge current', SSC.atAngle(d.up, d.dn, 0.3).hallLike, 0, 1e-9);
  near('ssc: dxy best field angle 0°', SSC.bestAngle(res.dxy.up, res.dxy.dn).angle, 0, 1e-9);
  near('ssc: g-wave has no spin splitter effect', Math.abs(SSC.atAngle(res.g.up, res.g.dn, Math.PI / 4).splitter) + Math.abs(SSC.atAngle(res.g.up, res.g.dn, 0).polar), 0, 1e-9);
  { const r0 = SSC.tensors(one('dx2y2', 0), 200); near('ssc: J = 0 gives no spin current', SSC.atAngle(r0.up, r0.dn, Math.PI / 4).splitter, 0, 1e-12); }
  { const rm = SSC.tensors(one('dx2y2', -0.3), 200), rp = SSC.tensors(one('dx2y2', 0.3), 200); near('ssc: reversing J reverses the spin current', SSC.atAngle(rm.up, rm.dn, Math.PI / 4).splitter, -SSC.atAngle(rp.up, rp.dn, Math.PI / 4).splitter, 1e-12); }
  // Plain antiferromagnet limit (ta = tb): the spins are degenerate, so no spin current at all.
  { const tw = SSC.tensors({ ...two, ta: 0.2, tb: 0.2 }, 200); near('ssc: ta = tb gives no spin current', Math.abs(SSC.atAngle(tw.up, tw.dn, Math.PI / 4).splitter) + Math.abs(SSC.atAngle(tw.up, tw.dn, 0).polar), 0, 1e-9); }
}

// #148 chiral magnon bands: linear spin waves checked against NumPy eig of the paraunitary BdG matrix σ3·H
{
  const m = { J1: 1, Ja: 0.3, Jb: 0.05, K: 0.02, S: 1 };
  const ref = [[[0, 0], 0.5670978752, 0.5670978752], [[Math.PI, 0], 5.24, 4.24], [[0, Math.PI], 4.24, 5.24], [[Math.PI, Math.PI], 5.44, 5.44], [[1, 0.4], 2.5537149894, 2.3633356453], [[2.2, -1.3], 4.846387156, 4.4183871831]];
  for (const [[kx, ky], a, b] of ref) { const [wa, wb] = AMG.modes(m, kx, ky); near(`magnon: α at (${kx.toFixed(2)}, ${ky.toFixed(2)})`, wa, a, 1e-9); near(`magnon: β at (${kx.toFixed(2)}, ${ky.toFixed(2)})`, wb, b, 1e-9); }
  near('magnon: gap at Γ = 2S√(K(4J1 + K))', AMG.gapGamma(m), 2 * Math.sqrt(0.02 * 4.02), 1e-12);
  near('magnon: plain J1 antiferromagnet ω = 4SJ1√(1 − γ²)', AMG.modes({ J1: 1, Ja: 0, Jb: 0, K: 0, S: 1.5 }, 1.1, 0.7)[0], 4 * 1.5 * Math.sqrt(1 - (Math.cos(0.55) * Math.cos(0.35)) ** 2), 1e-12);
  { const d = AMG.maxSplit(m); near('magnon: largest chirality splitting 4S|Ja − Jb|', Math.abs(d.d), 1, 1e-12); near('magnon: at X or Y', Math.abs(Math.cos(d.kx) - Math.cos(d.ky)), 2, 1e-12); }
  check('magnon: degenerate along the diagonal', [0.3, 1.2, 2.5].every((k) => Math.abs(AMG.modes(m, k, k)[0] - AMG.modes(m, k, k)[1]) < 1e-12 && Math.abs(AMG.modes(m, k, -k)[0] - AMG.modes(m, k, -k)[1]) < 1e-12));
  check('magnon: 90° rotation swaps the two chiralities', [[0.4, 1.7], [2.9, -0.8]].every(([x, y]) => Math.abs(AMG.modes(m, x, y)[0] - AMG.modes(m, -y, x)[1]) < 1e-12));
  check('magnon: Ja = Jb gives degenerate magnons', Math.abs(AMG.maxSplit({ ...m, Jb: 0.3 }).d) < 1e-12);
  check('magnon: stable with ferro J2 and easy axis', AMG.stability(m).stable);
  check('magnon: unstable with a hard axis (K < 0)', !AMG.stability({ ...m, K: -0.05 }).stable);
  check('magnon: unstable with strong antiferro J2', !AMG.stability({ ...m, Ja: -1.5 }).stable);
}

// #149 unit hydrograph builder: checked against SciPy (gamma, gammainc, brentq, optimize.nnls)
{
  near('uh: PRF of gamma shape m = 3.7 is 484', UH.prfOf(3.7), 484.21107639640013, 1e-9);
  near('uh: shape for PRF 484', UH.shapeFor(484), 3.6969129776537417, 1e-9);
  near('uh: shape for PRF 300', UH.shapeFor(300), 1.51372956560487, 1e-9);
  const g = UH.gammaUH(50, 3, 3.7, 0.5);
  near('uh: gamma UH peak (A 50 km², Tp 3 h, dt 0.5 h)', g.peak, 3.4737093013330655, 1e-9);
  check('uh: gamma UH length and peak time', g.q.length === 32 && g.tPeak === 3);
  near('uh: gamma UH holds 1 mm', UH.impliedArea(g.q, 0.5), 50, 1e-9);
  const n = UH.nashUH(100, 3, 2, 1, 1);
  near('uh: Nash UH peak (n 3, k 2 h, D 1 h, 100 km²)', n.peak, 3.690663135469436, 1e-9);
  check('uh: Nash UH length and peak time', n.q.length === 36 && n.tPeak === 5);
  const A = [[0.085649, 0.236811, 0.801274, 0.582162, 0.094129], [0.433127, 0.479051, 0.159739, 0.734577, 0.113672], [0.391228, 0.51674, 0.430628, 0.586799, 0.737838], [0.956267, 0.284201, 0.648547, 0.696216, 0.292721], [0.00149, 0.97346, 0.298401, 0.313986, 0.891711], [0.585163, 0.47131, 0.773277, 0.030346, 0.706965], [0.374244, 0.090853, 0.6605, 0.931464, 0.207191], [0.63009, 0.298163, 0.741757, 0.722165, 0.218715], [0.829887, 0.657652, 0.682799, 0.820076, 0.428573], [0.758705, 0.87848, 0.10232, 0.849768, 0.393927], [0.479684, 0.146335, 0.698426, 0.291979, 0.871139], [0.275374, 0.56181, 0.399656, 0.612909, 0.196639]];
  const b = [-0.119712, 0.44686, 0.452223, 0.266978, 0.62108, -0.094225, 0.550901, -0.131013, 0.664358, 0.323693, 0.306884, 0.670559];
  UH.nnls(A, b).forEach((x, i) => near(`uh: NNLS x${i} vs SciPy`, x, [0, 0.2769954522315101, 0, 0.2828549936145783, 0.12155574685036591][i], 1e-10));
  check('uh: convolution', UH.convolve([5, 12, 3], [0, 1.5, 4, 3, 2, 1, 0.5, 0.2]).every((v, i) => Math.abs(v - [0, 7.5, 38, 67.5, 58, 38, 20.5, 10, 3.9, 0.6][i]) < 1e-12));
  { const d = UH.deriveUH([5, 12, 3], [0, 7.5, 38, 67.5, 58, 38, 20.5, 10, 3.9, 0.6], 8); check('uh: deconvolution recovers the unit hydrograph', d.U.every((v, i) => Math.abs(v - [0, 1.5, 4, 3, 2, 1, 0.5, 0.2][i]) < 1e-9) && Math.abs(d.nse - 1) < 1e-12); }
  { const r = UH.phiIndex([2, 10, 6, 1], 9); near('uh: φ-index leaves the runoff depth', r.excess.reduce((s, x) => s + x, 0), 9, 1e-9); near('uh: φ-index value', r.phi, 3.5, 1e-9); }
  check('uh: straight-line baseflow', UH.baseflow([2, 9, 7, 4], 'line').every((v, i) => Math.abs(v - [2, 2 + 2 / 3, 2 + 4 / 3, 4][i]) < 1e-12));
}

// #150 Thiessen rain gauge average: cell areas checked against shapely 2.2 (voronoi_diagram ∩ catchment)
{
  const P = [[0, 0], [9, 1], [14, 5], [12, 11], [7, 9], [5, 13], [-1, 10], [1, 5]], G = [[2, 2], [7, 3], [12, 5], [10, 9], [4, 7], [1, 10], [11, -1]], R = [32, 41, 28, 19, 36, 24, 30];
  const r = THS.arealMean(P, G, R);
  near('thiessen: catchment area', r.total, 125, 1e-12);
  [0.141397515528, 0.194642857143, 0.134683497537, 0.15325, 0.22984057971, 0.144761904762, 0.00142364532].forEach((w, i) => near(`thiessen: weight of gauge ${i + 1} vs shapely`, r.weights[i], w, 1e-11));
  near('thiessen: areal mean vs shapely', r.mean, 30.979221514242877, 1e-10);
  near('thiessen: weights sum to 1', r.weights.reduce((a, b) => a + b, 0), 1, 1e-12);
  near('thiessen: arithmetic mean of gauges inside', r.arithIn, 30, 1e-12);
  near('thiessen: missing reading redraws cells (vs shapely)', THS.arealMean(P, G, [32, NaN, 28, 19, 36, 24, 30]).mean, 29.108106452531132, 1e-10);
  check('thiessen: concave catchment is not self-crossing', !THS.selfCrossing(P));
  check('thiessen: bow-tie is self-crossing', THS.selfCrossing([[0, 0], [2, 2], [2, 0], [0, 2]]));
  near('thiessen: one gauge takes the whole catchment', THS.arealMean(P, [[3, 3]], [10]).mean, 10, 1e-12);
  { const c = THS.centroid([[0, 0], [4, 0], [4, 2], [0, 2]]); check('thiessen: centroid of a rectangle', c[0] === 2 && c[1] === 1); }
  check('parseTable: whole-number CSV rows stay comma-separated', JSON.stringify(parseTable('x,y\n0,0\n9,1\n14,5')) === JSON.stringify([['x', 'y'], ['0', '0'], ['9', '1'], ['14', '5']]));
  check('parseTable: decimal commas with spaces still split on spaces', JSON.stringify(parseTable('1,5 2,25\n3,0 4,5')) === JSON.stringify([['1,5', '2,25'], ['3,0', '4,5']]));
  { const k = THS.lonLatToKm([[-79, 43], [-78, 43], [-79, 44]]); near('thiessen: 1° of longitude at 43.33° N', k.pts[1][0] - k.pts[0][0], 111.32 * Math.cos((43 + 1 / 3) * Math.PI / 180), 1e-9); near('thiessen: 1° of latitude', k.pts[2][1] - k.pts[0][1], 110.574, 1e-9); }
}

// #151 LC50 probit/logit (statsmodels GLM Binomial 0.15, SciPy minimise for fixed natural response)
{
  const conc = [1, 1.8, 3.2, 5.6, 10, 18], g = conc.map((c, i) => ({ conc: c, n: 20, r: [1, 3, 7, 12, 17, 19][i] }));
  const fp = PRB.fitQuantal(g, 'probit');
  near('probit a', fp.a, -1.7155910785833728, 1e-7); near('probit b', fp.b, 2.6843455880975906, 1e-7);
  near('probit v11', fp.cov[0][0], 0.08553099565434798, 1e-7); near('probit v12', fp.cov[0][1], -0.10350482843580822, 1e-7); near('probit v22', fp.cov[1][1], 0.16296633349972064, 1e-7);
  near('probit chi2', fp.chi2, 0.08951499514548839, 1e-8); check('probit not hetero', !fp.hetero && fp.converged);
  const fl = PRB.fitQuantal(g, 'logit');
  near('logit a', fl.a, -2.969842939780918, 1e-7); near('logit b', fl.b, 4.638265859372683, 1e-7); near('logit v22', fl.cov[1][1], 0.6179653051304821, 1e-7);
  const fc = PRB.fitQuantal(g, 'probit', 0.1);
  near('abbott-fixed a', fc.a, -2.28819243, 1e-6); near('abbott-fixed b', fc.b, 3.21307004, 1e-6); near('abbott-fixed loglik', fc.logLik, -51.8029301283888, 1e-8);
  const fh = PRB.fitQuantal(conc.map((c, i) => ({ conc: c, n: 20, r: [0, 6, 4, 14, 13, 20][i] })), 'probit');
  near('hetero chi2', fh.chi2, 11.811882776923222, 1e-6); check('hetero flagged', fh.hetero);
  const L = PRB.lcp(fh, 0.5);
  near('hetero LC50', L.conc, 4.621034433801545, 1e-6); near('hetero lo', L.lo, 1.9951916692740383, 1e-5); near('hetero hi', L.hi, 11.496793286286605, 1e-5);
  const fx = PRB.fitQuantal([{ conc: 0, n: 20, r: 1 }, ...conc.map((c, i) => ({ conc: c, n: 20, r: [2, 4, 8, 13, 17, 20][i] }))], 'probit', 0.05);
  [[0.1, 1.513505034796803, 0.798000494227113, 2.154671843861912], [0.5, 4.107523412143543, 3.116623737702744, 5.254160418674822], [0.9, 11.147467760867054, 8.17676784757237, 19.072579800257216]].forEach(([p, m, lo, hi]) => {
    const L2 = PRB.lcp(fx, p); near(`fixed-c LC${p * 100}`, L2.conc, m, 1e-6); near(`fixed-c LC${p * 100} lo`, L2.lo, lo, 1e-6); near(`fixed-c LC${p * 100} hi`, L2.hi, hi, 1e-6);
  });
  check('control row ignored by fit', fx.groups.length === 6);
  near('abbott', PRB.abbott(0.55, 0.1), 0.5, 1e-12); near('predict at LC50', PRB.predict(fp, PRB.lcp(fp, 0.5).conc), 0.5, 1e-12);
}
// #152 Species sensitivity distribution (SciPy 1.x norm.fit / logistic.fit, Anderson-Darling, AICc weights; bootstrap against a NumPy parametric bootstrap, B = 20000)
{
  const sm = SSD.speciesMeans([{ species: 'Water flea', value: 12 }, { species: 'water flea ', value: 20 }, { species: 'Snail', group: 'mollusc', value: 140 }]);
  check('ssd species merged', sm.length === 2); near('ssd geometric mean', sm[0].value, Math.sqrt(240), 1e-12);
  const y = [Math.sqrt(240), 35, 8.5, 60, 140, 22, 95, 250, 18, 44, 310].map(Math.log10);
  const ln = SSD.fitLnorm(y), lg = SSD.fitLlogis(y);
  near('ssd lnorm mu', ln.mu, 1.6996404588353735, 1e-12); near('ssd lnorm sigma', ln.s, 0.48641399648309974, 1e-12); near('ssd lnorm loglik', ln.logLik, -7.680676961372237, 1e-10);
  near('ssd llogis mu', lg.mu, 1.6841862172135464, 1e-9); near('ssd llogis s', lg.s, 0.29369153004290866, 1e-9); near('ssd llogis aicc', lg.aicc, 21.78357604070394, 1e-9);
  near('ssd lnorm A2', SSD.andersonDarling(y, ln.F), 0.2090133282972051, 1e-9); near('ssd llogis A2', SSD.andersonDarling(y, lg.F), 0.2074122777538303, 1e-8);
  near('ssd lnorm HC5', 10 ** ln.q(0.05), 7.935250342938248, 1e-9); near('ssd llogis HC5', 10 ** lg.q(0.05), 6.598260055842771, 1e-7);
  const w = SSD.weights([ln, lg]); near('ssd AICc weight', w[0], 0.61327772, 1e-7);
  near('ssd averaged HC5', 10 ** SSD.mixQ([ln, lg], w, 0.05), 7.434278803377846, 1e-8);
  const [bl] = SSD.bootstrapHC(ln, [0.05], 20000), [bg] = SSD.bootstrapHC(lg, [0.05], 20000);
  near('ssd lnorm boot lo (MC)', 10 ** bl[0], 3.2175, 0.15); near('ssd lnorm boot hi (MC)', 10 ** bl[1], 23.98, 1.0);
  near('ssd llogis boot lo (MC)', 10 ** bg[0], 2.0073, 0.12); near('ssd llogis boot hi (MC)', 10 ** bg[1], 21.61, 1.0);
  const [ba] = SSD.bootstrapAvg([ln, lg], w, [0.05], 4000); near('ssd averaged boot lo (MC)', 10 ** ba[0], 2.64, 0.2); near('ssd averaged boot hi (MC)', 10 ** ba[1], 22.9, 1.5);
  check('ssd bootstrap repeatable', SSD.bootstrapHC(ln, [0.05], 500)[0][0] === SSD.bootstrapHC(ln, [0.05], 500)[0][0]);
}
// #153 Non-detects (statsmodels SurvfuncRight on flipped data + Greenwood restricted-mean variance; statsmodels impute_ros; SciPy censored log-normal MLE)
{
  const P = (t) => t.split(' ').map((c) => NDS.parseObs(c));
  check('cen parse <', NDS.parseObs('<0.5').nd && NDS.parseObs('<0.5').v === 0.5); check('cen parse ND', NDS.parseObs('ND 2').nd && NDS.parseObs('nd<2').v === 2);
  check('cen parse lone flag', NDS.parseObs('<') === null && NDS.parseObs('') === null && NDS.parseObs('ND') === null);
  check('cen parse flag', NDS.parseObs('3', 'U').nd && !NDS.parseObs('3', '').nd && NDS.parseObs('x') === null);
  const a = P('<1 <1 1.2 <2 1.5 2.3 <2 3.1 0.8 4.6 2.0 <1 6.2 1.1 9.8 2.7');
  const k = NDS.kaplanMeier(a);
  near('cen KM mean', k.mean, 2.481250000000001, 1e-12); near('cen KM se', k.se, 0.6030028476147564, 1e-12);
  near('cen KM F below 1.5', k.steps.find((s) => s.x === 1.5).Fbelow, 0.4821428571428572, 1e-12); near('cen KM median', k.q(0.5), 1.5, 0); near('cen KM p90', k.q(0.9), 6.2, 0);
  const r = NDS.ros(a); near('cen ROS mean', r.mean, 2.4288359198732863, 1e-12); near('cen ROS sd', r.sd, 2.5278432464866607, 1e-12);
  const m = NDS.mleLognormal(a); near('cen MLE mu', m.mu, 0.48887702413174616, 1e-7); near('cen MLE sigma', m.sigma, 0.9032713587661336, 1e-7); near('cen MLE loglik', m.logLik, -18.415341118663846, 1e-9);
  const b = P('<0.5 <1 <1 1.2 <2 1.5 2.3 <2 3.1 0.8 4.6 2.0 <1 6.2 1.1 9.8 2.7 <0.5');
  const k2 = NDS.kaplanMeier(b);
  near('cen KM mean (lowest censored)', k2.mean, 2.208024691358025, 1e-12); near('cen KM se (lowest censored)', k2.se, 0.5647179412752805, 1e-12);
  near('cen KM leftover', k2.leftover, 0.271604938271605, 1e-12); check('cen KM p25 below limits', Number.isNaN(k2.q(0.25)));
  const r2 = NDS.ros(b); near('cen ROS mean 2', r2.mean, 2.148262308336133, 1e-12); near('cen ROS imputed min', Math.min(...r2.values), 0.23949239374100906, 1e-12);
  near('cen MLE mean 2', NDS.mleLognormal(b).mean, 2.314573952100603, 1e-7);
  near('cen half-DL mean', NDS.substitute(a, 0.5).mean, (1.2 + 1.5 + 2.3 + 3.1 + 0.8 + 4.6 + 2 + 6.2 + 1.1 + 9.8 + 2.7 + 0.5 * 3 + 1 * 2) / 16, 1e-12);
  near('cen percentile', NDS.percentile([1, 2, 3, 4], 0.5), 2.5, 1e-12);
}
console.log(`sci: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
