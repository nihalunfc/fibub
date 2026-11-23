// Class 11 Biology, Excretory products: haemodialysis. Blood (left) and dialysis fluid (right) flow past a semipermeable cellophane-like membrane. Small molecules such as urea
// diffuse down their concentration gradient into the fluid; blood cells and large proteins cannot pass. Fresh fluid keeps the urea level on its side low, so diffusion continues.
import { canvas, text, title, line, row, button, choice, readout, loop, rng } from '../../kit.js';

export default function (host) {
  const R = rng(7), N = 60;
  let fresh = true, ps, t = 0, hist = [];
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 290, label: 'Urea particles crossing a membrane from blood into dialysis fluid, with a graph of blood urea falling over time' });
  const ctl = row(host), ro = readout(host);
  const init = () => { ps = Array.from({ length: N }, () => ({ x: R() * 0.46, y: R(), vx: (R() - 0.5), vy: (R() - 0.5) })); t = 0; hist = [1]; };
  const side = (p) => (p.x < 0.5 ? 'b' : 'd');
  const anim = loop(host, (dt) => {
    t += dt;
    ps.forEach((p) => {
      if (p.gone) return;
      p.x += p.vx * dt * 1.3; p.y += p.vy * dt * 1.3; p.vx += (R() - 0.5) * 0.6; p.vy += (R() - 0.5) * 0.6; const s = Math.hypot(p.vx, p.vy); if (s > 0.6) { p.vx *= 0.6 / s; p.vy *= 0.6 / s; }
      if (p.y < 0 || p.y > 1) { p.vy *= -1; p.y = Math.min(1, Math.max(0, p.y)); }
      const was = p.x - p.vx * dt * 1.3;
      if ((was < 0.5) !== (p.x < 0.5) && R() > 0.5) { p.x = was; p.vx *= -1; }   // membrane: only some cross
      if (p.x < 0) { p.x = 0; p.vx *= -1; } if (p.x > 1) { p.x = 1; p.vx *= -1; }
      if (fresh && p.x > 0.5 && R() < dt * 0.9) p.gone = true;   // carried away by the flowing fluid
    });
    go();
  });
  const go = () => { const nb = ps.filter((p) => !p.gone && side(p) === 'b').length; if (!hist.length || t - (hist.t ?? 0) > 0.5) { hist.push(nb / N); hist.t = t; if (hist.length > 40) hist.shift(); } ro.textContent = `Urea left in blood: ${nb} of ${N} particles (${Math.round(nb / N * 100)} %). ${fresh ? 'Fresh dialysis fluid keeps flowing, so the fluid side stays nearly empty and urea keeps leaving.' : 'No fresh fluid: the two sides even out at about half each and removal stops.'}`; cv.redraw(); };
  choice(ctl, 'Dialysis fluid', [[true, 'Fresh, flowing'], [false, 'Not changed']], fresh, (v) => { fresh = v; init(); go(); });
  anim.button(ctl); button(ctl, 'Restart', () => { init(); go(); });
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, 'Haemodialysis: urea diffuses out', col), x0 = 14, bw = w - 28, by = t0 + 10, bh = h * 0.45;
    ctx.fillStyle = col.soft; ctx.fillRect(x0, by, bw / 2, bh); ctx.fillStyle = col.line; ctx.globalAlpha = 0.5; ctx.fillRect(x0 + bw / 2, by, bw / 2, bh); ctx.globalAlpha = 1;
    line(ctx, [[x0 + bw / 2, by], [x0 + bw / 2, by + bh]], col.ink, 2, [4, 4]);
    text(ctx, 'BLOOD', x0 + 6, by + 10, { color: col.s[3], size: 10, weight: 700 }); text(ctx, 'DIALYSIS FLUID', x0 + bw - 6, by + 10, { color: col.muted, size: 10, weight: 700, align: 'right' });
    [[0.12, 0.35], [0.3, 0.7], [0.1, 0.8]].forEach(([u, v]) => { ctx.beginPath(); ctx.arc(x0 + u * bw, by + v * bh, 9, 0, 7); ctx.fillStyle = col.s[3]; ctx.globalAlpha = 0.5; ctx.fill(); ctx.globalAlpha = 1; });
    text(ctx, 'blood cell (too big)', x0 + 6, by + bh - 8, { color: col.muted, size: 9.5 });
    ps.forEach((p) => { if (p.gone) return; ctx.beginPath(); ctx.arc(x0 + p.x * bw, by + 20 + p.y * (bh - 30), 3, 0, 7); ctx.fillStyle = col.s[2]; ctx.fill(); });
    // graph
    const gy = by + bh + 20, gh = h - gy - 26; text(ctx, 'blood urea (share left)', x0, gy - 4, { color: col.muted, size: 10 });
    line(ctx, [[x0, gy], [x0, gy + gh], [x0 + bw, gy + gh]], col.muted, 1.5);
    line(ctx, hist.map((v, i) => [x0 + (i / 39) * bw, gy + gh - v * gh]), col.s[0], 2.5);
    text(ctx, 'time', x0 + bw, gy + gh + 12, { color: col.muted, size: 10, align: 'right' });
  };
  init(); go();
}
