// #1252 Pick's theorem. Dots inside and on the edges are counted point by point, so I + B/2 − 1 = shoelace area is a
// real check of the counting. Done for the presets and 1 000 random simple polygons (random star-shaped polygons
// around a centre, kept only when problem() finds them simple); the presets were also counted in Python with a winding-number test.
import { count, problem, shoelace, boundaryCount, PRESETS } from '../../src/lib/sci/picks.ts';

export default async (check) => {
  const r = count(PRESETS.rect);
  check('rectangle 5 × 3: I = 8, B = 16, area 15', r.I === 8 && r.B === 16 && r.pick === 15 && r.area === 15);
  const t = count(PRESETS.tri);
  check('triangle (1,1), (8,2), (3,6): I = 16, B = 3, area 16.5', t.I === 16 && t.B === 3 && t.pick === 16.5 && t.area === 16.5);
  check('L and arrow presets agree', ['ell', 'arrow'].every((k) => { const c = count(PRESETS[k]); return c.pick === c.area && problem(PRESETS[k]) === null; }));
  check('B from gcd matches the dot count', Object.values(PRESETS).every((p) => boundaryCount(p) === count(p).B));
  check('unit triangle has area ½', count([[0, 0], [1, 0], [0, 1]]).pick === 0.5);
  check('crossing edges refused', problem([[0, 0], [4, 4], [4, 0], [0, 4]]) !== null);
  check('fold-back refused', problem([[0, 0], [4, 0], [2, 0]]) !== null && problem([[0, 0], [2, 0], [4, 0]]) !== null);
  check('repeated dot and too few dots refused', problem([[0, 0], [3, 0], [0, 0], [0, 3]]) !== null && problem([[0, 0], [3, 0]]) !== null);
  let tested = 0, ok = true;
  for (let i = 0; tested < 1000 && i < 20000; i++) {
    const n = 3 + Math.floor(Math.random() * 6), cx = 5, cy = 4;
    const angs = Array.from({ length: n }, () => Math.random() * 2 * Math.PI).sort((a, b) => a - b);
    const p = angs.map((a) => { const rr = 1 + Math.random() * 3.5; return [Math.round(cx + rr * Math.cos(a)), Math.round(cy + rr * Math.sin(a))]; });
    if (problem(p)) continue;
    tested++;
    const c = count(p);
    if (c.pick !== shoelace(p) || c.B !== boundaryCount(p)) ok = false;
  }
  check(`${tested} random simple polygons: I + B/2 − 1 = shoelace area`, ok && tested >= 500);
};
