// #351 Embryo development timer: Kimmel et al. (1995) H_T = h / (0.055 T − 0.57), checked by hand arithmetic, and the
// degree-hours model checked for consistency (the same stage at every temperature has the same degree-hours).
import * as E from '../../src/lib/sci/embryo.ts';
export default async (check) => {
  const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t;
  const K = { kind: 'kimmel' };
  check('embryo: Kimmel factor at 28.5 °C = 0.9975', near(E.kimmelFactor(28.5), 0.9975));
  check('embryo: 24 h at 28.5 °C takes 24 / 0.805 = 29.814 h at 25 °C', near(E.hoursAt(K, 24, 25), 24 / 0.805) && near(E.hoursAt(K, 24, 25), 29.81366459627329));
  check('embryo: 24 h at 28.5 °C takes 24 / 1.08 = 22.222 h at 30 °C', near(E.hoursAt(K, 24, 30), 22.22222222222222));
  check('embryo: 10 h at 25 °C = 10 × 0.805 / 1.135 = 7.0925 h at 31 °C', near(E.convert(K, 10, 25, 31), 7.092511013215859));
  check('embryo: converting from and to 28.5 °C uses the published formula exactly', near(E.convert(K, 24, 28.5, 25), 24 / 0.805) && near(E.convert(K, 29.81366459627329, 25, 28.5), 24));
  check('embryo: conversion round trip', near(E.convert(K, E.convert(K, 13, 26, 32), 32, 26), 13, 1e-12));
  check('embryo: Kimmel base temperature 0.57 / 0.055 = 10.364 °C', near(E.KIMMEL_BASE, 10.363636363636363));
  // Kimmel is a degree-hours model with base 10.364 °C and reference where the factor is 1.
  { const D = { kind: 'degree', base: E.KIMMEL_BASE, ref: 1.57 / 0.055 }; check('embryo: Kimmel = degree-hours with base 10.364 °C', [20, 25, 28.5, 33].every((T) => near(E.rate(D, T), E.kimmelFactor(T), 1e-12))); }
  const D = { kind: 'degree', base: 12, ref: 20 };
  check('embryo: degree-hours: 40 h at 20 °C (base 12) = 320 °C·h = 26.667 h at 24 °C', near(E.hoursAt(D, 40, 24), 320 / 12) && near(E.degreeHours(12, [{ hours: 40, T: 20 }]), 320));
  check('embryo: a stage has the same degree-hours at every temperature', [14, 18, 22, 30].every((T) => near(E.degreeHours(12, [{ hours: E.hoursAt(D, 40, T), T }]), 320, 1e-9)));
  check('embryo: history 6 h at 28.5 then 12 h at 25 (Kimmel) = 6 + 12 × 0.805 = 15.66 h', near(E.accumulate(K, [{ hours: 6, T: 28.5 }, { hours: 12, T: 25 }]), 15.66));
  check('embryo: no development accrues below the base', E.accumulate(D, [{ hours: 10, T: 8 }]) === 0);
  let m = ''; try { E.hoursAt(D, 10, 11); } catch (e) { m = e.message; } check('embryo: temperature at or below base refused', m.includes('above the base temperature'));
  m = ''; try { E.hoursAt(K, 10, 9); } catch (e) { m = e.message; } check('embryo: Kimmel below 10.36 °C refused', m.includes('10.36'));
  check('embryo: stages parsed and sorted', JSON.stringify(E.parseStages('Heartbeat, 24\nFirst cleavage; 1 h\nHatch\t48 hpf')) === JSON.stringify([{ name: 'First cleavage', hRef: 1 }, { name: 'Heartbeat', hRef: 24 }, { name: 'Hatch', hRef: 48 }]));
  check('embryo: temperature history parsed', JSON.stringify(E.parseSteps('6, 28.5\n12 h at 25 °C\n3 30')) === JSON.stringify([{ hours: 6, T: 28.5 }, { hours: 12, T: 25 }, { hours: 3, T: 30 }]));
  m = ''; try { E.parseStages('Heartbeat'); } catch (e) { m = e.message; } check('embryo: bad stage line refused', m.includes('Stage line 1'));
};
