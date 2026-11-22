// Human reproduction: the menstrual cycle. Relative levels of the pituitary hormones (LH, FSH) and the ovarian
// hormones (estrogen, progesterone) across one cycle, with the menstrual days shaded. Ovulation falls about 14 days before
// the next period, so a longer cycle stretches the follicular phase, not the luteal phase. Curves are schematic
// (shapes, not measured values).
import { canvas, axes, line, text, row, slider, choice, readout } from '../../kit.js';

const g = (x, m, s) => Math.exp(-((x - m) ** 2) / (2 * s * s));
export default function (host) {
  let L = 28, day = 14;
  const cv = canvas(host, { aspect: 0.6, max: 360, min: 250, mark: 'bl', label: 'Hormone levels and phases across one menstrual cycle' });
  const ctl = row(host);
  const sd = slider(ctl, { label: 'Day', min: 1, max: 28, step: 1, value: day, fmt: (v) => `day ${v}`, oninput: (v) => { day = v; cv.redraw(); show(); } });
  choice(ctl, 'Cycle', [[24, '24 days'], [28, '28 days'], [32, '32 days']], L, (v) => {
    L = v; day = Math.min(day, L);
    const inp = host.querySelector('input[type=range]'); inp.max = L; sd.set(day);
    cv.redraw(); show();
  });
  const out = readout(host);
  const ov = () => L - 14;
  const H = {
    LH: (x) => 0.12 + 0.88 * g(x, ov(), 0.9),
    FSH: (x) => 0.18 + 0.18 * g(x, 3, 3) + 0.32 * g(x, ov(), 1),
    Estrogen: (x) => 0.1 + 0.75 * g(x, ov() - 1.5, 2.2) + 0.35 * g(x, ov() + 7, 2.8),
    Progesterone: (x) => 0.05 + 0.85 * g(x, ov() + 7, 3),
  };
  const phase = (d) => (d <= 5 ? ['Menstrual phase', 'the endometrium breaks down and bleeds because progesterone has fallen; it lasts 3 to 5 days']
    : d < ov() ? ['Follicular (proliferative) phase', 'FSH and LH make a primary follicle grow into a Graafian follicle, which secretes estrogen; estrogen rebuilds the endometrium']
    : d === ov() ? ['Ovulation', 'the LH surge (with a smaller FSH rise) bursts the Graafian follicle and releases the secondary oocyte']
    : ['Luteal (secretory) phase', 'the empty follicle becomes the corpus luteum, which secretes progesterone to keep the endometrium ready for implantation; with no pregnancy it degenerates and progesterone falls']);
  const show = () => { const [p, t] = phase(day); out.innerHTML = `<b>Day ${day} of ${L}: ${p}.</b> ${t}. Ovulation is about day ${ov()} (14 days before the next period).`; };
  cv.draw = (ctx, w, h, col) => {
    const { X, Y, T, B } = axes(ctx, w, h, col, { x: [1, L], y: [0, 1.15], yt: [], xt: [1, 5, ov(), L], xlabel: 'Day of cycle', ylabel: 'Relative level', l: 30, b: 40 });
    ctx.fillStyle = col.soft; ctx.fillRect(X(1), T, X(5) - X(1), B - T);
    text(ctx, 'menses', (X(1) + X(5)) / 2, T + 10, { color: col.muted, size: 10, align: 'center' });
    Object.entries(H).forEach(([k, f], i) => {
      const pts = []; for (let x = 1; x <= L; x += 0.2) pts.push([X(x), Y(f(x))]);
      line(ctx, pts, col.s[i], 2.5, i === 3 ? [6, 4] : undefined);
      text(ctx, k, X(1) + 6 + i * Math.min(90, (w - 60) / 4), T - 8, { color: col.s[i], size: 11, weight: 600 });
    });
    ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(X(day), T); ctx.lineTo(X(day), B); ctx.stroke();
  };
  cv.redraw(); show();
}
