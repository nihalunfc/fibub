// #1391 Fluid mosaic membrane. Checked against hand-worked values: 0.5 × (30 − 6) = 12;
// 10 × 30/38 − 10 × 6/14 = 7.8947 − 4.2857 = 3.6090; pump 3 Na⁺ : 2 K⁺ : 1 ATP.
import * as M from '../../src/lib/sci/cell-membrane.ts';
const near = (a, b, e = 1e-9) => Math.abs(a - b) <= e * Math.max(1, Math.abs(b));
export default async (check) => {
  check('membrane: simple diffusion 0.5 × (30 − 6) = 12', near(M.simpleRate(30, 6), 12) && near(M.simpleRate(6, 30), -12) && M.simpleRate(9, 9) === 0);
  check('membrane: carrier flux saturates at Vmax', near(M.carrierFlux(8), 5) && M.carrierFlux(1e6) < 10 && M.carrierFlux(1e6) > 9.999 && M.carrierFlux(0) === 0);
  check('membrane: facilitated 30 out, 6 in = 3.6090', near(M.facilitatedRate(30, 6), 300 / 38 - 60 / 14) && Math.abs(M.facilitatedRate(30, 6) - 3.6090) < 1e-4);
  check('membrane: facilitated at 60 is 8.82, simple 30', Math.abs(M.facilitatedRate(60, 0) - 8.8235) < 1e-4 && M.simpleRate(60, 0) === 30);
  const p = M.pump(30);
  check('membrane: pump 30 Na⁺ out uses 10 ATP, brings 20 K⁺', p.atp === 10 && p.kIn === 20);
  check('membrane: directions', M.direction(30, 6, 'simple').startsWith('into') && M.direction(6, 30, 'facilitated').startsWith('out') && M.direction(5, 5, 'simple').startsWith('none') && M.direction(5, 50, 'active', true).includes('against'));
  check('membrane: four substances, each with a mode', M.SUBSTANCES.length === 4 && M.SUBSTANCES.every((s) => ['simple', 'facilitated', 'active'].includes(s.mode)));
};
