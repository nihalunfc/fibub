// Class 8 Forces: non-contact force. Two magnets act on each other without touching; the force is strong when close
// and weak when far (drawn here as an inverse-square style falloff, a fair picture of how it weakens with distance).
// Unlike poles attract, like poles repel. Drag the right magnet, or use the slider.
import { canvas, text, title, line, arrow, row, slider, choice, readout, clamp, touchGuard } from '../../kit.js';

export default function (host) {
  let d = 0.5, flip = false, drag = false;
  const cv = canvas(host, { aspect: 0.5, max: 440, min: 230, label: 'Two bar magnets with force arrows that shrink as the distance grows' });
  const ctl = row(host);
  choice(ctl, 'Facing poles', [[false, 'N facing S'], [true, 'N facing N']], flip, (v) => { flip = v; upd(); });
  const sl = slider(ctl, { label: 'Gap', min: 0.05, max: 1, step: 0.01, value: d, fmt: (z) => `${Math.round(z * 20)} cm`, oninput: (z) => { d = z; upd(); } });
  const out = readout(host);
  const geom = () => { const w = cv.w, h = cv.h, mw = Math.min(90, w * 0.22), lx = 14 + mw, rx = lx + 20 + d * (w - 2 * mw - 60); return { w, h, mw, lx, rx, cy: h * 0.45 }; };
  const near = (x, y) => { const g = geom(); return x > g.rx && x < g.rx + g.mw && Math.abs(y - g.cy) < 30; };
  touchGuard(cv.c, near);
  const pos = (e) => { const b = cv.c.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top]; };
  cv.c.addEventListener('pointerdown', (e) => { const [x, y] = pos(e); if (near(x, y)) { drag = true; cv.c.setPointerCapture(e.pointerId); } });
  cv.c.addEventListener('pointermove', (e) => { if (!drag) return; const g = geom(); d = clamp((pos(e)[0] - g.mw / 2 - 20 - g.lx + g.mw / 2) / (g.w - 2 * g.mw - 60), 0.05, 1); sl.set(d); upd(); });
  cv.c.addEventListener('pointerup', () => { drag = false; });
  const F = () => 20 / (1 + 40 * d * d);
  function upd() { out.innerHTML = `Gap ${Math.round(d * 20)} cm: force about <b>${F().toFixed(1)} units</b> and it ${flip ? '<b>pushes them apart</b> (like poles repel)' : '<b>pulls them together</b> (unlike poles attract)'}. Nothing touches: a non-contact force.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Magnets: a force without touching', col);
    const g = geom(), s = g.mw / 2, hh = 26;
    const box = (x, a, b, ca, cb) => { ctx.fillStyle = ca; ctx.fillRect(x, g.cy - hh / 2, s, hh); ctx.fillStyle = cb; ctx.fillRect(x + s, g.cy - hh / 2, s, hh); text(ctx, a, x + s / 2, g.cy, { color: '#fff', size: 13, weight: 700, align: 'center' }); text(ctx, b, x + s * 1.5, g.cy, { color: '#fff', size: 13, weight: 700, align: 'center' }); };
    box(14, 'S', 'N', col.s[1], col.s[0]);
    flip ? box(g.rx, 'N', 'S', col.s[0], col.s[1]) : box(g.rx, 'S', 'N', col.s[1], col.s[0]);
    ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(g.rx, g.cy - hh / 2, g.mw, hh);
    const len = 8 + F() * 3.4, mx = (14 + g.mw + g.rx) / 2, ay = g.cy + 44;
    if (flip) { arrow(ctx, g.rx - 2, ay, g.rx + len, ay, col.s[3], 4, 9); arrow(ctx, 14 + g.mw + 2, ay, 14 + g.mw - len, ay, col.s[3], 4, 9); }
    else { arrow(ctx, 14 + g.mw + 2, ay, 14 + g.mw + len, ay, col.s[3], 4, 9); arrow(ctx, g.rx - 2, ay, g.rx - len, ay, col.s[3], 4, 9); }
    text(ctx, `gap ${Math.round(d * 20)} cm`, mx, g.cy - 30, { color: col.muted, size: 10.5, align: 'center' });
    text(ctx, 'Drag the right magnet', w / 2, h - 12, { color: col.muted, size: 10.5, align: 'center' });
  };
  upd();
}
