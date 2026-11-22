// Class 9 Work and Energy, simple machines: the inclined plane. To raise a load by a height h you can lift it
// straight up (force = weight, short path) or push it up a ramp of length L (force = weight x h/L when there is no
// friction, long path). A gentler ramp needs less force over a longer distance; the work (force x distance) is the same.
// The friction switch adds extra effort, so real machines need a little more work than the ideal.
import { canvas, text, title, line, dot, arrow, row, slider, choice, button, readout, loop } from '../../kit.js';

export default function (host) {
  let L = 6, fric = false, s = 0, going = false;
  const H = 1.5, W = 600; // height m, weight N (a 60 kg drum is about 600 N)
  const cv = canvas(host, { aspect: 0.66, max: 440, min: 290, label: 'A ramp of adjustable length showing the smaller push needed over a longer path' });
  const ctl = row(host);
  slider(ctl, { label: 'Ramp length', min: 1.5, max: 10, step: 0.5, value: L, fmt: (v) => `${v} m`, oninput: (v) => { L = v; s = 0; upd(); } });
  choice(ctl, 'Friction', [['no', 'Off'], ['yes', 'On']], 'no', (v) => { fric = v === 'yes'; upd(); });
  button(ctl, '▶ Push up', () => { s = 0; going = true; });
  const out = readout(host);
  const eff = () => { const sinA = H / L, base = W * sinA; return fric ? base + 0.15 * W * Math.sqrt(1 - sinA * sinA) : base; };
  function upd() { const e = eff(); out.innerHTML = `Ramp ${L} m long, 1.5 m high: push = <b>${e.toFixed(0)} N</b> (a straight lift needs ${W} N). Work = ${e.toFixed(0)} × ${L} = <b>${(e * L).toFixed(0)} J</b>` + (fric ? ` (more than the ${W * H} J of lifting: friction wastes the difference as heat).` : ` = ${W} × ${H} = ${W * H} J: the same as lifting straight up.`); cv.redraw(); }
  loop(host, (dt) => { if (going) { s += dt * 0.35; if (s >= 1) { s = 1; going = false; } cv.redraw(); } });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'A longer ramp: less force, more distance', col);
    const x0 = 18, y0 = h - 34, hx = w - 30, maxRun = hx - x0, sc = Math.min((maxRun) / 10, 0.9 * (y0 - 50) / H);
    const run = Math.sqrt(L * L - H * H) * (maxRun / Math.sqrt(100 - H * H)), ry = Math.min(y0 - 50, (H / L) * run * 1.0 * 0 + (y0 - 56));
    const topX = x0 + run, topY = y0 - (y0 - 56);
    ctx.fillStyle = col.soft; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(topX, y0); ctx.lineTo(topX, topY); ctx.closePath(); ctx.fill(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.stroke();
    line(ctx, [[topX + 12, y0], [topX + 12, topY]], col.muted, 1, [3, 3]); text(ctx, 'h = 1.5 m', topX + 16, (y0 + topY) / 2, { color: col.muted, size: 10.5 });
    const px = x0 + s * run, py = y0 - s * (y0 - topY); const ang = Math.atan2(y0 - topY, run);
    ctx.save(); ctx.translate(px, py); ctx.rotate(-ang); ctx.fillStyle = col.s[1]; ctx.fillRect(-4, -26, 30, 26); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(-4, -26, 30, 26);
    const f = Math.min(60, 16 + eff() / 8); arrow(ctx, -6 - f, -13, -6, -13, col.s[0], 3); text(ctx, `${eff().toFixed(0)} N`, -10 - f / 2, -26, { color: col.s[0], size: 10.5, weight: 700, align: 'center' }); ctx.restore();
    text(ctx, `L = ${L} m`, (x0 + topX) / 2 - 8, (y0 + topY) / 2 - 10, { color: col.s[2], size: 11, weight: 700, align: 'center', halo: col.panel });
    // straight-lift comparison bar
    const bx = 12, by = 38;
    text(ctx, `force: ramp ${eff().toFixed(0)} N vs lift ${W} N`, bx, by + 2, { color: col.ink, size: 10.5 });
    ctx.fillStyle = col.line; ctx.fillRect(bx, by + 10, w * 0.42, 6); ctx.fillStyle = col.s[0]; ctx.fillRect(bx, by + 10, w * 0.42 * eff() / W, 6);
    void dot;
  };
  upd();
}
