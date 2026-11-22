// Class 9 Propositions: a sorting game. A statement is a sentence that is definitely true or definitely false (not both, not neither).
// Questions, commands, opinions and sentences with an unknown letter are not statements. Choose True, False or Not a statement.
import { canvas, text, title, row, button, readout, font } from '../../kit.js';

const S = [
  ['Delhi is the capital of India.', 'T', 'It is a fact that can be checked: true.'],
  ['Is it going to rain today?', 'N', 'A question has no true or false answer: not a statement.'],
  ['The sum of the angles of a triangle is 190°.', 'F', 'It is a clear claim, and it is false (the sum is 180°). A false sentence is still a statement.'],
  ['Please close the door.', 'N', 'A request or command is not true or false.'],
  ['x + 5 = 9', 'N', 'Until we know x, we cannot say true or false. This is an open sentence, not a statement.'],
  ['Every prime number is odd.', 'F', 'It is false: 2 is prime and even. One example is enough to show it is false.'],
  ['Mango is the tastiest fruit.', 'N', 'Taste is an opinion. People disagree, so it is not definitely true or false.'],
  ['7 × 8 = 56', 'T', 'True: 7 × 8 = 56.'],
  ['What a lovely sunset!', 'N', 'An exclamation shows feeling: not a statement.'],
  ['The Ganga flows through Kerala.', 'F', 'False. It flows through north India. Still a statement.'],
  ['A square has four equal sides.', 'T', 'True by the definition of a square.'],
  ['For every real number x, x² ≥ 0.', 'T', 'True: a square is never negative. “For every” makes the claim definite.'],
  ['The number 15 is a prime number.', 'F', 'False: 15 = 3 × 5. It is a clear claim, so it is a statement.'],
  ['All triangles have three sides.', 'T', 'True by definition.'],
];
const wrap = (ctx, s, maxW, size) => { ctx.font = font(size, 700); const o = []; let c = ''; for (const w of s.split(' ')) { const t = c ? c + ' ' + w : w; if (ctx.measureText(t).width > maxW && c) { o.push(c); c = w; } else c = t; } o.push(c); return o; };
export default function (host) {
  let i = 0, score = 0, tries = 0, ans = null;
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 280, label: 'A card with a sentence to sort into true, false, or not a statement' });
  const c1 = row(host);
  const ask = (k) => { if (ans !== null) return; ans = k; tries++; if (k === S[i][1]) score++; upd(); };
  button(c1, 'True', () => ask('T')); button(c1, 'False', () => ask('F')); button(c1, 'Not a statement', () => ask('N'));
  const c2 = row(host); button(c2, 'Next card', () => { if (ans === null) return; i = (i + 1) % S.length; ans = null; upd(); });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, 'Sort the sentence · score ' + score + ' / ' + tries, col);
    const x = 14, y = t + 14, cw = w - 28, ch = h * 0.46;
    ctx.save(); ctx.fillStyle = col.panel; ctx.strokeStyle = col.line; ctx.lineWidth = 2; ctx.fillRect(x, y, cw, ch); ctx.strokeRect(x, y, cw, ch); ctx.restore();
    const lines = wrap(ctx, S[i][0], cw - 24, 15);
    lines.forEach((l, k) => text(ctx, l, w / 2, y + ch / 2 + (k - (lines.length - 1) / 2) * 22, { color: col.ink, size: 15, weight: 700, align: 'center' }));
    const lab = { T: 'True statement', F: 'False statement', N: 'Not a statement' };
    if (ans !== null) {
      const ok = ans === S[i][1];
      text(ctx, ok ? 'Correct: ' + lab[S[i][1]] : 'Not quite: it is a ' + lab[S[i][1]].toLowerCase(), w / 2, y + ch + 22, { color: ok ? col.s[2] : col.s[6], size: 14, weight: 700, align: 'center' });
      wrap(ctx, S[i][2], w - 30, 11).forEach((l, k) => text(ctx, l, w / 2, y + ch + 44 + k * 15, { color: col.muted, size: 11, align: 'center' }));
    } else text(ctx, 'Is it definitely true, definitely false, or not a statement?', w / 2, y + ch + 22, { color: col.muted, size: 11.5, align: 'center' });
  };
  function upd() { out.innerHTML = ans === null ? 'Card ' + (i + 1) + ' of ' + S.length + '. Pick one of the three buttons.' : S[i][2] + ' Press <b>Next card</b>.'; cv.redraw(); }
  upd();
}
