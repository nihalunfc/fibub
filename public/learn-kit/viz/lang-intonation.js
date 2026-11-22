// Intonation curves: the voice goes up and down in a pattern that carries meaning. Pick a sentence type and Play: a dot
// travels along the pitch line while each word lights up. Falling means finished or sure; rising means a yes/no question or
// "more to come". Press Hear it to try your device's voice (it may not copy the pitch exactly).
import { canvas, text, title, row, choice, readout, loop, button } from '../kit.js';
import { say } from './_lang.js';

// pitch 0 (low) to 1 (high) per word
const M = {
  stmt: ['Statement', 'I live in Chennai.', [['I', 0.5], ['live', 0.55], ['in', 0.45], ['CHEN', 0.8], ['nai.', 0.15]], 'Falls at the end: finished, sure.'],
  yn: ['Yes/no question', 'Do you live in Chennai?', [['Do', 0.4], ['you', 0.35], ['live', 0.4], ['in', 0.35], ['CHEN', 0.6], ['nai?', 0.9]], 'Rises at the end: waiting for yes or no.'],
  wh: ['Wh- question', 'Where do you live?', [['WHERE', 0.85], ['do', 0.4], ['you', 0.35], ['LIVE?', 0.15]], 'Falls: it is a real question for information.'],
  list: ['A list', 'We bought rice, beans and oil.', [['We', 0.45], ['bought', 0.5], ['RICE,', 0.75], ['BEANS', 0.75], ['and', 0.4], ['OIL.', 0.12]], 'Rises on each item ("more to come") and falls on the last.'],
  unsure: ['Unsure or polite', 'Well, maybe on Friday?', [['Well,', 0.5], ['MAY', 0.7], ['be', 0.45], ['on', 0.4], ['FRI', 0.65], ['day?', 0.9]], 'A rise on a statement sounds uncertain.'],
};
export default function (host) {
  let k = 'stmt', t = 0;
  const cv = canvas(host, { aspect: 0.6, max: 240, min: 200, label: 'A pitch line over the words of a sentence' });
  const ctl = row(host), out = readout(host);
  choice(ctl, 'Sentence type', Object.keys(M).map((x) => [x, M[x][0]]), k, (v) => { k = v; t = 0; upd(); });
  const anim = loop(host, (dt) => { t = (t + dt * 0.4) % 1.25; cv.redraw(); });
  anim.button(ctl); button(ctl, 'Hear it', () => { if (!say(M[k][1])) out.textContent = 'This browser cannot read aloud. Say it yourself and follow the line.'; });
  const upd = () => { out.textContent = `"${M[k][1]}" ${M[k][3]}`; cv.redraw(); };
  cv.draw = (ctx, W, H, col) => {
    title(ctx, M[k][0] + ': ' + M[k][1], col);
    const w = M[k][2], n = w.length, X = (i) => 20 + (W - 40) * (i + 0.5) / n, Y = (p) => H - 52 - p * (H - 120);
    ctx.strokeStyle = col.line; ctx.lineWidth = 1; for (const p of [0, 0.5, 1]) { ctx.beginPath(); ctx.moveTo(10, Y(p)); ctx.lineTo(W - 10, Y(p)); ctx.stroke(); }
    ctx.strokeStyle = col.s[0]; ctx.lineWidth = 3; ctx.lineJoin = 'round'; ctx.beginPath();
    const pts = w.map(([, p], i) => [X(i), Y(p)]); ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < n; i++) { const mx = (pts[i - 1][0] + pts[i][0]) / 2; ctx.bezierCurveTo(mx, pts[i - 1][1], mx, pts[i][1], pts[i][0], pts[i][1]); }
    ctx.stroke();
    const pos = Math.min(1, t) * (n - 1), i0 = Math.min(n - 2, Math.floor(pos)), f = pos - i0, dx = pts[i0][0] + (pts[i0 + 1][0] - pts[i0][0]) * f, dy = pts[i0][1] + (pts[i0 + 1][1] - pts[i0][1]) * (f * f * (3 - 2 * f));
    ctx.fillStyle = col.s[5]; ctx.beginPath(); ctx.arc(dx, dy, 8, 0, 7); ctx.fill();
    w.forEach(([s], i) => text(ctx, s, X(i), H - 28, { color: Math.round(pos) === i ? col.s[5] : col.ink, size: 12.5, weight: Math.round(pos) === i ? 800 : 500, align: 'center' }));
    text(ctx, 'high', 12, Y(1) - 8, { color: col.muted, size: 10 }); text(ctx, 'low', 12, Y(0) + 9, { color: col.muted, size: 10 });
  };
  upd();
}
