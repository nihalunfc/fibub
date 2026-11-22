// Connected speech: in natural speech the words you see written are not the chunks you hear. Pick a phrase and slide
// "Speed" from careful to natural: the gaps between words close and the sounds re-group ("turn it off" becomes "tur-ni-toff").
// Press Hear it to listen with your device's voice at a natural pace.
import { canvas, text, title, row, choice, slider, readout, button, lerp } from '../kit.js';
import { say } from './_lang.js';

// words, heard chunks (each chunk = which letters belong), note
const P = {
  off: ['turn it off', ['tur', 'ni', 'toff'], 'The final sound of a word moves onto the next word when that starts with a vowel.', 'turn it off'],
  an: ['an apple a day', ['a', 'na', 'ppl', 'e', 'day'], '"an" joins "apple": a-napple.', 'an apple a day'],
  gonna: ['going to leave', ['gon', 'na', 'leave'], 'Common reductions: going to becomes "gonna". Understand it; write the full form in exams.', 'going to leave'],
  last: ['last night', ['las', 'night'], 'The t is often dropped between two consonants.', 'last night'],
  what: ['what do you want', ['wha', 'dyu', 'wan'], 'Several small sounds merge: "whaddya want".', 'what do you want'],
};
export default function (host) {
  let k = 'off', v = 0;
  const cv = canvas(host, { aspect: 0.62, max: 240, min: 225, label: 'Written words and the chunks you actually hear' });
  const ctl = row(host), out = readout(host);
  choice(ctl, 'Phrase', Object.keys(P).map((x) => [x, P[x][0]]), k, (x) => { k = x; upd(); });
  const row2 = row(host);
  slider(row2, { label: 'Speed', min: 0, max: 1, step: 0.01, value: 0, fmt: (x) => (x < 0.33 ? 'careful' : x < 0.7 ? 'normal' : 'natural'), oninput: (x) => { v = x; cv.redraw(); } });
  button(row2, 'Hear it', () => { if (!say(P[k][3], 'en-GB', 1)) out.textContent = 'This browser cannot read aloud. Say the phrase fast and notice where it joins.'; });
  const upd = () => { out.textContent = P[k][2]; cv.redraw(); };
  cv.draw = (ctx, W, H, col) => {
    title(ctx, 'Written (top) and heard (bottom)', col);
    const words = P[k][0].split(' '), chunks = P[k][1];
    ctx.font = '600 17px system-ui'; const ws = words.map((w) => ctx.measureText(w).width + 14), gap = lerp(16, 0, v), tot = ws.reduce((a, b) => a + b, 0) + gap * (words.length - 1);
    let x = (W - tot) / 2; const y1 = 66;
    words.forEach((w, i) => { ctx.fillStyle = col.s[i % 4]; ctx.globalAlpha = 0.25; ctx.fillRect(x, y1 - 18, ws[i], 36); ctx.globalAlpha = 1; ctx.strokeStyle = col.s[i % 4]; ctx.lineWidth = 2; ctx.strokeRect(x, y1 - 18, ws[i], 36); text(ctx, w, x + ws[i] / 2, y1, { color: col.ink, size: 17, weight: 600, align: 'center', fit: false }); x += ws[i] + gap; });
    const a = Math.max(0, (v - 0.3) / 0.7), cw = (W - 40) / chunks.length;
    ctx.globalAlpha = 0.25 + a * 0.75;
    chunks.forEach((c, i) => { const cx = 20 + cw * (i + 0.5); ctx.fillStyle = col.s[4]; ctx.globalAlpha = 0.15 + a * 0.5; ctx.beginPath(); ctx.roundRect(cx - cw / 2 + 3, 128, cw - 6, 40, 8); ctx.fill(); ctx.globalAlpha = 0.3 + a * 0.7; text(ctx, c, cx, 148, { color: col.ink, size: 16, weight: 700, align: 'center' }); });
    ctx.globalAlpha = 1;
    text(ctx, a > 0.5 ? 'What your ear gets' : 'Careful speech: the written gaps are heard', W / 2, H - 14, { color: col.muted, size: 12, align: 'center' });
  };
  upd();
}
