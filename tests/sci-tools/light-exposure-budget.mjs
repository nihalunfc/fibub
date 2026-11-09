// #419 light exposure budget: lux-hours, allowed days and lux, UV from µW/lm, and the example plan, checked against an
// independent Python sum (124,800 lx·h, 62.4 % of 200,000, 188 more days at 50 lux for 8 h).
import * as L from '../../src/lib/sci/lightbudget.ts';

export default async (check) => {
  check('light: 50 lux × 8 h × 300 days = 120,000 lx·h', L.luxHours(50, 8, 300) === 120000);
  check('light: 100,000 lx·h allows 250 days at 50 lux, 8 h', L.allowedDays(100000, 50, 8) === 250 && L.allowedDays(1, 0, 8) === Infinity);
  check('light: 100,000 lx·h over 8 h × 300 days allows 41.67 lux', Math.abs(L.allowedLux(100000, 8, 300) - 41.6667) < 1e-4);
  check('light: UV 30 µW/lm at 50 lux = 1.5 mW/m²', Math.abs(L.uvIrradiance(50, 30) - 1.5) < 1e-12);
  check('light: UV dose of 120,000 lx·h at 30 µW/lm = 12,960 J/m²', Math.abs(L.uvDose(120000, 30) - 12960) < 1e-9);
  check('light: dose and irradiance agree (1 h at 1000 lux, 75 µW/lm)', Math.abs(L.uvDose(1000, 75) - (L.uvIrradiance(1000, 75) / 1000) * 3600) < 1e-9);
  const p = L.parsePlan(L.EXAMPLE_PLAN), pl = L.plan(p.periods, 100000, 2);
  check('light: example plan read, header skipped', p.periods.length === 4 && p.bad.length === 0 && p.periods[3].hours === 0.5);
  check('light: example plan totals match Python', pl.total === 124800 && pl.left === 75200 && Math.abs(pl.pct - 62.4) < 1e-9 && pl.perYear === 62400 && pl.rows.map((r) => r.cum).join() === '72000,73800,123800,124800');
  check('light: 188 more days at 50 lux, 8 h', L.allowedDays(pl.left, 50, 8) === 188);
  const over = L.plan([{ name: 'a', lux: 200, hours: 10, days: 100 }], 100000, 1);
  check('light: over budget flagged', over.rows[0].over && over.left === -100000 && over.pct === 200);
  const b = L.parsePlan('12, 8, 10\nBad, 50, 30, 10\nShort, 5');
  check('light: unnamed period, hours over 24 and short rows rejected', b.periods.length === 1 && b.periods[0].name === 'Period 1' && b.bad.length === 2);
  const s = L.parsePlan('A;50,5;8;10');
  check('light: semicolons with decimal commas', s.periods[0].lux === 50.5 && s.periods[0].days === 10);
};
