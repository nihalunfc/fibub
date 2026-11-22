// Window functions with a sliding frame: for each row, the frame says which rows the function may see. Running total
// (start..here), moving average (last k rows), whole partition (OVER with no frame) and ROW_NUMBER / RANK / DENSE_RANK
// on ties. Try: press Play, resize the frame, and compare RANK and DENSE_RANK on the tied 20s.
import { canvas, text, row, choice, slider, readout, loop, title } from '../kit.js';
import { tbl } from './_data.js';

const V = [20, 35, 20, 50, 10, 35, 40, 15];
export default function (host) {
  let mode = 'run', k = 3, cur = 3;
  const cv = canvas(host, { aspect: 0.95, max: 460, min: 340, label: 'Bars with a window frame sliding over them, and the function result for the current row' });
  const c1 = row(host); choice(c1, 'Function', [['run', 'Running SUM'], ['mov', 'Moving AVG'], ['all', 'SUM OVER ()'], ['rank', 'RANK types']], mode, (v) => { mode = v; draw(); });
  const c2 = row(host);
  slider(c2, { label: 'Frame rows (moving)', min: 2, max: 5, step: 1, value: k, fmt: (v) => String(Math.round(v)), oninput: (v) => { k = Math.round(v); draw(); } });
  const sl = slider(c2, { label: 'Current row', min: 1, max: 8, step: 1, value: cur + 1, fmt: (v) => String(Math.round(v)), oninput: (v) => { cur = Math.round(v) - 1; draw(); } });
  const anim = loop(host, (dt, t) => { if (t - (anim.lt || 0) > 0.8) { anim.lt = t; cur = (cur + 1) % 8; sl.set(cur + 1); draw(); } }, { autoplay: false });
  anim.button(c2);
  const out = readout(host);
  const frame = () => (mode === 'run' ? [0, cur] : mode === 'mov' ? [Math.max(0, cur - k + 1), cur] : [0, 7]);
  function draw() {
    const [a, b] = frame(), vs = V.slice(a, b + 1), sum = vs.reduce((x, y) => x + y, 0);
    out.innerHTML = mode === 'rank' ? `Sorted high to low, tied values share a RANK (1,2,2,4: a gap) but DENSE_RANK has none (1,2,2,3); ROW_NUMBER just counts (1,2,3,4).`
      : `Row ${cur + 1} (value ${V[cur]}): frame = rows ${a + 1} to ${b + 1} → ${mode === 'mov' ? `AVG = ${(sum / vs.length).toFixed(1)}` : `SUM = ${sum}`}. ${mode === 'all' ? 'No frame: every row sees the whole partition, so every row shows the same number.' : 'Each row keeps its own line; a window never collapses rows the way GROUP BY does.'}`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    if (mode === 'rank') {
      title(ctx, 'RANK, DENSE_RANK and ROW_NUMBER on ties', col);
      const sorted = V.map((v, i) => [i + 1, v]).sort((x, y) => y[1] - x[1]);
      let rk = 0, dr = 0, prev = null;
      const rows = sorted.map((r, i) => { if (r[1] !== prev) { rk = i + 1; dr++; prev = r[1]; } return { c: [`row ${r[0]}`, r[1], i + 1, rk, dr], bg: r[1] === 20 || r[1] === 35 ? col.soft : null }; });
      tbl(ctx, col, 10, 44, ['row', 'value', 'ROW_NUMBER', 'RANK', 'DENSE'], rows, [w * 0.17, w * 0.16, w * 0.27, w * 0.18, w * 0.18], { rh: 24, size: 12 });
      text(ctx, 'Shaded rows are ties.', 10, 44 + 24 * 9 + 14, { color: col.muted, size: 11 });
      return;
    }
    title(ctx, { run: 'SUM(amount) OVER (ORDER BY day)', mov: `AVG(amount) OVER (ROWS ${k - 1} PRECEDING)`, all: 'SUM(amount) OVER ()' }[mode], col);
    const [a, b] = frame(), L = 28, bw = (w - L - 12) / 8, base = h - 56, sc = (base - 78) / 55;
    ctx.fillStyle = col.soft; ctx.fillRect(L + a * bw, 48, (b - a + 1) * bw, base - 48 + 6);
    V.forEach((v, i) => {
      const inF = i >= a && i <= b; ctx.fillStyle = i === cur ? col.s[1] : inF ? col.s[0] : col.line;
      ctx.fillRect(L + i * bw + 4, base - v * sc, bw - 8, v * sc);
      text(ctx, String(v), L + i * bw + bw / 2, base - v * sc - 8, { color: col.ink, size: 11, align: 'center', fit: false });
      text(ctx, 'd' + (i + 1), L + i * bw + bw / 2, base + 10, { color: col.muted, size: 10, align: 'center', fit: false });
    });
    ctx.strokeStyle = col.s[1]; ctx.lineWidth = 2; ctx.strokeRect(L + cur * bw + 1, 46, bw - 2, base - 46 + 8);
    text(ctx, 'frame', L + a * bw + 2, 43, { color: col.muted, size: 10, fit: false });
    const res = V.map((_, i) => { const lo = mode === 'run' ? 0 : mode === 'mov' ? Math.max(0, i - k + 1) : 0, hi = mode === 'all' ? 7 : i, s = V.slice(lo, hi + 1).reduce((x, y) => x + y, 0); return mode === 'mov' ? s / (hi - lo + 1) : s; });
    V.forEach((_, i) => text(ctx, mode === 'mov' ? res[i].toFixed(0) : String(res[i]), L + i * bw + bw / 2, base + 30, { color: i === cur ? col.s[1] : col.ink, size: 11, weight: i === cur ? 700 : 400, align: 'center', fit: false }));
    text(ctx, 'result column', 4, base + 46, { color: col.muted, size: 10 });
  };
  draw();
}
