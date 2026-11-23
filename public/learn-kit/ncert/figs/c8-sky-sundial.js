// Class 8 Time and the skies: a sundial (gnomon) shadow. The Sun climbs from the east, is highest at noon and sets in the west, so a
// stick's shadow is long and points west in the morning, shortest at noon, then long and points east in the evening. The Sun path here
// is a simple model (noon height 70 degrees, as in India near midsummer); the shadow is found by drawing a straight line from the Sun
// through the top of the stick to the ground.
import { canvas, text, title, line, dot, arrow, row, slider, readout, loop } from '../../kit.js';

export default function (host) {
  let hr = 9, t = 0;
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 260, label: 'A vertical stick whose shadow changes length and direction as the Sun crosses the sky' });
  const ctl = row(host);
  const sl = slider(ctl, { label: 'Time', min: 6.5, max: 17.5, step: 0.25, value: hr, fmt: (v) => { const h = Math.floor(v), m = Math.round((v % 1) * 60); return `${h > 12 ? h - 12 : h}:${String(m).padStart(2, '0')} ${h < 12 ? 'am' : 'pm'}`; }, oninput: (v) => { hr = v; say(); } });
  const an = loop(host, (dt) => { hr += dt * 0.9; if (hr > 17.5) hr = 6.5; sl.set(hr); say(); }, { autoplay: false }); an.button(ctl);
  const out = readout(host);
  const geom = () => { const w = cv.w, h = cv.h, gy = h * 0.8, cx = w / 2, Rx = w * 0.42, Ry = h * 0.62, f = Math.PI * (hr - 6) / 12, sx = cx - Rx * Math.cos(f), sy = gy - Ry * Math.sin(f), H = h * 0.22; return { w, h, gy, cx, sx, sy, H, f }; };
  const shadow = (g) => { const alt = Math.atan2(g.gy - g.sy, Math.abs(g.sx - g.cx)); const L = Math.min(40, 1 / Math.tan(Math.max(alt, 0.02))); return (g.sx < g.cx ? 1 : -1) * L; };
  function say() { const g = geom(), len = shadow(g); out.innerHTML = `Shadow length ≈ <b>${Math.abs(len).toFixed(1)} × the stick's height</b>, pointing ${len > 0 ? 'west (right)' : len < 0 ? 'east (left)' : 'nowhere'}. ${Math.abs(len) < 0.45 ? 'Near noon the shadow is at its shortest.' : 'Low Sun means a long shadow.'}`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Shadow of a stick through the day', col);
    const g = geom(), tipY = g.gy - g.H, tx = g.cx + shadow(g) * g.H;
    ctx.save(); ctx.strokeStyle = col.line; ctx.setLineDash([3, 5]); ctx.beginPath(); for (let i = 0; i <= 40; i++) { const f = Math.PI * i / 40, x = g.cx - w * 0.42 * Math.cos(f), y = g.gy - h * 0.62 * Math.sin(f); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); ctx.restore();
    line(ctx, [[8, g.gy], [w - 8, g.gy]], col.muted, 2);
    text(ctx, 'East', 14, g.gy + 14, { color: col.muted, size: 10.5 }); text(ctx, 'West', w - 14, g.gy + 14, { color: col.muted, size: 10.5, align: 'right' });
    { const dx = g.sx - g.cx, dy = g.gy - g.sy, L = Math.hypot(dx, dy) || 1; line(ctx, [[g.cx, tipY], [g.cx + dx / L * 70, tipY - dy / L * 70]], col.warn, 1.5, [4, 4]); }
    const sh = Math.max(8, Math.min(w - 10, tx)); line(ctx, [[g.cx, g.gy], [sh, g.gy]], col.ink, 6);
    line(ctx, [[g.cx, g.gy], [g.cx, tipY]], col.s[1], 5);
    dot(ctx, g.sx, g.sy, 13, col.warn, col.ink);
    text(ctx, 'shadow', (g.cx + sh) / 2, g.gy + 24, { color: col.ink, size: 10.5, weight: 700, align: 'center' });
    text(ctx, 'stick', g.cx + 8, tipY - 8, { color: col.s[1], size: 10.5, weight: 700 });
  };
  say();
}
