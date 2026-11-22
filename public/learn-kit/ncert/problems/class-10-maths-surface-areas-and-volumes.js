// Class 10 Maths, Surface Areas and Volumes: live problems (original fibub questions). Ids start with c10m-sav-. Uses π = 22/7.
import { pick, choose, n, steps } from './_util.js';
const PI = 22 / 7;
// (radius, height, slant height) right triangles
const RHL = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [7, 24, 25], [9, 12, 15], [8, 15, 17]];

export default {
  'c10m-sav-cone': {
    title: 'curved surface area of a cone',
    make(r) {
      const [rad, h, l] = choose(r, RHL);
      return { rad, h, q: `<p>A cone has base radius ${rad} cm and height ${h} cm. Find its curved surface area in cm². Use π = 22/7.</p>`, answer: PI * rad * l, unit: 'cm²', tol: 0.005,
        hint: 'First find the slant height l = √(r² + h²). Then curved surface area = πrl.',
        solution: steps(`l = √(${rad}² + ${h}²) = √${rad * rad + h * h} = ${l} cm.`, `CSA = πrl = 22/7 × ${rad} × ${l}.`, `CSA = <b>${n(PI * rad * l)} cm²</b>.`) };
    },
    verify: (x) => (22 / 7) * x.rad * Math.sqrt(x.rad * x.rad + x.h * x.h),
  },
  'c10m-sav-toy': {
    title: 'surface area of a toy (cone on a hemisphere)',
    make(r) {
      const [rad, h, l] = choose(r, RHL);
      return { rad, h, q: `<p>A toy is a cone of height ${h} cm placed on a hemisphere. Both have radius ${rad} cm. Find the total surface area of the toy in cm². Use π = 22/7.</p>`, answer: PI * rad * l + 2 * PI * rad * rad, unit: 'cm²', tol: 0.005,
        hint: 'Only the curved surfaces show. Add the cone’s curved surface πrl and the hemisphere’s 2πr². The joined circles are hidden. Slant height l = √(r² + h²).',
        solution: steps(`l = √(${rad}² + ${h}²) = ${l} cm.`, `Cone side = πrl = ${n(PI * rad * l)} cm². Hemisphere side = 2πr² = ${n(2 * PI * rad * rad)} cm².`, `Total = <b>${n(PI * rad * l + 2 * PI * rad * rad)} cm²</b>.`) };
    },
    verify: (x) => (22 / 7) * x.rad * (Math.hypot(x.rad, x.h) + 2 * x.rad),
  },
  'c10m-sav-toyvol': {
    title: 'volume of a toy (cone on a hemisphere)',
    make(r) {
      const rad = choose(r, [3, 6, 7, 9, 14]), h = choose(r, [4, 6, 8, 9, 12]);
      return { rad, h, q: `<p>A toy is a cone of height ${h} cm on a hemisphere. Both have radius ${rad} cm. Find the volume of the toy in cm³. Use π = 22/7.</p>`, answer: (PI * rad * rad * h) / 3 + (2 * PI * rad ** 3) / 3, unit: 'cm³', tol: 0.005,
        hint: 'Add the volumes: cone ⅓πr²h and hemisphere ⅔πr³.',
        solution: steps(`Cone = ⅓ × 22/7 × ${rad}² × ${h} = ${n((PI * rad * rad * h) / 3)} cm³.`, `Hemisphere = ⅔ × 22/7 × ${rad}³ = ${n((2 * PI * rad ** 3) / 3)} cm³.`, `Total = <b>${n((PI * rad * rad * h) / 3 + (2 * PI * rad ** 3) / 3)} cm³</b>.`) };
    },
    verify: (x) => ((PI * x.rad * x.rad) / 3) * (x.h + 2 * x.rad),
  },
  'c10m-sav-capsule': {
    title: 'surface area of a capsule',
    make(r) {
      const rad = choose(r, [1.4, 2.1, 3.5, 7]), L = pick(r, 12, 30) + (rad < 2 ? 0 : 0);
      return { rad, L, q: `<p>A capsule is a cylinder with a hemisphere at each end. Its total length is ${n(L)} mm and its radius is ${n(rad)} mm. Find its total surface area in mm². Use π = 22/7.</p>`, answer: PI * 2 * rad * (L - 2 * rad) + 4 * PI * rad * rad, unit: 'mm²', tol: 0.005,
        hint: 'The total length is h + 2r, so the cylinder part is h = L − 2r. Surface = 2πrh + 4πr² (the two hemispheres make one sphere).',
        solution: steps(`Cylinder part h = ${n(L)} − 2 × ${n(rad)} = ${n(L - 2 * rad)} mm.`, `Cylinder side = 2πrh = ${n(2 * PI * rad * (L - 2 * rad))} mm². Two hemispheres = 4πr² = ${n(4 * PI * rad * rad)} mm².`, `Total = <b>${n(PI * 2 * rad * (L - 2 * rad) + 4 * PI * rad * rad)} mm²</b>.`) };
    },
    verify: (x) => 2 * (22 / 7) * x.rad * x.L,
  },
  'c10m-sav-tent': {
    title: 'canvas for a tent',
    make(r) {
      const [rad, H, l] = choose(r, RHL), wh = pick(r, 3, 9);
      return { rad, H, wh, q: `<p>A tent is a cylinder of radius ${rad} m and height ${wh} m with a cone of the same radius and height ${H} m on top. Find the area of canvas needed in m² (no floor). Use π = 22/7.</p>`, answer: 2 * PI * rad * wh + PI * rad * l, unit: 'm²', tol: 0.005,
        hint: 'Canvas = curved surface of the cylinder (2πrh) + curved surface of the cone (πrl, with l = √(r² + H²)).',
        solution: steps(`Cylinder wall = 2πrh = 2 × 22/7 × ${rad} × ${wh} = ${n(2 * PI * rad * wh)} m².`, `Slant height l = √(${rad}² + ${H}²) = ${l} m, so the roof = πrl = ${n(PI * rad * l)} m².`, `Canvas = <b>${n(2 * PI * rad * wh + PI * rad * l)} m²</b>.`) };
    },
    verify: (x) => (22 / 7) * x.rad * (2 * x.wh + Math.hypot(x.rad, x.H)),
  },
  'c10m-sav-hollow': {
    title: 'volume of a cylinder with a hemispherical hollow',
    make(r) {
      const rad = choose(r, [3, 6, 7, 9]), h = pick(r, 10, 20);
      return { rad, h, q: `<p>A wooden cylinder of radius ${rad} cm and height ${h} cm has a hemispherical hollow of the same radius scooped out of one end. Find the volume of wood left in cm³. Use π = 22/7.</p>`, answer: PI * rad * rad * h - (2 * PI * rad ** 3) / 3, unit: 'cm³', tol: 0.005,
        hint: 'Volume left = volume of the cylinder − volume of the hemisphere = πr²h − ⅔πr³.',
        solution: steps(`Cylinder = πr²h = 22/7 × ${rad}² × ${h} = ${n(PI * rad * rad * h)} cm³.`, `Hemisphere = ⅔πr³ = ${n((2 * PI * rad ** 3) / 3)} cm³.`, `Left = <b>${n(PI * rad * rad * h - (2 * PI * rad ** 3) / 3)} cm³</b>.`) };
    },
    verify: (x) => (PI * x.rad * x.rad) * (x.h - (2 * x.rad) / 3),
  },
  'c10m-sav-cube': {
    title: 'a cube with a hemisphere on top',
    make(r) {
      const a = choose(r, [7, 14, 21, 28]);
      return { a, q: `<p>A hemisphere of the largest possible radius is placed on top of a cube of edge ${a} cm. Find the total surface area of the solid in cm². Use π = 22/7.</p>`, answer: 6 * a * a + PI * (a / 2) ** 2, unit: 'cm²', tol: 0.005,
        hint: 'The radius is a/2. The cube loses a circle of area πr² on its top face, and the hemisphere adds its curved surface 2πr². Net change: +πr².',
        solution: steps(`r = ${a}/2 = ${n(a / 2)} cm. Cube surface = 6a² = ${6 * a * a} cm².`, `Remove the covered circle πr² = ${n(PI * (a / 2) ** 2)} and add the curved surface 2πr² = ${n(2 * PI * (a / 2) ** 2)}.`, `Total = ${6 * a * a} + ${n(PI * (a / 2) ** 2)} = <b>${n(6 * a * a + PI * (a / 2) ** 2)} cm²</b>.`) };
    },
    verify: (x) => 6 * x.a * x.a - PI * (x.a / 2) ** 2 + 2 * PI * (x.a / 2) ** 2,
  },
};
