// Solid, liquid or gas? Molecules that attract each other a little and repel when they touch (a Lennard-Jones force,
// in reduced units) move in a box. Cool them and they lock into a regular crystal; warm them and the crystal melts into a
// liquid; give them room (widen the box) and warm them and they fly apart as a gas. Dots are coloured by how many close neighbours they have.
import { canvas, text, title, row, slider, button, readout, loop } from '../kit.js';

const N = 36;
export default function (host) {
  let Tset = 0.15, L = 6.4, P = [], pe = 0, ke = 0;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 300, label: 'Molecules in a box that form a crystal when cold, a liquid when warm and a gas when spread out' });
  const ctl = row(host);
  const sT = slider(ctl, { label: 'Temperature', min: 0.03, max: 1.6, step: 0.01, value: Tset, fmt: (v) => v.toFixed(2), oninput: (v) => { Tset = v; } });
  const sL = slider(ctl, { label: 'Box size', min: 5.6, max: 16, step: 0.1, value: L, fmt: (v) => v.toFixed(1), oninput: (v) => { const f = v / L; P.forEach((p) => { p.x *= f; p.y *= f; }); L = v; } });
  const c2 = row(host);
  function init() { P = []; const m = 6, s = L / (m + 0.3); for (let i = 0; i < N; i++) P.push({ x: (i % m + 0.5 + (Math.floor(i / m) % 2) * 0.5) * s * 0.95 + 0.3, y: (Math.floor(i / m) + 0.5) * s * 0.9 + 0.3, vx: 0, vy: 0, fx: 0, fy: 0 }); }
  function forces() {
    pe = 0; P.forEach((p) => { p.fx = 0; p.fy = 0; });
    for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
      const dx = P[i].x - P[j].x, dy = P[i].y - P[j].y, r2 = dx * dx + dy * dy;
      if (r2 > 6.25 || r2 < 1e-6) continue;
      const s2 = 1 / Math.max(r2, 0.64), s6 = s2 ** 3, f = (24 * (2 * s6 * s6 - s6)) * s2; // force / r
      const ff = Math.max(-40, Math.min(40, f)); P[i].fx += ff * dx; P[i].fy += ff * dy; P[j].fx -= ff * dx; P[j].fy -= ff * dy;
      pe += 4 * (s6 * s6 - s6);
    }
  }
  const lp = loop(host, (dt) => {
    const h = 0.004, n = Math.min(14, Math.max(2, Math.round(dt * 400)));
    for (let k = 0; k < n; k++) {
      P.forEach((p) => { p.vx += 0.5 * h * p.fx; p.vy += 0.5 * h * p.fy; p.x += p.vx * h; p.y += p.vy * h;
        if (p.x < 0.2) { p.x = 0.4 - p.x; p.vx = Math.abs(p.vx); } if (p.x > L - 0.2) { p.x = 2 * (L - 0.2) - p.x; p.vx = -Math.abs(p.vx); }
        if (p.y < 0.2) { p.y = 0.4 - p.y; p.vy = Math.abs(p.vy); } if (p.y > L - 0.2) { p.y = 2 * (L - 0.2) - p.y; p.vy = -Math.abs(p.vy); } });
      forces();
      P.forEach((p) => { p.vx += 0.5 * h * p.fx; p.vy += 0.5 * h * p.fy; });
      ke = P.reduce((s, p) => s + 0.5 * (p.vx ** 2 + p.vy ** 2), 0);
      const Tn = ke / N; if (Tn > 1e-9) { const sc = Math.sqrt(1 + 0.02 * (Tset / Tn - 1)); P.forEach((p) => { p.vx *= sc; p.vy *= sc; }); }
    }
    cv.redraw(); show();
  }); lp.button(c2); button(c2, 'Reset crystal', () => { init(); forces(); });
  const out = readout(host);
  const neigh = (i) => P.reduce((c, q, j) => (j !== i && (P[i].x - q.x) ** 2 + (P[i].y - q.y) ** 2 < 1.7 ? c + 1 : c), 0);
  function show() {
    const avg = P.reduce((s, _, i) => s + neigh(i), 0) / N, rho = N / (L * L);
    out.innerHTML = `Temperature (average kinetic energy per molecule) ${(ke / N).toFixed(2)}; potential energy per molecule ${(pe / N).toFixed(2)} (negative = bound). Density ${rho.toFixed(2)}; average close neighbours <b>${avg.toFixed(1)}</b>: ${avg > 4.2 ? 'crystal: fixed places, regular pattern' : avg > 2.2 ? 'liquid: touching but sliding past each other' : 'gas: mostly free flight, few neighbours'}. Units are reduced (molecule size = 1). Try: cold and small box, then warm it up; or widen the box and warm up.`;
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Solid, liquid, gas', col);
    const s = Math.min(w - 20, h - 40), x0 = (w - s) / 2, y0 = 34, k = s / L;
    ctx.fillStyle = col.soft; ctx.fillRect(x0, y0, s, s); ctx.strokeStyle = col.muted; ctx.lineWidth = 2; ctx.strokeRect(x0, y0, s, s);
    P.forEach((p, i) => { const c = neigh(i); ctx.fillStyle = c >= 4 ? col.s[0] : c >= 2 ? col.s[2] : col.s[3]; ctx.beginPath(); ctx.arc(x0 + p.x * k, y0 + p.y * k, 0.5 * k, 0, 6.3); ctx.fill(); ctx.strokeStyle = col.panel; ctx.lineWidth = 1; ctx.stroke(); });
    text(ctx, 'blue: 4 or more close neighbours, green: 2 to 3, orange: fewer', 10, y0 + s + 14, { color: col.muted, size: 10 });
  };
  init(); forces(); show();
  return { step(i) { const [t, l] = [[0.1, 6.4], [0.6, 6.4], [1.0, 7.2], [1.2, 14]][Math.min(3, i)]; if (i === 0) { init(); } const f = l / L; P.forEach((q) => { q.x *= f; q.y *= f; }); L = l; Tset = t; sT.set(t); sL.set(l); forces(); cv.redraw(); show(); } };
}
