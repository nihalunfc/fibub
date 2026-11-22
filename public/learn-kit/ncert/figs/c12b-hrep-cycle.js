// Class 12 Biology, Human Reproduction: the menstrual cycle. Schematic curves for FSH, LH, oestrogen and progesterone against the day of the cycle,
// with the ovarian events (follicle growth, ovulation, corpus luteum) and the uterine events (menstrual, proliferative, secretory phase) below.
// The second half (luteal phase) lasts about 14 days, so ovulation is about 14 days before the cycle ends: day 14 of a 28-day cycle; a longer cycle moves ovulation later. If the egg is fertilised
// and implants, hCG keeps the corpus luteum going, progesterone stays high and there is no menstruation. Shapes are schematic, not measured values.
import { canvas, text, title, axes, line, row, slider, choice, readout, clamp } from '../../kit.js';

export default function (host) {
  let L = 28, day = 14, preg = false;
  const cv = canvas(host, { aspect: 1.05, max: 460, min: 340, label: 'Hormone curves across a menstrual cycle with a day marker, ovary and uterus phase bars' });
  const ctl = row(host), ro = readout(host);
  const sd = slider(ctl, { label: 'day of cycle', min: 1, max: 35, step: 1, value: day, fmt: (v) => String(Math.round(v)), oninput: (v) => { day = Math.round(v); go(); } });
  slider(ctl, { label: 'cycle length (days)', min: 24, max: 35, step: 1, value: L, fmt: (v) => String(Math.round(v)), oninput: (v) => { L = Math.round(v); go(); } });
  choice(ctl, 'Egg', [[false, 'Not fertilised'], [true, 'Fertilised']], false, (v) => { preg = v; go(); });
  const G = (x, m, s) => Math.exp(-0.5 * ((x - m) / s) ** 2);
  const ov = () => L - 14;
  const FSH = (d) => 0.14 + 0.5 * G(d, 3, 3.2) + 0.32 * G(d, ov(), 1.1);
  const LH = (d) => 0.1 + 0.9 * G(d, ov() - 0.3, 0.9);
  const E2 = (d) => 0.1 + 0.8 * G(d, ov() - 1.3, 2.6) + (preg && d > ov() ? 0.5 * clamp((d - ov()) / 12, 0, 1.4) : 0.42 * G(d, ov() + 7, 3.2));
  const P4 = (d) => 0.04 + (d < ov() ? 0 : (preg ? 0.95 * clamp((d - ov() + 1) / 8, 0, 1) : 0.95 * G(d, ov() + 7, 3.4)));
  const phase = (d) => (d <= 5 && !(preg && d > ov()) ? 'menstrual' : d < ov() ? 'proliferative' : d === Math.round(ov()) ? 'ovulation' : 'secretory');
  const go = () => {
    const d = Math.min(day, preg ? 35 : L), o = ov(), ph = d <= 5 ? 'Menstrual phase: the thick uterine lining is shed with blood for about 3 to 5 days. FSH is starting to rise.' : d < o ? 'Follicular (proliferative) phase: FSH grows a follicle; the follicle makes more oestrogen, which rebuilds the uterine lining.' : d === o ? 'Ovulation: a surge of LH (helped by high oestrogen) makes the follicle burst and release the secondary oocyte.' : preg ? 'Fertilised egg implanted: hCG from the embryo keeps the corpus luteum making progesterone, so the lining stays and there is no period.' : d <= L ? 'Luteal (secretory) phase: the empty follicle becomes the corpus luteum; progesterone keeps the lining thick and ready to nourish an embryo.' : 'Cycle ends.';
    ro.textContent = `Day ${d} (ovulation about day ${o}). ${d > L && !preg ? 'The next cycle begins. ' : ''}${ph}${!preg && d > o + 8 && d <= L ? ' With no embryo the corpus luteum degenerates; hormones fall and the lining will be shed.' : ''}`;
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'The menstrual cycle', col) + 2, gh = (h - top) * 0.58, N = preg ? 35 : L;
    const A = axes(ctx, w, top + gh, col, { x: [1, N], y: [0, 1.25], t: top + 2, b: 28, l: 12, r: 10, xt: [1, 7, 14, 21, 28, 35].filter((x) => x <= N), yt: [], xlabel: 'day', fy: () => '' });
    const curve = (f, c) => { const pts = []; for (let d = 1; d <= N; d += 0.25) pts.push([A.X(d), A.Y(f(d))]); line(ctx, pts, c, 2.5); };
    curve(FSH, col.s[0]); curve(LH, col.s[3]); curve(E2, col.s[5]); curve(P4, col.s[2]);
    const X = A.X(Math.min(day, N)); line(ctx, [[X, A.T], [X, h - 8]], col.ink, 1.5, [4, 3]);
    const lg = [['FSH', col.s[0]], ['LH', col.s[3]], ['oestrogen', col.s[5]], ['progesterone', col.s[2]]]; let lx = A.L + 4; lg.forEach(([s, c]) => { text(ctx, s, lx, A.T + 8, { color: c, size: 10.5, weight: 700 }); lx += s.length * 6.2 + 14; });
    // strips
    const y1 = top + gh + 8, rh = (h - y1 - 8) / 2 - 3;
    const seg = (y, a, b, f, s) => { const x0 = A.X(a), x1 = A.X(b); ctx.fillStyle = f; ctx.fillRect(x0, y, Math.max(0, x1 - x0), rh); ctx.strokeStyle = col.panel; ctx.lineWidth = 1; ctx.strokeRect(x0, y, Math.max(0, x1 - x0), rh); if (x1 - x0 > 28) text(ctx, s, (x0 + x1) / 2, y + rh / 2, { color: col.ink, size: 10, weight: 600, align: 'center', fit: false }); };
    const o = ov();
    seg(y1 + 4, 1, o - 0.5, col.s[2] + '55', 'follicle grows'); seg(y1 + 4, o - 0.5, o + 0.5, col.s[3], 'O'); seg(y1 + 4, o + 0.5, preg ? 35 : L, preg ? col.s[4] + '88' : col.s[3] + '55', preg ? 'corpus luteum kept (hCG)' : 'corpus luteum, then fades');
    const y2 = y1 + rh + 6;
    seg(y2 + 4, 1, 5.5, col.bad + '77', 'period'); seg(y2 + 4, 5.5, o + 0.5, col.s[5] + '55', 'proliferative'); seg(y2 + 4, o + 0.5, preg ? 35 : L, col.s[4] + '66', preg ? 'secretory: no period' : 'secretory');
    if (!preg && day > L) text(ctx, 'next cycle', X, h - 6, { color: col.muted, size: 10, align: 'center' });
  };
  go();
}
