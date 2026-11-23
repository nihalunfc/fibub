// Class 11 Chemistry, Structure of Atom: Rutherford's alpha scattering. A beam of alpha particles meets a thin gold foil.
// Thomson's "plum pudding" (charge spread over the atom) gives only tiny pushes; a small dense nucleus of charge +Ze repels
// a near-head-on alpha so strongly that it bounces back. Paths are computed from Coulomb's law (inverse-square repulsion), not drawn by hand.
import { canvas, text, title, row, slider, choice, readout, loop, dot } from '../../kit.js';

export default function (host) {
  let model = 'nuc', Z = 79, t = 0;
  const cv = canvas(host, { aspect: 0.72, max: 440, min: 300, label: 'Alpha particles fired at an atom with a nucleus or with spread-out charge' });
  const ctl = row(host), ro = readout(host), bs = [-0.9, -0.55, -0.3, -0.14, -0.04, 0.02, 0.1, 0.25, 0.5, 0.9];
  choice(ctl, 'atom model', [['thom', 'plum pudding'], ['nuc', 'nucleus']], model, (v) => { model = v; calc(); });
  slider(ctl, { label: 'nuclear charge Z', min: 2, max: 79, step: 1, value: Z, fmt: (v) => v.toFixed(0), oninput: (v) => { Z = v; calc(); } });
  let paths = [];
  const calc = () => {
    paths = bs.map((b) => {
      let x = -1.6, y = b, vx = 1, vy = 0; const pts = [[x, y]], k = model === 'nuc' ? 0.08 * Z / 79 : 0;
      for (let i = 0; i < 1500; i++) {
        let r2 = x * x + y * y, ax = 0, ay = 0;
        if (model === 'nuc') { const r = Math.sqrt(r2) + 0.012; ax = k * x / (r * r * r); ay = k * y / (r * r * r); }
        else { const R = 0.7; if (r2 < R * R) { ax = 0.0008 * x / R; ay = 0.0008 * y / R; } }
        vx += ax * 0.01; vy += ay * 0.01; x += vx * 0.01; y += vy * 0.01; if (i % 5 === 0) pts.push([x, y]); if (Math.abs(x) > 1.7 || Math.abs(y) > 1.7) break;
      }
      return pts;
    });
    const back = paths.filter((p) => p[p.length - 1][0] < 0).length, big = paths.filter((p) => { const a = p[p.length - 1], c = p[p.length - 4] || p[0]; return Math.abs(Math.atan2(a[1] - c[1], a[0] - c[0])) > 0.5; }).length;
    ro.textContent = model === 'thom' ? 'Plum pudding: every alpha goes almost straight through. That is what most alphas did.' : `Nucleus (Z = ${Z.toFixed(0)}): ${big} of 10 paths bend by more than 30°, ${back} bounce back. Closer aim means bigger deflection; most of the atom is empty space.`;
    cv.redraw();
  };
  loop(host, (dt) => { t += dt * 0.35; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, model === 'nuc' ? 'Rutherford: a tiny dense nucleus' : "Thomson's plum pudding", col) + 4, S = Math.min(w, h - t0 - 12) / 3.4, cx = w / 2, cy = t0 + (h - t0) / 2;
    ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(cx, cy, 0.7 * S, 0, 7); ctx.stroke();
    if (model === 'nuc') dot(ctx, cx, cy, 5, col.s[3]); else { ctx.fillStyle = col.s[3]; ctx.globalAlpha = 0.1; ctx.beginPath(); ctx.arc(cx, cy, 0.7 * S, 0, 7); ctx.fill(); ctx.globalAlpha = 1; }
    paths.forEach((p, i) => { ctx.strokeStyle = col.s[0]; ctx.globalAlpha = 0.45; ctx.lineWidth = 1.5; ctx.beginPath(); p.forEach(([x, y], j) => (j ? ctx.lineTo(cx + x * S, cy + y * S) : ctx.moveTo(cx + x * S, cy + y * S))); ctx.stroke(); ctx.globalAlpha = 1; const f = Math.min(p.length - 1, Math.floor(((t + i * 0.07) % 1.3) / 1.3 * p.length)), q = p[f]; dot(ctx, cx + q[0] * S, cy + q[1] * S, 3.2, col.s[1]); });
    text(ctx, 'α beam →', 6, cy - 0.9 * S - 6, { color: col.muted, size: 11 }); text(ctx, 'gold foil atom', cx, cy + 0.7 * S + 12, { color: col.muted, size: 11, align: 'center' });
  };
  calc();
}
