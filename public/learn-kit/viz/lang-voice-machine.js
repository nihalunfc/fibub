// Active to passive machine: pick a sentence and tense, then slide "Swap" to watch the object move to the front, the verb
// become be + past participle, and the doer move behind "by". Try the tenses: only the form of "be" changes.
import { canvas, text, row, choice, slider, readout, ease, lerp } from '../kit.js';

const SENT = { a: { S: 'The chef', O: 'the meal', v: ['cooks', 'cooked', 'will cook'], pp: 'cooked', by: 'the chef' }, b: { S: 'Workers', O: 'the bridge', v: ['build', 'built', 'will build'], pp: 'built', by: 'workers' }, c: { S: 'The teacher', O: 'the essays', v: ['marks', 'marked', 'will mark'], pp: 'marked', by: 'the teacher' } };
const BE = { a: (o) => (/s$/.test(o) ? 'are' : 'is'), b: (o) => (/s$/.test(o) ? 'were' : 'was'), c: () => 'will be' };
export default function (host) {
  let s = 'a', t = 0, k = 0;
  const cv = canvas(host, { aspect: 0.62, max: 280, min: 230, label: 'A sentence changing from active to passive' });
  const ctl = row(host);
  choice(ctl, 'Sentence', [['a', 'Chef'], ['b', 'Bridge'], ['c', 'Essays']], s, (v) => { s = v; cv.redraw(); upd(); });
  choice(ctl, 'Tense', [[0, 'Present'], [1, 'Past'], [2, 'Future']], k, (v) => { k = v; cv.redraw(); upd(); });
  slider(row(host), { label: 'Swap', min: 0, max: 1, step: 0.01, value: 0, oninput: (v) => { t = v; cv.redraw(); upd(); } });
  const out = readout(host);
  const A = () => SENT[s];
  const words = () => {
    const d = A(), pl = /s$/.test(d.O) && d.O !== 'the meal';
    const be = k === 2 ? 'will be' : k === 1 ? (pl ? 'were' : 'was') : (pl ? 'are' : 'is');
    return { act: [d.S, d.v[k], d.O], pas: [d.O, be + ' ' + d.pp, 'by ' + d.by] };
  };
  const upd = () => { const w = words(); out.textContent = t < 0.5 ? 'Active: ' + w.act.join(' ') + '. The doer comes first.' : 'Passive: ' + w.pas.join(' ') + '. The thing affected comes first; the doer is optional.'; };
  cv.draw = (ctx, W, H, col) => {
    const w = words(), e = ease(t);
    ctx.font = '600 15px system-ui'; const tw = (x) => ctx.measureText(x).width + 20;
    const place = (arr) => { const ws = arr.map(tw), tot = ws.reduce((a, b) => a + b, 0) + 10 * (arr.length - 1); let x = (W - tot) / 2; return arr.map((a, i) => { const c = x + ws[i] / 2; x += ws[i] + 10; return c; }); };
    const ax = place(w.act), px = place(w.pas);
    const roles = [['Doer', col.s[0]], ['Verb', col.s[1]], ['Receiver', col.s[2]]];
    // active order: doer, verb, receiver. passive order: receiver, verb, doer
    const idx = [[0, 2], [1, 1], [2, 0]];
    text(ctx, t < 0.5 ? 'ACTIVE' : 'PASSIVE', 10, 18, { color: col.ink, size: 12.5, weight: 700 });
    idx.forEach(([from, to], r) => {
      const x = lerp(ax[from], px[to], e), y = H / 2 - 10 + (r === 1 ? 0 : (r === 0 ? -1 : 1) * Math.sin(Math.PI * e) * 44);
      const lab = t < 0.5 ? w.act[from] : w.pas[to];
      ctx.font = '600 15px system-ui'; const wd = ctx.measureText(lab).width + 18;
      ctx.fillStyle = roles[r][1]; ctx.globalAlpha = 0.22; ctx.fillRect(x - wd / 2, y - 18, wd, 36); ctx.globalAlpha = 1;
      ctx.strokeStyle = roles[r][1]; ctx.lineWidth = 2; ctx.strokeRect(x - wd / 2, y - 18, wd, 36);
      text(ctx, lab, x, y, { color: col.ink, size: 15, weight: 600, align: 'center' });
      text(ctx, roles[r][0], x, y + 28, { color: roles[r][1], size: 11, weight: 700, align: 'center' });
    });
    text(ctx, t < 0.5 ? 'Doer + verb + receiver' : 'Receiver + be + past participle + by + doer', W / 2, H - 16, { color: col.muted, size: 12, align: 'center' });
  };
  cv.redraw(); upd();
}
