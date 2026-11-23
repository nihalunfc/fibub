// Class 11 Chemistry, Thermodynamics: open, closed and isolated systems. Choose the kind of container and see what may cross the boundary: matter (particles that leave) and energy (heat).
// Open: matter and energy both cross. Closed: only energy. Isolated: neither (a perfect thermos).
import { canvas, text, title, row, choice, readout, loop, rng } from '../../kit.js';

const KIND = { open: ['Open system: matter AND energy cross', true, true, 'A cup of hot tea with no lid: steam (matter) escapes and the heat leaves too.'], closed: ['Closed system: only energy crosses', false, true, 'A sealed pressure-cooker: the steam stays inside, but heat passes through the metal wall.'], isolated: ['Isolated system: nothing crosses', false, false, 'An ideal thermos flask: neither matter nor heat gets in or out (a real flask only comes close).'] };
export default function (host) {
  let kind = 'open', lost = 0;
  const r = rng(7), P = Array.from({ length: 16 }, () => ({ x: r(), y: r(), vx: (r() - 0.5) * 0.5, vy: (r() - 0.5) * 0.5 }));
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 300, label: 'Open closed and isolated systems with particles and heat crossing the boundary' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'system', [['open', 'open'], ['closed', 'closed'], ['isolated', 'isolated']], kind, (v) => { kind = v; lost = 0; P.forEach((p) => { p.y = r() * 0.9 + 0.05; p.dead = 0; }); go(); });
  const anim = loop(host, (dt) => {
    P.forEach((p) => {
      if (p.dead) { p.dead -= dt; if (p.dead <= 0) { p.dead = 0; p.x = r() * 0.8 + 0.1; p.y = 0.9; p.vy = -Math.abs(p.vy); } return; }
      p.x += p.vx * dt; p.y += p.vy * dt;
      if (p.x < 0.03 || p.x > 0.97) { p.vx *= -1; p.x = Math.min(0.97, Math.max(0.03, p.x)); }
      if (p.y > 0.97) { p.vy *= -1; p.y = 0.97; }
      if (p.y < 0.03) { if (kind === 'open') { lost++; p.dead = 3 + r() * 2; p.y = -1; } else { p.vy *= -1; p.y = 0.03; } }
    });
    cv.redraw();
  });
  anim.button(ctl);
  const go = () => { ro.textContent = KIND[kind][3]; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, KIND[kind][0], col), bw = Math.min(w * 0.46, 170), bh = bw * 0.9, x0 = w / 2 - bw / 2, y0 = t0 + 60;
    ctx.fillStyle = col.soft; ctx.fillRect(x0, y0, bw, bh);
    ctx.strokeStyle = col.ink; ctx.lineWidth = kind === 'isolated' ? 7 : 3; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0, y0 + bh); ctx.lineTo(x0 + bw, y0 + bh); ctx.lineTo(x0 + bw, y0); ctx.stroke();
    if (kind !== 'open') { ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0 + bw, y0); ctx.stroke(); } else { ctx.setLineDash([5, 5]); ctx.lineWidth = 1.5; ctx.strokeStyle = col.muted; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0 + bw, y0); ctx.stroke(); ctx.setLineDash([]); }
    P.forEach((p) => { if (p.dead) { const k = Math.max(0, p.dead - 2) / 3; ctx.globalAlpha = Math.min(1, k + 0.0); } if (p.y < 0) return; ctx.beginPath(); ctx.arc(x0 + p.x * bw, y0 + p.y * bh, 5, 0, 7); ctx.fillStyle = col.s[0]; ctx.fill(); ctx.globalAlpha = 1; });
    const arrowsE = KIND[kind][2], arrowsM = KIND[kind][1];
    const wavy = (x, y, dir) => { ctx.strokeStyle = arrowsE ? col.bad : col.line; ctx.lineWidth = 2.5; ctx.beginPath(); for (let i = 0; i <= 14; i++) { ctx.lineTo(x + dir * i * 2.6, y + Math.sin(i + (performance.now() / 160)) * 3); } ctx.stroke(); };
    if (arrowsE) { wavy(x0 + bw + 8, y0 + bh * 0.5, 1); wavy(x0 - 8, y0 + bh * 0.5, -1); } else { text(ctx, '✕ no heat', x0 + bw + 8, y0 + bh * 0.5, { color: col.muted, size: 11 }); }
    if (arrowsM) text(ctx, '↑ matter leaves: ' + lost, w / 2, y0 - 12, { color: col.s[0], size: 12, weight: 700, align: 'center' }); else text(ctx, '✕ no matter crosses', w / 2, y0 - 12, { color: col.muted, size: 11.5, align: 'center' });
    text(ctx, arrowsE ? 'heat (energy) crosses' : '', x0 - 10, y0 + bh * 0.5 + 22, { color: col.bad, size: 10.5, align: 'right' });
    text(ctx, 'SURROUNDINGS: everything outside the wall', w / 2, y0 + bh + 26, { color: col.muted, size: 11, align: 'center' });
    text(ctx, 'SYSTEM: what is inside', w / 2, y0 + bh + 46, { color: col.ink, size: 11.5, weight: 700, align: 'center' });
  };
  go();
}
