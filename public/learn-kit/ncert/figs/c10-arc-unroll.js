// Class 10 Areas Related to Circles: where the area πr² comes from. Cut a circle into an even number n of thin sectors and
// lay them side by side, alternately pointing up and down. The more pieces, the closer the shape gets to a rectangle with
// length half the circumference (πr) and width r. Its area is πr × r = πr².
import { canvas, text, title, row, slider, readout, loop, ease } from '../../kit.js';

export default function (host) {
  let n = 12, p = 0, dir = 1;
  const cv = canvas(host, { aspect: 0.72, max: 440, min: 290, label: 'A circle cut into sectors and rearranged into a near-rectangle of length pi r and width r' });
  const ctl = row(host);
  slider(ctl, { label: 'Number of pieces', min: 4, max: 48, step: 4, value: n, fmt: (v) => String(v), oninput: (v) => { n = v; say(); } });
  const sp = slider(ctl, { label: 'Rearrange', min: 0, max: 1, step: 0.01, value: p, fmt: (v) => Math.round(v * 100) + '%', oninput: (v) => { p = v; anim.pause(); say(); } });
  const anim = loop(host, (dt) => { p += dir * dt * 0.35; if (p > 1) { p = 1; dir = -1; } if (p < 0) { p = 0; dir = 1; } sp.set(p); say(); }, { autoplay: false });
  anim.button(ctl);
  const out = readout(host);
  function say() { out.innerHTML = p > 0.95 ? `${n} pieces make a shape about <b>πr</b> long (half the circumference) and <b>r</b> wide. Area ≈ πr × r = <b>πr²</b>. Try more pieces: the wavy ends straighten out.` : 'Press Play, or drag Rearrange, to cut the circle open and lay the pieces side by side.'; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Area of a circle = πr²', col);
    const r = Math.min((w - 30) / (Math.PI + 0.3), (h - 74) / 2), cx = w / 2, cy = h / 2 + 12, al = Math.PI / n, e = ease(p), x0 = cx - (Math.PI * r) / 2;
    for (let i = 0; i < n; i++) {
      const th = (i + 0.5) * 2 * al, up = i % 2 === 0, k = Math.floor(i / 2) * 2 + (up ? 0 : 1);
      const ex = x0 + r * Math.sin(al) * (i + 1), ey = up ? cy + r / 2 : cy - r / 2, ed = up ? -Math.PI / 2 : Math.PI / 2;
      // start: apex at the centre pointing at angle th (screen coords, y down); end: apex at (ex, ey) pointing up or down
      const ax = cx + (ex - cx) * e, ay = cy + (ey - cy) * e, a = -th + (ed - (-th)) * e;
      ctx.beginPath(); ctx.moveTo(ax, ay); ctx.arc(ax, ay, r, a - al, a + al); ctx.closePath();
      ctx.fillStyle = col.s[up ? 0 : 1]; ctx.globalAlpha = 0.85; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.panel; ctx.lineWidth = n > 24 ? 0.6 : 1.2; ctx.stroke(); void k;
    }
    if (p > 0.95) {
      text(ctx, 'πr', cx, cy + r / 2 + 22, { color: col.ink, size: 13, weight: 700, align: 'center', halo: col.panel });
      text(ctx, 'r', x0 - 10, cy, { color: col.ink, size: 13, weight: 700, align: 'right', halo: col.panel });
    }
  };
  say();
}
