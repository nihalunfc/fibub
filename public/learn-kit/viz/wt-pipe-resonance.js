// Sound standing in a pipe. Air molecules (dots) slosh back and forth; a node is where they hardly move, an antinode where
// they swing most, and pressure does the opposite (shading). Pick a pipe open at both ends or closed at one end and a
// harmonic: the open pipe allows every harmonic n v/2L, the closed pipe only the odd ones, (2n-1) v/4L. Longer pipe, lower note.
import { canvas, text, title, row, slider, choice, readout, loop } from '../kit.js';

export default function (host) {
  let kind = 'open', n = 1, Lm = 0.6, t = 0;
  const cv = canvas(host, { aspect: 0.6, max: 440, min: 300, label: 'Air vibrating in an open or closed pipe with nodes and antinodes' });
  const ctl = row(host), c2 = row(host);
  choice(ctl, 'Pipe', [['open', 'Open both ends'], ['closed', 'Closed one end']], kind, (v) => { kind = v; upd(); });
  choice(ctl, 'Harmonic', [[1, '1st'], [2, '2nd'], [3, '3rd'], [4, '4th']], n, (v) => { n = v; upd(); });
  slider(c2, { label: 'Pipe length', min: 0.2, max: 1.5, step: 0.05, value: Lm, fmt: (v) => `${v.toFixed(2)} m`, oninput: (v) => { Lm = v; upd(); } });
  const lp = loop(host, (dt) => { t += dt; cv.redraw(); }); lp.button(c2);
  const out = readout(host);
  const mode = () => (kind === 'open' ? { k: n * Math.PI, f: (n * 343) / (2 * Lm), lam: (2 * Lm) / n, N: n } : { k: ((2 * n - 1) * Math.PI) / 2, f: ((2 * n - 1) * 343) / (4 * Lm), lam: (4 * Lm) / (2 * n - 1), N: 2 * n - 1 });
  function upd() {
    const m = mode();
    out.innerHTML = `${kind === 'open' ? 'Open pipe' : 'Closed pipe'}, harmonic ${n}${kind === 'closed' ? ` (the ${m.N}${['st', 'nd', 'rd'][m.N - 1] || 'th'} multiple of the lowest note)` : ''}: wavelength λ = <b>${m.lam.toFixed(2)} m</b>, frequency f = v/λ = <b>${m.f.toFixed(0)} Hz</b> (v = 343 m/s, end correction ignored). ${kind === 'open' ? 'Displacement antinodes (A) at both open ends.' : 'Displacement node (N) at the closed end, antinode (A) at the open end.'} The picture is slowed down a lot.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const m = mode(); title(ctx, `${kind === 'open' ? 'Open' : 'Closed'} pipe, harmonic ${n}: ${m.f.toFixed(0)} Hz`, col);
    const x0 = 24, x1 = w - 24, py = h * 0.5, ph = Math.min(80, h * 0.34), L = x1 - x0, ph_ = t * 2.6;
    // displacement shape: open: cos(kx/L), closed (closed at left x=0): sin(kx/L)
    const xi = (u) => (kind === 'open' ? Math.cos(m.k * u) : Math.sin(m.k * u));
    const dxi = (u) => (kind === 'open' ? -Math.sin(m.k * u) : Math.cos(m.k * u)); // ∝ -pressure (compression where xi' < 0)
    // pressure shading
    for (let i = 0; i < 160; i++) { const u = (i + 0.5) / 160, p = -dxi(u) * Math.cos(ph_); ctx.globalAlpha = Math.min(0.55, Math.abs(p) * 0.5); ctx.fillStyle = p > 0 ? col.bad : col.s[0]; ctx.fillRect(x0 + (i / 160) * L, py - ph / 2, L / 160 + 1, ph); }
    ctx.globalAlpha = 1;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x0, py - ph / 2); ctx.lineTo(x1, py - ph / 2); ctx.moveTo(x0, py + ph / 2); ctx.lineTo(x1, py + ph / 2); if (kind === 'closed') { ctx.moveTo(x0, py - ph / 2); ctx.lineTo(x0, py + ph / 2); } ctx.stroke();
    // molecules
    for (let r = 0; r < 4; r++) for (let i = 0; i <= 44; i++) { const u0 = i / 44, d = xi(u0) * Math.cos(ph_) * (L / 44) * 0.9; ctx.fillStyle = col.ink; ctx.beginPath(); ctx.arc(x0 + u0 * L + d, py - ph / 2 + ph * (r + 0.5) / 4, 2.1, 0, 6.3); ctx.fill(); }
    // envelope and node labels
    const env = []; ctx.strokeStyle = col.s[3]; ctx.lineWidth = 2; ctx.setLineDash([5, 4]); ctx.beginPath();
    for (let i = 0; i <= 120; i++) { const u = i / 120, y = py + ph / 2 + 22 - Math.abs(xi(u)) * 14; i ? ctx.lineTo(x0 + u * L, y) : ctx.moveTo(x0 + u * L, y); } ctx.stroke(); ctx.setLineDash([]);
    const nodes = [], anti = [];
    for (let i = 0; i <= 200; i++) { const u = i / 200; if (Math.abs(xi(u)) < 0.012) nodes.push(u); if (Math.abs(dxi(u)) < 0.012) anti.push(u); }
    const dedupe = (a) => a.filter((u, i) => !i || u - a[i - 1] > 0.02);
    dedupe(nodes).forEach((u) => text(ctx, 'N', x0 + u * L, py + ph / 2 + 38, { color: col.s[3], size: 11, weight: 700, align: 'center' }));
    dedupe(anti).forEach((u) => text(ctx, 'A', x0 + u * L, py + ph / 2 + 38, { color: col.s[2], size: 11, weight: 700, align: 'center' }));
    text(ctx, 'displacement nodes N and antinodes A (dashed: size of the swing)', w / 2, h - 8, { color: col.muted, size: 10, align: 'center' });
    text(ctx, 'red: compressed, blue: rarefied', w / 2, py - ph / 2 - 10, { color: col.muted, size: 10, align: 'center' });
  };
  upd();
}
