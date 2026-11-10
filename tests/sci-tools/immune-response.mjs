// #1451 immune response timeline. The teaching model is checked against a separate Python version
// (plain loops and numpy argmax) for the two-infection and vaccine stories.
import * as M from '../../src/lib/sci/immune-r.ts';
const near = (a, b, t = 1e-9) => Number.isFinite(a) && Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
export default async (check) => {
  const rs = M.responses([{ day: 100, kind: 'infection' }, { day: 10, kind: 'infection' }], 10);
  const PY = [[15, 0], [20, 1.1072], [26, 1.1], [30, 0.8095049267269332], [100, 0.04618544324632969], [104, 2.40220157189155], [107, 6.47150453575645], [150, 2.8573095672367]];
  check('immune: levels match the Python model on 8 days', PY.every(([t, v]) => near(M.level(rs, t).total, v, 1e-9)));
  check('immune: exposures are sorted; first is primary, second secondary', rs[0].day === 10 && !rs[0].secondary && rs[1].secondary && rs[1].lag === 2 && rs[0].lag === 6);
  const p1 = M.peakOf(rs, 0, 360), p2 = M.peakOf(rs, 1, 360);
  check(`immune: primary peak 1.3 on day 21 (${p1.value}, ${p1.day})`, near(p1.value, 1.3, 1e-6) && p1.day === 21);
  check(`immune: secondary peak 6.4715 on day 107 (${p2.value}, ${p2.day})`, near(p2.value, 6.471504535756474, 1e-6) && p2.day === 107);
  check('immune: 67 days at or above level 2', M.daysProtected(rs, 2, 360) === 67);
  const v = M.responses([{ day: 10, kind: 'vaccine' }, { day: 70, kind: 'vaccine' }, { day: 150, kind: 'infection' }], 10);
  check('immune: vaccine story level on day 150 and 133 days protected', near(M.level(v, 150).total, 1.0209753381617597, 1e-9) && M.daysProtected(v, 2, 360) === 133 && !M.protectedAt(v, 150, 2));
  check('immune: no exposures, no antibodies', M.level(M.responses([]), 50).total === 0);
  check('immune: IgM + IgG = total', (() => { const l = M.level(rs, 104); return near(l.igm + l.igg, l.total); })());
};
