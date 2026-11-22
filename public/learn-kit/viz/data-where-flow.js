// WHERE as a row-by-row test: a scan line checks every row against your condition and keeps or drops it.
// Try: move the amount slider, then switch AND / OR / NOT with the status test and see which rows still pass.
import { canvas, text, row, choice, slider, readout, loop, title } from '../kit.js';
import { tbl } from './_data.js';

const D = [['A101', 'paid', 12], ['A102', 'paid', 45], ['A103', 'refund', 60], ['A104', 'paid', 38], ['A105', 'open', 75], ['A106', 'paid', 20], ['A107', 'refund', 41], ['A108', 'open', 18], ['A109', 'paid', 90], ['A110', 'paid', 41]];
export default function (host) {
  let t = 40, mode = 'amt', scan = D.length;
  const cv = canvas(host, { aspect: 1.1, max: 470, min: 330, label: 'Ten table rows tested one by one against a WHERE condition' });
  const c1 = row(host); choice(c1, 'Condition', [['amt', 'amount > t'], ['and', '... AND status = paid'], ['or', '... OR status = paid'], ['not', 'NOT (amount > t)']], mode, (v) => { mode = v; run(); });
  const c2 = row(host); slider(c2, { label: 't', min: 10, max: 90, step: 1, value: t, fmt: (v) => String(Math.round(v)), oninput: (v) => { t = Math.round(v); draw(); } });
  const anim = loop(host, (dt) => { scan += dt * 4; if (scan > D.length + 1.5) { anim.pause(); scan = D.length; } draw(); }, { autoplay: false });
  anim.button(c2);
  function run() { scan = 0; anim.play(); }
  const out = readout(host);
  const test = (r) => { const a = r[2] > t, s = r[1] === 'paid'; return mode === 'amt' ? a : mode === 'and' ? a && s : mode === 'or' ? a || s : !a; };
  function draw() {
    const kept = D.filter(test).length, sql = { amt: `amount > ${t}`, and: `amount > ${t} AND status = 'paid'`, or: `amount > ${t} OR status = 'paid'`, not: `NOT (amount > ${t})` }[mode];
    out.innerHTML = `<code>WHERE ${sql}</code> keeps <b>${kept}</b> of ${D.length} rows. Each row is judged alone, and the row with amount exactly ${t} is dropped by ">" (try t = 41).`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'WHERE tests every row on its own', col);
    const cw = [w * 0.2, w * 0.2, w * 0.15, w * 0.15, w * 0.15, w * 0.15];
    const rows = D.map((r, i) => {
      const done = i < Math.floor(scan), a = r[2] > t, s = r[1] === 'paid', ok = test(r);
      return { c: [r[0], r[1], r[2], done ? (a ? 'yes' : 'no') : '.', done ? (s ? 'yes' : 'no') : '.', done ? (ok ? 'KEEP' : 'drop') : '.'], alpha: done && !ok ? 0.35 : 1, bg: i === Math.floor(scan) ? col.soft : done && ok ? col.soft : null, cc: done ? [null, null, null, null, null, ok ? col.good : col.bad] : null, bold: done && ok };
    });
    tbl(ctx, col, 8, 40, ['order', 'status', 'amount', '>t?', 'paid?', 'result'], rows, cw, { rh: 22, size: 12 });
    text(ctx, 'Press Play to watch the scan.', 10, 40 + 22 * 11 + 14, { color: col.muted, size: 11 });
  };
  scan = D.length; draw();
}
