// Class 12 Moving Charges: a velocity selector. Crossed electric and magnetic fields push a charge in opposite directions;
// only when qE = qvB, i.e. v = E/B, does it go straight through the slit. The path is worked out step by step from
// F = q(E + v × B) for a proton in a field B = 0.10 T. Try other speeds: the faster ones bend one way, the slower the other.
import { canvas, text, title, row, slider, readout, line, dot, loop, arrow } from '../../kit.js';
import { si, into } from '../c12p-mmlib.js';

export default function (host) {
  let v = 1.4, E = 100, s = 0;
  const B = 0.1, qm = 9.58e7, Lr = 0.06, gap = 0.04;
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 260, label: 'A velocity selector with crossed electric and magnetic fields' });
  const ctl = row(host);
  slider(ctl, { label: 'Speed v', min: 0.2, max: 2.4, step: 0.1, value: v, fmt: (x) => `${x.toFixed(1)}×10⁶ m/s`, oninput: (x) => { v = x; s = 0; } });
  slider(ctl, { label: 'Electric field E', min: 20, max: 200, step: 10, value: E, fmt: (x) => `${x} kV/m`, oninput: (x) => { E = x; s = 0; } });
  const out = readout(host);
  loop(host, (dt) => { s = Math.min(1.2, s + dt * 0.5); cv.redraw(); });
  const path = () => {
    let x = 0, y = 0, vx = v * 1e6, vy = 0, hit = false; const pts = [[0, 0]], dt = 2e-9;
    for (let i = 0; i < 3000 && x < Lr; i++) {
      const Fy = qm * (-E * 1e3 + vx * B), Fx = qm * (-vy * B);
      vx += Fx * dt; vy += Fy * dt; x += vx * dt; y += vy * dt; pts.push([x, y]);
      if (Math.abs(y) > gap / 2) { hit = true; break; }
    }
    return { pts, hit };
  };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Only v = E/B goes straight', col) + 4;
    const vsel = (E * 1e3) / B / 1e6, { pts, hit } = path(), last = pts[pts.length - 1];
    const x0 = 24, x1 = w - 30, cy = (top + h) / 2 + 2, sc = (x1 - x0) / Lr, ph = gap * sc / 2;
    ctx.save(); ctx.fillStyle = col.soft; ctx.fillRect(x0, cy - ph, x1 - x0, 2 * ph); ctx.restore();
    for (let i = 0; i < 6; i++) for (let j = 0; j < 2; j++) into(ctx, x0 + 22 + i * ((x1 - x0 - 44) / 5), cy - ph * 0.45 + j * ph * 0.9, 5, col.line, 1.2);
    line(ctx, [[x0, cy - ph], [x1, cy - ph]], col.ink, 4); line(ctx, [[x0, cy + ph], [x1, cy + ph]], col.ink, 4);
    text(ctx, '+', x0 + 6, cy - ph - 10, { color: col.ink, size: 14, weight: 700 }); text(ctx, '−', x0 + 6, cy + ph + 12, { color: col.ink, size: 14, weight: 700 });
    arrow(ctx, w / 2 - 70, cy - ph + 6, w / 2 - 70, cy - ph + 28, col.s[0], 2); text(ctx, 'E', w / 2 - 62, cy - ph + 20, { color: col.s[0], size: 12, weight: 700 });
    line(ctx, [[x1, cy - ph], [x1, cy - 6]], col.ink, 4); line(ctx, [[x1, cy + 6], [x1, cy + ph]], col.ink, 4);
    text(ctx, 'slit', x1 - 4, cy + ph + 14, { color: col.muted, size: 10.5, align: 'center' });
    const n = Math.max(2, Math.floor(pts.length * s)), shown = pts.slice(0, n).map(([x, y]) => [x0 + x * sc, cy - y * sc]);
    line(ctx, shown, col.s[1], 2.4); const P = shown[shown.length - 1]; dot(ctx, P[0], P[1], 5, col.s[1], col.ink);
    arrow(ctx, x0 - 2, cy, x0 + 22, cy, col.s[2], 2); text(ctx, 'proton in', x0 + 2, cy + 18, { color: col.s[2], size: 10.5 });
    text(ctx, 'B into the page (crosses)', x0, cy + ph + 14, { color: col.muted, size: 10.5 });
    const through = !hit && Math.abs(last[1]) < 0.0015;
    out.innerHTML = `Chosen speed v = E/B = ${E} kV/m ÷ 0.10 T = <b>${vsel.toFixed(1)}×10⁶ m/s</b>. This proton has ${v.toFixed(1)}×10⁶: ` + (Math.abs(v - vsel) < 0.06 ? '<b>they match, so it goes straight through the slit.</b>' : v > vsel ? 'faster, so the magnetic force (up) beats the electric force (down): it bends up.' : 'slower, so the electric force (down) wins: it bends down.');
  };
  cv.redraw();
}
