// 2.5 The parallel axis theorem. Pick a body and slide the axis away from the centre of mass: the moment of inertia
// grows as I = I_cm + Md², a parabola whose lowest point is at the centre of mass.
import { canvas, axes, line, dot, text, row, slider, choice, readout, fmt, title } from '../../kit.js';

const BODIES = {
  rod: { name: 'Rod', b: 1 / 12, unit: 'ML²', span: 0.5, axis: 'perpendicular to the rod', len: 'L' },
  disc: { name: 'Disc', b: 1 / 2, unit: 'MR²', span: 1, axis: 'perpendicular to the disc', len: 'R' },
  ring: { name: 'Ring', b: 1, unit: 'MR²', span: 1, axis: 'perpendicular to the ring', len: 'R' },
  sphere: { name: 'Solid sphere', b: 2 / 5, unit: 'MR²', span: 1, axis: 'in any direction', len: 'R' },
};

export default function (host) {
  const cv = canvas(host, { aspect: 0.6, max: 380, min: 250, label: 'Moment of inertia against the distance of the axis from the centre of mass' });
  let key = 'disc', d = 0.5;
  const ctl = row(host);
  choice(ctl, 'Body', Object.entries(BODIES).map(([k, v]) => [k, v.name]), key, (k) => { key = k; cv.redraw(); show(); });
  slider(ctl, { label: 'Axis distance d (in units of L or R)', min: 0, max: 1.5, step: 0.01, value: d, fmt: (x) => fmt(x, 3), oninput: (x) => { d = x; cv.redraw(); show(); } });
  const out = readout(host);
  const show = () => {
    const B = BODIES[key], I = B.b + d * d;
    const edge = Math.abs(d - B.span) < 0.005 ? ` (axis at the ${key === 'rod' ? 'end' : 'rim'})` : '';
    out.innerHTML = `${B.name}, axis ${B.axis}, d = ${fmt(d, 3)}${B.len}: I = I<sub>cm</sub> + Md² = ${fmt(B.b, 3)} + ${fmt(d * d, 3)} = <b>${fmt(I, 4)} ${B.unit}</b>${edge}. Radius of gyration k = ${fmt(Math.sqrt(I), 3)}${B.len}.`;
  };
  cv.draw = (ctx, W, H, col) => {
    const B = BODIES[key];
    title(ctx, 'I = I_cm + M d²', col);
    const ax = axes(ctx, W, H, col, { x: [0, 1.5], y: [0, 3.4], xlabel: 'd, distance of the axis from the centre of mass', ylabel: `I / ${B.unit}`, t: 40 });
    const pts = [];
    for (let x = 0; x <= 1.5001; x += 0.01) pts.push([ax.X(x), ax.Y(B.b + x * x)]);
    line(ctx, pts, col.s[0], 2.5);
    line(ctx, [[ax.X(0), ax.Y(B.b)], [ax.X(1.5), ax.Y(B.b)]], col.muted, 1, [4, 4]);
    text(ctx, `I_cm = ${fmt(B.b, 3)} ${B.unit}`, ax.X(0.9), ax.Y(B.b) + 12, { color: col.muted, size: 11 });
    line(ctx, [[ax.X(B.span), ax.Y(0)], [ax.X(B.span), ax.Y(3.4)]], col.line, 1, [2, 4]);
    text(ctx, key === 'rod' ? 'end' : 'rim', ax.X(B.span) + 4, ax.Y(3.1), { color: col.muted, size: 11 });
    dot(ctx, ax.X(d), ax.Y(B.b + d * d), 6, col.s[3], col.ink);
  };
  cv.redraw(); show();
}
