// 2.3 The rocket equation. Left: speed gained (in units of the exhaust speed) against mass ratio m0/m, the slowly
// rising log curve, with an optional gravity-loss curve for a vertical launch. Right: a rocket whose fuel share of the
// launch mass follows the slider. Units: exhaust speed u in km/s.
import { canvas, axes, line, dot, text, row, slider, readout, fmt, title, choice } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 400, min: 260, label: 'Speed gained against mass ratio, with a rocket showing its share of fuel' });
  let R = 3, u = 3, grav = false;
  const T = 120; // burn time for the vertical launch, s
  const ctl = row(host);
  slider(ctl, { label: 'Mass ratio m₀/m', min: 1, max: 20, step: 0.1, value: R, fmt: (x) => fmt(x, 3), oninput: (x) => { R = x; cv.redraw(); show(); } });
  slider(ctl, { label: 'Exhaust speed u (km/s)', min: 1, max: 4.5, step: 0.1, value: u, fmt: (x) => fmt(x, 2), oninput: (x) => { u = x; cv.redraw(); show(); } });
  choice(ctl, 'Launch', [[false, 'Free space'], [true, 'Straight up in g, 120 s burn']], grav, (v) => { grav = v; cv.redraw(); show(); });
  const out = readout(host);
  const loss = () => (grav ? 9.8e-3 * T : 0);
  const dv = () => u * Math.log(R) - loss();
  const show = () => {
    out.innerHTML = `Fuel is <b>${fmt(100 * (1 - 1 / R), 3)}%</b> of the launch mass. Speed gained Δv = u ln(m₀/m)${grav ? ' − gT' : ''} = <b>${fmt(dv(), 3)} km/s</b>${grav ? ` (gravity takes away ${fmt(loss(), 3)} km/s)` : ''}. Doubling the mass ratio adds only u ln 2 = ${fmt(u * Math.LN2, 3)} km/s.`;
  };
  cv.draw = (ctx, W, H, col) => {
    const split = W * 0.66;
    title(ctx, 'Speed gained ÷ exhaust speed', col);
    const ax = axes(ctx, split, H, col, { x: [1, 20], y: [-0.5, 3.2], xlabel: 'mass ratio m₀/m', ylabel: 'Δv / u', t: 40 });
    ctx.save(); ax.clip();
    const pts = [];
    for (let x = 1; x <= 20; x += 0.05) pts.push([ax.X(x), ax.Y(Math.log(x))]);
    line(ctx, pts, col.s[0], 2.5);
    if (grav) {
      const p2 = [];
      for (let x = 1; x <= 20; x += 0.05) p2.push([ax.X(x), ax.Y(Math.log(x) - loss() / u)]);
      line(ctx, p2, col.s[2], 2, [6, 4]);
    }
    line(ctx, [[ax.X(1), ax.Y(0)], [ax.X(20), ax.Y(0)]], col.muted, 1);
    line(ctx, [[ax.X(Math.E), ax.Y(0)], [ax.X(Math.E), ax.Y(1)], [ax.X(1), ax.Y(1)]], col.muted, 1, [3, 4]);
    ctx.restore();
    dot(ctx, ax.X(R), ax.Y(Math.max(-0.5, Math.min(3.2, dv() / u))), 6, col.s[3], col.panel);
    text(ctx, 'Δv = u when m₀/m = e', ax.X(Math.E) + 6, ax.Y(1) - 10, { color: col.muted, size: 10.5 });
    if (grav) text(ctx, 'dashed: with gravity loss', ax.X(8), ax.Y(0.2), { color: col.s[2], size: 10.5 });
    // the rocket: tank filled to the fuel share of the launch mass
    const rx = split + (W - split) / 2, top = 50, bot = H - 44, bw = Math.min(46, (W - split) * 0.35);
    ctx.fillStyle = col.line; ctx.fillRect(rx - bw / 2, top + bw * 0.6, bw, bot - top - bw * 0.6);
    ctx.beginPath(); ctx.moveTo(rx - bw / 2, top + bw * 0.6); ctx.lineTo(rx, top); ctx.lineTo(rx + bw / 2, top + bw * 0.6); ctx.closePath();
    ctx.fillStyle = col.muted; ctx.fill();
    const tankTop = top + bw * 0.9, tankH = bot - tankTop - 8, full = 1 - 1 / R;
    ctx.fillStyle = col.s[1]; ctx.fillRect(rx - bw / 2 + 6, tankTop + tankH * (1 - full), bw - 12, tankH * full);
    ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(rx - bw / 2 + 5, tankTop, bw - 10, tankH);
    for (let i = 0; i < 3; i++) line(ctx, [[rx - 8 + i * 8, bot], [rx - 12 + i * 12, bot + 22]], col.s[2], 3);
    text(ctx, `fuel ${fmt(100 * full, 2)}%`, rx, top - 10, { color: col.ink, size: 11.5, weight: 600, align: 'center', base: 'bottom' });
    text(ctx, 'exhaust leaves at u', rx, H - 6, { color: col.muted, size: 10.5, align: 'center', base: 'bottom' });
  };
  cv.redraw(); show();
}
