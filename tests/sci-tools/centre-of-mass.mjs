// #1336 centre of mass: checked against hand-worked seesaws and rods, against the rule that the moments about
// the centre of mass always cancel (500 random seesaws), and the square-shape centres against a fine-grid
// area integral of the same shapes.
import { cm1d, moments, balanceAt, cm2d, cmCells, questions } from '../../src/lib/sci/centre-of-mass.ts';
export default async (check) => {
  const near = (a, b, e = 1e-9) => Math.abs(a - b) <= e * Math.max(1, Math.abs(b));
  const s = [{ m: 30, x: -1 }, { m: 20, x: 1.5 }];
  check('centre-of-mass: 30 kg at −1 m and 20 kg at 1.5 m balance about 0 (294 N m each way)', moments(s, 0).balanced && near(moments(s, 0).acw, 294) && near(cm1d(s), 0));
  check('centre-of-mass: 20 kg must sit at 30 × 1 ÷ 20 = 1.5 m', near(balanceAt([{ m: 30, x: -1 }], 0, 20), 1.5));
  check('centre-of-mass: 2 kg and 6 kg on a 4 m rod: CM 3 m from the 2 kg end', near(cm1d([{ m: 2, x: 0 }, { m: 6, x: 4 }]), 3));
  const p = cm2d([{ m: 1, x: 0, y: 0 }, { m: 2, x: 3, y: 0 }, { m: 3, x: 0, y: 4 }]);
  check('centre-of-mass: 1, 2, 3 kg at (0,0), (3,0), (0,4): CM (1, 2)', near(p.x, 1) && near(p.y, 2));
  let seed = 17; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647); let bad = 0;
  for (let i = 0; i < 500; i++) {
    const ms = Array.from({ length: 1 + Math.floor(rnd() * 4) }, () => ({ m: 1 + rnd() * 60, x: (rnd() - 0.5) * 4 }));
    if (!moments(ms, cm1d(ms)).balanced) bad++;
    const piv = (rnd() - 0.5) * 4, m = 1 + rnd() * 40, x = balanceAt(ms, piv, m);
    if (!moments([...ms, { m, x }], piv).balanced) bad++;
  }
  check('centre-of-mass: about the CM the moments always cancel; the balancing position really balances (500 random seesaws)', bad === 0);
  const integ = (cells) => { const set = new Set(cells.map((c) => c.join(','))); let A = 0, X = 0, Y = 0; const N = 40; for (let i = 0; i < 9 * N; i++) for (let j = 0; j < 7 * N; j++) { const x = (i + 0.5) / N, y = (j + 0.5) / N; if (set.has(`${Math.floor(x)},${Math.floor(y)}`)) { A++; X += x; Y += y; } } return { x: X / A, y: Y / A }; };
  const L = [[1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [2, 5], [3, 5], [4, 5], [2, 1], [2, 2], [2, 3], [2, 4], [3, 4], [4, 4]];
  const ring = [[2, 1], [3, 1], [4, 1], [5, 1], [6, 1], [2, 2], [6, 2], [2, 3], [6, 3], [2, 4], [6, 4], [2, 5], [3, 5], [4, 5], [5, 5], [6, 5]];
  const a = cmCells(L), b = integ(L), c = cmCells(ring), d = integ(ring);
  check(`centre-of-mass: L shape centre (${a.x.toFixed(3)}, ${a.y.toFixed(3)}) matches an area integral`, near(a.x, b.x, 1e-9) && near(a.y, b.y, 1e-9));
  check('centre-of-mass: the frame\'s centre (4.5, 3.5) is outside the shape', near(c.x, 4.5) && near(c.y, 3.5) && near(d.x, 4.5) && !c.inside && a.inside);
  let ok = true; for (let i = 0; i < 300; i++) { const qs = questions(rnd); if (qs.length !== 4 || qs.some((x) => !Number.isFinite(x.ans))) ok = false; }
  check('centre-of-mass: questions have finite answers', ok);
};
