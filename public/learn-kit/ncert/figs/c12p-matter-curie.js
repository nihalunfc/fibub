// Class 12 Magnetism and Matter: temperature and magnetism. In a paramagnet the atomic moments are shaken about by heat, so the fraction lined up
// with a weak field falls as T rises: Curie's law, χ = C/T. A ferromagnet (iron, Curie temperature 1043 K) keeps its domains ordered below T_c, with the order fading as
// T → T_c, and above T_c it is just a paramagnet (χ = C/(T − Tc)).
import { canvas, text, title, row, slider, choice, readout, arrow, axes, line, dot, loop, rng } from '../../kit.js';

export default function (host) {
  let T = 300, kind = 'para', t = 0;
  const Tc = 1043, N = 40, R = rng(3), u = Array.from({ length: N }, () => R()), ph = Array.from({ length: N }, () => R() * 6.28);
  const cv = canvas(host, { aspect: 1.0, max: 440, min: 330, label: 'Atomic magnets lining up or not as the temperature changes' });
  const ctl = row(host);
  slider(ctl, { label: 'Temperature T', min: 100, max: 1500, step: 10, value: T, fmt: (x) => `${x} K`, oninput: (x) => { T = x; } });
  choice(ctl, 'Material', [['para', 'Paramagnet (weak field)'], ['ferro', 'Iron (ferromagnet)']], kind, (x) => { kind = x; });
  const out = readout(host);
  loop(host, (dt) => { t += dt; cv.redraw(); });
  const frac = (Tk) => { if (kind === 'ferro' && Tk < Tc) return Math.sqrt(1 - Tk / Tc); const x = 2.2e2 / Math.max(1, kind === 'ferro' ? Tk - Tc : Tk); return Math.tanh(x * 0.5); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, kind === 'para' ? 'Heat shakes the moments out of line: χ = C/T' : 'Order fades as T → Tc, then it is a paramagnet', col);
    const f = frac(T), ht = h * 0.46, gx = 16, gw = w - 32, cw = gw / 10, ch = (ht - top - 6) / 4;
    for (let i = 0; i < N; i++) { const x = gx + (i % 10) * cw + cw / 2, y = top + 6 + Math.floor(i / 10) * ch + ch / 2, up = u[i] < (1 + f) / 2, wob = 0.2 + 1.6 * Math.min(1, T / 1300), a = (up ? 0 : Math.PI) + Math.sin(t * 3 + ph[i]) * wob; arrow(ctx, x - Math.cos(a) * 9, y + Math.sin(a) * 9, x + Math.cos(a) * 9, y - Math.sin(a) * 9, up ? col.s[1] : col.s[0], 2, 7); }
    text(ctx, 'weak field points →', w - 8, top + ht - top - 2, { color: col.muted, size: 10, align: 'right' });
    const g = axes(ctx, w, h, col, { x: [100, 1500], y: [0, 1.05], t: ht + 10, b: 34, l: 52, r: 14, xt: [100, 500, 1000, 1500], yt: [0, 0.5, 1], fx: (v) => v, fy: (v) => v, xlabel: 'temperature T (K)' });
    text(ctx, kind === 'para' ? 'χ (relative)' : 'order M / Ms', g.L + 6, g.T + 8, { color: col.muted, size: 10.5 });
    ctx.save(); ctx.beginPath(); ctx.rect(g.L, g.T, g.R - g.L, g.B - g.T); ctx.clip(); ctx.strokeStyle = col.s[1]; ctx.lineWidth = 2.5; ctx.beginPath();
    const val = (Tk) => (kind === 'para' ? 100 / Tk * 1 / 1 * 1 : frac(Tk) * (Tk < Tc ? 1 : 1)); const yv = (Tk) => (kind === 'para' ? Math.min(1, 100 / Tk) : (Tk < Tc ? Math.sqrt(1 - Tk / Tc) : Math.min(0.2, 22 / (Tk - Tc + 40))));
    for (let k = 0; k <= 140; k++) { const x = 100 + k * 10, X = g.X(x), Y = g.Y(yv(x)); k ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); } ctx.stroke(); ctx.restore();
    if (kind === 'ferro') { line(ctx, [[g.X(Tc), g.T], [g.X(Tc), g.B]], col.muted, 1, [4, 4]); text(ctx, 'Tc = 1043 K', g.X(Tc) + 4, g.T + 12, { color: col.muted, size: 10.5 }); }
    dot(ctx, g.X(T), g.Y(yv(T)), 6, col.s[3], col.ink);
    out.innerHTML = kind === 'para' ? `At ${T} K, ${(((1 + f) / 2) * 100).toFixed(0)}% of the moments point along the field. Triple the temperature and the response χ falls to a third: χ = C/T (Curie's law). Cool it and more line up.` : T < Tc ? `Below Tc (${T} K): the domains stay ordered, M is ${(f * 100).toFixed(0)}% of its low-temperature value. Heat it to 1043 K and the iron loses its ferromagnetism.` : `Above Tc (${T} K): thermal motion wins, the domains are gone and iron is only a paramagnet, χ = C/(T − Tc). Cool it below Tc and it becomes a magnet again.`;
  };
  cv.redraw();
}
