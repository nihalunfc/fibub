// Checks for src/lib/learn/curr-physics.ts. Run with `node tests/curr-physics.mjs` (Node 22+ strips the types).
import * as P from '../src/lib/learn/curr-physics.ts';
let n = 0, bad = 0;
const ok = (c, m) => { n++; if (!c) { bad++; console.error('FAIL: ' + m); } };
const near = (a, b, t, m) => ok(Math.abs(a - b) <= t, `${m}: got ${a}, want ${b}`);

// rng repeatable
{ const a = P.rng(5), b = P.rng(5); ok(a() === b() && a() === b(), 'rng repeats'); const c = P.rng(6); ok(P.rng(5)() !== c(), 'rng differs by seed'); }

// I-V
near(P.ivCurrent('resistor', 3), 0.03, 1e-12, 'resistor 3 V / 100 ohm');
near(P.ivCurrent('resistor', -6), -0.06, 1e-12, 'resistor is symmetric');
near(P.ivCurrent('thermistor-cold', 5), 0.005, 1e-12, 'thermistor 20 C');
ok(P.ivCurrent('thermistor-hot', 5) > 3.9 * P.ivCurrent('thermistor-cold', 5), 'hot thermistor passes 4x the current');
ok(P.ivCurrent('ldr-light', 4) > 10 * P.ivCurrent('ldr-dark', 4), 'LDR in light passes far more current');
near(P.ivCurrent('lamp', 6), 0.2, 1e-9, 'lamp at 6 V (hand worked: 100 I^2 + 10 I - 6 = 0, I = 0.2 A)');
{ const I = P.ivCurrent('lamp', 6); near(10 * I * (1 + I / 0.1), 6, 1e-9, 'lamp satisfies V = R0 I (1 + I/I1)'); }
near(P.ivCurrent('lamp', -6), -0.2, 1e-9, 'lamp is odd');
ok(P.resistanceAt('lamp', 6) > 2.7 * P.resistanceAt('lamp', 0.1), 'lamp resistance rises with current');
ok(P.resistanceAt('lamp', 0) === null, 'R is undefined at 0 V');
near(P.resistanceAt('resistor', 4), 100, 1e-9, 'resistor R constant');
ok(Math.abs(P.ivCurrent('diode', -6)) < 1e-9, 'diode reverse current is tiny');
ok(P.ivCurrent('diode', 0.3) < 1e-6, 'diode off below turn-on');
ok(P.ivCurrent('diode', 0.7) > 1e-3, 'diode conducts by 0.7 V');
{ let prev = -1, mono = true; for (let v = -6; v <= 6; v += 0.1) { const i = P.ivCurrent('diode', v); if (i < prev - 1e-15) mono = false; prev = i; } ok(mono, 'diode current rises with V'); }
{ const I = P.ivCurrent('diode', 3), vd = 3 - I * 10; near(P.shockley(vd), I, I * 1e-6, 'diode follows Shockley with its series resistor'); ok(vd > 0.6 && vd < 0.95, 'diode drop is about 0.7 V'); }

// fission
{ const p = { enrich: 0.6, rods: 0, moderator: false };
  const a = P.makeReactor(p, 11), b = P.makeReactor(p, 11);
  while (a.gen < 8 && a.neutrons.length) P.stepGeneration(a);
  while (b.gen < 8 && b.neutrons.length) P.stepGeneration(b);
  ok(JSON.stringify(a.history) === JSON.stringify(b.history), 'same seed gives the same chain'); }
ok(P.estimateK({ enrich: 0, rods: 0, moderator: false }, 3) === 0, 'no U-235, no chain');
{ const k = (e, r, m) => P.estimateK({ enrich: e, rods: r, moderator: m }, 7);
  ok(k(1, 0, false) > k(0.6, 0, false) && k(0.6, 0, false) > k(0.3, 0, false), 'k rises with enrichment');
  ok(k(0.6, 0, false) > 1.05 && P.regime(k(0.6, 0, false)) === 'supercritical', 'enrichment 60 % is supercritical');
  ok(k(0.3, 0, false) < 0.95 && P.regime(k(0.3, 0, false)) === 'subcritical', 'enrichment 30 % is subcritical');
  ok(k(0.6, 3, false) < k(0.6, 0, false) - 0.1, 'control rods lower k');
  ok(k(0.2, 0, true) > k(0.2, 0, false) + 0.3, 'moderator raises k');
  const kc = k(0.2, 0, true); ok(P.regime(kc) === 'critical', `20 % with moderator is about critical (k = ${kc.toFixed(2)})`); }
ok(P.regime(0.94) === 'subcritical' && P.regime(1) === 'critical' && P.regime(1.06) === 'supercritical', 'regime thresholds');
{ const rx = P.makeReactor({ enrich: 1, rods: 0, moderator: true }, 4); for (let i = 0; i < 40 && rx.neutrons.length; i++) P.stepGeneration(rx);
  ok(rx.capped && rx.history.every((h) => h <= P.MAX_NEUTRONS), 'runaway chain is capped'); }
near(P.kFromHistory([1, 2, 4, 8]), 2, 1e-12, 'k from history 1,2,4,8');
near(P.kFromHistory([10, 5, 0]), 0.25, 1e-12, 'k from a dying chain (mean of 0.5 and 0)');

// density
near(P.blockVolume(2, 3, 4), 24, 1e-12, 'block volume');
near(P.balanceReading(2.7, 20), 54, 1e-9, 'aluminium 20 cm3 weighs 54.0 g');
near(P.density(54, 20), 2.7, 1e-12, 'density 54 g / 20 cm3');
near(P.toKgPerM3(2.7), 2700, 1e-9, 'g/cm3 to kg/m3');
ok(P.floats(0.55, 1) && !P.floats(2.7, 1) && !P.floats(1, 1) && P.floats(0.92, 1.38), 'floating rule');
near(P.submergedFraction(0.55, 1), 0.55, 1e-12, 'pine is 55 % under water');
near(P.liquidDensity(80, 180, 100), 1, 1e-12, 'liquid density from cylinder masses');
near(P.liquidDensity(80, 118, 100), 0.38, 1e-12, 'a lighter liquid');
ok(P.overflowReading(23.6) === 24, 'cylinder reads to 1 mL');
near(P.volumeUncertaintyPct([2, 4, 5], 0.05), 2.5 + 1.25 + 1, 1e-9, 'volume uncertainty adds side percentages');

// cooling
near(P.leslieReading(0.95, 100, 20), 100, 1e-9, 'matt black at 100 C reads 100');
near(P.leslieReading(0.05, 100, 20) / P.leslieReading(0.95, 100, 20), 0.05 / 0.95, 1e-12, 'silver reads 5/95 of black');
ok(P.leslieReading(0.9, 60, 20) < P.leslieReading(0.9, 100, 20), 'hotter face emits more');
near(P.leslieEmission(0.95, 100, 20), 0.95 * 5.670374e-8 * (373.15 ** 4 - 293.15 ** 4), 1e-6, 'Stefan-Boltzmann form');
near(P.leslieEmission(1, 20, 20), 0, 1e-12, 'no net emission at room temperature');
near(P.temperatureAt(90, 20, 0.04, 0), 90, 1e-12, 'starts at T0');
near(P.temperatureAt(90, 20, 0.04, P.halfTime(0.04)), 55, 1e-9, 'half-way after one half-time');
near(P.halfTime(0.04), 17.33, 0.01, 'half-time for k = 0.04');
near(P.timeToReach(90, 20, 0.04, 55), P.halfTime(0.04), 1e-9, 'time to reach 55 C');
ok(P.timeToReach(90, 20, 0.04, 10) === null, 'never cools below the room');
ok(P.coolingK('newspaper', 4) < P.coolingK('newspaper', 1) && P.coolingK('newspaper', 1) < P.coolingK('none'), 'more paper cools slower');
ok(P.coolingK('foam') < P.coolingK('bubble') && P.coolingK('none', 1, true) < P.coolingK('none'), 'foam and lid slow cooling');
near(P.coolingK('none'), 0.04, 1e-12, 'bare beaker k');

// ripple tank
near(P.speedFromDepth(5), Math.sqrt(9.81 * 0.005), 1e-12, 'depth to speed');
ok(P.speedFromDepth(2) < P.speedFromDepth(8), 'shallower is slower');
near(P.wavelength(0.2, 10), 0.02, 1e-12, 'lambda = v / f');
near(P.waveSpeed(8, 0.025), 0.2, 1e-12, 'v = f lambda');
near(P.refractedAngle(30, 0.2, 0.1), 14.4775, 1e-3, 'refraction into slower water');
ok(P.refractedAngle(60, 0.1, 0.2) === null, 'total reflection when entering faster water at 60');
near(P.spreadAngle(0.02, 0.04), 30, 1e-9, 'gap of 2 lambda gives 30 degrees');
ok(P.spreadAngle(0.02, 0.02) === 90 && P.spreadAngle(0.02, 0.01) === 90, 'gap equal to or smaller than lambda spreads fully');

if (bad) { console.error(`${bad} of ${n} checks failed`); process.exit(1); }
console.log(`${n} checks passed`);
