// Class 12 Ray Optics: apparent depth. A coin lies at depth d under a transparent medium of index n. Rays leaving the
// surface bend away from the normal (Snell's law n sin(theta) = sin(phi)), so the eye traces them back to a point
// nearer the surface: apparent depth = real depth / n (for rays close to the vertical). Choose a medium and a depth.
import { canvas, text, title, line, dot, arrow, row, slider, choice, readout } from '../../kit.js';

export default function (host) {
  const M = [[1.33, 'Water 1.33'], [1.5, 'Glass 1.5'], [2.42, 'Diamond 2.42']];
  let n = 1.33, d = 30;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'A coin under water appears raised because refracted rays bend away from the normal' });
  const ctl = row(host);
  choice(ctl, 'Medium', M, n, (v) => { n = v; upd(); });
  slider(ctl, { label: 'Real depth d', min: 10, max: 50, step: 1, value: d, fmt: (v) => `${v} cm`, oninput: (v) => { d = v; upd(); } });
  const out = readout(host);
  function upd() { out.innerHTML = `Apparent depth = d/n = ${d} ÷ ${n} = <b>${(d / n).toFixed(1)} cm</b>. The coin seems raised by <b>${(d - d / n).toFixed(1)} cm</b>. The bigger n is, the shallower it looks.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Why a pool looks shallower than it is', col);
    const sy = top + 80, s = (h - sy - 18) / 50, cx = w * 0.4;
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.18; ctx.fillRect(0, sy, w, h - sy); ctx.globalAlpha = 1;
    line(ctx, [[0, sy], [w, sy]], col.ink, 2); text(ctx, 'surface', w - 8, sy - 8, { color: col.muted, size: 11, align: 'right' });
    line(ctx, [[cx, sy - 60], [cx, h - 8]], col.line, 1, [3, 4]);
    const coinY = sy + d * s; dot(ctx, cx, coinY, 6, col.s[3], col.ink); text(ctx, 'coin', cx + 10, coinY + 4, { color: col.s[3], size: 11.5, weight: 700 });
    const appY = sy + (d / n) * s; ctx.save(); ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.arc(cx, appY, 6, 0, 7); ctx.strokeStyle = col.s[3]; ctx.lineWidth = 2; ctx.stroke(); ctx.restore();
    text(ctx, 'seems to be here', cx + 12, appY - 2, { color: col.s[3], size: 11, weight: 700, halo: col.panel });
    for (const [deg, c] of [[9, col.s[1]], [20, col.s[2]]]) {
      const th = (deg * Math.PI) / 180, xs = cx + d * s * Math.tan(th), sphi = n * Math.sin(th);
      if (sphi >= 1) continue;
      const ph = Math.asin(sphi);
      line(ctx, [[cx, coinY], [xs, sy]], c, 1.8);
      const L = 70; line(ctx, [[xs, sy], [xs + L * Math.sin(ph), sy - L * Math.cos(ph)]], c, 1.8);
      line(ctx, [[xs, sy], [cx, sy + (xs - cx) / Math.tan(ph)]], c, 1.3, [4, 4]);
    }
    text(ctx, 'to the eye', cx + 62, sy - 56, { color: col.muted, size: 11 });
    arrow(ctx, w - 30, sy + 14, w - 30, sy + d * s, col.muted, 1.5, 7); text(ctx, 'd', w - 38, sy + (d * s) / 2, { color: col.muted, size: 12, weight: 700, align: 'right' });
  };
  upd();
}
