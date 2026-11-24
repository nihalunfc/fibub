// #155 Detention pond. New with the coastal detention basin article: a 152.5 x 76.4 m pond with 1.958:1 sides holds 17,200 m3 at
// 1.40 m (the paper's stated storage); a triangular 100-year hydrograph (5.04 m3/s peak at 60 min, ending at 94.04 min) carries
// 14,219 m3; and an orifice sized for 1.44 m3/s routes it to that peak with 0.92 m of water.
import { storageAt, areaAt, tableHydro, route, sizeOrifice } from '../../src/lib/sci/pond.ts';

export default async (check) => {
  const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
  const g = { L: 152.5, W: 76.4, z: 1.958, depth: 1.4 };
  let num = 0; for (let k = 0; k < 4000; k++) num += areaAt(g, (k + 0.5) * 0.00035) * 0.00035;
  check('pond: 152.5 x 76.4 m with 1.958:1 sides holds about 17,200 m3 at 1.40 m, equal to the integral of the area', near(storageAt(g, 1.4), 17200, 5e-4) && near(storageAt(g, 1.4), num, 1e-6));
  check('pond: a vertical-sided 158.03 x 81.84 m outline holds 18,106 m3 at 1.40 m', near(storageAt({ L: 158.03, W: 81.84, z: 0, depth: 1.4 }, 1.4), 18106.4, 1e-5));
  const H = tableHydro([0, 3600, 94.04 * 60], [0, 5.04, 0]);
  check('pond: triangle 5.04 m3/s, 94.04 min carries 14,219 m3', near(H.volume, 14218.8, 1e-5) && H.peak === 5.04);
  const o = { d: 1, cd: 0.6, invert: 0, crest: 1.4, weirL: 3.81, cw: 1.7 };
  const d = sizeOrifice(H.Q, g, o, 8 * 3600, 1.44);
  const r = route(H.Q, g, { ...o, d }, 8 * 3600, 10);
  check('pond: sized orifice for 1.44 m3/s is 1.05 m, peak 1.44, water 0.92 m, 11,000 m3 stored, no overflow', near(d, 1.051, 2e-3) && near(r.peakO, 1.44, 1e-6) && near(r.hMax, 0.92, 0.01) && near(r.sMax, 11042, 0.01) && !r.spill && near(r.tPeakO / 60, 84, 0.02));
};
