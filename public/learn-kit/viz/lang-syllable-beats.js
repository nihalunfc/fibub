// Word stress game: each word is drawn as one dot per syllable. Tap the dot you think is stressed, then see the answer: the
// stressed syllable grows big. Use Hear it for your device's voice. Learn the pattern, not just the word: -tion and -ic
// words put the stress on the syllable just before the ending.
import { canvas, text, title, row, button, readout } from '../kit.js';
import { say } from './_lang.js';

// syllables, index of stressed one, rule
const W = [['ba·na·na', 1, 'Three syllables, stress in the middle.'], ['ed·u·ca·tion', 2, 'Words ending in -tion stress the syllable before it.'], ['e·co·no·mic', 2, 'Words ending in -ic stress the syllable before it.'], ['pho·to·graph', 0, 'The noun photograph is stressed on the first syllable...'], ['pho·to·gra·pher', 1, '...but photographer moves the stress to the second.'], ['im·por·tant', 1, 'Stress on the middle: im-POR-tant.'], ['com·fort·a·ble', 0, 'Usually said COMF-ta-ble: three beats, stress on the first.'], ['a·gree', 1, 'Most two-syllable verbs stress the second syllable.'], ['ta·ble', 0, 'Most two-syllable nouns stress the first syllable.'], ['de·ve·lop', 1, 'de-VE-lop: stress on the second syllable.']];
export default function (host) {
  let k = 0, ans = -1, right = 0, tried = 0, revealed = false;
  const cv = canvas(host, { aspect: 0.5, max: 200, min: 170, label: 'A word split into syllables; tap the stressed one' });
  const ctl = row(host), out = readout(host);
  const wordOf = () => W[k][0].split('·');
  const btnsRow = row(host);
  const draw = () => { btnsRow.innerHTML = ''; wordOf().forEach((s, i) => button(btnsRow, s, () => { if (revealed) return; ans = i; revealed = true; tried++; if (i === W[k][1]) right++; out.textContent = (i === W[k][1] ? 'Right! ' : `Not quite: it is "${wordOf()[W[k][1]].toUpperCase()}". `) + W[k][2] + ` Score ${right}/${tried}.`; cv.redraw(); })); cv.redraw(); };
  button(ctl, 'Next word', () => { k = (k + 1) % W.length; ans = -1; revealed = false; out.textContent = 'Tap the syllable you think is stressed.'; draw(); }, 'lk-primary');
  button(ctl, 'Hear it', () => { if (!say(W[k][0].replace(/·/g, ''))) out.textContent = 'This browser cannot read aloud. Say it and tap the beat.'; });
  cv.draw = (ctx, W2, H, col) => {
    title(ctx, 'Which syllable is stressed?', col);
    const s = wordOf(), n = s.length, cw = (W2 - 24) / n;
    s.forEach((syl, i) => {
      const cx = 12 + cw * (i + 0.5), st = revealed && i === W[k][1], r = st ? Math.min(34, cw * 0.42) : Math.min(18, cw * 0.28);
      ctx.fillStyle = revealed ? (st ? col.s[0] : col.s[7]) : col.line; ctx.beginPath(); ctx.arc(cx, 90, r, 0, 7); ctx.fill();
      if (revealed && i === ans) { ctx.strokeStyle = i === W[k][1] ? col.good : col.bad; ctx.lineWidth = 3; ctx.stroke(); }
      text(ctx, revealed && st ? syl.toUpperCase() : syl, cx, 90 + 48, { color: col.ink, size: 13, weight: st ? 800 : 500, align: 'center' });
    });
  };
  out.textContent = 'Tap the syllable you think is stressed.'; draw();
}
