// #1001+ school optics (mirror and lens ray diagrams, refraction, prism, eye, instruments, sky colour): values checked
// against an independent Python calculation (exact fractions for the mirror and lens formulas; math.asin for Snell,
// slab, critical angle and prism; a brute-force scan for minimum deviation; Kasten and Young 1989 for air mass).
import { mirrorImage, lensImage, position, imageTable, power, inContact, refractAngle, criticalAngle, slabShift, apparentDepth, prismPath, minDeviation, indexFromMinDeviation, cauchy, myopiaPower, hypermetropiaPower, simpleMicroscope, compoundMicroscope, telescope, rayleighRatio, airMass } from '../../src/lib/sci/school-optics.ts';
export default async (check) => {
  const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t;
  // Mirrors: concave f = 15 cm at the standard positions (Python Fractions).
  const cc = [[45, -22.5, -0.5], [30, -30, -1], [22.5, -45, -2], [7.5, 15, 2]];
  check('optics: concave mirror f 15 at 45, 30, 22.5, 7.5 cm (v, m)', cc.every(([u, v, m]) => { const i = mirrorImage('concave', 15, u); return near(i.v, v) && near(i.m, m); }));
  { const i = mirrorImage('convex', 15, 22.5); check('optics: convex mirror f 15, u 22.5: v +9, m 0.4, virtual erect', near(i.v, 9) && near(i.m, 0.4) && !i.real && i.erect); }
  { const i = mirrorImage('concave', 15, 15); check('optics: object at F of a concave mirror: image at infinity', !Number.isFinite(i.v) && i.real); }
  { const i = mirrorImage('concave', 15, Infinity); check('optics: object at infinity: image at F (v = f = −15)', i.v === -15 && i.real); }
  { const i = mirrorImage('concave', 15, 30); check('optics: at C: real and inverted', i.real && !i.erect); const j = mirrorImage('concave', 15, 7.5); check('optics: inside F: virtual erect', !j.real && j.erect); }
  // Lenses.
  const lx = [[30, 15, -0.5], [20, 20, -1], [15, 30, -2], [5, -10, 2]];
  check('optics: convex lens f 10 at 30, 20, 15, 5 cm (v, m)', lx.every(([u, v, m]) => { const i = lensImage('convex', 10, u); return near(i.v, v) && near(i.m, m); }));
  { const i = lensImage('concave', 10, 15); check('optics: concave lens f 10, u 15: v −6, m 0.4', near(i.v, -6) && near(i.m, 0.4) && !i.real && i.erect); }
  { const i = lensImage('convex', 10, 10); check('optics: object at F₁ of a convex lens: image at infinity', !Number.isFinite(i.v)); }
  check('optics: power of +50 cm and −25 cm lenses: +2 D, −4 D', near(power(50), 2) && near(power(-25), -4));
  { const c = inContact(20, -40); check('optics: lenses in contact 20 cm and −40 cm: +2.5 D, f 40 cm', near(c.P, 2.5) && near(c.f, 40)); }
  check('optics: standard positions classified', position('concave', 'mirror', 15, 30) === 'at-2f' && position('concave', 'mirror', 15, 45) === 'beyond-2f' && position('concave', 'mirror', 15, 22.5) === 'between-f-2f' && position('concave', 'mirror', 15, 15.2) === 'at-f' && position('concave', 'mirror', 15, 7) === 'inside-f' && position('convex', 'mirror', 15, 7) === 'finite' && position('convex', 'lens', 10, Infinity) === 'infinity' && position('concave', 'lens', 10, 20) === 'finite');
  check('optics: image tables have 6 rows (converging) and 2 (diverging), every position once', imageTable('mirror', 'concave').length === 6 && imageTable('lens', 'convex').length === 6 && imageTable('mirror', 'convex').length === 2 && imageTable('lens', 'concave').length === 2 && new Set(imageTable('lens', 'convex').map((r) => r.pos)).size === 6);
  // Table agrees with the formula at each position.
  check('optics: concave mirror table matches the formula', [[45, (i) => i.real && Math.abs(i.m) < 1 && i.v < -15 && i.v > -30], [22.5, (i) => i.real && Math.abs(i.m) > 1 && i.v < -30], [7.5, (i) => !i.real && i.m > 1]].every(([u, ok]) => ok(mirrorImage('concave', 15, u))));
  // Refraction.
  check('optics: Snell air → glass 1.5 at 30°: 19.471°', near(refractAngle(1, 1.5, 30), 19.47122063449069, 1e-9));
  check('optics: total internal reflection glass → air at 50°', refractAngle(1.5, 1, 50) === null && refractAngle(1.5, 1, 40) !== null);
  check('optics: critical angles glass 41.81°, water 48.75°, diamond 24.41°', near(criticalAngle(1.5, 1), 41.810314895778596, 1e-9) && near(criticalAngle(1.33, 1), 48.753466631327235, 1e-9) && near(criticalAngle(2.42, 1), 24.407468917986588, 1e-9) && criticalAngle(1, 1.5) === null);
  check('optics: slab 5 cm, n 1.5, i 40°: lateral shift 1.3973 cm', near(slabShift(5, 1.5, 40), 1.39734484702548, 1e-9) && near(slabShift(5, 1.5, 0), 0, 1e-12));
  check('optics: apparent depth of 4 m water (n 1.33): 3.008 m', near(apparentDepth(4, 1.33), 3.0075187969924813, 1e-12));
  // Prism.
  { const p = prismPath(60, 1.5, 50); check('optics: prism A 60, n 1.5, i 50: r1 30.710, e 47.209, δ 37.209', near(p.r1, 30.710220766102182, 1e-9) && near(p.e, 47.20931515808148, 1e-9) && near(p.dev, 37.20931515808148, 1e-9)); }
  check('optics: prism minimum deviation 37.1808° (closed form and brute-force scan)', near(minDeviation(60, 1.5), 37.180755781458274, 1e-9));
  check('optics: index back from minimum deviation', near(indexFromMinDeviation(60, minDeviation(60, 1.52)), 1.52, 1e-12));
  check('optics: no emergent ray at grazing small i (TIR at 2nd face)', prismPath(60, 1.5, 20) === null);
  check('optics: Cauchy n rises toward violet', cauchy(1.5, 4200, 400) > cauchy(1.5, 4200, 700) && near(cauchy(1.5, 4200, 600), 1.5 + 4200 / 360000));
  // Eye.
  check('optics: myopia far point 80 cm needs −1.25 D', near(myopiaPower(80), -1.25));
  check('optics: hypermetropia near point 1 m: +3 D to read at 25 cm', near(hypermetropiaPower(100), 3));
  // Instruments.
  { const s = simpleMicroscope(5); check('optics: magnifier f 5 cm: 5× relaxed, 6× at near point', near(s.relaxed, 5) && near(s.near, 6)); }
  { const c = compoundMicroscope(1, 5, 20, 'relaxed'), n = compoundMicroscope(1, 5, 20, 'near'); check('optics: compound microscope fo 1, fe 5, L 20: −70× relaxed, −89× near point', near(c.m, -70) && near(c.uo, 1.0714285714285714) && near(n.m, -89, 1e-9) && near(n.uo, 1.0674157303370786)); }
  { const t = telescope(100, 5, 'relaxed'), n = telescope(100, 5, 'near'); check('optics: telescope fo 100, fe 5: −20× length 105; near point −24×', near(t.m, -20) && near(t.length, 105) && near(n.m, -24)); }
  // Scattering.
  check('optics: Rayleigh: 400 nm scatters (700/400)^4 = 9.379 × 700 nm', near(rayleighRatio(400), 9.37890625));
  check('optics: air mass (Kasten–Young) at 90°, 30°, 10°, 0°', near(airMass(90), 0.9997119918558381, 1e-9) && near(airMass(30), 1.9942928525292494, 1e-9) && near(airMass(10), 5.5860358798512, 1e-9) && near(airMass(0), 37.91960837783621, 1e-9));
};
