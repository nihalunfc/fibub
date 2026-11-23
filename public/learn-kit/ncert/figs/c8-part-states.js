// Class 8 Particles: matter is made of tiny particles that are always moving. Raise the temperature and they move
// faster. Solid: packed in fixed places, only vibrating. Liquid: close together but sliding past each other. Gas: far
// apart, flying freely. Water changes state at 0 C (melting/freezing) and 100 C (boiling/condensing) at normal pressure.
import { canvas, text, title, dot, line, row, slider, loop, readout, rng } from '../../kit.js';

export default function (host) {
  let T = 25;
  const R = rng(11), N = 30, ps = Array.from({ length: N }, (_, i) => ({ hx: (i % 6) / 5, hy: Math.floor(i / 6) / 4, x: R(), y: R(), vx: R() - 0.5, vy: R() - 0.5 }));
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 280, label: 'Particles of water that vibrate, slide or fly depending on temperature' });
  const state = () => (T <= 0 ? 'solid' : T < 100 ? 'liquid' : 'gas');
  loop(host, (dt) => {
    const s = state(), sp = 0.3 + (T + 30) / 100;
    ps.forEach((p) => {
      if (s === 'solid') { const tx = 0.1 + p.hx * 0.5, ty = 0.55 + p.hy * 0.35; p.x += (tx + (R() - 0.5) * 0.02 * sp - p.x) * 0.3; p.y += (ty + (R() - 0.5) * 0.02 * sp - p.y) * 0.3; }
      else { p.vx += (R() - 0.5) * sp * dt * 6; p.vy += (R() - 0.5) * sp * dt * 6; const m = Math.hypot(p.vx, p.vy) || 1, want = s === 'liquid' ? 0.12 * sp : 0.5 * Math.min(sp, 2); p.vx *= want / m; p.vy *= want / m;
        p.x += p.vx * dt; p.y += p.vy * dt; const top = s === 'liquid' ? 0.45 : 0.02, lx = s === 'liquid' ? 0.02 : 0.02;
        if (p.x < lx || p.x > 0.98) { p.vx *= -1; p.x = Math.min(0.98, Math.max(lx, p.x)); } if (p.y < top || p.y > 0.98) { p.vy *= -1; p.y = Math.min(0.98, Math.max(top, p.y)); } }
    });
    cv.redraw();
  });
  const ctl = row(host);
  slider(ctl, { label: 'Temperature', min: -20, max: 130, step: 5, value: T, fmt: (z) => `${z} °C`, oninput: (z) => { T = z; upd(); } });
  const out = readout(host);
  function upd() { const s = state(); out.innerHTML = s === 'solid' ? 'Ice: particles are held in fixed places and only <b>vibrate</b>.' : s === 'liquid' ? 'Liquid water: particles are close but <b>slide past each other</b>, so it flows and takes the shape of the glass.' : 'Steam: particles are far apart and <b>fly in all directions</b>, filling the whole container.'; }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, `Water at ${T} °C is ${state() === 'solid' ? 'ice (solid)' : state() === 'liquid' ? 'liquid' : 'steam (gas)'}`, col);
    const bx = 14, by = 40, bw = w - 70, bh = h - 56;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(bx, by, bw, bh);
    ps.forEach((p) => dot(ctx, bx + 8 + p.x * (bw - 16), by + 8 + p.y * (bh - 16), 6, state() === 'solid' ? col.s[0] : state() === 'liquid' ? col.s[2] : col.s[1]));
    const tx = w - 36, ty0 = by, th = bh, f = (T + 20) / 150;
    ctx.fillStyle = col.soft; ctx.fillRect(tx - 6, ty0, 12, th); ctx.fillStyle = col.s[3]; ctx.fillRect(tx - 6, ty0 + th * (1 - f), 12, th * f);
    [[0, '0'], [100, '100']].forEach(([v, l]) => { const y = ty0 + th * (1 - (v + 20) / 150); line(ctx, [[tx + 6, y], [tx + 12, y]], col.ink, 1.5); text(ctx, l, tx + 14, y, { color: col.muted, size: 10 }); });
  };
  upd();
}
