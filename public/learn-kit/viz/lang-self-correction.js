// Listening trap: speakers change their mind. Press Play: the sentence appears word by word like a speaker talking, then
// pick the answer you would write. The first thing said is often crossed out by "sorry" or "I mean"; the last version wins.
// Hear it uses your device's voice if it has one; nothing is recorded or sent.
import { canvas, text, title, row, choice, readout, loop, button } from '../kit.js';
import { box, say, chip } from './_lang.js';

const Q = [
  { q: 'Which day is the meeting?', say: 'The meeting is on Tuesday. Oh, sorry, no, Wednesday at three.', ans: 'Wednesday', opts: ['Tuesday', 'Wednesday', 'Thursday'], bad: 'Tuesday', cue: 'sorry, no' },
  { q: 'How many people are coming?', say: 'We booked for twelve. Actually, I mean fourteen, two more just confirmed.', ans: 'fourteen', opts: ['twelve', 'fourteen', 'two'], bad: 'twelve', cue: 'Actually, I mean' },
  { q: 'Where do they meet?', say: 'Meet at the station. Hold on, the north gate is better, meet at the north gate.', ans: 'north gate', opts: ['station', 'north gate', 'library'], bad: 'station', cue: 'Hold on' },
];
export default function (host) {
  let k = 0, t = 0, picked = null;
  const cv = canvas(host, { aspect: 0.4, max: 170, min: 150, label: 'A speaker\'s sentence appearing word by word' });
  const ctl = row(host), qEl = box(host, 'font-weight:600;font-size:14px;margin:6px 0;'), pool = box(host), out = readout(host);
  choice(ctl, 'Clip', Q.map((_, i) => [i, 'Clip ' + (i + 1)]), k, (v) => { k = v; reset(); });
  const anim = loop(host, (dt) => { t += dt * 2.6; cv.redraw(); }, { autoplay: false });
  button(ctl, 'Play', () => { t = 0; anim.play(); }, 'lk-primary'); button(ctl, 'Hear it', () => { if (!say(Q[k].say, 'en-GB', 0.95)) out.textContent = 'This browser cannot read aloud; watch the words appear instead.'; });
  const reset = () => { t = 0; picked = null; anim.pause(); qEl.textContent = 'Question: ' + Q[k].q; pool.innerHTML = ''; Q[k].opts.forEach((o) => chip(pool, o, () => { picked = o; out.textContent = o === Q[k].ans ? `Correct: "${Q[k].ans}". The speaker changed their mind after "${Q[k].cue}".` : `Not quite. "${o}" was said first but then corrected after "${Q[k].cue}". The answer is "${Q[k].ans}".`; cv.redraw(); })); out.textContent = 'Press Play, then pick your answer.'; cv.redraw(); };
  cv.draw = (ctx, W, H, col) => {
    title(ctx, 'The speaker says...', col);
    const words = Q[k].say.split(' '), n = Math.min(words.length, Math.floor(t)), lineW = W - 28; let x = 14, y = 56;
    ctx.font = '500 15px system-ui';
    let crossed = false; const key = Q[k].bad;
    words.forEach((w, i) => {
      if (i >= n) return; const wd = ctx.measureText(w + ' ').width; if (x + wd > 14 + lineW) { x = 14; y += 26; }
      const isBad = w.replace(/[.,]/g, '') === key, isCue = Q[k].cue.split(' ').some((c) => c.replace(/,/g, '') === w.replace(/[.,]/g, '')) && i > 3;
      const showAns = n >= words.length && (picked || n >= words.length);
      text(ctx, w, x, y, { color: isBad && n >= words.length ? col.muted : col.ink, size: 15, weight: isCue ? 700 : 500, fit: false });
      if (isBad && n >= words.length) { ctx.strokeStyle = col.bad; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + wd - 4, y); ctx.stroke(); }
      if (w.replace(/[.,]/g, '') === Q[k].ans.split(' ')[0] && n >= words.length) { ctx.strokeStyle = col.good; ctx.lineWidth = 2; ctx.strokeRect(x - 2, y - 11, wd, 22); }
      x += wd;
    });
    if (n >= words.length) text(ctx, 'Struck out = first answer, boxed = final answer', 14, H - 12, { color: col.muted, size: 11 });
  };
  reset();
}
