// #1307 Phototropism plant. A behaviour check of the teaching model against the textbook facts: no bending when lit
// from straight above or in the dark; bending towards a side light, more auxin on the shaded side (72 % at 48° off);
// no bending with the tip covered or cut; on its side the shoot turns up and the root turns down.
import { newPlant, growHour, auxin, tip, aimError, turn } from '../../src/lib/sci/tropism.ts';

export default async (check) => {
  const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t;
  const grow = (L, exp = 'normal', n = 20, tilted = false) => { let p = newPlant(tilted); for (let i = 0; i < n; i++) p = growHour(p, L, exp); return p; };
  const lean = (p) => ((p.shoot.at(-1).a + Math.PI / 2) * 180) / Math.PI;
  check('tropism: turn() wraps angles', near(turn(0, Math.PI / 2), Math.PI / 2) && near(turn(3, -3), 2 * Math.PI - 6, 1e-12));
  const L = { x: 140, y: -130 };
  check('tropism: 72 % auxin on the shaded side at the start', near(auxin(-Math.PI / 2, Math.atan2(-126, 140)).shaded, 0.5 + 0.3 * Math.sin(Math.PI / 2 + Math.atan2(-126, 140)), 1e-12) && Math.round(auxin(-Math.PI / 2, Math.atan2(-126, 140)).shaded * 100) === 72);
  check('tropism: covered or cut tip, even or no auxin', auxin(0, 1, 'cover').shaded === 0.5 && auxin(0, 1, 'cut').shaded === 0 && auxin(0, null).sideways === 0);
  check('tropism: light from above or dark keeps it straight', near(lean(grow({ x: 0, y: -300 })), 0, 1e-9) && near(lean(grow(null)), 0, 1e-9));
  const p10 = grow(L, 'normal', 10);
  check('tropism: side light bends it right (36° after 10 h) and closer to the light', near(lean(p10), 36.25, 0.01) && aimError(p10, L) < aimError(newPlant(), L) && tip(p10.shoot).x > 20);
  const pl = grow({ x: -140, y: -130 }, 'normal', 10);
  check('tropism: a light on the left bends it left by the same amount', near(lean(pl), -36.25, 0.01));
  check('tropism: covered tip grows straight to the same height', near(lean(grow(L, 'cover', 10)), 0, 1e-9) && near(tip(grow(L, 'cover', 10).shoot).y, -49, 1e-9));
  check('tropism: cut tip barely grows and does not bend', near(lean(grow(L, 'cut', 10)), 0, 1e-9) && tip(grow(L, 'cut', 10).shoot).y > -20);
  const side = grow(null, 'normal', 30, true);
  check('tropism: on its side, shoot turns up and root turns down', side.shoot.at(-1).a < -0.9 && side.root.at(-1).a < Math.PI - 0.5 && side.root.at(-1).a > Math.PI / 2);
};
