// Class 12 Electromagnetic Induction (step player): the self-inductance of a long solenoid, L = μ0 n² A l, and the energy stored in an inductor U = ½ L I².
// Flux through one turn Φ = BA = μ0 n I A; N = n l turns link it, so NΦ = (μ0 n² A l) I = L I. Building up the current against the back emf: dW = L I dI, so U = ½ L I².
import { canvas, text, title, line, dot, arrow, loop } from '../../kit.js';

export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'A solenoid and its inductance and stored energy' });
  const TITLES = ['A long solenoid: n turns per metre, area A, length l', 'Flux through one turn: Φ = B A', 'Flux linked with all N = n l turns', 'So L = μ0 n² A l (units: henry)', 'An iron core multiplies it by μr', 'Energy stored: the area under L I dI'];
  loop(host, (dt) => { t += dt; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TITLES[step], col) + 4;
    const x0 = 28, x1 = w - 28, cy = top + (h - top) * 0.3, hr = 30;
    ctx.save(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; for (let k = 0; k < 16; k++) { const x = x0 + ((x1 - x0) * (k + 0.5)) / 16; ctx.beginPath(); ctx.ellipse(x, cy, 4, hr, 0, 0, 7); ctx.stroke(); } ctx.restore();
    if (step === 4) { ctx.save(); ctx.fillStyle = col.s[2]; ctx.globalAlpha = 0.35; ctx.fillRect(x0 + 6, cy - hr * 0.6, x1 - x0 - 12, hr * 1.2); ctx.restore(); text(ctx, 'iron core', w / 2, cy, { color: col.ink, size: 11, weight: 700, align: 'center' }); }
    if (step >= 1 && step !== 5) for (let k = -1; k <= 1; k++) arrow(ctx, x0 + 10, cy + k * 14, x1 - 10, cy + k * 14, col.s[0], step === 4 ? 3 : 1.8, 8);
    if (step === 1) { ctx.save(); ctx.strokeStyle = col.s[1]; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(w / 2, cy, 4, hr, 0, 0, 7); ctx.stroke(); ctx.restore(); text(ctx, 'one turn', w / 2, cy + hr + 14, { color: col.s[1], size: 11, align: 'center', weight: 700 }); }
    if (step === 2) { const kk = Math.floor(t * 3) % 16; for (let k = 0; k <= kk; k++) { const x = x0 + ((x1 - x0) * (k + 0.5)) / 16; ctx.save(); ctx.strokeStyle = col.s[1]; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.ellipse(x, cy, 4, hr, 0, 0, 7); ctx.stroke(); ctx.restore(); } }
    const lines = [['I makes B = μ0 n I inside', 'I = current; l = length; A = cross-section area'], ['Φ = B A = μ0 n I A', 'the same flux threads every turn'], ['N Φ = (n l)(μ0 n I A) = (μ0 n² A l) I', 'flux linkage is proportional to I: N Φ = L I'], ['L = μ0 n² A l', 'depends on the shape only; ε = −L dI/dt'], ['L = μr μ0 n² A l', 'soft iron: μr of hundreds or thousands'], ['U = ∫ L I dI = ½ L I²', 'energy density u = B² / 2μ0 (J per m³)']][step];
    text(ctx, lines[0], w / 2, h - 34, { color: col.ink, size: 13, weight: 700, align: 'center' }); text(ctx, lines[1], w / 2, h - 14, { color: col.muted, size: 10.5, align: 'center' });
    if (step === 5) {
      const gx = w * 0.2, gy = cy + hr + 100, gw = w * 0.6, gh = 66, f = ((t * 0.4) % 1);
      line(ctx, [[gx, gy], [gx + gw, gy]], col.ink, 1.5); line(ctx, [[gx, gy], [gx, gy - gh]], col.ink, 1.5);
      ctx.save(); ctx.fillStyle = col.s[1]; ctx.globalAlpha = 0.4; ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(gx + gw * f, gy); ctx.lineTo(gx + gw * f, gy - gh * f); ctx.closePath(); ctx.fill(); ctx.restore();
      line(ctx, [[gx, gy], [gx + gw, gy - gh]], col.s[1], 2); dot(ctx, gx + gw * f, gy - gh * f, 5, col.s[1], col.ink);
      text(ctx, 'I', gx + gw + 8, gy, { color: col.muted, size: 11 }); text(ctx, 'flux linkage L I', gx + 4, gy - gh - 8, { color: col.muted, size: 10.5 }); text(ctx, 'shaded area = ½ L I²', gx + gw * 0.55, gy - 12, { color: col.ink, size: 10.5, weight: 700 });
    }
  };
  cv.redraw();
  return { step(i) { step = Math.min(5, i); t = 0; cv.redraw(); } };
}
