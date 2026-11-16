// "Solve my numbers" for the solids lab: volume, total and curved surface area of a cube, cuboid, cylinder, cone,
// sphere or hemisphere, and the missing radius, side or height from a volume. π can be 22/7, 3.14 or exact. No DOM.
import { sf as sf3, type SSpec, type SIn, type SOut } from '../learn/solvecore-b.ts';
import { measure, type Solid } from './solids-l2.ts';

const sf = (x: number, n = 4) => sf3(x, n);
const LEN: [string, number][] = [['cm', 1], ['m', 100], ['mm', 0.1]];
const VOL: [string, number][] = [['cm³', 1], ['m³', 1e6], ['litre', 1000], ['mL', 1]];
const PIS: Record<string, [number, string]> = { exact: [Math.PI, 'π'], '22/7': [22 / 7, '22/7'], '3.14': [3.14, '3.14'] };
const back = (x: SIn) => (x.typed === 0 ? 1 : x.v / x.typed);
const NEED: Record<Solid, string[]> = { cube: ['a'], cuboid: ['l', 'b', 'h'], cylinder: ['r', 'h'], cone: ['r', 'h'], sphere: ['r'], hemisphere: ['r'] };
const NAME: Record<string, string> = { a: 'The side a', l: 'The length', b: 'The breadth', h: 'The height', r: 'The radius' };

export function solids(i: Record<string, SIn>, c: { find: string; ch: Record<string, string> }): SOut {
  const s = c.ch.shape as Solid, [pi, pt] = PIS[c.ch.pi] ?? PIS['22/7'], find = c.find;
  const lines: string[] = [];
  const tip = 'Common mistake: mixing units (cm with m) or using the diameter as the radius (r = d ÷ 2). Surface areas are in square units and volumes in cubic units.';
  const coneSlant = s === 'cone' && c.ch.cone === 'slant';

  if (find === 'rvol' || find === 'hvol') {
    const V = i.V, vu = V.u === 'm³' ? 'm' : 'cm', vf = V.u === 'm³' ? 100 : 1;
    if (!(V.v > 0)) return { error: 'The volume must be more than 0.' };
    const Vc = V.v, un = vu;
    const ref = i.r && !i.r.blank ? i.r : i.h && !i.h.blank ? i.h : i.a && !i.a.blank ? i.a : i.l;
    const u = ref ? ref.u : un, f = ref ? back(ref) : vf;
    const unit = ref ? u : un, g = (x: number) => x / f;
    for (const k of NEED[s]) if (i[k] && !i[k].blank && !(i[k].v > 0)) return { error: `${NAME[k]} must be more than 0.` };
    if (find === 'rvol') {
      let r: number, why: string;
      if (s === 'cube') { r = Math.cbrt(Vc); why = `a = ∛V = ∛${sf(Vc)}`; }
      else if (s === 'sphere') { r = Math.cbrt((3 * Vc) / (4 * pi)); why = `V = ⁴⁄₃πr³, so r = ∛(3V ÷ 4π) = ∛(3 × ${sf(Vc)} ÷ (4 × ${pt}))`; }
      else if (s === 'hemisphere') { r = Math.cbrt((3 * Vc) / (2 * pi)); why = `V = ⅔πr³, so r = ∛(3V ÷ 2π) = ∛(3 × ${sf(Vc)} ÷ (2 × ${pt}))`; }
      else if (s === 'cylinder') { r = Math.sqrt(Vc / (pi * i.h.v)); why = `V = πr²h, so r = √(V ÷ πh) = √(${sf(Vc)} ÷ (${pt} × ${sf(i.h.v)}))`; }
      else if (s === 'cone') { r = Math.sqrt((3 * Vc) / (pi * i.h.v)); why = `V = ⅓πr²h, so r = √(3V ÷ πh) = √(3 × ${sf(Vc)} ÷ (${pt} × ${sf(i.h.v)}))`; }
      else return { error: 'A cuboid has three different sizes, so one volume is not enough. Use "Find the height from the volume" with the length and breadth.' };
      const w = s === 'cube' ? 'side' : 'radius';
      if (V.u !== 'cm³') lines.push(`Volume in cm³: ${sf(V.typed)} ${V.u} = ${sf(Vc)} cm³`);
      lines.push(why + ` = ${sf(r)} cm`);
      return { answer: `The ${w} is ${sf(g(r))} ${unit}.`, lines: unit === 'cm' ? lines : [...lines, `In ${unit}: ${sf(g(r))} ${unit}`], tip: 'Common mistake: forgetting the root. A radius comes from a square root (or a cube root for a sphere). Also 1 litre = 1000 cm³.' };
    }
    let h: number, why: string;
    if (s === 'cuboid') { h = Vc / (i.l.v * i.b.v); why = `V = l b h, so h = V ÷ (l b) = ${sf(Vc)} ÷ (${sf(i.l.v)} × ${sf(i.b.v)})`; }
    else if (s === 'cylinder') { h = Vc / (pi * i.r.v ** 2); why = `V = πr²h, so h = V ÷ πr² = ${sf(Vc)} ÷ (${pt} × ${sf(i.r.v)}²)`; }
    else if (s === 'cone') { h = (3 * Vc) / (pi * i.r.v ** 2); why = `V = ⅓πr²h, so h = 3V ÷ πr² = 3 × ${sf(Vc)} ÷ (${pt} × ${sf(i.r.v)}²)`; }
    else return { error: `A ${s} has no separate height to find. Use "Find the radius (or side) from the volume".` };
    if (V.u !== 'cm³') lines.push(`Volume in cm³: ${sf(V.typed)} ${V.u} = ${sf(Vc)} cm³`);
    lines.push(`${why} = ${sf(h)} cm`);
    return { answer: `The height is ${sf(h / f)} ${unit}.`, lines, tip: 'Check that the volume and the lengths use the same unit: 1 m³ = 1 000 000 cm³ and 1 litre = 1000 cm³.' };
  }

  // forward: needs the dimensions
  const d: Record<string, number> = {};
  for (const k of NEED[s]) { if (coneSlant && k === 'h') continue; d[k] = i[k].v; if (!(d[k] > 0)) return { error: `${NAME[k]} must be more than 0.` }; }
  const refKey = NEED[s].find((k) => !(coneSlant && k === 'h'))!, ref = i[refKey], un = ref.u, f = back(ref);
  const A = (x: number) => x / f / f, Vf = (x: number) => x / f / f / f;
  if (coneSlant) {
    const l = i.sl.v, r = d.r; if (!(l > 0)) return { error: 'The slant height must be more than 0.' };
    if (!(l > r)) return { error: 'The slant height must be longer than the radius (it is the sloping side of a right triangle whose base is r).' };
    d.h = Math.sqrt(l * l - r * r); lines.push(`Height h = √(l² − r²) = √(${sf(l / f)}² − ${sf(r / f)}²) = ${sf(d.h / f)} ${un}`);
  } else if (s === 'cone') lines.push(`Slant height l = √(r² + h²) = √(${sf(d.r / f)}² + ${sf(d.h / f)}²) = ${sf(Math.hypot(d.r, d.h) / f)} ${un}`);
  if (find === 'diag') {
    if (s !== 'cube' && s !== 'cuboid') return { error: 'The space diagonal is for a cube or a cuboid. Pick one of those, or choose a different thing to find.' };
    const [x, y, z] = s === 'cube' ? [d.a, d.a, d.a] : [d.l, d.b, d.h], dg = Math.sqrt(x * x + y * y + z * z);
    return { answer: `The longest diagonal is ${sf(dg / f)} ${un}.`, lines: [...lines, `Diagonal = √(${s === 'cube' ? 'a² + a² + a²' : 'l² + b² + h²'}) = √(${[x, y, z].map((v) => sf(v / f) + '²').join(' + ')}) = ${sf(dg / f)} ${un}`], tip: 'The diagonal of the box goes corner to corner through the inside. It is Pythagoras twice.' };
  }
  const m = measure(s, d);
  const round = m.sidePi !== null;
  const side = round ? m.sidePi! * pi : m.side, tot = round ? m.totalPi! * pi : m.total, vol = round ? m.volumePi! * pi : m.volume;
  const F: Record<Solid, [string, string, string]> = {
    cube: ['4a²', '6a²', 'a³'], cuboid: ['2h(l + b)', '2(lb + bh + hl)', 'l × b × h'],
    cylinder: ['2πrh', '2πr(r + h)', 'πr²h'], cone: ['πrl', 'πr(l + r)', '⅓πr²h'], sphere: ['4πr²', '4πr²', '⁴⁄₃πr³'], hemisphere: ['2πr²', '3πr²', '⅔πr³'],
  };
  const [fs, ft, fv] = F[s];
  const [a, l, b, h, r, sl] = [d.a, d.l, d.b, d.h, d.r, s === 'cone' ? Math.hypot(d.r, d.h) : 0].map((x) => (x === undefined ? '' : sf(x / f)));
  const SUB: Record<Solid, [string, string, string]> = {
    cube: [`${a}³`, `6 × ${a}²`, `4 × ${a}²`], cuboid: [`${l} × ${b} × ${h}`, `2 × (${l}×${b} + ${b}×${h} + ${h}×${l})`, `2 × ${h} × (${l} + ${b})`],
    cylinder: [`${pt} × ${r}² × ${h}`, `2 × ${pt} × ${r} × (${r} + ${h})`, `2 × ${pt} × ${r} × ${h}`], cone: [`⅓ × ${pt} × ${r}² × ${h}`, `${pt} × ${r} × (${sl} + ${r})`, `${pt} × ${r} × ${sl}`],
    sphere: [`⁴⁄₃ × ${pt} × ${r}³`, `4 × ${pt} × ${r}²`, `4 × ${pt} × ${r}²`], hemisphere: [`⅔ × ${pt} × ${r}³`, `3 × ${pt} × ${r}²`, `2 × ${pt} × ${r}²`],
  };
  const [sv, st, sc] = SUB[s];
  const cm = (s === 'cube' || s === 'cuboid') ? 'Lateral surface area' : 'Curved surface area';
  if (find === 'vol') {
    lines.push(`Volume = ${fv}`, `= ${sv} = ${sf(Vf(vol))} ${un}³`);
    return { answer: `The volume is ${sf(Vf(vol))} ${un}³${un === 'cm' ? ` (${sf(Vf(vol) / 1000)} litres)` : ''}.`, lines, tip };
  }
  if (find === 'csa') {
    lines.push(`${cm} = ${fs}`, `= ${sc} = ${sf(A(side))} ${un}²`);
    return { answer: `The ${cm.toLowerCase()} is ${sf(A(side))} ${un}².`, lines, tip };
  }
  lines.push(`Total surface area = ${ft}`, `= ${st} = ${sf(A(tot))} ${un}²`);
  return { answer: `The total surface area is ${sf(A(tot))} ${un}².`, lines, tip };
}

const sh = (...xs: string[]) => (c: { ch: Record<string, string>; find: string }) => xs.includes(c.ch.shape);
const fwd = (c: { find: string }) => c.find !== 'rvol' && c.find !== 'hvol';
export const SOLIDS_SPEC: SSpec = {
  id: 'sol',
  finds: [['vol', 'Volume'], ['tsa', 'Total surface area'], ['csa', 'Curved (or lateral) surface area'], ['diag', 'Diagonal of a cube or cuboid'], ['rvol', 'Radius (or side) from a volume'], ['hvol', 'Height from a volume']],
  fields: [
    { k: 'shape', label: 'The solid', kind: 'choice', options: [['cube', 'Cube'], ['cuboid', 'Cuboid'], ['cylinder', 'Cylinder'], ['cone', 'Cone'], ['sphere', 'Sphere'], ['hemisphere', 'Hemisphere']], def: 'cylinder' },
    { k: 'cone', label: 'For the cone you know', kind: 'choice', options: [['height', 'the height'], ['slant', 'the slant height']], def: 'height', show: (c) => c.ch.shape === 'cone' && c.find !== 'rvol' && c.find !== 'hvol' },
    { k: 'a', label: 'Side a', units: LEN, ph: 'e.g. 5', show: (c) => c.ch.shape === 'cube' && c.find !== 'hvol' && c.find !== 'rvol' },
    { k: 'l', label: 'Length l', units: LEN, ph: 'e.g. 8', show: (c) => c.ch.shape === 'cuboid' && c.find !== 'rvol' },
    { k: 'b', label: 'Breadth b', units: LEN, ph: 'e.g. 5', show: (c) => c.ch.shape === 'cuboid' && c.find !== 'rvol' },
    { k: 'r', label: 'Radius r', units: LEN, ph: 'e.g. 7', show: (c) => sh('cylinder', 'cone', 'sphere', 'hemisphere')(c) && c.find !== 'rvol' && !(c.find === 'hvol' && sh('sphere', 'hemisphere')(c)) },
    { k: 'h', label: 'Height h', units: LEN, ph: 'e.g. 10', show: (c) => (fwd(c) ? sh('cuboid', 'cylinder')(c) || (c.ch.shape === 'cone' && c.ch.cone !== 'slant') : c.find === 'rvol' && sh('cylinder', 'cone')(c)) },
    { k: 'sl', label: 'Slant height l', units: LEN, ph: 'e.g. 25', show: (c) => c.ch.shape === 'cone' && c.ch.cone === 'slant' && fwd(c) },
    { k: 'V', label: 'Volume', units: VOL, ph: 'e.g. 1540', show: (c) => !fwd(c) },
    { k: 'pi', label: 'Use π =', kind: 'choice', options: [['22/7', '22/7'], ['3.14', '3.14'], ['exact', 'π (calculator)']], def: '22/7' },
  ],
  presets: [
    { name: 'Cylinder r = 7 cm, h = 10 cm: volume', find: 'vol', vals: { r: '7', h: '10' }, ch: { shape: 'cylinder' } },
    { name: 'Cone r = 6 cm, slant height 10 cm: total surface area', find: 'tsa', vals: { r: '6', sl: '10' }, ch: { shape: 'cone', cone: 'slant', pi: '3.14' } },
    { name: 'Sphere of radius 3.5 cm: surface area', find: 'tsa', vals: { r: '3.5' }, ch: { shape: 'sphere' } },
    { name: 'Cuboid 8 × 5 × 4: lateral surface area', find: 'csa', vals: { l: '8', b: '5', h: '4' }, ch: { shape: 'cuboid' } },
    { name: 'Sphere with volume 1437.33 cm³: radius', find: 'rvol', vals: { V: '1437.33' }, ch: { shape: 'sphere' } },
    { name: 'Cylinder holding 3 litres, r = 10 cm: height', find: 'hvol', vals: { V: ['3', 'litre'], r: '10' }, ch: { shape: 'cylinder', pi: '3.14' } },
  ],
  solve: (i, c) => solids(i, c),
};
