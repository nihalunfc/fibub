// "Solve my numbers" for combined solids: total surface area (hidden joins left out), volume, painting cost and how
// many small spheres can be cast from the melted solid. π can be 22/7, 3.14 or exact. No DOM.
import { sf as sf3, type SSpec, type SIn, type SOut } from '../learn/solvecore-b.ts';
import { solid, invalid, SHAPES, type ShapeId } from './combined-solids.ts';

const sf = (x: number, n = 4) => sf3(x, n);
const LEN: [string, number][] = [['cm', 1], ['m', 100], ['mm', 0.1]];
const PIS: Record<string, [number, string]> = { exact: [Math.PI, 'π'], '22/7': [22 / 7, '22/7'], '3.14': [3.14, '3.14'] };
const TOTAL_OK: ShapeId[] = ['icecream', 'capsule', 'dome'];
const back = (x: SIn) => (x.typed === 0 ? 1 : x.v / x.typed);

export function combined(i: Record<string, SIn>, c: { find: string; ch: Record<string, string> }): SOut {
  const id = (c.ch.shape || 'icecream') as ShapeId, [pi, pt] = PIS[c.ch.pi] ?? PIS['22/7'];
  const total = c.ch.ht === 'total' && TOTAL_OK.includes(id);
  const r = i.r, un = r.u, f = back(r), lines: string[] = [];
  const uses = SHAPES.find((s) => s.id === id)!.uses;
  let h = i.h && !i.h.blank ? i.h.v : 0, H = i.H && !i.H.blank ? i.H.v : 0;
  const a = i.a?.v ?? 0;
  if (total) {
    const T = i.T.v;
    if (id === 'icecream') { H = T - r.v; lines.push(`Cone height H = total height − hemisphere radius = ${sf(i.T.typed)} − ${sf(r.typed)} = ${sf(H / f)} ${un}`); }
    else if (id === 'capsule') { h = T - 2 * r.v; lines.push(`Cylinder length h = total length − 2 × radius = ${sf(i.T.typed)} − 2 × ${sf(r.typed)} = ${sf(h / f)} ${un}`); }
    else { h = T - r.v; lines.push(`Cylinder height h = total height − hemisphere radius = ${sf(i.T.typed)} − ${sf(r.typed)} = ${sf(h / f)} ${un}`); }
    if ((id === 'icecream' && !(H > 0)) || (id !== 'icecream' && !(h >= 0))) return { error: 'The total height is too small: it must be more than the parts that are already counted (for a capsule, more than 2r; for a dome or cone on a hemisphere, more than r).' };
  }
  const d = { r: r.v, h, H, a };
  const bad = invalid(id, d); if (bad) return { error: bad.replace(/^r /, 'The radius ').replace(/^h /, 'The cylinder height ').replace(/^H /, 'The cone height ').replace(/^a /, 'The side a ') };
  const s = solid(id, d, pi);
  const l2 = Math.hypot(r.v, H);
  const slantLine = uses.includes('H') ? [`Slant height of the cone l = √(r² + H²) = √(${sf(r.typed)}² + ${sf(H / f)}²) = ${sf(l2 / f)} ${un}`] : [];
  const A = (x: number) => x / f / f, V = (x: number) => x / f / f / f;
  const sa = s.surfaces.map((p) => `${p.name} (${p.formula}) = ${sf(A(p.value))}`);
  const vv = s.volumes.map((p) => `${p.name} (${p.formula}) = ${sf(V(p.value))}`);
  const hid = s.hidden.length ? ` Hidden joins left out: ${s.hidden.map((p) => p.name.toLowerCase()).join('; ')}.` : '';
  const tip = 'Common mistake: counting the flat faces where the parts are joined. They are inside the solid, so they are not part of the surface. For a cone use the slant height l (not H) in πrl; for volume use the vertical height H.';
  if (c.find === 'sa') {
    lines.push(...slantLine, `Using π = ${pt}`, ...sa.map((x) => `${x} ${un}²`), `Total surface area = ${s.surfaces.map((p) => sf(A(p.value))).join(' + ').replace(/\+ −/g, '− ')} = ${sf(A(s.area))} ${un}².${hid}`);
    if (i.rate && !i.rate.blank) { const cost = A(s.area) * i.rate.typed; lines.push(`Cost = area × rate = ${sf(A(s.area))} × ${sf(i.rate.typed)} = ${sf(cost)}`); return { answer: `The total surface area is ${sf(A(s.area))} ${un}², so the cost is ${sf(cost)}.`, lines, tip }; }
    return { answer: `The total surface area is ${sf(A(s.area))} ${un}².`, lines, tip };
  }
  if (c.find === 'vol') {
    lines.push(`Using π = ${pt}`, ...vv.map((x) => `${x} ${un}³`), `Volume = ${s.volumes.map((p) => sf(V(p.value))).join(' + ')} = ${sf(V(s.volume))} ${un}³`);
    const extra = un === 'cm' ? ` (${sf(V(s.volume) / 1000)} litres, since 1000 cm³ = 1 litre)` : '';
    return { answer: `The volume is ${sf(V(s.volume))} ${un}³${extra}.`, lines, tip };
  }
  // melt
  const rs = i.rs; if (!(rs.v > 0)) return { error: 'The radius of each small sphere must be more than 0.' };
  const vs = (4 / 3) * pi * rs.v ** 3, n = s.volume / vs;
  lines.push(`Using π = ${pt}`, ...vv.map((x) => `${x} ${un}³`), `Volume of the solid = ${sf(V(s.volume))} ${un}³`, `One small sphere: ⁴⁄₃πr³ = ⁴⁄₃ × ${pt} × ${sf(rs.typed)}³ = ${sf(vs / f / f / f)} ${un}³ (radius converted to ${un})`, `Number of spheres = volume ÷ one sphere = ${sf(V(s.volume))} ÷ ${sf(vs / f / f / f)} = ${sf(n, 5)}`);
  const whole = Math.floor(n + 1e-9);
  return { answer: Math.abs(n - Math.round(n)) < 1e-6 ? `${Math.round(n)} spheres can be made.` : `About ${sf(n, 4)}, so ${whole} whole spheres can be made.`, lines, tip: 'Melting and recasting does not change the volume, so equate the two volumes. Use the same unit for both radii.' };
}

export const COMBINED_SPEC: SSpec = {
  id: 'comb',
  finds: [['sa', 'Total surface area'], ['vol', 'Volume'], ['melt', 'Melt it into small spheres']],
  fields: [
    { k: 'shape', label: 'The solid', kind: 'choice', options: SHAPES.map((s) => [s.id, s.name] as [string, string]), def: 'icecream' },
    { k: 'ht', label: 'The height you know', kind: 'choice', options: [['part', 'a part (cone or cylinder height)'], ['total', 'the whole height or length']], def: 'part', show: (c) => TOTAL_OK.includes(c.ch.shape as ShapeId) },
    { k: 'r', label: 'Radius r', units: LEN, ph: 'e.g. 3.5' },
    { k: 'h', label: 'Cylinder height h', units: LEN, ph: 'e.g. 10', show: (c) => ['capsule', 'rocket', 'dome'].includes(c.ch.shape) && !(c.ch.ht === 'total' && TOTAL_OK.includes(c.ch.shape as ShapeId)) },
    { k: 'H', label: 'Cone height H', units: LEN, ph: 'e.g. 12', show: (c) => ['icecream', 'rocket'].includes(c.ch.shape) && !(c.ch.ht === 'total' && c.ch.shape === 'icecream') },
    { k: 'a', label: 'Side of the cube a', units: LEN, ph: 'e.g. 7', show: (c) => c.ch.shape === 'cubedome' },
    { k: 'T', label: 'Total height (or length)', units: LEN, ph: 'e.g. 15', show: (c) => c.ch.ht === 'total' && TOTAL_OK.includes(c.ch.shape as ShapeId) },
    { k: 'rate', label: 'Cost per square unit (optional)', optional: true, ph: 'e.g. 0.5', show: (c) => c.find === 'sa' },
    { k: 'rs', label: 'Radius of each small sphere', units: LEN, ph: 'e.g. 1', show: (c) => c.find === 'melt' },
    { k: 'pi', label: 'Use π =', kind: 'choice', options: [['22/7', '22/7'], ['3.14', '3.14'], ['exact', 'π (calculator)']], def: '22/7' },
  ],
  presets: [
    { name: 'Cone on a hemisphere: r = 3.5 cm, cone height 12 cm: surface area', find: 'sa', vals: { r: '3.5', H: '12' }, ch: { shape: 'icecream', ht: 'part' } },
    { name: 'Capsule: r = 3.5 mm, total length 14 mm: surface area', find: 'sa', vals: { r: ['3.5', 'mm'], T: ['14', 'mm'] }, ch: { shape: 'capsule', ht: 'total' } },
    { name: 'Cylinder with a cone: r = 7, h = 20, H = 24: volume', find: 'vol', vals: { r: '7', h: '20', H: '24' }, ch: { shape: 'rocket', ht: 'part' } },
    { name: 'Dome on a cylinder: r = 7, h = 14: volume', find: 'vol', vals: { r: '7', h: '14' }, ch: { shape: 'dome', ht: 'part' } },
    { name: 'Melt a cone and hemisphere into spheres of radius 1', find: 'melt', vals: { r: '3', H: '4', rs: '1' }, ch: { shape: 'icecream', ht: 'part', pi: 'exact' } },
  ],
  solve: (i, c) => combined(i, c),
};
