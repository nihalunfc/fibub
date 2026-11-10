// #1469 related rates. REF: sympy 1.14, differentiating the explicit shapes with respect to t:
// ladder L = 5, x0 = 3, v = 0.5 at t = 0, 1, 2.5 (y, dy/dt, dθ/dt); balloon V0 = 500, q = 100 at t = 0, 3, 10
// (r, dr/dt, dS/dt); cone R = 2, H = 4, q = 0.5 at t = 1, 4, 8 (h, dh/dt, dr/dt).
import * as RR from '../../src/lib/sci/related-rates.ts';
const near = (a, b, t = 1e-9) => Number.isFinite(a) && Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
export default async (check) => {
  const L = { L: 5, x0: 3, v: 0.5 };
  const lr = [[4, -0.375, -0.125], [3.570714214271425, -0.4900980294098034, -0.14002800840280097], [2.6339134382131846, -0.8067842963896241, -0.18983159915049977]];
  check('related rates: ladder y, dy/dt and dθ/dt match sympy', [0, 1, 2.5].every((t, i) => { const s = RR.ladder(L, t); return near(s.y, lr[i][0]) && near(s.dydt, lr[i][1]) && near(s.dAngle, lr[i][2]); }));
  check('related rates: ladder reaches the ground at t = 4 s', RR.ladderEnd(L) === 4 && RR.ladder(L, 4).done && !RR.ladder(L, 3.99).done);
  const B = { V0: 500, q: 100 };
  const br = [[4.923725109213483, 0.3282483406142322, 40.61965190253037], [5.758823822969722, 0.23995099262373842, 34.72931385785363], [7.101240423074943, 0.15780534273499874, 28.16409360681764]];
  check('related rates: balloon r, dr/dt and dS/dt match sympy', [0, 3, 10].every((t, i) => { const s = RR.balloon(B, t); return near(s.r, br[i][0]) && near(s.drdt, br[i][1]) && near(s.dSdt, br[i][2]); }));
  const C = { R: 2, H: 4, q: 0.5 };
  const cr = [[1.2407009817988, 0.41356699393293334, 0.20678349696646667], [1.969490043685393, 0.1641241703071161, 0.08206208515355805], [2.4814019635976, 0.10339174848323333, 0.05169587424161667]];
  check('related rates: cone h, dh/dt and dr/dt match sympy', [1, 4, 8].every((t, i) => { const s = RR.cone(C, t); return near(s.h, cr[i][0]) && near(s.dhdt, cr[i][1]) && near(s.drdt, cr[i][2]); }));
  check('related rates: cone fills in πR²H/3 ÷ q', near(RR.coneEnd(C), (Math.PI * 4 * 4) / 3 / 0.5) && RR.cone(C, RR.coneEnd(C) + 1).full);
  // Finite differences agree with the rates (second check).
  const fd = (f, t, h = 1e-6) => (f(t + h) - f(t - h)) / (2 * h);
  check('related rates: rates agree with finite differences', near(fd((t) => RR.ladder(L, t).y, 2), RR.ladder(L, 2).dydt, 1e-6) && near(fd((t) => RR.balloon(B, t).r, 5), RR.balloon(B, 5).drdt, 1e-6) && near(fd((t) => RR.cone(C, t).h, 3), RR.cone(C, 3).dhdt, 1e-6));
};
