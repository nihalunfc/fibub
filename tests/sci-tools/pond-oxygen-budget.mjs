// #402 Pond oxygen budget: DO saturation against Standard Methods / USGS table values (Benson and Krause) and an
// independent Garcia and Gordon (1992) fit; the night mass balance against scipy solve_ivp and brentq.
import { doSat, doSat1atm, pressureAtm, budget, doAt, timeTo, curve, EXAMPLE } from '../../src/lib/sci/pondo2.ts';
export default async (check) => {
  const near = (a, b, t) => Math.abs(a - b) <= t;
  check('pond O2: saturation 0, 20, 25, 30 °C fresh water at 1 atm = 14.621, 9.092, 8.263, 7.559 mg/L', near(doSat(0), 14.621, 5e-4) && near(doSat(20), 9.092, 5e-4) && near(doSat(25), 8.263, 5e-4) && near(doSat(30), 7.559, 5e-4));
  // Garcia and Gordon (1992), combined fit, coded separately in Python: 9.09191 mg/L at 20 °C; 6.77073 at 25 °C, S = 35.
  check('pond O2: agrees with Garcia and Gordon within 0.03 %', Math.abs(doSat(20) / 9.091908946066152 - 1) < 3e-4 && Math.abs(doSat(25, 35) / 6.77073478243236 - 1) < 3e-4);
  check('pond O2: salt lowers saturation', doSat1atm(25, 35) < doSat1atm(25, 10) && doSat1atm(25, 10) < doSat1atm(25, 0));
  check('pond O2: pressure 1 atm at sea level, 0.8346 at 1500 m', pressureAtm(0) === 1 && near(pressureAtm(1500), 0.83459, 1e-4) && doSat(20, 0, pressureAtm(1500)) < 0.84 * doSat(20));
  const b = budget(EXAMPLE);
  check('pond O2: example volume, saturation 7.8278 mg/L, 115 %', b.V === 6000 && near(b.cs, 7.827780705982864, 1e-12) && near(b.satPct, 114.975, 1e-3));
  check('pond O2: example demand 0.3 + 0.3 + 0.0347 mg/L/h', near(b.fish, 0.3, 1e-15) && near(b.sed, 1 / 1.2 / 24, 1e-15) && near(b.demand, 0.6347222222222222, 1e-15));
  check('pond O2: DO at dawn as solve_ivp (2.22583 mg/L)', near(b.dawn, 2.2258278355766654, 1e-9));
  check('pond O2: falls to 3 mg/L after 9.6906 h as brentq', near(b.hitMin, 9.690638128995351, 1e-8));
  check('pond O2: extra aeration 0.073654 mg/L/h = 0.44193 kg O2/h as brentq', near(b.extraMgLH, 0.07365427991914254, 1e-9) && near(b.extraKgH, 0.44192567951485523, 1e-8));
  { const c = curve(EXAMPLE, b, b.extraMgLH); check('pond O2: with that aeration dawn DO is the minimum', near(c.c.at(-1), 3, 1e-9) && c.t.length === 45 && near(c.c[0], 9, 1e-12)); }
  { const c = curve(EXAMPLE, b); check('pond O2: curve ends at the dawn value', near(c.c.at(-1), b.dawn, 1e-12)); }
  { const b2 = budget({ ...EXAMPLE, aer: 5 }); check('pond O2: aeration already enough', b2.extraKgH === 0 && b2.dawn > 3 && b2.hitMin === Infinity); }
  { const b3 = budget({ ...EXAMPLE, kl: 0 }); check('pond O2: no reaeration: straight-line fall', near(b3.dawn, 9 - 0.6347222222222222 * 11, 1e-12) && near(b3.extraMgLH, 0.6347222222222222 - 6 / 11, 1e-12)); }
  check('pond O2: DO never below zero', doAt(100, 5, 8, 0.01, 1) === 0 && near(timeTo(0, 5, 8, 0, 1), 5, 1e-12));
  check('pond O2: already below the minimum at dusk', budget({ ...EXAMPLE, c0: 2 }).already && budget({ ...EXAMPLE, c0: 2 }).hitMin === 0);
};
