// Class 11 Kinetic Theory (step player): degrees of freedom and the law of equipartition. Each quadratic way a molecule can store energy
// (translation along x, y, z; rotation about an axis; vibration counts twice: kinetic and potential) holds 1/2 kT on average.
// Mean energy f kT/2, so Cv = f R/2, Cp = Cv + R, gamma = 1 + 2/f. Monatomic f=3 (gamma 5/3), rigid diatomic f=5 (7/5), diatomic with vibration f=7 (9/7),
// nonlinear rigid triatomic like water vapour f=6 (4/3). The molecule is animated in the box; the squares below count the half-kT shares.
import { canvas, text, title, line, loop } from '../../kit.js';

const INFO = [
  { n: 'Monatomic (He, Ar)', f: 3, parts: ['t', 't', 't'], cv: '3/2', g: '5/3' },
  { n: 'Diatomic, rigid (N₂, O₂ at room T)', f: 5, parts: ['t', 't', 't', 'r', 'r'], cv: '5/2', g: '7/5' },
  { n: 'Diatomic at high T (vibrating)', f: 7, parts: ['t', 't', 't', 'r', 'r', 'v', 'v'], cv: '7/2', g: '9/7' },
  { n: 'Nonlinear triatomic (H₂O vapour)', f: 6, parts: ['t', 't', 't', 'r', 'r', 'r'], cv: '3', g: '4/3' },
];
export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 290, label: 'A molecule moving, spinning and vibrating, with its shares of energy counted' });
  const anim = loop(host, (dt) => { t += dt; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const I = INFO[step], top = title(ctx, I.n, col);
    const bx = 14, by = top + 6, bw = w - 28, bh = h * 0.46;
    ctx.fillStyle = col.soft; ctx.fillRect(bx, by, bw, bh); ctx.strokeStyle = col.line; ctx.lineWidth = 1.5; ctx.strokeRect(bx, by, bw, bh);
    const cx = bx + bw / 2 + Math.sin(t * 0.9) * bw * 0.25, cy = by + bh / 2 + Math.sin(t * 1.3 + 1) * bh * 0.22, rot = t * (step === 0 ? 0 : 2.2);
    const atom = (x, y, r, c) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); ctx.strokeStyle = col.ink; ctx.lineWidth = 1; ctx.stroke(); };
    const bond = (a, b) => line(ctx, [a, b], col.ink, 3);
    if (step === 0) atom(cx, cy, 11, col.s[0]);
    else if (step === 1 || step === 2) { const d = (step === 2 ? 20 + Math.sin(t * 9) * 6 : 20), dx = Math.cos(rot) * d, dy = Math.sin(rot) * d; bond([cx - dx, cy - dy], [cx + dx, cy + dy]); atom(cx - dx, cy - dy, 9, col.s[0]); atom(cx + dx, cy + dy, 9, col.s[0]); }
    else { const a = 24, p = [[0, -8], [-a * Math.cos(0.9), a * Math.sin(0.9)], [a * Math.cos(0.9), a * Math.sin(0.9)]].map(([x, y]) => [cx + x * Math.cos(rot) - y * Math.sin(rot), cy + x * Math.sin(rot) + y * Math.cos(rot)]); bond(p[0], p[1]); bond(p[0], p[2]); atom(p[0][0], p[0][1], 10, col.s[2]); atom(p[1][0], p[1][1], 6, col.s[0]); atom(p[2][0], p[2][1], 6, col.s[0]); }
    text(ctx, 'moves along x, y, z', bx + 8, by + 12, { color: col.s[0], size: 10.5, weight: 700 });
    if (step > 0) text(ctx, step === 3 ? 'spins about 3 axes' : 'spins about 2 axes', bx + 8, by + 27, { color: col.s[1], size: 10.5, weight: 700 });
    if (step === 2) text(ctx, 'bond stretches (kinetic + potential)', bx + 8, by + 42, { color: col.s[3], size: 10.5, weight: 700 });
    // squares: one per quadratic term, each holds kT/2
    const sq = Math.min(34, (w - 40) / 7 - 4), y0 = by + bh + 16, x0 = w / 2 - (I.parts.length * (sq + 4)) / 2 + 2;
    const cc = { t: col.s[0], r: col.s[1], v: col.s[3] };
    I.parts.forEach((p, i) => { ctx.fillStyle = cc[p]; ctx.globalAlpha = 0.85; ctx.fillRect(x0 + i * (sq + 4), y0, sq, sq); ctx.globalAlpha = 1; text(ctx, '½kT', x0 + i * (sq + 4) + sq / 2, y0 + sq / 2, { color: col.panel, size: Math.min(10.5, sq / 3 + 1), weight: 700, align: 'center' }); });
    text(ctx, `f = ${I.f} shares of ½kT each, energy per molecule = ${I.f}/2 kT`, w / 2, y0 + sq + 16, { color: col.ink, size: 12, weight: 700, align: 'center' });
    text(ctx, `Cv = ${I.cv} R,  Cp = Cv + R,  γ = 1 + 2/f = ${I.g}`, w / 2, y0 + sq + 36, { color: col.muted, size: 12, align: 'center' });
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 3); cv.redraw(); } };
}
