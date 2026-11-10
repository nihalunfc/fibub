// #1276 Square root spiral. Checked against Python: spoke lengths √(k + 1), the turn after 16 and 17 triangles
// (Σ atan(1/√k) = 351.1504° and 364.7834°), and the semicircle height √x for 1,000 random x.
import { spiral, centreAngle, totalTurn, semicircle, surd } from '../../src/lib/sci/root-spiral.ts';

export default async (check) => {
  const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
  const s = spiral(30);
  check('spiral: spoke k has length √(k + 1)', s.pts.every((p, i) => near(Math.hypot(p[0], p[1]), Math.sqrt(i + 1))));
  let ok = true;
  for (let i = 1; i <= 30; i++) { const a = s.pts[i - 1], b = s.pts[i]; if (!near(Math.hypot(b[0] - a[0], b[1] - a[1]), 1) || Math.abs(a[0] * (b[0] - a[0]) + a[1] * (b[1] - a[1])) > 1e-9) ok = false; }
  check('spiral: each new side is 1 and at right angles to the last spoke', ok);
  check('spiral: turns match Python', near(totalTurn(5), 160.9243, 1e-6) && near(totalTurn(16), 351.1504, 1e-6) && near(totalTurn(17), 364.7834, 1e-6) && centreAngle(1) === 45);
  let ok2 = true;
  for (let i = 0; i < 1000; i++) { const x = 0.01 + Math.random() * 100; if (!near(semicircle(x).bd, Math.sqrt(x), 1e-9)) ok2 = false; }
  check('spiral: semicircle height is √x for 1,000 x', ok2 && semicircle(3.5).r === 2.25 && near(semicircle(9).bd, 3));
  check('spiral: surds', surd(48) === '4√3' && surd(16) === '4' && surd(7) === '√7' && surd(50) === '5√2');
};
