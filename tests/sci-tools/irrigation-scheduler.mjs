// #383 irrigation scheduler: FAO-56 single-Kc root-zone water balance, checked against an independent Python
// implementation (200 random seasons with Kc and irrigation columns, adjusted p, both modes: 67,700 values agree
// to 2e-14 mm) and the made-up example season below.
import { balance, readDays, taw, pAdjusted, EXAMPLE } from '../../src/lib/sci/irrigation.ts';

export default async (check) => {
  const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
  const soil = { fc: 0.30, wp: 0.14, zr: 0.6, p: 0.5, adjustP: false };
  const o = { kc: 1.1, d0: 20, rainFrac: 0.9, rainMin: 2, mode: 'auto', trigger: 1, refill: 0, eff: 0.8 };
  check('irrigation: TAW = 1000 × (0.30 − 0.14) × 0.6 m = 96 mm', near(taw(soil), 96));
  check('irrigation: p adjusted for ETc 7 mm/day: 0.5 + 0.04 × (5 − 7) = 0.42', near(pAdjusted(0.5, 7), 0.42) && pAdjusted(0.7, 0) === 0.8);
  const { days, skipped } = readDays(EXAMPLE);
  check('irrigation: example has 61 days', days.length === 61 && skipped === 0 && days[20].rain === 38);
  const rows = balance(days, soil, o), sum = (k, rs = rows) => rs.reduce((s, r) => s + r[k], 0);
  check('irrigation: example net irrigation 305.56 mm in 6 turns (Python 305.56)', near(sum('irrNet'), 305.56) && rows.filter((r) => r.irrNet > 0).length === 6);
  check('irrigation: first turn on 2026-06-06, refilling 52.23 mm', rows[5].date === '2026-06-06' && near(rows[5].irrNet, 52.23) && near(rows[5].irrGross, 52.23 / 0.8));
  check('irrigation: deep percolation 10.55 mm, final depletion 25.74 mm, ET 367.62 mm (Python)', near(sum('dp'), 10.55) && near(rows[60].d, 25.74) && near(sum('eta'), 367.62));
  { const r = balance(days, soil, { ...o, mode: 'none' });
    check('irrigation: with no irrigation, 55 stress days, ET 140.593 mm, depletion 93.723 mm (Python)', r.filter((x) => x.ks < 1).length === 55 && near(sum('eta', r), 140.59271715221047) && near(r[60].d, 93.72271715221045)); }
  { const r = balance(days, { ...soil, adjustP: true }, o);
    check('irrigation: adjusted p gives 7 turns, 322.862 mm (Python)', r.filter((x) => x.irrNet > 0).length === 7 && near(sum('irrNet', r), 322.86181096616633)); }
  // Hand-worked day: D 40, ET0 5, Kc 1, rain 10 at 90 % -> D = 40 - 9 + 5 = 36.
  { const r = balance([{ date: 'a', et0: 5, rain: 10 }], soil, { ...o, kc: 1, d0: 40 })[0];
    check('irrigation: one hand-worked day (40 − 9 + 5 = 36 mm)', near(r.d, 36) && near(r.pe, 9) && r.irrNet === 0); }
  // Light rain below the threshold is ignored; an irrigation column counts at the application efficiency.
  { const r = balance([{ date: 'a', et0: 4, rain: 1.5, irr: 25 }], soil, { ...o, kc: 1, d0: 30 })[0];
    check('irrigation: rain under 2 mm ignored, 25 mm applied counts as 20 mm', r.pe === 0 && near(r.d, 30 - 20 + 4)); }
  // Stress: D above RAW reduces ET by Ks = (TAW − D) / ((1 − p) TAW).
  { const r = balance([{ date: 'a', et0: 5, rain: 0 }], soil, { ...o, kc: 1, d0: 72, mode: 'none' })[0];
    check('irrigation: Ks at 72 mm depletion = 24 / 48 = 0.5', near(r.ks, 0.5) && near(r.eta, 2.5)); }
  { const r = readDays('5\t0\n4,5\t3\nbad\t1');
    check('irrigation: headerless table, decimal comma, bad row skipped', r.days.length === 2 && r.days[1].et0 === 4.5 && r.skipped === 1); }
  check('irrigation: header without ET0 is refused', readDays('date,temp\n2026-01-01,5').error.includes('ET0'));
  { const r = readDays('date,ET0,rain,Kc,irrigation\n2026-06-01,5,,0.8,12');
    check('irrigation: Kc and irrigation columns by name, blank rain is 0', r.hasKc && r.hasIrr && r.days[0].kc === 0.8 && r.days[0].irr === 12 && r.days[0].rain === 0); }
};
