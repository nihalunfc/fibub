// Incremental load with a watermark: the source gets new and changed rows each day. A full reload copies everything every
// time; an incremental load copies only rows changed after the watermark (the latest timestamp already loaded). Try:
// Next day a few times, then "Re-run today" and see that a MERGE by key is safe to repeat while a blind APPEND adds duplicates.
import { canvas, text, row, choice, button, readout, title } from '../kit.js';
import { tbl } from './_data.js';

export default function (host) {
  let day = 1, wm = 0, mode = 'merge', src = [], dst = [], copied = 0, total = 0, id = 0;
  const cv = canvas(host, { aspect: 0.9, max: 460, min: 340, label: 'A source table, a watermark and a destination table after incremental loads' });
  const c1 = row(host); choice(c1, 'Write by', [['merge', 'MERGE on key'], ['append', 'Blind APPEND']], mode, (v) => { mode = v; });
  const c2 = row(host); button(c2, 'Next day (new rows arrive)', () => { next(); }); button(c2, 'Load changes', () => load()); button(c2, 'Re-run same load', () => load(true)); button(c2, 'Reset', () => reset());
  const out = readout(host);
  function reset() { day = 1; wm = 0; src = [[1, 'a', 1], [2, 'b', 1], [3, 'c', 1]]; id = 3; dst = []; copied = 0; total = 0; msg = 'Source has 3 rows from day 1. Watermark = 0: nothing loaded yet.'; draw(); }
  let msg = '';
  function next() { day++; id++; src.push([id, String.fromCharCode(96 + id), day]); const u = src[0]; u[1] = u[1].toUpperCase() === u[1] ? u[1].toLowerCase() : u[1].toUpperCase(); u[2] = day; msg = `Day ${day}: row ${id} is new and row 1 was edited (updated_at = ${day}).`; draw(); }
  function load(rerun) {
    const rows = rerun && lastBatch ? lastBatch : src.filter((r) => r[2] > wm); lastBatch = rows; copied = rows.length; total += copied;
    rows.forEach((r) => { if (mode === 'merge') { const k = dst.findIndex((d) => d[0] === r[0]); k >= 0 ? (dst[k] = r.slice()) : dst.push(r.slice()); } else dst.push(r.slice()); });
    if (!rerun) wm = Math.max(wm, ...rows.map((r) => r[2]), 0);
    msg = `${rerun ? 'Re-ran the same batch' : 'Loaded'} ${copied} row(s) (a full reload would copy ${src.length}). Watermark = ${wm}. Destination has ${dst.length} row(s)${dst.length > new Set(dst.map((d) => d[0])).size ? ', with DUPLICATE keys!' : ', one per key.'}`; draw();
  }
  let lastBatch = null;
  function draw() { out.innerHTML = msg; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, `Day ${day}. Watermark = ${wm}`, col);
    const cw = [w * 0.2, w * 0.2, w * 0.2];
    text(ctx, 'source (updated_at)', 10, 42, { color: col.muted, size: 11 });
    const y1 = tbl(ctx, col, 10, 50, ['id', 'val', 'updated'], src.map((r) => ({ c: r, bg: r[2] > wm ? col.soft : null, cc: r[2] > wm ? [col.s[0], col.s[0], col.s[0]] : null, bold: r[2] > wm })), cw, { rh: 16, size: 11 });
    text(ctx, 'blue = newer than the watermark: will be copied', 10, y1 + 11, { color: col.muted, size: 10 });
    const y2 = Math.max(y1 + 28, 160); text(ctx, 'destination', 10, y2, { color: col.muted, size: 11 });
    const dup = (r) => dst.filter((d) => d[0] === r[0]).length > 1;
    tbl(ctx, col, 10, y2 + 8, ['id', 'val', 'updated'], dst.slice(-8).map((r) => ({ c: r, cc: dup(r) ? [col.bad, col.bad, col.bad] : null, bg: dup(r) ? col.soft : null })), cw, { rh: 16, size: 11 });
    ctx.fillStyle = col.s[2]; ctx.fillRect(w * 0.68, 60, w * 0.3, 26); text(ctx, `copied ${total} rows in all`, w * 0.68 + w * 0.15, 73, { color: '#fff', size: 10.5, weight: 700, align: 'center' });
  };
  reset();
}
