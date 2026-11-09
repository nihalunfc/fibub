// #390 greenhouse heating and ventilation: geometry, heat loss and ventilation checked against an independent
// Python version, with air density and heat capacity from CoolProp (real-gas air) for the example greenhouse.
import { geometry, heating, season, ventilation, airDensity, pressureAtAltitude, CP } from '../../src/lib/sci/greenhouse.ts';

export default async (check) => {
  const rel = (a, b, tol) => Number.isFinite(a) && Math.abs(a / b - 1) <= tol;
  check('greenhouse: dry air density at 20 °C = CoolProp (1.20458) within 0.1 %', rel(airDensity(20), 1.2045751824931505, 1e-3) && rel(airDensity(-10), 1.3423911078134012, 1e-3) && rel(airDensity(28), 1.1724891113402445, 1e-3));
  check('greenhouse: cp of air = CoolProp within 0.1 %', rel(CP, 1005.5715056890148, 1e-3) && rel(CP, 1006.4161671899748, 1e-3));
  check('greenhouse: rho cp / 3600 is about 0.33 Wh/(m³ K) at 20 °C (the rule of thumb)', Math.abs((airDensity(20) * CP) / 3600 - 0.3366) < 0.001);
  check('greenhouse: ISA pressure at 1000 m is 89 875 Pa', Math.abs(pressureAtAltitude(1000) - 89874.6) < 2 && pressureAtAltitude(0) === 101325);
  const g = geometry({ length: 30, width: 9.6, eave: 3, ridge: 4.8 });
  check('greenhouse: example geometry (floor, cover, volume)', g.floor === 288 && rel(g.cover, 562.4641348314311, 1e-12) && rel(g.volume, 1123.2, 1e-12) && Math.abs(g.slope - 20.556) < 0.001);
  const h = heating(g, { U: 4, tIn: 18, tOut: -10, ach: 1, margin: 10 });
  check('greenhouse: heat loss = Python (ideal gas) and CoolProp air within 0.01 %', rel(h.q, 74784.48706225058, 1e-4) && rel(h.q, 74788.44958334551, 1e-4) && rel(h.heater, 82262.93576847565, 1e-4) && rel(h.qCover, 4 * 562.4641348314311 * 28, 1e-12));
  const s = season(h, 3000, { energyMJ: 38, efficiency: 0.85, price: 0.5 });
  check('greenhouse: seasonal heat and gas = Python', rel(s.kWh, 192302.9667315015, 1e-4) && rel(s.fuel, 21433.14799484227, 1e-4) && rel(s.cost, s.fuel * 0.5, 1e-12) && s.degreeHours === 72000);
  check('greenhouse: electricity at 100 % uses kWh one for one', rel(season(h, 3000, { energyMJ: 3.6, efficiency: 1 }).fuel, s.kWh, 1e-12));
  const v = ventilation(g, { I: 800, tau: 0.7, evap: 0.5, dT: 4, tOut: 28, U: 4, countCover: true, fanM3h: 35000 });
  check('greenhouse: ventilation flow = Python, CoolProp air within 0.1 %', rel(v.flow, 15.189115667051281, 1e-4) && rel(v.flow, 15.177933358739093, 1e-3) && rel(v.achMin, 0.8113843839236796, 1e-4) && v.fans === 2 && v.solar === 80640);
  const v2 = ventilation(g, { I: 800, tau: 0.7, evap: 0.5, dT: 4, tOut: 28, U: 4, countCover: false });
  check('greenhouse: without cover loss the flow is larger; energy balance closes', v2.flow > v.flow && rel(v2.flow * airDensity(28) * CP * 4, 80640, 1e-12) && v2.fans === null && rel(v2.cfm, v2.flow * 2118.88, 1e-6));
  const v3 = ventilation(g, { I: 50, tau: 0.7, evap: 0.5, dT: 6, tOut: 10, U: 4, countCover: true });
  check('greenhouse: weak sun needs no ventilation', !v3.needed && v3.flow === 0);
  { const lo = heating(g, { U: 4, tIn: 18, tOut: -10, ach: 1, margin: 0, p: pressureAtAltitude(1500) }); check('greenhouse: thinner air at altitude lowers the air-leak loss only', lo.qAir < h.qAir && lo.qCover === h.qCover); }
  const err = (f) => { try { f(); return ''; } catch (e) { return e.message; } };
  check('greenhouse: bad inputs refused', err(() => geometry({ length: 30, width: 9, eave: 3, ridge: 2 })).includes('ridge') && err(() => heating(g, { U: 4, tIn: 5, tOut: 10, ach: 1, margin: 0 })).includes('inside temperature') && err(() => ventilation(g, { I: 800, tau: 0.7, evap: 1, dT: 4, tOut: 28, U: 4, countCover: true })).includes('below 100'));
};
