// #1212 virtual-microscope: magnification, field of view and real size, checked by hand.
import { totalMag, fieldOfView, realSize, blurPx, rng } from '../../src/lib/sci/learnj-micro.ts';
export default async (check) => {
  check('microscope: 10× × 40× = 400×', totalMag(10, 40) === 400);
  check('microscope: FOV 18 mm / 40 = 0.45 mm', Math.abs(fieldOfView(18, 40) - 0.45) < 1e-12);
  check('microscope: FOV 18 mm / 4 = 4.5 mm', Math.abs(fieldOfView(18, 4) - 4.5) < 1e-12);
  check('microscope: 12 mm at 400× = 0.03 mm', Math.abs(realSize(12, 400) - 0.03) < 1e-12);
  check('microscope: in focus gives no blur', blurPx(52, 52, 40) === 0);
  check('microscope: 40× blurs more than 4× for the same turn', blurPx(42, 52, 40) > blurPx(42, 52, 4));
  const a = rng(9), b = rng(9);
  check('microscope: seeded drawing repeats', a() === b() && a() === b());
};
