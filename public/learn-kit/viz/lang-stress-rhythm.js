// English rhythm: stressed syllables fall on a steady beat, and the small words in between are squeezed to fit. Pick a
// sentence (each has three stressed syllables) and Play: the ball lands on every stressed syllable at the same spacing,
// however many small syllables sit between. Tall blocks are stressed, short ones are weak.
import { canvas, text, title, row, choice, readout, loop, button } from '../kit.js';
import { say } from './_lang.js';

// [syllable, stressed]
const S = {
  a: ['Cats chase mice.', [['CATS', 1], ['CHASE', 1], ['MICE', 1]]],
  b: ['The cats will chase the mice.', [['the', 0], ['CATS', 1], ['will', 0], ['CHASE', 1], ['the', 0], ['MICE', 1]]],
  c: ['The cats have been chasing the mice.', [['the', 0], ['CATS', 1], ['have', 0], ['been', 0], ['CHAS', 1], ['ing', 0], ['the', 0], ['MICE', 1]]],
};
export default function (host) {
  let k = 'b', t = 0;
  const cv = canvas(host, { aspect: 0.6, max: 250, min: 210, label: 'Syllables of a sentence on a steady beat' });
  const ctl = row(host), out = readout(host);
  choice(ctl, 'Sentence', [['a', 'Short'], ['b', 'Medium'], ['c', 'Long']], k, (v) => { k = v; t = 0; upd(); });
  const anim = loop(host, (dt) => { t += dt * 0.9; cv.redraw(); });
  anim.button(ctl); button(ctl, 'Hear it', () => { if (!say(S[k][0])) out.textContent = 'This browser cannot read aloud. Tap the beat on the table instead.'; });
  const upd = () => { const n = S[k][1].length; out.textContent = `${n} syllables, 3 beats. The weak syllables get shorter as more of them squeeze between the beats: this is why fast English drops "have", "been" and "the" to almost nothing.`; cv.redraw(); };
  cv.draw = (ctx, W, H, col) => {
    title(ctx, S[k][0], col);
    const sy = S[k][1], beats = sy.map((s, i) => [s, i]).filter(([s]) => s[1]).map(([, i]) => i), nb = beats.length;
    const x0 = 16, bw = W - 32, bx = (b) => x0 + (bw - 8) * (b + 1.0) / (nb + 0.5);
    // x position of every syllable: stressed on the beat, weak ones spread evenly between beats
    const pos = sy.map((s, i) => {
      const b = beats.indexOf(i); if (b >= 0) return bx(b);
      const next = beats.findIndex((j) => j > i), prev = next < 0 ? nb - 1 : next - 1, lo = prev < 0 ? x0 - bw / nb * 0.0 : bx(prev), hi = next < 0 ? W - 10 : bx(next);
      const group = sy.map((q, j) => [q, j]).filter(([q, j]) => !q[1] && (prev < 0 ? j < beats[0] : j > beats[prev]) && (next < 0 ? true : j < beats[next])), r = group.findIndex(([, j]) => j === i);
      const l0 = prev < 0 ? 14 : lo, h0 = hi;
      return l0 + (h0 - l0) * (r + 1) / (group.length + 1);
    });
    const base = H * 0.74, cur = (t % nb), curB = Math.floor(cur), fr = cur - curB;
    ctx.strokeStyle = col.line; ctx.lineWidth = 1; for (let b = 0; b < nb; b++) { ctx.beginPath(); ctx.moveTo(bx(b), 34); ctx.lineTo(bx(b), base); ctx.stroke(); }
    sy.forEach((s, i) => { const h = s[1] ? 54 : 22, w = s[1] ? 46 : 28; ctx.fillStyle = s[1] ? col.s[0] : col.s[7]; ctx.globalAlpha = s[1] ? 0.9 : 0.55; ctx.fillRect(pos[i] - w / 2, base - h, w, h); ctx.globalAlpha = 1; text(ctx, s[0], pos[i], base - h / 2, { color: s[1] ? '#fff' : col.ink, size: s[1] ? 12 : 10.5, weight: s[1] ? 700 : 400, align: 'center', fit: false }); });
    const bxp = bx(curB), nxp = curB + 1 < nb ? bx(curB + 1) : bx(0), y = base - 76 - Math.sin(Math.PI * fr) * 36;
    const bxx = curB + 1 < nb ? bxp + (nxp - bxp) * fr : bxp + (bx(nb - 1) - bx(nb - 2 < 0 ? 0 : nb - 2)) * fr * 0;
    ctx.fillStyle = col.s[5]; ctx.beginPath(); ctx.arc(bxx, y, 8, 0, 7); ctx.fill();
    text(ctx, 'beat ' + (curB + 1), bxp, base + 16, { color: col.muted, size: 11, weight: 700, align: 'center' });
  };
  upd();
}
