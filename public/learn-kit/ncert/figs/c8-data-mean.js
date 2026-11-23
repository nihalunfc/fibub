// Class 8 Tales by Dots and Lines: the mean as a fair share. Drag the bars (books read by 5 friends); the mean is the height
// they would all have if the extra from taller bars were poured into shorter ones. "Level them" animates exactly that.
import { canvas, text, title, row, button, readout, loop, touchGuard, clamp } from '../../kit.js';

export default function (host) {
  const v = [3, 9, 5, 2, 6], nm = ['Anu', 'Bilal', 'Chitra', 'Dev', 'Esha'];
  let lv = 0, goal = 0, drag = -1;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 280, label: 'Five bars that can be dragged, with a line at their mean' });
  const ctl = row(host);
  button(ctl, 'Level them', () => { goal = 1; anim.play(); });
  button(ctl, 'Back', () => { goal = 0; anim.play(); });
  const out = readout(host);
  const mean = () => v.reduce((a, b) => a + b, 0) / v.length;
  const geo = () => { const w = cv.w, h = cv.h, L = 30, B = h - 36, W = w - L - 14, top = 40; return { L, B, W, H: B - top - 6, bw: W / 5, mx: 12 }; };
  const anim = loop(host, (dt) => { lv = clamp(lv + (goal ? dt : -dt) * 1.2, 0, 1); cv.redraw(); if (lv === goal) anim.pause(); }, { autoplay: false });
  function sync() { out.innerHTML = `Books read: ${v.join(' + ')} = ${v.reduce((a, b) => a + b, 0)}. Mean = ${v.reduce((a, b) => a + b, 0)} ÷ 5 = <b>${+mean().toFixed(2)}</b>. Drag a bar and see the mean move; press “Level them” and every bar becomes ${+mean().toFixed(2)}.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Mean: the fair share', col), g = geo(), m = mean();
    ctx.strokeStyle = col.line; ctx.lineWidth = 1;
    for (let k = 0; k <= 12; k += 3) { const y = g.B - (k / g.mx) * g.H; ctx.beginPath(); ctx.moveTo(g.L, y); ctx.lineTo(g.L + g.W, y); ctx.stroke(); text(ctx, String(k), g.L - 5, y, { color: col.muted, size: 10, align: 'right' }); }
    v.forEach((x, i) => { const val = x + (m - x) * lv, bh = (val / g.mx) * g.H, bx = g.L + i * g.bw + g.bw * 0.15; ctx.fillStyle = col.s[i]; ctx.globalAlpha = 0.7; ctx.fillRect(bx, g.B - bh, g.bw * 0.7, bh); ctx.globalAlpha = 1; text(ctx, nm[i], bx + g.bw * 0.35, g.B + 14, { color: col.ink, size: 10.5, align: 'center' }); text(ctx, String(+val.toFixed(1)), bx + g.bw * 0.35, g.B - bh - 9, { color: col.ink, size: 11, weight: 700, align: 'center' }); if (!lv) { ctx.fillStyle = col.ink; ctx.fillRect(bx + g.bw * 0.2, g.B - bh - 2, g.bw * 0.3, 4); } });
    const ym = g.B - (m / g.mx) * g.H; ctx.strokeStyle = col.s[3]; ctx.lineWidth = 2; ctx.setLineDash([6, 4]); ctx.beginPath(); ctx.moveTo(g.L, ym); ctx.lineTo(g.L + g.W, ym); ctx.stroke(); ctx.setLineDash([]);
    text(ctx, 'mean ' + +m.toFixed(2), g.L + g.W - 2, ym - 9, { color: col.s[3], size: 11, weight: 700, align: 'right', halo: col.panel });
  };
  const pos = (e) => { const b = cv.c.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top]; };
  const hit = (x, y) => { const g = geo(); const i = Math.floor((x - g.L) / g.bw); return i >= 0 && i < 5 && !lv && y > 36 && y < g.B + 4 ? i : -1; };
  const move = (e) => { if (drag < 0) return; const [, y] = pos(e), g = geo(); v[drag] = clamp(Math.round(((g.B - y) / g.H) * g.mx), 1, 12); sync(); };
  cv.c.addEventListener('pointerdown', (e) => { const [x, y] = pos(e); drag = hit(x, y); if (drag >= 0) { cv.c.setPointerCapture(e.pointerId); move(e); } });
  cv.c.addEventListener('pointermove', move);
  cv.c.addEventListener('pointerup', () => { drag = -1; });
  touchGuard(cv.c, (x, y) => hit(x, y) >= 0);
  sync();
}
