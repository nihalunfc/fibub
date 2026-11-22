// Class 12 Biology, Reproductive Health: why the combined contraceptive pill stops ovulation. A normal cycle needs the mid-cycle LH surge. Steady
// hormones from the pill (oestrogen and progestogen) keep FSH and LH low all month, so no follicle ripens and no egg is released; the cervical
// mucus thickens and the lining stays thin. The week off the pill lets the lining shed as a withdrawal bleed. Schematic curves.
import { canvas, text, title, axes, line, row, choice, readout } from '../../kit.js';

export default function (host) {
  let pill = false;
  const cv = canvas(host, { aspect: 0.78, max: 440, min: 290, label: 'Hormone curves across 28 days with and without the contraceptive pill' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Cycle', [[false, 'No pill'], [true, 'With the pill']], false, (v) => { pill = v; go(); });
  const G = (x, m, s) => Math.exp(-0.5 * ((x - m) / s) ** 2);
  const FSH = (d) => (pill ? 0.12 : 0.14 + 0.5 * G(d, 3, 3.2) + 0.32 * G(d, 14, 1.1)), LH = (d) => (pill ? 0.1 : 0.1 + 0.9 * G(d, 13.7, 0.9)), HOR = (d) => (d <= 21 ? 0.55 : 0.08);
  const go = () => { ro.textContent = pill ? 'With the pill: the pill hormones are steady for 21 days, which keeps FSH and LH low. There is no LH surge, so no ovulation. The 7 pill-free days (or dummy pills) let the lining shed as a withdrawal bleed.' : 'Without the pill: FSH grows a follicle, then a sudden LH surge triggers ovulation on about day 14.'; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, pill ? 'Pill cycle: no LH surge, no ovulation' : 'Natural cycle: LH surge, ovulation', col) + 2;
    const A = axes(ctx, w, h, col, { x: [1, 28], y: [0, 1.15], t: top + 6, l: 12, b: 36, xt: [1, 7, 14, 21, 28], yt: [], xlabel: 'day of cycle' });
    const c = (f, cc, wd = 2.5) => { const p = []; for (let d = 1; d <= 28; d += 0.25) p.push([A.X(d), A.Y(f(d))]); line(ctx, p, cc, wd); };
    c(FSH, col.s[0]); c(LH, col.s[3]); if (pill) c(HOR, col.s[5], 3);
    text(ctx, 'FSH', A.L + 4, A.T + 8, { color: col.s[0], size: 10.5, weight: 700 }); text(ctx, 'LH', A.L + 38, A.T + 8, { color: col.s[3], size: 10.5, weight: 700 }); if (pill) text(ctx, 'pill hormones', A.L + 66, A.T + 8, { color: col.s[5], size: 10.5, weight: 700 });
    if (!pill) { line(ctx, [[A.X(14), A.T + 18], [A.X(14), A.B]], col.muted, 1, [4, 3]); text(ctx, 'ovulation', A.X(14) + 4, A.T + 26, { color: col.ink, size: 10.5, weight: 700 }); }
    else { text(ctx, 'no ovulation', (A.L + A.R) / 2, A.T + 34, { color: col.ink, size: 11, weight: 700, align: 'center' }); ctx.fillStyle = col.bad + '55'; ctx.fillRect(A.X(21.5), A.B - 10, A.X(28) - A.X(21.5), 10); text(ctx, 'bleed', A.X(25), A.B - 22, { color: col.bad, size: 10, align: 'center' }); }
  };
  go();
}
