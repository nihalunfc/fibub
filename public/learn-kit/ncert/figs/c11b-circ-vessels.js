// Class 11 Biology, Body Fluids and Circulation: blood vessels and the pressure along the circuit. Arteries have thick, elastic, muscular walls to stand the high pressure; veins have thinner walls, a wider lumen and valves;
// capillaries have a wall one cell thick for exchange. Mean pressure falls from about 100 mm Hg in the aorta to nearly 0 in the vena cava, so blood always flows from high to low pressure.
import { canvas, text, title, axes, line, dot, row, choice, readout } from '../../kit.js';
import { ell } from '../c11b-lib.js';

export default function (host) {
  let v = 'a';
  const P = { a: [0.12, 'Artery: thick elastic and muscular wall, narrow lumen, carries blood away from the heart under high pressure (pulse). No valves.', 'artery'], c: [0.5, 'Capillary: wall one cell thick, tiny lumen. O₂, nutrients, CO₂ and waste cross here. Pressure falls to about 25 mm Hg, then 10.', 'capillary'], n: [0.88, 'Vein: thin wall, wide lumen, valves that stop backflow. Blood returns to the heart at low pressure, helped by muscles and breathing.', 'vein'] };
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'Cross sections of an artery, capillary and vein and the blood pressure along the circuit' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Vessel', [['a', 'Artery'], ['c', 'Capillary'], ['n', 'Vein']], v, (x) => { v = x; go(); });
  const press = (f) => (f < 0.3 ? 100 - 20 * f / 0.3 : f < 0.4 ? 80 - 55 * (f - 0.3) / 0.1 : f < 0.6 ? 25 - 15 * (f - 0.4) / 0.2 : 10 - 8 * (f - 0.6) / 0.4);
  const go = () => { ro.textContent = P[v][1]; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, 'Three kinds of vessel', col), cy = t0 + 56, R0 = 40;
    const wall = { a: [R0, 18, 14], c: [6, 3, 0], n: [R0 + 6, 6, 0] };
    [['a', w * 0.2], ['c', w * 0.5], ['n', w * 0.8]].forEach(([k, cx]) => {
      const [lum, wl] = wall[k], on = v === k, r = k === 'c' ? 8 : Math.min(lum * 0.55, w * 0.1);
      ctx.globalAlpha = on ? 1 : 0.4;
      const ro2 = k === 'c' ? 11 : r + wl * 0.7 + 6;
      ell(ctx, cx, cy, ro2, ro2, k === 'n' ? col.s[4] : col.s[3], col.ink, 1.5, 0.9);
      ell(ctx, cx, cy, k === 'c' ? 6 : r, k === 'c' ? 6 : r, col.s[1], null, 1, 0.8);
      if (k === 'a') ell(ctx, cx, cy, r + 5, r + 5, null, col.ink, 1);
      ctx.globalAlpha = 1;
      text(ctx, { a: 'artery', c: 'capillary', n: 'vein' }[k], cx, cy + 50, { color: on ? col.ink : col.muted, size: 11.5, weight: on ? 700 : 400, align: 'center' });
      text(ctx, { a: 'thick wall', c: '1-cell wall', n: 'thin wall + valves' }[k], cx, cy + 64, { color: col.muted, size: 10, align: 'center' });
    });
    const A = axes(ctx, w, h, col, { x: [0, 1], y: [0, 110], xlabel: 'along the circuit: aorta to vena cava', ylabel: 'mm Hg', l: 48, t: cy + 88, b: 54, xt: [], yt: [0, 50, 100] });
    const pts = []; for (let f = 0; f <= 1; f += 0.02) pts.push([A.X(f), A.Y(press(f))]); line(ctx, pts, col.s[0], 3);
    const f = P[v][0]; dot(ctx, A.X(f), A.Y(press(f)), 6, col.s[3], col.bg); text(ctx, Math.round(press(f)) + ' mm Hg', A.X(f) + (f > 0.6 ? -10 : 10), A.Y(press(f)) - 12, { color: col.ink, size: 11, weight: 700, align: f > 0.6 ? 'right' : 'left' });
  };
  go();
}
