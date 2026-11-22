// A transaction moves 100 from account A to B in two UPDATEs. Step through it, then try: crash after the first UPDATE
// with and without a transaction (all-or-nothing), and switch what a second reader sees (uncommitted data or only
// committed data). The total across both accounts should always read 700.
import { canvas, text, row, choice, readout, title } from '../kit.js';
import { stepper } from './_data.js';

const STEPS = ['start', 'BEGIN', 'UPDATE A: -100', 'UPDATE B: +100', 'COMMIT'];
export default function (host, opts) {
  let s = 0, tx = 'on', crash = 'no', iso = 'committed';
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 330, label: 'Two bank accounts, a transfer in two steps, and what a second reader sees' });
  const c1 = row(host); choice(c1, 'Transaction', [['on', 'BEGIN ... COMMIT'], ['off', 'Bare UPDATEs']], tx, (v) => { tx = v; draw(); });
  choice(c1, 'Crash after 1st UPDATE', [['no', 'No'], ['yes', 'Yes']], crash, (v) => { crash = v; draw(); });
  const c2 = row(host); choice(c2, 'Reader sees', [['committed', 'Committed only'], ['dirty', 'Uncommitted too']], iso, (v) => { iso = v; draw(); });
  const st = stepper(host, opts, STEPS, (i) => { s = i; draw(); });
  const out = readout(host);
  function state() {
    const crashed = crash === 'yes' && s >= 3; let A = 500, B = 200, rA = 500, rB = 200, note = '';
    if (s >= 2) A = 400; if (s >= 3 && !crashed) B = 300;
    if (tx === 'on') {
      if (crashed) { A = 500; B = 200; rA = 500; rB = 200; note = 'The crash rolled the whole transaction back: nothing changed.'; }
      else { rA = s >= 4 ? 400 : 500; rB = s >= 4 ? 300 : 200; if (iso === 'dirty') { rA = A; rB = B; } if (s === 4) note = 'COMMIT: both changes become visible together.'; }
    } else { rA = A; rB = B; if (crashed) note = 'Money vanished: A lost 100 and B never got it. Total is wrong.'; }
    return { A, B, rA, rB, crashed, note };
  }
  function draw() { const q = state(); out.innerHTML = `<b>${STEPS[s]}.</b> Total as the reader sees it: <b>${q.rA + q.rB}</b> (should be 700). ${q.note || (s === 3 && iso === 'dirty' ? 'A dirty read caught the transfer half done.' : '')}`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const q = state(); title(ctx, 'Transfer 100 from A to B', col);
    const box = (x, y, bw, nm, v, c, sub) => { ctx.fillStyle = col.soft; ctx.fillRect(x, y, bw, 58); ctx.strokeStyle = c; ctx.lineWidth = 2; ctx.strokeRect(x, y, bw, 58); text(ctx, nm, x + bw / 2, y + 14, { color: col.muted, size: 11, align: 'center', fit: false }); text(ctx, String(v), x + bw / 2, y + 36, { color: col.ink, size: 20, weight: 700, align: 'center', fit: false }); if (sub) text(ctx, sub, x + bw / 2, y + 52, { color: col.muted, size: 9.5, align: 'center', fit: false }); };
    const bw = (w - 40) / 2;
    text(ctx, 'The database', 10, 38, { color: col.muted, size: 11 });
    box(10, 46, bw, 'account A', q.A, q.A === 500 ? col.line : col.s[1], tx === 'on' && s >= 2 && s < 4 && !q.crashed ? 'not committed yet' : '');
    box(30 + bw, 46, bw, 'account B', q.B, q.B === 200 ? col.line : col.s[2], tx === 'on' && s === 3 && !q.crashed ? 'not committed yet' : '');
    text(ctx, 'A second reader asks for the balances', 10, 128, { color: col.muted, size: 11 });
    box(10, 136, bw, 'reader sees A', q.rA, col.s[0]); box(30 + bw, 136, bw, 'reader sees B', q.rB, col.s[0]);
    const tot = q.rA + q.rB, bad = tot !== 700;
    ctx.fillStyle = bad ? col.bad : col.good; ctx.fillRect(10, 208, w - 20, 26); text(ctx, `Reader's total: ${tot}  ${bad ? '(wrong)' : '(correct)'}`, w / 2, 221, { color: '#fff', size: 13, weight: 700, align: 'center' });
    STEPS.slice(1).forEach((n, i) => { const on = s === i + 1; ctx.globalAlpha = on ? 1 : s > i + 1 ? 0.6 : 0.35; text(ctx, `${i + 1}. ${n}${crash === 'yes' && i === 2 ? '   (crash here)' : ''}`, 14, 256 + i * 17, { color: on ? col.s[0] : col.ink, size: 11.5, weight: on ? 700 : 400 }); });
    ctx.globalAlpha = 1;
  };
  st.set(0); draw();
  return { step(i) { st.set(i); } };
}
