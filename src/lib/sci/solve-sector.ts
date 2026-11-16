// "Solve my numbers" for circle sectors: sector area, arc length, segment area, the angle or radius from an arc or
// area, tangent length from a point, and the area swept by a clock hand. π can be 22/7, 3.14 or exact. No DOM.
import { sf as sf3, type SSpec, type SIn, type SOut } from '../learn/solvecore-b.ts';
import { sector } from './circle-school.ts';

const sf = (x: number, n = 4) => sf3(x, n);
const LEN: [string, number][] = [['cm', 1], ['m', 100], ['mm', 0.1], ['km', 1e5]];
const ANG: [string, number][] = [['degrees', 1], ['radians', 180 / Math.PI]];
const PIS: Record<string, [number, string]> = { exact: [Math.PI, 'π'], '22/7': [22 / 7, '22/7'], '3.14': [3.14, '3.14'] };
const back = (x: SIn) => (x.typed === 0 ? 1 : x.v / x.typed);

export function solveSector(i: Record<string, SIn>, c: { find: string; ch: Record<string, string> }): SOut {
  const [pi, pt] = PIS[c.ch.pi] ?? PIS.exact, find = c.find;
  const piTip = pt === 'π' ? '' : ` Your book may want π = ${pt}, so the last digit can differ from a calculator.`;
  const angLine = (th: SIn) => (th.u === 'radians' ? [`Convert the angle: ${sf(th.typed)} rad × 180 ÷ π = ${sf(th.v, 4)}°`] : []);
  if (find === 'area' || find === 'arc' || find === 'seg') {
    const r = i.r, th = i.th, un = r.u;
    if (!(r.v > 0)) return { error: 'The radius must be more than 0.' };
    if (!(th.v > 0 && th.v <= 360)) return { error: 'The angle must be more than 0° and at most 360° (2π radians). Check the units.' };
    const s = sector(r.v, th.v, pi), f = back(r), R = r.typed;
    const area = s.area / f / f, arc = s.arc / f, seg = s.segment / f / f, tri = s.tri / f / f;
    const lines = [...angLine(th), `θ = ${sf(th.v, 4)}°, r = ${sf(R)} ${un}, π = ${pt}`];
    lines.push(`Arc length l = (θ ÷ 360) × 2πr = (${sf(th.v, 4)} ÷ 360) × 2 × ${pt} × ${sf(R)} = ${sf(arc)} ${un}`);
    lines.push(`Sector area = (θ ÷ 360) × πr² = (${sf(th.v, 4)} ÷ 360) × ${pt} × ${sf(R)}² = ${sf(area)} ${un}²`);
    if (find === 'seg') {
      lines.push(`Triangle OAB = ½ r² sin θ = ½ × ${sf(R)}² × sin ${sf(th.v, 4)}° = ${sf(tri)} ${un}²`);
      lines.push(`Segment = sector − triangle = ${sf(area)} − ${sf(tri)} = ${sf(seg)} ${un}²${th.v > 180 ? ' (the angle is over 180°, so sin is negative and the triangle is added back)' : ''}`);
    }
    lines.push(`Perimeter of the sector = l + 2r = ${sf(arc)} + ${sf(2 * R)} = ${sf(arc + 2 * R)} ${un}`);
    const answer = find === 'area' ? `The sector area is ${sf(area)} ${un}².` : find === 'arc' ? `The arc length is ${sf(arc)} ${un}.` : `The segment area is ${sf(seg)} ${un}².`;
    return { answer, lines, tip: `Common mistake: using the radius where the diameter is given (r = d ÷ 2), or leaving the angle in radians in a degrees formula.${piTip}` };
  }
  if (find === 'theta' || find === 'rad') {
    const g = i.g, byArc = c.ch.given !== 'area';
    if (!(g.v > 0)) return { error: `The ${byArc ? 'arc length' : 'area'} must be more than 0.` };
    if (find === 'theta') {
      const r = i.r; if (!(r.v > 0)) return { error: 'The radius must be more than 0.' };
      const th = byArc ? (360 * g.v) / (2 * pi * r.v) : (360 * g.v) / (pi * r.v * r.v);
      if (th > 360 + 1e-9) return { error: `That gives an angle of ${sf(th, 4)}°, more than a full turn. The ${byArc ? 'arc is longer than the whole circle' : 'sector is bigger than the whole circle'}: check the radius and ${byArc ? 'arc length' : 'area'} use the same unit.` };
      return { answer: `The angle is ${sf(th, 4)}° (${sf((th * Math.PI) / 180, 4)} radians).`, lines: byArc ? ['Arc length l = (θ ÷ 360) × 2πr, so θ = 360 × l ÷ (2πr)', `θ = 360 × ${sf(g.typed)} ÷ (2 × ${pt} × ${sf(r.v)}) = ${sf(th, 4)}°`] : ['Sector area A = (θ ÷ 360) × πr², so θ = 360 × A ÷ (πr²)', `θ = 360 × ${sf(g.typed)} ÷ (${pt} × ${sf(r.v)}²) = ${sf(th, 4)}°`], tip: `Keep the radius and the ${byArc ? 'arc length' : 'area'} in the same unit (cm with cm, cm² with cm).${piTip}` };
    }
    const th = i.th; if (!(th.v > 0 && th.v <= 360)) return { error: 'The angle must be more than 0° and at most 360°.' };
    const r = byArc ? (360 * g.v) / (2 * pi * th.v) : Math.sqrt((360 * g.v) / (pi * th.v));
    return { answer: `The radius is ${sf(r)} (in the same unit as your ${byArc ? 'arc length' : 'area, square root of its unit'}).`, lines: [...angLine(th), byArc ? 'l = (θ ÷ 360) × 2πr, so r = 360 × l ÷ (2πθ)' : 'A = (θ ÷ 360) × πr², so r = √(360 × A ÷ (πθ))', byArc ? `r = 360 × ${sf(g.typed)} ÷ (2 × ${pt} × ${sf(th.v, 4)}) = ${sf(r)}` : `r = √(360 × ${sf(g.typed)} ÷ (${pt} × ${sf(th.v, 4)})) = ${sf(r)}`], tip: `Common mistake: forgetting the square root when the area is given.${piTip}` };
  }
  if (find === 'tan') {
    const r = i.r, d = i.d; if (!(r.v > 0)) return { error: 'The radius must be more than 0.' };
    if (!(d.v > r.v)) return { error: d.v === r.v ? 'The point is on the circle, so the tangent has no length. The point must be outside.' : 'The point must be outside the circle: its distance from the centre must be bigger than the radius.' };
    const len = Math.sqrt(d.v * d.v - r.v * r.v) / back(d), atP = (2 * Math.asin(r.v / d.v) * 180) / Math.PI;
    return { answer: `The tangent from the point is ${sf(len)} ${d.u} long.`, lines: ['A tangent is at 90° to the radius at the point of contact, so OT ⟂ PT and triangle OTP has a right angle at T.', 'PT² = OP² − OT² (Pythagoras)', `PT = √(${sf(d.typed)}² − ${sf(r.v / back(d))}²) = ${sf(len)} ${d.u}`, `The two tangents from P are equal in length; the angle between them is ${sf(atP, 4)}°.`], tip: 'Common mistake: using OP + r. The distance OP is from the centre, and the right angle is at the point of contact T.' };
  }
  // clock
  const r = i.r, min = i.min, hand = c.ch.hand === 'hour' ? 0.5 : 6;
  if (!(r.v > 0)) return { error: 'The length of the hand must be more than 0.' };
  if (!(min.v > 0)) return { error: 'The time must be more than 0 minutes.' };
  const deg = hand * min.v;
  if (deg > 360) return { error: `In ${sf(min.v)} minutes the ${c.ch.hand === 'hour' ? 'hour' : 'minute'} hand turns ${sf(deg, 4)}°, more than a full circle. Use a shorter time.` };
  const s = sector(r.v, deg, pi), f = back(r);
  return { answer: `The hand sweeps an area of ${sf(s.area / f / f)} ${r.u}².`, lines: [`The ${c.ch.hand === 'hour' ? 'hour hand turns 360° in 12 hours, which is 0.5° per minute' : 'minute hand turns 360° in 60 minutes, which is 6° per minute'}.`, `Angle = ${hand} × ${sf(min.typed)} = ${sf(deg, 4)}°`, `Area = (θ ÷ 360) × πr² = (${sf(deg, 4)} ÷ 360) × ${pt} × ${sf(r.typed)}² = ${sf(s.area / f / f)} ${r.u}²`, `The tip travels an arc of ${sf(s.arc / f)} ${r.u}.`], tip: `Common mistake: using 30° per minute. The minute hand turns 6° per minute; 30° is how far the hour hand turns in a whole hour.${piTip}` };
}

export const SECTOR_SPEC: SSpec = {
  id: 'sec',
  finds: [['area', 'Sector area'], ['arc', 'Arc length'], ['seg', 'Segment area'], ['theta', 'Angle from arc or area'], ['rad', 'Radius from arc or area'], ['tan', 'Length of a tangent'], ['clock', 'Area swept by a clock hand']],
  fields: [
    { k: 'r', label: 'Radius r', units: LEN, ph: 'e.g. 7', show: (c) => c.find !== 'rad' },
    { k: 'th', label: 'Angle θ', units: ANG, ph: 'e.g. 60', show: (c) => ['area', 'arc', 'seg', 'rad'].includes(c.find) },
    { k: 'given', label: 'You know the', kind: 'choice', options: [['arc', 'arc length'], ['area', 'sector area']], def: 'arc', show: (c) => c.find === 'theta' || c.find === 'rad' },
    { k: 'g', label: 'Arc length or area (same unit as the radius)', ph: 'e.g. 15.7', show: (c) => c.find === 'theta' || c.find === 'rad' },
    { k: 'd', label: 'Distance of the point from the centre', units: LEN, ph: 'e.g. 13', show: (c) => c.find === 'tan' },
    { k: 'hand', label: 'Hand', kind: 'choice', options: [['minute', 'minute hand'], ['hour', 'hour hand']], def: 'minute', show: (c) => c.find === 'clock' },
    { k: 'min', label: 'Time passed (minutes)', ph: 'e.g. 5', show: (c) => c.find === 'clock' },
    { k: 'pi', label: 'Use π =', kind: 'choice', options: [['22/7', '22/7'], ['3.14', '3.14'], ['exact', 'π (calculator)']], def: '22/7' },
  ],
  presets: [
    { name: 'Radius 14 cm, angle 60°: sector area', find: 'area', vals: { r: '14', th: '60' } },
    { name: 'Radius 21 cm, angle 120°: arc length', find: 'arc', vals: { r: '21', th: '120' } },
    { name: 'Radius 10 cm, angle 90°: segment area (π = 3.14)', find: 'seg', vals: { r: '10', th: '90' }, ch: { pi: '3.14' } },
    { name: 'Radius 10 cm, arc 15.7 cm (π = 3.14): angle', find: 'theta', vals: { r: '10', g: '15.7' }, ch: { given: 'arc', pi: '3.14' } },
    { name: 'Tangent from a point 13 cm from the centre, r = 5 cm', find: 'tan', vals: { r: '5', d: '13' } },
    { name: 'Minute hand 14 cm long sweeps for 5 minutes', find: 'clock', vals: { r: '14', min: '5' }, ch: { hand: 'minute' } },
  ],
  solve: (i, c) => solveSector(i, c),
};
