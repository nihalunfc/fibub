// Special relativity in two pictures. Light clock: a light pulse bounces between two mirrors. In the clock's own frame
// it goes straight up and down; in the lab, where the clock moves, the pulse travels a longer slanted path at the same
// speed c, so the lab sees fewer ticks: t = γ t₀. Length: a rod of proper length 1 passing by is shorter by 1/γ.
import { canvas, text, row, choice, slider, readout, loop, button, line, arrow, dot } from '../kit.js';

export default function (host) {
  let mode = 'time', t = 0;
  const cv = canvas(host, { aspect: 0.7, max: 360, min: 260, label: 'A light clock in its own frame and in the lab, or a contracted rod' });
  const c1 = row(host);
  choice(c1, 'Show', [['time', 'Time dilation'], ['len', 'Length contraction']], mode, (v) => { mode = v; t = 0; show(); cv.redraw(); });
  const sv = slider(c1, { label: 'Speed v', min: 0, max: 0.99, step: 0.01, value: 0.8, fmt: (v) => v.toFixed(2) + ' c', oninput: () => { t = 0; show(); } });
  const anim = loop(host, (dt) => { t += dt; cv.redraw(); });
  anim.button(c1);
  const out = readout(host);
  const gam = () => 1 / Math.sqrt(1 - sv.value ** 2);
  function show() {
    const g = gam(), v = sv.value;
    out.innerHTML = mode === 'time' ? `γ = 1 ⁄ √(1 − v²/c²) = <b>${g.toFixed(3)}</b>. One tick takes t₀ = 2L/c in the clock's frame and t = γt₀ = ${g.toFixed(2)} t₀ in the lab. The slanted path has length c t⁄2 = √(L² + (vt⁄2)²), which gives the same result. In the same lab time the moving clock ticks ${(1 / g).toFixed(2)} times as often as the lab's own.` : `Proper length L₀ = 1 m (as measured in the rod's own frame). Lab length L = L₀⁄γ = <b>${(1 / g).toFixed(3)} m</b> at v = ${v.toFixed(2)} c. Only the length along the motion shrinks; the height does not.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const g = gam(), v = sv.value;
    if (mode === 'time') {
      const Lh = h * 0.5, y1 = 36, y0 = y1 + Lh, T0 = 2 * 1; // proper period in animation seconds
      const pL = w * 0.17, wid = 26;
      // proper frame (left)
      text(ctx, "Clock's own frame", pL, 18, { color: col.ink, size: 11, weight: 700, align: 'center' });
      line(ctx, [[pL - wid, y1], [pL + wid, y1]], col.ink, 4); line(ctx, [[pL - wid, y0], [pL + wid, y0]], col.ink, 4);
      const ph = (t / T0) % 1, yy = ph < 0.5 ? y0 - (ph * 2) * Lh : y1 + ((ph - 0.5) * 2) * Lh; dot(ctx, pL, yy, 6, col.s[1], col.panel);
      text(ctx, `ticks: ${Math.floor(t / T0)}`, pL, y0 + 20, { color: col.s[1], size: 12, weight: 700, align: 'center' });
      // lab frame (right): clock moves right, pulse zigzags
      const x0 = w * 0.36, x1 = w - 14, dx = (x1 - x0) - 2 * wid, Tlab = T0 * g, sp = Math.min(dx / (6 * Tlab) , 40);
      text(ctx, 'Lab frame (clock moves right)', (x0 + x1) / 2, 18, { color: col.ink, size: 11, weight: 700, align: 'center' });
      const tt = t % (T0 * g * 2.2), cxs = x0 + wid + (v * tt / (T0 * g * 2.2)) * dx * 1.0 * 0.9 / 1;
      const per = Tlab, cx = (tm) => x0 + wid + (tm / (3 * per)) * dx * Math.min(1, v / 0.99 * 1);
      const tm = t % (3 * per);
      line(ctx, [[cx(tm) - wid, y1], [cx(tm) + wid, y1]], col.ink, 4); line(ctx, [[cx(tm) - wid, y0], [cx(tm) + wid, y0]], col.ink, 4);
      const pts = []; for (let k = 0; k * per / 2 <= tm; k++) pts.push([cx(k * per / 2), k % 2 ? y1 : y0]); pts.push([cx(tm), ((tm / (per / 2)) % 2) < 1 ? y0 - ((tm / (per / 2)) % 1) * Lh : y1 + ((tm / (per / 2)) % 1) * Lh]);
      line(ctx, pts, col.s[1], 2); const last = pts[pts.length - 1]; dot(ctx, last[0], last[1], 6, col.s[1], col.panel);
      text(ctx, `lab clock reads ${tm.toFixed(1)} s; moving clock ticked ${Math.floor(tm / per)}`, (x0 + x1) / 2, y0 + 20, { color: col.s[1], size: 11, align: 'center' });
      text(ctx, `Pulse path is longer by γ = ${g.toFixed(2)}`, w / 2, h - 12, { color: col.muted, size: 11, align: 'center' });
    } else {
      const y = h * 0.42, W = w - 40, Lr = W * 0.55, Lc = Lr / g, pos = ((t * 0.12) % 1.3) - 0.2;
      text(ctx, 'Lab ruler (metre marks)', 20, 20, { color: col.muted, size: 11 });
      line(ctx, [[20, 34], [20 + W, 34]], col.muted, 2); for (let i = 0; i <= 10; i++) line(ctx, [[20 + (W * i) / 10, 28], [20 + (W * i) / 10, 40]], col.muted, 1.5);
      const x = 20 + pos * W;
      ctx.fillStyle = col.s[1]; ctx.globalAlpha = 0.25; ctx.fillRect(x, y - 24, Lr, 48); ctx.globalAlpha = 1;
      ctx.setLineDash([4, 3]); ctx.strokeStyle = col.s[1]; ctx.lineWidth = 1.5; ctx.strokeRect(x, y - 24, Lr, 48); ctx.setLineDash([]);
      ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.85; ctx.fillRect(x, y - 24, Lc, 48); ctx.globalAlpha = 1;
      text(ctx, 'rest length', x + Lr / 2, y + 40, { color: col.s[1], size: 11, align: 'center' });
      text(ctx, 'as the lab measures it', x + Lc / 2, y, { color: col.panel, size: 10, align: 'center', weight: 700 });
      arrow(ctx, x + Lc / 2 - 20, y + 62, x + Lc / 2 + 20 + 40 * v, y + 62, col.bad, 2.5); text(ctx, `v = ${v.toFixed(2)} c`, x + Lc / 2, y + 78, { color: col.bad, size: 11, align: 'center' });
      text(ctx, `L = L₀ / γ = ${(1 / g).toFixed(2)} L₀`, w / 2, h - 12, { color: col.ink, size: 12, weight: 700, align: 'center' });
    }
  };
  show();
}
