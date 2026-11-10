// #1230 Plane mirror lab. Image counts from traced reflections checked against the textbook rule (360/θ − 1 when
// 360/θ is even; odd: 360/θ − 1 on the bisector, 360/θ off it) for every whole-degree θ from 20° to 180° where it
// applies; the reflection formula against hand-worked vectors; the periscope against the 2 × tilt turning rule.
import { reflectDir, wedgeImages, ruleCount, periscope } from '../../src/lib/sci/planemirror-j2.ts';

export default async (check) => {
  const near = (a, b, e = 1e-9) => Math.abs(a - b) <= e;
  const [ax, ay] = reflectDir(1, -1, 0), [bx, by] = reflectDir(-1, 0, 45);
  check('mirror: a ray going down-right off a flat mirror goes up-right; 45° mirror turns left into down', near(ax, 1) && near(ay, 1) && near(bx, 0) && near(by, -1));
  // Angle of reflection = angle of incidence for random rays and mirrors.
  let law = true;
  for (let k = 0; k < 200; k++) {
    const m = Math.random() * 180, a = Math.random() * 2 * Math.PI, d = [Math.cos(a), Math.sin(a)], n = [-Math.sin((m * Math.PI) / 180), Math.cos((m * Math.PI) / 180)];
    const r = reflectDir(d[0], d[1], m), ci = Math.abs(d[0] * n[0] + d[1] * n[1]), cr = Math.abs(r[0] * n[0] + r[1] * n[1]);
    if (!near(ci, cr, 1e-12) || !near(Math.hypot(...r), 1, 1e-12)) law = false;
  }
  check('mirror: angle of reflection = angle of incidence, speed unchanged (200 random rays)', law);
  let rule = true, n = 0;
  for (let th = 20; th <= 180; th++) {
    if (360 % th) continue;
    for (const pos of [0.13, 0.37, 0.5, 0.71, 0.9]) { const r = ruleCount(th, pos === 0.5); if (wedgeImages(th, th * pos).length !== r) rule = false; n++; }
  }
  check(`mirror: traced image count matches the rule (${n} cases)`, rule);
  check('mirror: 90° gives 3, 60° gives 5, 72° gives 5 or 4 on the bisector, flat mirror 1', wedgeImages(90, 30).length === 3 && wedgeImages(60, 20).length === 5 && wedgeImages(72, 20).length === 5 && wedgeImages(72, 36).length === 4 && wedgeImages(180, 40).length === 1);
  const flips = wedgeImages(90, 30).map((i) => [i.flips, Math.round(i.matrix[0] * i.matrix[3] - i.matrix[1] * i.matrix[2])]);
  check('mirror: odd reflections flip the shape (determinant −1), even ones only turn it', flips.every(([f, det]) => det === (f % 2 ? -1 : 1)));
  const p45 = periscope(45, 40, 200), p40 = periscope(40, 40, 200), p44 = periscope(44, 40, 200);
  check('periscope: 45° goes straight down and out level; 44° still gets out; 40° hits the wall', p45.out && near(p45.down, 0, 1e-9) && near(p45.path[2][0], 20, 1e-9) && p44.out && !p40.out && near(p40.down, -10, 1e-9));
};
