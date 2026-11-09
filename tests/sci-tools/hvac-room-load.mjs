// #663 room heating and cooling load. Reference values from an independent Python calculation written for these
// tests (fabric U·A·ΔT, glazing A·SHGC·I, outdoor air with Hyland-Wexler humidity ratios and ASHRAE moist-air
// specific volume, people, lighting and equipment), and a check that sensible plus latent outdoor-air load equals
// the enthalpy difference.
import { roomLoad, W_TO_BTUH, W_PER_TON } from '../../src/lib/sci/hvacload.ts';
import { air } from '../../src/lib/sci/psychro.ts';
export default async (check) => {
  const near = (a, b, rel) => Math.abs(a - b) <= rel * Math.max(Math.abs(b), 1e-300);
  const base = { elements: [{ name: 'External wall', area: 10.5, U: 0.35, extraDT: 5 }, { name: 'Window', area: 3, U: 1.6, shgc: 0.4, sun: 400 }, { name: 'Roof', area: 20, U: 0.2, extraDT: 10 }], volume: 54, ach: 0.5, ventLps: 20, p: 101325, tiH: 21, toH: -10, rhoH: 0.8, tiC: 24, rhiC: 0.5, toC: 32, rhoC: 0.4, people: 2, perSens: 75, perLat: 55, lightW: 200, equipW: 300, creditHeating: false, margin: 0.1 };
  const r = roomLoad(base);
  check('hvac: example heating matches Python (1691.26 W)', near(r.heat, 1691.2596939100574, 1e-10));
  check('hvac: example cooling sensible and latent match Python (1699.41 W, 349.00 W)', near(r.sens, 1699.4105861255111, 1e-10) && near(r.lat, 349.00477107997295, 1e-10) && near(r.total, 2048.4153572054843, 1e-10));
  { const a = r.rows.find((x) => x.name.startsWith('Outdoor air')), o = air(32, 101325, { rh: 0.4 }), i = air(24, 101325, { rh: 0.5 });
    check('hvac: outdoor-air sensible + latent equals mass flow × enthalpy difference', near(a.sens + a.lat, (r.mC * (o.h - i.h)) * 1000, 1e-12) && near(a.sens + a.lat, 464.0207792777128, 1e-10)); }
  check('hvac: fabric and solar rows', r.rows[0].heat === 0.35 * 10.5 * 31 && near(r.rows[2].sens, 3 * 0.4 * 400, 1e-12) && r.rows[2].name === 'Window: sun');
  check('hvac: unit conversions (1 ton = 12,000 BTU/h)', near(W_PER_TON * W_TO_BTUH, 12000, 1e-6));
  { const c = roomLoad({ ...base, creditHeating: true, margin: 0 }), n = roomLoad({ ...base, margin: 0 });
    check('hvac: crediting internal gains lowers heating by exactly the gains', near(n.heat - c.heat, 2 * 75 + 200 + 300, 1e-9)); }
  { const z = roomLoad({ ...base, margin: 0, people: 0, ach: 0, ventLps: 0, lightW: 0, equipW: 0, elements: [{ name: 'Wall', area: 10, U: 0.5 }] });
    check('hvac: single wall alone is U·A·ΔT both ways', z.heat === 0.5 * 10 * 31 && z.sens === 0.5 * 10 * 8 && z.lat === 0); }
  { const d = roomLoad({ ...base, rhoC: 0.1, people: 0, margin: 0 });
    check('hvac: dry outdoor air gives no negative latent total', d.lat === 0); }
  { const hi = roomLoad({ ...base, p: 79500 }); check('hvac: thinner air at altitude carries less heat', hi.heat < r.heat && hi.sens < r.sens); }
};
