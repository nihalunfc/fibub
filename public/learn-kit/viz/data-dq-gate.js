// A data quality gate: rows stream past checks (not null, in range, unique id) and bad rows are quarantined instead of
// loaded. Set the allowed bad share; if more than that fails, the whole load stops. Try: switch checks on and off and
// watch which bad rows slip through; then lower the threshold so the gate stops the load. Rows are made up.
import { canvas, text, row, choice, slider, button, readout, loop, title } from '../kit.js';
import { tbl } from './_data.js';

const D = [[101, 'Asha', 34], [102, 'Ben', -5], [103, null, 41], [104, 'Dev', 29], [104, 'Dev', 29], [105, 'Esha', 250], [106, 'Farid', 38], [107, 'Gita', 31], [108, null, 27], [109, 'Hari', 45]];
export default function (host) {
  let on = { nn: true, rg: true, un: true }, thr = 25, scan = D.length;
  const cv = canvas(host, { aspect: 1.0, max: 460, min: 340, label: 'Rows passing three data quality checks, with bad rows quarantined' });
  const c1 = row(host);
  [['nn', 'name not null'], ['rg', 'age 0 to 120'], ['un', 'id unique']].forEach(([k, l]) => choice(c1, l, [[true, 'on'], [false, 'off']], true, (v) => { on[k] = v; draw(); }));
  const c2 = row(host); slider(c2, { label: 'stop if bad share >', min: 0, max: 60, step: 5, value: thr, fmt: (v) => Math.round(v) + '%', oninput: (v) => { thr = Math.round(v); draw(); } });
  const anim = loop(host, (dt) => { scan += dt * 3; if (scan > D.length + 1) { scan = D.length; anim.pause(); } draw(); }, { autoplay: false });
  button(c2, 'Run the checks', () => { scan = 0; anim.play(); });
  const out = readout(host);
  const fails = (r, i) => { const f = []; if (on.nn && r[1] === null) f.push('name is null'); if (on.rg && (r[2] < 0 || r[2] > 120)) f.push('age out of range'); if (on.un && D.findIndex((d) => d[0] === r[0]) !== i) f.push('duplicate id'); return f; };
  function draw() { const bad = D.filter((r, i) => fails(r, i).length).length, share = (bad / D.length) * 100, stop = share > thr; out.innerHTML = `<b>${bad} of ${D.length} rows fail (${share.toFixed(0)}%).</b> ${stop ? `That is above ${thr}%, so the gate <b>stops the load</b> and tells someone: the source is probably broken.` : `Under ${thr}%, so the ${D.length - bad} good rows load and ${bad} go to a quarantine table for a person to review.`} Turn a check off and bad rows slip through silently.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const bad = D.filter((r, i) => fails(r, i).length).length, stop = (bad / D.length) * 100 > thr;
    title(ctx, 'Rows pass the gate or go to quarantine', col);
    const rows = D.map((r, i) => { const f = fails(r, i), done = i < Math.floor(scan), b = f.length > 0; return { c: [r[0], r[1] === null ? 'NULL' : r[1], r[2], done ? (b ? f[0] : 'ok') : '.'], alpha: done && b ? 0.9 : 1, bg: done ? (b ? col.soft : null) : null, cc: [null, r[1] === null ? col.bad : null, r[2] < 0 || r[2] > 120 ? col.bad : null, done ? (b ? col.bad : col.good) : col.muted], bold: done && b }; });
    const y = tbl(ctx, col, 8, 40, ['id', 'name', 'age', 'check result'], rows, [w * 0.14, w * 0.2, w * 0.14, w * 0.44], { rh: 21, size: 11.5 });
    ctx.fillStyle = stop ? col.bad : col.good; ctx.fillRect(8, y + 10, w - 16, 26); text(ctx, stop ? 'GATE CLOSED: load stopped, alert sent' : `GATE OPEN: ${D.length - bad} rows loaded, ${bad} quarantined`, w / 2, y + 23, { color: '#fff', size: 12.5, weight: 700, align: 'center' });
  };
  draw();
}
