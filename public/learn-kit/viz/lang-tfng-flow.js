// True / False / Not Given as a two-question flow: first "does the passage say anything about this?", then "does it agree?".
// Read the short made-up passage, pick a statement, answer the questions by tapping, and see the verdict and the evidence.
import { row, choice, button, readout, canvas, text, title } from '../kit.js';
import { box, CARD, chip } from './_lang.js';

const P = 'The city library opened in 1998 and has 40,000 books. It is open every day except Sunday. Students can borrow up to five books at a time for two weeks. Last year the library added a quiet room for exams.';
const S = [
  ['The library opened more than twenty years ago.', 'T', 'Opened in 1998; that is more than twenty years before now.'],
  ['The library is open every day of the week.', 'F', '"Every day except Sunday" contradicts "every day of the week".'],
  ['Students may borrow ten books at once.', 'F', 'The passage says five at a time.'],
  ['Borrowing books is free for students.', 'N', 'The passage never mentions cost, so it is Not Given.'],
  ['The exam room was added last year.', 'T', 'It says a quiet room for exams was added last year.'],
  ['Most students prefer the quiet room.', 'N', 'No opinion of students is given.'],
];
export default function (host) {
  let k = 0, stage = 0, said = null;
  let path = [], res = null;
  const cv = canvas(host, { aspect: 0.75, max: 250, min: 235, label: 'Flow chart: does the passage mention it, and does it agree?' });
  cv.draw = (ctx, W, H, col) => {
    title(ctx, 'Decision flow', col);
    const B = (x, y, w, h, t, on, c) => { ctx.fillStyle = on ? c : col.bg; ctx.globalAlpha = on ? 0.3 : 1; ctx.fillRect(x - w / 2, y - h / 2, w, h); ctx.globalAlpha = 1; ctx.strokeStyle = on ? c : col.line; ctx.lineWidth = on ? 2.5 : 1.5; ctx.strokeRect(x - w / 2, y - h / 2, w, h); text(ctx, t, x, y, { color: col.ink, size: 11.5, weight: 600, align: 'center' }); };
    const bw = Math.min(150, W * 0.42), cx = W * 0.3, rx = W * 0.74;
    B(cx, 52, bw, 38, 'Does it say anything?', true, col.s[0]);
    B(rx, 52, bw * 0.8, 34, 'NOT GIVEN', path[0] === 'no', col.s[1]);
    B(cx, 128, bw, 38, 'Does it match?', path[0] === 'yes' || path[1], col.s[0]);
    B(cx - bw * 0.1, H - 24, bw * 0.7, 30, 'TRUE', path[1] === 'T', col.s[2]);
    B(rx, 128, bw * 0.8, 34, 'FALSE', path[1] === 'F', col.s[5]);
    const ar = (a, b, c, d) => { ctx.strokeStyle = col.muted; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(a, b); ctx.lineTo(c, d); ctx.stroke(); };
    ar(cx + bw / 2, 52, rx - bw * 0.4, 52); text(ctx, 'no', (cx + rx) / 2 + 4, 40, { color: col.muted, size: 11, align: 'center' });
    ar(cx, 71, cx, 109); text(ctx, 'yes', cx + 14, 90, { color: col.muted, size: 11 });
    ar(cx + bw / 2, 128, rx - bw * 0.4, 128); text(ctx, 'contradicts', (cx + rx) / 2 + 6, 112, { color: col.muted, size: 10.5, align: 'center' });
    ar(cx, 147, cx, H - 39); text(ctx, 'matches', cx + 6, 163, { color: col.muted, size: 10.5 });
  };
  const pass = box(host, CARD + 'font-size:13.5px;', 'Passage: ' + P);
  const st = box(host, CARD + 'font-weight:600;');
  const flow = box(host, 'margin:4px 0;');
  const out = readout(host);
  const ctl = row(host);
  button(ctl, 'Next statement', () => { k = (k + 1) % S.length; stage = 0; draw(); });
  function ask(q, opts) { flow.innerHTML = ''; box(flow, 'font-weight:600;margin:4px 0;font-size:14px;', q); opts.forEach(([t, f]) => chip(flow, t, f)); }
  function verdict(v) {
    path = v === 'N' ? ['no'] : ['yes', v]; cv.redraw();
    const ok = v === S[k][1], name = { T: 'True', F: 'False', N: 'Not Given' };
    out.textContent = (ok ? 'Right: ' : 'Not quite. The answer is ' + name[S[k][1]] + '. ') + name[S[k][1]] + ' because ' + S[k][2].charAt(0).toLowerCase() + S[k][2].slice(1);
    flow.innerHTML = ''; box(flow, 'font-weight:700;color:' + (ok ? 'var(--good)' : 'var(--bad)'), (ok ? '✓ ' : '✗ ') + 'You said ' + name[v]);
  }
  function draw() {
    path = []; cv.redraw();
    st.textContent = 'Statement ' + (k + 1) + ' of ' + S.length + ': ' + S[k][0];
    out.textContent = 'Step 1: look for the place in the passage that talks about this.';
    ask('1. Does the passage say anything about this point?', [['Yes, it says something', () => ask('2. Does what it says match the statement?', [['It matches', () => verdict('T')], ['It contradicts', () => verdict('F')]])], ['No, it is silent', () => verdict('N')]]);
  }
  draw();
}
