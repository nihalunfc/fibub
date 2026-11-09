// #1044 Fleming's left-hand rule. F = I L × B checked against numpy.cross (0.5 T, 3 A, 10 cm at 90°, 30°, 0° and
// 150°: −0.15, −0.075, 0, −0.075 N along y); the motor torque N B I A against a hand calculation (50 × 0.5 × 3 ×
// 0.0025 = 0.1875 N m); the left-hand rule's textbook case (field right, current into the page, force down).
import * as F from '../../src/lib/sci/fleming.ts';
import { seeded, isRight } from '../../src/lib/sci/elec-quiz.ts';
const near = (a, b, r = 1e-9) => Math.abs(a - b) <= r * Math.abs(b) + 1e-15;

export default async (check) => {
  check('fleming: cross product i × j = k', F.cross([1, 0, 0], [0, 1, 0]).join() === '0,0,1' && F.cross([0, 0, 1], [1, 0, 0]).join() === '0,1,0');
  const r = [90, 30, 0, 150].map((t) => F.wireForce(0.5, 3, 0.1, t));
  check('fleming: F = I L × B matches numpy.cross', near(r[0].F[1], -0.15) && near(r[1].F[1], -0.075) && Math.abs(r[2].F[1]) < 1e-15 && near(r[3].F[1], -0.075) && r.every((x) => Math.abs(x.F[0]) < 1e-15 && Math.abs(x.F[2]) < 1e-15));
  check('fleming: size B I L sin θ', near(r[0].size, 0.15) && near(r[1].size, 0.075) && r[2].size < 1e-15);
  check('fleming: field right, current into the page, force down', r[0].dir[2] < 0 && r[0].F[1] < 0);
  check('fleming: reversing the current or the field flips the force; both restores it', F.wireForce(0.5, -3, 0.1, 90).F[1] > 0 && F.wireForce(0.5, 3, 0.1, 90, -1).F[1] > 0 && F.wireForce(0.5, -3, 0.1, 90, -1).F[1] < 0);
  check('fleming: force at right angles to the wire and the field', r.every((x) => Math.abs(x.F[0] * x.dir[0] + x.F[2] * x.dir[2]) < 1e-15 && Math.abs(x.F[0] * x.Bv[0]) < 1e-15));
  check('fleming: motor torque N B I A sin φ', near(F.torque(50, 0.5, 3, 0.0025, 90), 0.1875) && Math.abs(F.torque(50, 0.5, 3, 0.0025, 180)) < 1e-15 && near(F.torque(50, 0.5, 3, 0.0025, 30), 0.09375));
  check('fleming: split ring keeps the torque one way round', [...Array(72)].every((_, k) => F.motorTorque(50, 0.5, 3, 0.0025, k * 5 + 1) >= 0) && F.commutated(90) === 1 && F.commutated(270) === -1 && F.commutated(-90) === -1);
  check('fleming: projection keeps x at no turn, y goes up the screen', F.project([1, 0, 0], 0, 0, 10).join() === '10,0' && F.project([0, 1, 0], 0, 0, 10)[1] === -10);
  let ok = true;
  for (let s = 1; s <= 40; s++) {
    const qs = F.questions(seeded(s));
    for (const q of qs) { if (!(q.answer > 0) || !isRight(String(q.answer), q) || isRight(String(q.answer * 1.1), q)) ok = false; if (!q.steps.join(' ').includes(String(Number(q.answer.toPrecision(3))))) ok = false; }
    const [L, I, B] = qs[0].text.match(/wire ([\d.]+) cm long carries ([\d.]+) A at right angles to a magnetic field of ([\d.]+) T/).slice(1).map(Number);
    if (!near(qs[0].answer, (B * I * L) / 100, 1e-12)) ok = false;
  }
  check('fleming: 40 seeded question sets check out', ok);
};
