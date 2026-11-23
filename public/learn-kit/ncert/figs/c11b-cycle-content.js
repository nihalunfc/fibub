// Class 11 Cell Cycle: chromosome number, chromatids and DNA amount through mitosis and meiosis for a cell with 2n chromosomes (2C DNA in G1). Slide through the stages. Mitosis keeps 2n and
// 2C in both daughters. Meiosis halves the chromosome number at meiosis I (to n) and the DNA to C after meiosis II, giving four haploid cells.
import { canvas, text, title, row, slider, choice, readout, axes, line, dot } from '../../kit.js';

// [stage, chromosomes counted in ONE cell, DNA (C) in ONE cell, chromatids in one cell as multiple of chromosomes]
const MIT = [['G1', 1, 2], ['S', 1, 3], ['G2', 1, 4], ['Prophase', 1, 4], ['Metaphase', 1, 4], ['Anaphase', 2, 4], ['Telophase / cytokinesis', 1, 2]];
const MEI = [['G1', 1, 2], ['S', 1, 3], ['G2', 1, 4], ['Prophase I', 1, 4], ['Metaphase I', 1, 4], ['Anaphase I', 1, 4], ['After meiosis I', 0.5, 2], ['Metaphase II', 0.5, 2], ['Anaphase II', 1, 2], ['After meiosis II', 0.5, 1]];
export default function (host) {
  let kind = 'mit', i = 4, N = 46;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'DNA content and chromosome number at each stage of mitosis or meiosis' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Division', [['mit', 'Mitosis'], ['mei', 'Meiosis']], kind, (v) => { kind = v; i = Math.min(i, S().length - 1); st.set(i); st.max = S().length - 1; go(); });
  const S = () => (kind === 'mit' ? MIT : MEI);
  const st = slider(ctl, { label: 'Stage (step through)', min: 0, max: 9, step: 1, value: i, fmt: (v) => S()[Math.min(Math.round(v), S().length - 1)][0], oninput: (v) => { i = Math.min(Math.round(v), S().length - 1); go(); } });
  slider(ctl, { label: 'Chromosomes in the body cell, 2n', min: 4, max: 46, step: 2, value: N, fmt: (v) => String(Math.round(v)), oninput: (v) => { N = Math.round(v); go(); } });
  const go = () => {
    const [n, k, c] = S()[i], ch = (kind === 'mit' ? (i === 0 ? 1 : i < 2 ? 1 : i < 6 ? 2 : 1) : (i < 1 ? 1 : i < 3 ? 1.5 : i < 8 ? 2 : i < 9 ? 1 : 1)) ;
    const chr = N * k, chromatids = kind === 'mit' ? (i <= 0 ? N : i === 1 ? '1 → 2 per chromosome' : i <= 4 ? 2 * N : i === 5 ? 2 * N : N) : (i === 0 ? N : i === 1 ? '1 → 2 per chromosome' : i <= 5 ? 2 * N : i <= 7 ? N : i === 8 ? N : N / 2);
    ro.textContent = `${n}: chromosomes counted in one cell = ${chr}, DNA = ${c === 3 ? '2C → 4C (copying)' : c + 'C'}, chromatids = ${chromatids}. ${n.startsWith('Anaphase') && kind === 'mit' ? 'Centromeres split, so the chromosome count doubles for a moment (4n) before the cell divides.' : n === 'After meiosis I' ? 'Homologous pairs separated: n chromosomes, each still with two chromatids.' : ''}`;
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const L = S(), t0 = title(ctx, kind === 'mit' ? 'Mitosis: 2n → 2n, 2C → 2C' : 'Meiosis: 2n → n, 2C → C', col);
    const A = axes(ctx, w, h, col, { x: [0, L.length - 1], y: [0, 4.6], ylabel: 'DNA per cell (C)', l: 52, t: t0 + 8, b: 70, xt: L.map((_, k) => k), yt: [0, 1, 2, 3, 4], fx: () => '' });
    const pts = []; L.forEach(([n, k, c], j) => { const y = c === 3 ? 3 : c; pts.push([A.X(j), A.Y(y)]); if (j < L.length - 1 && L[j + 1][2] !== c) pts.push([A.X(j + 0.5), A.Y(y)]); });
    const p2 = []; L.forEach(([n, k, c], j) => { p2.push([A.X(j), A.Y(c === 3 ? 3 : c)]); });
    line(ctx, p2, col.s[0], 3); L.forEach(([n], j) => { dot(ctx, A.X(j), A.Y(p2.length ? (L[j][2] === 3 ? 3 : L[j][2]) : 0), j === i ? 7 : 3.5, j === i ? col.s[1] : col.s[0], col.panel); });
    ctx.save(); ctx.fillStyle = col.muted; ctx.font = '10px system-ui'; ctx.textAlign = 'right'; L.forEach(([n], j) => { ctx.save(); ctx.translate(A.X(j) + 3, A.B + 8); ctx.rotate(-Math.PI / 3.2); ctx.fillStyle = j === i ? col.ink : col.muted; ctx.font = (j === i ? '700 ' : '400 ') + '10px system-ui'; ctx.textAlign = 'right'; ctx.textBaseline = 'middle'; ctx.fillText(n.replace('After meiosis', 'End meiosis'), 0, 0); ctx.restore(); }); ctx.restore();
  };
  go();
}
