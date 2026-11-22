// 4.4 A dielectric slab sliding into a parallel-plate capacitor. The slab fills a fraction x of the plate length.
// Choose whether the battery stays connected (V fixed) or the capacitor was charged empty and isolated (Q fixed).
// The graph shows the stored energy U(x) for that case and the readout gives C, Q, V, U and the inward force.
// Units: the empty capacitor has C0 = 1 and was charged to V0 = 1, so Q0 = 1 and U0 = 1/2; force in units of
// C0 V0² / L (L = plate length).
import { canvas, axes, line, dot, text, row, slider, choice, readout, fmt, arrow } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.85, max: 470, min: 320, label: 'A dielectric slab sliding into a capacitor, with a graph of stored energy against how far it has gone in' });
  let x = 0.4, k = 4, mode = 'battery';
  const ctl = row(host);
  slider(ctl, { label: 'Slab inside, x', min: 0, max: 1, step: 0.01, value: x, fmt: (v) => Math.round(v * 100) + '%', oninput: (v) => { x = v; upd(); } });
  slider(ctl, { label: 'Dielectric constant κ', min: 1, max: 10, step: 0.5, value: k, fmt: (v) => fmt(v, 3), oninput: (v) => { k = v; upd(); } });
  const ctl2 = row(host);
  choice(ctl2, 'Circuit', [['battery', 'Battery connected'], ['isolated', 'Isolated']], mode, (m) => { mode = m; upd(); });
  const out = readout(host);
  const Cx = (xx) => 1 + (k - 1) * xx;
  const state = (xx) => {
    const C = Cx(xx);
    if (mode === 'battery') return { C, V: 1, Q: C, U: C / 2, F: (k - 1) / 2 };
    return { C, V: 1 / C, Q: 1, U: 1 / (2 * C), F: (k - 1) / (2 * C * C) };
  };
  function upd() { cv.redraw(); const s = state(x);
    out.innerHTML = `C = <b>${fmt(s.C, 3)}</b> C₀, Q = <b>${fmt(s.Q, 3)}</b> Q₀, V = <b>${fmt(s.V, 3)}</b> V₀, U = <b>${fmt(s.U, 3)}</b> C₀V₀², inward force = <b>${fmt(s.F, 3)}</b> C₀V₀²/L. ` +
      (mode === 'battery' ? 'With the battery connected, V is fixed: the energy rises as the slab goes in, the battery supplies twice that rise, and the pull is the same at every x.' : 'Isolated, Q is fixed: the energy falls as the slab goes in (that energy does the pulling), and the pull weakens as C grows.');
  }

  cv.draw = (ctx, w, h, col) => {
    const top = h * 0.46, L = w * 0.62, x0 = (w - L) / 2, gap = top * 0.38, yT = top * 0.28, yB = yT + gap;
    const s = state(x);
    // plates
    ctx.save(); ctx.fillStyle = col.ink;
    ctx.fillRect(x0, yT - 6, L, 6); ctx.fillRect(x0, yB, L, 6); ctx.restore();
    text(ctx, '+Q', x0 - 8, yT - 3, { color: col.ink, size: 12, weight: 700, align: 'right' });
    text(ctx, '−Q', x0 - 8, yB + 3, { color: col.ink, size: 12, weight: 700, align: 'right' });
    // slab enters from the right
    const sl = x0 + L * (1 - x);
    ctx.save(); ctx.fillStyle = col.s[2]; ctx.globalAlpha = 0.35; ctx.fillRect(sl, yT + 2, L * 1.0, gap - 4); ctx.restore();
    ctx.save(); ctx.strokeStyle = col.s[2]; ctx.lineWidth = 2; ctx.strokeRect(sl, yT + 2, L, gap - 4); ctx.restore();
    text(ctx, `κ = ${fmt(k, 3)}`, Math.min(w - 40, sl + 30), yT + gap / 2, { color: col.ink, size: 12, weight: 700 });
    // field lines: same E in both parts when V is common (E = V/d)
    const n = 9;
    for (let i = 0; i < n; i++) {
      const xx = x0 + (i + 0.5) * L / n;
      arrow(ctx, xx, yT + 4, xx, yB - 4, xx < sl ? col.s[0] : col.s[0], 1.2, 6);
    }
    arrow(ctx, sl + 4, yB + 22, sl - 40, yB + 22, col.s[3], 2.5, 9);
    text(ctx, 'pulled in', sl - 44, yB + 22, { color: col.s[3], size: 11, weight: 700, align: 'right' });
    text(ctx, mode === 'battery' ? 'battery keeps V fixed' : 'isolated: Q fixed', w / 2, 12, { color: col.muted, size: 11, align: 'center' });
    // energy graph
    const ymax = mode === 'battery' ? 5.5 : 0.55;
    const g = axes(ctx, w, h, col, { x: [0, 1], y: [0, ymax], t: top + 20, xlabel: 'fraction of slab inside, x', ylabel: 'U (C₀V₀²)' });
    const pts = []; for (let i = 0; i <= 100; i++) pts.push([g.X(i / 100), g.Y(state(i / 100).U)]);
    line(ctx, pts, col.s[1], 2.5);
    dot(ctx, g.X(x), g.Y(s.U), 5, col.s[3]);
  };
  upd();
}
