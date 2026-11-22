// Class 10 Areas Related to Circles: a pizza of radius 14 cm cut into n equal slices. Each slice is a sector of angle 360/n,
// so it has area (1/n) of πr² = 616 cm² and its crust (arc) is 1/n of the circumference 88 cm (π = 22/7). Eat k slices and
// the fraction k/n of the pizza, of its area and of its crust is gone.
import { canvas, text, title, row, slider, readout } from '../../kit.js';

export default function (host) {
  let n = 8, k = 3;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 280, label: 'A pizza cut into equal slices, some eaten' });
  const ctl = row(host);
  const sn = slider(ctl, { label: 'Slices', min: 2, max: 16, step: 1, value: n, fmt: (v) => String(v), oninput: (v) => { n = v; k = Math.min(k, n); sk.set(k); say(); } });
  const sk = slider(ctl, { label: 'Slices eaten', min: 0, max: 16, step: 1, value: k, fmt: (v) => String(v), oninput: (v) => { k = Math.min(v, n); say(); } });
  void sn;
  const out = readout(host);
  function say() { const f = k / n; out.innerHTML = `Each slice: angle <b>${+(360 / n).toFixed(1)}°</b>, area ${+(616 / n).toFixed(1)} cm², crust ${+(88 / n).toFixed(1)} cm. Eaten ${k} of ${n} slices = ${+(f * 100).toFixed(1)}%: area <b>${+(f * 616).toFixed(1)} cm²</b>, crust <b>${+(f * 88).toFixed(1)} cm</b>.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Pizza: r = 14 cm, area 616 cm²', col);
    const R = Math.min(w * 0.33, (h - 60) * 0.44), cx = w / 2, cy = h / 2 + 12, a = (2 * Math.PI) / n;
    for (let i = 0; i < n; i++) {
      const gone = i < k, off = gone ? 0 : 0;
      ctx.beginPath(); ctx.moveTo(cx + off, cy); ctx.arc(cx, cy, R, -Math.PI / 2 + i * a, -Math.PI / 2 + (i + 1) * a); ctx.closePath();
      if (gone) { ctx.setLineDash([4, 4]); ctx.strokeStyle = col.muted; ctx.lineWidth = 1.2; ctx.stroke(); ctx.setLineDash([]); }
      else { ctx.fillStyle = i % 2 ? col.s[2] : col.s[3]; ctx.globalAlpha = 0.8; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.panel; ctx.lineWidth = 2; ctx.stroke(); ctx.beginPath(); ctx.arc(cx, cy, R, -Math.PI / 2 + i * a, -Math.PI / 2 + (i + 1) * a); ctx.strokeStyle = col.s[4]; ctx.lineWidth = 4; ctx.stroke(); }
    }
    if (n <= 12) { const m = -Math.PI / 2 + a / 2; text(ctx, +(360 / n).toFixed(1) + '°', cx + Math.cos(m) * R * 0.6, cy + Math.sin(m) * R * 0.6, { color: col.panel, size: 11, weight: 700, align: 'center' }); }
  };
  say();
}
