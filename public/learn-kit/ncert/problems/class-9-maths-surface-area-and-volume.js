// Class 9 Maths, Math of Space: Surface Area and Volume: live problems (original fibub questions). Ids start with c9m-vol-.
import { pick, choose, n, steps } from './_util.js';

const TRIP = [[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17]];
export default {
  'c9m-vol-cuboid': {
    title: 'surface area of a cuboid',
    make(r) {
      const l = pick(r, 4, 20), b = pick(r, 3, 15), h = pick(r, 2, 12), answer = 2 * (l * b + b * h + h * l);
      return { l, b, h, q: `<p>A cuboid-shaped cardboard box is <b>${l} cm</b> long, <b>${b} cm</b> wide and <b>${h} cm</b> high. Find the area of cardboard needed to cover all six faces (its total surface area).</p>`, answer, unit: 'cm²', tol: 0.002,
        hint: 'Faces come in three equal pairs: l × b, b × h and h × l.',
        solution: steps(`Pairs: ${l}×${b} = ${l * b}, ${b}×${h} = ${b * h}, ${h}×${l} = ${h * l}.`, `Total = 2 × (${l * b} + ${b * h} + ${h * l}) = 2 × ${l * b + b * h + h * l}.`, `= <b>${answer} cm²</b>.`) };
    },
    verify(x) { return [x.l * x.b, x.l * x.b, x.b * x.h, x.b * x.h, x.h * x.l, x.h * x.l].reduce((s, v) => s + v, 0); },
  },
  'c9m-vol-cube': {
    title: 'volume of a cube from its surface area',
    make(r) {
      const a = pick(r, 2, 15), S = 6 * a * a;
      return { S, q: `<p>The total surface area of a cube is <b>${S} cm²</b>. Find its volume.</p>`, answer: a * a * a, unit: 'cm³', tol: 0.002,
        hint: 'A cube has 6 equal square faces, so 6a² = surface area. Find the edge a first.',
        solution: steps(`6a² = ${S}, so a² = ${S / 6} and a = ${a} cm.`, `Volume = a³ = ${a}³ = <b>${a ** 3} cm³</b>.`) };
    },
    verify(x) { const e = Math.sqrt(x.S / 6); return e * e * e; },
  },
  'c9m-vol-tank': {
    title: 'litres in a cylindrical tank',
    make(r) {
      const rad = pick(r, 0.5, 2, 0.1), h = pick(r, 1, 4, 0.5), answer = Math.PI * rad * rad * h * 1000;
      return { rad, h, q: `<p>A round water tank has base radius <b>${rad.toFixed(1)} m</b> and height <b>${h} m</b>. How many litres of water does it hold when full? (1 m³ = 1000 litres; use π = 3.1416.)</p>`, answer, unit: 'litres', tol: 0.005,
        hint: 'Volume of a cylinder = πr²h, in m³. Then multiply by 1000.',
        solution: steps(`Volume = π × ${rad.toFixed(1)}² × ${h} = ${n(Math.PI * rad * rad * h, 5)} m³.`, `In litres: × 1000 = <b>${n(answer, 5)} litres</b>.`) };
    },
    verify(x) { const d = 2 * x.rad, baseArea = (Math.PI * d * d) / 4; return baseArea * x.h * 1000; },
  },
  'c9m-vol-conecsa': {
    title: 'curved surface of a cone',
    make(r) {
      const [a, b, c] = choose(r, TRIP), k = choose(r, [1, 2, 3]), rad = a * k, h = b * k, l = c * k;
      return { rad, h, q: `<p>A conical tent has base radius <b>${rad} m</b> and height <b>${h} m</b>. Find the area of canvas in its curved surface. (Use π = 3.14.)</p>`, answer: 3.14 * rad * l, unit: 'm²', tol: 0.004,
        hint: 'First find the slant height l = √(r² + h²). Then curved surface = πrl.',
        solution: steps(`l = √(${rad}² + ${h}²) = √${rad * rad + h * h} = ${l} m.`, `Curved surface = π r l = 3.14 × ${rad} × ${l} = <b>${n(3.14 * rad * l, 5)} m²</b>.`) };
    },
    verify(x) { return 0.5 * (2 * 3.14 * x.rad) * Math.sqrt(x.rad * x.rad + x.h * x.h); },
  },
  'c9m-vol-sphere': {
    title: 'volume of a sphere',
    make(r) {
      const rad = pick(r, 3, 15), answer = (4 / 3) * Math.PI * rad ** 3;
      return { rad, q: `<p>Find the volume of a sphere of radius <b>${rad} cm</b>. (Use π = 3.1416.)</p>`, answer, unit: 'cm³', tol: 0.004,
        hint: 'Volume of a sphere = 4⁄3 πr³.',
        solution: steps(`V = 4⁄3 × π × ${rad}³ = 4⁄3 × π × ${rad ** 3}.`, `= <b>${n(answer, 5)} cm³</b>.`) };
    },
    verify(x) { const hemi = Math.PI * x.rad ** 3 - (Math.PI * x.rad ** 3) / 3; return 2 * hemi; },
  },
  'c9m-vol-recast': {
    title: 'melting a big ball into small balls',
    make(r) {
      const sm = pick(r, 1, 4), k = pick(r, 2, 6), big = sm * k;
      return { sm, big, q: `<p>A solid metal sphere of radius <b>${big} cm</b> is melted and recast into small solid spheres of radius <b>${sm} cm</b>. How many small spheres can be made?</p>`, answer: k ** 3, unit: '', tol: 0.002,
        hint: 'The metal does not change, so total volume stays the same. Divide the big volume by the small volume.',
        solution: steps(`Big volume = 4⁄3 π × ${big}³. Small volume = 4⁄3 π × ${sm}³.`, `Number = (${big} ÷ ${sm})³ = ${k}³ = <b>${k ** 3}</b>.`) };
    },
    verify(x) { return ((4 / 3) * Math.PI * x.big ** 3) / ((4 / 3) * Math.PI * x.sm ** 3); },
  },
};
