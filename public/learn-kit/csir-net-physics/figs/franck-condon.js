// 8.3 The Franck-Condon principle with a displacement slider. Two harmonic potential curves of equal frequency;
// the upper one is shifted by d (in units of the oscillator length √(ħ/μω)). A vertical arrow rises from the ground
// vibrational level, whose probability density is drawn. Bars show the Franck-Condon factors |<v'|0>|² =
// e^{-S} S^{v'}/v'! with Huang-Rhys factor S = d²/2: with no shift only the 0-0 band appears; a larger shift
// spreads the intensity into a long progression that peaks near v' = S.
import { canvas, line, row, slider, readout, title, text, fmt, arrow } from '../../kit.js';

const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1));
export default function (host) {
  const cv = canvas(host, { aspect: 0.66, max: 420, min: 280, label: 'Two displaced potential curves and the Franck-Condon factors of the vibrational bands' });
  let d = 1.5;
  const ctl = row(host);
  slider(ctl, { label: 'Displacement of upper curve d', min: 0, max: 4, step: 0.05, value: d, fmt: (v) => v.toFixed(2), oninput: (v) => { d = v; redo(); } });
  const out = readout(host);
  const q = (S, v) => Math.exp(-S) * S ** v / fact(v);
  const show = () => {
    const S = d * d / 2; let best = 0; for (let v = 1; v < 16; v++) if (q(S, v) > q(S, best)) best = v;
    out.innerHTML = `Huang-Rhys factor S = d²/2 = <b>${fmt(S, 3)}</b>. 0-0 band: <b>${fmt(q(S, 0), 3)}</b> of the total; strongest band <b>${best} ← 0</b> (${fmt(q(S, best), 3)}). The bars add up to 1: moving the curve redistributes intensity, it does not create it.`;
  };
  const redo = () => { cv.redraw(); show(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Vertical transitions between displaced curves', col);
    const half = Math.round(w * 0.55);
    // left: potentials in units: x in oscillator lengths, energy in ħω
    const L = 14, R = half - 8, T = top + 8, Bt = h - 22;
    const xmin = -3.5, xmax = 7.5, emax = 16;
    const X = (x) => L + (x - xmin) / (xmax - xmin) * (R - L), Y = (e) => Bt - e / emax * (Bt - T);
    const gap = 8;
    const lower = [], upper = [];
    for (let i = 0; i <= 200; i++) { const x = xmin + (xmax - xmin) * i / 200; const e1 = 0.5 * x * x, e2 = gap + 0.5 * (x - d) ** 2; if (e1 < gap - 0.5) lower.push([X(x), Y(e1)]); if (e2 < emax) upper.push([X(x), Y(e2)]); }
    line(ctx, lower, col.s[1], 2.2); line(ctx, upper, col.s[0], 2.2);
    for (let v = 0; v < 8; v++) { const e = gap + v + 0.5, xr = Math.sqrt(2 * (v + 0.5)); if (e < emax) line(ctx, [[X(d - xr), Y(e)], [X(d + xr), Y(e)]], col.line, 1); }
    line(ctx, [[X(-1), Y(0.5)], [X(1), Y(0.5)]], col.s[1], 1.2);
    const psi = []; for (let i = 0; i <= 80; i++) { const x = -2.5 + 5 * i / 80; psi.push([X(x), Y(0.5) - Math.exp(-x * x) * (Bt - T) * 0.12]); }
    line(ctx, psi, col.s[1], 1.5);
    arrow(ctx, X(0), Y(0.5), X(0), Y(gap + 0.5 * d * d), col.s[3], 2);
    text(ctx, 'ground state', X(1.2), Y(1.3), { color: col.s[1], size: 11 });
    text(ctx, 'excited state', X(d + 0.4), Y(emax - 1), { color: col.s[0], size: 11 });
    text(ctx, 'internuclear distance →', R, h - 8, { color: col.muted, size: 10, align: 'right' });
    // right: bars
    const S = d * d / 2, L2 = half + 18, R2 = w - 12, B2 = h - 30, T2 = top + 24, nb = 12, bw = (R2 - L2) / nb;
    line(ctx, [[L2, B2], [R2, B2]], col.muted, 1);
    for (let v = 0; v < nb; v++) {
      const f = q(S, v), x = L2 + v * bw;
      ctx.fillStyle = col.s[0]; ctx.fillRect(x + 2, B2 - f * (B2 - T2), bw - 4, f * (B2 - T2));
      if (v % 2 === 0 || bw > 18) text(ctx, String(v), x + bw / 2, B2 + 10, { color: col.muted, size: 10, align: 'center' });
    }
    text(ctx, "Franck-Condon factor, band v' ← 0", (L2 + R2) / 2, T2 - 10, { color: col.ink, size: 11, align: 'center' });
    text(ctx, "v'", R2, h - 8, { color: col.muted, size: 10, align: 'right' });
  };
  redo();
}
