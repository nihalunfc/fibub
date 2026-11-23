// Class 11 Biomolecules: enzyme rate against substrate concentration, v = Vmax [S] / (Km + [S]) (Michaelis-Menten). At low [S] the rate rises almost in proportion; at high [S] every enzyme
// is busy and the rate levels off at Vmax. Km is the [S] at half Vmax. A competitive inhibitor raises Km (apparent) without changing Vmax; a non-competitive inhibitor lowers Vmax.
import { canvas, text, title, row, slider, choice, readout, axes, line, dot } from '../../kit.js';

export default function (host) {
  let S = 2, kind = 'none', I = 1;
  const Vm = 100, Km = 2, Ki = 1;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'Rate of an enzyme reaction against substrate concentration with a marker, with and without an inhibitor' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'Substrate [S]', min: 0, max: 10, step: 0.1, value: S, fmt: (v) => v.toFixed(1) + ' mM', oninput: (v) => { S = v; go(); } });
  choice(ctl, 'Inhibitor', [['none', 'None'], ['comp', 'Competitive'], ['non', 'Non-competitive']], kind, (v) => { kind = v; go(); });
  slider(ctl, { label: 'Inhibitor [I]', min: 0, max: 4, step: 0.1, value: I, fmt: (v) => v.toFixed(1) + ' mM', oninput: (v) => { I = v; go(); } });
  const par = () => kind === 'comp' ? [Vm, Km * (1 + I / Ki)] : kind === 'non' ? [Vm / (1 + I / Ki), Km] : [Vm, Km];
  const rate = (s) => { const [v, k] = par(); return v * s / (k + s); };
  const go = () => { const [v, k] = par(); ro.textContent = `[S] = ${S.toFixed(1)} mM gives v = ${rate(S).toFixed(1)} units, ${(100 * rate(S) / v).toFixed(0)} % of this curve's Vmax (${v.toFixed(0)}). Km = ${k.toFixed(1)} mM. ${kind === 'comp' ? 'The inhibitor competes for the active site: more substrate beats it, so Vmax is reached but only at a higher [S].' : kind === 'non' ? 'The inhibitor binds elsewhere and spoils the enzyme: even a lot of substrate cannot recover the lost Vmax.' : 'With no inhibitor: Vmax = 100 and Km = 2 mM.'}`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, 'Michaelis-Menten curve: v = Vmax·[S] / (Km + [S])', col);
    const A = axes(ctx, w, h, col, { x: [0, 10], y: [0, 110], xlabel: 'substrate concentration [S] (mM)', ylabel: 'rate v', l: 50, t: t0 + 8, b: 40, xt: [0, 2, 4, 6, 8, 10], yt: [0, 25, 50, 75, 100] });
    const mk = (f, c, lw, dash) => { const p = []; for (let k = 0; k <= 80; k++) { const s = 10 * k / 80; p.push([A.X(s), A.Y(f(s))]); } line(ctx, p, c, lw, dash); };
    mk((s) => Vm * s / (Km + s), col.muted, 2, [5, 3]);
    mk(rate, col.s[0], 3);
    const [v, k] = par(); ctx.save(); ctx.strokeStyle = col.s[2]; ctx.lineWidth = 1.3; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(A.L, A.Y(v)); ctx.lineTo(A.R, A.Y(v)); ctx.moveTo(A.L, A.Y(v / 2)); ctx.lineTo(A.X(k), A.Y(v / 2)); ctx.lineTo(A.X(k), A.B); ctx.stroke(); ctx.restore();
    text(ctx, 'Vmax', A.R - 4, A.Y(v) - 8, { color: col.s[2], size: 10.5, weight: 700, align: 'right', fit: false }); text(ctx, 'Vmax/2', A.L + 4, A.Y(v / 2) - 8, { color: col.s[2], size: 10, weight: 700, fit: false }); text(ctx, 'Km', A.X(k), A.B - 8, { color: col.s[2], size: 10.5, weight: 700, align: 'center', fit: false, halo: col.panel });
    dot(ctx, A.X(S), A.Y(rate(S)), 6, col.s[3], col.panel); text(ctx, 'grey dashes = no inhibitor', A.R - 4, A.B - 24, { color: col.muted, size: 10, align: 'right', fit: false });
  };
  go();
}
