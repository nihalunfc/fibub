// 3.8 Rectangular waveguide modes. Top: the ladder of cutoff frequencies (in units of c/2a) for a guide of aspect
// ratio b/a, with the operating frequency as a line: modes left of it propagate. Bottom: the transverse electric
// field of the chosen mode in the cross-section (arrows), from E_t ∝ ∇_t H_z × ẑ for TE and ∇_t E_z for TM.
import { canvas, axes, line, text, arrow, row, slider, choice, readout, fmt, title } from '../../kit.js';

const MODES = [['TE10', 'TE', 1, 0], ['TE20', 'TE', 2, 0], ['TE01', 'TE', 0, 1], ['TE11', 'TE', 1, 1], ['TM11', 'TM', 1, 1], ['TM21', 'TM', 2, 1]];

export default function (host) {
  const cv = canvas(host, { aspect: 0.95, max: 520, min: 360, label: 'Cutoff frequencies of rectangular waveguide modes and the field pattern of the chosen mode' });
  let ba = 0.45, f = 1.6, sel = 'TE10';
  const ctl = row(host), ctl2 = row(host);
  slider(ctl, { label: 'Aspect b/a', min: 0.2, max: 1, step: 0.01, value: ba, fmt: (v) => fmt(v, 2), oninput: (v) => { ba = v; upd(); } });
  slider(ctl, { label: 'Frequency f/(c/2a)', min: 0.5, max: 4, step: 0.01, value: f, fmt: (v) => fmt(v, 3), oninput: (v) => { f = v; upd(); } });
  choice(ctl2, 'Field of', MODES.map((m) => [m[0], m[0].replace(/(\d+)/, '$1')]), sel, (v) => { sel = v; upd(); });
  const out = readout(host);
  const cutoffs = () => { const L = []; for (let m = 0; m < 6; m++) for (let n = 0; n < 6; n++) { if (!m && !n) continue; const fc = Math.hypot(m, n / ba); if (fc > 4.2) continue; L.push([`TE${m}${n}`, fc]); if (m && n) L.push([`TM${m}${n}`, fc]); } return L.sort((a, b) => a[1] - b[1]); };
  const upd = () => {
    const L = cutoffs(), on = L.filter((m) => m[1] < f), M = MODES.find((m) => m[0] === sel), fc = Math.hypot(M[2], M[3] / ba);
    out.innerHTML = `At f = ${fmt(f, 3)} c/2a, ${on.length ? `<b>${on.length}</b> mode${on.length > 1 ? 's' : ''} propagate: ${on.map((m) => m[0]).join(', ')}` : 'nothing propagates (below the TE10 cutoff)'}. ${sel} has cutoff ${fmt(fc, 3)} c/2a${f > fc ? `; v<sub>g</sub> = ${fmt(Math.sqrt(1 - (fc / f) ** 2), 3)} c, guide wavelength ${fmt(1 / Math.sqrt(1 - (fc / f) ** 2), 3)} λ.` : ': below cutoff here (evanescent).'}`;
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const top = h * 0.42;
    title(ctx, 'Cutoff ladder and transverse E field', col);
    const L = cutoffs();
    const ax = axes(ctx, w, top + 10, col, { x: [0, 4.2], y: [0, 1], t: 40, b: 30, yt: [], grid: false, xlabel: '', ylabel: '' });
    text(ctx, 'f / (c/2a)', ax.R - 4, ax.B + 22, { color: col.muted, size: 11, align: 'right' });
    const used = [];
    L.forEach(([nm, fc]) => {
      const X = ax.X(fc); let lev = 0; while (used.some((u) => u[0] === lev && Math.abs(u[1] - X) < 34)) lev++; used.push([lev, X]);
      const y = ax.B - 10 - lev * 14, c2 = fc < f ? col.s[0] : col.muted;
      line(ctx, [[X, ax.B], [X, y + 5]], c2, 1);
      text(ctx, nm, X, y, { color: c2, size: 10, align: 'center', weight: fc < f ? 700 : 400 });
    });
    line(ctx, [[ax.X(f), ax.T], [ax.X(f), ax.B]], col.s[1], 2.5);
    text(ctx, 'operating f', ax.X(f) + 5, ax.T + 4, { color: col.s[1], size: 11, halo: col.panel });
    // cross-section
    const M = MODES.find((m) => m[0] === sel), [, kind, m, n] = M;
    const boxW = Math.min(w - 40, (h - top - 40) / ba), boxH = boxW * ba, x0 = (w - boxW) / 2, y0 = top + 26;
    ctx.save(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(x0, y0, boxW, boxH); ctx.restore();
    text(ctx, `${sel}: a across, b up`, x0, y0 - 10, { color: col.ink, size: 11, weight: 700 });
    const NX = 14, NY = Math.max(4, Math.round(NX * ba)), field = (u, v) => {
      const a = 1, b = ba, X = Math.PI * m / a, Y = Math.PI * n / b;
      if (kind === 'TE') return [Y * Math.cos(X * u) * Math.sin(Y * v), -X * Math.sin(X * u) * Math.cos(Y * v)];
      return [X * Math.cos(X * u) * Math.sin(Y * v), Y * Math.sin(X * u) * Math.cos(Y * v)];
    };
    let mx = 1e-9; const pts = [];
    for (let i = 0; i < NX; i++) for (let j = 0; j < NY; j++) { const u = (i + 0.5) / NX, v = ((j + 0.5) / NY) * ba, E = field(u, v); pts.push([u, v, E]); mx = Math.max(mx, Math.hypot(E[0], E[1])); }
    const cell = boxW / NX;
    for (const [u, v, E] of pts) {
      const s = Math.hypot(E[0], E[1]) / mx; if (s < 0.06) continue;
      const cx = x0 + u * boxW, cy = y0 + boxH - (v / ba) * boxH, L2 = 0.45 * cell * s, ux = E[0] / (s * mx), uy = E[1] / (s * mx);
      arrow(ctx, cx - ux * L2, cy + uy * L2, cx + ux * L2, cy - uy * L2, col.s[0], 1.6, 5);
    }
  };
  upd();
}
