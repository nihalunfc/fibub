// Class 8 Solutions: solutions, suspensions and colloids. Particles in a true solution are too small to scatter light or to
// settle, so a torch beam passes through unseen. In a colloid the particles (about 1 to 1000 nm) scatter the beam (the Tyndall
// effect) but never settle. In a suspension the particles are big enough to scatter light AND to settle if left alone.
import { canvas, text, title, line, dot, row, slider, choice, button, readout, loop, rng } from '../../kit.js';

const K = { sol: ['Salt in water (solution)', 1.3, 0], col: ['Milk in water (colloid)', 3.4, 0], sus: ['Chalk in water (suspension)', 5.2, 1] };
export default function (host) {
  let kind = 'sol', torch = true, t = 0, settle = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'A torch beam through a solution, a colloid and a suspension' });
  const ctl = row(host);
  choice(ctl, 'Mixture', [['sol', 'Solution'], ['col', 'Colloid'], ['sus', 'Suspension']], kind, (v) => { kind = v; settle = 0; say(); });
  button(ctl, 'Torch on/off', () => { torch = !torch; say(); });
  button(ctl, 'Wait 1 hour', () => { settle = 1; say(); });
  const out = readout(host);
  const R = rng(4), P = []; for (let i = 0; i < 60; i++) P.push([R(), R(), R() * 6.3, R() * 6.3]);
  loop(host, (dt) => { t += dt; if (settle > 0 && settle < 2) settle = Math.min(2, settle + dt * 0.5); cv.redraw(); });
  function say() {
    const m = { sol: 'Particles under 1 nm: they scatter no light, never settle, and pass through filter paper. The beam is invisible inside.', col: 'Particles about 1 to 1000 nm: they scatter the beam so it shows up as a glowing path (Tyndall effect). They do not settle and pass through filter paper.', sus: 'Particles over 1000 nm: they scatter light and, after waiting, they settle at the bottom. A filter paper can catch them.' }[kind];
    out.textContent = (torch ? '' : 'Torch off. ') + m; cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const [nm, size, sets] = K[kind]; title(ctx, nm, col);
    const bx = w * 0.22, bw = w * 0.56, by = 50, bh = h - 74;
    ctx.fillStyle = col.soft; ctx.fillRect(bx, by + 14, bw, bh - 14);
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx, by + bh); ctx.lineTo(bx + bw, by + bh); ctx.lineTo(bx + bw, by); ctx.stroke();
    const f = sets ? Math.min(1, settle / 1.6) : 0, n = kind === 'sol' ? 60 : kind === 'col' ? 50 : 36;
    for (let i = 0; i < n; i++) { const p = P[i]; let x = bx + 10 + (bw - 20) * p[0] + 4 * Math.sin(p[2] + t * 1.1), y = by + 24 + (bh - 40) * p[1] + 4 * Math.sin(p[3] + t * 0.9);
      y = y + (by + bh - 8 - y) * f * (0.6 + 0.4 * p[0]); dot(ctx, x, y, size, kind === 'sol' ? col.s[2] : col.s[1]); }
    const ty = by + bh / 2;
    ctx.fillStyle = col.ink; ctx.fillRect(w * 0.04, ty - 9, 22, 18); text(ctx, 'torch', w * 0.04 + 11, ty + 20, { color: col.muted, size: 10, align: 'center' });
    if (torch) {
      ctx.save(); const sc = kind === 'sol' ? 0.1 : kind === 'col' ? 0.55 : 0.5 * (1 - f * 0.7);
      ctx.fillStyle = col.warn; ctx.globalAlpha = 0.25; ctx.beginPath(); ctx.moveTo(w * 0.04 + 22, ty - 6); ctx.lineTo(bx, ty - 7); ctx.lineTo(bx, ty + 7); ctx.lineTo(w * 0.04 + 22, ty + 6); ctx.fill();
      ctx.globalAlpha = 0.25 + 0.6 * sc; ctx.beginPath(); ctx.moveTo(bx, ty - 7); ctx.lineTo(bx + bw, ty - 7); ctx.lineTo(bx + bw, ty + 7); ctx.lineTo(bx, ty + 7); ctx.fill(); ctx.restore();
      text(ctx, kind === 'sol' ? 'beam not visible' : kind === 'col' ? 'glowing path' : f > 0.8 ? 'clearer: it settled' : 'beam visible', bx + bw / 2, ty - 16, { color: col.ink, size: 10.5, weight: 700, align: 'center', halo: col.soft });
    }
    if (f > 0.8) text(ctx, 'settled', bx + bw / 2, by + bh - 14, { color: col.ink, size: 10.5, weight: 700, align: 'center', halo: col.soft });
  };
  say();
}
