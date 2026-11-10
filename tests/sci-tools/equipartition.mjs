// #1349 equipartition: checked against hand counts (3N = translations + rotations + vibration modes) and Python.
import { freedoms, heatCaps, internalEnergy, mix, R } from '../../src/lib/sci/n2-kinetic.ts';
export default async (check) => {
  const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  check('equip: monatomic f 3, γ 5/3', freedoms('mono', false).f === 3 && near(heatCaps(3).gamma, 5 / 3));
  check('equip: rigid diatomic f 5, γ 7/5; with vibration f 7, γ 9/7', freedoms('di', false).f === 5 && freedoms('di', true).f === 7 && near(heatCaps(7).gamma, 9 / 7));
  check('equip: CO₂ linear: 4 vibration modes; rigid f 5, hot f 13', freedoms('lin3', false).modes === 4 && freedoms('lin3', false).f === 5 && freedoms('lin3', true).f === 13);
  check('equip: H₂O bent: 3 modes; rigid f 6 (γ 4/3), hot f 12', freedoms('nonlin', false).modes === 3 && freedoms('nonlin', false).f === 6 && near(heatCaps(6).gamma, 4 / 3) && freedoms('nonlin', true).f === 12);
  check('equip: 3N rule: trans + rot + modes = 3 × atoms', ['mono', 'di', 'lin3', 'nonlin'].every((s) => { const f = freedoms(s, false), n = { mono: 1, di: 2, lin3: 3, nonlin: 3 }[s]; return f.trans + f.rot + f.modes === 3 * n; }));
  check('equip: Cv diatomic 20.786 J/(mol K), Cp 29.101', near(heatCaps(5).Cv, 20.786156545) && near(heatCaps(5).Cp, 29.100619163));
  check('equip: U of 1 mol diatomic at 300 K = 6235.85 J (Python)', near(internalEnergy(1, 5, 300), 6235.8469635));
  check('equip: 1 mol He + 1 mol N₂: Cv 2R, γ 3/2', near(mix(1, 3, 1, 5).Cv, 2 * R) && near(mix(1, 3, 1, 5).gamma, 1.5));
  check('equip: 2 mol He + 3 mol O₂: γ = 1.4762 (Python 31/21)', near(mix(2, 3, 3, 5).gamma, 31 / 21));
};
