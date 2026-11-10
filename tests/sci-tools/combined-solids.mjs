// #1316 Combined solids. Checked against hand-worked answers and a separate Python calculation (π = 22/7):
// cone r 3.5, H 12 on a hemisphere 214.5 cm² / 243.8333 cm³; capsule r 2.5, h 10 235.7143 / 261.9048;
// rocket r 3, h 10, H 4 264 / 320.5714; dome r 7, h 14 1078 / 2874.6667; cube a 10 with dome r 3.5 638.5 / 1089.8333.
import { solid, invalid, slant } from '../../src/lib/sci/combined-solids.ts';

export default async (check) => {
  const P = 22 / 7, near = (a, b, t = 1e-9) => Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
  const d = (o) => ({ r: 1, h: 1, H: 1, a: 1, ...o });
  const cases = [
    ['icecream', d({ r: 3.5, H: 12 }), 214.5, 243.83333333333331],
    ['capsule', d({ r: 2.5, h: 10 }), 235.71428571428572, 261.90476190476187],
    ['rocket', d({ r: 3, h: 10, H: 4 }), 264.0, 320.57142857142856],
    ['dome', d({ r: 7, h: 14 }), 1078.0, 2874.6666666666665],
    ['cubedome', d({ a: 10, r: 3.5 }), 638.5, 1089.8333333333333],
  ];
  for (const [id, dims, A, V] of cases) { const s = solid(id, dims, P); check(`combined solids: ${id} area ${A}, volume ${V}`, near(s.area, A) && near(s.volume, V)); }
  check('combined solids: slant height of r 3, H 4 is 5', slant(3, 4) === 5);
  // Capsule with h = 0 is a sphere; cube dome adds exactly πr².
  { const s = solid('capsule', d({ r: 2, h: 0 })); check('combined solids: capsule h 0 is a sphere', near(s.area, 4 * Math.PI * 4) && near(s.volume, (4 / 3) * Math.PI * 8)); }
  { const s = solid('cubedome', d({ a: 8, r: 3 })); check('combined solids: dome on a cube adds πr²', near(s.area - 6 * 64, Math.PI * 9)); }
  check('combined solids: dome too wide for the cube is refused, good sizes pass', invalid('cubedome', d({ a: 6, r: 3.5 })) !== null && invalid('cubedome', d({ a: 7, r: 3.5 })) === null && invalid('rocket', d({ r: 0 })) !== null);
};
