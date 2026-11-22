// Biotechnology principles: PCR doubles the target DNA every cycle (denature, anneal, extend). Choose the number of
// cycles and the starting copies; the plot shows copies on a log scale (ideal doubling; real runs level off as
// primers and nucleotides run out). The strip shows one cycle's three temperatures.
import { canvas, axes, line, dot, text, row, slider, choice, readout, fmt } from '../../kit.js';

export default function (host) {
  let n = 20, start = 1;
  const cv = canvas(host, { aspect: 0.62, max: 360, min: 260, mark: 'tl', label: 'DNA copies doubling with each PCR cycle, on a log scale' });
  const ctl = row(host);
  slider(ctl, { label: 'Cycles', min: 0, max: 35, step: 1, value: n, fmt: (v) => `${v}`, oninput: (v) => { n = v; cv.redraw(); show(); } });
  choice(ctl, 'Start', [[1, '1 copy'], [10, '10'], [1000, '1000']], start, (v) => { start = v; cv.redraw(); show(); });
  const out = readout(host);
  const show = () => { out.innerHTML = `${start} × 2<sup>${n}</sup> = <b>${fmt(start * 2 ** n, 3)} copies</b> (ideal). Each cycle: <b>denaturation</b> at about 94 °C separates the strands, <b>annealing</b> at about 50 to 60 °C lets the two primers bind, <b>extension</b> at about 72 °C lets Taq polymerase copy from each primer.`; };
  cv.draw = (ctx, w, h, col) => {
    const strip = 34;
    const { X, Y } = axes(ctx, w, h - strip, col, { x: [0, 35], y: [1, 1e14], ylog: true, yt: [1, 1e3, 1e6, 1e9, 1e12], xlabel: 'Cycle', ylabel: 'Copies', l: 52, t: 32, fy: (v) => fmt(v, 1) });
    const pts = []; for (let c = 0; c <= 35; c++) pts.push([X(c), Y(Math.min(1e14, start * 2 ** c))]);
    line(ctx, pts, col.s[0], 2.5);
    dot(ctx, X(n), Y(Math.min(1e14, start * 2 ** n)), 6, col.s[0], col.panel);
    // one cycle strip
    const y0 = h - strip + 6, segs = [['94 °C denature', col.s[1]], ['~55 °C anneal', col.s[2]], ['72 °C extend', col.s[3]]], sw = (w - 20) / 3;
    segs.forEach(([lab, c], i) => {
      ctx.fillStyle = c; ctx.globalAlpha = 0.18; ctx.fillRect(10 + i * sw, y0, sw - 4, strip - 10); ctx.globalAlpha = 1;
      ctx.strokeStyle = c; ctx.strokeRect(10 + i * sw, y0, sw - 4, strip - 10);
      text(ctx, lab, 10 + i * sw + (sw - 4) / 2, y0 + (strip - 10) / 2, { color: col.ink, size: w < 400 ? 9.5 : 11, align: 'center' });
    });
  };
  cv.redraw(); show();
}
