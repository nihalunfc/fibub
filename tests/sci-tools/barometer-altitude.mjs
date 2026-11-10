// #1224 barometer and altitude: the pressure formula against a step-by-step integration of the hydrostatic
// equation and the ISA value at 11 km; the boiling point against the Antoine equation for water (an independent
// fit); the mercury column against 760 mm at 1 atm.
import { pressureAt, heightFor, boilAt, column, tempAt, PLACES, COOKER, questions, M_AIR, G0, R, RHO_W } from '../../src/lib/sci/j3-baro.ts';
export default async (check) => {
  const near = (a, b, e = 1e-9) => Math.abs(a - b) <= e * Math.max(1, Math.abs(b));
  check('barometer: sea level 101,325 Pa, 15 °C', pressureAt(0) === 101325 && near(tempAt(0), 15));
  check('barometer: ISA 22,632 Pa at 11,000 m', Math.abs(pressureAt(11000) - 22632) < 2);
  // independent: integrate dP/dh = −P M g / (R T)
  let P = 101325, ok = true; const dh = 1;
  for (let h = 0; h < 9000; h += dh) { const T = 288.15 - 0.0065 * (h + dh / 2); P *= Math.exp(-(M_AIR * G0 / (R * T)) * dh); if ((h + dh) % 1000 === 0 && Math.abs(P - pressureAt(h + dh)) > 0.5) ok = false; }
  check('barometer: matches a 1 m step integration of the hydrostatic equation to 9 km', ok);
  check('barometer: heightFor undoes pressureAt', [0, 1500, 3500, 8849].every((h) => Math.abs(heightFor(pressureAt(h)) - h) < 1e-6));
  check('barometer: water boils at 100 °C at 1 atm', near(boilAt(101325), 100, 1e-12));
  // Antoine (water, 1–100 °C, mmHg): log10 P = 8.07131 − 1730.63 / (233.426 + T)
  const antoine = (Pa) => 1730.63 / (8.07131 - Math.log10(Pa / 133.322)) - 233.426;
  check('barometer: boiling points within 0.35 °C of the Antoine equation from 30 to 201 kPa', [30e3, 45e3, 60e3, 75e3, 90e3, 101e3, 150e3, 201e3].every((x) => Math.abs(boilAt(x) - antoine(x)) < 0.35));
  const leh = PLACES.find((p) => p.id === 'leh'), ev = PLACES.find((p) => p.id === 'everest');
  check('barometer: 3,500 m: 65.8 kPa, water boils near 88 °C', Math.abs(pressureAt(leh.h) - 65770) < 60 && Math.abs(boilAt(pressureAt(leh.h)) - 88.3) < 0.15);
  check('barometer: Everest 8,849 m: about 31.4 kPa, boils near 69 to 70 °C', Math.abs(pressureAt(ev.h) - 31430) < 60 && Math.abs(boilAt(pressureAt(ev.h)) - 70.0) < 0.15);
  check('barometer: cooker at sea level ≈ 201 kPa, boils near 120 °C', Math.abs(boilAt(101325 + COOKER) - 120.2) < 0.15);
  check('barometer: 1 atm holds 760 mm of mercury and 10.33 m of water', Math.abs(column(101325) - 760) < 0.05 && Math.abs(column(101325, RHO_W) - 10332) < 1);
  let seed = 11; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647); let good = true;
  for (let i = 0; i < 300; i++) for (const l of ['8', '11']) for (const x of questions(l, rnd)) if (!(Number.isFinite(x.ans) && (x.choices ? x.ans >= 0 && x.ans < x.choices.length : x.ans > 0))) good = false;
  check('barometer: questions valid', good);
};
