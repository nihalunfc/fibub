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

console.log(`sci: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
